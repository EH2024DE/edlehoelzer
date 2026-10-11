# Brettfinder 2.0: Umsetzung und Abnahme

Stand: 11. Oktober 2026. Basis: main, c4d61e1. Branch: codex/brettfinder-v2.
Kein Live-Deployment und kein Merge. Die fachliche Klassifizierung und die Wirkung der Animation sollen vor Freigabe gemeinsam geprüft werden.

## 1. Bestand vor der Änderung

Der bestehende Finder wurde in produkte.html, en/products.html, main.js, products.json und styles.css geprüft.
Er hatte fünf Fragen. Frühstück und tägliche Vorbereitung waren unter daily zusammengelegt.
activeQuestions() ersetzte im Geschenkpfad die Platzfrage durch giftScale.
rankEntries() nutzte scoreProduct(), isFinderCompatible() und isPlausibleAlternative().
Budget war nur ein Score-Bonus bzw. Abzug. Harte Filter schlossen schwere oder große Bretter aus, ohne diese transparent als Abweichung zu zeigen.
productSupportsUse() hatte zwar Unterstützung für primaryUseCases, die 38 Boards hatten diese Felder aber nicht.
buildReason() formulierte aus Antworten, nicht aus tatsächlich erfüllten Produkteigenschaften.
Die optische Bewertung arbeitete mit Regex über Material- und Beschreibungstexte.
Ergebnisse enthielten eine Hauptempfehlung, bis zu zwei Alternativen, Zubehör und eine zusätzliche preisunabhängige Richtung.
recommendedFor/notIdealFor sind redaktionelle Freitexte. Sie bleiben erhalten; der Finder interpretiert sie nicht als harte Maschinenregeln.

## 2. Geänderte Dateien

- main.js: ein DOM-freier Matcher, neue Fragen DE/EN, Navigation, Pool, Ergebnis, Erklärungen und Events.
- products.json: explizite Nutzungs- und visuelle Profile, zwei Formatkorrekturen, XXL auf Bestellung.
- produkte.html und en/products.html: Pool, Zähler, Antwort-Chips, Erklärung; Cache-Versionen.
- styles.css: dichtes Pool-Layout, Zustände, Antwortkarten, Ergebnisse, Fokus, Mobile, Reduced Motion.
- tests/finder-matching.test.cjs: Logikregressionen und Kombinationsprüfung ohne zusätzliche Abhängigkeit.
- tests/finder-browser.cjs: reproduzierbare Browserprüfung und Screenshots.
- package.json: npm run test:finder.
- .github/workflows/pages.yml: Matching-Tests als zusätzliche CI-Prüfung.
- docs/brettfinder-v2-review.md: diese Dokumentation.

Es gibt keinen zweiten Finder. Der vorhandene Finder ruft createFinderMatcher() auf; dieselben Auswertungen liefern Pool, Empfehlungen und Gründe.
Die bisherigen parallelen Score-/Alternativ-Helfer wurden ersetzt. Produktmodal und Vergleichsfunktion bleiben bestehen.

## 3. Neue Datenfelder und Klassifizierung

primaryUseCases und secondaryUseCases unterscheiden Hauptzweck von zusätzlicher Eignung.
finderProfile.visual enthält kuratierte Kategorien light, dark, expressive.
finderProfile.juiceGroove ist eine explizite Funktionsangabe, kein Regex-Schluss aus einem Materialnamen.
Für XXL: finderProfile.requiresLargeStationary und requestOnly.
37 Boards erhielten Profile; das verkaufte Padouk-Großformat ohne Listing-ID blieb unverändert.
33 Boards sind aktuell finderfähig. Etsy-Abgleich vom 11.10.2026: 40 aktive Listings minus fünf Küchenhelfer/Pflege, ein Halter und ein Untersetzer-Listing. Schwert-Serie und dreiteiliges Servierset sind enthalten; unbekannte Stärke ist bei reinen Servierprodukten kein funktionaler Ausschluss. Verkaufte, inaktive bzw. unverifizierte Produkte bleiben ausgeschlossen.

