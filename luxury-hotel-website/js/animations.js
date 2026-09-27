/**
 * Scroll reveals and animated statistics counters
 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function animateCounter(el) {
    if (el.dataset.counted === "true") return;

    var target = el.getAttribute("data-count");
    if (!target) return;

    var suffix = el.getAttribute("data-suffix") || "";
    var isFloat = target.indexOf(".") !== -1;
    var end = parseFloat(target);
    var duration = 1800;
    var startTime = null;

    el.dataset.counted = "true";

    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = end * eased;

      if (isFloat) {
        el.textContent = current.toFixed(1) + suffix;
      } else {
        el.textContent = Math.floor(current) + suffix;
      }

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }

    window.requestAnimationFrame(step);
  }

  if (!reduceMotion && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal, .image-reveal").forEach(function (el) {
      revealObserver.observe(el);
    });

    var statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.querySelectorAll("[data-count]").forEach(animateCounter);
          statsObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll("[data-stats]").forEach(function (section) {
      statsObserver.observe(section);
    });
  } else {
    document.querySelectorAll(".reveal, .image-reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
    document.querySelectorAll("[data-count]").forEach(function (el) {
      var target = el.getAttribute("data-count");
      var suffix = el.getAttribute("data-suffix") || "";
      if (target) el.textContent = target + suffix;
    });
  }

  /* Reviews slider */
  var reviewsRoot = document.querySelector(".reviews-slider");
  if (!reviewsRoot) return;

  var track = reviewsRoot.querySelector(".reviews-slider__slides");
  var slides = reviewsRoot.querySelectorAll(".reviews-slider__slide");
  var dotsContainer = reviewsRoot.querySelector(".reviews-slider__dots");
  var prevBtn = reviewsRoot.querySelector(".reviews-slider__arrow--prev");
  var nextBtn = reviewsRoot.querySelector(".reviews-slider__arrow--next");
  var reviewIndex = 0;
  var reviewTimer = null;

  function goToReview(index) {
    reviewIndex = (index + slides.length) % slides.length;
    track.style.transform = "translateX(-" + reviewIndex * 100 + "%)";
    if (dotsContainer) {
      dotsContainer.querySelectorAll(".reviews-slider__dot").forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === reviewIndex);
        dot.setAttribute("aria-selected", i === reviewIndex ? "true" : "false");
      });
    }
  }

  if (dotsContainer) {
    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "reviews-slider__dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", "Go to review " + (i + 1));
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-selected", i === 0 ? "true" : "false");
      dot.addEventListener("click", function () {
        goToReview(i);
        startReviewAutoplay();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function startReviewAutoplay() {
    if (reduceMotion || slides.length < 2) return;
    clearInterval(reviewTimer);
    reviewTimer = setInterval(function () {
      goToReview(reviewIndex + 1);
    }, 7000);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      goToReview(reviewIndex - 1);
      startReviewAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      goToReview(reviewIndex + 1);
      startReviewAutoplay();
    });
  }

  reviewsRoot.addEventListener("mouseenter", function () {
    clearInterval(reviewTimer);
  });

  reviewsRoot.addEventListener("mouseleave", startReviewAutoplay);

  startReviewAutoplay();
})();
