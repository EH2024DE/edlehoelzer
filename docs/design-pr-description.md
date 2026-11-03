## Ziel

Ein gemeinsames ruhiges Designsystem für Edle Hölzer, mit zentralen Tokens,
lokaler Sans-Typografie, konsistenten Bildrahmen, Buttons, Formularen und
progressiven Inhaltskomponenten. ZEITRAUM ist strukturelle Inspiration,
keine kopierte Gestaltung. Kein Stripe-/Cloudflare-Shop-Launch.

## Enthalten

- Statischer Design-Build für alle 145 Sitemap-URLs und insgesamt 148 öffentliche Seiten, mit isolierten Legacy-Styles und gemeinsamen Komponenten.
- Überarbeitete Startseite, Produktdarstellung, Erbstück-Story und Fertigungsbilder, Maß-/Service-Inhalte und mobile Vergleiche. Historische Seiteninhalte bleiben geschützt; nur ausdrücklich bestätigte Korrekturen und Ergänzungen sind enthalten.
- Kompakte Erbstück-Aktionen ohne schwebende Textüberdeckung; dezente Scroll-Reveals auf DE/EN-Startseiten, ohne JS und bei Reduced Motion vollständig sichtbar.
- Einfache Icon-Play-Buttons, animierte native Details/FAQ/ReadMore, Keyboard-/Reduced-Motion-Unterstützung.
- Zeilenweise bündige Katalogpreise und Aktionen; automatische Finder-Navigation repariert.
- Drei generische Saftrillenschemata und Auswahl nach Anhaken, jeweils bestehender Aufpreis 15 Euro; keine zusätzliche Option bei zu dünnen/ungeeigneten Servierbrettern oder bereits vorhandener Saftrille.
- Bestätigte Datenkorrekturen: alle fünf kleinen Stirnholz-Ausführungen verkauft; Baumspenden-Saison 2026 noch zwei Plätze. Keine weiteren Bestände oder Preise geändert.
- Defekte englische Finder-Anker und interne Kontaktlinks repariert. Für individuelle englische Anfragen derzeit E-Mail statt einer nicht existierenden Landingpage.

## Prüfungen

- 123 Node-Tests bestanden.
- 296 Browseransichten: alle 148 Seiten bei 375 und 1440 px ohne automatische Befunde.
- Funktionsprüfungen bei 375, 430, 768, 1024 und 1440 px für Finder, Katalogausrichtung, Optionen, Erbstück-CTA, Baumspende und Startseiten-Reveals.
- DE/EN, Keyboard, Reduced Motion, schnelle Disclosure-Richtungswechsel und No-JS-Fallback geprüft.
- Generierter Legacy-Audit: null Befunde; interne Linkprüfung: null fehlende Ziele/Fragmente.
- Indexability: 158 HTML-Dateien, 145 selbstkanonische indexierbare Seiten, 145 Sitemap-URLs, bestanden.
- `git diff --check` bestanden.

Berichte und Screenshots liegen in `docs/design-system-migration-report.md`,
`docs/design-handoff-review.md`, `docs/design-handoff-qa.json` und den
zugehörigen Komponentenreviews.

## Auslieferung / Freigabegrenzen

Die neue Darstellung ist der Output von `node scripts/build-design-site.mjs`,
nicht ein direktes Deployment der historischen Rohdateien. Der CI-Workflow
baut, prüft und speichert das Artefakt **ohne automatische Veröffentlichung**.

Keine DNS-Änderung, keine Live-Zahlung, keine Shop-Freischaltung, keine neuen
Stripe-Preise oder Versandregeln. Die Saftrillenform wird für die aktuelle
Etsy-Abwicklung nicht automatisch übertragen; der sichtbare Hinweis fordert
zur Bestätigung auf Etsy auf. Für einen späteren Shop muss diese Auswahl
serverseitig validiert und in die Bestellung übernommen werden.

Vor Produktionsveröffentlichung verbleiben echte iPhone-/Safari-Stichprobe,
Screenreader-Prüfung, Produktions-Performance-Messung und die ausdrückliche
Deployment-Freigabe. Vollständige zusätzliche englische Landingpages sind ein
separater Inhaltsdurchgang; funktionierende Anfragewege sind vorhanden.
