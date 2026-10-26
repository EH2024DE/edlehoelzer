# Gastronomie-Landingpage: Umsetzung und Abnahme

Stand: 26. Oktober 2026. Basis: `origin/main` bei `2c94c0e`. Umsetzung im bestehenden Checkout, eigener Branch `codex/gastronomie-landingpage`. Der separate Katalog-Entwurf aus PR #196 wurde nicht vorausgesetzt oder überschrieben.

Revision nach Owner-Sichtung: Waldgrün entfernt, Mokka/Elfenbein/warmes Schwarz wieder aufgenommen. Das Grün hatte Werkstattmaschinen und Machbarkeit optisch verbunden, war aber keine notwendige Gastro-Farbwahl. Einsatzbereiche und Referenzprodukte sind mobil horizontal bedienbar; Anfrage und Pflichtbudget stehen deutlich früher. Der Fertigungs-/Planungsabschnitt mit Kantenfräserfoto und wiederholende Erklärblöcke wurden entfernt.

## 1. Finale URL und Freigabestatus

Geplante Produktionsadresse: https://edlehoelzer.de/schneidebretter-aus-holz-gastronomie/

Externe Sichtung: https://issue-identifier-reserve-drainage.trycloudflare.com/schneidebretter-aus-holz-gastronomie/

Die Seite ist für die Veröffentlichung vorbereitet, aber noch nicht gemergt oder live veröffentlicht. Der temporäre Vorschau-Link setzt `X-Robots-Tag: noindex, nofollow`; Projektinterna sind gesperrt. In Produktion hat die Seite `index,follow` und einen selbstreferenziellen Canonical.

## 2. Title und Variantenbewertung

**Verwendet:** `Schneidebretter & Holzlösungen für Gastronomie | Edle Hölzer` (60 Zeichen).

**Alternative:** `Schneide- & Servierbretter für Gastronomie | Edle Hölzer` (56 Zeichen).

Die gewählte Variante enthält das vollständige Hauptwort „Schneidebretter“ und die gastronomische Zielgruppe, öffnet zugleich den Raum für kompakte Sonderlösungen. Die vier Zeichen kürzere Alternative konzentriert sich stärker auf die beiden Brettarten. Beide sind redaktionell brauchbar; eine bestimmte Darstellungslänge im Suchergebnis ist nicht garantiert. Suchvolumen und Rankingchancen wurden in diesem Implementierungsauftrag nicht quantitativ erhoben.

## 3. Meta Description

`Individuelle Schneide- und Servierbretter aus Massivholz für Restaurants und Hotels. Maß, Logo, Saftrille und kompakte Holzlösungen aus Mittelhessen.`

149 Zeichen. Auch als Open-Graph-Beschreibung verwendet.

## 4. H1

`Individuelle Schneidebretter und Servierbretter aus Holz für die Gastronomie`

Eine H1. Die expliziten Begriffe „Schneidebretter“ und „Servierbretter“ stehen zusätzlich im unmittelbar folgenden Antwort-/Introblock. Die ersten 120 Wörter decken Gastronomie, Restaurants, Hotels, Massivholz, individuelle Maße, Machbarkeit und Mittelhessen ab.

## 5. Seitenstruktur

1. Kompakter Produktfoto-Hero mit H1 und zwei Einstiegen.
2. Kurzantwort und vier kompakte „Auf einen Blick“-Punkte.
3. Vier Einsatzbereiche: mobil natives Swipe-Raster ohne zusätzliche Zähler-/Pfeilleiste, weiterhin mit Tastaturbedienung.
4. Mengen-/Preisorientierung vom Einzelstück bis zu 100 Exemplaren.
5. Anfrageformular mit sichtbarem Pflichtbudget, noch vor den Referenzprodukten.
6. Vier Einzelangebote als Preis- und Produktreferenz; mobil ebenfalls horizontal durchsehbar.
7. Kurze Kompetenz-/Machbarkeitseinordnung und ein Werkstattabschnitt.
8. Sieben synchronisierte, zugängliche FAQ.

