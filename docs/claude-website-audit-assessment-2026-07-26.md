# Bewertung des Claude-Website-Audits

Stand: 26. Juli 2026

## Kurzurteil

Das Audit erkennt wichtige Conversion-Fragen, bewertet aber teilweise einen
vereinfachten Text-Export statt den aktuellen Funktionsumfang der Website.
Mehrere vorgeschlagene Maßnahmen sind auf `main` bereits umgesetzt. Andere
würden ohne verlässliche Daten neue Pflege- oder Aktualitätsrisiken erzeugen.

## Bereits umgesetzt

| Claude-Empfehlung | Aktueller Stand |
|---|---|
| Produktraster auf der Massivholz-Seite | Drei verfügbare Bretter stehen direkt nach dem Hero; weitere folgen später. |
| Preise am Kernprodukt | Produktkarten zeigen die aus `products.json` gepflegten Preise. |
| Hero-Video | Ein Werkstattvideo mit Poster und reduziertem Mobile-Ladeverhalten ist vorhanden. |
| CTA-Reihenfolge | Verfügbare Produkte und Brettfinder stehen vor individuellen Anfragen. |
| Größenvergleich | Produktkarten und Brettfinder verwenden reale Maße und Einsatzkriterien. |
| Fallback bei Produktdatenfehlern | Produktgrids und Brettfinder bieten funktionierende Alternativen. |
| Werkstattbilder doppelt | Die Bilder sind getrennte Desktop- und Mobile-Darstellungen und nicht gleichzeitig sichtbar. |

## Einordnung der Preisbeobachtung

Claudes Aussage, es fehle ein Preisanker, trifft auf die aktuelle
Produktdarstellung nicht zu. Die Preise werden zentral in `products.json`
gepflegt und in Produktkarten sowie Produktvorschauen ausgespielt. Etsy ist
der anschließende Checkout, nicht die einzige Stelle mit Preisangabe.

Wahrscheinlich entstand die Beobachtung durch einen statischen Abruf ohne
vollständig ausgeführtes JavaScript oder durch einen Seitenausschnitt ohne
sichtbare Produktkarte. Daraus folgt kein Bedarf für einen pauschalen
Startseitenpreis, sondern nur die Aufgabe, konkrete Produkte auf
kaufnahen Einstiegsseiten früh genug sichtbar zu machen.

## In diesem Paket umgesetzt

1. Der frühe Werkstattbeweis nennt Özgür als tatsächlich fertigende Person.
   Serkan wird nicht fälschlich als Hersteller bezeichnet.
2. Öffentliche Begriffe wie `Ritualberatung` und `Ritual klären` werden durch
   verständliche Nutzungssprache ersetzt. Die Ritualstrategie bleibt die
   interne Logik, nicht die Hürde für den Nutzer.
3. Geprüfte Etsy-Bewertungen stehen als statischer HTML-Fallback auf den
   deutschen und englischen Start- und Produktseiten bereit. JavaScript
   aktualisiert sie weiterhin aus der zentralen Bewertungsdatei.
4. Die Massivholz-Seite beantwortet sichtbar und im FAQ-Schema, wo aktuelle
   Lieferzeiten, Versandkosten und Rückgabebedingungen zu finden sind.
5. Die Produktübersicht lässt sich auf Deutsch und Englisch nach Preis auf-
   oder absteigend sortieren. Die Werte stammen aus der zentralen Produktdatei.
6. Der Etsy-Abgleich wurde am 26. Juli 2026 erfolgreich aktualisiert. Die
   Website verwendet nun zentral 32 Bewertungen und 63 Verkäufe als
   nachprüfbaren Stand.
7. Eine ruhige Europakarte zeigt manuell bestätigte Lieferländer mit genau
   einem Brettsymbol pro Land. Sie enthält keine Kundendaten, Adressen oder
   aus Verkaufszahlen abgeleiteten Mengen.

## Etsy-Bewertungen und Käuferfotos

Der API-Abgleich findet zehn Bewertungen mit Käuferfoto. Diese Bilder werden
in diesem Paket nicht auf edlehoelzer.de veröffentlicht. Bewertungsinhalte
gehören den jeweiligen Etsy-Mitgliedern; vor einer dauerhaften
Weiterverwendung außerhalb von Etsy muss die erforderliche Freigabe oder ein
anderes belastbares Nutzungsrecht vorliegen.

Die Bewertungsmetadaten werden dagegen über die vorhandene zentrale Datei
aktualisiert. Bei einem fehlgeschlagenen Abruf bleibt der letzte verifizierte
Stand erhalten, statt Zahlen zu erfinden oder die Website zu blockieren.

## Lieferkarte

Die Karte ist ein redaktionell gepflegter Marken- und Vertrauensbeleg, keine
Live-Auswertung personenbezogener Etsy-Transaktionen. Aktuell dargestellt
werden Deutschland, Irland, das Vereinigte Königreich, Frankreich, Malta,
Zypern, Dänemark, Österreich, Slowenien und die Türkei.

Deutschland und Frankreich erhalten wie alle anderen Länder genau einen
Marker. Die Marker sind als kleine Schneidebretter mit Innenkontur,
mittigem Griff und Griffloch gestaltet und per Tastatur erreichbar.

## Bewusst nicht übernommen

### Statischer Preisanker auf der Startseite

Ein allgemeines `ab X Euro` kann bei wechselnden Einzelstücken schnell
veralten und sagt wenig über Größe und Bauweise aus. Die konkreten Produktkarten
sind der bessere und wartbare Preisanker.

### Feste Bewertungsanzahl im Hero

Eine Zahl darf nur erscheinen, wenn der Etsy-Abgleich sie zuverlässig
aktualisiert. Die vorhandene Metadatei ist die richtige Quelle, wird aber nicht
zusätzlich statisch im Hero dupliziert.

### Globale Lieferzeit

Lieferzeit und Versand hängen von Produkt, Zielort und Etsy-Angebot ab.
Statt eines pauschalen Versprechens verweist die Kauf-FAQ auf die aktuellen
Angaben im jeweiligen Listing und Checkout.

### Bundle und Cross-Sell

Ohne verifiziertes gemeinsames Etsy-Angebot würde ein Bundle eine Kaufoption
behaupten, die nicht zentral gepflegt wird. Pflege bleibt ein inhaltlich
sinnvoller nächster Schritt, aber kein fingiertes Paket.

### Saisonale Dringlichkeit

Künstliche Dringlichkeit widerspricht der ruhigen Markenführung. Ein Hinweis
ist nur sinnvoll, wenn eine reale Bestellfrist zentral und aktuell gepflegt
werden kann.

## Nächster sinnvoller Schritt

Echte Kundenküchen und dokumentierte Nutzungssituationen hätten mehr
Markenwirkung als zusätzliche Erklärungstexte. Dafür werden freigegebene
Originalbilder und belastbare Nutzungskontexte benötigt. Ohne diese Medien
sollte die Website keine gestellten Geschichten erfinden.
