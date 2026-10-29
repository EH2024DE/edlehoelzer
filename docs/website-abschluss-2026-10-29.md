# Website-Abschluss: Arbeitsstand fuer die Nacht

NEUER AUFTRAG 29.10.2026: Fuer den Direct Shop gilt jetzt
shop-prelaunch-master-audit.md und shop-go-live-approval.md. Cloudflare ist die
Zielruntime; der folgende GitHub-Pages-Releaseplan ist historischer Kontext,
keine aktuelle Deploy-/DNS-/Finanzfreigabe. Aktueller Branch:
codex/cloudflare-stripe-shop. Vorhandene Arbeiten vollstaendig erhalten.

Stand 29.10.2026, bestehender Checkout erbstueck-storytelling. Nicht veroeffentlicht.
Vorhandene uncommittete Arbeiten erhalten. Keine Live-Zahlung freigeschaltet.

## Morgenabschluss 07:30 CET

Autonome Nachtarbeit innerhalb des vereinbarten Zeitfensters beendet. Kompakte
Uebergabe: morgen-uebergabe-2026-10-29.md. Externe Vorschau zuletzt HTTP 200,
git diff --check ohne Fehler. 213 Node-Tests bestanden; technische Browser- und
Produktkonfigurationspruefungen unten dokumentiert. Keine weitere unabhaengig
sinnvolle Arbeit ohne Freigaben oder verifizierte Daten begonnen. Keine echte
Stripe-Zahlung, Mailzustellung oder produktive Auslieferung behaupten.
Die Wiederaufnahme-Automation edle-h-lzer-abschluss-fortsetzen wurde nach
erstellter Uebergabe geloescht (Tool bestaetigt deleteStatus: deleted).

## Aktueller Zusatzstand: 05:35 CET

Die folgenden Ergebnisse sind neuer als die historischen Nacht-Notizen darunter.

Ergaenzung Such-Abnahme: EN-Header hat bisher auf die deutsche Suche gefuehrt.
Neue absichtlich nicht indexierbare /en/search/ ergaenzt, englische Suchbegriffe,
Produktnamen, Treffertexte und Rueckwege lokalisiert. Ratgeber nach Sprache
getrennt, keine zweite Produktdatenquelle. DE/EN bei 375/1440 px inklusive
Menue-Escape/Fokusrueckgabe, Suchnavigation und Leerzustand geprueft.
Export jetzt 158 HTML-Seiten und 543 Dateien inklusive Manifest; Indexierbarkeit
weiter 145/145 bei 167 HTML-Quellen. Keine Aenderung der Sitemap fuer interne
Suchseiten erforderlich. Finale Node-Gesamtsuite nach allen Ergaenzungen:
213/213 bestanden. Einfacher Literal-Credential-Scan der Quell-/Konfigurations-
und Dokumentdateien ohne Treffer; dies ersetzt keinen vollstaendigen Secret-Audit.
Zusaetzlicher Portfolio-Volltest: 120 Basiskonfigurationen und 1.236 zulaessige
Textgravur-Konfigurationen fuer alle aktiven Angebote durchgerechnet, inklusive
Saftrillen-/Balsamaufschlaegen und Einzelstueckgrenzen. Nicht mit einer Freigabe
ungepruefter Variantenbestaende verwechseln. Vorbereitete kompakte Morgen-Uebergabe:
morgen-uebergabe-2026-10-29.md; bei Ende des Zeitfensters finalisieren.
Nachpruefung 05:58 CET: Produktions-Regressionspruefung sichert jetzt auch den
vollstaendigen unveraenderten Main-Text aller regulaeren Seiten ab. Nur bereits
freigegebene Start-/Aufbereitungsumbauten sind ausgenommen; bei EN-Erbstueck wird
jeder bisherige Absatz und jede Ueberschrift trotz Umordnung weiter nachgewiesen.
Alle sechs Produktions-Buildtests mit diesen zusaetzlichen Assertions bestanden.

