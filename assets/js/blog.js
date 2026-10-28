
/* Stackly — Blog listing: search, category filter, pagination + article details helpers */
(function () {
  "use strict";
  var grid = document.getElementById("blogGrid");
  if (!grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll(".post-card"));
  var searchInput = document.getElementById("blogSearch");
  var catButtons = document.querySelectorAll("[data-cat]");
  var pager = document.getElementById("blogPager");
  var countLabel = document.getElementById("blogCount");
  var PAGE = 6, page = 1, cat = "all", query = "";

  function apply() {
    var filtered = cards.filter(function (c) {
      var inCat = cat === "all" || c.getAttribute("data-category") === cat;
      var q = query.toLowerCase();
      var inQuery = !q || c.textContent.toLowerCase().indexOf(q) !== -1;
      return inCat && inQuery;
    });
    var pages = Math.max(1, Math.ceil(filtered.length / PAGE));
    if (page > pages) page = pages;
    cards.forEach(function (c) { c.style.display = "none"; });
    filtered.slice((page - 1) * PAGE, page * PAGE).forEach(function (c) {
      c.style.display = "";
    });
    if (countLabel) {
      countLabel.textContent = "Showing " + filtered.length + " article" + (filtered.length === 1 ? "" : "s");
    }
    if (pager) {
      pager.innerHTML = "";
      for (var i = 1; i <= pages; i++) {
        (function (i) {
          var b = document.createElement("button");
          b.type = "button";
          b.textContent = i;
          if (i === page) b.classList.add("active");
          b.addEventListener("click", function () { page = i; apply(); });
          pager.appendChild(b);
        })(i);
      }
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      query = searchInput.value.trim(); page = 1; apply();
    });
  }
  catButtons.forEach(function (b) {
    b.addEventListener("click", function () {
      cat = b.getAttribute("data-cat");
      page = 1;
      catButtons.forEach(function (x) { x.classList.toggle("active", x === b); });
      apply();
    });
  });
  apply();

  /* Reading progress on article page */
  var bar = document.getElementById("readProgress");
  if (bar) {
    window.addEventListener("scroll", function () {
      var h = document.documentElement;
      var p = h.scrollTop / (h.scrollHeight - h.clientHeight);
      bar.style.width = (p * 100) + "%";
    }, { passive: true });
  }

  /* Copy-link share */
  document.querySelectorAll("[data-share-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var done = function () {
        btn.textContent = "Link copied!";
        setTimeout(function () { btn.textContent = "Copy link"; }, 1800);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done, done);
      else done();
    });
  });
})();
