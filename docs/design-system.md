# Edle Hölzer Designsystem

Status: Phase A/B, Referenzkandidat. Kein siteweiter Rollout und keine Produktionsfreigabe.

## Gestaltungsentscheidung

Ein digitales Atelier: reale Holzprodukte und Menschen führen, klare Entscheidungen folgen. Warme Fotografie, fast weißer Hintergrund, dunkles Mokka für Handlungen, Salbei nur als Nebenakzent. Kein Möbelmarken-Klon, keine neuen Qualitätsversprechen und keine neue Produkt-/Preislogik.

### Font-Empfehlung und Entscheidung für den Pilot

| Option | Gestalterische Bewertung | Technik / deutsche Zeichen | Entscheidung |
|---|---|---|---|
| Montserrat | Geometrisch und charaktervoll; bei 400–600 deutlich ruhiger als die bisherigen 800er-Versalien. Breiter Lauf muss bei langen Produkttiteln berücksichtigt werden. | OFL, Variable 100–900, Latin/Latin-ext; lokale WOFF2 möglich. | Für die Referenzphase beibehalten: bestehende Wiedererkennung und bereits positiv bewertete neue Sans-Richtung, nicht bloß Altbestand. |
| Manrope | Zeitgemäß, technisch-geometrisch; etwas nüchterner. Premiumwirkung ist eine gestalterische Einschätzung, kein messbarer Fontfakt. | OFL, Variable 200–800, Latin/Latin-ext. | Gute Alternative, aber ein Familienwechsel ist für die Konsolidierung nicht nötig. |
| Source Sans 3 | Humanistischer und kompakter, besonders gut für lange Texte; weniger prägnante geometrische Markenwirkung. | Adobe Open Source, für UI konzipiert; lokal einbindbar, deutsche Zeichen vorhanden. | Kandidat bei späterer Lesestudie, nicht still als neue Marke einführen. |
| System Sans | Schnell, robust, ohne Fontdownload; plattformabhängige Wirkung. | Kein zusätzlicher Fontrequest, deutsche Zeichen vom System. | Fallback, nicht primäre Markenfamilie. |

