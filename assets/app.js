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
        metas: [], dailies: [], weeklies: [], portfolio: null, feed: null, prices: null, scouts: [],
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
        const wMetas = metas.filter(m => m.type === "weekly").slice(0, 12);
        const dMetas = metas.filter(m => m.type === "daily").slice(0, 8);
        const sMetas = metas.filter(m => m.type === "scout").slice(0, 12);
        const [pMd, dMds, wMds, sMds, prices] = await Promise.all([
          this.getMd(portfPath).catch(() => null),
          Promise.all(dMetas.map(m => this.getMd(m.path))),
          Promise.all(wMetas.map(m => this.getMd(m.path))),
          Promise.all(sMetas.map(m => this.getMd(m.path))),
          pricesPath ? this.fetchJSON(this.raw(pricesPath)).catch(() => null) : Promise.resolve(null)
        ]);
        this.state.prices = prices;
        this.state.portfolio = pMd ? this.P.parsePortfolio(pMd) : { accum: null, cash: "", holdings: [], pending: [], history: [], note: null, updated: "" };
        this.state.dailies  = dMetas.map((m, i) => this.P.parseDaily(dMds[i], m));
        this.state.weeklies = wMetas.map((m, i) => this.P.parseWeekly(wMds[i], m));
        this.state.scouts   = sMetas.map((m, i) => this.P.parseScout(sMds[i], m));
        this.state.feed = this.P.buildFeed(this.state.dailies, this.state.weeklies);
        this.renderAll();
        this.setStatus("ok");
      } catch (err) { console.error(err); this.setStatus("error", err); }
    }

    renderAll() {
      const S = this.state, R = this.R;
      const latestDaily = S.dailies[0] || null;
      this.el("banner").innerHTML = R.renderBanner(S.portfolio.note);
      this.el("kpis").innerHTML = R.renderKPIs(S.portfolio, latestDaily);
      this.el("market").innerHTML = R.renderMarket(latestDaily);
      this.el("holdings").innerHTML = R.renderHoldings(latestDaily, S.portfolio);
      const pxEl = this.el("prices"); if (pxEl) pxEl.innerHTML = R.renderPrices(S.prices);
      this.el("feed").innerHTML = R.renderFeed(S.feed);
      const sbEl = this.el("scoutBody"); if (sbEl) sbEl.innerHTML = R.renderScout(S.scouts[0] || null);
      this.el("history").innerHTML = R.renderHistory(S.portfolio);
      this.el("bubblare").innerHTML = R.renderBubblare(S.weeklies[0]);
      this.el("repoFoot").href = this.repoURL;
      this.setupReportPicker();
      this.drawChart();
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

    // ---- chart ----
    drawChart() {
      const canvas = this.el("returnChart");
      if (!canvas || !root.Chart) { if (this.el("chartWrap")) this.el("chartWrap").style.display = "none"; this.el("chartNote").textContent = root.Chart ? "" : "Diagram kunde inte laddas (offline?)."; return; }
      const series = this.P.buildReturnSeries(this.state.weeklies, this.state.portfolio);
      const labels = series.map(p => p.date); const data = series.map(p => p.value);
      const allZero = data.every(v => v === 0);
      this.el("chartNote").textContent = allZero ? "Baslinje – inga stängda positioner ännu (0 %)." : "";
      const ctx = canvas.getContext("2d");
      const grd = ctx.createLinearGradient(0, 0, 0, 240);
      grd.addColorStop(0, "rgba(38,208,124,0.25)"); grd.addColorStop(1, "rgba(38,208,124,0)");
      if (this.state.chart) this.state.chart.destroy();
      this.state.chart = new Chart(ctx, {
        type: "line",
        data: { labels, datasets: [{ label: "Ackumulerad avkastning (%)", data, borderColor: "#26d07c", backgroundColor: grd, fill: true, tension: 0.25, pointRadius: 3, pointBackgroundColor: "#26d07c", borderWidth: 2 }] },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => " " + c.parsed.y + " %" } } },
          scales: {
            x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#8b9cb8" } },
            y: { grid: { color: "rgba(255,255,255,0.06)" }, ticks: { color: "#8b9cb8", callback: v => v + " %" }, suggestedMin: allZero ? -1 : undefined, suggestedMax: allZero ? 1 : undefined }
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
    }
    initNav() {
      document.querySelectorAll(".subnav a").forEach(a =>
        a.addEventListener("click", e => { e.preventDefault(); this.showView(a.dataset.view); }));
      const h = (location.hash || "").slice(1);
      if (h && document.querySelector('.view[data-view="' + h + '"]')) this.showView(h);
    }
    initEvents() {
      this.el("refreshBtn").addEventListener("click", () => { this.state.md.clear(); this.load(true); });
      this.el("reportSelect").addEventListener("change", e => this.showReport(e.target.value));
      this.el("rawToggle").addEventListener("change", () => { const b = this.el("reportBody"); const md = b.dataset.raw || ""; if (!md) return; b.innerHTML = this.el("rawToggle").checked ? '<pre class="raw">' + this.R.esc(md) + '</pre>' : this.mdToHtml(md); });
      document.querySelectorAll(".rtype").forEach(btn => btn.addEventListener("click", () => {
        document.querySelectorAll(".rtype").forEach(b => b.classList.remove("on"));
        btn.classList.add("on"); this.state.reportType = btn.dataset.type; this.setupReportPicker();
      }));
    }
    boot() { this.initNav(); this.initEvents(); this.load(false); }
  }

  const CFG = { owner: "DrinasKastrati", repo: "Vecko_agent", branch: "main" };
  const dash = new Dashboard(CFG);
  root.dashboard = dash; // expose for debugging
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => dash.boot());
  else dash.boot();
})(typeof window!=="undefined"?window:this);
