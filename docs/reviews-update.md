# Etsy-Bewertungen aktualisieren

Die Website lädt Bewertungen statisch aus JSON-Dateien. Es gibt keinen Live-Fetch von Etsy im Browser und keine API-Keys im Frontend.

## Dateien

- `data/reviews.json`: sichtbare Review-Karten für die Website
- `data/reviews-en.json`: englische Review-Karten für die englische Startseite
- `data/reviews-meta.json`: Bewertungsdurchschnitt, Bewertungsanzahl, Quelle und Aktualisierungsdatum
- `scripts/sync-etsy-reviews.js`: vorbereitetes manuelles Hilfsscript für spätere Etsy-API-Nutzung

## Neue Bewertung ergänzen

1. Öffne `data/reviews.json`.
2. Ergänze einen neuen Eintrag mit eindeutiger `id`, z. B. `etsy-review-011`.
3. Setze `source` auf `Etsy`.
4. Setze `rating` als Zahl von `1` bis `5`.
5. Übernimm den Bewertungstext nur, wenn er verifiziert ist. Keine erfundenen oder sinngemäß geratenen Texte eintragen.
6. Pflege `product`, `reviewerName` und `date` im Format `YYYY-MM`.
7. Setze `featured: true`, wenn die Bewertung in der Trust-Leiste erscheinen soll.
8. Setze `needsReview: true`, wenn Text, Datum, Bewertung oder Quelle noch geprüft werden müssen. Solche Einträge werden im Frontend nicht angezeigt.

Die Website zeigt nur Einträge mit `featured: true`, gültigem Text, gültigem Rating und `needsReview: false`. Es werden maximal 12 Bewertungen gerendert.

Für die englische Startseite müssen übersetzte oder bereits englische Review-Auszüge zusätzlich in `data/reviews-en.json` gepflegt werden. IDs können das Suffix `-en-` verwenden; Rating, Datum, Quelle und `featured` sollten mit dem deutschen Eintrag konsistent bleiben.

## Bewertungsanzahl und Durchschnitt aktualisieren

1. Öffne `data/reviews-meta.json`.
2. Aktualisiere `ratingCount` separat von den Review-Karten.
3. Aktualisiere `ratingAverage` separat, z. B. `5.0`.
4. Setze `lastUpdated` auf das Prüfdatum im Format `YYYY-MM-DD`.
5. Pflege `sourceUrl`, wenn sich die Etsy-Shop- oder Review-URL ändert.
6. Setze `needsReview: true`, wenn Bewertungsanzahl oder Durchschnitt unsicher sind. Dann nutzt die Website eine allgemeinere Subline ohne unsichere Zahl.

## Manueller Prüfablauf

1. Etsy-Shop öffnen und Review-Bereich prüfen.
2. Sichtbare Bewertungsanzahl und Durchschnitt mit `data/reviews-meta.json` abgleichen.
3. Neue oder bessere Featured-Reviews in `data/reviews.json` ergänzen.
4. Bei gekürzten Auszügen sicherstellen, dass der Sinn der Bewertung nicht verändert wird.
5. `lastUpdated` aktualisieren.
6. Änderungen committen.

## Optionaler API-Sync

Das Script ist bewusst defensiv:

```bash
ETSY_API_KEY=... ETSY_SHOP_ID=... node scripts/sync-etsy-reviews.js
```

Optional kann `ETSY_ACCESS_TOKEN` gesetzt werden, falls Etsy für den verwendeten Endpunkt OAuth verlangt.

Das Script versucht nur offiziell zugängliche Etsy-Open-API-Daten zu nutzen. Wenn kein API-Key, keine Shop-ID, kein passender Endpunkt oder kein OAuth-Zugriff vorhanden ist, beendet es sich mit einer klaren Meldung und verändert keine bestehenden Review-Daten destruktiv.

## Testschritte nach Aktualisierung

1. Startseite öffnen und prüfen, ob die Bewertungsleiste sichtbar ist.
2. Englische Startseite `en/index.html` öffnen und prüfen, ob englische Review-Texte sichtbar sind.
3. `produkte.html` öffnen und prüfen, ob dieselbe Leiste sichtbar ist.
4. Bewertungsanzahl und Durchschnitt gegen `data/reviews-meta.json` prüfen.
5. Reviews horizontal scrollen und auf Desktop per Maus ziehen.
6. Auf Mobile per Swipe prüfen.
7. Testweise eine Bewertung auf `needsReview: true` setzen oder `text` leeren und prüfen, dass sie nicht angezeigt wird.
8. `data/reviews-meta.json` ändern und prüfen, ob Headline/Subline aktualisiert werden.
9. Browser-Konsole prüfen: Es sollten keine Fehler erscheinen. Entwicklerhinweise per `console.warn` sind erlaubt.
