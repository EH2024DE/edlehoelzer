# Saftrillen und Gravurschriften

Isolierte Vorschau in DE/EN, keine Live-Zahlungen und keine Produktionsseiten
geaendert. Vom Inhaber bestaetigt: alle drei optionalen Saftrillen-Ausfuehrungen
kosten jeweils 15 EUR pro Brett:

- umlaufende Saftrille;
- mit Auffangbecken links;
- mit Auffangbecken vorne rechts.

Die Auswahl erscheint nur bei Produkten mit bestehender Saftrillen-Option.
Bereits enthaltene, physisch vorhandene Saftrillen werden nicht umkonfiguriert.
Die Ausfuehrung bleibt in Warenkorb, Bearbeitung, Browser-Wiederherstellung,
Serverangebot, Stripe-Zeilenbezeichnung und privater Fertigungsaufgabe erhalten.
Alte Warenkoerbe ohne Ausfuehrung verwenden die umlaufende Variante.
Unbekannte Ausfuehrungen und Auswahl ohne zulaessige Option werden abgelehnt.
Bestandsgrenzen gelten weiterhin gemeinsam ueber alle Ausfuehrungen.

## Erklaerbild nachreichen

Das echte Etsy-Erklaerbild ist noch nicht vorhanden. Keine Illustration oder
Zuordnung zu einem beliebigen Produktbild wurde erfunden. Nach Lieferung:

1. Original pruefen und als assets/saftrillen-ausfuehrungen.webp ablegen.
2. In data/shop-customisation.json grooveGuide.image auf
   /assets/saftrillen-ausfuehrungen.webp setzen, Alt-Texte bei Bedarf praezisieren.
3. Vorschauserver neu starten, damit Bildpfad und Katalogversion geladen werden.

Dann erscheint bei passenden Produkten ein zweites Galerie-Bild mit eigener
Auswahl. Das Erklaerbild wird vollstaendig in der quadratischen Bildflaeche
angezeigt (contain), damit Beschriftungen nicht abgeschnitten werden.
Ohne Original bleiben die Galerie-Auswahl und ein leerer Platzhalter unsichtbar.
Der Integrationsweg wurde mit einer synthetischen Bildreferenz getestet.

## Gravur

Entfernt: edge-left und edge-right. Erhalten: vordere schmale Kante links/rechts
sowie die vier Ecken auf der Schneideflaeche. Alte ungueltige Positionsangaben
muessen ueber Bearbeiten korrigiert werden; sie werden nicht stillschweigend
umgedeutet.

Neu: Montserrat und Playfair Display, selbst gehostete Originaldateien aus
google/fonts mit OFL-Lizenzen. Bisherige drei Schriften bleiben erhalten.
Nachgereichte Schriften aus dem Inhaberbild: Amatic SC, Caveat, Marcellus und
Marker Felt; Allura war bereits vorhanden. Amatic SC, Caveat und Marcellus
werden als offizielle google/fonts-Dateien mit OFL-Lizenz selbst gehostet.
Allura und Amatic SC stehen zuerst und sind nach ausdruecklicher Angabe des
Inhabers als am haeufigsten gewaehlt gekennzeichnet, ohne erfundene Prozentwerte.

Marker Felt ist als Gravurwunsch waehlbar und wird in Warenkorb und Auftrag
beibehalten. Keine proprietaere Systemschrift wurde kopiert oder ausgeliefert.
Bis eine passend lizenzierte Webfont-Datei vorliegt, wird keine Ersatzschrift
als Marker-Felt-Vorschau ausgegeben. Stattdessen erscheint ein knapper Hinweis
auf persoenliche Schriftabstimmung. Diese Auswahl erfordert serverseitig
Abstimmung vor einer verbindlichen Testzahlung.

Zusatzpruefung: 33 Shop-Tests bestanden. DE/EN bei 375/1440 px: echte Fontladung,
Favoriten, Marker-Felt-Hinweis, Auswahl im Warenkorb und kein Seitenueberlauf.

Pruefung: 32 Shop-Tests und 111 bestehende CJS-Tests bestanden. DE/EN-Browsertests
bei 375 und 1440 px fuer Auswahl, Bearbeitung, Speicherung, Schriftladung und
Galerievorbereitung. Keine neuen Produktpreise ausser der bestaetigten
Gleichbehandlung der bestehenden Saftrillen-Option eingefuehrt.
