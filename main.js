// Translate display copy only; catalog values stay unchanged for matching and analytics.
var EdleProductCopy = (function () {
  var names = {
    "Kleines Stirnholzbrett – Verschiedene Holzdesigns": "Small end-grain board – Choice of wood designs",
    "Erbstück – Historische Eiche mit Halter & Pflegebalsam": "Erbstück – Historic oak with stand & care balm",
    "Buttermesser – Nussbaum oder Zwetschge": "Butter knife – Walnut or plum wood",
    "Teigschaber aus Massivholz": "Solid wood dough scraper",
    "Buche Stirnholz – Jahresring-Struktur": "Beech end grain – Growth-ring pattern",
    "Bambus & Buche – Frühstücksbrett": "Bamboo & beech – Breakfast board",
    "Eiche Stirnholz – XXL mit Saftrille": "Oak end grain – XXL with juice groove",
    "Lärche Stirnholz – Kompakt": "Larch end grain – Compact",
    "Mahagoni Stirnholz – Ruhiger Block": "Mahogany end grain – Understated block",
    "Bretthalter – Eiche, Nussbaum oder Buche": "Board stand – Oak, walnut or beech",
    "Untersetzer-Set – Holz mit Halter": "Wooden coaster set with stand",
    "Wenge Nussbaum Eiche – Kariert": "Wenge, walnut & oak – Chequered",
    "XXL Stirnholz – Nach Maß": "XXL end grain – Made to measure",
    "XXL Streifenbrett – Thermobambus & Birke": "XXL striped board – Thermally treated bamboo & birch",
    "Stirnholz mit Griffen – Drei Holzarten": "End grain with handles – Three wood species",
    "Pflegebalsam – Leinöl & Bienenwachs": "Wood care balm – Linseed oil & beeswax",
    "Kambala Schneidebrett – Kompakt": "Kambala cutting board – Compact",
    "Pfannenwender – Massivholz-Mix": "Wooden spatula – Choice of wood species",
    "Servierbrett-Set – Dreiteilig": "Serving board set – Three pieces",
    "Nussbaum Langholz – Flankenoptik": "Walnut edge grain – Natural grain pattern",
    "3D Stirnholz – Nussbaum & weitere": "3D end grain – Walnut & other woods",
    "Eiche Servierbrett – Doppelgriff": "Oak serving board – Double handle",
    "Servierbrett-Set – Schwertform": "Serving board set – Sword shape",
    "Padouk & Eiche – Kompakt kariert": "Padauk & oak – Compact chequered board",
    "Padouk & Eiche – Großformat kariert": "Padauk & oak – Large chequered board",
    "Eiche Stirnholz – Massiver Hackblock": "Oak end grain – Solid chopping block",
    "Buche & Mooreiche – Servierbrett": "Beech & bog oak – Serving board",
    "Eiche & Kambala – Quadrat": "Oak & Kambala – Square board",
    "Esche Stirnholz – BBQ Hackblock": "Ash end grain – BBQ chopping block",
    "Tropenholz Stirnholz – Mit Griffen": "Tropical hardwood end grain – With handles",
    "Nussbaum & Ahorn – Streifenbrett": "Walnut & maple – Striped board",
    "Stockbuche Stirnholz – Schachbrett": "Spalted beech end grain – Chequered board",
    "Buche & Kambala – Schachbrett": "Beech & Kambala – Chequered board",
    "Nussbaum Stirnholz – Mit Saftrille": "Walnut end grain – With juice groove",
    "3D Stirnholz – Eiche & weitere": "3D end grain – Oak & other woods",
    "Stockbuche Stirnholz – Naturmaserung": "Spalted beech end grain – Natural grain",
    "Buche Stirnholz – Mit Saftrille": "Beech end grain – With juice groove",
    "Eiche Langholz – Schweizer Kante": "Oak edge grain – Swiss bevel",
    "Eiche & Wenge – Schachbrett": "Oak & wenge – Chequered board",
    "Eiche & Buche – Kompakt mit Astloch": "Oak & beech – Compact board with knot hole",
    "Walnuss & Eiche – Rahmenbrett": "Walnut & oak – Framed board",
    "Eiche Stirnholz – Schmales Design": "Oak end grain – Slim design",
    "Eiche Esche Buche – Mit Saftrille": "Oak, ash & beech – With juice groove",
    "Buche Massiv – Mit Griffmulden": "Solid beech – With recessed grips",
    "Eiche Massiv – Astloch & Kante": "Solid oak – Knot hole & edge options",
    "Teigschaber-Set – 2er oder 3er": "Dough scraper set – Two or three pieces",
    "Erbstück No. 004 – Eiche & Buche": "Erbstück No. 004 – Oak & beech"
  };
  var phrases = {
    "Stockbuche in Stirnholzbauweise mit Nussbaumrahmen, ca. 41 × 30 × 4,7 cm und ca. 4 kg.": "Spalted beech end grain with a walnut frame, approx. 41 × 30 × 4.7 cm and approx. 4 kg.",
    "Pflegebalsam mit Bienenwachs und Leinölfirnis für Schneidebretter und Küchenholz.": "Care balm with beeswax and linseed oil varnish for cutting boards and wooden kitchenware.",
    "Kompaktes Stirnholzbrett in fünf Holzdesigns, ca. 2 cm stark. Maße je nach Ausführung; Gravur optional auf Anfrage.": "Compact end-grain board in five wood designs, approx. 2 cm thick. Dimensions vary by design; optional engraving by arrangement.",
    "Kompakt, Maße je nach Ausführung": "Compact; dimensions vary by design",
    "Historische Eiche mit Buche-Akzenten, ca. 41,5 × 39,8 × 5 cm und ca. 5,8 kg. Halter und Pflegebalsam inklusive; ohne Saftrille ab 284,99 EUR, mit Saftrille 299,99 EUR.": "Historic oak with beech accents, approx. 41.5 × 39.8 × 5 cm and 5.8 kg. Stand and care balm included; from EUR 284.99 without a juice groove, EUR 299.99 with a juice groove.",
    "Nussbaum oder Zwetschge, ca. 17 cm lang und ca. 8 mm stark.": "Walnut or plum wood, approx. 17 cm long and 8 mm thick.",
    "Massiver Teigschaber aus Eiche, Nussbaum, Buche, Esche und weiteren Hölzern, ca. 9 x 13 cm.": "Solid wood dough scraper in oak, walnut, beech, ash and other woods, approx. 9 x 13 cm.",
    "Massiver Bretthalter aus Eiche, Nussbaum oder Buche, passgenau für Bretter bis 5 cm Stärke.": "Solid wood stand in oak, walnut or beech, fitted for boards up to 5 cm thick.",
    "Drei Holzarten mit eigenen Maßen und Preisen. Ab 254,99 EUR für Buche ohne Saftrille; Tropenholz ab 274,99 EUR und Eiche ab 284,99 EUR.": "Three wood species with individual dimensions and prices. From EUR 254.99 for beech without a juice groove; tropical hardwood from EUR 274.99 and oak from EUR 284.99.",
    "Dreiteiliges Servierbrett-Set mit Halter: 44 × 21,5 cm, 39 × 18 cm und 34 × 14 cm.": "Three-piece serving board set with stand: 44 × 21.5 cm, 39 × 18 cm and 34 × 14 cm.",
    "Servierbretter in Schwertform aus Eiche, Esche oder Nussbaum; je nach Variante ca. 40–66 cm lang.": "Sword-shaped serving boards in oak, ash or walnut; approx. 40–66 cm long, depending on the version.",
    "Massives Eiche-Stirnholzbrett, ca. 41,5 × 39,8 × 5 cm und rund 5,8 kg, mit großzügigen Griffmulden.": "Solid oak end-grain board, approx. 41.5 × 39.8 × 5 cm and 5.8 kg, with generous recessed grips.",
    "Kompaktes Servierbrett aus Buche und Mooreiche, 33 × 17 × 2,3 cm.": "Compact serving board in beech and bog oak, 33 × 17 × 2.3 cm.",
    "Stockbuche in Stirnholz-Bauweise mit Schachbrettmuster, 53 × 36 × 4 cm.": "Spalted beech end-grain board with a chequered pattern, 53 × 36 × 4 cm.",
    "Massive Buche in Flankenholz-Bauweise mit Griffmulden, 37,8 × 25,1 × 3,2 cm.": "Solid beech edge-grain board with recessed grips, 37.8 × 25.1 × 3.2 cm.",
    "Massive Eiche mit Astloch; gerade Kante 34 × 20,5 × 3,6 cm oder Schweizer Kante 38 × 20,5 × 3,3 cm.": "Solid oak with a knot hole; straight edge 34 × 20.5 × 3.6 cm or Swiss bevel 38 × 20.5 × 3.3 cm.",
    "Set aus zwei oder drei handgemachten Teigschabern aus Massivholz für Backen, Sauerteig und Küche.": "Set of two or three handmade solid wood dough scrapers for baking, sourdough and kitchen use.",
    "Historische Eiche in Stirnholz-Bauweise mit Buche-Inlay, ca. 40 × 40 × 4,5 cm und ca. 4,5 kg.": "Historic oak end-grain board with a beech inlay, approx. 40 × 40 × 4.5 cm and 4.5 kg.",
    "Historische Eiche in Stirnholz-Bauweise mit Buche-Inlay. Passender Halter, Pflegebalsam und Pflegeanleitung inklusive. Maße und Gewicht findest du im aktuellen Angebot.": "Historic oak end-grain board with a beech inlay. Matching stand, care balm and care instructions included. See the current listing for dimensions and weight.",
    "Stirnholz aus Eiche und Buche mit Astloch, 31,1 × 30,1 × 3,8 cm, ca. 2,44 kg.": "Oak and beech end-grain board with a knot hole, 31.1 × 30.1 × 3.8 cm, approx. 2.44 kg.",
    "3D-Stirnholz aus Nussbaum, Eiche, Buche, Esche und Kambala, 48,5 × 35,3 × 4 cm.": "3D end-grain board in walnut, oak, beech, ash and Kambala, 48.5 × 35.3 × 4 cm.",
    "3D-Stirnholz aus Eiche, Buche, Esche, Kambala und Wenge, 46 × 46 × 5 cm.": "3D end-grain board in oak, beech, ash, Kambala and wenge, 46 × 46 × 5 cm.",
    "Stirnholz aus Tropenholz, 44,2 × 36 × 5 cm, ca. 4,1 kg.": "Tropical hardwood end-grain board, 44.2 × 36 × 5 cm, approx. 4.1 kg."
  };
  var terms = {
    "Saftrille": "Juice groove",
    "Wird auf Bestellung gefertigt.": "Made to order.",
    "Schweizer Kante möglich": "Swiss bevel available",
    "bis 5 cm Brettstärke": "For boards up to 5 cm thick",
    "2 Kantenvarianten": "2 edge options",
    "2er / 3er Set": "Set of 2 or 3",
    "Geschenk für Bäcker": "Gift for bakers",
    "je nach Holzart": "depending on wood species",
    "Stirnholz-Bauweise": "end-grain construction",
    "Stirnholz-Aufbau": "end-grain construction",
    "mit Griffmulden": "With recessed grips",
    "nicht angegeben": "Not specified",
    "und weiteren Hölzern": "and other woods",
    "und weitere": "and other woods",
    "weitere": "other woods",
    "Leinölfirnis": "Linseed oil varnish",
    "Bienenwachs": "Beeswax",
    "Thermobambus": "Thermally treated bamboo",
    "Stockbuche": "Spalted beech",
    "Mooreiche": "Bog oak", "Mohreiche": "Bog oak",
    "Stirnholz": "End grain", "Langholz": "Edge grain", "Flankenholz": "Edge grain", "Längsholz": "Edge grain",
    "Servierbrett-Set": "Serving board set", "Servierbrett": "Serving board",
    "Schneidebrett": "Cutting board", "Pflegeprodukt": "Care product",
    "Zubehoer": "Accessories", "Zubehör": "Accessories", "Pflege": "Care",
    "personalisierbar": "Personalisable", "Massivholz": "Solid wood", "massiv": "Solid",
    "Nussbaum": "Walnut", "Walnuss": "Walnut", "Zwetschge": "Plum wood",
    "Eiche": "Oak", "Buche": "Beech", "Esche": "Ash", "Ahorn": "Maple",
    "Laerche": "Larch", "Lärche": "Larch", "Mahagoni": "Mahogany", "Birke": "Birch",
    "Bambus": "Bamboo", "Kastanie": "Chestnut", "Tropenholz": "Tropical hardwood", "Padouk": "Padauk",
    "Leinöl": "Linseed oil", "Metall": "Metal", "Länge": "long",
    "ca.": "approx.", "aus": "in", "oder": "or", "und": "and", "ab": "from"
  };
  var escapedTerms = Object.keys(terms).sort(function (a, b) { return b.length - a.length; }).map(function (key) {
    return key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  });
  var pattern = new RegExp("(^|[^\\p{L}])(" + escapedTerms.join("|") + ")(?=$|[^\\p{L}])", "gu");
  function text(value, english) {
    var source = String(value == null ? "" : value);
    if (!english) return source;
    if (Object.prototype.hasOwnProperty.call(names, source)) return names[source];
    if (Object.prototype.hasOwnProperty.call(phrases, source)) return phrases[source];
    return source.replace(pattern, function (_, prefix, term) { return prefix + terms[term]; })
      .replace(/(\d),(\d)/g, "$1.$2");
  }
  return { text: text };
}());

