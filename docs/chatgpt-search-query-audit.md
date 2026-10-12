# Search Query & Citation Audit: edlehoelzer.de

Stand: 12. Oktober 2026. Basis: `main`, Commit `38e74c3`. Änderungen liegen auf `codex/search-citation-audit`; nicht veröffentlicht.

Historischer Status: Dieser Bericht dokumentiert Phase 1. Angaben zu damals fehlenden ChatGPT-Tests bzw. noch nicht erstelltem PR beschreiben diesen Prüfstand. Die späteren echten Messungen stehen in `docs/chatgpt-citation-benchmark.md`, die Umsetzung in `docs/chatgpt-citation-phase3.md` und der aktuelle Release-Befund in `docs/search-citation-release-review.md`.

## Kurzfassung

Die vorhandenen Seiten decken das Angebot bereits breit ab. Der größte Hebel ist eine klarere, belegbare Antwort auf vorhandenen URLs, keine neue Serie ähnlicher Landingpages. Reale GSC-Daten priorisieren Maßanfertigung, Öl/Pflege, Aufbereitung, Bauweisen und Brotzeit. Breite Geschenk-Queries haben Nachfrage, liegen aber meist zu weit hinten, um sie vor kaufnahen Gewinnern zu bearbeiten.

**Diese Woche:** die begrenzten fachlichen Korrekturen und die konkrete Größen-/Handlingberatung prüfen und freigeben. Die erfolgreiche Maßanfertigungsseite nicht komplett umschreiben. Die beim Öl-Thema bereits bestehende Weiterleitung nicht ohne zusätzliche Canonical-Inspektion ändern.

Umgesetzt: Messer-Aussagen DE/EN korrigiert, statischen Inhalt der weiterleitenden älteren DE-Ölseite produktbezogen eingeordnet, EN-Ölratgeber um Aushärtungs-/Sicherheitshinweise ergänzt, Maßanfertigung um reale Maße und einen Katalog-Gewichtsanker ergänzt. Preise, Produktdaten, Analytics und Kaufwege bleiben unverändert.

Begriffe: First-Party heißt eigene Produkt-/Werkstattbelege; Conversion meint den Weg zur Anfrage oder Bestellung; Hero bezeichnet den ersten großen Seitenbereich; Snippet ist die Vorschau in Suchergebnissen; Triage bezeichnet die erste Einordnung des Brettzustands.

## Methodik und Grenzen

- 60 HTML-Dateien im Repository untersucht; 51 selbstkanonische, indexierbare Seiten entsprechen 51 Sitemap-URLs. Eine kanonische URL benennt die bevorzugte Fassung eines Inhalts.
- Vollständige statische Inventur: [search-content-inventory.csv](search-content-inventory.csv). Enthält Title, H1/H2/H3, Beschreibung, Wortzahl, frühe Antwort, FAQs, strukturierte Daten und Links. Statische Wortzahlen zählen keine nachgeladenen JS-Produktkarten oder Bewertungen.
- Redaktionelle Bewertungen und First-Party-/Conversion-Zuordnung: [search-page-assessments.csv](search-page-assessments.csv). 1 = schwach, 3 = brauchbar, 5 = klar und konkret. Das sind interne qualitative Urteile nach den Änderungen, keine Suchmaschinen-Messwerte oder Wahrscheinlichkeiten.
- 40 dauerhafte Prompts mit Zielseiten, sechs Fit-Kriterien und Priorität: [chatgpt-search-query-matrix.csv](chatgpt-search-query-matrix.csv). Intent-Fit = passt die Seite zur Absicht; Citation-Fit = lässt sich eine belastbare Antwort daraus zitieren.
- Keine ChatGPT-Search-Network-Aufzeichnung verfügbar. Keine tatsächlich ausgelösten ChatGPT-Rewrites oder ChatGPT-Zitationen gemessen. Öffentliche Suchstichproben sind kein Ersatz für diesen Nachweis.
- GSC zeigt Google-Suchanfragen, nicht ChatGPT-Abfragen. Anonymisierte Queries fehlen; Exporte sind zeilenbegrenzt. Die 1.000 Queryzeilen im Langzeitexport decken nur 62 Klicks und 14.809 Impressionen ab, nicht die gesamte Property.
- Ungefilterte Query- und Seitentabellen sind getrennte Dimensionen. Sie dürfen nicht zeilenweise verbunden werden. Drei konkrete Query→Seite-Zuordnungen wurden zusätzlich im GSC-Interface geprüft.
- Kein aktueller Query→Bestellung- oder Umsatz-Join verfügbar. Historische Umami-/Growth-Zahlen sind Kontext, keine aktuelle Conversion-Attribution.
- OpenSEO-Connector nicht verfügbar; stattdessen Repository-Prüfung, direktes GSC-Interface und öffentliche Websuche. Keine Suchvolumina, Backlinkwerte oder Difficulty-Werte erfunden.

