# Design-Abnahme, 29.10.2026

## Umfang

Design-Build unabhaengig von der noch unfertigen Stripe-Portierung geprueft.
145 Sitemap-Seiten plus Tresenvorschau und zwei Suchseiten. Jede der 148 Seiten
bei 375, 430, 768, 1024 und 1440 px: **740 Ansichten**.

## Ergebnisse

- 16.196 Bildinstanzen erfasst, inklusive nachgeladener Bilder.
- Keine gemeldeten Bildladefehler, ausstehenden Bildloads oder geometrischen
  Verzerrungen durch gestreckte Bilder.
- Quadratische Produkt-Hauptmedien und Karten innerhalb 2 px Toleranz geprueft.
- Kein horizontaler Seitenueberlauf, abgeschnittener Button oder JS-Fehler in
  den 740 Ansichten.
- Kontaktboegen aller Produktgruppen und wichtiger Seitentypen visuell
  angesehen; querformatige Hero-/Szenenbilder, originale EU-Hinweise und Videos
  haben absichtlich andere Seitenverhaeltnisse als Produktfotos.
- Kein KI-Neugenerieren oder Veraendern der Holzgeometrie/Fotos.
- Gemeinsame Galerie: DE/EN bei allen fuenf Breiten interaktiv geprueft,
  Foto zuerst, Video zweitens, quadratische Buehne, Fotozoom, vollstaendiger
  EU-Hinweis mit vergroesserbarer Ansicht.
- Erbstueck-Fertigung: manuell startende Wiedergabe, Vor/Zurueck und 3-Sekunden-
  Intervall bei allen fuenf Breiten und beiden Sprachen bestanden.
- 20 Formularfaelle: Budgetbasis erforderlich, Fehlversuch behaelt Eingaben,
  bestaetigter Erfolg setzt zurueck. Provideraufrufe abgefangen; nichts versandt.
- 10 Such-/Menuefaelle und 10 Filterfaelle bestanden, einschliesslich Reset,
  Leerzustand, Fokus und Sprachzuordnung.
- 3D-Tresenvorschau bei allen fuenf Breiten: Canvas-Pixel nicht leer, Drehung
  veraendert Pixel, Halteransicht reagiert, Assets erreichbar, kein Ueberlauf.

## Navigation und Anpassungen

Der reduzierte Startseiten-Footer erschwerte das Finden vorhandener Seiten.
Technisch waren keine Sitemap-Seiten verwaist, einige Einstiege aber unauffaellig.

- Startseiten-Footer mit drei ruhigen Themen-/Servicegruppen in DE/EN ergaenzt.
- Menue auf allen Seiten um Aufbereitung und Wissen/Ratgeber erweitert.
- Vorhandene Themenuebersicht einschliesslich englischem Bereich verwendet;
  keine neuen SEO-Seiten oder erfundenen Produkttexte angelegt.
- Jetzt sind alle 145 Sitemap-Seiten von einer Sprachstartseite innerhalb von
  hoechstens zwei internen Links erreichbar; Regressionstest sichert dies ab.
- Neue Menue-/Footer-Einstiege zusaetzlich in zehn Browserfaellen geprueft.
- Kurze vorhandene Produkt-Anzeigenamen als sichtbare H1; ausfuehrliche SEO-
  Titel bleiben erhalten. Vorhandene Produktdaten beim Generieren synchronisiert.
- Lange Legal-Ueberschriften erhalten passendere feste mobile Schriftgroesse
  und Silbentrennung. Keine Rechtstexte geaendert.

## Nachweise und Grenzen

Lokale Screenshots/Geometrieprotokoll: /tmp/edle-design-final/report.json und
Kontaktboegen im selben Verzeichnis. Interaktionsprotokoll:
/tmp/edle-design-interactions.json. Menue-/Footer-Screenshots:
/tmp/edle-menu-*-*.png und /tmp/edle-footer-*-*.png.

Automatische Layouttests und Kontaktboegen sind keine Garantie fuer jedes
Geraet, jede Browserengine, alle moeglichen Texte oder jedes Galeriebildmotiv.
Die aktuellen Tests liefen in Chromium. Safari/iOS auf einem echten Geraet ist
keine hier belegte Endabnahme. Das Originalfoto und Perspektive beeinflussen die
wahrgenommene Brettgroesse; keine Behauptung millimetergenauer Fotovergleiche.

Release-Link-/Exportpruefung: 158 HTML-Seiten, 542 Dateien, keine Fehler.
Navigation und Produktions-Build: 10 Node-Tests bestanden.
Stripe, DNS, Produktionsdomain und echte Zahlungen unveraendert.

Die Designvorschau wird mit scripts/build-design-staging.mjs und dem bereits
geprueften statischen Handler aus f6b4756 gebaut. Dadurch wird NICHT versehentlich
die noch unvollstaendige lokale Worker-/Stripe-Portierung bereitgestellt.
