# Atelier-Vorschau: Korrekturen und Audit

Stand: 28.10.2026. Noch nicht veroeffentlicht oder committet.

## Ursache

Die seitenweite Vorschau hatte die vorhandenen Hauptinhalte absichtlich erhalten.
Dadurch blieben auf der deutschen Aufbereitungsseite mehrere historisch gewachsene
Bild- und Erklaerungsbloecke gleichzeitig stehen. Ein einheitlicher CSS-Look war
keine ausreichende inhaltliche Abnahme. Die frueheren Ueberlauf- und Ladepruefungen
haben diese Dopplungen nicht abgedeckt.

Im Finder wandelte die Produktseiten-Navigation Buttons in echte Links um.
renderFinderPool suchte bei der naechsten Antwort weiterhin nach einem Button.
Der Nullzugriff brach vor dem automatischen Weiter-Timer ab. Jetzt wird das stabile
Element .finderPool__inspect verwendet; die Erklaerung einer einzelnen Abweichung
bleibt auch bei einem Link erreichbar.

Die Themenbilder der Startseite hatten eine feste intrinsische HTML-Hoehe.
Explizites height:auto zusammen mit aspect-ratio:1 loest das widerspruechliche
Format. Die Originalbilder werden nicht veraendert.

## Umgesetzt

- Finder wechselt nach einer Antwort automatisch weiter; Zurueck, Antwortaenderung
  und manuelles Weiter bleiben moeglich. DE und EN getestet.
- Vier Themenfotos auf der Startseite sind auf allen fuenf getesteten Breiten
  quadratisch, ohne die vorherigen schmalen Hochformat-Ausschnitte.
- Aufbereitung DE: eine einzige Vorher-Nachher-Darstellung im Kopf; doppelte
  Triage-, Ergebnis- und Vorher-Nachher-Galerien entfernt. Bestehende Preise und
  Leistungsgrenzen bleiben erhalten. Leistungsumfang direkt am passenden Paket
  aufklappbar, Werkstatt-Schritte in einem separaten aufklappbaren Abschnitt.
- Aufbereitung EN: kuerzere Struktur, dasselbe Vorher-Nachher-Paar, keine zusaetzliche
  Balsam-Abbildung. Die in DE bestaetigte Dose Balsam ist auch im Refresh-Paket genannt.
- FAQ-Artikel in der allgemeinen Seitenvorschau sind native Details/Summary-Elemente.
  Texte, Mikrodatenauszeichnung, Formulare und kanonische Metadaten bleiben erhalten.
- Ratgeber-Koepfe ohne alte Verlaeufe, quadratische Bildflaechen, weniger Rahmen,
  Schatten und Boxen, zurueckhaltende Links statt dekorativer Linkkarten.
- Helle Schrift auf neu hellem Hintergrund auf Eiche-, Nussbaum-, Holzvergleichs-
  und Bauweisen-Seiten korrigiert. Auch Baumspende und Themenuebersicht verwenden
  jetzt den hellen, verlaufsfreien Kopf.

Die strukturellen Kuerzungen der Aufbereitung liegen bewusst im Vorschau-Adapter
tools/shop-server/refurbishment-preview.mjs. Vor einer Veroeffentlichung muessen
diese freigegebenen Aenderungen in den statischen Seiten-Build uebernommen werden.
Der GitHub-Pages-Auftritt ist dadurch noch nicht umgestellt.

## ZEITRAUM-Uebertragung

Quelle erneut geprueft: https://www.zeitraum-moebel.de/
Die offizielle Seite trennt Produkte, Referenzen und Geschichten klar.
Unsere Ableitung: pro Abschnitt eine Aufgabe, echte Objektfotos, sachliche
Materialinformationen und vertiefende Details auf Wunsch. Keine fremden Texte,
Produkte, Zertifikate oder Erfolgsversprechen uebernommen. Die Erbstueck-Geschichte
und ihre Fertigungsstrecke werden nicht pauschal gekuerzt.

## Noch offen, nach Prioritaet

1. Vor Livegang: Vorschau-Design und Seitenstrukturen in den statischen Build
   ueberfuehren; aktuell liest der Live-Auftritt diese Adapter nicht. Anschliessend
   Produktions-CSP, Formulare, Consent und Navigation separat abnehmen.
2. Sortiment: /produkte.html verwendet weiterhin die technischen Filter
   board/accessory/care. Die sechs gewuenschten Produktgruppen sind in der
   Atelier-Kollektionsstudie sichtbar, aber noch nicht vollstaendig im regulaeren
   Produktseiten-Filter integriert. Keine Vollstaendigkeit behaupten.
3. Inhaltliche Kuerzung nach gleichem Prinzip fuer Nussbaum, Eiche, Massivholz,
   Stirnholz/Langholz und Massanfertigung pruefen. Der Quelltext-Audit markiert
   dort 13-17 H2-Ueberschriften; das ist ein Pruefsignal, kein SEO-Fehlernachweis.
   Beratung, konkrete Angebote und FAQ sollten klarer getrennt werden.
4. Wiederverwendete Fotos pruefen: /schneidebrett-nussbaum/ (Nussbaumfoto zweimal),
   /welches-oel-schneidebrett/ (Balsam und Oelfoto je zweimal) und
   /schneidebrett-made-in-germany/ (Werkstattfoto zweimal). Wiederholung kann in
   anderem Kontext sinnvoll sein; deshalb nicht automatisch alle Bilder loeschen.
5. Stripe bleibt Demo/Test. Echte Zahlung, Lieferkostenfreigaben und sichere
   Bestandsfortschreibung sind eine getrennte Freigabe, kein Ergebnis dieses Audits.

## Pruefung

- 165 automatisierte Node-Tests bestanden, darunter Preise, Shop-Sicherheit,
  Herkunft/Lieferumfang, Formulare und Inhaltserhalt.
- Finder vollstaendig ohne Weiter-Klick in DE/EN bei 375, 430, 768, 1024 und
  1440 px durchlaufen; Budgetaenderung und Erklaerung knapp abweichender Treffer.
- Themenbilder auf allen zehn Sprach-/Viewport-Kombinationen quadratisch.
- Aufbereitung: keine doppelten Bildquellen, bestaetigte Preise und funktionierende
  Abschnittslinks in DE/EN. Leistungsdetails per nativer Tastaturbedienung erreichbar.
- Alle 145 Sitemap-Seiten: HTTP 200, keine JavaScript-Ausnahme beim Laden,
  kein horizontaler Seitenueberlauf bei 375 px.
- 16 repraesentative Seitentypen bei 375, 768 und 1440 px ohne Ladefehler,
  JS-Ausnahmen oder Seitenueberlauf; Menue, Produktdetails und Katalog geprueft.
- Ergaenzender Design-Audit ueber 145 Seiten: keine gefundenen alten Verlaeufe,
  stark gerundeten Schattenrahmen oder sehr heller Schrift auf hellem Grund nach
  Korrektur. Das ist eine gezielte Heuristik, kein vollstaendiger WCAG-Kontrastaudit.
  Absichtliche Schrift auf Foto-/Video-Overlays wird separat visuell beurteilt.
- Statische interne Abschnittslinks: keine fehlenden Ziele.
- git diff --check erfolgreich.

Externe Vorschau am Ende des Durchlaufs mit HTTP 200 geprueft. Quick-Tunnel ist
temporaer und benoetigt einen laufenden, erreichbaren lokalen Rechner.