### Datenbasis

Die beiden Originalexporte liegen lokal in `~/Downloads/`: `edlehoelzer.de-Performance-on-Search-2026-10-12.zip` und die Vergleichsdatei mit Zusatz ` (1)`. Sie werden nicht als vollständige Rohdaten ins Repository übernommen.

Der ausgewählte Langzeitfilter war „16 Monate“, tatsächlich vorhanden sind **28.03.2026–09.10.2026**, 196 Tage. Ein Vorjahresvergleich ist damit nicht belastbar möglich. Zusätzlich wurde „Letzte 3 Monate“ gegen „Vorherige 3 Monate“ exportiert; die CSV benennt diese relativen Zeiträume, enthält aber keine separaten Start-/Enddaten für den Vergleich. Abruf am 12.10.2026; jüngste Tage können noch unvollständig sein.

| Property | Langzeit | Letzte 3 Monate | Vorherige 3 Monate |
|---|---:|---:|---:|
| Klicks | 435 | 342 | 90 |
| Impressionen | 32.729 | 23.823 | 8.889 |
| CTR | 1,33 % | ca. 1,44 % | ca. 1,01 % |
| Durchschnittliche Position | 22,39 | 19,0 | 31,4 |

Klicks steigen um 280 %, Impressionen um rund 168 %. Das ist ein Zeitvergleich, kein Nachweis der Wirkung einer einzelnen Website-Änderung. Positionen sind impressionsgewichtete Durchschnitte, keine feste Rankingposition.

## Reale Nachfrage und Prioritäten

Die folgenden Query-Cluster sind reproduzierbare, exklusive Gruppierungen der sichtbaren Exportzeilen. Ein Query wird genau einem primären Cluster zugeordnet; beispielsweise Gravur vor Geschenk. Mehrdeutige und irrelevante Queries bleiben für die Analyse erkennbar, werden aber nicht automatisch Content-Aufträge.

| Cluster | Reale Beispiele | Bewertung |
|---|---|---|
| Maßanfertigung | schneidebrett nach maß; schneidebrett holz nach maß; schneidebretter nach maß; schneidebrett auf maß | kaufnah, mehrere Queries Position 5–15, höchste Content-Priorität |
| Öl/Pflege | welches öl für schneidebrett; schneidebrett ölen leinöl; leinöl für schneidebretter | viel sichtbare Nachfrage, aber häufig schwache Queryposition; fachliche Klarheit zuerst |
| Aufbereitung | holzschneidebrett abschleifen | Position 9,77 bei 31 Impressionen im jüngeren Vergleichszeitraum; Seite bereits umfangreich |
| Bauweise/Hackblock | butcher block; butchers block; stirnholzbretter; stirnholzbrett; hackblock holz | mehrere konkrete Chancen Position 5–15; bestehende DE/EN-Seiten stärken |
| Brotzeit | brotzeitbrett; brotzeitbrett groß; brotzeit brett | echte Produktnachfrage; Hauptquery 253 jüngere Impressionen bei Position 17,7 |
| Gravur | schneidebrett mit gravur; hochwertiges schneidebrett mit gravur | passend, aber breite Query meist deutlich schlechter; keine weitere Gravur-URL |
| Geschenk | holzgeschenke; geschenke aus holz für frauen | Nachfrage real, Position oft 40–50; kaufnahes BBQ eher bearbeiten |
| Marke | edle hölzer | 31 Langzeitklicks, CTR 15,98 %; Gewinner schützen |

### Top-Cluster und konkrete Query-Chancen

