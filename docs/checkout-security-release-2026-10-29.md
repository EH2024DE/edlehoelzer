# Checkout: Sicherheits- und Betriebsstand

NEUER MASTER-AUFTRAG: shop-prelaunch-master-audit.md und shop-go-live-approval.md
haben Vorrang. Der Node-/SQLite-Dienst unten ist eine lokale Testbasis. Die neue
Direct-Shop-Zielruntime ist Cloudflare, nicht GitHub Pages. Alte Finanzwerte,
Produktfreigaben und Architekturplaene sind keine aktuelle Owner-Live-Freigabe.

Stand 29.10.2026. Implementierter Testbetrieb, keine Produktionsfreigabe.
Dieser Stand ersetzt widersprechende Architekturangaben in den historischen
Pilotnotizen vom 28.10. (insbesondere zu Reservierungen und Benachrichtigungen).

## Datenfluss und Preisautoritaet

Der Browser uebermittelt bekannte Produkt-/Variantenkennungen, Mengen und
Personalisierungsangaben. Der Server berechnet Positionen, Optionen und Versand
erneut in ganzzahligen Cent aus seinem eigenen Katalog. Beliebige Clientpreise
werden nicht uebernommen. Vor der Stripe-Session erfolgt dieselbe Validierung
unter einer atomaren SQLite-Transaktion mit aktuellem Bestand.

Kartendaten und Zahlungsadressen werden durch Stripe Checkout erhoben, nicht
durch das Website-Formular. Private Gravurtexte und hochgeladene Logos werden
nicht als Stripe-Produktbeschreibung weitergegeben. Logos sind nur ueber den
authentifizierten Verwaltungszugang abrufbar. Kunden-E-Mail-Adressen fuer die
Eingangsmitteilung liegen ausschliesslich in der privaten Datenbank, nicht in
Git, statischem Build, oeffentlicher Status-API oder Konsolenprotokollen.

Der lokale Node-Dienst akzeptiert nur demo/test, sk_test_-Schluessel und
Test-Webhook-Objekte. Er kann derzeit absichtlich keine Live-Zahlung abwickeln.
Zusaetzlich bleiben vier Freigaben geschlossen: globale Produktfreigabe,
Versandfreigabe, SHOP_TEST_APPROVED und die explizite checkoutListingIds-Liste.
Die Liste ist leer. Eine allgemeine Freigabe wuerde nicht das ganze Sortiment
versehentlich fuer Zahlungen oeffnen.

## Bestand und Wiederholungen

- BEGIN IMMEDIATE reserviert den physischen Bestand vor Session-Erstellung.
  Unterschiedliche Gravuren oder Saftrillen vervielfachen kein Einzelstueck.
  Holz-/Kantenvarianten teilen nur ihre tatsaechlich gemeinsame Kapazitaet.
- Wiederholte Requests nutzen denselben Warenkorb-Fingerprint und Stripe-
  Idempotenzschluessel. Die exakten serverseitigen Session-Parameter werden vor
  dem Netzaufruf gespeichert, um eine verlorene Antwort sicher zu rekonstruieren.
- Signierter, passender Zahlungserfolg verbraucht Bestand einmalig. Ein spaetes
  Fehler-/Ablaufereignis kann eine bezahlte Bestellung nicht zuruecksetzen.
- Ein lokaler Zeitablauf allein gibt unsicheren Bestand NICHT frei. Erst ein
  verifiziertes passendes Endereignis oder der serverseitige Stripe-Abgleich
  bestaetigt die Freigabe. Netzwerkfehler bleiben konservativ reserviert.
- Reconciliation ist vorbereitet: authentifiziertes POST /api/shop/reconcile
  startet einen begrenzten Abgleich, GET zeigt dessen Status. Ein kuenftiger
  Betriebsdienst muss dies regelmaessig ausloesen und Stoerungen ueberwachen.
- Unsichere Erstellungsversuche werden nicht ueber die sichere Idempotenzfrist
  hinaus erneut erzeugt (Sperre 22 Stunden nach der 35-Minuten-Sessionfrist).
  Ohne positiv gefundenen Remote-Status bleiben sie zur manuellen Pruefung
  reserviert. Eine leere Session-Suche beweist wegen paralleler Requests nicht,
  dass nie eine Zahlung moeglich war. Ein operativ sicherer Eskalations- und
  Freigabeprozess fuer diesen Ausnahmefall ist noch ein Zahlungsstart-Blocker.
  Solche Faelle werden dauerhaft mit einem neutralen Grundcode vermerkt. GET
  /api/shop/checkout-alerts ist nur mit dem privaten Admin-Token erreichbar und
  nennt Bestellkennung, Grund und Zeitpunkte, keine Kunden-/Providerdaten.
  Erst positive Verifikation loest den Alarm; der Alarm ist keine Freigabeaktion.
