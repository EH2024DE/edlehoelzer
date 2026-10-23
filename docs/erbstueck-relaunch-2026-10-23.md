# Erbstück: Positionierung, Umbau und URL-Wechsel

## Entscheidung und Grenzen der Nachfrageprüfung

Geprüft am 23. Oktober 2026 in der angemeldeten Google Search Console, Property `sc-domain:edlehoelzer.de`, Suchtyp Web, Seitenfilter enthält `/erbstueck/`, ohne Länder-/Gerätefilter.

| Tatsächlich verfügbarer Zeitraum | Klicks | Impressionen | CTR | Position |
| --- | ---: | ---: | ---: | ---: |
| 28. März–20. Oktober 2026 (Auswahl 16 Monate) | 2 | 98 | 2 % | 7,1 |
| 21. Juli–20. Oktober 2026 (3 Monate) | 1 | 84 | 1,2 % | 7,2 |

Sichtbare Suchanfragen im längeren Zeitraum: `erbstück` (6 Impressionen), `kerbstück` (2), `rezensionen für erbstück` (1), `ehrbaum design` (1), `historisches holz` (1); jeweils 0 sichtbare Klicks. Im kürzeren Zeitraum hat `erbstück` 5 Impressionen, die übrigen sichtbaren Zeilen sind gleich. GSC warnt vor unvollständigen Summen/Zeilen bei Filtern. Die nicht zugeordneten Klicks/Impressionen werden nicht interpretiert.

Bericht: https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Aedlehoelzer.de&page=*%2Ferbstueck%2F&num_of_months=16

Keine Keyword-Volumen-/Difficulty-Datenquelle war angeschlossen. Daher sind monatliches Suchvolumen und Ranking-Schwierigkeit der Kandidaten **unbekannt**. GSC-Impressionen der eigenen Seite sind kein Markt-Suchvolumen. Wenige Ergebnisse beweisen ebenfalls weder wenig Wettbewerb noch leicht erreichbare Rankings.

Öffentliche Suchergebnisse zu Schneidebrett + Altholz/Fachwerk/historisches Holz zeigen reale Produktangebote unter der Bezeichnung Altholz; bei Fachwerk ist die eigene Seite bereits sichtbar. Stichprobe, keine standardisierte Rankingmessung:
- https://altholz-fichtner.at/altholz-servierbrett/altholz-schneidebrett-anrichtebrett-servierbrett/
- https://www.oldoak.de/collections/holzschneidebretter
- https://edlehoelzer.de/erbstueck/

Positionierung: konkretes Schneidebrett aus historischer Fachwerk-Eiche; Erbstück bleibt Serienname. Altholz wird einmal sachlich eingeordnet. Keine weitere allgemeine Holzarten-Seite, kein Wettbewerb mit der bestehenden Eiche-Kategorieseite um deren gesamten Inhalt. Neuer Pfad `/schneidebrett-fachwerk-eiche/` ist fachlich begründet, **nicht** als nachgewiesener Volumensieger ausgewählt.

## Live-Abgleich No. 004

Sichtbares Etsy-Angebot am Prüftag: https://www.etsy.com/de/listing/4370769708/stirnholz-schneidebrett-eiche

- Verfügbar mit auswählbaren Optionen: Pur 284,99 €, mit Saftrille 299,99 €.
- Buche-Inlay bestätigt durch Materialien, Bildbeschreibung und ausführlichen Text; Ahorn für dieses Stück korrigiert.
- Widersprüchliche Maße: Titel 42 × 40 × 5 cm; Beschreibung ca. 41,5 × 39,8 × 5 cm, ca. 5,8 kg; strukturierte Highlights noch 40 × 40 × 4,5 cm. Repository bisher ca. 40 × 40 × 4,5 cm und ca. 4,5 kg.
- Deshalb keine Maße/Gewichte übernommen: sichtbarer Hinweis auf das Angebot. Etsy-Felder und Katalog benötigen einen gesonderten bestätigten Datenabgleich; `products.json` bleibt gemäß Auftrag unverändert.
- Etsy zeigte die deutsche EUR-Seite mit Versandziel Frankreich. Die Auswahlpreise sind dokumentierte Beobachtungen, keine universelle Steuer-/Versandpreisgarantie. Preise vor Freigabe für den Zielmarkt Deutschland nochmals kontrollieren.

## Inhaltlicher Umbau (Commit 1)

Nur `erbstueck/index.html` geändert, keine globalen Dateien:
1. Hero mit konkreter Materialbezeichnung, emotionaler H1, Verfügbarkeit und zwei Wegen.
2. Herkunft ohne erfundene Gebäudehistorie oder pauschale Altersangabe.
3. Fünf kompakte Verarbeitungsschritte.
4. No. 004 mit korrigierter Holzart, beobachtetem Preis und Etsy-Link.
5. Weitergabe, Pflege/Aufarbeitung und persönliche Details.
6. Zwei vergebene Beispiele.
7. Kompakte Materialgrenzen statt wiederholter Großabschnitte.
8. Bestehende Laura-Bewertung wortgetreu.
9. Einfaches Formular; Name/E-Mail/Nachricht erforderlich, Nutzung/Größe/Ausstattung optional.
10. Sieben zugängliche FAQ und Themenlinks.

Die alte Spezifikationstabelle, doppelten Materialerklärungen und Persona-Karten entfallen. Keine öffentliche Zusage analytischer Prüfung oder pauschaler Lebensmittelechtheit. Herkunftsort nur bei verlässlicher Dokumentation. Die Holzvisitenkarte ist keine Alters-/Gebäudeurkunde. Header, Navigation, Footer und Cookie-Mechanismus in Commit 1 unverändert. Bestehende Fonts/Tokens weiterverwendet, CSS/JS nur inline und seitenspezifisch.

