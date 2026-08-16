/* Townhall Immigration — cookie consent.
 *
 * Google Consent Mode v2. The inline gtag snippet in each page sets every
 * consent type to "denied" BEFORE gtag('config') runs, so no analytics cookie
 * is written and no hit is sent until someone actively accepts. This file
 * renders the banner and flips analytics_storage to "granted" on accept.
 *
 * The stored choice lives in localStorage, not a cookie, so declining leaves
 * nothing behind. "Change your cookie choice" on the privacy policy page
 * reopens the banner via [data-reopen-consent].
 */
(function () {
  "use strict";

  var KEY = "th-consent";
  var root = document.documentElement;

  function stored() {
    try { return window.localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function remember(v) {
    try { window.localStorage.setItem(KEY, v); } catch (e) { /* private mode */ }
  }

  function grant(granted) {
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: granted ? "granted" : "denied"
      });
    }
    if (granted && typeof window.gtag === "function") {
      // Consent arrived after page load, so send the page_view that was held back.
      window.gtag("event", "page_view", {
        page_path: window.location.pathname,
        page_title: document.title
      });
    }
  }

  function build() {
    var el = document.createElement("div");
    el.className = "consent";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-live", "polite");
    el.setAttribute("aria-label", "Cookie choice");
    el.innerHTML =
      '<div class="consent__in">' +
        '<p class="consent__text">' +
          "We use Google Analytics to see which pages are useful. It sets cookies. " +
          "Nothing is stored unless you accept. " +
          '<a href="privacy-policy">Read our privacy policy</a>.' +
        "</p>" +
        '<div class="consent__actions">' +
          '<button type="button" class="btn btn--ghost" data-consent="deny">Decline</button>' +
          '<button type="button" class="btn btn--primary" data-consent="allow">Accept analytics</button>' +
        "</div>" +
      "</div>";
    return el;
  }

  var banner = null;

  function show() {
    if (banner) { banner.hidden = false; return; }
    banner = build();
    document.body.appendChild(banner);
    // let the element paint before transitioning in
    requestAnimationFrame(function () { root.classList.add("has-consent-banner"); });

    banner.addEventListener("click", function (e) {
      var b = e.target.closest("[data-consent]");
      if (!b) return;
      var allow = b.getAttribute("data-consent") === "allow";
      grant(allow);
      remember(allow ? "granted" : "denied");
      root.classList.remove("has-consent-banner");
      banner.hidden = true;
    });
  }

  // Re-open from the privacy policy page
  document.addEventListener("click", function (e) {
    var link = e.target.closest("[data-reopen-consent]");
    if (!link) return;
    e.preventDefault();
    show();
  });

  var choice = stored();
  if (choice === "granted") {
    grant(true);
  } else if (choice === "denied") {
    // leave denied, no banner
  } else {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", show);
    } else {
      show();
    }
  }
})();
