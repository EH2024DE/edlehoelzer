# Startseiten: deutsche Baseline und offener Arbeitsstand

Diese Runde ersetzt die fruehere englische Sonderstruktur bewusst durch die
deutsche Baseline. Die alte englische Trust-Bar und zusaetzliche Kampagnenbloecke
entfallen. Die vorherige progressive Verpackung dieser Altinhalte ist damit
ueberholt; sie bleibt nicht als zweite Startseiten-Generation bestehen.

## Umgesetzt

- Gleiche neun Abschnitte in DE und EN: Hero, Produkte, Tresenvorschau,
  Material/Handwerk/Werterhalt, Erbstueck, Bewertungen, Menschen,
  Aufbereitung, Abschluss mit hellem Werkstattfoto.
- Gleiche Medien, Klassen und Zahl primaerer Aktionen je Abschnitt.
  Ein Regressionstest prueft diese strukturelle Paritaet direkt.
- Gleiche knappe Rollenbeschreibungen und manuell swipebare Portraets.
- Historische englische Anker bleiben als Kompatibilitaetsanker erhalten.
  Nicht vorhandene englische Atelier-/Geschenk-/B2B-Seiten werden nicht
  vorgetaeuscht: Verweise auf reale deutsche Seiten sind mit DE gekennzeichnet.
- Auf beiden Startseiten sichtbarer direkter Sprachlink im Header: EN auf
  Deutsch, DE auf Englisch. Kein zusaetzliches Sprachmenue im Hamburger.
  Mittiges Logo, 44-px-Sprachziel, Suche und Menue bleiben erhalten.
- Etsy-Zahlen am 09.11.2026 erneut per API gelesen: 82 Verkaeufe, 39 Bewertungen,
  Durchschnitt 5,0. Quelle bleibt `data/reviews-meta.json`; keine alte
  hardcodierte Verkaufszahl mehr im Startseiten-Markup. Bewertungen bleiben
  ausserhalb des Hero.

## Bestand je Holzart: unabhaengig vom Direktshop

Der aktuelle Abgleich liefert die Gesamtmenge eines Etsy-Listings. Er sagt
nicht, wie viele Teigschaber aus Nussbaum oder Pfannenwender mit schraeger Kante
verfuegbar sind. Die Website benennt deshalb nun ausdruecklich den Gesamtbestand
und verweist bei mehreren Ausfuehrungen auf die Pruefung der Holzart im Angebot.

Eine Variantenanzeige kann bereits fuer die Website umgesetzt werden und muss
nicht auf Stripe warten. Voraussetzung sind belastbare Daten mit Holzart,
gegebenenfalls Kantenform, Aktivstatus und Menge. Gemeinsame Lagerbestaende
duerfen nicht ueber Gravuroptionen hinweg doppelt addiert werden.

Lesetest mit der lokal vorhandenen Freigabe am 09.11.2026: Die Variantenabfrage
fuer Teigschaber, Pfannenwender, Buttermesser, Halter und das kombinierte
Brettlisting wird aktuell mit HTTP 401 abgewiesen. Keine Katalog- oder
Etsy-Aenderungen wurden dabei vorgenommen. Eine funktionierende erneuerte
Etsy-Lesefreigabe ist erforderlich; keine Passwoerter oder Tokens in den Chat.

Referenz: [Etsy getListingInventory](https://developer.etsy.com/documentation/reference/#operation/getListingInventory),
benoetigt OAuth mit `listings_r`. Sicherer lokaler Diagnoselauf:
`node scripts/inspect-etsy-wood-stock.cjs`. Ausgabe enthaelt keine Zugangsdaten,
Kaeuferdaten, Transaktionsdaten oder SKU-Werte. Lokale Ergebnisse bleiben in
`logs/` ausserhalb des Commits.

## Naechste Aufgaben

1. Funktionierenden Etsy-Varianten-Lesezugriff herstellen, Holzarten/Kanten
   eindeutig zuordnen und einen datierten Bestandsstand je Ausfuehrung anzeigen.
   Nicht als Live-Reservierung bezeichnen.
2. Verbleibende englische Unterseiten strukturell gegen ihre deutsche Version
   abgleichen. Insbesondere fehlen eigene EN-Zielseiten fuer Atelier und
   Firmengeschenke; die Startseiten selbst sind jetzt angeglichen.
3. Regelmaessigen Review-/Bestandsabgleich verbindlich organisieren. Derzeit
   gibt es CLI-Abgleiche und datierte Snapshots, aber keinen neu eingerichteten
   unbeaufsichtigten Synchronisierungsdienst. Zentralisierung verhindert
   widerspruechliche Zahlen, ersetzt aber keinen frischen Abruf.
4. Redaktionellen Feinschliff mit echten Werkstattangaben und freigegebenen
   B2B-Referenzen abschliessen. Keine erfundenen Fertigungsstunden, Zitate,
   Weihnachtsfristen oder Garantieversprechen.
5. Nach Merge die tatsaechlich veroeffentlichten Seiten kontrollieren; echte
   iPhone-Bedienung und Mobilfunk-Ladezeiten abschliessend pruefen. Chromium-
   und WebKit-Pruefungen ersetzen diese reale Abnahme nicht vollstaendig.
6. Bestehende Analyseereignisse nach einer ausreichenden Messperiode auswerten,
   ohne Etsy-Klicks als bestaetigte Verkaeufe auszugeben.

## Explizit zurueckgestellt

Der Direktshop ist auf Wunsch des Inhabers bis ins neue Jahr zurueckgestellt.
Stripe, Bestellmails, manuelle Zahlungsannahme, Checkout und Bestandsreservierung
werden in dieser Runde nicht weiter implementiert oder live aktiviert.

## Pruefung

39 Design-/Inhalts-/Paritaetstests bestanden. Startseiten mit Chromium und WebKit
bei 320, 375, 430, 768 und 1440 px geprueft: sichtbarer Sprachlink, korrektes
Sprachziel, mittiges Logo auf Mobile, keine sich ueberlappenden Headeraktionen,
kein doppeltes Sprachmenue, keine separate Trust-Bar, ausgerichtete Preise,
unverzerrte Portraets und gleicher aktueller Verkaufsstand. Ohne JavaScript
bleiben statische Produkte und Sprachlinks erreichbar. 150 Seiten ohne
fehlende interne Ziele oder Fragmente; Indexierbarkeit unveraendert.