**Video fehlt:** weder `assets/Vom-Balken-zum-Brett.mp4` noch Poster vorhanden. Kein Platzhalter, kein erfundenes Video und keine neue Bildpipeline. Daher auch keine Autoplay-/Reduced-Motion-Videoimplementierung notwendig. Vorhandene echte Fotos verwendet.

## Formular

Bestehender Formspree-Endpoint `https://formspree.io/f/maqanpld`, POST, Betreff Erbstück-Anfrage, Honeypot `_gotcha`, echte Labels, native E-Mail-/Pflichtfeldvalidierung. JS sendet FormData mit JSON-Accept, sperrt Doppelversand, meldet Erfolg nur nach erfolgreichem HTTP-Status. Netzwerk-/Serverfehler behalten Eingaben; Retry und Kontakt-E-Mail bleiben verfügbar. Status wird per aria-live und Fokus angekündigt. Ohne JS bleibt das native POST-Formular erhalten; die Bestätigungsansicht wird dann von Formspree bereitgestellt.

Keine echten Anfragen versendet. Produktiver Endpoint und tatsächliche Zustellung bleiben manuell zu prüfen.

## URL-Wechsel (Commit 2)

- Eigentümerseite wird nach `schneidebrett-fachwerk-eiche/index.html` verschoben.
- Alte deutsche URL bleibt sofortige Meta-/JS-Weiterleitung mit Canonical, ohne noindex, ohne Inhaltsduplikat. JS erhält Query/Fragment; Meta-Refresh ohne JS kann diese nicht dynamisch erhalten.
- Canonical, OG, DE-/x-default-hreflang, Breadcrumb, Sitemap, aktive interne Links und lokaler Suchindex umgestellt. EN-URL und englische Inhalte bleiben bestehen; nur Links auf die deutsche Seite werden aktualisiert.
- UTM-Kampagne `erbstueck`, Assetnamen, CSS-Klassen und Eventnamen bleiben erhalten.
- `main.js` enthält ausschließlich den notwendigen Routen-Key-Wechsel für den vorhandenen mobilen Schnellzugriff; dessen bestehender E-Mail-Weg bleibt erhalten.
- GitHub Pages liefert **keine HTTP-301-Weiterleitung**. HTML/JS/Canonical sind die statische Alternative, nicht als serverseitige 301 zu verstehen.

Notwendige zusätzliche Wartung gegenüber der engen Dateiliste: Summary-Manifest/Prüfer an die ausdrücklich entfernte Tabelle anpassen, Suchindex neu erzeugen, Formular-/Migrationsregressionen ergänzen. Bereits auf main vorhandene B2B-/Release-Tests verglichen nach dem B2B-Merge fälschlich die Redirect-Datei mit dem Original bzw. nur einseitig normalisierte URLs. Diese Prüfungen auf den gültigen Dokument-/Migrationsstand korrigiert; keine produktive B2B-Änderung außer Erbstück-Link.

## Statuswechsel nach Verkauf

`STATUS-No004` markiert Metabeschreibung, Product-Schema, Hero-Zeile/-CTA, Produktabschnitt, Preis, Kaufbutton und Microcopy. Nach Verkauf:
- Hero: Aktuell kein Erbstück verfügbar; CTA Eigenes Erbstück anfragen.
- No. 004 als vergeben kennzeichnen; Kaufbutton entfernen, direkte Kaufpreis-/Verfügbarkeitsangaben anpassen.
- Product Offer auf `https://schema.org/SoldOut` setzen, sichtbare Angaben konsistent halten.
- Metabeschreibung und Suchindex prüfen/neu erzeugen.
- Kein automatischer Bestandsabgleich implementiert.

## Prüfungen und offene Abnahme

- HTML-Verschachtelung, eine H1, eindeutige IDs, Anker, vorhandene Bilddateien, Breadcrumb/Product-JSON geprüft.
- Browser: 390/768/1440 px ohne horizontalen Überlauf; Hero-CTAs mindestens 44 px.
- Formular: Erfolg, Netzwerkfehler, HTTP-Fehler, Pflichtfeldsperre und Doppelsendesperre mit Mocks geprüft; keine produktive Übermittlung.
- Ohne-JS-Verhalten als natives POST-Markup geprüft, nicht als echte Formspree-Übermittlung im Browser ausgeführt.
- Kein Video vorhanden; keine Video-Wiedergabetests behauptet.
- Finale Regression: 32 Python- und 62 Node-Tests bestanden (94 insgesamt), darunter Formular- und Legacy-Redirect-Mocks. Indexability-/Sitemap-Prüfung bestanden (51 selbstkanonische Seiten, 51 Sitemap-URLs), Summary-Check bestanden, Suchindex mit 43 Seiten neu erzeugt. Lokale Links/Fragmente und Bildpfade geprüft. Header/Footer unterscheiden sich nur durch den deutschen Zielpfad. Zweiter Commit verändert die verschobene Seite ausschließlich durch deutsche URL-Ersetzungen.
- Asset-Audit: 0 kritische Fehler, 25 nicht blockierende Hinweise; 24 bereits bekannt, ein zusätzlicher Hinweis zum implizit eager geladenen Hero-Bild mit `fetchpriority="high"`. Kein neues großes Medium hinzugefügt.
- Browser-Weiterleitung mit `?utm_source=release-check#anfrage` erfolgreich; Anfrageblock bei ca. 100 px unter der Oberkante sichtbar. Optionale Felder öffnen sich; native Formularmethode POST bestätigt. Die automatischen Formularfälle verwenden ausschließlich Mocks.

