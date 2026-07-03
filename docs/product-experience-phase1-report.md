# Product Experience Phase 1 Report

Stand: 2026-06-29

## 1. Geänderte Dateien

- `main.js`
- `assets/js/product-grid.js`
- `styles.css`
- `package.json`
- `scripts/audit-products.js`
- `docs/product-experience-phase1-report.md`

## 2. Datenmodell

Die zentrale Produktquelle bleibt `products.json`. Für Phase 1 wurden keine Preise, Maße, Gewichte oder Verfügbarkeiten ergänzt oder geschätzt.

Genutzte Felder:

- `id`
- `displayName` / `name`
- `category`
- `segment`
- `priceLabel`
- `material`
- `woodCut`
- `sizeLabel`
- `thicknessLabel`
- `weightClass`
- `weight` / `weightLabel`, falls mit echter Einheit gepflegt
- `badges`
- `useCases`
- `servingSuitable`
- `giftable`
- `careIntensity`
- `image`
- `gallery`
- `etsyUrl`
- `etsyListingUrl`
- `directListingUrlVerified`
- `active`
- optional `availabilityStatus`
- optional `visibility`

Abgeleitete Daten für Preview und Vergleich:

- Moment-Copy
- Proof-Text
- Entscheidungshinweis
- Pflegehinweis
- Related Products
- Vergleichswerte
- Maße aus vorhandenen Textfeldern, wenn eindeutig im Format `x ... cm` erkennbar
- Bauweise normalisiert auf `Stirnholz` oder `Langholz`

Produkte mit vollständiger Preview-Basis: alle aktiven Produkte mit `id`, Bild und verifiziertem Etsy-Link.

Datenlücken:

- Exakte Gewichte sind nicht für alle Produkte gepflegt.
- Verfügbarkeit wird nicht als harte Aussage auf der Website gesetzt, sondern über Etsy geprüft.
- Lokale optimierte Produktmedien liegen nicht für alle Produktbilder vor.
- Produktvideos sind aktuell nicht zuverlässig gepflegt. `products.json` enthält keine stabile Produktvideo-Struktur pro Listing.
- Zwei aktive Produkte haben aktuell nur ein Bild in der Galerie.
- Ein aktueller Live-Etsy-Abgleich vom 2026-06-29 wurde nicht aus dem Browser heraus automatisiert. Die UI ist aber so vorbereitet, dass `sold`, `inactive`, `unknown`, `archive` und `hidden` nicht mehr kaufnah ausgespielt werden.

## 3. Product Preview

Umgesetzt:

- Desktop: modales Produktpanel mit Galerie links und Details rechts.
- Mobile: Fullscreen/Bottom-Sheet-artige Darstellung mit Safe-Area-Abstand.
- Galerie aus `gallery`/`image`.
- Optionales Video-Rendering ist vorbereitet, falls später ein belastbares `media`-Array mit `type: "video"`, `src` und optionalem `poster` gepflegt wird.
- Thumbnails stehen direkt unter dem Hauptbild.
- Hauptbilder werden mit `object-fit: contain` gezeigt, damit Produkte nicht zufällig abgeschnitten werden.
- Key Facts aus vorhandenen Produktdaten.
- Highlights aus Badges und Materialdaten.
- Moment- und Proof-Copy aus vorhandenen Produktmerkmalen abgeleitet.
- Pflegehinweis mit Link zur Pflegeseite.
- Etsy-CTA bleibt klar sichtbar.
- Related Products aus gleicher Kategorie, Holzart, Bauweise oder Nutzung.
- Compare Button in der Preview.

Nicht umgesetzt in Phase 1:

- Produktvideos im Live-Betrieb, weil keine stabile lokale Video-Datenbasis pro Produkt vorhanden ist. Es werden keine leeren Video-Plätze angezeigt.
- Eigene Produktdetail-URLs.
- Product Schema pro Produkt.

## 4. Product Grid

Angepasst:

- Produktbild und `Details ansehen` öffnen die Product Preview.
- Primär-CTA wurde von `Details ansehen` auf `Brett entdecken` / `Produkt entdecken` umgestellt.
- `Vergleichen` ist als sekundäre Aktion vorhanden und wirkt nicht wie der Hauptbutton.
- Direkte Etsy-Links bleiben als tertiäre Aktion `Auf Etsy ansehen` bestehen.
- `Dieses Brett kaufen` erscheint nicht mehr im Grid, sondern bleibt der stärkeren Product-Preview-Aktion vorbehalten.
- Landingpage-Produktgrids nutzen dieselbe Preview-/Compare-Logik über `data-product-preview` und `data-product-compare`.
- Maße in Product Cards nutzen `sizeLabel`, `dimensions` oder eine eindeutige Extraktion aus vorhandenen Textfeldern.
- Product Cards zeigen maximal kompakte Fakten. Interne Klassifikationen wie `Handling`, `leicht`, `mittel`, `schwer`, `low`, `medium` oder `high` werden im Grid nicht mehr ausgespielt.
- Preislabels werden auf `€` normalisiert.

Direkte Etsy-Links bleiben dort erhalten, wo der Button ausdrücklich als Kauf-/Etsy-Aktion erkennbar ist.

## 5. Product Finder

Angepasst:

- Hauptempfehlung öffnet Details über Product Preview.
- Finder-Ergebnis übergibt den vorhandenen Grund `Dieses Brett passt, weil...` in die Preview.
- Alternativen öffnen nicht mehr direkt Etsy, sondern bieten `Details` und `Vergleichen`.
- Etsy bleibt als bewusster Checkout-Schritt innerhalb der Produktaktion vorhanden.

## 6. Vergleichslogik

State:

- Clientseitig in `main.js`.
- Persistenz über `localStorage` nur mit Produkt-IDs.
- Keine personenbezogenen Daten.

Regeln:

- Maximal zwei Produkte im Vergleich.
- Bei drittem Produkt erscheint ein vereinfachter Replacement-Dialog mit der Frage `Welches Produkt soll raus?`.
- Kein automatisches Ersetzen.
- Vergleich kann geleert werden.
- Wenn im Compare View ein Produkt entfernt wird, bleibt der Nutzer im Overlay und bekommt direkt passende Vorschläge für den freien zweiten Slot.
- Wenn aus der Product Preview heraus das zweite Produkt hinzugefügt wird, öffnet sich der Compare View direkt.
- Die Product Preview zeigt den Compare-Status im CTA-Bereich: kein Produkt, `1 von 2`, `2 von 2`.

Vergleichsanzeige:

- Empty State.
- 1-Produkt-State mit Vorschlägen.
- 2-Produkt-Vergleich als stabile Matrix mit Bild, Moment, Preis, Maße, Material, Bauweise, Stärke, Saftrille, Gravur und Entscheidungshilfe.
- Gewicht wird nur angezeigt, wenn eine echte Einheit wie `kg` oder `g` gepflegt ist.
- Unterschiedliche Produkttypen erhalten einen Kontext-Hinweis.

Ausgeblendete Felder:

- Werte ohne belastbare Daten werden nicht erfunden.
- Zeilen ohne Daten werden nicht angezeigt oder als `nicht angegeben` markiert, wenn nur ein Produkt einen Wert hat.
- `weightClass`, Verfügbarkeit und Pflegelevel werden im Vergleich nicht angezeigt.
- Interne Werte wie `low`, `medium`, `heavy` werden in der deutschen Vergleichs-UI nicht ausgegeben.
- Bauweise wird im Frontend nur als `Stirnholz` oder `Langholz` angezeigt. Begriffe wie `Edge Grain`, `Face Grain`, `Long Grain`, `Flankenholz` und `Längsholz` werden in der Produkt-Experience normalisiert.

## 6.1 Etsy-Katalogabgleich und Verfügbarkeit

Prüfstand: 2026-06-29

Technisch umgesetzt:

- Kaufnahe Produktbereiche filtern auf verfügbare, aktive Produkte.
- Standard für Grid/Finder/Compare:
  `active === true`, kein `visibility: "hidden"` / `"archive"`, verfügbare Statuslogik und verifizierter direkter Etsy-Link.
- Wenn `availabilityStatus` gepflegt ist, werden `sold`, `inactive`, `unknown`, `archive` und `hidden` nicht als kaufbare Grid-/Compare-Produkte ausgespielt.
- Wenn `availabilityStatus` fehlt, wird der Status aus `active`, `directListingUrlVerified`, `etsyListingUrl` und `etsyUrl` abgeleitet.
- Stale Compare-IDs aus `localStorage` werden beim Laden gegen `isComparableProduct(product)` bereinigt.
- Nicht verfügbare Produkte erhalten in der Preview keinen Etsy-Kaufbutton, sondern eine Anfrage-/Ähnlich-CTA.
- Related Products und Compare Suggestions nutzen nur vergleichbare Produkte.

Aktueller Datenstand aus `products.json`:

- Produkte gesamt: wird durch `npm run audit:products` geprüft.
- Aktive Produkte ohne explizites `availabilityStatus` werden derzeit aus dem Linkstatus abgeleitet.
- Ein vollständiger Live-Abgleich mit Etsy bleibt Phase 2 oder benötigt einen frischen Etsy-Export als Source of Truth.

Neu ergänzt:

- `npm run audit:products`

Das Audit prüft:

- Produkte ohne ID
- aktive Produkte ohne Bild
- aktive Produkte ohne verifizierten Etsy-Link
- verkaufte/inaktive Produkte, die im Grid erscheinen würden
- fehlende Maße
- Produkte mit nur einem Galeriebild
- interne Klassifikationswerte, die das Frontend normalisieren muss
- Statusfelder, die aktuell noch abgeleitet werden

Weiter zu prüfen:

| Produkt ID | Produktname | Problem |
|---|---|---|
| Wird durch `npm run audit:products` ausgegeben | aktive Produkte ohne explizites `availabilityStatus` | Status wird aktuell aus Linkdaten abgeleitet |

Keine Produkte wurden in diesem PR blind als verkauft markiert, weil kein neuer belastbarer Etsy-Export vom 2026-06-29 im Repo vorliegt.

## 6.2 Produktmedien-Lücken

Aktive Produkte: 39

Produkte mit mehreren Galeriebildern: 37

Produkte mit nur einem Bild:

| Produkt ID | Produktname | Etsy-Link vorhanden | Gallery-Länge | Empfohlene nächste Aktion |
|---|---|---:|---:|---|
| `etsy-live-20260619-schneidebrett-buche-massiv-griffmulden` | Buche Massiv – Mit Griffmulden | ja | 1 | Lokale optimierte Galeriebilder aus Listing/Produktshooting ergänzen |
| `etsy-live-20260619-schneidebrett-eiche-massiv-astloch` | Eiche Massiv – Astloch & Kante | ja | 1 | Lokale optimierte Galeriebilder aus Listing/Produktshooting ergänzen |

Keine zusätzlichen Etsy-Bild-Hotlinks wurden ergänzt. Fehlende Galerien bleiben Phase 2: Etsy-Media-Sync, manueller Export oder lokale optimierte Kopien.

## 6.3 Abgeleitete Maße

Die Funktion `dimensionLabel(product)` nutzt:

1. `sizeLabel`
2. `dimensions`
3. eindeutige Maße aus `displayName`, `name`, `title`, `shortDescription`, `longDescription`

Aktueller Audit-Stand:

- Produkte mit vorhandenen aktiven Daten: 39
- Aus Text neu abgeleitete Maße: 0
- Grund: Produkte ohne belastbares `sizeLabel` enthalten im aktuellen Export kein eindeutiges `x ... cm`-Pattern.
- Bretter ohne eindeutige Maße bleiben leer bzw. `nicht angegeben`; es werden keine Maße geraten.

## 7. Accessibility