Langzeitwerte der 1.000 sichtbaren Queryzeilen, nach Impressionen sortiert. „Sonstige“ ist eine Restgruppe, keine Content-Empfehlung. Diese Zahlen sind **keine marktweiten Suchvolumina** und nicht die Property-Gesamtsummen.

| Cluster | Impressionen | Klicks | CTR | Position |
|---|---:|---:|---:|---:|
| Öl und Pflege | 3.887 | 3 | 0,08 % | 47,58 |
| Sonstige | 2.293 | 6 | 0,26 % | 31,28 |
| Holzarten | 1.606 | 0 | 0 % | 41,95 |
| Gravur | 1.550 | 3 | 0,19 % | 44,77 |
| Geschenk | 1.345 | 2 | 0,15 % | 42,99 |
| Bauweise und Hackblock | 1.271 | 8 | 0,63 % | 31,96 |
| Frühstück und Servieren | 865 | 2 | 0,23 % | 21,43 |
| Maßanfertigung | 554 | 5 | 0,90 % | 14,44 |
| Saftrille | 483 | 1 | 0,21 % | 38,19 |
| Massivholz allgemein | 426 | 1 | 0,23 % | 25,11 |
| Aufbereitung | 207 | 0 | 0 % | 20,09 |
| Marke | 194 | 31 | 15,98 % | 5,99 |
| Herkunft | 114 | 0 | 0 % | 14,98 |
| Messer und Qualität | 14 | 0 | 0 % | 10,29 |

Nach Klicks führen Marke (31), Bauweise/Hackblock (8), die Restgruppe (6) und Maßanfertigung (5). Öl/Pflege und Gravur folgen mit je 3. Die geringe Query-Abdeckung erklärt, warum beispielsweise die Aufbereitungsseite 18 jüngere Klicks hat, ihr sichtbares Query-Cluster aber keinen: unbekannte Queries werden nicht erfunden.

Konkrete Chancen in den letzten drei Monaten:

| Reale Query | Impressionen | Klicks | Position | Einordnung |
|---|---:|---:|---:|---|
| schneidebrett nach maß | 263 | 0 | 10,39 | kaufnah; größte klare Position-5–15-/CTR-Chance |
| massivholzbretter | 185 | 1 | 13,70 | Angebotspassung und Landingpage erst im Queryfilter prüfen |
| butcher block | 84 | 2 | 11,13 | konkrete EN-Bauweisen-/Produktchance |
| stirnholzbretter | 79 | 1 | 8,76 | gute Position, geringe Klickzahl; SERP und Intent prüfen |
| hackblock holz | 62 | 0 | 14,95 | kaufnah; vorhandene Hackblock-Seite bevorzugen |
| schneidebrett auf maß | 44 | 0 | 9,57 | bestehende Maßseite stärken |
| schneidebretter nach maß | 43 | 2 | 12,09 | kleiner, aber bereits klickender Longtail |
| holzschneidebrett abschleifen | 31 | 0 | 9,77 | passender Service vorhanden; Snippet-/Intent-Prüfung |

Größte Landingpage-CTR-Chancen sind Aufbereitung (2.224 Impressionen, 0,81 %, Position 11,07) und Brotzeit (1.138, 0,70 %, 16,07). Der aktuelle Ölratgeber hat mehr Sichtbarkeit, liegt aber im Mittel weiter hinten; dort zuerst Querymix und URL-Konsolidierung klären. Keine gute Position für alle Ölqueries unterstellen.

### Steigende und sinkende Queries

Impressionen letzte/vorherige drei Monate: `brotzeitbrett` 253/42, `schneidebrett nach maß` 263/114 und `brotzeitbretter` 141/29 steigen. `massivholzbretter` erscheint mit 185/0; null im Vorzeitraum ist keine bekannte Rankingposition. `firmengeschenke holz` steigt auf 128/0, liegt aber bei Position 46,69 und hat daher geringere Priorität.

