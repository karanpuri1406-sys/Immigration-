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
  // Each rail is paired with its buttons through aria-controls, so any number
  // of scrollers on a page work without extra wiring.
  Array.prototype.forEach.call(
    document.querySelectorAll(".scroller__rail"),
    function (rail) {
      var id = rail.id;
      var prev = document.querySelector('[data-scroll="prev"][aria-controls="' + id + '"]');
      var next = document.querySelector('[data-scroll="next"][aria-controls="' + id + '"]');
      var nav = prev ? prev.parentNode : null;

      function step() {
        var card = rail.firstElementChild;
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
  );

  /* ---- Current year in the footer ---- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---- Enquiry form ----
     Posts to Formspree over fetch so the person stays on the page instead of
     being bounced to a third-party thank-you screen. The form still carries a
     real action and method, so if this script fails to load the browser falls
     back to a normal POST and the enquiry is not lost. */
  var form = document.querySelector("[data-enquiry-form]");
  if (form && window.fetch) {
    var status = form.querySelector("[data-form-status]");
    var submit = form.querySelector('[type="submit"]');
    var submitLabel = submit ? submit.textContent : "";

    function say(message, state) {
      if (!status) return;
      status.hidden = false;
      status.textContent = message;
      status.setAttribute("data-state", state);
      status.focus();
    }

    form.addEventListener("submit", function (e) {
      // Let the browser show its own messages for empty required fields.
      if (!form.checkValidity()) return;

      e.preventDefault();
      if (status) status.hidden = true;
      if (submit) {
        submit.setAttribute("aria-busy", "true");
        submit.textContent = "Sending…";
      }

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            say(
              "Thank you. Your enquiry has reached us and we will come back to you with an assessment. " +
                "If it is urgent, call or message us on WhatsApp.",
              "ok"
            );
          } else {
            return res.json().then(function (data) {
              var detail =
                data && data.errors
                  ? data.errors.map(function (x) { return x.message; }).join(", ")
                  : "";
              say(
                "That did not send" + (detail ? " (" + detail + ")" : "") +
                  ". Please try again, or call or message us on WhatsApp.",
                "err"
              );
            });
          }
        })
        .catch(function () {
          say(
            "That did not send. Check your connection and try again, or call or message us on WhatsApp.",
            "err"
          );
        })
        .then(function () {
          if (submit) {
            submit.removeAttribute("aria-busy");
            submit.textContent = submitLabel;
          }
        });
    });
  }
})();
