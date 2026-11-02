# Designsystem-Migration: Vollständiger statischer Designbuild

Stand: 2. November 2026. Branch `codex/design-system-zeitraum-inspired`, Inhaltsbasis main `f772f7a`. 148 gestaltete Seiten, darunter sämtliche 145 Sitemap-URLs. Keine Produktionsveröffentlichung, keine Shopaktivierung.

Nachtrag zur visuellen Abnahme: Die flächendeckende Stilübertragung war keine vollständige UX-Abnahme. Nach Nutzerfeedback ist die Aufbereitung als kompakte, farblich abgestufte Vergleichskomponente neu aufgebaut. Vorgehen und gezielte Prüfungen stehen in `design-service-review.md`; weitere Seitentypen sind künftig anhand konkreter Nutzerentscheidungen statt nur globaler CSS-Merkmale zu beurteilen.

## 1. Designprinzipien
Produkt zuerst, klare nächste Entscheidung, ergänzende Information progressiv. Ordnung und echtes Holz statt dekorativer Karten. Der Nutzer hat die Grundrichtung der Referenzen bestätigt.

## 2. ZEITRAUM-Referenzanalyse
ONDE, KUYU, TWIST oval und CENA: kurze Idee, optionale Vertiefung, separate Material- und Datenebene. Quellen in `design-system.md`. Keine proprietären Texte, Assets oder Gestaltungsmaße übernommen.

## 3. Edle-Hölzer-Abweichungen
Warme Produktfotografie, Mokka, echte Werkstatt und direkte Auswahlberatung bleiben eigenständig. Kaufbarkeit und Werterhalt statt Architekten-Downloads.

## 4. Typography
Lokale Montserrat, zentrale Typestufen, normale Gewichte. Alte Font-, Größen-, Gewichts-, Zeilenhöhen- und Tracking-Deklarationen werden im erzeugten Legacy-CSS entfernt. Keine viewportskalierenden Fonts. Der finale Audit der verlinkten Styles findet keine alte Serif-Typografie oder Inline-Typografie.

## 5. Colors
Off-White, Anthrazit, Mokka, Salbei und Linienfarbe als Tokens. Helle und immersive Flächen erhalten explizite Textfarben. Produkt- und Sticky-Hauptbuttons haben weißen Text; Video- und Vergleichslabels ebenfalls definierte Kontraste.

## 6. Spacing
4–128px Skala, 96px Hauptsections, 64px mobil. Mobiler Home-Titel 30px, mindestens 32px Abstand zur Hauptaktion. Unnötiges Flex-Strecken und Absatzmargins zwischen Produktmetadaten und Preis entfernt.

## 7. Grid
Drei Container, Produktdetail 3/2, Tablet 1/1, mobil gestapelt. Collection mobil manuell swipebar. Lange Tabellen scrollen innerhalb ihres Bereichs; lange deutsche Wörter und Rechtstext-Links erzeugen keinen Seitenüberlauf.

## 8. Components
Gemeinsame Header-, Footer-, Hero-, Section-, ProductCard-, ProductHero-, Facts-, Gallery-, ReadMore-, Accordion-, Tabs-, CTA-, Form-, Quote-, ImageText-, Trust- und Legal-Verträge. Rechtstexte erhalten gemeinsame Navigation und Footer. Altklassen bleiben für vorhandene Funktionen erhalten, nicht als zweite Fontquelle.

## 9. Templates
Home, Listing, Produktdetail, Editorial, Service, B2B, Legal sowie der funktionale Tresenvorschau-Adapter. Automatisch aus allen öffentlichen HTML-Dateien erfasst. Weiterleitungsseiten bleiben Weiterleitungen, keine künstlichen Landingpages.

## 10. Progressive Disclosure
Inhalte bleiben im HTML. Native Details funktionieren ohne JS; ReadMore mit ARIA-Button nach Enhancement. FAQ einheitlich, Tabs nur bei genügend Inhalt. Keine Pflichtdaten einklappen. Auf der Aufbereitungsseite bleiben Prozessfotos einmal in der Galerie sichtbar statt zusätzlich mehrfach einzeln; Texte bleiben erhalten.

## 11. Product UX
Großes quadratisches Primärbild, klarer Preis, Fakten als dl. Vorhandene Galerie, Video an zweiter Position, Zoom und Optionen bleiben. Keine zweite Shopoberfläche, keine geänderten Produkt- oder Finanzdaten.