Die erste Zuordnung beruhte auf dem vorhandenen Katalog und dessen Produktbildern. Der nachträgliche Etsy-Abgleich vom 11.10.2026 ergänzte die Portfolio- und Verfügbarkeitsprüfung.
Vor Freigabe besonders die Haupt-/Nebennutzung und visuelle Zuordnung in der Tabelle unten bestätigen.

Konkrete Korrekturen:
- Bambus & Buche bleibt servingBoard, wird aber für breakfast ausdrücklich zugelassen.
- Reine Servierbretter sind keine dailyPrep-/BBQ-Hauptbretter.
- Buche & Mooreiche (33 x 17 cm) und Eiche Massiv (34/38 x 20,5 cm) sind compact statt medium.
- XXL 75 x 60 cm: made_to_order statt available, Fertigungszeit nach Absprache statt Lager-Versandversprechen.
- XXL wird nur bei ausdrücklich large und stationary empfohlen. Anfrage statt Etsy-Kaufaktion.
- Namen, Bilder und Standard-Verkaufsziele bleiben erhalten. Ausnahme bei Preis und Verfügbarkeit: Nussbaum Langholz (1886821275) wurde anhand des erneuerten Listings auf Nachfertigung ab 59,99 EUR aktualisiert.

## 4. Harte Kompatibilität

Empfehlungen erfordern:
- active=true, Kategorie board und explizite Rolle cuttingBoard oder servingBoard.
- available oder made_to_order; niemals sold, inspiration oder inactive.
- verifizierte Daten und Bilder, needsReview=false.
- konkrete Größenangabe; Stärke ist für Schneid-/Arbeitsbretter erforderlich, bei Servierbrettern darf sie unbekannt bleiben. Gültige Größen-, Gewichts-, Handling- und Finderprofile.
- positives Preisfeld; bei available zusätzlich verifiziertes aktuelles Listing und Listing-ID.
- passende Haupt-/Nebennutzung; bei Geschenk zusätzlich giftable und gegebenenfalls giftUse.
- dailyPrep und bbq: cuttingBoard. breakfast: keine large/heavy Boards.
- compact: kein mittelgroßes/großes Format; medium: kein großes Format; large: kein kompaktes Format.
- portable: nicht heavy/stationary; balanced: nicht stationary.
- max100: maximal 100 EUR; max250: maximal 250 EUR, ohne versteckte Toleranz.
- XXL: explizit große, stationäre Konfiguration.

Premium ist keine Mindestpreisgrenze. open begrenzt den Preis ebenfalls nicht.
Unbekannte Geschenk-Nutzung verengt nur nach den übrigen Angaben; sie erfindet keine Küchen- oder BBQ-Eignung.

## 5. Weiche Bewertung und Tie Break

Score:
- Hauptnutzung 40, Nebennutzung 24.
- exakte Größe 16, zulässige kleinere Variante 5.
- exaktes Handling 16, zulässige flexible Variante 5.
- explizit passende Optik 14.
- Geschenk-Eignung 4.
- servingSuitable beim Servieren 8.
- Saftrille beim BBQ 6.
- Premium-Level x 3 nur bei premium.

Keine normale Budget-Punktwertung. Höhere Preise erzeugen keinen Bonus.
Optik ist weich: volle Treffer werden bevorzugt; eine ehrlich benannte optische Abweichung kann Hauptoption sein, wenn alle harten Kriterien passen.
Bei gleichem Score: Lagerverfügbarkeit, Listing-Verifizierung, featured nachrangig, Preis, stabile ID.
Datenqualität ist bereits eine Eintrittsbedingung, nicht eine Möglichkeit, durch andere Punkte kompensiert zu werden.

## 6. Ergebnis und Near Matches

