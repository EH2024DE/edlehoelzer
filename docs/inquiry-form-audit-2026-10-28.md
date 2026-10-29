# Formularabgleich: Firmengeschenke und weitere Anfragen

Stand: 28.10.2026. Aenderungen noch nicht veroeffentlicht.

## Befund

Die Firmengeschenke-Seite verwendete das vereinfachte Formular aus dem frueheren
B2B-Stand: nur Name, E-Mail und Nachricht waren verpflichtend. Stueckzahl und ein
freier Budgettext lagen unter optionalen Angaben. Eine separate Budgetbezugsart
fehlte. Der Design-Adapter hatte diese alte Feldstruktur bewusst erhalten; damit
war die Seite nicht auf dem zuletzt gewuenschten fachlichen Stand.

Die Schriftregel deckte Ueberschriften und Eingaben ab, aber nicht ausdruecklich
alle Beschriftungen und Summary-Elemente. Diese werden jetzt einheitlich auf
Atelier gesetzt. Atelier ist der lokale CSS-Familienname der Montserrat-Datei
assets/fonts/shop/montserrat.ttf, keine neue oder fremde Schriftwahl.

## Korrektur

Firmengeschenke DE:
- Name, E-Mail, Stueckzahl, Budget, Budgetbezugsart und Projektbeschreibung sind
  verpflichtend und ausserhalb des optionalen Details-Blocks sichtbar.
- Budgetbezugsart: pro Produkt/Geschenkset oder fuer das Gesamtprojekt.
- Die Stueckzahl bezieht sich bei Sets auf die Anzahl der Sets. Die Zusammenstellung
  wird in der Nachricht erlaeutert, statt Produktteile und Sets unklar zu mischen.
- Firma, Telefon und Termin bleiben optional.
- Bestehender Formspree-Endpunkt, Betreff, Rueckleitung, Honeypot, Datenschutzlink
  und der bestaetigte Hinweis zur Konzeptpauschale bleiben erhalten.

Englisch:
Die vorhandene englische Firmenrubrik /en/#b2b hatte bislang nur einen E-Mail-Link.
Sie enthaelt jetzt dieselben expliziten Pflichtfelder und optionalen Angaben sowie
den bestaetigten Hinweis zur Konzeptpauschale. Es wurde keine zusaetzliche
Landingpage oder neue URL angelegt. In der Vorschau blockiert der Bootstrap jede
tatsaechliche Uebermittlung; der Produktionscode behaelt den nativen POST-Weg.

## Weitere Formulare

Alle acht Anfrageformulare der kanonischen HTML-Quellen wurden nach Feldnamen und
Pflichtstatus inventarisiert. Such- und Katalogfilter sind keine Anfrageformulare.

- Gastronomie DE/EN: Budget und Budgetbezugsart bereits korrekt verpflichtend.
  Die Beschreibung wird bei offener Idee oder individueller Sonderloesung
  verpflichtend und sichtbar. Diese Fallunterscheidung bleibt erhalten.
- Massanfertigung und Atelier-Anfrage: E-Mail und Wunschbeschreibung verpflichtend;
  Masse, Holz, Bauweise, Budget und Termin bewusst optional. Keine B2B-Pflichtlogik
  ungefragt auf private Einzelanfragen uebertragen.
- Baumspende: bestehende Identitaets-, Kontakt- und Ortsfelder nicht veraendert.
- Erbstueck-Quellformular: bestehende Felder fuer Verwendung, Format, Buchenlinien
  und weitere Details unveraendert. Die neue Erbstueck-Studie hat einen separaten
  Kauf-/Kontaktweg; eine komplette Formular-Paritaet dieser Sonderroute wird mit
  dieser Korrektur nicht behauptet.

## Tests

- 169 Node-Tests und sieben B2B-Strukturtests bestanden.
- Firmenformular DE/EN bei 375, 430, 768 und 1440 px: sichtbare Budgetfelder,
  Pflichtpruefung fuer die Bezugsart, FormData mit Stueckzahl und Budget,
  einheitliche Montserrat-basierte Formularschrift, kein Seitenueberlauf.
- Vorschauabsendung erzeugt nur eine lokale Statusmeldung; kein Request an
  Formspree. Keine echte Anfrage wurde versendet.
- Ergaenzend Formularschrift in Massanfertigung, Atelier, Gastronomie DE/EN und
  Baumspende geprueft; Sonderloesungs-Beschreibung in Gastronomie sichtbar und
  verpflichtend getestet.
- Keine Verifikation der echten E-Mail-Zustellung: dazu ist ein gesonderter
  freigegebener Live-Test erforderlich.

Die neue Gestaltung ist weiterhin Vorschau. Das allgemeine Design muss fuer den
Livegang noch in die statische Auslieferung uebernommen und freigegeben werden.
