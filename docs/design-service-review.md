# Aufbereitung: Vergleich statt Textpakete

## Korrektur der Methode
Der globale CSS-Rollout hatte die technische Typografie vereinheitlicht, aber die funktionale Unterscheidung der Angebote eingeebnet. Automatische Kontrastmessung erkennt keine fehlende Angebots-Hierarchie. Die frühere Aussage „finalisiert“ war deshalb als visuelle Abnahme zu weitgehend.

Künftig wird je Seitentyp zuerst die konkrete Nutzerentscheidung festgelegt. Danach werden Inhalte nach dieser Entscheidung geordnet und eine reale mobile Referenzkomponente visuell geprüft. Erst nach dieser Prüfung folgt die Übertragung auf ähnliche Seiten. Technische Tests bleiben ein Sicherheitsnetz, kein Ersatz für die gestalterische Abnahme. Der Nutzer muss nicht 148 Seiten einzeln kontrollieren; er beurteilt die wenigen Referenzmuster, wir kontrollieren deren Übertragung.

## Umsetzung dieser Referenz
- Gemeinsamer Vergleich statt drei langer, vertikal gestapelter Beschreibungen.
- Drei farblich getrennte Spalten: Selbstpflege, Auffrischung, Generalüberholung.
- Gleiche Kriterien: eigene Arbeitszeit, Oberflächenarbeit, zusätzliche Schadensarbeiten, Pflegebalsam.
- Höchstes Paket enthält sichtbar die Auffrischung plus zusätzliche Arbeiten nach Prüfung.
- Bestehende Werkstattpreise unverändert: 41/51/64 und 95/124/154 Euro. Balsam ab 9,99 Euro; Leinölfirnis-Orientierung bis 20 Euro entsprechend Nutzerangabe.
- Liefer-/Versandbedingungen und Ausschlüsse bleiben sichtbar. Vollständige Alttexte, Preisstaffeln und Leistungen sind in nativen Details weiterhin erreichbar, auch ohne JS.
- DE und EN verwenden dieselbe Komponente. Auf 390px ist die eigentliche Vergleichstabelle rund 471px hoch; einschließlich Hinweisen rund 675px.
- Während der Vergleich im sichtbaren Bereich steht, werden feste Kontaktleiste, WhatsApp-Float und Nach-oben-Button ausgeblendet. Sie dürfen keine Leistungen oder Hinweise überdecken.

## Prüfung und Grenzen
Fünf Breiten 375/390/430/768/1440px, jeweils DE/EN. Drei unterschiedliche Headerfarben, kein abgeschnittener Zelltext, Enter-Bedienung und No-JS-Fallback geprüft. Zusätzlicher Kontrast-/Überlaufscan der beiden Seiten. Maschinenlesbare Messwerte: `design-service-comparison-qa.json`. Screenshots: `design-service-screenshots/`.

Eine simulierte iPhone-14-Viewportgröße ist kein Test auf echter iOS-Hardware. Keine gemessene Conversionsteigerung wird behauptet. Keine Veröffentlichung oder Shopänderung.

Vorschau: https://accompanying-sends-built-sentences.trycloudflare.com/schneidebrett-aufbereiten/#paketvergleich
