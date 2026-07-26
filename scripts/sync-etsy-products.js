#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const ENV_PATH = path.join(ROOT, ".env");
const FALLBACK_ENV_PATH = path.join(ROOT, "..", ".env");
const LISTING_GENERATOR_ENV_PATH = path.join(ROOT, "..", "listing-generator", ".env");
const CATALOG_PATH = path.join(ROOT, "products.json");
const API_BASE = "https://api.etsy.com/v3/application";
const TODAY = new Date().toISOString().slice(0, 10);

loadDotEnv();

const args = new Set(process.argv.slice(2));
const writeMode = args.has("--write");
const restoreActive = args.has("--restore-active");
const helpMode = args.has("--help") || args.has("-h");

main().catch((error) => {
  console.error("[etsy:products] Abbruch:", error.message);
  process.exitCode = 1;
});

async function main() {
  if (helpMode) {
    printHelp();
    return;
  }

  const apiKey = buildApiKeyHeader();
  const shopId = process.env.ETSY_SHOP_ID;

  if (!apiKey || !shopId) {
    console.log("[etsy:products] ETSY_API_KEY und ETSY_SHOP_ID sind nicht gesetzt.");
    console.log("[etsy:products] Lege sie lokal in .env ab. .env ist per .gitignore vom Commit ausgeschlossen.");
    console.log("[etsy:products] Keine Dateien geändert.");
    return;
  }

  if (typeof fetch !== "function") {
    throw new Error("Dieses Script benötigt Node.js 18+ mit globalem fetch.");
  }

  const catalog = readJson(CATALOG_PATH);
  const products = Array.isArray(catalog) ? catalog : catalog.products || [];
  const resolvedShopId = await resolveShopId({ apiKey, shopId });
  const activeListings = await fetchActiveListings({ apiKey, shopId: resolvedShopId });
  const activeListingIds = new Set(activeListings.map((listing) => String(listing.listing_id || listing.listingId)).filter(Boolean));
  const catalogListingIds = new Set(products.map((product) => String(product.listingId || "")).filter(Boolean));

  const report = buildReport(products, activeListings, activeListingIds);
  printReport(report, writeMode, restoreActive);

  if (!writeMode) {
    console.log("[etsy:products] Dry-run. Mit --write werden nicht mehr aktive Etsy-Listings in products.json archiviert.");
    console.log("[etsy:products] Mit --write --restore-active werden aktive Etsy-Listings auch wieder sichtbar geschaltet.");
    return;
  }

  const availabilityChanged = applyAvailability(products, activeListingIds, restoreActive);
  const titlesChanged = applyListingTitles(products, activeListings);
  const metadataChanged = !Array.isArray(catalog) && (
    catalog.updatedAt !== TODAY ||
    catalog.source !== `Etsy Live-Abgleich ${TODAY}`
  );
  const changed = availabilityChanged || titlesChanged || metadataChanged;
  if (!changed) {
    console.log("[etsy:products] products.json ist bereits passend zum Etsy-Stand.");
    return;
  }

  const nextCatalog = Array.isArray(catalog) ? products : {
    ...catalog,
    updatedAt: TODAY,
    source: `Etsy Live-Abgleich ${TODAY}`,
    sourceNote: "Produktdaten wurden gegen den aktuellen Etsy-Shop abgeglichen. Aktive Listing-Titel und Verfügbarkeit werden zentral synchronisiert; bewusst als verkauft markierte Einzelstücke bleiben archiviert.",
    products
  };
  fs.writeFileSync(CATALOG_PATH, `${JSON.stringify(nextCatalog, null, 2)}\n`, "utf8");
  console.log("[etsy:products] products.json wurde aktualisiert.");

  const missingInCatalog = activeListings.filter((listing) => {
    const id = String(listing.listing_id || listing.listingId || "");
    return id && !catalogListingIds.has(id);
  });

  if (missingInCatalog.length) {
    console.log("[etsy:products] Hinweis: Aktive Etsy-Listings fehlen noch in products.json:");
    missingInCatalog.slice(0, 25).forEach((listing) => {
      console.log(`  - ${listing.listing_id}: ${listing.title || "(ohne Titel)"}`);
    });
  }
}

