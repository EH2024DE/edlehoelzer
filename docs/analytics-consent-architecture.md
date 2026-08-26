# Analytics and Consent Architecture

Stand: 2026-08-26

## Ziel

Die Website soll schon vor einem eigenen Shop saubere Intent-Signale sammeln, ohne Statistik-, Marketing- oder externe Medien-Skripte vor Zustimmung oder einer ausdrücklichen Nutzeranforderung zu laden. Die aktuelle Umsetzung ist bewusst schlank gehalten und kann später um GA4, Meta, Pinterest oder einen eigenen Shop-Checkout erweitert werden.

## Zentrale Dateien

- `/assets/js/consent-manager.js`
- `/main.js`
- `/styles.css`
- `/datenschutz.html`

Alle HTML-Seiten laden nur noch den zentralen Consent Manager. Umami, GoatCounter und externe Medien werden nicht mehr direkt im HTML initialisiert.

## Consent-Kategorien

### Notwendig

Immer aktiv. Umfasst Navigation, Produktvergleich, lokale UI-Zustände, Consent-Speicherung und ausdrücklich angeforderte Kontaktlinks.

### Statistik

Aktiviert nach Zustimmung:

- Umami
- GoatCounter
- normalisierte Intent-Events über `window.EdleAnalytics.track(...)`

Aktuell nicht aktiv, aber vorbereitet:

- Google Consent Mode
- GA4 über `GA4_MEASUREMENT_ID` in `/assets/js/consent-manager.js`

### Marketing / Externe Medien

Aktiviert nach Zustimmung:

- YouTube-/YouTube-nocookie-Embeds

Spätere Erweiterungen können hier liegen:

- Pinterest Tag
- Meta Pixel / Conversion API
- Google Ads Remarketing

## Intent-Tracking

Tracking läuft zentral über:

```js
window.EdleAnalytics.track("event_name", {
  page_type: "product_grid",
  product_id: "example",
  source_page: "produkte"
});
```

Der Consent Manager filtert Event-Payloads über eine Allowlist. Freitexte, Produktnamen, Nachrichtentexte oder freie Formularangaben werden nicht übertragen.

Erlaubte Felder:

- `page`
- `page_type`
- `language`
- `cta_location`
- `source`
- `source_page`
- `position`
- `product_id`
- `product_category`
- `wood`
- `wood_type`
- `service`
- `host`
- `label`

## Aktuelle Intent-Signale

Die bestehende Conversion-Logik in `/main.js` leitet Ereignisse nun an `EdleAnalytics` weiter. Damit bleiben vorhandene Etsy-, Produkt-, Vergleichs-, Pflege- und Kontakt-Events nutzbar, werden aber erst nach Statistik-Zustimmung gesendet.

Zu den erfassten Intent-Signalen gehört außerdem `preferred_source_click`. Das Ereignis wird nur bei Statistik-Zustimmung übertragen und enthält ausschließlich Seite, Quelle und CTA-Position.

## Externe Medien

YouTube-Embeds werden mit `data-consent-src` statt `src` hinterlegt. Vor Zustimmung erscheint ein lokaler Platzhalter. Nach Zustimmung zur Kategorie Marketing / Externe Medien setzt der Consent Manager die echte `src`.

## Google Preferred Sources

Relevante redaktionelle Seiten erhalten am Seitenende einen lokalen Hinweis auf Googles Funktion „Preferred Sources“. Die offizielle Google-Bibliothek wird nicht beim Seitenaufruf geladen, sondern erst nach einem bewussten Klick auf die Schaltfläche. Falls die Bibliothek nicht geladen werden kann, führt der vorhandene Link direkt zur offiziellen Google-Auswahlseite für `edlehoelzer.de`.

Damit entsteht ohne Interaktion keine zusätzliche Verbindung zu Google. Der Klick gilt als ausdrückliche Anforderung dieser externen Funktion und wird in der Datenschutzerklärung transparent erläutert.

## Datenschutz und offene Prüfung

`/datenschutz.html` beschreibt die aktuelle technische Umsetzung. Die Formulierungen sollten vor Veröffentlichung rechtlich geprüft werden, insbesondere:

- genaue Rechtsgrundlage pro Dienst,
- TDDDG-Einordnung,
- spätere GA4-/Meta-/Pinterest-Einbindung,
- Tracking in einem eigenen Shop,
- mögliche Auftragsverarbeitungsverträge.

## Spätere Shop-Erweiterung

Für einen eigenen Shop sollten zusätzliche Events ergänzt werden:

- `view_item`
- `select_item`
- `add_to_cart`
- `begin_checkout`
- `purchase`
- `service_request_start`
- `service_request_submit`

Auch diese Events sollten nur strukturierte IDs, Kategorien, Preise und Statuswerte enthalten, keine Freitexte.

## Bewusste Grenzen dieser Version

- GA4 ist vorbereitet, aber ohne Measurement-ID nicht aktiv.
- Keine Marketing-Pixel sind aktiv.
- Google Fonts werden weiterhin per CSS importiert. Für eine noch strengere externe-Ressourcen-Strategie sollten die Schriften später lokal gehostet werden.
- Die Datenschutzerklärung ist eine technische Arbeitsfassung und ersetzt keine Rechtsberatung.
