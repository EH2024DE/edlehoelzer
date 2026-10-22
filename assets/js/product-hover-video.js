(function () {
  "use strict";
  var desktop = window.matchMedia("(hover: hover) and (pointer: fine)");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var connection = navigator.connection;
  var active = null;
  var video = null;
  var timer = null;

  function allowed() {
    return desktop.matches && !reducedMotion.matches && !(connection && connection.saveData) && !document.hidden;
  }

  function stop() {
    clearTimeout(timer);
    timer = null;
    if (active) active.classList.remove("is-video-playing");
    active = null;
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.load();
      video.remove();
      video = null;
    }
  }

  function mediaAt(target) {
    return target && target.closest ? target.closest("[data-product-hover-video]") : null;
  }

  document.addEventListener("pointerover", function (event) {
    var media = mediaAt(event.target);
    if (!media || media === active || event.pointerType !== "mouse" || !allowed()) return;
    stop();
    active = media;
    // No video element or request until the pointer has deliberately lingered.
    timer = setTimeout(function () {
      if (active !== media || !media.isConnected || !allowed()) { stop(); return; }
      var player = document.createElement("video");
      video = player;
      player.className = "productCard__hoverVideo";
      player.muted = true;
      player.defaultMuted = true;
      player.loop = true;
      player.playsInline = true;
      player.preload = "none";
      player.setAttribute("aria-hidden", "true");
      player.setAttribute("tabindex", "-1");
      player.addEventListener("playing", function () {
        if (video === player && active === media) media.classList.add("is-video-playing");
      });
      player.addEventListener("error", function () { if (video === player) stop(); });
      player.src = media.getAttribute("data-product-hover-video");
      media.appendChild(player);
      var playback = player.play();
      if (playback && playback.catch) playback.catch(function () { if (video === player) stop(); });
    }, 300);
  });

  document.addEventListener("pointerout", function (event) {
    if (active && mediaAt(event.target) === active && !active.contains(event.relatedTarget)) stop();
  });
  document.addEventListener("click", stop, true);
  document.addEventListener("visibilitychange", stop);
  document.addEventListener("scroll", stop, true);
  window.addEventListener("blur", stop);
  window.addEventListener("resize", stop);
  window.addEventListener("pagehide", stop);
  desktop.addEventListener("change", stop);
  reducedMotion.addEventListener("change", stop);
  if (connection && connection.addEventListener) connection.addEventListener("change", stop);
}());