Kein separater Planungs-/Fräsabschnitt, kein zusätzlicher Standardwaren-, Anpassungs- oder Ablaufblock. Die für die Entscheidung nötigen Punkte sind in Preisorientierung, Anfrage und Machbarkeit zusammengeführt.

## 6. Wortzahl

807–819 zunächst sichtbare Wörter im Hauptinhalt einschließlich bedingter Pflichtbeschreibung, Produktkarten und ihrer je Bildschirmbreite sichtbaren Mediensteuerung, ursprünglich 1.025–1.037. Zugeklappte FAQ-Antworten und optionale Formularangaben erhöhen die zugängliche Textmenge. Navigation und Footer sind ausgeschlossen. Die mobile Swipe-Auswahl verkürzt zusätzlich die vertikale Strecke; eine Conversion-Wirkung wurde nicht gemessen.

## 7. Bildaudit und Verwendung

Einsatzbilder werden auf jeder Breite quadratisch und bildfüllend zugeschnitten (`object-fit: cover`). Referenzprodukte verwenden weiterhin die vorhandenen quadratischen Produktkarten. Hero und Werkstattmotiv behalten ihre eigenständigen Formate.

Keine neuen Stock- oder generierten Bilder. Vorhandene lokale Fotografien und Bildmotive bestehender Katalogeinträge; bei den Lösungsbildern mit der bereits für Produktgalerien verwendeten 794-Pixel-Ableitung statt unnötig großer Originale. Keine neuen Bilddateien für die öffentliche Seite. Die Abnahme-Screenshots sind nur Dokumentation.

| Datei / Katalogquelle | Motiv / Produkt | Hero? | Lösung? | Bisherige Nutzung | Empfehlung / Verwendung |
| --- | --- | --- | --- | --- | --- |
| `assets/schneidebrett-nach-mass.jpg`, responsive Varianten | Stirnholzbrett mit dunklen Akzentlinien, vollständig liegend | Ja | Möglich | 2 bestehende HTML-Seiten mit diesem Asset-Stamm | Hero; vollständig enthalten statt beschnitten |
| `products.json`, Listing `1824089235`, Bild `7586477404_ry7n.jpg` | Eiche-Stirnholzbrett mit Saftrille | Möglich | Ja | Bestehender Katalog und Saftrillenauswahl | Steak-/Tranchierbereich; zusätzlich eine der vier Produktkarten |
| `assets/board_b2b-800.jpg`, 1200er Variante | Zwei schlichte Eichenbretter | Möglich | Ja | 1 bestehende HTML-Seite mit diesem Asset-Stamm | Servier-/Brotzeitbereich, als Formatbeispiel |
| `products.json`, Listing `1827805914`, Bild `6893380866_am0z.jpg` | Kompaktes Frühstücksbrett aus Buche/Bambus | Nein | Als Ausgangspunkt | Bestehender Katalog | Kaffee-Konzept ausdrücklich als Formatbeispiel, kein fertiges Espressobrett |
| `products.json`, Listing `1838851839`, Bild `7026139480_i63y.jpg` | Untersetzer-Sortiment mit Halter | Nein | Ja | Bestehender Katalog | Untersetzerbereich, keine zusätzliche Produktvielfalt erfunden |
| `assets/holzbrett-kanten-fraesen-oberfraese.jpg` | Bearbeitung einer Brettkante | Nein | Fertigung | 1 bestehende HTML-Seite mit diesem Asset-Stamm | Nach Owner-Sichtung entfernt; nicht auf der Seite verwendet |
| `assets/workshop1-800.jpg`, responsive Varianten | Formatkreissäge und Werkzeuge | Nein | Werkstatt | 4 bestehende HTML-Seiten mit diesem Asset-Stamm | Ein Werkstattbild, als Ausschnitt ohne unnötige Galerie |
| `assets/hackblock.jpg` | Reales massives Stirnholzbrett | Möglich | Ja | Bestehende Hackblockseite | Geprüfte Alternative; kein weiteres wiederholtes Bild nötig |
| `assets/barbecue-geschenk.jpg`, `Brotzeitbrett.jpg`, `Schneidebrett_Saftrille2.avif` | Inszenierungen mit Lebensmitteln | Nur nach Quellenklärung | Nur nach Quellenklärung | Je 2 / 1 / 2 bestehende HTML-Seiten mit Asset-Stamm | Nicht eingesetzt, da für diesen Auftrag keine gesicherte fotografische Herkunft aus den Dateien ableitbar war |

