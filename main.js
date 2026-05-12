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

  initProductsPage();

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

  var questions = [
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
      title: "Wie viel Platz haben Sie in der Küche?",
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
      title: "Welche Haptik und Stärke passt besser zu Ihnen?",
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
      title: "Was ist Ihnen am wichtigsten?",
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

  var requiredFields = [
    "id",
    "listingId",
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
        gridRoot.innerHTML = '<p class="productEmpty">Die Produktdaten konnten gerade nicht geladen werden. Bitte direkt im <a href="https://edlehoelzervonkoc.etsy.com">Etsy-Shop</a> ansehen.</p>';
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

      if (product.active && product.image && product.imageVerified === true) {
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

    stepLabel.textContent = "Schritt " + (state.currentStep + 1) + " von " + questions.length;
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
    nextButton.textContent = state.currentStep === questions.length - 1 ? "Ergebnis anzeigen" : "Weiter";

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
      resultRoot.innerHTML = '<h2>Das dürfte am besten zu Ihrem Alltag passen</h2><p>Für diese Kombination fehlt aktuell ein belastbar gepflegtes Hauptbrett. Eine kurze Anfrage ist hier sinnvoller als eine automatische Empfehlung.</p><div class="ctaRow"><a class="btn" href="mailto:info@edlehoelzer.de?subject=Anfrage%20Schneidebrett">Schneidebrett anfragen</a><button class="btn btn--ghost-dark" type="button" data-finder-reset>Finder neu starten</button></div>';
      bindReset(resultRoot);
      return;
    }

    state.highlightedIds = [main.id].concat(alternatives.map(function (product) {
      return product.id;
    }));

    resultRoot.hidden = false;
    resultRoot.innerHTML =
      '<div class="finderResult__head">' +
        '<p class="eyebrow eyebrow--dark">Empfehlung</p>' +
        '<h2>Das dürfte am besten zu Ihrem Alltag passen</h2>' +
        '<p>' + escapeHtml(buildReason(main)) + '</p>' +
      '</div>' +
      '<div class="recommendationCard">' +
        buildProductMedia(main) +
        '<div class="recommendationCard__body">' +
          '<p class="productCard__segment">' + escapeHtml(main.segment) + '</p>' +
          '<h3>' + escapeHtml(main.name) + '</h3>' +
          '<p>' + escapeHtml(main.shortDescription) + '</p>' +
          buildBadges(main.badges) +
          '<p class="productCard__price">' + escapeHtml(main.priceLabel) + '</p>' +
          '<div class="ctaRow">' +
            '<a class="btn" href="' + escapeAttribute(main.etsyUrl) + '" target="_blank" rel="noopener">Bei Etsy ansehen</a>' +
            '<a class="btn btn--ghost-dark" href="#produkte-grid">Produktgrid ansehen</a>' +
            '<button class="btn btn--ghost-dark" type="button" data-finder-reset>Neu starten</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      (alternatives.length ? '<div class="alternativeList"><h3>Alternativen</h3>' + alternatives.map(function (product) {
        return '<article><strong>' + escapeHtml(product.name) + '</strong><span>' + escapeHtml(product.shortDescription) + '</span></article>';
      }).join("") + '</div>' : "");

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

  function canRecommendAsMainBoard(product) {
    return product &&
      product.active === true &&
      product.needsReview === false &&
      product.dataVerified === true &&
      product.category === "board" &&
      Boolean(product.etsyUrl);
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
        parts.push("Sie haben wenig Platz oder möchten das Brett häufiger bewegen. Deshalb passt ein kompaktes, leichteres Brett besser als ein schweres Stirnholzbrett.");
      } else if (space.value === "large" || movement.value === "stationary") {
        parts.push("Sie haben genug Arbeitsfläche und das Brett darf dauerhaft satt liegen. Deshalb kann ein größeres, schwereres Brett sinnvoll sein.");
      } else {
        parts.push("Sie suchen ein ausgewogenes Brett, das stabil liegt und trotzdem noch gut bewegt werden kann.");
      }
    }

    if (use) {
      if (use.value === "bbq") {
        parts.push("Für BBQ und kräftiges Schneiden zählt Stabilität stärker als geringes Gewicht.");
      } else if (use.value === "serving") {
        parts.push("Da das Brett auch sichtbar beim Servieren genutzt wird, spielen Maserung, Format und Haptik stärker mit.");
      } else if (use.value === "gift") {
        parts.push("Als Geschenk sollte das Brett nicht nur praktisch sein, sondern auch eine klare Materialwirkung haben.");
      } else {
        parts.push("Für tägliches Schneiden ist ein unkompliziertes, gut führbares Format entscheidend.");
      }
    }

    if (haptics && priority) {
      parts.push("Ihre Auswahl bei Haptik und Priorität spricht für " + product.sizeLabel + ", " + product.thicknessLabel + " und " + product.material + ".");
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
      gridRoot.innerHTML = '<p class="productEmpty">Für diese Filterkombination gibt es aktuell keine gepflegten Produkte.</p>';
      return;
    }

    gridRoot.innerHTML = products.map(function (product) {
      var highlighted = state.highlightedIds.indexOf(product.id) !== -1;
      var review = product.needsReview ? " is-review" : "";
      return '<article class="productCard' + (highlighted ? " is-highlighted" : "") + review + '">' +
        buildProductMedia(product) +
        '<div class="productCard__body">' +
          '<p class="productCard__segment">' + escapeHtml(product.segment) + '</p>' +
          '<h3>' + escapeHtml(product.name) + '</h3>' +
          '<p>' + escapeHtml(product.shortDescription) + '</p>' +
          buildBadges(product.badges) +
          '<dl class="productFacts">' +
            '<div><dt>Material</dt><dd>' + escapeHtml(product.material) + '</dd></div>' +
            '<div><dt>Format</dt><dd>' + escapeHtml(product.sizeLabel) + '</dd></div>' +
            '<div><dt>Gewicht</dt><dd>' + escapeHtml(labelFor(product.weightClass)) + '</dd></div>' +
            '<div><dt>Handling</dt><dd>' + escapeHtml(labelFor(product.portability)) + '</dd></div>' +
          '</dl>' +
          '<p class="productCard__price">' + escapeHtml(product.priceLabel) + '</p>' +
          buildProductActions(product) +
        '</div>' +
      '</article>';
    }).join("");
  }

  function buildProductMedia(product) {
    if (!product.image || product.imageVerified !== true) {
      return '<div class="productCard__media productCard__media--pending">' +
        '<span>Produktbild direkt im Etsy-Listing prüfen</span>' +
      '</div>';
    }

    return '<div class="productCard__media">' +
      '<img src="' + escapeAttribute(product.image) + '" alt="' + escapeAttribute(product.name) + '" loading="lazy" decoding="async">' +
    '</div>';
  }

  function buildBadges(badges) {
    if (!Array.isArray(badges) || !badges.length) {
      return "";
    }

    return '<div class="productBadgeRow">' + badges.map(function (badge) {
      return '<span>' + escapeHtml(badge) + '</span>';
    }).join("") + '</div>';
  }

  function buildProductActions(product) {
    if (product.needsReview || !product.etsyUrl) {
      return '<div class="ctaRow"><a class="btn btn--ghost-dark" href="mailto:info@edlehoelzer.de?subject=Anfrage%20Produktdaten">Daten anfragen</a></div>';
    }

    var secondary = product.category === "board"
      ? '<a class="btn btn--ghost-dark" href="/pflege.html">Pflege lesen</a>'
      : '<a class="btn btn--ghost-dark" href="/schneidebretter-massivholz/">Bretter ansehen</a>';

    return '<div class="ctaRow"><a class="btn" href="' + escapeAttribute(product.etsyUrl) + '" target="_blank" rel="noopener">Bei Etsy ansehen</a>' + secondary + '</div>';
  }

  function labelFor(value) {
    var labels = {
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
