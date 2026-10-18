# Full-viewport product photo viewer

The product-detail photo is a keyboard-accessible enlarge button. Mobile card
galleries also have an enlarge icon for the current photo; it is hidden on video
slides. The existing card CTA, comparison, purchase and analytics paths are not
changed. Detail videos keep their existing controls.

The viewer is a native modal dialog. It loads one original-resolution photo at
a time, requesting Etsy's full-size URL only after opening. It falls back to the
existing preview URL on failure. Photos initially fit entirely in the viewport,
with their original aspect ratio. The square card crops are not used in this view.

Controls: zoom in/out (up to 6x the fitted view), reset, previous/next photo and
close. Desktop supports dragging, wheel zoom centered at the pointer, double-click
zoom, +/-/0 keys and arrow-key photo navigation. Touch supports pinch zoom,
dragging and double-tap zoom. The underlying page is locked while open; closing
restores its scroll-lock state and focuses the invoking button. Escape does not
also close the product-detail overlay underneath. Native modal focus handling
keeps keyboard users in the viewer.

Seven local Lucide SVG icons and their upstream license are included. There is
no new runtime dependency or framework. Error/loading status is localized DE/EN.

Tests: geometry fits, natural-resolution handling, pan/zoom boundaries,
pointer-centered zoom and original-image URL selection. Browser verification
covers desktop detail entry, mobile-card entry, high-resolution loading, zoom,
dragging, reset, photo navigation, Escape/focus restoration and responsive bounds.
Physical multi-touch iPhone Safari testing remains an owner check.
