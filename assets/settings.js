/* ============================================================================
   settings.js — window.VSettings: användarens egna inställningar.

   LAGRING: localStorage, alltså PER ENHET OCH WEBBLÄSARE. Inget sparas i repot
   och inget delas mellan personer – två som öppnar samma dashboard på var sin
   telefon får var sina inställningar. Det är avsiktligt: valen är preferenser,
   inte data.

   ARKITEKTUR: en deklarativ tabell (SCHEMA) beskriver varje inställning – id,
   etikett, alternativ, standardvärde och hur den appliceras. Vyn RENDERAS ur
   tabellen, så en ny inställning är en post i SCHEMA plus (oftast) en rad CSS
   som reagerar på attributet. Ingen ny markup, ingen ny händelsehantering.

   De flesta inställningar appliceras som data-attribut på <html> och plockas
   upp av assets/themes/base.css. Tema och ljust/mörkt läge ÄGS av VTheme –
   VSettings delegerar dit så det bara finns en sanning.
   ========================================================================== */
(function (root) {
  "use strict";

  var KEY = "vr_settings";
  var VIEW_LABELS = {
    hem: "Hem", total: "Total", oversikt: "Nordisk rotation", us: "US-rotation",
    scout: "USA & Krypto", analys: "Aktieanalys", rapporter: "Rapporter",
    nyheter: "Nyheter & radar", kurser: "Kurser", avkastning: "Avkastning", retro: "Retro & lärdomar"
  };

  /* Varje post: id, grupp, etikett, hjälptext, alternativ [värde, etikett],
     standardvärde och hur den appliceras (attr = data-attribut på <html>). */
  var SCHEMA = [
    { id: "theme", group: "Utseende", label: "Tema", def: "deck", special: "theme",
      help: "Fyra kompletta utseenden. Ljust/mörkt väljs separat nedan.",
      options: [] /* fylls ur VTheme-registret */ },
    { id: "mode", group: "Utseende", label: "Ljust eller mörkt", def: "theme", special: "mode",
      help: "”Följ temat” använder det läge temat är gjort för. ”Följ systemet” följer din dator eller telefon.",
      options: [["theme", "Följ temat"], ["auto", "Följ systemet"], ["light", "Ljust"], ["dark", "Mörkt"]] },
    { id: "textsize", group: "Utseende", label: "Textstorlek", def: "md", attr: "data-textsize",
      help: "Skalar innehållet. Menyer och toppraden påverkas inte.",
      options: [["sm", "Liten"], ["md", "Normal"], ["lg", "Stor"]] },
    { id: "density", group: "Utseende", label: "Täthet", def: "normal", attr: "data-density",
      help: "Kompakt minskar marginaler och luft – mer på skärmen, tätare intryck.",
      options: [["normal", "Normal"], ["compact", "Kompakt"]] },

    { id: "startview", group: "Start", label: "Vy vid start", def: "hem", special: "startview",
      help: "Vilken vy som öppnas när du laddar sidan utan att ha klickat dig någonstans.",
      options: [] /* fylls ur menyn */ },

    { id: "motion", group: "Beteende", label: "Animationer", def: "on", attr: "data-motion",
      help: "Av tar bort övergångar mellan vyer. Har din enhet ”minska rörelse” påslaget stängs de av ändå.",
      options: [["on", "På"], ["off", "Av"]] },
    { id: "reportfull", group: "Beteende", label: "Rapporter i full höjd", def: "off", attr: "data-reportfull",
      help: "På visar hela rapporten i stället för en rullningsbox på 74 % av skärmhöjden.",
      options: [["off", "Rullningsbox"], ["on", "Full höjd"]] }
  ];

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { return {}; }
  }
  function write(o) {
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
  }
  function itemById(id) { for (var i = 0; i < SCHEMA.length; i++) if (SCHEMA[i].id === id) return SCHEMA[i]; return null; }

  var VSettings = {
    KEY: KEY,
    schema: SCHEMA,

    /* Aktuellt värde: sparat val om det är giltigt, annars standardvärdet.
       Tema och läge läses ur VTheme, som äger dem. */
    get: function (id) {
      var it = itemById(id); if (!it) return null;
      if (id === "theme") return (root.VTheme && root.VTheme.current && root.VTheme.current.theme.id) || it.def;
      var v = read()[id];
      var valid = this.options(it).some(function (o) { return o[0] === v; });
      return valid ? v : it.def;
    },
    options: function (it) {
      if (it.id === "theme")
        return ((root.VTheme && root.VTheme.themes) || []).map(function (t) { return [t.id, t.label]; });
      if (it.id === "startview")
        return [].slice.call(document.querySelectorAll(".subnav a"))
          .map(function (a) { return [a.dataset.view, VIEW_LABELS[a.dataset.view] || a.dataset.view]; });
      return it.options;
    },

    set: function (id, value) {
      var it = itemById(id); if (!it) return;
      if (!this.options(it).some(function (o) { return o[0] === value; })) return;
      if (id === "theme") { if (root.VTheme) root.VTheme.setTheme(value); this.render(); return; }
      var o = read(); o[id] = value; write(o);
      this.apply();
      this.render();
      if (id === "reportfull") this.syncReportFull();
    },

    /* Skriver data-attribut på <html>. base.css gör resten. */
    apply: function () {
      var el = document.documentElement;
      SCHEMA.forEach(function (it) {
        if (!it.attr) return;
        el.setAttribute(it.attr, VSettings.get(it.id));
      });
      this.applyMode();
    },

    /* Lägesvalet: "theme" = temats eget standardläge (VTheme sköter det),
       "auto" = följ operativsystemet, annars uttryckligt ljust/mörkt. */
    applyMode: function () {
      if (!root.VTheme) return;
      /* ?mode= i URL:en vinner över det sparade valet – annars kan man inte
         längre dela en länk som öppnar ett bestämt läge, och VTheme:s egen
         URL-hantering blir överskriven direkt efter att den körts. */
      try {
        var u = new URLSearchParams(root.location.search).get("mode");
        if (u === "light" || u === "dark") return;
      } catch (e) {}
      var m = this.get("mode");
      if (m === "light" || m === "dark") { root.VTheme.setMode(m); return; }
      if (m === "auto") {
        var dark = root.matchMedia && root.matchMedia("(prefers-color-scheme: dark)").matches;
        root.VTheme.setMode(dark ? "dark" : "light");
        return;
      }
      // "theme": låt temats standardläge gälla
      var t = root.VTheme.current && root.VTheme.current.theme;
      if (t) root.VTheme.setMode(t.defaultMode);
    },

    /* Rapportboxens höjd styrs av en klass som app.js också växlar via knappen. */
    syncReportFull: function () {
      var body = document.getElementById("reportBody");
      if (body) body.classList.toggle("report--full", this.get("reportfull") === "on");
      var btn = document.getElementById("fullBtn");
      if (btn) btn.classList.toggle("on", this.get("reportfull") === "on");
    },

    // ---- vyn -------------------------------------------------------------
    render: function () {
      var host = document.getElementById("settingsBody");
      if (!host) return;
      var esc = (root.VRender && root.VRender.esc) || function (s) { return String(s); };
      var groups = [];
      SCHEMA.forEach(function (it) {
        var g = groups.filter(function (x) { return x.name === it.group; })[0];
        if (!g) { g = { name: it.group, items: [] }; groups.push(g); }
        g.items.push(it);
      });

      var html = groups.map(function (g) {
        return '<section class="set-group"><h3 class="set-g-title">' + esc(g.name) + "</h3>" +
          g.items.map(function (it) {
            var cur = VSettings.get(it.id);
            var opts = VSettings.options(it).map(function (o) {
              return '<button type="button" class="set-opt' + (o[0] === cur ? " on" : "") + '"' +
                ' data-set="' + esc(it.id) + '" data-val="' + esc(o[0]) + '"' +
                (o[0] === cur ? ' aria-pressed="true"' : ' aria-pressed="false"') + ">" + esc(o[1]) + "</button>";
            }).join("");
            return '<div class="set-row"><div class="set-lbl"><b>' + esc(it.label) + "</b>" +
              (it.help ? '<span class="set-help">' + esc(it.help) + "</span>" : "") + "</div>" +
              '<div class="set-opts">' + opts + "</div></div>";
          }).join("") + "</section>";
      }).join("");

      // datakällan + lokal lagring
      var d = root.dashboard;
      var src = d && d._prebuiltAt
        ? "Förbyggd (<code>state/dashboard.json</code>, byggd " + esc(String(d._prebuiltAt).slice(0, 16).replace("T", " ")) + " UTC)"
        : "Live – rapporterna hämtas en och en (förbyggd data saknas eller kunde inte läsas)";
      html += '<section class="set-group"><h3 class="set-g-title">Data</h3>' +
        '<div class="set-row"><div class="set-lbl"><b>Datakälla</b><span class="set-help">' + src + "</span></div>" +
        '<div class="set-opts"><button type="button" class="set-opt" data-act="refresh">Hämta om nu</button></div></div>' +
        '<div class="set-row"><div class="set-lbl"><b>Sparat på den här enheten</b><span class="set-help">' +
        'Inställningarna ovan ligger i webbläsarens lokala lagring och följer varken med till andra enheter eller till repot. ' +
        'Öppnar någon annan dashboarden på sin telefon får de sina egna val.</span></div>' +
        '<div class="set-opts"><button type="button" class="set-opt set-danger" data-act="reset">Återställ allt</button></div></div>' +
        "</section>";

      host.innerHTML = html;
    },

    reset: function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
      this.apply();
      if (root.VTheme) root.VTheme.setTheme(root.VTheme.themes[0].id);
      this.render();
      this.syncReportFull();
    },

    init: function () {
      this.apply();
      this.render();
      this.syncReportFull();
      var host = document.getElementById("settingsBody");
      if (host) host.addEventListener("click", function (e) {
        var b = e.target.closest("button"); if (!b) return;
        if (b.dataset.act === "reset") { VSettings.reset(); return; }
        if (b.dataset.act === "refresh") {
          if (root.dashboard) { root.dashboard.state.md.clear(); root.dashboard._searchDocs = null; root.dashboard.load(true); }
          return;
        }
        if (b.dataset.set) VSettings.set(b.dataset.set, b.dataset.val);
      });
      var gear = document.getElementById("settingsBtn");
      if (gear) gear.addEventListener("click", function () {
        if (root.dashboard) root.dashboard.showView("installningar");
      });
      // Följer systemet: reagera när operativsystemet byter läge.
      if (root.matchMedia) {
        var mq = root.matchMedia("(prefers-color-scheme: dark)");
        var onChange = function () { if (VSettings.get("mode") === "auto") VSettings.applyMode(); };
        if (mq.addEventListener) mq.addEventListener("change", onChange);
        else if (mq.addListener) mq.addListener(onChange);
      }
    }
  };

  root.VSettings = VSettings;
  /* Attributen sätts DIREKT (filen ligger i <head>) så textstorlek, täthet och
     rörelse gäller före första målningen – annars blinkar standardvärdena till.
     Vyn och lyssnarna kräver DOM och väntar därför på DOMContentLoaded. */
  try { VSettings.apply(); } catch (e) {}
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", function () { VSettings.init(); });
  else VSettings.init();
})(typeof window !== "undefined" ? window : this);
