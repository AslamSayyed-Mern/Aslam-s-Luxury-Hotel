/**
 * Booking bar validation and simulated confirmation
 */
(function () {
  "use strict";

  var form = document.getElementById("hero-booking-form");
  var summaryEl = document.getElementById("booking-summary");
  var checkInInput = document.getElementById("booking-checkin");
  var checkOutInput = document.getElementById("booking-checkout");

  if (!form) return;

  function todayIso() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString().split("T")[0];
  }

  function setMinDates() {
    var today = todayIso();
    if (checkInInput) checkInInput.setAttribute("min", today);
    if (checkOutInput) checkOutInput.setAttribute("min", today);
  }

  function clearErrors() {
    form.querySelectorAll(".booking-bar__error").forEach(function (el) {
      el.classList.remove("is-visible");
      el.textContent = "";
    });
    form.querySelectorAll(".booking-bar__input, .booking-bar__select").forEach(function (el) {
      el.classList.remove("booking-bar__input--error");
    });
  }

  function showError(fieldId, message) {
    var field = document.getElementById(fieldId);
    var errorEl = form.querySelector('[data-error-for="' + fieldId + '"]');
    if (field) field.classList.add("booking-bar__input--error");
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add("is-visible");
    }
  }

  function validate() {
    clearErrors();
    var valid = true;

    var checkIn = checkInInput ? checkInInput.value : "";
    var checkOut = checkOutInput ? checkOutInput.value : "";
    var adults = document.getElementById("booking-adults");
    var children = document.getElementById("booking-children");
    var rooms = document.getElementById("booking-rooms");

    var today = todayIso();

    if (!checkIn) {
      showError("booking-checkin", "Please select a check-in date.");
      valid = false;
    } else if (checkIn < today) {
      showError("booking-checkin", "Check-in cannot be in the past.");
      valid = false;
    }

    if (!checkOut) {
      showError("booking-checkout", "Please select a check-out date.");
      valid = false;
    } else if (checkOut <= checkIn) {
      showError("booking-checkout", "Check-out must be after check-in.");
      valid = false;
    }

    var adultsVal = adults ? parseInt(adults.value, 10) : 0;
    var childrenVal = children ? parseInt(children.value, 10) : 0;
    var roomsVal = rooms ? parseInt(rooms.value, 10) : 0;

    if (!adultsVal || adultsVal < 1 || adultsVal > 8) {
      showError("booking-adults", "Enter 1–8 adults.");
      valid = false;
    }

    if (childrenVal < 0 || childrenVal > 6) {
      showError("booking-children", "Enter 0–6 children.");
      valid = false;
    }

    if (!roomsVal || roomsVal < 1 || roomsVal > 5) {
      showError("booking-rooms", "Enter 1–5 rooms.");
      valid = false;
    }

    return {
      valid: valid,
      data: {
        checkIn: checkIn,
        checkOut: checkOut,
        adults: adultsVal,
        children: childrenVal,
        rooms: roomsVal,
      },
    };
  }

  function formatDate(iso) {
    if (!iso) return "";
    var parts = iso.split("-");
    var date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var result = validate();
    if (!result.valid) return;

    if (summaryEl) {
      summaryEl.innerHTML =
        "<strong>Check-in:</strong> " +
        formatDate(result.data.checkIn) +
        "<br><strong>Check-out:</strong> " +
        formatDate(result.data.checkOut) +
        "<br><strong>Guests:</strong> " +
        result.data.adults +
        " adult(s), " +
        result.data.children +
        " child(ren)<br><strong>Rooms:</strong> " +
        result.data.rooms;
    }

    var modalUtil = window.AslamModal || window.VeloraModal;
    if (modalUtil) {
      modalUtil.open("booking-confirm-modal", form.querySelector('[type="submit"]'));
    }
  });

  if (checkInInput) {
    checkInInput.addEventListener("change", function () {
      if (checkOutInput && checkInInput.value) {
        var nextDay = new Date(checkInInput.value);
        nextDay.setDate(nextDay.getDate() + 1);
        checkOutInput.setAttribute("min", nextDay.toISOString().split("T")[0]);
        if (checkOutInput.value && checkOutInput.value <= checkInInput.value) {
          checkOutInput.value = "";
        }
      }
    });
  }

  setMinDates();

  function scrollToBooking(trigger) {
    var bar = document.getElementById("booking-bar");
    if (!bar) return;
    bar.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(function () {
      if (checkInInput) checkInInput.focus();
    }, 400);
    if (trigger) trigger.blur();
  }

  var headerBook = document.getElementById("header-book-btn");
  var mobileBook = document.getElementById("mobile-book-btn");

  if (headerBook) {
    headerBook.addEventListener("click", function () {
      scrollToBooking(headerBook);
    });
  }

  if (mobileBook) {
    mobileBook.addEventListener("click", function () {
      var mobileMenu = document.querySelector(".mobile-menu");
      if (mobileMenu && mobileMenu.classList.contains("mobile-menu--open")) {
        document.querySelector(".mobile-menu__close").click();
      }
      window.setTimeout(function () {
        scrollToBooking(mobileBook);
      }, 350);
    });
  }
})();
