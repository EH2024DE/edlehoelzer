# Nachabnahme: B2B, Kollektion, Erbstueck und gesamte Vorschau

Stand: 28.10.2026. Nicht veroeffentlicht, kein neuer PR und keine echten Zahlungen.

## Umgesetzt

- B2B-Fotos: horizontale 3:2-Flaechen, vollstaendige Bilder statt quadratischer
  Ausschnitte. Bildinhalte nicht retuschiert oder neu generiert.
- B2B-Preisorientierung: kompaktes Langholz-/Fruehstuecksbrett ca. 60 EUR,
  mittlere Langholzbretter 90-120 EUR, grosse einfache Stirnholzbretter 180-230 EUR.
  Die Langholzbeispiele beziehen sich auf Eiche/Buche. Andere Holzarten und Details
  werden passend zum Budget kalkuliert. Keine verbindlichen Komplettpreise behauptet.
- Startseite und Navigation: Kollektion, Massanfertigung, Erbstueck, Firmengeschenke.
  Position des Hamburger-Menues unveraendert rechts. Grund: Marke links, Hauptwege
  in der Mitte, Sprach-/Warenkorb-/Menue-Aktionen gemeinsam rechts. Keine technische
  oder allgemeingueltige UX-Vorgabe, sondern eine Layoutentscheidung.
- Tresen-Text: Wunschbrett mit dem eigenen Kuechenfoto ausprobieren. Bildunterschrift
  benennt die A4-Groessenreferenz. Nicht mehr nur das unklare Ausgangsfoto erklaert.
- Tresen-Konfigurator /brettvorschau/: erstmals in die neue Vorschau-Navigation und
  das helle Design eingebunden; Links fuehren nicht mehr auf den alten Live-Auftritt.
  Bestehende Foto-, Referenz- und 3D-Logik bleibt erhalten.
- Servieren/Fruehstueck: kuratierte Auswahl statt allgemeiner servingSuitable-Angabe.
  Bambus/Buche, Buche/Mooreiche, kompakte Laerche, Kambala, dreiteiliges Servierbrett-
  Set, Schwertform, Doppelgriff-Eiche und kleine Stirnholzdesigns. Grosse Erbstuecke,
  Saftrillen-Hackbloecke und die grossen Griffbretter sind nicht mehr in dieser Gruppe.
  Die technischen Produktkategorien und Finder-Eignungen bleiben unveraendert.
- Grossen Erbstueck-Werbeblock am Ende der Kollektion entfernt. Der Einstieg bleibt
  ueber Navigation, Themenauswahl und das konkrete Produkt erhalten.
- Zusaetzlichen Geschenkset-Empfehlungsblock im Shop-Piloten entfernt. Bestehende
  Servierbrett-Set-Produkte bleiben erhalten. Nach Klarstellung des Inhabers ist
  auch die zusaetzliche Set-/Geschenkverpackungsfunktion aus dem Warenkorb entfernt.
  B2B-Geschenkideen bleiben erhalten. Alte lokale Warenkoerbe behalten ihre Produkte
  und Mengen; nur die ueberholte Verpackungsgruppierung wird nicht mehr uebernommen.
- No.004: vorhandene Gravurkonfiguration mit Text/Logo, lizenzierten Schriften,
  Positionen, Schema und Mockup-Freigabe aktiviert. Verwendet den bestehenden
  Board-Gravurpreis von 10 EUR, keine neue Preisformel. Die Serien-Mindeststaerke
  von 4 cm erlaubt die vordere schmale Kante; die widerspruechlichen exakten Masse
  bleiben weiterhin vor dem Kauf zu bestaetigen.
- Kanonische No.004-Produktadressen DE/EN zeigen in der Vorschau denselben
  konfigurierbaren Erbstueck-Aufbau, nicht parallel die alte Etsy-Sonderdarstellung.
- Vergebene Erbstuecke: quadratisch, vollstaendig sichtbar, horizontal wischbar.
  Herkunftsfoto ebenfalls von der alten festen HTML-Hoehe befreit.