- Gesamte Node-Regression: 207/207 bestanden, danach zwei weitere bestandene
  Release-Regressionen fuer EN-Erbstueck und No.004 ergaenzt (209 insgesamt).
  Anschliessend ein weiterer bestandener Wiederherstellungs-Grenztest ergaenzt
  (210 insgesamt); finale Gesamtsuite 210/210 und zugehoerige elf
  Reservierungs-/Recoverytests bestanden.
  Zwei weitere Regressionen fuer persistente Recovery-Alarme und unpassende
  Providerantworten ergaenzt; nachfolgende Gesamtsuite siehe letzte Testausgabe.
- Statischer Release auf ALLEN 145 kanonischen Seiten bei 375, 768 und 1440 px
  erneut im Browser geprueft: 435 Ansichten, keine lokalen HTTP-Assetfehler,
  JavaScript-Ausnahmen, horizontalen Seitenueberlaeufe, alten Playfair-Ueberschriften
  oder alten Abschnittsverlaeufe. Dies ist eine technische Breitpruefung, keine
  persoenliche gestalterische Abnahme jedes einzelnen Bildausschnitts.
- Alle 157 exportierten HTML-Seiten / 541 Manifest-Dateien auf lokale Ziele,
  Fragmente und Exportgrenzen geprueft: 0 Fehler. Indexierbarkeit unveraendert
  145 kanonische URLs = 145 Sitemap-URLs. Medienaudit: 0 kritisch, 24 bestehende
  Hinweise (u.a. Metadaten, grosses Bewertungsfoto und dynamische Tresenbilder).
- DE/EN-Firmengeschenke und Gastro: acht echte Browserfaelle bei 375/1440 px.
  Budgetbasis ist Pflicht; fehlgeschlagene Anfrage behaelt Eingaben, bestaetigte
  Anfrage setzt zurueck. Alle Formspree-Requests abgefangen, nichts real gesendet.
  Dabei einen echten Altfehler behoben: das EN-B2B-Formular war nicht korrekt mit
  dem Handler verbunden; optionale Referenzfelder konnten nach Erfolg abstuerzen.
- EN-Erbstueck war tatsaechlich inhaltlich veraltet: Buche statt Ahorn, aktueller
  Startpreis, internes Produktziel statt direktem Etsy-Sprung, aktuelles No.004-
  Bild und bestaetigter Standard-Lieferumfang korrigiert. Im Release sind jetzt
  dieselben 19 Fertigungsmomente wie in der freigegebenen Gestaltung vorhanden.
  Die alte Kurzuebersicht bleibt einklappbar erhalten. Langer Ueberblick liegt
  ausserhalb der festen Herohoehe und wird nicht mehr abgeschnitten.
- Offizieller EU-Gewaehrleistungshinweis wurde durch eine alte Designregel
  beschnitten. Jetzt vollstaendig und proportional sichtbar, zusaetzlich vergroesserbar.
  Unveraendertes Originalbild, keine erfundene Zusatzgarantie. Rechtsgrundlage und
  Grenzen der Umsetzung: legal-notice-display-2026-10-29.md.
- Vier weitere Browserfaelle DE/EN bei 375/1440 px: quadratische Produktgalerie,
  Video an zweiter Stelle samt mobilem Start, Bildzoom/Escape, vollstaendiger
  EU-Hinweis mit Vergroesserung, Fertigungsfolge ohne Autostart und mit manueller
  3-Sekunden-Wiedergabe bestanden. Beide Serienfassungen behalten 19 Schritte.
- Tresen-3D im statischen Release bei 375/1440 px separat geprueft: nichtleere
  Canvas-Pixel, sichtbare Aenderung bei Drehung und Wechsel in den Halter,
  keine fehlenden lokalen Assets, JavaScript-Fehler oder Seitenueberlaeufe.
