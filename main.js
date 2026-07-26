document.documentElement.classList.add("js");

var EDLE_HOELZER_PRODUCTS_URL = "/products.json?v=20260723-tech-repair";

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

document.addEventListener("DOMContentLoaded", function () {
  var menuButton = document.getElementById("menuButton");
  var closeButton = document.getElementById("menuCloseButton");
  var mobileMenu = document.getElementById("mobileMenu");
  var menuBackdrop = document.getElementById("menuBackdrop");

  function openMenu() {
    if (mobileMenu) {
      mobileMenu.classList.add("is-open");
    }
    if (menuBackdrop) {
      menuBackdrop.classList.add("is-open");
    }
    if (menuButton) {
      menuButton.setAttribute("aria-expanded", "true");
    }
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    if (mobileMenu) {
      mobileMenu.classList.remove("is-open");
    }
    if (menuBackdrop) {
      menuBackdrop.classList.remove("is-open");
    }
    if (menuButton) {
      menuButton.setAttribute("aria-expanded", "false");
    }
    document.body.style.overflow = "";
  }

  function toggleMenu() {
    if (!mobileMenu) {
      return;
    }

    var isOpen = mobileMenu.classList.contains("is-open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", toggleMenu);

    if (closeButton) {
      closeButton.addEventListener("click", closeMenu);
    }

    if (menuBackdrop) {
      menuBackdrop.addEventListener("click", closeMenu);
    }

    var menuLinks = mobileMenu.querySelectorAll("a");
    menuLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeMenu();
      }
    });
  }

  initCardWelcome();
  initProductExperience();
  initProductsPage();
  initHeroVideo();
  initReviewTrustStrips();
  initBackToTop();
  initStickyMobileCta();
  initHomepageReveal();
  initEtsyAttribution();

  if (window.innerWidth <= 900) {
    return;
  }

  var scrolly = document.querySelector(".scrolly");
  if (!scrolly) {
    return;
  }

  var frame = document.getElementById("scrollyFrame");
  var progressBar = document.getElementById("scrollyProgress");
  var images = Array.prototype.slice.call(
    scrolly.querySelectorAll(".scrolly__image")
  );
  var steps = Array.prototype.slice.call(
    scrolly.querySelectorAll(".scrollyStep")
  );

  if (!frame || !images.length || !steps.length) {
    return;
  }

  var activeIndex = 0;
  var ticking = false;
  var smooth = 0;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function activate(index) {
    if (index === activeIndex) {
      return;
    }

    activeIndex = index;

    images.forEach(function (img, i) {
      img.classList.toggle("is-active", i === index);
    });

    steps.forEach(function (step, i) {
      step.classList.toggle("is-active", i === index);
    });

    if (progressBar) {
      progressBar.style.width = (((index + 1) / images.length) * 100) + "%";
    }
  }

  function getClosestStepIndex() {
    var viewportCenter = window.innerHeight * 0.54;
    var closestIndex = 0;
    var closestDistance = Infinity;

    steps.forEach(function (step, index) {
      var rect = step.getBoundingClientRect();
      var center = rect.top + rect.height / 2;
      var distance = Math.abs(viewportCenter - center);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }

  function animateFrame() {
    if (reducedMotion) {
      return;
    }

    var rect = scrolly.getBoundingClientRect();
    var total = rect.height - window.innerHeight;

    if (total <= 0) {
      return;
    }

    var raw = (-rect.top) / total;
    raw = Math.max(0, Math.min(1, raw));
    smooth += (raw - smooth) * 0.07;

    var translateY = (smooth - 0.5) * -14;
    var scale = 1 + (1 - Math.abs(smooth - 0.5) * 2) * 0.008;

    frame.style.transform =
      "translate3d(0, " + translateY + "px, 0) scale(" + scale + ")";
  }

  function onScroll() {
    if (ticking) {
      return;
    }

    ticking = true;

    requestAnimationFrame(function () {
      activate(getClosestStepIndex());
      animateFrame();
      ticking = false;
    });
  }

  activate(0);
  animateFrame();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
});

function initEtsyAttribution() {
  var campaign = window.location.pathname
    .replace(/^\/+|\/+$/g, "")
    .replace(/\.html$/, "") || "homepage";

  function addAttribution(link) {
    try {
      var url = new URL(link.href, window.location.href);
      if (!/(^|\.)etsy\.com$/i.test(url.hostname)) {
        return;
      }

      if (!url.searchParams.has("utm_source")) {
        url.searchParams.set("utm_source", "edlehoelzer.de");
      }
      if (!url.searchParams.has("utm_medium")) {
        url.searchParams.set("utm_medium", "website");
      }
      if (!url.searchParams.has("utm_campaign")) {
        url.searchParams.set("utm_campaign", campaign);
      }

      link.href = url.toString();
    } catch (error) {
      // Keep the original checkout URL if a malformed link slips through.
    }
  }

  document.querySelectorAll("a[data-etsy-link]").forEach(function (link) {
    addAttribution(link);
  });

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[data-etsy-link]");
    if (link) {
      addAttribution(link);
    }
  });
}

function initHomepageReveal() {
  var items = document.querySelectorAll(".reveal-on-scroll");
  if (!items.length) {
    return;
  }

  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach(function (item) {
      item.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) {
        return;
      }

      var delay = Number(entry.target.getAttribute("data-reveal-delay") || 0);
      window.setTimeout(function () {
        entry.target.classList.add("is-visible");
      }, Math.min(delay, 240));
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px"
  });

  items.forEach(function (item) {
    observer.observe(item);
  });
}

function initStickyMobileCta() {
  var isGerman = (document.documentElement.lang || "de").toLowerCase().indexOf("en") !== 0;
  var path = window.location.pathname;
  var current = path === "/index.html" ? "/" : path;
  var ctas = {
    "/": { label: "Passendes Brett finden", href: "/produkte.html#produktfinder", secondary: "Produkte ansehen", secondaryHref: "/produkte.html#produkte-grid", event: "produktfinder-gestartet" },
    "/produkte.html": { label: "Passendes Brett finden", href: "#produktfinder", secondary: "Produkte ansehen", secondaryHref: "#produkte-grid", event: "produktfinder-gestartet" },
    "/schneidebretter-massivholz/": { label: "Schneidebretter ansehen", href: "#products-massivholz", secondary: "Individuelles Brett anfragen", secondaryHref: "mailto:info@edlehoelzer.de?subject=Anfrage%20Schneidebrett", event: null },
    "/schneidebrett-nach-mass/": { label: "Maßanfertigung anfragen", href: "mailto:info@edlehoelzer.de?subject=Anfrage%20Schneidebrett%20nach%20Ma%C3%9F", secondary: "Produkte ansehen", secondaryHref: "/produkte.html#produkte-grid", event: "email-kontakt" },
    "/schneidebrett-mit-gravur/": { label: "Gravierbares Brett ansehen", href: "#products-gravur", secondary: "B2B-Gravur anfragen", secondaryHref: "/b2b.html", event: null },
    "/erbstueck/": { label: "Erbstück anfragen", href: "mailto:info@edlehoelzer.de?subject=Anfrage%20Erbst%C3%BCck", secondary: "Verfügbare Stücke ansehen", secondaryHref: "#verfuegbare-hoelzer", event: "email-kontakt" },
    "/barbecue-geschenk/": { label: "BBQ-Brett ansehen", href: "#products-bbq", secondary: "Gravur anfragen", secondaryHref: "/schneidebrett-mit-gravur/", event: null },
    "/hochwertige-geschenke-holz/": { label: "Geschenk finden", href: "#products-geschenke", secondary: "Gravur ansehen", secondaryHref: "/schneidebrett-mit-gravur/", event: null },
    "/pflege.html": { label: "Pflegebalsam ansehen", href: "/produkte.html#produkte-grid", secondary: "Aufbereitung prüfen", secondaryHref: "/schneidebrett-aufbereiten/", event: null },
    "/welches-oel-schneidebrett/": { label: "Pflegebalsam ansehen", href: "/produkte.html#produkte-grid", secondary: "Pflegeanleitung lesen", secondaryHref: "/pflege.html", event: null }
  };

  if (!isGerman || !ctas[current] || !window.matchMedia("(max-width: 768px)").matches) {
    return;
  }

  var config = ctas[current];
  var hero = document.querySelector(".hero, .seoHero, .productsHero, .erbstueckHero, .materialGuideHero, .teigschaberHero, .refurbHero");
  var footer = document.querySelector(".footer");
  var bar = document.createElement("nav");
  var primaryEvent = config.event ? ' data-umami-event="' + config.event + '"' : "";
  var secondaryEvent = config.secondaryHref && config.secondaryHref.indexOf("mailto:") === 0 ? ' data-umami-event="email-kontakt"' : "";
  var ticking = false;

  bar.className = "mobileStickyCta";
  bar.setAttribute("aria-label", "Schnellzugriff");
  bar.innerHTML =
    '<a class="mobileStickyCta__primary" href="' + config.href + '"' + primaryEvent + ">" + config.label + "</a>" +
    '<a class="mobileStickyCta__secondary" href="' + config.secondaryHref + '"' + secondaryEvent + ">" + config.secondary + "</a>";

  document.body.appendChild(bar);
  document.body.classList.add("has-mobile-sticky-cta");

  function isHeroVisible() {
    if (!hero) {
      return window.scrollY < 360;
    }

    return hero.getBoundingClientRect().bottom > 96;
  }

  function isFooterVisible() {
    return footer && footer.getBoundingClientRect().top < window.innerHeight - 24;
  }

  function update() {
    bar.classList.toggle("is-visible", !isHeroVisible() && !isFooterVisible());
    ticking = false;
  }

  function requestUpdate() {
    if (ticking) {
      return;
    }

    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  update();
}

function initBackToTop() {
  if (document.querySelector(".erbstueckPage")) {
    return;
  }

  var button = document.createElement("button");
  var threshold = 520;
  var ticking = false;
  var isEnglish = (document.documentElement.lang || "").toLowerCase().indexOf("en") === 0;
  var label = isEnglish ? "Back to top" : "Nach oben";

  button.type = "button";
  button.className = "backToTop";
  button.setAttribute("aria-label", label);
  button.setAttribute("title", label);
  button.innerHTML = '<span aria-hidden="true">↑</span><span class="backToTop__label">' + label + '</span>';

  if (!document.getElementById("backToTopStyles")) {
    var style = document.createElement("style");
    style.id = "backToTopStyles";
    style.textContent =
      ".backToTop{position:fixed;left:auto;right:18px;bottom:18px;z-index:180;height:34px;padding:0 12px;border:1px solid rgba(184,136,87,.20);border-radius:999px;background:rgba(245,241,235,.74);color:rgba(17,17,17,.62);box-shadow:0 6px 18px rgba(52,35,22,.08);backdrop-filter:blur(10px);display:inline-flex;align-items:center;justify-content:center;gap:5px;font:700 11px/1 Montserrat,system-ui,sans-serif;cursor:pointer;opacity:0;transform:translateY(8px);pointer-events:none;transition:opacity .18s ease,transform .18s ease,background-color .18s ease,border-color .18s ease,color .18s ease,box-shadow .18s ease}" +
      ".backToTop span:first-child{font-size:13px;line-height:1}" +
      ".backToTop__label{white-space:nowrap}" +
      ".backToTop.is-visible{opacity:.58;transform:translateY(0);pointer-events:auto}" +
      ".backToTop:hover{opacity:.88;background:rgba(255,255,255,.86);border-color:rgba(184,136,87,.34);color:rgba(17,17,17,.82);box-shadow:0 8px 22px rgba(52,35,22,.12)}" +
      ".backToTop:focus-visible{opacity:.9;outline:2px solid rgba(184,136,87,.42);outline-offset:3px}" +
      "@media (max-width:640px){.backToTop{right:12px;bottom:calc(12px + env(safe-area-inset-bottom));height:32px;padding:0 10px;font-size:10px}.backToTop span:first-child{font-size:12px}}";
    document.head.appendChild(style);
  }

  function updateVisibility() {
    var isVisible = window.scrollY > threshold;
    button.classList.toggle("is-visible", isVisible);
    ticking = false;
  }

  function requestVisibilityUpdate() {
    if (ticking) {
      return;
    }

    ticking = true;
    requestAnimationFrame(updateVisibility);
  }

  button.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.body.appendChild(button);
  updateVisibility();
  window.addEventListener("scroll", requestVisibilityUpdate, { passive: true });
}

function initHeroVideo() {
  var video = document.querySelector("[data-hero-video]");
  var toggle = document.querySelector("[data-hero-video-toggle]");

  if (!video || !toggle) {
    return;
  }

  var videoSrc = video.getAttribute("data-src");
  var playLabel = toggle.getAttribute("data-label-play") || "Video abspielen";
  var pauseLabel = toggle.getAttribute("data-label-pause") || "Video pausieren";
  var desktopQuery = window.matchMedia("(min-width: 901px)");
  var sourceIsSet = false;

  function setVideoSource() {
    if (sourceIsSet || !videoSrc) {
      return;
    }

    video.src = videoSrc;
    sourceIsSet = true;

    if (typeof video.load === "function") {
      video.load();
    }
  }

  function updateToggleState() {
    var isPlaying = !video.paused && !video.ended;
    toggle.classList.toggle("is-playing", isPlaying);
    toggle.setAttribute("aria-label", isPlaying ? pauseLabel : playLabel);
  }

  function playVideo() {
    setVideoSource();

    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(updateToggleState);
    }
  }

  function configureForViewport() {
    video.controls = false;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    if (desktopQuery.matches) {
      video.preload = "metadata";
      video.autoplay = true;
      playVideo();
    } else {
      video.preload = "none";
      video.autoplay = false;
      updateToggleState();
    }
  }

  toggle.addEventListener("click", function () {
    if (video.paused || video.ended) {
      playVideo();
    } else {
      video.pause();
    }
  });

  video.addEventListener("play", updateToggleState);
  video.addEventListener("pause", updateToggleState);
  video.addEventListener("ended", updateToggleState);

  if (typeof desktopQuery.addEventListener === "function") {
    desktopQuery.addEventListener("change", configureForViewport);
  } else if (typeof desktopQuery.addListener === "function") {
    desktopQuery.addListener(configureForViewport);
  }

  configureForViewport();
}

