# Edle Hoelzer Direct Shop: Master-Audit

Stand: 29.10.2026. Status: **NOT READY**.
Arbeitsbranch: `codex/cloudflare-stripe-shop`.
Dieser Auftrag ersetzt die fruehere GitHub-Pages-Zielarchitektur fuer den Direct Shop.
Bestehende uncommittete Website-Arbeiten wurden ohne Kopie oder Reset uebernommen.

## 1. Authentication Preflight

| System | Zugriff vorhanden | Modus | Fehlende Rechte / Nachweise | Aktion |
|---|---|---|---|---|
| GitHub | Ja, frisch per API verifiziert; Cloudflare zeigt Repository zur Auswahl | Repository EH2024DE/edlehoelzer | Effektiver App-Scope nicht vollstaendig angezeigt; kein Buildprojekt angelegt | pull/push/admin/maintain vorhanden; neuer Arbeitsbranch erstellt |
| Cloudflare | Ja, authentifiziertes Dashboard und Workeruebersicht gelesen | Bestehendes Konto, noch keine Shop-Stagingumgebung | Schreibrechte, Git-Verbindung, Secret-Bindings, Storage und Logs noch nicht durch Testdeployment nachgewiesen; keine Zone vorhanden | Bestehende Projekte unveraendert lassen; separate Staging-Ressourcen vorbereiten |
| Stripe Test | Ja, frischer Dashboardtab, offizieller Kontextaufruf und erfolgreicher GET auf Testprodukte | `livemode=false`, Sandbox; API 2026-08-26.dahlia | Server-Secrets/CLI-Freigabe und echter Staging-Checkout/Webhook noch nicht eingerichtet | Testproduktliste leer; nur lesend verifiziert, keine Schluessel aufdecken/kopieren |
| Stripe Live | Nicht verwendet | Gesperrt | Jegliche Live-Konfiguration benoetigt separate Freigabe | Nicht umschalten, nicht pruefweise schreiben |
| IONOS | Ja, authentifizierte Domain- und DNS-Verwaltung gelesen | Nur lesend | Kein Provider-Zonenexport heruntergeladen; vor Umschaltung frisch abgleichen | Sichtbare 18 Records inkl. TTL/MX-Prioritaet/DKIM/Verifikationen dokumentiert |

Browserzugriff auf den alten Stripe-Tab war fehlerhaft. Ein neuer Tab im selben
internen Browser funktioniert; das ist kein fehlender Stripe-Login mehr.
Keine API-Tokens, Secrets oder Passwoerter gelesen, gespeichert oder angefordert.
IONOS ist jetzt erreichbar; aktive Delegation bleibt unveraendert. Cloudflares
Connect-GitHub-Schaltflaeche oeffnete zunaechst keinen Folgedialog. Nach manueller
Nutzerinteraktion zeigt ein frischer Tab die Verbindung EH2024DE und das Repository
edlehoelzer. Repo ausgewaehlt und Konfigurationsseite gelesen; Deploy NICHT geklickt.
Keine neue GitHub-App-Berechtigung durch den Agenten bestaetigt.

Cloudflare-Konfigurationsdialog: Der automatische Build-Token fordert unter
anderem Schreibrechte fuer Workers, KV, R2, D1, Vectorize, Queues, Container
und Workers Routes fuer alle Zonen. Das ist fuer die statische Staginggrundlage
zu weitreichend. Kein Token erzeugt und Deploy nicht angeklickt. Naechster
Zugriffsschritt: eingeschraenkte Berechtigung separat vorbereiten und vor
Erteilung bestaetigen lassen; keine DNS-/Routenrechte fuer Staging benoetigt.
Offizielle Rollen-/Scope-Dokumentation:
https://developers.cloudflare.com/workers/authorization/workers/

Arbeitsstand gesichert in Draft-PR https://github.com/EH2024DE/edlehoelzer/pull/199
(kein Merge). Lokale Gesamtsuite nach Commit-Vorbereitung: 218 Tests bestanden;
lokale Loopback-Testserver benoetigen Sandbox-Freigabe. Cloudflare-Dry-Run auch
nach Commit bestanden. GitHub-Cloudflare-Validierung erfolgreich; allgemeine
Website-CI bei diesem Zwischenstand noch laufend. Der alte manuelle Pages-
Deployjob wurde aus dem neuen Kandidatenworkflow entfernt; Altbetrieb bleibt
unveraendert.

## 2. Bestehender technischer Stand

### Neu: lokale Cloudflare-Staginggrundlage