Vor Veröffentlichung:
- [ ] No. 004 verfügbar, deutsche Zielmarktpreise Pur/Saftrille kontrolliert.
- [ ] Widersprüche in Etsy-Maßen und Repository-Daten mit tatsächlichem Brett aufgelöst.
- [ ] Herkunftsdokumentation/Holzvisitenkarte und beiliegende Pflegehinweise bestätigt.
- [ ] Rückbau-/Herkunftsaussagen entsprechen tatsächlicher Praxis.
- [ ] Materialeignung für den vorgesehenen Lebensmittelkontakt fachlich abgesichert; hier kein Nachweis behauptet und keine universelle Pflicht zur Analyse pro Balken erfunden.
- [ ] Formular mit produktivem Endpoint/Zustellung gesondert freigegeben.
- [ ] Video nachgereicht oder bewusste Freigabe ohne Video.
- [ ] Live-Weiterleitung, Canonical, Sitemap und EN-Rückverweise nach Deployment prüfen.
- [ ] Externe Links in Instagram, Pinterest, Etsy und bestehenden Social-Posts umstellen, soweit betroffen.
- [ ] Neue URL erst nach tatsächlichem Deployment in GSC prüfen/Indexierung anstoßen, alte URL beobachten, nicht entfernen.

Noch nicht veröffentlicht. Draft-PR ist eine Vorschau, keine fachliche Freigabe der offenen Produkt-/Materialdaten.

## Ergänzung nach Owner-Feedback: Eiche und Buche

Der Owner bestätigt Buche als festen Bestandteil jedes Erbstücks, nicht als austauschbare Kontrastholz-Option. Eiche steht im Serienkonzept für die Lebensbasis, Buchenlinien für prägende Momente und Innehalten. Diese Bedeutung wird ausdrücklich als Gestaltungsidee der Manufaktur beschrieben, nicht als naturwissenschaftliche Holzeigenschaft oder als festgelegter Zeichencode.

Eigener Abschnitt zwischen Herkunft und Verarbeitung, Hero-Einleitung und OG-Beschreibung ergänzt. Beispiele für drei Kinder bzw. zwei Menschen sind Möglichkeiten, keine Behauptung über die Geschichte des verfügbaren No. 004. Anzahl/Anordnung gemeinsam abstimmbar, abhängig von Format und Materialsubstanz. Handarbeit ohne CNC ist eine ausdrückliche Owner-Angabe. Ahorn als Serienoption entfernt. Optionales Formularfeld `beech_lines` ersetzt die irreführende Holzart-Auswahl; zusätzliche Pflichtfelder entstehen nicht. FAQ entsprechend ergänzt. Dieser nachträgliche Wunsch ist ein eigener Folgecommit; die beiden ursprünglichen Umbau-/Umzugscommits bleiben getrennt erhalten.

## Visuelles Owner-Feedback: Hero und Kontrast

Hero auf kurze Material-/Serienzeile, emotionale H1, zwei kurze Sätze und einen Hauptbutton reduziert. Preis/Verfügbarkeit und der sekundäre Anfrage-Link stehen jetzt in einem ungerahmten Band direkt darunter. Redundante Merkmals-Chips und sichtbarer Breadcrumb aus dem Hero entfernt; Breadcrumb-JSON-LD bleibt. Mobile zeigt das ganze Foto im ursprünglichen Seitenverhältnis ohne Text darüber, anschließend den Text auf dunkler Grundfläche. Desktop bleibt eine durchgehende Bildszene mit Text links und sichtbar freiem Brett rechts, ohne Kartenrahmen. Hero-LCP-Bild explizit eager mit hoher Priorität.

Ghost-Button auf den hellen Seitenbereichen jetzt mit dunkler Schrift und dunklem Rahmen, dunklem Hover und heller Hover-Schrift. Nur seitenspezifische Regeln geändert, keine globale Palette. Preis-/Produkt-/Formulardaten unverändert. Hero- und Kontrastregression ergänzt; Browserprüfungen siehe PR.

## Bestätigtes Beispiel mit drei Linien

Owner bestätigt: Das Hero-Brett (`assets/Erbstueck.jpg`) ist verkauft; seine drei senkrechten Buchenlinien stehen für drei Kinder. Zusätzlich als erstes Beispiel im Archiv aufgenommen, dort ausdrücklich als vergeben mit dieser Bedeutung beschriftet. Hero-Alttext ebenfalls präzisiert. Keine Namen oder weiteren Familienangaben ergänzt. Das separate verfügbare No. 004 und dessen Kaufweg bleiben unverändert.

## Leserführung und manuelle Galerie

Nach weiterem Owner-Feedback den Bedeutungsabschnitt von vier längeren auf drei kürzere Absätze reduziert; Wiederholung der Kinder-/Linienbeispiele entfällt dort zugunsten konkreter Bildunterschriften. Weitergabe ebenfalls verdichtet, bestehende Kundenbewertung nicht verändert. Das Archiv steht direkt nach der Bedeutung als früher visueller Beleg statt erst nach der Weitergabe.

Drei Fotos als manuelle Scroll-Snap-Galerie, ohne Autoplay/Library. Touch-Swipe, drei dezente Punktbuttons mit 44px-Zielen, Tastaturpfeile/Home/End, `aria-current`, Reduced Motion berücksichtigt. Ohne JS bleibt natives horizontales Scrollen verfügbar, JS-Punktsteuerung bleibt dann verborgen. Alle Bilder vollständig im Bildrahmen, stabile Höhe für die Bildunterschriften.

Owner-bestätigte Beschreibungen: erstes Brett drei senkrechte Linien für drei Kinder; zweites homogeneres Holzbild mit einer senkrechten/einer waagerechten Buchenlinie; drittes aus ehemals in Lehm liegendem Fachwerkbalken, markantes Holzbild mit zwei senkrechten und je einer waagerechten Linie oben/unten. Keine zusätzlichen Familiengeschichten oder chemischen Erklärungen zur Lehmwirkung erfunden. Muster visuell mit den vorhandenen Originalfotos abgeglichen.