- Etsy-Abgleich bleibt wie beauftragt manuell. Es gibt keine kanalubergreifende
  Echtzeitreservierung. Der Verkaeufer-Task benennt deshalb explizit die Etsy-
  Bestandsanpassung und ist keine Versandfreigabe.

## Eingang, Zahlung und Annahme

Ein abgeschlossenes, aber noch unbezahltes asynchrones Checkout erzeugt eine
Eingangsmitteilung mit offenem Zahlungsstatus. Zahlungseingang wird getrennt
vermerkt. Weder Zahlung noch eine Stripe-Weiterleitung nehmen den Auftrag an.
Die manuelle, authentifizierte Entscheidung ist erst bei bezahlt moeglich.
Nur accepted reiht eine Annahmebestaetigung ein. rejected erstattet nicht
automatisch und gibt bezahlten Bestand nicht stillschweigend wieder frei.

DE/EN-Nachrichtenvorlagen und persistente Outbox sind vorhanden. Der vorbereitete
Transport-Worker ist standardmaessig deaktiviert. Er verlangt einen Provider
mit bestaetigter Idempotenz, least die Jobs atomar und wiederholt innerhalb des
Provider-Zeitfensters. Annahme-/Zahlungsupdates werden nicht vor ihrer
Eingangsmitteilung versendet. Unklare Zustellung eskaliert zur manuellen Pruefung.
Es wurde bisher KEINE echte E-Mail durch diesen Worker verschickt.

## Vor einem echten Stripe-Test erforderlich

1. Persoenliche Stripe-CLI-Geraetefreigabe erneuern; der alte Code ist abgelaufen.
   Ausschliesslich Testkonto, keine Schluessel in Chat oder Repository.
2. Dauerhaften privaten Datentraeger ausserhalb des Repositorys konfigurieren:
   SHOP_DATA_DIR mit 0700, SQLite mit 0600. Bestehende weltlesbare Verzeichnisse
   werden abgelehnt. Backup, Verschluesselung, Wiederherstellung und Loeschfristen
   sind Betriebsaufgaben und noch nicht nachgewiesen.
3. HTTPS-Backend, genaue erlaubte Frontend-Origin und starken SHOP_ADMIN_TOKEN
   konfigurieren. Reverse-Proxy-/Edge-Limits und Administration separat schuetzen.
   GitHub Pages kann diesen Node-/SQLite-Dienst nicht ausfuehren.
4. Verifizierten Testartikel explizit freigeben, Versanddaten und Bestandsbasis
   bestaetigen. Keine unbekannten Verpackungsgewichte aus Produktgewicht ableiten.
5. Test-Webhook konfigurieren und eine echte Testzahlung samt signiertem Event,
   Bestand, Abbruch, asynchronem Zahlungserfolg und manueller Annahme pruefen.
6. Mailprovider, Absender/Empfaenger und Datenschutz-/AVV-Konfiguration abstimmen.
   Erst danach Transport anbinden und Zustellnachweis inklusive Retry testen.
7. Kaufvertrag, Zahlungszeitpunkt, Widerruf, Ablehnung und Erstattung fachlich
   freigeben. Technisch getrennte Status ersetzen keine rechtliche Abnahme.

## Statische Website getrennt veroeffentlichen

Der aktuelle GitHub-Pages-Modus ist legacy, Quelle main im Repository-Root.
Er benutzt den neuen Build NICHT automatisch. Der vorbereitete Workflow
static-release.yml wird nur manuell gestartet, baut/testet ein oeffentliches
Artefakt und veroeffentlicht standardmaessig nicht. Fuer einen spaeter
ausdruecklich freigegebenen Design-Release muss Pages auf Actions umgestellt,
das github-pages-Environment geprueft und publish=true auf main ausgefuehrt
werden. Diese Einstellungen wurden NICHT geaendert.

Build: npm run build:site. Anschliessend scripts/check-release.mjs mit dem
ausgegebenen Artefaktpfad ausfuehren. Der Export enthaelt keine Backenddateien,
Bestelldaten, private Konfiguration oder Checkout-Aktivierung. Er haelt die
bisherigen Etsy-Kaufwege aufrecht. Design-Release und eigener Shop sind daher
zwei getrennte Freigaben und koennen getrennt abgenommen werden.

## Nachweisgrenze

Automatisierte Tests verwenden Fake-Stripe, offizielle Signaturpruefung mit
lokalen Testschluesseln und abgefangene Mailtransporte. Sie beweisen die lokalen
Invarianten, aber noch keine echte Stripe-Transaktion, Providerzustellung,
Host-Sicherheit, rechtliche Konformitaet oder Live-Betriebsfaehigkeit.
