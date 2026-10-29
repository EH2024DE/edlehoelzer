# Website-Stand und verkauftes rechteckiges 3D-Brett

FORTSCHREIBUNG: Dieser Bericht beschreibt den Stand vor dem naechtlichen
Abschlussauftrag. Aktueller Umsetzungsstand, bestaetigte Produktdaten, statischer
Release-Build und verbleibende Freigaben: website-abschluss-2026-10-29.md.
Insbesondere sind Katalogfilter und Suchanbindung inzwischen umgesetzt; die
fruehere Aussage zur fehlenden Produktabdeckung der Suche wurde dort korrigiert.

29.10.2026. Aenderungen lokal/in der Vorschau, noch nicht auf dem Live-Auftritt.

## Verfuegbarkeit

Inhaber bestaetigt: Das rechteckige 3D-Stirnholzbrett 48,5 x 35,3 x 4 cm,
Listing 1803930088, ist verkauft. Zentral stock:0, active:false, featured:false,
availabilityStatus:sold, inspirationOnly:true, visibility:archive.

Es erscheint nicht mehr unter den aktiven Kollektionsangeboten oder im Finder.
Der Server lehnt auch direkte Warenkorb-/Preisberechnungsversuche ab. Im optionalen
Archiv bleibt es sichtbar. DE-/EN-Produktseite mit verkauftem Status, ohne aktives
Offer-Markup oder Kauf-CTA, mit Anfrageweg fuer ein aehnliches Brett.

Das quadratische 3D-Brett 46 x 46 x 5 cm, Listing 1776273564, bleibt unveraendert
verfuegbar und in der Vierer-Auswahl auf der Startseite.

Die Tresenvorschau liest den zentralen Verkaufsstatus: passende verkaufte Modelle
werden in der Auswahl deaktiviert/ausgeblendet. Ein Direktlink mit der verkauften
Listing-ID fuehrt auf die archivierte Produktseite. Keine Etsy-Aenderung vorgenommen.

Nur diese beiden Sprachversionen der Produktseite wurden neu generiert. Der
Generator unterstuetzt dafuer --listing; andere Produktseiten und die Sitemap
werden bei dieser gezielten Aktualisierung nicht neu geschrieben.

## Aktueller Pruefumfang

- 145 Sitemap-URLs: erreichbar, keine JavaScript-Ladeausnahmen und kein horizontaler
  Ueberlauf bei 375 px. 92 Produktseiten, 53 weitere kanonische Seiten.
- 154 lokale Medien-/Skriptverweise: erreichbar.
- Indexierbarkeit der statischen Quellen: 166 HTML-Dateien, 145 indexierbare
  selbstkanonische Seiten, 145 Sitemap-Adressen. Archiv-URL bewusst erhalten.
- Interne statische Abschnittslinks ohne fehlende Ziele.
- 178 Node-Tests bestanden. Zusaetzlicher DE-/EN-Browsertest prueft aktive Auswahl,
  Archiv, Kaufblockade, quadratisches Brett und Direktlink aus der Tresen-App.
- Design-/Bildformat-Audit ueber die Sitemap-Seiten erneut ausgefuehrt. Ein
  automatischer Audit ersetzt keine manuelle Einzelabnahme jeder Scrollposition.

## Was noch nicht fertig ist

1. Produktionsuebernahme des neuen Designs: Die umfassende Gestaltung arbeitet
   weiterhin ueber den Vorschau-Adapter. Die freigegebenen Aenderungen muessen in
   den statischen Produktions-Build uebertragen werden. Die Live-Seite ist nicht
   allein durch die Vorschau bereits auf das neue Design umgestellt.
2. Einheitlicher Katalog: Die Atelier-Kollektion hat die sechs kuratierten Gruppen;
   /produkte.html und /en/products.html besitzen noch die alten technischen
   Kategorie-Selects board/accessory/care. Sichtbare Navigation und Filter muessen
   vereinheitlicht werden, ohne die technischen Kategorien zu ersetzen.
3. Interne Website-Suche: assets/search-pages.json enthaelt 45 Eintraege und keine
   separaten Produktseiten. Die Produktseiten sind in der XML-Sitemap vorhanden;
   das ist kein Nachweis fehlender Google-Indexierung. Die interne Suche deckt sie
   aber noch nicht ab und muss bei der Produktionsuebernahme aktualisiert werden.
4. Inhaltlicher Feinschliff: Eiche, Nussbaum, Massivholz, Bauweisen, Massanfertigung,
   Gravur und einige Geschenkratgeber sind noch deutlich umfangreicher als die
   ueberarbeitete Aufbereitungsseite. Abschnittsaufgaben und wiederholte CTAs
   redaktionell pruefen, nicht allein anhand der Anzahl von Ueberschriften kuerzen.
5. Wiederverwendete Fotos: Nussbaumseite, Oel-Ratgeber und Made-in-Germany-Seite
   enthalten einzelne doppelte Motive. Teilweise sind es unterschiedliche Kontexte.
   Herkunftsfoto im Erbstueck ist bewusst auch ein Fertigungsschritt; die inaktive
   Diashow wird vom statischen Quelltext-Audit mitgezaehlt. Keine pauschale Loeschung.

## Vor echtem Stripe-Livebetrieb

- Widerspruch bei Laerche kompakt: verfuegbar/aktiv, aber stock:0.
- Noch offene exakte No.004-Masse und nicht bestaetigte Variantenbestaende.
- Verbindliche Versandpreise und Absicherung nach verpackten Massen/Gewichten.
- Echter Stripe-Sandbox-Durchlauf im angeschlossenen Konto mit Webhook,
  Bestellbestaetigung, Bestand und Benachrichtigung.
- Geschuetztes Backend-Hosting, Secrets und ausdrueckliche Live-Freigabe.

Fazit: Die Vorschau ist breit im neuen Design abgedeckt, aber die gesamte Website
ist noch nicht als finaler Produktionsstand freigegeben. Vorrangig sind jetzt
Produktionsuebernahme und Katalog-/Suchkonsistenz; danach Stripe-End-to-End und PR.