Rückläufig: `schneidebrett eiche` 145/252, `servierbrett eiche` 6/68, `schneidebrett nussbaum` 53/105 und `küchenbrett eiche` 25/63. Bei allen vier verbessert sich zugleich die durchschnittliche Position. Das ist kein eindeutiger Qualitätsverlust und ohne Saison-/Querymixvergleich kein gesicherter Nachfrageeinbruch. Gravur-Cluster: 0 statt 3 Klicks trotz 959 statt 610 Impressionen; wegen kleiner Klickbasis beobachten, nicht pauschal umschreiben.

Kommerzielles Potenzial wird qualitativ bewertet, nicht als Umsatz behauptet: Maßanfertigung ist am nächsten an einer konkreten Anfrage, danach Hackblock/Butcher Block und Servicebedarf. Breite Geschenkbegriffe sind weniger eindeutig. Bei `massivholzbretter` ist auch ein Holzmaterial- statt Schneidebrett-Intent möglich; keine neue Landingpage ohne Prüfung. Für die übrigen kaufnahen Cluster existieren passende Seiten, die exakte Zuordnung ist außer den folgenden drei Stichproben noch nicht GSC-verifiziert.

### Seiten mit messbarem Hebel

| Seite | Klicks neu/alt | Impressionen neu/alt | CTR neu | Position neu | Konsequenz |
|---|---:|---:|---:|---:|---|
| `/en/` | 76/10 | 2.351/232 | 3,23 % | 10,87 | stärkste Landingpage; erhalten |
| `/schneidebrett-nach-mass/` | 37/2 | 1.333/222 | 2,78 % | 8,52 | P1; kleine konkrete Erweiterung |
| `/schneidebrett-oel-vergleich/` | 35/3 | 838/296 | 4,18 % | 9,19 | historische Gewinner-URL; bestehende Weiterleitung nicht voreilig ändern |
| `/welches-oel-schneidebrett/` | 24/11 | 2.995/1.604 | 0,80 % | 22,41 | hohe Sichtbarkeit, Querymix und URL-Verteilung prüfen |
| `/schneidebrett-aufbereiten/` | 18/0 | 2.224/56 | 0,81 % | 11,07 | CTR-/Intent-Chance; aktuelle Triage und Preise erhalten |
| `/schneidebrett-saftrille/` | 24/1 | 818/265 | 2,93 % | 15,55 | starker Zuwachs; kein Vollrewrite |
| `/brotzeitbrett/` | 8/1 | 1.138/192 | 0,70 % | 16,07 | Snippet und reale Produktpassung prüfen |
| `/en/butcher-block/` | 9/0 | 511/0 | 1,76 % | 12,74 | kaufnahe EN-Chance |
| `/schneidebrett-eiche-vs-nussbaum/` | 3/0 | 189/0 | 1,59 % | 7,07 | guter Vergleich; schützen |
| `/schneidebrett-nussbaum/` | 2/0 | 247/472 | 0,81 % | 11,79 | Position verbessert; weniger Impressionen nicht isoliert deuten |
| `/schneidebrett-mit-gravur/` | 4/5 | 1.461/988 | 0,27 % | 31,83 | Snippet allein erklärt schwache CTR nicht |

„Niedrige CTR“ ist ein Prüfhinweis, keine Diagnose. Position, Länder, Geräte, Suchabsicht und sichtbare SERP-Elemente beeinflussen Klicks. Keine pauschalen neuen Titles für alle Seiten.

### Verifizierte Query→Landingpage-Stichproben

Exakte Queryfilter, letzte 3 Monate gegen vorherige 3 Monate, im GSC-Interface:

| Exakte Query | Zielseite | Impressionen neu/alt | Klicks neu/alt | Position neu/alt |
|---|---|---:|---:|---:|
| schneidebrett nach maß | `/schneidebrett-nach-mass/` | 262/114 | 0/1 | 10,4/22,5 |
| schneidebrett nach maß | `/schneidebretter-massivholz/` | 1/0 | 0/0 | 4,0/– |
| welches öl für schneidebrett | `/welches-oel-schneidebrett/` | 79/31 | 1/0 | 43,1/43,6 |
| welches öl für schneidebrett | `/schneidebrett-oel-vergleich/` | 7/11 | 0/0 | 27,3/25,8 |
| welches öl für schneidebrett | `/pflege.html` | 0/11 | 0/0 | –/71,7 |
| holzschneidebrett abschleifen | `/schneidebrett-aufbereiten/` | 31/0 | 0/0 | 9,8/– |

