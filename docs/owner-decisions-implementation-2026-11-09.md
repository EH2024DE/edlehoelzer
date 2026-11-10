# Umsetzung nach dem Sprachgespraech

## Abgeschlossener Teilumfang

- Deutschsprachige Gastroseite: Innenausbau aus sichtbarer Beschreibung und
  FAQ-Schema entfernt. PE 500 bleibt als individuelle Alternative mit Material-
  und Machbarkeitspruefung erhalten. Keine pauschale Behoerdenzulassung.
- Gastro und Firmengeschenke: Budget, Budgetbasis, Stueckzahl, Nachricht und
  E-Mail verpflichtend und unmittelbar sichtbar, auch nach JavaScript-Start.
  Bei Firmengeschenken ist Budget pro Stueck voreingestellt. Weitere Angaben
  bleiben aufklappbar. Kostenlose Anfrage und gesondert freizugebende
  150-EUR-Konzeptarbeit mit Anrechnung bleiben unveraendert erklaert.
- Neue vollstaendige englische Versionen von Atelier und Firmengeschenken:
  `/en/atelier/` und `/en/corporate-gifts/`. Dieselben Hauptabschnitte, Medien,
  Produktfilter und Formvertraege wie die deutschen Quellen, mit redaktionell
  uebersetztem Text. Der Generator prueft einen Hash der deutschen Quelltexte;
  spaetere Inhaltsaenderungen werden nicht unbemerkt falsch zugeordnet.
- Sprachverweise, englische Startnavigation, Canonicals, hreflang und Sitemap
  beziehen die neuen Ziele ein. Englische Texte verweisen auf noch nicht
  uebersetzte Vertiefungsseiten kenntlich als DE.
- Aufbereitung auf Englisch: nur innerhalb Deutschlands; Konditionen gelten
  nicht fuer internationale Serviceauftraege. Keine Preis-/Versandaenderung.
- Baumspende: Saison 2026 geschlossen, keine freien Plaetze oder erfundene
  Vollbelegung angezeigt. Das Formular ist verborgen/inert und der Flow startet
  nicht. Bereits vereinbarte Projekte werden nicht abgesagt. Nur Deutsch.
- Pitmaster Board ist als sachlicher BBQ-Begriff in der deutschen Barbecue-
  Seite und dem englischen Butcher-Block-Ratgeber ergaenzt.
- Bestehende englische Gastroseite bewusst nicht neu ausgerichtet oder entfernt.
- Geschenkboxfoto und Firmenreferenz unveraendert: auf ausdrueckliche Bildfreigabe
  warten; keine neue Etsy-Fotoauswahl, kein erfundenes Kundenstatement.

## Designpruefung und Grenzen

Der aktuelle gemeinsame Design-Build umfasst 152 Seiten, davon 149 indexierbar.
Der automatisierte Legacy-Check findet in diesem Build keine alten Typografie-
oder Stylesheet-Befunde. Das ist kein Beweis dafuer, dass alle Sprachseiten
inhaltlich identisch sind. Die konkrete Sprachmatrix ist deshalb separat in
`language-design-audit-2026-11-09.json` erfasst.

Bei der visuellen Abnahme wurde eine zweizeilige Desktop-Kopfzeile entdeckt und
im gemeinsamen Grid korrigiert. Neue Browserassertionen pruefen die Kopfzeile,
mobile Ueberlaeufe, sichtbare Pflicht-Budgetfelder und die geschlossene Annahme.

## Weiterhin ausstehend, ausdruecklich nicht als fertig bezeichnet

Acht freigegebene redaktionelle Seiten haben noch keine eigene englische URL:
Massanfertigung, Pfannenwender, Gravur, Kuechenaccessoires, Nussbaum-Ratgeber,
Barbecue-Geschenk, hochwertige Holzgeschenke und Presse. Die englischen
Produktdetailseiten fuer Pfannenwender/Nussbaum etc. existieren bereits; sie
ersetzen nicht automatisch einen uebersetzten Ratgeber.

Bestehende Paare mit unterschiedlicher Quellstruktur: Erbstueck, Pflege,
Aufbereitung, Teigschaber, Holzarten, Stirnholz/Langholz, Holz statt Plastik und
Produktuebersicht. Unterschiede muessen in der naechsten Uebersetzungsrunde
inhaltlich eingeordnet werden. Eine andere Anzahl von Wrapper-Sections allein
ist noch kein Designfehler.

Die Tresenvorschau ist eine gemeinsame interaktive Anwendung. Fuer sie bleibt
ein eigener Sprach-/Funktionsdurchlauf offen. Kein Erkennungsalgorithmus wurde
in dieser Runde geaendert.

Eine automatische Bestandsanzeige pro Holzart wird nicht weiterverfolgt:
auf Produktseiten nur Holzarten und Verweis auf verbindliche Etsy-Auswahl,
keine Live-Mengen. Startkarten bleiben ohne Mengen. Shop bis neues Jahr vertagt.

## Release

Die vorige PR-Version a948ed4 bestand GitHub Validate static site. Dieser
zusaetzliche Teilumfang braucht einen eigenen Commit und CI-Durchlauf. Keine
Live-Veroeffentlichung, DNS-, Stripe- oder Zahlungsveraenderung.