function productPackageItems(product, rules, selection) {
  rules = rules || {};
  selection = selection || {};
  var items = (product.packageContents || []).map(function (item) { return Object.assign({}, item); });
  function add(id, label, labelEn) {
    if (!items.some(function (item) { return item.id === id; })) items.push({id:id, label:label, labelEn:labelEn});
  }
  if (!items.length) {
    if (product.category === 'care') add('product', '1 Dose Pflegebalsam', '1 tin of care balm');
    else if (String(product.listingId) === '1874454440') add('product', '1 Bretthalter in der gewählten Holzart', '1 board stand in your chosen wood');
    else if (product.productType === 'servingBoard') add('product', '1 Servierbrett in der gewählten Ausführung', '1 serving board in your chosen version');
    else if (product.category === 'board') add('product', '1 Schneidebrett in der gewählten Ausführung', '1 cutting board in your chosen version');
    else add('product', product.displayName || product.name, EdleProductCopy.text(product.displayName || product.name, true));
  }
  if (product.category === 'board') add('careGuide', 'Pflegeanleitung', 'Care instructions');
  var value = Number(selection.goodsValue == null ? (product.variants && product.variants[0] ? product.variants[0].priceOrder : product.priceOrder) : selection.goodsValue);
  var availableBoard = product.category === 'board' && product.active !== false && ['available', 'made_to_order'].includes(product.availabilityStatus);
  var balm = product.includesCareBalm || selection.careBalm || (availableBoard && value >= Number(rules.careBalmMinimumGoodsValue || 150));
  var thickness = String(product.thicknessLabel || '').replace(/,/g, '.').match(/\d+(?:\.\d+)?/g);
  var thickEnough = thickness && Math.min.apply(Math, thickness.map(Number)) >= Number(rules.holderMinimumBoardThicknessCm || 4);
  if (product.includesMatchingHolder || (availableBoard && value >= Number(rules.holderMinimumGoodsValue || 350) && thickEnough)) add('holder', 'Passender Bretthalter', 'Matching board stand');
  if (balm) add('careBalm', 'Pflegebalsam', 'Care balm');
  var order = ['product', 'holder', 'careBalm', 'careCloth', 'careGuide', 'card'];
  return items.sort(function (a, b) {
    return (order.includes(a.id) ? order.indexOf(a.id) : 99) - (order.includes(b.id) ? order.indexOf(b.id) : 99);
  });
}

document.documentElement.classList.add("js");
if (!document.querySelector('[data-photo-viewer-loader]')) {
  var photoStyle = document.createElement("link");
  photoStyle.rel = "stylesheet";
  photoStyle.href = "/assets/css/product-photo-viewer.css?v=20261018-detail-only";
  document.head.appendChild(photoStyle);
  var photoScript = document.createElement("script");
  photoScript.src = "/assets/js/product-photo-viewer.js?v=20261018-detail-only";
  photoScript.setAttribute("data-photo-viewer-loader", "");
  document.head.appendChild(photoScript);
}
function orderProductMedia(items, primarySrc) {
  var images = items.filter(function (item) { return item.type === 'image'; });
  var primary = images.find(function (item) { return item.src === primarySrc; }) || images[0];
  var videos = items.filter(function (item) { return item.type === 'video'; });
  return (primary ? [primary] : []).concat(videos, images.filter(function (item) { return item !== primary; }));
}

function buildCardGalleryItems(product) {
  var images = [product.image].concat(product.gallery || []).filter(Boolean).map(function (src) {
    return src.replace(/^(https:\/\/i\.etsystatic\.com\/.+\/)il_fullxfull\./, "$1il_794xN.");
  }).filter(function (src, index, all) { return all.indexOf(src) === index; }).slice(0, 5);
  var videos = (product.videos || []).filter(function (item) { return item && item.src && item.poster; }).slice(0, 3);
  var items = images.map(function (src) { return { type: "image", src: src }; });
  items.splice.apply(items, [1, 0].concat(videos.map(function (item) { return { type: "video", src: item.src, poster: item.poster, alt: item.alt }; })));
  return items;
}
if (!document.querySelector('[data-product-hover-loader]')) {
  var hoverScript = document.createElement("script");
  hoverScript.src = "/assets/js/product-hover-video.js?v=20261022-product-copy-en";
  hoverScript.setAttribute("data-product-hover-loader", "");
  document.head.appendChild(hoverScript);
}
if (!document.querySelector('[data-site-search-loader]')) {
  var searchStyle=document.createElement('link');searchStyle.rel='stylesheet';searchStyle.href='/assets/css/site-search.css';document.head.appendChild(searchStyle);
  var searchScript=document.createElement('script');searchScript.src='/assets/js/site-search.js?v=20261026-product-pages';searchScript.setAttribute('data-site-search-loader','');document.head.appendChild(searchScript);
}
if (!document.querySelector('[data-kitchen-preview-loader]')) {
  var roomStyle=document.createElement('link');roomStyle.rel='stylesheet';roomStyle.href='/assets/css/room-discovery.css';document.head.appendChild(roomStyle);
  var roomScript=document.createElement('script');roomScript.src='/assets/js/room-discovery.js';roomScript.defer=true;document.head.appendChild(roomScript);
  var kitchenStyle=document.createElement('link');kitchenStyle.rel='stylesheet';kitchenStyle.href='/assets/css/kitchen-preview-entry.css?v=20260923-picker';document.head.appendChild(kitchenStyle);
  var kitchenScript=document.createElement('script');kitchenScript.src='/assets/js/kitchen-preview-entry.js?v=20260923-picker';kitchenScript.defer=true;kitchenScript.setAttribute('data-kitchen-preview-loader','');document.head.appendChild(kitchenScript);
}

