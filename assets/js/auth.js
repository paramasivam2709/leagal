
/* Stackly — Auth UI: password toggles, strength meter, validation.
   Demo login routing is client-side only and must not be used for access control. */
(function () {
  "use strict";

  /* show / hide password toggles */
  document.querySelectorAll("[data-pw-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var input = document.getElementById(btn.getAttribute("data-pw-toggle"));
      if (!input) return;
      var show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.innerHTML = '<svg class="icon"><use href="' + (btn.getAttribute("data-sprite") || "assets/svg/legal-icons.svg") + '#' + (show ? "icon-eyeoff" : "icon-eye") + '"></use></svg>';
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });
  });

  /* password strength */
  var pw = document.getElementById("reg-password");
  var meter = document.getElementById("pwMeter");
  if (pw && meter) {
    pw.addEventListener("input", function () {
      var v = pw.value, score = 0;
      if (v.length >= 8) score++;
      if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
      if (/\d/.test(v)) score++;
      if (/[^A-Za-z0-9]/.test(v)) score++;
      meter.setAttribute("data-level", v ? String(Math.max(score, v.length >= 6 ? 1 : 0)) : "0");
    });
  }

  function err(field, msg) {
    var w = field.closest(".field");
    if (!w) return;
    w.classList.add("error");
    var m = w.querySelector(".err-msg");
    if (m && msg) m.textContent = msg;
  }
  function ok(field) { var w = field.closest(".field"); if (w) w.classList.remove("error"); }
  function emailOK(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }

  /* LOGIN */
  var login = document.getElementById("loginForm");
  if (login) {
    login.querySelectorAll("input").forEach(function (f) {
      f.addEventListener("input", function () { ok(f); });
    });
    login.addEventListener("submit", function (e) {
      e.preventDefault();
      var id = login.querySelector("#login-id");
      var pass = login.querySelector("#login-password");
      var role = login.querySelector('input[name="role"]:checked');
      var status = document.getElementById("authStatus");
      var good = true;
      if (!emailOK(id.value.trim())) { err(id, "Enter a valid email address."); good = false; }
      if (pass.value.length < 8) { err(pass, "Password must be at least 8 characters."); good = false; }
      if (!good) return;
      var btn = login.querySelector("button[type=submit]");
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Opening dashboard…';
      status.className = "form-status show info";
      status.textContent = "Demo mode only — this role selection does not authenticate or authorize access.";
      window.location.href = role && role.value === "admin"
        ? "dashboard/admin-dashboard.html"
        : "dashboard/user-dashboard.html";
    });
  }

  /* REGISTER */
  var reg = document.getElementById("registerForm");
  if (reg) {
    reg.querySelectorAll("input").forEach(function (f) {
      f.addEventListener("input", function () { ok(f); });
    });
    reg.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = reg.querySelector("#reg-name");
      var email = reg.querySelector("#reg-email");
      var phone = reg.querySelector("#reg-phone");
      var p1 = reg.querySelector("#reg-password");
      var p2 = reg.querySelector("#reg-password2");
      var terms = reg.querySelector("#reg-terms");
      var status = document.getElementById("authStatus");
      var good = true;
      if (name.value.trim().length < 2) { err(name, "Enter your full name."); good = false; }
      if (!emailOK(email.value.trim())) { err(email, "Enter a valid email address."); good = false; }
      if (!/^[+\d][\d\s\-()]{6,19}$/.test(phone.value.trim())) { err(phone, "Enter a valid phone number."); good = false; }
      if (p1.value.length < 8) { err(p1, "Use at least 8 characters."); good = false; }
      if (p2.value !== p1.value) { err(p2, "Passwords do not match."); good = false; }
      if (terms && !terms.checked) {
        good = false;
        status.className = "form-status show bad";
        status.textContent = "Please accept the Terms & Conditions to continue.";
        return;
      }
      if (!good) return;
      var btn = reg.querySelector("button[type=submit]");
      var orig = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Creating account…';
      setTimeout(function () {
        btn.disabled = false;
        btn.innerHTML = orig;
        status.className = "form-status show info";
        status.textContent = "Front-end validation passed. Account creation requires a secure backend — no account was created in this demonstration.";
      }, 1400);
    });
  }

  /* FORGOT PASSWORD — generic response, never reveals account existence */
  var forgot = document.getElementById("forgotForm");
  if (forgot) {
    forgot.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = forgot.querySelector("#forgot-email");
      var status = document.getElementById("authStatus");
      if (!emailOK(email.value.trim())) { err(email, "Enter a valid email address."); return; }
      status.className = "form-status show ok";
      status.textContent = "If an account exists for that email, password reset instructions will be sent. (Demo copy — connect a backend to send real emails.)";
      forgot.reset();
    });
  }
})();