- Atomare Website-Bestandsreservierungen, persistente Session-Parameter,
  Wiederanlauf-/Stripe-Abgleich, asynchrone Eingangsmitteilung und manuelle
  Annahme vorbereitet und getestet. Mail-Worker mit Leasing/Retry/Idempotenz
  vorhanden, aber absichtlich NICHT angeschlossen. Per-Produkt-Zahlungsfreigabe
  zusaetzlich eingefuehrt; Freigabeliste leer. Voller Betriebsstand und verbleibende
  Sicherheitsfreigaben: checkout-security-release-2026-10-29.md.
- Alte Session mit unklarem Erstellungsresultat bleibt sicherheitshalber reserviert,
  wenn kein Remote-Status mehr rekonstruiert werden kann. Operator-Eskalation und
  ein sicherer Freigabeweg sind vor Zahlungsstart noch zu schliessen; Bestand wird
  niemals allein aufgrund vergangener Zeit erneut verkauft.
  Unabhaengiger Read-only-Sicherheitsreview bestaetigt diesen offenen Betriebsfall;
  Wiederholung alter unsicherer Creates nun vor Ablauf der Stripe-Idempotenzfrist
  gesperrt und getestet. Keine automatische Freigabe aufgrund leerer Suche.
  Neue private /api/shop/checkout-alerts zeigt dauerhaft betroffene Bestellkennungen,
  Grundcodes und Zeitpunkte ohne Kunden-/Providerdaten. Fehlgeschlagene Session-
  Erstellung vermerkt den Alarm sofort; nur positive Verifikation loest ihn auf.
  Sessionreferenz, Testkennung, Waehrung und Gesamtbetrag werden jetzt auch VOR
  dem Checkout-Redirect abgeglichen, nicht erst beim spaeteren Webhook.
- Speicherblockaden im Browser verhindern nicht mehr die Aktualisierung des
  Headerzaehlers und der festen Warenkorbsumme. DE/EN bei 375 px getestet, beide
  Storage-APIs absichtlich mit SecurityError blockiert.
- Private Bestelldatenverzeichnisse muessen 0700 haben; weltlesbare bestehende
  Verzeichnisse werden abgelehnt. Keine Kundendaten/Backenddateien im Release.

### Repository und Veroeffentlichung

origin/main aktualisiert und Branch ohne Verlust lokaler Arbeit auf 45111ea
vorgespult; identischer vorheriger Dateibaum. PR #198 ist bereits gemergt, ebenso
#197 Gastro, #195 Erbstueck und #194 B2B-URL. Die letzten 20 Actions-Runs waren
erfolgreich. Offener Alt-PR #196 hat Mergekonflikte und darf nicht blind ueber die
neue Kataloglogik gemergt werden: https://github.com/EH2024DE/edlehoelzer/pull/196.
Sein Umfang wird inzwischen durch den aktuellen Katalogentwurf abgedeckt.

GitHub Pages steht noch auf legacy/main/root. Der neue statische Build wird so
NICHT automatisch eingesetzt. Ein manuell startbarer, gepinnter Release-Workflow
ist vorbereitet; Standard publish=false. Pages-Modus und Produktion unveraendert.
Design-Release ohne eigenen Checkout ist moeglich, braucht aber ausdrueckliche
Abnahme und Umstellung des Auslieferungswegs. Kein neuer PR/Push/Deploy erfolgt.

Externer Link nach Neustart des aktualisierten Demo-Servers erneut HTTP 200:
https://diary-alpine-alliance-growing.trycloudflare.com/ . Aktuelle PID 48620,
Port 8170. Keine Garantie fuer dauerhafte Tunnel-Verfuegbarkeit.
Auch /en/search/ extern mit HTTP 200 bestaetigt. Der temporaere Build-Testserver
auf 8171 ist nach der Abnahme wieder beendet.

### Weiterhin echte Freigabepunkte

