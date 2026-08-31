import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..");
const origin = "https://edlehoelzer.de";
const failures = [];
const pages = [];
const allowedCanonicalAliases = new Map([
  [
    "schneidebrett-oel-vergleich/index.html",
    "https://edlehoelzer.de/welches-oel-schneidebrett/",
  ],
  [
    "teigschaber-sauerteig/index.html",
    "https://edlehoelzer.de/teigschaber-holz/",
  ],
]);

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === ".git") return [];
    const fullPath = join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function publicUrl(file) {
  const path = relative(root, file).split(sep).join("/");
  if (path === "index.html") return `${origin}/`;
  if (path.endsWith("/index.html")) {
    return `${origin}/${path.slice(0, -"index.html".length)}`;
  }
  return `${origin}/${path}`;
}

function firstMatch(html, pattern) {
  return html.match(pattern)?.[1]?.trim() ?? "";
}

function allMatches(html, pattern) {
  return [...html.matchAll(pattern)].map((match) => match[1].trim());
}

function report(message) {
  failures.push(message);
}

for (const file of walk(root).filter((path) => path.endsWith(".html"))) {
  const html = readFileSync(file, "utf8");
  const repoPath = relative(root, file).split(sep).join("/");
  const canonicalTags = allMatches(
    html,
    /<link\b(?=[^>]*\brel=["']canonical["'])(?=[^>]*\bhref=["']([^"']+)["'])[^>]*>/gi,
  );
  const canonical = canonicalTags[0] ?? "";
  const robots = firstMatch(
    html,
    /<meta\b(?=[^>]*\bname=["']robots["'])(?=[^>]*\bcontent=["']([^"']+)["'])[^>]*>/i,
  ).toLowerCase();
  const noindex = robots.split(",").map((value) => value.trim()).includes("noindex");
  const expected = publicUrl(file);
  const ogUrl = firstMatch(
    html,
    /<meta\b(?=[^>]*\bproperty=["']og:url["'])(?=[^>]*\bcontent=["']([^"']+)["'])[^>]*>/i,
  );

  if (canonicalTags.length !== 1) {
    report(`${repoPath}: expected one canonical tag, found ${canonicalTags.length}`);
  }
  if (canonical && !canonical.startsWith(`${origin}/`)) {
    report(`${repoPath}: canonical must use ${origin}`);
  }
  if (
    !noindex &&
    canonical &&
    canonical !== expected &&
    allowedCanonicalAliases.get(repoPath) !== canonical
  ) {
    report(`${repoPath}: unexpected non-self canonical ${canonical}`);
  }
  if (!noindex && canonical === expected && !firstMatch(html, /<title>([\s\S]*?)<\/title>/i)) {
    report(`${repoPath}: indexable page is missing a title`);
  }
  if (
    !noindex &&
    canonical === expected &&
    !firstMatch(
      html,
      /<meta\b(?=[^>]*\bname=["']description["'])(?=[^>]*\bcontent=["']([^"']+)["'])[^>]*>/i,
    )
  ) {
    report(`${repoPath}: indexable page is missing a meta description`);
  }
  if (
    !noindex &&
    canonical === expected &&
    allMatches(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi).length !== 1
  ) {
    report(`${repoPath}: indexable page must contain exactly one h1`);
  }
  if (canonical && ogUrl && ogUrl !== canonical) {
    report(`${repoPath}: og:url differs from canonical`);
  }

  for (const alternate of allMatches(
    html,
    /<link\b(?=[^>]*\brel=["']alternate["'])(?=[^>]*\bhreflang=["'][^"']+["'])(?=[^>]*\bhref=["']([^"']+)["'])[^>]*>/gi,
  )) {
    if (!alternate.startsWith(`${origin}/`)) {
      report(`${repoPath}: hreflang alternate must use ${origin} (${alternate})`);
    }
  }

  for (const block of allMatches(
    html,
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      JSON.parse(block);
    } catch (error) {
      report(`${repoPath}: invalid JSON-LD (${error.message})`);
    }
  }

  for (const href of allMatches(html, /<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)) {
    if (href.includes("index.html")) {
      report(`${repoPath}: internal link uses non-canonical index.html URL (${href})`);
    }
  }

  for (const asset of allMatches(
    html,
    /<(?:img|source|video)\b[^>]*\b(?:src|poster)=["']([^"']+)["'][^>]*>/gi,
  )) {
    if (
      !asset ||
      asset.startsWith("http:") ||
      asset.startsWith("https:") ||
      asset.startsWith("//") ||
      asset.startsWith("data:")
    ) {
      continue;
    }

    const cleanAsset = asset.split(/[?#]/)[0];
    const assetPath = cleanAsset.startsWith("/")
      ? join(root, cleanAsset.slice(1))
      : resolve(dirname(file), cleanAsset);
    if (!existsSync(assetPath) || !statSync(assetPath).isFile()) {
      report(`${repoPath}: missing local asset ${asset}`);
    }
  }

  pages.push({ repoPath, expected, canonical, noindex });
}

const sitemap = readFileSync(join(root, "sitemap.xml"), "utf8");
const sitemapUrls = new Set(allMatches(sitemap, /<loc>([^<]+)<\/loc>/gi));
const selfCanonicalPages = pages.filter(
  ({ expected, canonical, noindex }) => !noindex && expected === canonical,
);

for (const page of selfCanonicalPages) {
  if (!sitemapUrls.has(page.canonical)) {
    report(`${page.repoPath}: self-canonical indexable page is missing from sitemap.xml`);
  }
}

for (const url of sitemapUrls) {
  const page = selfCanonicalPages.find(({ canonical }) => canonical === url);
  if (!page) {
    report(`sitemap.xml: ${url} does not map to a self-canonical indexable HTML page`);
  }
}

if (failures.length) {
  console.error(`Indexability audit failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `Indexability audit passed: ${pages.length} HTML files, ` +
      `${selfCanonicalPages.length} self-canonical indexable pages, ` +
      `${sitemapUrls.size} sitemap URLs.`,
  );
}