tools/cloudflare-shop enthaelt einen gepinnten Wrangler 4.155.0 und einen
Worker-Fetch-Handler fuer die bestehende statische Website. Lokaler echter
Workers-Runtime-Start und Browserpruefung bei 375/1440 px bestanden: CSP mit
Request-Nonce, Galerie/Video, noindex, blockierte echte Kauf-/Formularwege.
Node-Tests und lokaler Wrangler-Dry-Run ebenfalls bestanden. Noch kein Remote-
Deployment und noch KEIN portiertes Shop-Backend. /api/shop/health meldet
ausdruecklich NOT READY/static-preview/checkoutEnabled=false; andere Shop-APIs
bleiben 503. Es existieren keine Stripe-, Datenbank- oder Mail-Bindings im Worker.

Standardumgebung deaktiviert, nur explizites staging wird lokal bedient. Keine
Domainroute, keine Live-Secrets, keine Produktionsdomain-Auslieferung. Der Worker
blockiert edlehoelzer.de und dessen Subdomains zusaetzlich. Nicht mit CF Access
gleichsetzen: Zugriffsschutz fuer eine spaetere oeffentliche Preview ist separat
zu konfigurieren. Alle Requests laufen fuer die Staging-Sicherheitsheader durch
den Worker und zaehlen deshalb gegen dessen Kontingent; kein Tarifwechsel erfolgt.

Zwei Exportgrenzen ergaenzt: Auch nach Commit sind Prototype-HTML-Pfade vom
Release ausgeschlossen; unbekannte Zusatzdateien und Symlinks blockieren den
Upload statt ausserhalb des Manifests ungeprueft mit hochgeladen zu werden.
Die neue GitHub-Action validiert nur lokal und hat keinerlei Deployschritt.

### Weiterhin bestehende lokale Testbasis

- Website: statisches HTML/CSS/Vanilla JS, kein Frameworkwechsel erforderlich.
- Lokaler Testshop: Node 24, SQLite, offizielles Stripe SDK. Noch KEIN Cloudflare-Backend.
- Bereits lokal getestet: serverseitige Cent-Preise, Varianten, signierte Webhooks,
  atomare Reservierungen, Idempotenz, private Outbox und getrennte manuelle Annahme.
- Fruehere lokale Gesamtsuite: 213 Tests bestanden. 435 technische Seitenansichten,
  gesonderte Formular-/Galerie-/Tresen-/Suchtests und 1.356 Konfigurationsfaelle.
- Diese Nachweise gelten fuer den lokalen Dienst, NICHT fuer eine Cloudflare-Portierung.
- Kein echter Stripe-Sandboxcheckout mit Kontowebhook und echter Mailzustellung belegt.
- Kein Cloudflare-Shopdeployment, keine neue produktive Domainroute.
- Die bestehende globale Zahlungsfreigabe ist aus; per-Produkt-Freigabeliste leer.

## 3. Architekturentscheidung: Arbeitsvorschlag

Bevorzugt: **Workers mit Static Assets**, ohne Frameworkmigration.
GitHub bleibt Source of Truth; GitHub Pages ist nur der unveraenderte Altbetrieb
bis zur ausdruecklich freigegebenen Migration, nicht das Direct-Shop-Ziel.

| Variante | Bewertung fuer dieses Repository |
|---|---|
| Workers + Static Assets | Bevorzugt: bestehendes HTML exportieren, gezielte Fetch-API, gemeinsame Secrets/Bindings und Hintergrundaufgaben |
| Pages + Functions | Moeglich, aber fuer neue Shop-State-/Alarm-/Queue-Logik weniger einheitlich; kein Nutzen durch Frameworkwechsel |
| KV allein fuer Bestand | Nicht geeignet als alleiniger atomarer Reservierungskoordinator |
| D1 | Geeignet fuer relationale Daten; bedingte Mehrpositionsreservierung muss transaktional entworfen und unter Rennen getestet werden |
| SQLite-backed Durable Object | Bevorzugter MVP-Kandidat fuer einen einzigen Inventory-/Order-Koordinator pro Umgebung; atomare Mehrpositionsreservierung ohne verteilte SKU-Transaktionen |

Ein zentraler Koordinator passt zum derzeit kleinen Sortiment und Bestellvolumen.
Er vermeidet parallele D1-/DO-Wahrheiten. D1 zusaetzlich nur bei begruendetem Bedarf,
nicht als zweite autoritative Bestandsquelle. Konkrete Bindings, EU-Datenlokation,
Kontotarif, Limits und Betriebskosten vor Provisionierung pruefen; kein Upgrade buchen.

