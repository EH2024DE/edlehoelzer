# Regression: automatische A4-Erkennung in der Atelier-Vorschau

29.10.2026. Originalfoto lokal vom Inhaber bereitgestellt; nicht ins Repository
kopiert und nicht an einen Server hochgeladen.

## Ursache

Die Erkennung lief in der neuen Vorschau nicht an. Die neue CSP script-src 'self'
blockierte zuerst die eingebettete WebAssembly-Kompilierung von OpenCV. Eine reine
wasm-unsafe-eval-Freigabe reichte nicht: Die mitgelieferten Emscripten-Bindings
verwenden zusaetzlich new Function in createJsInvoker.

Die Meldung war deshalb "Automatische Erkennung nicht verfuegbar", nicht das
regulaere Ergebnis "Kein eindeutiges Blatt gefunden". Die handgesetzten Marker
im Screenshot waren kein Nachweis einer erfolgreichen automatischen Erkennung.

## Korrektur

Nur /brettvorschau/ erhaelt die fuer den vorhandenen lokalen OpenCV-Build
erforderliche unsafe-eval-Erlaubnis. Skriptquellen bleiben auf self begrenzt;
Inline-JavaScript wird nicht freigegeben. Alle Sitemap-, Produkt-, Warenkorb- und
Checkoutseiten behalten ihre strengere Richtlinie. Dies ist eine begruendete
route-spezifische Ausnahme, keine generelle Lockerung der Shop-Sicherheit.

Weder Algorithmus noch Schwellenwerte noch Foto wurden veraendert. Ein spaeterer
OpenCV-Build ohne dynamische Emscripten-Bindings koennte diese Ausnahme vermeiden;
dieser Build wurde nicht improvisiert oder die Drittbibliothek von Hand gepatcht.

## Regressionstest

tests/worktop-paper-detection-browser.cjs verwendet ein per TEST_WORKTOP_PHOTO
angegebenes lokales Originalfoto. Vergleich: altes HTML/Layout aus HEAD und neue
Vorschau, jeweils dieselbe korrigierte CSP und derselbe unveraenderte Detektor.
Externe Schriftanfrage des alten HTML ist im Test entfernt.

Bei 430 und 1440 px werden dieselben vier normalisierten Punkte erkannt:

1. 0.285556, 0.699167
2. 0.550000, 0.662500
3. 0.633333, 0.743333
4. 0.323333, 0.798333

Die Punkte liegen auf dem Papier, nicht auf Moebeln oder anderen hellen Flaechen.
Kein manueller Eckeneditor/Drag wurde im Test verwendet. Keine POST-Anfrage,
kein OpenCV-CSP-Fehler und keine JavaScript-Ausnahme. Ein gesonderter Test stellt
sicher, dass die Ausnahme auf keiner Shop-/Produkt-/Checkout-Route vorhanden ist.

Bereits geoeffnete Tabs muessen vollstaendig neu geladen werden, weil deren CSP
vom alten Dokument stammt. Ein Klick auf "Erneut suchen" allein aktualisiert
die Sicherheitsrichtlinie des Dokuments nicht.