Die Nutzungszahlen betreffen bereits versionierte HTML-Seiten ohne die neu angelegte Gastronomieseite, keine gemessenen Aufrufe. Die eigentliche Produktauswahl zeigt außerdem die vorhandenen Fotos der Listings `4455205567` und `1774262638`.

## 8. Fehlende Wunschmotive

- Freigegebenes, nachvollziehbar dokumentiertes Restaurant-/Hotelprojekt mit tatsächlichem Projektstatus.
- Ein tatsächlich gefertigtes Kaffee-/Espressobrett mit passender Tasse und Ausnehmung.
- Eigene Einsatzfotos im Service, etwa Steak oder Sharing auf dem konkreten Brett.
- Ein freigegebenes gastronomisches Logo auf einem tatsächlich gefertigten Brett.

Es wurden keine passenden Kundenszenen oder Produkte erfunden, um diese Lücken zu verdecken.

## 9. Interne Links hinein

- Aktuelle B2B-Zielseite `/handgefertigte-holzprodukte-fuer-unternehmen/`: kurzer kontextueller Verweis auf Lösungen für Restaurant/Hotel.
- `/schneidebrett-nach-mass/`: ein zusätzlicher Satz für Gastronomiebetriebe.
- `/atelier/`: ein Eintrag in den passenden nächsten Schritten.
- `/sitemap-uebersicht.html`: Themenverzeichnis.
- Bestehende interne Suche: Eintrag über `docs/page-summaries.json` und regenerierten `assets/search-pages.json`.

`b2b.html` und `/erbstueck/` bleiben unverändert Weiterleitungen. Die optional genannte Saftrillenseite wurde nicht verändert. Titel, H1 und Grundpositionierung der bestehenden Seiten bleiben erhalten.

## 10. Interne Links hinaus

Produkte, allgemeine Maßanfertigung, Saftrillen-Ratgeber, Gravur, Atelier, Firmengeschenke als sekundäre Zielsetzung. Dazu die bestehende Navigation und notwendige Datenschutz-/Impressumslinks. Produktkarten öffnen zunächst das bestehende interne Produktfenster; ein Kauf wurde im Test nicht ausgeführt.

## 11. Sitemap

Zwei Einträge (DE/EN) in der bestehenden `sitemap.xml`, `lastmod` 2026-10-26. Keine zusätzliche XML-Sitemap. Themenübersicht und interne Suche ergänzt. Audit: 66 HTML-Dateien, 53 selbstkanonische indexierbare Seiten und 53 Sitemap-URLs.

## 12. Schema

`WebPage`, `BreadcrumbList`, `FAQPage` mit sieben sichtbaren, inhaltlich identischen Fragen/Antworten. Zugeklappte Antworten sind über native `details` erreichbar. Kein Product-Schema, keine erfundenen Offers, Reviews oder Kundenreferenzen.

## 13. Formularfelder und Übermittlung

Direkt sichtbar: Name und E-Mail als Pflichtfelder; Unternehmen/Restaurant/Hotel optional; Produktidee und ungefähre Stückzahl jeweils mit „Noch offen“ als Vorauswahl. Mengenoptionen bis 51–100 Exemplare.

Budgetrahmen und die Zuordnung „Pro Stück / Gesamtprojekt“ sind sichtbar und verpflichtend. Ein ungefährer Betrag oder Bereich reicht; beide Felder müssen vor dem Senden ausgefüllt sein. Das Budget soll die Machbarkeitsprüfung und Angebotskalkulation von Anfang an eingrenzen.

Bei „Noch offen“ und „Individuelle Sonderlösung“ ist eine Beschreibung direkt sichtbar und verpflichtend. Bei konkreten Produktideen wandert dasselbe Feld in den optionalen Bereich; Eingaben bleiben beim Wechsel erhalten. Ein Formular-Reset stellt den Pflichtzustand der Vorauswahl wieder her. Frühstücks-, Brunch- oder Serviertablett ist zusätzlich auswählbar.

