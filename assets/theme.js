/* ============================================================================
   theme.js — window.VTheme: temamotorn.

   Ersätter de tidigare index_2/3/4.html-kopiorna. Markupen finns nu i EN fil
   (index.html) och utseendet byts genom att peka om <link id="themeCss">.

   Ansvar:
     - registret över teman (id, etikett, css-fil, om temat är mörkt som standard)
     - läsa/spara val i localStorage (och ?theme= / ?mode= i URL:en)
     - sätta data-theme + data-mode på <html> innan sidan målas (se index.html)
     - rendera växlaren i topbaren
     - mata Chart.js med temats färger (app.js hårdkodar mörka rutnätsfärger)

   Lägg till ett tema: en rad i THEMES + en fil i assets/themes/.
   ========================================================================== */
(function (root) {
  "use strict";

  var THEMES = [
    { id: "deck",     label: "Deck",    css: "assets/themes/deck.css",     defaultMode: "dark",
      title: "Quant Deck – mörk sidopanel, full skärmbredd" },
    { id: "nordlys",  label: "Nordlys", css: "assets/themes/nordlys.css",  defaultMode: "light",
      title: "Nordlys – redaktionell, serif, luftig spalt" },
    { id: "terminal", label: "Term",    css: "assets/themes/terminal.css", defaultMode: "dark",
      title: "Terminal 80 – tät handelsterminal, monospace" },
    { id: "enkel",    label: "Enkel",   css: "assets/themes/enkel.css",    defaultMode: "light",
      title: "Enkel – bara det väsentliga, stor text" }
  ];

  var KEY_THEME = "vr_theme", KEY_MODE = "vr_mode";

  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function param(n) {
    try { return new URLSearchParams(root.location.search).get(n); } catch (e) { return null; }
  }
  function byId(id) { for (var i = 0; i < THEMES.length; i++) if (THEMES[i].id === id) return THEMES[i]; return null; }

  /* Vilket tema/läge gäller? Ordning: ?theme= i URL:en > sparat val > standard.
     Läget faller tillbaka på temats eget standardläge, inte på operativsystemet
     – ett tema som ÄR mörkt (terminal) ska inte starta i ljust bara för att
     datorn står i ljust läge. Har användaren valt uttryckligen vinner det. */
  function resolve() {
    var t = byId(param("theme")) || byId(read(KEY_THEME)) || THEMES[0];
    var m = param("mode") || read(KEY_MODE + ":" + t.id) || t.defaultMode;
    if (m !== "light" && m !== "dark") m = t.defaultMode;
    return { theme: t, mode: m };
  }

  var VTheme = {
    themes: THEMES,
    byId: byId,
    resolve: resolve,

    /* Körs synkront i <head> innan sidan målas → ingen blinkning. */
    boot: function () {
      var r = resolve();
      var el = document.documentElement;
      el.setAttribute("data-theme", r.theme.id);
      el.setAttribute("data-mode", r.mode);
      var link = document.getElementById("themeCss");
      if (link && link.getAttribute("href") !== r.theme.css) link.setAttribute("href", r.theme.css);
      this.current = r;
      return r;
    },

    setTheme: function (id) {
      var t = byId(id); if (!t) return;
      store(KEY_THEME, t.id);
      var m = read(KEY_MODE + ":" + t.id) || t.defaultMode;
      document.documentElement.setAttribute("data-theme", t.id);
      document.documentElement.setAttribute("data-mode", m);
      var link = document.getElementById("themeCss");
      if (link) link.setAttribute("href", t.css);
      this.current = { theme: t, mode: m };
      this.render();
      this.afterChange();
    },

    setMode: function (mode) {
      if (mode !== "light" && mode !== "dark") return;
      var t = (this.current && this.current.theme) || THEMES[0];
      store(KEY_MODE + ":" + t.id, mode);          /* läget sparas PER tema */
      document.documentElement.setAttribute("data-mode", mode);
      this.current = { theme: t, mode: mode };
      this.render();
      this.afterChange();
    },

    toggleMode: function () {
      this.setMode(document.documentElement.getAttribute("data-mode") === "dark" ? "light" : "dark");
    },

    /* Diagram och <meta name=theme-color> följer inte CSS-variabler av sig
       själva – de måste ritas om när temat byts. */
    afterChange: function () {
      var css = getComputedStyle(document.documentElement);
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", (css.getPropertyValue("--bg-main") || "").trim() || "#070B15");
      var d = root.dashboard;
      if (d && typeof d.drawChart === "function") {
        var v = document.querySelector('.view[data-view="avkastning"]');
        if (v && v.classList.contains("active")) { try { d.drawChart(); } catch (e) {} }
      }
    },

    /* Växlaren renderas i #themeCtl (finns i topbaren i index.html). */
    render: function () {
      var host = document.getElementById("themeCtl");
      if (!host) return;
      var cur = (this.current && this.current.theme.id) || "deck";
      var mode = document.documentElement.getAttribute("data-mode") || "dark";
      var btns = THEMES.map(function (t) {
        return '<button type="button" data-theme-set="' + t.id + '" title="' + t.title + '"' +
          (t.id === cur ? ' class="cur" aria-current="true"' : "") + ">" + t.label + "</button>";
      }).join("");
      host.className = "theme-ctl";
      host.innerHTML = '<span class="theme-switch">' + btns + "</span>" +
        '<button type="button" id="modeBtn" class="mode-btn" title="Växla ljust/mörkt läge" ' +
        'aria-label="Växla ljust eller mörkt läge">' + (mode === "dark" ? "☀" : "☾") + "</button>";
    },

    init: function () {
      var self = this;
      this.boot();
      this.render();
      var host = document.getElementById("themeCtl");
      if (host) host.addEventListener("click", function (e) {
        var t = e.target.closest("[data-theme-set]");
        if (t) { self.setTheme(t.getAttribute("data-theme-set")); return; }
        if (e.target.closest("#modeBtn")) self.toggleMode();
      });

      /* Kortkommandon 1–9 pekar i app.js på ALLA .subnav a. Ett tema som döljer
         menyposter (enkel) skulle då hoppa till en dold vy. Fånga i capture-
         fasen och räkna bara de synliga; annars släpps händelsen vidare. */
      document.addEventListener("keydown", function (e) {
        if (e.altKey || e.ctrlKey || e.metaKey) return;
        var n = parseInt(e.key, 10);
        if (!(n >= 1 && n <= 9)) return;
        var tag = ((e.target && e.target.tagName) || "").toLowerCase();
        if (tag === "input" || tag === "textarea" || tag === "select" || (e.target && e.target.isContentEditable)) return;
        var all = [].slice.call(document.querySelectorAll(".subnav a"));
        var vis = all.filter(function (a) { return a.offsetParent !== null; });
        if (!vis.length || vis.length === all.length) return;   /* inget dolt → app.js sköter det */
        e.stopPropagation();
        var link = vis[n - 1];
        if (link && root.dashboard) root.dashboard.showView(link.dataset.view);
      }, true);

      this.registerChartPlugin();
      this.afterChange();
    },

    /* Chart.js-plugin: app.js sätter rutnät/etiketter hårdkodat för mörk
       bakgrund. Här skrivs de om ur temats CSS-variabler, så ett nytt tema
       inte kräver någon ändring i app.js.
       Registreras i init(), inte vid filens slut: chart.js laddas i <body> och
       finns ännu inte när theme.js körs i <head>. */
    registerChartPlugin: function () {
      if (!root.Chart || this._chartPlugin) return;
      this._chartPlugin = true;
      root.Chart.register({
        id: "vthemeColors",
        beforeInit: function (chart) {
          var css = getComputedStyle(document.documentElement);
          var grid = (css.getPropertyValue("--chart-grid") || "").trim();
          var tick = (css.getPropertyValue("--chart-tick") || "").trim();
          var line = (css.getPropertyValue("--chart-border") || "").trim();
          var o = chart.options || {};
          if (o.plugins && o.plugins.legend && o.plugins.legend.labels && tick) o.plugins.legend.labels.color = tick;
          Object.keys(o.scales || {}).forEach(function (k) {
            var s = o.scales[k];
            if (s.grid && grid) s.grid.color = grid;
            if (s.ticks && tick) s.ticks.color = tick;
            if (s.border && line) s.border.color = line;
          });
        }
      });
    }
  };

  root.VTheme = VTheme;
  /* boot() körs DIREKT (theme.js ligger i <head> efter <link id="themeCss">)
     så rätt tema och läge sitter innan sidan målas – ingen vit blinkning. */
  VTheme.boot();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { VTheme.init(); });
  else VTheme.init();
})(typeof window !== "undefined" ? window : this);
