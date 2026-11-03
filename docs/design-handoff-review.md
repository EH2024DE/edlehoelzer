# Design-Übergabe: 3. November 2026

## Letzte Rückmeldungen

- Erbstück: keine schwebenden Schnellzugriffe mehr über dem Lesetext, in DE und EN. Bestehende Inline-Aktionen bleiben vorhanden und verwenden kompakte 44-px-Buttons mit 16-px-Schrift.
- Startseiten DE/EN: dezente Scroll-Reveals wiederhergestellt (420 ms, 12 px). Nur unterhalb des ersten Viewports liegende Abschnitte werden vorbereitet. Inhalte bleiben im DOM, ohne JavaScript vollständig sichtbar, per Tastatur sofort sichtbar und mit reduzierter Bewegung ohne Animation. Kein Verzögern kaufrelevanter Hero-Inhalte.
- Baumspende: verbleibende Kapazität für Saison 2026 auf zwei gesetzt, sowohl im JS-Konfigurationswert als auch in beiden statischen Anzeigen. Das Saisonmaximum von acht bleibt unverändert. Gemeinsame Container, neutrale Flächen und ruhige Typografie auch auf dieser Seite; kein separater alter Card-/Shadow-Look.

## Vollständigkeit und QA

- 145 Sitemap-URLs vollständig im generierten Design-Artefakt enthalten, insgesamt 148 öffentliche Seiten.
- 296 Browseransichten (alle 148 Seiten bei 375/1440 px) ohne automatische Befunde zu Schrift, Festflächenkontrast, Überlauf, fehlenden/verzerrten Bildern oder Seitenfehlern.
- Startseiten-Reveals, Reduced Motion, Erbstück-CTA-Größen und Baumspenden-Zähler zusätzlich bei 375, 430, 768, 1024 und 1440 px geprüft, einschließlich No-JS-Fallback.
- 123 Node-Tests bestanden; Metadaten, H1, Inhalte und Formverträge weiterhin überprüft.
- Neue statische Linkprüfung: null fehlende interne Ziele und null fehlende Sprungmarken nach Reparatur. Bericht: `docs/design-link-audit.json`.
- Die Linkprüfung fand gemeinsame alte Fehler in den englischen Produktheadern: lokaler statt katalogbezogener Finder-Anker und falscher deutscher Anker auf der englischen Produktübersicht. Korrekturen sind auf diese href-Attribute beschränkt. Der Produktgenerator erzeugt künftig die richtigen Ziele.
- Englische individuelle Anfragen verweisen per E-Mail statt auf die nicht vorhandene URL `/en/custom-cutting-board/`. Das ist ein funktionierender Kontaktweg, keine vorgetäuschte fertige englische Maß-Landingpage.

## Auslieferung und Grenzen

Zur Freigabe gehört der statische Output von `node scripts/build-design-site.mjs`,
nicht die unveränderten historischen Rohstyles. Der CI-Workflow erzeugt und prüft
dieses Artefakt; er schaltet keinen Checkout frei und veröffentlicht nicht automatisch.

Shop/Stripe, DNS, Live-Zahlungen und externe Formularübermittlung wurden nicht geändert.
Die bereits bestätigten Produktdatenänderungen des vorherigen Batches bleiben enthalten.
Baumspenden-Kapazität ist eine gepflegte Anzeige, kein serverseitiges Reservierungssystem.

Noch nicht als abgeschlossen behauptet: echte iPhone-/Safari-Abnahme, vollständiger
Screenreader-Test und Produktions-Performance-Messung. Automatische QA ist kein
Beweis für makellose Darstellung in jedem Browser. Weitere eigenständige englische
Landingpage-Übersetzungen sind ein getrennter Inhaltsdurchgang.