## 12. Mobile
Alle 148 Seiten bei 375/1440px geprüft; sechs Referenzen zusätzlich bei 430/768/1024px. Mobiler Home-Hero enthält nur Titel und eine Hauptaktion. Konkrete Abstandsregressionen verhindern erneut zu enge Hero-CTAs oder zu große Preisabstände.

## 13. Accessibility
Fokus, 44/48px Ziele, native Fallbacks, Tabs-Tastatur, ARIA-Zustände, Reduced Motion. Kontrastprüfung der sichtbaren Textknoten einschließlich Alpha-Komposition auf einfarbigen Flächen. Text über Bildern/Verläufen wird zur menschlichen Prüfung markiert, nicht fälschlich automatisch freigegeben. Keine vollständige WCAG-Zertifizierung; echter Screenreader und iOS/Safari bleiben Freigabetests.

## 14. Performance
Keine neue Browserlibrary. parse5/PostCSS sind Buildwerkzeuge, Font lokal rund 38KB. Gleiche CSS-Kombinationen werden über ihren Inhaltshash geteilt, vier doppelte Laufzeit-CSS-Lader im Build begrenzt. Die indikative Aufnahme zeigt noch rund 38–47KB mehr gemeldete CSS/JS/Font-Transferbytes; Cross-Origin-Fontgrößen des Vorher-Zustands können null sein. Daraus wird kein vollständiger Performancevergleich oder Geschwindigkeitsgewinn abgeleitet. Lighthouse und ein gleichwertiger Produktionsvergleich bleiben vor Livegang offen.

## 15. SEO-Schutz
Alle 148 Seiten werden auf unveränderte H1, Titel, Metadaten, Canonical/Hreflang, JSON-LD, Haupttexte, Links und Formularverträge verglichen. Sitemap unverändert. Vorschau noindex/nofollow. Keine SEO-Inhalte blind gekürzt.

## 16. Migrierte Seiten
Alle 145 Sitemap-Seiten plus drei ergänzende öffentliche Seiten im statischen Designartefakt. `docs/design-page-inventory.csv` enthält den neuen Stand. Die rohe Inhaltsquelle wird nicht durch 148 handgepflegte Designkopien ersetzt: der Build ist die verbindliche Übertragung und muss für eine spätere Veröffentlichung verwendet werden.

## 17. Verbleibende Legacy Styles
Bestehende Layout- und Verhaltensregeln bleiben in isolierten Legacy-Layers. Alte Quelldateien werden nicht blind gelöscht. Der Audit `design-final-legacy-audit.json` prüft tatsächlich verlinkte Styles des fertigen Artefakts; die historische Fundstellen-CSV bleibt als Ausgangsinventar erhalten. Das kompilierte 3D-Bundle ist funktional unverändert.

## 18. Screenshots
Zwölf Vorher-/Nachher-Bilder unter `design-reference-screenshots/`, zusätzliche Templatebilder unter `design-site-screenshots/`. Alle 296 Viewportbilder liegen unter `/tmp/edle-design-site-qa/`. Maschinenlesbare Berichte: `design-site-qa.json`, `design-reference-qa.json`.

## 19. Tests
114 Node-Tests bestanden. 296 siteweite Browseransichten ohne automatische Befunde; 30 Referenzansichten auf fünf Breiten bestanden. Menü, Galerie, ReadMore, Tabs, FAQ und sechs No-JS-Fallbacks geprüft. Tresenvorschau auf Mobile/Desktop nicht leer; Drehung verändert Canvas-Pixel. Aufbereitungsseiten nach der Bildbereinigung zusätzlich geprüft. Keine echten Anfragen oder Zahlungen.

## 20. Veröffentlichung und nächste Schritte
CI erzeugt ein statisches Review-Artefakt mit `npm run build:design-site`; kein Deploy-Schritt hinzugefügt. Externe Übersicht: https://accompanying-sends-built-sentences.trycloudflare.com/design-reference/ . Temporärer Tunnel, abhängig vom lokalen Rechner. Vor Livegang: Gesamtreview, echter iOS/Safari-/Screenreader-Test, Performance-Abnahme und ausdrückliche Veröffentlichungsfreigabe. Frühere ungespeicherte Inhaltsänderungen des Shopcheckouts sind nicht still übernommen; mögliche DE/EN-Inhalts-/Preisabweichungen bleiben ein separater Content-Abgleich. Erst nach Designabnahme folgt die Shopintegration. Keine Stripe-, Versand-, DNS- oder Zahlungsänderung aus diesem Auftrag ableiten.