Quellen: [Montserrat-Metadaten](https://raw.githubusercontent.com/google/fonts/main/ofl/montserrat/METADATA.pb), [Manrope-Metadaten](https://raw.githubusercontent.com/google/fonts/main/ofl/manrope/METADATA.pb), [Source Sans 3](https://github.com/adobe-fonts/source-sans). Gestaltungseinschätzungen sind unsere Empfehlung, keine Aussagen der Anbieter. Der Pilot nutzt eine lokale Latin-WOFF2, normale Schrift, Gewichte 400–600, font-display swap. Umlaute und ß werden im Browser geprüft. Keine externen Fontdienste auf migrierten Seiten.

## Verbindliche Tokens

`assets/css/design-system.css` ist die einzige neue visuelle Quelle. Farben, Fonts, feste Type-Stufen, Spacing, drei Container, Radius und Transitionen stehen zentral in `:root`. Display = Sans. Mono = System-Monospace nur für Codes. Weder viewportskalierende Schriftgrößen noch negatives Tracking: feste Stufen pro Breakpoint, Letter-spacing 0. Diese bewusste Abweichung von den unverbindlichen Auftragsbeispielen verhindert extreme Sprünge.

- H1 48 / 34px; lange Produkttitel 38 / 30px; H2 32 / 26px; H3 22 / 20px.
- Body 17px, unterstützend mindestens 14px; CTA 16px, Zielhöhe mindestens 48px.
- Hauptsection 96 / 64px; kaufrelevante Gruppen 16–32px.
- Wide 1440px, Content 1240px, Reading 760px; Fließtext maximal 68ch.
- Bildrahmen: Produkt und Detail 1:1, Editorial 3:2, immersiver Hero flexibel mit begrenzter Höhe.
- Radius 4px, keine normalen Card-Shadows. Schatten nur für echte Overlays.

## Komponentenvertrag

| Komponente | Verhalten / Anwendung |
|---|---|
| Header | Bestehende Menü-IDs und Navigation erhalten; 80/64px, sichtbarer Fokus. Keine neue Scrollanimation. |
| Footer | Bestehende Links und Rechtstexte, 2–4 ruhige Spalten; kein verstecktes Legal. |
| Hero | Maximal immersive, editorial, product, service. Referenzen nutzen immersive/product/editorial. |
| Section / SectionIntro | Ein Zweck, feste Rhythmustokens, keine schwebende Rahmenkarte. |
| ProductCard | Quadratisches Bild, Name, Material, Preis; kleine Sammlung statt Badge-Wand. |
| ProductHero / ProductGallery | Bild vor Story; große stabile Fläche, zweites Medium bleibt Video. Bestehende Galerie/Zoom-Logik bleibt. |
| ProductFacts | Semantische dl mit feinen Linien; Material, Maße, Stärke sichtbar. Keine Fakten erfinden. |
| ReadMore | Sekundärinhalt bleibt HTML; native details ohne JS, zugänglicher Button mit aria-expanded/controls nach Enhancement. Keine Preis-/Sicherheitsinfos einklappen. |
| Accordion | Native details oder bestehende faqItem als zugänglicher Button, jeweils eindeutige IDs, Tastatur und Fokus. |
| Tabs | data-ds-tabs: nur bei substanziellen Themen; Desktop roving tabindex, Pfeile/Home/End; mobil native Details. Nicht für zwei Sätze erzeugen. |
| CTA | Primary Mokka/weiß, Secondary Linie/transparent, Textlink unterstrichen. Pro Section eine Primary; weitere vorhandene Primary werden visuell sekundär, Links bleiben. |
| Form | Bestehende names, required, action und Bedingungslogik unverändert; sichtbare Labels, 48px Inputs. Keine Live-Anfrage aus der Vorschau. |
| Quote / TrustStrip | Quelle erhalten; keine erfundenen Bewertungen und keine neuen Badge-Claims. |
| ImageText / EditorialText | Konsistentes Splitgrid oder Reading-Breite, reale Assets, kontrolliertes object-fit. |
| LegalInfo | Mindestens 14px, Pflichtangaben sichtbar/erreichbar, keine rechtliche Aussage ändern. |
| Shop UI | Preis, Verfügbarkeit, Optionen, Menge und Buy-CTA teilen Tokens; kein zweites System. Backend nicht Teil dieses Branches. |

## Templates und Ausnahmegrenzen

Home, Product Listing, Product Detail, Editorial/Guide, Service/Conversion, B2B, Legal sind im CSV zugeordnet. Referenzen: `/`, `/en/`, Walnuss-Produktdetail DE/EN, `/pflege.html`, `/en/care.html`. Pflege wurde gewählt, weil der lange Guide in beiden Sprachen existiert; eine eigenständige englische Maßseite fehlt auf main und wird nicht für einen Designpilot erfunden.

Ausnahmen: bestehende Produktgalerie-, Video-, Menü- und Formularzustände dürfen Laufzeitattribute/Inlinewerte behalten. Historische Styles und Brettvorschau-Bundle bleiben als Legacy bis zur jeweiligen Migration. Bewusstes Serif-Branding wird derzeit nicht eingeführt. Gravur-Schriftmuster wären eine dokumentierte funktionale Ausnahme, keine Seitentypografie.

## Architektur und Migration

Der Referenzbuild fasst bestehende CSS-Dateien pro Referenz in einer `legacy` Cascade Layer zusammen. Die neue Token/Base/Component-Schicht gewinnt ohne !important. Inline-CSS der Pflege wird aus dem HTML in diese Legacy-Schicht verschoben. Keine weitere unkontrollierte Override-Datei pro Seite. Der Adapter ordnet bestehende Inhalte Komponenten zu; er importiert weder Shopserver noch dessen Geheimnisse. Rohseiten nicht migrierter URLs bleiben unverändert.

Die Referenzseiten sind im Build explizit opt-in. Das ist noch keine Aktivierung des Builds im produktiven GitHub-Deployment. Nach Review wird Template für Template migriert, anschließend Legacy-Dateien durch geprüfte Komponenten ersetzt. Nicht vorab alle Altstyles löschen.

Vier bekannte dynamische CSS-Lader in main.js erhalten nur im generierten Build einen ds-site-Guard, weil diese Styles bereits in der Legacy-Schicht enthalten sind. Nicht migrierte Seiten laden sie normal weiter. Ein Quellvergleich testet, dass außer genau diesen vier Guards kein Laufzeitcode verändert wird. Zwei dynamische Styleblöcke werden durch das Enhancement in die Legacy-Schicht eingeordnet. Preise, Produkte und Kaufregeln bleiben unverändert.

## Referenzanalyse

[ONDE](https://www.zeitraum-moebel.de/de/collection/onde/), [KUYU](https://www.zeitraum-moebel.de/de/collection/kuyu/), [TWIST oval](https://www.zeitraum-moebel.de/collection/twist-oval/), [CENA hyperelliptical](https://www.zeitraum-moebel.de/collection/cena-hyperelliptical/): kurze Produktidee vor optionaler Vertiefung; Material und technische Daten als eigene Ebene; Bildfolgen tragen die Darstellung. Übernommen werden diese Prinzipien, keine Texte, Assets, Farben, Maße oder Markenformen. Bei Edle Hölzer bleiben Auswahlberatung, einzelne Holzstücke und Werkstattnähe deutlicher als der Architekten-/Planungsfokus der Referenz.
