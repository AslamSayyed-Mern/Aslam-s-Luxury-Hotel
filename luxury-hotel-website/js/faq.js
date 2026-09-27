/**
 * FAQ Accordion & Location Tab Switcher for Aslam's Luxury Hotel
 */
(function () {
  "use strict";

  /* FAQ Accordion Logic */
  var accordionHeaders = document.querySelectorAll(".accordion__header");

  accordionHeaders.forEach(function (header) {
    header.addEventListener("click", function () {
      var item = header.closest(".accordion__item");
      var isExpanded = header.getAttribute("aria-expanded") === "true";

      /* Close all open accordion items in the same container */
      var parent = item.closest(".accordion");
      if (parent) {
        parent.querySelectorAll(".accordion__item").forEach(function (otherItem) {
          if (otherItem !== item) {
            otherItem.classList.remove("is-active");
            var otherHeader = otherItem.querySelector(".accordion__header");
            var otherBody = otherItem.querySelector(".accordion__body");
            if (otherHeader) otherHeader.setAttribute("aria-expanded", "false");
            if (otherBody) otherBody.setAttribute("aria-hidden", "true");
          }
        });
      }

      /* Toggle current item */
      if (isExpanded) {
        item.classList.remove("is-active");
        header.setAttribute("aria-expanded", "false");
        var body = item.querySelector(".accordion__body");
        if (body) body.setAttribute("aria-hidden", "true");
      } else {
        item.classList.add("is-active");
        header.setAttribute("aria-expanded", "true");
        var activeBody = item.querySelector(".accordion__body");
        if (activeBody) activeBody.setAttribute("aria-hidden", "false");
      }
    });
  });

  /* FAQ Category Filter Logic */
  var faqFilterBtns = document.querySelectorAll(".faq-filter-btn");
  var faqItems = document.querySelectorAll(".accordion__item");

  faqFilterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var filter = btn.getAttribute("data-filter");

      faqFilterBtns.forEach(function (b) {
        b.classList.remove("is-active");
      });
      btn.classList.add("is-active");

      faqItems.forEach(function (item) {
        var category = item.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          item.style.display = "";
        } else {
          item.style.display = "none";
          item.classList.remove("is-active");
        }
      });
    });
  });

  /* Location Tab Switcher Logic */
  var locTabBtns = document.querySelectorAll(".location-tab-btn");
  var locTabPanels = document.querySelectorAll(".location-tab-panel");

  locTabBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var targetTab = btn.getAttribute("data-tab");

      locTabBtns.forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");

      locTabPanels.forEach(function (panel) {
        var tabName = panel.getAttribute("data-tab-panel");
        if (tabName === targetTab) {
          panel.classList.add("is-active");
          panel.style.display = "";
        } else {
          panel.classList.remove("is-active");
          panel.style.display = "none";
        }
      });
    });
  });
})();
