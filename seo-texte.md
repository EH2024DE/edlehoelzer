# SEO-Rewrite Landingpages

Diese Datei dokumentiert den angewendeten SEO-Rewrite der deutschen Landingpages. Die Browser-Seiten laden diese Datei nicht; sie dient als redaktionelle Quelle und technische Referenz.

## Grundsätze

- Deutsche Seiten bleiben in du-Form.
- Produktdaten kommen ausschließlich aus `products.json`.
- `products.json` ist ein Objekt mit dem Key `products`.
- Für Landingpage-Produktgrids werden nur echte Felder genutzt.
- Keine Filter auf nicht vorhandene Felder wie `wood`, `endgrain` oder `engravable`.
- Produktkarten führen zu Etsy, Produktfinder und interne Links bleiben als nächste sinnvolle Schritte erhalten.

## Produktfilter

| Seite | Produktsektion | Container | Filter |
| --- | --- | --- | --- |
| `/schneidebrett-eiche/` | Unsere Eichenbretter | `products-eiche` | `p.material && p.material.includes("Eiche")` |
| `/schneidebrett-nussbaum/` | Unsere Nussbaumbretter | `products-nussbaum` | `p.material && p.material.includes("Nussbaum")` |
| `/stirnholz-schneidebrett/` | Unsere Stirnholzbretter | `products-stirnholz` | `p.woodCut === "end"` |
| `/schneidebretter-massivholz/` | Alle Schneidebretter | `products-massivholz` | `p.category === "board"` |
| `/schneidebrett-mit-gravur/` | Bretter, die graviert werden können | `products-gravur` | `Array.isArray(p.badges) && p.badges.includes("personalisierbar")` |
| `/hochwertige-geschenke-holz/` | Holzgeschenke von Edle Hölzer | `products-geschenke` | `p.giftable === true` |
| `/barbecue-geschenk/` | Passende Bretter für BBQ | `products-bbq` | `Array.isArray(p.useCases) && p.useCases.includes("bbq")` |
| `/geschenk-fuer-maenner-holz/` | Passende Produkte als Geschenk | `products-maenner` | `p.giftable === true || (Array.isArray(p.useCases) && p.useCases.includes("bbq"))` |
| `/geschenk-fuer-frauen-holz/` | Passende Produkte als Geschenk | `products-frauen` | `p.servingSuitable === true || p.giftable === true` |
| `/hochwertige-kuechenaccessoires/` | Alle Küchenaccessoires | `products-kueche` | `true` |

## Meta-Daten

| Seite | Title | Meta Description |
| --- | --- | --- |
| `/schneidebrett-eiche/` | Schneidebrett aus Eiche \| Massiv, robust & handgefertigt | Schneidebretter aus Eiche Massivholz – handgefertigt in Mittelhessen. Robust, langlebig, charakterstark. Mit Gravur oder nach Maß. |
| `/schneidebrett-nussbaum/` | Schneidebrett aus Nussbaum \| Dunkles Massivholz handgefertigt | Schneidebretter aus Nussbaum Massivholz – dunkle Maserung, edle Haptik, handgefertigt. Als Geschenk für die Designküche. |
| `/stirnholz-schneidebrett/` | Stirnholz Schneidebrett \| Hirnholz handgefertigt aus Massivholz | Stirnholz- und Hirnholzschneidebretter handgefertigt aus Massivholz. Charaktervolle Faserquerschnitte, hohe Wertigkeit – für Küche, BBQ und als Geschenk. |
| `/schneidebretter-massivholz/` | Schneidebretter aus Massivholz \| Handgefertigt von Edle Hölzer | Handgefertigte Massivholz-Schneidebretter aus Eiche, Nussbaum und regionalen Hölzern. Auf Wunsch mit Gravur, Saftrille oder nach Maß gefertigt in Mittelhessen. |
| `/schneidebrett-mit-gravur/` | Schneidebrett mit Gravur \| Personalisiertes Holzgeschenk | Schneidebretter mit persönlicher Gravur – Name, Datum, Logo. Handgefertigt aus Massivholz. Für Hochzeit, Geburtstag, Firmenjubiläum oder BBQ-Fans. |
| `/hochwertige-geschenke-holz/` | Hochwertige Geschenke aus Holz \| Handgefertigt & personalisierbar | Handgefertigte Holzgeschenke für Küche, BBQ, Design und besondere Anlässe. Persönlich, langlebig, individuell – aus der Manufaktur Edle Hölzer. |
| `/barbecue-geschenk/` | Barbecue Geschenk \| Hochwertige Grillgeschenke aus Holz | Holzgeschenke für Grillfans und BBQ-Begeisterte: Massivholz-Schneidebretter, Servierbretter, Stirnholz – auf Wunsch mit Gravur. Handgefertigt in Mittelhessen. |
| `/geschenk-fuer-maenner-holz/` | Hochwertiges Geschenk für Männer \| Holz, BBQ & Küche | Holzgeschenke für Männer die kochen, grillen oder Wert auf gutes Handwerk legen. Massiv, personalisierbar, aus der Manufaktur in Mittelhessen. |
| `/geschenk-fuer-frauen-holz/` | Hochwertiges Geschenk für Frauen \| Holz, Küche & Design | Holzgeschenke für Frauen mit Sinn für Küche, Design und Handwerk. Handgefertigt, personalisierbar, langlebig – aus der Manufaktur Edle Hölzer. |
| `/hochwertige-kuechenaccessoires/` | Hochwertige Küchenaccessoires aus Holz \| Design & Handwerk | Küchenaccessoires aus Holz – handgefertigt, massiv, langlebig. Schneidebretter, Servierbretter und Pflegeprodukte aus der Manufaktur Edle Hölzer. |

## Weiterführende Links

Die Landingpages verlinken intern auf passende Material-, Anlass- und Ratgeberseiten sowie auf `/produkte.html#produktfinder`. Externe Etsy-Links werden mit `target="_blank"`, `rel="noopener"` und GoatCounter-Attributen ausgezeichnet.
