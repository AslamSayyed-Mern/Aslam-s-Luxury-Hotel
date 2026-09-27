/**
 * Hero slideshow: autoplay, Ken Burns, swipe, keyboard
 */
(function () {
  "use strict";

  var hero = document.querySelector(".hero");
  if (!hero) return;

  var slides = hero.querySelectorAll(".hero__slide");
  var prevBtns = hero.querySelectorAll(".hero__arrow--prev");
  var nextBtns = hero.querySelectorAll(".hero__arrow--next");
  var counterCurrents = hero.querySelectorAll(".hero__counter-current");
  var counterTotals = hero.querySelectorAll(".hero__counter-total");

  if (!slides.length) return;

  var currentIndex = 0;
  var autoplayMs = 6500;
  var autoplayTimer = null;
  var touchStartX = 0;
  var touchEndX = 0;
  var swipeThreshold = 50;

  function pad(num) {
    return num < 10 ? "0" + num : String(num);
  }

  function updateCounter() {
    counterCurrents.forEach(function (el) {
      el.textContent = pad(currentIndex + 1);
    });
    counterTotals.forEach(function (el) {
      el.textContent = pad(slides.length);
    });
  }

  function goTo(index) {
    slides[currentIndex].classList.remove("is-active");
    slides[currentIndex].setAttribute("aria-hidden", "true");

    currentIndex = (index + slides.length) % slides.length;

    slides[currentIndex].classList.add("is-active");
    slides[currentIndex].setAttribute("aria-hidden", "false");

    var images = slides[currentIndex].querySelectorAll(".hero__image");
    images.forEach(function (img) {
      img.style.animation = "none";
      void img.offsetWidth;
      img.style.animation = "";
    });

    updateCounter();
  }

  function next() {
    goTo(currentIndex + 1);
  }

  function prev() {
    goTo(currentIndex - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = window.setInterval(next, autoplayMs);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  prevBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      prev();
      startAutoplay();
    });
  });

  nextBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      next();
      startAutoplay();
    });
  });

  hero.addEventListener("mouseenter", stopAutoplay);
  hero.addEventListener("mouseleave", startAutoplay);
  hero.addEventListener("focusin", stopAutoplay);
  hero.addEventListener("focusout", function (event) {
    if (!hero.contains(event.relatedTarget)) {
      startAutoplay();
    }
  });

  hero.addEventListener(
    "touchstart",
    function (event) {
      touchStartX = event.changedTouches[0].screenX;
    },
    { passive: true }
  );

  hero.addEventListener(
    "touchend",
    function (event) {
      touchEndX = event.changedTouches[0].screenX;
      var diff = touchEndX - touchStartX;
      if (Math.abs(diff) < swipeThreshold) return;
      if (diff > 0) {
        prev();
      } else {
        next();
      }
      startAutoplay();
    },
    { passive: true }
  );

  document.addEventListener("keydown", function (event) {
    if (!hero.matches(":hover") && document.activeElement && !hero.contains(document.activeElement)) {
      return;
    }
    if (event.key === "ArrowLeft") {
      prev();
      startAutoplay();
    }
    if (event.key === "ArrowRight") {
      next();
      startAutoplay();
    }
  });

  slides.forEach(function (slide, i) {
    slide.setAttribute("aria-hidden", i === 0 ? "false" : "true");
  });

  updateCounter();

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) {
    startAutoplay();
  }
})();
