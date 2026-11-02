# Referenzdesign: Review vor dem Rollout

## Stand

Branch `codex/design-system-zeitraum-inspired`, Basis main `f772f7a`. Phase A und B sind als isolierter Build umgesetzt. Es wurden noch nicht alle 145 Seiten migriert und weder GitHub-Produktionsdeployment noch bestehende Cloudflare-/Stripe-Vorschau ersetzt. Der Shopcheckout mit seinen ungespeicherten Arbeiten blieb unberührt.

Review-Rückmeldung: Die Designrichtung wurde vom Nutzer grundsätzlich bestätigt. Nachgebessert wurde der mobile Home-Hero: nur bestehende H1 und eine Hauptaktion, kein langer Introtext, kein zweiter Button und kein zusätzlicher Finder-Hinweis. Diese Elemente bleiben im HTML und auf Desktop sichtbar. Der mobile Bildrahmen ist auf mindestens 440px reduziert. Designmigration hat Vorrang; Shopintegration folgt getrennt danach.

## Vorher / nachher

| Typ | Vorher | Nachher |
|---|---|---|
| Startseite, Desktop | [main](design-reference-screenshots/before-home-1440.png) | [Referenz](design-reference-screenshots/after-home-1440.png) |
| Produktdetail, Desktop | [main](design-reference-screenshots/before-product-1440.png) | [Referenz](design-reference-screenshots/after-product-1440.png) |
| Pflege-Ratgeber, Desktop | [main](design-reference-screenshots/before-care-1440.png) | [Referenz](design-reference-screenshots/after-care-1440.png) |
| Startseite, Mobile | [main](design-reference-screenshots/before-home-375.png) | [Referenz](design-reference-screenshots/after-home-375.png) |
| Produktdetail, Mobile | [main](design-reference-screenshots/before-product-375.png) | [Referenz](design-reference-screenshots/after-product-375.png) |
| Pflege-Ratgeber, Mobile | [main](design-reference-screenshots/before-care-375.png) | [Referenz](design-reference-screenshots/after-care-375.png) |

Die 12 Review-Bilder zeigen den ersten Viewport bei 1000px Höhe. Vollständige Seitenbilder für DE/EN bei 375/430/768/1024/1440px: `/tmp/edle-design-system-qa/`. Zusätzlich wurde der Home-Hero bei 375×667px auf Beschnitt und Überschneidung mit dem Play-Button gemessen. Primäre Kaufdaten bleiben außerhalb von ReadMore und Tabs.

## Entscheidungen

- Montserrat lokal, normale Gewichte, keine Serifenschrift als Standard. Alternativen und Begründung in `design-system.md`.
- Eine neue visuelle Quelle mit Tokens und Komponenten statt erneuter seitenlokaler CSS-Overrides.
- Legacy-CSS wird im Referenzbuild isoliert. Auch vier von main.js nachgeladene Stylesheets und zwei Laufzeit-Styleblöcke werden in die Legacy-Schicht eingeordnet. Typografische !important-Altlasten werden im generierten Legacy-CSS normalisiert; Quelldateien bleiben bis zur geprüften Migration erhalten.
- Nur die Zustandsregel `[hidden]` nutzt im neuen System !important, damit zugängliche Disclosure-Zustände verlässlich gewinnen.
- Sekundäre CTAs sind zurückgenommen. Preis, Versandbereitschaft, Maße, Material und Kaufweg bleiben offen. Bestehender Produkt-CTA wird im DOM unmittelbar nach der Preisgruppe angeordnet; keine Bestellregel geändert.
- Native Fallbacks: Details bleiben ohne JS nutzbar, FAQ-Antworten dann offen. Mit JS sind Buttons und Tabs tastaturbedienbar. Tabs werden nicht auf kurze Produkttexte erzwungen; die Komponentenprüfseite demonstriert sie.
- Kein inhaltlicher SEO-Abbau. Haupttexte, H1, Canonicals, Metadaten, JSON-LD, interne Links und Formverträge werden im Build verglichen.
- Der lange Pflegeguide wurde als dritte Referenz gewählt, da er DE/EN vorhanden ist. Die auf main fehlende eigenständige englische Maßseite ist eine getrennte IA-/Contentfrage.