## Echtes Ausgangsmaterial: Owner-Foto

Neu bereitgestelltes Foto historischer Balken als `assets/historische-fachwerkbalken.jpg` übernommen (728 × 1280 px, ca. 195 KB). Nur EXIF-/Editor-Metadatensegmente entfernt; komprimierte Bilddaten unverändert. Keine generative Bearbeitung, keine Retusche oder erfundene Fertigungsszene. Seitenspezifischer responsiver 4:3-Ausschnitt mit `object-position:50% 43%` zeigt den mittleren Bereich: alte Aussparungen, Bohrungen und Oberflächen. Steckdose oben und Holzreste unten rechts werden im sichtbaren Ausschnitt ausgeblendet. Vollständiger Bildinhalt bleibt erhalten. Lazy Loading und feste Bildgeometrie.

Platzierung im Herkunftsabschnitt unter der H2, auf Desktop neben dem Text, auf Mobile davor. Beschriftung benennt Ausgangsmaterial, keinen aktiven Arbeitsschritt. Die inzwischen bereitgestellten Fertigungsaufnahmen sind in der folgenden Bildgeschichte dokumentiert.

## Bildgeschichte der Fertigung

16 Owner-Fotos in der gelieferten Reihenfolge, danach das passende Studiofoto `Erbstueck2.webp` als bereits vergeben gekennzeichnet. Materialauswahl, Abrichten, Dickenhobeln, Zuschnitt, verleimter Aufbau mit Buchenlinien, Kantenbearbeitung, Bandschliff, Griffmulde, Exzenterschliff, Handschliff, Manufakturzeichen, Ölen und Ergebnis. Keine zusätzlichen Arbeitsschritte, Familiengeschichten oder Prüfungen erfunden. Die Aufnahme des Zeichens zeigt das vorhandene Zeichen, nicht dessen Anbringen.

Sechs anwählbare Kapitel, native horizontale Scroll-Snap-Bildfolge mit Touch-Swipe, Vor/Zurück, Tastaturpfeilen und Home/End. Bildzähler, Fortschritt und aktives Kapitel folgen der sichtbaren Aufnahme. Kein Autoplay, keine zusätzliche Bibliothek. Ohne JavaScript bleibt die Bildfolge scrollbar. Die bisherige Textübersicht ist optional aufklappbar.

15 zusätzliche Dateien `assets/erbstueck-entstehung/02.jpg` bis `16.jpg`, zusammen etwa 2,2 MB. Das Balkenfoto und das Studiofoto werden wiederverwendet. Originale komprimierte Bilddaten erhalten, EXIF-/Editor-Metadaten entfernt. CSS-Ausschnitte verbergen Status-/App-/Zeitleisten: Foto 02 zeigt y=90 bis 1140; Fotos 03 bis 16 zeigen y=152 bis 1038 der 591 × 1280 px großen Screenshots. Feste Rahmen, Lazy Loading, keine künstliche Hochskalierung der Quelldateien. Die Original-Screenshots enthalten weiterhin die ausgeblendeten App-Bereiche.

Gewünschte behutsame Nachschärfung/Wärme noch nicht ausgeführt: Die Adobe-Verbindung blieb trotz Wiederholung im Anmeldestatus. Keine generative Ersatzbearbeitung, keine wiederhergestellten Details behauptet. Farben bleiben original; Bewegungsunschärfe und begrenzte Screenshot-Auflösung bleiben sichtbare Grenzen.

Prüfung: 102 Tests (32 Python, 70 Node) bestanden. Indexierbarkeit/Canonical/Sitemap, Seitenzusammenfassungen, Suchindex-Neubau und Diff-Prüfung erfolgreich. Medienaudit: 263 Dateien, keine kritischen Fehler, 24 bestehende Hinweise. Browser: fünf Viewport-Einstellungen 375/430/768/1024/1440 ohne Seitenüberlauf (tatsächliche innere Breiten durch Browser-Zoom 341/391/698/931/1309 px). Mobile Ausschnitte und Desktop-Endbild visuell kontrolliert; alle 17 Bilder geladen, Kapitelwechsel, Zähler und deaktivierter Weiter-Button am Ende bestätigt. Kein Formular versendet.

## Ergänzung: Verleimung, Quadratformat und optionale Wiedergabe

Zwei neue Owner-Screenshots ergänzt: zuerst Zusammenfügen der mit Leim bestrichenen Teile, danach Spannen mit Zwingen. Chronologisch nach dem Vorbereiten der Einzelteile und vor dem Zuschnitt für die Buchenakzente. Damit 19 Bilder einschließlich Studioabschluss; Kapitelindizes/Zähler/Progress angepasst. Keine Leimmarken- oder Zulassungsclaims aus dem Foto abgeleitet. Neue Dateien `verleimen-zusammenfuegen.jpg` und `verleimen-zwingen.jpg`, Bilddaten unverändert, Metadaten entfernt.

Alle Bildflächen der Fertigungsfolge jetzt quadratisch, ohne Verzerrung. Screenshot-Ausschnitte auf Hände/Brett/Arbeitsschritt fokussiert; obere Schnittposition je Aufnahme 300–447 px, sodass Status-/App-/Zeitleisten außerhalb bleiben. Historisches Balkenfoto quadratisch ab y=320. Studiofoto vollständig im selben quadratischen Rahmen, mit ruhiger dunkler Restfläche statt abgeschnittenem Brett. Diese Regeln ersetzen die vorherigen wechselnden Seitenverhältnisse.