Stripe-Browsersteuerung meldet inzwischen browser.user unavailable. Die fruehere
CLI-Geraetefreigabe ist abgelaufen. Daher weiterhin KEINE echte Stripe-Testzahlung,
kein signierter echter Konto-Webhook, keine echte Mailzustellung. Nicht mit lokalen
Fake-Provider-Tests verwechseln. Benutzerdaten bleiben unberuehrt.
No.004-Masse, ungepruefte Paketdaten/Variantenbestaende, Backend-Host/Backup,
Mailprovider und rechtliche Bestellabnahme sind weiter offen. Keine Preise oder
Bestandszahlen dafuer erfinden. Die Morgen-Uebergabe soll diese Punkte priorisieren.
Heartbeat fuer die Morgen-Uebergabe auf den ersten Lauf ab 07:30 CET praezisiert
und bis 08:00 CET begrenzt. Danach Automation loeschen, auch bei weiter fehlender
Stripe-Freigabe; nicht stillschweigend ueber den vereinbarten Zeitraum hinaus arbeiten.

## In dieser Fortsetzung umgesetzt

- Laerche kompakt 1818046728: aktiv, stock:0, made_to_order, kein Rohholz auf
  Lager. DE/EN erklaeren Beschaffung und persoenliche Terminabstimmung vor einer
  verbindlichen Bestellung. Kein erfundener Fertigungstermin. Beide statischen
  Produktseiten aktualisiert, PreOrder statt InStock. Warenkorb verlangt Abstimmung.
- No.004 4370769708: bestaetigtes Produktgewicht 5,8 kg. Keine Ableitung eines
  verpackten Gewichts. Exakte Masse weiter offen. Alle drei zusaetzlichen
  Saftrillenvarianten kosten 15 EUR. Brettgravur 10 EUR, Kuechenhelfer 5,99 EUR.
- Originaler DE/EN-Katalog: sechs sichtbare Produktgruppen, Bauweise, Holzart,
  Saftrille vorhanden/optional, Preis, Verwendung, Sortierung, Trefferzahl, Reset.
  Gruppenwechsel ueber Buttons UND Select setzt Kontextfilter zurueck. Kuratierte
  Serviergruppe identisch zur Atelier-Kollektion. Technische Kategorien unveraendert.
- Vorbereitungszeiten in der bestehenden Produktansicht: 1-3 Werktage auch mit
  Gravur, zusaetzliche Saftrille 3-5 Werktage. Auftragsfertigung hat Vorrang vor der
  Standardangabe. Transportzeit separat, XXL weiter mit Vorab-Abstimmung.
- Zahlung und Vertragsannahme getrennt: signierter erfolgreicher Webhook setzt
  weiterhin nur bezahlt. Neue private order_reviews bleiben pending. Eine
  Eingangsmitteilung und eine Verkaeufer-Pruefaufgabe werden idempotent eingereiht.
  Erst eine authentifizierte ausdrueckliche Annahme erzeugt eine Annahmemitteilung.
  Ablehnung loest KEINE automatische Erstattung oder Annahme aus.
- Deutsche und englische Nachrichtenvorlagen vorhanden. Noch KEIN Mailprovider
  angeschlossen: dies ist eine persistente Outbox, kein Nachweis versandter E-Mails.
- Statischer Release-Kandidat ueber npm run build:site. 145 kanonische Seiten plus
  Hilfs-/Weiterleitungsseiten, 542 oeffentliche Dateien inklusive Manifest. Neues gemeinsames Design,
  reale Formularvertraege und Consent erhalten. Keine Vorschau-Sendesperre oder
  Demo-Checkout-Skripte im Kandidaten. Keine Backenddateien, Bestelldaten oder
  Secrets kopiert. Checkout bleibt deaktiviert; bisherige Etsy-Wege bleiben erhalten.
  Ausgabe ist ein Build-Artefakt ausserhalb des Checkouts, keine neue Projektkopie.
