document.documentElement.classList.add("js");

var EDLE_HOELZER_PRODUCTS_URL = "/products.json?v=20260901-pfannenwender-woods";

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
  initConversionTracking();
  initGooglePreferredSource();

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

function initConversionTracking() {
  function track(name, data) {
    try {
      if (window.EdleAnalytics && typeof window.EdleAnalytics.track === "function") {
        window.EdleAnalytics.track(name, data || {});
      }
    } catch (error) {
      // Analytics must never block navigation or checkout.
    }
  }

  function linkText(link) {
    return (link.textContent || link.getAttribute("aria-label") || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 80);
  }

  function safeUrl(href) {
    try {
      return new URL(href, window.location.href);
    } catch (error) {
      return null;
    }
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a");
    var page = window.location.pathname.replace(/\/index\.html$/, "/") || "/";

    if (!link) {
      return;
    }

    var href = link.getAttribute("href") || "";
    var url = safeUrl(link.href);
    var payload = {
      page: page,
      label: linkText(link)
    };

    if (link.hasAttribute("data-etsy-link") || (url && /(^|\.)etsy\.com$/i.test(url.hostname))) {
      if (url && /1881802291/.test(url.pathname)) {
        track("care_balm_etsy_click", payload);
      } else {
        payload.host = url ? url.hostname : "";
        track("etsy_checkout_click", payload);
      }
    }

    if (href.indexOf("#produktfinder") !== -1 || href.indexOf("#product-finder") !== -1) {
      track("product_finder_start", payload);
    }

    if (href.indexOf("/schneidebrett-aufbereiten/") !== -1 || link.getAttribute("data-umami-event") === "refurbishment_details_click") {
      track("refurbishment_details_click", payload);
    }

    if (href.indexOf("mailto:") === 0) {
      if (/Fotoeinsch|Aufbereitung|General/i.test(decodeURIComponent(href))) {
        track("refurbishment_inquiry_start", payload);
      } else {
        track("email_contact_click", payload);
      }
    }

    if (url && /(^|\.)wa\.me$/i.test(url.hostname)) {
      payload.source = link.getAttribute("data-umami-event-source-page") || "";
      payload.position = link.getAttribute("data-umami-event-position") || "";
      track("whatsapp_contact_click", payload);
    }
  });

  var serviceCards = document.querySelectorAll("[data-service-product-card]");
  if (serviceCards.length && "IntersectionObserver" in window) {
    var seenCards = [];
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.35) {
          return;
        }

        var card = entry.target;
        if (seenCards.indexOf(card) !== -1) {
          return;
        }

        seenCards.push(card);
        observer.unobserve(card);
        track(card.getAttribute("data-service-view-event") || "service_product_card_view", {
          page: window.location.pathname.replace(/\/index\.html$/, "/") || "/",
          service: card.getAttribute("data-service-type") || "unknown"
        });
      });
    }, { threshold: [0.35] });

    serviceCards.forEach(function (card) {
      observer.observe(card);
    });
  }
}

