# Phase 3: Citation-Fitness und eigene Werkstattbelege

Stand: 12. Oktober 2026. Basis: `origin/main` / `38e74c335178b34ec8b0838c82357c535c7fb043`, nach erneutem Fetch unverändert. Arbeitsbranch `codex/search-citation-audit`. Nicht veröffentlicht.

## Vorab-Abgleich

Vor dem Editieren geprüft: Phase-1-Diff, Phase-2-Bericht/Ergebnis- und Gap-CSV, Inventar, Seitenbewertungen, Query-Matrix, GSC-Auswertung und gespeicherte Benchmark-Belege. Produktdaten werden unverändert verwendet.

| Bereits vorhanden | Neu erforderlich | Owner-Daten erforderlich | Nicht umsetzen |
|---|---|---|---|
| Maß: zwei reale Kundenprojekte, Holzarten/Details, Anfragepfad; lokal in Phase 1 bereits drei Größen und 7,9-kg-Kataloganker | Frühe eigenständige Inselantwort; vorhandene Projekttexte sachlich einordnen | Maße/Gewicht und tatsächlicher Einsatz-/Auswahlgrund genau dieser beiden Projekte | 75 × 60 cm nicht anhand eines Bildes einem Kundenprojekt zuordnen; keine zweite Größentabelle |
| Hackblock: Produkte und Auswahlberatung dynamisch; Katalog 4417507555 enthält Maße, 7,9 kg, Holz, Bauweise, keine Saftrille, Fertigung auf Bestellung | Statischer Referenzblock; knappe Auswahlantwort; keine implizite Schlagfreigabe | Hackbeil-Eignung nur bei ausdrücklicher produktbezogener Freigabe | Keine Garantie gegen Verrutschen; keine sofortige Lagerverfügbarkeit für dieses Referenzprodukt |
| Bauweise: Tabelle, Contra, Finder-CTA; Eiche Langholz 40 × 30 × 3 cm und Stockbuche Stirnholz 41 × 30 × 4,7 cm im Katalog | Zwei reale, ähnlich große Produktformate; Unterschied von Produktvergleich und Bauweisentest erklären | Gewicht des Langholzbretts / gemessenes vergleichbares Paar | Keine Aussage, welches der beiden leichter ist; kein Messerexperiment |
| Aufbereitung: dokumentiertes Fremdbrett, trockene matte Oberfläche, Glätten/Neuölen, Bilder, Preise und No-go-Grenzen | Bestehenden Fall in Zustand/Maßnahme/Ergebnis/Grenze gliedern; kurze frühe Antwort | Fallpreis, Zeitraum, Abtrag, Holzart und zusätzliche Reparaturschritte | Keine Zuordnung der Paketpreise als reale Rechnung dieses Falls |

Phase-1-Änderungen an Öl-/Messerseiten und `assets/search-pages.json` bleiben unangetastet. Sie liegen bereits lokal vor, nicht in main. Brotzeit ist Reserve und wird nicht geändert, solange zusätzliche P14-Quellenmessungen fehlen.

## 1. Executive Summary

Vier bestehende Seiten wurden klein und gezielt verbessert: frühe Kurzantworten, statische echte Produktdaten, sachlich eingeordnete Kundenbeispiele und ein strukturierter Aufbereitungsfall. Keine neue URL, kein Title-/H1-Rewrite, keine neue Schema-Schicht, kein Publish. Der fehlende gemessene Bauweisenvergleich wird ausdrücklich nicht durch Berechnungen ersetzt. Die vorhandenen Anfrage- und Finderwege bleiben bestehen.

Die Seiten wurden anhand beobachteter Citation Gaps und vorhandener First-Party-Daten verbessert. Ob sich Source oder Citation Presence verändert, muss nach Veröffentlichung gemessen werden. Ein geschlossener Citation Gap wird nicht behauptet.

## 2. Vorher/Nachher und Evidenz

### Schneidebrett nach Maß