- Produktionslinks aus der Atelier-Startseite fuehren auf echte Produkt- und
  Inhalts-URLs statt auf shop-vorschau. Screenshot-Fertigungsfotos werden auch im
  Build aus den bereits technisch beschnittenen quadratischen WebPs geladen.
- Neue Header-Suche und /suche/ in der Vorschau erreichbar. Suchskript gegen
  doppeltes Initialisieren abgesichert. Hamburger bleibt rechts.

## Korrektur des bisherigen Such-Audits

Die 45 Eintraege in assets/search-pages.json sind die redaktionellen Inhalte.
Die Produktsuche liest Produkte bereits direkt aus products.json und verlinkt
einzelne Produktseiten. Das Fehlen von Produktseiten in search-pages.json war
also KEINE fehlende Produktsuchfunktion. Kein redundanter zweiter Index angelegt.
Die tatsaechlichen Luecken waren die neue Headeranbindung und die Vorschau-Route.
Mobiler Test: Walnuss liefert 15 Produkte und 5 Inhalte, ohne horizontalen Ueberlauf.

## Pruefungen

- Gesamte Node-Regression mit neuen Tests: bestanden (191 Tests).
- Anschliessend Export-Sicherheitspruefung hinzugefuegt: alle 14 Release-Tests
  bestanden, inklusive oeffentlicher Runtime-Daten und Schutz fremder Ausgabeverzeichnisse.
- Zehn Katalog-Browseransichten: DE/EN jeweils 375, 430, 768, 1024, 1440 px.
  Geprueft: Gruppenwechsel, versteckte Filter, Leerzustand, Reset, Trefferzahl,
  Tastaturfokus, keine JavaScript-Fehler und kein horizontaler Seitenueberlauf.
- Statischer Build ohne API-Backend: Start, Katalog, Firmengeschenke, Erbstueck,
  Produktseite und Suche bei 1440 px ohne JavaScript-Fehler oder Ueberlauf.
- Mobile Suche 375 px inklusive Headerformular bis zum Produktresultat geprueft.
- Statische lokale HTML-Assetverweise im Build: keine fehlenden Ziele. Oeffentliche
  Bewertungsdaten und Tresen-Modellkatalog explizit enthalten; private Shopkonfiguration
  und Vorschau-Sendesperre nicht exportiert. Standardausgabe unter dem temporaeren
  Verzeichnis edle-hoelzer-release; vorhandene fremde Ausgabeverzeichnisse abgelehnt.
- Indexierbarkeit: 166 HTML-Quellen, 145 indexierbare selbstkanonische URLs,
  145 Sitemap-URLs. git diff --check bestanden.
- Build-Pruefung erhaelt kanonische Metadaten, echte Formularfelder/required/action
  und Consent. Kein automatischer Deploy in CI hinzugefuegt, nur Build-Validierung.

## Stripe-Konto und sicherer naechster Schritt

Der Inhaber ist im internen Browser angemeldet. Konto war zuerst im Live-Modus;
auf deutlich gekennzeichneten Testmodus gewechselt. Keine Live-Aktion vorgenommen.
Offizielle Stripe-CLI installiert. Eine browserseitige Geraetefreigabe wurde zur
persoenlichen Bestaetigung geoeffnet, aber nicht durch uns akzeptiert. Der Code
ist inzwischen abgelaufen; lokale CLI deshalb NICHT authentifiziert.
Bei Rueckkehr des Inhabers neuen Code erzeugen, Freigaberechte gemeinsam pruefen
und ausschliesslich Testbetrieb verwenden. Keine API-Schluessel in Chat/Repository.

## Noch offen, in dieser Reihenfolge

1. Release-Kandidat vollstaendig bei Mobile/Tablet und allen 145 Seiten pruefen:
   lokale Assets, Fokus, Abschnitte, Formularlogik, Video/Zoom, Tresen/OpenCV.
   Rich No.004-Vorschau und statischer Produkt-Fallback sind noch nicht identisch;
   keine Gleichwertigkeit behaupten. Seriengeschichte im statischen Build erhalten.