function initGooglePreferredSource() {
  var path = window.location.pathname.replace(/\/index\.html$/, "/") || "/";
  var excludedPaths = [
    "/produkte.html",
    "/en/products.html",
    "/impressum.html",
    "/datenschutz.html",
    "/danke.html",
    "/karte/",
    "/sitemap-uebersicht.html"
  ];
  var main = document.querySelector("main");

  if (!main || excludedPaths.indexOf(path) !== -1 || document.querySelector("[data-preferred-source-cta]")) {
    return;
  }

  var isEnglish = document.documentElement.lang.toLowerCase().indexOf("en") === 0 || path.indexOf("/en/") === 0;
  var copy = isEnglish
    ? {
        eyebrow: "Preferred source",
        heading: "Prefer Edle Hölzer on Google",
        text: "If our guides and workshop knowledge help you, you can select Edle Hölzer as a preferred source. Google may then highlight our content in relevant search and AI results.",
        button: "Prefer on Google",
        privacy: "A connection to Google is established only after you click.",
        loading: "Opening the Google selection...",
        thanks: "Thank you for your support",
        opened: "Google has opened. Sign in there if needed, then confirm or manage your choice."
      }
    : {
        eyebrow: "Bevorzugte Quelle",
        heading: "Edle Hölzer bei Google bevorzugen",
        text: "Wenn dir unsere Ratgeber und das Wissen aus der Werkstatt helfen, kannst du Edle Hölzer bei Google als bevorzugte Quelle auswählen. Google kann unsere Inhalte dann bei passenden Such- und KI-Ergebnissen hervorheben.",
        button: "Bei Google bevorzugen",
        privacy: "Erst beim Klick wird eine Verbindung zu Google hergestellt.",
        loading: "Google-Auswahl wird geöffnet ...",
        thanks: "Danke für deine Unterstützung",
        opened: "Google wurde geöffnet. Melde dich dort bei Bedarf an und bestätige oder verwalte deine Auswahl."
      };
  var deepLink = "https://www.google.com/preferences/source?q=edlehoelzer.de";
  var isLiveDomain = /(^|\.)edlehoelzer\.de$/i.test(window.location.hostname);
  var section = document.createElement("section");
  var preferredSourceClient = null;

  section.className = "preferredSourceCta";
  section.id = "google-preferred-source";
  section.setAttribute("aria-labelledby", "preferred-source-title");
  section.setAttribute("data-preferred-source-cta", "");
  section.innerHTML =
    '<div class="container preferredSourceCta__inner">' +
      '<div class="preferredSourceCta__copy">' +
        '<p class="eyebrow eyebrow--dark">' + copy.eyebrow + "</p>" +
        '<h2 id="preferred-source-title">' + copy.heading + "</h2>" +
        "<p>" + copy.text + "</p>" +
      "</div>" +
      '<div class="preferredSourceCta__action">' +
        '<a class="btn preferredSourceCta__button" href="' + deepLink + '" target="_blank" rel="noopener noreferrer" data-google-preferred-source>' + copy.button + "</a>" +
        '<small data-preferred-source-status aria-live="polite">' + copy.privacy + "</small>" +
      "</div>" +
    "</div>";

  main.appendChild(section);

  if (window.location.hash === "#google-preferred-source") {
    window.requestAnimationFrame(function () {
      section.scrollIntoView({ block: "start" });
    });
  }

  var button = section.querySelector("[data-google-preferred-source]");
  var status = section.querySelector("[data-preferred-source-status]");

  function showOpenedState() {
    button.classList.add("is-opened");
    button.textContent = copy.thanks;
    button.removeAttribute("aria-busy");
    status.textContent = copy.opened;
  }

  button.addEventListener("click", function (event) {
    try {
      if (window.EdleAnalytics && typeof window.EdleAnalytics.track === "function") {
        window.EdleAnalytics.track("preferred_source_click", {
          page: path,
          source: "google",
          cta_location: "page_end"
        });
      }
    } catch (error) {
      // The Google action must work independently from analytics.
    }

    if (!isLiveDomain || window.matchMedia("(max-width: 760px)").matches) {
      showOpenedState();
      return;
    }

    event.preventDefault();

    button.setAttribute("aria-busy", "true");
    status.textContent = copy.loading;

    if (preferredSourceClient) {
      preferredSourceClient.addPreferredSource();
      showOpenedState();
      return;
    }

    (self.PREFERRED_SOURCE = self.PREFERRED_SOURCE || []).push(function (client) {
      preferredSourceClient = client;
      client.init({
        theme: "light",
        lang: isEnglish ? "en" : "de"
      });
      client.addPreferredSource();
      showOpenedState();
    });

    if (document.querySelector("script[data-preferred-source-library]")) {
      return;
    }

    var script = document.createElement("script");
    script.async = true;
    script.src = "https://news.google.com/swg/js/v1/publisher.js";
    script.setAttribute("preferred-sources-control", "manual");
    script.setAttribute("data-preferred-source-library", "");
    script.addEventListener("error", function () {
      window.location.href = deepLink;
    });
    document.head.appendChild(script);
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
    "/schneidebretter-massivholz/": { label: "Schneidebretter ansehen", href: "#products-massivholz", secondary: "Individuelles Brett anfragen", secondaryHref: "mailto:info@edlehoelzer.de?subject=Anfrage%20Schneidebrett", event: null },
    "/schneidebrett-nach-mass/": { label: "Maßanfertigung anfragen", href: "mailto:info@edlehoelzer.de?subject=Anfrage%20Schneidebrett%20nach%20Ma%C3%9F", secondary: "Produkte ansehen", secondaryHref: "/produkte.html#produkte-grid", event: "email-kontakt" },
    "/schneidebrett-mit-gravur/": { label: "Gravierbares Brett ansehen", href: "#products-gravur", secondary: "B2B-Gravur anfragen", secondaryHref: "/b2b.html", event: null },
    "/erbstueck/": { label: "Erbstück anfragen", href: "mailto:info@edlehoelzer.de?subject=Anfrage%20Erbst%C3%BCck", secondary: "Verfügbare Stücke ansehen", secondaryHref: "#verfuegbare-hoelzer", event: "email-kontakt" },
    "/barbecue-geschenk/": { label: "BBQ-Brett ansehen", href: "#products-bbq", secondary: "Gravur anfragen", secondaryHref: "/schneidebrett-mit-gravur/", event: null },
    "/hochwertige-geschenke-holz/": { label: "Geschenk finden", href: "#products-geschenke", secondary: "Gravur ansehen", secondaryHref: "/schneidebrett-mit-gravur/", event: null },
    "/pflege.html": { label: "Pflegebalsam kaufen", href: "https://www.etsy.com/de/listing/1881802291/holzpflege-set-fur-schneidebretter", secondary: "Aufbereitung prüfen", secondaryHref: "/schneidebrett-aufbereiten/", event: "care_selfservice_click", external: true },
    "/welches-oel-schneidebrett/": { label: "Pflegebalsam kaufen", href: "https://www.etsy.com/de/listing/1881802291/holzpflege-set-fur-schneidebretter", secondary: "Foto einschätzen lassen", secondaryHref: "mailto:info@edlehoelzer.de?subject=Fotoeinsch%C3%A4tzung%20Schneidebrett", event: "care_selfservice_click", external: true },
    "/schneidebrett-aufbereiten/": { label: "Fotos einschätzen lassen", href: "mailto:info@edlehoelzer.de?subject=Fotoeinsch%C3%A4tzung%20Schneidebrett", secondary: "Kosten ansehen", secondaryHref: "#aufbereitungsservice", event: "refurbishment_inquiry_start" }
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
  var primaryExternal = config.external ? ' target="_blank" rel="noopener" data-etsy-link title="Du öffnest jetzt den Pflegebalsam im Etsy-Shop von Edle Hölzer"' : "";
  var ticking = false;

  bar.className = "mobileStickyCta";
  bar.setAttribute("aria-label", "Schnellzugriff");
  bar.innerHTML =
    '<a class="mobileStickyCta__primary" href="' + config.href + '"' + primaryEvent + primaryExternal + ">" + config.label + "</a>" +
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

  function isInteractiveAreaVisible() {
    if (document.body.classList.contains("has-product-experience")) {
      return true;
    }

    return Array.prototype.some.call(document.querySelectorAll("#produktfinder, #product-finder, [data-product-finder], #produkte-grid, #products-grid, .homepageProductGrid, .pflege-produkt, .oilOutcomeCard, [data-finder-result], .compareBar:not([hidden])"), function (element) {
      if (element.hidden) {
        return false;
      }
      var rect = element.getBoundingClientRect();
      return rect.top < window.innerHeight - 32 && rect.bottom > 96;
    });
  }

  function update() {
    bar.classList.toggle("is-visible", !isHeroVisible() && !isFooterVisible() && !isInteractiveAreaVisible());
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
  bindReviewPhotoDialog();

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
      reviewsUrl: root.getAttribute("data-reviews-src") || (isEnglish ? "/data/reviews-en.json?v=20260726-review-photos" : "/data/reviews.json?v=20260726-review-photos"),
      metaUrl: root.getAttribute("data-review-meta-src") || "/data/reviews-meta.json?v=20260827",
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
      });
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
    var photo = review.image
      ? '<button class="reviewCard__photo" type="button" data-review-photo="' + escapeAttribute(review.image) + '" data-review-photo-alt="' + escapeAttribute(review.imageAlt || "") + '" aria-label="' + escapeAttribute(config.isEnglish ? "View customer photo" : "Käuferfoto ansehen") + '"><img src="' + escapeAttribute(review.image) + '" alt="' + escapeAttribute(review.imageAlt || "") + '" loading="lazy" decoding="async"></button>'
      : "";

    return '<article class="reviewCard">' +
      photo +
      '<div class="reviewCard__stars" aria-label="' + escapeAttribute(rating + config.copy.ratingLabelSuffix) + '">' + buildStars(rating) + '</div>' +
      '<p class="reviewCard__text">“' + escapeHtml(review.text) + '”</p>' +
      '<p class="reviewCard__meta">' + escapeHtml(labelParts.join(config.copy.metaSeparator)) + '</p>' +
    '</article>';
  }

  function bindReviewPhotoDialog() {
    document.addEventListener("click", function (event) {
      var trigger = event.target.closest("[data-review-photo]");
      if (!trigger) return;

      var image = trigger.getAttribute("data-review-photo");
      var alt = trigger.getAttribute("data-review-photo-alt") || "";
      var dialog = document.createElement("dialog");
      dialog.className = "reviewPhotoDialog";
      dialog.innerHTML =
        '<button class="reviewPhotoDialog__close" type="button" aria-label="' + (config.isEnglish ? "Close photo" : "Foto schließen") + '">×</button>' +
        '<img src="' + escapeAttribute(image) + '" alt="' + escapeAttribute(alt) + '">';
      document.body.appendChild(dialog);

      function closeDialog() {
        dialog.close();
        dialog.remove();
        trigger.focus();
      }

      dialog.querySelector(".reviewPhotoDialog__close").addEventListener("click", closeDialog);
      dialog.addEventListener("click", function (dialogEvent) {
        if (dialogEvent.target === dialog) closeDialog();
      });
      dialog.addEventListener("close", function () {
        if (dialog.isConnected) dialog.remove();
      });
      dialog.showModal();
    });
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
    details: "View product",
    compare: "Compare",
    addCompare: "Add to comparison",
    removeCompare: "Remove from comparison",
    inCompare: "In comparison",
    replaceCompare: "Swap",
    continueBrowsing: "Keep browsing",
    buyBoard: "Buy this board on Etsy",
    buyProduct: "Buy this product on Etsy",
    buyCare: "Buy care balm on Etsy",
    etsyTrust: "You are opening this exact product on Etsy · Checkout, reviews and buyer protection are available there",
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
    delivery: "Dispatch",
    decision: "Decision hint",
    finderReason: "Why this fits",
    configuration: "Choose your version",
    standardVersion: "Standard version",
    included: "included",
    pricePreview: "Price preview",
    startingPrice: "Starting price",
    configureOnEtsy: "Configure on Etsy",
    optionCheckoutNote: "Confirm the variants and final total on Etsy.",
    freeShippingGermany: "Free shipping within Germany",
    standardDispatch: "Ready to dispatch in 2–3 working days",
    customDispatch: "With engraving or juice groove: 4–5 working days",
    careBalmIncluded: "Care balm included",
    careBalmThreshold: "Care balm included from €150 goods value",
    careBalmSelected: "Edle Hölzer care balm selected",
    careBalmSelectedNote: "Included in the displayed price.",
    regularPrice: "Regular price",
    holderIncluded: "Care balm and matching board holder included",
    benefitBasis: "Based on goods value before shipping.",
    juiceGrooveOption: "Juice groove",
    engravingOption: "Engraving",
    careBalmOption: "Edle Hölzer care balm · 10% off",
    productWhatsappHint: "Still have a question about this product? Message us.",
    productWhatsappCta: "Ask via WhatsApp",
    mediaProof: "Real product photos",
    controlPromise: "What you can expect",
    productExperiencePromise: "You do not receive a surprise piece: product photos, wood grain, dimensions and open questions are clarified before you decide.",
    boardExperiencePromise: "Every board is freshly prepared before dispatch: finely sanded, oiled, waxed and shipped ready to use with care guidance.",
    engravingExperiencePromise: "For engraving, we coordinate position, motif and visual effect on the specific piece before it is made.",
    accessoryExperiencePromise: "If several pieces of the same wood type are available, you can freely choose your favourite grain before dispatch.",
    careExperiencePromise: "Care instructions are included, so the product does not arrive without context.",
    cardServicePhoto: "real photos",
    cardServiceQuestion: "questions welcome",
    cardServiceVariant: "variant check possible",
    cardServiceCare: "care note included",
    playVideo: "Play product video",
    optional: "optional"
  } : {
    previewTitle: "Produktdetails",
    close: "Schließen",
    details: "Produkt ansehen",
    compare: "Vergleichen",
    addCompare: "Zum Vergleich hinzufügen",
    removeCompare: "Aus Vergleich entfernen",
    inCompare: "Im Vergleich",
    replaceCompare: "Austauschen",
    continueBrowsing: "Weiterstöbern",
    buyBoard: "Dieses Brett auf Etsy kaufen",
    buyProduct: "Dieses Produkt auf Etsy kaufen",
    buyCare: "Pflegebalsam auf Etsy kaufen",
    etsyTrust: "Du öffnest genau dieses Produkt auf Etsy · Checkout, Bewertungen und Käuferschutz findest du dort",
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
    delivery: "Versand",
    decision: "Entscheidungshilfe",
    finderReason: "Warum das passt",
    configuration: "Deine Ausführung",
    standardVersion: "Standardausführung",
    included: "inklusive",
    pricePreview: "Preisvorschau",
    startingPrice: "Ausgangspreis",
    configureOnEtsy: "Auf Etsy konfigurieren",
    optionCheckoutNote: "Varianten und verbindlichen Endpreis bestätigst du auf Etsy.",
    freeShippingGermany: "Kostenloser Versand innerhalb Deutschlands",
    standardDispatch: "Versandbereit in 2–3 Werktagen",
    customDispatch: "Mit Gravur oder Saftrille: 4–5 Werktage",
    careBalmIncluded: "Pflegebalsam inklusive",
    careBalmThreshold: "Ab 150 € Warenwert: Pflegebalsam inklusive",
    careBalmSelected: "Edle Hölzer Pflegebalsam ausgewählt",
    careBalmSelectedNote: "Im angezeigten Preis berücksichtigt.",
    regularPrice: "Einzelpreis",
    holderIncluded: "Pflegebalsam und passender Bretthalter inklusive",
    benefitBasis: "Maßgeblich ist der Warenwert ohne Versand.",
    juiceGrooveOption: "Saftrille",
    engravingOption: "Gravur",
    careBalmOption: "Edle Hölzer Pflegebalsam · 10 % günstiger",
    productWhatsappHint: "Noch offene Fragen zu diesem Produkt? Schreib uns kurz.",
    productWhatsappCta: "Per WhatsApp klären",
    mediaProof: "Echte Produktbilder",
    controlPromise: "Was du erwarten kannst",
    productExperiencePromise: "Du bekommst kein Überraschungsstück: Holzbild, Maße, Optionen und offene Fragen werden vor deiner Entscheidung sauber geklärt.",
    boardExperiencePromise: "Jedes Brett wird vor dem Versand noch einmal frisch vorbereitet: fein geschliffen, geölt, gewachst und mit Pflegehinweis einsatzbereit verschickt.",
    engravingExperiencePromise: "Bei Gravur stimmen wir Position, Motiv und Wirkung auf dem konkreten Stück vor der Fertigung mit dir ab.",
    accessoryExperiencePromise: "Wenn mehrere Exemplare einer Holzart verfügbar sind, kannst du dein Lieblingsstück vor dem Versand frei auswählen.",
    careExperiencePromise: "Die passende Anwendung kommt mit, damit Pflege nicht erst nach dem Kauf zur Unsicherheit wird.",
    cardServicePhoto: "echte Fotos",
    cardServiceQuestion: "Rückfrage möglich",
    cardServiceVariant: "Lieblingsstück wählen",
    cardServiceCare: "Anleitung dabei",
    playVideo: "Produktvideo abspielen",
    optional: "optional"
  };

  var catalogPromise = null;
  var productMap = {};
  var products = [];
  var purchaseRules = {};
  var purchaseSelections = {};
  var compareIds = readCompareState();
  var activeOverlay = null;
  var activeDialog = null;
  var previousFocus = null;
  var previousOverflow = "";
  var previewSwipeStart = null;
  var compareBar = createCompareBar();
  var whatsappNumber = "491791694200";

  document.body.appendChild(compareBar);
  updateCompareBar();

  document.addEventListener("click", function (event) {
    var videoPlayTrigger = event.target.closest("[data-preview-video-play]");
    if (videoPlayTrigger) {
      event.preventDefault();
      activatePreviewVideo(videoPlayTrigger);
      return;
    }

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

  document.addEventListener("touchstart", function (event) {
    if (!activeDialog || !event.target.closest(".productPreview__mainMedia") || event.touches.length !== 1) {
      previewSwipeStart = null;
      return;
    }

    previewSwipeStart = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    };
  }, { passive: true });

  document.addEventListener("touchend", function (event) {
    if (!previewSwipeStart || !activeDialog || event.changedTouches.length !== 1) {
      previewSwipeStart = null;
      return;
    }

    var deltaX = event.changedTouches[0].clientX - previewSwipeStart.x;
    var deltaY = event.changedTouches[0].clientY - previewSwipeStart.y;
    previewSwipeStart = null;

    if (Math.abs(deltaX) < 42 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) {
      return;
    }

    switchPreviewByOffset(deltaX < 0 ? 1 : -1);
  }, { passive: true });

  document.addEventListener("change", function (event) {
    var optionInput = event.target.closest("[data-purchase-option]");
    if (!optionInput) {
      return;
    }

    var productId = optionInput.getAttribute("data-product-id");
    var optionId = optionInput.getAttribute("data-purchase-option");
    var product = productMap[productId];
    if (!product || !optionId) {
      return;
    }

    purchaseSelections[productId] = purchaseSelections[productId] || {};
    purchaseSelections[productId][optionId] = optionInput.checked;
    updatePreviewPurchaseSummary(product);
    track("product_option_toggle", product, {
      source: "preview",
      option: optionId,
      selected: optionInput.checked ? "true" : "false"
    });
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
          purchaseRules = Array.isArray(data) ? {} : (data.purchaseRules || {});
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
        var mainMedia = activeOverlay.querySelector(".productPreview__mainMedia");
        startDesktopPreviewVideo(mainMedia);
        if (mainMedia && mainMedia.querySelector("video[autoplay]")) {
          track("product_video_view", product, { source: source || "preview", playback: "desktop_autoplay" });
        }
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
        '<div class="productPreview__mediaProof"><span>' + escapeHtml(labels.mediaProof) + '</span></div>' +
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
        renderPurchaseHeadline(product) +
        renderEarlyPurchaseAction(product) +
        '<p class="productPreview__moment">' + escapeHtml(productMoment(product)) + '</p>' +
        '<p class="productPreview__proof">' + escapeHtml(productProof(product)) + '</p>' +
        renderExperiencePromise(product) +
        (reason ? '<div class="productPreview__reason"><strong>' + escapeHtml(labels.finderReason) + '</strong><p>' + escapeHtml(reason) + '</p></div>' : "") +
        renderPurchaseConfigurator(product) +
        (facts.length ? '<section class="productPreview__section"><h3>' + escapeHtml(labels.keyFacts) + '</h3><dl class="productPreview__facts">' + facts.map(function (fact) {
          return '<div><dt>' + escapeHtml(fact[0]) + '</dt><dd>' + escapeHtml(fact[1]) + '</dd></div>';
        }).join("") + '</dl></section>' : "") +
        (highlights.length ? '<section class="productPreview__section"><h3>' + escapeHtml(labels.highlights) + '</h3><ul class="productPreview__chips">' + highlights.map(function (highlight) {
          return '<li>' + escapeHtml(highlight) + '</li>';
        }).join("") + '</ul></section>' : "") +
        (productExperienceText(product) !== productMoment(product) ? '<section class="productPreview__section"><h3>' + escapeHtml(labels.madeFor) + '</h3><p>' + escapeHtml(productExperienceText(product)) + '</p></section>' : "") +
        '<section class="productPreview__section"><h3>' + escapeHtml(labels.care) + '</h3><p>' + escapeHtml(careNote(product)) + '</p></section>' +
        (related.length ? '<section class="productPreview__section productPreview__related"><h3>' + escapeHtml(related.some(function (item) { return item.category === "accessory"; }) ? (isEnglish ? "Complete the wood family" : "Passend kombinieren") : labels.related) + '</h3><div class="productPreview__relatedGrid">' + related.map(function (relatedProduct) {
          return '<article><img src="' + escapeAttribute(primaryImage(relatedProduct)) + '" alt="' + escapeAttribute(productImageAlt(relatedProduct)) + '" loading="lazy" decoding="async"><strong>' + escapeHtml(displayProductName(relatedProduct)) + '</strong><div class="productPreview__relatedActions"><button type="button" data-product-preview="' + escapeAttribute(relatedProduct.id) + '" data-product-source="related">' + escapeHtml(isEnglish ? "View" : "Ansehen") + '</button><button type="button" data-product-compare="' + escapeAttribute(relatedProduct.id) + '" data-product-source="related">' + escapeHtml(isEnglish ? "Compare" : "Vergleich") + '</button></div></article>';
        }).join("") + '</div></section>' : "") +
        '<div class="productPreview__actions">' +
        (hasEtsy ? '<div class="productPreview__checkoutRow"><p><span data-purchase-price-label>' + escapeHtml(purchasePriceLabel(product)) + '</span><strong data-purchase-price>' + escapeHtml(purchasePriceText(product)) + '</strong></p><a class="btn btn--emphasis" href="' + escapeAttribute(etsyUrl) + '" target="_blank" rel="noopener" data-etsy-link data-product-etsy="' + escapeAttribute(product.id) + '">' + escapeHtml(purchaseOptions(product).length ? labels.configureOnEtsy : etsyActionLabel(product)) + '</a></div><p class="productPreview__trust">' + escapeHtml(purchaseOptions(product).length ? labels.optionCheckoutNote : labels.etsyTrust) + '</p>' : '<p class="productCard__availability">' + escapeHtml(isEnglish ? (product.availabilityNoteEn || labels.unavailableText) : (product.availabilityNote || labels.unavailableText)) + '</p><a class="btn btn--emphasis" href="' + (isEnglish ? "/en/custom-cutting-board/" : "/schneidebrett-nach-mass/") + '">' + escapeHtml(labels.askSimilar) + '</a>') +
          renderProductWhatsappPrompt(product, hasEtsy) +
          renderPreviewCompareControls(product, source || "preview") +
          '<button class="btn btn--secondary" type="button" data-product-experience-close>' + escapeHtml(labels.continueBrowsing) + '</button>' +
        '</div>' +
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
      if (button.closest(".productPreview__compareControls")) {
        button.textContent = compareButtonLabel(id);
      } else if (!isEnglish && button.classList.contains("productCard__compareUtility")) {
        button.textContent = isActive ? "✓ Im Vergleich" : (compareIds.length >= 2 ? labels.replaceCompare : "+ Vergleichen");
      } else {
        button.textContent = isActive ? labels.removeCompare : (compareIds.length >= 2 ? labels.replaceCompare : labels.compare);
      }
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
    startDesktopPreviewVideo(main);
    activeOverlay.querySelectorAll("[data-preview-media]").forEach(function (item) {
      item.classList.toggle("is-active", item === button);
    });
    button.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }

  function switchPreviewByOffset(offset) {
    if (!activeOverlay) {
      return;
    }

    var buttons = Array.prototype.slice.call(activeOverlay.querySelectorAll("[data-preview-media]"));
    if (buttons.length < 2) {
      return;
    }

    var currentIndex = buttons.findIndex(function (button) {
      return button.classList.contains("is-active");
    });
    if (currentIndex < 0) {
      currentIndex = 0;
    }

    var nextIndex = (currentIndex + offset + buttons.length) % buttons.length;
    switchPreviewMedia(buttons[nextIndex]);
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
    var images = urls.slice(0, 9).map(function (url) {
      return {
        type: "image",
        src: url,
        poster: url,
        alt: productImageAlt(product)
      };
    });

    var videos = Array.isArray(product.videos) ? product.videos.filter(function (item) {
      return item && item.src && item.poster;
    }).map(function (item) {
      return {
        type: "video",
        src: item.src,
        poster: item.poster,
        alt: item.alt || productImageAlt(product)
      };
    }) : [];

    return videos.concat(images).slice(0, 10);
  }

  function renderPreviewMainMedia(item) {
    if (!item || !item.src) {
      return '<div class="productPreview__placeholder">' + escapeHtml(labels.previewTitle) + '</div>';
    }

    if (item.type === "video") {
      if (shouldAutoplayPreviewVideo()) {
        return '<video data-preview-main controls playsinline preload="metadata" autoplay muted loop' + (item.poster ? ' poster="' + escapeAttribute(item.poster) + '"' : "") + ' aria-label="' + escapeAttribute(item.alt || labels.previewTitle) + '"><source src="' + escapeAttribute(item.src) + '" type="video/mp4"></video>';
      }
      return '<div class="productPreview__videoPoster" data-preview-main>' +
        '<img src="' + escapeAttribute(item.poster) + '" alt="' + escapeAttribute(item.alt || labels.previewTitle) + '" decoding="async">' +
        '<button type="button" data-preview-video-play data-video-src="' + escapeAttribute(item.src) + '" data-video-poster="' + escapeAttribute(item.poster) + '" data-video-alt="' + escapeAttribute(item.alt || labels.previewTitle) + '"><span aria-hidden="true">▶</span>' + escapeHtml(labels.playVideo) + '</button>' +
      '</div>';
    }

    return '<img data-preview-main src="' + escapeAttribute(item.src) + '" alt="' + escapeAttribute(item.alt) + '" decoding="async">';
  }

  function shouldAutoplayPreviewVideo() {
    return Boolean(window.matchMedia && window.matchMedia("(min-width: 769px) and (hover: hover)").matches);
  }

  function activatePreviewVideo(trigger) {
    var container = trigger.closest(".productPreview__mainMedia");
    var src = trigger.getAttribute("data-video-src") || "";
    if (!container || !src) {
      return;
    }
    var poster = trigger.getAttribute("data-video-poster") || "";
    var alt = trigger.getAttribute("data-video-alt") || labels.previewTitle;
    container.innerHTML = '<video data-preview-main controls playsinline autoplay muted' + (poster ? ' poster="' + escapeAttribute(poster) + '"' : "") + ' aria-label="' + escapeAttribute(alt) + '"><source src="' + escapeAttribute(src) + '" type="video/mp4"></video>';
    var video = container.querySelector("video");
    if (video && typeof video.play === "function") {
      var productId = activeOverlay && activeOverlay.getAttribute("data-current-product-id");
      track("product_video_view", productMap[productId], {
        source: (activeOverlay && activeOverlay.getAttribute("data-current-product-source")) || "preview",
        playback: "manual"
      });
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }
    }
  }

  function startDesktopPreviewVideo(root) {
    if (!root || !shouldAutoplayPreviewVideo()) {
      return;
    }
    var video = root.querySelector("video[autoplay]");
    if (!video || typeof video.play !== "function") {
      return;
    }
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {});
    }
  }

  function renderPreviewThumb(item, index) {
    var poster = item.poster || item.src;
    return '<button class="productPreview__thumb' + (index === 0 ? " is-active" : "") + '" type="button" data-preview-media="' + index + '" data-preview-type="' + escapeAttribute(item.type || "image") + '" data-preview-src="' + escapeAttribute(item.src) + '" data-preview-poster="' + escapeAttribute(poster) + '" data-preview-alt="' + escapeAttribute(item.alt) + '"><img src="' + escapeAttribute(poster) + '" alt="" loading="lazy" decoding="async">' + (item.type === "video" ? '<span class="productPreview__videoBadge">Video</span>' : "") + '</button>';
  }

  function mediaCountLabel(count) {
    if (isEnglish) {
      return count + (count === 1 ? " photo" : " photos");
    }
    return count + (count === 1 ? " Foto" : " Fotos");
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
    if (product.category === "accessory") {
      var isButterKnife = productTextMatches(product, /buttermesser|butter\s*knife/i);
      var isSpatula = productTextMatches(product, /pfannenwender|spatula|turner/i);
      var isScraper = productTextMatches(product, /teigschaber|dough|scraper/i);
      var setMatches = products.filter(function (candidate) {
        if (!candidate || candidate.id === product.id || !candidate.image || !hasVerifiedListing(candidate)) {
          return false;
        }
        if (isButterKnife) {
          return productTextMatches(candidate, /nussbaum|walnut|pfannenwender|spatula|turner|teigschaber|dough|scraper/i);
        }
        if (isSpatula) {
          return productTextMatches(candidate, /buttermesser|butter\s*knife|teigschaber|dough|scraper|schneidebrett|brett|board/i);
        }
        if (isScraper) {
          return productTextMatches(candidate, /buttermesser|butter\s*knife|pfannenwender|spatula|turner|schneidebrett|brett|board/i);
        }
        return false;
      });
      if (setMatches.length) {
        return sortRelatedForAccessory(product, setMatches).slice(0, 3);
      }
    }

    if (product.category === "board") {
      var matchingAccessories = products.filter(function (candidate) {
        return candidate && candidate.id !== product.id && candidate.category === "accessory" && candidate.image && hasVerifiedListing(candidate);
      }).sort(function (a, b) {
        return materialAffinityScore(product, b) - materialAffinityScore(product, a);
      });
      if (matchingAccessories.length) {
        return matchingAccessories.slice(0, 3);
      }
    }

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

  function productTextMatches(product, pattern) {
    return pattern.test([
      product.name,
      product.displayName,
      product.segment,
      product.shortDescription,
      product.longDescription,
      product.material,
      (product.badges || []).join(" ")
    ].join(" "));
  }

  function sortRelatedForAccessory(product, candidates) {
    return candidates.sort(function (a, b) {
      return accessoryRelatedScore(product, b) - accessoryRelatedScore(product, a);
    });
  }

  function accessoryRelatedScore(product, candidate) {
    var score = 0;
    if (candidate.category === "accessory") {
      score += 10;
    }
    if (candidate.category === "board") {
      score += 8;
    }
    if (product.material && candidate.material && product.material === candidate.material) {
      score += 4;
    }
    if (productTextMatches(candidate, /nussbaum|walnut/i)) {
      score += 3;
    }
    if (candidate.giftable) {
      score += 1;
    }
    return score;
  }

  function materialAffinityScore(product, candidate) {
    var source = String(product.material || "").toLowerCase();
    var target = [candidate.material, candidate.name, candidate.shortDescription, (candidate.badges || []).join(" ")].join(" ").toLowerCase();
    var score = 0;
    ["eiche", "nussbaum", "buche", "esche", "ahorn", "zwetschge", "kambala", "wenge"].forEach(function (wood) {
      if (source.indexOf(wood) !== -1 && target.indexOf(wood) !== -1) {
        score += 8;
      }
    });
    if (candidate.giftable) {
      score += 1;
    }
    return score;
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
    pushFact(facts, labels.thickness, displayThicknessLabel(product));
    pushFact(facts, labels.weight, exactWeightLabel(product));
    if (product.category === "board") {
      pushFact(facts, labels.juiceGroove, juiceGrooveFactLabel(product));
    }
    pushFact(facts, labels.engraving, engravingLabel(product));
    return facts.slice(0, 9);
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
        if (badge && highlights.length < 5 && !/cm|mm|kg|Format laut/i.test(String(badge)) && !isAccessoryMaterialBadge(product, badge)) {
          highlights.push(normalizeConstructionTerms(badge));
        }
      });
    }
    return unique(highlights).filter(function (highlight) {
      return highlight !== product.material && !/^(Langholz|Stirnholz|edge grain|end grain|Stirnholz-Aufbau|end-grain construction)$/i.test(highlight);
    }).slice(0, 4);
  }

  function isAccessoryMaterialBadge(product, badge) {
    if (product.category !== "accessory") {
      return false;
    }
    var value = String(badge || "").toLowerCase();
    return /eiche|nussbaum|buche|esche|zwetschge|kambala|kastanie|ahorn|wenge|weitere/.test(value);
  }

  function displayThicknessLabel(product) {
    var value = meaningful(product.thicknessLabel);
    if (!value) {
      return "";
    }
    return String(value).replace(/ca\.\s*0,8\s*cm/i, "ca. 8 mm");
  }

  function productMoment(product) {
    var text = [product.name, product.displayName, product.segment, product.shortDescription].join(" ").toLowerCase();
    if (product.category === "care") {
      return isEnglish ? "For boards that should be cared for instead of replaced." : "Für Bretter, die gepflegt statt ersetzt werden sollen.";
    }
    if (/buttermesser|butter\s*knife/.test(text)) {
      return isEnglish ? "For breakfast, bread boards and small serving moments that should match your wooden kitchen tools." : "Für Frühstück, Brotzeit und kleine Serviermomente, die zu deinen Holzstücken passen sollen.";
    }
    if (/pfannenwender|spatula|turner/.test(text)) {
      return isEnglish ? "For the pan, grill and kitchen tools that may match your board instead of feeling random." : "Für Pfanne, Grill und Küchenhelfer, die zum Brett passen dürfen statt beliebig zu wirken.";
    }
    if (/teigschaber|dough|scraper/.test(text)) {
      return isEnglish ? "For sourdough, bread dough and a wooden tool family that can match your board." : "Für Sauerteig, Brotteig und eine Holzfamilie, die zum Brett passen kann.";
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
    if (product.shortDescription) {
      return normalizeConstructionTerms(product.shortDescription).replace(/\s+/g, " ").trim();
    }
    if (product.longDescription) {
      var normalized = normalizeConstructionTerms(product.longDescription).replace(/\s+/g, " ").trim();
      var sentences = normalized.match(/[^.!?]+[.!?]+/g);
      if (sentences && sentences.length) {
        return sentences.slice(0, 2).join(" ").trim();
      }
      return normalized.length > 340 ? normalized.slice(0, 337).replace(/\s+\S*$/, "") + "…" : normalized;
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
    var text = [product.name, product.displayName, product.segment].join(" ").toLowerCase();
    if (/buttermesser|butter\s*knife/.test(text)) {
      return isEnglish
        ? "For butter, cream cheese, spreads and breakfast boards. Choose walnut or plum wood and combine it with matching boards, spatulas or dough scrapers."
        : "Für Butter, Frischkäse, Aufstriche und Brotzeit am Tisch. Du kannst Nussbaum oder Zwetschge wählen und es mit passenden Brettern, Pfannenwendern oder Teigschabern kombinieren.";
    }
    if (/pfannenwender|spatula|turner/.test(text)) {
      return isEnglish
        ? "For turning, lifting and serving at the hob or grill. Works well as part of a matching wood set with a board, butter knife or dough scraper."
        : "Zum Wenden, Anheben und Servieren am Kochfeld oder Grill. Passt als Holz-Set gut zu Brett, Buttermesser oder Teigschaber.";
    }
    if (/teigschaber|dough|scraper/.test(text)) {
      return isEnglish
        ? "For dividing and shaping dough and lifting chopped ingredients from the board. If several pieces are available, the wood look can be coordinated before dispatch."
        : "Zum Teilen und Formen von Teig sowie zum Aufnehmen von Schnittgut vom Brett. Wenn mehrere Exemplare verfügbar sind, kannst du dein Lieblingsstück vor dem Versand frei auswählen.";
    }
    if (product.category === "board") {
      return productMoment(product);
    }
    if (product.category === "care") {
      return isEnglish ? "Care products support the surface when wood becomes dry, matte or rough." : "Pflegeprodukte unterstützen die Oberfläche, wenn Holz trocken, matt oder rau wird.";
    }
    if (product.category === "accessory") {
      return isEnglish ? "This tool is made for regular kitchen use, not for disappearing unused in a drawer." : "Dieses Werkzeug ist für regelmäßige Küchenarbeit gedacht, nicht für die ungenutzte Schublade.";
    }
    if (product.shortDescription) {
      return product.shortDescription;
    }
    return isEnglish ? "This board is made for people who want to use, care for and keep a real piece of wood." : "Dieses Brett ist für Menschen gedacht, die ein echtes Stück Holz benutzen, pflegen und behalten wollen.";
  }

  function careNote(product) {
    if (product.category === "care") {
      return isEnglish ? "Use care products according to their instructions and let treated wood dry openly." : "Pflegeprodukte nach Anleitung verwenden und behandeltes Holz offen trocknen lassen.";
    }
    if (product.category === "accessory") {
      return isEnglish ? "Clean by hand, dry promptly and refresh occasionally with food-safe wood care when the surface feels dry." : "Von Hand reinigen, direkt abtrocknen und bei trockener Oberfläche gelegentlich mit lebensmittelechter Holzpflege auffrischen.";
    }
    return isEnglish ? "Wood should not go into the dishwasher. Let it dry after cleaning and care for it when the surface becomes dry." : "Holz gehört nicht in die Spülmaschine. Nach dem Reinigen trocknen lassen und pflegen, wenn die Oberfläche trocken wirkt.";
  }

  function renderExperiencePromise(product) {
    var copy = labels.productExperiencePromise;
    var pieces = [];
    if (product.category === "board") {
      pieces.push(labels.boardExperiencePromise);
      if (hasEngravingControl(product)) {
        pieces.push(labels.engravingExperiencePromise);
      }
      copy = pieces.join(" ");
    } else if (product.category === "accessory" && hasSelectableWoodLook(product)) {
      copy = labels.accessoryExperiencePromise;
    } else if (product.category === "care") {
      copy = labels.careExperiencePromise;
    }

    return '<section class="productPreview__experiencePromise">' +
      '<strong>' + escapeHtml(labels.controlPromise) + '</strong>' +
      '<p>' + escapeHtml(copy) + '</p>' +
    '</section>';
  }

  function hasEngravingControl(product) {
    if (!product) {
      return false;
    }
    if (product.engravingPossible === true) {
      return true;
    }
    var text = [
      product.name,
      product.displayName,
      product.shortDescription,
      product.longDescription,
      product.segment,
      (product.badges || []).join(" ")
    ].join(" ");
    return /gravur|graviert|personalisier|engraving|personal/i.test(text);
  }

  function hasSelectableWoodLook(product) {
    if (!product) {
      return false;
    }
    var text = [
      product.name,
      product.displayName,
      product.shortDescription,
      product.longDescription,
      product.segment,
      product.slug
    ].join(" ");
    return /teigschaber|dough\s*scraper|pfannenwender|spatula|turner|buttermesser|butter\s*knife/i.test(text);
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

  function purchaseOptions(product) {
    if (!hasVerifiedListing(product)) {
      return [];
    }

    var options = [];
    var listingId = String(product.listingId || "");
    var optionPrices = purchaseRules.optionPrices || {};
    var juiceGrooveIds = purchaseRules.juiceGrooveOptionListingIds || [];
    var careBalmMaximumBasePrice = Number(purchaseRules.careBalmOptionMaximumBasePrice || 150);
    var careBalmExcludedIds = purchaseRules.careBalmOptionExcludedListingIds || [];
    var engravable = product.category === "board" || product.category === "accessory";
    var productText = [
      product.name,
      product.displayName,
      product.shortDescription,
      product.longDescription,
      Array.isArray(product.badges) ? product.badges.join(" ") : ""
    ].join(" ").toLowerCase();

    if (product.category === "board" && juiceGrooveIds.map(String).indexOf(listingId) !== -1) {
      options.push({
        id: "juiceGroove",
        label: labels.juiceGrooveOption,
        price: Number(optionPrices.juiceGroove || 0)
      });
    }

    if (
      product.category === "board" &&
      Number.isFinite(Number(product.priceOrder)) &&
      Number(product.priceOrder) < careBalmMaximumBasePrice &&
      careBalmExcludedIds.map(String).indexOf(listingId) === -1
    ) {
      var careBalmRegularPrice = Number(optionPrices.careBalmRegular || 9.99);
      var careBalmDiscountPercent = Number(optionPrices.careBalmBundleDiscountPercent || 10);
      options.push({
        id: "careBalm",
        label: labels.careBalmOption,
        price: Math.round(careBalmRegularPrice * (1 - careBalmDiscountPercent / 100) * 100) / 100,
        regularPrice: careBalmRegularPrice
      });
    }

    if (engravable && (product.engravingPossible === true || /personalisierbar|gravur|engraving|personali[sz]/i.test(productText))) {
      options.push({
        id: "engraving",
        label: labels.engravingOption,
        price: Number(product.category === "accessory" ? optionPrices.engravingAccessory : optionPrices.engravingBoard) || 0
      });
    }

    return options.filter(function (option) {
      return option.price > 0;
    });
  }

  function juiceGrooveFactLabel(product) {
    var optional = purchaseOptions(product).some(function (option) {
      return option.id === "juiceGroove";
    });
    return optional ? labels.optional : booleanLabel(hasBadge(product, "Saftrille"));
  }

  function purchaseSelection(product) {
    return purchaseSelections[product.id] || {};
  }

  function purchaseTotal(product) {
    var subtotal = purchaseSubtotalWithoutCareBalm(product);
    if (!Number.isFinite(subtotal)) {
      return null;
    }

    var selection = purchaseSelection(product);
    var careThreshold = Number(purchaseRules.careBalmMinimumGoodsValue || 150);
    var total = subtotal;
    purchaseOptions(product).forEach(function (option) {
      if (option.id === "careBalm" && selection[option.id] && subtotal < careThreshold) {
        total += option.price;
      }
    });
    return Math.round(total * 100) / 100;
  }

  function purchaseSubtotalWithoutCareBalm(product) {
    var subtotal = Number(product.priceOrder);
    if (!Number.isFinite(subtotal)) {
      return null;
    }
    var selection = purchaseSelection(product);
    purchaseOptions(product).forEach(function (option) {
      if (option.id !== "careBalm" && selection[option.id]) {
        subtotal += option.price;
      }
    });
    return Math.round(subtotal * 100) / 100;
  }

  function careBalmIsIncluded(product) {
    var subtotal = purchaseSubtotalWithoutCareBalm(product);
    var careThreshold = Number(purchaseRules.careBalmMinimumGoodsValue || 150);
    return Number.isFinite(subtotal) && subtotal >= careThreshold;
  }

  function formatCurrency(value) {
    if (!Number.isFinite(value)) {
      return "";
    }
    return new Intl.NumberFormat(isEnglish ? "en-GB" : "de-DE", {
      style: "currency",
      currency: purchaseRules.currency || "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  function purchasePriceLabel(product) {
    var selection = purchaseSelection(product);
    var hasSelection = purchaseOptions(product).some(function (option) {
      return selection[option.id];
    });
    return hasSelection ? labels.pricePreview : labels.startingPrice;
  }

  function purchasePriceText(product) {
    var total = purchaseTotal(product);
    if (!Number.isFinite(total)) {
      return displayPriceLabel(product);
    }
    return (isEnglish ? "from " : "ab ") + formatCurrency(total);
  }

  function hasFreeShippingGermany(product) {
    var listingIds = purchaseRules.freeShippingGermanyListingIds || [];
    return listingIds.map(String).indexOf(String(product.listingId || "")) !== -1;
  }

  function purchaseDeliveryText(product) {
    var selection = purchaseSelection(product);
    var selectedCustomOptions = purchaseOptions(product).filter(function (option) {
      return option.id !== "careBalm" && selection[option.id];
    });
    if (!selectedCustomOptions.length) {
      return labels.standardDispatch;
    }
    var selectedIds = selectedCustomOptions.map(function (option) {
      return option.id;
    });
    if (selectedIds.indexOf("juiceGroove") === -1 && selectedIds.indexOf("engraving") !== -1) {
      return isEnglish ? "With engraving: 4–5 working days" : "Mit Gravur: 4–5 Werktage";
    }
    if (selectedIds.indexOf("engraving") === -1 && selectedIds.indexOf("juiceGroove") !== -1) {
      return isEnglish ? "With juice groove: 4–5 working days" : "Mit Saftrille: 4–5 Werktage";
    }
    return labels.customDispatch;
  }

  function minimumBoardThickness(product) {
    if (!product || product.category !== "board") {
      return null;
    }
    var values = String(product.thicknessLabel || "")
      .replace(/,/g, ".")
      .match(/\d+(?:\.\d+)?/g);
    if (!values || !values.length) {
      return null;
    }
    return Math.min.apply(Math, values.map(Number).filter(Number.isFinite));
  }

  function purchaseBenefit(product) {
    var goodsValue = purchaseSubtotalWithoutCareBalm(product);
    var careThreshold = Number(purchaseRules.careBalmMinimumGoodsValue || 150);
    var holderThreshold = Number(purchaseRules.holderMinimumGoodsValue || 350);
    var holderThickness = Number(purchaseRules.holderMinimumBoardThicknessCm || 4);
    var thickness = minimumBoardThickness(product);
    var selection = purchaseSelection(product);

    if (selection.careBalm && Number.isFinite(goodsValue) && goodsValue < careThreshold) {
      return {
        title: labels.careBalmSelected,
        detail: labels.careBalmSelectedNote,
        active: true
      };
    }

    if (Number.isFinite(goodsValue) && goodsValue >= holderThreshold && thickness !== null && thickness >= holderThickness) {
      return {
        title: labels.holderIncluded,
        detail: labels.benefitBasis,
        active: true
      };
    }
    if (Number.isFinite(goodsValue) && goodsValue >= careThreshold) {
      return {
        title: labels.careBalmIncluded,
        detail: labels.benefitBasis,
        active: true
      };
    }
    return {
      title: labels.careBalmThreshold,
      detail: labels.benefitBasis,
      active: false
    };
  }

  function renderPurchaseHeadline(product) {
    if (!hasVerifiedListing(product)) {
      return "";
    }
    return '<div class="productPreview__purchaseHeadline">' +
      '<div><span data-purchase-price-label>' + escapeHtml(purchasePriceLabel(product)) + '</span><strong data-purchase-price>' + escapeHtml(purchasePriceText(product)) + '</strong></div>' +
      '<div class="productPreview__purchaseMeta"><span data-purchase-delivery>' + escapeHtml(purchaseDeliveryText(product)) + '</span>' +
      (hasFreeShippingGermany(product) ? '<span class="productPreview__shipping">' + escapeHtml(labels.freeShippingGermany) + '</span>' : "") +
      '</div>' +
    '</div>';
  }

  function renderEarlyPurchaseAction(product) {
    if (!hasVerifiedListing(product)) {
      return "";
    }
    return '<div class="productPreview__earlyPurchase"><a class="btn btn--emphasis" href="' + escapeAttribute(etsyActionUrl(product)) + '" target="_blank" rel="noopener" data-etsy-link data-product-etsy="' + escapeAttribute(product.id) + '">' + escapeHtml(purchaseOptions(product).length ? labels.configureOnEtsy : etsyActionLabel(product)) + '</a><span>' + escapeHtml(isEnglish ? "Secure checkout on Etsy. Details remain visible here." : "Sicherer Checkout über Etsy. Alle Details bleiben hier sichtbar.") + '</span></div>';
  }

  function renderPurchaseBenefit(product) {
    var benefit = purchaseBenefit(product);
    return '<div class="productPreview__benefit' + (benefit.active ? " is-active" : "") + '" data-purchase-benefit>' +
      '<strong>' + escapeHtml(benefit.title) + '</strong>' +
      '<span>' + escapeHtml(benefit.detail) + '</span>' +
    '</div>';
  }

  function renderPurchaseConfigurator(product) {
    if (!hasVerifiedListing(product)) {
      return "";
    }
    var options = purchaseOptions(product);
    var selection = purchaseSelection(product);
    return '<section class="productPreview__configuration">' +
      (options.length ? '<h3>' + escapeHtml(labels.configuration) + '</h3><div class="productPreview__optionList">' +
        '<div class="productPreview__option productPreview__option--standard"><span>' + escapeHtml(labels.standardVersion) + '</span><strong>' + escapeHtml(labels.included) + '</strong></div>' +
        options.map(function (option) {
          var hidden = option.id === "careBalm" && careBalmIsIncluded(product);
          var optionCopy = '<span class="productPreview__optionCopy"><span>' + escapeHtml(option.label) + '</span>' +
            (Number.isFinite(option.regularPrice) ? '<small>' + escapeHtml(labels.regularPrice) + ' ' + escapeHtml(formatCurrency(option.regularPrice)) + '</small>' : "") +
          '</span>';
          return '<label class="productPreview__option"' + (hidden ? " hidden" : "") + ' data-purchase-option-row="' + escapeAttribute(option.id) + '"><input type="checkbox" data-purchase-option="' + escapeAttribute(option.id) + '" data-product-id="' + escapeAttribute(product.id) + '"' + (selection[option.id] ? " checked" : "") + '>' + optionCopy + '<strong>+ ' + escapeHtml(formatCurrency(option.price)) + '</strong></label>';
        }).join("") +
      '</div>' : "") +
      renderPurchaseBenefit(product) +
    '</section>';
  }

  function updatePreviewPurchaseSummary(product) {
    if (!activeOverlay) {
      return;
    }
    activeOverlay.querySelectorAll("[data-purchase-price-label]").forEach(function (element) {
      element.textContent = purchasePriceLabel(product);
    });
    activeOverlay.querySelectorAll("[data-purchase-price]").forEach(function (element) {
      element.textContent = purchasePriceText(product);
    });
    activeOverlay.querySelectorAll("[data-purchase-delivery]").forEach(function (element) {
      element.textContent = purchaseDeliveryText(product);
    });
    activeOverlay.querySelectorAll("[data-purchase-benefit]").forEach(function (element) {
      var benefit = purchaseBenefit(product);
      element.classList.toggle("is-active", benefit.active);
      element.innerHTML = '<strong>' + escapeHtml(benefit.title) + '</strong><span>' + escapeHtml(benefit.detail) + '</span>';
    });
    activeOverlay.querySelectorAll('[data-purchase-option-row="careBalm"]').forEach(function (element) {
      element.hidden = careBalmIsIncluded(product);
    });
  }

  function deliveryLabel(product) {
    if (!product) {
      return "";
    }
    if (!isAvailableProduct(product)) {
      return "";
    }
    if (product.category === "board") {
      return isEnglish
        ? "Standard 2–3 working days; with juice groove or engraving 4–5"
        : "Standard 2–3 Werktage; mit Saftrille oder Gravur 4–5";
    }
    return isEnglish ? "2–3 working days" : "2–3 Werktage";
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

  function renderProductWhatsappPrompt(product, hasEtsy) {
    if (!product || !hasEtsy || product.category === "care") {
      return "";
    }
    var productName = displayProductName(product);
    var whatsappUrl = productWhatsappUrl(product, productName);
    return '<div class="productPreview__whatsapp">' +
      '<span>' + escapeHtml(labels.productWhatsappHint) + '</span>' +
      '<a href="' + escapeAttribute(whatsappUrl) + '" target="_blank" rel="noopener" aria-label="' + escapeAttribute(labels.productWhatsappCta) + '" data-umami-event="whatsapp-kontakt" data-umami-event-source-page="product-preview" data-umami-event-product="' + escapeAttribute(product.id || productName) + '"><span class="whatsappServiceFloat__icon" aria-hidden="true"></span></a>' +
    '</div>';
  }

  function productWhatsappUrl(product, productName) {
    var lines = isEnglish ? [
      "Hello Edle Hölzer, I have a question about this product:",
      "",
      "Product: " + productName,
      "Price: " + purchasePriceText(product),
      etsyActionUrl(product) ? "Etsy link: " + etsyActionUrl(product) : "",
      "",
      "Could you help me briefly?"
    ] : [
      "Hallo Edle Hölzer, ich habe noch eine Frage zu diesem Produkt:",
      "",
      "Produkt: " + productName,
      "Preis: " + purchasePriceText(product),
      etsyActionUrl(product) ? "Etsy-Link: " + etsyActionUrl(product) : "",
      "",
      "Könnt ihr mir kurz weiterhelfen?"
    ];

    return "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(lines.filter(Boolean).join("\n"));
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
    if (!product || product.visibility === "hidden" || product.visibility === "archive") {
      return false;
    }
    if (product.visibility === "inspiration" && product.inspirationOnly === true && availabilityStatus(product) === "sold") {
      return true;
    }
    if (product.active !== true) {
      return false;
    }
    if (availabilityStatus(product) === "made_to_order") {
      return product.visibility === "grid";
    }
    return isAvailableProduct(product) && product.directListingUrlVerified === true && Boolean(product.etsyListingUrl || product.etsyUrl);
  }

  function isComparableProduct(product) {
    if (product && product.inspirationOnly === true) {
      return false;
    }
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
      product_category: product && product.category,
      wood: product && product.material
    }, extra || {});

    if (window.EdleAnalytics && typeof window.EdleAnalytics.track === "function") {
      window.EdleAnalytics.track(eventName, payload);
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
  var labels = isEnglish ? {
    askSimilar: "Request similar product",
    unavailableText: "This exact product is no longer available. A similar piece can be matched by material, size and use.",
    controlPromise: "What you can expect",
    cardServicePhoto: "real photos",
    cardServiceQuestion: "questions welcome",
    cardServiceVariant: "variant check possible",
    cardServiceCare: "care note included"
  } : {
    askSimilar: "Ähnliches Produkt anfragen",
    unavailableText: "Dieses konkrete Produkt ist nicht mehr verfügbar. Ein ähnliches Stück können wir nach Material, Größe und Einsatz abstimmen.",
    controlPromise: "Was du erwarten kannst",
    cardServicePhoto: "echte Fotos",
    cardServiceQuestion: "Rückfrage möglich",
    cardServiceVariant: "Lieblingsstück wählen",
    cardServiceCare: "Anleitung dabei"
  };

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
      id: "style",
      title: "Welche Wirkung soll das Holz haben?",
      options: [
        {
          value: "light",
          title: "Hell und ruhig",
          description: "Buche, Ahorn, Esche und helle Eiche wirken sachlich und zurückhaltend.",
          attributes: "hell · ruhig · klar"
        },
        {
          value: "dark",
          title: "Dunkel und elegant",
          description: "Nussbaum und dunkle Akzente passen zu ruhigen, kontrastreichen Küchen.",
          attributes: "dunkel · warm · elegant"
        },
        {
          value: "expressive",
          title: "Markant und präsent",
          description: "3D-Muster, Fachwerkholz und kräftige Maserung dürfen zum Blickfang werden.",
          attributes: "Statement · Erbstück · 3D"
        },
        {
          value: "open",
          title: "Zeig mir, was passt",
          description: "Die Nutzung ist wichtiger als eine vorab festgelegte Holzfarbe.",
          attributes: "offen · beraten · passend"
        }
      ]
    },
    {
      id: "budget",
      title: "Welcher Preisrahmen fühlt sich richtig an?",
      options: [
        {
          value: "under100",
          title: "Bis 100 €",
          description: "Ein solides Einstiegsbrett oder kleineres Geschenk steht im Vordergrund.",
          attributes: "Einstieg · kompakt · praktisch"
        },
        {
          value: "100to250",
          title: "100 bis 250 €",
          description: "Mehr Fläche, Stärke oder aufwendiger Stirnholzaufbau kommen infrage.",
          attributes: "Kernsortiment · massiv · vielseitig"
        },
        {
          value: "above250",
          title: "Ab 250 €",
          description: "Besondere Hölzer, 3D-Aufbau oder ein großes Einzelstück dürfen im Fokus stehen.",
          attributes: "Atelier · Einzelstück · Präsenz"
        },
        {
          value: "open",
          title: "Erst das passende Brett",
          description: "Zeig mir die beste Übereinstimmung und danach, was sie kostet.",
          attributes: "ohne Preisfilter · voller Vergleich"
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
      id: "style",
      title: "How should the wood feel in the room?",
      options: [
        {
          value: "light",
          title: "Light and calm",
          description: "Beech, maple, ash and light oak create a restrained, clear look.",
          attributes: "light · calm · clear"
        },
        {
          value: "dark",
          title: "Dark and elegant",
          description: "Walnut and dark accents suit calm, contrasting kitchens.",
          attributes: "dark · warm · elegant"
        },
        {
          value: "expressive",
          title: "Distinctive and present",
          description: "3D patterns, reclaimed timber and strong grain may become a focal point.",
          attributes: "statement · heirloom · 3D"
        },
        {
          value: "open",
          title: "Show me what fits",
          description: "How the board is used matters more than a predefined wood colour.",
          attributes: "open · advised · suitable"
        }
      ]
    },
    {
      id: "budget",
      title: "Which price range feels right?",
      options: [
        {
          value: "under100",
          title: "Up to €100",
          description: "A solid entry board or smaller gift is the priority.",
          attributes: "entry · compact · practical"
        },
        {
          value: "100to250",
          title: "€100 to €250",
          description: "More surface, thickness or a more involved end-grain build comes into reach.",
          attributes: "core range · solid · versatile"
        },
        {
          value: "above250",
          title: "From €250",
          description: "Special woods, 3D construction or a large one-off piece may take priority.",
          attributes: "atelier · one-off · presence"
        },
        {
          value: "open",
          title: "Fit first",
          description: "Show me the closest match first, then tell me what it costs.",
          attributes: "no price filter · full comparison"
        }
      ]
    }
  ];

  var questions = isEnglish ? questionsEn : questionsDe;

  function activeQuestions() {
    var selectedUse = state.answers.use && state.answers.use.value;
    var source = isEnglish ? questionsEn : questionsDe;
    if (selectedUse !== "gift") {
      return source;
    }
    var giftQuestion = isEnglish ? {
      id: "giftScale",
      title: "What kind of gift should it be?",
      options: [
        { value: "smallGift", title: "A thoughtful gesture", description: "For a birthday, Valentine’s Day or a small personal occasion.", attributes: "compact · personal · useful" },
        { value: "meaningfulGift", title: "A lasting present", description: "For a host, housewarming or someone who cooks often.", attributes: "substantial · visible · versatile" },
        { value: "milestoneGift", title: "A major occasion", description: "For a wedding, anniversary or a gift intended to stay for many years.", attributes: "one-off · presence · engraving" }
      ]
    } : {
      id: "giftScale",
      title: "Welche Art von Geschenk soll es sein?",
      options: [
        { value: "smallGift", title: "Eine persönliche Geste", description: "Für Geburtstag, Valentinstag oder einen kleineren persönlichen Anlass.", attributes: "kompakt · persönlich · nützlich" },
        { value: "meaningfulGift", title: "Ein bleibendes Geschenk", description: "Für Gastgeber, Einzug oder Menschen, die häufig kochen.", attributes: "substanziell · sichtbar · vielseitig" },
        { value: "milestoneGift", title: "Ein großer Anlass", description: "Für Hochzeit, Jubiläum oder ein Geschenk, das viele Jahre bleiben soll.", attributes: "Einzelstück · Präsenz · Gravur" }
      ]
    };
    return [source[0], giftQuestion, source[2], source[3], source[4]];
  }

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

    questions = activeQuestions();
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

    var rankedEntries = rankEntries(false);
    var unrestrictedEntries = rankEntries(true);
    var mainEntry = rankedEntries[0];
    var main = mainEntry && mainEntry.product;
    var alternatives = main ? rankedEntries.slice(1).filter(function (entry) {
      return entry.score >= mainEntry.score - 18 && isPlausibleAlternative(entry.product, main);
    }).slice(0, 2).map(function (entry) {
      return entry.product;
    }) : [];
    var supplements = main ? supplementaryProducts(main) : [];
    var unrestricted = unrestrictedEntries[0] && unrestrictedEntries[0].product;

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
        '<h2>' + escapeHtml(finderResultTitle()) + '</h2>' +
        '<p><strong>' + (isEnglish ? "This board fits because: " : "Dieses Brett passt, weil: ") + '</strong>' + escapeHtml(buildReason(main)) + '</p>' +
      '</div>' +
      '<div class="recommendationCard">' +
        buildProductMedia(main, false) +
        '<div class="recommendationCard__body">' +
          '<p class="productCard__segment">' + escapeHtml(main.segment) + '</p>' +
          '<h3>' + escapeHtml(displayProductName(main)) + '</h3>' +
          buildCardMeta(main) +
          buildFeatureBadges(main) +
          '<p class="productCard__price">' + escapeHtml(displayPriceLabel(main)) + '</p>' +
          buildProductActions(main, "finder", buildReason(main)) +
          '<div class="ctaRow finderResult__secondaryActions">' +
            '<a class="btn btn--ghost-dark" href="' + gridAnchor + '">' + (isEnglish ? "View product grid" : "Alle Bretter ansehen") + '</a>' +
            '<button class="btn btn--ghost-dark" type="button" data-finder-reset>' + (isEnglish ? "Restart" : "Auswahl ändern") + '</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      (alternatives.length ? '<div class="alternativeList"><h3>' + (isEnglish ? "Alternatives" : "Ebenfalls passend") + '</h3><div class="alternativeGrid">' + alternatives.map(function (product) { return buildAlternativeCard(product, main); }).join("") + '</div></div>' : '<div class="alternativeList alternativeList--empty"><h3>' + escapeHtml(isEnglish ? "No close alternative" : "Keine ähnlich passende Alternative") + '</h3><p>' + escapeHtml(isEnglish ? "No other available product currently meets the same core requirements." : "Aktuell erfüllt kein weiteres verfügbares Brett dieselben Kernanforderungen ähnlich gut.") + '</p><a class="textLink" href="' + gridAnchor + '">' + escapeHtml(isEnglish ? "View all boards" : "Alle Schneidebretter ansehen") + '</a></div>') +
      (supplements.length ? '<div class="finderSupplements"><h3>' + escapeHtml(isEnglish ? "Useful additions" : "Passende Ergänzungen") + '</h3><div class="alternativeGrid">' + supplements.map(buildSupplementCard).join("") + '</div></div>' : "") +
      (unrestricted && unrestricted.id !== main.id && state.answers.budget && state.answers.budget.value !== "open" ? '<aside class="finderResult__openBudget"><p class="eyebrow eyebrow--dark">' + escapeHtml(isEnglish ? "Without a price limit" : "Ohne Preisgrenze") + '</p><h3>' + escapeHtml(displayProductName(unrestricted)) + '</h3><p>' + escapeHtml(isEnglish ? "This is the closest match to your use and style when price is deliberately left out of the decision." : "Dieses Brett passt am stärksten zu Nutzung und Stil, wenn der Preis bewusst nicht in die Entscheidung einfließt.") + '</p><button class="btn btn--ghost-dark" type="button" data-product-preview="' + escapeAttribute(unrestricted.id) + '" data-product-source="finder-open-budget">' + escapeHtml(isEnglish ? "See what changes" : "Unterschied ansehen") + '</button></aside>' : "");

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

  function finderResultTitle() {
    if (state.answers.use && state.answers.use.value === "gift") {
      return isEnglish ? "This direction fits your occasion" : "Das passt zu deinem Anlass.";
    }
    return isEnglish ? "This is probably the best direction for your everyday use" : "Das passt zu deinem Alltag.";
  }

  function rankEntries(ignoreBudget) {
    return state.activeProducts
      .filter(function (product) {
        return product.inspirationOnly !== true && isFinderCompatible(product);
      })
      .map(function (product) {
        return {
          product: product,
          score: scoreProduct(product, ignoreBudget)
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
      });
  }

  function rankProducts(ignoreBudget) {
    return rankEntries(ignoreBudget).map(function (entry) {
      return entry.product;
    });
  }

  function scoreProduct(product, ignoreBudget) {
    var score = 0;
    var use = state.answers.use && state.answers.use.value;
    var space = state.answers.space && state.answers.space.value;
    var giftScale = state.answers.giftScale && state.answers.giftScale.value;
    var movement = state.answers.movement && state.answers.movement.value;
    var style = state.answers.style && state.answers.style.value;
    var budget = state.answers.budget && state.answers.budget.value;
    var price = Number(product.priceOrder || 0);
    var materialText = [product.material, product.name, product.shortDescription, (product.badges || []).join(" ")].join(" ").toLowerCase();

    if (use && Array.isArray(product.useCases) && product.useCases.indexOf(use) !== -1) {
      score += 5;
    }

    if (space && product.kitchenFit === space) {
      score += 4;
    }
    if (space === "small" && (product.kitchenFit === "large" || product.weightClass === "heavy")) {
      score -= 12;
    }
    if (space === "large" && product.sizeProfile === "compact") {
      score -= 4;
    }

    if (movement && product.portability === movement) {
      score += 4;
    }
    if (movement === "portable" && (product.portability === "stationary" || product.weightClass === "heavy")) {
      score -= 14;
    }
    if (movement === "stationary" && product.portability === "portable") {
      score -= 3;
    }

    if (style === "light" && /buche|ahorn|esche|eiche|birke|lärche/.test(materialText)) {
      score += 7;
    }
    if (style === "dark" && /nussbaum|walnuss|wenge|mooreiche|zwetschge|mahagoni/.test(materialText)) {
      score += 8;
    }
    if (style === "expressive" && (/3d|fachwerk|erbstück|schach|kambala|padouk/.test(materialText) || isStatementDesignProduct(product))) {
      score += 12;
    }

    if (use === "gift" && product.giftable) {
      score += 3;
    }

    if (giftScale === "smallGift") {
      score += price <= 100 && product.sizeProfile === "compact" ? 8 : -5;
    } else if (giftScale === "meaningfulGift") {
      score += price >= 90 && price <= 260 ? 7 : 0;
    } else if (giftScale === "milestoneGift") {
      score += Number(product.premiumLevel || 0) * 3;
      score += price >= 200 ? 8 : -4;
    }

    if (!ignoreBudget && budget && budget !== "open") {
      if (budget === "under100") {
        score += price <= 100 ? 12 : -24;
      } else if (budget === "100to250") {
        score += price >= 100 && price <= 250 ? 12 : (price > 250 ? -14 : -3);
      } else if (budget === "above250") {
        score += price >= 250 ? 14 : -8;
      }
    }

    if (isStatementDesignProduct(product) &&
      (use === "gift" || use === "serving" || style === "expressive") &&
      space !== "small" &&
      movement !== "portable") {
      if (use === "gift") {
        score += 3;
      }

      if (use === "serving") {
        score += 3;
      }

      if (style === "expressive") {
        score += 12;
      }

      if (space === "large" && movement === "stationary") {
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

  function productRole(product) {
    var type = String(product && product.productType || "").toLowerCase();
    if (type === "cuttingboard") return "cuttingBoard";
    if (type === "servingboard") return "servingBoard";
    if (type === "accessory") return "accessory";
    if (type === "care") return "care";
    if (product && product.category === "board") return "cuttingBoard";
    return String(product && product.category || "other");
  }

  function productSupportsUse(product, use) {
    var primary = Array.isArray(product.primaryUseCases) ? product.primaryUseCases : [];
    var legacy = Array.isArray(product.useCases) ? product.useCases : [];
    if (use === "gift") {
      return product.giftable === true || primary.indexOf("gift") !== -1 || legacy.indexOf("gift") !== -1;
    }
    return primary.indexOf(use) !== -1 || legacy.indexOf(use) !== -1;
  }

  function isFinderCompatible(product) {
    if (!canRecommendAsMainBoard(product)) {
      return false;
    }

    var use = state.answers.use && state.answers.use.value;
    var space = state.answers.space && state.answers.space.value;
    var movement = state.answers.movement && state.answers.movement.value;
    var role = productRole(product);

    if (use === "daily" || use === "bbq") {
      if (role !== "cuttingBoard" || !productSupportsUse(product, use)) return false;
    } else if (use === "serving") {
      if ((role !== "cuttingBoard" && role !== "servingBoard") || !productSupportsUse(product, use)) return false;
    } else if (use === "gift") {
      if ((role !== "cuttingBoard" && role !== "servingBoard") || !productSupportsUse(product, use)) return false;
    }

    if (space === "small" && (product.sizeProfile === "large" || product.kitchenFit === "large")) {
      return false;
    }
    if (movement === "portable" && (product.portability === "stationary" || product.weightClass === "heavy")) {
      return false;
    }
    return true;
  }

  function isPlausibleAlternative(candidate, main) {
    if (!candidate || !main) return false;
    var use = state.answers.use && state.answers.use.value;
    if (!productSupportsUse(candidate, use)) return false;
    if (use === "daily" || use === "bbq") {
      return productRole(candidate) === "cuttingBoard" && productRole(main) === "cuttingBoard";
    }
    return ["cuttingBoard", "servingBoard"].indexOf(productRole(candidate)) !== -1;
  }

  function supplementaryProducts(main) {
    var use = state.answers.use && state.answers.use.value;
    var mainMaterials = materialTokens(main);
    return state.activeProducts.filter(function (product) {
      if (productRole(product) !== "accessory" || product.inspirationOnly === true || !product.image) return false;
      var primary = Array.isArray(product.primaryUseCases) ? product.primaryUseCases : [];
      var secondary = Array.isArray(product.secondaryUseCases) ? product.secondaryUseCases : [];
      return primary.indexOf(use) !== -1 || secondary.indexOf(use) !== -1 || (use === "gift" && product.giftable === true);
    }).sort(function (a, b) {
      var aMatch = materialTokens(a).some(function (token) { return mainMaterials.indexOf(token) !== -1; });
      var bMatch = materialTokens(b).some(function (token) { return mainMaterials.indexOf(token) !== -1; });
      if (aMatch !== bMatch) return aMatch ? -1 : 1;
      return Number(a.priceOrder || 0) - Number(b.priceOrder || 0);
    }).slice(0, 2);
  }

  function materialTokens(product) {
    return String(product && product.material || "").toLowerCase().split(/,|&|oder|\//).map(function (value) {
      return value.trim();
    }).filter(function (value) {
      return value && !/weitere|massivholz|holz/.test(value);
    });
  }

  function hasConcreteFinderData(product) {
    return dimensionLabel(product) &&
      hasMeaningfulValue(product.thicknessLabel);
  }

  function buildReason(product) {
    var parts = [];
    var use = state.answers.use;
    var space = state.answers.space;
    var giftScale = state.answers.giftScale;
    var movement = state.answers.movement;
    var style = state.answers.style;
    var budget = state.answers.budget;

    if (giftScale) {
      if (giftScale.value === "smallGift") {
        parts.push(isEnglish ? "The occasion calls for a compact, useful present rather than an oversized statement piece." : "Der Anlass spricht für ein kompaktes, nützliches Geschenk statt für ein übergroßes Statement-Stück.");
      } else if (giftScale.value === "milestoneGift") {
        parts.push(isEnglish ? "For a major occasion, material presence and the character of a one-off piece carry more weight." : "Bei einem großen Anlass zählen Materialpräsenz und der Charakter eines Einzelstücks stärker.");
      } else {
        parts.push(isEnglish ? "The gift should remain useful while still feeling substantial and personal." : "Das Geschenk soll dauerhaft nützlich sein und sich zugleich substanziell und persönlich anfühlen.");
      }
    } else if (space && movement) {
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

    if (style && style.value !== "open") {
      parts.push(isEnglish ? "Its wood and grain match the visual direction you selected." : "Holzart und Maserung entsprechen der von dir gewählten Raumwirkung.");
    }

    if (budget && budget.value !== "open" && isWithinSelectedBudget(product, budget.value)) {
      parts.push(isEnglish ? "It also stays within the price range you selected." : "Gleichzeitig bleibt es in dem von dir gewählten Preisrahmen.");
    }

    return parts.slice(0, 3).join(" ");
  }

  function isWithinSelectedBudget(product, budget) {
    var price = Number(product && product.priceOrder || 0);
    if (!price) return false;
    if (budget === "under100") return price <= 100;
    if (budget === "100to250") return price >= 100 && price <= 250;
    if (budget === "above250") return price >= 250;
    return true;
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
    var sort = filters ? filters.get("sort") : "recommended";

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
      });

    if (sort === "recommended") {
      products = sortRecommendedProducts(products);
    } else {
      products.sort(function (a, b) {
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
    }

    if (!products.length) {
      gridRoot.innerHTML = '<p class="productEmpty">' + (isEnglish ? "There are currently no matching products for this filter combination." : "Für diese Filterkombination gibt es aktuell keine passenden Produkte.") + '</p>';
      return;
    }

    gridRoot.innerHTML = products.map(function (product) {
      var highlighted = state.highlightedIds.indexOf(product.id) !== -1;
      var review = product.needsReview ? " is-review" : "";
      var inspiration = product.inspirationOnly === true;
      return '<article class="productCard' + (highlighted ? " is-highlighted" : "") + review + (inspiration ? " is-inspiration" : "") + '">' +
        buildProductMedia(product, "grid") +
        '<div class="productCard__body">' +
          (inspiration ? '<span class="productCard__inspirationBadge">' + escapeHtml(isEnglish ? "Sold · Inspiration" : "Verkauft · Inspiration") + '</span>' : '') +
          '<p class="productCard__segment">' + escapeHtml(product.segment) + '</p>' +
          '<h3 class="productCard__name">' + escapeHtml(displayProductName(product)) + '</h3>' +
          buildCardMeta(product) +
          buildFeatureBadges(product) +
          '<p class="productCard__price">' + escapeHtml(inspiration ? (isEnglish ? "Sold one-off piece" : "Verkauftes Einzelstück") : displayPriceLabel(product)) + '</p>' +
          (isEnglish ? buildServiceSignals(product) : "") +
          buildProductActions(product, "grid") +
        '</div>' +
      '</article>';
    }).join("");
  }

  function sortRecommendedProducts(products) {
    var curatedIds = [
      "etsy-live-20260619-schneidebrett-eiche-massiv-astloch",
      "etsy-export-04-stirnholz-schneidebrett-aus-eiche-handgefertigtes-xxl-kuchenbrett-mit-sa",
      "etsy-live-20260726-erbstueck-no-004-eiche-buche",
      "etsy-export-18-schneidebrett-3d-design-stirnholz-walnuss-wenge-eiche-buche-premium-pers",
      "etsy-export-15-pfannenwender-aus-massivholz-handgemachter-kuchenhelfer-aus-eiche-nussba",
      "etsy-export-01-holz-teigschaber-aus-massivholz-handgemachte-teigkarte-fur-backen-und-ku"
    ];

    return products.slice().sort(function (a, b) {
      if (Boolean(a.inspirationOnly) !== Boolean(b.inspirationOnly)) {
        return a.inspirationOnly ? 1 : -1;
      }
      var aCurated = curatedIds.indexOf(a.id);
      var bCurated = curatedIds.indexOf(b.id);
      if (aCurated !== -1 || bCurated !== -1) {
        if (aCurated === -1) return 1;
        if (bCurated === -1) return -1;
        return aCurated - bCurated;
      }

      var categoryOrder = { board: 0, accessory: 1, care: 2 };
      var aCategory = Object.prototype.hasOwnProperty.call(categoryOrder, a.category) ? categoryOrder[a.category] : 3;
      var bCategory = Object.prototype.hasOwnProperty.call(categoryOrder, b.category) ? categoryOrder[b.category] : 3;
      if (aCategory !== bCategory) {
        return aCategory - bCategory;
      }

      if (Boolean(a.featured) !== Boolean(b.featured)) {
        return a.featured ? -1 : 1;
      }

      return Number(b.premiumLevel || 0) - Number(a.premiumLevel || 0) ||
        Number(a.priceOrder || Number.MAX_VALUE) - Number(b.priceOrder || Number.MAX_VALUE);
    });
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

    return '<button class="productCard__media productCard__mediaButton" type="button" aria-label="' + escapeAttribute((isEnglish ? "View " : "Ansehen: ") + displayProductName(product)) + '" data-product-preview="' + escapeAttribute(product.id) + '" data-product-source="' + escapeAttribute(source || "grid") + '"' + productImageStyle(product) + '>' +
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

    var segment = String(product.segment || "").toLowerCase();
    filtered = filtered.filter(function (badge) {
      var normalized = normalizeConstructionTerms(badge).toLowerCase();
      return !segment || segment.indexOf(normalized) === -1;
    });

    if (!filtered.length) {
      return "";
    }

    return '<div class="productBadgeRow">' + filtered.slice(0, isEnglish ? 3 : 2).map(function (badge) {
      return '<span>' + escapeHtml(normalizeConstructionTerms(badge)) + '</span>';
    }).join("") + '</div>';
  }

  function buildCardMeta(product) {
    if (isEnglish) {
      return buildProductFacts(product);
    }
    var parts = [];
    if (product.material) parts.push(product.material);
    if (dimensionLabel(product)) parts.push(dimensionLabel(product));
    return parts.length ? '<p class="productCard__meta">' + escapeHtml(parts.slice(0, 2).join(" · ")) + '</p>' : "";
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

  function buildServiceSignals(product) {
    var signals = [labels.cardServicePhoto, labels.cardServiceQuestion];
    if (product.category === "accessory" && hasSelectableWoodLook(product)) {
      signals.splice(1, 0, labels.cardServiceVariant);
    }
    if (product.category === "care") {
      signals = [labels.cardServiceCare, labels.cardServiceQuestion];
    }
    return '<ul class="productCard__serviceSignals" aria-label="' + escapeAttribute(labels.controlPromise) + '">' +
      signals.slice(0, 3).map(function (signal) {
        return '<li>' + escapeHtml(signal) + '</li>';
      }).join("") +
    '</ul>';
  }

  function hasSelectableWoodLook(product) {
    var text = [
      product.name,
      product.displayName,
      product.shortDescription,
      product.longDescription,
      product.segment,
      product.slug
    ].join(" ");
    return /teigschaber|dough\s*scraper|pfannenwender|spatula|turner|buttermesser|butter\s*knife/i.test(text);
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
    var compared = isProductCompared(product.id);
    var compareLabel = isEnglish ? "Compare" : (compared ? "✓ Im Vergleich" : "+ Vergleichen");
    var productSource = source || "grid";
    var reasonAttribute = reason ? ' data-product-reason="' + escapeAttribute(reason) + '"' : "";
    var productName = displayProductName(product);
    var detailAriaLabel = isEnglish ? "View " + productName : productName + " ansehen";
    var compareAriaLabel = isEnglish ? "Compare " + productName : productName + " vergleichen";
    var detailButton = '<button class="btn btn--emphasis" type="button" aria-label="' + escapeAttribute(detailAriaLabel) + '" data-product-preview="' + escapeAttribute(product.id) + '" data-product-source="' + escapeAttribute(productSource) + '"' + reasonAttribute + '>' + escapeHtml(detailsLabel) + '</button>';
    var compareButton = '<button class="' + (isEnglish ? 'btn btn--ghost-dark' : 'productCard__compareUtility') + (compared ? ' is-in-compare' : '') + '" type="button" aria-label="' + escapeAttribute(compareAriaLabel) + '" data-product-compare="' + escapeAttribute(product.id) + '" data-product-source="' + escapeAttribute(productSource) + '" aria-pressed="' + (compared ? 'true' : 'false') + '">' + escapeHtml(compareLabel) + '</button>';

    if (product.inspirationOnly === true) {
      return '<div class="ctaRow ctaRow--stacked">' + detailButton + '<a class="btn btn--secondary" href="' + (isEnglish ? "/en/custom-cutting-board/" : "/schneidebrett-nach-mass/") + '">' +
        escapeHtml(isEnglish ? "Request a similar piece" : "Ähnliche Anfertigung anfragen") +
        '</a></div>';
    }

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
    '</div>';
  }

  function isProductCompared(productId) {
    try {
      var stored = JSON.parse(window.localStorage.getItem("edleHoelzerCompareProducts") || "[]");
      return Array.isArray(stored) && stored.indexOf(productId) !== -1;
    } catch (error) {
      return false;
    }
  }

  function primaryCardCta(product) {
    if (product && product.category === "board") {
      return isEnglish ? "View board" : "Zum Brett";
    }
    return isEnglish ? "View product" : "Zum Produkt";
  }

  function buildAlternativeCard(product, main) {
    var content =
      buildProductMedia(product, false) +
      '<span class="alternativeCard__body">' +
        '<span class="productCard__segment">' + escapeHtml(product.segment) + '</span>' +
        '<strong>' + escapeHtml(displayProductName(product)) + '</strong>' +
        buildCardMeta(product) +
        '<span class="alternativeCard__difference">' + escapeHtml(alternativeDifference(product, main)) + '</span>' +
        '<span>' + escapeHtml(displayPriceLabel(product)) + '</span>' +
        '<span class="alternativeCard__actions">' +
          '<button type="button" data-product-preview="' + escapeAttribute(product.id) + '" data-product-source="finder">' + (isEnglish ? "Details" : "Zum Brett") + '</button>' +
          '<button type="button" data-product-compare="' + escapeAttribute(product.id) + '" data-product-source="finder">' + (isEnglish ? "Compare" : "+ Vergleichen") + '</button>' +
        '</span>' +
      '</span>';

    return '<article class="alternativeCard">' + content + '</article>';
  }

  function buildSupplementCard(product) {
    return '<article class="alternativeCard alternativeCard--supplement">' +
      buildProductMedia(product, false) +
      '<span class="alternativeCard__body"><span class="productCard__segment">Küchenhelfer</span><strong>' + escapeHtml(displayProductName(product)) + '</strong>' +
      buildCardMeta(product) + '<span>' + escapeHtml(displayPriceLabel(product)) + '</span><span class="alternativeCard__actions"><button type="button" data-product-preview="' + escapeAttribute(product.id) + '" data-product-source="finder-supplement">Zum Produkt</button></span></span></article>';
  }

  function alternativeDifference(product, main) {
    if (!main) return "";
    if (product.sizeProfile !== main.sizeProfile) {
      if (product.sizeProfile === "large") return "größer & präsenter";
      if (product.sizeProfile === "compact") return "kompakter & beweglicher";
    }
    if (product.weightClass !== main.weightClass) {
      if (product.weightClass === "heavy") return "schwerer & standfester";
      if (product.weightClass === "light") return "leichter zu bewegen";
    }
    if (product.material !== main.material) return "ähnlicher Einsatz, andere Holzart";
    return "ähnlicher Einsatz, andere Ausführung";
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
    if (!product || product.visibility === "hidden" || product.visibility === "archive") {
      return false;
    }
    if (product.visibility === "inspiration" && product.inspirationOnly === true && availabilityStatus(product) === "sold") {
      return true;
    }
    if (product.active !== true) {
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
