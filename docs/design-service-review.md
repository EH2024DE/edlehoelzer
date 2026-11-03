# Aufbereitung: kompakte Paketkarten

## Korrektur der Methode
Der globale CSS-Rollout hatte die technische Typografie vereinheitlicht, aber die funktionale Unterscheidung der Angebote eingeebnet. Automatische Kontrastmessung erkennt keine fehlende Angebots-Hierarchie. Die frühere Aussage „finalisiert“ war deshalb als visuelle Abnahme zu weitgehend.

Künftig wird je Seitentyp zuerst die konkrete Nutzerentscheidung festgelegt. Danach werden Inhalte nach dieser Entscheidung geordnet und eine reale mobile Referenzkomponente visuell geprüft. Erst nach dieser Prüfung folgt die Übertragung auf ähnliche Seiten. Technische Tests bleiben ein Sicherheitsnetz, kein Ersatz für die gestalterische Abnahme. Der Nutzer muss nicht 148 Seiten einzeln kontrollieren; er beurteilt die wenigen Referenzmuster, wir kontrollieren deren Übertragung.

## Umsetzung dieser Referenz
- Die zuvor erstellte Farbtabelle ist nach Nutzerfeedback verworfen, nicht weiter ausgebaut.
- Drei neutrale Paketkarten mit identischer Reihenfolge: Name/Preis, kurze Einordnung, aufklappbares Leistungsspektrum. Desktop nebeneinander, Mobile und Tablet untereinander.
- Apple-Referenzen liefern das Prinzip kurzer Leistungsstufen, nicht deren Farben, Markenelemente oder exakte Layoutmaße.
- Selbst machen: eigene Arbeitszeit; Schleifpapier nach Bedarf, Leinöl, trockenes Baumwolltuch und Spülmittel. Kein vorgeschriebener Kauf unseres Balsams.
- Auffrischung: Oberflächenarbeit ohne Reparaturen und ohne Dose Pflegebalsam für zu Hause. Aufgebrachtes Finish ist von einer mitgelieferten Dose unterschieden.
- Generalüberholung: Auffrischung plus geeignete zusätzliche Arbeiten nach Prüfung; nur hier eine Dose Pflegebalsam für zu Hause inklusive.
- Bestehende Werkstattpreise unverändert: 41/51/64 und 95/124/154 Euro. Die falschen Gratis-Balsam-Angaben wurden auch in den ursprünglichen DE-Beschreibungen korrigiert.
- Riss-Simulation aus dem HTML entfernt. Versandbedingungen und Grenzen bleiben sichtbar, Details ohne JS erreichbar.
- Während der Vergleich im sichtbaren Bereich steht, werden feste Kontaktleiste, WhatsApp-Float und Nach-oben-Button ausgeblendet. Sie dürfen keine Leistungen oder Hinweise überdecken.

## Prüfung und Grenzen
Fünf Breiten 375/390/430/768/1440px, jeweils DE/EN. Drei Karten ohne Tabelle, keine abgeschnittenen Überschriften oder Preise, Enter-Bedienung und No-JS-Fallback. Ein eigener Inhaltstest verhindert erneut eine mitgelieferte Dose beim Auffrischungsservice. Zusätzlicher Kontrast-/Überlaufscan der beiden Seiten. Messwerte: `design-service-comparison-qa.json`. Screenshots: `design-service-screenshots/`.

Eine simulierte iPhone-14-Viewportgröße ist kein Test auf echter iOS-Hardware. Keine gemessene Conversionsteigerung wird behauptet. Keine Veröffentlichung oder Shopänderung.

Vorschau: https://accompanying-sends-built-sentences.trycloudflare.com/schneidebrett-aufbereiten/#paketvergleich