Die bestehende Folge statt einer zweiten Galerie um einen Lucide-Start/Pause-Knopf mit Tooltip und zugänglichem Namen erweitert. Standard bleibt manuell. Erst explizites Starten aktiviert den 5-Sekunden-Wechsel, keine Endlosschleife; am letzten Bild Stopp, erneuter Start beginnt vorn. Manuelle Kapitel-/Pfeil-/Tastaturbedienung, Pointer-/Radinteraktion oder Fokus in der Bildfolge pausieren. Ebenso Seitenwechsel in den Hintergrund oder Verlassen des sichtbaren Bereichs; kein automatischer Neustart. Während der Wiedergabe keine fortlaufenden Live-Ansagen. Reduced Motion nutzt sofortige statt animierter Übergänge, auch bei explizit gestarteter Wiedergabe. Bei Größenwechsel bleibt das ausgewählte Bild erhalten.

Regression deckt Start/Pause, manuellen Eingriff, Seiten-Sichtbarkeit, Ende/Neustart, Reihenfolge und quadratische Rahmen ab. 102 Tests bestanden; keine echte Formularsendung.

## Korrektur der Endbearbeitungsfolge nach Owner-Angabe

Fotos 11–15: Griffmulde fräsen, Außenkanten mit einer Fase brechen, Bandschliff, Exzenterschliff, Handschliff nach zwischenzeitlichem Wässern und erneutem Trocknen. Der zuvor als Abrunden beschriftete Frässchritt ist laut Owner ein Fasen zum Schutz vor Ausbrüchen bei der weiteren Bearbeitung; Beschriftung und Alttext korrigiert. Kein zusätzliches Foto für das Wässern oder einen erneuten Dickenhobeldurchgang erfunden. Quelldateinamen bleiben stabil; Reihenfolge, sichtbare Nummern und Regression angepasst. Quadratformat, Kapitelgrenzen und Wiedergabesteuerung unverändert.

## Wiedergabe nach Bedienungsfeedback

Die oben dokumentierte 5-Sekunden-/Stopp-Regel ersetzt: explizit gestartete Wiedergabe läuft jetzt im 3-Sekunden-Takt, nach dem letzten Foto wieder ab dem ersten. Nur Start/Pause ändert den Wiedergabestatus. Tippen, Swipen, Kapitel, Pfeile und Tastatur stoppen ihn nicht. Nach jedem Scrollereignis beginnt ein neuer 3-Sekunden-Timer, sodass das nach dem Wischen eingerastete Bild seine volle Zeit erhält. Während eines gehaltenen Fingers keine automatische Bewegung; nach Loslassen/Pointer-Abbruch wird neu gezählt. Eine pausierte Folge startet durch Wischen nicht von selbst.

Außerhalb des sichtbaren Bereichs und im Hintergrundtab ist nur der Timer ausgesetzt; der aktivierte Wiedergabestatus bleibt erhalten. Bei Rückkehr beginnt ein vollständiges neues Zeitfenster, ohne übersprungene Bilder nachzuholen. Kein mehrfacher Timer, kein Stoppen durch Fokus oder Bildklick. Regression prüft 3000 ms, Timer-Neustart, Tippen/Wischen, manuelles Blättern, Hintergrund/Rückkehr, Umlauf und explizite Pause.

Einleitung der Bildfolge auf „Einige Ausschnitte aus der Fertigung eines Erbstücks.“ verkürzt. Damit ist der exemplarische Charakter klar, ohne eine vollständige Dokumentation aller Fertigungsschritte zu suggerieren oder zusätzliche Erklärungslast zu erzeugen.

## Finale Repository- und Merge-Prüfung