Google bevorzugt für Maßanfertigung sichtbar die passende vorhandene URL. Die Ölseiten überschneiden sich bei einer Query. Das belegt **Overlap**, nicht kausal schädliche Kannibalisierung. Query-/Seitenimpressionen können wegen unterschiedlicher Aggregation von Property-Summen abweichen.

Die ältere Ölseite setzt bereits einen Canonical auf `/welches-oel-schneidebrett/` und leitet per JavaScript sowie Meta-Refresh dorthin weiter. Der HTTP-Status der alten URL ist 200, kein serverseitiger 301. Die GSC-Klicks stammen aus dem ausgewerteten Zeitraum; sie beweisen nicht, dass Google die heutige Konsolidierung ignoriert. Vor einer Änderung: beide URLs in der URL-Prüfung auf Googles gewählten Canonical untersuchen, Varianten wie Ölvergleich/Leinölfirnis separat nach Seiten aufschlüsseln, 28-Tage-Verteilung kontrollieren. Bis dahin Canonical und bestehende Weiterleitung erhalten. Die fachlichen Korrekturen am Altinhalt betreffen den statischen Fallback, nicht eine neue sichtbare konkurrierende Seite.

### Geräte, Länder, Darstellung

Langzeit: Mobile 258 Klicks/13.901 Impressionen/1,86 % CTR/Position 12,45; Desktop 161/18.448/0,87 %/30,16; Tablet 16/380/4,21 %/9,29. Unterschiedliche Querymixe können die Positionsunterschiede erklären; kein Beweis für einen technischen Desktopfehler.

Deutschland: 303 Klicks/24.892 Impressionen. Österreich: 20/1.176; Schweiz: 14/652; USA: 11/1.498. Produkt-Snippets: 4 Klicks/264 Impressionen/Position 12,53. Keine erfundenen Rich-Result- oder FAQ-Sichtbarkeitsversprechen.

## Query- und Quellenbeobachtung

Vier Labels bleiben getrennt:

1. **Beobachtete GSC-Query:** im Export tatsächlich enthalten.
2. **Beobachtete öffentliche Suchabfrage:** für diesen Audit selbst in die Websuche eingegeben; kein realer Nutzer und kein ChatGPT-Rewrite.
3. **Abgeleitete Query:** semantisch aus Frage/Angebot/GSC-Cluster abgeleitet.
4. **Vermuteter Rewrite, nicht beobachtet:** mögliche Suchformulierung; keine Behauptung, ChatGPT habe sie erzeugt.

Öffentliche Stichproben am 12.10.2026, teilweise gebündelt abgefragt. Die Rückgabe erlaubt keine belastbare Einzelquery-Rankingposition. Dokumentiert werden Quellenpräsenz und Seitentyp, keine angebliche ChatGPT-Zitation:

| Eingegebene Suchfrage/Thema | Gefundene Primärseiten | Warum als Antwortquelle geeignet? |
|---|---|---|
| Schneidebrett nach Maß Deutschland Kücheninsel | [Kraterholz Kücheninsel](https://kraterholz.com/blogs/kaufberatung/welches-schneidebrett-fuer-kuecheninsel), [EH Atelier](https://edlehoelzer.de/atelier/) | Hersteller-Kaufberatung; Nutzung und freie Arbeitszone statt bloßer Größe |
| Stirnholz oder Langholz Schneidebrett | [Nature Crafts Vergleich](https://naturecrafts.de/blogs/wissenswertes/langsholz-oder-stirnholz-schneidebrett), [Kraterholz Vergleich](https://kraterholz.com/blogs/kaufberatung/stirnholz-oder-laengsholz-schneidebrett) | Vergleichsseiten mit Entscheidungskriterien; Herstellerclaims sind keine unabhängigen Tests |
| welches Öl Schneidebrett Leinölfirnis Lebensmittelkontakt | [EH Ölratgeber](https://edlehoelzer.de/welches-oel-schneidebrett/), [LEINOS Merkblatt](https://leinos.de/api/media/file/280-leinos-technical-datasheet-de.pdf) | Ratgeber bzw. konkrete Produktbedingungen; keine Freigabe einer ganzen Ölart |
| Schneidebrett aufbereiten abschleifen Service | [Nature Crafts Service](https://naturecrafts.de/pages/abschleifservice) | echte Servicebeschreibung und Anfrageweg |
| Schneidebrett mit oder ohne Saftrille | [Nature Crafts Saftrille](https://naturecrafts.de/blogs/wissenswertes/schneidebrett-mit-oder-ohne-saftrille), [Kraterholz Saftrille](https://kraterholz.com/blogs/kaufberatung/schneidebrett-mit-oder-ohne-saftrille) | Unterschiede bei Nutzfläche und Nutzung |
| hochwertiges Schneidebrett Made in Germany handgemacht | [Gunreben Esche](https://www.gunreben.de/products/handgefertigtes-schneidebrett-aus-esche) | konkretes Produkt mit Maßen und Herkunftsangabe |

Fachliche Quellenprüfung: [WÜSTHOF zur Schneidunterlage](https://www.wusthof.com/blog/how-to-choose-the-correct-cutting-board) stützt das Vermeiden sehr harter Unterlagen, nicht eine allgemeine Überlegenheit von Stirnholz. Das LEINOS-Merkblatt ist ein produktbezogenes Beispiel; keine Behauptung, EH verwende dieses Produkt. Keine medizinischen Hygieneversprechen aus Händlertexten übernehmen.

## Citation-Fitness und First-Party

Stärken: reale Eiche-/Yellow-Poplar-Aufträge, konkrete Fugen-/Faserprüfung bei Holzarten, dokumentierte Fertigungsschritte, echte Vorher-Nachher-Bilder, Grenzen der Aufbereitung, nummerierte Erbstücke und persönliche Angebotsabstimmung. Diese Inhalte unterscheiden EH stärker als austauschbare SEO-Absätze.

Schwachstellen: Produktkarten/Bewertungen auf der Startseite sind JS-abhängig; statische Inventur darf sie nicht als fehlendes Angebot interpretieren. `index.html` ruft `renderProductGrid` mit vier kuratierten IDs auf. Kaufprozess auf `produkte.html` ist vorhanden. Keine erneute Homepage-FAQ-Erweiterung nötig.

Die wichtigsten Ratgeber besitzen frühe „Auf einen Blick“-Blöcke. Bei Maßanfertigung wurde eine konkrete Größenberatung im vorhandenen Text ergänzt, nicht der erfolgreiche Hero ersetzt. Keine ausgedachten Gewichte: 29,5 × 20,1 × 1,5 cm und 46 × 36 × 4,6 cm stammen aus dem Katalog; 75 × 60 × 5 cm ist eine Maß-Referenz. Der 7,9-kg-Anker steht im Katalogtitel von Listing `4417507555`; keine eigene neue Wiegung behauptet.

Özgür Koç und seine Werkstattrolle sind auf `/presse/` dargestellt. Ein neues Label „Fachlich geprüft von Özgür Koç“ oder ein Prüfdatum wird **nicht** eingefügt: tatsächliche persönliche Prüfung dieses Diffs ist noch nicht bestätigt. Bestehende Werkstattangaben und passende Links sind ausreichend; keine künstliche Autorität.

## Priorisierung und Umsetzung

| Priorität | Maßnahme | Status/Begründung |
|---|---|---|
| P0 | statischer Fallback der älteren Ölseite: pauschale Lebensmittelechtheit und feste Aushärtungszeiten korrigieren | umgesetzt; vorhandene Weiterleitung bleibt bestehen |
| P0 | Messer-Seiten DE/EN: sichtbare Faserstruktur nicht als Leistungsbeweis darstellen | umgesetzt; sichtbare FAQs und JSON-LD konsistent |
| P1 | Maßanfertigung: konkrete Größen und Handlingorientierung | umgesetzt; kaufnahe Queries und bestehender Traffic; Hero/Preise erhalten |
| P1 | Öl-URL-Verteilung genauer klären | dokumentierter Folgecheck; bestehende Weiterleitung nicht verändern |
| P1 | Aufbereitungs-Snippet und Querymix beobachten | Triage/Preise/Anfrage bereits gut; keine grundlose Änderung |
| P1 | EN butcher block und Brotzeit beobachten | echte Queries; vorhandene Zielseiten statt neue URLs |
| P2 | EN-Ölratgeber: produktspezifische Aushärtung und Sicherheit | umgesetzt, natürliche englische Fassung |
| P2 | interne Clusterverlinkung | Maßseite→Portfolio/Atelier und Ölaltseite→aktueller Ratgeber ergänzt |
| P3 | breite Geschenk-Landingpages erweitern | zurückgestellt; schlechtere Position und weniger direkte Kaufpassung |

Keine neue Content-URL erforderlich. Kleine-Küche- und Kücheninsel-Intent passen in Finder, Maßanfertigung und Atelier. Keine zusätzliche „individuelles-schneidebrett“- oder „personalisiertes-brett“-Seite. EN hat kein separates Maß-Pendant; internationale Anfrage-/Versanddetails erst mit echter Nachfrage und bestätigtem Angebot erweitern, nicht automatisch übersetzen.

## Technik und Schema

`robots.txt` erlaubt allen User-Agents Zugriff und verweist auf `sitemap.xml`. Öffentlicher Robots-Abruf liefert HTTP 200. Lokale technische Prüfung: alle 51 indexierbaren Canonicals in Sitemap, keine JSON-LD-Syntaxfehler. Repository-Crawlability ist nicht gleich vollständiger Live-Crawl/WAF-Prüfung.

Laut [OpenAI-Crawlerdokumentation](https://developers.openai.com/api/docs/bots) ist OAI-SearchBot für Suche relevant; GPTBot und ChatGPT-User haben andere Rollen. Ein erlaubter Crawler garantiert keine Aufnahme oder Zitation. Keine unbegründeten Bot-Regeländerungen. `llms.txt` existiert, wird aber nicht als nachgewiesener Rankinghebel dargestellt.

Vorhandene Typen: BreadcrumbList/FAQPage auf passenden Inhaltsseiten, Article auf Ratgebern, Organization/Person/LocalBusiness im Markenkontext und Product auf echten Teigschaber-Seiten. Keine neuen Sterne, AggregateRatings oder Product-Schemas für generische Kategorien. Geänderte Messer-FAQ-Antworten bleiben mit sichtbarem Inhalt synchron. Weitere Schema-Validierung ist Teil des technischen Regressionstests.

## Testprompts und Messplan

Die 40 Zeilen in der Querymatrix sind das dauerhafte Testset, **noch keine ausgeführten ChatGPT-Tests**. Enthalten sind generische, spezifische, vergleichende, kaufnahe, problemorientierte, Geschenk- und Herkunftsfragen sowie sieben natürliche EN-Fragen.

Für jeden Test protokollieren: Datum, Produkt/Modell, Suchmodus, Sprache/Region, exakt eingegebener Prompt, EH-Domain als Quelle ja/nein, konkrete URL, zitiertes Thema/Absatz, andere Quellen, sichtbare Reihenfolge in dieser Antwort. Unbeobachtbare Rewrites als „nicht verfügbar“ belassen. Keine stabile „ChatGPT-Rankingposition 1“ behaupten.

1. Vor Veröffentlichung erste ChatGPT-Stichprobe aus 10 priorisierten Prompts durchführen, Screenshots/Quellen sichern. Eine normale Websuche zählt nicht als ChatGPT-Test.
2. Nach Veröffentlichung dieselben Prompts nach 2, 4 und 8 Wochen erneut prüfen, möglichst in frischen Sitzungen. Citation Presence (EH wird als Quelle genannt) und Source Presence (EH ist in sichtbaren Quellen enthalten) getrennt zählen.
3. GSC alle 28 Tage nach denselben Clustern und URLs exportieren, zusätzlich Query×Page-Paare für Öl, Maß und Aufbereitung. CTR/Position immer mit Impressionen, Gerät und Land betrachten.
4. Gewinner separat beobachten: Maßseite, Ölaltseite, EN-Startseite, Saftrille. Bei Rückgang zuerst Indexierung/Canonical, Querymix und Datum der Änderung prüfen; nicht sofort pauschal rückbauen.
5. Anonyme bestehende Kontakt-/Etsy-/Finder-Events nach Landingpage auswerten, wenn verfügbar. Klick auf Etsy ist keine Bestellung. Anfragequalität und tatsächliche Verkäufe nur mit separaten Geschäftsbelegen messen.

### Reproduzierbarkeit und CSV-Import

`scripts/analyze-gsc-export.py` akzeptiert GSC-UI-ZIP-Exporte mit deutschen CSV-Spalten. `--comparison` liest die beiden Dreimonatsspalten. CTR wird aus Klicks/Impressionen berechnet; Position impressionsgewichtet. Query-Cluster sind exklusive Regex-Zuordnungen und sollten bei neuen Daten manuell auf Relevanz geprüft werden.

```sh
python3 scripts/analyze-gsc-export.py /pfad/gsc.zip --output /tmp/gsc-summary.json
python3 scripts/analyze-gsc-export.py /pfad/vergleich.zip --comparison --output /tmp/gsc-comparison.json
python3 scripts/search-content-inventory.py --output /tmp/content.json --csv-output docs/search-content-inventory.csv
```

Für einen vollständigen Query×Page-Import künftig API-/CSV-Datei mit `query,page,date,clicks,impressions,position` liefern. Dieser Analyzer unterstützt bewusst **keinen vorgetäuschten Join** aus getrennten Dateien; ein Parser für solche gemeinsamen Daten ist erst bei vorhandenem Export erforderlich. Fehlende/ausgeblendete GSC-Queries bleiben unbekannt, nicht null Nachfrage.

## Social-Ableitungen

Nur Ideen, keine ungefragte Postingserie:

- Maßanfertigung: „Passt das Brett auf die Insel – und anschließend an die Spüle?“
- Bauweise: „Stirnholz ist nicht automatisch das bessere Brett für deinen Alltag.“
- Saftrille: „Mehr Rand oder mehr freie Schneidfläche? Es hängt davon ab, was du schneidest.“
- Pflege: „Trocken ist nicht automatisch vollständig ausgehärtet.“
- Aufbereitung: „Eine matte Oberfläche braucht nicht immer eine Werkstatt.“

## Abnahme

Durchgeführt und bestanden:

- 6 Unit-Tests für GSC-Zahlen, Gewichtung, Vergleichsspalten, Query-Zuordnung und HTML-/FAQ-Extraktion.
- 17 bestehende Finder-Regressionstests; keine Änderung an Matching, Produktdaten oder Analytics.
- Indexierbarkeitsprüfung: 60 HTML-Seiten, 51 indexierbare Canonicals, alle 51 in der Sitemap.
- Zusammenfassungsprüfung: 43 Seiten; Suchindex für 43 Seiten neu erzeugt.
- Inventar aller 60 HTML-Seiten: keine JSON-LD-Syntaxfehler. Geänderte FAQ-Texte im sichtbaren HTML und Schema abgeglichen.
- Playwright: fünf Routen jeweils bei 375, 430, 768, 1024 und 1440 px, insgesamt 25 Kombinationen. Kein horizontaler Seiten-Overflow, keine JavaScript-Seitenfehler, erste Produktbilder erfolgreich geladen. Die alte Ölvergleichsroute folgt ihrer bereits bestehenden Weiterleitung zum aktuellen Ölratgeber; ihr statischer Fallback wurde separat im Quelltext geprüft.
- 50 Hero-/Inhaltsscreenshots unter `/tmp/eh-search-audit`; visuelle Stichproben zeigen lesbare mobile Texte und unveränderte Desktop-Grundstruktur. Keine neue Produktanimation oder neue UI in diesem Audit.
- Unabhängiges Gegenlesen: verbliebene pauschale FAQ-Claims, unklare Query-Evidenz und unvollständige FAQ-Extraktion korrigiert. `git diff --check` ohne Befund.

Grenzen: Chromium-Viewporttests sind kein Test auf einem echten iPhone/Safari. Keine vollständige Live-WAF-/Bot-Prüfung, keine Bestellmessung und keine ausgeführte ChatGPT-Zitationsmessung. GSC enthält keine vollständigen Query×Page-Daten und reicht nicht für einen Jahresvergleich. Keine simulierten Ergebnisse. Änderungen sind lokal, nicht veröffentlicht; kein PR erstellt.
