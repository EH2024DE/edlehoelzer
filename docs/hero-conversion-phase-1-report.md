# Hero Conversion Optimization - Phase 1

Stand: 2026-07-15

## Scope

Geaendert wurden ausschliesslich die Hero Experience und der direkt anschliessende Proof-Block auf der deutschen und englischen Startseite. Navigation, Reviews und alle spaeteren Startseitenabschnitte sowie Product Preview, Compare, SEO-Seiten und Footer blieben unveraendert.

## Textentscheidung

Gepruefte deutsche H1-Richtungen:

- `Schneidebretter mit Gewicht und Charakter.`: markentypisch, aber der konkrete Alltagsnutzen bleibt offen.
- `Fuer Kuechenmomente mit Gewicht.`: emotional, beantwortet jedoch nicht sofort, welches Produkt angeboten wird.
- `Massive Schneidebretter fuer den taeglichen Einsatz.`: klar, aber etwas technisch und lang.
- `Massive Schneidebretter fuer jeden Tag.`: gewaehlt, weil Produkt, Materialcharakter und Nutzung in einer kurzen, mobilen H1 zusammenkommen.

Die englische H1 folgt derselben Logik mit `Solid wood cutting boards for everyday use.` und ist keine woertliche Uebersetzung.

## Vorher und nachher

| Element | Vorher | Nachher |
|---|---|---|
| Trust | Einzelner Herkunfts-Eyebrow | Eine kompakte Faktenzeile zu Etsy, Herkunft und Massivholz |
| H1 DE | Schneidebretter mit Gewicht und Charakter. | Massive Schneidebretter fuer jeden Tag. |
| H1 EN | Cutting boards with weight and character. | Solid wood cutting boards for everyday use. |
| Subheadline | Breite Aufzaehlung von Situationen | Herkunft, Material und Pflegefaehigkeit als konkrete Belege |
| CTA | Produktfinder plus Produktuebersicht | Gleiche Ziele, aber klarere visuelle Primaer-/Sekundaerhierarchie |
| Direkt unter Hero | Einzelner Versandhinweis | Vier kompakte Fakt-zu-Bedeutung-Beweise |

## CTA-Hierarchie

- Primaer DE: `Passendes Brett finden`
- Sekundaer DE: `Produkte ansehen`
- Primaer EN: `Find a board`
- Sekundaer EN: `View products`

Der Finder bleibt der dominante Beratungsweg. Die Produktuebersicht ist die ruhigere Alternative fuer Nutzer mit bereits konkreter Kaufabsicht. Massanfertigung bleibt bewusst ausserhalb des Above-the-Fold-Bereichs, damit dort nicht drei gleichwertige Entscheidungen konkurrieren.

## Proof-Block

Die vier Karten folgen dem Muster Fakt -> Bedeutung:

1. Massives Hartholz -> ruhigerer Stand und Aufarbeitbarkeit.
2. Werkstatt in Mittelhessen -> Fertigung vom Zuschnitt bis zum letzten Schliff vor Ort.
3. Geoelte, nachpflegbare Oberflaeche -> Pflege statt vorschnellem Ersatz.
4. Etsy-Checkout -> Bewertungen und Kaeuferschutz am Kaufpunkt.

Es wurden keine pauschalen Materialstaerken, Lieferzeiten, Preise oder Verfuegbarkeiten ergaenzt.

## Hypothesen

| Aenderung | Warum | Erwartete KPI-Wirkung |
|---|---|---|
| Produktklare H1 | Nutzer verstehen das Angebot ohne Interpretation | geringere Hero-Absprungrate, mehr Finder- und Produktklicks |
| Ein kurzer Proof-Satz | Weniger abstrakte Markenbegriffe | mehr Vertrauen und mehr Verweildauer bis zum Proof-Block |
| Ein dominanter CTA | Weniger Auswahlparalyse | mehr Klicks auf den Brettfinder |
| Faktenzeile statt Chips | Weniger visuelle Konkurrenz zu CTA und Bild | bessere CTA-Wahrnehmung auf Mobile |
| Vier Fakt-Bedeutung-Karten | Kaufgruende werden konkret, ohne den Hero zu verlaengern | mehr Produkt- und Etsy-Intent nach dem ersten Scroll |

## Mobile-Pruefung

Manuell geprueft:

- Desktop: 1440 x 1000
- Mobile: 390 x 844
- Kleine Mobile-Breite: 320 x 740
- Deutsch und Englisch

Ergebnis:

- H1 bleibt auf Mobile zweizeilig.
- Primaer-CTA bleibt oberhalb des ersten Scrolls.
- Keine horizontale Ueberbreite.
- Trust-Zeile bleibt einzeilig.
- Proof-Karten wechseln mobil in ein kompaktes 2-x-2-Raster.
- Touch-Ziele behalten mindestens 44 px Hoehe.

## Technische Checks

- `git diff --check`: erfolgreich
- `npm run audit:indexability`: erfolgreich
- `npm run audit:assets`: erfolgreich, bestehender nicht blockierender Hinweis zum Hero-Video (> 8 MB)
- `npm run audit:products`: erfolgreich, bestehende nicht blockierende Produktdaten-Hinweise
- H1-Pruefung DE/EN: jeweils genau eine H1

## Bewusst nicht geaendert

- Hero-Video und bestehende Bildassets
- Reviews und deren Reihenfolge
- Startseitenabschnitte nach dem ersten Proof-Block
- Navigation und Footer
- Product Preview und Compare
- SEO-Metadaten und Seitenstruktur

Damit bleibt Phase 1 isoliert messbar.
