/* =================================================================
   4½ GUYS — script.js
   Two small bits of JS:
     1. Toggle a "is-stuck" class on the sticky header once the
        user scrolls past the hero — so the checkered border appears.
     2. Fade-in-on-scroll for any element with class="reveal", using
        IntersectionObserver. Vanilla, no dependencies.
   ================================================================= */

(function () {
  "use strict";

  /* -----------------------------------------------------------
     1. Sticky-header scroll state
     ----------------------------------------------------------- */
  const header = document.getElementById("siteHeader");
  // Threshold = roughly the hero height. Using a small chunk of viewport
  // height means the border appears after the user starts scrolling
  // through the hero, not the moment they touch the page.
  const SCROLL_THRESHOLD = Math.round(window.innerHeight * 0.6);

  function onScroll() {
    if (!header) return;
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add("is-stuck");
    } else {
      header.classList.remove("is-stuck");
    }
  }

  // Passive listener — better scroll performance, we never preventDefault.
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // run once on load in case the page is reloaded mid-scroll


  /* -----------------------------------------------------------
     2. Fade-in-on-scroll for `.reveal` elements
        Respects prefers-reduced-motion via the CSS (which already
        skips the transform/opacity rules when reduced motion is on).
     ----------------------------------------------------------- */
  const reveals = document.querySelectorAll(".reveal");

  // If IntersectionObserver isn't supported (very old browsers),
  // just show everything immediately.
  if (!("IntersectionObserver" in window)) {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target); // one-shot — no re-trigger on scroll back up
        }
      });
    },
    {
      // Start the fade slightly before the element fully enters the viewport
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.1,
    }
  );

  reveals.forEach(function (el) {
    observer.observe(el);
  });
})();
