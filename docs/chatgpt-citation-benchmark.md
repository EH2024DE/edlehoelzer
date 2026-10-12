# Phase 2: ChatGPT Search Citation Benchmark

Stand: 12. Oktober 2026. Repository `EH2024DE/edlehoelzer`, Vergleichsbasis `origin/main` = `38e74c3`. Arbeitsbranch: `codex/search-citation-audit`. Keine produktive Seite in Phase 2 geändert, keine Veröffentlichung.

## Ergebnis und Status

**37 erhaltene ChatGPT-Search-Läufe, 15 deutsche Prompts, die ersten zehn jeweils dreimal in frischen anonymen Konversationen.** Das ist ein tatsächlicher UI-Benchmark, kein Ersatz durch gewöhnliche Suchergebnisse.

Bei den ersten zehn Fragen wurde keine sichtbare EH-Zitation beobachtet. Bei der professionellen Aufbereitung erscheint `edlehoelzer.de` in einem gruppierten Inline-Quellenbadge in einem von drei Läufen. Die konkrete EH-URL ließ sich dort nicht auflösen. Das Badge steht neben Hinweisen zum Ersetzen beschädigter Bretter, nicht neben einer Preisangabe für den Aufbereitungsservice. Welche Teilbehauptung die EH-Quelle innerhalb der Gruppe belegt, bleibt offen.

**Messung mit Restlücken:** Drei Quellenlisten waren nur teilweise erfassbar. Dort wird Source Presence als `unknown` geführt, nicht als Nein. Der Benchmark ist als Arbeitsgrundlage dokumentiert; die vollständige URL-/Quellen-Abnahme ist noch nicht erreicht. Vor Phase-3-Freigabe sind diese Restlücken manuell zu prüfen. Kein Marktanteil, keine Rankingmessung und kein Nachweis eines kausalen Zitierfaktors.

## 1. Methodik

- Vorher gelesen: `search-content-inventory.csv`, `search-page-assessments.csv`, `chatgpt-search-query-matrix.csv`, `chatgpt-search-query-audit.md` und vorhandene GSC-Auswertung.
- EH-Seitenvergleich gegen `main`, nicht gegen die bereits lokal geänderten Phase-1-Texte. Phase 1 ist noch nicht veröffentlicht; insbesondere vorhandene neue Größen-/Gewichtsangaben nicht doppelt planen.
- Produkt: ChatGPT-Weboberfläche, abgemeldet. Sichtbare Modellbezeichnung nur „ChatGPT“, genaue Modellversion nicht offengelegt. „Websuche“ vor jedem Prompt ausgewählt. Deutsche Prompts; Region nicht sichtbar. Sprache ist kein Beleg für eine deutsche Suchregion.
- Eine neue anonyme Konversation pro Lauf. Keine EH-Marke im Prompt, keine vorherigen Antworten, keine Anhänge. Die eigene Testkonversation wurde zwischen den Läufen zurückgesetzt.
- Erfasst: sichtbare Antwort, Inline-Badges, aufgeklappte Quellenkarten und direkt sichtbare Links. Keine Netzwerkinspektion. Keine internen Suchqueries oder Rewrites verfügbar oder behauptet.
- Frühe Kalibrierungsversuche mit unvollständiger Erfassung wurden ersetzt, nicht zusätzlich gewichtet. P12-R1 ist ein erhaltener früher Lauf: Datum bekannt, genaue Uhrzeit nicht erhalten. Die übrigen 36 Zeitstempel stehen in `runs.json`.
- Die Texte enthalten teilweise wiederholte DOM-Snapshots beim Öffnen der Quellenkarten. Das sind keine zusätzlichen Läufe. Generisches „edle Hölzer“ ohne Marken-/Domainbezug zählt nicht als EH-Erwähnung; ein früher informeller Hackblock-Treffer wurde deshalb verworfen.
- Fachliche Aussagen der ChatGPT-Antworten werden nicht automatisch als richtig übernommen. Produktbilder/Shopping-Vorschläge sind getrennt von Artikelzitationen zu behandeln.