Umgesetzt:

- Product Preview, Compare View und Replacement Dialog nutzen `role="dialog"` und `aria-modal="true"`.
- Dialoge haben ein `aria-labelledby`.
- Close Buttons sind echte Buttons.
- Escape schließt den Dialog.
- Fokus wird beim Öffnen in den Dialog gesetzt.
- Fokus wird beim Schließen zurückgeführt.
- Fokusfalle für Tab-Navigation.
- Compare Buttons sind echte Buttons mit `aria-pressed`.
- Touch-Ziele liegen bei mindestens 44px.
- Produktbilder haben Alt-Texte.

## 8. Mobile / iOS

Umgesetzt:

- Preview und Compare verwenden `100dvh`/`100svh`.
- Safe-Area-Abstand über `env(safe-area-inset-bottom)`.
- Mobile Compare View stapelt Inhalte statt zwei enge Spalten zu erzwingen.
- Desktop Compare View nutzt eine Matrix mit stabiler Label-, Produkt-A- und Produkt-B-Spalte.
- Sticky Compare Bar sitzt oberhalb der Safe Area.
- Product Preview hat eigenen sticky CTA-Bereich und überdeckt keine externe Etsy-Aktion.
- Body Scroll Lock bei offenem Dialog.

Manuell weiter zu prüfen:

- Mobile Echtprüfung steht noch aus.
- echtes iPhone Safari Scroll-Verhalten auf langen Produktpreviews.
- Interaktion zwischen bestehender mobiler Sticky Page CTA und Compare Bar auf allen SEO-Seiten.

## 9. Performance

Umgesetzt:

- Keine neue externe Library.
- Keine schweren Slider.
- Galerie nutzt vorhandene Bilder und lädt Thumbnails lazy.
- Compare View nutzt nur Hauptbilder.
- Video wird nicht initial geladen.
- Wenn später Produktvideos gepflegt werden, werden sie mit `controls`, `playsinline` und `preload="none"` ausgegeben.
- Preview-Code ist in `main.js`, wird aber erst bei Interaktion sichtbar.

Risiken:

- Produktbilder kommen aktuell teilweise weiterhin von Etsy-CDN-URLs aus `products.json`.
- Lokale responsive Produktbildvarianten wären performanter und kontrollierbarer.

## 10. Tracking

Vorbereitet, falls `window.umami.track` vorhanden ist:

- `product_preview_open`
- `product_preview_etsy_click`
- `compare_add`
- `compare_remove`
- `compare_replace_prompt`
- `compare_replace_confirm`
- `compare_open`
- `compare_clear`

Zusätzlich fachlich vorbereitet durch vorhandene Datenattribute und Quellenlogik:

- Product Card: Primary Click, Compare Click, Etsy Click
- Product Preview: Galerie-Klick, Compare Open, Etsy Click
- Compare: Remove, Replace, Etsy Click

Parameter:

- `product_id`
- `product_title`
- `product_category`
- `wood`
- `source`
- `compare_count`
- `target`
- `replaced_product_id`

Es werden keine personenbezogenen Daten gespeichert.

## 11. Offene Punkte / Phase 2

- Lokale optimierte Produktmedien statt Etsy-CDN-URLs.
- Build-time Etsy-API-Sync ohne API-Key im Frontend.
- Frischer Etsy-Export oder build-time Etsy-Sync zur Pflege von `availabilityStatus` und `visibility`.
- Eigene Produktdetailseiten, z. B. `/produkte/eiche-stirnholz-001/`.
- Sharebare Vergleichs-URL, z. B. `/vergleich/?a=produkt-a&b=produkt-b`.
- Product Schema nur mit verlässlichen Preis-, Verfügbarkeits- und Produktdaten.
- Videos pro Produkt mit Posterbildern und komprimierten Web-Versionen.
- Stabiles Produktmedienmodell:
  `media: [{ type: "image", src, alt }, { type: "video", src, poster, alt }]`.
- Manuelle iPhone-Safari-Prüfung.