Maximal eine beste Übereinstimmung und eine echte Alternative.
Alternative: Kernnutzung und harte Grenzen müssen stimmen; höchstens 18 Punkte Abstand und ein tatsächlicher Unterschied.
Trade-offs: leichter zu bewegen, massiver, kompakter, mehr Fläche, günstiger, andere explizite Optik oder Premium-Ausführung.
Ist kein sinnvoller Unterschied vorhanden, wird keine zweite Karte erzwungen.

Near Match:
- immer dieselbe Kernnutzung, gültige Rolle und Daten.
- genau eine Abweichung bei Budget, Größe, Handling oder Optik.
- maximal 8 Punkte unter dem besten Hauptkandidaten; ohne Haupttreffer bester geeigneter Ein-Konflikt-Kandidat.
- höchstens ein separat dargestelltes Produkt, auch im anklickbaren Pool.
- Budgetabweichung als tatsächlicher EUR-Betrag; niemals Budget automatisch erhöhen.
- keine Hauptempfehlung oberhalb einer Preisgrenze.
- ohne Haupttreffer ehrlicher No-Match-State, gegebenenfalls ein separater Near Match.

Jeder Eintrag speichert score, status, matches, conflicts und hardConflicts.
Ergebnisgründe entstehen aus diesen Fakten. Sie behaupten keine passende Optik, Größe oder Handhabung, wenn diese nicht getroffen wurde.
Keine Prozentwerte, KI-Versprechen oder garantierte Passung.

## 7. Rückwärtsnavigation

Zurück geht zur vorherigen Frage. Alle gesetzten Antwort-Chips sind direkt anwählbar.
Die aktuelle Auswahl bleibt vorausgewählt. Nur giftUse wird entfernt, sobald use nicht mehr gift ist.
Andere Antworten werden erhalten. Mit vollständigen Antworten aktualisiert die Änderung gezielt das Ergebnis.
Automatischer Fortschritt nach 350 ms; Weiter bleibt als stabile Alternative.
Timer werden bei Navigation abgebrochen. Nach Änderungen wird ein altes Ergebnis ausgeblendet, damit es nicht zu neuen Angaben passt.
Fokus geht auf Frage bzw. Ergebnisüberschrift; die mobile Ansicht hält den Pool zusammen mit der Frage sichtbar.

## 8. Produktverdichtung und Animation

### Nachprüfung vom 11.10.2026

- Geschenk mit giftUse=serving bedeutet Gastgeber-/Gästetisch-Nutzung: dafür ist finderProfile.servingContext=hosting erforderlich. Schwert-Serie, dreiteiliges Servierset und Doppelgriff-Tapasbrett sind explizit so klassifiziert.
- Buche/Mooreiche 33 x 17 cm: breakfast primär, serving sekundär, servingContext=individual. Kein Haupt-/Alternativ-/Near-Match für Gastgeber-Geschenke; für Frühstück weiterhin zulässig.
- Harte Budget-/Größen-/Handlingregeln bleiben erhalten. Bei kompakter Gastgeber-Auswahl wird ein echtes Servierbrett nur als transparenter Größen-Near-Match gezeigt statt durch ein Frühstücksbrett ersetzt.
- Regressionen decken portable/expressive-Gastgebergeschenke mit allen vier Budgets und den kompakt-Konflikt ab, zusätzlich DE/EN im Browser.

- Budgetbeschriftung DE/EN differenziert: „Premium, auch über 250 EUR“ bevorzugt aufwendigere Ausführungen ohne feste Obergrenze. „Was am besten zu mir passt“ öffnet den Preisrahmen ohne Premiumbonus; ein günstigeres Brett darf deshalb vorne liegen.
- Zurücknavigation behält Antworten absichtlich bei. Regression prüft sechs aufeinanderfolgende Budgetwechsel und zwei Zurück-Schritte mit erneutem Handlingwechsel gegen frisch berechnete Hauptempfehlung, Alternative und Near Match.
- Kein erzwungener Produktwechsel bei jeder Antwort: Wenn das bisherige Brett weiterhin am besten passt, bleibt es die Empfehlung.

