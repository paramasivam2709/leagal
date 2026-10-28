
/* Stackly — Header, sticky state, mobile menu, dropdown, active link, back-to-top */
(function () {
  "use strict";
  var header = document.getElementById("siteHeader");
  var backTop = document.getElementById("backTop");

  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 40);
    if (backTop) backTop.classList.toggle("show", window.scrollY > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backTop) {
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Active nav link */
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav]").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) a.classList.add("active");
  });

  /* Mobile menu */
  var burger = document.getElementById("hamburger");
  var mnav = document.getElementById("mobileNav");
  var mclose = document.getElementById("mobileClose");
  function openMenu() { if (mnav) { mnav.classList.add("open"); document.body.style.overflow = "hidden"; } }
  function closeMenu() { if (mnav) { mnav.classList.remove("open"); document.body.style.overflow = ""; } }
  if (burger) burger.addEventListener("click", openMenu);
  if (mclose) mclose.addEventListener("click", closeMenu);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  document.querySelectorAll("#mobileNav a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  /* Mobile practice-areas accordion toggle */
  var subToggle = document.getElementById("mobilePaToggle");
  var sub = document.getElementById("mobilePaSub");
  if (subToggle && sub) {
    subToggle.addEventListener("click", function (e) {
      e.preventDefault();
      var open = sub.style.display === "flex";
      sub.style.display = open ? "none" : "flex";
      subToggle.setAttribute("aria-expanded", String(!open));
    });
  }
})();
