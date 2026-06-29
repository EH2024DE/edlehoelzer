# Product Experience Phase 1 Report

Stand: 2026-06-29

## 1. Geänderte Dateien

- `main.js`
- `assets/js/product-grid.js`
- `styles.css`
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

Abgeleitete Daten für Preview und Vergleich:

- Moment-Copy
- Proof-Text
- Entscheidungshinweis
- Pflegehinweis
- Related Products
- Vergleichswerte

Produkte mit vollständiger Preview-Basis: alle aktiven Produkte mit `id`, Bild und verifiziertem Etsy-Link.

Datenlücken:

- Exakte Gewichte sind nicht für alle Produkte gepflegt.
- Verfügbarkeit wird nicht als harte Aussage auf der Website gesetzt, sondern über Etsy geprüft.
- Lokale optimierte Produktmedien liegen nicht für alle Produktbilder vor.
- Videos sind im aktuellen Produktdatenmodell nicht zuverlässig gepflegt.

## 3. Product Preview

Umgesetzt:

- Desktop: modales Produktpanel mit Galerie links und Details rechts.
- Mobile: Fullscreen/Bottom-Sheet-artige Darstellung mit Safe-Area-Abstand.
- Galerie aus `gallery`/`image`.
- Key Facts aus vorhandenen Produktdaten.
- Highlights aus Badges und Materialdaten.
- Moment- und Proof-Copy aus vorhandenen Produktmerkmalen abgeleitet.
- Pflegehinweis mit Link zur Pflegeseite.
- Etsy-CTA bleibt klar sichtbar.
- Related Products aus gleicher Kategorie, Holzart, Bauweise oder Nutzung.
- Compare Button in der Preview.

Nicht umgesetzt in Phase 1:

- Produktvideos, weil keine stabile lokale Video-Datenbasis pro Produkt vorhanden ist.
- Eigene Produktdetail-URLs.
- Product Schema pro Produkt.

## 4. Product Grid

Angepasst:

- Produktbild und `Details ansehen` öffnen die Product Preview.
- `Vergleichen` ist als eigener Button vorhanden.
- Direkte Etsy-Links bleiben als Checkout-Aktion bestehen.
- Landingpage-Produktgrids nutzen dieselbe Preview-/Compare-Logik über `data-product-preview` und `data-product-compare`.

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
- Bei drittem Produkt erscheint ein Replacement-Dialog.
- Kein automatisches Ersetzen.
- Vergleich kann geleert werden.

Vergleichsanzeige:

- Empty State.
- 1-Produkt-State.
- 2-Produkt-Vergleich mit Bild, Moment, Preis, Maße, Holzart, Bauweise, Stärke, Gewichtsklasse, Saftrille, Gravur, Verfügbarkeitshinweis, Pflege und Entscheidungshilfe.

Ausgeblendete Felder:

- Werte ohne belastbare Daten werden nicht erfunden.
- Zeilen ohne Daten werden nicht angezeigt oder als `nicht angegeben` markiert, wenn nur ein Produkt einen Wert hat.

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
- Sticky Compare Bar sitzt oberhalb der Safe Area.
- Product Preview hat eigenen sticky CTA-Bereich und überdeckt keine externe Etsy-Aktion.
- Body Scroll Lock bei offenem Dialog.

Manuell weiter zu prüfen:

- echtes iPhone Safari Scroll-Verhalten auf langen Produktpreviews.
- Interaktion zwischen bestehender mobiler Sticky Page CTA und Compare Bar auf allen SEO-Seiten.

## 9. Performance

Umgesetzt:

- Keine neue externe Library.
- Keine schweren Slider.
- Galerie nutzt vorhandene Bilder und lädt Thumbnails lazy.
- Compare View nutzt nur Hauptbilder.
- Video wird nicht initial geladen.
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
- Eigene Produktdetailseiten, z. B. `/produkte/eiche-stirnholz-001/`.
- Sharebare Vergleichs-URL, z. B. `/vergleich/?a=produkt-a&b=produkt-b`.
- Product Schema nur mit verlässlichen Preis-, Verfügbarkeits- und Produktdaten.
- Videos pro Produkt mit Posterbildern und komprimierten Web-Versionen.
- Manuelle iPhone-Safari-Prüfung.
