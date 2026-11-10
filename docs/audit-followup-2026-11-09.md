# Website-Audit: Umsetzung vom 9. November 2026

## Umfang und Freigabe

Design- und Informationsverbesserungen auf dem aktuellen Website-Build. Kein
Live-Checkout, keine Stripe-, Versandpreis-, Zahlungs- oder DNS-Aenderungen.
Bestehende Produktpreise, Kaufoptionen, Formziele, Rechtstexte und Konzeptgebuehren
bleiben unveraendert. Veroeffentlichung erfolgt erst nach PR-Freigabe.

## Die neun Arbeitspakete

| Paket | Ergebnis | Grenze |
| --- | --- | --- |
| 1. Menschen sichtbar machen | Mobile Swipe-Reihe: zuerst Oezguer, Serkan mit sichtbarem Anschnitt. Kleine unverzerrte Portraets, keine automatische Bewegung. Auch Presse zeigt beide Personen mit bestaetigten Rollen. | Keine neue Ueber-uns-Seite oder erfundene Biografie. |
| 2. Pflege und Aufbereitung | Drei abgestufte Karten auf Pflege- und Aufbereitungsseiten, DE/EN. Weiss, heller Neutralton, Mokka. Preis und drei Kernleistungen bleiben offen. Preisstaffeln klappen auf. Mobil manuell swipebar, Desktop drei Spalten. | Eine Balsamdose ist nur bei der Generalueberholung inklusive. Materialkosten der Selbstpflege sind kein erfundener Festpreis. |
| 3. Produktentscheidung | Kurzer sichtbarer Produkttitel; langer Titel bleibt in Suchmetadaten und Schema. Mobile Kaufleiste spiegelt denselben Optionspreis und Etsy-Link wie der Hauptbereich. Sie erscheint erst nach dem Hauptbutton. | Die lokale Optionsauswahl wird weiterhin nicht an Etsy uebertragen. Der bestehende Hinweis bleibt sichtbar. Kein zweiter Checkout. |
| 4. Bestaende | Oeffentlicher Etsy-Abgleich vom 09.11.: 34 aktive Lagerprodukte aktualisiert, zwei nicht mehr aktive Angebote aus der verfuegbaren Auswahl genommen. Mengen sind mit Datum gekennzeichnet und werden nach sieben Tagen nicht mehr als aktuell angezeigt. | Mengen gelten fuer das gesamte Etsy-Listing, nicht fuer eine konkrete Holzart. Kein Live-Abgleich beim Kauf und keine automatische Reservierung. |
| 5. Orientierung | Ab 1200 px direkte Links zu Produkten, Atelier, Erbstueck, Mass und Pflege. Darunter bleibt das Hamburger-Menue. B2B/Gastronomie sind im Menue erreichbar. | Fuer Atelier existiert keine eigene englische Seite; der Link kennzeichnet die deutsche Zielseite. |
| 6. B2B-Formulare | Budget und Budgetbasis sind optional und entsprechend beschriftet. Sekundaere Angaben stehen in einem aufklappbaren Bereich. Namen, Formziele und wesentliche Pflichtfelder bleiben erhalten. | Die 150-EUR-Regel und bestehende Einwilligungen wurden nicht stillschweigend entfernt. Keine automatische Angebotserstellung. |
| 7. Pflegebruecke | Pflegebalsam zeigt auf der Pflegeseite seinen bestehenden Abpreis. Bretter ohne Balsam im Lieferumfang erhalten einen Produktlink zur passenden Pflege. | Keine ungefragten Warenkorb-Bundles und keine neue Preisberechnung. |
| 8. Informationsdichte | Kompakte Teamdarstellung, kurze Produkttitel, sichtbare Kernleistungen statt langer Paketprosa, optionale Formdetails. Inhalts- und SEO-Regressionspruefungen sichern den bestehenden Text. | Kein pauschales Kuerzen auf eine Wortzahl. Die englische Startseite bleibt wegen zusaetzlicher Inhalte laenger. Die frueher genannten Seitenhoehen-Ziele sind nicht erreicht. |
| 9. Abnahme und Messpfad | Neue Tests fuer Mengenalter, Navigation, Formulare, Swipe-Reihen und Kaufleiste. Bestehende Finder-, Preis- und Produktpruefungen bleiben gruen. Umami-Ereignisse fuer statische Startkarten und mobile Kaufleiste ergaenzt. | Keine Umsatzsteigerung behauptet; ein Etsy-Klick ist kein nachgewiesener Kauf. Echte Safari-/iPhone-Abnahme und Messperiode bleiben erforderlich. |