var EDLE_HOELZER_PRODUCTS_URL = "/products.json?v=20261026-product-decision-r3";

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
      if (!window.edleFinderStarted) {
        window.edleFinderStarted = true;
        track("product_finder_start", payload);
      }
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

  if (!main || main.querySelector('[data-product-page]') || main.classList.contains("homepageRefined") || excludedPaths.indexOf(path) !== -1 || document.querySelector("[data-preferred-source-cta]")) {
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
    "/schneidebrett-mit-gravur/": { label: "Gravierbares Brett ansehen", href: "#products-gravur", secondary: "B2B-Gravur anfragen", secondaryHref: "/handgefertigte-holzprodukte-fuer-unternehmen/", event: null },
    "/schneidebrett-fachwerk-eiche/": { label: "Erbstück anfragen", href: "mailto:info@edlehoelzer.de?subject=Anfrage%20Erbst%C3%BCck", secondary: "Verfügbare Stücke ansehen", secondaryHref: "#verfuegbare-hoelzer", event: "email-kontakt" },
    "/barbecue-geschenk/": { label: "BBQ-Brett ansehen", href: "#products-bbq", secondary: "Gravur anfragen", secondaryHref: "/schneidebrett-mit-gravur/", event: null },
    "/hochwertige-geschenke-holz/": { label: "Geschenk finden", href: "#products-geschenke", secondary: "Gravur ansehen", secondaryHref: "/schneidebrett-mit-gravur/", event: null },
    "/pflege.html": { label: "Pflegebalsam kaufen", href: "https://www.etsy.com/de/listing/1881802291/holzpflege-set-fur-schneidebretter", secondary: "Aufbereitung prüfen", secondaryHref: "/schneidebrett-aufbereiten/", event: "care_selfservice_click", external: true },
    "/welches-oel-schneidebrett/": { label: "Pflegebalsam kaufen", href: "https://www.etsy.com/de/listing/1881802291/holzpflege-set-fur-schneidebretter", secondary: "Foto einschätzen lassen", secondaryHref: "mailto:info@edlehoelzer.de?subject=Fotoeinsch%C3%A4tzung%20Schneidebrett", event: "care_selfservice_click", external: true },
    "/schneidebrett-aufbereiten/": { label: "Fotos einschätzen lassen", href: "mailto:info@edlehoelzer.de?subject=Fotoeinsch%C3%A4tzung%20Schneidebrett", secondary: "Kosten ansehen", secondaryHref: "#aufbereitungsservice", event: "refurbishment_inquiry_start" }
  };

  if (!isGerman || document.querySelector(".homepageRefined") || !ctas[current] || !window.matchMedia("(max-width: 768px)").matches) {
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

    if (desktopQuery.matches && video.getAttribute("data-autoplay") !== "manual") {
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
    var selection = root.getAttribute("data-review-selection");
    if (selection) {
      var selectedIds = selection.split(",");
      reviews = reviews.filter(function (review) { return selectedIds.indexOf(review.id) !== -1; });
    }
    if (root.hasAttribute("data-review-compact")) {
      if (meta.ratingAverage && !meta.needsReview) {
        headline.textContent = meta.ratingAverage.toLocaleString(config.locale, { minimumFractionDigits: 1 }) + " Sterne auf " + meta.source;
      }
      subline.textContent = meta.ratingCount + " Bewertungen · " + meta.transactionSoldCount + " Verkäufe über Etsy · In 14 Länder geliefert.";
    }
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
    if (root.hasAttribute("data-review-compact")) return;
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
  var productPage = document.querySelector('[data-product-page]');
  function previewRoot() { return activeOverlay || productPage; }
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
      if (previewTrigger.tagName === 'A' && (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)) return;
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
    if (!previewRoot() || !event.target.closest(".productPreview__mainMedia") || event.touches.length !== 1) {
      previewSwipeStart = null;
      return;
    }

    previewSwipeStart = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    };
  }, { passive: true });

  document.addEventListener("touchend", function (event) {
    if (!previewSwipeStart || !previewRoot() || event.changedTouches.length !== 1) {
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
    var variantInput = event.target.closest("[data-purchase-variant]");
    if (variantInput) {
      var variantProduct = productMap[variantInput.getAttribute("data-product-id")];
      if (!variantProduct || !(variantProduct.variants || []).some(function (variant) { return variant.id === variantInput.value; })) return;
      purchaseSelections[variantProduct.id] = purchaseSelections[variantProduct.id] || {};
      purchaseSelections[variantProduct.id].woodVariant = variantInput.value;
      if (productPage) {
        var variantUrl = new URL(location.href);
        variantUrl.searchParams.set('variante', variantInput.value);
        history.replaceState(null, '', variantUrl);
      }
      updatePreviewPurchaseSummary(variantProduct);
      var selectedVariant = purchaseVariant(variantProduct);
      if (selectedVariant.image && previewRoot()) {
        var matchingThumb = Array.from(previewRoot().querySelectorAll('[data-preview-media]')).find(function (thumb) {
          return thumb.getAttribute('data-preview-src') === selectedVariant.image;
        });
        if (matchingThumb) switchPreviewMedia(matchingThumb);
      }
      return;
    }
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
    if (!activeDialog || document.querySelector('.kitchenPreviewDialog[open], .productPhotoViewer[open]')) {
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

  // Keep native links usable (new tabs, keyboard and no-JS static pages).
  function productUrl(product) {
    var canonical = productMap[product.canonicalProductId] || product;
    return (isEnglish ? '/en' : '') + canonical.productPath + (product.canonicalVariantId ? '?variante=' + encodeURIComponent(product.canonicalVariantId) : '');
  }
  function linkProducts(root) {
    root.querySelectorAll('[data-product-preview]').forEach(function (button) {
      var product = productMap[button.getAttribute('data-product-preview')];
      if (!product || !product.productPath) return;
      if (button.tagName === 'A') { button.href = productUrl(product); return; }
      var link = document.createElement('a');
      Array.from(button.attributes).forEach(function (attribute) {
        if (attribute.name !== 'type') link.setAttribute(attribute.name, attribute.value);
      });
      link.href = productUrl(product);
      while (button.firstChild) link.appendChild(button.firstChild);
      button.replaceWith(link);
    });
  }
  loadProducts().then(function () {
    linkProducts(document);
    new MutationObserver(function (changes) {
      if (changes.some(function (change) { return change.addedNodes.length; })) linkProducts(document);
    }).observe(document.body, {childList:true, subtree:true});
    if (!productPage) return;
    var product = productMap[productPage.dataset.productPage];
    if (!product) return;
    var variantId = new URLSearchParams(location.search).get('variante');
    if ((product.variants || []).some(function (v) { return v.id === variantId; })) purchaseSelections[product.id] = {woodVariant:variantId};
    productPage.innerHTML = renderProductPreview(product, 'product-page', '');
    var section = productPage.querySelector('.productPreview');
    section.removeAttribute('role'); section.removeAttribute('aria-modal');
    section.querySelectorAll('[data-product-experience-close]').forEach(function (element) { element.remove(); });
    var heading = section.querySelector('#product-preview-title');
    var h1 = document.createElement('h1'); h1.id = heading.id;
    h1.textContent = isEnglish ? displayProductName(product) : product.name;
    heading.replaceWith(h1);
    if (availabilityStatus(product) === 'sold') {
      var sold = document.createElement('p'); sold.className = 'productCard__availability';
      sold.textContent = isEnglish ? 'Sold · One-of-a-kind inspiration' : 'Verkauft · Ein Unikat als Inspiration';
      h1.after(sold);
    }
    updatePreviewPurchaseSummary(product);
    linkProducts(productPage);
  }).catch(function (error) { console.warn('[Edle Hölzer] Product page:', error); });

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
          compareIds = compareIds.map(function (id) { return productMap[id] && productMap[id].canonicalProductId || id; }).filter(function (id, index, ids) {
            if (ids.indexOf(id) !== index) return false;
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

      if (product.productPath) {
        window.location.assign(productUrl(product));
        return;
      }

      previousFocus = trigger || document.activeElement;
      if (trigger && trigger.matches('.productCard__cta, .productCard .btn--emphasis')) {
        track("product_card_cta_click", product, { source: source });
      }
      renderOverlay(renderProductPreview(product, source, reason), "product-preview", source);
      if (activeOverlay) {
        activeOverlay.setAttribute("data-current-product-id", product.id);
        activeOverlay.setAttribute("data-current-product-source", source || "preview");
        activeOverlay.setAttribute("data-current-product-reason", reason || "");
        updatePreviewPurchaseSummary(product);
        var mainMedia = activeOverlay.querySelector(".productPreview__mainMedia");
        startDesktopPreviewVideo(mainMedia);
        if (mainMedia && mainMedia.querySelector("video[autoplay]")) {
          track("product_video_view", product, { source: source || "preview", playback: "desktop_autoplay" });
        }
      }
      track("product_preview_open", product, { source: source, entry_point: trigger && trigger.matches('.productCard__cta, .productCard .btn--emphasis') ? "card_cta" : "product_image_or_other" });
    }).catch(function (error) {
      console.warn("[Edle Hölzer] Produktvorschau konnte nicht geöffnet werden:", error);
    });
  }

  function renderProductPreview(product, source, reason) {
    var media = productMedia(product);
    var variant = purchaseVariant(product);
    if (variant && variant.image) {
      media = orderProductMedia(media, variant.image);
    }
    var main = media[0];
    var title = displayProductName(product);
    var facts = productFacts(product);
    var related = relatedProducts(product);
    var hasEtsy = hasVerifiedListing(product);

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
        '<p class="productPreview__eyebrow">' + escapeHtml(EdleProductCopy.text(product.segment || product.category || "Edle Hölzer", isEnglish)) + '</p>' +
        '<h2 id="product-preview-title">' + escapeHtml(title) + '</h2>' +
        renderPurchaseHeadline(product) +
        (facts.length ? '<section class="productPreview__section"><h3>' + escapeHtml(labels.keyFacts) + '</h3><dl class="productPreview__facts">' + facts.map(function (fact) {
          return '<div><dt>' + escapeHtml(fact[0]) + '</dt><dd>' + escapeHtml(fact[1]) + '</dd></div>';
        }).join("") + '</dl></section>' : "") +
        renderPurchaseConfigurator(product) +
        '<section class="productPreview__package"><h3>' + (isEnglish ? 'Included with your selection' : 'Das ist dabei') + '</h3><ul data-product-package>' + renderPackageItems(product) + '</ul><p>' + escapeHtml(isEnglish ? 'Other products and decorative items shown in photos are not included.' : 'Weitere abgebildete Produkte und Dekoration sind nicht enthalten.') + '</p></section>' +
        renderEarlyPurchaseAction(product) +
        (!hasEtsy ? '<p class="productCard__availability">' + escapeHtml(isEnglish ? (product.availabilityNoteEn || labels.unavailableText) : (product.availabilityNote || labels.unavailableText)) + '</p><a class="btn btn--emphasis" href="' + (isEnglish ? '/en/custom-cutting-board/' : '/schneidebrett-nach-mass/') + '">' + escapeHtml(labels.askSimilar) + '</a>' : '') +
        (product.category === 'board' && product.active !== false && String(product.listingId) !== '4440690649' && Number(product.priceOrder) > 100 ? '<div class="productPreview__roomPrompt" data-enhanced="true"><p>' + (isEnglish ? 'See this board in your own kitchen before deciding.' : 'Sieh dir dieses Brett vor dem Kauf in deiner Küche an.') + '</p><button type="button" class="btn btn--secondary" data-kitchen-preview="' + escapeAttribute(product.listingId || '') + '">' + (isEnglish ? 'View on my worktop' : 'Auf meinem Tresen ansehen') + '</button></div>' : '') +
        '<div class="productPreview__actions">' + renderProductWhatsappPrompt(product, hasEtsy) + renderPreviewCompareControls(product, source || 'preview') + '</div>' +
        (reason ? '<div class="productPreview__reason"><strong>' + escapeHtml(labels.finderReason) + '</strong><p>' + escapeHtml(reason) + '</p></div>' : '') +
        '<details class="productPreview__detail"><summary>' + (isEnglish ? 'Material & craft' : 'Material & Handwerk') + '</summary><p class="productPreview__proof">' + escapeHtml(productProof(product)) + '</p><p>' + escapeHtml(product.category === 'board' ? labels.boardExperiencePromise : productExperienceText(product)) + '</p>' + (hasEngravingControl(product) ? '<p>' + escapeHtml(labels.engravingExperiencePromise) + '</p>' : '') + '</details>' +
        '<details class="productPreview__detail"><summary>' + escapeHtml(labels.care) + '</summary><p>' + escapeHtml(careNote(product)) + '</p></details>' +
        (related.length ? '<section class="productPreview__section productPreview__related"><h3>' + escapeHtml(related.some(function (item) { return item.category === "accessory"; }) ? (isEnglish ? "Complete the wood family" : "Passend kombinieren") : labels.related) + '</h3><div class="productPreview__relatedGrid">' + related.map(function (relatedProduct) {
          return '<article><img src="' + escapeAttribute(primaryImage(relatedProduct)) + '" alt="' + escapeAttribute(productImageAlt(relatedProduct)) + '" loading="lazy" decoding="async"><strong>' + escapeHtml(displayProductName(relatedProduct)) + '</strong><div class="productPreview__relatedActions"><button type="button" data-product-preview="' + escapeAttribute(relatedProduct.id) + '" data-product-source="related">' + escapeHtml(isEnglish ? "View" : "Ansehen") + '</button><button type="button" data-product-compare="' + escapeAttribute(relatedProduct.id) + '" data-product-source="related">' + escapeHtml(isEnglish ? "Compare" : "Vergleich") + '</button></div></article>';
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
      [bothBoards ? labels.thickness : "", bothBoards && !a.dimensionsReviewRequired ? meaningful(a.thicknessLabel) : "", bothBoards && !b.dimensionsReviewRequired ? meaningful(b.thicknessLabel) : ""],
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
      } else if (button.classList.contains("productCard__compareUtility")) {
        button.textContent = isEnglish ? (isActive ? "✓ In comparison" : "+ Compare") : (isActive ? "✓ Im Vergleich" : "+ Zum Vergleich");
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
    var main = previewRoot() && previewRoot().querySelector(".productPreview__mainMedia");
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
    previewRoot().querySelectorAll("[data-preview-media]").forEach(function (item) {
      item.classList.toggle("is-active", item === button);
    });
    button.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }

  function switchPreviewByOffset(offset) {
    if (!previewRoot()) {
      return;
    }

    var buttons = Array.prototype.slice.call(previewRoot().querySelectorAll("[data-preview-media]"));
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
      return orderProductMedia(product.media.filter(function (item) {
        return item && item.src && (item.type === "image" || item.type === "video");
      }).map(function (item) {
        return {
          type: item.type || "image",
          src: item.src,
          poster: item.poster || item.src,
          alt: isEnglish ? productImageAlt(product) : (item.alt || productImageAlt(product))
        };
      }), product.image);
    }

    var urls = [];
    if (Array.isArray(product.gallery)) {
      urls = product.gallery.filter(Boolean);
    }
    if (product.image && urls.indexOf(product.image) === -1) {
      urls.unshift(product.image);
    }
    (product.variants || []).forEach(function (variant) {
      if (variant.image && urls.indexOf(variant.image) === -1) urls.push(variant.image);
    });
    var images = urls.map(function (url) {
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
        alt: isEnglish ? "Product video: " + displayProductName(product) : (item.alt || productImageAlt(product))
      };
    }) : [];

    return orderProductMedia(images.concat(videos), product.image);
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

    return '<button type="button" class="productPreview__photoButton" data-photo-viewer aria-label="' + escapeAttribute(isEnglish ? "Enlarge product photo" : "Produktfoto vergrößern") + '"><img data-preview-main src="' + escapeAttribute(item.src) + '" alt="' + escapeAttribute(item.alt) + '" decoding="async"><span class="productPhotoExpand"><img src="/assets/icons/lucide/maximize.svg" alt="" aria-hidden="true"></span></button>';
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
      var productId = previewRoot() && previewRoot().getAttribute("data-current-product-id");
      track("product_video_view", productMap[productId], {
        source: (previewRoot() && previewRoot().getAttribute("data-current-product-source")) || "preview",
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
    var thumbnail = poster.replace('/il_fullxfull.', '/il_794xN.');
    return '<button class="productPreview__thumb' + (index === 0 ? " is-active" : "") + '" type="button" data-preview-media="' + index + '" data-preview-type="' + escapeAttribute(item.type || "image") + '" data-preview-src="' + escapeAttribute(item.src) + '" data-preview-poster="' + escapeAttribute(poster) + '" data-preview-alt="' + escapeAttribute(item.alt) + '"><img src="' + escapeAttribute(thumbnail) + '" alt="" loading="lazy" decoding="async">' + (item.type === "video" ? '<span class="productPreview__videoBadge">Video</span>' : "") + '</button>';
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
    var variant = purchaseVariant(product);
    var woodVariant = variant && ['4417507555', '4599650982'].includes(String(product.listingId));
    pushFact(facts, labels.wood, woodVariant ? (isEnglish ? variant.nameEn : variant.name) : product.material);
    pushFact(facts, labels.construction, constructionLabel(product));
    pushFact(facts, labels.dimensions, variant && variant.dimensions ? variant.dimensions : dimensionLabel(product));
    pushFact(facts, labels.thickness, displayThicknessLabel(product));
    if (!variant || !variant.dimensions) pushFact(facts, labels.weight, exactWeightLabel(product));
    if (product.category === "board") {
      pushFact(facts, labels.juiceGroove, String(product.listingId) === '4598989614' && variant ? (variant.id === 'groove' ? labels.included : booleanLabel(false)) : juiceGrooveFactLabel(product));
    }
    pushFact(facts, labels.engraving, engravingLabel(product));
    return facts.slice(0, 9);
  }

  function pushFact(facts, label, value) {
    if (value) {
      facts.push([label, EdleProductCopy.text(value, isEnglish)]);
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
    if (product.dimensionsReviewRequired) return "";
    var value = meaningful(product.thicknessLabel);
    if (!value) {
      return "";
    }
    return EdleProductCopy.text(String(value).replace(/ca\.\s*0,8\s*cm/i, "ca. 8 mm"), isEnglish);
  }

  function productMoment(product) {
    var text = [product.name, product.displayName, product.segment, product.shortDescription].join(" ").toLowerCase();
    if (product.category === "care") {
      return isEnglish ? "Wood care with beeswax and linseed oil varnish." : "Holzpflege mit Bienenwachs und Leinölfirnis.";
    }
    if (String(product.listingId) === '1838851839') {
      return isEnglish ? "Wooden coasters with a matching holder." : "Holzuntersetzer mit passendem Halter.";
    }
    if (String(product.listingId) === '1874454440') {
      return isEnglish ? "A dedicated place for your cutting board." : "Ein fester Platz für dein Schneidebrett.";
    }
    if (/buttermesser|butter\s*knife/.test(text)) {
      return isEnglish ? "A solid wood butter knife for breakfast and bread boards." : "Ein Buttermesser aus Massivholz für Frühstück und Brotzeit.";
    }
    if (/pfannenwender|spatula|turner/.test(text)) {
      return isEnglish ? "A handmade solid wood spatula." : "Ein handgefertigter Pfannenwender aus Massivholz.";
    }
    if (/teigschaber|dough|scraper/.test(text)) {
      return isEnglish ? "Solid wood dough scrapers for baking." : "Teigschaber aus Massivholz zum Backen.";
    }
    if (/erbst/.test(text)) {
      return isEnglish ? "Historic oak and beech, handcrafted into a one-of-a-kind board." : "Historische Eiche und Buche, von Hand zum Einzelstück gefertigt.";
    }
    if (product.listingId === "4599650982") {
      return isEnglish ? "For small prep jobs, breakfast and a cheese selection for one." : "Für kleine Schneidarbeiten, Frühstück und eine Käseauswahl für eine Person.";
    }
    if (product.productType === 'servingBoard') {
      return isEnglish ? "For breakfast, cheese and serving at the table." : "Für Brotzeit, Käse und das Anrichten am Tisch.";
    }
    if (product.category === 'board' && isEndGrain(product)) {
      return isEnglish ? "End grain with cross-cut wood fibres." : "Stirnholz mit quer angeschnittenen Holzfasern.";
    }
    if (product.category === 'board' && product.woodCut === 'edge') {
      return isEnglish ? "Edge grain with the grain running lengthwise." : "Langholz mit längs verlaufender Maserung.";
    }
    return isEnglish ? "Handcrafted wood with its own character." : "Handgefertigtes Holz mit eigenem Charakter.";
  }

  function productProof(product) {
    if (product.shortDescription) {
      return (isEnglish ? EdleProductCopy.text(product.shortDescription, true) : normalizeConstructionTerms(product.shortDescription)).replace(/\s+/g, " ").trim();
    }
    if (product.longDescription) {
      var normalized = normalizeConstructionTerms(product.longDescription).replace(/\s+/g, " ").trim();
      var sentences = normalized.match(/[^.!?]+[.!?]+/g);
      if (sentences && sentences.length) {
        return sentences.slice(0, 2).join(" ").trim();
      }
      return normalized.length > 340 ? normalized.slice(0, 337).replace(/\s+\S*$/, "") + "…" : normalized;
    }
    if (product.category === 'board' && isEndGrain(product)) {
      return isEnglish ? "Standing wood fibres make end grain more involved to produce and give it its dense, substantial character." : "Stehende Holzfasern machen Stirnholz aufwendiger in der Fertigung und geben dem Brett seinen dichten, massiven Charakter.";
    }
    if (product.material) {
      return isEnglish ? "Material, surface and format define how this product feels in daily use." : "Material, Oberfläche und Format bestimmen, wie sich dieses Produkt im Alltag anfühlt.";
    }
    return isEnglish ? "The product details come from the central Edle Hölzer product data." : "Die Produktdetails stammen aus der zentralen Produktdatenbasis von Edle Hölzer.";
  }

  function productExperienceText(product) {
    var text = [product.name, product.displayName, product.segment].join(" ").toLowerCase();
    if (String(product.listingId) === '1838851839') {
      return isEnglish ? "Place under glasses and cups; store the coasters in their matching holder after use." : "Zum Unterlegen unter Gläser und Tassen. Nach Gebrauch finden die Untersetzer im passenden Halter ihren Platz.";
    }
    if (String(product.listingId) === '1874454440') {
      return isEnglish ? "For storing and displaying your board upright. Check that the board thickness fits the holder before choosing." : "Für die aufrechte Aufbewahrung und Präsentation deines Bretts. Achte bei der Auswahl auf die passende Brettstärke.";
    }
    if (/buttermesser|butter\s*knife/.test(text)) {
      return isEnglish
        ? "For spreading butter, cream cheese and other spreads at the breakfast table."
        : "Zum Verstreichen von Butter, Frischkäse und anderen Aufstrichen am Frühstückstisch.";
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
    return isEndGrain(product) ? (isEnglish ? "End grain" : "Stirnholz") : (isEnglish ? "Edge grain" : "Langholz");
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
    if (product.dimensionsReviewRequired) return isEnglish ? "See current listing" : "Siehe aktuelles Angebot";
    return EdleProductCopy.text(meaningful(product.sizeLabel) ||
      meaningful(product.dimensions) ||
      extractDimensionsFromText([
        product.displayName,
        product.name,
        product.title,
        product.shortDescription,
        product.longDescription
      ].join(" ")), isEnglish);
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
    return EdleProductCopy.text(String(value || "")
      .replace(/Face\s*Grain|Edge\s*Grain|Long\s*Grain/gi, "Langholz")
      .replace(/Flankenholz|Längsholz/gi, "Langholz"), isEnglish);
  }

  function weightLabel(product) {
    var weight = product.weight || product.weightLabel;
    if (weight) {
      return EdleProductCopy.text(weight, isEnglish);
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
    return EdleProductCopy.text(String(product && product.priceLabel ? product.priceLabel : "")
      .replace(/\s*EUR\b/g, " €")
      .replace(/\s{2,}/g, " ")
      .trim(), isEnglish);
  }

  function purchaseOptions(product) {
    if (!hasVerifiedListing(product) || product.etsyOptionsOnly) {
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

  function purchaseVariant(product) {
    var variants = product.variants || [];
    return variants.find(function (variant) { return variant.id === purchaseSelection(product).woodVariant; }) || variants[0];
  }

  function purchaseVariantSummary(product) {
    var variant = purchaseVariant(product);
    if (!variant) return "";
    return (isEnglish ? variant.nameEn : variant.name) + (variant.dimensions ? " · " + EdleProductCopy.text(variant.dimensions, isEnglish) : "") + " · " +
      (variant.availabilityStatus === "made_to_order" ? (isEnglish ? "Made to order; timing agreed individually" : "Fertigung auf Bestellung; Zeit nach Abstimmung") : (isEnglish ? "Available" : "Verfügbar"));
  }

  function purchaseTotal(product) {
    var subtotal = purchaseSubtotalWithoutCareBalm(product);
    if (!Number.isFinite(subtotal)) {
      return null;
    }

    var selection = purchaseSelection(product);
    var total = subtotal;
    purchaseOptions(product).forEach(function (option) {
      if (option.id === "careBalm" && selection[option.id] && !careBalmIsIncluded(product)) {
        total += option.price;
      }
    });
    return Math.round(total * 100) / 100;
  }

  function purchaseSubtotalWithoutCareBalm(product) {
    var variant = purchaseVariant(product);
    var subtotal = Number(variant ? variant.priceOrder : product.priceOrder);
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
    if (product.includesCareBalm) return true;
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
    var variant = purchaseVariant(product);
    if (variant && variant.availabilityStatus === "made_to_order") return isEnglish ? "Made to order; production and delivery time agreed individually" : "Auf Bestellung; Fertigungs- und Lieferzeit nach Abstimmung";
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
    if (product.includesMatchingHolder && product.includesCareBalm) {
      return {
        title: isEnglish ? "Matching stand, care balm and care instructions included" : "Passender Halter, Pflegebalsam und Pflegeanleitung inklusive",
        detail: isEnglish ? "Care for your board and give it a place in your kitchen between shared meals." : "Zum Pflegen und Aufstellen in deiner Küche, bis zum nächsten gemeinsamen Genussmoment.",
        active: true
      };
    }
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
      ((product.variants || []).length ? '<label class="productPreview__variant">' + escapeHtml(isEnglish ? (product.variantLabelEn || 'Wood species') : (product.variantLabel || 'Holzart')) + '<select data-purchase-variant data-product-id="' + escapeAttribute(product.id) + '">' + product.variants.map(function (variant) {
        return '<option value="' + escapeAttribute(variant.id) + '"' + (purchaseVariant(product).id === variant.id ? ' selected' : '') + '>' + escapeHtml((isEnglish ? variant.nameEn : variant.name) + ' · ' + formatCurrency(variant.priceOrder)) + '</option>';
      }).join('') + '</select></label><p data-purchase-variant-summary>' + escapeHtml(purchaseVariantSummary(product)) + '</p><p class="productPreview__trust">' + escapeHtml(product.etsyOptionsOnly ? (isEnglish ? 'Prices depend on the selected design. Confirm dimensions, personalisation and the final price on Etsy.' : 'Der Preis richtet sich nach der gewählten Ausführung. Maße, Personalisierung und Endpreis bestätigst du auf Etsy.') : (isEnglish ? 'Base prices exclude the optional juice groove (+€15). The oak photos show the reference piece; use the worktop preview for the other woods.' : 'Grundpreise ohne optionale Saftrille (+15 €). Die Eichenfotos zeigen das Referenzstück; die anderen Holzarten findest du in der Tresenvorschau.')) + '</p>' : '') +
      (options.length ? '<h3>' + escapeHtml(labels.configuration) + '</h3><div class="productPreview__optionList">' +
        options.map(function (option) {
          var hidden = option.id === "careBalm" && careBalmIsIncluded(product);
          var optionCopy = '<span class="productPreview__optionCopy"><span>' + escapeHtml(option.label) + '</span>' +
            (Number.isFinite(option.regularPrice) ? '<small>' + escapeHtml(labels.regularPrice) + ' ' + escapeHtml(formatCurrency(option.regularPrice)) + '</small>' : "") +
          '</span>';
          return '<label class="productPreview__option"' + (hidden ? " hidden" : "") + ' data-purchase-option-row="' + escapeAttribute(option.id) + '"><input type="checkbox" data-purchase-option="' + escapeAttribute(option.id) + '" data-product-id="' + escapeAttribute(product.id) + '"' + (selection[option.id] ? " checked" : "") + '>' + optionCopy + '<strong>+ ' + escapeHtml(formatCurrency(option.price)) + '</strong></label>';
        }).join("") +
      '</div>' : "") +
    '</section>';
  }

  function renderPackageItems(product) {
    var items = productPackageItems(product, purchaseRules, {
      goodsValue: purchaseSubtotalWithoutCareBalm(product),
      careBalm: purchaseSelection(product).careBalm
    });
    return items.map(function (item) {
      return '<li data-package-item="' + escapeAttribute(item.id) + '">' + escapeHtml(isEnglish ? item.labelEn : item.label) + '</li>';
    }).join('');
  }

  function updatePreviewPurchaseSummary(product) {
    var activeOverlay = previewRoot();
    if (!activeOverlay) {
      return;
    }
    var packageList = activeOverlay.querySelector('[data-product-package]');
    if (packageList) packageList.innerHTML = renderPackageItems(product);
    var facts = activeOverlay.querySelector('.productPreview__facts');
    if (facts) facts.innerHTML = productFacts(product).map(function (fact) {
      return '<div><dt>' + escapeHtml(fact[0]) + '</dt><dd>' + escapeHtml(fact[1]) + '</dd></div>';
    }).join('');
    activeOverlay.querySelectorAll('[data-purchase-variant-summary]').forEach(function (element) { element.textContent = purchaseVariantSummary(product); });
    activeOverlay.querySelectorAll('[data-kitchen-preview]').forEach(function (element) {
      var variant = purchaseVariant(product);
      if (variant) element.setAttribute('data-kitchen-variant', variant.id);
    });
    var selectedVariant = purchaseVariant(product);
    if (selectedVariant) activeOverlay.querySelectorAll('.productPreview__whatsapp a').forEach(function (element) {
      element.href = productWhatsappUrl(product, displayProductName(product) + ' · ' + (isEnglish ? selectedVariant.nameEn : selectedVariant.name));
    });
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
    if (availabilityStatus(product) === "made_to_order") {
      return isEnglish ? "Made to order; production and delivery time agreed individually" : "Auf Bestellung gefertigt; Fertigungs- und Lieferzeit nach Abstimmung";
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
    if (String(product.listingId) === '1838851839') return isEnglish ? 'Under glasses and cups' : 'Unter Gläsern und Tassen';
    if (String(product.listingId) === '1874454440') return isEnglish ? 'Upright board storage' : 'Aufrechte Brettaufbewahrung';
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
    if (String(product.listingId) === '1838851839') return isEnglish ? 'Coaster set' : 'Untersetzer-Set';
    if (String(product.listingId) === '1874454440') return isEnglish ? 'Board stand' : 'Bretthalter';
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
    return Boolean((isAvailableProduct(product) || availabilityStatus(product) === "made_to_order") && product.directListingUrlVerified === true && (product.etsyListingUrl || product.etsyUrl));
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
    if (!product || product.canonicalProductId || product.visibility === "hidden" || product.visibility === "archive") {
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
    var name = EdleProductCopy.text(product.displayName || product.name || "", isEnglish);
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
    var suppliedAlt = isEnglish ? product.imageAltEn : product.imageAlt;
    if (suppliedAlt) return suppliedAlt;
    if (product.displayName || product.name) return displayProductName(product);
    if (product.category === "care") {
      return isEnglish ? "Wood care product for cutting boards" : "Holzpflegeprodukt für Schneidebretter";
    }
    if (product.category === "accessory") {
      return isEnglish ? "Handmade wooden kitchen accessory by Edle Hölzer" : "Handgefertigtes Küchenaccessoire aus Holz von Edle Hölzer";
    }
    return (isEnglish ? "Wooden cutting board by Edle Hölzer" : "Schneidebrett aus Holz von Edle Hölzer") + (product.material ? " - " + EdleProductCopy.text(product.material, isEnglish) : "");
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
    return EdleProductCopy.text(meaningful(value) || "", isEnglish);
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
      listing_id: product && product.listingId,
      product_name: product && (product.displayName || product.name),
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

// One DOM-free matching engine shared by the finder, its pool and regression tests.
function createFinderMatcher() {
  var sizes = ["compact", "medium", "large"];
  var handling = ["portable", "balanced", "stationary"];
  function answer(answers, key) {
    var value = answers[key];
    return value && typeof value === "object" ? value.value : value;
  }
  function effectiveUse(answers) {
    var use = answer(answers, "use");
    return use === "gift" ? answer(answers, "giftUse") : use;
  }
  function eligible(product) {
    var profile = product.finderProfile;
    return Boolean(!product.canonicalProductId && product.active === true && product.category === "board" &&
      ["cuttingBoard", "servingBoard"].indexOf(product.productType) !== -1 &&
      ["available", "made_to_order"].indexOf(product.availabilityStatus) !== -1 &&
      !product.inspirationOnly && !["hidden", "archive", "inspiration"].includes(product.visibility) &&
      product.dataVerified === true && product.imageVerified === true && product.needsReview === false &&
      Boolean(product.id && product.image && product.sizeLabel) && (product.productType === "servingBoard" || /\d/.test(product.thicknessLabel || "")) && Number(product.priceOrder) > 0 &&
      sizes.indexOf(product.sizeProfile) !== -1 && handling.indexOf(product.portability) !== -1 &&
      ["light", "medium", "heavy"].indexOf(product.weightClass) !== -1 &&
      Array.isArray(product.primaryUseCases) && product.primaryUseCases.length > 0 &&
      Array.isArray(product.secondaryUseCases) && profile && Array.isArray(profile.visual) && profile.visual.length > 0 &&
      profile.visual.every(function (v) { return ["light", "dark", "expressive"].indexOf(v) !== -1; }) &&
      (product.availabilityStatus === "made_to_order" ||
        (product.directListingUrlVerified === true && Boolean(product.listingId && (product.etsyListingUrl || product.etsyUrl)))));
  }
  function supports(product, use) {
    if (!use || use === "unknown") return true;
    if (use === "gift") return product.giftable === true;
    if (["dailyPrep", "bbq"].indexOf(use) !== -1 && product.productType !== "cuttingBoard") return false;
    if (use === "breakfast" && (product.weightClass === "heavy" || product.sizeProfile === "large")) return false;
    return product.primaryUseCases.indexOf(use) !== -1 || product.secondaryUseCases.indexOf(use) !== -1;
  }
  function evaluate(product, answers) {
    var matches = [], conflicts = [], score = 0;
    if (!eligible(product)) return { product: product, score: 0, matches: [], conflicts: [{ type: "data" }], hardConflicts: [{ type: "data" }], status: "excluded" };
    var use = effectiveUse(answers);
    var space = answer(answers, "space"), movement = answer(answers, "movement");
    var style = answer(answers, "style"), budget = answer(answers, "budget");
    function match(type, value, points) { matches.push({ type: type, value: value }); score += points; }
    function conflict(type, value, delta) { conflicts.push({ type: type, value: value, delta: delta || 0 }); }
    if (!eligible(product)) conflict("data", "ineligible");
    var hostingGift = answer(answers, "use") === "gift" && use === "serving";
    if (!supports(product, use) || (answer(answers, "use") === "gift" && !supports(product, "gift")) ||
      (hostingGift && product.finderProfile.servingContext !== "hosting")) {
      conflict("use", use);
    } else if (use && use !== "unknown") {
      match("use", use, product.primaryUseCases.indexOf(use) !== -1 ? 40 : 24);
    }
    if (answer(answers, "use") === "gift" && product.giftable) match("gift", "giftable", 4);
    if (space && space !== "open") {
      if (product.sizeProfile === space) match("size", space, 16);
      else if ((space === "compact" && product.sizeProfile !== "compact") ||
        (space === "medium" && product.sizeProfile === "large") ||
        (space === "large" && product.sizeProfile === "compact")) conflict("size", product.sizeProfile);
      else match("size", "smaller", 5);
    }
    if (movement && movement !== "open") {
      if (product.portability === movement) match("handling", movement, 16);
      else if ((movement === "portable" && (product.weightClass === "heavy" || product.portability === "stationary")) ||
        (movement === "balanced" && product.portability === "stationary") ||
        (movement === "stationary" && product.portability !== "stationary")) conflict("handling", product.portability);
      else match("handling", "flexible", 5);
    }
    if (product.finderProfile && product.finderProfile.requiresLargeStationary &&
      ((space && space !== "large") || (movement && movement !== "stationary"))) conflict("configuration", "largeStationary");
    if (style && style !== "open") {
      if (product.finderProfile && product.finderProfile.visual.indexOf(style) !== -1) match("visual", style, 14);
      else conflict("visual", style);
    }
    var limit = budget === "max100" ? 100 : budget === "max250" ? 250 : null;
    if (limit && Number(product.priceOrder) > limit) conflict("budget", limit, Math.round((product.priceOrder - limit) * 100) / 100);
    else if (limit) match("budget", "withinBudget", 0);
    if (budget === "premium") match("premium", product.premiumLevel, Number(product.premiumLevel || 0) * 3);
    if (use === "serving" && product.servingSuitable) match("serving", "servingSuitable", 8);
    if (use === "bbq" && product.finderProfile && product.finderProfile.juiceGroove) match("feature", "juiceGroove", 6);
    var hard = conflicts.filter(function (c) { return c.type !== "visual"; });
    var coreFits = conflicts.every(function (c) { return ["data", "use", "configuration"].indexOf(c.type) === -1; });
    return { product: product, score: score, matches: matches, conflicts: conflicts, hardConflicts: hard,
      status: !coreFits ? "excluded" : hard.length === 0 ? "compatible" : conflicts.length === 1 ? "near_match" : "excluded" };
  }
  function compare(a, b) {
    if (a.score !== b.score) return b.score - a.score;
    if (a.product.availabilityStatus !== b.product.availabilityStatus) return a.product.availabilityStatus === "available" ? -1 : 1;
    if (a.product.directListingUrlVerified !== b.product.directListingUrlVerified) return a.product.directListingUrlVerified ? -1 : 1;
    if (a.product.featured !== b.product.featured) return a.product.featured ? -1 : 1;
    if (Number(a.product.priceOrder) !== Number(b.product.priceOrder)) return a.product.priceOrder - b.product.priceOrder;
    return String(a.product.id).localeCompare(String(b.product.id));
  }
  function rank(products, answers) {
    return products.filter(eligible).map(function (p) { return evaluate(p, answers); }).sort(compare);
  }
  function tradeoff(candidate, main) {
    if (candidate.portability !== main.portability) return handling.indexOf(candidate.portability) < handling.indexOf(main.portability) ? "lighter" : "steadier";
    if (candidate.sizeProfile !== main.sizeProfile) return sizes.indexOf(candidate.sizeProfile) < sizes.indexOf(main.sizeProfile) ? "smaller" : "larger";
    if (candidate.priceOrder < main.priceOrder) return "cheaper";
    var difference = candidate.finderProfile.visual.find(function (v) { return main.finderProfile.visual.indexOf(v) === -1; });
    if (difference) return difference;
    if (candidate.premiumLevel > main.premiumLevel) return "premium";
    return null;
  }
  function select(products, answers) {
    var entries = rank(products, answers);
    var compatible = entries.filter(function (e) { return e.hardConflicts.length === 0; });
    // Visual preferences are soft; prefer full matches before showing an honest visual compromise.
    var main = compatible.find(function (e) { return e.conflicts.length === 0; }) || compatible[0] || null;
    if (main) main.status = "best_match";
    var alternative = main && compatible.find(function (e) {
      return e !== main && e.conflicts.length === 0 && e.score >= main.score - 18 &&
        (effectiveUse(answers) !== "serving" || e.product.productType === main.product.productType) && tradeoff(e.product, main.product);
    }) || null;
    if (alternative) { alternative.status = "alternative"; alternative.tradeoff = tradeoff(alternative.product, main.product); }
    var near = entries.find(function (e) {
      return e !== main && e !== alternative && e.conflicts.length === 1 &&
        ["budget", "size", "handling", "visual"].indexOf(e.conflicts[0].type) !== -1 &&
        (!main || e.score >= main.score - 8);
    }) || null;
    if (near) near.status = "near_match";
    return { entries: entries, main: main, alternative: alternative, near: near };
  }
  return { eligible: eligible, supports: supports, evaluate: evaluate, rank: rank, select: select, effectiveUse: effectiveUse, tradeoff: tradeoff };
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

  var matcher = createFinderMatcher();
  var questionsDe = [
    {
      "id": "use",
      "title": "Wofür nutzt du dein Brett hauptsächlich?",
      "options": [
        {
          "value": "breakfast",
          "title": "Frühstück, Brot & kleine Arbeiten",
          "description": "Für Brot, Obst, Snacks und kleinere Schneidarbeiten – kompakt und schnell zur Hand."
        },
        {
          "value": "dailyPrep",
          "title": "Täglich kochen & vorbereiten",
          "description": "Für Gemüse, Fleisch und die tägliche Küchenarbeit."
        },
        {
          "value": "bbq",
          "title": "Grillen & tranchieren",
          "description": "Für Steak, Braten und BBQ – hier zählen Fläche und sicherer Stand."
        },
        {
          "value": "serving",
          "title": "Servieren & am Tisch nutzen",
          "description": "Für Brotzeit, Käse, Antipasti und Speisen, die mit an den Tisch kommen."
        },
        {
          "value": "gift",
          "title": "Ich suche ein Geschenk",
          "description": "Für jemanden, der Freude an einem handgefertigten Brett hat."
        }
      ]
    },
    {
      "id": "space",
      "title": "Wie viel Platz darf das Brett einnehmen?",
      "options": [
        {
          "value": "compact",
          "title": "Kompakt",
          "description": "Für kleinere Arbeitsflächen oder wenn das Brett leicht verstaut werden soll."
        },
        {
          "value": "medium",
          "title": "Mittel",
          "description": "Genug Fläche für die tägliche Küchenarbeit, ohne zu dominant zu werden."
        },
        {
          "value": "large",
          "title": "Groß",
          "description": "Für viel Arbeitsfläche, Kücheninsel oder Grillstation."
        },
        {
          "value": "open",
          "title": "Noch offen",
          "description": "Die Größe soll aus meiner Nutzung abgeleitet werden."
        }
      ]
    },
    {
      "id": "movement",
      "title": "Wie soll sich das Brett im Alltag handhaben lassen?",
      "options": [
        {
          "value": "portable",
          "title": "Leicht & schnell bewegt",
          "description": "Ich möchte es häufig anheben, reinigen und verstauen."
        },
        {
          "value": "balanced",
          "title": "Ausgewogen",
          "description": "Es soll stabil liegen, aber noch bequem bewegt werden können."
        },
        {
          "value": "stationary",
          "title": "Schwer & dauerhaft präsent",
          "description": "Es darf satt liegen und meistens an seinem Platz bleiben."
        },
        {
          "value": "open",
          "title": "Noch offen",
          "description": "Gewicht und Handling sind für mich nicht entscheidend."
        }
      ]
    },
    {
      "id": "style",
      "title": "Welche Holz-/Raumwirkung gefällt dir?",
      "options": [
        {
          "value": "light",
          "title": "Hell & natürlich",
          "description": "Helle Holzfarben mit natürlicher Materialwirkung."
        },
        {
          "value": "dark",
          "title": "Dunkel & warm",
          "description": "Dunkle, warme Holztöne."
        },
        {
          "value": "expressive",
          "title": "Markant & charaktervoll",
          "description": "Kontraste, lebendige Maserung oder ein prägnantes Muster."
        },
        {
          "value": "open",
          "title": "Optik ist zweitrangig",
          "description": "Nutzung und Handhabung sind mir wichtiger."
        }
      ]
    },
    {
      "id": "budget",
      "title": "Welcher Preisrahmen passt für dich?",
      "options": [
        {
          "value": "max100",
          "title": "Bis etwa 100 €",
          "description": "Die Empfehlung soll höchstens 100 € kosten."
        },
        {
          "value": "max250",
          "title": "Bis etwa 250 €",
          "description": "Die Empfehlung soll höchstens 250 € kosten."
        },
        {
          "value": "premium",
          "title": "Premium, auch über 250 €",
          "description": "Ich bevorzuge aufwendigere Ausführungen, ohne feste Preisobergrenze."
        },
        {
          "value": "open",
          "title": "Was am besten zu mir passt",
          "description": "Ohne Preislimit: Nutzung und Handling entscheiden, nicht der höchste Preis."
        }
      ]
    }
  ];
  var questionsEn = [
    {
      "id": "use",
      "title": "What will you mainly use the board for?",
      "options": [
        {
          "value": "breakfast",
          "title": "Breakfast, bread & small prep",
          "description": "For bread, fruit, snacks and small cutting jobs – compact and easy to reach."
        },
        {
          "value": "dailyPrep",
          "title": "Everyday cooking & prep",
          "description": "For vegetables, meat and everyday kitchen prep."
        },
        {
          "value": "bbq",
          "title": "BBQ & carving",
          "description": "For steaks, roasts and BBQ – with room to work and a steady base."
        },
        {
          "value": "serving",
          "title": "Serving at the table",
          "description": "For bread, cheese, antipasti and food served straight from the board."
        },
        {
          "value": "gift",
          "title": "I'm looking for a gift",
          "description": "For someone who would enjoy a handcrafted board."
        }
      ]
    },
    {
      "id": "space",
      "title": "How much space can the board take up?",
      "options": [
        {
          "value": "compact",
          "title": "Compact",
          "description": "For smaller worktops or easy storage."
        },
        {
          "value": "medium",
          "title": "Medium",
          "description": "Room for everyday prep without taking over the worktop."
        },
        {
          "value": "large",
          "title": "Large",
          "description": "For a spacious worktop, kitchen island or BBQ station."
        },
        {
          "value": "open",
          "title": "Not decided yet",
          "description": "Let the intended use guide the size."
        }
      ]
    },
    {
      "id": "movement",
      "title": "How would you like to handle it day to day?",
      "options": [
        {
          "value": "portable",
          "title": "Light & easy to move",
          "description": "I'll often lift, clean and put it away."
        },
        {
          "value": "balanced",
          "title": "Balanced",
          "description": "It should sit steadily and still be comfortable to move."
        },
        {
          "value": "stationary",
          "title": "Substantial & usually stays put",
          "description": "It can be heavy and remain in one place most of the time."
        },
        {
          "value": "open",
          "title": "Not decided yet",
          "description": "Weight and handling aren't deciding factors for me."
        }
      ]
    },
    {
      "id": "style",
      "title": "Which wood character appeals to you?",
      "options": [
        {
          "value": "light",
          "title": "Light & natural",
          "description": "Light wood tones with a natural feel."
        },
        {
          "value": "dark",
          "title": "Dark & warm",
          "description": "Deep, warm wood tones."
        },
        {
          "value": "expressive",
          "title": "Distinctive & characterful",
          "description": "Contrasts, lively grain or a striking pattern."
        },
        {
          "value": "open",
          "title": "Looks come second",
          "description": "Use and handling matter more to me."
        }
      ]
    },
    {
      "id": "budget",
      "title": "What price range works for you?",
      "options": [
        {
          "value": "max100",
          "title": "Up to about €100",
          "description": "Keep the recommendation at €100 or less."
        },
        {
          "value": "max250",
          "title": "Up to about €250",
          "description": "Keep the recommendation at €250 or less."
        },
        {
          "value": "premium",
          "title": "Premium, including above €250",
          "description": "I prefer more elaborate pieces, with no fixed price ceiling."
        },
        {
          "value": "open",
          "title": "Whatever suits me best",
          "description": "No price limit: use and handling matter, not the highest price."
        }
      ]
    }
  ];
  var giftQuestionDe = {
    "id": "giftUse",
    "title": "Wofür wird die beschenkte Person das Brett wahrscheinlich nutzen?",
    "options": [
      {
        "value": "breakfast",
        "title": "Frühstück & Brotzeit",
        "description": "Für Brot, Obst und kleine Arbeiten."
      },
      {
        "value": "dailyPrep",
        "title": "Täglich kochen",
        "description": "Für die tägliche Vorbereitung in der Küche."
      },
      {
        "value": "bbq",
        "title": "Grillen & tranchieren",
        "description": "Für BBQ, Braten und größere Lebensmittel."
      },
      {
        "value": "serving",
        "title": "Servieren & Gäste bewirten",
        "description": "Für Speisen, die mit an den Tisch kommen."
      },
      {
        "value": "unknown",
        "title": "Weiß ich nicht",
        "description": "Wir orientieren uns an deinen übrigen Angaben."
      }
    ]
  };
  var giftQuestionEn = {
    "id": "giftUse",
    "title": "How will the recipient probably use the board?",
    "options": [
      {
        "value": "breakfast",
        "title": "Breakfast & bread",
        "description": "For bread, fruit and small prep jobs."
      },
      {
        "value": "dailyPrep",
        "title": "Everyday cooking",
        "description": "For daily kitchen prep."
      },
      {
        "value": "bbq",
        "title": "BBQ & carving",
        "description": "For grilling, roasts and larger foods."
      },
      {
        "value": "serving",
        "title": "Serving & entertaining",
        "description": "For food served at the table."
      },
      {
        "value": "unknown",
        "title": "I'm not sure",
        "description": "We'll use your other preferences as a guide."
      }
    ]
  };
  var questions = isEnglish ? questionsEn : questionsDe;

  function activeQuestions() {
    var base = isEnglish ? questionsEn : questionsDe;
    return state.answers.use && state.answers.use.value === "gift"
      ? [base[0], isEnglish ? giftQuestionEn : giftQuestionDe].concat(base.slice(1)) : base;
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
      if (finderRoot && "IntersectionObserver" in window) {
        var finderViewObserver = new IntersectionObserver(function (entries) {
          if (entries.some(function (entry) { return entry.isIntersecting; })) {
            finderTrack("product_finder_view", { candidate_count_after: finderProducts().length });
            finderViewObserver.disconnect();
          }
        }, { threshold: 0.15 });
        finderViewObserver.observe(finderRoot);
      } else if (finderRoot) {
        finderTrack("product_finder_view", { candidate_count_after: finderProducts().length });
      }
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

  var finderTimer;
  var lastResultSignature = "";
  var poolEntries = [];
  var poolInitialized = false;
  var isEditing = false;

  function finderTrack(name, payload) {
    if (window.EdleAnalytics && typeof window.EdleAnalytics.track === "function") {
      window.EdleAnalytics.track(name, payload || {});
    }
  }

  function finderProducts() {
    return state.products.filter(matcher.eligible);
  }

  function finderSelection() {
    return matcher.select(finderProducts(), state.answers);
  }

  function candidateCount() {
    if (Object.keys(state.answers).length === 0) return finderProducts().length;
    return finderSelection().entries.filter(function (e) { return e.conflicts.length === 0; }).length;
  }

  function cancelAdvance() {
    window.clearTimeout(finderTimer);
  }

  function resultIsComplete() {
    return activeQuestions().every(function (q) { return Boolean(state.answers[q.id]); });
  }

  function hideFinderResult() {
    var result = document.querySelector("[data-finder-result]");
    if (result) { result.hidden = true; result.innerHTML = ""; }
    state.highlightedIds = [];
    renderGrid();
  }

  function goToQuestion(id, source) {
    cancelAdvance();
    questions = activeQuestions();
    var step = questions.findIndex(function (q) { return q.id === id; });
    if (step < 0) return;
    state.currentStep = step;
    isEditing = true;
    hideFinderResult();
    var explanation = finderRoot.querySelector("[data-finder-explanation]");
    if (explanation) explanation.hidden = true;
    finderTrack(source === "near" ? "product_finder_near_match_reconsider" : "product_finder_step_back", {
      step: step + 1, question: id, candidate_count_after: candidateCount()
    });
    renderFinder();
    focusFinderQuestion();
  }

  function focusFinderQuestion() {
    var heading = finderRoot.querySelector("[data-finder-question]");
    if (heading) heading.focus({ preventScroll: true });
    keepFinderQuestionVisible();
  }

  function renderFinder() {
    if (!finderRoot) return;
    questions = activeQuestions();
    state.currentStep = Math.min(state.currentStep, questions.length - 1);
    var question = questions[state.currentStep];
    var stepLabel = finderRoot.querySelector("[data-finder-step-label]");
    var questionNode = finderRoot.querySelector("[data-finder-question]");
    var optionsNode = finderRoot.querySelector("[data-finder-options]");
    var prevButton = finderRoot.querySelector("[data-finder-prev]");
    var nextButton = finderRoot.querySelector("[data-finder-next]");
    if (!question || !optionsNode || !questionNode || !stepLabel || !prevButton || !nextButton) return;

    stepLabel.textContent = (isEnglish ? "Step " : "Schritt ") + (state.currentStep + 1) + (isEnglish ? " of " : " von ") + questions.length;
    questionNode.textContent = question.title;
    questionNode.setAttribute("tabindex", "-1");
    optionsNode.innerHTML = question.options.map(function (option) {
      var selected = Boolean(state.answers[question.id] && state.answers[question.id].value === option.value);
      return '<button class="finderOption' + (selected ? ' is-selected' : '') + '" type="button" data-option="' + escapeAttribute(option.value) + '" aria-pressed="' + selected + '">' +
        '<span class="finderOption__title">' + escapeHtml(option.title) + '</span>' +
        '<span class="finderOption__description">' + escapeHtml(option.description) + '</span></button>';
    }).join("");
    prevButton.disabled = state.currentStep === 0;
    nextButton.disabled = !state.answers[question.id];
    nextButton.textContent = resultIsComplete()
      ? (isEnglish ? "Show result" : "Ergebnis anzeigen") : (isEnglish ? "Next" : "Weiter");

    optionsNode.querySelectorAll("[data-option]").forEach(function (button) {
      button.addEventListener("click", function () {
        cancelAdvance();
        var selected = question.options.find(function (o) { return o.value === button.dataset.option; });
        var previous = state.answers[question.id];
        var before = candidateCount();
        state.answers[question.id] = selected;
        if (question.id === "use" && selected.value !== "gift") delete state.answers.giftUse;
        hideFinderResult();
        if (!window.edleFinderStarted) {
          window.edleFinderStarted = true;
          finderTrack("product_finder_start", { question: question.id });
        }
        finderTrack(previous && previous.value !== selected.value ? "product_finder_answer_changed" : "product_finder_answer", {
          step: state.currentStep + 1, question: question.id, answer: selected.value,
          candidate_count_before: before, candidate_count_after: candidateCount()
        });
        optionsNode.querySelectorAll("[data-option]").forEach(function (node) {
          var active = node === button;
          node.classList.toggle("is-selected", active);
          node.setAttribute("aria-pressed", String(active));
        });
        nextButton.disabled = false;
        renderDecisionChips();
        renderFinderPool();
        finderTimer = window.setTimeout(function () {
          if (resultIsComplete() && isEditing || state.currentStep === activeQuestions().length - 1) {
            isEditing = false;
            showFinderResult();
          } else {
            state.currentStep += 1;
            renderFinder();
            focusFinderQuestion();
          }
        }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 350);
      });
    });
    prevButton.onclick = function () {
      if (state.currentStep > 0) goToQuestion(questions[state.currentStep - 1].id);
    };
    nextButton.onclick = function () {
      cancelAdvance();
      if (!state.answers[question.id]) return;
      if (resultIsComplete()) { isEditing = false; showFinderResult(); }
      else if (state.currentStep < questions.length - 1) { state.currentStep += 1; renderFinder(); focusFinderQuestion(); }
    };
    renderDecisionChips();
    renderFinderPool();
  }

  function renderDecisionChips() {
    var root = finderRoot.querySelector("[data-finder-decisions]");
    if (!root) return;
    root.innerHTML = activeQuestions().filter(function (q) { return state.answers[q.id]; }).map(function (q) {
      return '<button class="finderDecision" type="button" data-finder-edit="' + q.id + '" aria-label="' +
        escapeAttribute((isEnglish ? "Change: " : "Ändern: ") + q.title + " " + state.answers[q.id].title) + '">' +
        escapeHtml(state.answers[q.id].title) + '<span aria-hidden="true"> ↶</span></button>';
    }).join("");
    root.querySelectorAll("[data-finder-edit]").forEach(function (node) {
      node.onclick = function () { goToQuestion(node.dataset.finderEdit); };
    });
  }

  function thumbnail(product) {
    // Etsy already supplies resized variants; never load full-resolution pictures in the pool.
    return String(product.image).replace(/\/il_(?:fullxfull|\d+xN)\./, "/il_170x135.");
  }

  function renderFinderPool(finalSelection) {
    var root = finderRoot.querySelector("[data-finder-pool]");
    var counter = finderRoot.querySelector("[data-finder-count]");
    if (!root || !counter) return;
    var selection = finalSelection || finderSelection();
    poolEntries = selection.entries.slice().sort(function (a, b) {
      function priority(e) {
        if (e === selection.main || e === selection.alternative) return 0;
        if (e === selection.near) return 1;
        if (e.conflicts.length === 0) return 2;
        return 3;
      }
      return priority(a) - priority(b) || b.score - a.score;
    });
    var count = Object.keys(state.answers).length === 0 ? poolEntries.length :
      poolEntries.filter(function (e) { return e.conflicts.length === 0; }).length;
    var finalCount = [selection.main, selection.alternative].filter(Boolean).length;
    root.classList.toggle("is-condensed", Object.keys(state.answers).length > 0 && count <= 8);
    counter.textContent = finalSelection
      ? finalCount + (isEnglish ? " especially suitable board" + (finalCount === 1 ? "" : "s") : " besonders passende" + (finalCount === 1 ? "s Brett" : " Bretter"))
      : count + (isEnglish ? " board" + (count === 1 ? "" : "s") + (Object.keys(state.answers).length ? " match your choices so far" : " to consider") :
        (Object.keys(state.answers).length ? " Bretter passen zu deinen bisherigen Angaben" : " mögliche Bretter"));
    if (!poolInitialized) {
      root.innerHTML = poolEntries.map(function (e) {
        var p = e.product;
        return '<div class="finderPool__tile" data-finder-tile="' + escapeAttribute(p.id) + '">' +
          '<button class="finderPool__inspect" type="button" aria-label="' + escapeAttribute(displayProductName(p)) + '">' +
          '<img src="' + escapeAttribute(thumbnail(p)) + '" alt="" width="170" height="135" loading="lazy" decoding="async">' +
          '<span class="finderPool__name">' + escapeHtml(displayProductName(p)) + '</span></button>' +
          '<span class="finderPool__state"></span></div>';
      }).join("");
      poolInitialized = true;
      root.querySelectorAll("[data-finder-tile] button").forEach(function (node) {
        node.onclick = function () {
          var entry = poolEntries.find(function (e) { return e.product.id === node.parentElement.dataset.finderTile; });
          if (entry && entry.status === "near_match" && Object.keys(state.answers).length) showNearExplanation(entry);
        };
      });
    }
    var tiles = Array.from(root.children);
    var previous = new Map(tiles.map(function (node) { return [node, node.getBoundingClientRect()]; }));
    // Highest-ranked products cluster in the middle of the first row.
    var slots = [];
    [3, 4, 2, 5, 1, 6, 0, 7].concat(poolEntries.map(function (_, i) { return i + 8; })).forEach(function (slot, i) {
      if (i < poolEntries.length) slots[slot] = poolEntries[i];
    });
    slots.filter(Boolean).forEach(function (entry) {
      var node = tiles.find(function (tile) { return tile.dataset.finderTile === entry.product.id; });
      var initial = Object.keys(state.answers).length === 0;
      var status = initial ? "compatible" : entry.status;
      if (!finalSelection && status === "best_match") status = "leading";
      else if (status === "best_match" || status === "alternative") status = "leading";
      if (entry === selection.near && !initial) status = "near-match";
      else if (entry.conflicts.length && status !== "leading" && !initial) status = "excluded";
      if (!["leading", "compatible", "near-match"].includes(status)) status = "excluded";
      node.className = "finderPool__tile is-" + status;
      var canExplain = !initial && status === "near-match" && entry.conflicts.length === 1;
      var button = node.querySelector("button");
      button.disabled = false;
      if (canExplain) button.removeAttribute("data-product-preview");
      else button.setAttribute("data-product-preview", entry.product.id);
      button.setAttribute("data-product-source", "finder-pool");
      button.title = displayProductName(entry.product);
      button.setAttribute("aria-label", displayProductName(entry.product) + (canExplain ? (isEnglish ? ": see the one difference" : ": eine Abweichung ansehen") : ""));
      node.querySelector(".finderPool__state").textContent = status === "leading" ? (isEnglish ? "Leading" : "Vorne") :
        status === "near-match" ? (isEnglish ? "1 difference" : "1 Abweichung") :
        status === "excluded" ? (isEnglish ? "Outside selection" : "Außerhalb") : "";
      root.appendChild(node);
    });
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && root.dataset.ready) {
      Array.from(root.children).forEach(function (node) {
        var old = previous.get(node), now = node.getBoundingClientRect();
        if (old && node.animate) node.animate([
          { translate: (old.left - now.left) + "px " + (old.top - now.top) + "px" }, { translate: "0px 0px" }
        ], { duration: 400, easing: "cubic-bezier(.22,.8,.3,1)" });
      });
    }
    root.dataset.ready = "true";
    var explanation = finderRoot.querySelector("[data-finder-explanation]");
    if (explanation) explanation.hidden = true;
  }

  function conflictText(conflict) {
    if (!conflict) return "";
    var money = new Intl.NumberFormat(isEnglish ? "en-IE" : "de-DE", { style: "currency", currency: "EUR" });
    if (conflict.type === "budget") return isEnglish
      ? money.format(conflict.delta) + " above your " + money.format(conflict.value) + " budget."
      : money.format(conflict.delta) + " über deinem Preisrahmen von " + money.format(conflict.value) + ".";
    if (conflict.type === "handling") return state.answers.movement && state.answers.movement.value === "stationary"
      ? (isEnglish ? "Not the substantial, fixed-place design you selected." : "Nicht die schwere, dauerhaft präsente Ausführung, die du gewählt hast.")
      : (isEnglish ? "Heavier and less easy to move than you asked for." : "Schwerer und weniger beweglich als von dir gewünscht.");
    if (conflict.type === "size") {
      var sizeLabels = isEnglish ? { compact: "compact", medium: "medium", large: "large" } : { compact: "kompakt", medium: "mittel", large: "groß" };
      var requested = state.answers.space && state.answers.space.value;
      return isEnglish ? "You selected " + sizeLabels[requested] + "; this board has a " + sizeLabels[conflict.value] + " format." :
        "Du hast " + sizeLabels[requested] + " gewählt; dieses Brett ist " + sizeLabels[conflict.value] + ".";
    }
    if (conflict.type === "visual") return isEnglish ? "A different wood character from your preference." : "Eine andere Holz-/Raumwirkung als von dir gewünscht.";
    return "";
  }

  function conflictQuestion(entry) {
    var type = entry.conflicts[0].type;
    return { budget: "budget", size: "space", handling: "movement", visual: "style" }[type];
  }

  function reconsiderLabel(entry) {
    return (isEnglish ? {
      budget: "Change budget", size: "Change size", handling: "Change handling", visual: "Change look"
    } : {
      budget: "Budget ändern", size: "Größe ändern", handling: "Handling ändern", visual: "Optik ändern"
    })[entry.conflicts[0].type];
  }

  function finderAction(entry, kind) {
    var p = entry.product;
    if (p.availabilityStatus === "made_to_order") {
      return '<a class="btn btn--emphasis" href="' + (isEnglish ? "/en/custom-cutting-board/" : "/schneidebrett-nach-mass/") +
        '" data-finder-open="' + kind + '" data-finder-product="' + escapeAttribute(p.id) + '">' +
        (isEnglish ? "Ask about this version" : "Ausführung anfragen") + '</a>';
    }
    return '<button class="btn btn--emphasis" type="button" data-product-preview="' + escapeAttribute(p.id) +
      '" data-product-source="finder-' + kind + '" data-finder-open="' + kind + '" data-finder-product="' + escapeAttribute(p.id) + '">' +
      (kind === "near_match" ? (isEnglish ? "View anyway" : "Trotzdem ansehen") : (isEnglish ? "View board" : "Brett ansehen")) + '</button>';
  }

  function bindFinderActions(root) {
    root.querySelectorAll("[data-finder-open]").forEach(function (button) {
      button.onclick = function () {
        finderTrack("product_finder_" + button.dataset.finderOpen + "_open", { recommended_product_id: button.dataset.finderProduct });
      };
    });
    root.querySelectorAll("[data-finder-reconsider]").forEach(function (button) {
      button.onclick = function () {
        var entry = poolEntries.find(function (e) { return e.product.id === button.dataset.finderReconsider; });
        if (entry) {
          finderTrack("product_finder_near_match_reconsider", { conflict_type: entry.conflicts[0].type, recommended_product_id: entry.product.id });
          goToQuestion(conflictQuestion(entry));
        }
      };
    });
  }

  function showNearExplanation(entry) {
    var root = finderRoot.querySelector("[data-finder-explanation]");
    if (!root) return;
    finderTrack("product_finder_near_match_open", { recommended_product_id: entry.product.id, conflict_type: entry.conflicts[0].type, source: "pool" });
    root.hidden = false;
    root.innerHTML = '<button class="finderExplanation__close" type="button" aria-label="' + (isEnglish ? "Close explanation" : "Erklärung schließen") + '">×</button>' +
      '<h4 tabindex="-1">' + (isEnglish ? "Why has this board moved back?" : "Warum ist dieses Brett zurückgerückt?") + '</h4>' +
      '<p><strong>' + escapeHtml(displayProductName(entry.product)) + '</strong></p><p>' + escapeHtml(buildReason(entry)) + ' ' + escapeHtml(conflictText(entry.conflicts[0])) + '</p>' +
      '<div class="ctaRow">' + finderAction(entry, "near_match") +
      '<button class="textLink" type="button" data-finder-reconsider="' + escapeAttribute(entry.product.id) + '">' + reconsiderLabel(entry) + '</button></div>';
    bindFinderActions(root);
    var trigger = finderRoot.querySelector('[data-finder-tile="' + entry.product.id + '"] button');
    function close() { root.hidden = true; if (trigger) trigger.focus({ preventScroll: true }); }
    root.querySelector(".finderExplanation__close").onclick = close;
    root.onkeydown = function (event) { if (event.key === "Escape") close(); };
    root.querySelector("h4").focus({ preventScroll: true });
  }

  function keepFinderQuestionVisible(showResult) {
    var target = showResult ? document.querySelector("[data-finder-result]") : finderRoot.querySelector(".finderShell__top");
    if (target) target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }

  function buildReason(entry) {
    var translations = isEnglish ? {
      breakfast: "Its format suits breakfast, bread and small prep jobs.",
      dailyPrep: "It is designed for everyday cutting and preparation.",
      bbq: "Its cutting surface and stable build suit BBQ and carving.",
      serving: "It is suited to serving food at the table.",
      compact: "It stays compact for smaller worktops.",
      medium: "Its medium format offers room for everyday prep.",
      large: "It offers the large working surface you selected.",
      portable: "It is easy to lift and put away.",
      balanced: "It balances stability with everyday handling.",
      stationary: "Its substantial build suits a fixed place.",
      light: "Its light wood character matches your preference.",
      dark: "Its dark, warm wood character matches your preference.",
      expressive: "Its distinctive grain or pattern matches your preference."
    } : {
      breakfast: "Sein Format eignet sich für Frühstück, Brot und kleine Schneidarbeiten.",
      dailyPrep: "Es ist für tägliches Schneiden und Vorbereiten geeignet.",
      bbq: "Schneidefläche und stabiler Aufbau passen zu Grillen und Tranchieren.",
      serving: "Es eignet sich zum Servieren am Tisch.",
      compact: "Es bleibt kompakt auf kleineren Arbeitsflächen.",
      medium: "Das mittlere Format bietet Fläche für die tägliche Küchenarbeit.",
      large: "Es bietet die von dir gewünschte große Arbeitsfläche.",
      portable: "Es lässt sich leicht anheben und verstauen.",
      balanced: "Es verbindet stabilen Stand mit ausgewogener Handhabung.",
      stationary: "Der massive Aufbau passt zu einem festen Platz.",
      light: "Seine helle Holz-/Raumwirkung entspricht deinem Wunsch.",
      dark: "Seine dunkle, warme Holz-/Raumwirkung entspricht deinem Wunsch.",
      expressive: "Seine markante Maserung oder sein Muster entspricht deinem Wunsch."
    };
    if (entry.product.productType === "servingBoard" && matcher.effectiveUse(state.answers) === "serving") {
      translations.serving = isEnglish ? "Designed for presenting tapas, cheese and shared platters, not everyday cutting and preparation." : "Zum Anrichten von Tapas, Käse und gemeinsamen Vesperplatten gedacht, nicht für tägliche Schneid- und Vorbereitungsarbeiten.";
      translations.medium = isEnglish ? "Its medium format suits serving at the table." : "Das mittlere Format passt zum Servieren am Tisch.";
      translations.large = isEnglish ? "Its generous format offers space for a shared platter." : "Das großzügige Format bietet Platz für eine gemeinsame Servierplatte.";
    } else if (matcher.effectiveUse(state.answers) === "serving") {
      translations.serving = isEnglish ? "A working board for cutting and preparation that can also present food at the table." : "Ein Arbeitsbrett zum Schneiden und Vorbereiten, auf dem du Speisen auch am Tisch präsentieren kannst.";
    }
    var facts = {};
    entry.matches.forEach(function (match) { if (translations[match.value]) facts[match.type] = translations[match.value]; });
    var sizeHandling = facts.size || facts.handling;
    if (facts.size && facts.handling) {
      sizeHandling = facts.size.replace(/\.$/, "") + "; " + facts.handling.charAt(0).toLowerCase() + facts.handling.slice(1);
    }
    var parts = [facts.use, sizeHandling, facts.visual].filter(Boolean);
    if (!parts.length && entry.product.giftable) parts.push(isEnglish ? "This handcrafted board can be given as a gift." : "Dieses handgefertigte Brett eignet sich als Geschenk.");
    return parts.slice(0, 3).join(" ");
  }

  function tradeoffLabel(value) {
    return (isEnglish ? {
      lighter: "A little easier to move", steadier: "More substantial", smaller: "More compact", larger: "More working surface",
      cheaper: "Lower price", light: "Lighter wood tones", dark: "Darker wood tones", expressive: "More distinctive", premium: "Premium alternative"
    } : {
      lighter: "Etwas leichter zu bewegen", steadier: "Massiver im Handling", smaller: "Etwas kompakter", larger: "Mehr Arbeitsfläche",
      cheaper: "Preisgünstiger", light: "Hellere Optik", dark: "Dunklere Optik", expressive: "Ausdrucksstärker", premium: "Premium-Alternative"
    })[value] || "";
  }

  function resultCard(entry, kind) {
    var p = entry.product;
    var label = kind === "recommendation" ? (isEnglish ? "Best match" : "Beste Übereinstimmung") : (isEnglish ? "Very good alternative" : "Sehr gute Alternative");
    return '<article class="finderMatchCard" data-finder-match="' + kind + '">' + buildProductMedia(p, false) +
      '<div class="finderMatchCard__body"><p class="finderMatchCard__label">' + label + '</p><h3>' + escapeHtml(displayProductName(p)) +
      '</h3>' + buildCardMeta(p) + '<p>' + escapeHtml(buildReason(entry)) + '</p>' +
      (entry.tradeoff ? '<p class="finderMatchCard__tradeoff">' + escapeHtml(tradeoffLabel(entry.tradeoff)) + '</p>' : "") +
      (entry.conflicts.length ? '<p class="finderMatchCard__conflict">' + escapeHtml(conflictText(entry.conflicts[0])) + '</p>' : "") +
      (p.availabilityStatus === "made_to_order" ? '<p class="finderMatchCard__availability">' + (isEnglish ? "Made to order · timing agreed individually" : "Wird auf Bestellung gefertigt · Fertigungszeit nach Absprache") + '</p>' : "") +
      '<p class="productCard__price">' + escapeHtml(displayPriceLabel(p)) + '</p>' + finderAction(entry, kind) + '</div></article>';
  }

  function showFinderResult() {
    cancelAdvance();
    var root = document.querySelector("[data-finder-result]");
    if (!root || !resultIsComplete()) return;
    var result = finderSelection();
    var main = result.main, alternative = result.alternative, near = result.near;
    poolEntries = result.entries;
    state.highlightedIds = [main, alternative].filter(Boolean).map(function (e) { return e.product.id; });
    var title = main && alternative ? (isEnglish ? "These two suit you best." : "Diese zwei passen am besten zu dir.") :
      main ? (isEnglish ? "This board fits your needs best." : "Dieses Brett passt am besten zu deinen Angaben.") :
        (isEnglish ? "No board meets all your requirements right now." : "Aktuell erfüllt kein Brett alle deine Angaben.");
    var budgetLimited = state.answers.budget && ["max100", "max250"].includes(state.answers.budget.value);
    root.hidden = false;
    root.innerHTML = '<h2 tabindex="-1">' + title + '</h2>' +
      (!main ? '<p>' + (budgetLimited ? (isEnglish ? "No suitable board currently meets your requirements within this price range." :
        "Aktuell erfüllt kein Brett alle deine Angaben innerhalb dieses Preisrahmens.") : (isEnglish ? "You can adjust a preference or ask us about a custom piece." : "Du kannst eine Angabe ändern oder uns nach einer individuellen Lösung fragen.")) + '</p>' : "") +
      '<div class="finderMatchGrid">' + (main ? resultCard(main, "recommendation") : "") + (alternative ? resultCard(alternative, "alternative") : "") + '</div>' +
      (near ? '<aside class="finderNear" data-finder-near><div>' + buildProductMedia(near.product, false) + '</div><div><p class="finderMatchCard__label">' +
        (isEnglish ? "Outside your selection — still worth considering" : "Außerhalb deiner Auswahl – trotzdem sehr passend") +
        '</p><h3>' + escapeHtml(displayProductName(near.product)) + '</h3><p>' + escapeHtml(conflictText(near.conflicts[0])) +
        '</p><p>' + escapeHtml(buildReason(near)) + '</p><p>' + escapeHtml(displayPriceLabel(near.product)) + '</p><div class="ctaRow">' + finderAction(near, "near_match") +
        '<button type="button" class="textLink" data-finder-reconsider="' + escapeAttribute(near.product.id) + '">' + reconsiderLabel(near) + '</button></div></div></aside>' : "") +
      '<div class="finderResult__secondaryActions"><button type="button" class="textLink" data-finder-reset>' + (isEnglish ? "Start again" : "Neu beginnen") +
        '</button><a class="textLink" href="' + (isEnglish ? "/en/custom-cutting-board/" : "/schneidebrett-nach-mass/") + '">' +
        (isEnglish ? "Ask about a custom board" : "Individuelles Brett anfragen") + '</a></div>';
    bindFinderActions(root);
    root.querySelector("[data-finder-reset]").onclick = function () {
      cancelAdvance();
      state.answers = {};
      state.currentStep = 0;
      isEditing = false;
      lastResultSignature = "";
      hideFinderResult();
      renderFinder();
      focusFinderQuestion();
    };
    var signature = JSON.stringify(state.answers);
    if (signature !== lastResultSignature) {
      var resultPayload = {
        recommended_product_id: main && main.product.id, alternative_product_id: alternative && alternative.product.id,
        conflict_type: near && near.conflicts[0].type, candidate_count_after: [main, alternative].filter(Boolean).length
      };
      finderTrack("product_finder_complete", resultPayload);
      if (!main) finderTrack("product_finder_no_match", resultPayload);
      lastResultSignature = signature;
    }
    renderDecisionChips();
    renderFinderPool(result);
    renderGrid();
    root.querySelector("h2").focus({ preventScroll: true });
    root.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
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
          '<p class="productCard__segment">' + escapeHtml(EdleProductCopy.text(product.segment, isEnglish)) + '</p>' +
          '<h3 class="productCard__name">' + escapeHtml(displayProductName(product)) + '</h3>' +
          buildCardMeta(product) +
          buildFeatureBadges(product) +
          '<p class="productCard__price">' + escapeHtml(inspiration ? (isEnglish ? "Sold one-off piece" : "Verkauftes Einzelstück") : displayPriceLabel(product)) + '</p>' +
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
    var hoverVideo = Array.isArray(product.videos) && product.videos.find(function (video) { return video && video.src; });
    var hoverAttribute = hoverVideo ? ' data-product-hover-video="' + escapeAttribute(hoverVideo.src) + '"' : "";
    hoverAttribute += ' data-product-card-gallery="' + escapeAttribute(JSON.stringify(buildCardGalleryItems(product))) + '"';
    if (!product.image || product.imageVerified !== true) {
      return '<div class="productCard__media productCard__media--pending">' +
        '<span>' + (isEnglish ? "Product image coming soon" : "Produktbild folgt") + '</span>' +
      '</div>';
    }

    if (source === false) {
      return '<div class="productCard__media"' + hoverAttribute + productImageStyle(product) + '>' +
        '<img src="' + escapeAttribute(product.image) + '" alt="' + escapeAttribute(productImageAlt(product)) + '" loading="lazy" decoding="async">' +
      '</div>';
    }

    return '<button class="productCard__media productCard__mediaButton" type="button" aria-label="' + escapeAttribute((isEnglish ? "View " : "Ansehen: ") + displayProductName(product)) + '" data-product-preview="' + escapeAttribute(product.id) + '" data-product-source="' + escapeAttribute(source || "grid") + '"' + hoverAttribute + productImageStyle(product) + '>' +
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

    var segment = EdleProductCopy.text(product.segment, isEnglish).toLowerCase();
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
      facts.push(["Material", EdleProductCopy.text(product.material, isEnglish)]);
    }

    if (product.category === "board" && dimensionLabel(product)) {
      facts.push([isEnglish ? "Size" : "Maße", EdleProductCopy.text(dimensionLabel(product), isEnglish)]);
    }

    if (product.category === "care") {
      facts = [
        [isEnglish ? "Type" : "Typ", isEnglish ? "Care product" : "Pflegeprodukt"],
        [isEnglish ? "Base" : "Basis", EdleProductCopy.text(product.material || (isEnglish ? "Beeswax and oil" : "Bienenwachs und Öl"), isEnglish)]
      ];
    }

    if (product.category === "accessory") {
      facts = [
        [isEnglish ? "Type" : "Typ", product.productType === "accessory" ? (isEnglish ? "Kitchen tool" : "Küchenhelfer") : EdleProductCopy.text(product.segment, isEnglish)],
        ["Material", EdleProductCopy.text(product.material || (isEnglish ? "Wood" : "Holz"), isEnglish)]
      ];
    }

    if (!facts.length) {
      return "";
    }

    return '<dl class="productFacts productFacts--compact">' + facts.slice(0, 2).map(function (fact) {
      return '<div><dt>' + escapeHtml(fact[0]) + '</dt><dd>' + escapeHtml(fact[1]) + '</dd></div>';
    }).join("") + '</dl>';
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
      return EdleProductCopy.text(product.displayName, isEnglish);
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
    if (isEnglish) {
      return displayProductName(product) + (product.material ? " – " + EdleProductCopy.text(product.material, true) : "");
    }
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
    var compareLabel = isEnglish ? (compared ? "✓ In comparison" : "+ Compare") : (compared ? "✓ Im Vergleich" : "+ Zum Vergleich");
    var productSource = source || "grid";
    var reasonAttribute = reason ? ' data-product-reason="' + escapeAttribute(reason) + '"' : "";
    var productName = displayProductName(product);
    var detailAriaLabel = isEnglish ? "View " + productName : productName + " ansehen";
    var compareAriaLabel = isEnglish ? "Compare " + productName : productName + " vergleichen";
    var detailButton = '<button class="btn btn--emphasis" type="button" aria-label="' + escapeAttribute(detailAriaLabel) + '" data-product-preview="' + escapeAttribute(product.id) + '" data-product-source="' + escapeAttribute(productSource) + '"' + reasonAttribute + '>' + escapeHtml(detailsLabel) + '</button>';
    var compareButton = '<button class="productCard__compareUtility' + (compared ? ' is-in-compare' : '') + '" type="button" aria-label="' + escapeAttribute(compareAriaLabel) + '" data-product-compare="' + escapeAttribute(product.id) + '" data-product-source="' + escapeAttribute(productSource) + '" aria-pressed="' + (compared ? 'true' : 'false') + '">' + escapeHtml(compareLabel) + '</button>';

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
      return isEnglish ? "View board" : "Brett ansehen";
    }
    return isEnglish ? "View product" : "Produkt ansehen";
  }


  function hasVerifiedListing(product) {
    return Boolean((isAvailableProduct(product) || availabilityStatus(product) === "made_to_order") && product.directListingUrlVerified === true && (product.etsyListingUrl || product.etsyUrl));
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
    if (!product || product.canonicalProductId || product.visibility === "hidden" || product.visibility === "archive") {
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
    return EdleProductCopy.text(String(product && product.priceLabel ? product.priceLabel : "")
      .replace(/\s*EUR\b/g, " €")
      .replace(/\s{2,}/g, " ")
      .trim(), isEnglish);
  }

  function dimensionLabel(product) {
    if (product.dimensionsReviewRequired) return isEnglish ? "See current listing" : "Siehe aktuelles Angebot";
    return EdleProductCopy.text(hasMeaningfulValue(product.sizeLabel) ? product.sizeLabel :
      hasMeaningfulValue(product.dimensions) ? product.dimensions :
      extractDimensionsFromText([
        product.displayName,
        product.name,
        product.title,
        product.shortDescription,
        product.longDescription
      ].join(" ")), isEnglish);
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
    return EdleProductCopy.text(String(value || "")
      .replace(/Face\s*Grain|Edge\s*Grain|Long\s*Grain/gi, "Langholz")
      .replace(/Flankenholz|Längsholz/gi, "Langholz"), isEnglish);
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
