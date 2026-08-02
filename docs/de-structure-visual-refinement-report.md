# DE Structure & Visual Refinement Report

Stand: 2026-08-02

## Scope

- Deutsche Seitenstruktur, Navigation und Footer
- Startseite `/`
- Produktübersicht `/produkte.html`
- neue HTML-Themenübersicht `/sitemap-uebersicht.html`
- keine Änderungen unter `/en/`

## Startseite

| Bereich | Entscheidung | Grund |
|---|---|---|
| Produktauswahl | von sechs auf drei Beispiele reduziert | schneller erfassbarer Querschnitt aus Langholz, Stirnholz und Küchenhelfer |
| Erbstück | eigener Abschnitt direkt nach den Produkten | eigenständige Premiumwelt statt weitere Produktkarte |
| Nutzungsmomente | auf `/produkte.html` verschoben | Auswahlhilfe näher an Produktfinder und Produktgrid |
| Etsy-Erklärblock | entfernt | Bewertungen und Checkout-Hinweise liefern denselben Trust ohne zusätzliche Sektion |
| Ownership-Cards | entfernt | wiederholten die bereits erklärte Nutzungsidee |
| Maß, Aufbereitung, B2B | in einen kompakten Dreierblock verdichtet | drei abweichende Intents, ein klarer Anschlussblock |
| Werkstatt, Über uns, Bewertungen, Lieferkarte | beibehalten | Material-, Personen- und Käuferbeweis bleiben sichtbar |

## Navigation

Erste Ebene:

- Produkte
- Erbstück
- Maßanfertigung
- Über uns
- prominenter Brettfinder

Sekundäre Ziele sind in `Entdecken` gruppiert. `Shop` bleibt ein eindeutiger externer Abschlussweg. Die Navigation nutzt höchstens zwei Ebenen und basiert auf nativen Links und `details`/`summary`.

## Footer & Themenübersicht

Der Footer besteht aus drei logischen Bereichen:

- Marke
- Navigation
- Service & Recht

Die bisher im Footer verteilten SEO- und Ratgeberlinks sind weiterhin crawlbar und wurden unter `/sitemap-uebersicht.html` nach Produkten, Holzarten, Details, Pflege, Geschenken und Werkstatt gruppiert. Die URL ist in `sitemap.xml` enthalten und auf allen deutschen Seiten verlinkt.

## Bilddarstellung

- Homepage-Produktmedien: stabiles Quadrat, Desktop 399 × 399 px, Mobile 318 × 318 px
- mobile Produktreihe: feste Kartenbreite und Scroll-Snap, keine Höhenwechsel
- Erbstück-Medium: stabiles Seitenverhältnis 3:2, Desktop 696 × 464 px, Mobile 366 × 244 px
- Werkstattbilder: bestehende responsive Quellen und feste Container beibehalten
- `object-fit` und produktspezifische Fokuspositionen des bestehenden Produktgrids werden weiterverwendet
- kein horizontaler Seiten-Overflow bei 390 px

## SEO & Accessibility

- bestehende URLs und Canonicals unverändert
- keine englischen Dateien geändert
- Themenübersicht mit Self-Canonical, eindeutigen Meta-Daten und `CollectionPage`-Markup
- alle internen Ziele geprüft: keine fehlenden Dateien
- Menü schließt per Link, Backdrop, Close-Button und Escape; Body-Scroll wird gesperrt
- Inhalte bleiben ohne JavaScript sichtbar; Reveal bleibt Progressive Enhancement

## Checks

- `git diff --check`: bestanden
- `npm run audit:indexability`: bestanden, 52 HTML-Dateien, 47 indexierbare Canonicals, 47 Sitemap-URLs
- `npm run audit:assets`: bestanden; bekannte nicht blockierende Warnung für das 11,5-MB-Hero-Video
- `npm run audit:products`: keine kritischen Fehler; bestehende Klassifikationswarnungen unverändert
- interne Linkprüfung: 0 tote lokale Ziele
- Responsive: 390 × 844 und 1440 × 1000 geprüft; keine horizontale Scrollbar

## Offenes Risiko

Das Hero-Video bleibt mit rund 11,5 MB der größte Performance-Hebel. Es wurde in diesem eng begrenzten Struktur-PR nicht verändert, weil eine erneute Kompression visuell separat abgenommen werden sollte.