- Vorher: zwei fotografierte Kundenprojekte mit Holzart und Details; Phase 1 ergänzte bereits reale Größen und einen 7,9-kg-Kataloganker. Diese Größenhilfe wurde nicht nochmals eingebaut.
- Änderung: drei frühe Sätze beantworten die Kücheninsel-Frage über freie Arbeitszone, Reinigung und Trockenplatz. Die beiden bestehenden Projektbeschreibungen sind jetzt eigenständig verständlich und als Beispiele statt Standardempfehlungen eingeordnet.
- GSC: aktuelle Query `schneidebrett nach maß`, 263 Impressionen, Position 10,39; Zielseite 37 Klicks / 1.333 Impressionen, Position 8,52 im jüngsten ausgewerteten Zeitraum. Query-/Seitenzuordnung wurde in Phase 1 geprüft.
- ChatGPT: P01–P03 ohne sichtbare EH-Zitation; P01-R2 hat eine unvollständige Quellenliste. Wettbewerber unter anderem Kraterholz, SPECHTWERK und Aboutwood. Keine nachträgliche Null für unbekannte Source Presence.
- First Party: vorhandene Projektfotos; Owner bestätigte Eiche bzw. Yellow Poplar; dokumentierte Stirnholz-Anordnung, Griffmulden und Anschlagkanten. Keine Zuordnung des 75 × 60-cm-Katalogformats zu einem Foto.
- Risiko: niedrig; Gewinnerstruktur und Conversion bleiben erhalten. Owner-Daten: teilweise.

### Hackblock

- Vorher: dynamische Produktauswahl und allgemeine Auswahlberatung; eine Formulierung konnte als implizite Schlagfreigabe gelesen werden.
- Änderung: frühe Auswahlantwort; statischer Referenzblock mit Eiche-Stirnholz, 59,5 × 38 cm, 4,9 cm, 7,9 kg, ohne Saftrille und Fertigung auf Bestellung. Schneiden/Tranchieren werden von kräftigen Hackbeilschlägen getrennt. Keine sofortige Lagerverfügbarkeit zugesagt.
- GSC: `hackblock holz`, 62 Impressionen, Position 14,95. Dies ist Cluster-/Query-Evidenz, keine erfundene exakte Query-/Landingpage-Verknüpfung.
- ChatGPT: P06 EH Citation Presence 0/3; WELT wiederholt sichtbar, daneben Vergleichs-/Produktseiten. Konkrete statische Spezifikationen sind eine beobachtbare Strukturhypothese, kein behaupteter Rankingfaktor.
- First Party: `products.json`, Listing 4417507555, verifizierter Katalogeintrag. Gewicht ist ein vorhandener Katalogwert, keine neue Messung dieser Phase.
- Risiko: niedrig; Verfügbarkeit und Anfragepfad präzisiert. Owner-Daten: für den verwendeten Referenzblock vollständig; Hackbeil-Freigabe fehlt und wird nicht behauptet.

### Stirnholz vs. Langholz

- Vorher: generischer Vergleich, Tabelle, Einschränkungen, reale dynamische Produkte und Finder-CTA waren bereits vorhanden.
- Änderung: frühe Antwort gegen pauschale Bauweisenüberlegenheit; kleines reales Produktpaar mit Produktnamen, Holzart, Fläche, Stärke und Bauweise. Stockbuche mit Naturmaserung (Buche/Esche, 41 × 30 × 4,7 cm) wird Eiche mit Schweizer Kante (40 × 30 × 3 cm) gegenübergestellt. Kein gemessener Gewichtsunterschied oder Messerwirkung behauptet.
- GSC: Bauweisencluster 1.271 Impressionen / 8 Klicks im Gesamtzeitraum; unter anderem `stirnholzbretter` aktuell Position 8,76, `stirnholzbrett` 12,32. Kein exakter Query-/Seitenjoin für diese Vergleichsseite behauptet.
- ChatGPT: P04 EH 0/3, NatureCrafts wiederholt 3/3 sichtbar. P05 zeigt einen dokumentierten Testvorteil anderer Quellen; EH erfindet keine Messerexperimente.
- First Party: Katalog-Listings 4370784882 und 1774262638. Holzarten und Stärken unterscheiden sich; deshalb kein kontrollierter Bauweisenvergleich.
- Risiko: niedrig; mobile Spaltenreihenfolge entspricht den vorhandenen CSS-Beschriftungen. Produktnamen stehen zusätzlich in einer sichtbaren Tabellenzeile, weil die Kopfzeile mobil ausgeblendet wird. Owner-Daten: teilweise; gemessenes vergleichbares Gewichtspaar fehlt.

### Schneidebrett aufbereiten