Optionale Angaben in einem nativen, per Tastatur bedienbaren Accordion: Wunschmaß, Holzvorstellung, Gravur/Logo, Wunschtermin und Telefon. Keine versteckte Pflichtangabe im Accordion.

Bestehendes `data-board-inquiry`, `board-inquiry.css`, `board-inquiry.js` und Formspree-Ziel `maqanpld`; eigener Betreff „Gastronomie-Projektanfrage“. Honeypot, browserseitige E-Mail-Validierung, Versandstatus, Timeout, Fehlerhinweis und Erhalt der Eingaben bei Fehlern bleiben im vorhandenen Handler. Skizzen/Logos später per E-Mail, kein neues Uploadsystem. Datenschutzlink direkt am Formular. Keine Bestellung oder Lieferzusage durch Auswahl einer Stückzahl.

## 14. Analytics

Bestehender Consent-Manager und `EdleAnalytics`; keine neue Tracking-Architektur. Standard-Seitenmessung nach vorhandener Einwilligung. Formularereignisse `inquiry_form_start`, `inquiry_form_submit`, `inquiry_form_success`, `inquiry_form_error`, zuordenbar über `source: /schneidebretter-aus-holz-gastronomie/` und `form_id: board_inquiry`. Submit ist der Versuch, Success die Bestätigung des Anbieters, nicht der Nachweis des E-Mail-Eingangs.

Zwei vorhandene Umami-Klickattribute für `gastro_portfolio_open` und `gastro_custom_solution_open`. Der Summary-CTA verwendet das vorhandene `summary_cta_click`. Keine separaten, doppelt gezählten `gastro_page_view`-/Submit-Ereignisse ergänzt. Formularinhalte, E-Mail, Budget oder Nachricht werden nicht als Analytics-Nutzlast versendet.

## 15. Tests und Screenshots

- 86 JavaScript-Tests: 75 bestehende plus elf Gastronomie-Prüfungen.
- 32 Python-Tests.
- Indexierbarkeit und Zusammenfassungen: bestanden; Suchindex jetzt 45 Seiten.
- Asset-Audit: 265 Medien, keine kritischen Befunde; 24 bestehende Hinweise außerhalb des Auftrags.
- Browser in DE und EN: 375, 430, 768, 1024 und 1440 px; keine JavaScript-Fehler und kein horizontaler Overflow. Hero lässt den nächsten Abschnitt erkennen, alle verwendeten Bilder laden.
- Produktfenster auf allen fünf Breiten geöffnet und geschlossen.
- Form: Pflichtfelder, ungültige E-Mail, fehlendes Budget und fehlende Budgetbasis blockieren den Versand. Optionaler Bereich, Fehlerfall 503, Eingabeerhalt, Wiederholung, simulierte Erfolgsantwort, Fokus und Status geprüft. Bedingte Pflichtbeschreibung für offene Ideen und Sonderlösungen, optionaler Zustand für konkrete Produkte, Eingabeerhalt beim Wechsel und Reset geprüft. Budget und Basis sind im simulierten Formular-POST enthalten, nicht in Analytics. Kein echter Formspree-Post.
- Mobile: echte Touch-Gesten über Chromium geprüft; beide horizontalen Auswahlen zusätzlich über Pfeiltasten und Home/End geprüft. Sichtbare Zähler und Pfeilleisten entfernt. Keine automatische Wiedergabe oder Bewegung.
- FAQ per Tastatur geöffnet; Schema-Antworten stimmen mit der Seite überein. Kein manueller Screenreader- oder vollständiger assistiver Gerätetest.
- Interne Ziele und lokale Bilder auf Existenz geprüft, externe Vorschau HTTP 200; `.git/config` extern HTTP 404.
- `git diff --check`: bestanden.
- Bestehende GitHub-Prüfung um die neue Gastronomie-Testdatei ergänzt. Historische Snapshot-Tests erlauben ausschließlich den neuen Gastro-Querverweis bzw. den zusätzlichen Sitemap-Eintrag; übrige Inhalte bleiben geschützt.