async function resolveShopId({ apiKey, shopId }) {
  if (/^\d+$/.test(String(shopId))) {
    return String(shopId);
  }

  const url = `${API_BASE}/shops?shop_name=${encodeURIComponent(shopId)}&limit=100`;
  const response = await fetch(url, {
    headers: { "x-api-key": apiKey, "Accept": "application/json" }
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Etsy-Shop konnte nicht aufgelöst werden (${response.status}).`);
  }

  const data = parseJson(text);
  const shops = Array.isArray(data.results) ? data.results : [];
  const exact = shops.find((shop) => String(shop.shop_name || "").toLowerCase() === String(shopId).toLowerCase());
  if (!exact || !exact.shop_id) {
    throw new Error(`Etsy-Shop "${shopId}" konnte nicht eindeutig aufgelöst werden.`);
  }

  return String(exact.shop_id);
}

async function fetchActiveListings({ apiKey, shopId }) {
  const headers = {
    "x-api-key": apiKey,
    "Accept": "application/json"
  };

  const listings = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const url = `${API_BASE}/shops/${encodeURIComponent(shopId)}/listings/active?limit=${limit}&offset=${offset}`;
    const response = await fetch(url, { headers });
    const text = await response.text();

    if (!response.ok) {
      const detail = text ? ` Etsy-Antwort: ${text.slice(0, 280)}` : "";
      throw new Error(`Etsy API ${response.status} fuer aktive Listings.${detail}`);
    }

    const data = parseJson(text);
    const batch = Array.isArray(data.results) ? data.results : [];
    listings.push(...batch);

    const count = Number(data.count);
    offset += batch.length;

    if (!batch.length || !Number.isFinite(count) || offset >= count) break;
  }

  return listings;
}

function buildReport(products, activeListings, activeListingIds) {
  const missingOnEtsy = [];
  const activeInCatalog = [];
  const inactiveInCatalog = [];

  products.forEach((product) => {
    if (!product.listingId) return;

    const listingId = String(product.listingId);
    const onEtsy = activeListingIds.has(listingId);
    const label = `${listingId} - ${product.displayName || product.name || product.title || product.id}`;

    if (onEtsy) {
      activeInCatalog.push(label);
    } else {
      missingOnEtsy.push(label);
    }

    if (product.active === false || product.visibility === "archive" || product.availabilityStatus === "sold") {
      inactiveInCatalog.push({ product, onEtsy, label });
    }
  });

  const catalogListingIds = new Set(products.map((product) => String(product.listingId || "")).filter(Boolean));
  const missingInCatalog = activeListings
    .filter((listing) => !catalogListingIds.has(String(listing.listing_id || listing.listingId || "")))
    .map((listing) => `${listing.listing_id || listing.listingId} - ${listing.title || "(ohne Titel)"}`);
  const listingById = new Map(activeListings.map((listing) => [
    String(listing.listing_id || listing.listingId || ""),
    listing
  ]));
  const titleChanges = products
    .filter((product) => product.listingId && listingById.has(String(product.listingId)))
    .map((product) => {
      const listing = listingById.get(String(product.listingId));
      const catalogTitle = normalizeTitle(product.name || product.title || "");
      const etsyTitle = normalizeTitle(listing.title || "");
      return catalogTitle !== etsyTitle ? {
        id: product.listingId,
        displayName: product.displayName || product.name || product.id,
        catalogTitle: product.name || product.title || "",
        etsyTitle: listing.title || ""
      } : null;
    })
    .filter(Boolean);

  return {
    activeEtsyCount: activeListings.length,
    activeInCatalog,
    missingOnEtsy,
    missingInCatalog,
    inactiveButActiveOnEtsy: inactiveInCatalog.filter((entry) => entry.onEtsy).map((entry) => entry.label),
    titleChanges
  };
}

function normalizeTitle(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
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

function applyAvailability(products, activeListingIds, restoreActive) {
  let changed = false;

  products.forEach((product) => {
    if (!product.listingId) return;

    const isActiveOnEtsy = activeListingIds.has(String(product.listingId));

    if (!isActiveOnEtsy) {
      changed = setIfChanged(product, "active", false) || changed;
      changed = setIfChanged(product, "directListingUrlVerified", false) || changed;
      changed = setIfChanged(product, "availabilityStatus", "sold") || changed;
      changed = setIfChanged(product, "visibility", "archive") || changed;
      changed = setIfChanged(product, "soldReason", `Automatischer Etsy-Abgleich am ${TODAY}: Listing nicht in aktiven Etsy-Listings.`) || changed;
      changed = setIfChanged(product, "replacementStrategy", product.replacementStrategy || "request_similar") || changed;
      changed = setIfChanged(product, "requestUrl", product.requestUrl || "/schneidebrett-nach-mass/") || changed;
      return;
    }

    const intentionallyUnavailable = product.active === false ||
      product.visibility === "archive" ||
      product.availabilityStatus === "sold";
    if (intentionallyUnavailable && !restoreActive) {
      return;
    }

    changed = setIfChanged(product, "availabilityStatus", "available") || changed;
    changed = setIfChanged(product, "directListingUrlVerified", true) || changed;

    if (restoreActive) {
      changed = setIfChanged(product, "active", true) || changed;
      if (product.visibility === "archive" || product.visibility === "hidden") {
        changed = setIfChanged(product, "visibility", "grid") || changed;
      }
      if (product.soldReason) {
        delete product.soldReason;
        changed = true;
      }
    }
  });

  return changed;
}

function applyListingTitles(products, activeListings) {
  const listingsById = new Map(activeListings.map((listing) => [
    String(listing.listing_id || listing.listingId || ""),
    listing
  ]));
  let changed = false;

  products.forEach((product) => {
    const listing = listingsById.get(String(product.listingId || ""));
    const currentTitle = normalizeTitle(product.name || product.title || "");
    const etsyTitle = normalizeTitle(listing && listing.title);
    if (!etsyTitle || currentTitle === etsyTitle) return;

    changed = setIfChanged(product, "name", etsyTitle) || changed;
    if (Object.prototype.hasOwnProperty.call(product, "title")) {
      changed = setIfChanged(product, "title", etsyTitle) || changed;
    }
    changed = setIfChanged(product, "dataVerifiedAt", TODAY) || changed;
    changed = setIfChanged(product, "source", `etsy-shop-live-${TODAY.replace(/-/g, "")}`) || changed;
  });

  return changed;
}

function setIfChanged(object, key, value) {
  if (object[key] === value) return false;
  object[key] = value;
  return true;
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`${path.relative(ROOT, filePath)} konnte nicht gelesen werden: ${error.message}`);
  }
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error("Etsy API hat keine gültige JSON-Antwort geliefert.");
  }
}

function loadDotEnv() {
  [LISTING_GENERATOR_ENV_PATH, FALLBACK_ENV_PATH, ENV_PATH].forEach((filePath) => {
    if (fs.existsSync(filePath)) {
      loadDotEnvFile(filePath);
    }
  });
}

function loadDotEnvFile(filePath) {
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
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

function printReport(report, writeMode, restoreActive) {
  console.log(`[etsy:products] Aktive Etsy-Listings: ${report.activeEtsyCount}`);
  console.log(`[etsy:products] In products.json aktiv bei Etsy gefunden: ${report.activeInCatalog.length}`);
  console.log(`[etsy:products] In products.json nicht unter aktiven Etsy-Listings: ${report.missingOnEtsy.length}`);
  console.log(`[etsy:products] Aktive Etsy-Listings fehlen in products.json: ${report.missingInCatalog.length}`);
  console.log(`[etsy:products] Abweichende Etsy-Titel: ${report.titleChanges.length}`);

  if (report.inactiveButActiveOnEtsy.length) {
    console.log("[etsy:products] Archiviert/verkauft im Katalog, aber aktiv auf Etsy:");
    report.inactiveButActiveOnEtsy.slice(0, 25).forEach((entry) => console.log(`  - ${entry}`));
    if (!restoreActive && writeMode) {
      console.log("[etsy:products] Diese Produkte bleiben ohne --restore-active bewusst archiviert.");
    }
  }

  if (report.missingOnEtsy.length) {
    console.log("[etsy:products] Nicht mehr aktiv auf Etsy laut API:");
    report.missingOnEtsy.slice(0, 25).forEach((entry) => console.log(`  - ${entry}`));
  }

  if (report.missingInCatalog.length) {
    console.log("[etsy:products] Auf Etsy aktiv, aber noch nicht im Website-Katalog:");
    report.missingInCatalog.slice(0, 25).forEach((entry) => console.log(`  - ${entry}`));
  }

  if (report.titleChanges.length) {
    console.log("[etsy:products] Titeländerungen auf Etsy:");
    report.titleChanges.slice(0, 50).forEach((entry) => {
      console.log(`  - ${entry.id} - ${entry.displayName}`);
      console.log(`    Katalog: ${entry.catalogTitle}`);
      console.log(`    Etsy:    ${entry.etsyTitle}`);
    });
  }
}

function printHelp() {
  console.log("Etsy-Produktabgleich");
  console.log("");
  console.log("Nutzung:");
  console.log("  npm run sync:etsy-products");
  console.log("  npm run sync:etsy-products -- --write");
  console.log("  npm run sync:etsy-products -- --write --restore-active");
  console.log("");
  console.log("Benötigte lokale .env-Werte:");
  console.log("  ETSY_API_KEY=...         # oder ETSY_API_KEY_HEADER / ETSY_SHARED_SECRET, je nach lokalem Etsy-App-Setup");
  console.log("  ETSY_SHOP_ID=...");
  console.log("  ETSY_ACCESS_TOKEN=...  # optional, alternativ ETSY_OAUTH_TOKEN");
  console.log("");
  console.log("Der API-Key wird nicht ausgegeben und darf nicht ins Repository.");
}
