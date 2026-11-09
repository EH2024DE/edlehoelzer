# Technischer Feinschliff, 9. November 2026

## Bilddateien

Sechs vorhandene oeffentliche JPEGs wurden technisch optimiert, ohne neue
Bildinhalte, Ausschnitte oder KI-Bearbeitung. Farben wurden nach sRGB ueberfuehrt;
EXIF/XMP/IPTC-Metadaten entfernt. Fuenf Motive behalten exakt ihre Pixelmasse.
Nur das 3000-px-Bewertungsfoto wurde auf 2400 x 1800 px verkleinert.

| Dateien | Vorher | Nachher |
| --- | ---: | ---: |
| Geschenkset, 800 / 1200 | 550.810 B | 269.934 B |
| Kuechenutensilien, 800 / 1200 | 222.871 B | 127.280 B |
| Kuechentresen-Beispiel | 283.083 B | 165.174 B |
| Bewertungsfoto | 800.874 B | 404.212 B |
| Gesamt | 1.857.638 B | 966.600 B |

Ersparnis: 891.038 Bytes, rund 48 Prozent fuer diese Dateien. Das ist kein
Versprechen fuer die gesamte Seitenladezeit. Die mittlere absolute Abweichung
der RGB-Kanaele zur gleich skalierten Vorlage liegt zwischen 1,2 und 2,5 von 255.
Visuelle Abnahme und feste Bildbudgets ergaenzen diesen technischen Vergleich.

Reproduzierbar mit `scripts/optimize-public-images.cjs 9568fad` und lokalem Sharp
ueber `SHARP_MODULE`. Das Skript liest die Originale aus dieser Git-Revision,
damit ein erneuter Lauf nicht bereits komprimierte Bilder nochmals komprimiert.

## Stabile Bildgeometrie

Die statischen Produktbilder der Tresenvorschau haben jetzt ihre tatsaechlichen
Breiten und Hoehen sowie explizites Lade-/Dekodierverhalten. Quell-App und
veroeffentlichte Vorschau sind entsprechend gleich angepasst. Das lokale
Tresenfoto hat absichtlich keine erfundenen Pixelmasse: Diese ergeben sich erst
aus dem privaten Upload. Seine Buehne reserviert den Platz bereits per CSS.
Keine Aenderung an Papiererkennung, Geometrie oder Kalibrierung.

## Englische Startseite

Rollen und persoenliche Vorstellung bleiben direkt sichtbar. Zusaetzliche
Hintergrundabsaetze und die laengere Gruendungseinleitung sind aufklappbar.
Die Originaltexte bleiben vollstaendig im HTML und ohne JavaScript ueber native
Details erreichbar. Deutsche Inhalte, Suchmetadaten und Preislogik bleiben
unveraendert. Die Seite muss nicht durch Textverlust auf dieselbe Hoehe wie die
deutsche Fassung gezwungen werden.

## Resthinweise

Der Medienaudit sinkt von 25 auf 5 Hinweise, ohne kritische Fehler:

- Drei vorhandene Medien ohne erkannte statische Referenz bleiben erhalten.
  Eine fehlende statische Fundstelle ist kein Beweis, dass sie geloescht werden
  duerfen.
- Zwei Hinweise betreffen das dynamische private Tresenfoto in Quell-App und
  veroeffentlichter App. Keine falschen Masse nur zur Beruhigung eines Audits.

Echte iPhone-/Safari-Abnahme, messbare Conversion-Auswertung und freigegebene
Unternehmensreferenzen bleiben externe Abnahmepunkte. Kein Live-Shop-, Stripe-,
Preis-, DNS- oder Rechtstext-Eingriff in dieser Runde.

## Abnahme

- 38 Designsystem-/Audit-Tests bestanden; Suchmetadaten, Texte und Formvertraege
  bleiben abgesichert.
- Startseiten in DE/EN bei 375, 430, 768 und 1440 px geprueft, einschliesslich
  Bildproportionen, Preisabstaenden, aufklappbaren Inhalten und ohne JavaScript.
- Tresenvorschau bei 375 und 1440 px: sichtbares, nichtleeres 3D-Canvas und
  nachweislich veraenderte Bildpixel nach Drehung.
- 16 Modell-/Geometrietests und 5 Referenzqualitaetstests bestanden. Keine
  Aenderung an den Erkennungsalgorithmen.
- 150 Seiten ohne fehlende interne Ziele oder Fragmente; 147 indexierbare
  Sitemap-Seiten mit korrekten Kanonischen URLs.
- Zusaetzlich WebKit 26.5: Startseiten bei allen vier Breiten sowie 24 Ansichten
  der Audit-Seiten bestanden. Preisraster, Portraets, Details, Navigation,
  Formulare und Kaufleiste damit auch Safari-nah getestet. Das ist keine
  physische iPhone-Abnahme und keine Messung realer Mobilfunk-Ladezeiten.
- Browserpruefungen lassen sich mit `BROWSER_ENGINE=webkit` wiederholen;
  Chromium bleibt Standard. Der Medienaudit ignoriert installierte
  `node_modules` statt Abhaengigkeiten als Website-Inhalte zu durchsuchen.
