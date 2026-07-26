#!/usr/bin/env node

import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const REVIEWS_PATH = path.join(ROOT, "data", "reviews.json");
const META_PATH = path.join(ROOT, "data", "reviews-meta.json");
const REVIEW_ASSET_DIR = path.join(ROOT, "assets", "reviews");
const ENV_PATH = path.join(ROOT, ".env");
const FALLBACK_ENV_PATH = path.join(ROOT, "..", ".env");
const LISTING_GENERATOR_ENV_PATH = path.join(ROOT, "..", "listing-generator", ".env");

loadDotEnv();

const API_KEY = buildApiKeyHeader();
const SHOP_ID = process.env.ETSY_SHOP_ID;

main().catch((error) => {
  console.error("[reviews:update] Abbruch:", error.message);
  process.exitCode = 1;
});

async function main() {
  if (!API_KEY || !SHOP_ID) {
    console.log("[reviews:update] ETSY_API_KEY und ETSY_SHOP_ID sind nicht gesetzt.");
    console.log("[reviews:update] Keine Dateien geändert. Bitte data/reviews.json und data/reviews-meta.json manuell pflegen.");
    return;
  }

  if (typeof fetch !== "function") {
    throw new Error("Dieses Script benötigt Node.js 18+ mit globalem fetch.");
  }

  const existingMeta = await readJson(META_PATH, {});
  const existingReviews = await readJson(REVIEWS_PATH, []);

  const resolvedShopId = await resolveShopId(SHOP_ID);
  const shop = await fetchEtsyJson(`https://api.etsy.com/v3/application/shops/${encodeURIComponent(resolvedShopId)}`);
  const reviews = await fetchShopReviews(resolvedShopId);
  const nextMeta = buildMetaFromShop(existingMeta, shop);

  if (!nextMeta) {
    console.log("[reviews:update] Die Etsy-API-Antwort enthält keine verlässlichen Review-Metadaten.");
    console.log("[reviews:update] Keine Dateien geändert. Bitte Bewertungsanzahl und Durchschnitt manuell prüfen.");
    return;
  }

  await writeJson(META_PATH, nextMeta);
  const syncedImages = await syncPermissionedReviewImages(reviews, existingReviews);
  if (syncedImages.updated) {
    await writeJson(REVIEWS_PATH, syncedImages.reviews);
  }
  console.log("[reviews:update] data/reviews-meta.json wurde mit Etsy-Metadaten aktualisiert.");
  console.log(`[reviews:update] ${reviews.length} Bewertungen geprüft, ${reviews.filter(hasReviewImage).length} davon mit Käuferfoto.`);
  console.log(`[reviews:update] ${syncedImages.count} freigegebene Käuferfoto(s) lokal synchronisiert.`);
}

async function resolveShopId(shopIdOrName) {
  if (/^\d+$/.test(String(shopIdOrName))) {
    return String(shopIdOrName);
  }

  const response = await fetchEtsyJson(`https://api.etsy.com/v3/application/shops?shop_name=${encodeURIComponent(shopIdOrName)}&limit=100`);
  const shops = Array.isArray(response.results) ? response.results : [];
  const exact = shops.find((shop) => String(shop.shop_name || "").toLowerCase() === String(shopIdOrName).toLowerCase());

  if (!exact || !exact.shop_id) {
    throw new Error(`Etsy-Shop "${shopIdOrName}" konnte nicht eindeutig aufgelöst werden.`);
  }

  return String(exact.shop_id);
}

async function fetchShopReviews(shopId) {
  const reviews = [];
  const limit = 100;
  let offset = 0;

  while (true) {
    const data = await fetchEtsyJson(`https://api.etsy.com/v3/application/shops/${encodeURIComponent(shopId)}/reviews?limit=${limit}&offset=${offset}`);
    const batch = Array.isArray(data.results) ? data.results : [];
    reviews.push(...batch);
    offset += batch.length;

    if (!batch.length || !Number.isFinite(Number(data.count)) || offset >= Number(data.count)) {
      return reviews;
    }
  }
}

function hasReviewImage(review) {
  return Boolean(review && String(review.image_url_fullxfull || "").trim());
}

