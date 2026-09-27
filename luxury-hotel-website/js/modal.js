/**
 * Accessible modal dialog utility
 */
(function () {
  "use strict";

  var openModals = [];
  var focusableSelector =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

  function getFocusable(container) {
    return Array.prototype.slice.call(container.querySelectorAll(focusableSelector));
  }

  function openModal(modalId, triggerEl) {
    var modal = document.getElementById(modalId);
    if (!modal) return;

    modal.dataset.triggerId = triggerEl && triggerEl.id ? triggerEl.id : "";
    if (triggerEl) {
      modal._previousFocus = triggerEl;
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    openModals.push(modal);

    var dialog = modal.querySelector(".modal__dialog");
    var focusTarget = modal.querySelector(".modal__close") || dialog;
    if (focusTarget) {
      window.setTimeout(function () {
        focusTarget.focus();
      }, 50);
    }
  }

  function closeModal(modal) {
    if (!modal) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    openModals = openModals.filter(function (m) {
      return m !== modal;
    });

    if (!openModals.length) {
      document.body.classList.remove("modal-open");
    }

    if (modal._previousFocus) {
      modal._previousFocus.focus();
      modal._previousFocus = null;
    }
  }

  function closeTopModal() {
    var modal = openModals[openModals.length - 1];
    closeModal(modal);
  }

  function trapFocus(event) {
    if (event.key !== "Tab" || !openModals.length) return;

    var modal = openModals[openModals.length - 1];
    var dialog = modal.querySelector(".modal__dialog");
    if (!dialog) return;

    var focusable = getFocusable(dialog);
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

  document.addEventListener("click", function (event) {
    var openTrigger = event.target.closest("[data-modal-open]");
    if (openTrigger) {
      event.preventDefault();
      openModal(openTrigger.getAttribute("data-modal-open"), openTrigger);
      return;
    }

    var closeTrigger = event.target.closest("[data-modal-close]");
    if (closeTrigger) {
      event.preventDefault();
      var modalEl = closeTrigger.closest(".modal");
      closeModal(modalEl);
      return;
    }

    if (event.target.classList.contains("modal__backdrop")) {
      closeModal(event.target.closest(".modal"));
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && openModals.length) {
      closeTopModal();
    }
    trapFocus(event);
  });

  window.AslamModal = {
    open: openModal,
    close: closeModal,
  };
  window.VeloraModal = window.AslamModal;
})();
