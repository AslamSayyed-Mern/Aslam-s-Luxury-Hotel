/**
 * Global site initialization (Phase 1)
 */
(function () {
  "use strict";

  var yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Back to Top Floating Button Logic */
  var backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) {
    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > 300) {
          backToTopBtn.classList.add("is-visible");
        } else {
          backToTopBtn.classList.remove("is-visible");
        }
      },
      { passive: true }
    );

    backToTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
})();
