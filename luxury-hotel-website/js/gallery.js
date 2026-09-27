/**
 * Gallery filtering & Lightbox Modal for Aslam's Luxury Hotel
 */
(function () {
  "use strict";

  /* Category Filter Logic */
  var filterButtons = document.querySelectorAll(".filter-btn[data-filter]");
  var galleryCards = document.querySelectorAll(".gallery-card, .offer-card");

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var filter = btn.getAttribute("data-filter");

      filterButtons.forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");

      galleryCards.forEach(function (card) {
        var category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.classList.remove("is-hidden");
          card.style.display = "";
        } else {
          card.classList.add("is-hidden");
          card.style.display = "none";
        }
      });
    });
  });

  /* Lightbox Logic */
  var lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  var lightboxImg = lightbox.querySelector(".lightbox__image");
  var lightboxCaption = lightbox.querySelector(".lightbox__caption");
  var closeBtn = lightbox.querySelector(".lightbox__close");
  var prevBtn = lightbox.querySelector(".lightbox__arrow--prev");
  var nextBtn = lightbox.querySelector(".lightbox__arrow--next");

  var activeCards = [];
  var currentIndex = 0;

  function updateActiveCards() {
    activeCards = Array.prototype.slice.call(document.querySelectorAll(".gallery-card:not(.is-hidden)"));
  }

  function openLightbox(index) {
    updateActiveCards();
    if (!activeCards.length) return;

    currentIndex = (index + activeCards.length) % activeCards.length;
    var targetCard = activeCards[currentIndex];
    var img = targetCard.querySelector("img");
    var title = targetCard.querySelector(".gallery-card__title, .room-card__name, .venue-card__title");

    if (img && lightboxImg) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || "";
    }
    if (lightboxCaption) {
      var titleText = title ? title.textContent : "";
      var counterText = (currentIndex + 1) + " / " + activeCards.length;
      lightboxCaption.innerHTML = "<span class=\"lightbox__counter\">" + counterText + "</span>" + titleText;
    }

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  document.querySelectorAll(".gallery-card").forEach(function (card) {
    card.addEventListener("click", function () {
      updateActiveCards();
      var cardIdx = activeCards.indexOf(card);
      if (cardIdx !== -1) {
        openLightbox(cardIdx);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (prevBtn) {
    prevBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      openLightbox(currentIndex - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      openLightbox(currentIndex + 1);
    });
  }

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox || e.target.classList.contains("lightbox__dialog")) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") openLightbox(currentIndex - 1);
    if (e.key === "ArrowRight") openLightbox(currentIndex + 1);
  });
})();