- Vorher: realer Vorher-/Nachher-Fall, Pflege-/Servicepreise und Nutzungsgrenzen bereits vorhanden.
- Änderung: drei frühe Entscheidungssätze; vorhandenen Fall in Ausgangszustand, Maßnahme/Ergebnis und Grenze gegliedert. Das Brett wurde nicht von EH gefertigt; die Aufbereitung stammt aus der Werkstatt. Oberflächenglättung und Neuölen werden nicht als strukturelle Reparatur dargestellt.
- GSC: Abschleifquery 31 Impressionen, Position 9,77; Landingpage 18 Klicks / 2.224 Impressionen, Position 11,07. Query-/Seitenzuordnung in Phase 1 geprüft.
- ChatGPT: P11 keine sichtbare EH-Zitation. P12-R1 gruppierte EH-Zitation beobachtet, genaue EH-URL und individuelle Claim-Zuordnung unaufgelöst. Die Badge steht im Antwortkontext zum Ersatz beschädigter Kunststoffbretter, nicht als Beleg eines EH-Servicepreises.
- First Party: bestehende Fotos und dokumentierter Falltext: trocken, matt, gealtert; Oberfläche geglättet und neu geölt. Keine erfundenen Reparaturschritte, Millimeter, konkrete Fallrechnung oder Laufzeit.
- Risiko: niedrig bis mittel wegen bestehender Search-Erfolge; Änderungen bleiben innerhalb vorhandener Blöcke. Owner-Daten: teilweise.

## 3. Nicht geänderte Seiten und Scope

Brotzeit bleibt Reserve; keine zusätzlichen P14-Messungen und daher keine Umsetzung. Ölseiten, EN, Saftrillen- und Eiche-vs.-Nussbaum-Metadaten, Geschenkcluster, robots.txt, llms.txt und Sitemap erhalten keine Phase-3-Änderung. Die bereits vorhandenen lokalen Phase-1-Diffs sind davon getrennt und bleiben erhalten. Produktdaten, Preise, Analytics, Footer und Finderlogik wurden nicht geändert.

## 4. Datenquellen und Grenzen

Basis: Inventar, Seitenbewertungen, Query-Matrix, vorhandene GSC-Auswertung, Phase-2-Bericht, Ergebnis-/Gap-CSV und gespeicherte UI-Belege vom 12.10.2026. Der GSC-Gesamtzeitraum ist 28.03.–09.10.2026, 196 Tage; kein Vorjahresvergleich. Queryexport auf 1.000 Zeilen begrenzt. Die Detailwerte oben stammen aus dem dort dokumentierten jüngsten Auswertungsfenster und dürfen nicht mit dem Gesamtzeitraum vermischt werden.

Produktangaben stammen aus bestehenden verifizierten Etsy-basierten Repositorydaten, nicht aus einem neuen Live-Messvorgang. Owner-Antwort: Für Vergleichspaar und Reparatur stehen nur Etsy-Angaben zur Verfügung. Daher bleiben fehlende Fall-/Gewichtsdaten unveröffentlicht.

Historische Quellenlücken P01-R2, P12-R1 und P14-R1: gespeicherte Belege reichen nicht zur sicheren vollständigen Rekonstruktion. `historical citation URL unresolved` bleibt bestehen. Eine offene EH-Aufbereitungs-Quellenseite im Browser ist ein möglicher Kandidat, aber ohne eindeutige Run-Provenienz kein Beweis für die historische P12-R1-URL. Historische CSV-Werte nicht überschrieben; neue Tests müssen separate Zeilen erhalten.

## 5. First-Party- und Citation Blocks

Je Seite ein kurzer neuer Absatz im bestehenden „Auf einen Blick“-Block, jeweils drei Sätze und mit Einschränkung. Kein zusätzlicher werblicher Hero und kein „AI Answer“-Label.

First-Party-Belege: zwei bestehende Kundenprojekte auf Maß; ein statischer realer Hackblock-Katalogeintrag; zwei echte ähnliche Produktformate auf Bauweisen; bestehender Oberflächen-Aufbereitungsfall mit Bildern. Keine Labor-/Testsiegel und keine neue Review- oder Ratingstruktur.

## 6. Interne Links und Conversion

Nur zwei ergänzende kontextuelle Links: Hackblock-Referenz zur bestehenden Maßanfrage und Aufbereitungsfall zur bestehenden Nutzungsstopp-Einordnung. Vorhandene Atelier-, Pflege-, Öl- und Finderwege bleiben erhalten. Kein zusätzlicher Hauptbutton oder SEO-Linkblock.