Das vorhandene `node:sqlite`/Dateisystem-/HTTP-Backend kann nicht als unveraenderter
Node-Daemon auf Workers gestartet werden. Portiert werden muessen insbesondere:

1. HTTP-Server auf Worker-Fetch-Handler und explizite Asset-/API-Routen.
2. SQLite-Datei auf dauerhaftes transaktionales Cloudflare-State-Binding.
3. Katalogaufbereitung aus fs/vm/git ins Build; Runtime verwendet ein serverseitiges Artefakt.
4. Logo-Verarbeitung mit nativer Sharp-Abhaengigkeit: gesondert evaluieren; keine
   privaten Logos ohne Datenschutzfreigabe an weitere Bilddienste uebermitteln.
5. Outbox-/Reconciliation-Timer auf passende Alarms/Queues/Scheduled-Handler.
6. Tests in echtem Workers-Runtime/Staging, nicht nur unter Node.

### Umgebungen

- Staging: eigene Bindings, ausschließlich Stripe Test, Testdaten, keine Produktivdomain.
- Production: getrennte Ressourcen/Secrets, bis zur vollstaendigen Freigabe deaktiviert.
- Keine Secrets in Build-Artefakten, GitHub-Frontend, Logs oder Screenshots.
- Preview-Deployment darf nicht automatisch `main` oder die bestehende Domain ersetzen.
- GitHub-App/OAuth-Rechte nur fuer dieses Repository und minimal erforderlichen Scope.
  Eine neue sicherheitsrelevante Berechtigung wird am konkreten Freigabeschritt vorgelegt.

## 4. DNS und Mail: Nur lesender Snapshot

Oeffentlich abgefragt und danach in IONOS abgeglichen am 29.10.2026.
Alle 18 sichtbaren Records: `dns-before-cloudflare-2026-10-29.md`.
Dies ist KEIN heruntergeladener Provider-Zonenexport.

| Record | Aktuell beobachtet |
|---|---|
| NS | ns1039.ui-dns.de; ns1082.ui-dns.biz; ns1019.ui-dns.org; ns1108.ui-dns.com |
| Apex A, TTL 3600 | 185.199.108.153; 185.199.109.153; 185.199.110.153; 185.199.111.153 |
| Apex AAAA | Keine Antwort in dieser Abfrage; kein Beweis fuer saemtliche Subdomains |
| www CNAME, TTL 3600 | eh2024de.github.io |
| MX, TTL 3600 | Prioritaet 10: mx00.ionos.de und mx01.ionos.de |
| SPF TXT | v=spf1 include:_spf-eu.ionos.com ~all |
| DMARC | _dmarc CNAME dmarc.ionos.de; aufgeloeste Policy p=none |
| Weitere TXT | Zwei Google-Site-Verifikationen vorhanden; exakte Werte im vollstaendigen Export sichern |
| DKIM | s1-ionos, s2-ionos und s42582890._domainkey, alle als IONOS-CNAME, gesichert |
| autodiscover | adsredir.ionos.info, TTL 3600, gesichert |
| Auffaellige NS-Records | braelyn.ns.cloudflare.com.edlehoelzer.de und yichun.ns.cloudflare.com.edlehoelzer.de zeigen auf edlehoelzer.de; keine aktive Cloudflare-Delegation, nichts veraendert |
| Pages | legacy, main, /; cname edlehoelzer.de; HTTPS enforced; status built |

Vor Umschaltung: IONOS-Export inklusive versteckter/weiterer Records sichern,
Cloudflare-Zone dagegen vollstaendig vergleichen, Mailrecords DNS-only erhalten,
HTTPS und Zieldeployment pruefen. Keine produktive A/CNAME/NS-Aenderung vorgenommen.

Rollback-Entwurf: bisherigen Pages-CNAME und Quellstand erhalten; dokumentierte
NS/A/CNAME zuruecksetzen, falls genau diese freigegeben geaendert wurden. Mail-
Records unveraendert lassen. DNS-Caches/TTL bedeuten, dass ein Rollback nicht
sofort weltweit sichtbar ist. Exakten Deployment-Commit und vorherigen Zonenexport
vorher festhalten. **OWNER APPROVAL REQUIRED – PRODUCTION DNS**.

## 5. Produkt-/Finanzfreigaben

Alle bisherigen Preview-/Etsy-Preise, Versandwerte, Steuerhinweise, Rabatte,
Lieferzeiten und Bestellannahme-Einstellungen sind nach diesem Master-Auftrag
nur Referenzwerte. Kein Wert wird dadurch erneut fuer Live bestaetigt.
Vollstaendige Vorlage: `shop-go-live-approval.md`.

