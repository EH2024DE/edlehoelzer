# Pfannenwender: bestaetigte Bestandsmatrix

Quelle: fuenf vom Inhaber bereitgestellte Etsy-Varianten-Screenshots,
28.10.2026, Anzeigezeit 14:10. Angaben nach dem Wort verfuegbar sind Stueckzahlen;
die separat angezeigte 1 nach dem Punkt ist kein Preis und kein Zusatzbestand.

| Holzart | Gerade Kante | Abgeschraegte Kante |
| --- | ---: | ---: |
| Wildkirsche | 1 | 1 |
| Meranti | 1 | 2 |
| Eiche | 3 | 3 |
| Zwetschge | 1 | 1 |
| Esche | 4 | 1 |
| Nussbaum | 2 | 1 |
| Rotbuche | 1 | 1 |
| Kambala | 1 | 0, ausverkauft |
| Kastanie | 6 | 5 |
| Wenge | 4 | ausgeblendet, kein Bestand unterstellt |

Summe: 39 verfuegbare Exemplare, zehn Holzarten, 18 verfuegbare Kombinationen.

Implementiert in der isolierten DE/EN-Shop-Vorschau:
- Holzart und Kantenform als getrennte Auswahl, Kantenform ist Pflicht.
- Ausgeblendete Kombination Wenge/abgeschraegt fehlt in der Auswahl.
- Ausverkauftes Kambala/abgeschraegt bleibt gekennzeichnet und deaktiviert.
- Mengenlimit pro Kombination gilt ueber normale/gravierte Zeilen, verschiedene
  Gravurtexte und Geschenksets hinweg. Kastanie/gerade erlaubt alle sechs.
- Alte Warenkoerbe ohne Kantenform bleiben unvollstaendig und nicht zahlbar,
  bis die Kante ueber Aendern ergaenzt wurde; kein stilles Uminterpretieren.
- Kantenform bleibt bei Bearbeitung, Browser-Wiederherstellung, Serverangebot,
  Stripe-Zeile und privater Fertigungsaufgabe erhalten.
- Verifizierte bezahlte Testauftraege reduzieren nur ihre konkrete Kombination.
  Wiederholte Ereignisse reduzieren nicht mehrfach. Katalogabrufe mutieren die
  Ausgangsmatrix nicht.
- Geschenkset-Presets verwenden Eiche/gerade fuer die Pfannenwender; im Warenkorb
  sichtbar und aenderbar. Keine automatische Auswechslung bei fehlendem Bestand.

Keine automatische Etsy-Synchronisation: dies ist eine manuell bestaetigte
Momentaufnahme. Etsy-Verkaeufe muessen weiterhin nachgepflegt werden. Vor einem
Live-Start bleibt auch die gleichzeitige Reservierung im eigenen Checkout offen.
Preise nicht aus diesen Screenshots abgeleitet; bestehender Vorschau-Basispreis
29,99 EUR und bestaetigte Gravur 5,99 EUR bleiben unveraendert.

Zentraler Produktdatensatz: Gesamtbestand und die bestaetigten Holzarten
aktualisiert, DE/EN-Produktseiten neu generiert. Keine weiteren Produkte geaendert.

Pruefung: 38 Shop-Tests; Browser DE/EN bei 375, 430, 768, 1024, 1440 px fuer
Kombinationen, Mengen, Bearbeiten, Neuladen und Geschenkset. Kein Live-Kauf.
