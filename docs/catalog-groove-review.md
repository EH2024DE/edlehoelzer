# Katalog, Verkaufsstatus und Saftrillen

Stand: 3. November 2026, Designvorschau, noch nicht veröffentlicht.

## Änderungen

- Produktkarten erhalten je sichtbarer Zeile identische Preis- und Aktionshöhen. Unterschiedliche Titel, Metadaten, mehrzeilige Verkauft-Hinweise und Verfügbarkeitstexte werden berücksichtigt. Die Ausrichtung wird nach Filterwechseln, Font-Loading und Größenänderungen neu berechnet.
- Der sichtbare Innenrahmen des Pflegebalsamfotos wurde in DE/EN entfernt. Das Foto füllt die Fläche ohne zusätzlichen farbigen Padding-Rand.
- Nach ausdrücklicher Bestätigung des Inhabers sind alle fünf Ausführungen von Listing `4599650982` verkauft: Bestand 0, inaktiv, Inspiration/Archiv. Beide statischen Produktseiten zeigen den Status; ihre strukturierten Daten enthalten keine verfügbaren Angebote mehr. Das Produkt ist nicht mehr für Finder-Empfehlungen zugelassen. Historische Bilder und Preise bleiben als Referenz erhalten.
- Neue generische Vektorschemata statt Bearbeitung des Etsy-Screenshots: umlaufend, Auffangbecken vorne links und vorne rechts. Keine fremde Galerieoberfläche, Pfeile oder eingebetteten Fotos.
- Nach Aktivieren der optionalen Saftrille erscheinen drei beschriftete Radiooptionen. Alle verwenden dieselbe bestehende 15-Euro-Zusatzposition. Ein Wechsel der Form verändert den Preis nicht erneut.
- Die Vorderkante ist in der Zeichnung unten. „Links“ und „rechts“ beziehen sich auf die Arbeitsposition vor dem Brett.
- Die gemeinsame Übersicht wird bei geeigneten Produktgalerien am Ende ergänzt. Thumbnail bleibt an erster, Video an zweiter Stelle. Das Diagramm wird vollständig dargestellt, nicht quadratisch abgeschnitten.
- Die Option benötigt weiterhin eine freigegebene Listing-ID und ein Schneidebrett mit mindestens 2 cm bekannter Stärke. Servierbretter einschließlich Schwertform, Tapas-/Doppelgriffbrett und dreiteiligem Set, dünnere Bretter, verkaufte Stücke sowie Bretter mit bereits vorhandener Saftrille werden ausgeschlossen.
- Der schwebende Nach-oben-Link wird während der Konfiguration ausgeblendet, damit er die Hinweise auf Mobile nicht verdeckt.

## Grenzen zum Shop-Schritt

Es bleibt die vorhandene Etsy-Kaufabwicklung. Die neue Auswahl wird im bestehenden lokalen Konfigurationszustand geführt; sie aktiviert keinen eigenen Checkout und übermittelt keine neue Option automatisch an Etsy. Der sichtbare Hinweis fordert deshalb zur Bestätigung der Form auf Etsy vor der Bestellung auf. Bei der Shop-Anbindung muss `juiceGrooveStyle` in den serverseitig validierten Bestellvertrag aufgenommen werden; Preis und Zulässigkeit dürfen dann nicht aus dem Browser übernommen werden.

Stripe, Versand, Grundpreise und sonstige Bestände unverändert. Der einzige Datenwechsel ist der bestätigte Verkauft-Status des kleinen Brett-Listings.

## Prüfung

- 123 Node-Tests bestanden, einschließlich Form-/Metadaten-Erhalt, Medienreihenfolge, unveränderter Preisberechnung und gezielter Saftrillen-Zulässigkeit.
- DE/EN bei 375, 430, 768, 1024 und 1440 px: jede Katalogzeile auf Preis-/CTA-/Vergleichsausrichtung geprüft; Saftrille an/aus, alle drei Formen bei identischem Aufpreis, vollständiges Galeriediagramm, Servierbrett-Ausschluss und verkaufte Produktseite geprüft.
- Acht betroffene Seiten bei 375 und 1440 px, insgesamt 16 Ansichten: keine automatischen Schrift-, Kontrast-, Überlauf-, Bild- oder JS-Fehler.
- Mobile Schemakarten visuell geprüft. Keine Bestellungen oder externen Formulare abgesendet.

Vorschau: https://accompanying-sends-built-sentences.trycloudflare.com/produkte.html
