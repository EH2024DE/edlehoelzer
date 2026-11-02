# Designsystem-Migration: Zwischenbericht und Rollout-Gate

## 1. Designprinzipien
Produkt zuerst, klare nächste Entscheidung, ergänzende Information progressiv. Ordnung und echtes Holz statt dekorativer Karten.

## 2. ZEITRAUM-Referenzanalyse
ONDE und KUYU wurden im aktuellen deutschen Auftritt gelesen; TWIST und CENA über die tatsächlichen Collection-Links im Kollektionsverzeichnis. Gemeinsames Prinzip: kurze Idee, optionale Vertiefung, separate Material- und Datenebene. Quellen und gestalterische Ableitung stehen in `design-system.md`. Keine proprietären Texte, Assets oder Gestaltungsmaße übernommen.

## 3. Edle-Hölzer-Abweichungen
Wärmere Produktfotografie, Mokkabraun, echte Werkstatt und persönliche Auswahlberatung. Kaufbarkeit und Werterhalt bleiben wichtiger als Architekten-Downloads.

## 4. Typography
Dokumentierter Vergleich Montserrat, Manrope, Source Sans 3, System Sans. Pilot behält Montserrat mit lokaler WOFF2. Fonts, Typestufen und Gewichte werden zentral definiert. Keine viewportskalierenden Fonts oder negativen Laufweiten.

## 5. Colors
Off-White, Anthrazit, Mokka, Salbei und eine Linienfarbe als Tokens. Alte Farben werden nicht durch globale Suchen/Ersetzen im Shopbranch verändert.

## 6. Spacing
4–128px Skala, 96px Hauptsections, 64px mobil. Preis-/Konfigurationsgruppen kompakter. Keine neuen Seitenrhythmen pro Referenz.

## 7. Grid
Drei Container. Produktdetail 3/2, Tablet 1/1, mobil gestapelt; Collection drei/vier Spalten, Tablet zwei, mobil manuelles Swipen. Englischer impliziter Column-Grid-Überlauf behoben.

## 8. Components
Header, Footer, Hero, Section, Intro, ProductCard, ProductHero, Facts, Gallery, ReadMore, Accordion, Tabs, CTA, Form, Quote, ImageText, EditorialText, Trust und Legal sind dokumentiert. Bestehende Interaktionen und Datenverträge werden weiterverwendet.

## 9. Templates
Alle 145 Sitemap-Seiten sind Home, Product Listing, Product Detail, Editorial/Guide, Service/Conversion, B2B oder Legal zugeordnet. CSV enthält Priorität und Kriterien für weitere Migration, keine erfundene automatische Bildqualitätsbewertung.

## 10. Progressive Disclosure
Inhalte bleiben im HTML. Native Details funktionieren ohne JS, ReadMore mit ARIA-Button bei Enhancement. Tabs nur bei genügend Inhalt. Keine Pflichtdaten einklappen.

## 11. Product UX
Großes quadratisches Primärbild, klarer Preis, Fakten als dl. Bestehender Etsy-CTA in Preisnähe, vorhandene Optionen unverändert. Kein zweites Shopmodell.

## 12. Mobile
375/430px, zusätzlich Tablet und Desktop. Hero 375×667 auf Beschnitt geprüft. Mobile Tabs werden native Details, keine gekappten Labels. Bildflächen bleiben stabil.

## 13. Accessibility
Sichtbare Fokuslinien, 44/48px Ziele, native Fallbacks, Tabs-Tastatur, ARIA-Zustände, Reduced Motion. Neue Mokka/Weiß-Kombination bietet hohen Kontrast. Echte Screenreader-/Safari-Prüfung offen.

## 14. Performance
Keine neue Browserlibrary. parse5/PostCSS nur Entwicklung. Font lokal rund 38KB. CSS-Legacy-Menge bleibt zunächst; Performance-Budget und endgültige Entfernung doppelter Alt-Ladepfade sind Rollout-Aufgaben, keine bereits behauptete Optimierung.

Vier bekannte doppelte CSS-Lader sind im generierten Referenz-main.js bereits begrenzt. Die indikative Netzwerkaufnahme meldet dennoch rund 57–67KB zusätzliche Transferbytes; Cross-Origin-Timings sind unvollständig. Das Performance-Akzeptanzkriterium ist noch offen, nicht stillschweigend bestanden.

## 15. SEO-Schutz
Automatische Vergleiche schützen H1, Titel, Metadaten, Canonical/Hreflang, JSON-LD, alle Haupttexte, interne Links und Formverträge. Sitemap unverändert. Pilot wird nicht indexiert.

## 16. Migrierte Referenzen
Nur im Referenzbuild: Home DE/EN, Nussbaum-Stirnholz-Produktdetail DE/EN, Pflegeguide DE/EN. Nicht migrierte Produktionsdateien sind unverändert. Sechs Referenz-URLs, drei Typen.

## 17. Verbleibende Legacy Styles
2.402 Inventarfundstellen auf main, 179 Hexfarben, 73 max-width-Werte, 30 Media-Query-Ausdrücke. Generierte Legacy-Schichten bleiben bewusst erhalten; keine Vollmigration behaupten. Kompiliertes Tresenvorschau-Bundle benötigt einen eigenen, geprüften Adapter.

## 18. Screenshots
Zwölf dauerhafte Vorher-/Nachher-Viewportbilder unter `design-reference-screenshots/`; volle 30 Seitenansichten und Bericht unter `/tmp/edle-design-system-qa/`. Review mit Links: `design-reference-review.md`.

Der Bericht der 30 Ansichten ist zusätzlich als `design-reference-qa.json` versioniert. Externer temporärer Link und seine Betriebsgrenzen stehen im Review.

## 19. Tests
112 Node-Tests bestanden. 30 Referenzansichten ohne automatische Befunde. Menü, Galerie, ReadMore und sechs No-JS-Fallbacks bestanden. Komponentenprüfseite deckt Tabs, FAQ und responsive Umschaltung ab. Keine Live-Anfragen oder Zahlungen durchgeführt.

## 20. Nächste Schritte
Phase A/B zur Abnahme bereit, Phase C/D ausdrücklich noch nicht begonnen. Nach Review: Produktdetail-Template und Generator, Listing, übrige Home-Komponenten, Maß/Atelier/Erbstück, Pflege/Aufbereitung, B2B/Gastronomie, Guides, Legal. Pro Gruppe kleine geprüfte Commits. Vor Veröffentlichung frühere bestätigte, ungespeicherte Inhalte mit dem Shopbranch abstimmen, Legacy-Audit erneut ausführen und reales iOS/Safari testen. Keine automatische DNS-/Stripe-/Preis-/Versandänderung.
