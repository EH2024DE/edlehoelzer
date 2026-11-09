# Tresenvorschau: Sprach- und Funktionstest

## Korrekturen

- Englische Modellnamen, einzelne Materialbeschriftungen und die Meldung fuer
  eine unpassende Referenzflaeche ergaenzt. Der Link zur Auswahl eines anderen
  Bretts fuehrt im englischen Modus zur englischen Produktuebersicht.
- Kaufbutton bei archivierten/nicht verfuegbaren Modellen verborgen. Die
  Vorschau eines alten Stuecks bleibt als Referenz moeglich. Die Entscheidung
  folgt einem minimalen, beim Build aus dem oeffentlichen Katalog erzeugten
  Statusbestand. Keine Preise oder Kundendaten werden darin kopiert.
- Ein Regressionstest verlangt einen neuen Preview-Build, wenn diese
  Katalogfreigaben sich aendern. Kein Live-Lager- oder Reservierungsversprechen.
- Geometrie, Bildverarbeitung und A4-Erkennungsalgorithmus nicht geaendert.
- Beim Wiederherstellen nach Navigation wurde ein WebKit-Fall gefunden:
  persistierte File-Objekte verloren ihren Fotoinhalt. Der lokale Cache speichert
  nun Bildbytes und rekonstruiert die Datei beim Lesen. Alte Eintraege bleiben
  soweit ihre Bilddaten noch vorhanden sind lesbar; Ablauf nach 24 Stunden und
  manuelles Entfernen bleiben erhalten.

## Gepruefter Ablauf

Deutsch und Englisch, 375 und 1440 px: sichtbare bewegliche 3D-Szene mit
Canvas-Pixelpruefung, Rotation, Vollbild/Escape, Zurueckweisung ungeeigneter
Dateitypen, lokaler Fotoupload, A4-Erkennung, vier Referenzecken, vergroesserter
Eckeneditor, Bestaetigung und Brettplatzierung, erneute Kalibrierung und
Etsy-Kaufziel. Zusaetzlich Wechsel ueber eine archivierte Produkt-URL mit lokal
gespeichertem Foto: kein Kaufbutton fuer das Archivmodell.

Das bereits bereitgestellte Original-Kuechenfoto wurde lokal geprueft und
erkannt. Es wurde nicht in den Quellcode, das oeffentliche Build-Verzeichnis
oder das Repository kopiert. Im Test wurden keine POST-Anfragen zum Upload
des Fotos beobachtet. Das oeffentlich bereits vorhandene Beispielfoto dient
als reproduzierbare Standard-Testdatei.

19 Modell-/Geometrie-/Sprach-/Cachetests und fuenf Referenzqualitaetstests bestanden.
Die ausgewaehlten Sprach-, Referenz- und Verfuegbarkeitstests laufen jetzt auch
mit dem regulaeren Design-CI. Browserpruefungen in Chromium und WebKit;
echtes iPhone/Android und Mobilfunk sind weiterhin eine gesonderte Abnahme.

## Indexierung: bewusst keine pauschale Aenderung

Die Tresenvorschau hat absichtlich `noindex, follow` und einen Canonical auf
`https://edlehoelzer.de/brettvorschau/`. Einzelne Produkt-/Sprachparameter
dieser interaktiven Hilfe sollen keine zusaetzlichen Suchtreffer werden.
Produkt- und redaktionelle Seiten bleiben davon unabhaengig indexierbar.

Die oeffentliche Live-Pruefung bestaetigte fuer die gemeldete Vorschau-URL:
HTTP 200, `noindex, follow`, passender Canonical. Fuer die gepruefte
Kuechenaccessoires-Seite und Baumspende: HTTP 200, kein noindex und
selbstreferenzierender Canonical. robots.txt erlaubt das Crawling und verweist
auf die XML-Sitemap. Die Live-Sitemap enthielt 147 URLs.

In Search Console wurde die echte XML-Sitemap erneut erfolgreich eingereicht.
Fuer die oeffentlich erreichbare Kuechenaccessoires-Seite wurde eine
Indexierungsanfrage bestaetigt. Das ist kein Nachweis einer bereits erfolgten
Indexierung und keine Garantie dafuer.

Die noch unveroeffentlichten neuen Produktadressen wurden nicht zur Indexierung
eingereicht. Vor ihrem Deployment liefern sie auf der echten Domain noch 404.
Der lokale Branch-/Vorschau-Stand und die Live-Seite sind deshalb nicht zu
verwechseln. Nach PR-Freigabe und erfolgreichem Deployment Sitemap erneut
pruefen und erst dann neue Adressen inspizieren.

Ein irrtuemlich als Sitemap eingetragener HTML-Themenindex ist ein separater
Aufraeumpunkt. Seine Entfernung aus Search Console erfolgt erst nach der
angefragten Freigabe; die HTML-Seite selbst soll bestehen bleiben.

Nichtoeffentliche Search-Console-Berichtsdaten und Account-Screenshots werden
nicht in dieses oeffentliche Repository aufgenommen.

Offizielle Einordnung:
https://developers.google.com/search/docs/crawling-indexing/block-indexing
https://support.google.com/webmasters/answer/7440203
