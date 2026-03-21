if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");

  let menuCloseTimeout;

  function openMenu() {
    clearTimeout(menuCloseTimeout);
    if (mobileMenu) mobileMenu.classList.add("is-open");
    if (menuButton) menuButton.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    clearTimeout(menuCloseTimeout);
    menuCloseTimeout = setTimeout(() => {
      if (mobileMenu) mobileMenu.classList.remove("is-open");
      if (menuButton) menuButton.setAttribute("aria-expanded", "false");
    }, 120);
  }

  if (menuButton && mobileMenu) {
    const isTouchDevice = window.matchMedia("(hover: none)").matches;

    if (!isTouchDevice) {
      menuButton.addEventListener("mouseenter", openMenu);
      menuButton.addEventListener("mouseleave", closeMenu);
      mobileMenu.addEventListener("mouseenter", openMenu);
      mobileMenu.addEventListener("mouseleave", closeMenu);
    }

    menuButton.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  const video = document.querySelector(".hero__video");
  if (video) {
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }

  const scrolly = document.querySelector(".scrolly");
  if (!scrolly) return;

  const frame = document.getElementById("scrollyFrame");
  const progressBar = document.getElementById("scrollyProgress");
  const images = Array.from(scrolly.querySelectorAll(".scrolly__image"));
  const steps = Array.from(scrolly.querySelectorAll(".scrollyStep"));
  if (!frame || !images.length || !steps.length) return;

  let activeIndex = 0;
  let ticking = false;
  let smooth = 0;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const activate = (index) => {
    if (index === activeIndex) return;
    activeIndex = index;

    images.forEach((img, i) => img.classList.toggle("is-active", i === index));
    steps.forEach((step, i) => step.classList.toggle("is-active", i === index));

    if (progressBar) {
      const progress = ((index + 1) / images.length) * 100;
      progressBar.style.width = `${progress}%`;
    }
  };

  const getClosestStepIndex = () => {
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
  };

  const animateFrame = () => {
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
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;

    window.requestAnimationFrame(() => {
      activate(getClosestStepIndex());
      animateFrame();
      ticking = false;
    });
  };

  activate(0);
  animateFrame();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
});
