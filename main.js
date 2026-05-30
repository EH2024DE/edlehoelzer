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
  initProductsPage();
  initHeroVideo();
  initReviewTrustStrips();
  initBackToTop();

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

function initBackToTop() {
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
      '<p>Diese Karte geben wir nicht beliebig weiter. Sie ist für Menschen gedacht, bei denen wir glauben, dass echtes Handwerk, gutes Material und persönliche Beratung geschätzt werden.</p>' +
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

    return {
      source: String(meta.source || "Etsy"),
      shopName: String(meta.shopName || "Edle Hölzer"),
      ratingAverage: ratingAverage >= 1 && ratingAverage <= 5 ? ratingAverage : null,
      ratingCount: ratingCount > 0 ? Math.round(ratingCount) : 0,
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
    return config.copy.sublineFallback;
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
      title: "Wofür soll das Brett hauptsächlich eingesetzt werden?",
      options: [
        {
          value: "daily",
          title: "Tägliches Schneiden",
          description: "Für Gemüse, Brot und alles, was im Küchenalltag regelmäßig anfällt.",
          attributes: "alltagstauglich · unkompliziert · verlässlich"
        },
        {
          value: "bbq",
          title: "BBQ / kräftiges Schneiden",
          description: "Für Fleisch, Grillabende und Arbeiten, bei denen Stabilität wichtiger ist als geringes Gewicht.",
          attributes: "stabil · massiv · belastbar"
        },
        {
          value: "serving",
          title: "Servieren und Anrichten",
          description: "Für Brotzeit, Käse, Steak, Bar oder Tischsituationen, in denen das Brett sichtbar wird.",
          attributes: "repräsentativ · ruhig · servierfähig"
        },
        {
          value: "gift",
          title: "Geschenk / besonderes Stück",
          description: "Für Menschen, die ein hochwertiges Holzprodukt bewusst nutzen oder offen liegen lassen.",
          attributes: "wertig · persönlich · langlebig"
        }
      ]
    },
    {
      id: "space",
      title: "Wie viel Platz hast du in der Küche?",
      options: [
        {
          value: "small",
          title: "Wenig Platz, kleine Küche",
          description: "Das Brett soll funktionieren, ohne dauerhaft viel Arbeitsfläche zu blockieren.",
          attributes: "kompakt · beweglich · platzsparend"
        },
        {
          value: "normal",
          title: "Normaler Arbeitsbereich",
          description: "Es darf spürbar sein, soll aber noch flexibel auf der Arbeitsfläche bleiben.",
          attributes: "ausgewogen · mittelgroß · vielseitig"
        },
        {
          value: "large",
          title: "Viel Platz, Brett darf präsent liegen",
          description: "Für große Arbeitsflächen und Nutzer, die Stabilität wichtiger finden als Mobilität.",
          attributes: "schwer · stabil · präsent"
        }
      ]
    },
    {
      id: "movement",
      title: "Soll das Brett häufig bewegt werden?",
      options: [
        {
          value: "portable",
          title: "Ja, es soll leicht tragbar sein",
          description: "Für Nutzer, die das Brett häufig herausnehmen, reinigen oder wegstellen.",
          attributes: "leicht · handlich · flexibel"
        },
        {
          value: "balanced",
          title: "Gelegentlich, ausgewogenes Gewicht ist ideal",
          description: "Das Brett soll satt liegen, aber im Alltag noch gut bewegt werden können.",
          attributes: "balanciert · griffig · alltagstauglich"
        },
        {
          value: "stationary",
          title: "Nein, es darf dauerhaft satt liegen",
          description: "Für feste Plätze, große Kücheninseln und Nutzer, die ein präsentes Arbeitsbrett suchen.",
          attributes: "stationär · massiv · ruhig liegend"
        }
      ]
    },
    {
      id: "haptics",
      title: "Welche Haptik und Stärke passt besser zu dir?",
      options: [
        {
          value: "smooth",
          title: "Dünner, leichter, flexibler",
          description: "Für schnelle Nutzung, wenig Gewicht und möglichst unkompliziertes Handling.",
          attributes: "schlank · glatt · beweglich"
        },
        {
          value: "solid",
          title: "Solide und alltagstauglich",
          description: "Ein ausgewogenes Verhältnis aus Substanz, Handling und täglicher Nutzbarkeit.",
          attributes: "solide · ausgewogen · griffig"
        },
        {
          value: "substantial",
          title: "Dick, massiv und sehr präsent",
          description: "Für Nutzer, die Gewicht, Stärke und eine klare Materialwirkung bewusst möchten.",
          attributes: "dick · schwer · charakterstark"
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
          description: "Das Brett soll jeden Tag praktisch sein und nicht mehr Aufmerksamkeit brauchen als nötig.",
          attributes: "praktisch · robust · direkt nutzbar"
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
          description: "Das Brett soll nicht nur schneiden, sondern beim Anrichten sichtbar überzeugen.",
          attributes: "sichtbar · elegant · gastfreundlich"
        },
        {
          value: "premium",
          title: "Maximale Wertigkeit",
          description: "Gesucht ist ein Brett mit besonderer Präsenz, Haptik und Materialwirkung.",
          attributes: "Premium · massiv · besonders"
        }
      ]
    }
  ];

  var questionsEn = [
    {
      id: "use",
      title: "What will you mainly use the board for?",
      options: [
        {
          value: "daily",
          title: "Daily cutting",
          description: "For vegetables, bread and everything that happens in everyday kitchen use.",
          attributes: "practical · simple · reliable"
        },
        {
          value: "bbq",
          title: "BBQ / heavier cutting",
          description: "For meat, grilling and work where stability matters more than low weight.",
          attributes: "stable · solid · resilient"
        },
        {
          value: "serving",
          title: "Serving and plating",
          description: "For bread, cheese, steak, bar or table situations where the board stays visible.",
          attributes: "presentable · calm · serving-ready"
        },
        {
          value: "gift",
          title: "Gift / special piece",
          description: "For people who use a high-quality wood product consciously or leave it out in the kitchen.",
          attributes: "valuable · personal · durable"
        }
      ]
    },
    {
      id: "space",
      title: "How much space do you have in the kitchen?",
      options: [
        {
          value: "small",
          title: "Limited space, small kitchen",
          description: "The board should work without permanently taking over the worktop.",
          attributes: "compact · movable · space-saving"
        },
        {
          value: "normal",
          title: "Regular worktop space",
          description: "It may have substance, but should still stay flexible in daily use.",
          attributes: "balanced · medium-sized · versatile"
        },
        {
          value: "large",
          title: "Plenty of space, board can stay out",
          description: "For large worktops and users who value stability more than mobility.",
          attributes: "heavy · stable · present"
        }
      ]
    },
    {
      id: "movement",
      title: "Will you move the board often?",
      options: [
        {
          value: "portable",
          title: "Yes, it should be easy to carry",
          description: "For users who often take the board out, clean it or put it away.",
          attributes: "light · handy · flexible"
        },
        {
          value: "balanced",
          title: "Sometimes, balanced weight is ideal",
          description: "The board should lie solidly but still be easy to handle in everyday use.",
          attributes: "balanced · grippy · practical"
        },
        {
          value: "stationary",
          title: "No, it can stay firmly in place",
          description: "For fixed places, large kitchen islands and users looking for a substantial work board.",
          attributes: "stationary · solid · calm"
        }
      ]
    },
    {
      id: "haptics",
      title: "Which feel and thickness suits you better?",
      options: [
        {
          value: "smooth",
          title: "Thinner, lighter, more flexible",
          description: "For quick use, lower weight and uncomplicated handling.",
          attributes: "slim · smooth · movable"
        },
        {
          value: "solid",
          title: "Solid and practical",
          description: "A balanced mix of substance, handling and daily usability.",
          attributes: "solid · balanced · grippy"
        },
        {
          value: "substantial",
          title: "Thick, heavy and very present",
          description: "For users who deliberately want weight, thickness and a strong material feel.",
          attributes: "thick · heavy · characterful"
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
          description: "The board should be useful every day without needing unnecessary attention.",
          attributes: "practical · robust · ready to use"
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
          description: "The board should not only cut well, but also look good when plating or serving.",
          attributes: "visible · elegant · hosting-ready"
        },
        {
          value: "premium",
          title: "Maximum presence",
          description: "You are looking for a board with special presence, feel and material depth.",
          attributes: "premium · solid · special"
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

  fetch("/products.json")
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
      state.activeProducts = products.filter(function (product) {
        return product.active === true;
      });

      validateProducts(products);
      renderFinder();
      renderGrid();
      bindFilters();
    })
    .catch(function (error) {
      console.warn("[Edle Hölzer] Produktdaten konnten nicht initialisiert werden:", error);
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
        renderFinder();
      });
    });

    prevButton.onclick = function () {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
        renderFinder();
      }
    };

    nextButton.onclick = function () {
      if (!state.answers[question.id]) {
        return;
      }

      if (state.currentStep < questions.length - 1) {
        state.currentStep += 1;
        renderFinder();
      } else {
        showFinderResult();
      }
    };
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
        ? '<h2>This is probably the best direction for your everyday use</h2><p>For this combination, a short personal check makes sense so format, wood and use really fit together.</p><div class="ctaRow"><a class="btn" href="mailto:info@edlehoelzer.de?subject=Cutting%20board%20inquiry">Ask about a board</a><button class="btn btn--ghost-dark" type="button" data-finder-reset>Restart finder</button></div>'
        : '<h2>Das dürfte am besten zu deinem Alltag passen</h2><p>Für diese Kombination ist eine kurze persönliche Abstimmung sinnvoll, damit Format, Holzart und Nutzung wirklich zusammenpassen.</p><div class="ctaRow"><a class="btn" href="mailto:info@edlehoelzer.de?subject=Anfrage%20Schneidebrett">Schneidebrett anfragen</a><button class="btn btn--ghost-dark" type="button" data-finder-reset>Finder neu starten</button></div>';
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
        '<p>' + escapeHtml(buildReason(main)) + '</p>' +
      '</div>' +
      '<div class="recommendationCard">' +
        buildProductMedia(main) +
        '<div class="recommendationCard__body">' +
          '<p class="productCard__segment">' + escapeHtml(main.segment) + '</p>' +
          '<h3>' + escapeHtml(displayProductName(main)) + '</h3>' +
          buildFeatureBadges(main) +
          buildProductFacts(main) +
          '<p class="productCard__price">' + escapeHtml(main.priceLabel) + '</p>' +
          '<div class="ctaRow">' +
            '<span class="etsyBuyBlock"><a class="btn" href="' + escapeAttribute(etsyActionUrl(main)) + '" target="_blank" rel="noopener" data-etsy-link title="' + shopTitle + '">' + escapeHtml(etsyActionLabel(main)) + '</a><span class="etsyTrust">' + (isEnglish ? "🔒 Secure via Etsy · Buyer protection included" : "🔒 Sicher über Etsy · Käuferschutz inklusive") + '</span></span>' +
            '<a class="btn btn--ghost-dark" href="' + gridAnchor + '">' + (isEnglish ? "View product grid" : "Produktgrid ansehen") + '</a>' +
            '<button class="btn btn--ghost-dark" type="button" data-finder-reset>' + (isEnglish ? "Restart" : "Neu starten") + '</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      (alternatives.length ? '<div class="alternativeList"><h3>' + (isEnglish ? "Alternatives" : "Alternativen") + '</h3><div class="alternativeGrid">' + alternatives.map(function (product) {
        return '<a class="alternativeCard" href="' + escapeAttribute(etsyActionUrl(product)) + '" target="_blank" rel="noopener" data-etsy-link title="' + shopTitle + '">' +
          buildProductMedia(product) +
          '<span class="alternativeCard__body">' +
            '<span class="productCard__segment">' + escapeHtml(product.segment) + '</span>' +
            '<strong>' + escapeHtml(displayProductName(product)) + '</strong>' +
            '<span>' + escapeHtml(product.priceLabel) + '</span>' +
          '</span>' +
        '</a>';
      }).join("") + '</div></div>' : "");

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
    return product.sizeLabel &&
      product.sizeLabel !== "Format laut Etsy-Export" &&
      product.thicknessLabel &&
      product.thicknessLabel !== "laut Etsy-Export";
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
      parts.push((isEnglish ? "Your choices around feel and priority point toward " : "Deine Auswahl bei Haptik und Priorität spricht für ") + product.sizeLabel + ", " + product.thicknessLabel + (isEnglish ? " and " : " und ") + product.material + ".");
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
        var aHighlight = state.highlightedIds.indexOf(a.id);
        var bHighlight = state.highlightedIds.indexOf(b.id);
        if (aHighlight !== -1 || bHighlight !== -1) {
          if (aHighlight === -1) {
            return 1;
          }
          if (bHighlight === -1) {
            return -1;
          }
          return aHighlight - bHighlight;
        }

        if (a.needsReview !== b.needsReview) {
          return a.needsReview ? 1 : -1;
        }

        if (a.featured !== b.featured) {
          return a.featured ? -1 : 1;
        }

        return Number(a.priceOrder || 0) - Number(b.priceOrder || 0);
      });

    if (!products.length) {
      gridRoot.innerHTML = '<p class="productEmpty">' + (isEnglish ? "There are currently no matching products for this filter combination." : "Für diese Filterkombination gibt es aktuell keine passenden Produkte.") + '</p>';
      return;
    }

    gridRoot.innerHTML = products.map(function (product) {
      var highlighted = state.highlightedIds.indexOf(product.id) !== -1;
      var review = product.needsReview ? " is-review" : "";
      return '<article class="productCard' + (highlighted ? " is-highlighted" : "") + review + '">' +
        buildProductMedia(product) +
        '<div class="productCard__body">' +
          '<p class="productCard__segment">' + escapeHtml(product.segment) + '</p>' +
          '<h3 class="productCard__name">' + escapeHtml(displayProductName(product)) + '</h3>' +
          buildFeatureBadges(product) +
          buildProductFacts(product) +
          '<p class="productCard__price">' + escapeHtml(product.priceLabel) + '</p>' +
          buildProductActions(product) +
        '</div>' +
      '</article>';
    }).join("");
  }

  function buildProductMedia(product) {
    if (!product.image || product.imageVerified !== true) {
      return '<div class="productCard__media productCard__media--pending">' +
        '<span>' + (isEnglish ? "Product image coming soon" : "Produktbild folgt") + '</span>' +
      '</div>';
    }

    return '<div class="productCard__media"' + productImageStyle(product) + '>' +
      '<img src="' + escapeAttribute(product.image) + '" alt="' + escapeAttribute(product.name) + '" loading="lazy" decoding="async">' +
    '</div>';
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
      return '<span>' + escapeHtml(badge) + '</span>';
    }).join("") + '</div>';
  }

  function buildProductFacts(product) {
    var facts = [];

    if (product.material) {
      facts.push([isEnglish ? "Material" : "Material", product.material]);
    }

    if (product.category === "board" && hasMeaningfulValue(product.sizeLabel)) {
      facts.push([isEnglish ? "Size" : "Maße", product.sizeLabel]);
    }

    if (product.category === "board" && product.weightClass) {
      facts.push([isEnglish ? "Weight" : "Gewicht", labelFor(product.weightClass)]);
    }

    if (product.category === "board" && product.portability) {
      facts.push([isEnglish ? "Handling" : "Handling", labelFor(product.portability)]);
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

    return '<dl class="productFacts">' + facts.map(function (fact) {
      return '<div><dt>' + escapeHtml(fact[0]) + '</dt><dd>' + escapeHtml(fact[1]) + '</dd></div>';
    }).join("") + '</dl>';
  }

  function hasMeaningfulValue(value) {
    return value &&
      value !== "Format laut Etsy-Export" &&
      value !== "laut Etsy-Export" &&
      value !== "nicht relevant";
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

  function buildProductActions(product) {
    if (product.needsReview || !product.etsyUrl) {
      return '<div class="ctaRow"><a class="btn btn--ghost-dark" href="mailto:info@edlehoelzer.de?subject=' + (isEnglish ? "Product%20inquiry" : "Anfrage%20Produkt") + '">' + (isEnglish ? "Ask about this product" : "Produkt anfragen") + '</a></div>';
    }

    var primaryLabel = etsyActionLabel(product);
    return '<div class="ctaRow"><span class="etsyBuyBlock"><a class="btn" href="' + escapeAttribute(etsyActionUrl(product)) + '" target="_blank" rel="noopener" data-etsy-link title="' + shopTitle + '">' + primaryLabel + '</a><span class="etsyTrust">' + (isEnglish ? "🔒 Secure via Etsy · Buyer protection included" : "🔒 Sicher über Etsy · Käuferschutz inklusive") + '</span></span></div>';
  }

  function etsyActionLabel(product) {
    if (isEnglish) {
      return product.directListingUrlVerified ? "Buy this board" : "Discover in shop";
    }

    return product.directListingUrlVerified ? "Dieses Brett kaufen" : "Im Shop entdecken";
  }

  function etsyActionUrl(product) {
    if (product.directListingUrlVerified) {
      return product.etsyListingUrl || product.etsyUrl;
    }

    return "https://edlehoelzervonkoc.etsy.com";
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