[OpenAI beschreibt Inline-Zitationen und den Quellenbereich als unterschiedliche Oberflächenelemente.](https://help.openai.com/en/articles/9237897-searching-the-web-with-chatgpt) Gemessen wurde die tatsächlich sichtbare Oberfläche, nicht die theoretisch verfügbare Funktion.

### Metriken

**Source Presence:** EH in einer geöffneten sichtbaren Quellenliste. Ein nicht geöffnetes `+1`-Badge reicht für diese Metrik nicht aus. `unknown` bedeutet fehlende vollständige Erfassung, nicht Abwesenheit.

**Citation Presence:** EH als sichtbarer Inline-Beleg zu einer Antwortpassage. `yes_grouped` bedeutet EH in einem gemeinsamen Badge mit weiteren Quellen; die Zuordnung zur einzelnen Teilbehauptung ist ungeklärt. `no_visible` bedeutet keine sichtbare EH-Zitation, nicht einen Beweis, dass EH nie im Suchprozess vorkam.

**Brand Mention:** eigenständige Markenerwähnung separat; P12-R1 enthält nur die zitierte Domain, keine Herstellerempfehlung.

Die CSV-Felder `competitor_1..3` sind die zuerst beobachteten Quellen, nicht „Top 3“ oder eine Relevanzrangfolge. `source_order` und `all_visible_sources` enthalten auch weitere Quellen. `direct_visible_urls` enthält tatsächlich sichtbare Linkziele. Titelabgleich über öffentliche Suche wird nicht als beobachteter Zitations-href ausgegeben.

## 2. Kohorte und Ergebnisse

Die folgenden Prompts wurden exakt ausgeführt. Brüche zeigen positive Beobachtungen / vollständig beobachtbare Läufe; `+ 1 ?` kennzeichnet einen zusätzlichen unvollständigen Lauf. Citation Presence zählt sichtbare EH-Badges über alle ausgeführten Läufe.

| ID | Exakter Prompt | Läufe | EH Source | EH Citation | Wiederholt sichtbare Quellen / Kontext |
|---|---|---:|---|---|---|
| P01 | Welches Schneidebrett nach Maß ist für eine Kücheninsel sinnvoll? | 3 | 0/2 + 1 ? | 0/3 | Aboutwood; einmal Kraterholz; P01-R2 unvollständig |
| P02 | Wo kann ich ein hochwertiges Schneidebrett nach Maß in Deutschland kaufen? | 3 | 0/3 | 0/3 | SPECHTWERK 3/3; weitere Maßanbieter |
| P03 | Wie groß sollte ein Schneidebrett für eine Kücheninsel sein? | 3 | 0/3 | 0/3 | Kraterholz 2/3; Wick & Whittle; ZWILLING |
| P04 | Stirnholz oder Langholz – was ist besser? | 3 | 0/3 | 0/3 | NatureCrafts 3/3; Boos-Materialseite 3/3 |
| P05 | Ist ein Stirnholzbrett besser für hochwertige Küchenmesser? | 3 | 0/3 | 0/3 | Serious Eats 3/3; Vivront 2/3 |
| P06 | Was ist ein guter Hackblock aus Holz? | 3 | 0/3 | 0/3 | WELT 3/3; Produktvergleich.io 2/3 |
| P07 | Welches Holz eignet sich am besten für ein Schneidebrett? | 3 | 0/3 | 0/3 | WOOD Magazine und Bob Vila jeweils 3/3 |
| P08 | Eiche oder Nussbaum – welches Holz ist besser für ein Schneidebrett? | 3 | 0/3 | 0/3 | wechselnde Quellen; „which wood for a chopping board?“ 2/3 |
| P09 | Welches Schneidebrett eignet sich zum Grillen und Tranchieren? | 3 | 0/3 | 0/3 | boosblocks.de 2/3; Restaurantware, Customcuts, Bon Appétit |
| P10 | Ist eine Saftrille bei einem Schneidebrett sinnvoll? | 3 | 0/3 | 0/3 | Bevel & Bond, USDA FSIS, University of Maine jeweils 2/3 |
| P11 | Wie schleift man ein Holzschneidebrett richtig ab? | 1 | 0/1 | 0/1 | Martha Stewart; Care Instructions; Deer & Oak |
| P12 | Wann lohnt sich die professionelle Aufbereitung eines Schneidebretts? | 3 | 0/2 + 1 ? | 1/3 gruppiert | EH +1 in R1; BfR, Verbraucherzentrale, USDA in anderen Läufen |
| P13 | Welches Öl eignet sich für ein Holzschneidebrett? | 1 | 0/1 | 0/1 | How To Make A Cutting Board; Help & contact; Bevel & Bond |
| P14 | Welches Brett eignet sich für Brotzeit und Servieren? | 1 | ? | 0/1 | woodprojectstosell.com +1; Manufactum als sichtbarer Kauf-Link |
| P15 | Woran erkennt man ein hochwertiges Schneidebrett? | 1 | 0/1 | 0/1 | Bevel & Bond, Manufactum, FSAI und weitere |

Die Häufigkeiten beschreiben nur diese Stichprobe. Unterschiedliche Antwortformen und Anbieterlisten zeigen Varianz innerhalb desselben Tages. Englische Quellen in deutschen Antworten sind keine EN-Kohorte. EN wird später separat getestet; die erfolgreiche `/en/`-Seite rechtfertigt keinen ungeprüften Rewrite.

### Antwortstruktur

P01–P03 kombinierten Größen-/Bauweisenberatung mit Anbieter- oder Produktbeispielen. P04–P10 waren überwiegend abwägende Sachantworten mit Kriterien, Listen oder Tabellen. P11–P13 stellten Ablauf, Pflege oder Austauschgrenzen dar. P14 enthielt konkrete Servierprodukt-Vorschläge; P15 Qualitätskriterien und Produktkontext. Die CSV-Zusammenfassungen beschreiben diese Muster, keine vollständige Transkription. Die einzelnen Antworten sind in den Belegen erhalten.

## 3. Belege und Reproduzierbarkeit

- [Alle Läufe als CSV](chatgpt-citation-results.csv)
- [Gap-Matrix als CSV](chatgpt-competitor-gap.csv)
- [Zeitstempel und Session-Metadaten](benchmark-evidence/2026-10-12/runs.json)
- Einzelbelege: `benchmark-evidence/2026-10-12/p01-r1.txt` bis `p15-r1.txt`, einschließlich R2/R3 der ersten zehn sowie P12-R2/R3.
- [Schluss der Aufbereitungsantwort P12-R1](benchmark-evidence/2026-10-12/p12-r1.png), [Bauweisenantwort P04-R1](benchmark-evidence/2026-10-12/p04-r1.png), [Kücheninselantwort P01-R1](benchmark-evidence/2026-10-12/p01-r1.png). Der P12-Screenshot zeigt nicht die weiter oben liegende EH-Passage; dafür ist der vollständige Text-/DOM-Beleg `p12-r1.txt` maßgeblich.
- [Wettbewerber-Metadaten aus dem DOM](benchmark-evidence/2026-10-12/competitor-page-metadata.json): URL, Title, H1, H2, Tabellen und JSON-LD. Kein Rich-Result-Test und kein Beleg, dass Schema die Zitierung verursachte.
- Anonyme Session-URLs sind keine dauerhaften öffentlichen Sharelinks. Maßgeblich sind gespeicherte UI-Belege. Das Quellen-Popover zeigte oft Titel/Provider, aber keinen href. Eine eindeutige öffentliche Titelzuordnung wird als `public title match` gekennzeichnet; sie ersetzt keine direkte URL-Beobachtung.
- Rebuild/Validierung: `python3 scripts/build-citation-benchmark.py`. Prüft Anzahl, IDs, Wiederholungen, drei partielle Erfassungen und genau eine gruppierte EH-Zitation.

## 4. Competitor Gap: beobachtbare Architektur

Dies sind Hypothesen aus beobachteten Seitenmerkmalen, keine Aussagen darüber, warum ChatGPT intern eine Quelle gewählt hat. Einige Quellen sind Fachinstitutionen, keine kommerziellen Wettbewerber. Nicht jede sichtbare Quelle wurde tief geprüft; nicht geprüfte Felder stehen in der CSV ausdrücklich auf `unknown`.

| Quelle / geprüfte Seite | Einstieg und Informationsstruktur | Eigene Evidenz / Grenzen | Verbindung und Schema |
|---|---|---|---|
| [Kraterholz Kücheninsel](https://kraterholz.com/blogs/kaufberatung/welches-schneidebrett-fuer-kuecheninsel) | Kurze Nutzungsentscheidung, Formate, Bauweisenvergleich, FAQ | Produktbezug; kein dokumentiertes Gewichtspaar beobachtet | Guide-/Produktlinks; Article, FAQPage, BreadcrumbList; Datum 24.09.2026 |
| [NatureCrafts Bauweisen](https://naturecrafts.de/blogs/wissenswertes/langsholz-oder-stirnholz-schneidebrett) | Kompakte Gegenüberstellung mit Alltagsszenarien | Einschränkungen statt pauschaler Messer-Garantie; kein eigener Paarversuch beobachtet | Eigene Produkte; Article/BreadcrumbList; Datum 09.03.2026 |
| [SPECHTWERK Maßprodukt](https://www.spechtwerk.com/shop/erhoehtes-schneidebrett-nach-mass/) | Direktes konfigurierbares Angebot mit Produktspezifikation | Produkt-/Materialoptionen; nicht mit einer universellen Gewichtszahl gleichsetzen | Product/Offer/ItemPage. Dieses Linkziel wurde direkt in P02-R1 beobachtet |
| [SPECHTWERK Stirnholz, zusätzliche Portfolioprüfung](https://www.spechtwerk.com/shop/stirnholzbrett-nach-mass/) | Maßoptionen und konkreter Fertigungsablauf | Werkstattbilder/Video; Holzbewegung thematisiert | Product/Offer/VideoObject. Nicht als identische Zitations-URL ausgeben |
| [Aboutwood Eiche](https://aboutwood.de/products/stirnholz-schneidebrett-eiche) | Größen, Stärken und Ausstattungsoptionen | Konkretes Produkt; Marketing ist keine unabhängige Prüfung | FAQ und Kaufpfad; in diesem DOM-Snapshot kein JSON-LD erfasst |
| [Bevel & Bond Saftrille](https://bevelandbond.com/blogs/blog/best-cutting-board-with-juice-groove) | Kurzantwort, Gegenüberstellung und Produktdaten | Eigene Produkte; manche Mindeststärken-/Rückseitenclaims nicht als allgemeine Norm übernehmen | James Taylor, 19.08.2026; FAQPage/BlogPosting und Produktlinks |
| [WELT Hackblock](https://www.welt.de/vergleich/hackblock/) | Modellvergleich, Spezifikationen, Auswahlkriterien | Affiliate-Kontext; physischer Test nicht verifiziert | Marc H.; Article/Product/Review/ItemList; 25.09.2026 |
| [Serious Eats Brettertest](https://www.seriouseats.com/best-wooden-cutting-boards) | Vergleich mit dokumentierter Prüfmethode | Eigene Fotos, Messer-/Nutzungsversuche, Maße und Nachteile | Grace Kelly; aktualisiert 30.09.2026; NewsArticle/ItemList/Product |
| [WOOD Magazine Holzarten](https://www.woodmagazine.com/wood-supplies/wood-species/best-food-safe-wood-cutting-boards) | Eng fokussierte Frage/Antwort | Arten-/Porenunterscheidung; Roteiche nicht pauschal auf europäische Eiche übertragen | Redaktion; NewsArticle; Datum 20.01.2021 |
| [Deer & Oak Schleifen](https://www.deerandoak.co.uk/blogs/news/how-to-sand-a-wooden-cutting-board) | Direkte Schleifabfolge, FAQ und Produkttabelle | Größen/Gewichte; kein belegter eigener Reparaturfall beobachtet | Produktlinks; kein JSON-LD im erfassten DOM |

Title und H1 sind vollständig im Metadatenbeleg erhalten. Sichtbarer Autor und ein `Person`-Schema sind nicht dasselbe: ein Schema-Name allein wird nicht als sichtbare Expertenbiografie bewertet. Auch fehlendes JSON-LD im Snapshot beweist nicht dauerhaftes Fehlen. Aktualität allein erklärt die Beobachtung nicht: eine ältere Fachantwort war wiederholt sichtbar. Das Datumsfeld einer ChatGPT-Quellenkarte wich bei Serious Eats vom aktuellen Seitendatum ab.

Der öffentliche Titelabgleich für [Rune-Jakobsen Eiche/Nussbaum](https://rune-jakobsen.com/en-de/blogs/rune-jakobsen-design/oak-vs-walnut-which-type-of-wood-is-best-for-cutting-boards) zeigt referenzierte Artenwerte und die Grenze von Härtewerten. Direkter Seitenabruf blieb unvollständig; Autor/Schema werden deshalb nicht behauptet. EH benötigt daraus keinen Title-/H1-Umbau.

## 5. GSC-Abgleich und EH-Matrix

Reale GSC-Exporte vom 12.10.2026, Daten 28.03.–09.10.2026 (196 Tage), zusätzlich letzte drei Monate gegen vorherige drei. Kein belastbarer Vorjahresvergleich. Query-Tabelle auf 1.000 sichtbare Zeilen begrenzt. Demand ist beobachtete Impressionenzahl, kein externes Suchvolumen.

Gesamt: 435 Klicks / 32.729 Impressionen. Letzte drei Monate: 342 / 23.823 gegenüber 90 / 8.889. Clusterzahlen unten stammen teils aus dem Gesamtfenster, einzelne Queries/URLs aus dem jüngsten Dreimonatsfenster; die Zeiträume werden nicht addiert. Kein Query→Umsatz-Join. Nur die Maß- und Abschleif-Queries sind hier als konkret geprüfte Query→Seite-Verknüpfung verwendet; weitere Zielseiten sind fachlich zugeordnet, nicht aus getrennten GSC-Tabellen zusammengefügt.

| Prompt | EH-Zielseite | EH Source / Citation | GSC-Evidenz | EH-Stärke | Gap-Hypothese / kleine Maßnahme | Priorität |
|---|---|---|---|---|---|---|
| P01 | `/schneidebrett-nach-mass/` | 0/2 + ? / 0/3 | Maß-Cluster 554 Impr.; Query nach Maß zuletzt 263, Pos. 10,39 | Zwei reale XXL-Projekte, Anfrageablauf | Bestehende Inselreferenz mit verifizierten Maßen/Gewicht und Entscheidungsgrund beschriften | A+ |
| P02 | gleiche URL | 0/3 / 0/3 | Zielseite zuletzt 1.333 Impr., Pos. 8,52, 37 Klicks | Echter Hersteller und persönliche Fertigung | Kaufnahe Produktspezifikation zur Referenz; Kaufweg besteht bereits | A+ |
| P03 | gleiche URL | 0/3 / 0/3 | gleiche Maß-Chance; keine separate Insel-Query-Zahl behauptet | Größenberatung existiert | Reales Platz-/Nutzungsbeispiel statt weiterer pauschaler Größe | A |
| P04 | `/stirnholz-vs-langholz/` | 0/3 / 0/3 | Bauweisencluster 1.271 Impr.; stirnholzbretter zuletzt 79, Pos. 8,76 | Tabelle, Contra, Alltagshandling bereits vorhanden | Gleiche Formatklasse mit echtem Gewicht vergleichen | A |
| P05 | `/messerschonendes-schneidebrett/`, Bauweisenvergleich | 0/3 / 0/3 | Bauweisencluster, keine separate exakte Messer-Chance belegt | Keine unbelegte automatische Überlegenheit | Kein fingierter Messertest; Phase-1-Korrekturen zuerst berücksichtigen | B |
| P06 | `/hackblock/` | 0/3 / 0/3 | hackblock holz zuletzt 62 Impr., Pos. 14,95 | Eigene massive Produkte, Nutzungsgrenzen | Statische reale Spezifikation und explizite Hackbeil-Eignung nur nach Freigabe | A |
| P07 | `/holzarten-schneidebrett/` | 0/3 / 0/3 | Holzcluster 1.606 Impr., Pos. 41,95 im Gesamtfenster | Breite Material-/Bauweisenberatung | Exakte Arten-/Werkstattentscheidung; nicht einfach mehr Holzlisten | B |
| P08 | `/schneidebrett-eiche-vs-nussbaum/` | 0/3 / 0/3 | Seite zuletzt Pos. 7,07, 189 Impr. | Bereits erfolgreicher Vergleich | Keine Änderung; ggf. konkrete Artenquelle separat prüfen | C |
| P09 | `/hackblock/`, `/schneidebrett-saftrille/` | 0/3 / 0/3 | Hackblock-Chance; keine isolierte BBQ-Demandzahl belegt | Schneiden/Tranchieren und Produktbezug | BBQ-Beispiel in Hackblock-Spezifikation; kein reines Servierbrett empfehlen | A für Hackblock |
| P10 | `/schneidebrett-saftrille/` | 0/3 / 0/3 | Seite zuletzt 818 Impr., Pos. 15,55, CTR 2,93 % | Vergleich, Contra und Flächenverlust vorhanden | Nicht neue Tabelle; optional reale nutzbare Fläche / glatte Rückseite | B, geschützt |
| P11 | `/schneidebrett-aufbereiten/` | 0/1 / 0/1 | abschleifen Query 31 Impr., Pos. 9,77; Seite 2.224, Pos. 11,07 | Ablauf, Preise und Vorher/Nachher vorhanden | Beschriftung eines echten Reparaturfalls, keine neue Anleitung nötig | A |
| P12 | gleiche URL | 0/2 + ? / 1/3 gruppiert | Aufbereitung 207 Impr. im Gesamtcluster; kommerzieller Service | Service und Reparatur-/Austauschgrenzen | Erst zitierte EH-URL prüfen; belegten Fall ergänzen statt Gewinner neu schreiben | A, bedingt |
| P13 | `/schneidebrett-oel-vergleich/`, `/welches-oel-schneidebrett/` | 0/1 / 0/1 | Ölcluster 3.887 Impr.; alte URL zuletzt 35 Klicks, CTR 4,18 % | Konsolidierung und Pflegeinhalt bestehen | Keine neue Öl-URL / erneute Redirect-Empfehlung | C, geschützt |
| P14 | `/brotzeitbrett/` | ? / 0/1 | brotzeitbrett zuletzt 253 Impr., Pos. 17,73; Seite 1.138, Pos. 16,07 | Frühstück/Servieren bereits unterschieden | Reale Formate und Servieren-only-Grenze als kleine Zuordnung | B, nach Quellenprüfung |
| P15 | `/holzarten-schneidebrett/`, Produktseiten | 0/1 / 0/1 | kein eigenständiger Qualitäts-Cluster belastbar isoliert | Verarbeitung und echte Produkte | Keine neue Qualitäts-URL; vorhandene Werkstattbelege nutzen | C |

### Qualitatives Prioritätsmodell

| Cluster | Demand | Rankingchance | Kaufnähe | Citation Gap | Eigener Belegvorteil | Änderungsrisiko | Stufe |
|---|---|---|---|---|---|---|---|
| Maß | vorhanden | hoch, ca. 10 | sehr hoch | mehrfach, eine Erfassung offen | hoch: reale XXL-Bretter | hoch bei Rewrite, niedrig bei belegter Bildbeschriftung | A+ |
| Hackblock | kleiner, konkret | hoch, ca. 15 | sehr hoch | mehrfach | hoch: eigenes Sortiment | mittel: Verwendung korrekt eingrenzen | A |
| Bauweise | vorhanden | relevante Begriffe 9–12; nicht identisch mit Page-Position | mittel | stabil bei P04 | hoch für Handling, ungeklärt für Messertest | mittel | A |
| Aufbereitung | vorhanden | hoch, ca. 10–11 | sehr hoch | gemischt, EH einmal sichtbar | hoch: echte Fälle | hoch bei Rewrite, niedrig bei Fallcaption | A |
| Brotzeit | vorhanden | mittel, ca. 16–18 | mittel | nur ein partieller Lauf | hoch: konkrete Servier-/Alltagsprodukte | niedrig bei kleiner Formatzuordnung | B |
| Saftrille | vorhanden | mittel | mittel | mehrfach | potenziell reale Fläche | Gewinner schützen | B |
| Holz / Eiche-Nussbaum | breit vorhanden | Holz niedrig, Vergleich bereits gut | mittel | mehrfach | Arten- und Materialentscheidung | Vergleich schützen | B / C |
| Öl / EN | vorhanden / erfolgreiche EN-Seite | bestehende Gewinner | teils niedriger | Öl nur einmal; EN ungetestet | keine neue Generic-Textchance bewiesen | hoch bei Konsolidierungs-/Title-Umbau | C |

„A+“ bedeutet zuerst fachlich prüfen und vorbereiten, nicht sofort veröffentlichen. Source-Lücken, Owner-Daten und die noch unveröffentlichte Phase 1 bleiben Freigabebedingungen. Das Modell ist bewusst qualitativ, kein pseudoexakter Score.

## 6. Citation Blocks: Was fehlt wirklich?

| EH-Seite | Eigenständig verständlicher Antwortblock auf main? | Schluss |
|---|---|---|
| Maß | Kurze Zusammenfassung von Wunschmaß, Holz, Optionen und Ablauf; Budgetorientierung | Inselbezug mit konkretem bestehenden Projekt stärken, nicht die ganze Seite ersetzen |
| Bauweisen | Faserorientierung/Handling, bereits Tabelle und kein allgemeiner Sieger | Kein Struktur-Gap „fehlende Vergleichstabelle“; echte Vergleichsdaten sind der mögliche Informationsgewinn |
| Hackblock | Definition und Einsatz; Produktkarten dynamisch | Reale Maße/Gewicht/Verwendung könnten im statischen Kontext eigenständig stehen |
| Holzarten | Direkte geeignete Arten und kein pauschal bestes Holz | Artenbelege/konkrete Materialwahl statt neuer generischer Einleitung |
| Saftrille | Flüssigkeit, Fläche und Reinigung klar abgewogen | Bereits zitierfähige Struktur; optionale echte Messung, keine Universalregel |
| Aufbereitung | Nachölen/Schleifen/Ersetzen mit No-go-Grenzen | Vorher/Nachher-Fall bekommt Kontext; bestehende Kosten nicht erneut ergänzen |
| Brotzeit | Frühstück/Brotzeit/Servieren erklärt | Echte Formate und Rollen sind der kleine verbleibende Konkretisierungspunkt |

Ein neuer Block darf 2–5 Sätze haben, eine Frage beantworten und eine Grenze nennen. Beispielstruktur, **noch kein zur Veröffentlichung freigegebener Text**: Nutzung → reale Spezifikation → Entscheidung → Einschränkung. Gewichte, Abtrag, Produktfreigaben und Kundenkontext niemals aus dem Bild schätzen.

## 7. Maximal fünf Kandidaten für Phase 3

### 1. Maßanfertigung, A+
**Aktueller Abschnitt:** vorhandene Eiche-/Yellow-Poplar-XXL-Projekte und Größenberatung. **Problem:** Fotos zeigen reale Arbeit, aber ein vollständig belegtes Beispiel ist noch nicht durchgehend als eigenständige Spezifikation vorhanden. **Kleine Änderung:** eine Projektcaption mit Format, Stärke, gemessenem Gewicht, Aufstellweise und tatsächlichem Grund der Materialentscheidung. Die schon lokal ergänzten Phase-1-Maße/Gewichtsanker vorher prüfen und nicht duplizieren. **Warum:** verbindet kaufnahe Größenfrage mit eigener Herstellung. **GSC:** Query Pos. 10,39, Seite Pos. 8,52. **ChatGPT:** P01–P03 keine sichtbare EH-Zitation, SPECHTWERK/Kraterholz wiederholt. **Risiko:** niedrig für eine freigegebene Caption; kein Title/H1-Rewrite. **OWNER INPUT REQUIRED:** reales Projektgewicht und bestätigter Entscheidungsgrund, sofern nicht bereits dokumentiert.

### 2. Hackblock, A
**Aktueller Abschnitt:** Definition, Nutzungen, drei dynamische Produktbeispiele. **Problem:** statische Produkt-/Verwendungsdaten nicht so konkret wie das tatsächliche Sortiment. **Kleine Änderung:** ein statischer kleiner Spezifikationsblock zu einem bestehenden Brett: Maße, Stärke, gemessenes Gewicht, sinnvoller fester Einsatzort, klare Trennung Schneiden/Tranchieren versus Hackbeil. **Warum:** eigene Produktdaten statt fremder Vergleichsrankings. **GSC:** hackblock holz Pos. 14,95. **ChatGPT:** WELT P06 3/3, keine EH-Zitation. **Risiko:** mittleres fachliches Risiko bei Schlag-/Messerclaims, sonst klein. **OWNER INPUT REQUIRED:** Gewicht und ausdrücklich bestätigte Hackbeil-Eignung bzw. Nichtfreigabe.

### 3. Stirnholz versus Langholz, A
**Aktueller Abschnitt:** bestehende Gegenüberstellung/Handling. **Problem:** allgemeine Bauweisenunterschiede sind schon gut beantwortet; mehr Standardtext differenziert nicht. **Kleine Änderung:** ein reales ungefähr gleich großes Paar aus dem Sortiment mit gemessenen Gewichten und sachlicher Handhabungsbeschreibung, keine erfundene Prozentzahl zur Messerschonung. **Warum:** echte Kaufabwägung. **GSC:** Bauweisencluster und stirnholzbretter Pos. 8,76, kein behaupteter Query-Page-Join. **ChatGPT:** NatureCrafts P04 3/3, EH 0/3. **Risiko:** niedrig bis mittel; Tabelle/Title/H1 erhalten. **OWNER INPUT REQUIRED:** zwei passende reale Stücke und Gewichte. Kein Knife-Edge-Test behaupten.

### 4. Aufbereitung, A mit Gewinner-Schutz
**Aktueller Abschnitt:** Vorher/Nachher und Servicepakete. **Problem:** Bildnachweis ohne vollständig nachvollziehbaren Fallkontext. **Kleine Änderung:** bei einem vorhandenen Fall Ausgangsschaden, echte Maßnahme, ggf. gemessenen Abtrag, reale Endkosten und Grenze der Reparatur ergänzen. **Warum:** selbst erzeugte Evidenz ist glaubwürdiger als eine zweite Schleifanleitung. **GSC:** Abschleifquery Pos. 9,77; Seite Pos. 11,07. **ChatGPT:** einmal gruppierte EH-Zitation, URL offen; keine pauschale Unsichtbarkeit behaupten. **Risiko:** niedrig bei Caption; hohe Gefahr bei Rewrite des funktionierenden Ratgebers. Preise 41–64 € / 95–154 € sind bereits vorhanden und bleiben unangetastet. **OWNER INPUT REQUIRED:** bestätigte Falldaten; zuerst EH-Zitationsziel verifizieren.

### 5. Brotzeit, B und bedingt
**Aktueller Abschnitt:** Auswahlhilfe Frühstück/Brotzeit/Servieren. **Problem:** Verwendungsrollen/Formatunterschiede könnten näher am realen Sortiment stehen. **Kleine Änderung:** drei existierende Produktformate den Rollen Einzel-Frühstück, Familien-Brotzeit und Gäste-/Tapas-Servieren zuordnen; kleines Alltagsbrett nicht als große Gästeplatte, Servier-only-Produkt nicht als tägliches Arbeitsbrett darstellen. **Warum:** konkrete Nutzung statt emotionaler Etiketten. **GSC:** 253 Impr., Pos. 17,73. **ChatGPT:** P14 nur ein unvollständiger Quellenlauf, daher schwächer abgesichert. **Risiko:** niedrig nach korrekter Produktklassifizierung; keine neue URL. **OWNER INPUT REQUIRED:** Freigabe der drei Produktrollen, bestehende Maße aus Katalog übernehmen. Vor Umsetzung P14-Quellen vervollständigen und weitere Läufe ausführen.

**Nicht in dieser Phase ändern:** Öl-Konsolidierung, `/welches-oel-schneidebrett/`, Saftrillen-Title/H1, Eiche-Nussbaum-Title/H1 und `/en/`. Keine neuen URLs, keine Robot-Regeländerung und keine öffentlich sichtbaren „AI optimized“-Labels.

## 8. Manuelles Nachtest-Protokoll

1. Neue ChatGPT-Konversation starten. Für einen Vergleich denselben Login-Zustand/Produktmodus dokumentieren; personalisierte eingeloggte Tests nicht mit anonymen Läufen unmarkiert vermischen.
2. Search/Websuche explizit aktivieren. Datum, Uhrzeit, sichtbare Modellbezeichnung, Sprache und Region nur soweit tatsächlich angezeigt notieren.
3. Exakten Prompt aus der Tabelle einfügen. Marke nicht ergänzen und keine Folgefrage zur Beeinflussung stellen.
4. Vollständige Antwort abwarten. Antwort als Text und Screenshot sichern, inklusive Quellenbadge.
5. Jedes Quellenbadge öffnen, insbesondere `+N`; Quellenliste und Reihenfolge dokumentieren. Quellenkarten öffnen und reale Adressleisten-URL notieren. Homepage/Kauf-Link nicht mit Artikelzitation verwechseln.
6. EH Source Presence separat von EH Citation Presence erfassen. Bei gruppiertem Badge Gruppe und Passage notieren, keine eindeutige Teilbehauptungszuordnung erfinden. Eigenständige Brand Mention zusätzlich erfassen.
7. Alle sichtbaren Quellen mit Titel, URL und Seitentyp dokumentieren. Nicht sichtbare interne Queries leer lassen.
8. Unvollständige Quelle als `unknown` markieren. Screenshots etwa `P12-R4-answer.png` und `P12-R4-sources.png` benennen. Neue Lauf-ID verwenden, alte Messung nicht still ersetzen.
9. Neue Konversation für Wiederholung. Die ersten zehn erneut dreimal testen, wenn Modell-/Loginmodus geändert wird; getrennte Kohorte bilden.
10. Aggregieren als x/n unter Angabe fehlender Messwerte; keine Interpretation als Marktanteil. Inhaltliche Änderungen erst nach fachlichem Review und Quellenprüfung freigeben.

### Offene Verifikationen

- P01-R2: versteckte zweite Quellen von Aboutwood/continenta nicht vollständig erfasst.
- P12-R1: genaue EH-URL und weiterer Provider im `+1`-Badge offen. Ein neuer Lauf kann die damalige Quelle nicht rückwirkend beweisen; historische URL bleibt unbekannt, neue Messung separat speichern.
- P14-R1: zweite Quelle hinter woodprojectstosell.com offen; eine sichtbare Manufactum-Homepage ist keine verifizierte Produktartikel-URL.
- Mehrere Citation-Popover zeigen nur Titel/Provider. Öffentlich gefundene URLs in der Gap-CSV sind entsprechend gekennzeichnet; nicht alle konkreten Zitations-URLs sind verifiziert.
- P11/P13/P14/P15 bislang je ein Lauf; Aussagen zur Stabilität dort nicht zulässig. EN-Kohorte ausstehend.
- Gewichtspaare, Reparaturabtrag und konkrete Materialentscheidungen benötigen verifizierte Owner-Daten. Keine Daten nach Bild geschätzt.
- Keine inferierte Ursache zwischen Schema, Absatzformat, Aktualität und Citation Presence. Keine Search-Nachfrage mit Conversion verwechselt.

## 9. Abnahme

Erreicht: 15 priorisierte GSC-/Kaufprompts, echte Search-UI-Tests, Dreifachmessung der ersten zehn, getrennte Metriken, Wettbewerber je Cluster, echte GSC-Priorisierung, höchstens fünf kleine Phase-3-Vorschläge, Gewinner-Schutz und dokumentierte Grenzen.

Noch offen: vollständige Quellen-/URL-Verifikation der drei partiellen Läufe und mehrere konkrete Citation-hrefs. Deshalb **keine unbedingte Freigabe für Phase-3-Contentänderungen**. Die nächste sinnvolle Handlung ist der kurze manuelle Quellencheck plus Freigabe der vorhandenen Werkstattdaten, nicht weiteres Schreiben auf Verdacht.
