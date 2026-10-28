
/* Stackly — AOS + GSAP hero timeline, typed headline, animated counters, scroll reveals, parallax */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* AOS init (CDN) */
  if (window.AOS && !reduced) {
    window.AOS.init({ duration: 800, easing: "ease-out-cubic", once: true, offset: 70 });
  }

  /* GSAP hero entrance */
  var hero = document.querySelector(".hero");
  if (hero && !reduced && window.gsap) {
    hero.classList.remove("gsap-off");
    var tl = window.gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(hero.querySelectorAll("[data-hero]"),
        { y: 46, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.13 })
      .fromTo(".hero-visual", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.1, ease: "power2.out" }, "-=0.8")
      .fromTo(".hero-badge", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.15 }, "-=0.5");
    /* subtle parallax on hero image */
    var bg = hero.querySelector(".hero-bg img");
    if (bg) {
      window.addEventListener("scroll", function () {
        var y = window.scrollY;
        if (y < window.innerHeight) bg.style.transform = "translateY(" + y * 0.18 + "px)";
      }, { passive: true });
    }
  } else if (hero) {
    hero.classList.add("gsap-off");
  }

  /* Custom typed effect (Vanilla) */
  document.querySelectorAll("[data-typed]").forEach(function (el) {
    var phrases;
    try { phrases = JSON.parse(el.getAttribute("data-typed")); }
    catch (e) { phrases = [el.textContent]; }
    if (reduced) { el.textContent = phrases[0]; return; }
    var pi = 0, ci = 0, deleting = false;
    var cursor = '<span class="typed-cursor">|</span>';
    function tick() {
      var word = phrases[pi];
      ci += deleting ? -1 : 1;
      el.innerHTML = word.slice(0, ci) + cursor;
      var delay = deleting ? 34 : 62;
      if (!deleting && ci === word.length) { delay = 2100; deleting = true; }
      else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 420; }
      setTimeout(tick, delay);
    }
    tick();
  });

  /* Animated counters */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1900, start = null;
    if (reduced) { el.textContent = target + suffix; return; }
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var counted = new WeakSet();
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting && !counted.has(en.target)) {
        counted.add(en.target);
        animateCount(en.target);
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll("[data-count]").forEach(function (el) { io.observe(el); });

  /* CSS-scroll reveals for .reveal elements (works with or without AOS) */
  var rio = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("revealed"); rio.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal:not([data-aos])").forEach(function (el) { rio.observe(el); });
})();
