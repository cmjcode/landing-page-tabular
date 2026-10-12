document.addEventListener("DOMContentLoaded", function () {
  // ------------------------------------------------------------------
  // Sticky header: solid background once the page has scrolled a bit
  // ------------------------------------------------------------------
  const header = document.getElementById("siteHeader");
  const setHeaderState = () => {
    if (window.scrollY > 12) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };
  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  // ------------------------------------------------------------------
  // Mobile menu toggle
  // ------------------------------------------------------------------
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  menuToggle.addEventListener("click", function () {
    navMenu.classList.toggle("active");
    menuToggle.classList.toggle("open");
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      menuToggle.classList.remove("open");
    });
  });

  document.addEventListener("click", function (e) {
    if (window.innerWidth <= 768) {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove("active");
        menuToggle.classList.remove("open");
      }
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      navMenu.classList.remove("active");
      menuToggle.classList.remove("open");
    }
  });

  // ------------------------------------------------------------------
  // GitHub star count (graceful fallback if the API is unreachable,
  // e.g. rate-limited or the page is opened via file://)
  // ------------------------------------------------------------------
  const ghStarText = document.getElementById("ghStarText");
  if (ghStarText) {
    fetch("https://api.github.com/repos/cmjcode/tabular")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        if (typeof data.stargazers_count === "number") {
          const count = data.stargazers_count;
          const formatted = count >= 1000 ? (count / 1000).toFixed(1) + "k" : String(count);
          ghStarText.textContent = `${formatted} stars on GitHub`;
        }
      })
      .catch(() => {
        // Keep the static "Star on GitHub" label already in the DOM.
      });
  }

  // ------------------------------------------------------------------
  // Lightbox for screenshots
  // ------------------------------------------------------------------
  window.openLightbox = function (src) {
    const lightbox = document.getElementById("lightbox");
    if (lightbox) {
      lightbox.querySelector("img").src = src;
      lightbox.classList.add("active");
    }
  };
  window.closeLightbox = function () {
    const lightbox = document.getElementById("lightbox");
    if (lightbox) {
      lightbox.classList.remove("active");
    }
  };
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") window.closeLightbox();
  });

  // ------------------------------------------------------------------
  // VanillaTilt (elements already carry data-tilt attributes; the CDN
  // bundle auto-inits on load, this call is a safe no-op fallback)
  // ------------------------------------------------------------------
  if (window.VanillaTilt) {
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"));
  }

  // ------------------------------------------------------------------
  // GSAP scroll reveals
  // ------------------------------------------------------------------
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      ".hero-content > *",
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power2.out", delay: 0.1 }
    );
    gsap.fromTo(
      ".hero-image",
      { opacity: 0, y: 24, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power2.out", delay: 0.3 }
    );

    const revealOnScroll = (selector, opts = {}) => {
      gsap.utils.toArray(selector).forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: (opts.stagger || 0) * i,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      });
    };

    revealOnScroll(".section-head", { stagger: 0 });
    revealOnScroll(".group-title", { stagger: 0.05 });
    revealOnScroll(".bento-card", { stagger: 0.06 });
    revealOnScroll(".ai-flow", { stagger: 0 });
    revealOnScroll(".ai-pillar", { stagger: 0.1 });
    revealOnScroll(".ai-compare-wrap, .ai-cta", { stagger: 0.08 });
    revealOnScroll(".flow-step", { stagger: 0.12 });
    revealOnScroll(".sec-badge", { stagger: 0.04 });
    revealOnScroll(".db-card", { stagger: 0.06 });
    revealOnScroll(".screenshot-card", { stagger: 0.08 });
    revealOnScroll(".platform", { stagger: 0.1 });
    revealOnScroll(".about-top, .about-bottom", { stagger: 0.1 });
  }

  // Note: the ambient ".glow" blobs already move via a pure-CSS "drift"
  // keyframe animation (see style.css). They intentionally do NOT also
  // get a JS-driven transform here — doing both fights over the same
  // `transform` property every frame and reads as constant flicker/jitter.
});
