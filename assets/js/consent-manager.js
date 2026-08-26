(function () {
  "use strict";

  var CONSENT_VERSION = "2026-08-23.1";
  var STORAGE_KEY = "edleHoelzerConsent";
  var DEFAULT_CONSENT = {
    necessary: true,
    analytics: false,
    marketing: false
  };
  var GA4_MEASUREMENT_ID = "";
  var UMAMI_WEBSITE_ID = "9c072a65-fef4-48ce-a03c-6f1e9d443acc";
  var UMAMI_SRC = "https://cloud.umami.is/script.js";
  var GOATCOUNTER_SRC = "https://gc.zgo.at/count.js";
  var GOATCOUNTER_ENDPOINT = "https://edlehoelzer.goatcounter.com/count";
  var loaded = {};
  var eventQueue = [];
  var activeConsent = Object.assign({}, DEFAULT_CONSENT);

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied"
  });

  var services = {
    necessary: [
      {
        id: "edle-hoelzer-ui",
        name: "Website-Funktionen",
        provider: "Edle Hölzer",
        purpose: "Navigation, Produktvergleich, Consent-Speicherung und ausdrücklich angeforderte Kontaktlinks."
      }
    ],
    analytics: [
      {
        id: "umami",
        name: "Umami",
        provider: "Umami Software, Inc.",
        purpose: "Reichweiten- und Nutzungsanalyse ohne Freitextinhalte."
      },
      {
        id: "goatcounter",
        name: "GoatCounter",
        provider: "GoatCounter",
        purpose: "Reichweiten- und Klickmessung."
      }
    ],
    marketing: [
      {
        id: "youtube-nocookie",
        name: "YouTube",
        provider: "Google Ireland Limited",
        purpose: "Einbettung von Pflegevideos und externen Medieninhalten."
      }
    ]
  };

  function isEnglish() {
    return (document.documentElement.lang || "").toLowerCase().indexOf("en") === 0 ||
      window.location.pathname.indexOf("/en/") === 0;
  }

  function text() {
    if (isEnglish()) {
      return {
        title: "Your privacy. Your choice.",
        intro: "We use necessary technologies so this website works reliably. With your consent, we would also like to understand which content and products are relevant to visitors. We only use marketing technologies if you explicitly allow them.",
        acceptAll: "Accept all",
        necessaryOnly: "Necessary only",
        settings: "Settings",
        save: "Save selection",
        close: "Close",
        alwaysActive: "Always active",
        necessaryTitle: "Necessary",
        necessaryText: "Required for basic functions and secure delivery of this website.",
        analyticsTitle: "Statistics",
        analyticsText: "Helps us understand which pages and functions are used and where we can improve the website.",
        marketingTitle: "Marketing",
        marketingText: "Allows external media such as embedded videos and, if used later, campaign measurement or personalised advertising.",
        services: "Services",
        settingsLink: "Cookie settings"
      };
    }

    return {
      title: "Ihre Privatsphäre. Ihre Entscheidung.",
      intro: "Wir verwenden notwendige Technologien, damit diese Website zuverlässig funktioniert. Mit Ihrer Zustimmung möchten wir zusätzlich verstehen, welche Inhalte und Produkte für Besucher relevant sind. Marketing-Technologien setzen wir nur ein, wenn Sie ihnen ausdrücklich zustimmen.",
      acceptAll: "Alle akzeptieren",
      necessaryOnly: "Nur notwendige",
      settings: "Einstellungen",
      save: "Auswahl speichern",
      close: "Schließen",
      alwaysActive: "Immer aktiv",
      necessaryTitle: "Notwendig",
      necessaryText: "Erforderlich für grundlegende Funktionen und die sichere Bereitstellung dieser Website.",
      analyticsTitle: "Statistik",
      analyticsText: "Hilft uns zu verstehen, welche Seiten und Funktionen genutzt werden und wo wir die Website verbessern können.",
      marketingTitle: "Marketing",
      marketingText: "Ermöglicht externe Medien wie eingebettete Videos sowie - sofern später eingesetzt - Kampagnenmessung oder personalisierte Werbung.",
      services: "Dienste",
      settingsLink: "Cookie-Einstellungen"
    };
  }

  function readConsent() {
    try {
      var raw = window.localStorage && window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== CONSENT_VERSION) return null;
      return {
        necessary: true,
        analytics: parsed.analytics === true,
        marketing: parsed.marketing === true,
        timestamp: parsed.timestamp || "",
        method: parsed.method || "unknown"
      };
    } catch (error) {
      return null;
    }
  }

  function writeConsent(consent, method) {
    var payload = {
      version: CONSENT_VERSION,
      necessary: true,
      analytics: consent.analytics === true,
      marketing: consent.marketing === true,
      timestamp: new Date().toISOString(),
      method: method || "custom"
    };

    try {
      if (window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }
    } catch (error) {}

    return payload;
  }

  function updateConsentMode(consent) {
    if (typeof window.gtag !== "function") return;
    window.gtag("consent", "update", {
      analytics_storage: consent.analytics ? "granted" : "denied",
      ad_storage: consent.marketing ? "granted" : "denied",
      ad_user_data: consent.marketing ? "granted" : "denied",
      ad_personalization: consent.marketing ? "granted" : "denied"
    });
  }

  function applyConsent(consent, method) {
    activeConsent = Object.assign({}, DEFAULT_CONSENT, consent, { necessary: true });
    updateConsentMode(activeConsent);
    activateExternalMedia();

    if (method) {
      writeConsent(activeConsent, method);
    }

    if (activeConsent.analytics) {
      loadAnalytics();
    } else {
      disableAnalytics();
      removeAnalyticsCookies();
    }
  }

  function createScript(id, src, attributes) {
    if (loaded[id] || document.querySelector("script[data-consent-service='" + id + "']")) return;
    loaded[id] = true;
    var script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;
    script.setAttribute("data-consent-service", id);
    Object.keys(attributes || {}).forEach(function (key) {
      script.setAttribute(key, attributes[key]);
    });
    script.addEventListener("load", flushEvents);
    document.head.appendChild(script);
  }

  function loadAnalytics() {
    createScript("umami", UMAMI_SRC, {
      "data-website-id": UMAMI_WEBSITE_ID,
      "data-exclude-hash": "true",
      "data-domains": "edlehoelzer.de,www.edlehoelzer.de"
    });
    createScript("goatcounter", GOATCOUNTER_SRC, {
      "data-goatcounter": GOATCOUNTER_ENDPOINT
    });

    if (GA4_MEASUREMENT_ID) {
      createScript("ga4", "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA4_MEASUREMENT_ID), {});
      window.gtag("js", new Date());
      window.gtag("config", GA4_MEASUREMENT_ID, { anonymize_ip: true });
    }
  }

  function disableAnalytics() {
    eventQueue = [];
    ["umami", "goatcounter", "ga4"].forEach(function (id) {
      document.querySelectorAll("script[data-consent-service='" + id + "']").forEach(function (script) {
        script.remove();
      });
      loaded[id] = false;
    });
    try {
      window.umami = undefined;
      window.goatcounter = undefined;
    } catch (error) {}
  }

  function sanitizePayload(payload) {
    var allowed = {
      page: true,
      page_type: true,
      language: true,
      cta_location: true,
      source: true,
      source_page: true,
      position: true,
      product_id: true,
      product_category: true,
      wood: true,
      wood_type: true,
      service: true,
      host: true,
      label: true
    };
    var clean = {};
    Object.keys(payload || {}).forEach(function (key) {
      if (!allowed[key]) return;
      var value = payload[key];
      if (value === undefined || value === null || typeof value === "object") return;
      clean[key] = String(value).slice(0, 120);
    });
    clean.language = clean.language || (isEnglish() ? "en" : "de");
    clean.page = clean.page || window.location.pathname.replace(/\/index\.html$/, "/") || "/";
    return clean;
  }

  function normalizeEventName(name) {
    return String(name || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 40) || "interaction";
  }

  function track(name, payload) {
    var eventName = normalizeEventName(name);
    var cleanPayload = sanitizePayload(payload || {});
    if (!activeConsent.analytics) return;

    if (window.umami && typeof window.umami.track === "function") {
      try {
        window.umami.track(eventName, cleanPayload);
      } catch (error) {}
    } else {
      eventQueue.push({ name: eventName, payload: cleanPayload });
    }

    if (GA4_MEASUREMENT_ID && typeof window.gtag === "function") {
      try {
        window.gtag("event", eventName, cleanPayload);
      } catch (error) {}
    }
  }

  function flushEvents() {
    if (!activeConsent.analytics || !window.umami || typeof window.umami.track !== "function") return;
    var pending = eventQueue.splice(0, eventQueue.length);
    pending.forEach(function (item) {
      try {
        window.umami.track(item.name, item.payload);
      } catch (error) {}
    });
  }

  function removeAnalyticsCookies() {
    ["_ga", "_gid", "_gat", "_gat_gtag", "_gcl_au"].forEach(function (name) {
      deleteCookie(name);
    });
  }

  function activateExternalMedia() {
    document.querySelectorAll("[data-consent-src]").forEach(function (element) {
      var placeholder = element.closest("[data-consent-media]") && element.closest("[data-consent-media]").querySelector("[data-consent-media-placeholder]");
      if (!activeConsent.marketing) {
        if (element.getAttribute("src")) {
          element.removeAttribute("src");
        }
        if (placeholder) placeholder.hidden = false;
        return;
      }
      if (!element.getAttribute("src")) {
        element.setAttribute("src", element.getAttribute("data-consent-src"));
      }
      if (placeholder) placeholder.hidden = true;
    });
  }

  function deleteCookie(name) {
    var host = window.location.hostname;
    var domains = ["", host, "." + host.replace(/^www\./, "")];
    domains.forEach(function (domain) {
      document.cookie = name + "=; Max-Age=0; path=/;" + (domain ? " domain=" + domain + ";" : "") + " SameSite=Lax";
    });
  }

  function injectConsentStyles() {
    if (document.querySelector("[data-consent-styles]")) return;
    var style = document.createElement("style");
    style.setAttribute("data-consent-styles", "");
    style.textContent = [
      ".consentBanner{position:fixed;right:clamp(12px,3vw,28px);bottom:calc(12px + env(safe-area-inset-bottom));left:clamp(12px,3vw,28px);z-index:9999;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:18px;align-items:end;max-width:980px;margin:0 auto;padding:18px;border:1px solid rgba(17,17,17,.12);border-radius:10px;background:rgba(250,247,241,.96);box-shadow:0 18px 52px rgba(34,24,16,.18);backdrop-filter:blur(14px)}",
      ".consentBanner__copy h2,.consentModal h2{margin:0 0 8px;font-family:Georgia,serif;font-size:clamp(24px,3.2vw,38px);line-height:1.05;letter-spacing:0}.consentBanner__copy p,.consentChoice p{margin:0;color:rgba(17,17,17,.68);font-size:14px;line-height:1.55}",
      ".consentBanner__actions,.consentModal__actions{display:flex;flex-wrap:wrap;gap:10px;justify-content:flex-end}.consentButton,.consentMedia__button{min-height:44px;padding:12px 16px;border:1px solid rgba(170,113,65,.45);border-radius:6px;background:#fff;color:#9a633a;font:800 12px/1.1 Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}.consentButton--primary{border-color:#bd8655;background:#bd8655;color:#fff}.consentButton--text{background:transparent}",
      ".consentModal{position:fixed;inset:0;z-index:10000;display:grid;place-items:end center;padding:20px;background:rgba(20,16,13,.35)}.consentModal__panel{position:relative;width:min(720px,100%);max-height:min(86vh,760px);overflow:auto;padding:24px;border:1px solid rgba(17,17,17,.12);border-radius:10px;background:#faf7f1;box-shadow:0 22px 60px rgba(17,17,17,.24)}.consentModal__close{position:absolute;top:12px;right:12px;width:42px;height:42px;border:1px solid rgba(17,17,17,.14);border-radius:999px;background:#fff;color:#111;font-size:24px;cursor:pointer}",
      ".consentChoice{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:18px;align-items:start;margin-top:14px;padding:18px;border:1px solid rgba(17,17,17,.1);border-radius:8px;background:#fff}.consentChoice h3{margin:0 0 6px;font-size:17px;line-height:1.2}.consentChoice details{margin-top:10px;color:rgba(17,17,17,.62);font-size:13px}.consentChoice summary{cursor:pointer;font-weight:800}.consentChoice ul{display:grid;gap:8px;margin:10px 0 0;padding:0;list-style:none}.consentChoice li span{display:block}.consentBadge{display:inline-flex;align-items:center;min-height:34px;padding:8px 10px;border-radius:999px;background:#f4eee6;color:rgba(17,17,17,.68);font-size:12px;font-weight:800}",
      ".consentSwitch{position:relative;display:inline-flex;width:56px;height:32px}.consentSwitch input{position:absolute;opacity:0}.consentSwitch span{position:absolute;inset:0;border:1px solid rgba(17,17,17,.18);border-radius:999px;background:#ece5dc;cursor:pointer}.consentSwitch span:after{content:'';position:absolute;top:4px;left:4px;width:22px;height:22px;border-radius:999px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.16);transition:transform .18s ease}.consentSwitch input:checked+span{border-color:#bd8655;background:#bd8655}.consentSwitch input:checked+span:after{transform:translateX(24px)}",
      ".footerConsentLink{display:block;width:max-content;margin:0;padding:0;border:0;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer}.footerConsentLink:hover,.footerConsentLink:focus-visible{color:#bd8655}.consentMedia{position:relative;min-height:220px}.consentMedia iframe:not([src]){display:none}.consentMedia__placeholder{display:grid;gap:10px;place-content:center;min-height:220px;padding:24px;border:1px solid rgba(116,83,53,.18);border-radius:8px;background:#f6f0e8;color:#1b1511;text-align:center}.consentMedia__placeholder strong{font:800 13px/1.2 Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase}.consentMedia__placeholder p{max-width:34rem;margin:0 auto;color:rgba(17,17,17,.66);font-size:15px;line-height:1.5}",
      "@media(max-width:720px){.consentBanner{grid-template-columns:1fr;gap:14px;padding:15px}.consentBanner__actions,.consentModal__actions{display:grid;grid-template-columns:1fr 1fr;width:100%}.consentBanner__actions .consentButton--text{grid-column:1/-1}.consentButton{width:100%;padding-inline:10px}.consentModal{padding:10px}.consentModal__panel{max-height:82vh;padding:18px}.consentChoice{grid-template-columns:1fr;gap:12px}}"
    ].join("");
    document.head.appendChild(style);
  }

  function serviceList(category) {
    var list = services[category] || [];
    if (!list.length) return "";
    return "<ul>" + list.map(function (service) {
      return "<li><strong>" + escapeHtml(service.name) + "</strong><span>" + escapeHtml(service.provider) + " - " + escapeHtml(service.purpose) + "</span></li>";
    }).join("") + "</ul>";
  }

  function renderBanner() {
    if (document.querySelector("[data-consent-root]")) return;
    var t = text();
    var root = document.createElement("section");
    root.className = "consentBanner";
    root.setAttribute("data-consent-root", "");
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "false");
    root.setAttribute("aria-labelledby", "consent-title");
    root.innerHTML =
      '<div class="consentBanner__copy">' +
        '<h2 id="consent-title">' + escapeHtml(t.title) + '</h2>' +
        '<p>' + escapeHtml(t.intro) + '</p>' +
      '</div>' +
      '<div class="consentBanner__actions">' +
        '<button type="button" class="consentButton consentButton--primary" data-consent-accept-all>' + escapeHtml(t.acceptAll) + '</button>' +
        '<button type="button" class="consentButton" data-consent-necessary>' + escapeHtml(t.necessaryOnly) + '</button>' +
        '<button type="button" class="consentButton consentButton--text" data-consent-settings>' + escapeHtml(t.settings) + '</button>' +
      '</div>';
    document.body.appendChild(root);
    bindBanner(root);
  }

  function bindBanner(root) {
    root.addEventListener("click", function (event) {
      if (event.target.closest("[data-consent-accept-all]")) {
        applyConsent({ analytics: true, marketing: true }, "accept_all");
        removeConsentUi();
      }
      if (event.target.closest("[data-consent-necessary]")) {
        applyConsent({ analytics: false, marketing: false }, "necessary_only");
        removeConsentUi();
      }
      if (event.target.closest("[data-consent-settings]")) {
        renderPreferenceCenter();
      }
    });
  }

  function renderPreferenceCenter() {
    removePreferenceCenter();
    var t = text();
    var root = document.createElement("section");
    root.className = "consentModal";
    root.setAttribute("data-consent-modal", "");
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-labelledby", "consent-settings-title");
    root.innerHTML =
      '<div class="consentModal__panel">' +
        '<button type="button" class="consentModal__close" data-consent-close aria-label="' + escapeHtml(t.close) + '">×</button>' +
        '<h2 id="consent-settings-title">' + escapeHtml(t.settings) + '</h2>' +
        consentRow("necessary", t.necessaryTitle, t.necessaryText, true, false, t.alwaysActive) +
        consentRow("analytics", t.analyticsTitle, t.analyticsText, false, activeConsent.analytics, "") +
        consentRow("marketing", t.marketingTitle, t.marketingText, false, activeConsent.marketing, "") +
        '<div class="consentModal__actions">' +
          '<button type="button" class="consentButton consentButton--primary" data-consent-save>' + escapeHtml(t.save) + '</button>' +
          '<button type="button" class="consentButton" data-consent-necessary>' + escapeHtml(t.necessaryOnly) + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(root);
    root.querySelector(".consentModal__panel").focus();
    bindPreferenceCenter(root);
  }

  function consentRow(id, title, description, locked, checked, badge) {
    var toggle = locked ?
      '<span class="consentBadge">' + escapeHtml(badge) + '</span>' :
      '<label class="consentSwitch"><input type="checkbox" data-consent-toggle="' + id + '"' + (checked ? " checked" : "") + '><span></span></label>';

    return '<section class="consentChoice">' +
      '<div><h3>' + escapeHtml(title) + '</h3><p>' + escapeHtml(description) + '</p><details><summary>' + escapeHtml(text().services) + '</summary>' + serviceList(id) + '</details></div>' +
      toggle +
    '</section>';
  }

  function bindPreferenceCenter(root) {
    root.addEventListener("click", function (event) {
      if (event.target.closest("[data-consent-close]")) {
        removePreferenceCenter();
      }
      if (event.target.closest("[data-consent-necessary]")) {
        applyConsent({ analytics: false, marketing: false }, "necessary_only");
        removeConsentUi();
      }
      if (event.target.closest("[data-consent-save]")) {
        applyConsent({
          analytics: root.querySelector("[data-consent-toggle='analytics']").checked,
          marketing: root.querySelector("[data-consent-toggle='marketing']").checked
        }, "custom");
        removeConsentUi();
      }
    });
    root.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        removePreferenceCenter();
      }
    });
  }

  function removeConsentUi() {
    var banner = document.querySelector("[data-consent-root]");
    if (banner) banner.remove();
    removePreferenceCenter();
  }

  function removePreferenceCenter() {
    var modal = document.querySelector("[data-consent-modal]");
    if (modal) modal.remove();
  }

  function injectFooterLink() {
    if (document.querySelector(".footerConsentLink[data-open-consent-settings]")) return;
    var t = text();
    var link = document.createElement("button");
    link.type = "button";
    link.className = "footerConsentLink";
    link.setAttribute("data-open-consent-settings", "");
    link.textContent = t.settingsLink;

    var target = document.querySelector(".footer__group:last-child") || document.querySelector("footer") || document.body;
    target.appendChild(link);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function init() {
    injectConsentStyles();
    document.addEventListener("click", function (event) {
      if (event.target.closest("[data-open-consent-settings]")) {
        renderPreferenceCenter();
      }
    });
    injectFooterLink();
    var saved = readConsent();
    if (saved) {
      applyConsent(saved, "");
    } else {
      applyConsent(DEFAULT_CONSENT, "");
      renderBanner();
    }
  }

  window.EdleConsent = {
    version: CONSENT_VERSION,
    services: services,
    get: function () { return Object.assign({}, activeConsent); },
    openSettings: renderPreferenceCenter,
    apply: applyConsent
  };

  window.EdleAnalytics = {
    track: track
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