Reproduzierbarer Browserlauf: `GASTRO_URL=http://127.0.0.1:8165 node tests/gastronomie-browser.cjs` mit verfügbarem Playwright; optional `PLAYWRIGHT_MODULE`, `CHROMIUM_PATH`, `GASTRO_SCREENSHOTS`.

Screenshots (Navigation bei isolierten Abschnittsbildern nur für die Aufnahme ausgeblendet, Formular im Ausgangszustand):

- [Desktop Hero](release-evidence/2026-10-26-gastronomie/1440-hero.png)
- [Desktop Lösungen](release-evidence/2026-10-26-gastronomie/1440-solutions.png)
- [Desktop Sonderlösungen](release-evidence/2026-10-26-gastronomie/1440-feasibility.png)
- [Desktop Formular](release-evidence/2026-10-26-gastronomie/1440-form.png)
- [Mobile Hero](release-evidence/2026-10-26-gastronomie/375-hero.png)
- [Mobile Einsatzbereiche als Swipe-Auswahl](release-evidence/2026-10-26-gastronomie/375-solutions.png)
- [Mobile Formular](release-evidence/2026-10-26-gastronomie/375-form.png)

## 16. Kannibalisierungsbewertung

| Seite | Klarer Intent |
| --- | --- |
| `/schneidebretter-aus-holz-gastronomie/` | Nutzung in Restaurant/Hotel/Café, betriebliches Servierkonzept, kompakte projektbezogene Lösungen |
| `/handgefertigte-holzprodukte-fuer-unternehmen/` (`b2b.html` als Weiterleitung) | Firmengeschenke für Mitarbeiter, Kunden und Events |
| `/schneidebrett-nach-mass/` | Allgemeine Maßanfertigung, vom privaten Servierbrett bis zur Küchenarbeitsfläche |
| `/schneidebrett-mit-gravur/` | Motiv, Position und Machbarkeit einer Gravur |
| `/brotzeitbrett/` | Privates Frühstück, Brotzeit und Produktnutzung |
| `/atelier/` | Auswahl, Materialbild und Abstimmung für offene Küchen/Kochinseln |

Sachlich notwendige Überschneidung bei Maß/Gravur, aber keine Kopie bestehender Ratgeber und keine Umpositionierung bestehender Seiten. Die neue Seite bündelt Einsatz und Anfrage für Gastronomie. Eine tatsächliche Ranking-/Kannibalisierungswirkung ist erst anhand späterer Suchleistungsdaten beurteilbar; keine Ranking- oder Conversion-Verbesserung behauptet.

## 17. Owner-Checks vor Freigabe

- Seite, Bildausschnitte und Gastronomie-Positionierung final freigeben.
- Eine konkrete Kundenanfrage und Nutzung wurden intern durch den Owner eingeordnet. Ohne ausdrückliche öffentliche Freigabe werden weder Name noch Angebots-/Budgetdetails dieses Betriebs veröffentlicht. Auf der Seite ist keine Kundengeschichte erfunden.
- Vor-Ort-Beratung ist bewusst nicht zugesagt. Erst nach ausdrücklicher Freigabe ergänzen; auch dann nicht automatisch kostenlos.
- Kaffee-/Espressobrett bleibt Konzept, bis ein reales Muster und dessen Einsatzrahmen vorliegen.
- Tatsächliche neue Anfragen und Eingang im Postfach nach Freigabe separat prüfen; Simulation ersetzt keinen Zustelltest.
- Vom Einzelstück bis zu 100 Exemplaren wurde durch den Owner bestätigt. Stückpreis wird je nach Menge, Ausführung und Aufwand kalkuliert; kein automatischer Prozentrabatt. Liefertermin wird vor der Freigabe verbindlich abgestimmt.
- Die Entscheidung, ob und wie ein Brett im jeweiligen Betrieb eingesetzt wird, bleibt produkt- und einsatzbezogen abzustimmen. Keine pauschale Hygiene-/Zertifizierungszusage.

## 18. Bewusst nicht versprochene Sonderlösungen

