# DNS-Snapshot vor Cloudflare-Migration

29.10.2026, ausschliesslich lesend aus der authentifizierten IONOS-DNS-Oberflaeche.
Keine Records gespeichert, geloescht, hinzugefuegt oder zurueckgesetzt.
Dies ist die vollstaendige sichtbare Liste von 18 Records, kein heruntergeladener
Provider-Zonenexport. Vor einer spaeteren Umschaltung nochmals aktuell abgleichen.
Keine Bestell-, Konto-, Vertrags- oder Zugangsdaten sind Teil dieses Snapshots.

## Aktive Delegation

Oeffentliche NS-Abfrage liefert IONOS, nicht Cloudflare:

- ns1039.ui-dns.de
- ns1082.ui-dns.biz
- ns1019.ui-dns.org
- ns1108.ui-dns.com

Registrar-/Vertragsverwaltung wurde bei IONOS fuer edlehoelzer.de bestaetigt.
GitHub Pages: legacy, main, Root /, cname edlehoelzer.de, HTTPS enforced, built.

## Bestehende Records

Alle unten erfassten Records haben laut IONOS-Oberflaeche TTL **3600 Sekunden**.
Hostnamen mit abschliessendem Punkt sind hier als vollqualifizierte Namen notiert.
MX-Prioritaet jeweils 10. TXT-Werte sind oeffentlich ausgelieferte DNS-Werte,
keine API-Secrets.

| Typ | Name | Wert | Prioritaet |
|---|---|---|---:|
| CNAME | _domainconnect.edlehoelzer.de. | _domainconnect.ionos.com. | - |
| TXT | edlehoelzer.de. | google-site-verification=Yh0utmNoq_Oq8XJbqVnvLlkur1m_Ddumck4lrMsrA_w | - |
| MX | edlehoelzer.de. | mx00.ionos.de. | 10 |
| MX | edlehoelzer.de. | mx01.ionos.de. | 10 |
| TXT | edlehoelzer.de. | v=spf1 include:_spf-eu.ionos.com ~all | - |
| CNAME | _dmarc.edlehoelzer.de. | dmarc.ionos.de. | - |
| CNAME | s1-ionos._domainkey.edlehoelzer.de. | s1.dkim.ionos.com. | - |
| CNAME | s2-ionos._domainkey.edlehoelzer.de. | s2.dkim.ionos.com. | - |
| CNAME | s42582890._domainkey.edlehoelzer.de. | s42582890.dkim.ionos.com. | - |
| CNAME | autodiscover.edlehoelzer.de. | adsredir.ionos.info. | - |
| A | edlehoelzer.de. | 185.199.108.153 | - |
| A | edlehoelzer.de. | 185.199.109.153 | - |
| A | edlehoelzer.de. | 185.199.110.153 | - |
| A | edlehoelzer.de. | 185.199.111.153 | - |
| TXT | edlehoelzer.de. | google-site-verification=laGFTnH3GgbOyyWiny9Fsi0uWr22JVsuHn0bVfB8WKM | - |
| NS | braelyn.ns.cloudflare.com.edlehoelzer.de. | edlehoelzer.de. | - |
| NS | yichun.ns.cloudflare.com.edlehoelzer.de. | edlehoelzer.de. | - |
| CNAME | www.edlehoelzer.de. | eh2024de.github.io. | - |

Keine AAAA-Records in dieser sichtbaren Liste; die Apex-AAAA-Abfrage lieferte
ebenfalls keine Antwort. Das ersetzt keine Pruefung zukuenftiger Aenderungen.

## Auffaelligkeit vor Migration klaeren

Die beiden NS-Records sind keine aktive Cloudflare-Delegation. Die read-only
Bearbeitungsansicht zeigt fuer den ersten Eintrag ausdruecklich den Ownernamen
braelyn.ns.cloudflare.com.edlehoelzer.de und das Ziel edlehoelzer.de; danach wurde
mit Abbrechen verlassen. Auch die Listenansicht bestaetigt den vollstaendigen
Ownernamen des zweiten Records. Die Konfiguration wirkt wie eine vertauschte
fruehere Nameserver-Einrichtung, aber Herkunft und Absicht sind nicht belegt.

Keine eigenmaechtige Reparatur oder Loeschung. Vor Migration beurteilen und die
spaeter von der tatsaechlichen Cloudflare-Zone zugewiesenen Nameserver verwenden;
nicht diese alten Namen als gueltige neue Delegation uebernehmen.

## Mail-Schutz und Rollback

MX, SPF, drei DKIM-CNAMEs, DMARC, autodiscover und Domain-Verifikationen erhalten.
Mailbezogene Records nicht unbesehen proxyen. Cloudflare-Neuzone vor Delegation
mit dieser Liste und einem frischen IONOS-Abgleich vergleichen. Bestehende
Domain-Connect-/Servicebeziehungen nicht automatisch abschalten.

Vor produktiven Aenderungen: Zieldeployment/Commit, neue Records, HTTPS/www,
Zeitpunkt, TTL und Rueckweg dokumentieren. Bei freigegebenem Rollback nur die
tatsaechlich geaenderten NS/A/CNAME-Werte zuruecksetzen; Mail nicht veraendern.
GitHub-Pages-Domain bis zum genehmigten Ablauf erhalten. DNS-Caches koennen die
Sichtbarkeit eines Rollbacks verzoegern.

**OWNER APPROVAL REQUIRED – PRODUCTION DNS**.
