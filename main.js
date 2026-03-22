if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("pageshow", (event) => {
  if (!event.persisted) {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.getElementById("menuButton");
  const closeButton = document.getElementById("menuCloseButton");
  const mobileMenu = document.getElementById("mobileMenu");
  const menuBackdrop = document.getElementById("menuBackdrop");

  function openMenu() {
    mobileMenu?.classList.add("is-open");
    menuBackdrop?.classList.add("is-open");
    menuButton?.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    mobileMenu?.classList.remove("is-open");
    menuBackdrop?.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  function toggleMenu() {
    const isOpen = mobileMenu?.classList.contains("is-open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", toggleMenu);
    closeButton?.addEventListener("click", closeMenu);
    menuBackdrop?.addEventListener("click", closeMenu);

    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    });
  }

  const video = document.querySelector(".hero__video");
  if (video) {
    const p = video.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {});
    }
  }

  if (window.innerWidth <= 900) return;

  const scrolly = document.querySelector(".scrolly");
  if (!scrolly) return;

  const frame = document.getElementById("scrollyFrame");
  const progressBar = document.getElementById("scrollyProgress");
  const images = [...scrolly.querySelectorAll(".scrolly__image")];
  const steps = [...scrolly.querySelectorAll(".scrollyStep")];
  if (!frame || !images.length || !steps.length) return;

  let activeIndex = 0;
  let ticking = false;
  let smooth = 0;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function activate(index) {
    if (index === activeIndex) return;
    activeIndex = index;
    images.forEach((img, i) => img.classList.toggle("is-active", i === index));
    steps.forEach((step, i) => step.classList.toggle("is-active", i === index));
    if (progressBar) {
      progressBar.style.width = `${((index + 1) / images.length) * 100}%`;
    }
  }

  function getClosestStepIndex() {
    const viewportCenter = window.innerHeight * 0.54;
    let closestIndex = 0;
    let closestDistance = Infinity;

    steps.forEach((step, index) => {
      const rect = step.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const distance = Math.abs(viewportCenter - center);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }

  function animateFrame() {
    if (reducedMotion) return;

    const rect = scrolly.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    if (total <= 0) return;

    let raw = (-rect.top) / total;
    raw = Math.max(0, Math.min(1, raw));
    smooth += (raw - smooth) * 0.07;

    const translateY = (smooth - 0.5) * -14;
    const scale = 1 + (1 - Math.abs(smooth - 0.5) * 2) * 0.008;

    frame.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
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
