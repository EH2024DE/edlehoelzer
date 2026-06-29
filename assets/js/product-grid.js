(function () {
  var catalogPromise = null;

  function loadProducts() {
    if (!catalogPromise) {
      catalogPromise = fetch("/products.json")
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

          return products;
        });
    }

    return catalogPromise;
  }

  function renderProductGrid(containerId, filterFn, options) {
    var container = document.getElementById(containerId);
    var maxItems = options && Number(options.maxItems);
    if (!container) {
      return;
    }

    container.innerHTML = '<p class="productGridEmpty">Produkte werden geladen.</p>';

    loadProducts()
      .then(function (products) {
        var filtered = products
          .filter(function (product) {
            return product && product.active !== false;
          })
          .filter(function (product) {
            return typeof filterFn === "function" ? filterFn(product) : true;
          })
          .filter(function (product) {
            return product.image && product.etsyUrl;
          })
          .sort(sortProducts);

        if (maxItems > 0) {
          filtered = filtered.slice(0, maxItems);
        }

        if (!filtered.length) {
          renderFallback(container);
          return;
        }

        container.innerHTML = filtered.map(renderCard).join("");
      })
      .catch(function (error) {
        console.warn("[Edle Hölzer] Landingpage-Produkte konnten nicht geladen werden:", error);
        renderFallback(container);
      });
  }

  function sortProducts(a, b) {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }

    if (a.needsReview !== b.needsReview) {
      return a.needsReview ? 1 : -1;
    }

    return Number(a.priceOrder || 0) - Number(b.priceOrder || 0);
  }

  function renderCard(product) {
    var image = Array.isArray(product.gallery) && product.gallery[0] ? product.gallery[0] : product.image;
    var isEnglish = (document.documentElement.lang || "").toLowerCase().indexOf("en") === 0;
    var directListingUrl = product.etsyListingUrl || product.etsyUrl;
    var hasDirectListing = product.directListingUrlVerified === true && Boolean(directListingUrl);
    var detailsText = isEnglish ? "View details" : "Details ansehen";
    var compareText = isEnglish ? "Compare" : "Vergleichen";
    var actionText = hasDirectListing ? buyLabelFor(product, isEnglish) : (isEnglish ? "Find similar board" : "Ähnliches Brett finden");
    var actionUrl = hasDirectListing ? directListingUrl : (isEnglish ? "/en/products.html#product-finder" : "/produkte.html#produktfinder");
    var linkAttributes = hasDirectListing
      ? ' target="_blank" rel="noopener" data-etsy-link title="' +
        (isEnglish ? "You are leaving for the Edle Hölzer Etsy listing" : "Du wechselst jetzt zum Etsy-Angebot von Edle Hölzer") +
        '" data-goatcounter-click="true" data-goatcounter-title="etsy_click" data-umami-event="etsy-klick"'
      : ' data-umami-event="produktfinder-gestartet"';

    return '<article class="productCard seo-product-card">' +
      '<button class="productCard__link productCard__previewLink" type="button" data-product-preview="' + escapeAttribute(product.id) + '" data-product-source="landing">' +
        '<span class="productCard__media productCard__imgWrap"' + productImageStyle(product) + '>' +
          '<img src="' + escapeAttribute(image) + '" alt="' + escapeAttribute(productImageAlt(product)) + '" loading="lazy" decoding="async">' +
        '</span>' +
      '</button>' +
      '<div class="productCard__body">' +
          '<p class="productCard__segment">' + escapeHtml(product.segment || product.category || "Produkt") + '</p>' +
          '<h3 class="productCard__name">' + escapeHtml(product.displayName || displayProductName(product)) + '</h3>' +
          renderBadges(product) +
          renderFacts(product) +
          '<div class="productCard__footer">' +
            (product.priceLabel ? '<p class="productCard__price">' + escapeHtml(product.priceLabel) + '</p>' : "") +
            '<span class="productCard__buy">' +
              '<button class="productCard__cta" type="button" data-product-preview="' + escapeAttribute(product.id) + '" data-product-source="landing">' + escapeHtml(detailsText) + '</button>' +
              '<button class="productCard__cta productCard__cta--secondary" type="button" data-product-compare="' + escapeAttribute(product.id) + '" data-product-source="landing">' + escapeHtml(compareText) + '</button>' +
              '<a class="productCard__cta productCard__cta--etsy" href="' + escapeAttribute(actionUrl) + '"' + linkAttributes + '>' + escapeHtml(actionText) + '</a>' +
              (hasDirectListing
                ? '<span class="productCard__trust">' + (isEnglish ? "Checkout via Etsy · Buyer protection available there" : "Checkout über Etsy · Käuferschutz dort verfügbar") + '</span>'
                : "") +
            '</span>' +
          '</div>' +
        '</div>' +
    '</article>';
  }

  function buyLabelFor(product, isEnglish) {
    return isEnglish ? "View on Etsy" : "Auf Etsy ansehen";
  }

  function renderBadges(product) {
    var badges = Array.isArray(product.badges) ? product.badges : [];
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

    return '<div class="productBadgeRow productCard__badges">' + filtered.slice(0, 3).map(function (badge) {
      return '<span class="productCard__badge">' + escapeHtml(badge) + '</span>';
    }).join("") + '</div>';
  }

  function renderFacts(product) {
    var facts = [];

    if (product.material) {
      facts.push(["Material", product.material]);
    }
    if (product.category === "board" && hasMeaningfulValue(product.sizeLabel)) {
      facts.push(["Maße", product.sizeLabel]);
    }
    if (product.category === "board" && product.thicknessLabel && hasMeaningfulValue(product.thicknessLabel)) {
      facts.push(["Stärke", product.thicknessLabel]);
    }
    if (product.category === "accessory") {
      facts = [
        ["Typ", product.segment || "Küchenhelfer"],
        ["Material", product.material || "Holz"]
      ];
    }
    if (product.category === "care") {
      facts = [
        ["Typ", "Pflegeprodukt"],
        ["Basis", product.material || "Öl und Wachs"]
      ];
    }

    if (!facts.length) {
      return "";
    }

    return '<dl class="productFacts spec-tiles">' + facts.slice(0, 4).map(function (fact) {
      return '<div><dt>' + escapeHtml(fact[0]) + '</dt><dd>' + escapeHtml(fact[1]) + '</dd></div>';
    }).join("") + '</dl>';
  }

  function hasMeaningfulValue(value) {
    return value &&
      value !== "Format laut Etsy-Export" &&
      value !== "laut Etsy-Export" &&
      value !== "nicht relevant";
  }

  function hasMinimumBoardSize(product, minCm) {
    var size = String(product.sizeLabel || "");
    var match = size.match(/(\d+(?:[,.]\d+)?)\s*[x×]\s*(\d+(?:[,.]\d+)?)/i);

    if (!match) {
      return product.sizeProfile !== "compact";
    }

    var first = Number(match[1].replace(",", "."));
    var second = Number(match[2].replace(",", "."));

    return first >= minCm && second >= minCm;
  }

  function displayProductName(product) {
    var name = String(product.name || "");

    if (name.indexOf("|") !== -1) {
      name = name.split("|")[0];
    }

    name = name
      .replace(/:\s*\d{1,3}(?:[,.]\d+)?\s*[x×].*$/i, "")
      .replace(/\s+[–-]\s*\d{1,3}(?:[,.]\d+)?\s*[x×].*$/i, "")
      .replace(/\s{2,}/g, " ")
      .trim();

    return name || product.name || "Produkt ansehen";
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

  function renderFallback(container) {
    var isEnglish = (document.documentElement.lang || "").toLowerCase().indexOf("en") === 0;
    container.innerHTML =
      '<div class="productGridEmpty">' +
        '<p>' + (isEnglish ? "No suitable products are currently loaded for this selection." : "Aktuell sind für diese Auswahl keine passenden Produkte geladen.") + '</p>' +
        '<a href="' + (isEnglish ? "/en/products.html#products-grid" : "/produkte.html#produkte-grid") + '">' +
          (isEnglish ? "View all products" : "Alle Produkte ansehen") +
        '</a>' +
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

  window.renderProductGrid = renderProductGrid;
  window.productGridHasMinimumBoardSize = hasMinimumBoardSize;
})();
