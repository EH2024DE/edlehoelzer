(function () {
  "use strict";
  document.querySelectorAll("[data-gastro-carousel]").forEach(function (track) {
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
    function go(index) {
      var items = slides();
      if (!items.length) return;
      index = Math.max(0, Math.min(items.length - 1, index));
      track.scrollTo({left: items[index].offsetLeft - items[0].offsetLeft, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
    }
    track.addEventListener("keydown", function (event) {
      if (track.scrollWidth <= track.clientWidth + 1 || event.target !== track || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      var index = current(slides());
      go(event.key === "Home" ? 0 : event.key === "End" ? slides().length - 1 : index + (event.key === "ArrowRight" ? 1 : -1));
    });
  });
  var isEnglish = document.documentElement.lang === "en";
  var form = document.querySelector("[data-board-inquiry]");
  if (!form) return;
  var idea = form.elements.product_idea;
  var description = form.querySelector("[data-gastro-description]");
  var anchor = form.querySelector("[data-gastro-description-anchor]");
  var optional = form.querySelector("[data-gastro-optional-message]");
  function updateDescription() {
    var required = ["noch offen", "Individuelle Sonderlösung", "undecided", "Bespoke solution"].includes(idea.value);
    form.elements.message.required = required;
    description.querySelector("[data-gastro-description-label]").textContent = required ? (isEnglish ? "Description (required)" : "Beschreibung (Pflichtfeld)") : (isEnglish ? "Description / message (optional)" : "Beschreibung / Nachricht (optional)");
    document.getElementById("gastro-description-help").hidden = !required;
    if (required) anchor.after(description);
    else optional.append(description);
  }
  idea.addEventListener("change", updateDescription);
  form.addEventListener("reset", function () { setTimeout(updateDescription, 0); });
  updateDescription();
})();