## Bestandsregeln

- Quelle: oeffentliche aktive Shop-Listings ueber Etsy Open API.
- Minimaler Pruefbeleg: `data/inventory-public-snapshot.json`, nur Listing-IDs,
  Mengen, Herkunft und Zeitstempel. Keine Kunden-, Transaktions- oder Zugangsdaten.
- `scripts/apply-public-inventory.cjs` uebernimmt einen lokalen API-Snapshot in
  den Katalog. Es aendert keine Preise und reaktiviert keine manuell verkauften
  Produkte. Auf Bestellung gefertigte Produkte werden nicht als Lagerware gezahlt.
- Das von euch als komplett verkauft bestaetigte kleine Stirnholz-Listing bleibt
  verkauft, obwohl Etsy inzwischen wieder eine aktive Menge ausweist.
- Nicht mehr aktiv: 1803930088 und 4370769708. Daraus wird nicht automatisch
  behauptet, dass sie verkauft sind; ihr Status lautet aktuell nicht verfuegbar.
- Startseite Position drei: aktives 3D-Modell 1776273564 derselben Preisstufe
  ab 459,99 EUR. Position vier bleibt XXL nach Mass ab 1.199 EUR.

## Messereignisse

| Entscheidung | Ereignis |
| --- | --- |
| Hero zum Finder | bestehend: `produktfinder-gestartet` |
| Statische Startkarte oeffnen | neu: `homepage_product_open` |
| Produktansicht/Optionen | bestehend: `product_preview_open`, `product_option_toggle` |
| Etsy aus Produktbereich | bestehend: `product_preview_etsy_click` |
| Etsy aus mobiler Kaufleiste | neu: `product_sticky_etsy_click` |

Bestehende Consent-Verwaltung bleibt verantwortlich. Keine Freitexte, Gravuren,
Kontaktangaben oder hochgeladenen Dateien an Analytics senden. Nach Deployment
14 Tage Herkunft, Geraet und Klickpfad beobachten; keine rueckwirkende Baseline
erfinden. Kleine Stichproben nicht als belastbaren Conversion-Nachweis ausgeben.

## Pruefungen

- Designsystem und neue Audit-Tests: 37 bestanden.
- Finder, Gastronomie, Consent, Produktmedien und Produktseiten: 43 bestanden.
- Homepage-Browserpruefung: 375, 430, 768, 1440 px, DE/EN; zusaetzlich ohne
  JavaScript und bei fehlgeschlagenem Katalogabruf.
- Audit-Browserpruefung: 24 Renderings, zwoelf Seiten bei 390 und 1440 px.
  Swipe-Reihen, natuerliche Portraetproportionen, sichtbare Desktop-Navigation,
  optionale Budgetfelder, Paketdetails und aktuelle Kaufleistenpreise geprueft.
- Interne Ziele und Fragmente: 150 Seiten ohne fehlende Ziele.
- Typografie-Audit: 150 Seiten, 147 indexierbar, keine Befunde.
- Indexierbarkeit: 160 HTML-Dateien, 147 selbstkanonische Sitemap-Seiten.
- Seitenzusammenfassungen: 45 bestanden.
- Medienaudit: keine kritischen Fehler; 25 bereits vorhandene Hinweise zu
  Metadaten, grossen bzw. dynamischen Medien bleiben bestehen.
- Screenshots lokal: `/tmp/edle-audit-followup/` und
  `/tmp/edle-homepage-portraits/`.

## Nicht behauptet oder ungefragt umgesetzt

Keine neuen Garantieversprechen, Lieferfristen fuer Weihnachten, B2B-Zitate,
Kundenfotos oder Fertigungsstunden ohne echte Belege. Keine kuenstliche
Verknappung. Bestehende PE-/Innenausbau-Angebote wurden nicht allein aufgrund
einer externen Markenbewertung gestrichen. Kein Wechsel der Schriftfamilie
oder der gesamten Farbpalette waehrend dieser Nachbesserungsrunde.

Noch ausserhalb der technischen Umsetzung: echte iPhone-/Safari-Pruefung,
freigegebene Firmenreferenzen, gesicherte Fertigungsaufwaende und gegebenenfalls
ein bestaetigter Weihnachtsstichtag. Der Direktshop bleibt ein separates Projekt.
