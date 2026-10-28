
/* Stackly — FAQ accordion, testimonial slider, footer year, misc UI */
(function () {
  "use strict";

  /* Footer year */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* FAQ accordion — one open at a time, keyboard accessible */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    var panel = item.querySelector(".faq-a");
    if (!btn || !panel) return;
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (other) {
        other.classList.remove("open");
        var ob = other.querySelector(".faq-q");
        var op = other.querySelector(".faq-a");
        if (ob) ob.setAttribute("aria-expanded", "false");
        if (op) op.style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });
  /* open first FAQ by default */
  var firstFaq = document.querySelector(".faq-item");
  if (firstFaq) {
    var fb = firstFaq.querySelector(".faq-q");
    if (fb) fb.click();
  }

  /* Testimonial slider (Vanilla) */
  document.querySelectorAll(".testi-slider").forEach(function (slider) {
    var track = slider.querySelector(".testi-track");
    var slides = slider.querySelectorAll(".testi-slide");
    var dotsWrap = slider.parentElement.querySelector(".testi-dots");
    var prev = slider.parentElement.querySelector(".testi-arrow.prev");
    var next = slider.parentElement.querySelector(".testi-arrow.next");
    if (!track || !slides.length) return;
    var index = 0, timer = null;

    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var d = document.createElement("button");
        d.type = "button";
        d.setAttribute("aria-label", "Go to testimonial " + (i + 1));
        d.addEventListener("click", function () { go(i); restart(); });
        dotsWrap.appendChild(d);
      });
    }
    var dots = dotsWrap ? dotsWrap.querySelectorAll("button") : [];

    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      dots.forEach(function (d, di) { d.classList.toggle("active", di === index); });
    }
    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () { go(index + 1); }, 6500);
    }
    if (prev) prev.addEventListener("click", function () { go(index - 1); restart(); });
    if (next) next.addEventListener("click", function () { go(index + 1); restart(); });
    slider.addEventListener("mouseenter", function () { if (timer) clearInterval(timer); });
    slider.addEventListener("mouseleave", restart);
    go(0); restart();
  });

  /* Simple demo toasts for generic [data-demo-btn] buttons */
  document.querySelectorAll("[data-demo-btn]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var note = btn.closest("form, section, div") ?
        btn.parentElement.querySelector(".form-status") : null;
      if (note) {
        note.className = "form-status show info";
        note.textContent = "Demonstration only — connect a backend to enable this action.";
      } else {
        alert("Demonstration only — connect a backend to enable this action.");
      }
    });
  });
})();
