/* [BUSINESS NAME] Migration Consultants — shared behaviour */
(function () {
  "use strict";

  /* ---- Mobile navigation ---- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("menu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    // Close when a link is chosen
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a") && menu.classList.contains("is-open")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    // Close on Escape, return focus to the toggle
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });

    // Reset when resizing back up to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- Scroll reveal (skipped when reduced motion is requested) ---- */
  var reveals = document.querySelectorAll(".reveal");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reveals.length && !reduced && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-in");
    });
  }

  /* ---- Services scroller ----
     The rail scrolls natively, so touch, trackpad and keyboard already work
     without this. These buttons are a convenience layer: they page by one
     card width and disable themselves at each end. If everything already
     fits on screen, they hide entirely. */
  var rail = document.getElementById("svc-rail");
  if (rail) {
    var nav = document.querySelector(".scroller__nav");
    var prev = document.querySelector('[data-scroll="prev"]');
    var next = document.querySelector('[data-scroll="next"]');

    function step() {
      var card = rail.querySelector(".svc");
      if (!card) return rail.clientWidth;
      var gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
      return card.getBoundingClientRect().width + gap;
    }

    function sync() {
      var overflows = rail.scrollWidth - rail.clientWidth > 4;
      if (nav) nav.hidden = !overflows;
      if (!overflows) return;
      var max = rail.scrollWidth - rail.clientWidth;
      if (prev) prev.disabled = rail.scrollLeft <= 2;
      if (next) next.disabled = rail.scrollLeft >= max - 2;
    }

    function page(dir) {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      rail.scrollBy({ left: dir * step(), behavior: reduce ? "auto" : "smooth" });
    }

    if (prev) prev.addEventListener("click", function () { page(-1); });
    if (next) next.addEventListener("click", function () { page(1); });

    rail.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    sync();
  }

  /* ---- Current year in the footer ---- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---- Enquiry form ----
     Static demo handler. Replace with a real endpoint (Formspree, Netlify
     Forms, Web3Forms, or the client's CRM) before going live. See README.md. */
  var form = document.querySelector("[data-enquiry-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector("[data-form-status]");
      if (status) {
        status.hidden = false;
        status.textContent =
          "This form is not connected yet. Connect a form endpoint before launch, then remove this handler from assets/js/main.js.";
        status.focus();
      }
    });
  }
})();