Nur explizit freigegebene `direct_buy`-Produkte erhalten spaeter Live-Checkout.
Made-to-order erfordert eindeutig bestaetigten Preis, Umfang und Lieferzeit;
sonst Anfrage. Verkaufte Stuecke bleiben Inspiration, nicht bestellbar.
MVP-Kandidaten: Balsam und drei Kuechenhelfer; keine automatische Freigabe des
gesamten Portfolios. No.004-Abmessungen und Laerchenbeschaffung bleiben offen.

Produktzustand, Zahlungszustand und Vertragsannahme getrennt modellieren.
Ein bezahltes, noch nicht angenommenes Stueck ist nicht wieder verfuegbar.
Refund oder Widerruf darf keine automatische Bestandsfreigabe erzwingen.
Die vorhandene Test-Reservierungsfrist von 35 Minuten ist KEIN produktiv
genehmigter Wert; produktive TTL benoetigt ausdrueckliche Owner-Freigabe.

Zahlung schliesst Vertrag versus separate Annahme: lokale Preview verwendet
Letzteres, aber das ersetzt nach diesem Auftrag keine aktuelle Geschaefts-/Legal-
Freigabe. Zahlungsarten derzeit nicht pro Methode live bestaetigt. Der bisherige
Session-Builder legt keine explizite Methoden-Allowlist fest: vor Testdeployment
auf genehmigten Testumfang begrenzen; nichts im Live-Dashboard aktivieren.

## 6. Prioritaeten

| Prio | Bereich | Befund / Abnahmekriterium |
|---|---|---|
| P0 | Zugang | GitHub-App-Anbindung, Cloudflare-/Stripe-Runtimezugang und frischen DNS-Migrationsabgleich vervollstaendigen |
| P0 | Runtime | Worker-Portierung, isolierte Bindings, keine Node-Datei als vermeintlich dauerhaften Store verwenden |
| P0 | Secrets | Environmenttrennung und sichere Provisionierung; kein Secret im Chat/Repo/Build |
| P0 | Checkout | Serverpreis-/Status-/Versand-/Landvalidierung im Worker, Hosted Checkout, expliziter Testmodus |
| P0 | Webhooks | Raw-body-Signatur, Idempotenz, asynchrone/duplizierte/vertauschte Events, Refund-Ereignisse evaluieren |
| P0 | Inventory | Atomare Mehrpositionsreservierung; TTL-Freigabe; unbekannte Stripe-Erstellung fail-closed und operativer Eskalationsweg |
| P0 | Preise/Steuer/Versand | Aktuelle separate Owner-Matrix je Produkt/Variante; keine Altwerte als Live-Freigabe |
| P0 | Lieferzeit | Vor Vertragsschluss verbindlicher Ablauf, Made-to-order/Gravur/Saftrille getrennt |
| P0 | Vertragsmodell | Owner + Legal entscheiden; keine stillschweigende Annahme durch Code |
| P0 | Widerruf | Belehrung/Muster und elektronische Funktion fehlen im Direct-Shop-Flow; zweistufige Erklaerung, serverseitiger Eingang und dauerhafte Bestaetigung ohne Begruendungspflicht |
| P0 | Personalisierung | Keine pauschale Ausnahme fuer jede Option; Standardoption/Gravur/Wunschmass einzeln rechtlich klassifizieren |
| P0 | AGB | Freigegebene Texte und technisch erreichbare Links/Versionierung fehlen |
| P0 | GPSR | Hersteller/Postanschrift/E-Mail/Produktkennung/Bild/ggf. Sicherheitsinformationen sichtbar je kaufbarem Angebot abnehmen |
| P0 | Datenschutz | Cloudflare/Stripe/Mail/Logs/Uploads/Loeschfristen/AVV/Datenregion fachlich pruefen |
| P0 | EU-Hinweis | Originalasset lokal vollstaendig sichtbar; im neuen Worker-Checkout vor Vertrag erneut pruefen |
| P0 | LUCID | Registrierung, Systembeteiligung und Versandverpackung noch nicht aktuell bestaetigt |
| P0 | E-Mail | Kein Provider angeschlossen; Eingang/Annahme/Versand/Widerruf mit Zustell-/Retry-Nachweisen abnehmen |
| P0 | Domain/Rollback | Vollstaendiger Snapshot und explizite DNS-/Produktionsfreigabe fehlen |
| P0 | Live Stripe | Separate Live-Konfigurationsfreigabe und spaeter gesonderte Freigabe einer echten Testzahlung |
| P1 | Security | CSP/Rate Limits/Adminschutz/Headers in Staging pruefen; kein blanket script-src; keine aggressive Live-Aenderung |
| P1 | UX | Kurze H1, kaufrelevante Angaben 16-18px statt Kleingedrucktem; neue Typografie-Richtwerte gegen bisher sehr kleine Texte pruefen |
| P1 | Success | Nur verifizierten Status, Bestellnummer/naechsten Schritt/Support zeigen; kein Fulfillment durch Return |
| P1 | Observability | Neutrale IDs, Alarm bei Stock-/Webhook-/Mailproblemen, keine PII/Secrets im Logging |
| P2 | Analytics | Nur consent-konforme Ereignisse ohne PII; keine Suchtexte/Gravuren/Adressen senden |
| P2 | Betrieb | Freigegebenen Start 24-72h beobachten; keine eigenmaechtigen Preis-/UX-Experimente |
| P3 | Zusaetze | Kein Kundenkonto, Wishlist, Gutschein-, Treue- oder Empfehlungssystem fuer MVP |