- Fertigungsfotos kleiner, maximal 500 px am Desktop und 88 Prozent Breite mobil;
  weiterhin quadratisch. Die vollstaendige 19-Schritte-Geschichte bleibt erhalten.
- Gewaehrleistung: sichtbarer Ausschnitt des unveraenderten EU-Bildes, per Klick
  komplett im Dialog lesbar; Escape schliesst und stellt den Fokus wieder her.
  Keine neue rechtliche Vollstaendigkeits- oder Compliance-Zusage damit verbunden.

## Sitemap- und Designabdeckung

Es gibt eine XML-Sitemap: sitemap.xml mit 145 kanonischen Adressen, darunter
92 Produktseiten und 53 weitere Seiten. Saftrille, Geschenk fuer Frauen, BBQ usw.
sind Themen-/Landingpages, keine separaten XML-Sitemaps. Diese sind im Audit dabei,
ebenso die HTML-Themenuebersicht. Griffmulden werden u.a. auf Produktseiten behandelt.

Die nicht indexierte Tresen-App war zuvor ausserhalb dieses Pruefumfangs und ist
jetzt separat aufgenommen. Das ist eine relevante Ergaenzung zum alten Audit.

Gezielte automatische Pruefungen: Erreichbarkeit, JavaScript beim Laden, mobiler
Seitenueberlauf, alte Verlaeufe/grosse Schattenrahmen, sehr helle Schrift auf hellem
Grund und Widersprueche zwischen CSS-Bildverhaeltnis und tatsaechlicher Groesse.
Das ersetzt keine manuelle Pixelabnahme jeder Scrollposition oder einen WCAG-Audit.

Der Medienaudit fand zwoelf fehlende Vorschau-Freigaben fuer bereits vorhandene
oeffentliche Bilder unter /product/ und /teigschaber-sauerteig/img/. Die sichere
Auslieferung ist auf diese Git-erfassten oeffentlichen Verzeichnisse erweitert;
private Projekt-, Bestell- und Konfigurationsdaten bleiben gesperrt.

## Abnahme und verbleibende Grenzen

- 173 Node-Tests und sieben B2B-Strukturtests bestanden.
- Neue Kernablaeufe DE/EN bei 375, 430, 768, 1024 und 1440 px: Themenreihenfolge,
  Serviergruppe, Gravurauswahl, Archivbilder und EU-Bilddialog.
- B2B-Fotos vollstaendig geladen und 3:2-Verhaeltnis bei 375/1440 px geprueft.
- 3D-Ansicht bei 375/1440 px sichtbar und texturiert; Canvas-Aufnahmen vor/nach
  Drehung unterscheiden sich. Eigene Desktop-/Mobile-Screenshots visuell geprueft.
- 145 Sitemap-Adressen ohne Ladefehler, JavaScript-Ausnahme oder mobilen Ueberlauf.
- Interne statische Abschnittslinks ohne fehlende Ziele.
- Medien- und Bildproportionsaudit nach Korrekturen erneut ausgefuehrt.

Die Gestaltung gilt fuer die Vorschau. Der Live-Auftritt wird weiterhin aus den
alten statischen Dateien ausgeliefert. Vor einem gemeinsamen Release muessen die
freigegebenen Adapter-Aenderungen in den Produktions-Build uebernommen werden.
Dieser Schritt ist nicht durch eine reine CSS-Vorschau oder die Tests erledigt.

Vor echten Stripe-Verkaeufen offen:
1. Laerche kompakt (1818046728): active/available bei stock:0. Bestand nicht erfunden.
2. Exakte No.004-Masse und sonstige noch nicht verifizierte Variantenbestaende.
3. Verbindliche Versandtarife nach verpackten Massen/Gewichten, insbesondere
   hochpreisige/grosse Bretter und erforderliche Transportabsicherung.
4. Stripe-Sandbox-End-to-End gegen den tatsaechlichen Account inklusive signiertem
   Webhook, bezahlter Testbestellung, Bestandsfortschreibung und Benachrichtigung.
5. Hosting des geschuetzten Backends, Secrets, Live-Freigabe und gemeinsamer PR.

Keine Live-Schluessel im Frontend und kein ungetesteter Live-Checkout freigeschaltet.
