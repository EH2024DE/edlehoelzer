const fs = require("fs");
const path = require("path");

const root = process.cwd();
const mediaRoots = ["assets", "product", "teigschaber-sauerteig/img"];
const textExts = new Set([".html", ".css", ".js", ".json", ".xml", ".md", ".mjs"]);
const mediaExts = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".mp4", ".mov"]);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git") continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function readU32(buffer, offset) {
  return buffer.readUInt32BE(offset);
}

function inspectJpeg(buffer) {
  let offset = 2;
  const meta = { exif: false, gps: false, xmp: false, icc: false, adobe: false };
  let width = 0;
  let height = 0;
  while (offset + 4 < buffer.length) {
    if (buffer[offset] !== 0xff) break;
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    const segment = buffer.subarray(offset + 4, Math.min(buffer.length, offset + 2 + length));
    const head = segment.subarray(0, 64).toString("latin1");
    if (marker === 0xe1 && head.includes("Exif")) meta.exif = true;
    if (marker === 0xe1 && head.includes("http://ns.adobe.com/xap/1.0/")) meta.xmp = true;
    if (marker === 0xe2 && head.includes("ICC_PROFILE")) meta.icc = true;
    if (marker === 0xee && head.includes("Adobe")) meta.adobe = true;
    if (segment.includes(Buffer.from("GPS", "latin1"))) meta.gps = true;
    if ([0xc0, 0xc1, 0xc2, 0xc3].includes(marker)) {
      height = segment.readUInt16BE(1);
      width = segment.readUInt16BE(3);
    }
    offset += 2 + length;
  }
  return { format: "jpeg", width, height, meta };
}

function inspectPng(buffer) {
  return {
    format: "png",
    width: readU32(buffer, 16),
    height: readU32(buffer, 20),
    meta: { exif: buffer.includes(Buffer.from("eXIf")), gps: false, xmp: buffer.includes(Buffer.from("XML")), icc: buffer.includes(Buffer.from("iCCP")), adobe: false }
  };
}

function inspectWebp(buffer) {
  const tag = buffer.subarray(12, 16).toString("latin1");
  if (tag === "VP8X") {
    const width = 1 + buffer.readUIntLE(24, 3);
    const height = 1 + buffer.readUIntLE(27, 3);
    return { format: "webp", width, height, meta: {} };
  }
  if (tag === "VP8 ") {
    const width = buffer.readUInt16LE(26) & 0x3fff;
    const height = buffer.readUInt16LE(28) & 0x3fff;
    return { format: "webp", width, height, meta: {} };
  }
  if (tag === "VP8L") {
    const bits = buffer.readUInt32LE(21);
    const width = (bits & 0x3fff) + 1;
    const height = ((bits >> 14) & 0x3fff) + 1;
    return { format: "webp", width, height, meta: {} };
  }
  return { format: "webp", width: 0, height: 0, meta: {} };
}

function inspectAvif(buffer) {
  const idx = buffer.indexOf(Buffer.from("ispe"));
  if (idx !== -1 && idx + 16 < buffer.length) {
    return {
      format: "avif",
      width: readU32(buffer, idx + 8),
      height: readU32(buffer, idx + 12),
      meta: {}
    };
  }
  return { format: "avif", width: 0, height: 0, meta: {} };
}

function inspectMedia(file) {
  const buffer = fs.readFileSync(file);
  const size = buffer.length;
  if (buffer.subarray(0, 2).equals(Buffer.from([0xff, 0xd8]))) return { ...inspectJpeg(buffer), size };
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { ...inspectPng(buffer), size };
  if (buffer.subarray(0, 4).toString("latin1") === "RIFF" && buffer.subarray(8, 12).toString("latin1") === "WEBP") return { ...inspectWebp(buffer), size };
  if (buffer.subarray(4, 12).toString("latin1").includes("ftyp")) {
    const major = buffer.subarray(8, 12).toString("latin1");
    if (["avif", "avis"].includes(major)) return { ...inspectAvif(buffer), size };
    return { format: "video", width: 0, height: 0, meta: {}, size };
  }
  return { format: "unknown", width: 0, height: 0, meta: {}, size };
}

function expectedFormat(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "jpeg";
  if (ext === ".mp4" || ext === ".mov") return "video";
  return ext.replace(".", "");
}

const allFiles = walk(root).filter((file) => !file.includes(`${path.sep}.git${path.sep}`));
const textFiles = allFiles.filter((file) => textExts.has(path.extname(file).toLowerCase()));
const textContent = textFiles.map((file) => ({ file, text: fs.readFileSync(file, "utf8") }));
const mediaFiles = mediaRoots.flatMap((dir) => walk(path.join(root, dir))).filter((file) => mediaExts.has(path.extname(file).toLowerCase()));

const warnings = [];
const critical = [];
const rows = [];

function referenced(rel) {
  const needles = [rel, `/${rel}`, `./${rel}`, `../${rel}`];
  return textContent.filter(({ text }) => needles.some((needle) => text.includes(needle))).map(({ file }) => path.relative(root, file));
}

for (const file of mediaFiles) {
  const rel = path.relative(root, file).replaceAll(path.sep, "/");
  const info = inspectMedia(file);
  const refs = referenced(rel);
  const expected = expectedFormat(rel);
  const maxDim = Math.max(info.width, info.height);
  const sizeKb = Math.round(info.size / 1024);
  rows.push({ rel, info, refs, sizeKb });

  if (info.format !== expected) warnings.push(`${rel}: Dateiendung ${path.extname(rel)} passt nicht zum Format ${info.format}.`);
  if (info.format === "video" && info.size > 8 * 1024 * 1024) warnings.push(`${rel}: Video ist ${sizeKb} KB groß (>8 MB).`);
  if (info.format !== "video" && info.size > 500 * 1024) warnings.push(`${rel}: Bild ist ${sizeKb} KB groß (>500 KB).`);
  if (maxDim > 2500) warnings.push(`${rel}: Bildkante ist ${maxDim}px groß (>2500px).`);
  if (info.meta?.gps) critical.push(`${rel}: GPS-Metadaten gefunden.`);
  if (info.meta?.exif || info.meta?.xmp || info.meta?.adobe) warnings.push(`${rel}: Veröffentlichungsversion enthält EXIF/XMP/Adobe-Metadaten.`);
  if (refs.length === 0) warnings.push(`${rel}: keine statische Referenz im Code gefunden.`);
}

for (const { file, text } of textContent.filter(({ file }) => file.endsWith(".html"))) {
  const relFile = path.relative(root, file);
  for (const match of text.matchAll(/<img\b[^>]*>/gims)) {
    const tag = match[0];
    if (!/\bwidth\s*=/.test(tag) || !/\bheight\s*=/.test(tag)) warnings.push(`${relFile}: img ohne width/height gefunden.`);
    if (!/\bloading\s*=/.test(tag) && !/brand__logo|hero__poster|seoHero__image|teigschaberHero/.test(tag)) {
      warnings.push(`${relFile}: img ohne loading-Attribut gefunden.`);
    }
  }
}

console.log(`Asset Audit: ${mediaFiles.length} Medien geprüft.`);
console.log(`Warnungen: ${warnings.length}`);
console.log(`Kritisch: ${critical.length}`);
for (const issue of critical) console.log(`KRITISCH ${issue}`);
for (const issue of warnings.slice(0, 80)) console.log(`WARNUNG ${issue}`);
if (warnings.length > 80) console.log(`WARNUNG ... ${warnings.length - 80} weitere Warnungen gekürzt.`);
console.log("OK Audit beendet. Hinweise sind bewusst nicht blockierend.");