function initCardWelcome() {
  var storageKey = "edlehoelzer.cardWelcomeSeen";
  var params = new URLSearchParams(window.location.search);
  var path = window.location.pathname.replace(/\/+$/, "");
  var isCardVisit =
    path === "/karte" ||
    path === "/karte/index.html" ||
    params.get("ref") === "karte" ||
    window.location.hash === "#karte";

  if (!isCardVisit || readSessionFlag(storageKey) === "1") {
    return;
  }

  writeSessionFlag(storageKey, "1");

  var delay = 1700 + Math.round(Math.random() * 500);
  window.setTimeout(function () {
    showCardWelcome();
  }, delay);

  function showCardWelcome() {
    var mount = document.getElementById("cardWelcomeMount");
    if (!mount || document.querySelector(".cardWelcome")) {
      return;
    }

    var banner = document.createElement("aside");
    banner.className = "cardWelcome";
    banner.setAttribute("role", "status");
    banner.setAttribute("aria-label", "Willkommenshinweis fuer Kartenbesucher");
    banner.innerHTML =
      '<button class="cardWelcome__close" type="button" aria-label="Hinweis schließen">×</button>' +
      '<p class="cardWelcome__kicker">Persönliche Empfehlung</p>' +
      '<h2>Schön, dass du hier bist.</h2>' +
      '<p>Diese Karte geben wir nicht beliebig weiter. Gedacht ist sie für Menschen, bei denen wir glauben, dass echtes Handwerk, gutes Material und persönliche Beratung geschätzt werden.</p>' +
      '<ul class="cardWelcome__facts">' +
        '<li>Handgefertigt in Mittelhessen</li>' +
        '<li>Massivholz statt Serienware</li>' +
        '<li>Schnelle persönliche Beratung</li>' +
      '</ul>' +
      '<div class="cardWelcome__actions">' +
        '<a class="btn" href="./produkte.html#produktfinder">Passendes Brett finden</a>' +
        '<a class="btn btn--ghost-dark" href="./produkte.html#produkte-grid">Produkte ansehen</a>' +
      '</div>' +
      '<a class="cardWelcome__contact" href="mailto:info@edlehoelzer.de?subject=Frage%20zur%20Holzkarte">Frage stellen</a>';

    mount.appendChild(banner);

    requestAnimationFrame(function () {
      banner.classList.add("is-visible");
    });

    var closeButton = banner.querySelector(".cardWelcome__close");
    if (closeButton) {
      closeButton.addEventListener("click", dismiss);
    }

    banner.addEventListener("click", function (event) {
      if (event.target && event.target.closest("a")) {
        dismiss();
      }
    });

    document.addEventListener("keydown", onKeydown);

    function onKeydown(event) {
      if (event.key === "Escape") {
        dismiss();
      }
    }

    function dismiss() {
      document.removeEventListener("keydown", onKeydown);
      banner.classList.remove("is-visible");
      banner.classList.add("is-leaving");
      window.setTimeout(function () {
        if (banner.parentNode) {
          banner.parentNode.removeChild(banner);
        }
      }, 240);
    }
  }

  function readSessionFlag(key) {
    try {
      return window.sessionStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function writeSessionFlag(key, value) {
    try {
      window.sessionStorage.setItem(key, value);
    } catch (error) {}
  }
}

function initReviewTrustStrips() {
  var roots = Array.prototype.slice.call(document.querySelectorAll("[data-review-trust-strip]"));

  if (!roots.length || !window.fetch) {
    return;
  }

  var config = getReviewConfig(roots[0]);

  fetchJson(config.reviewsUrl)
    .then(function (reviewData) {
      return fetchJson(config.metaUrl)
        .catch(function (error) {
          console.warn("[Edle Hölzer] Etsy-Review-Metadaten konnten nicht geladen werden:", error);
          return {};
        })
        .then(function (metaData) {
          return {
            reviews: normalizeReviews(reviewData),
            meta: normalizeReviewMeta(metaData)
          };
        });
    })
    .then(function (payload) {
      var reviews = payload.reviews;
      var meta = payload.meta;

      if (!reviews.length) {
        console.warn("[Edle Hölzer] Keine gültigen Etsy-Bewertungen zum Anzeigen gefunden.");
        return;
      }

      roots.forEach(function (root) {
        renderReviewTrustStrip(root, reviews, meta);
        bindReviewScrolling(root);
      });
    })
    .catch(function (error) {
      console.warn("[Edle Hölzer] Etsy-Bewertungen konnten nicht geladen werden:", error);
    });

  function fetchJson(url) {
    return fetch(url, { credentials: "same-origin" }).then(function (response) {
      if (!response.ok) {
        throw new Error(url + " konnte nicht geladen werden.");
      }
      return response.json();
    });
  }

  function getReviewConfig(root) {
    var language = String(document.documentElement.lang || "de").toLowerCase();
    var isEnglish = language.indexOf("en") === 0;

    return {
      isEnglish: isEnglish,
      locale: isEnglish ? "en-US" : "de-DE",
      reviewsUrl: root.getAttribute("data-reviews-src") || (isEnglish ? "/data/reviews-en.json" : "/data/reviews.json"),
      metaUrl: root.getAttribute("data-review-meta-src") || "/data/reviews-meta.json",
      fallbackSourceUrl: "https://edlehoelzervonkoc.etsy.com",
      copy: isEnglish ? {
        headlineFallback: "Reviews on ",
        headlineSuffix: " stars on ",
        sublineFallback: "Genuine feedback from people who already use our products or have given them as gifts.",
        reviewCountLabel: "reviews",
        salesCountLabel: "sales via Etsy",
        ratingLabelSuffix: " out of 5 stars",
        metaSeparator: " · ",
        months: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ]
      } : {
        headlineFallback: "Bewertungen auf ",
        headlineSuffix: " Sterne auf ",
        sublineFallback: "Echte Rückmeldungen von Menschen, die unsere Produkte bereits nutzen oder verschenkt haben.",
        reviewCountLabel: "Bewertungen",
        salesCountLabel: "Verkäufe über Etsy",
        ratingLabelSuffix: " von 5 Sternen",
        metaSeparator: " · ",
        months: [
          "Januar",
          "Februar",
          "März",
          "April",
          "Mai",
          "Juni",
          "Juli",
          "August",
          "September",
          "Oktober",
          "November",
          "Dezember"
        ]
      }
    };
  }

  function normalizeReviews(data) {
    if (!Array.isArray(data)) {
      console.warn("[Edle Hölzer] reviews.json enthält keine Liste.");
      return [];
    }

    return data
      .filter(function (review) {
        var rating = Number(review && review.rating);
        var text = String(review && review.text || "").trim();
        var isValid = review &&
          review.featured === true &&
          review.needsReview !== true &&
          text.length > 0 &&
          rating >= 1 &&
          rating <= 5;

        if (!isValid && review && review.featured === true) {
          console.warn("[Edle Hölzer] Ungültige Etsy-Bewertung wird übersprungen:", review.id || review.reviewerName || "ohne ID");
        }

        return isValid;
      })
      .slice(0, 12);
  }

  function normalizeReviewMeta(data) {
    var meta = data && typeof data === "object" && !Array.isArray(data) ? data : {};
    var ratingAverage = Number(meta.ratingAverage);
    var ratingCount = Number(meta.ratingCount);
    var transactionSoldCount = Number(meta.transactionSoldCount);

    return {
      source: String(meta.source || "Etsy"),
      shopName: String(meta.shopName || "Edle Hölzer"),
      ratingAverage: ratingAverage >= 1 && ratingAverage <= 5 ? ratingAverage : null,
      ratingCount: ratingCount > 0 ? Math.round(ratingCount) : 0,
      transactionSoldCount: transactionSoldCount > 0 ? Math.round(transactionSoldCount) : 0,
      lastUpdated: String(meta.lastUpdated || ""),
      sourceUrl: String(meta.sourceUrl || config.fallbackSourceUrl),
      needsReview: meta.needsReview === true
    };
  }

  function renderReviewTrustStrip(root, reviews, meta) {
    var headline = root.querySelector("[data-review-headline]");
    var subline = root.querySelector("[data-review-subline]");
    var track = root.querySelector("[data-review-track]");
    var sourceLink = root.querySelector("[data-review-source-link]");

    if (!headline || !subline || !track) {
      return;
    }

    headline.textContent = buildReviewHeadline(meta);
    subline.textContent = buildReviewSubline(meta);
    track.innerHTML = reviews.map(buildReviewCard).join("");

    if (sourceLink && meta.sourceUrl) {
      sourceLink.href = meta.sourceUrl;
    }

    root.hidden = false;

    if (window.location.hash === "#" + root.id) {
      window.requestAnimationFrame(function () {
        if (typeof root.scrollIntoView === "function") {
          root.scrollIntoView({ block: "start" });
          return;
        }

        document.documentElement.scrollTop = root.offsetTop;
        document.body.scrollTop = root.offsetTop;
      });
    }
  }

  function buildReviewHeadline(meta) {
    if (!meta.ratingAverage || meta.needsReview) {
      return config.copy.headlineFallback + meta.source;
    }

    return formatReviewNumber(meta.ratingAverage) + config.copy.headlineSuffix + meta.source;
  }

  function buildReviewSubline(meta) {
    var trustFacts = [];

    if (meta.ratingCount) {
      trustFacts.push(meta.ratingCount.toLocaleString(config.locale) + " " + config.copy.reviewCountLabel);
    }

    if (meta.transactionSoldCount) {
      trustFacts.push(meta.transactionSoldCount.toLocaleString(config.locale) + " " + config.copy.salesCountLabel);
    }

    return trustFacts.length
      ? trustFacts.join(" · ") + ". " + config.copy.sublineFallback
      : config.copy.sublineFallback;
  }

  function buildReviewCard(review) {
    var rating = Math.max(1, Math.min(5, Math.round(Number(review.rating))));
    var labelParts = [
      review.reviewerName,
      formatReviewDate(review.date),
      review.product
    ].filter(Boolean);

    return '<article class="reviewCard">' +
      '<div class="reviewCard__stars" aria-label="' + escapeAttribute(rating + config.copy.ratingLabelSuffix) + '">' + buildStars(rating) + '</div>' +
      '<p class="reviewCard__text">“' + escapeHtml(review.text) + '”</p>' +
      '<p class="reviewCard__meta">' + escapeHtml(labelParts.join(config.copy.metaSeparator)) + '</p>' +
    '</article>';
  }

  function buildStars(rating) {
    var stars = "";
    for (var i = 0; i < 5; i += 1) {
      stars += i < rating ? "★" : "☆";
    }
    return stars;
  }

  function formatReviewNumber(value) {
    return Number(value).toLocaleString(config.locale, {
      minimumFractionDigits: Number(value) % 1 === 0 ? 0 : 1,
      maximumFractionDigits: 1
    });
  }

  function formatReviewDate(value) {
    var text = String(value || "");
    var match = text.match(/^(\d{4})-(\d{2})$/);

    if (!match) {
      return text;
    }

    return config.copy.months[Number(match[2]) - 1] + " " + match[1];
  }

  function bindReviewScrolling(root) {
    var viewport = root.querySelector("[data-review-viewport]");

    if (!viewport) {
      return;
    }

    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var isPaused = false;
    var isDragging = false;
    var startX = 0;
    var startScrollLeft = 0;

    viewport.addEventListener("mouseenter", pause);
    viewport.addEventListener("mouseleave", resume);
    viewport.addEventListener("focusin", pause);
    viewport.addEventListener("focusout", resume);
    viewport.addEventListener("touchstart", pause, { passive: true });
    viewport.addEventListener("touchend", resume, { passive: true });

    viewport.addEventListener("pointerdown", function (event) {
      if (event.pointerType !== "mouse" || viewport.scrollWidth <= viewport.clientWidth) {
        return;
      }

      isDragging = true;
      pause();
      startX = event.clientX;
      startScrollLeft = viewport.scrollLeft;
      viewport.classList.add("is-dragging");
      viewport.setPointerCapture(event.pointerId);
    });

    viewport.addEventListener("pointermove", function (event) {
      if (!isDragging) {
        return;
      }

      event.preventDefault();
      viewport.scrollLeft = startScrollLeft - (event.clientX - startX);
    });

    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);

    function endDrag(event) {
      if (!isDragging) {
        return;
      }

      isDragging = false;
      viewport.classList.remove("is-dragging");

      if (event && viewport.hasPointerCapture(event.pointerId)) {
        viewport.releasePointerCapture(event.pointerId);
      }

      window.setTimeout(resume, 900);
    }

    function pause() {
      isPaused = true;
    }

    function resume() {
      isPaused = false;
    }

    if (!reducedMotion) {
      window.setTimeout(function () {
        requestAnimationFrame(autoScroll);
      }, 1200);
    }

    function autoScroll() {
      if (!isPaused && !isDragging && viewport.scrollWidth > viewport.clientWidth) {
        var maxScroll = viewport.scrollWidth - viewport.clientWidth;
        viewport.scrollLeft += 0.22;

        if (viewport.scrollLeft >= maxScroll - 1) {
          viewport.scrollTo({ left: 0, behavior: "smooth" });
        }
      }

      requestAnimationFrame(autoScroll);
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value);
  }
}

