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

  const apiKey = process.env.ETSY_API_KEY_HEADER || process.env.ETSY_API_KEY || process.env.ETSY_SHARED_SECRET;
  const shopId = process.env.ETSY_SHOP_ID;
  const accessToken = process.env.ETSY_ACCESS_TOKEN || process.env.ETSY_OAUTH_TOKEN;

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
  const activeListings = await fetchActiveListings({ apiKey, shopId, accessToken });
  const activeListingIds = new Set(activeListings.map((listing) => String(listing.listing_id || listing.listingId)).filter(Boolean));
  const catalogListingIds = new Set(products.map((product) => String(product.listingId || "")).filter(Boolean));

  const report = buildReport(products, activeListings, activeListingIds);
  printReport(report, writeMode, restoreActive);

  if (!writeMode) {
    console.log("[etsy:products] Dry-run. Mit --write werden nicht mehr aktive Etsy-Listings in products.json archiviert.");
    console.log("[etsy:products] Mit --write --restore-active werden aktive Etsy-Listings auch wieder sichtbar geschaltet.");
    return;
  }

  const changed = applyAvailability(products, activeListingIds, restoreActive);
  if (!changed) {
    console.log("[etsy:products] products.json ist bereits passend zum Etsy-Stand.");
    return;
  }

  const nextCatalog = Array.isArray(catalog) ? products : { ...catalog, products };
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

async function fetchActiveListings({ apiKey, shopId, accessToken }) {
  const headerCandidates = uniqueValues([
    process.env.ETSY_API_KEY_HEADER,
    process.env.ETSY_API_KEY,
    process.env.ETSY_SHARED_SECRET,
    apiKey
  ]);
  const authCandidates = uniqueAuthCandidates(accessToken);
  const failures = [];

  for (const headerValue of headerCandidates) {
    for (const authValue of authCandidates) {
      try {
        return await fetchActiveListingsWithCredentials({ apiKey: headerValue, shopId, accessToken: authValue });
      } catch (error) {
        if (!error.retryableCredentialError) throw error;
        failures.push(error.message);
      }
    }
  }

  throw new Error(`Keine Etsy-Credential-Kombination wurde akzeptiert. Letzte Antwort: ${failures.at(-1) || "unbekannt"}`);
}

async function fetchActiveListingsWithCredentials({ apiKey, shopId, accessToken }) {
  const headers = {
    "x-api-key": apiKey,
    "Accept": "application/json"
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const listings = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const url = `${API_BASE}/shops/${encodeURIComponent(shopId)}/listings/active?limit=${limit}&offset=${offset}`;
    const response = await fetch(url, { headers });
    const text = await response.text();

    if (!response.ok) {
      const detail = text ? ` Etsy-Antwort: ${text.slice(0, 280)}` : "";
      const error = new Error(`Etsy API ${response.status} fuer aktive Listings.${detail}`);
      error.retryableCredentialError = response.status === 401 || response.status === 403;
      throw error;
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

function uniqueValues(values) {
  return [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))];
}

function uniqueAuthCandidates(accessToken) {
  if (!accessToken) return [""];
  return [accessToken, ""];
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

  return {
    activeEtsyCount: activeListings.length,
    activeInCatalog,
    missingOnEtsy,
    missingInCatalog,
    inactiveButActiveOnEtsy: inactiveInCatalog.filter((entry) => entry.onEtsy).map((entry) => entry.label)
  };
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