- Neustart und Fragewechsel scrollen auf allen Größen zum Fragenblock unter dem fixen Header statt zum Anfang des gesamten Finders.
- Mobile Reihenfolge: Zähler, Frage, kompakte Antworten, Navigation, Antwortchips, Bildpool. Ab 600 px zwei Antwortspalten, darunter eine.
- Der mobile Bildpool ist separat vertikal scrollbar und auf 190 px begrenzt. Alle Bilder behalten 170:135 statt schmaler Streifen; alle Kandidaten bleiben zugänglich.
- Browserregressionen prüfen Frageposition nach Schrittwechsel/Reset, mobile Reihenfolge, Poolhöhe und Bildseitenverhältnisse. Native iPhone-Safari-Prüfung ist mangels WebKit-Runtime nicht automatisiert.

- Serving-Alternativen behalten dieselbe Produktrolle: reine Anrichtebretter sind keine gleichwertigen Arbeitsbrett-Alternativen.
- Schweres stationäres Handling verlangt ein stationäres Profil, nicht nur ein langes Format.
- Doppelgriff-Servierbrett: medium/balanced statt heavy/stationary; Anrichten statt täglicher Küchenarbeit in Profil und Begründung.
- Tropenholz mit Griffen: large/stationary; Schneiden/BBQ primär, Servieren sekundär.
- Stockbuche-Schachbrett: dailyPrep primär, serving sekundär.
- Nussbaum Langholz (1886821275): laut aktuellem Listing Nachfertigung des bereits verkauften Fotostücks, daher made_to_order; 30 x 20 x 4 cm, ab 59,99 EUR, 1–2 Wochen. Kein behaupteter Lagerbestand.
- Neue Regressionen: Serving/large/stationary/light/max250, beide Servier-Sets, 33 Kandidaten und Tropenholz-Arbeitsblock.
- Frühe Produktfenster werden in DE/EN vor und nach der ersten Antwort getestet; Antworten bleiben erhalten.

Alle 33 finderfähigen Boards sind als echte Bilder im Pool enthalten; keine Pflege, kein Zubehör, keine verkauften Referenzen. Jeder Poolbutton öffnet bereits vor Abschluss das vorhandene Produktfenster, ohne Antworten zu verändern. Echte Near Matches öffnen zunächst die Abweichungserklärung mit Produktvorschau-Aktion.
Desktop: 16 größere Tiles, übrige kleinere Hintergrundkandidaten.
Bei höchstens acht konfliktfreien Kandidaten verdichtet sich auch die Höhe des Desktop-Pools; die übrigen Bilder bleiben als kleine Hintergrundkandidaten enthalten.
Mobile: 8 größere Tiles in zwei Reihen, übrige stark kompakter.
Priorisierte Produkte rücken ins Zentrum der ersten Reihe. Ausgeschlossene Bilder bleiben klein und reduziert sichtbar.
Zähler kommen aus echten konfliktfreien Einträgen; am Ende zählen sie nur Hauptoptionen. Kein künstlicher Countdown.
Eine offene/gelockerte Antwort kann die Zahl wieder erhöhen.

Zustände: is-leading, is-compatible, is-near-match, is-excluded.
Native FLIP-Bewegung mit Element.animate()/translate, CSS scale/opacity/filter, 400 ms, cubic-bezier(.22,.8,.3,1).
Keine Animationsbibliothek, kein Framework, kein Canvas oder WebGL für den Finder.
Reduced Motion deaktiviert Bewegung und Übergänge; Zustandswechsel bleiben.

## 9. Accessibility und Performance

