/* Townhall Immigration — analytics events.
 *
 * The base gtag snippet is inline in each page's <head>; this file adds the
 * events worth having on a lead-generation site. Everything is delegated from
 * document, so sections added later are tracked without touching this file.
 *
 * Events sent:
 *   generate_lead    enquiry form submitted successfully  (GA4 recommended)
 *   form_start       first interaction with the form
 *   form_error       submission failed
 *   contact_click    phone / email / whatsapp tapped, with `method`
 *   cta_click        any button, with its label and the section it sits in
 *   faq_open         an FAQ question expanded, with the question text
 *   scroller_nav     services or testimonials rail paged
 *   outbound_click   link to another domain
 *   scroll_depth     25 / 50 / 75 / 100 percent of the page reached
 */
(function () {
  "use strict";

  function send(name, params) {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", name, params || {});
  }

  // Exposed so main.js can report form outcomes without importing anything.
  window.thTrack = send;

  var clean = function (s) {
    return (s || "").replace(/\s+/g, " ").trim().slice(0, 100);
  };

  // Nearest section heading, so a click can be attributed to where it happened.
  function sectionOf(el) {
    var sec = el.closest("section");
    if (!sec) return "unknown";
    var h = sec.querySelector("h1, h2");
    return h ? clean(h.textContent) : (sec.className || "unknown");
  }

  /* ---- Clicks ---- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a");

    if (a && a.href) {
      var href = a.getAttribute("href") || "";

      if (href.indexOf("tel:") === 0) {
        send("contact_click", { method: "phone", link_url: href });
      } else if (href.indexOf("mailto:") === 0) {
        send("contact_click", { method: "email", link_url: href });
      } else if (href.indexOf("wa.me") > -1) {
        send("contact_click", { method: "whatsapp", link_url: href });
      } else if (/^https?:/i.test(href) && a.hostname !== window.location.hostname) {
        send("outbound_click", { link_url: href, link_domain: a.hostname });
      }
    }

    var btn = e.target.closest(".btn");
    if (btn) {
      send("cta_click", {
        cta_label: clean(btn.textContent),
        cta_section: sectionOf(btn),
        page_path: window.location.pathname
      });
    }

    var nav = e.target.closest("[data-scroll]");
    if (nav) {
      send("scroller_nav", {
        direction: nav.getAttribute("data-scroll"),
        rail: nav.getAttribute("aria-controls") || "unknown"
      });
    }
  }, true);

  /* ---- FAQ ---- */
  Array.prototype.forEach.call(document.querySelectorAll(".faq details"), function (d) {
    d.addEventListener("toggle", function () {
      if (!d.open) return;
      var s = d.querySelector("summary");
      send("faq_open", { question: s ? clean(s.textContent) : "unknown" });
    });
  });

  /* ---- Form engagement ---- */
  var form = document.querySelector("[data-enquiry-form]");
  if (form) {
    var started = false;
    form.addEventListener("input", function () {
      if (started) return;
      started = true;
      send("form_start", { form_name: "assessment_request" });
    }, { once: false });
  }

  /* ---- Scroll depth ---- */
  var marks = [25, 50, 75, 100];
  var hit = {};
  var ticking = false;

  function checkDepth() {
    ticking = false;
    var doc = document.documentElement;
    var scrollable = doc.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    var pct = Math.round(((window.scrollY || doc.scrollTop) / scrollable) * 100);
    for (var i = 0; i < marks.length; i++) {
      var m = marks[i];
      if (pct >= m && !hit[m]) {
        hit[m] = true;
        send("scroll_depth", { percent_scrolled: m, page_path: window.location.pathname });
      }
    }
  }

  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(checkDepth);
  }, { passive: true });
})();
