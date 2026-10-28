
/* Stackly — Preloader (respects prefers-reduced-motion, no artificial delays beyond minimum paint) */
(function () {
  "use strict";
  var pre = document.getElementById("preloader");
  if (!pre) return;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) { pre.remove(); return; }
  var done = false;
  function finish() {
    if (done) return;
    done = true;
    pre.classList.add("done");
    setTimeout(function () { pre.remove(); }, 700);
  }
  window.addEventListener("load", function () { setTimeout(finish, 350); });
  setTimeout(finish, 3200); // safety cap
})();