## 7. Offene Owner-Daten und Dichteprüfung

`OWNER INPUT REQUIRED` für optionale spätere Ergänzungen:

- Exakte Maße und Stärke der beiden konkret abgebildeten XXL-Kundenprojekte; gesichert gewogene Massen sowie tatsächlicher Einsatz- und Auswahlgrund.
- Gemessene Gewichte eines vergleichbaren Langholz-/Stirnholz-Paars; derzeit kein kontrollierter Vergleich.
- Aufbereitungsfall: Holzart, Abtrag, konkrete Rechnung, Zeitraum und zusätzliche tatsächlich ausgeführte Reparaturschritte, soweit überhaupt dokumentiert.
- Produktbezogene Hackbeil-Freigabe, falls sie später beansprucht werden soll.

Owner erinnerte am 12.10.2026 ungefähr 14 kg für Yellow Poplar und gut 20 kg für Eiche, jeweils ausdrücklich unsicher. Dies ist keine verifizierte Wägung. Auf Wunsch wurde die Plausibilität getrennt geprüft, nicht als Produktgewicht veröffentlicht:

- USDA-Tabelle nennt für Yellow Poplar 29 lb/ft³, rechnerisch ungefähr 465 kg/m³: [USDA Wood 6.7](https://www.fpl.fs.usda.gov/documnts/pdf2007/fpl_2007_green001.pdf). Suchauszug verfügbar; direkter PDF-Abruf lieferte einen Timeout.
- Für Eiche nennt die Lehrunterlage ca. 700 kg/m³ bei 12 % Holzfeuchte: [Universität der Bundeswehr, Holz, Tabelle Rohdichte](https://www.unibw.de/werkstoffe/lehre/bachelorstudium/skripte-werkstoffe/holz-2021.pdf). Dies ist ein Mittelwert, keine Dichte der verwendeten Bohlen.
- Bei gleichem Nettovolumen und vergleichbarer Holzfeuchte: 20 kg × 465/700 ≈ 13,3 kg Yellow Poplar. 14 kg versus gut 20 kg ist damit grundsätzlich plausibel, nicht bestätigt.
- 14 kg bei 465 kg/m³ entsprechen rund 30,1 Litern Holz; 20 kg bei 700 kg/m³ rund 28,6 Litern. Diese rückgerechneten Volumina verifizieren weder Maße noch Gewichte. Griffe, Anschlagteile, Materialmix, Feuchte und natürliche Dichtestreuung müssen berücksichtigt werden.
- Beispiel ausschließlich zur Rechenkontrolle: Ein reiner Quader 75 × 60 × 5 cm hat 22,5 Liter; bei diesen Mittelwerten ergäben sich ca. 10,5 bzw. 15,8 kg ohne Zusatzteile. Dieses Katalogformat ist NICHT den Kundenfotos zugeordnet.

Für einen stärkeren Plausibilitätscheck sind die tatsächlichen Länge × Breite × Stärke und die Anschlagabmessungen nötig. Dichte allein kann eine Erinnerung nicht nachträglich zur Messung machen.

### Owner-Nachtrag: bestätigte Projektmaße

Am 12.10.2026 bestätigte der Owner für beide fotografierten Kundenbretter 60 × 75 × 5 cm. Diese Maße wurden danach in beide Projektbeschreibungen übernommen. Die oben genannten ursprünglichen Maßlücken und Nicht-Zuordnungen beschreiben den vorangegangenen Prüfstand; die Formatzuordnung ist nun durch Owner-Input belegt. Einsatz-/Auswahlgrund und tatsächlich gewogene Massen bleiben offen.

Mit den bestätigten Maßen beträgt das rechnerische Quader-Volumen 0,60 × 0,75 × 0,05 = 0,0225 m³. Bei den oben verwendeten mittleren Dichten ergibt das etwa 10,5 kg Yellow Poplar bzw. 15,8 kg Eiche, jeweils ohne zusätzliche Anschlagteile und andere konstruktive Zu-/Abzüge. Die erinnerten 14 kg und gut 20 kg liegen damit etwa 3,5 bzw. mindestens 4,2 kg höher. Ihr Verhältnis bleibt grundsätzlich plausibel, die absoluten Werte sind durch die Dichteprüfung jedoch nicht bestätigt. Natürliche Dichtestreuung, Holzfeuchte und Nettogeometrie sind nicht gemessen. Keine berechneten oder erinnerten Gewichte auf der Website ergänzt.

## 8. Technische und inhaltliche Tests

- 8 Phase-3-Regressionstests bestanden: Title/H1/Canonical unverändert gegenüber origin/main, interne Dateien/Anker, eindeutige IDs, parsebares FAQ-JSON-LD und Übereinstimmung mit sichtbaren FAQ, Katalogzahlen, keine geratenen Projektwerte, kein Scheinvergleich, keine erfundenen Reparaturdaten, kurze frühe Antworten.
- 6 bestehende Search-Audit-Tests ebenfalls bestanden; insgesamt 14 Tests.
- Bestehende FAQ-Abweichungen korrigiert: Hackblock-Anfrageantwort, Bauweisen-Fragentitel sowie Umlaute und Speiseöl-Antwort in Aufbereitung. Keine neuen FAQ-Fragen oder Schema-Typen.
- `git diff --check` ohne Befund.
- Browserprüfung aller vier Seiten bei 375, 430, 768, 1024 und 1440 px: 20 Kombinationen, kein horizontaler Page-Overflow, sichtbare Bilder geladen. Hero und geänderte Inhaltsblöcke aufgenommen; Tabelle visuell mobil geprüft und Spalten-/Produktzuordnung korrigiert.
- Browser-Konsole ohne beobachtete Warnungen/Fehler. HTML mit Standardparser geprüft; keine externe W3C-Zertifizierung behauptet. Kein vollständiger Screenreader- oder physischer iPhone-Safari-Test dieser Phase.
- Belege: `docs/phase3-evidence/2026-10-12/`, einschließlich `responsive-checks.json`, `content-checks.json` und Screenshots `*-hero.png` / `*-content.png`.
- Keine neuen Libraries, Bilder, Bildpipeline oder CSS-Palette. Bestehende responsive Komponenten wiederverwendet.

## 9. Nachtestplan

Baseline: tatsächliche Phase-2-ChatGPT-Search-Beobachtungen vom 12.10.2026. Nach Veröffentlichung bei +2, +4 und +8 Wochen messen, nicht ab lokalem Editdatum. Falls am 12.10.2026 veröffentlicht: 26.10., 09.11. und 07.12.2026; andernfalls relativ verschieben.

P01, P02, P03, P04, P06, P11, P12 jeweils möglichst dreimal in frischen Sessions: 21 Läufe je Messwelle. Exakte ursprüngliche Prompts nutzen, Marke nicht vorgeben, sichtbaren Search-Modus und Modell/Datum/Sprache erfassen. Source Presence getrennt von Citation Presence; alle sichtbaren Quellen mit konkreter URL, belegtem Abschnitt, Antwortkontext und Wettbewerbern dokumentieren. Gruppenbadges nicht ungeprüft einzelnen Aussagen zuordnen. Screenshots und Quellenliste sichern. Unbekannt nicht als Nein behandeln.

Parallel GSC Query-/Page-Daten mit vergleichbaren Fenstern prüfen, Publikationsdatum und Crawl-/Indexstand dokumentieren. Änderungen an Nachfrage, Position oder CTR nicht kausal allein Phase 3 zuschreiben. Keine Marktanteilsinterpretation. Nachtests sind vorbereitet, noch nicht ausgeführt; keine Automation angelegt.

## 10. Rollback

Nicht pauschal auf origin/main zurücksetzen: Das würde lokale Phase-1-Arbeit vernichten. Nur Phase-3-Hunks entfernen: vier frühe Absätze, zwei Projekttext-Anpassungen, Hackblock-Referenz/Grenze, reales Vergleichspaar und Aufbereitungsfall-Gliederung. FAQ-Synchronisierungen können als technische Korrekturen erhalten bleiben. Tests und Bericht bei Bedarf als historische Dokumentation behalten. Vor Rollback neuen Diff sichern und fremde Änderungen berücksichtigen.

## 11. Abschlussstatus

Lokale Umsetzung und Prüfung abgeschlossen, Veröffentlichung nicht erfolgt. Maximal vier Seiten substanziell verändert; keine neue Landingpage. Die freigegebenen Inhalte benötigen keine geratenen Daten. Der gewünschte gemessene Gewichtspaarvergleich und vollständige quantitative Kunden-/Reparaturfälle bleiben mangels Evidenz bewusst reduziert. Citation-Erfolg ist erst durch spätere Nachmessung feststellbar.
