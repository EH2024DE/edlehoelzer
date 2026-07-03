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
const ENV_PATH = path.join(ROOT, ".env");
const FALLBACK_ENV_PATH = path.join(ROOT, "..", ".env");
const LISTING_GENERATOR_ENV_PATH = path.join(ROOT, "..", "listing-generator", ".env");

loadDotEnv();

const API_KEY = process.env.ETSY_API_KEY_HEADER || process.env.ETSY_API_KEY || process.env.ETSY_SHARED_SECRET;
const SHOP_ID = process.env.ETSY_SHOP_ID;
const ACCESS_TOKEN = process.env.ETSY_ACCESS_TOKEN || process.env.ETSY_OAUTH_TOKEN;

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
  await readJson(REVIEWS_PATH, []);

  const shop = await fetchEtsyJson(`https://api.etsy.com/v3/application/shops/${encodeURIComponent(SHOP_ID)}`);
  const nextMeta = buildMetaFromShop(existingMeta, shop);

  if (!nextMeta) {
    console.log("[reviews:update] Die Etsy-API-Antwort enthält keine verlässlichen Review-Metadaten.");
    console.log("[reviews:update] Keine Dateien geändert. Bitte Bewertungsanzahl und Durchschnitt manuell prüfen.");
    return;
  }

  await writeJson(META_PATH, nextMeta);
  console.log("[reviews:update] data/reviews-meta.json wurde mit Etsy-Metadaten aktualisiert.");
  console.log("[reviews:update] Review-Texte wurden nicht automatisch geändert, da kein stabiler Shop-Review-Sync aktiviert ist.");
}

async function fetchEtsyJson(url) {
  const headers = {
    "x-api-key": API_KEY,
    "Accept": "application/json"
  };

  if (ACCESS_TOKEN) {
    headers.Authorization = `Bearer ${ACCESS_TOKEN}`;
  }

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
    lastUpdated: new Date().toISOString().slice(0, 10),
    sourceUrl: existingMeta.sourceUrl || `https://www.etsy.com/shop/${shop.shop_name || ""}#reviews`,
    updateMode: "api",
    needsReview: false
  };
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