function initProductExperience() {
  if (window.EdleProductExperience) {
    return;
  }

  var isEnglish = (document.documentElement.lang || "").toLowerCase().indexOf("en") === 0;
  var labels = isEnglish ? {
    previewTitle: "Product details",
    close: "Close",
    details: "Discover product",
    compare: "Compare",
    addCompare: "Add to comparison",
    removeCompare: "Remove from comparison",
    inCompare: "In comparison",
    replaceCompare: "Swap",
    continueBrowsing: "Keep browsing",
    buyBoard: "Buy this board on Etsy",
    buyProduct: "Buy this product on Etsy",
    buyCare: "Buy care balm on Etsy",
    etsyTrust: "Secure checkout via Etsy · Reviews and buyer protection available there",
    careLink: "Understand care",
    madeFor: "What this product is made for",
    keyFacts: "Key facts",
    highlights: "Highlights",
    care: "Care",
    related: "Similar products",
    comparison: "Comparison",
    open: "Open",
    clear: "Clear",
    selectedOne: "1 of 2 selected",
    selectedTwo: "2 of 2 selected",
    compareEmptyTitle: "No board in comparison yet",
    compareEmptyText: "Add up to two boards to compare them directly.",
    compareOneTitle: "One board selected",
    compareOneText: "Add a second board to see differences in wood, size, price and use.",
    compareTwoTitle: "Two boards in comparison",
    compareTwoText: "Do not choose from ten options. Decide between the two boards that really matter.",
    compareNoneStatus: "No product in comparison yet",
    compareOneStatus: "1 of 2 products selected",
    compareTwoStatus: "2 of 2 products selected",
    openCompare: "Open comparison",
    browseProducts: "View products",
    compareSlotTitle: "One place is free.",
    compareSlotText: "Choose a second product to complete the comparison again.",
    categoryMismatchTitle: "These products do different jobs.",
    categoryMismatchText: "The comparison therefore shows less better or worse, and more what each product is made for.",
    replaceTitle: "Which product should go?",
    replaceText: "You can always compare two products. Choose which product should be replaced by this one.",
    cancel: "Cancel",
    replace: "replace",
    notSpecified: "not specified",
    checkOnEtsy: "Request similar product",
    askSimilar: "Request similar product",
    unavailableText: "This exact product is no longer available. A similar piece can be matched by material, size and use.",
    price: "Price",
    dimensions: "Dimensions",
    wood: "Wood",
    construction: "Construction",
    thickness: "Thickness",
    weight: "Weight",
    juiceGroove: "Juice groove",
    engraving: "Engraving",
    decision: "Decision hint",
    finderReason: "Why this fits"
  } : {
    previewTitle: "Produktdetails",
    close: "Schließen",
    details: "Produkt entdecken",
    compare: "Vergleichen",
    addCompare: "Zum Vergleich hinzufügen",
    removeCompare: "Aus Vergleich entfernen",
    inCompare: "Im Vergleich",
    replaceCompare: "Austauschen",
    continueBrowsing: "Weiterstöbern",
    buyBoard: "Dieses Brett auf Etsy kaufen",
    buyProduct: "Dieses Produkt auf Etsy kaufen",
    buyCare: "Pflegebalsam auf Etsy kaufen",
    etsyTrust: "Sicherer Checkout über Etsy · Bewertungen und Käuferschutz dort verfügbar",
    careLink: "Pflege verstehen",
    madeFor: "Wofür dieses Produkt gemacht ist",
    keyFacts: "Eckdaten",
    highlights: "Highlights",
    care: "Pflege",
    related: "Ähnliche Produkte",
    comparison: "Vergleich",
    open: "Öffnen",
    clear: "Leeren",
    selectedOne: "1 von 2 ausgewählt",
    selectedTwo: "2 von 2 ausgewählt",
    compareEmptyTitle: "Noch kein Brett im Vergleich",
    compareEmptyText: "Füge bis zu zwei Bretter hinzu, um sie direkt gegenüberzustellen.",
    compareOneTitle: "Ein Brett ausgewählt",
    compareOneText: "Füge ein zweites Brett hinzu, um Unterschiede bei Holz, Größe, Preis und Nutzung zu sehen.",
    compareTwoTitle: "Zwei Bretter im Vergleich",
    compareTwoText: "Wähle nicht aus zehn Optionen. Entscheide zwischen den zwei Brettern, die wirklich infrage kommen.",
    compareNoneStatus: "Noch kein Produkt im Vergleich",
    compareOneStatus: "1 von 2 Produkten ausgewählt",
    compareTwoStatus: "2 von 2 Produkten ausgewählt",
    openCompare: "Vergleich öffnen",
    browseProducts: "Produkte ansehen",
    compareSlotTitle: "Ein Platz ist frei.",
    compareSlotText: "Wähle ein zweites Produkt aus, um den Vergleich wieder vollständig zu machen.",
    categoryMismatchTitle: "Diese Produkte erfüllen unterschiedliche Aufgaben.",
    categoryMismatchText: "Der Vergleich zeigt dir deshalb weniger besser oder schlechter, sondern wofür welches Produkt gedacht ist.",
    replaceTitle: "Welches Produkt soll raus?",
    replaceText: "Du kannst immer zwei Produkte vergleichen. Wähle, welches Produkt durch dieses ersetzt werden soll.",
    cancel: "Abbrechen",
    replace: "ersetzen",
    notSpecified: "nicht angegeben",
    checkOnEtsy: "Ähnliches Produkt anfragen",
    askSimilar: "Ähnliches Produkt anfragen",
    unavailableText: "Dieses konkrete Produkt ist nicht mehr verfügbar. Ein ähnliches Stück können wir nach Material, Größe und Einsatz abstimmen.",
    price: "Preis",
    dimensions: "Maße",
    wood: "Holzart",
    construction: "Bauweise",
    thickness: "Stärke",
    weight: "Gewicht",
    juiceGroove: "Saftrille",
    engraving: "Gravur",
    decision: "Entscheidungshilfe",
    finderReason: "Warum das passt"
  };

  var catalogPromise = null;
  var productMap = {};
  var products = [];
  var compareIds = readCompareState();
  var activeOverlay = null;
  var activeDialog = null;
  var previousFocus = null;
  var previousOverflow = "";
  var compareBar = createCompareBar();

  document.body.appendChild(compareBar);
  updateCompareBar();

  document.addEventListener("click", function (event) {
    var etsyTrigger = event.target.closest("[data-product-etsy]");
    if (etsyTrigger) {
      var etsyProduct = productMap[etsyTrigger.getAttribute("data-product-etsy")];
      track("product_preview_etsy_click", etsyProduct || null, { source: "preview", target: "etsy" });
      return;
    }

    var previewTrigger = event.target.closest("[data-product-preview]");
    if (previewTrigger) {
      event.preventDefault();
      openProduct(previewTrigger.getAttribute("data-product-preview"), previewTrigger.getAttribute("data-product-source") || "page", previewTrigger, previewTrigger.getAttribute("data-product-reason") || "");
      return;
    }

    var compareTrigger = event.target.closest("[data-product-compare]");
    if (compareTrigger) {
      event.preventDefault();
      toggleCompare(compareTrigger.getAttribute("data-product-compare"), compareTrigger.getAttribute("data-product-source") || "page", compareTrigger);
      return;
    }

    var removeTrigger = event.target.closest("[data-compare-remove]");
    if (removeTrigger) {
      event.preventDefault();
      removeCompare(removeTrigger.getAttribute("data-compare-remove"));
      return;
    }

    var replaceTrigger = event.target.closest("[data-compare-replace]");
    if (replaceTrigger) {
      event.preventDefault();
      replaceCompare(replaceTrigger.getAttribute("data-compare-replace"), replaceTrigger.getAttribute("data-compare-new"));
      closeOverlay();
      return;
    }

    if (event.target.closest("[data-compare-open]")) {
      event.preventDefault();
      openCompareView(event.target.closest("[data-compare-open]"));
      return;
    }

    if (event.target.closest("[data-compare-clear]")) {
      event.preventDefault();
      clearCompare();
      return;
    }

    var mediaTrigger = event.target.closest("[data-preview-media]");
    if (mediaTrigger) {
      event.preventDefault();
      switchPreviewMedia(mediaTrigger);
      return;
    }

    if (event.target.closest("[data-product-experience-close]")) {
      event.preventDefault();
      closeOverlay();
      return;
    }

    if (event.target.hasAttribute("data-product-experience-backdrop")) {
      closeOverlay();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (!activeDialog) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeOverlay();
      return;
    }

    if (event.key === "Tab") {
      trapFocus(event);
    }
  });

  window.EdleProductExperience = {
    openProduct: openProduct,
    addToCompare: function (id, source, trigger) {
      addCompare(id, source || "api", trigger || document.activeElement);
    },
    removeFromCompare: removeCompare,
    openCompare: openCompareView,
    getProducts: loadProducts
  };

  function loadProducts() {
    if (!catalogPromise) {
      catalogPromise = fetch(EDLE_HOELZER_PRODUCTS_URL)
        .then(function (response) {
          if (!response.ok) {
            throw new Error("products.json konnte nicht geladen werden.");
          }

          return response.json();
        })
        .then(function (data) {
          products = (Array.isArray(data) ? data : data.products || []).filter(Boolean);
          productMap = {};
          products.forEach(function (product) {
            if (product.id) {
              productMap[product.id] = product;
            }
          });
          compareIds = compareIds.filter(function (id) {
            return isComparableProduct(productMap[id]);
          });
          writeCompareState();
          updateCompareBar();
          return products;
        });
    }

    return catalogPromise;
  }

  function openProduct(productId, source, trigger, reason) {
    loadProducts().then(function () {
      var product = productMap[productId];
      if (!product) {
        return;
      }

      previousFocus = trigger || document.activeElement;
      renderOverlay(renderProductPreview(product, source, reason), "product-preview", source);
      if (activeOverlay) {
        activeOverlay.setAttribute("data-current-product-id", product.id);
        activeOverlay.setAttribute("data-current-product-source", source || "preview");
        activeOverlay.setAttribute("data-current-product-reason", reason || "");
      }
      track("product_preview_open", product, { source: source });
    }).catch(function (error) {
      console.warn("[Edle Hölzer] Produktvorschau konnte nicht geöffnet werden:", error);
    });
  }

  function renderProductPreview(product, source, reason) {
    var media = productMedia(product);
    var main = media[0];
    var title = displayProductName(product);
    var facts = productFacts(product);
    var highlights = productHighlights(product);
    var related = relatedProducts(product);
    var hasEtsy = hasVerifiedListing(product);
    var etsyUrl = etsyActionUrl(product);

    return '<section class="productPreview" role="dialog" aria-modal="true" aria-labelledby="product-preview-title">' +
      '<button class="productExperience__close" type="button" data-product-experience-close aria-label="' + escapeAttribute(labels.close) + '">×</button>' +
      '<div class="productPreview__media">' +
        '<div class="productPreview__mainMedia">' +
          renderPreviewMainMedia(main) +
        '</div>' +
        (media.length > 1 ? '<div class="productPreview__thumbs" aria-label="' + escapeAttribute(labels.previewTitle) + '">' + media.map(function (item, index) {
          return renderPreviewThumb(item, index);
        }).join("") + '</div>' : "") +
      '</div>' +
      '<div class="productPreview__content">' +
        '<p class="productPreview__eyebrow">' + escapeHtml(product.segment || product.category || "Edle Hölzer") + '</p>' +
        '<h2 id="product-preview-title">' + escapeHtml(title) + '</h2>' +
        '<p class="productPreview__moment">' + escapeHtml(productMoment(product)) + '</p>' +
        '<p class="productPreview__proof">' + escapeHtml(productProof(product)) + '</p>' +
        (reason ? '<div class="productPreview__reason"><strong>' + escapeHtml(labels.finderReason) + '</strong><p>' + escapeHtml(reason) + '</p></div>' : "") +
        (facts.length ? '<section class="productPreview__section"><h3>' + escapeHtml(labels.keyFacts) + '</h3><dl class="productPreview__facts">' + facts.map(function (fact) {
          return '<div><dt>' + escapeHtml(fact[0]) + '</dt><dd>' + escapeHtml(fact[1]) + '</dd></div>';
        }).join("") + '</dl></section>' : "") +
        (highlights.length ? '<section class="productPreview__section"><h3>' + escapeHtml(labels.highlights) + '</h3><ul class="productPreview__chips">' + highlights.map(function (highlight) {
          return '<li>' + escapeHtml(highlight) + '</li>';
        }).join("") + '</ul></section>' : "") +
        '<section class="productPreview__section"><h3>' + escapeHtml(labels.madeFor) + '</h3><p>' + escapeHtml(productExperienceText(product)) + '</p></section>' +
        '<section class="productPreview__section"><h3>' + escapeHtml(labels.care) + '</h3><p>' + escapeHtml(careNote(product)) + ' <a href="' + (isEnglish ? "/en/care.html" : "/pflege.html") + '">' + escapeHtml(labels.careLink) + '</a></p></section>' +
        '<div class="productPreview__actions">' +
        (hasEtsy ? '<a class="btn btn--emphasis" href="' + escapeAttribute(etsyUrl) + '" target="_blank" rel="noopener" data-etsy-link data-product-etsy="' + escapeAttribute(product.id) + '">' + escapeHtml(etsyActionLabel(product)) + '</a><p class="productPreview__trust">' + escapeHtml(labels.etsyTrust) + '</p>' : '<p class="productCard__availability">' + escapeHtml(labels.unavailableText) + '</p><a class="btn btn--emphasis" href="' + (isEnglish ? "/en/custom-cutting-board/" : "/schneidebrett-nach-mass/") + '">' + escapeHtml(labels.askSimilar) + '</a>') +
          renderPreviewCompareControls(product, source || "preview") +
          '<button class="btn btn--secondary" type="button" data-product-experience-close>' + escapeHtml(labels.continueBrowsing) + '</button>' +
        '</div>' +
        (related.length ? '<section class="productPreview__section productPreview__related"><h3>' + escapeHtml(labels.related) + '</h3><div class="productPreview__relatedGrid">' + related.map(function (relatedProduct) {
          return '<article><img src="' + escapeAttribute(primaryImage(relatedProduct)) + '" alt="' + escapeAttribute(productImageAlt(relatedProduct)) + '" loading="lazy" decoding="async"><strong>' + escapeHtml(displayProductName(relatedProduct)) + '</strong><div class="productPreview__relatedActions"><button type="button" data-product-preview="' + escapeAttribute(relatedProduct.id) + '" data-product-source="related">' + escapeHtml(labels.details) + '</button><button type="button" data-product-compare="' + escapeAttribute(relatedProduct.id) + '" data-product-source="related">' + escapeHtml(labels.compare) + '</button></div></article>';
        }).join("") + '</div></section>' : "") +
      '</div>' +
    '</section>';
  }

  function toggleCompare(productId, source, trigger) {
    if (compareIds.indexOf(productId) !== -1) {
      removeCompare(productId);
      return;
    }

    addCompare(productId, source, trigger);
  }

  function addCompare(productId, source, trigger) {
    loadProducts().then(function () {
      if (!isComparableProduct(productMap[productId])) {
        return;
      }

      if (compareIds.indexOf(productId) !== -1) {
        return;
      }

      if (compareIds.length >= 2) {
        previousFocus = trigger || document.activeElement;
        renderOverlay(renderReplacementDialog(productId), "compare-replace", source);
        track("compare_replace_prompt", productMap[productId], { source: source, compare_count: compareIds.length });
        return;
      }

      compareIds.push(productId);
      writeCompareState();
      updateCompareBar();
      if (activeOverlay && activeOverlay.getAttribute("data-product-experience-type") === "product-preview") {
        if (compareIds.length === 2) {
          openCompareView(trigger);
          track("compare_add", productMap[productId], { source: source, compare_count: compareIds.length });
          return;
        }
        refreshProductPreviewOverlay();
      }
      refreshCompareOverlay();
      track("compare_add", productMap[productId], { source: source, compare_count: compareIds.length });
    });
  }

  function removeCompare(productId) {
    var index = compareIds.indexOf(productId);
    if (index === -1) {
      return;
    }

    compareIds.splice(index, 1);
    writeCompareState();
    updateCompareBar();
    updateCompareButtons();
    if (productMap[productId]) {
      track("compare_remove", productMap[productId], { compare_count: compareIds.length });
    }
    refreshProductPreviewOverlay();
    refreshCompareOverlay();
  }

  function replaceCompare(oldId, newId) {
    var index = compareIds.indexOf(oldId);
    if (index === -1 || !isComparableProduct(productMap[newId])) {
      return;
    }

    compareIds[index] = newId;
    writeCompareState();
    updateCompareBar();
    updateCompareButtons();
    track("compare_replace_confirm", productMap[newId], { replaced_product_id: oldId, compare_count: compareIds.length });
    if (activeOverlay && activeOverlay.getAttribute("data-product-experience-type") === "compare-replace") {
      window.setTimeout(function () {
        openCompareView(previousFocus || document.activeElement);
      }, 0);
    } else {
      refreshCompareOverlay();
    }
  }

  function clearCompare() {
    compareIds = [];
    writeCompareState();
    updateCompareBar();
    updateCompareButtons();
    track("compare_clear", null, { compare_count: 0 });
    refreshCompareOverlay();
  }

  function openCompareView(trigger) {
    loadProducts().then(function () {
      previousFocus = trigger || document.activeElement;
      renderOverlay(renderCompareView(), "compare-view", "compare_bar");
      track("compare_open", null, { compare_count: compareIds.length });
    });
  }

  function renderCompareView() {
    var selected = compareIds.map(function (id) {
      return productMap[id];
    }).filter(Boolean);

    if (!selected.length) {
      return '<section class="compareView compareView--empty" role="dialog" aria-modal="true" aria-labelledby="compare-title"><button class="productExperience__close" type="button" data-product-experience-close aria-label="' + escapeAttribute(labels.close) + '">×</button><h2 id="compare-title">' + escapeHtml(labels.compareEmptyTitle) + '</h2><p>' + escapeHtml(labels.compareEmptyText) + '</p><a class="btn btn--emphasis" href="' + (isEnglish ? "/en/products.html" : "/produkte.html") + '">' + escapeHtml(labels.browseProducts) + '</a></section>';
    }

    if (selected.length === 1) {
      return '<section class="compareView compareView--single" role="dialog" aria-modal="true" aria-labelledby="compare-title"><button class="productExperience__close" type="button" data-product-experience-close aria-label="' + escapeAttribute(labels.close) + '">×</button><h2 id="compare-title">' + escapeHtml(labels.compareOneTitle) + '</h2><p>' + escapeHtml(labels.compareOneText) + '</p><div class="compareView__singleProduct">' + renderCompareProductCard(selected[0]) + '</div>' + renderCompareSuggestions(selected[0]) + '<a class="btn btn--secondary" href="' + (isEnglish ? "/en/products.html" : "/produkte.html") + '">' + escapeHtml(labels.continueBrowsing) + '</a></section>';
    }

    var rows = compareRows(selected[0], selected[1]);
    var categoryNotice = selected[0].category !== selected[1].category
      ? '<div class="compareView__notice"><h3>' + escapeHtml(labels.categoryMismatchTitle) + '</h3><p>' + escapeHtml(labels.categoryMismatchText) + '</p></div>'
      : "";

    return '<section class="compareView" role="dialog" aria-modal="true" aria-labelledby="compare-title">' +
      '<button class="productExperience__close" type="button" data-product-experience-close aria-label="' + escapeAttribute(labels.close) + '">×</button>' +
      '<div class="compareView__head"><p class="productPreview__eyebrow">' + escapeHtml(labels.comparison) + '</p><h2 id="compare-title">' + escapeHtml(labels.compareTwoTitle) + '</h2><p>' + escapeHtml(labels.compareTwoText) + '</p></div>' +
      categoryNotice +
      '<div class="compareView__matrix" role="table" aria-label="' + escapeAttribute(labels.comparison) + '">' +
        '<div class="compareView__corner" aria-hidden="true"></div>' +
        selected.map(function (product) {
          return '<div class="compareView__productCell" role="columnheader">' + renderCompareProductCard(product) + '</div>';
        }).join("") +
        rows.map(function (row) {
          return '<div class="compareRowLabel" role="rowheader">' + escapeHtml(row.label) + '</div><div class="compareRowValue" role="cell"><strong class="compareRowValue__mobileName">' + escapeHtml(displayProductName(selected[0])) + '</strong>' + escapeHtml(row.a) + '</div><div class="compareRowValue" role="cell"><strong class="compareRowValue__mobileName">' + escapeHtml(displayProductName(selected[1])) + '</strong>' + escapeHtml(row.b) + '</div>';
        }).join("") +
      '</div>' +
      '<div class="compareView__actions"><button class="btn btn--ghost-dark" type="button" data-compare-clear>' + escapeHtml(labels.clear) + '</button></div>' +
    '</section>';
  }

  function renderCompareProductCard(product) {
    var hasEtsy = hasVerifiedListing(product);
    return '<article class="compareProduct">' +
      '<button class="compareProduct__image" type="button" data-product-preview="' + escapeAttribute(product.id) + '" data-product-source="compare">' +
        '<img src="' + escapeAttribute(primaryImage(product)) + '" alt="' + escapeAttribute(productImageAlt(product)) + '" loading="lazy" decoding="async">' +
      '</button>' +
      '<h3>' + escapeHtml(displayProductName(product)) + '</h3>' +
      '<p>' + escapeHtml(productMoment(product)) + '</p>' +
      '<div class="compareProduct__actions">' +
        (hasEtsy ? '<a class="btn btn--emphasis" href="' + escapeAttribute(etsyActionUrl(product)) + '" target="_blank" rel="noopener" data-etsy-link data-product-etsy="' + escapeAttribute(product.id) + '">' + escapeHtml(etsyActionLabel(product)) + '</a>' : "") +
        '<button class="btn btn--ghost-dark" type="button" data-product-preview="' + escapeAttribute(product.id) + '" data-product-source="compare">' + escapeHtml(labels.details) + '</button>' +
        '<button class="btn btn--secondary" type="button" data-compare-remove="' + escapeAttribute(product.id) + '">' + escapeHtml(labels.removeCompare) + '</button>' +
      '</div>' +
    '</article>';
  }

  function compareRows(a, b) {
    var bothBoards = a.category === "board" && b.category === "board";
    var hasAccessory = a.category === "accessory" || b.category === "accessory";
    var hasCare = a.category === "care" || b.category === "care";
    var rows = [
      [labels.price, displayValue(displayPriceLabel(a)), displayValue(displayPriceLabel(b))],
      [hasCare ? (isEnglish ? "Use" : "Einsatz") : labels.dimensions, hasCare ? productUseLabel(a) : dimensionLabel(a), hasCare ? productUseLabel(b) : dimensionLabel(b)],
      [hasCare ? (isEnglish ? "Application" : "Anwendungsfall") : labels.wood, hasCare ? productApplication(a) : displayValue(a.material), hasCare ? productApplication(b) : displayValue(b.material)],
      [bothBoards ? labels.construction : "", bothBoards ? constructionLabel(a) : "", bothBoards ? constructionLabel(b) : ""],
      [bothBoards ? labels.thickness : "", bothBoards ? meaningful(a.thicknessLabel) : "", bothBoards ? meaningful(b.thicknessLabel) : ""],
      [labels.weight, exactWeightLabel(a), exactWeightLabel(b)],
      [bothBoards ? labels.juiceGroove : "", bothBoards ? booleanLabel(hasBadge(a, "Saftrille")) : "", bothBoards ? booleanLabel(hasBadge(b, "Saftrille")) : ""],
      [bothBoards || hasAccessory ? labels.engraving : "", bothBoards || hasAccessory ? engravingLabel(a) : "", bothBoards || hasAccessory ? engravingLabel(b) : ""],
      [hasAccessory ? (isEnglish ? "Role" : "Rolle") : "", hasAccessory ? productRole(a) : "", hasAccessory ? productRole(b) : ""],
      [labels.decision, decisionHint(a, b), decisionHint(b, a)]
    ];

    return rows.filter(function (row) {
      return row[0] && (row[1] || row[2]);
    }).map(function (row) {
      return { label: row[0], a: row[1] || labels.notSpecified, b: row[2] || labels.notSpecified };
    });
  }

  function renderCompareSuggestions(baseProduct) {
    var suggestions = compareSuggestions(baseProduct);
    if (!suggestions.length) {
      return "";
    }

    return '<section class="compareSuggestions"><h3>' + escapeHtml(labels.compareSlotTitle) + '</h3><p>' + escapeHtml(labels.compareSlotText) + '</p><div class="compareSuggestions__grid">' + suggestions.map(function (product) {
      return '<article class="compareSuggestion"><img src="' + escapeAttribute(primaryImage(product)) + '" alt="' + escapeAttribute(productImageAlt(product)) + '" loading="lazy" decoding="async"><strong>' + escapeHtml(displayProductName(product)) + '</strong><span>' + escapeHtml(productMoment(product)) + '</span><div><button type="button" data-product-compare="' + escapeAttribute(product.id) + '" data-product-source="compare">' + escapeHtml(labels.compare) + '</button><button type="button" data-product-preview="' + escapeAttribute(product.id) + '" data-product-source="compare">' + escapeHtml(labels.details) + '</button></div></article>';
    }).join("") + '</div></section>';
  }

  function compareSuggestions(baseProduct) {
    return products.filter(function (candidate) {
      return candidate && candidate.id !== baseProduct.id && compareIds.indexOf(candidate.id) === -1 && isComparableProduct(candidate) && candidate.image;
    }).sort(function (a, b) {
      return suggestionScore(b, baseProduct) - suggestionScore(a, baseProduct);
    }).slice(0, 6);
  }

  function suggestionScore(candidate, baseProduct) {
    var score = 0;
    if (candidate.category === baseProduct.category) score += 12;
    if (candidate.directListingUrlVerified === true) score += 6;
    if (candidate.material && baseProduct.material && candidate.material !== baseProduct.material) score += 4;
    if (candidate.woodCut && baseProduct.woodCut && candidate.woodCut !== baseProduct.woodCut) score += 4;
    if (Array.isArray(candidate.useCases) && Array.isArray(baseProduct.useCases)) {
      candidate.useCases.forEach(function (useCase) {
        if (baseProduct.useCases.indexOf(useCase) !== -1) {
          score += 3;
        }
      });
    }
    if (candidate.featured) score += 2;
    return score;
  }

  function renderReplacementDialog(newProductId) {
    var newProduct = productMap[newProductId];
    return '<section class="compareReplaceDialog" role="dialog" aria-modal="true" aria-labelledby="replace-title">' +
      '<button class="productExperience__close" type="button" data-product-experience-close aria-label="' + escapeAttribute(labels.close) + '">×</button>' +
      '<h2 id="replace-title">' + escapeHtml(labels.replaceTitle) + '</h2>' +
      '<p>' + escapeHtml(labels.replaceText) + '</p>' +
      '<div class="compareReplaceDialog__actions">' + compareIds.map(function (id) {
        var product = productMap[id];
        return '<button class="btn btn--secondary" type="button" data-compare-replace="' + escapeAttribute(id) + '" data-compare-new="' + escapeAttribute(newProductId) + '">' + escapeHtml(displayProductName(product)) + ' ' + escapeHtml(labels.replace) + '</button>';
      }).join("") +
      '<button class="btn btn--ghost-dark" type="button" data-product-experience-close>' + escapeHtml(labels.cancel) + '</button></div>' +
      (newProduct ? '<p class="compareReplaceDialog__new">' + escapeHtml(labels.compare) + ': ' + escapeHtml(displayProductName(newProduct)) + '</p>' : "") +
    '</section>';
  }

  function createCompareBar() {
    var bar = document.createElement("div");
    bar.className = "compareBar";
    bar.setAttribute("data-compare-bar", "");
    bar.hidden = true;
    return bar;
  }

  function updateCompareBar() {
    if (!compareBar) {
      return;
    }

    loadProducts().catch(function () {});

    var selected = compareIds.map(function (id) {
      return productMap[id];
    }).filter(Boolean);

    if (!selected.length) {
      compareBar.hidden = true;
      compareBar.innerHTML = "";
      updateCompareButtons();
      return;
    }

    compareBar.hidden = false;
    compareBar.innerHTML =
      '<div class="compareBar__inner" role="region" aria-label="' + escapeAttribute(labels.comparison) + '">' +
        '<div class="compareBar__summary"><strong>' + escapeHtml(labels.comparison) + '</strong><span class="sr-only">' + escapeHtml(selected.length === 1 ? labels.selectedOne : labels.selectedTwo) + '</span><span aria-hidden="true">' + selected.length + '/2</span></div>' +
        '<div class="compareBar__chips">' + selected.map(function (product) {
          return '<span>' + escapeHtml(displayProductName(product)) + '</span>';
        }).join("") + '</div>' +
        '<button class="compareBar__open" type="button" data-compare-open>' + escapeHtml(labels.open) + '</button>' +
        '<button class="compareBar__clear" type="button" data-compare-clear>' + escapeHtml(labels.clear) + '</button>' +
      '</div>';
    updateCompareButtons();
  }

  function updateCompareButtons() {
    document.querySelectorAll("[data-product-compare]").forEach(function (button) {
      var id = button.getAttribute("data-product-compare");
      if (!id) {
        return;
      }

      var isActive = compareIds.indexOf(id) !== -1;
      button.classList.toggle("is-in-compare", isActive);
      button.textContent = button.closest(".productPreview__compareControls")
        ? compareButtonLabel(id)
        : (isActive ? labels.removeCompare : (compareIds.length >= 2 ? labels.replaceCompare : labels.compare));
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function renderOverlay(content, type, source) {
    closeOverlay(false);
    activeOverlay = document.createElement("div");
    activeOverlay.className = "productExperienceOverlay productExperienceOverlay--" + type;
    activeOverlay.setAttribute("data-product-experience-type", type);
    activeOverlay.setAttribute("data-product-experience-backdrop", "");
    activeOverlay.innerHTML = '<div class="productExperienceOverlay__scroll">' + content + '</div>';
    document.body.appendChild(activeOverlay);
    activeDialog = activeOverlay.querySelector('[role="dialog"]');
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("has-product-experience");
    window.setTimeout(function () {
      activeOverlay.classList.add("is-open");
      focusDialog();
    }, 0);
  }

  function refreshCompareOverlay() {
    if (!activeOverlay || !activeOverlay.querySelector(".compareView")) {
      return;
    }

    activeOverlay.querySelector(".productExperienceOverlay__scroll").innerHTML = renderCompareView();
    activeDialog = activeOverlay.querySelector('[role="dialog"]');
    focusDialog();
  }

  function refreshProductPreviewOverlay() {
    if (!activeOverlay || activeOverlay.getAttribute("data-product-experience-type") !== "product-preview") {
      return;
    }

    var productId = activeOverlay.getAttribute("data-current-product-id");
    var product = productMap[productId];
    if (!product) {
      return;
    }

    var source = activeOverlay.getAttribute("data-current-product-source") || "preview";
    var reason = activeOverlay.getAttribute("data-current-product-reason") || "";
    activeOverlay.querySelector(".productExperienceOverlay__scroll").innerHTML = renderProductPreview(product, source, reason);
    activeDialog = activeOverlay.querySelector('[role="dialog"]');
  }

  function closeOverlay(restoreFocus) {
    if (!activeOverlay) {
      return;
    }

    activeOverlay.remove();
    activeOverlay = null;
    activeDialog = null;
    document.body.style.overflow = previousOverflow || "";
    document.body.classList.remove("has-product-experience");
    updateCompareButtons();

    if (restoreFocus !== false && previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  function focusDialog() {
    if (!activeDialog) {
      return;
    }

    var focusable = getFocusable(activeDialog);
    if (focusable.length) {
      focusable[0].focus();
    } else {
      activeDialog.setAttribute("tabindex", "-1");
      activeDialog.focus();
    }
  }

  function trapFocus(event) {
    var focusable = getFocusable(activeDialog);
    if (!focusable.length) {
      return;
    }

    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function getFocusable(root) {
    return Array.prototype.slice.call(root.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')).filter(function (element) {
      return element.offsetParent !== null;
    });
  }

  function switchPreviewMedia(button) {
    var main = activeOverlay && activeOverlay.querySelector(".productPreview__mainMedia");
    if (!main) {
      return;
    }

    var item = {
      type: button.getAttribute("data-preview-type") || "image",
      src: button.getAttribute("data-preview-src") || "",
      poster: button.getAttribute("data-preview-poster") || "",
      alt: button.getAttribute("data-preview-alt") || ""
    };
    main.innerHTML = renderPreviewMainMedia(item);
    activeOverlay.querySelectorAll("[data-preview-media]").forEach(function (item) {
      item.classList.toggle("is-active", item === button);
    });
  }

  function productMedia(product) {
    if (Array.isArray(product.media) && product.media.length) {
      return product.media.filter(function (item) {
        return item && item.src && (item.type === "image" || item.type === "video");
      }).slice(0, 6).map(function (item) {
        return {
          type: item.type || "image",
          src: item.src,
          poster: item.poster || item.src,
          alt: item.alt || productImageAlt(product)
        };
      });
    }

    var urls = [];
    if (Array.isArray(product.gallery)) {
      urls = product.gallery.filter(Boolean);
    }
    if (product.image && urls.indexOf(product.image) === -1) {
      urls.unshift(product.image);
    }
    return urls.slice(0, 5).map(function (url) {
      return {
        type: "image",
        src: url,
        poster: url,
        alt: productImageAlt(product)
      };
    });
  }

  function renderPreviewMainMedia(item) {
    if (!item || !item.src) {
      return '<div class="productPreview__placeholder">' + escapeHtml(labels.previewTitle) + '</div>';
    }

    if (item.type === "video") {
      return '<video data-preview-main controls playsinline preload="none"' + (item.poster ? ' poster="' + escapeAttribute(item.poster) + '"' : "") + ' aria-label="' + escapeAttribute(item.alt || labels.previewTitle) + '"><source src="' + escapeAttribute(item.src) + '" type="video/mp4"></video>';
    }

    return '<img data-preview-main src="' + escapeAttribute(item.src) + '" alt="' + escapeAttribute(item.alt) + '" decoding="async">';
  }

  function renderPreviewThumb(item, index) {
    var poster = item.poster || item.src;
    return '<button class="productPreview__thumb' + (index === 0 ? " is-active" : "") + '" type="button" data-preview-media="' + index + '" data-preview-type="' + escapeAttribute(item.type || "image") + '" data-preview-src="' + escapeAttribute(item.src) + '" data-preview-poster="' + escapeAttribute(poster) + '" data-preview-alt="' + escapeAttribute(item.alt) + '"><img src="' + escapeAttribute(poster) + '" alt="" loading="lazy" decoding="async">' + (item.type === "video" ? '<span class="productPreview__videoBadge">Video</span>' : "") + '</button>';
  }

  function renderPreviewCompareControls(product, source) {
    if (!isComparableProduct(product)) {
      return "";
    }

    var isActive = compareIds.indexOf(product.id) !== -1;
    var status = compareIds.length === 0 ? labels.compareNoneStatus : (compareIds.length === 1 ? labels.compareOneStatus : labels.compareTwoStatus);
    var controls = '<div class="productPreview__compareControls"><p>' + escapeHtml(status) + '</p>';

    if (compareIds.length === 2) {
      controls += '<button class="btn btn--ghost-dark" type="button" data-compare-open>' + escapeHtml(labels.openCompare) + '</button>';
      if (isActive) {
        controls += '<button class="btn btn--secondary" type="button" data-product-compare="' + escapeAttribute(product.id) + '" data-product-source="' + escapeAttribute(source || "preview") + '">' + escapeHtml(labels.removeCompare) + '</button>';
      } else {
        controls += '<button class="btn btn--secondary" type="button" data-product-compare="' + escapeAttribute(product.id) + '" data-product-source="' + escapeAttribute(source || "preview") + '">' + escapeHtml(labels.replaceCompare) + '</button>';
      }
      return controls + '</div>';
    }

    if (isActive) {
      controls += '<button class="btn btn--secondary" type="button" data-product-compare="' + escapeAttribute(product.id) + '" data-product-source="' + escapeAttribute(source || "preview") + '">' + escapeHtml(labels.removeCompare) + '</button>';
    } else {
      controls += '<button class="btn btn--ghost-dark" type="button" data-product-compare="' + escapeAttribute(product.id) + '" data-product-source="' + escapeAttribute(source || "preview") + '">' + escapeHtml(labels.addCompare) + '</button>';
    }

    if (compareIds.length > 0) {
      controls += '<button class="btn btn--secondary" type="button" data-compare-open>' + escapeHtml(labels.openCompare) + '</button>';
    }

    return controls + '</div>';
  }

  function relatedProducts(product) {
    return products.filter(function (candidate) {
      if (!candidate || candidate.id === product.id || !isComparableProduct(candidate) || !candidate.image) {
        return false;
      }
      if (candidate.category === product.category && candidate.material === product.material) {
        return true;
      }
      if (candidate.category === product.category && candidate.woodCut === product.woodCut) {
        return true;
      }
      return Array.isArray(candidate.useCases) && Array.isArray(product.useCases) && candidate.useCases.some(function (useCase) {
        return product.useCases.indexOf(useCase) !== -1;
      });
    }).slice(0, 3);
  }

  function primaryImage(product) {
    if (Array.isArray(product.gallery) && product.gallery[0]) {
      return product.gallery[0];
    }
    return product.image || "";
  }

  function productFacts(product) {
    var facts = [];
    pushFact(facts, labels.wood, product.material);
    pushFact(facts, labels.construction, constructionLabel(product));
    pushFact(facts, labels.dimensions, dimensionLabel(product));
    pushFact(facts, labels.thickness, meaningful(product.thicknessLabel));
    pushFact(facts, labels.weight, exactWeightLabel(product));
    pushFact(facts, labels.price, displayPriceLabel(product));
    pushFact(facts, labels.juiceGroove, booleanLabel(hasBadge(product, "Saftrille")));
    pushFact(facts, labels.engraving, engravingLabel(product));
    return facts.slice(0, 8);
  }

  function pushFact(facts, label, value) {
    if (value) {
      facts.push([label, value]);
    }
  }

  function productHighlights(product) {
    var highlights = [];
    if (Array.isArray(product.badges)) {
      product.badges.forEach(function (badge) {
        if (badge && highlights.length < 5 && !/cm|kg|Format laut/i.test(String(badge))) {
          highlights.push(normalizeConstructionTerms(badge));
        }
      });
    }
    if (product.material && highlights.indexOf(product.material) === -1) {
      highlights.unshift(product.material);
    }
    if (isEndGrain(product)) {
      highlights.push(isEnglish ? "end-grain construction" : "Stirnholz-Aufbau");
    }
    return unique(highlights).slice(0, 5);
  }

  function productMoment(product) {
    var text = [product.name, product.displayName, product.segment, product.shortDescription].join(" ").toLowerCase();
    if (product.category === "care") {
      return isEnglish ? "For boards that should be cared for instead of replaced." : "Für Bretter, die gepflegt statt ersetzt werden sollen.";
    }
    if (/teigschaber|dough|scraper/.test(text)) {
      return isEnglish ? "For sourdough, bread dough and quiet work with real material." : "Für Sauerteig, Brotteig und ruhiges Arbeiten mit echtem Material.";
    }
    if (/erbst/.test(text)) {
      return isEnglish ? "For people who do not want a reproducible standard product." : "Für Menschen, die kein reproduzierbares Serienprodukt suchen.";
    }
    if (isEndGrain(product)) {
      return isEnglish ? "For intensive kitchen work with good knives." : "Für intensive Küchenarbeit mit guten Messern.";
    }
    if (Array.isArray(product.useCases) && product.useCases.indexOf("bbq") !== -1) {
      return isEnglish ? "For the moment after grilling." : "Für den Moment nach dem Grillen.";
    }
    if (product.servingSuitable || product.giftable) {
      return isEnglish ? "For the moment when a board does not just cut, but stays on the table." : "Für den Moment, in dem ein Brett nicht nur schneidet, sondern auf dem Tisch bleibt.";
    }
    return isEnglish ? "For kitchen moments where the board may stay visible." : "Für Küchenmomente, in denen das Brett sichtbar bleiben darf.";
  }

  function productProof(product) {
    if (product.longDescription) {
      return normalizeConstructionTerms(product.longDescription);
    }
    if (isEndGrain(product)) {
      return isEnglish ? "Standing wood fibres make end grain more involved to produce and give it its dense, substantial character." : "Stehende Holzfasern machen Stirnholz aufwendiger in der Fertigung und geben dem Brett seinen dichten, massiven Charakter.";
    }
    if (product.material) {
      return isEnglish ? "Material, surface and format define how this product feels in daily use." : "Material, Oberfläche und Format bestimmen, wie sich dieses Produkt im Alltag anfühlt.";
    }
    return isEnglish ? "The product details come from the central Edle Hölzer product data." : "Die Produktdetails stammen aus der zentralen Produktdatenbasis von Edle Hölzer.";
  }

  function productExperienceText(product) {
    if (product.shortDescription) {
      return product.shortDescription;
    }
    if (product.category === "care") {
      return isEnglish ? "Care products support the surface when wood becomes dry, matte or rough." : "Pflegeprodukte unterstützen die Oberfläche, wenn Holz trocken, matt oder rau wird.";
    }
    if (product.category === "accessory") {
      return isEnglish ? "This tool is made for regular kitchen use, not for disappearing unused in a drawer." : "Dieses Werkzeug ist für regelmäßige Küchenarbeit gedacht, nicht für die ungenutzte Schublade.";
    }
    return isEnglish ? "This board is made for people who want to use, care for and keep a real piece of wood." : "Dieses Brett ist für Menschen gedacht, die ein echtes Stück Holz benutzen, pflegen und behalten wollen.";
  }

  function careNote(product) {
    if (product.category === "care") {
      return isEnglish ? "Use care products according to their instructions and let treated wood dry openly." : "Pflegeprodukte nach Anleitung verwenden und behandeltes Holz offen trocknen lassen.";
    }
    return isEnglish ? "Wood should not go into the dishwasher. Let it dry after cleaning and care for it when the surface becomes dry." : "Holz gehört nicht in die Spülmaschine. Nach dem Reinigen trocknen lassen und pflegen, wenn die Oberfläche trocken wirkt.";
  }

  function decisionHint(product, comparedTo) {
    if (product.decisionHint) {
      return product.decisionHint;
    }
    var text = [
      product.name,
      product.displayName,
      product.segment,
      product.shortDescription,
      product.material
    ].join(" ").toLowerCase();

    if (product.category === "care") {
      return isEnglish ? "Choose this product if your wooden board looks dry and you want to refresh the surface." : "Wähle dieses Produkt, wenn dein Holzbrett trocken wirkt und du die Oberfläche nachpflegen möchtest.";
    }
    if (product.category === "accessory") {
      if (/teigschaber|dough|scraper/.test(text)) {
        return isEnglish ? "Choose this product if you work with dough regularly and want a simple wooden tool instead of plastic." : "Wähle dieses Produkt, wenn du regelmäßig mit Teig arbeitest und ein einfaches Holzwerkzeug statt Kunststoff in der Küche möchtest.";
      }
      return isEnglish ? "Choose this product if you want a smaller wooden kitchen tool rather than another cutting board." : "Wähle dieses Produkt, wenn du ein kleineres Holzwerkzeug für die Küche suchst und kein weiteres Schneidebrett.";
    }
    if (/brotzeit|frühstück|breakfast|snack/.test(text)) {
      return isEnglish ? "Choose this board if you want a smaller board for breakfast, snacks and serving at the table, not a heavy work board." : "Wähle dieses Brett, wenn du ein kleineres Brett für Frühstück, Brotzeit und Servieren am Tisch suchst, nicht als schweres Arbeitsbrett.";
    }
    if (isEndGrain(product)) {
      if (hasBadge(product, "Saftrille")) {
        return isEnglish ? "Choose this board if you want a substantial work board for repeated cutting, serving and liquids from meat, fruit or vegetables." : "Wähle dieses Brett, wenn du ein massives Arbeitsbrett für intensives Schneiden, Servieren und austretende Flüssigkeit suchst.";
      }
      return isEnglish ? "Choose this board if you cut regularly, use good knives and accept a heavier work board." : "Wähle dieses Brett, wenn du regelmäßig schneidest, gute Messer nutzt und ein schwereres Arbeitsbrett akzeptierst.";
    }
    if (/nussbaum|walnut/i.test(String(product.material || product.name))) {
      return isEnglish ? "Choose this board if dark appearance and table presence matter more than a brighter everyday look." : "Wähle dieses Brett, wenn dir dunkle Optik und Wirkung am Tisch wichtiger sind als ein helleres Alltagsbild.";
    }
    if (/eiche|oak/i.test(String(product.material || product.name))) {
      return isEnglish ? "Choose this board if you want a brighter everyday board that feels less massive than end grain." : "Wähle dieses Brett, wenn du ein helleres Alltagsbrett suchst, das weniger wuchtig wirkt als Stirnholz.";
    }
    if (/bambus|birke|bamboo|birch/.test(text)) {
      return isEnglish ? "Choose this board if you want a larger work surface and a brighter, more graphic material look." : "Wähle dieses Brett, wenn du eine größere Arbeitsfläche und ein helleres, grafisches Materialbild suchst.";
    }
    if (Array.isArray(product.useCases) && product.useCases.indexOf("bbq") !== -1) {
      return isEnglish ? "Choose this board if you mainly carve, season and serve after grilling." : "Wähle dieses Brett, wenn du vor allem nach dem Grillen tranchierst, würzt und servierst.";
    }
    if (comparedTo && product.category !== comparedTo.category) {
      return isEnglish ? "Choose this if this product type matches the task you actually need." : "Wähle dieses Produkt, wenn genau diese Produktart zu deiner eigentlichen Aufgabe passt.";
    }
    return "";
  }

  function constructionLabel(product) {
    if (!product || product.category !== "board") {
      return "";
    }
    return isEndGrain(product) ? "Stirnholz" : "Langholz";
  }

  function isEndGrain(product) {
    var text = [
      product.woodCut,
      product.name,
      product.displayName,
      product.title,
      product.shortDescription,
      product.longDescription
    ].join(" ").toLowerCase();
    return product.woodCut === "end" || /stirnholz|end\s*grain/.test(text);
  }

  function dimensionLabel(product) {
    return meaningful(product.sizeLabel) ||
      meaningful(product.dimensions) ||
      extractDimensionsFromText([
        product.displayName,
        product.name,
        product.title,
        product.shortDescription,
        product.longDescription
      ].join(" "));
  }

  function extractDimensionsFromText(text) {
    if (!text) {
      return "";
    }
    var normalized = String(text)
      .replace(/×/g, "x")
      .replace(/\s+/g, " ");
    var match = normalized.match(/(?:maße|masse|größe|format)?\s*:?\s*(ca\.\s*)?(\d{1,3}(?:[,.]\d+)?)\s*x\s*(\d{1,3}(?:[,.]\d+)?)(?:\s*x\s*(\d{1,3}(?:[,.]\d+)?))?\s*cm\b/i);
    if (!match) {
      return "";
    }
    var prefix = match[1] ? "ca. " : "";
    var values = [match[2], match[3], match[4]].filter(Boolean).map(function (value) {
      return value.replace(".", ",");
    });
    return prefix + values.join(" × ") + " cm";
  }

  function normalizeConstructionTerms(value) {
    return String(value || "")
      .replace(/Face\s*Grain|Edge\s*Grain|Long\s*Grain/gi, "Langholz")
      .replace(/Flankenholz|Längsholz/gi, "Langholz");
  }

  function weightLabel(product) {
    var weight = product.weight || product.weightLabel;
    if (weight) {
      return weight;
    }
    if (product.weightClass === "heavy") {
      return isEnglish ? "heavy" : "schwer";
    }
    if (product.weightClass === "medium") {
      return isEnglish ? "medium" : "mittel";
    }
    if (product.weightClass === "light") {
      return isEnglish ? "light" : "leicht";
    }
    return "";
  }

  function exactWeightLabel(product) {
    var weight = product.weight || product.weightLabel || "";
    if (/(^|\s)(ca\.\s*)?\d+(?:[,.]\d+)?\s*(kg|g)\b/i.test(String(weight))) {
      return String(weight);
    }
    return "";
  }

  function displayPriceLabel(product) {
    return String(product && product.priceLabel ? product.priceLabel : "")
      .replace(/\s*EUR\b/g, " €")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  function productUseLabel(product) {
    if (product.category === "care") {
      return isEnglish ? "Care for wood surfaces" : "Pflege von Holzoberflächen";
    }
    if (product.category === "accessory") {
      return isEnglish ? "Kitchen tool" : "Küchenwerkzeug";
    }
    if (product.category === "board") {
      return isEnglish ? "Cutting and serving" : "Schneiden und Servieren";
    }
    return product.segment || "";
  }

  function productApplication(product) {
    if (product.category === "care") {
      return isEnglish ? "Refreshing dry or matte wood" : "Trockene oder matte Holzoberflächen auffrischen";
    }
    if (product.category === "accessory") {
      return productMoment(product);
    }
    return productExperienceText(product);
  }

  function productRole(product) {
    if (product.category === "accessory") {
      return isEnglish ? "tool" : "Werkzeug";
    }
    if (product.category === "care") {
      return isEnglish ? "care product" : "Pflegeprodukt";
    }
    if (product.giftable) {
      return isEnglish ? "board and gift" : "Brett und Geschenk";
    }
    return isEnglish ? "board" : "Brett";
  }

  function engravingLabel(product) {
    if (product.engravingPossible === true || hasBadge(product, "Gravur") || hasBadge(product, "personalisierbar")) {
      return isEnglish ? "on request" : "auf Anfrage";
    }
    return "";
  }

  function booleanLabel(value) {
    return value ? (isEnglish ? "yes" : "ja") : "";
  }

  function compareButtonLabel(productId) {
    if (compareIds.indexOf(productId) !== -1) {
      return labels.removeCompare;
    }
    if (compareIds.length >= 2) {
      return labels.replaceCompare;
    }
    return labels.addCompare;
  }

  function hasVerifiedListing(product) {
    return Boolean(isAvailableProduct(product) && product.directListingUrlVerified === true && (product.etsyListingUrl || product.etsyUrl));
  }

  function availabilityStatus(product) {
    if (!product) {
      return "inactive";
    }
    if (product.availabilityStatus) {
      return String(product.availabilityStatus).toLowerCase();
    }
    if (product.active === false) {
      return "inactive";
    }
    if (product.directListingUrlVerified === true && (product.etsyListingUrl || product.etsyUrl)) {
      return "available";
    }
    return "unknown";
  }

  function isAvailableProduct(product) {
    return availabilityStatus(product) === "available";
  }

  function isGridProduct(product) {
    if (!product || product.active !== true || product.visibility === "hidden" || product.visibility === "archive") {
      return false;
    }
    if (availabilityStatus(product) === "made_to_order") {
      return product.visibility === "grid";
    }
    return isAvailableProduct(product) && product.directListingUrlVerified === true && Boolean(product.etsyListingUrl || product.etsyUrl);
  }

  function isComparableProduct(product) {
    return isGridProduct(product) || product.visibility === "preview_only";
  }

  function etsyActionLabel(product) {
    if (product.category === "care") {
      return labels.buyCare;
    }
    if (product.category && product.category !== "board") {
      return labels.buyProduct;
    }
    return labels.buyBoard;
  }

  function etsyActionUrl(product) {
    return product.etsyListingUrl || product.etsyUrl || "";
  }

  function displayProductName(product) {
    var name = String(product.displayName || product.name || "");
    if (name.indexOf("|") !== -1) {
      name = name.split("|")[0];
    }
    return name
      .replace(/:\s*\d{1,3}(?:[,.]\d+)?\s*[x×].*$/i, "")
      .replace(/\s+[–-]\s*\d{1,3}(?:[,.]\d+)?\s*[x×].*$/i, "")
      .replace(/\s{2,}/g, " ")
      .trim() || (isEnglish ? "View product" : "Produkt ansehen");
  }

  function productImageAlt(product) {
    if (product.category === "care") {
      return isEnglish ? "Wood care product for cutting boards" : "Holzpflegeprodukt für Schneidebretter";
    }
    if (product.category === "accessory") {
      return isEnglish ? "Handmade wooden kitchen accessory by Edle Hölzer" : "Handgefertigtes Küchenaccessoire aus Holz von Edle Hölzer";
    }
    return (isEnglish ? "Wooden cutting board by Edle Hölzer" : "Schneidebrett aus Holz von Edle Hölzer") + (product.material ? " - " + product.material : "");
  }

  function meaningful(value) {
    if (!value) {
      return "";
    }
    var text = String(value);
    if (/Format laut Etsy|laut Etsy-Export|laut Etsy-Listing|Set laut|nicht relevant/i.test(text)) {
      return "";
    }
    return text;
  }

  function displayValue(value) {
    return meaningful(value) || "";
  }

  function hasBadge(product, term) {
    return Array.isArray(product.badges) && product.badges.some(function (badge) {
      return String(badge || "").toLowerCase().indexOf(String(term).toLowerCase()) !== -1;
    });
  }

  function unique(items) {
    var seen = {};
    return items.filter(function (item) {
      var key = String(item || "").toLowerCase();
      if (!key || seen[key]) {
        return false;
      }
      seen[key] = true;
      return true;
    });
  }

  function readCompareState() {
    try {
      var raw = window.localStorage && window.localStorage.getItem("edleHoelzerCompareProducts");
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(Boolean).slice(0, 2) : [];
    } catch (error) {
      return [];
    }
  }

  function writeCompareState() {
    try {
      if (window.localStorage) {
        window.localStorage.setItem("edleHoelzerCompareProducts", JSON.stringify(compareIds.slice(0, 2)));
      }
    } catch (error) {
      // Vergleich funktioniert auch ohne localStorage.
    }
  }

  function track(eventName, product, extra) {
    var payload = Object.assign({
      product_id: product && product.id,
      product_title: product && displayProductName(product),
      product_category: product && product.category,
      wood: product && product.material
    }, extra || {});

    if (window.umami && typeof window.umami.track === "function") {
      window.umami.track(eventName, payload);
    }
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value);
  }
}

function initProductsPage() {
  var finderRoot = document.querySelector("[data-product-finder]");
  var gridRoot = document.querySelector("[data-products-grid]");

  if (!finderRoot && !gridRoot) {
    return;
  }

  var state = {
    products: [],
    activeProducts: [],
    currentStep: 0,
    answers: {},
    highlightedIds: []
  };

  var isEnglish = (document.documentElement.lang || "").toLowerCase().indexOf("en") === 0;
  var gridAnchor = isEnglish ? "#products-grid" : "#produkte-grid";
  var shopTitle = isEnglish ? "You are leaving for the Edle Hölzer Etsy shop" : "Du wechselst jetzt zum Etsy-Shop von Edle Hölzer";

  var questionsDe = [
    {
      id: "use",
      title: "Wofür möchtest du das Holzstück verwenden?",
      options: [
        {
          value: "daily",
          title: "Frühstück & täglich kochen",
          description: "Für Brot, Gemüse und die Arbeitsfläche, auf der jeden Tag geschnitten, belegt oder vorbereitet wird.",
          attributes: "ruhig liegend · gut führbar · täglich"
        },
        {
          value: "bbq",
          title: "Am Grill servieren",
          description: "Für Fleisch, Grillabende und den Moment, in dem geschnitten, gesalzen und serviert wird.",
          attributes: "Fläche · Gewicht · Saftrille"
        },
        {
          value: "serving",
          title: "Am Tisch sichtbar bleiben",
          description: "Für Brotzeit, Käse, Steak oder Tischsituationen, in denen das Brett nicht sofort weggeräumt wird.",
          attributes: "Maserung · Haptik · Tischmoment"
        },
        {
          value: "gift",
          title: "Sichtbar schenken",
          description: "Für Menschen, die ein Geschenk benutzen, pflegen und offen liegen lassen.",
          attributes: "Gravur · Material · Erinnerung"
        }
      ]
    },
    {
      id: "space",
      title: "Wo soll das Brett später liegen?",
      options: [
        {
          value: "small",
          title: "Es wird oft weggeräumt",
          description: "Das Brett soll funktionieren, ohne dauerhaft viel Arbeitsfläche zu blockieren.",
          attributes: "kompakt · beweglich · platzsparend"
        },
        {
          value: "normal",
          title: "Auf normaler Arbeitsfläche",
          description: "Es darf spürbar sein, soll aber noch gut zu reinigen und zu bewegen bleiben.",
          attributes: "ausgewogen · mittelgroß · nutzbar"
        },
        {
          value: "large",
          title: "Es darf sichtbar liegen bleiben",
          description: "Für große Arbeitsflächen, Kücheninseln und feste Plätze am Grill oder Tisch.",
          attributes: "schwerer · ruhiger · sichtbar"
        }
      ]
    },
    {
      id: "movement",
      title: "Wie oft willst du es anheben?",
      options: [
        {
          value: "portable",
          title: "Oft",
          description: "Wenn du das Brett regelmäßig herausnimmst, reinigst und wieder wegstellst.",
          attributes: "leicht · handlich · flexibel"
        },
        {
          value: "balanced",
          title: "Gelegentlich",
          description: "Das Brett soll ruhig liegen, aber im Alltag noch gut bewegt werden können.",
          attributes: "balanciert · griffig · alltagstauglich"
        },
        {
          value: "stationary",
          title: "Selten",
          description: "Für feste Plätze, große Kücheninseln und Menschen, die eine sichtbare Arbeitsfläche suchen.",
          attributes: "stationär · massiv · ruhig liegend"
        }
      ]
    },
    {
      id: "haptics",
      title: "Welches Gefühl passt besser zu dir?",
      options: [
        {
          value: "smooth",
          title: "Leichter und schneller geführt",
          description: "Für schnelle Nutzung, wenig Gewicht und möglichst unkompliziertes Handling.",
          attributes: "schlank · glatt · beweglich"
        },
        {
          value: "solid",
          title: "Spürbar, aber alltagstauglich",
          description: "Ein ausgewogenes Verhältnis aus Substanz, Handling und täglicher Nutzbarkeit.",
          attributes: "solide · ausgewogen · griffig"
        },
        {
          value: "substantial",
          title: "Schwerer und sichtbar",
          description: "Für Nutzer, die Gewicht, Stärke und klare Materialwirkung bewusst möchten.",
          attributes: "dick · schwer · materialstark"
        }
      ]
    },
    {
      id: "priority",
      title: "Was ist dir am wichtigsten?",
      options: [
        {
          value: "daily",
          title: "Alltagstauglichkeit",
          description: "Das Brett soll jeden Tag funktionieren und nicht mehr Aufmerksamkeit brauchen als nötig.",
          attributes: "praktisch · gut beweglich · direkt nutzbar"
        },
        {
          value: "knifeFeel",
          title: "Messergefühl",
          description: "Eine satte, ruhige Oberfläche ist wichtiger als möglichst geringes Gewicht.",
          attributes: "ruhiger Schnitt · stabil · spürbar"
        },
        {
          value: "serving",
          title: "Optik beim Servieren",
          description: "Das Brett soll nicht nur schneiden, sondern beim Anrichten sichtbar bleiben.",
          attributes: "sichtbar · ruhig · am Tisch"
        },
        {
          value: "premium",
          title: "Maximale Materialwirkung",
          description: "Gesucht ist ein Brett mit viel Präsenz, Haptik und spürbarer Stärke.",
          attributes: "Gewicht · Stärke · Maserung"
        }
      ]
    }
  ];

  var questionsEn = [
    {
      id: "use",
      title: "What will you use the wooden piece for?",
      options: [
        {
          value: "daily",
          title: "Breakfast & daily cooking",
          description: "For bread, vegetables and the worktop where you cut, prepare or serve every day.",
          attributes: "steady · easy to handle · daily"
        },
        {
          value: "bbq",
          title: "Serving at the grill",
          description: "For meat, grilling and the moment when food is sliced, seasoned and served.",
          attributes: "surface · weight · juice groove"
        },
        {
          value: "serving",
          title: "Staying visible at the table",
          description: "For bread, cheese, steak or table situations where the board is not put away immediately.",
          attributes: "grain · feel · table moment"
        },
        {
          value: "gift",
          title: "A visible gift",
          description: "For people who will use, care for and keep the gift visible.",
          attributes: "engraving · material · memory"
        }
      ]
    },
    {
      id: "space",
      title: "Where will the board live?",
      options: [
        {
          value: "small",
          title: "It will often be put away",
          description: "The board should work without permanently taking over the worktop.",
          attributes: "compact · movable · space-saving"
        },
        {
          value: "normal",
          title: "On a regular worktop",
          description: "It may have substance, but should still be easy to clean and move.",
          attributes: "balanced · medium-sized · useful"
        },
        {
          value: "large",
          title: "It can stay visible",
          description: "For large worktops, kitchen islands and fixed places at the grill or table.",
          attributes: "heavier · calmer · visible"
        }
      ]
    },
    {
      id: "movement",
      title: "How often do you want to lift it?",
      options: [
        {
          value: "portable",
          title: "Often",
          description: "If you often take the board out, clean it and put it away again.",
          attributes: "light · handy · flexible"
        },
        {
          value: "balanced",
          title: "Sometimes",
          description: "The board should lie solidly but still be easy to handle in everyday use.",
          attributes: "balanced · grippy · practical"
        },
        {
          value: "stationary",
          title: "Rarely",
          description: "For fixed places, large kitchen islands and people looking for a visible work surface.",
          attributes: "stationary · solid · calm"
        }
      ]
    },
    {
      id: "haptics",
      title: "Which feel suits you better?",
      options: [
        {
          value: "smooth",
          title: "Lighter and easier to handle",
          description: "For quick use, lower weight and uncomplicated handling.",
          attributes: "slim · smooth · movable"
        },
        {
          value: "solid",
          title: "Tactile, but practical",
          description: "A balanced mix of substance, handling and daily usability.",
          attributes: "solid · balanced · grippy"
        },
        {
          value: "substantial",
          title: "Heavier and visible",
          description: "For users who deliberately want weight, thickness and a strong material feel.",
          attributes: "thick · heavy · material-rich"
        }
      ]
    },
    {
      id: "priority",
      title: "What matters most to you?",
      options: [
        {
          value: "daily",
          title: "Everyday practicality",
          description: "The board should work every day without needing unnecessary attention.",
          attributes: "practical · movable · ready to use"
        },
        {
          value: "knifeFeel",
          title: "Knife feel",
          description: "A calm, substantial cutting surface matters more than the lowest possible weight.",
          attributes: "calm cut · stable · tactile"
        },
        {
          value: "serving",
          title: "Serving appearance",
          description: "The board should not only cut, but stay visible when plating or serving.",
          attributes: "visible · calm · table-ready"
        },
        {
          value: "premium",
          title: "Maximum material presence",
          description: "You are looking for a board with weight, feel and visible thickness.",
          attributes: "weight · thickness · grain"
        }
      ]
    }
  ];

  var questions = isEnglish ? questionsEn : questionsDe;

  var requiredFields = [
    "id",
    "name",
    "category",
    "segment",
    "priceLabel",
    "priceOrder",
    "shortDescription",
    "longDescription",
    "badges",
    "etsyUrl",
    "featured",
    "active",
    "needsReview",
    "dataVerified",
    "imageVerified",
    "directListingUrlVerified",
    "productType",
    "material",
    "woodCut",
    "sizeLabel",
    "thicknessLabel",
    "sizeProfile",
    "weightClass",
    "portability",
    "kitchenFit",
    "useCases",
    "servingSuitable",
    "tactileProfile",
    "premiumLevel",
    "giftable",
    "careIntensity",
    "recommendedFor",
    "notIdealFor"
  ];

  var allowedValues = {
    woodCut: ["edge", "end", "none"],
    sizeProfile: ["compact", "medium", "large"],
    weightClass: ["light", "medium", "heavy"],
    portability: ["portable", "balanced", "stationary"],
    kitchenFit: ["small", "normal", "large"],
    tactileProfile: ["smooth", "solid", "substantial"],
    premiumLevel: [1, 2, 3],
    careIntensity: ["low", "medium"]
  };

  fetch(EDLE_HOELZER_PRODUCTS_URL)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("products.json konnte nicht geladen werden.");
      }
      return response.json();
    })
    .then(function (data) {
      var products = Array.isArray(data) ? data : data.products;
      if (!Array.isArray(products)) {
        throw new Error("products.json enthält keine Produktliste.");
      }

      state.products = products;
      state.activeProducts = products.filter(isGridProduct);

      validateProducts(products);
      renderFinder();
      renderGrid();
      bindFilters();
    })
    .catch(function (error) {
      console.warn("[Edle Hölzer] Produktdaten konnten nicht initialisiert werden:", error);
      if (finderRoot) {
        finderRoot.setAttribute("aria-live", "polite");
        finderRoot.innerHTML = isEnglish
          ? '<div class="finderShell__top"><div><span class="finderStepLabel">Product finder unavailable</span><h3>The product selection could not be loaded.</h3><p>Please use one of these direct alternatives.</p></div></div><div class="ctaRow"><a class="btn" href="https://edlehoelzervonkoc.etsy.com" target="_blank" rel="noopener" data-etsy-link title="' + shopTitle + '">View all available boards</a><a class="btn btn--ghost-dark" href="/en/custom-cutting-board/">Request a custom board</a></div>'
          : '<div class="finderShell__top"><div><span class="finderStepLabel">Brettfinder nicht verfügbar</span><h3>Die Produktauswahl konnte nicht geladen werden.</h3><p>Nutze bitte eine dieser direkten Alternativen.</p></div></div><div class="ctaRow"><a class="btn" href="https://edlehoelzervonkoc.etsy.com" target="_blank" rel="noopener" data-etsy-link title="' + shopTitle + '">Alle verfügbaren Bretter ansehen</a><a class="btn btn--ghost-dark" href="/schneidebrett-nach-mass/">Wunschbrett anfragen</a></div>';
      }
      if (gridRoot) {
        gridRoot.innerHTML = isEnglish
          ? '<p class="productEmpty">The selection could not be loaded right now. Please view the products directly in the <a href="https://edlehoelzervonkoc.etsy.com" data-etsy-link title="' + shopTitle + '">Etsy shop</a>.</p>'
          : '<p class="productEmpty">Die Auswahl konnte gerade nicht geladen werden. Bitte direkt im <a href="https://edlehoelzervonkoc.etsy.com" data-etsy-link title="' + shopTitle + '">Etsy-Shop</a> ansehen.</p>';
      }
    });

  function validateProducts(products) {
    products.forEach(function (product) {
      requiredFields.forEach(function (field) {
        var value = product[field];
        var missing =
          value === undefined ||
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0);

        if (missing && field !== "etsyUrl") {
          console.warn("[Edle Hölzer] Produktfeld fehlt:", product.id || product.name, field);
        }
      });

      Object.keys(allowedValues).forEach(function (field) {
        if (allowedValues[field].indexOf(product[field]) === -1) {
          console.warn("[Edle Hölzer] Unerwarteter Produktwert:", product.id, field, product[field]);
        }
      });

      if (product.active && product.image && product.imageVerified !== true) {
        console.warn("[Edle Hölzer] Produktbild ist vorhanden, aber nicht verifiziert und wird nicht angezeigt:", product.id);
      }

      if (product.active && product.category === "board" && !product.etsyUrl) {
        console.warn("[Edle Hölzer] Aktives Brett ohne Etsy-Link wird nicht prominent empfohlen:", product.id);
      }

      if (product.directListingUrlVerified === true && !product.listingId) {
        console.warn("[Edle Hölzer] Verifizierter Etsy-Direktlink ohne Listing-ID:", product.id);
      }

      if (product.active && product.image && product.imageVerified === true && product.image.charAt(0) === "/") {
        checkImage(product.image, product.id);
      }
    });
  }

  function checkImage(src, productId) {
    var img = new Image();
    img.onerror = function () {
      console.warn("[Edle Hölzer] Produktbild nicht erreichbar:", productId, src);
    };
    img.src = src;
  }

  function renderFinder() {
    if (!finderRoot) {
      return;
    }

    var question = questions[state.currentStep];
    var stepLabel = finderRoot.querySelector("[data-finder-step-label]");
    var questionNode = finderRoot.querySelector("[data-finder-question]");
    var progressNode = finderRoot.querySelector("[data-finder-progress]");
    var optionsNode = finderRoot.querySelector("[data-finder-options]");
    var prevButton = finderRoot.querySelector("[data-finder-prev]");
    var nextButton = finderRoot.querySelector("[data-finder-next]");

    if (!question || !optionsNode || !questionNode || !stepLabel || !progressNode || !prevButton || !nextButton) {
      return;
    }

    stepLabel.textContent = (isEnglish ? "Step " : "Schritt ") + (state.currentStep + 1) + (isEnglish ? " of " : " von ") + questions.length;
    questionNode.textContent = question.title;
    progressNode.style.width = (((state.currentStep + 1) / questions.length) * 100) + "%";
    optionsNode.innerHTML = question.options
      .map(function (option) {
        var isSelected = state.answers[question.id] && state.answers[question.id].value === option.value;
        return '<button class="finderOption' + (isSelected ? " is-selected" : "") + '" type="button" data-option="' + escapeHtml(option.value) + '" aria-pressed="' + (isSelected ? "true" : "false") + '">' +
          '<span class="finderOption__title">' + escapeHtml(option.title) + '</span>' +
          '<span class="finderOption__description">' + escapeHtml(option.description) + '</span>' +
          '<span class="finderOption__attributes">' + escapeHtml(option.attributes) + '</span>' +
        '</button>';
      })
      .join("");

    prevButton.disabled = state.currentStep === 0;
    nextButton.disabled = !state.answers[question.id];
    nextButton.textContent = state.currentStep === questions.length - 1
      ? (isEnglish ? "Show result" : "Ergebnis anzeigen")
      : (isEnglish ? "Next" : "Weiter");

    optionsNode.querySelectorAll("[data-option]").forEach(function (button) {
      button.addEventListener("click", function () {
        var value = button.getAttribute("data-option");
        var selected = question.options.find(function (option) {
          return option.value === value;
        });

        if (!selected) {
          return;
        }

        state.answers[question.id] = selected;
        if (state.currentStep < questions.length - 1) {
          state.currentStep += 1;
          renderFinder();
          keepFinderQuestionVisible();
        } else {
          renderFinder();
          showFinderResult();
          keepFinderQuestionVisible(true);
        }
      });
    });

    prevButton.onclick = function () {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
        renderFinder();
        keepFinderQuestionVisible();
      }
    };

    nextButton.onclick = function () {
      if (!state.answers[question.id]) {
        return;
      }

      if (state.currentStep < questions.length - 1) {
        state.currentStep += 1;
        renderFinder();
        keepFinderQuestionVisible();
      } else {
        showFinderResult();
        keepFinderQuestionVisible(true);
      }
    };
  }

  function keepFinderQuestionVisible(showResult) {
    if (!window.matchMedia("(max-width: 767px)").matches) {
      return;
    }

    window.setTimeout(function () {
      var target = showResult
        ? document.querySelector("[data-finder-result]")
        : finderRoot.querySelector("[data-finder-question]");

      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 40);
  }

  function showFinderResult() {
    var resultRoot = document.querySelector("[data-finder-result]");
    if (!resultRoot) {
      return;
    }

    var rankedProducts = rankProducts().filter(function (product) {
      return canRecommendAsMainBoard(product);
    });
    var main = rankedProducts[0];
    var alternatives = rankedProducts.slice(1, 3);

    if (!main) {
      resultRoot.hidden = false;
      resultRoot.innerHTML = isEnglish
        ? '<h2>This is probably the best direction for your everyday use</h2><p>For this combination, a short personal check makes sense so format, wood and use really fit together.</p><div class="ctaRow"><a class="btn" href="mailto:info@edlehoelzer.de?subject=Wooden%20piece%20inquiry">Ask about a wooden piece</a><button class="btn btn--ghost-dark" type="button" data-finder-reset>Restart finder</button></div>'
        : '<h2>Das dürfte am besten zu deinem Alltag passen</h2><p>Für diese Kombination ist eine kurze persönliche Abstimmung sinnvoll, damit Format, Holzart und Nutzung wirklich zusammenpassen.</p><div class="ctaRow"><a class="btn" href="mailto:info@edlehoelzer.de?subject=Anfrage%20Holzst%C3%BCck">Holzstück anfragen</a><button class="btn btn--ghost-dark" type="button" data-finder-reset>Finder neu starten</button></div>';
      bindReset(resultRoot);
      return;
    }

    state.highlightedIds = [main.id].concat(alternatives.map(function (product) {
      return product.id;
    }));

    resultRoot.hidden = false;
    resultRoot.innerHTML =
      '<div class="finderResult__head">' +
        '<p class="eyebrow eyebrow--dark">' + (isEnglish ? "Recommendation" : "Empfehlung") + '</p>' +
        '<h2>' + (isEnglish ? "This is probably the best direction for your everyday use" : "Das dürfte am besten zu deinem Alltag passen") + '</h2>' +
        '<p><strong>' + (isEnglish ? "This board fits because: " : "Dieses Brett passt, weil: ") + '</strong>' + escapeHtml(buildReason(main)) + '</p>' +
      '</div>' +
      '<div class="recommendationCard">' +
        buildProductMedia(main, false) +
        '<div class="recommendationCard__body">' +
          '<p class="productCard__segment">' + escapeHtml(main.segment) + '</p>' +
          '<h3>' + escapeHtml(displayProductName(main)) + '</h3>' +
          buildFeatureBadges(main) +
          buildProductFacts(main) +
          '<p class="productCard__price">' + escapeHtml(displayPriceLabel(main)) + '</p>' +
          buildProductActions(main, "finder", buildReason(main)) +
          '<div class="ctaRow finderResult__secondaryActions">' +
            '<a class="btn btn--ghost-dark" href="' + gridAnchor + '">' + (isEnglish ? "View product grid" : "Produktgrid ansehen") + '</a>' +
            '<button class="btn btn--ghost-dark" type="button" data-finder-reset>' + (isEnglish ? "Restart" : "Neu starten") + '</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      (alternatives.length ? '<div class="alternativeList"><h3>' + (isEnglish ? "Alternatives" : "Alternativen") + '</h3><div class="alternativeGrid">' + alternatives.map(buildAlternativeCard).join("") + '</div></div>' : "");

    bindReset(resultRoot);
    renderGrid();
    resultRoot.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function bindReset(root) {
    root.querySelectorAll("[data-finder-reset]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.currentStep = 0;
        state.answers = {};
        state.highlightedIds = [];
        root.hidden = true;
        root.innerHTML = "";
        renderFinder();
        renderGrid();
        if (finderRoot) {
          finderRoot.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  function rankProducts() {
    return state.activeProducts
      .map(function (product) {
        return {
          product: product,
          score: scoreProduct(product)
        };
      })
      .sort(function (a, b) {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        if (a.product.needsReview !== b.product.needsReview) {
          return a.product.needsReview ? 1 : -1;
        }
        if (a.product.featured !== b.product.featured) {
          return a.product.featured ? -1 : 1;
        }
        return Number(a.product.priceOrder || 0) - Number(b.product.priceOrder || 0);
      })
      .map(function (entry) {
        return entry.product;
      });
  }

  function scoreProduct(product) {
    var score = 0;
    var use = state.answers.use && state.answers.use.value;
    var space = state.answers.space && state.answers.space.value;
    var movement = state.answers.movement && state.answers.movement.value;
    var haptics = state.answers.haptics && state.answers.haptics.value;
    var priority = state.answers.priority && state.answers.priority.value;

    if (use && Array.isArray(product.useCases) && product.useCases.indexOf(use) !== -1) {
      score += 5;
    }

    if (space && product.kitchenFit === space) {
      score += 4;
    }

    if (movement && product.portability === movement) {
      score += 4;
    }

    if (haptics && product.tactileProfile === haptics) {
      score += 4;
    }

    if (priority === "daily" && Array.isArray(product.useCases) && product.useCases.indexOf("daily") !== -1) {
      score += 4;
    }

    if (priority === "knifeFeel" && (product.woodCut === "end" || product.tactileProfile === "solid" || product.tactileProfile === "substantial")) {
      score += 4;
    }

    if (priority === "serving" && product.servingSuitable) {
      score += 4;
    }

    if (priority === "premium") {
      score += Number(product.premiumLevel || 0) * 2;
    }

    if (use === "gift" && product.giftable) {
      score += 3;
    }

    if (isStatementDesignProduct(product) &&
      (use === "gift" || use === "serving" || priority === "premium" || priority === "serving") &&
      space !== "small" &&
      movement !== "portable" &&
      haptics !== "smooth") {
      if (use === "gift") {
        score += 3;
      }

      if (use === "serving") {
        score += 3;
      }

      if (priority === "premium") {
        score += 12;
      }

      if (priority === "serving") {
        score += 3;
      }

      if (space === "large" && movement === "stationary" && haptics === "substantial") {
        score += 2;
      }
    }

    if (product.category !== "board") {
      score -= 20;
    }

    if (product.needsReview) {
      score -= 10;
    }

    if (product.dataVerified !== true) {
      score -= 20;
    }

    if (!product.etsyUrl) {
      score -= 8;
    }

    return score;
  }

  function isStatementDesignProduct(product) {
    var badges = Array.isArray(product.badges) ? product.badges.join(" ") : "";
    var text = [
      product.name,
      product.shortDescription,
      product.longDescription,
      badges
    ].join(" ").toLowerCase();

    return text.indexOf("3d-design") !== -1 ||
      (text.indexOf("3d") !== -1 && text.indexOf("design") !== -1);
  }

  function canRecommendAsMainBoard(product) {
    return product &&
      product.active === true &&
      product.needsReview === false &&
      product.dataVerified === true &&
      product.category === "board" &&
      Boolean(product.etsyUrl) &&
      hasConcreteFinderData(product);
  }

  function hasConcreteFinderData(product) {
    return dimensionLabel(product) &&
      hasMeaningfulValue(product.thicknessLabel);
  }

  function buildReason(product) {
    var parts = [];
    var use = state.answers.use;
    var space = state.answers.space;
    var movement = state.answers.movement;
    var haptics = state.answers.haptics;
    var priority = state.answers.priority;

    if (space && movement) {
      if (space.value === "small" || movement.value === "portable") {
        parts.push(isEnglish ? "You have limited space or want to move the board often. A compact, lighter board therefore fits better than a heavy end-grain board." : "Du hast wenig Platz oder möchtest das Brett häufiger bewegen. Deshalb passt ein kompaktes, leichteres Brett besser als ein schweres Stirnholzbrett.");
      } else if (space.value === "large" || movement.value === "stationary") {
        parts.push(isEnglish ? "You have enough worktop space and the board can stay firmly in place. A larger, heavier board can make sense." : "Du hast genug Arbeitsfläche und das Brett darf dauerhaft satt liegen. Deshalb kann ein größeres, schwereres Brett sinnvoll sein.");
      } else {
        parts.push(isEnglish ? "You are looking for a balanced board that lies steadily but can still be moved easily." : "Du suchst ein ausgewogenes Brett, das stabil liegt und trotzdem noch gut bewegt werden kann.");
      }
    }

    if (use) {
      if (use.value === "bbq") {
        parts.push(isEnglish ? "For BBQ and heavier cutting, stability matters more than low weight." : "Für BBQ und kräftiges Schneiden zählt Stabilität stärker als geringes Gewicht.");
      } else if (use.value === "serving") {
        parts.push(isEnglish ? "Because the board is also visible when serving, grain, format and feel matter more." : "Da das Brett auch sichtbar beim Servieren genutzt wird, spielen Maserung, Format und Haptik stärker mit.");
      } else if (use.value === "gift") {
        parts.push(isEnglish ? "As a gift, the board should be practical and still have a clear material presence." : "Als Geschenk sollte das Brett nicht nur praktisch sein, sondern auch eine klare Materialwirkung haben.");
      } else {
        parts.push(isEnglish ? "For daily cutting, an uncomplicated, easy-to-handle format is decisive." : "Für tägliches Schneiden ist ein unkompliziertes, gut führbares Format entscheidend.");
      }
    }

    if (haptics && priority) {
      var facts = [dimensionLabel(product), hasMeaningfulValue(product.thicknessLabel), product.material].filter(Boolean);
      if (facts.length) {
        parts.push((isEnglish ? "Your choices around feel and priority point toward " : "Deine Auswahl bei Haptik und Priorität spricht für ") + facts.join(isEnglish ? ", " : ", ") + ".");
      }
    }

    return parts.join(" ");
  }

  function bindFilters() {
    var filterForm = document.querySelector("[data-product-filters]");
    if (!filterForm) {
      return;
    }

    filterForm.addEventListener("change", renderGrid);
  }

  function renderGrid() {
    if (!gridRoot) {
      return;
    }

    var filterForm = document.querySelector("[data-product-filters]");
    var filters = filterForm ? new FormData(filterForm) : null;
    var category = filters ? filters.get("category") : "all";
    var price = filters ? filters.get("price") : "all";
    var useCase = filters ? filters.get("useCase") : "all";
    var sort = filters ? filters.get("sort") : "priceAsc";

    var products = state.activeProducts
      .filter(function (product) {
        return category === "all" || product.category === category;
      })
      .filter(function (product) {
        if (price === "all") {
          return true;
        }

        var order = Number(product.priceOrder || 0);
        if (price === "under100") {
          return order < 100;
        }
        if (price === "100to250") {
          return order >= 100 && order <= 250;
        }
        if (price === "over250") {
          return order > 250;
        }
        return true;
      })
      .filter(function (product) {
        return useCase === "all" || (Array.isArray(product.useCases) && product.useCases.indexOf(useCase) !== -1);
      })
      .sort(function (a, b) {
        var aPrice = Number(a.priceOrder);
        var bPrice = Number(b.priceOrder);
        var aHasPrice = Number.isFinite(aPrice) && aPrice > 0;
        var bHasPrice = Number.isFinite(bPrice) && bPrice > 0;

        if (aHasPrice !== bHasPrice) {
          return aHasPrice ? -1 : 1;
        }

        if (aHasPrice && aPrice !== bPrice) {
          return sort === "priceDesc" ? bPrice - aPrice : aPrice - bPrice;
        }

        return String(a.displayName || a.name || "").localeCompare(String(b.displayName || b.name || ""), isEnglish ? "en" : "de");
      });

    if (!products.length) {
      gridRoot.innerHTML = '<p class="productEmpty">' + (isEnglish ? "There are currently no matching products for this filter combination." : "Für diese Filterkombination gibt es aktuell keine passenden Produkte.") + '</p>';
      return;
    }

    gridRoot.innerHTML = products.map(function (product) {
      var highlighted = state.highlightedIds.indexOf(product.id) !== -1;
      var review = product.needsReview ? " is-review" : "";
      return '<article class="productCard' + (highlighted ? " is-highlighted" : "") + review + '">' +
        buildProductMedia(product, "grid") +
        '<div class="productCard__body">' +
          '<p class="productCard__segment">' + escapeHtml(product.segment) + '</p>' +
          '<h3 class="productCard__name">' + escapeHtml(displayProductName(product)) + '</h3>' +
          buildFeatureBadges(product) +
          buildProductFacts(product) +
          '<p class="productCard__price">' + escapeHtml(displayPriceLabel(product)) + '</p>' +
          buildProductActions(product, "grid") +
        '</div>' +
      '</article>';
    }).join("");
  }

  function buildProductMedia(product, source) {
    if (!product.image || product.imageVerified !== true) {
      return '<div class="productCard__media productCard__media--pending">' +
        '<span>' + (isEnglish ? "Product image coming soon" : "Produktbild folgt") + '</span>' +
      '</div>';
    }

    if (source === false) {
      return '<div class="productCard__media"' + productImageStyle(product) + '>' +
        '<img src="' + escapeAttribute(product.image) + '" alt="' + escapeAttribute(productImageAlt(product)) + '" loading="lazy" decoding="async">' +
      '</div>';
    }

    return '<button class="productCard__media productCard__mediaButton" type="button" data-product-preview="' + escapeAttribute(product.id) + '" data-product-source="' + escapeAttribute(source || "grid") + '"' + productImageStyle(product) + '>' +
      '<img src="' + escapeAttribute(product.image) + '" alt="' + escapeAttribute(productImageAlt(product)) + '" loading="lazy" decoding="async">' +
    '</button>';
  }

  function productImageStyle(product) {
    var x = product.imagePositionX || product.imageX;
    var y = product.imagePositionY || product.imageY;
    var fit = product.imageFit;
    var styles = [];

    if (x) styles.push("--product-image-x:" + escapeAttribute(String(x)));
    if (y) styles.push("--product-image-y:" + escapeAttribute(String(y)));
    if (fit) styles.push("--product-image-fit:" + escapeAttribute(String(fit)));

    return styles.length ? ' style="' + styles.join(";") + '"' : "";
  }

  function buildFeatureBadges(product) {
    var badges = product.badges;
    if (!Array.isArray(badges) || !badges.length) {
      return "";
    }

    var materialParts = String(product.material || "").split(",").map(function (part) {
      return part.trim();
    }).filter(Boolean);

    var filtered = badges.filter(function (badge) {
      var value = String(badge || "");
      var normalized = value.toLowerCase();
      if (!value) {
        return false;
      }
      if (normalized.indexOf("cm") !== -1 || normalized.indexOf("kg") !== -1) {
        return false;
      }
      if (value === product.material || materialParts.indexOf(value) !== -1) {
        return false;
      }
      if (value === product.sizeLabel || value === product.thicknessLabel) {
        return false;
      }
      return true;
    });

    if (!filtered.length) {
      return "";
    }

    return '<div class="productBadgeRow">' + filtered.slice(0, 3).map(function (badge) {
      return '<span>' + escapeHtml(normalizeConstructionTerms(badge)) + '</span>';
    }).join("") + '</div>';
  }

  function buildProductFacts(product) {
    var facts = [];

    if (product.material) {
      facts.push([isEnglish ? "Material" : "Material", product.material]);
    }

    if (product.category === "board" && dimensionLabel(product)) {
      facts.push([isEnglish ? "Size" : "Maße", dimensionLabel(product)]);
    }

    if (product.category === "care") {
      facts = [
        [isEnglish ? "Type" : "Typ", isEnglish ? "Care product" : "Pflegeprodukt"],
        [isEnglish ? "Base" : "Basis", product.material || (isEnglish ? "Beeswax and oil" : "Bienenwachs und Öl")]
      ];
    }

    if (product.category === "accessory") {
      facts = [
        [isEnglish ? "Type" : "Typ", product.productType === "accessory" ? (isEnglish ? "Kitchen tool" : "Küchenhelfer") : product.segment],
        [isEnglish ? "Material" : "Material", product.material || (isEnglish ? "Wood" : "Holz")]
      ];
    }

    if (!facts.length) {
      return "";
    }

    return '<dl class="productFacts productFacts--compact">' + facts.slice(0, 2).map(function (fact) {
      return '<div><dt>' + escapeHtml(fact[0]) + '</dt><dd>' + escapeHtml(fact[1]) + '</dd></div>';
    }).join("") + '</dl>';
  }

  function hasMeaningfulValue(value) {
    if (!value) {
      return "";
    }
    var text = String(value).trim();
    if (!text || /Format laut Etsy|laut Etsy-Export|laut Etsy-Listing|Set laut|nicht relevant/i.test(text)) {
      return "";
    }
    return text;
  }

  function displayProductName(product) {
    if (product.displayName) {
      return product.displayName;
    }

    var name = String(product.name || "");

    if (name.indexOf("|") !== -1) {
      name = name.split("|")[0];
    }

    name = name
      .replace(/:\s*\d{1,3}(?:[,.]\d+)?\s*[x×].*$/i, "")
      .replace(/\s+[–-]\s*\d{1,3}(?:[,.]\d+)?\s*[x×].*$/i, "")
      .replace(/\s{2,}/g, " ")
      .trim();

    return name || product.name;
  }

  function productImageAlt(product) {
    if (product.category === "care") {
      return "Holzpflege für Schneidebretter mit Pflegebalsam, Pflegetuch und Pflegeanleitung";
    }

    if (product.category === "accessory") {
      var accessoryName = displayProductName(product);
      if (/pfannenwender/i.test(accessoryName) || /wender/i.test(accessoryName)) {
        return "Pfannenwender aus Holz als handgefertigtes Küchenaccessoire aus Mittelhessen";
      }
      if (/teigschaber/i.test(accessoryName) || /schaber/i.test(accessoryName)) {
        return "Teigschaber aus Holz für Pizzateig und Backarbeiten in der Küche";
      }
      return "Handgefertigtes Küchenaccessoire aus Holz mit sichtbarer Maserung";
    }

    var material = cleanAltPart(product.material) || "Massivholz";
    var source = String(product.segment || product.woodCut || product.name || "");
    var isEndGrain = /stirnholz|hirnholz|end/i.test(source);
    var boardType = isEndGrain ? "Stirnholz Schneidebrett" : "handgefertigtes Schneidebrett";
    var features = [];

    if (hasBadge(product, "Saftrille")) {
      features.push("Saftrille");
    }
    if (hasBadge(product, "personalisierbar")) {
      features.push("Personalisierung");
    }
    if (product.sizeProfile === "large" || product.weightClass === "heavy") {
      features.push("massiver Verarbeitung");
    }

    var suffix = features.length ? " mit " + features.slice(0, 2).join(" und ") : " mit sichtbarer Maserung";
    return boardType + " aus " + material + suffix;
  }

  function cleanAltPart(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .replace(/\s*,\s*/g, ", ")
      .trim();
  }

  function hasBadge(product, term) {
    return Array.isArray(product.badges) && product.badges.some(function (badge) {
      return String(badge || "").toLowerCase().indexOf(term.toLowerCase()) !== -1;
    });
  }

  function buildProductActions(product, source, reason) {
    var detailsLabel = primaryCardCta(product);
    var compareLabel = isEnglish ? "Compare" : "Vergleichen";
    var productSource = source || "grid";
    var reasonAttribute = reason ? ' data-product-reason="' + escapeAttribute(reason) + '"' : "";
    var detailButton = '<button class="btn btn--emphasis" type="button" data-product-preview="' + escapeAttribute(product.id) + '" data-product-source="' + escapeAttribute(productSource) + '"' + reasonAttribute + '>' + escapeHtml(detailsLabel) + '</button>';
    var compareButton = '<button class="btn btn--ghost-dark" type="button" data-product-compare="' + escapeAttribute(product.id) + '" data-product-source="' + escapeAttribute(productSource) + '">' + escapeHtml(compareLabel) + '</button>';

    if (!hasVerifiedListing(product)) {
      return '<div class="ctaRow ctaRow--stacked">' + detailButton + compareButton + '<span class="productCard__availability">' +
        escapeHtml(labels.unavailableText) +
        '</span><a class="btn btn--secondary" href="' + (isEnglish ? "/en/custom-cutting-board/" : "/schneidebrett-nach-mass/") + '">' +
        escapeHtml(labels.askSimilar) +
        '</a></div>';
    }

    return '<div class="ctaRow ctaRow--product-card">' +
      detailButton +
      compareButton +
      '<span class="etsyBuyBlock"><a class="btn btn--emphasis" href="' + escapeAttribute(etsyActionUrl(product)) + '" target="_blank" rel="noopener" data-etsy-link title="' + shopTitle + '">' + (isEnglish ? "View on Etsy" : "Auf Etsy ansehen") + '</a><span class="etsyTrust">' + (isEnglish ? "Checkout via Etsy · Buyer protection available there" : "Checkout über Etsy · Käuferschutz dort verfügbar") + '</span></span>' +
    '</div>';
  }

  function primaryCardCta(product) {
    if (product && product.category === "board") {
      return isEnglish ? "Discover board" : "Brett entdecken";
    }
    return isEnglish ? "Discover product" : "Produkt entdecken";
  }

  function buildAlternativeCard(product) {
    var content =
      buildProductMedia(product, false) +
      '<span class="alternativeCard__body">' +
        '<span class="productCard__segment">' + escapeHtml(product.segment) + '</span>' +
        '<strong>' + escapeHtml(displayProductName(product)) + '</strong>' +
        '<span>' + escapeHtml(displayPriceLabel(product)) + '</span>' +
        '<span class="alternativeCard__actions">' +
          '<button type="button" data-product-preview="' + escapeAttribute(product.id) + '" data-product-source="finder">' + (isEnglish ? "Details" : "Details") + '</button>' +
          '<button type="button" data-product-compare="' + escapeAttribute(product.id) + '" data-product-source="finder">' + (isEnglish ? "Compare" : "Vergleichen") + '</button>' +
        '</span>' +
      '</span>';

    return '<article class="alternativeCard">' + content + '</article>';
  }

  function hasVerifiedListing(product) {
    return Boolean(isAvailableProduct(product) && product.directListingUrlVerified === true && (product.etsyListingUrl || product.etsyUrl));
  }

  function etsyActionLabel(product) {
    if (product.category === "care") {
      return isEnglish ? "Buy care balm" : "Pflegebalsam kaufen";
    }

    if (product.category && product.category !== "board") {
      return isEnglish ? "Buy this product" : "Dieses Produkt kaufen";
    }

    if (isEnglish) {
      return "Buy this board";
    }

    return "Dieses Brett kaufen";
  }

  function etsyActionUrl(product) {
    if (hasVerifiedListing(product)) {
      return product.etsyListingUrl || product.etsyUrl;
    }

    return isEnglish ? "/en/products.html#product-finder" : "/produkte.html#produktfinder";
  }

  function availabilityStatus(product) {
    if (!product) {
      return "inactive";
    }
    if (product.availabilityStatus) {
      return String(product.availabilityStatus).toLowerCase();
    }
    if (product.active === false) {
      return "inactive";
    }
    if (product.directListingUrlVerified === true && (product.etsyListingUrl || product.etsyUrl)) {
      return "available";
    }
    return "unknown";
  }

  function isAvailableProduct(product) {
    return availabilityStatus(product) === "available";
  }

  function isGridProduct(product) {
    if (!product || product.active !== true || product.visibility === "hidden" || product.visibility === "archive") {
      return false;
    }
    if (availabilityStatus(product) === "made_to_order") {
      return product.visibility === "grid";
    }
    return isAvailableProduct(product) && product.directListingUrlVerified === true && Boolean(product.etsyListingUrl || product.etsyUrl);
  }

  function displayPriceLabel(product) {
    return String(product && product.priceLabel ? product.priceLabel : "")
      .replace(/\s*EUR\b/g, " €")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  function dimensionLabel(product) {
    return hasMeaningfulValue(product.sizeLabel) ? product.sizeLabel :
      hasMeaningfulValue(product.dimensions) ? product.dimensions :
      extractDimensionsFromText([
        product.displayName,
        product.name,
        product.title,
        product.shortDescription,
        product.longDescription
      ].join(" "));
  }

  function extractDimensionsFromText(text) {
    if (!text) {
      return "";
    }
    var normalized = String(text)
      .replace(/×/g, "x")
      .replace(/\s+/g, " ");
    var match = normalized.match(/(?:maße|masse|größe|format)?\s*:?\s*(ca\.\s*)?(\d{1,3}(?:[,.]\d+)?)\s*x\s*(\d{1,3}(?:[,.]\d+)?)(?:\s*x\s*(\d{1,3}(?:[,.]\d+)?))?\s*cm\b/i);
    if (!match) {
      return "";
    }
    var prefix = match[1] ? "ca. " : "";
    var values = [match[2], match[3], match[4]].filter(Boolean).map(function (value) {
      return value.replace(".", ",");
    });
    return prefix + values.join(" × ") + " cm";
  }

  function normalizeConstructionTerms(value) {
    return String(value || "")
      .replace(/Face\s*Grain|Edge\s*Grain|Long\s*Grain/gi, "Langholz")
      .replace(/Flankenholz|Längsholz/gi, "Langholz");
  }

  function labelFor(value) {
    var labels = isEnglish ? {
      light: "light",
      medium: "medium",
      heavy: "heavy",
      portable: "portable",
      balanced: "balanced",
      stationary: "stationary"
    } : {
      light: "leicht",
      medium: "mittel",
      heavy: "schwer",
      portable: "tragbar",
      balanced: "ausgewogen",
      stationary: "stationär"
    };

    return labels[value] || value;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value);
  }
}