(function () {
  "use strict";
  var mobile = window.matchMedia("(max-width: 768px), (hover: none)");
  var originals = new Map();
  var english = (document.documentElement.lang || "").indexOf("en") === 0;
  var visibility = typeof IntersectionObserver === "function" ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) { if (!entry.isIntersecting) entry.target.querySelectorAll("video").forEach(function (v) { v.pause(); }); });
  }, { threshold: 0.1 }) : null;

  function enhance() {
    if (!mobile.matches) return;
    document.querySelectorAll("[data-product-card-gallery]").forEach(function (media) {
      var items;
      try { items = JSON.parse(media.getAttribute("data-product-card-gallery")); } catch (error) { return; }
      if (!Array.isArray(items) || items.length < 2) return;
      var original = media.parentElement.matches(".productCard__previewLink") ? media.parentElement : media;
      var gallery = document.createElement("div");
      gallery.className = "productCard__swipeGallery";
      gallery.setAttribute("role", "region");
      gallery.setAttribute("aria-label", english ? "Product photos and videos" : "Produktfotos und Videos");
      var track = document.createElement("div");
      track.className = "productCard__swipeTrack";
      var alt = media.querySelector("img") ? media.querySelector("img").alt : "";
      var detailTrigger = original.matches("[data-product-preview]") ? original :
        original.querySelector("[data-product-preview]");
      if (!detailTrigger) {
        var card = original.closest(".productCard, .finderMatchCard, .finderNear");
        detailTrigger = card && card.querySelector("[data-product-preview]");
      }
      items.forEach(function (item, index) {
        var opensDetail = item.type !== "video" && detailTrigger;
        var slide = document.createElement(opensDetail ? "button" : "div");
        slide.className = "productCard__slide";
        if (opensDetail) {
          slide.type = "button";
          ["data-product-preview", "data-product-source", "data-product-reason"].forEach(function (name) {
            if (detailTrigger.hasAttribute(name)) slide.setAttribute(name, detailTrigger.getAttribute(name));
          });
          slide.setAttribute("aria-label", (english ? "View product: " : "Produkt ansehen: ") + alt + " (" + (index + 1) + " / " + items.length + ")");
        } else {
          slide.setAttribute("role", "group");
          slide.setAttribute("aria-label", (index + 1) + " / " + items.length);
        }
        var content = document.createElement(item.type === "video" ? "video" : "img");
        if (item.type === "video") {
          content.controls = true;
          content.playsInline = true;
          content.muted = true;
          content.preload = "none";
          content.poster = item.poster;
          content.setAttribute("aria-label", english ? "Product video: " + alt : (item.alt || "Produktvideo"));
          content.addEventListener("play", function () {
            document.querySelectorAll(".productCard__swipeGallery video").forEach(function (other) { if (other !== content) other.pause(); });
          });
        } else {
          content.alt = alt;
          content.loading = "lazy";
          content.decoding = "async";
        }
        content.src = item.src;
        slide.appendChild(content);
        track.appendChild(slide);
      });
      var toolbar = document.createElement("div");
      toolbar.className = "productCard__galleryNav";
      var count = document.createElement("span");
      count.className = "productCard__galleryStatus";
      count.setAttribute("aria-live", "polite");
      var dots = items.map(function (_, index) {
        var dot = document.createElement("span");
        dot.className = "productCard__galleryDot";
        dot.setAttribute("aria-hidden", "true");
        toolbar.appendChild(dot);
        return dot;
      });
      var current = 0;
      function update() {
        var next = Math.max(0, Math.min(items.length - 1, Math.round(track.scrollLeft / (track.clientWidth || 1))));
        if (next === current && count.textContent) return;
        if (current !== next) track.querySelectorAll("video").forEach(function (v) { v.pause(); });
        current = next;
        count.textContent = (current + 1) + " / " + items.length;
        dots.forEach(function (dot, index) { dot.classList.toggle("is-active", index === current); });
      }
      function move(direction) {
        var target = Math.max(0, Math.min(items.length - 1, current + direction));
        track.scrollTo({ left: target * track.clientWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      }
      toolbar.appendChild(count);
      gallery.append(track, toolbar);
      var gestureStart = null;
      var swiped = false;
      track.addEventListener("pointerdown", function (event) {
        gestureStart = { x: event.clientX, y: event.clientY, scroll: track.scrollLeft };
        swiped = false;
      }, { passive: true });
      track.addEventListener("pointermove", function (event) {
        if (gestureStart && Math.hypot(event.clientX - gestureStart.x, event.clientY - gestureStart.y) > 10) swiped = true;
      }, { passive: true });
      track.addEventListener("scroll", function () {
        if (gestureStart && Math.abs(track.scrollLeft - gestureStart.scroll) > 10) swiped = true;
      }, { passive: true });
      track.addEventListener("click", function (event) {
        if (swiped && event.detail !== 0) {
          event.preventDefault();
          event.stopPropagation();
        }
      }, true);
      track.addEventListener("scroll", update, { passive: true });
      track.addEventListener("keydown", function (event) {
        if (event.target.tagName === "VIDEO") return;
        if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
        if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
      });
      track.tabIndex = 0;
      originals.set(gallery, original);
      original.replaceWith(gallery);
      if (visibility) visibility.observe(gallery);
      update();
    });
  }
  mobile.addEventListener("change", function () {
    originals.forEach(function (original, gallery) {
      gallery.querySelectorAll("video").forEach(function (v) { v.pause(); });
      if (visibility) visibility.unobserve(gallery);
      if (gallery.isConnected) gallery.replaceWith(original);
    });
    originals.clear();
    enhance();
  });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) document.querySelectorAll(".productCard__swipeGallery video").forEach(function (v) { v.pause(); });
  });
  new MutationObserver(function () {
    originals.forEach(function (original, gallery) {
      if (!gallery.isConnected) {
        gallery.querySelectorAll("video").forEach(function (v) { v.pause(); });
        if (visibility) visibility.unobserve(gallery);
        originals.delete(gallery);
      }
    });
    enhance();
  }).observe(document.body, { childList: true, subtree: true });
  enhance();
}());