Nach erneuter Owner-Abstimmung sind individuelle Frühstücks-, Brunch- und Serviertabletts sowie bestimmte Umbaumaßnahmen im Innenausbau möglich. Kein pauschales Versprechen für jede Innenausbau- oder Komplettausstattung; Umfang, Material, Budget und Machbarkeit werden projektbezogen abgestimmt. Keine beliebigen Holzprodukte, erfundenen Mindestmengen, automatischen Mengenrabatte, pauschalen Lieferfristen ohne Abstimmung, pauschale HACCP-Eignung, technische Zertifizierung oder formale Ingenieursleistung. Nicht jede Konstruktion, Aussparung oder Holzart wird automatisch empfohlen. Eine Idee kann nach Prüfung auch abgelehnt oder vereinfacht werden.

## 19. Abschluss: PE-Sonderlösung, englische Seite und finale Route

- DE: https://edlehoelzer.de/schneidebretter-aus-holz-gastronomie/
- EN: https://edlehoelzer.de/en/wooden-cutting-boards-for-restaurants/
- Die alte deutsche Vorschau-Route leitet per HTML-Weiterleitung weiter (noindex, nicht in der Sitemap). Dies ist kein serverseitiger HTTP-301; die Route war bisher nicht veröffentlicht.
- Vollständige englische Seite mit denselben sieben FAQ, Referenzprodukten und bedingter Pflichtbeschreibung. Gegenseitige hreflang- und sichtbare Sprachlinks. Bestehende weiterführende Fachseiten ohne englische Entsprechung bleiben deutsch verlinkt.
- Formularstatus und Beschreibungstexte werden sprachabhängig ausgegeben; Produktkarten verwenden die bestehende Produktübersetzung.
- PE 500 wird ausschließlich als auf Anfrage zu prüfende Sonderlösung beschrieben. Materialnachweise, vorgesehener Einsatz, Hygieneanforderungen und technische Umsetzbarkeit sind Voraussetzungen. Keine pauschale Zulassung, Zertifizierung oder Eignung für Dauerkontakt behauptet.
- Grundlagen: [EU-Lebensmittelhygieneverordnung](https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX%3A02004R0852-20210324), [LGL zu Kunststoff-Konformität](https://www.lgl.bayern.de/lebensmittel/ueberwachung/et_schwerpunktaktivitaeten_lebensmittelkontaktmaterialien_kunststoff.htm), [Röchling zu PE-Schneidplatten](https://www.roechling.com/de/industrial/produkte/thermoplastische-fertigteile/hygiene-schneidplatten).
- Englische sichtbare Wortzahl je Breite: 877–910; deutsche Wortzahl 807–819. Beide Sprachen auf allen fünf Breiten mit Bildladen, internem Produktfenster, Touch/Tastatur und simuliertem Fehler-/Erfolgsversand geprüft.
- Indexierung erst nach Merge und erfolgreichem Deployment beantragen. Vorschau bleibt noindex.

## 20. Transparente Konzept- und Planungskosten

Owner-Freigabe: einmalig 150 € Endpreis, kein gesonderter Umsatzsteuerausweis. Keine ungeprüfte Angabe einer steuerrechtlichen Begründung.

Die Gastronomie-Seiten in DE/EN und die Firmengeschenke-Seite enthalten einen kurzen Hinweis vor dem Formular und eine ausführliche FAQ mit synchronem Schema:
- Anfrage und erste Kostenindikation anhand bestehender Produkte bleiben kostenlos.
- Eine neue Konzeptentwicklung erfordert vor Beginn eine gesonderte Freigabe von Leistungsumfang und Kosten.
- Bei anschließender Fertigungsbeauftragung desselben Projekts wird die Pauschale vollständig auf die Rechnung angerechnet.
- Ohne Fertigungsauftrag bleibt sie die Vergütung für die vereinbarte Konzeptarbeit.
- Das Absenden des Formulars beauftragt keine kostenpflichtige Planung; kein Zahlungsfeld, kein automatischer Gebühreneinzug.
- Der bestehende B2B-Migrationsschutz erlaubt ausschließlich diese freigegebenen Ergänzungen zusätzlich zum Gastro-Verweis.
- Auf der Firmengeschenke-Seite existiert bisher keine eigene englische Route; die vorhandene englische Gastronomie-Seite ist vollständig angepasst.
