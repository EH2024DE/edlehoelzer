# Play-Button und Disclosure-Bewegung

3. November 2026, Designbranch, nur Vorschau.

- Produktvideos öffnen über einen mittigen 56-px-Play-Button mit vorhandenem Lucide-Icon. Kein sichtbarer Textbanner oder Emoji. Zugänglicher Name und Tooltip bleiben in DE/EN vorhanden.
- Auch Desktop-Produktvideos starten erst nach Betätigung des Play-Buttons. Der getrennte Hovervideo-Effekt auf Produktkarten bleibt unverändert.
- Native Details, „Mehr lesen“ und FAQ-Antworten öffnen und schließen in 240 ms. Dauer zentral als `--duration-disclosure` definiert. Native Details bleiben ohne JavaScript nutzbar.
- Eine laufende Animation kann umgekehrt werden, ohne feste Resthöhe oder abgeschnittenen Inhalt zu hinterlassen. Beim Wechsel zwischen mobilen Accordions und Desktop-Tabs wird eine laufende Animation aufgeräumt.
- `prefers-reduced-motion: reduce` schaltet unmittelbar um. Keine neue Library, keine Scroll-Reveals mit anfänglich unsichtbarem Seiteninhalt.

Prüfung: 123 Node-Tests bestanden. Acht Browserfälle (DE/EN, 375/1440 px,
normale/reduzierte Bewegung) einschließlich Play per Tastatur, Öffnen/Schließen,
schnellem Umkehren, FAQ und nativen Kapitel-Accordions bestanden. Play-Button
auf Mobile visuell geprüft. Keine Preise, Bestände oder Checkout-Regeln geändert.
