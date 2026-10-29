# Staerkeabhaengige Gravur und Freigabe

Aktueller Stand, ersetzt aeltere Angaben zur Schriftauswahl und Marker Felt.
Nur isolierte DE/EN-Vorschau; keine Live-Zahlung und keine Produktionsfreigabe.

- Unter 2 cm: nur die vier Positionen auf der Schneideflaeche.
- Ab einschliesslich 2 cm: zusaetzlich vordere schmale Kante links/rechts.
- Unbekannte oder ausdruecklich zu pruefende Staerke: keine Kantenpositionen.
- Staerke kommt aus thicknessLabel; Spannweiten nutzen den kleinsten Wert.
  Varianten mit konkreten dreidimensionalen Massen nutzen ihre eigene Staerke.
  Unklare Variantenmasse werden nicht mit einer guenstigeren Annahme ersetzt.
- Server validiert Position und Staerke fuer Text und Logo. Variantenwechsel
  loeschen eine nicht mehr zulaessige Position und verlangen eine neue Auswahl.
- Schema: Draufsicht mit vier nummerierten Flaechenpositionen und separater
  Vorderkante mit zwei Positionen. Vorne zeigt zum Kunden, links/rechts aus seiner
  Blickrichtung. Keine seitlichen Kantenpositionen wieder eingefuehrt.
- Kundenhinweis: Mockup vor der Gravur, Aenderungsmoeglichkeit, Gravur erst nach
  Freigabe. Private Angebote und Fertigungsaufgaben tragen bei Gravur
  mockupApprovalRequired=true. Die persoenliche Freigabe bleibt ein manueller
  Werkstattprozess; kein automatisches Freigabe-/Fertigungsportal hinzugefuegt.
- Schriften reduziert auf Allura, Amatic SC, Montserrat, Playfair Display, Caveat
  und Marcellus. Nur vorhandene OFL-Schriften in der Auswahl. Allura/Amatic bleiben
  die vom Inhaber bestaetigten Favoriten. Caveat bleibt als lockere Handschrift.
- Marker Felt und die beiden aehnlichen Noto-Varianten entfernt. Alte Gravurwuensche
  mit ungueltiger Schrift/Position werden nicht stillschweigend umgedeutet; der
  Kunde muss sie ueber Aendern korrigieren, der Checkout bleibt bis dahin gesperrt.

Pruefung: 35 Shop-Tests, 111 CJS-Tests. Browser DE/EN bei 375, 430, 768, 1024,
1440 px; zusaetzlicher Variantenwechsel-Test mit synthetischem Staerkeunterschied.
Schema, Tastatur, Select-Synchronisierung, Pflichtauswahl und Mockup-Text geprueft.
Ein dabei gefundener Ueberlauf im langen Versandpruefungs-Text wurde korrigiert.
