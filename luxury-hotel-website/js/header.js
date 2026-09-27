/**
 * Site header: scroll state, priority-plus overflow menu, mobile drawer, keyboard accessibility
 */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var menuToggle = document.querySelector(".site-header__menu-toggle");
  var mobileMenu = document.querySelector(".mobile-menu");
  var menuClose = document.querySelector(".mobile-menu__close");
  var backdrop = document.querySelector(".mobile-menu__backdrop");
  var focusableSelector =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

  if (!header) return;

  var scrollThreshold = 60;
  var lastScrollY = window.scrollY;

  function setHeaderSolid(isSolid) {
    header.classList.toggle("site-header--solid", isSolid);
    header.classList.toggle("site-header--transparent", !isSolid);
  }

  // Ensure menuToggle is inside .site-header__menu-wrapper
  var menuWrapper = document.querySelector(".site-header__menu-wrapper");
  if (!menuWrapper && menuToggle) {
    menuWrapper = document.createElement("div");
    menuWrapper.className = "site-header__menu-wrapper";
    menuToggle.parentNode.insertBefore(menuWrapper, menuToggle);
    menuWrapper.appendChild(menuToggle);
  }

  var overflowDropdown = menuWrapper ? menuWrapper.querySelector(".site-header__overflow-dropdown") : null;
  if (menuWrapper && !overflowDropdown) {
    overflowDropdown = document.createElement("ul");
    overflowDropdown.className = "site-header__dropdown site-header__overflow-dropdown";
    overflowDropdown.setAttribute("aria-label", "More navigation links");
    menuWrapper.appendChild(overflowDropdown);
  }

  function populateOverflowDropdown() {
    if (!overflowDropdown) return;

    var navList = document.querySelector(".site-header__nav-list");
    if (!navList) return;

    var overflowItems = navList.querySelectorAll(".site-header__nav-item.is-overflow");
    var targetItems = overflowItems.length > 0 ? Array.from(overflowItems) : Array.from(navList.children);

    overflowDropdown.innerHTML = "";

    targetItems.forEach(function (item) {
      var mainLink = item.querySelector(".site-header__nav-link");
      var subDropdown = item.querySelector(".site-header__dropdown");

      if (!mainLink) return;

      var li = document.createElement("li");

      if (subDropdown) {
        var groupTitle = document.createElement("div");
        groupTitle.className = "site-header__dropdown-group-title";
        groupTitle.textContent = mainLink.textContent.trim();
        li.appendChild(groupTitle);

        var subLinks = subDropdown.querySelectorAll(".site-header__dropdown-link");
        subLinks.forEach(function (subLink) {
          var subA = document.createElement("a");
          subA.className = "site-header__dropdown-sublink";
          subA.href = subLink.getAttribute("href");
          subA.textContent = subLink.textContent.trim();
          li.appendChild(subA);
        });
      } else {
        var a = document.createElement("a");
        a.className = "site-header__dropdown-link";
        a.href = mainLink.getAttribute("href");
        a.textContent = mainLink.textContent.trim();
        li.appendChild(a);
      }

      overflowDropdown.appendChild(li);
    });
  }

  function updateHeaderOnScroll() {
    var currentY = window.scrollY;
    setHeaderSolid(currentY > scrollThreshold);
    lastScrollY = currentY;
  }

  function updateOverflowMenu() {
    var nav = document.querySelector(".site-header__nav");
    var navList = document.querySelector(".site-header__nav-list");
    var mobileList = document.querySelector(".mobile-menu__list");
    var headerInner = document.querySelector(".site-header__inner");
    var logo = document.querySelector(".site-header__logo");
    var actions = document.querySelector(".site-header__actions");

    if (!nav || !navList || !mobileList || !headerInner || !logo || !actions) return;

    var navItems = Array.from(navList.children);
    var mobileItems = Array.from(mobileList.children);

    // On mobile screens <= 576px, header contains ONLY Logo & Hamburger icon.
    // All menu items are moved into the mobile drawer.
    if (window.innerWidth <= 576) {
      navItems.forEach(function (item) {
        item.classList.add("is-overflow");
      });
      mobileItems.forEach(function (item) {
        item.classList.remove("is-hidden");
      });
      if (menuToggle) {
        menuToggle.style.display = "flex";
      }
      return;
    }

    // Step 1: Un-overflow all desktop nav items so we can measure their natural widths
    navItems.forEach(function (item) {
      item.classList.remove("is-overflow");
    });

    var innerWidth = headerInner.clientWidth;
    var logoWidth = logo.offsetWidth;
    var actionsWidth = actions.offsetWidth;
    var toggleWidth = 54; // Width of hamburger button when shown

    // Available width when hamburger is hidden:
    var maxAvailableWidth = innerWidth - logoWidth - actionsWidth - 24;

    // Measure widths of each nav item
    var totalItemsWidth = 0;
    var itemWidths = navItems.map(function (item) {
      var w = item.getBoundingClientRect().width;
      totalItemsWidth += w + 2;
      return w;
    });

    var hasOverflow = false;
    var currentWidth = 0;

    if (totalItemsWidth > maxAvailableWidth) {
      // Hamburger button will be visible, so subtract its width from available space
      var availableWidthWithToggle = maxAvailableWidth - toggleWidth;

      navItems.forEach(function (item, index) {
        var w = itemWidths[index];
        if (currentWidth + w > availableWidthWithToggle) {
          item.classList.add("is-overflow");
          hasOverflow = true;
          if (mobileItems[index]) {
            mobileItems[index].classList.remove("is-hidden");
          }
        } else {
          currentWidth += w + 2;
          item.classList.remove("is-overflow");
          if (mobileItems[index]) {
            mobileItems[index].classList.add("is-hidden");
          }
        }
      });
    } else {
      // All items fit! No overflow needed
      navItems.forEach(function (item, index) {
        item.classList.remove("is-overflow");
        if (mobileItems[index]) {
          mobileItems[index].classList.add("is-hidden");
        }
      });
      hasOverflow = false;
    }

    if (menuToggle) {
      menuToggle.style.display = hasOverflow ? "flex" : "none";
    }

    populateOverflowDropdown();
  }

  function openMobileMenu() {
    if (!mobileMenu || !menuToggle) return;

    mobileMenu.classList.add("mobile-menu--open");
    header.classList.add("site-header--menu-open");
    document.body.classList.add("mobile-menu-active");
    menuToggle.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");

    var firstLink = mobileMenu.querySelector(".mobile-menu__link:not(.is-hidden), .mobile-menu__close");
    if (firstLink) firstLink.focus();
  }

  function closeMobileMenu() {
    if (!mobileMenu || !menuToggle) return;

    mobileMenu.classList.remove("mobile-menu--open");
    header.classList.remove("site-header--menu-open");
    document.body.classList.remove("mobile-menu-active");
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
  }

  function isMobileMenuOpen() {
    return mobileMenu && mobileMenu.classList.contains("mobile-menu--open");
  }

  function trapFocus(event) {
    if (!isMobileMenuOpen() || event.key !== "Tab" || !mobileMenu) return;

    var focusable = mobileMenu.querySelectorAll(focusableSelector);
    if (!focusable.length) return;

    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  updateHeaderOnScroll();
  updateOverflowMenu();

  window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });
  window.addEventListener("resize", function () {
    updateOverflowMenu();
  });
  window.addEventListener("orientationchange", function () {
    setTimeout(updateOverflowMenu, 100);
  });

  if (menuToggle) {
    menuToggle.addEventListener("click", function (e) {
      if (window.innerWidth <= 576) {
        if (isMobileMenuOpen()) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      } else {
        e.stopPropagation();
        if (menuWrapper) {
          menuWrapper.classList.toggle("is-open");
          menuToggle.setAttribute("aria-expanded", menuWrapper.classList.contains("is-open") ? "true" : "false");
        }
      }
    });
  }

  document.addEventListener("click", function (e) {
    if (menuWrapper && window.innerWidth > 576) {
      if (!menuWrapper.contains(e.target)) {
        menuWrapper.classList.remove("is-open");
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
      }
    }
  });

  if (menuClose) {
    menuClose.addEventListener("click", closeMobileMenu);
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeMobileMenu);
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (isMobileMenuOpen()) {
        closeMobileMenu();
      }
      if (menuWrapper) {
        menuWrapper.classList.remove("is-open");
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
      }
    }
    trapFocus(event);
  });

  var mobileLinks = document.querySelectorAll(".mobile-menu__link, .mobile-menu__sublink");
  mobileLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      closeMobileMenu();
    });
  });

  var subToggles = document.querySelectorAll(".mobile-menu__sub-toggle");
  subToggles.forEach(function (toggle) {
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      e.preventDefault();
      var parentItem = toggle.closest(".mobile-menu__item--has-sub");
      if (parentItem) {
        parentItem.classList.toggle("is-open");
      }
    });
  });
})();