## Prüfungen

| Prüfung | Ergebnis |
|---|---|
| Node-Regression, bestehende Suite plus Designsystem | 112 Tests bestanden |
| Sechs Referenzen × fünf Breiten | 30 Ansichten, keine automatischen Befunde |
| Menü, Produktgalerie und ReadMore in DE/EN, Mobile/Desktop | vier Fälle bestanden |
| Ohne JavaScript | alle sechs Referenzen nutzbar |
| Tabs, Pfeile/Home/End, FAQ, ReadMore, Mobile-Wechsel | bestanden auf Komponentenprüfseite |
| Kleines Mobile 375×667 | Hero-Inhalt nicht abgeschnitten, Play-Button überlagert H1 nicht |
| Katalog-/Finanzdaten | products.json und main.js bytegleich zu main |
| Schutz vor echten Anfragen | Vorschau nur GET/HEAD, Formularsubmit abgefangen |

Kein automatischer Test beweist vollständige WCAG-Konformität. Screenreader und echte Safari-/iOS-Geräte sind noch separat zu prüfen. Keine gemessene Conversion- oder Rankingverbesserung wird behauptet.

## Risiken und offene Freigaben

1. Grundrichtung bestätigt; der templateweise Designrollout kann nach der mobilen Korrektur fortgesetzt werden. Kein Shop-Livegang aus dieser Freigabe ableiten.
2. Main enthält nicht alle ungespeicherten, zuvor bestätigten Inhalts- und Produktkorrekturen des Shopcheckouts. Vor einer Veröffentlichung müssen diese separat und gezielt übernommen werden. Der Referenzbuild erklärt sie nicht für erledigt.
3. Der Pilot enthält noch die vorhandene Legacy-CSS-Menge. Neue Kernassets: rund 18KB CSS, 5.6KB JS und 38KB lokale Fontdatei, unkomprimiert. Vier doppelte CSS-Ladepfade werden ausschließlich im generierten Referenz-main.js für ds-site unterbunden; der Quellvergleich prüft exakt diese vier Guards. Die indikative Netzwerkaufnahme meldet weniger Requests, aber noch rund 57–67KB zusätzliche CSS/JS/Font-Transferbytes pro Referenz. Cross-Origin-Werte können null sein, daher ist das kein vollständiger Performancevergleich. Das Ziel „nicht schwerer“ ist noch nicht abgenommen: vor Rollout Legacy-CSS abbauen und Lighthouse/Netzwerkbudget unter identischen Bedingungen vergleichen.
4. Finale Fotosprache und Bildreduktion bleiben redaktionell zu entscheiden. Bestehende Bildauswahl wurde nicht gegen fremde Stockbilder ausgetauscht.
5. Alter, bewusst beanstandeter Aufbereitungsbereich der main-Startseite: Der neue Pilot zeigt seine Bilder nicht, behält aber Texte und Links. Eine vollständige Inhaltsangleichung an die frühere lokale Vorschau ist noch kein Teil dieses main-basierten Designs.

## Lokal prüfen

```sh
npm ci
npm run build:design-reference
npm run preview:design-reference
```

Übersicht: `http://127.0.0.1:8184/design-reference/`. Vorher-Ansichten liegen unter `/before/`. Die Vorschau liefert `X-Robots-Tag: noindex, nofollow` und übermittelt keine Formulare. Sie ist kein Checkout-Test.

Externe Review-Vorschau, am 2. November 2026 im internen Browser erfolgreich geöffnet: https://accompanying-sends-built-sentences.trycloudflare.com/design-reference/ . Temporärer Nur-Lese-Tunnel, nur solange der lokale Rechner und Vorschauprozess laufen; kein dauerhaftes Hosting und kein Ersatz des bestehenden Stagings. Nur die sechs expliziten Referenzen zeigen das neue System, andere verlinkte Seiten bleiben main-Stand. Der maschinenlesbare Bericht aller 30 Ansichten liegt in `design-reference-qa.json`.
