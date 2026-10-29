# Gestaltungsprobe: Kollektion und Erbstueck

Isolierte Designprobe nach Freigabe des Inhabers, inspiriert von den recherchierten
Prinzipien von ZEITRAUM: ruhige Hierarchie, klare Schrift und produktbezogene Bilder.
Kein kopiertes Layout, keine neue globale Gestaltung und kein Live-Checkout.

## Seiten und Aufbau

- /atelier-vorschau/ und /en/atelier-preview/: alle 46 kanonischen Produkte;
  40 aktuell verfuegbare oder bestellbare Stuecke, sechs vergebene standardmaessig
  ausgeblendet und per Checkbox zugaenglich. Sechs Gruppen und Textsuche.
- /atelier-vorschau/erbstueck/ und /en/atelier-preview/erbstueck/: No. 004 als
  konkretes Produktbeispiel, zehn vorhandene Originalfotos, Vollbilddialog,
  gemeinsame Produktoptionen und derselbe Vorschau-Warenkorb.
- Die uebrigen Kollektionskarten fuehren zur konkreten Produktkonfiguration in
  der vorhandenen Shop-Vorschau. Nur No. 004 hat bislang das neue Detail-Layout.
- Kopfzeile, Sprachwechsel und Kollektion/Erbstueck/XXL-Wege sind verbunden.
- Bestehende Artikel im Warenkorb bleiben erhalten. Bearbeiten eines anderen
  Artikels fuehrt zur passenden Konfiguration mit vorausgewaehlter Warenkorbzeile.

## Gestaltungsentscheidungen

Helle, leicht getoente Flaechen, Graphit, gezielte Moos- und Mokka-Akzente.
Eine selbst gehostete Montserrat fuer die Gestaltungsprobe, keine duennen
Luxus-Schriften, kein Sperrsatz, keine Goldornamente oder Rahmenkarten.
Quadratische Bilder, stabile Abstaende, keine ausgedachten Studiofreisteller.
Die warmen Originalfotos bilden bewusst den Gegenpol zur ruhigen Oberflaeche.

Uebersicht ohne Formularwand; Bild, Name, Material/Masse und Preis sind sichtbar.
Die erste Reihe ist eine redaktionelle Auswahl aus Erbstueck, Nussbaum und
Stirnholz mit Griffen. Keine Bestseller- oder Verkaufszahlenbehauptung.

Auf der Produktseite: grosse Galerie, kompakter Kaufbereich, aufgeklaerte
Maessituation und vollstaendiger Lieferumfang. Die Darstellung verwendet dafuer
die bestehende zentrale productPackageItems-Regel, damit Halter, Balsam und
Anleitung nicht durch ausschliessliche Darstellung expliziter Teilpositionen fehlen.
Mengenfeld bei einem Einzelstueck visuell ausgeblendet; Limit bleibt technisch aktiv.
Tresenansicht ist als klarer Link zur bestehenden Produktions-Visualisierung
erreichbar (neuer Tab), keine neue Foto-Upload-Verarbeitung implementiert.

No. 004 hat aktuell kein hinterlegtes Video. Keine Ersatzvideos erfunden. Die
Gestaltungsprobe darf nicht ohne Erweiterung der Medienlogik auf andere
Detailprodukte mit Videos ausgerollt werden; dort gilt weiter Video an Position 2.

## Technischer Umfang

Generator: node scripts/build-atelier-preview.mjs
Erwartet zuvor generierte Shop-Vorschau: node scripts/build-shop-preview.mjs
Neue CSS/JS-Dateien sind nur an den vier Designseiten eingebunden.
Kein styles.css- oder Homepage-Rollout. Bestehende Produktionskanonicals,
Produktpfade, Preise, Bestand und Checkout-Schutz bleiben erhalten.
Alle vier Seiten: noindex,nofollow und restriktive Vorschau-Serverheader.
Keine neuen Drittanbieter-Skripte, Analytics oder Shop-CDN-Abhaengigkeiten.

Die Linkfokussierung der bestehenden Shop-Vorschau per ?product= wurde fuer
die Uebergaenge ergaenzt. Ein sichtbarer Rueckweg zum vollstaendigen Sortiment
ist auch auf Mobile vorhanden. Explizite No.-004-Designseite ignoriert fremde
Produkt-Query-Overrides, damit keine falsche Produktgeschichte entsteht.

## Pruefung und Grenzen

- 40 Shop-Tests, 114 CJS-Tests, 32 Python-Tests bestanden.
- DE/EN, Kollektion und Detail bei 375, 430, 768, 1024 und 1440 px geprueft.
- Filter, Archiv, Leerzustand, echte Bilder, Galerie, Bildvergroesserung/Escape,
  Lieferumfang, Warenkorbsumme, Einzelstueck-Limit und Demo-Checkout getestet.
- Separater Test fuer geteilten Warenkorb und artikeluebergreifende Bearbeitung.
- Indexierbarkeitspruefung: 164 HTML-Dateien, unveraendert 145 indexierbare Seiten
  und 145 Sitemap-URLs. Keine Indexierung der Designprobe vorgesehen.
- Kein echter Mobilgeraete-Test, keine gemessene Conversion-Verbesserung.
- Bestehende Freigabepunkte fuer Live-Zahlung, Datenschutz und Bestand gelten weiter.

Die temporaeren externen Links haengen weiterhin am eingeschalteten und
verbundenen Vorschau-Rechner. Kein dauerhaftes oeffentliches Hosting eingerichtet.