Am 23. Oktober 2026 gegen frisch abgerufenes `origin/main` geprüft: `a7be9638405e7cbb502b74848496b6c4bb2401cb` (Merge #194). Dieser Commit ist vollständig Vorfahr des Erbstück-Branches. Arbeitsverzeichnis vor Abschlussdokumentation sauber, letzter Inhaltscommit `9dbf00f`. Keine neueren Remote-Änderungen oder verlorenen B2B-Anpassungen festgestellt.

Die beiden jüngsten fehlgeschlagenen Läufe gehören zu PR #193, nicht zu zwei verlorenen PRs:
- PR-Prüfung: https://github.com/EH2024DE/edlehoelzer/actions/runs/39863702967
- Main-Prüfung nach Merge: https://github.com/EH2024DE/edlehoelzer/actions/runs/39865214978

Merge #193 war am 23. Oktober um 00:28:24 MESZ erfolgreich; auch das getrennte Pages-Deployment war erfolgreich (Run 39865214964). Ursache der roten Qualitätsprüfung: `scripts/check-page-summaries.mjs:11` erwartete noch genau einen `pageSummary`-Kasten auf `/b2b.html`, obwohl dieser im freigegebenen Umbau entfernt worden war (0 statt 1). Kein Commit-/Git-Merge-Fehler. #194 hat Manifest und Prüfregel passend zum neuen B2B-Aufbau aktualisiert; dessen Main-Prüfung 39898835865 und Pages-Deployment 39898835451 waren erfolgreich. Historische rote Läufe bleiben in der Historie sichtbar und müssen nicht auf veralteten Commits erneut gestartet werden. Die nächstälteren fehlgeschlagenen Läufe stammen vom 6. Oktober, nicht vom aktuellen Release.

Live-HTML von `https://edlehoelzer.de/handgefertigte-holzprodukte-fuer-unternehmen/` abgerufen und bytegenau mit `origin/main` verglichen: identisch. Im Erbstück-Branch unterscheidet sich diese Seite ausschließlich durch die beiden internen Erbstück-Links. Keine Wiederherstellung oder erneute B2B-Inhaltsänderung erforderlich. Weitere HTML-Diffs geprüft: außerhalb der Erbstück-Seite/Weiterleitung nur Ziel-Links, auf EN nur deutsche Rückverweise bei unverändertem EN-Canonical, in der Themenübersicht zusätzlich die passend präzisierte Erbstück-Linkbezeichnung.

Final erneut erfolgreich: 70 Node-Tests, 32 Python-Tests, Indexierbarkeit/Canonical/Sitemap, Seitenzusammenfassungen, Suchindex-Neubau ohne zusätzliche Änderung und vollständiges `git diff --check origin/main...HEAD`. Asset-Audit 265 Medien, 0 kritisch, 24 bekannte Hinweise. Keine Temp-/Debug-Dateien in der PR. Vorherige responsive und externe Browserprüfungen bleiben gültig; seitdem keine Layout-Änderung. Der letzte Inhaltscommit ist auch auf GitHub erfolgreich geprüft.

Owner hat die finale PR zur Launch-Vorbereitung angefordert. PR #195 wird daher aus Draft auf bereit zur Prüfung gestellt. Nicht gemergt und nicht als veröffentlicht dokumentiert. Noch offene Datenpunkte aus dem früheren Abschnitt bleiben transparent: widersprüchliche No.-004-Maße/Gewichte nicht übernommen, `products.json` unverändert, Deutschlandpreis und echter Formulareingang nicht neu verifiziert, Fotowärme/Nachschärfung nicht ausgeführt. Das zukünftige YouTube-Video ist eine optionale spätere Ergänzung, keine Launch-Abhängigkeit. Nach tatsächlichem Merge sind Pages-Deployment und die neue Live-URL/alte Weiterleitung gesondert zu prüfen; erst dann Veröffentlichung und GSC-Indexierungsprüfung dokumentieren.

## Letzte Kaufentscheidungs- und Kompaktkorrektur

Bei No. 004 dezenter Link auf die bestehende Tresenvorschau mit `listing=4370769708&entry=product`. Mit JavaScript öffnet sich der vorhandene Vorschaudialog über `data-kitchen-preview`, ohne JavaScript bleibt die direkte Zieladresse nutzbar. Modellzuordnung in `brettvorschau/models.json` bestätigt, keine neue Modellgeometrie oder Maßhaltigkeitszusage. Die bereits dokumentierten widersprüchlichen Modell-/Listingmaße werden durch den Link nicht als neu verifiziert ausgegeben.

Bildunterschriften mit kleineren, enger gesetzten Überschriften/Absätzen und geringerem Abstand; mobile Mindesthöhe von 140 auf 112 px reduziert. Transportleiste enger, Touchflächen weiterhin 44 × 44 px. Quadratformat, Quellenbilder und Drei-Sekunden-Wiedergabe unverändert.

Pflege-Link aus dem redaktionellen Hauptinhalt entfernt; globale Footer-Navigation bleibt konsistent. Bisherigen Finder-Verweis beim Anfrageformular entfernt und als dezente Alternative nach FAQ/Themenlinks ganz ans Ende des Hauptinhalts verschoben. Kein neuer ablenkender Button im Kaufabschnitt.

103 lokale Tests erfolgreich (71 Node/32 Python), Indexierbarkeit und Diff-Prüfung erfolgreich. Externe Vorschau: Dialog per Tastatur geöffnet, korrektes No.-004-Iframe mit `embedded=1` und bestehender Fotoanleitung geladen und geschlossen. Fünf Viewport-Einstellungen ohne Überlauf, quadratische Bildflächen und 44px-Transportbuttons bestätigt. Kompakte Bildunterschrift visuell auf Mobile geprüft. Keine neue 3D-Szene, keine privaten Küchenfotos hochgeladen und keine Produktdaten verändert.

## Interner Produktdialog statt unmittelbarem Etsy-Sprung

Nach weiterem Owner-Wunsch öffnen beide „Erbstück No. 004 ansehen“-CTAs jetzt das bereits vorhandene Produktfenster über `data-product-preview` und die exakte Produkt-ID. Keine zweite Produktansicht implementiert. Direkte Fallback-Links führen zur internen Produktübersicht. Schließen stellt Fokus und vorherige Scrollposition wieder her; die Erbstück-Seite bleibt im Hintergrund. Etsy ist auf dieser Seite nicht mehr der Produkt-CTA, sondern erst der ausdrücklich bezeichnete Kaufabschluss im bestehenden Produktfenster. Dort bleiben Galerie, Zoom, Vergleich und Tresenvorschau verfügbar. Für Quelle `erbstueck` zusätzlicher interner Weg „Andere Bretter entdecken“ zum Finder. Kein eigener Checkout behauptet.

Tresenvorschau auf der Erbstück-Seite als gleich große sekundäre Ghost-Schaltfläche neben dem Produkt-CTA statt kleiner Textlink unter dem Kaufbutton. Bestehender Dialog und No.-004-Modell unverändert.

Notwendige Erweiterung gegenüber der früheren Katalog-Sperre: Der nun direkt aufgerufene Produktdialog hätte veraltete No.-004-Daten aus `products.json` angezeigt (259,99 EUR, ca. 40 × 40 × 4,5 cm / 4,5 kg). Erneuter sichtbarer Etsy-Abgleich am 23. Oktober: Startpreis/Pur 284,99 EUR, Saftrille 299,99 EUR; Materialien Eiche/Buche. Etsy weiterhin mit Versandziel Frankreich, kein deutscher Steuer-/Versandpreisabgleich behauptet. Höhe/Breite/Tiefe in den Highlights widersprechen weiterhin Titel/Beschreibung; keine neue Maßangabe abgeleitet.

Nur No.004 im Katalog korrigiert: Startpreis 284,99 EUR mit datierter Preisprüfung, beschreibende Maße/Gewichte und Maßbadge entfernt, `etsyOptionsOnly=true` verhindert unpassende generische Aufpreisberechnung. `dimensionsReviewRequired=true` unterdrückt unbestätigte Maß-/Stärkewerte in Produktdetails, Karten und Vergleich. Historische Rohwerte und ihre damaligen Prüfdatumsfelder bleiben zur Nachvollziehbarkeit intern erhalten; Geometrie und Finder-Matchingregeln unverändert. EN-Übersetzung der korrigierten Kurzbeschreibung ergänzt. Katalog-/Seitenskript-Cacheversion aktualisiert. Andere Produkte bleiben durch den bestehenden Katalog-Snapshot-Test geschützt.

Browser: Produktfenster auf der Erbstück-Seite geöffnet, Ausgangspreis ab 284,99 EUR, Maßhinweis statt ungesicherter Zahlen, Tresenvorschau im verschachtelten Dialog mit richtiger Listing-ID geöffnet; anschließend beide Fenster geschlossen und Fokus auf ursprünglichem „Erbstück No. 004 ansehen“-Link bestätigt. Keine Etsy-Kaufaktion ausgeführt.

Final 104 lokale Tests erfolgreich (72 Node, 32 Python), Indexierbarkeit/Seitenzusammenfassungen und Diff-Prüfung erfolgreich; Asset-Audit unverändert 0 kritisch/24 bekannte Hinweise. Produktaktionen und Produktfenster bei fünf Viewport-Einstellungen ohne Seitenüberlauf, beide Seiten-CTAs mindestens 44 px hoch; korrektes Produkt/Preis und Raumvorschau im Fenster bestätigt.

## Lieferumfang, auffindbarer Finder und Pflege nur als FAQ

Owner bestätigt ausdrücklich für No.004: passender Stirnholzhalter und Pflegebalsam werden mitgeliefert. Bei Preis/Produktaktionen auf der Erbstück-Seite als inklusive benannt, mit kurzem Bezug zum Aufstellen des Bretts zwischen Genussmomenten. No.-004-Kurzbeschreibung und EN-Übersetzung entsprechend ergänzt. Zwei explizite Katalogmerkmale `includesEndGrainHolder` und `includesCareBalm`; der vorhandene Lieferumfang-/Vorteilsblock berücksichtigt diese vor generischen Warenwertgrenzen und steht bei diesem Produkt direkt unter dem Preis. Keine doppelte Vorteilsanzeige und keine vermeintliche Abhängigkeit des Halters vom 350-Euro-Warenwert. Andere Produkte und deren Konditionen bleiben unverändert.

Finder-Verweis auf der Seite weiterhin nach FAQ/Themenlinks, jetzt über `#andere-bretter` direkt auffindbar. Im von der Erbstück-Seite geöffneten Produktfenster heißt er ausdrücklich „Zum Produktfinder“ und steht bereits unter der Tresenvorschau statt erst am Ende der Aktionen. Kein zusätzliches Modal oder Checkout implementiert.

Nach letztem Owner-Feedback den gesamten redaktionellen Pflege-/Aufarbeitungsblock mit Aufarbeitungslink entfernt, nicht nur den Pflege-Link. Die verbleibenden beiden Detailthemen erhalten ein zweispaltiges Desktopraster. Pflegehinweis ausschließlich als kurze aufklappbare FAQ ohne Weiterleitung; globale Footer-Navigation nicht verändert. Die separate Pflegehinweis-Wiederholung beim Produkttext entfällt. Bestätigter Pflegebalsam bleibt selbstverständlich als Lieferumfang sichtbar.

105 lokale Tests erfolgreich (73 Node, 32 Python), einschließlich eigener DE/EN-Regression für den bestätigten Lieferumfang unabhängig von generischen Warenwertgrenzen. Indexierbarkeit, Seitenzusammenfassungen und Diff-Prüfung erfolgreich. Externer Browser: genau ein Lieferumfangblock im Produktfenster direkt unter Preis, richtiger Finder-Link, fünf Viewport-Einstellungen ohne Überlauf, nur zwei redaktionelle Detailthemen und keine Pflege-/Aufarbeitungslinks im Hauptinhalt. Keine Änderung anderer Produkte oder Preise.

## Serienanspruch: Präsenz, Mindestformat und vollständiger Lieferumfang

Letzte Owner-Präzisierung als verbindliche Serienregel übernommen: Mindestens eine Seite ist 30 cm lang, Mindeststärke 4 cm. Ausdrücklich kein Mindestformat 30 × 30 cm; die andere Seitenlänge wird damit nicht festgelegt. Die Stärke ist die bewusst eingeplante Materialreserve für spätere Aufarbeitung und Weitergabe, keine universelle Garantie der Reparierbarkeit jedes Schadens. Materialabschnitt und Größen-FAQ entsprechend konkretisiert, vorhandene Formateingabe nicht durch neue Formularhürden erweitert. Keine gemessenen No.-004-Werte oder neue Modellmaße daraus abgeleitet.

In die bestehende Weitergabe-Story integriert: Ein Erbstück wird nicht versteckt, sondern steht auch zwischen den Nutzungen im passenden Halter sichtbar in der Küche. Fester Lieferumfang jedes Erbstücks: Brett, passender Halter, Pflegebalsam, Pflegeanleitung. Herkunftskarte nur bei eindeutig belegbarer Herkunft, etwa bei eigenem oder gemeinsam begleitetem Fachwerkrückbau. Kein pauschales Herkunftszertifikat, keine erfundene Gebäudehistorie.

Owner korrigiert ausdrücklich „Stirnholzhalter“ zu „passender Halter“: sichtbare Seiten-/Produkttexte und EN-Ausgabe korrigiert, Datenmerkmal von `includesEndGrainHolder` in `includesMatchingHolder` umbenannt. Kein Herstellungsverfahren des Halters mehr behauptet. Die neue Kurzbeschreibung benennt auch die Pflegeanleitung. No.-004-Hinweis beim Preis bewusst auf eine kurze Lieferumfangzeile reduziert, emotionaler Kontext steht in der allgemein gültigen Story. Pflege-FAQ nennt Anleitung/Balsam als Serienstandard, ohne neue Pflege-/Aufarbeitungsverweise.

106 lokale Tests erfolgreich (74 Node, 32 Python), inklusive Regression für genau eine Mindestseite statt 30 × 30 cm, Mindeststärke, zustandsabhängige Aufarbeitung, kompletten Serienlieferumfang und bedingte Herkunftskarte. Indexierbarkeit, Seitenzusammenfassungen und Diff-Prüfung erfolgreich. Fünf externe responsive Viewport-Einstellungen ohne Seitenüberlauf; Standardlieferumfang und Mindestanforderungen im DOM bestätigt.

## Erbstückkarte: positive Herkunftserzählung und datensparsame Ortsangabe

Owner präzisiert: Bei selbst zurückgebauten Balken kann die Manufaktur das frühere Gebäude zuordnen. Die öffentliche Formulierung soll diese eigene Rückbauerfahrung positiv darstellen, nicht den Eindruck ungeklärter Beschaffung oder fehlender Materialbeurteilung erzeugen. Story und FAQ nennen deshalb ausdrücklich eigene Rückbauten und eine „Erbstückkarte aus Holz“. Die früheren Formulierungen „Können wir die Herkunft eindeutig belegen“ und „Ist der Herkunftsort dokumentiert“ entfallen. Im konkreten No.-004-Produktabschnitt bleibt nur die Nummerierung, keine unbestätigte Zuordnung dieses Stücks zu einem eigenen Rückbau ergänzt.

Nach anschließendem Datenschutzwunsch Inhalt der Karte auf Herkunftsort oder Ortsteil in Mittelhessen begrenzt, nicht auf früheres Einzelgebäude, Straße/Hausnummer, Bewohner-/Eigentümernamen oder GPS-Koordinaten. Keine beispielhafte Ortszuordnung als tatsächliche No.-004-Herkunft erfunden. „Erbstückkarte“ bezeichnet eine eigene Herkunftserinnerung der Manufaktur, kein unabhängiges Prüf-/Alters-/Materialzertifikat.

Grundlage der Einordnung: DSGVO Artikel 4 Absatz 1 (auch indirekte Identifizierbarkeit und Standortdaten) und Artikel 5 Absatz 1 Buchstaben b, c, e, f (Zweckbindung, Datenminimierung, Speicherbegrenzung und Vertraulichkeit). Amtlicher Text: https://eur-lex.europa.eu/legal-content/DE/ALL/?uri=CELEX%3A32016R0679. Genaue Gebäudekoordinaten sind nicht automatisch immer personenbezogen; entscheidend ist ein Bezug zu identifizierbaren natürlichen Personen. Die Ortsbeschränkung ist eine vorsichtige Gestaltungsentscheidung für die Kundenkarte, keine pauschale Bestätigung vollständiger DSGVO-Konformität. Auch ein kleiner Ortsteil kann in Verbindung mit einem einzigartigen Gebäude, Fotos oder weiteren Hinweisen eine Zuordnung ermöglichen; solche Kombinationen vor Ausgabe prüfen und nötigenfalls nur Ort/Region nennen.

Interne Rückbau-/Bezugsnachweise getrennt von der Kundenkarte behandeln, nicht ungeprüft weitergeben. Bei personenbezogenen Angaben sind Rechtsgrundlage, konkreter Zweck, erforderlicher Umfang, Zugriffsberechtigung und Aufbewahrungsdauer gesondert zu klären; die Website-Änderung schafft hierfür keine neue Erlaubnis. Keine internen Nachweise hochgeladen, keine aktuellen oder früheren Bewohnerdaten erfasst, keine Datenschutzerklärung ohne Prüfung des tatsächlichen Prozesses umgeschrieben.

107 lokale Tests erfolgreich (75 Node/32 Python), Indexierbarkeit/Seitenzusammenfassungen und Diff-Prüfung erfolgreich. Externe Story/FAQ mit Herkunftsort/Ortsteil statt Gebäudestandort kontrolliert; drei responsive Viewport-Einstellungen ohne Überlauf. Lieferumfang, Mindestanforderungen und Produktdaten bleiben unverändert.

## Mindeststärke als Voraussetzung der Weitergabe, nicht als Selbstzweck

Nach Owner-Feedback den 4-cm-Punkt vom rein technischen Aufarbeitungsargument auf das eigentliche Ziel ausgerichtet: lange nutzen und weitergeben, mit eingeplanter Materialreserve für spätere Aufarbeitungen. Formulierung „mit dem Ziel, dass weitere Generationen …“ beschreibt den Manufakturanspruch, keine garantierte Lebensdauer oder garantierte Anzahl möglicher Überarbeitungen.

Die bestehende Weitergabe-Story schlägt ausdrücklich den Bogen vom Baum über den Fachwerkbalken zur Küche und zur möglichen nächsten Generation. H2 „Seine Geschichte geht mit dir weiter.“ vermeidet den früheren Eindruck, das historisch bereits geprägte Holz müsse erst zum Erbstück werden. Keine neuen Alterszahlen, konkreten Gebäude- oder Generationenfolgen eines bestimmten Balkens erfunden. Zustandsabhängigkeit späterer Aufarbeitung bleibt sachlich in der Größen-FAQ; kein zusätzlicher Service-Link. Mindestseite 30 cm, Stärke 4 cm, Lieferumfang, Herkunftskarte und Produktdaten unverändert.
