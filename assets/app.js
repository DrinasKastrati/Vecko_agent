/* ============================================================
   Dashboard – app controller for the Nordisk Rotation viewer.
   Depends on window.VParse (parsing) and window.VRender (HTML).
   Loaded after vparse.js and vrender.js.
   ============================================================ */
(function (root) {
  "use strict";

  class Dashboard {
    constructor(cfg) {
      this.cfg = cfg;
      this.P = root.VParse;
      this.R = root.VRender;
      this.apiTree = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/git/trees/${cfg.branch}?recursive=1`;
      this.state = {
        metas: [], dailies: [], weeklies: [], portfolio: null, feed: null, prices: null, scouts: [], queue: null, priceHistory: null, alerts: null,
        portfolioUs: null, usDailies: [], usWeeklies: [], allocation: null,
        md: new Map(), chart: null, reportType: "daily"
      };
    }

    // ---- url helpers ----
    raw(p) { return `https://raw.githubusercontent.com/${this.cfg.owner}/${this.cfg.repo}/${this.cfg.branch}/${p}`; }
    ghBlob(p) { return `https://github.com/${this.cfg.owner}/${this.cfg.repo}/blob/${this.cfg.branch}/${p}`; }
    get repoURL() { return `https://github.com/${this.cfg.owner}/${this.cfg.repo}`; }
    el(id) { return document.getElementById(id); }

    // ---- fetching ----
    async fetchText(url) { const r = await fetch(url, { cache: "no-store" }); if (!r.ok) throw new Error(r.status + " " + url); return r.text(); }
    async fetchJSON(url) { const r = await fetch(url, { cache: "no-store" }); if (!r.ok) throw new Error(r.status + " " + url); return r.json(); }
    async getMd(path) {
      if (this.state.md.has(path)) return this.state.md.get(path);
      const t = await this.fetchText(this.raw(path));
      this.state.md.set(path, t); return t;
    }
    cacheGet(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } }
    cacheSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

    async discoverTree(force) {
      const CK = "vr_tree_v2";
      if (!force) { const c = this.cacheGet(CK); if (c && Date.now() - c.t < 180000) return c.d; }
      const j = await this.fetchJSON(this.apiTree);
      const paths = (j.tree || []).filter(n => n.type === "blob").map(n => n.path);
      this.cacheSet(CK, { t: Date.now(), d: paths });
      return paths;
    }
    metasFromTree(paths) {
      return paths.map(p => { const n = p.split("/").pop(); const m = this.P.parseFilename(n); return m ? Object.assign(m, { path: p }) : null; })
                  .filter(Boolean).sort((a, b) => b.sortKey - a.sortKey);
    }

    // ---- main load ----
    async load(force) {
      this.setStatus("loading");
      try {
        const paths = await this.discoverTree(force);
        const metas = this.metasFromTree(paths);
        this.state.metas = metas;
        const portfPath = paths.find(p => /(^|\/)portfolj\.md$/i.test(p)) || "portfolj.md";
        const pricesPath = paths.find(p => /(^|\/)prices\.json$/i.test(p));
        const queuePath = paths.find(p => /(^|\/)analysis_queue\.json$/i.test(p));
        const histPath = paths.find(p => /(^|\/)price_history\.json$/i.test(p));
        const alertsPath = paths.find(p => /(^|\/)alerts\.json$/i.test(p));
        const portfUsPath = paths.find(p => /(^|\/)portfolj_us\.md$/i.test(p));
        const allocPath = paths.find(p => /(^|\/)allocation\.json$/i.test(p));
        const wMetas = metas.filter(m => m.type === "weekly").slice(0, 12);
        const dMetas = metas.filter(m => m.type === "daily").slice(0, 10);
        const sMetas = metas.filter(m => m.type === "scout").slice(0, 12);
        const udMetas = metas.filter(m => m.type === "us_daily").slice(0, 10);
        const uwMetas = metas.filter(m => m.type === "us_weekly").slice(0, 12);
        const [pMd, dMds, wMds, sMds, prices, queue, priceHistory, alerts, pUsMd, udMds, uwMds, alloc] = await Promise.all([
          this.getMd(portfPath).catch(() => null),
          Promise.all(dMetas.map(m => this.getMd(m.path))),
          Promise.all(wMetas.map(m => this.getMd(m.path))),
          Promise.all(sMetas.map(m => this.getMd(m.path))),
          pricesPath ? this.fetchJSON(this.raw(pricesPath)).catch(() => null) : Promise.resolve(null),
          queuePath ? this.fetchJSON(this.raw(queuePath)).catch(() => null) : Promise.resolve(null),
          histPath ? this.fetchJSON(this.raw(histPath)).catch(() => null) : Promise.resolve(null),
          alertsPath ? this.fetchJSON(this.raw(alertsPath)).catch(() => null) : Promise.resolve(null),
          portfUsPath ? this.getMd(portfUsPath).catch(() => null) : Promise.resolve(null),
          Promise.all(udMetas.map(m => this.getMd(m.path))),
          Promise.all(uwMetas.map(m => this.getMd(m.path))),
          allocPath ? this.fetchJSON(this.raw(allocPath)).catch(() => null) : Promise.resolve(null)
        ]);
        this.state.prices = prices;
        this.state.queue = queue;
        this.state.priceHistory = priceHistory;
        this.state.alerts = alerts;
        this._alertsPath = alertsPath || this._alertsPath;
        this.state.portfolio = pMd ? this.P.parsePortfolio(pMd) : { accum: null, cash: "", holdings: [], pending: [], history: [], note: null, updated: "" };
        this.state.dailies  = dMetas.map((m, i) => this.P.parseDaily(dMds[i], m));
        this.state.weeklies = wMetas.map((m, i) => this.P.parseWeekly(wMds[i], m));
        this.state.scouts   = sMetas.map((m, i) => this.P.parseScout(sMds[i], m));
        this.state.portfolioUs = pUsMd ? this.P.parsePortfolio(pUsMd) : null;
        this.state.usDailies  = udMetas.map((m, i) => this.P.parseDaily(udMds[i], m));
        this.state.usWeeklies = uwMetas.map((m, i) => this.P.parseWeekly(uwMds[i], m));
        this.state.allocation = alloc;
        this.state.feed = this.P.buildFeed(this.state.dailies, this.state.weeklies);
        this.renderAll();
        this.setStatus("ok");
      } catch (err) { console.error(err); this.setStatus("error", err); }
    }

    // Live-P/L per innehav: portfolj.md-rader (entry/stopp/mål) + prices.json.
    // Live-P/L för valfri bok (nordisk eller US): portfolj-rader + prices.json,
    // med fallback till dagens beslut-kort utan portföljrad.
    liveMapFor(portfolio, latestDaily) {
      const out = {};
      const quotes = this.state.prices && this.state.prices.quotes;
      if (!quotes) return out;
      ((portfolio && portfolio.holdings) || []).forEach(row => {
        const lv = this.P.computeHoldingLive(row, quotes);
        if (lv) out[lv.ticker] = lv;
      });
      ((latestDaily && latestDaily.holdings) || []).forEach(h => {
        const t = (h.ticker || "").trim().toUpperCase();
        const q = t && quotes[t];
        if (!out[t] && q && !q.error && q.price != null)
          out[t] = { ticker: t, price: q.price, currency: q.currency || "", marketTime: q.marketTime || null, pnlPct: null, toStopPct: null, toTargetPct: null };
      });
      return out;
    }
    buildLiveMap() { return this.liveMapFor(this.state.portfolio, this.state.dailies[0]); }

    renderPxBadge() {
      const el = this.el("pxBadge"); if (!el) return;
      const p = this.state.prices;
      if (!p || !p.generatedAt) { el.textContent = "kurser saknas"; el.className = "px-age px-err"; return; }
      const a = this.R.pxAge(p.generatedAt);
      el.textContent = "kurser " + a.txt;
      el.className = "px-age " + a.cls;
      el.title = "Ålder på state/prices.json (uppdateras av GitHub-actionen)";
    }

    // Besluts-historik per ticker för dagens innehav (punkterna på korten).
    buildDecisionMap(latestDaily) {
      const out = {};
      ((latestDaily && latestDaily.holdings) || []).forEach(h => {
        const t = (h.ticker || "").trim().toUpperCase();
        if (t) out[t] = this.P.buildDecisionHistory(this.state.dailies, t);
      });
      return out;
    }

    renderAll() {
      const S = this.state, R = this.R;
      const latestDaily = S.dailies[0] || null;
      this.el("banner").innerHTML = R.renderBanner(S.portfolio.note);
      const alEl = this.el("alerts"); if (alEl) alEl.innerHTML = R.renderAlerts(S.alerts);
      const srEl = this.el("statusRow");
      if (srEl) srEl.innerHTML = R.renderStatusRow(latestDaily, this.P.nextRoutineRun(new Date()));
      this.el("kpis").innerHTML = R.renderKPIs(S.portfolio, latestDaily);
      this.el("market").innerHTML = R.renderMarket(latestDaily);
      this.el("holdings").innerHTML = R.renderHoldings(latestDaily, S.portfolio, this.buildLiveMap(), this.buildDecisionMap(latestDaily), this.P.diffDailies(S.dailies[0], S.dailies[1]));
      this.renderPxBadge();
      const pxEl = this.el("prices"); if (pxEl) pxEl.innerHTML = R.renderPrices(S.prices, S.priceHistory);
      this.el("feed").innerHTML = R.renderFeed(S.feed);
      const sbEl = this.el("scoutBody"); if (sbEl) sbEl.innerHTML = R.renderScout(S.scouts[0] || null);
      this.renderAnalysisIndex();
      const tsEl = this.el("tradeStats"); if (tsEl) tsEl.innerHTML = R.renderTradeStats(this.P.computeTradeStats(S.portfolio.history));
      this.el("history").innerHTML = R.renderHistory(S.portfolio);
      this.el("bubblare").innerHTML = R.renderBubblare(S.weeklies[0]);
      this.renderTotalView();
      this.renderUs();
      this.el("repoFoot").href = this.repoURL;
      this.setupReportPicker();
      this.drawChart();
      this.applyUiState();
      this.refreshClamps();
    }

    // ---- interaktivitet: klamp-toggles, ticker-hopp, sortering, filter ----
    // Visa "Visa mer"-knappen bara där texten faktiskt är avklippt. Körs efter
    // render och vid flikbyte (dolda vyer har höjd 0 och kan inte mätas).
    refreshClamps() {
      requestAnimationFrame(() => {
        document.querySelectorAll(".cw").forEach(cw => {
          if (cw.classList.contains("open")) { cw.classList.add("has-more"); return; }
          const c = cw.querySelector(".clamp");
          cw.classList.toggle("has-more", !!c && c.scrollHeight > c.clientHeight + 2);
        });
      });
    }

    // Klick på ticker-pill var som helst -> Analys-fliken (öppnar cachad analys
    // direkt; köar INGET automatiskt – användaren trycker själv Analysera).
    gotoTicker(raw) {
      const t = String(raw || "").toUpperCase().trim();
      if (!t) return;
      this.showView("analys");
      const ai = this.el("analysInput"); if (ai) ai.value = t;
      const cached = this.state.metas.filter(m => m.type === "analysis" && m.ticker === t).sort((a, b) => b.sortKey - a.sortKey);
      if (cached.length) {
        this.el("analysStatus").innerHTML = "Cachad analys – tryck Analysera för en färsk.";
        this.showAnalysis(cached[0]);
      } else {
        this.el("analysBody").innerHTML = "";
        this.el("analysStatus").innerHTML = 'Ingen cachad analys för <b>' + this.R.esc(t) + '</b> – tryck Analysera för att köa den.';
        if (ai) ai.focus();
      }
    }

    // Sortera en .tbl--sort-tabell på klickad kolumn (datum/tal/text-medveten).
    sortTable(th) {
      const table = th.closest("table"); if (!table || !table.tBodies[0]) return;
      const idx = [...th.parentNode.children].indexOf(th);
      const dir = th.classList.contains("asc") ? -1 : 1;
      table.querySelectorAll("th").forEach(h => h.classList.remove("asc", "desc"));
      th.classList.add(dir === 1 ? "asc" : "desc");
      const key = s => {
        s = (s || "").trim();
        if (/^\d{4}-\d{2}-\d{2}/.test(s)) { const d = Date.parse(s.slice(0, 10)); if (!isNaN(d)) return d; }
        return this.P.numFrom(s);
      };
      const tb = table.tBodies[0];
      [...tb.rows].sort((a, b) => {
        const A = a.cells[idx] ? a.cells[idx].textContent : "", B = b.cells[idx] ? b.cells[idx].textContent : "";
        const ka = key(A), kb = key(B);
        const r = (ka != null && kb != null) ? ka - kb : A.localeCompare(B, "sv");
        return dir * (r || 0);
      }).forEach(r => tb.appendChild(r));
    }

    filterPrices() {
      const inp = this.el("pxSearch"), grid = this.el("pxGrid");
      if (!grid) return;
      const q = ((inp && inp.value) || "").toUpperCase().trim();
      this._pxQuery = q;
      grid.querySelectorAll(".px-item").forEach(it =>
        it.style.display = !q || (it.dataset.tk || "").includes(q) ? "" : "none");
    }
    sortPrices() {
      const sel = this.el("pxSort"), grid = this.el("pxGrid");
      if (!grid) return;
      const mode = (sel && sel.value) || "az";
      this._pxSort = mode;
      [...grid.children].sort((a, b) =>
        mode === "fresh" ? (Number(b.dataset.t) || 0) - (Number(a.dataset.t) || 0)
                         : (a.dataset.tk || "").localeCompare(b.dataset.tk || "", "sv")
      ).forEach(n => grid.appendChild(n));
    }

    // Återställ UI-läge efter varje re-render (rapport-höjd, sektioner, filter).
    applyUiState() {
      const full = !!this.cacheGet("vr_reportfull");
      const rb = this.el("reportBody"), fb = this.el("fullBtn");
      if (rb) rb.classList.toggle("report--full", full);
      if (fb) fb.classList.toggle("on", full);
      document.querySelectorAll("details.sblock[data-key]").forEach(d => {
        const st = this.cacheGet("vr_sec_" + d.dataset.key);
        if (st === false) d.open = false;
      });
      const inp = this.el("pxSearch"), sel = this.el("pxSort");
      if (inp && this._pxQuery) { inp.value = this._pxQuery; this.filterPrices(); }
      if (sel && this._pxSort) { sel.value = this._pxSort; this.sortPrices(); }
    }

    // ---- kurshistorik-modal (klick på kort i Kurser) ----
    openPxChart(tk) {
      const modal = this.el("pxModal");
      if (!modal || !root.Chart) return;
      this.el("pxModalTitle").textContent = tk;
      modal.classList.add("open");
      const av = this.el("pxModalAvanza");
      if (av) { const url = this.avanzaUrl(tk); if (url) { av.href = url; av.hidden = false; } else av.hidden = true; }
      const note = this.el("pxModalNote");
      const ser = this.state.priceHistory && this.state.priceHistory.series && this.state.priceHistory.series[tk];
      if (this._pxChart) { this._pxChart.destroy(); this._pxChart = null; }
      if (!ser || ser.length < 2) {
        note.textContent = "Ingen kurshistorik ännu för " + tk + " – fylls på av pris-actionen (rullande 60 dagar).";
        return;
      }
      const q = this.state.prices && this.state.prices.quotes && this.state.prices.quotes[tk];
      note.textContent = ser.length + " dagar · stängningskurser ur price_history.json" + (q && q.currency ? " · " + q.currency : "");
      const up = ser[ser.length - 1][1] >= ser[0][1];
      const col = up ? "#10B981" : "#EF4444";
      const ctx = this.el("pxModalChart").getContext("2d");
      const grd = ctx.createLinearGradient(0, 0, 0, 280);
      grd.addColorStop(0, up ? "rgba(16,185,129,0.22)" : "rgba(239,68,68,0.2)");
      grd.addColorStop(1, "rgba(0,0,0,0)");
      this._pxChart = new Chart(ctx, {
        type: "line",
        data: { labels: ser.map(p => p[0]), datasets: [{ label: tk, data: ser.map(p => p[1]), borderColor: col, backgroundColor: grd, fill: true, tension: 0.2, pointRadius: 2, borderWidth: 2 }] },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#94A3B8", maxTicksLimit: 8 } },
            y: { grid: { color: "rgba(255,255,255,0.06)" }, ticks: { color: "#94A3B8" } }
          }
        }
      });
    }
    closePxChart() {
      const modal = this.el("pxModal");
      if (modal) modal.classList.remove("open");
      if (this._pxChart) { this._pxChart.destroy(); this._pxChart = null; }
    }

    // Avanza-söklänk för aktier (ej index/krypto): suffix bort, klasstreck -> mellanslag.
    avanzaUrl(tk) {
      const t = String(tk || "").toUpperCase().trim();
      if (!t || t.startsWith("^") || t.endsWith("-USD")) return null;
      const base = t.replace(/\.(ST|OL|CO|HE)$/, "").replace(/-/g, " ");
      return "https://www.avanza.se/sok.html?query=" + encodeURIComponent(base);
    }

    // ---- skrivbordsnotiser för intradag-signaler ----
    updateNotifBtn() {
      const nb = this.el("notifBtn"); if (!nb) return;
      const on = ("Notification" in window) && Notification.permission === "granted" && !!this.cacheGet("vr_notif_on");
      nb.classList.toggle("on", on);
      nb.textContent = on ? "🔔 Notiser på" : "🔔 Notiser";
      if (("Notification" in window) && Notification.permission === "denied")
        nb.title = "Notiser blockerade – tillåt för denna sajt i webbläsarens inställningar.";
    }
    // Lätt poll av enbart alerts.json (var 5:e min) + notis för NYA signaler.
    async pollAlerts() {
      try {
        if (!this._alertsPath) return;
        const alerts = await this.fetchJSON(this.raw(this._alertsPath));
        this.state.alerts = alerts;
        const alEl = this.el("alerts"); if (alEl) alEl.innerHTML = this.R.renderAlerts(alerts);
        const act = (alerts && alerts.active) || [];
        if (!act.length) return;
        const key = s => [s.ticker, s.type, s.reason, s.level].join("|");
        const seen = new Set(this.cacheGet("vr_alert_seen") || []);
        const fresh = act.filter(s => !seen.has(key(s)));
        if (!fresh.length) return;
        this.cacheSet("vr_alert_seen", [...new Set([...seen, ...act.map(key)])].slice(-100));
        const on = this.cacheGet("vr_notif_on");
        if (on && ("Notification" in window) && Notification.permission === "granted")
          fresh.forEach(s => { try {
            new Notification(s.type + " " + s.ticker, {
              body: s.reason + (s.level != null ? " (nivå " + s.level + ")" : "") + (s.price != null ? " · kurs " + s.price : ""),
              tag: key(s)
            });
          } catch (e) {} });
      } catch (e) {}
    }

    // ---- fulltextsökning över ALLA rapporter (Rapporter-fliken) ----
    async searchReports(q) {
      const body = this.el("reportBody");
      q = (q || "").trim();
      if (q.length < 2) { body.innerHTML = '<div class="empty">Skriv minst 2 tecken och tryck Enter.</div>'; return; }
      body.innerHTML = '<div class="empty">Söker i ' + this.state.metas.length + ' rapporter…</div>';
      const docs = await Promise.all(this.state.metas.map(async m => ({ meta: m, text: await this.getMd(m.path).catch(() => "") })));
      body.innerHTML = this.R.renderSearchResults(this.P.searchDocs(docs, q), q);
    }
    // Öppna en rapport från ett sökresultat (analyser hoppar till Analys-fliken).
    openReportByName(name, type) {
      const meta = this.state.metas.find(m => m.name === name);
      if (!meta) return;
      if (type === "analysis") { this.gotoTicker(meta.ticker); return; }
      this.state.reportType = type;
      document.querySelectorAll(".rtype").forEach(b => b.classList.toggle("on", b.dataset.type === type));
      const sel = this.el("reportSelect");
      sel.innerHTML = this.R.renderOptions(this.state.metas, type);
      sel.value = name;
      this.showReport(name);
    }

    // ---- jämför två cachade analyser sida vid sida ----
    toggleCompare() {
      this._cmpMode = !this._cmpMode;
      this._cmpSel = [];
      const b = this.el("cmpBtn"); if (b) b.classList.toggle("on", this._cmpMode);
      document.querySelectorAll(".an-chip.sel").forEach(c => c.classList.remove("sel"));
      this.el("analysStatus").innerHTML = this._cmpMode ? "Jämförläge: klicka på TVÅ analyser i listan nedan." : "";
      if (!this._cmpMode) this.el("analysBody").innerHTML = "";
    }
    cmpPick(btnEl, ticker) {
      const metas = this.state.metas.filter(m => m.type === "analysis" && m.ticker === ticker).sort((a, b) => b.sortKey - a.sortKey);
      if (!metas.length) return;
      this._cmpSel = this._cmpSel || [];
      const i = this._cmpSel.findIndex(m => m.ticker === ticker);
      if (i >= 0) { this._cmpSel.splice(i, 1); btnEl.classList.remove("sel"); }
      else {
        if (this._cmpSel.length >= 2) { this._cmpSel = []; document.querySelectorAll(".an-chip.sel").forEach(c => c.classList.remove("sel")); }
        this._cmpSel.push(metas[0]); btnEl.classList.add("sel");
      }
      if (this._cmpSel.length === 2) this.renderCompare();
      else this.el("analysStatus").innerHTML = "Jämförläge: klicka på TVÅ analyser i listan nedan.";
    }
    async renderCompare() {
      const [a, b] = this._cmpSel;
      const body = this.el("analysBody");
      this.el("analysStatus").innerHTML = "Jämför <b>" + this.R.esc(a.ticker) + "</b> mot <b>" + this.R.esc(b.ticker) + "</b>.";
      body.innerHTML = '<div class="empty">Hämtar båda analyserna…</div>';
      const col = async meta => {
        const md = await this.getMd(meta.path);
        const verdict = this.P.stripMd(this.P.field(md, "Slutsats")).slice(0, 70);
        return '<div class="cmp-col"><div class="an-head"><div><span class="an-tk">' + this.R.esc(meta.ticker) + '</span> <span class="an-date">' + this.R.esc(meta.dateISO) + '</span></div>' +
          (verdict ? '<span class="an-verdict">' + this.R.esc(verdict) + '</span>' : '') + '</div>' +
          '<div class="report">' + this.mdToHtml(md) + '</div></div>';
      };
      try { body.innerHTML = '<div class="cmp-grid">' + (await col(a)) + (await col(b)) + '</div>'; }
      catch (e) { body.innerHTML = '<div class="empty">Kunde inte hämta analyserna.</div>'; }
    }

    // ---- Total: kombinerad översikt (blended avkastning + båda böckerna) ----
    renderTotalView() {
      const S = this.state, el = this.el("totalBody"); if (!el) return;
      const books = [
        { label: "Nordisk", portfolio: S.portfolio, live: this.liveMapFor(S.portfolio, S.dailies[0]) },
        { label: "US", portfolio: S.portfolioUs, live: this.liveMapFor(S.portfolioUs, S.usDailies[0]) }
      ];
      // Kapitalvikt ur state/allocation.json (allokerings-routinen). Defensiv:
      // giltigt tal 0,2–0,8 används, annars 50/50-baslinje.
      const a = S.allocation;
      let split = 0.5, meta = { dynamic: false };
      if (a && typeof a.nordic === "number" && a.nordic >= 0.2 && a.nordic <= 0.8) {
        split = a.nordic;
        meta = { dynamic: true, rationale: a.rationale, updatedAt: a.updatedAt, week: a.week };
      }
      el.innerHTML = this.R.renderTotal(books, split, meta);
    }

    // ---- US-rotation (egen USD-bok, ny flik) ----
    renderUs() {
      const S = this.state, R = this.R;
      const el = this.el("usBody"); if (!el) return;
      const p = S.portfolioUs;
      if (!p) {
        el.innerHTML = '<div class="empty">Ingen US-rotation ännu \u2013 k\u00f6r US-routinen (skapar <code>state/portfolj_us.md</code> + <code>reports/us_*</code>).</div>';
      } else {
        const latest = S.usDailies[0] || null;
        const live = this.liveMapFor(p, latest);
        const diff = this.P.diffDailies(S.usDailies[0], S.usDailies[1]);
        el.innerHTML = R.renderKPIs(p, latest) + R.renderMarket(latest) + R.renderHoldings(latest, p, live, {}, diff);
      }
      this.setupUsReportPicker();
    }
    setupUsReportPicker() {
      const sel = this.el("usReportSelect"); if (!sel) return;
      const metas = this.state.metas.filter(m => m.type === "us_weekly" || m.type === "us_daily");
      sel.innerHTML = metas.map((m, i) => `<option value="${this.R.esc(m.name)}"${i === 0 ? " selected" : ""}>${this.R.esc(m.dateISO)} \u2014 ${m.type === "us_weekly" ? "Vecko" : "Daglig"} \u00b7 ${this.R.esc(m.label)}</option>`).join("");
      if (sel.value) this.showUsReport(sel.value);
      else this.el("usReportBody").innerHTML = '<div class="empty">Inga US-rapporter \u00e4nnu \u2013 skapas n\u00e4r US-routinen k\u00f6rt.</div>';
    }
    async showUsReport(name) {
      const meta = this.state.metas.find(m => m.name === name);
      const body = this.el("usReportBody"); if (!body) return;
      if (!meta) { body.innerHTML = '<div class="empty">Ingen rapport vald.</div>'; return; }
      const gh = this.el("usGhLink"); if (gh) gh.href = this.ghBlob(meta.path);
      body.innerHTML = '<div class="empty">H\u00e4mtar\u2026</div>';
      try { body.innerHTML = this.mdToHtml(await this.getMd(meta.path)); }
      catch (e) { body.innerHTML = '<div class="empty">Kunde inte h\u00e4mta rapporten.</div>'; }
    }

    // ---- report viewer ----
    setupReportPicker() {
      const sel = this.el("reportSelect");
      sel.innerHTML = this.R.renderOptions(this.state.metas, this.state.reportType);
      if (sel.value) this.showReport(sel.value);
      else this.el("reportBody").innerHTML = '<div class="empty">Inga rapporter av denna typ ännu.</div>';
    }
    async showReport(name) {
      const meta = this.state.metas.find(m => m.name === name);
      if (!meta) { this.el("reportBody").innerHTML = '<div class="empty">Ingen rapport vald.</div>'; return; }
      this.el("ghLink").href = this.ghBlob(meta.path);
      this.el("reportBody").innerHTML = '<div class="empty">Hämtar…</div>';
      try {
        const md = await this.getMd(meta.path);
        this.el("reportBody").dataset.raw = md;
        this.el("reportBody").innerHTML = this.el("rawToggle").checked ? '<pre class="raw">' + this.R.esc(md) + '</pre>' : this.mdToHtml(md);
      } catch (e) { this.el("reportBody").innerHTML = '<div class="empty">Kunde inte hämta rapporten.</div>'; }
    }
    mdToHtml(md) {
      let html;
      try { html = root.marked ? root.marked.parse(md) : '<pre class="raw">' + this.R.esc(md) + '</pre>'; }
      catch (e) { html = '<pre class="raw">' + this.R.esc(md) + '</pre>'; }
      return this.sanitize(html);
    }
    sanitize(html) {
      const t = document.createElement("template"); t.innerHTML = html;
      t.content.querySelectorAll("script,style,iframe,object,embed,link,meta,form").forEach(n => n.remove());
      t.content.querySelectorAll("*").forEach(node => {
        [...node.attributes].forEach(a => {
          if (/^on/i.test(a.name)) node.removeAttribute(a.name);
          else if (/^(href|src)$/i.test(a.name) && /^\s*javascript:/i.test(a.value)) node.removeAttribute(a.name);
        });
      });
      t.content.querySelectorAll("a[href]").forEach(a => { a.target = "_blank"; a.rel = "noopener noreferrer"; });
      return t.innerHTML;
    }

    // ---- analys (på begäran, cachad i git) ----
    renderAnalysisIndex() {
      const el = this.el("analysList"); if (!el) return;
      const metas = this.state.metas.filter(m => m.type === "analysis");
      const byT = {};
      metas.forEach(m => { if (!byT[m.ticker] || m.sortKey > byT[m.ticker].sortKey) byT[m.ticker] = m; });
      const list = Object.values(byT).sort((a, b) => b.sortKey - a.sortKey);
      const pending = ((this.state.queue && this.state.queue.pending) || []).map(p => p && p.ticker).filter(Boolean);
      el.innerHTML = this.R.renderAnalysisIndex(list, pending);
      el.querySelectorAll("[data-ticker]").forEach(b => b.addEventListener("click", () => {
        if (this._cmpMode) this.cmpPick(b, b.dataset.ticker);
        else this.analyse(b.dataset.ticker);
      }));
    }
    analyse(rawTicker) {
      const ticker = (rawTicker || "").toUpperCase().trim().replace(/\s+/g, "");
      if (!ticker) return;
      this.showView("analys");
      const cached = this.state.metas.filter(m => m.type === "analysis" && m.ticker === ticker).sort((a, b) => b.sortKey - a.sortKey);
      if (cached.length) { this.el("analysStatus").innerHTML = "Cachad analys – tryck Re-analysera för en färsk."; this.showAnalysis(cached[0]); return; }
      const url = this.repoURL + "/issues/new?title=" + encodeURIComponent("analys: " + ticker) +
        "&body=" + encodeURIComponent("Begäran om aktieanalys för " + ticker + ". Skicka in ärendet så köas det automatiskt.");
      window.open(url, "_blank", "noopener");
      this.el("analysBody").innerHTML = "";
      this.el("analysStatus").innerHTML = 'Ingen cachad analys för <b>' + this.R.esc(ticker) + '</b>. Skicka in GitHub-ärendet som öppnades, kör sedan "analysera kön" i Cowork – jag lyssnar efter resultatet…';
      this.pollAnalysis(ticker);
    }
    async showAnalysis(meta) {
      const body = this.el("analysBody"); if (!body) return;
      body.innerHTML = '<div class="empty">Hämtar…</div>';
      try {
        const md = await this.getMd(meta.path);
        const verdict = this.P.stripMd(this.P.field(md, "Slutsats")).slice(0, 70);
        const price = this.P.stripMd(this.P.field(md, "Kurs")).slice(0, 90);
        const head = '<div class="an-head"><div><span class="an-tk">' + this.R.esc(meta.ticker) + '</span> <span class="an-date">' + this.R.esc(meta.dateISO) + '</span></div>' +
          (verdict ? '<span class="an-verdict">' + this.R.esc(verdict) + '</span>' : '') + '</div>' +
          (price ? '<div class="an-price">Kurs: ' + this.R.esc(price) + '</div>' : '') +
          '<div class="an-actions"><a class="btn" target="_blank" rel="noopener" href="' + this.ghBlob(meta.path) + '">GitHub</a> <button class="btn" id="anReana">Re-analysera</button></div>';
        body.innerHTML = head + '<div class="report" style="max-height:none">' + this.mdToHtml(md) + '</div>';
        const rb = this.el("anReana"); if (rb) rb.addEventListener("click", () => this.analyse(meta.ticker));
      } catch (e) { body.innerHTML = '<div class="empty">Kunde inte hämta analysen.</div>'; }
    }
    pollAnalysis(ticker) {
      if (this._poll) clearInterval(this._poll);
      let tries = 0;
      this._poll = setInterval(async () => {
        tries++;
        try {
          const paths = await this.discoverTree(true);
          this.state.metas = this.metasFromTree(paths);
          const hit = this.state.metas.filter(m => m.type === "analysis" && m.ticker === ticker).sort((a, b) => b.sortKey - a.sortKey)[0];
          if (hit) {
            clearInterval(this._poll); this._poll = null;
            this.el("analysStatus").innerHTML = 'Analys klar för <b>' + this.R.esc(ticker) + '</b>.';
            this.showAnalysis(hit); this.renderAnalysisIndex();
          }
        } catch (e) {}
        if (tries >= 40 && this._poll) { clearInterval(this._poll); this._poll = null; this.el("analysStatus").innerHTML += ' (slutade lyssna – tryck Analysera igen när den är klar.)'; }
      }, 15000);
    }

    // ---- chart (strategi + benchmark-overlay) ----
    drawChart() {
      const canvas = this.el("returnChart");
      if (!canvas || !root.Chart) { if (this.el("chartWrap")) this.el("chartWrap").style.display = "none"; this.el("chartNote").textContent = root.Chart ? "" : "Diagram kunde inte laddas (offline?)."; return; }
      const strat = this.P.buildReturnSeries(this.state.weeklies, this.state.portfolio);
      const benches = [];
      const omx = this.P.buildBenchmarkSeries(this.state.priceHistory, "^OMX");
      const spx = this.P.buildBenchmarkSeries(this.state.priceHistory, "^GSPC");
      if (omx) benches.push({ label: "OMXS30", color: "#3B82F6", pts: omx });
      if (spx) benches.push({ label: "S&P 500", color: "#8B5CF6", pts: spx });

      // gemensam datumaxel (union), carry-forward-mappning per serie
      const labelSet = new Set(strat.map(p => p.date));
      benches.forEach(b => b.pts.forEach(p => labelSet.add(p.date)));
      const labels = [...labelSet].sort();
      const data = this.P.seriesOnLabels(labels, strat);

      const allZero = strat.every(p => p.value === 0);
      this.el("chartNote").textContent =
        (allZero ? "Baslinje – inga stängda positioner ännu (0 %). " : "") +
        (benches.length ? "Benchmark normaliseras till 0 % vid historikens start." :
          "Benchmark-overlay (OMXS30/S&P) visas när price_history.json fått minst 2 dagars indexdata.");
      const ctx = canvas.getContext("2d");
      const grd = ctx.createLinearGradient(0, 0, 0, 240);
      grd.addColorStop(0, "rgba(16,185,129,0.25)"); grd.addColorStop(1, "rgba(16,185,129,0)");
      if (this.state.chart) this.state.chart.destroy();
      const datasets = [{ label: "Strategin (%)", data, borderColor: "#10B981", backgroundColor: grd, fill: true, tension: 0.25, pointRadius: 3, pointBackgroundColor: "#10B981", borderWidth: 2, spanGaps: true }];
      benches.forEach(b => datasets.push({
        label: b.label, data: this.P.seriesOnLabels(labels, b.pts),
        borderColor: b.color, borderDash: [5, 4], borderWidth: 1.5,
        fill: false, tension: 0.25, pointRadius: 0, spanGaps: true
      }));
      this.state.chart = new Chart(ctx, {
        type: "line",
        data: { labels, datasets },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: benches.length > 0, labels: { color: "#94A3B8", boxWidth: 18, usePointStyle: false } },
            tooltip: { callbacks: { label: c => " " + c.dataset.label + ": " + c.parsed.y + " %" } }
          },
          scales: {
            x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#94A3B8" } },
            y: { grid: { color: "rgba(255,255,255,0.06)" }, ticks: { color: "#94A3B8", callback: v => v + " %" }, suggestedMin: allZero && !benches.length ? -1 : undefined, suggestedMax: allZero && !benches.length ? 1 : undefined }
          }
        }
      });
    }

    // ---- status / ui ----
    setStatus(kind, err) {
      const dot = this.el("liveDot"), txt = this.el("statusTxt");
      if (kind === "loading") { dot.className = "dot dot--load"; txt.textContent = "Hämtar…"; }
      else if (kind === "ok") { dot.className = "dot dot--live"; txt.textContent = "Live"; this.el("updated").textContent = "Uppdaterad " + this.nowStr(); }
      else if (kind === "error") {
        dot.className = "dot dot--err"; txt.textContent = "Fel";
        this.el("banner").innerHTML = '<div class="banner banner--err"><span class="banner-ico">⚠</span><span class="banner-text">Kunde inte hämta data från GitHub (' + this.R.esc(String(err && err.message || err)) + '). Kontrollera att repot är publikt och prova Uppdatera.</span></div>';
      }
    }
    nowStr() { try { return new Date().toLocaleString("sv-SE", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" }); } catch (e) { return new Date().toISOString().slice(0, 16).replace("T", " "); } }

    // ---- wiring ----
    showView(view) {
      const views = [...document.querySelectorAll(".view")];
      if (!views.some(v => v.dataset.view === view)) view = "oversikt";
      views.forEach(v => v.classList.toggle("active", v.dataset.view === view));
      document.querySelectorAll(".subnav a").forEach(l => l.classList.toggle("active", l.dataset.view === view));
      try { history.replaceState(null, "", "#" + view); } catch (e) {}
      window.scrollTo(0, 0);
      if (view === "avkastning") requestAnimationFrame(() => this.drawChart());
      this.refreshClamps(); // nyligen synliga klampar kan mätas först nu
    }
    initNav() {
      document.querySelectorAll(".subnav a").forEach(a =>
        a.addEventListener("click", e => { e.preventDefault(); this.showView(a.dataset.view); }));
      const h = (location.hash || "").slice(1);
      if (h && document.querySelector('.view[data-view="' + h + '"]')) this.showView(h);
    }
    initEvents() {
      this.el("refreshBtn").addEventListener("click", () => { this.state.md.clear(); this.load(true); });
      const ab = this.el("analysBtn"), ai = this.el("analysInput");
      if (ab) ab.addEventListener("click", () => this.analyse(ai ? ai.value : ""));
      if (ai) ai.addEventListener("keydown", e => { if (e.key === "Enter") this.analyse(ai.value); });
      this.el("reportSelect").addEventListener("change", e => this.showReport(e.target.value));
      const usSel = this.el("usReportSelect");
      if (usSel) usSel.addEventListener("change", e => this.showUsReport(e.target.value));
      this.el("rawToggle").addEventListener("change", () => { const b = this.el("reportBody"); const md = b.dataset.raw || ""; if (!md) return; b.innerHTML = this.el("rawToggle").checked ? '<pre class="raw">' + this.R.esc(md) + '</pre>' : this.mdToHtml(md); });
      document.querySelectorAll(".rtype").forEach(btn => btn.addEventListener("click", () => {
        document.querySelectorAll(".rtype").forEach(b => b.classList.remove("on"));
        btn.classList.add("on"); this.state.reportType = btn.dataset.type; this.setupReportPicker();
      }));
      // Rapport: växla 74vh-rullningsbox <-> full höjd (minns valet).
      const fb = this.el("fullBtn");
      if (fb) fb.addEventListener("click", () => {
        const full = this.el("reportBody").classList.toggle("report--full");
        fb.classList.toggle("on", full);
        this.cacheSet("vr_reportfull", full);
      });
      // Fulltextsökning i Rapporter (Enter söker i alla rapporttyper).
      const rs = this.el("repSearch");
      if (rs) rs.addEventListener("keydown", e => { if (e.key === "Enter") this.searchReports(rs.value); });
      // Jämför två cachade analyser sida vid sida.
      const cb = this.el("cmpBtn");
      if (cb) cb.addEventListener("click", () => this.toggleCompare());
      // Delegerade klick (innehållet re-renderas med innerHTML, så lyssna globalt):
      document.addEventListener("click", e => {
        const more = e.target.closest(".clamp-more");
        if (more) {
          const cw = more.closest(".cw");
          const open = cw.classList.toggle("open");
          more.textContent = open ? "Visa mindre" : "Visa mer";
          more.setAttribute("aria-expanded", String(open));
          return;
        }
        const tp = e.target.closest("[data-goto-ticker]");
        if (tp) { this.gotoTicker(tp.dataset.gotoTicker); return; }
        const th = e.target.closest(".tbl--sort th");
        if (th) { this.sortTable(th); return; }
        const sr = e.target.closest("[data-open-report]");
        if (sr) { this.openReportByName(sr.dataset.openReport, sr.dataset.rtype); return; }
        const px = e.target.closest(".px-item");
        if (px && px.dataset.tk) { this.openPxChart(px.dataset.tk); return; }
        if (e.target.id === "pxModal" || e.target.id === "pxModalClose") this.closePxChart();
      });
      document.addEventListener("input", e => { if (e.target && e.target.id === "pxSearch") this.filterPrices(); });
      document.addEventListener("change", e => { if (e.target && e.target.id === "pxSort") this.sortPrices(); });
      // Scout-sektioner: minns öppet/stängt (toggle bubblar inte -> capture).
      document.addEventListener("toggle", e => {
        const d = e.target;
        if (d && d.matches && d.matches("details.sblock[data-key]")) {
          this.cacheSet("vr_sec_" + d.dataset.key, d.open);
          if (d.open) this.refreshClamps();
        }
      }, true);
      // Skrivbordsnotiser: begär tillstånd vid klick, växla av/på därefter.
      const nb = this.el("notifBtn");
      if (nb) {
        if (!("Notification" in window)) nb.style.display = "none";
        else {
          this.updateNotifBtn();
          nb.addEventListener("click", async () => {
            if (Notification.permission !== "granted") {
              const perm = await Notification.requestPermission();
              if (perm === "granted") this.cacheSet("vr_notif_on", true);
            } else {
              this.cacheSet("vr_notif_on", !this.cacheGet("vr_notif_on"));
            }
            this.updateNotifBtn();
          });
        }
      }
      // Kortkommandon: 1–7 byter flik, R uppdaterar (inte när man skriver i fält).
      document.addEventListener("keydown", e => {
        if (e.altKey || e.ctrlKey || e.metaKey) return;
        if (e.key === "Escape") { this.closePxChart(); return; }
        const t = e.target, tag = (t && t.tagName || "").toLowerCase();
        if (tag === "input" || tag === "textarea" || tag === "select" || (t && t.isContentEditable)) return;
        const links = [...document.querySelectorAll(".subnav a")];
        const n = parseInt(e.key, 10);
        if (n >= 1 && n <= links.length) this.showView(links[n - 1].dataset.view);
        else if (e.key === "r" || e.key === "R") { this.state.md.clear(); this.load(true); }
      });
    }
    boot() {
      this.initNav(); this.initEvents(); this.load(false);
      // Tickande nedräkning till nästa körning (statusraden på Översikt).
      setInterval(() => {
        const el = this.el("statusRow");
        if (el && this.state.dailies.length)
          el.innerHTML = this.R.renderStatusRow(this.state.dailies[0] || null, this.P.nextRoutineRun(new Date()));
      }, 30000);
      // Lätt alerts-poll var 5:e minut (banner + ev. skrivbordsnotis).
      setInterval(() => this.pollAlerts(), 300000);
    }
  }

  const CFG = { owner: "DrinasKastrati", repo: "Vecko_agent", branch: "main" };
  const dash = new Dashboard(CFG);
  root.dashboard = dash; // expose for debugging
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => dash.boot());
  else dash.boot();
})(typeof window!=="undefined"?window:this);
