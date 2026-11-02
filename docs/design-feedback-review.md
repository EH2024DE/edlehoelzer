# Seitenreview vom 3. November 2026

## Umfang und Vorschau

Aktueller Designbranch, weiterhin ohne Veröffentlichung oder Shop-Freischaltung.
Die Vorschau wird aus `scripts/build-design-site.mjs` erzeugt; rohe Quellseiten
sind weiterhin nicht das auszuliefernde Design-Artefakt.

Externe Übersicht: https://accompanying-sends-built-sentences.trycloudflare.com/design-reference/
Beim Abschluss mit HTTP 200 geprüft. Der temporäre Tunnel benötigt den laufenden Rechner.

## Rückmeldungen und Umsetzung

| Rückmeldung | Umsetzung |
| --- | --- |
| Runde Atelier-Hinweise | Gemeinsame Faktenzeile ohne Pills, Rahmen oder Blur. |
| Dunkle Schrift im Erbstück-Teaser | Weiße Schrift auf dunklem Bild-/Textbereich; Bild füllt Desktop-Fläche. |
| Englische Erbstückseite veraltet | Kompakterer Hero; Weitergabe, Mindestmaße, Halter/Balsam/Anleitung und Herkunftskarte ergänzt. Dieselben 19 Prozessfotos in derselben Reihenfolge, mit englischen Bildunterschriften und übernommenen technischen Screenshot-Ausschnitten. Alte ergänzende Prozessinformationen bleiben aufklappbar. |
| Finder-Bild füllt Rahmen nicht | Rahmen und Foto verwenden dieselbe Fläche. |
| Finder stoppt nach Antwort | Reproduzierter Laufzeitfehler: globale Produktverlinkung ersetzte interaktive Finder-Buttons durch Links. Finder-Buttons sind nun ausdrücklich aus dieser Umwandlung ausgenommen. Automatisches Weiter und Zurück getestet. |
| Finder Desktop-Reihenfolge | Frage, Optionen, Navigation, danach Produktauswahl; keine rein visuelle, vom DOM abweichende Reihenfolge. |
| Preis weit von Optionen entfernt | Zweite synchronisierte Anzeige unmittelbar unter Optionen, mit bestehender Berechnung und bestehendem Preis-/Lieferhinweis. Keine neue Kalkulation. |
| „Echte Produktbilder“ | Im gemeinsamen Design ausgeblendet. |
| Gravur auf Anfrage | Produktfakt nennt Gravur jetzt „optional“ in DE/EN; Aufpreise unverändert. |
| Maßbeispiele ohne Produktbezug | Drei bebilderte Links zu exakt den beschriebenen Katalogprodukten. |
| Lange Maßseite | Sekundäre Themen als native aufklappbare Kapitel; Preisrahmen und Anfrage bleiben offen. Keine Löschung der Quelltexte. |
| Hochformatbilder beschnitten | Bestehende Hochformat-Heroassets erhalten einen begrenzten Hochformatrahmen mit vollständigem Motiv. Betrifft Pfannenwender, Küchenaccessoires, Brotzeit, Holzarten und Stirn-/Langholz einschließlich vorhandener EN-Seiten. |
| Holz statt Plastik zentriert | Hero, Vergleich, Einleitung und Argumente linksbündig; TLDR bleibt vorhanden. |
| Zu dunkles Eichen-Vergleichsbild | Durch visuell geprüftes Listingfoto des helleren Eichen-Langholzbretts mit Schweizer Kante ersetzt. |
| Fehlender dezenter Bildzoom | 1,03-facher Hoverzoom für Produktkarten, nur bei Maus und ohne Reduced Motion. |
| Saftrillenprodukte | Alle passenden verfügbaren Katalogprodukte gemeinsam am Seitenanfang, nicht drei oben und weitere unten. Vorhandene Saftrillen-Merkmale werden zusätzlich zur Benennung berücksichtigt. |
| Grüne Tabellen | Anthrazitfarbene Spaltenköpfe, neutrale Zeilenüberschriften und weiße Datenzellen. |
| BBQ-Inhalte gedrängt | Gemeinsame Überschriftenabstände und sauber getrennte Titel/Beschreibungen in den Nutzungsbeispielen. |

## Prüfungen

- 120 automatisierte Node-Tests bestanden.
- 148 generierte Seiten / 145 Sitemap-Seiten: keine Legacy-Font-Befunde im Build-Audit.
- 19 betroffene Seiten in vorhandenen DE-/EN-Fassungen bei 375 und 1440 px: 38 Ansichten ohne automatische Befunde für Überlauf, Schrift, Festflächenkontrast, fehlende oder verzerrte Bilder und JS-Seitenfehler.
- Gezielte Funktionsprüfung bei 375, 430, 768, 1024 und 1440 px: Atelier-Kontrast, Maßkapitel, englische 19-Bilder-Galerie, Finder-Automatismus und Zurück in DE/EN sowie synchronisierter Optionspreis bestanden.
- Screenshot-Sichtprüfung von Atelier, Maßkapiteln, englischer Prozessgalerie und Eichen-Ersatzfoto.
- Metadaten, H1, bestehende Links und Formverträge werden weiterhin gegen die Quellen geprüft. Der Inhaltstest erlaubt nun Strukturänderungen, vergleicht aber alle ursprünglichen Textknoten verlustfrei als Multimenge.

Die Browserprüfungen ersetzen keinen echten iPhone-/Safari-Test. Text über Fotos
wird nicht allein vom automatischen Festflächen-Kontrasttest als freigegeben betrachtet.

## Noch offen, bewusst nicht als erledigt bezeichnet

1. Shop-Konfigurator: drei Saftrillenformen samt Schema, Gravurpositionen, Texte/Logo-Dateien und Mockup-Freigabe gehören in den separaten Shop-Schritt. In dieser Runde wurden weder Checkout noch Preise, Versandregeln oder Stripe verändert. Der Gesamtpreis verwendet lediglich die vorhandene Anzeige zweimal.
2. Nicht jede deutsche Landingpage hat im aktuellen main eine eigenständige englische Entsprechung. Insbesondere existiert `/en/custom-cutting-board/` nicht, obwohl alte interne Links darauf verweisen. Das ist eine echte Übersetzungs-/Verlinkungslücke für den nächsten Inhaltsdurchgang, keine abgeschlossene bilinguale Migration.
3. Die englische Erbstückseite teilt nun Kernstory, Fertigungsfotos und Designprinzipien mit DE. Die bestehende englische Anfrage per E-Mail wurde nicht stillschweigend durch ein neues Formular ersetzt; die native Prozessgalerie ist manuell swipebar, ohne separaten Play-Modus.
4. Die übrigen Seitentypen weiterhin in gezielten Batches abnehmen. Automatisch saubere Darstellung bedeutet nicht, dass jede der 148 Seiten redaktionell und inhaltlich fertig ist.

## Sicherheitsgrenzen

`products.json`, Bestandsdaten, Stripe, DNS und Live-Checkout unverändert.
In `main.js` ausschließlich die ausdrücklich geprüfte Gravur-Beschriftung und
der Finder-Button-Schutz geändert; ein Regressionstest begrenzt den Diff darauf.
Der englische veraltete redaktionelle Erbstückpreis wurde an die vorhandene
deutsche Seite angeglichen, nicht an einem Zahlungsanbieter geändert.
