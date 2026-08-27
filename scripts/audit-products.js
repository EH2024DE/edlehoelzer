const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const catalogPath = path.join(root, "products.json");
const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const products = Array.isArray(catalog) ? catalog : catalog.products || [];

const warnings = [];
const errors = [];

function status(product) {
  if (!product) return "inactive";
  if (product.availabilityStatus) return String(product.availabilityStatus).toLowerCase();
  if (product.active === false) return "inactive";
  if (product.directListingUrlVerified === true && (product.etsyListingUrl || product.etsyUrl)) return "available";
  return "unknown";
}

function isGridProduct(product) {
  if (!product || product.visibility === "hidden" || product.visibility === "archive") return false;
  if (product.visibility === "inspiration" && product.inspirationOnly === true && status(product) === "sold") return true;
  if (product.active !== true) return false;
  if (status(product) === "made_to_order") return product.visibility === "grid";
  return status(product) === "available" && product.directListingUrlVerified === true && Boolean(product.etsyListingUrl || product.etsyUrl);
}

function meaningful(value) {
  if (!value) return "";
  const text = String(value).trim();
  if (!text || /Format laut Etsy|laut Etsy-Export|laut Etsy-Listing|Set laut|nicht relevant/i.test(text)) return "";
  return text;
}

function dimensions(product) {
  return meaningful(product.sizeLabel) ||
    meaningful(product.dimensions) ||
    extractDimensions([
      product.displayName,
      product.name,
      product.title,
      product.shortDescription,
      product.longDescription
    ].join(" "));
}

function extractDimensions(text) {
  if (!text) return "";
  const normalized = String(text).replace(/×/g, "x").replace(/\s+/g, " ");
  const match = normalized.match(/(?:maße|masse|größe|format)?\s*:?\s*(ca\.\s*)?(\d{1,3}(?:[,.]\d+)?)\s*x\s*(\d{1,3}(?:[,.]\d+)?)(?:\s*x\s*(\d{1,3}(?:[,.]\d+)?))?\s*cm\b/i);
  if (!match) return "";
  const prefix = match[1] ? "ca. " : "";
  return prefix + [match[2], match[3], match[4]].filter(Boolean).map((value) => value.replace(".", ",")).join(" × ") + " cm";
}

function hasInternalLabels(product) {
  const haystack = [
    product.weightClass,
    product.portability,
    product.careIntensity,
    product.woodCut,
    ...(Array.isArray(product.badges) ? product.badges : [])
  ].join(" ");
  return /\b(Low|Medium|High|heavy|light|Edge Grain|Face Grain|Long Grain)\b/.test(haystack);
}

products.forEach((product, index) => {
  const label = `${product.id || `row-${index + 1}`} (${product.displayName || product.name || "ohne Namen"})`;
  const currentStatus = status(product);
  const galleryLength = Array.isArray(product.gallery) ? product.gallery.filter(Boolean).length : 0;

  if (!product.id) errors.push(`KRITISCH Produkt ohne id in Zeile ${index + 1}`);
  if (product.active === true && !product.image) errors.push(`KRITISCH ${label}: active ohne Bild`);
  const intentionalInspiration = product.visibility === "inspiration" && product.inspirationOnly === true && currentStatus === "sold";
  if (isGridProduct(product) && !intentionalInspiration && ["sold", "inactive", "unknown"].includes(currentStatus)) {
    errors.push(`KRITISCH ${label}: ${currentStatus} wuerde im Grid erscheinen`);
  }
  if (product.active === true && product.category !== "care" && product.directListingUrlVerified !== true) {
    warnings.push(`WARNUNG ${label}: active ohne verifizierten direkten Etsy-Link`);
  }
  if (!product.availabilityStatus) {
    warnings.push(`WARNUNG ${label}: availabilityStatus fehlt, wird aus Linkstatus abgeleitet (${currentStatus})`);
  }
  if (product.active === true && product.category === "board" && !dimensions(product)) {
    warnings.push(`WARNUNG ${label}: keine eindeutigen Maße`);
  }
  if (product.active === true && galleryLength <= 1) {
    warnings.push(`WARNUNG ${label}: nur ${galleryLength || 0} Galeriebild(er)`);
  }
  if (hasInternalLabels(product)) {
    warnings.push(`WARNUNG ${label}: interne Klassifikationswerte in Produktdaten vorhanden; Frontend muss sie normalisieren`);
  }
});

const active = products.filter((product) => product.active === true);
const grid = products.filter(isGridProduct);
const verified = products.filter((product) => product.directListingUrlVerified === true && (product.etsyListingUrl || product.etsyUrl));

console.log(`Product Audit: ${products.length} Produkte geprueft.`);
console.log(`Aktiv: ${active.length}`);
console.log(`Grid-faehig: ${grid.length}`);
console.log(`Mit verifiziertem Listing: ${verified.length}`);
console.log(`Warnungen: ${warnings.length}`);
console.log(`Kritisch: ${errors.length}`);

errors.forEach((entry) => console.error(entry));
warnings.forEach((entry) => console.warn(entry));

if (errors.length) {
  process.exitCode = 1;
}
