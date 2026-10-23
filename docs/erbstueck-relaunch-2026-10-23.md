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
