
/* Stackly — Dashboards: sidebar, panel nav, demo tables (sort/filter/page),
   notifications, KPI counters, canvas charts, logout (demo session flag). */
(function () {
  "use strict";
  var SPRITE = document.body.getAttribute("data-sprite") || "assets/svg/legal-icons.svg";

  /* Sidebar (mobile) */
  var side = document.getElementById("dashSide");
  var overlay = document.getElementById("dashOverlay");
  var menuBtn = document.getElementById("dashMenuBtn");
  function closeSide() { side && side.classList.remove("open"); overlay && overlay.classList.remove("show"); }
  if (menuBtn) menuBtn.addEventListener("click", function () {
    side.classList.toggle("open"); overlay.classList.toggle("show");
  });
  if (overlay) overlay.addEventListener("click", closeSide);

  /* Panel navigation */
  document.querySelectorAll("[data-panel-link]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      var target = link.getAttribute("data-panel-link");
      if (!target) return;
      e.preventDefault();
      document.querySelectorAll(".dash-panel").forEach(function (p) { p.classList.remove("active"); });
      var panel = document.getElementById(target);
      if (panel) panel.classList.add("active");
      document.querySelectorAll("[data-panel-link]").forEach(function (l) { l.classList.remove("active"); });
      link.classList.add("active");
      if (link.closest(".dash-nav")) {
        document.querySelectorAll(".dash-nav a").forEach(function (l) { l.classList.remove("active"); });
        link.classList.add("active");
      }
      closeSide();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  /* KPI counters */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function countUp(el) {
    var t = parseFloat(el.getAttribute("data-kpi") || "0");
    var suffix = el.getAttribute("data-kpi-suffix") || "";
    if (reduced) { el.textContent = t + suffix; return; }
    var start = null;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / 1500, 1);
      el.textContent = Math.round(t * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var kio = new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (en.isIntersecting) { countUp(en.target); kio.unobserve(en.target); }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll("[data-kpi]").forEach(function (el) { kio.observe(el); });

  /* Demo data table engine */
  document.querySelectorAll("[data-table]").forEach(function (wrap) {
    var data = [];
    try { data = JSON.parse(wrap.getAttribute("data-table")); } catch (e) { return; }
    var cols = JSON.parse(wrap.getAttribute("data-cols") || "[]");
    var state = { sort: null, dir: 1, q: "", status: "all", page: 1, per: 5 };

    var table = wrap.querySelector("table");
    var headRow = table.querySelector("thead tr");
    var tbody = table.querySelector("tbody");
    var searchEl = wrap.querySelector(".mini-search");
    var filterEl = wrap.querySelector("[data-filter-status]");
    var footEl = wrap.querySelector(".table-foot");
    var pagerEl = wrap.querySelector(".pager");

    headRow.innerHTML = cols.map(function (c) {
      return '<th class="' + (c.sort ? "sortable" : "") + '" data-key="' + c.key + '">' + c.label + "</th>";
    }).join("") + (wrap.hasAttribute("data-actions") ? "<th>Actions</th>" : "");

    headRow.querySelectorAll("th.sortable").forEach(function (th) {
      th.addEventListener("click", function () {
        var k = th.getAttribute("data-key");
        if (state.sort === k) state.dir *= -1; else { state.sort = k; state.dir = 1; }
        render();
      });
    });
    if (searchEl) searchEl.addEventListener("input", function () { state.q = searchEl.value.toLowerCase(); state.page = 1; render(); });
    if (filterEl) filterEl.addEventListener("change", function () { state.status = filterEl.value; state.page = 1; render(); });

    function filtered() {
      var rows = data.filter(function (r) {
        var inStatus = state.status === "all" || (r.status || "") === state.status;
        var inQuery = !state.q || JSON.stringify(r).toLowerCase().indexOf(state.q) !== -1;
        return inStatus && inQuery;
      });
      if (state.sort) {
        rows = rows.slice().sort(function (a, b) {
          var va = a[state.sort], vb = b[state.sort];
          if (va == null) va = ""; if (vb == null) vb = "";
          return String(va).localeCompare(String(vb), undefined, { numeric: true }) * state.dir;
        });
      }
      return rows;
    }

    function pill(v) {
      var map = { confirmed: "green", completed: "green", active: "green", pending: "gold",
                  "in review": "gold", scheduled: "blue", draft: "gray", overdue: "red",
                  cancelled: "red", inactive: "gray", replied: "green", new: "blue" };
      return '<span class="pill ' + (map[(v || "").toLowerCase()] || "gray") + '">' + v + "</span>";
    }

    function render() {
      var rows = filtered();
      var pages = Math.max(1, Math.ceil(rows.length / state.per));
      if (state.page > pages) state.page = pages;
      var slice = rows.slice((state.page - 1) * state.per, state.page * state.per);
      tbody.innerHTML = slice.map(function (r) {
        var tds = cols.map(function (c) {
          if (c.type === "user") {
            return '<td><div class="t-user"><img src="' + r.avatar + '" alt="" loading="lazy"><div><b>' + r.name + "</b><span>" + r.sub + "</span></div></div></td>";
          }
          if (c.type === "pill") return "<td>" + pill(r[c.key]) + "</td>";
          return "<td>" + (r[c.key] != null ? r[c.key] : "") + "</td>";
        }).join("");
        if (wrap.hasAttribute("data-actions")) {
          tds += '<td><div class="row-actions">' +
            '<button type="button" aria-label="View" data-demo-action><svg class="icon"><use href="' + SPRITE + '#icon-eye"></use></svg></button>' +
            '<button type="button" aria-label="Edit" data-demo-action><svg class="icon"><use href="' + SPRITE + '#icon-edit"></use></svg></button>' +
            '<button type="button" aria-label="Delete" class="danger" data-demo-action><svg class="icon"><use href="' + SPRITE + '#icon-trash"></use></svg></button></div></td>';
        }
        return "<tr>" + tds + "</tr>";
      }).join("") || '<tr><td colspan="' + (cols.length + 1) + '" style="text-align:center;color:var(--text)">No records match your filters.</td></tr>';

      if (footEl) {
        footEl.querySelector("[data-showing]").textContent =
          "Showing " + slice.length + " of " + rows.length + " (demonstration data)";
      }
      if (pagerEl) {
        pagerEl.innerHTML = "";
        for (var i = 1; i <= pages; i++) {
          (function (i) {
            var b = document.createElement("button");
            b.type = "button"; b.textContent = i;
            if (i === state.page) b.classList.add("active");
            b.addEventListener("click", function () { state.page = i; render(); });
            pagerEl.appendChild(b);
          })(i);
        }
      }
      tbody.querySelectorAll("[data-demo-action]").forEach(function (b) {
        b.addEventListener("click", function () { demoNotice(b); });
      });
    }
    render();
  });

  function demoNotice(anchor) {
    var panel = anchor.closest(".panel");
    var existing = panel && panel.querySelector(".demo-flash");
    if (existing) existing.remove();
    if (!panel) return;
    var div = document.createElement("div");
    div.className = "form-status show info demo-flash";
    div.style.margin = "0.8rem 0 0";
    div.textContent = "Demonstration data — changes require a connected backend.";
    panel.appendChild(div);
    setTimeout(function () { div.remove(); }, 2600);
  }
  document.querySelectorAll("[data-demo-action]").forEach(function (b) {
    if (!b.closest("[data-table]")) b.addEventListener("click", function () { demoNotice(b); });
  });

  /* Notifications dropdown */
  var bell = document.getElementById("notifBell");
  var notifPanel = document.getElementById("notifPanel");
  if (bell && notifPanel) {
    bell.addEventListener("click", function (e) {
      e.stopPropagation();
      notifPanel.classList.toggle("open");
    });
    document.addEventListener("click", function (e) {
      if (!notifPanel.contains(e.target)) notifPanel.classList.remove("open");
    });
  }

  /* Canvas charts */
  function drawCharts() {
    document.querySelectorAll("canvas[data-chart]").forEach(function (cv) {
      var spec;
      try { spec = JSON.parse(cv.getAttribute("data-chart")); } catch (e) { return; }
      var dpr = window.devicePixelRatio || 1;
      var W = cv.clientWidth || 600, H = cv.clientHeight || 280;
      cv.width = W * dpr; cv.height = H * dpr;
      var ctx = cv.getContext("2d");
      ctx.scale(dpr, dpr);
      var pad = { l: 42, r: 16, t: 18, b: 32 };
      var iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
      var max = Math.max.apply(null, spec.datasets[0].data) * 1.15;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "#E5E7EB"; ctx.fillStyle = "#8A97A8"; ctx.font = "11px Inter, sans-serif";
      for (var g = 0; g <= 4; g++) {
        var y = pad.t + ih - (ih * g / 4);
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke();
        ctx.fillText(Math.round(max * g / 4), 6, y + 4);
      }
      var n = spec.labels.length;
      var step = iw / n;
      /* bars for first dataset */
      var ds0 = spec.datasets[0];
      ctx.fillStyle = ds0.color || "#D6AD60";
      ds0.data.forEach(function (v, i) {
        var bw = Math.min(34, step * 0.44);
        var x = pad.l + step * i + (step - bw) / 2;
        var h = (v / max) * ih;
        ctx.beginPath();
        if (ctx.roundRect) { ctx.roundRect(x, pad.t + ih - h, bw, h, [5, 5, 0, 0]); }
        else { ctx.rect(x, pad.t + ih - h, bw, h); }
        ctx.fill();
        ctx.fillStyle = "#536176"; ctx.textAlign = "center";
        ctx.fillText(spec.labels[i], x + bw / 2, H - 10);
        ctx.fillStyle = ds0.color || "#D6AD60";
      });
      /* line for second dataset */
      if (spec.datasets[1]) {
        var ds1 = spec.datasets[1];
        ctx.strokeStyle = ds1.color || "#102B4E"; ctx.lineWidth = 2.5; ctx.beginPath();
        ds1.data.forEach(function (v, i) {
          var x = pad.l + step * i + step / 2;
          var y = pad.t + ih - (v / max) * ih;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.fillStyle = ds1.color || "#102B4E";
        ds1.data.forEach(function (v, i) {
          var x = pad.l + step * i + step / 2;
          var y = pad.t + ih - (v / max) * ih;
          ctx.beginPath(); ctx.arc(x, y, 3.6, 0, Math.PI * 2); ctx.fill();
        });
      }
      ctx.textAlign = "left";
    });
  }
  window.addEventListener("resize", drawCharts);
  window.addEventListener("load", drawCharts);
  drawCharts();

  /* Logout — demo session flag only */
  document.querySelectorAll("[data-logout]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.preventDefault();
      try { sessionStorage.removeItem("stackly_demo_session"); } catch (err) {}
      window.location.href = b.getAttribute("data-logout");
    });
  });
})();
