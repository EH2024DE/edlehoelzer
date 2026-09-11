(function () {
  "use strict";
  document.addEventListener("click", function (event) {
    var link = event.target.closest && event.target.closest("a[data-summary-cta], a[data-cta-location='summary']");
    if (!link || !window.EdleAnalytics) return;
    // Never forward mailto bodies, budgets or other free-text inquiry data.
    var destination = new URL(link.href, window.location.href);
    window.EdleAnalytics.track("summary_cta_click", {
      cta_location: "summary",
      source: destination.protocol === "mailto:" ? "email" : destination.pathname + destination.hash,
      host: destination.hostname || "email",
      label: link.textContent.trim()
    });
  });
})();