2. Produktdaten-/Bestandsfreigabe, No.004-Masse und verpackte Masse/Gewichte fuer
   noch offene Versandfaelle. Rohgewicht 5,8 kg ist keine Paketfreigabe.
3. Gleichzeitige Website-Checkouts fuer knappe Bestaende brauchen Reservierungen
   vor Zahlung, Ablauf/Freigabe und Rennbedingungs-Tests. Die akzeptierte manuelle
   Etsy-Pflege ersetzt diese interne Absicherung nicht.
4. Transaktionalen Mailprovider waehlen, serverseitig konfigurieren, Outbox-Worker
   mit Idempotenz/Retry, Zustellnachweis und fehlender Empfaengeradresse testen.
   Verkaeufer-Benachrichtigung anbinden; keine WhatsApp-/Dashboardzustellung behaupten.
5. Vertragsannahme, Zahlungszeitpunkt, Rueckabwicklung und AGB/Widerrufs-/Liefertexte
   fachlich pruefen. Eingangsmitteilung und Annahme sind technisch getrennt, aber
   dies ersetzt keine rechtliche Freigabe des gesamten Bestellablaufs.
6. Echte Stripe-Testsession aus serverseitigem Warenkorb, Zahlung mit Testdaten,
   signierter Webhook, persistenter Bestand, Eingangsmitteilung und manuelle Annahme.
   Fehler, Abbruch, doppelte/verspaetete Events und manipulierte Preise testen.
7. Geschuetztes Backend-Hosting festlegen. GitHub Pages liefert statische Dateien;
   der private Node-/SQLite-Dienst kann dort nicht laufen. Keine Secrets im Frontend.
8. Erst nach Browser-/Sicherheitsabnahme PR erstellen und an Chat anhaengen.
   Kein Push auf main, keine Veroeffentlichung oder Live-Zahlung ohne Freigabe.

## Recherchegrundlage

- Stripe CLI: https://docs.stripe.com/cli/api_keys
  Browserbasierte Anmeldung und lokale Credential-Verwaltung statt Schluessel im Chat.
- Stripe Webhooks: https://docs.stripe.com/webhooks
  Signatur ueber unveraenderten Request-Body, wiederholte Events idempotent verarbeiten.
- https://docs.stripe.com/payments/place-a-hold-on-a-payment-method
  Autorisierung und Capture lassen sich trennen, gelten aber nur fuer geeignete
  Zahlarten und befristet. Deshalb NICHT pauschal manual capture aktiviert und nicht
  mit einer 3-4-woechigen Fertigungszeit verwechselt.

## Wiederaufnahme

Heartbeat edle-h-lzer-abschluss-fortsetzen aktiv, alle 30 Minuten bis zum vereinbarten
Morgen. Nutzungslimit zuletzt 98 Prozent verbraucht; Reset laut Konto 04:25 CET.
Nur bei verfuegbarem Kontingent arbeiten. Bei unveraenderten Blockaden ruhig bleiben.
Spaetestens 08:00 CET Uebergabe erstellen und diese zeitlich befristete Automation
loeschen. Aktueller Goal-Status wurde zwischenzeitlich als blocked gemeldet; trotzdem
sind unabhaengige Arbeiten moeglich. Nicht deshalb die ganze Website als blockiert
darstellen. Keine echte Stripe-Transaktion oder Mailzustellung ist bisher belegt.

Letzter lokaler Vorschau-Server: PID 38939 auf Port 8170. Externer bestehender
Tunnel diary-alpine-alliance-growing.trycloudflare.com zuletzt HTTP 200.
Der temporaere reine Build-Testserver auf Port 8171 ist beendet.
Stripe-CLI-Polling ist nach abgelaufenem Code beendet, kein haengender Login-Prozess.