Echte Antwort-, Chip- und Near-Match-Buttons. aria-pressed, Fokusrahmen, aria-live-Zähler.
Near-Match-Erklärung funktioniert mit Enter; Escape schließt und stellt Fokus zum Auslöser zurück.
Zustände unterscheiden sich durch Position, Größe und Text, nicht nur Farbe.
Antworten und primäre Aktionen mindestens 44 px Touch-Höhe.
Poolbilder: vorhandene Etsy-Variante il_170x135, width/height, lazy loading, decoding=async.
Poolbilder verwenden kleine vorhandene Etsy-Varianten. Keine neue Bildpipeline. Die Bildskalierung verkleinert nicht die mindestens 44 px großen interaktiven Buttons; mobile Hintergrundkandidaten belegen vier Spalten.
Externe Bilder bleiben von Etsy-Erreichbarkeit abhängig. Die eigentlichen Produktmodalbilder verwenden weiterhin die bestehende Bildlogik.
Der zusätzliche Pool lädt kleine Bilder; keine neue API oder Backend-Abhängigkeit.

## 10. Analytics

Über das vorhandene, consent-gesteuerte EdleAnalytics.track:
- product_finder_view
- product_finder_start
- product_finder_answer
- product_finder_step_back
- product_finder_answer_changed
- product_finder_complete
- product_finder_no_match
- product_finder_recommendation_open
- product_finder_alternative_open
- product_finder_near_match_open
- product_finder_near_match_reconsider

Anonyme Frage-/Antwort-IDs, Schritt, Kandidatenzahlen, Produkt-IDs, Konflikttyp.
Keine Kontaktinformationen, Texteingaben oder Fotos.
Start wird innerhalb der Seite dedupliziert; Complete wird nicht ohne eine Antwortänderung nochmals gesendet.
No-Match ergänzt das Complete-Ereignis bei einem abgeschlossenen Durchlauf ohne Hauptempfehlung.

## 11. Tests

npm run test:finder:
17 Tests einschließlich der geforderten Fälle 1-9, Datenqualität, XXL, Geschenk-Servierrollen, Budgetdifferenzierung und 1.280 Kombinationen.
Fall 10 (gift verlassen), direkte Chips, Vorauswahl, Budgetwechsel, Zurück und Erklärungen werden im Browser geprüft.

Browser:
DE und EN bei 375, 430, 768, 1024 und 1440 px.
Breakfast-Pfad, Geschenk-BBQ, Wechsel zu normalem BBQ, No-Match bis 100 EUR, Budget-Reconsideration, Tastatur und Events.
Maximal zwei Hauptkarten und ein Near Match, konstante Pool-Anzahl, kein horizontaler Seiten-Overflow, keine JS-Fehler.
Zusätzlich Reduced Motion.
Gezielter Abschlusslauf: skalierte Near-Match-Touchflächen, fokussierte Tooltips ohne Seiten-Overflow und ein separates made_to_order-Datenfixture mit Anfrage-CTA.

Ausführung:
PLAYWRIGHT_MODULE=<Pfad zum installierten Playwright> CHROMIUM_PATH=<Chromium-Pfad> node tests/finder-browser.cjs
Optional FINDER_URL und FINDER_SCREENSHOTS. Standard: localhost:8140, /tmp/edle-finder-v2.
Screenshots je Sprache bei 375/1440: start, after-1, after-3, result, near.

Repository-Prüfungen: Indexability, Page Summaries, Asset Audit, Product Audit, Syntax und git diff --check.
Asset-/Produkt-Audits haben bestehende nicht blockierende Hinweise, keine kritischen Fehler.

## 12. Abnahme und Einschränkungen

### Erneuter Audit am 12.10.2026 vor PR-Erstellung