async function syncPermissionedReviewImages(apiReviews, existingReviews) {
  if (!Array.isArray(existingReviews) || !existingReviews.length) {
    return { reviews: existingReviews, count: 0, updated: false };
  }

  await fs.mkdir(REVIEW_ASSET_DIR, { recursive: true });
  let count = 0;
  let updated = false;

  const reviews = await Promise.all(existingReviews.map(async (review) => {
    const normalizedText = normalizeReviewText(review.text);
    const apiReview = apiReviews.find((candidate) => {
      const candidateText = normalizeReviewText(candidate && candidate.review);
      return candidateText && normalizedText &&
        (candidateText === normalizedText || candidateText.startsWith(normalizedText.slice(0, 90)));
    });

    if (!apiReview || !hasReviewImage(apiReview)) {
      return review;
    }

    const fileName = `${safeFileName(review.id)}.jpg`;
    const assetPath = path.join(REVIEW_ASSET_DIR, fileName);
    const publicPath = `/assets/reviews/${fileName}`;
    if (!fsSync.existsSync(assetPath)) {
      await downloadReviewImage(apiReview.image_url_fullxfull, assetPath);
    }
    count += 1;

    if (review.image !== publicPath) {
      updated = true;
    }

    return {
      ...review,
      image: publicPath,
      imageAlt: `Käuferfoto zur Etsy-Bewertung von ${review.reviewerName || "einem Etsy-Kunden"}`
    };
  }));

  return { reviews, count, updated };
}

async function downloadReviewImage(url, targetPath) {
  const response = await fetch(url, { headers: { Accept: "image/*" } });
  if (!response.ok) {
    throw new Error(`Käuferfoto konnte nicht geladen werden (${response.status}).`);
  }

  await fs.writeFile(targetPath, Buffer.from(await response.arrayBuffer()));
}

function normalizeReviewText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function safeFileName(value) {
  return String(value || "etsy-review")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function fetchEtsyJson(url) {
  const headers = {
    "x-api-key": API_KEY,
    "Accept": "application/json"
  };

  const response = await fetch(url, { headers });
  const text = await response.text();

  if (!response.ok) {
    const detail = text ? ` Etsy-Antwort: ${text.slice(0, 240)}` : "";
    throw new Error(`Etsy API ${response.status} für ${url}.${detail}`);
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error("Etsy API hat keine gültige JSON-Antwort geliefert.");
  }
}

function buildMetaFromShop(existingMeta, shop) {
  const ratingAverage = numberFromFirstDefined(
    shop.review_average,
    shop.reviewAverage,
    shop.rating_average,
    shop.ratingAverage
  );
  const ratingCount = numberFromFirstDefined(
    shop.review_count,
    shop.reviewCount,
    shop.rating_count,
    shop.ratingCount
  );

  if (!isRating(ratingAverage) || !Number.isFinite(ratingCount) || ratingCount < 0) {
    return null;
  }

  return {
    source: existingMeta.source || "Etsy",
    shopName: existingMeta.shopName || shop.shop_name || shop.shopName || "Edle Hölzer",
    ratingAverage,
    ratingCount: Math.round(ratingCount),
    transactionSoldCount: Math.max(0, Math.round(numberFromFirstDefined(
      shop.transaction_sold_count,
      shop.transactionSoldCount
    ) || 0)),
    lastUpdated: new Date().toISOString().slice(0, 10),
    sourceUrl: existingMeta.sourceUrl || `https://www.etsy.com/shop/${shop.shop_name || ""}#reviews`,
    updateMode: "api",
    needsReview: false
  };
}

function buildApiKeyHeader() {
  if (process.env.ETSY_API_KEY_HEADER) {
    return process.env.ETSY_API_KEY_HEADER;
  }

  const key = process.env.ETSY_API_KEY;
  const secret = process.env.ETSY_SHARED_SECRET;
  if (key && secret) {
    return `${key}:${secret}`;
  }

  return key || secret;
}

function numberFromFirstDefined(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") {
      const number = Number(value);
      if (Number.isFinite(number)) {
        return number;
      }
    }
  }

  return null;
}

function isRating(value) {
  return Number.isFinite(value) && value >= 1 && value <= 5;
}

async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") {
      return fallback;
    }

    throw new Error(`${path.relative(ROOT, filePath)} konnte nicht gelesen werden: ${error.message}`);
  }
}

async function writeJson(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function loadDotEnv() {
  [LISTING_GENERATOR_ENV_PATH, FALLBACK_ENV_PATH, ENV_PATH].forEach((filePath) => {
    if (fsSync.existsSync(filePath)) {
      loadDotEnvFile(filePath);
    }
  });
}

function loadDotEnvFile(filePath) {
  const lines = fsSync.readFileSync(filePath, "utf8").split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex <= 0) return;

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    if (!key || process.env[key] !== undefined) return;

    process.env[key] = unquote(rawValue);
  });
}

function unquote(value) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }

  return value;
}
