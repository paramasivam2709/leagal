
/* Stackly — Consultation + newsletter form validation (usability only, not a security boundary) */
(function () {
  "use strict";

  function setError(field, msg) {
    var wrap = field.closest(".field");
    if (!wrap) return;
    wrap.classList.add("error");
    var em = wrap.querySelector(".err-msg");
    if (em && msg) em.textContent = msg;
  }
  function clearError(field) {
    var wrap = field.closest(".field");
    if (wrap) wrap.classList.remove("error");
  }
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
  function validPhone(v) { return /^[+\d][\d\s\-()]{6,19}$/.test(v); }

  var form = document.getElementById("consultationForm");
  if (form) {
    form.querySelectorAll("input, select, textarea").forEach(function (f) {
      f.addEventListener("input", function () { clearError(f); });
      f.addEventListener("change", function () { clearError(f); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      var name = form.querySelector("#cf-name");
      var email = form.querySelector("#cf-email");
      var phone = form.querySelector("#cf-phone");
      var service = form.querySelector("#cf-service");
      var date = form.querySelector("#cf-date");
      var msg = form.querySelector("#cf-message");
      var consent = form.querySelector("#cf-consent");
      var status = form.querySelector("#formStatus");

      if (name.value.trim().length < 2) { setError(name, "Please enter your full name."); ok = false; }
      if (!validEmail(email.value.trim())) { setError(email, "Please enter a valid email address."); ok = false; }
      if (!validPhone(phone.value.trim())) { setError(phone, "Please enter a valid phone number."); ok = false; }
      if (!service.value) { setError(service, "Please select a service."); ok = false; }
      if (!date.value) { setError(date, "Please choose a preferred date."); ok = false; }
      if (msg.value.trim().length < 12) { setError(msg, "Please describe your matter (min. 12 characters)."); ok = false; }
      if (consent && !consent.checked) {
        ok = false;
        if (status) {
          status.className = "form-status show bad";
          status.textContent = "Please accept the privacy notice before submitting.";
        }
        return;
      }
      if (!ok) return;

      var btn = form.querySelector("button[type=submit]");
      var original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Sending…';

      /* Front-end demo only: no booking is created without a backend. */
      setTimeout(function () {
        btn.disabled = false;
        btn.innerHTML = original;
        status.className = "form-status show info";
        status.textContent = "Request validated successfully. This is a front-end demonstration — no consultation was booked. Connect a secure backend to store and confirm requests.";
        form.reset();
      }, 1400);
    });
  }

  /* Newsletter */
  document.querySelectorAll(".news-form").forEach(function (nf) {
    nf.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = nf.querySelector("input[type=email]");
      if (!input || !validEmail(input.value.trim())) {
        input && input.focus();
        input && (input.style.color = "#F2A6A0");
        setTimeout(function () { input.style.color = ""; }, 1200);
        return;
      }
      input.value = "";
      input.placeholder = "Subscribed (demo) — thank you!";
    });
  });
})();
