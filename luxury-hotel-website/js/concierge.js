/**
 * Virtual Concierge Widget & Floating Action Bar for Aslam's Luxury Hotel
 */
(function () {
  "use strict";

  var toggleBtn = document.querySelector(".concierge-toggle");
  var panel = document.querySelector(".concierge-panel");
  if (!panel || !toggleBtn) return;

  var closeBtn = panel.querySelector(".concierge-panel__close");
  var body = panel.querySelector(".concierge-panel__body");
  var form = panel.querySelector(".concierge-panel__form");
  var input = panel.querySelector(".concierge-panel__input");
  var badge = toggleBtn.querySelector(".concierge-toggle__badge");

  function openConcierge() {
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    toggleBtn.setAttribute("aria-expanded", "true");
    if (badge) badge.style.display = "none";
    if (input) {
      window.setTimeout(function () {
        input.focus();
      }, 150);
    }
  }

  function closeConcierge() {
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    toggleBtn.setAttribute("aria-expanded", "false");
    toggleBtn.focus();
  }

  toggleBtn.addEventListener("click", function () {
    if (panel.classList.contains("is-open")) {
      closeConcierge();
    } else {
      openConcierge();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeConcierge);
  }

  function appendMessage(text, sender) {
    var msg = document.createElement("div");
    msg.className = "concierge-msg concierge-msg--" + (sender || "bot");
    msg.innerHTML = '<div class="concierge-msg__bubble">' + text + "</div>";
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
  }

  function getBotReply(query) {
    var q = query.toLowerCase();

    if (q.indexOf("room") !== -1 || q.indexOf("suite") !== -1 || q.indexOf("stay") !== -1) {
      return "We offer 4 luxury room categories: <strong>Executive Room</strong> (38m²), <strong>Club Room</strong> (46m²), <strong>Executive Suite</strong> (68m²), and our crown jewel <strong>Presidential Suite</strong> (120m²). <br><br><a href='pages/rooms.html' style='color:#c4a574;text-decoration:underline;'>View Accommodations &rarr;</a>";
    }

    if (q.indexOf("dining") !== -1 || q.indexOf("food") !== -1 || q.indexOf("eat") !== -1 || q.indexOf("restaurant") !== -1 || q.indexOf("menu") !== -1) {
      return "Indulge in two culinary destinations: <strong>The Wild Fork</strong> (Wood-Fired International Fine Dining) and <strong>Via Milano</strong> (Authentic Regional Italian Ristorante & Wine Bar). <br><br><a href='pages/dining.html' style='color:#c4a574;text-decoration:underline;'>Explore Dining &rarr;</a>";
    }

    if (q.indexOf("event") !== -1 || q.indexOf("banquet") !== -1 || q.indexOf("wedding") !== -1 || q.indexOf("venue") !== -1 || q.indexOf("meeting") !== -1) {
      return "Aslam's Luxury Hotel features 6 bespoke venues, including our 650m² <strong>LeRoi Grand Ballroom</strong> and <strong>Sky Marvella Rooftop Terrace</strong>. <br><br><a href='pages/banquets.html' style='color:#c4a574;text-decoration:underline;'>Explore Event Venues &rarr;</a>";
    }

    if (q.indexOf("spa") !== -1 || q.indexOf("massage") !== -1 || q.indexOf("wellness") !== -1 || q.indexOf("pool") !== -1) {
      return "Our thermal spa offers aromatherapy massage, hydrotherapy suites, and access to our heated infinity rooftop pool. <br><br><a href='pages/facilities.html' style='color:#c4a574;text-decoration:underline;'>Discover Wellness Facilities &rarr;</a>";
    }

    if (q.indexOf("location") !== -1 || q.indexOf("address") !== -1 || q.indexOf("airport") !== -1 || q.indexOf("where") !== -1) {
      return "We are located at <strong>Medchal-Malkajgiri district, Hyderabad, Telangana 501401</strong>. We are 25 minutes from Rajiv Gandhi International Airport (HYD).";
    }

    if (q.indexOf("contact") !== -1 || q.indexOf("phone") !== -1 || q.indexOf("email") !== -1 || q.indexOf("call") !== -1) {
      return "You can reach our 24/7 concierge desk at <strong>+91 98765 43210</strong> or email <strong>reservations@aslamsluxuryhotel.com</strong>.";
    }

    if (q.indexOf("book") !== -1 || q.indexOf("reserve") !== -1 || q.indexOf("check") !== -1) {
      var modalUtil = window.AslamModal || window.VeloraModal;
      if (modalUtil) {
        modalUtil.open("booking-confirm-modal");
      }
      return "Opening room availability checker now...";
    }

    return "Thank you for reaching out to Aslam's Luxury Hotel Concierge. For personalized inquiries, please select one of the quick options below or call our desk directly at +91 98765 43210.";
  }

  function handleUserInput(text) {
    if (!text.trim()) return;
    appendMessage(text, "user");
    input.value = "";

    var typingMsg = document.createElement("div");
    typingMsg.className = "concierge-msg concierge-msg--bot concierge-msg--typing";
    typingMsg.innerHTML = '<div class="concierge-msg__bubble">Concierge is writing...</div>';
    body.appendChild(typingMsg);
    body.scrollTop = body.scrollHeight;

    window.setTimeout(function () {
      if (typingMsg.parentNode) {
        typingMsg.parentNode.removeChild(typingMsg);
      }
      var reply = getBotReply(text);
      appendMessage(reply, "bot");
    }, 600);
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      handleUserInput(input.value);
    });
  }

  document.addEventListener("click", function (e) {
    var chip = e.target.closest(".concierge-chip");
    if (chip) {
      var query = chip.getAttribute("data-query") || chip.textContent.trim();
      handleUserInput(query);
      return;
    }

    if (panel.classList.contains("is-open")) {
      if (!panel.contains(e.target) && !toggleBtn.contains(e.target)) {
        closeConcierge();
      }
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel.classList.contains("is-open")) {
      closeConcierge();
    }
  });
})();
