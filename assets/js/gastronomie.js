(function () {
  "use strict";
  document.querySelectorAll("[data-gastro-carousel]").forEach(function (track) {
    var controls = document.querySelector('[data-carousel-controls="' + track.id + '"]');
    if (!controls) return;
    var previous = controls.querySelector("[data-carousel-prev]");
    var next = controls.querySelector("[data-carousel-next]");
    var position = controls.querySelector("[data-carousel-position]");
    function slides() { return Array.from(track.children).filter(function (child) { return child.tagName === "ARTICLE"; }); }
    function current(items) {
      var max = Math.max(0, track.scrollWidth - track.clientWidth);
      var nearest = 0;
      items.forEach(function (item, index) {
        var offset = Math.min(max, item.offsetLeft - items[0].offsetLeft);
        var best = Math.min(max, items[nearest].offsetLeft - items[0].offsetLeft);
        if (Math.abs(offset - track.scrollLeft) < Math.abs(best - track.scrollLeft)) nearest = index;
      });
      return nearest;
    }
    function update() {
      var items = slides();
      var index = items.length ? current(items) : 0;
      previous.disabled = index === 0;
      next.disabled = !items.length || index === items.length - 1;
      var label = (items.length ? index + 1 : 0) + " / " + items.length;
      if (position.textContent !== label) position.textContent = label;
    }
    function go(index) {
      var items = slides();
      if (!items.length) return;
      index = Math.max(0, Math.min(items.length - 1, index));
      track.scrollTo({left: items[index].offsetLeft - items[0].offsetLeft, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
    }
    previous.addEventListener("click", function () { go(current(slides()) - 1); });
    next.addEventListener("click", function () { go(current(slides()) + 1); });
    track.addEventListener("keydown", function (event) {
      if (event.target !== track || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      var index = current(slides());
      go(event.key === "Home" ? 0 : event.key === "End" ? slides().length - 1 : index + (event.key === "ArrowRight" ? 1 : -1));
    });
    track.addEventListener("scroll", update, {passive: true});
    new MutationObserver(update).observe(track, {childList: true});
    if ("ResizeObserver" in window) new ResizeObserver(update).observe(track);
    update();
  });
})();
