(function () {
  "use strict";
  function fit(naturalWidth, naturalHeight, width, height) {
    var factor = Math.min((width - 24) / naturalWidth, (height - 24) / naturalHeight, 1);
    return { width: naturalWidth * Math.max(0, factor), height: naturalHeight * Math.max(0, factor) };
  }
  function constrain(state, size, viewport) {
    var scale = Math.max(1, Math.min(6, state.scale));
    var maxX = Math.max(0, (size.width * scale - viewport.width) / 2);
    var maxY = Math.max(0, (size.height * scale - viewport.height) / 2);
    return { scale: scale, x: Math.max(-maxX, Math.min(maxX, state.x)), y: Math.max(-maxY, Math.min(maxY, state.y)) };
  }
  function zoom(state, target, point, size, viewport) {
    var scale = Math.max(1, Math.min(6, target));
    var ratio = scale / state.scale;
    return constrain({ scale: scale, x: point.x - (point.x - state.x) * ratio, y: point.y - (point.y - state.y) * ratio }, size, viewport);
  }
  function originalUrl(src) {
    return String(src || "").replace(/^(https:\/\/i\.etsystatic\.com\/.+\/)il_\d+xN\./, "$1il_fullxfull.");
  }
  if (typeof module !== "undefined" && module.exports) module.exports = { fit: fit, constrain: constrain, zoom: zoom, originalUrl: originalUrl };
  if (typeof document === "undefined") return;
  var english = (document.documentElement.lang || "").indexOf("en") === 0;
  var dialog, stage, photo, status, title, position, scaleLabel, previous, following, zoomIn, zoomOut;
  var photos = [], index = 0, opener, oldOverflow, state = { scale: 1, x: 0, y: 0 }, size = { width: 0, height: 0 };
  var pointers = new Map(), pinch = null, tap = null, moved = false, lastTouch = 0;
  function viewport() { return { width: stage.clientWidth, height: stage.clientHeight }; }
  function button(icon, label) {
    var element = document.createElement("button");
    element.type = "button";
    element.setAttribute("aria-label", label);
    element.title = label;
    var img = document.createElement("img");
    img.src = "/assets/icons/lucide/" + icon + ".svg";
    img.alt = "";
    element.appendChild(img);
    return element;
  }
  function draw() {
    state = constrain(state, size, viewport());
    photo.style.width = size.width + "px";
    photo.style.height = size.height + "px";
    photo.style.transform = "translate(-50%, -50%) translate(" + state.x + "px," + state.y + "px) scale(" + state.scale + ")";
    stage.classList.toggle("is-zoomed", state.scale > 1);
    var label = Math.round(state.scale * 100) + "%";
    if (scaleLabel.textContent !== label) scaleLabel.textContent = label;
    zoomIn.disabled = state.scale >= 6 || !size.width;
    zoomOut.disabled = state.scale <= 1 || !size.width;
  }
  function reset() { state = { scale: 1, x: 0, y: 0 }; draw(); }
  function zoomAt(target, clientX, clientY) {
    var box = stage.getBoundingClientRect();
    var point = { x: clientX == null ? 0 : clientX - box.left - box.width / 2, y: clientY == null ? 0 : clientY - box.top - box.height / 2 };
    state = zoom(state, target, point, size, viewport());
    draw();
  }
  function show(nextIndex) {
    index = Math.max(0, Math.min(photos.length - 1, nextIndex));
    pointers.clear(); pinch = null; tap = null;
    state = { scale: 1, x: 0, y: 0 }; size = { width: 0, height: 0 };
    photo.hidden = true;
    status.textContent = english ? "Loading photo…" : "Foto wird geladen…";
    photo.alt = photos[index].alt;
    title.textContent = photos[index].alt || (english ? "Product photo" : "Produktfoto");
    position.textContent = (index + 1) + " / " + photos.length;
    previous.disabled = index === 0;
    following.disabled = index === photos.length - 1;
    var source = originalUrl(photos[index].src);
    photo.onload = function () {
      size = fit(photo.naturalWidth, photo.naturalHeight, stage.clientWidth, stage.clientHeight);
      photo.hidden = false;
      status.textContent = "";
      draw();
    };
    photo.onerror = function () {
      if (photo.getAttribute("src") !== photos[index].src) { photo.src = photos[index].src; return; }
      status.textContent = english ? "This photo could not be loaded." : "Dieses Foto konnte nicht geladen werden.";
    };
    photo.src = source;
    draw();
  }
  function close() { if (dialog && dialog.open) dialog.close(); }
  function create() {
    dialog = document.createElement("dialog");
    dialog.className = "productPhotoViewer";
    dialog.setAttribute("aria-label", english ? "Product photos" : "Produktfotos");
    var header = document.createElement("div"); header.className = "productPhotoViewer__header";
    title = document.createElement("p"); title.className = "productPhotoViewer__title";
    position = document.createElement("span"); position.className = "productPhotoViewer__position"; position.setAttribute("aria-live", "polite");
    var exit = button("x", english ? "Close photo view" : "Fotoansicht schließen"); exit.addEventListener("click", close);
    header.append(title, position, exit);
    stage = document.createElement("div"); stage.className = "productPhotoViewer__stage";
    photo = document.createElement("img"); photo.className = "productPhotoViewer__image"; photo.draggable = false;
    status = document.createElement("div"); status.className = "productPhotoViewer__status"; status.setAttribute("role", "status");
    stage.append(photo, status);
    var toolbar = document.createElement("div"); toolbar.className = "productPhotoViewer__toolbar";
    previous = button("chevron-left", english ? "Previous photo" : "Vorheriges Foto"); previous.addEventListener("click", function () { show(index - 1); });
    following = button("chevron-right", english ? "Next photo" : "Nächstes Foto"); following.addEventListener("click", function () { show(index + 1); });
    zoomOut = button("zoom-out", english ? "Zoom out" : "Verkleinern"); zoomOut.addEventListener("click", function () { zoomAt(state.scale / 1.5); });
    zoomIn = button("zoom-in", english ? "Zoom in" : "Vergrößern"); zoomIn.addEventListener("click", function () { zoomAt(state.scale * 1.5); });
    var restore = button("rotate-ccw", english ? "Fit photo" : "Ganzes Foto anzeigen"); restore.addEventListener("click", reset);
    scaleLabel = document.createElement("span"); scaleLabel.className = "productPhotoViewer__scale";
    toolbar.append(previous, zoomOut, scaleLabel, zoomIn, restore, following);
    dialog.append(header, stage, toolbar);
    dialog.addEventListener("cancel", function (event) { event.preventDefault(); close(); });
    dialog.addEventListener("close", function () {
      document.body.style.overflow = oldOverflow;
      photo.onload = null; photo.onerror = null; photo.removeAttribute("src");
      pointers.clear(); pinch = null;
      if (opener && opener.isConnected) opener.focus({ preventScroll: true });
    });
    dialog.addEventListener("keydown", function (event) {
      if (["ArrowLeft", "ArrowRight", "+", "=", "-", "0"].indexOf(event.key) < 0) return;
      event.preventDefault(); event.stopPropagation();
      if (event.key === "ArrowLeft") show(index - 1);
      else if (event.key === "ArrowRight") show(index + 1);
      else if (event.key === "0") reset();
      else zoomAt(state.scale * (event.key === "-" ? 1 / 1.5 : 1.5));
    });
    stage.addEventListener("wheel", function (event) { event.preventDefault(); zoomAt(state.scale * Math.exp(-event.deltaY * .002), event.clientX, event.clientY); }, { passive: false });
    stage.addEventListener("dblclick", function (event) {
      if (Date.now() - lastTouch < 600) return;
      zoomAt(state.scale > 1 ? 1 : 2.5, event.clientX, event.clientY);
    });
    stage.addEventListener("pointerdown", function (event) {
      if (event.button && event.pointerType === "mouse") return;
      if (event.pointerType === "touch") lastTouch = Date.now();
      stage.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      moved = false; pinch = null;
      stage.classList.add("is-dragging");
    });
    stage.addEventListener("pointermove", function (event) {
      if (!pointers.has(event.pointerId)) return;
      var old = pointers.get(event.pointerId);
      var dx = event.clientX - old.x, dy = event.clientY - old.y;
      if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      var points = Array.from(pointers.values());
      if (points.length === 2) {
        var distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
        var center = { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 };
        if (pinch && pinch.distance) {
          state.x += center.x - pinch.x; state.y += center.y - pinch.y;
          zoomAt(state.scale * distance / pinch.distance, center.x, center.y);
        }
        pinch = { distance: distance, x: center.x, y: center.y };
      } else if (points.length === 1 && state.scale > 1) {
        state.x += dx; state.y += dy; draw();
      }
    });
    function release(event) {
      if (!pointers.has(event.pointerId)) return;
      var multi = pointers.size > 1;
      pointers.delete(event.pointerId); pinch = null;
      stage.classList.remove("is-dragging");
      if (!multi && !moved && event.pointerType === "touch" && event.type === "pointerup") {
        var now = Date.now();
        if (tap && now - tap.time < 300 && Math.hypot(event.clientX - tap.x, event.clientY - tap.y) < 24) {
          zoomAt(state.scale > 1 ? 1 : 2.5, event.clientX, event.clientY); tap = null;
        } else tap = { time: now, x: event.clientX, y: event.clientY };
      }
    }
    stage.addEventListener("pointerup", release);
    stage.addEventListener("pointercancel", release);
    new ResizeObserver(function () {
      if (!dialog.open || !photo.naturalWidth) return;
      size = fit(photo.naturalWidth, photo.naturalHeight, stage.clientWidth, stage.clientHeight); draw();
    }).observe(stage);
    document.body.appendChild(dialog);
  }
  document.addEventListener("click", function (event) {
    var trigger = event.target.closest("[data-photo-viewer]");
    if (!trigger) return;
    event.preventDefault(); event.stopPropagation();
    var gallery = trigger.closest(".productCard__swipeGallery");
    var preview = trigger.closest(".productPreview");
    var current;
    if (gallery) {
      photos = Array.from(gallery.querySelectorAll(".productCard__slide > img")).map(function (img) { return { src: img.src, alt: img.alt }; });
      var track = gallery.querySelector(".productCard__swipeTrack");
      var slide = track.children[Math.round(track.scrollLeft / track.clientWidth)];
      current = slide && slide.querySelector("img");
    } else if (preview) {
      photos = Array.from(preview.querySelectorAll('[data-preview-type="image"]')).map(function (b) { return { src: b.getAttribute("data-preview-src"), alt: b.getAttribute("data-preview-alt") }; });
      current = trigger.querySelector("img[data-preview-main]");
    }
    if (!current) return;
    var selected = current.getAttribute("src");
    if (!photos.some(function (p) { return p.src === selected || p.src === current.src; })) photos.unshift({ src: selected, alt: current.alt });
    var seen = new Set();
    photos = photos.filter(function (p) { var key = originalUrl(p.src); if (seen.has(key)) return false; seen.add(key); return true; });
    var selectedIndex = photos.findIndex(function (p) { return originalUrl(p.src) === originalUrl(selected) || originalUrl(p.src) === originalUrl(current.src); });
    if (!dialog) create();
    document.querySelectorAll('.productCard__swipeGallery video, .productPreview video').forEach(function (video) { video.pause(); });
    opener = trigger; oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    show(selectedIndex < 0 ? 0 : selectedIndex);
  }, true);
}());
