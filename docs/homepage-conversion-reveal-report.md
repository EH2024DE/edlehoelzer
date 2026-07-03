# Homepage Conversion Reveal Report

## Live-Audit Basis

- Datum: 2026-07-02
- Seiten: `/`, `/en/`, `/produkte.html`, `/en/products.html`
- Ziel: Startseiten klarer in Produktfinder, Produktansicht, Etsy-Checkout und Anfragepfade führen.

## Abschnittsentscheidungen

| Abschnitt | Aktion | Grund | Conversion-Rolle |
|---|---|---|---|
| Hero DE/EN | gekürzt und neu priorisiert | H1 und Subline führen jetzt direkt zum Nutzungsmoment und zur Handlung | Produktfinder und Produktübersicht |
| Reviews/Etsy-Bewertungen | behalten, kompakt mit Reveal | Früher Trust bleibt wichtig | Social Proof |
| Moment Cards | gekürzt | Fünf Einstiege reichen; Pflege bleibt im Footer und Service-Kontext | schneller Intent-Pfad |
| Product Finder Block | neu ergänzt | Hauptpfad muss früher und expliziter sichtbar sein | Beratung/Produktwahl |
| Lead Block | neu ergänzt | Maßanfertigung, B2B und Erbstück dürfen nicht unten verschwinden | qualifizierte Anfrage |
| Etsy Trust | neu ergänzt | Website erklärt Produkt, Etsy übernimmt Kaufabschluss | Trust und Checkout |
| Productdetails/First impression | entfernt | doppelte Wirkung und zu langer erklärender Block auf der Startseite | Reduktion |
| Material Proof | behalten und gestärkt | Preis-/Qualitätsbeweis ohne laute Claims | Vertrauen |
| Ownership Moment | behalten | Besitzgefühl bleibt relevant | emotionale Produktnähe |
| Werkstatt | behalten | Prozessbeweis bleibt glaubwürdig | Material-/Handwerksbeweis |
| Custom/B2B/Service/About | behalten, mit Reveal | Detailpfade bleiben erreichbar | Lead und Retention |
| Final CTA | neu ausgerichtet | finaler Schritt statt allgemeiner Abschluss | Produktfinder oder Maßanfertigung |

## Conversion-Pfade

| Pfad | CTA | Zielseite | Position |
|---|---|---|---|
| Produktfinder | Produktfinder starten / Start product finder | `/produkte.html#produktfinder`, `/en/products.html#product-finder` | Hero, Product-Finder-Block, Final CTA |
| Produkte | Produkte ansehen / View products | `/produkte.html#produkte-grid`, `/en/products.html#products-grid` | Hero, Product-Finder-Block |
| Maßanfertigung | Maßanfertigung anfragen / Request custom board | `/schneidebrett-nach-mass/`, `/en/#customwork` | Hero-tertiär, Lead Block, Final CTA |
| B2B | B2B-Anfrage stellen / Request business gift | `/b2b.html`, `/en/#b2b` | Lead Block |
| Erbstück | Erbstück ansehen / View Erbstück | `/erbstueck/`, `/en/erbstueck/` | Moment Cards, Lead Block |
| Etsy | Shop auf Etsy ansehen / View Etsy shop | Etsy shop URL | Reviews, Etsy Trust, Footer |
| Pflege/Aufbereitung | Pflege-/Aufbereitungslinks | `/pflege.html`, `/schneidebrett-aufbereiten/`, EN equivalents | Service/Footer |

## Reveal-Implementierung

- Wiederverwendbare Klasse: `.reveal-on-scroll`
- Progressive Enhancement: `document.documentElement.classList.add("js")`
- Initialisierung: `initHomepageReveal()` in `main.js`
- Observer: `IntersectionObserver` mit `threshold: 0.16` und `rootMargin: "0px 0px -8% 0px"`
- Animation: `opacity` + `translateY`
- Staffelung: Cards, Proof Cards, Prozesszeilen und Service Cards erscheinen leicht verzögert.
- Bereits enthüllte Abschnitte werden mit `observer.unobserve()` nicht erneut versteckt.

## Reveal-Abschnitte

DE:

- Hero-Folgeabschnitt `delivery-badge`
- Bewertungen
- Moment Cards
- Product Finder
- Lead Block
- Etsy Trust
- Material Proof
- Ownership Moment
- Werkstatt
- Sonderanfertigung
- Aufbereitung
- Über uns
- B2B
- Final CTA

EN:

- Reviews
- Moment Cards
- Product Finder
- Lead Block
- Etsy Trust
- Ownership Moment
- Material Proof
- Workshop
- Custom work
- Refurbishment
- About
- B2B
- Final CTA

## Fallbacks

- JS-off: Inhalte sind sichtbar, weil `.reveal-on-scroll` ohne `.js` volle `opacity` und keinen Transform hat.
- Reduced Motion: CSS und JS setzen Inhalte sofort sichtbar; Transitions werden entfernt.
- Kein Scroll-Jacking: Es wird kein Scroll-Verhalten überschrieben.
- Kein Infinite Scroll: Es wird nichts nachgeladen und keine Content-Schleife erzeugt.
- Keine externe Library: Umsetzung ist Vanilla JS.

## Checks

- `node --check main.js`: bestanden
- `git diff --check`: bestanden
- `npm run audit:indexability`: bestanden
- `npm run audit:assets`: bestanden mit bekannter nicht-blockierender Video-Warnung
- `npm run audit:products`: bestanden mit `Kritisch: 0`

## Offene Punkte

- Mobile/externes QA erfolgt über temporäre Vorschau-URL.
- Das große Hero-Video bleibt als bestehende Performance-Warnung im Asset-Audit erhalten.