## 7. Rechtlicher Technikabgleich

Die aktuelle deutsche Norm beschreibt eine zugaengliche elektronische
Widerrufsfunktion, Identifikation des Verbrauchers/Vertrags und einen gesonderten
Bestaetigungsschritt. Die Empfangsbestaetigung muss Inhalt sowie Datum/Uhrzeit
enthalten. Technisch werden dafuer kein Konto und kein Pflichtgrund vorausgesetzt.
Reichweite, Texte und konkrete Umsetzung bleiben **LEGAL REVIEW REQUIRED**.
Dies ist keine finale Rechtsberatung und keine Freigabe vorhandener Rechtstexte.

### Konkrete Quellbefunde

- Der vorhandene Session-Builder in tools/shop-server/catalog.mjs verwendet
  Hosted Checkout und `allowed_countries: ['DE']`, aber keine explizite
  payment_method_types-Allowlist. Dashboard-Voreinstellungen duerfen daher
  nicht als bestaetigter Methoden-Scope behandelt werden.
- Derselbe Builder enthaelt bisher einen fest formulierten Steuerhinweis.
  Das bleibt nach dem neuen Master-Auftrag eine nicht erneut freigegebene
  Preview-Annahme und muss vor Live durch die neue Matrix gedeckt sein.
- In den geprueften Produkt-/Shop-Templates wurde kein zentraler sichtbarer
  Hersteller-/GPSR-Block gefunden. Ein Impressumslink allein ist kein technischer
  Nachweis vollstaendiger Angebotsinformationen. Pro MVP-Produkt konkret abnehmen.
- Keine dedizierte Widerrufs-/AGB-Datei oder elektronische Widerrufsabwicklung
  im bestehenden Direct-Shop-Code gefunden. Diese P0-Punkte sind nicht bereits
  durch die vorhandenen Preis-/Signaturtests abgedeckt.
- Bestehender Node-Dienst unterstuetzt nur demo/test. Die aktuelle Testsuite
  beweist daher weder Live-Betrieb noch Cloudflare-Kompatibilitaet.

Dokumentpruefung: Preisvorlage deckt alle Listing-IDs des kanonischen Katalogs
ab, keine Owner-Checkbox gesetzt; DNS-Snapshot enthaelt 18 Records;
git diff --check ohne Fehler. In diesem Preflight keine Shop-Implementierung
oder Finanz-/Live-Konfiguration geaendert.

## 8. Quellen, am 29.10.2026 geprueft

- [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Workers versus Pages / Migration](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)
- [SQLite-backed Durable Objects](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/)
- [D1 Limits und Ausfuehrungsmodell](https://developers.cloudflare.com/d1/platform/limits/)
- [Aktuelle Node-Kompatibilitaet](https://developers.cloudflare.com/workers/runtime-apis/nodejs/)
- [Workers Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Build branches](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/)
- [Stripe Webhooks](https://docs.stripe.com/webhooks)
- [BGB 356a: elektronische Widerrufsfunktion](https://www.gesetze-im-internet.de/bgb/__356a.html)
- [EU-Richtlinie 2023/2673, Art. 11a / Anwendung](https://eur-lex.europa.eu/eli/dir/2023/2673/oj/eng)

Keine kostenpflichtige Ressource gebucht, kein bestehendes Cloudflare-Projekt
geaendert, keine neue Live-/DNS-Konfiguration vorgenommen. Naechster Schritt:
Zugangspreflight vervollstaendigen, dann isolierte Staging-Implementierung.
