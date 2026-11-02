# Designsystem-Audit

Basis: `f772f7ac7e7bdca497b9c044d7d9fbee82179f36` (aktueller main beim Start). Automatisch reproduzierbar: `node scripts/audit-design-system.mjs`.

145 Sitemap-URLs, 2402 Fundstellen, 179 verschiedene Hexfarbwerte, 73 max-width-Werte und 30 Media-Query-Ausdrücke. CSS-Syntax wird mit PostCSS, HTML mit parse5 gelesen. Zähler sind Inventar, keine automatisch bewiesenen Fehler: Wiederholungen innerhalb verschiedener Media Queries können notwendig sein. Kompiliertes Brettvorschau-Bundle separat, nicht mechanisch umschreiben.

| Pattern | Fundstellen | behalten | ersetzen | entfernen |
|---|---|---|---|---|
| Media Query (78) | assets/css/board-inquiry.css:26, assets/css/board-inquiry.css:27, assets/css/custom-projects.css:22 | Inhalt / Vertrag | zentrales Token oder Komponente | nur nach Regression |
| Section / Container (20) | assets/css/board-inquiry.css:2, assets/css/gastronomie.css:7, assets/css/gastronomie.css:56 | Inhalt / Vertrag | zentrales Token oder Komponente | nur nach Regression |
| Button (183) | assets/css/board-inquiry.css:13, assets/css/board-inquiry.css:27, assets/css/custom-projects.css:9 | Inhalt / Vertrag | zentrales Token oder Komponente | nur nach Regression |
| Card / Box (401) | assets/css/board-inquiry.css:22, assets/css/board-inquiry.css:23, assets/css/board-inquiry.css:25 | Inhalt / Vertrag | zentrales Token oder Komponente | nur nach Regression |
| Width (198) | assets/css/board-inquiry.css:2, assets/css/board-inquiry.css:4, assets/css/board-inquiry.css:24 | Inhalt / Vertrag | zentrales Token oder Komponente | nur nach Regression |
| Radius (256) | assets/css/board-inquiry.css:6, assets/css/board-inquiry.css:15, assets/css/custom-projects.css:6 | Inhalt / Vertrag | zentrales Token oder Komponente | nur nach Regression |
| Local font override (22) | assets/css/board-inquiry.css:6, assets/css/kitchen-preview-entry.css:11, assets/css/site-search.css:6 | Inhalt / Vertrag | zentrales Token oder Komponente | nur nach Regression |
| Hero (216) | assets/css/gastronomie.css:18, assets/css/gastronomie.css:19, assets/css/gastronomie.css:20 | Inhalt / Vertrag | zentrales Token oder Komponente | nur nach Regression |
| Shadow (78) | assets/css/gastronomie.css:23, assets/css/product-photo-viewer.css:2, assets/css/site-search.css:4 | Inhalt / Vertrag | zentrales Token oder Komponente | nur nach Regression |
| Important (41) | assets/css/gastronomie.css:97, assets/css/room-discovery.css:5, assets/css/room-discovery.css:5 | Inhalt / Vertrag | zentrales Token oder Komponente | nur nach Regression |
| Font family (32) | assets/css/page-summary.css:6, assets/css/page-summary.css:28, assets/css/product-photo-viewer.css:8 | Inhalt / Vertrag | zentrales Token oder Komponente | nur nach Regression |
| External font (291) | atelier/index.html:18, atelier/index.html:20, barbecue-geschenk/index.html:18 | Inhalt / Vertrag | zentrales Token oder Komponente | nur nach Regression |
| Supplemental CSS (55) | atelier/index.html:98, atelier/index.html:100, barbecue-geschenk/index.html:91 | Inhalt / Vertrag | zentrales Token oder Komponente | nur nach Regression |
| Page-local CSS (8) | baumspende.html:23, danke.html:16, datenschutz.html:12 | Inhalt / Vertrag | zentrales Token oder Komponente | nur nach Regression |
| Inline style (38) | baumspende.html:156, baumspende.html:189, baumspende.html:192 | Inhalt / Vertrag | zentrales Token oder Komponente | nur nach Regression |
| Repeated selector (485) | assets/css/board-inquiry.css:1, assets/css/board-inquiry.css:18, assets/css/board-inquiry.css:19 | Inhalt / Vertrag | zentrales Token oder Komponente | nur nach Regression |

## Scope und Schutz

- Phase A/B: System und drei Referenztypen jeweils DE/EN. Kein siteweiter Rollout vor Review.
- Neuer Worktree nötig, weil der Shopcheckout ungespeicherte Arbeiten enthält. Dieser bleibt unverändert.
- Shopbranch `codex/cloudflare-stripe-shop`, Merge Base `45111ea1419f6bf07db0c79b140d7af525e16184`. Main enthält zusätzlich PR200. Konfliktrisiko besonders bei styles.css, main.js, Produktgenerator und Paketdaten.
- Keine Shopbackend-Dateien übernehmen. Kein Stripe-, Preis-, Versand-, DNS- oder Checkout-Change.
- Bestehende Designvorschau ist NICHT main. Frühere lokale Inhaltskorrekturen nicht still überschreiben oder als bereits gemergt ausgeben. Vor späterer Veröffentlichung separat abgleichen.
- Alte Styles werden zunächst in einer Legacy-Cascade-Layer isoliert, nicht gelöscht. Nicht migrierte URLs bleiben unverändert.
- Vollständige maschinenlesbare Fundstellen und Seitenzuordnung siehe die beiden CSV-Dateien. Bildqualität ist bewusst manuell offen; vorhandenes alt ist kein Qualitätsnachweis.