- Diff und aktive Board-Klassifizierungen erneut geprüft; veraltete Aussagen zu Testanzahl und Etsy-Abgleich in diesem Bericht korrigiert.
- Syntaxprüfung und `git diff --check` bestanden.
- Alle 17 Matching-Tests bestanden, einschließlich 1.280 Antwortkombinationen.
- `finder-browser.cjs`: DE/EN bei 375, 430, 768, 1024 und 1440 px bestanden; keine JS-Fehler oder horizontaler Overflow. Frühe Produktvorschau, Antworterhalt, Reset-Position, Touchflächen, Near-Match-Tastaturbedienung und Analytics geprüft. Made-to-order-Fixture und Reduced Motion bestanden.
- `finder-budget-navigation.cjs`: wiederholte Budgetwechsel und zweifaches Zurückgehen in DE/EN bestanden; Anzeige entspricht jeweils der frischen Matcher-Auswertung.
- `finder-serving-browser.cjs`: stationäres Arbeits-/Servierbrett, Antipasti-Rolle und Geschenk-Servierpfad einschließlich kompaktem No-Match/Near-Match in DE/EN bestanden.
- Indexability (60 HTML-Dateien / 51 Sitemap-URLs) und Page Summaries (43 Seiten) bestanden.
- Asset-Audit: 20 Hinweise, keine kritischen Fehler. Product-Audit: 34 Hinweise zur vorhandenen Klassifikationsnormalisierung, keine kritischen Fehler. Diese Hinweise werden nicht als erledigt dargestellt.
- Mobile- und Desktop-Screenshots gesichtet. Browserprüfung mit Chromium; native Safari/iPhone-Abnahme bleibt offen.
- Bild-Anmerkung vom Nutzer geklärt: alle Produktfotos und Bildübersichten unverändert beibehalten.

Vor Freigabe fachlich prüfen:
- visual kann mehrere Charaktere haben, aber Mischhölzer werden nicht automatisch hell UND dunkel.
- Ob kompakte Frühstücksnutzung und BBQ-Nebennutzung je Board im Alltag wirklich passen.
- Bestehende weightClass/portability sind qualitative Kategorien, keine gemessenen Handkräfte.
- primary/secondary und Optik sind kuratiert, kein neuer Zertifizierungs- oder Materialnachweis.
- Die Stärke zweier Servier-Sets bleibt unbekannt und wird nicht erfunden. Das ist kein Ausschluss für deren reine Servierrolle.
- Preise und Lagerstatus sind der Repository-Stand; Pflege bleibt manuell.
- XXL-Preis ist Katalogorientierung, kein dynamischer Maßpreis. Individueller Auftrag wird separat angeboten.
- Bilder bzw. Netzwerkantworten können unterschiedlich schnell laden.
- Keine Aussage, dass eine steigende Conversion bereits gemessen sei.

Visuell:
Start: viele reale Bretter, eine klare Frage.
Nach Nutzung: kleinere Kernmenge in der Mitte, übrige Bilder zurückgenommen.
Nach Handling: stabile Hauptkandidaten, ggf. eine erklärte Abweichung.
Ergebnis: ein bis zwei Karten mit echten Gründen und getrenntem Near Match.
Near Match: sachlicher Konfliktbetrag/-text und bewusste Wahl zwischen Ansehen und Angabe ändern.

## 13. Klassifizierung zur fachlichen Prüfung

