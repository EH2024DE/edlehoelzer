export const english = new URLSearchParams(location.search).get('lang') === 'en';
const messages = {
  'Die vier Ecken müssen ein Rechteck in der angegebenen Reihenfolge umschließen. Prüfe auch die Maße.':'The four corners must enclose a rectangle in the specified order. Check the dimensions too.',
  'Bitte ein JPEG-, PNG- oder WebP-Foto wählen. HEIC vorher als JPEG exportieren.':'Choose a JPEG, PNG or WebP photo. Export HEIC as JPEG first.',
  'Dein Brett im Raum':'Your board in your kitchen', 'Vorschau':'Preview',
  'Passt das Brett auf deinen Tresen?':'Will this board fit your worktop?',
  'Holzbild, Platzbedarf und Stärke gemeinsam betrachten.':'See the wood, footprint and thickness together.',
  '3D-Ansicht':'3D view', 'Dein Tresen':'Your worktop', 'Freie 3D-Ansicht':'3D view',
  'Vollbildansicht öffnen':'Open fullscreen', 'Vollbildansicht schließen':'Close fullscreen',
  'Bedienung ausblenden':'Hide controls', 'Bedienung einblenden':'Show controls',
  'Ansicht zurücksetzen':'Reset view', 'Referenzfläche markieren':'Mark reference area',
  'Drehung':'Rotation', 'Holzfarbe':'Wood colour', 'Holzfarbe von wärmer zu neutraler':'Wood colour from warmer to more neutral',
  'wärmer ↔ neutraler':'warmer ↔ more neutral', 'Modell wird vorbereitet …':'Preparing model…',
  'Holzansicht wird vorbereitet …':'Preparing wood preview…', 'Ansicht herunterladen':'Download view',
  'Dieses Brett im Shop kaufen':'Buy this board in the shop', 'Brett auswählen':'Choose a board',
  'Tresenfoto auswählen':'Choose worktop photo', 'A4-Blatt im Foto suchen':'Find A4 paper in photo',
  'Ecken vergrößert setzen':'Adjust corners up close', 'Referenzmaße und Hinweise':'Reference dimensions and notes',
  'Breite (cm)':'Width (cm)', 'Tiefe (cm)':'Depth (cm)',
  'Lange / kurze Blattkante tauschen':'Swap long / short paper edge', 'Referenz ist weißes Papier':'Reference is white paper',
  'Brett auf den Tresen setzen':'Place board on worktop', 'Referenz korrigieren':'Adjust reference',
  'Farbannäherung, keine farbverbindliche Vorschau. 0 % zeigt die warme Studioaufnahme.':'Approximate colours, not a colour-accurate preview. 0% shows the warm studio photo.',
  'Genauigkeit der Vorschau':'Preview accuracy', 'Dein Foto bleibt in diesem Browser. Es wird nicht hochgeladen.':'Your photo stays in this browser. It is not uploaded.',
  'Prototyp zur Entscheidungshilfe, kein Aufmaß.':'A decision aid, not a precise measurement.',
  'Lege ein A4-Blatt flach auf den Tresen. Ziehe die vier Punkte auf seine Ecken: hinten links, hinten rechts, vorne rechts, vorne links. Richte die hintere Blattkante parallel zur vorderen Tresenkante aus. Ein bedrucktes weißes Blatt mit freiem weißen Rand ist meist ebenfalls geeignet.':'Lay an A4 sheet flat on the worktop. Match its four corners: back left, back right, front right, front left. Align its back edge with the front edge of the worktop. Printed white paper with a clear white margin usually works too.',
  'Die Grundfläche folgt deinen Referenzpunkten. Die Höhenwirkung wird aus der Fotoperspektive geschätzt, nicht vermessen. Holzfarbe, Seitenmaserung, Rundungen und Schatten sind Annäherungen; Füße und Griffmulden sind nicht modelliert.':'The footprint follows your reference points. Height is estimated from the photo perspective, not measured. Wood colour, side grain, rounded edges and shadows are approximate; feet and grip recesses are not modelled.',
  'Für dein Foto: normale 1×-Kamera, schräg von oben, alle vier Referenzecken sichtbar. Keine Panorama- oder Ultraweitwinkelaufnahme. Die Referenz muss auf derselben Fläche wie das Brett liegen.':'Use the normal 1× camera, looking down at an angle, with all four reference corners visible. Avoid panorama and ultrawide photos. The reference must lie on the same surface as the board.',
  'Ziehen zum Betrachten · Scrollen zum Zoomen. Seitenholz und Details sind angenähert.':'Drag to rotate · Scroll to zoom. Side grain and details are approximate.',
  'Die Punkte auf die vier Referenzecken ziehen.':'Drag the points onto the four reference corners.',
  'Brett auf der Arbeitsplatte verschieben. Höhenwirkung geschätzt; keine exakte Vermessung.':'Move the board on your worktop. Height is estimated, not precisely measured.',
  'Dein Foto · Perspektivische Annäherung':'Your photo · Approximate perspective',
  'Das Foto konnte nicht geöffnet werden. Bitte als JPEG versuchen.':'The photo could not be opened. Please try JPEG.',
  'Referenz übernommen. Du kannst das Brett jetzt auf dem Tresen verschieben.':'Reference confirmed. You can now move the board on your worktop.',
  'Bitte zuerst die Referenzfläche bestätigen.':'Please confirm the reference area first.',
  'Die Blattecken werden gesucht …':'Looking for the paper corners…',
  'Kleinen Augenblick – wir hobeln noch. Die Blattecken werden gesucht.':'A moment, we are still at the workbench. Looking for the paper corners.',
  'Blattecken vorgeschlagen. Bitte alle vier Ecken und die lange Kante kontrollieren, dann bestätigen.':'Corners suggested. Check all four corners and the long edge, then confirm.',
  'Kein eindeutiges Blatt gefunden. Über „Ecken vergrößert setzen“ kannst du das Blatt heranholen.':'No clear paper reference found. Use “Adjust corners up close” to zoom in.',
  'Automatische Erkennung nicht verfügbar. Die Ecken können manuell gesetzt werden.':'Automatic detection is unavailable. You can set the corners manually.',
  'Ecken angepasst. Bitte Referenz bestätigen.':'Corners adjusted. Please confirm the reference.',
  'Brettvorschau':'Board preview', 'Schließen':'Close', 'Anderes Brett auswählen':'Choose another board',
  'Die Produktansicht konnte nicht geladen werden. Bitte neu laden.':'The product preview could not be loaded. Please reload.',
  'Blattecken präzisieren':'Adjust paper corners', 'Tippe auf das Blatt, um es zu vergrößern.':'Tap the paper to zoom in.',
  'Vergrößerte Referenzfläche':'Enlarged reference area', 'Ecke auswählen':'Choose corner',
  'Vergrößerung':'Zoom', 'Referenz vergrößern':'Zoom into reference',
  'Tippen setzt die Ecke. Ziehen verschiebt den Ausschnitt.':'Tap to set a corner. Drag to move the view.',
  'Ecken übernehmen':'Confirm corners',
  'Wähle eine Ecke und tippe auf ihre genaue Position. Der Ausschnitt lässt sich verschieben.':'Choose a corner and tap its exact position. Drag to move the view.',
  'Ecke wählen und genau setzen. Ziehen verschiebt den Ausschnitt.':'Choose and position a corner. Drag to move the view.'
};
export function t(value) { return english ? messages[value.replace(/\s+/g,' ').trim()] || value : value; }
export function translateDOM(root) {
  if (!english) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node; (node = walker.nextNode());) {
    if (node.parentElement?.closest('script,style')) continue;
    const translated = t(node.textContent);
    if (translated !== node.textContent) node.textContent = translated;
  }
  for (const el of root.querySelectorAll('[aria-label],[title],[alt]')) {
    for (const attr of ['aria-label','title','alt']) if (el.hasAttribute(attr)) el.setAttribute(attr,t(el.getAttribute(attr)));
  }
}
if (english) { document.documentElement.lang='en'; document.title='Your board in your kitchen | Edle Hölzer'; translateDOM(document.body); }