| Listing | Brett | Hauptnutzung | Nebennutzung | Optik | Größe | Handling | Saftrille |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1841836619 | Buche Stirnholz – Jahresring-Struktur | dailyPrep | - | light, expressive | large | stationary | nein |
| 1827805914 | Bambus & Buche – Frühstücksbrett | breakfast, serving | - | light | compact | portable | nein |
| 1824089235 | Eiche Stirnholz – XXL mit Saftrille | dailyPrep, bbq | - | light | large | stationary | ja |
| 1818046728 | Lärche Stirnholz – Kompakt | breakfast, dailyPrep | serving | light | compact | portable | nein |
| 1886613306 | Mahagoni Stirnholz – Ruhiger Block | dailyPrep | - | dark | medium | stationary | nein |
| 1894223313 | Wenge Nussbaum Eiche – Kariert | dailyPrep, serving | - | dark, expressive | medium | stationary | nein |
| 4484195050 | XXL Stirnholz – Nach Maß | dailyPrep, bbq | - | expressive | large | stationary | nein |
| 4417621529 | XXL Streifenbrett – Thermobambus & Birke | dailyPrep, bbq | serving | dark, expressive | large | stationary | nein |
| 4417507555 | Eiche Stirnholz – Premium Hackblock | dailyPrep, bbq | serving | light, expressive | large | stationary | nein |
| 1848021568 | Kambala Schneidebrett – Kompakt | breakfast, dailyPrep | serving | dark | compact | portable | nein |
| 4440690649 | Servierbrett-Set – Dreiteilig | serving | breakfast | expressive | medium | balanced | nein |
| 1886821275 | Nussbaum Langholz – Flankenoptik | breakfast, dailyPrep | - | dark | compact | portable | nein |
| 1803930088 | 3D Stirnholz – Nussbaum & weitere | dailyPrep, serving | - | dark, expressive | large | stationary | nein |
| 4398179153 | Eiche Servierbrett – Doppelgriff | serving | - | light | large | balanced | nein |
| 4389604739 | Servierbrett-Set – Schwertform | serving | - | expressive | medium | balanced | nein |
| 1859366842 | Padouk & Eiche – Kompakt kariert | dailyPrep | bbq | expressive | compact | portable | nein |
| 4455205567 | Eiche Stirnholz – Massiver Hackblock | dailyPrep, bbq | - | light | large | stationary | nein |
| 4381023266 | Buche & Mooreiche – Servierbrett | breakfast | serving | dark, expressive | compact | portable | nein |
| 4380304814 | Eiche & Kambala – Quadrat | breakfast, dailyPrep | serving | light, expressive | compact | portable | nein |
| 4380062082 | Esche Stirnholz – BBQ Hackblock | bbq, dailyPrep | serving | light | large | stationary | nein |
| 4451487112 | Tropenholz Stirnholz – Mit Griffen | dailyPrep, bbq | serving | dark, expressive | large | stationary | nein |
| 4450988121 | Nussbaum & Ahorn – Streifenbrett | dailyPrep | bbq | dark, expressive | medium | balanced | nein |
| 1783359006 | Stockbuche Stirnholz – Schachbrett | dailyPrep | serving | light, expressive | large | stationary | nein |
| 1783351692 | Buche & Kambala – Schachbrett | dailyPrep | bbq, serving | expressive | medium | balanced | nein |
| 1850610674 | Nussbaum Stirnholz – Mit Saftrille | dailyPrep, bbq | serving | dark | large | stationary | ja |
| 1776273564 | 3D Stirnholz – Eiche & weitere | dailyPrep, serving | - | expressive | large | stationary | nein |
| 4370784882 | Stockbuche Stirnholz – Naturmaserung | dailyPrep | - | light, expressive | medium | stationary | nein |
| 1830530996 | Buche Stirnholz – Mit Saftrille | dailyPrep, bbq | - | light | large | stationary | ja |
| 1774262638 | Eiche Langholz – Schweizer Kante | dailyPrep, serving | - | light | medium | balanced | nein |
| 4299097497 | Eiche & Wenge – Schachbrett | dailyPrep, serving | - | dark, expressive | medium | stationary | nein |
| 1855639262 | Eiche & Buche – Kompakt mit Astloch | dailyPrep | breakfast, serving | light, expressive | compact | balanced | nein |
| 4297472161 | Walnuss & Eiche – Rahmenbrett | dailyPrep, bbq | serving | dark | large | stationary | ja |
| 4358136560 | Eiche Stirnholz – Schmales Design | breakfast | dailyPrep, serving | light | compact | balanced | nein |
| 4297451235 | Eiche Esche Buche – Mit Saftrille | dailyPrep, bbq | serving | light, expressive | large | stationary | ja |
| 4522496017 | Buche Massiv – Mit Griffmulden | dailyPrep | breakfast, serving | light | medium | balanced | nein |
| 4522458953 | Eiche Massiv – Astloch & Kante | breakfast, dailyPrep | serving | light, expressive | compact | balanced | nein |
| 4370769708 | Erbstück No. 004 – Eiche & Buche | dailyPrep, serving | - | light, expressive | large | stationary | nein |
