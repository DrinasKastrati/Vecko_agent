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
        portfolioUs: null, usDailies: [], usWeeklies: [], allocation: null, lessons: null, costs: null,
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
    // Två vägar: FÖRBYGGD (state/dashboard.json, en hämtning) och LIVE (filträd
    // via GitHub-API:t + ~56 råhämtningar). Den förbyggda är normalvägen; live
    // finns kvar som fallback när dashboard.json saknas, är av fel version eller
    // inte går att hämta – t.ex. direkt efter att en routine pushat men innan
    // dashboard-actionen hunnit köra.
    async load(force) {
      this.setStatus("loading");
      try {
        if (await this.loadPrebuilt(force)) {
          this.renderAll(); this.setStatus("ok");
          // Inställningsvyn visar vilken datakälla som användes – den är känd
          // först nu, så rutan måste ritas om.
          if (root.VSettings) root.VSettings.render();
          return;
        }
      } catch (e) {
        console.warn("[dashboard] förbyggd data otillgänglig – faller tillbaka på live-hämtning:", e && e.message);
      }
      return this.loadLive(force);
    }

    // Förbyggd data: allt markdown-härlett kommer färdigparsat ur dashboard.json.
    // Volatil JSON (kurser, signaler, kön, allokering, kostnader, beslut) hämtas
    // fortfarande live – de skrivs var 30:e minut av andra actions och skulle
    // annars tvinga fram en ombyggnad lika ofta.
    async loadPrebuilt(force) {
      const d = await this.fetchJSON(this.raw("state/dashboard.json"));
      if (!d || d.version !== 1 || !Array.isArray(d.metas) || !d.metas.length) return false;

      const j = p => this.fetchJSON(this.raw(p)).catch(() => null);
      // decision_eval.json bakas medvetet INTE in i dashboard.json: den skrivs av
      // pris-jobbet var 30:e minut (när ett beslut mognar) och skulle tvinga fram en
      // ombyggnad lika ofta – samma skäl som för prices/alerts/decisions.
      const [prices, queue, priceHistory, alerts, alloc, costs, decisions, decisionEval] = await Promise.all([
        j("state/prices.json"), j("state/analysis_queue.json"), j("state/price_history.json"),
        j("state/alerts.json"), j("state/allocation.json"), j("config/kostnader.json"),
        j("state/decisions.json"), j("state/decision_eval.json")
      ]);

      const S = this.state;
      S.metas = d.metas;
      S.portfolio = d.portfolio || { accum: null, cash: "", holdings: [], pending: [], history: [], note: null, updated: "" };
      S.portfolioUs = d.portfolioUs || null;
      S.dailies = d.dailies || [];
      S.weeklies = d.weeklies || [];
      S.scouts = d.scouts || [];
      S.usDailies = d.usDailies || [];
      S.usWeeklies = d.usWeeklies || [];
      S.lessons = d.lessons || null;
      S.watchlist = d.watchlist || null;
      S.watchlistUs = d.watchlistUs || null;
      S.prices = prices; S.queue = queue; S.priceHistory = priceHistory; S.alerts = alerts;
      S.allocation = alloc; S.costs = costs || this.P.DEFAULT_COSTS; S.decisions = decisions;
      S.decisionEval = decisionEval;
      S.feed = this.P.buildFeed(S.dailies, S.weeklies);
      this._alertsPath = "state/alerts.json";
      this._prebuiltAt = d.generatedAt || null;
      return true;
    }

    async loadLive(force) {
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
        const lessonsPath = paths.find(p => /(^|\/)lessons\.md$/i.test(p));
        const costsPath = paths.find(p => /(^|\/)kostnader\.json$/i.test(p));
        const decisionsPath = paths.find(p => /(^|\/)decisions\.json$/i.test(p));
        const decEvalPath = paths.find(p => /(^|\/)decision_eval\.json$/i.test(p));
        const wlPath = paths.find(p => /(^|\/)watchlist\.txt$/i.test(p));
        const wlUsPath = paths.find(p => /(^|\/)watchlist_us\.txt$/i.test(p));
        const wMetas = metas.filter(m => m.type === "weekly").slice(0, 12);
        const dMetas = metas.filter(m => m.type === "daily").slice(0, 10);
        const sMetas = metas.filter(m => m.type === "scout").slice(0, 12);
        const udMetas = metas.filter(m => m.type === "us_daily").slice(0, 10);
        const uwMetas = metas.filter(m => m.type === "us_weekly").slice(0, 12);
        const [pMd, dMds, wMds, sMds, prices, queue, priceHistory, alerts, pUsMd, udMds, uwMds, alloc, lessonsMd, costs, decisions, wlTxt, wlUsTxt, decisionEval] = await Promise.all([
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
          allocPath ? this.fetchJSON(this.raw(allocPath)).catch(() => null) : Promise.resolve(null),
          lessonsPath ? this.getMd(lessonsPath).catch(() => null) : Promise.resolve(null),
          costsPath ? this.fetchJSON(this.raw(costsPath)).catch(() => null) : Promise.resolve(null),
          decisionsPath ? this.fetchJSON(this.raw(decisionsPath)).catch(() => null) : Promise.resolve(null),
          wlPath ? this.getMd(wlPath).catch(() => null) : Promise.resolve(null),
          wlUsPath ? this.getMd(wlUsPath).catch(() => null) : Promise.resolve(null),
          decEvalPath ? this.fetchJSON(this.raw(decEvalPath)).catch(() => null) : Promise.resolve(null)
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
        this.state.lessons = lessonsMd ? this.P.parseLessons(lessonsMd) : null;
        this.state.costs = costs || this.P.DEFAULT_COSTS;
        this.state.decisions = decisions;
        this.state.decisionEval = decisionEval;
        this.state.watchlist = wlTxt;
        this.state.watchlistUs = wlUsTxt;
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

    /* ---- LAT LADDNING AV TREDJEPARTSBIBLIOTEK ----------------------------
       marked, Chart.js och Lightweight Charts låg tidigare som tre <script> i
       index.html och hämtades vid VARJE sidladdning: 405 kB som ingen behöver
       för att se startvyn. marked används först när en rapport öppnas, Chart.js
       i Avkastning-vyn, Lightweight Charts i kursmodalen. Nu hämtas de när de
       faktiskt behövs, en gång per session.

       Misslyckas hämtningen (offline) resolvar löftet ändå med false – varje
       anropsställe har redan en reserv (rå markdown respektive "diagram kunde
       inte laddas"), och en trasig CDN får aldrig sänka hela vyn. */
    lib(name) {
      const URLS = {
        marked: "https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js",
        Chart: "https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js",
        LightweightCharts: "https://cdn.jsdelivr.net/npm/lightweight-charts@4.2.0/dist/lightweight-charts.standalone.production.js"
      };
      this._libs = this._libs || {};
      if (root[name]) return Promise.resolve(true);
      if (this._libs[name]) return this._libs[name];
      const url = URLS[name];
      if (!url) return Promise.resolve(false);
      this._libs[name] = new Promise(resolve => {
        /* Löftet MÅSTE alltid settla. En <script> mot en CDN som varken svarar
           eller felar (kapat nät, DNS som hänger) ger varken onload eller
           onerror – utan tidsgränsen fastnade rapportvyn på "Hämtar…" i stället
           för att falla tillbaka på rå markdown. Fångades av tests/sim.mjs. */
        let done = false;
        const finish = okv => { if (!done) { done = true; resolve(okv); } };
        const timer = setTimeout(() => finish(false), 8000);
        const s = document.createElement("script");
        s.src = url; s.async = true;
        s.onload = () => { clearTimeout(timer); finish(!!root[name]); };
        s.onerror = () => { clearTimeout(timer); finish(false); };
        document.head.appendChild(s);
      });
      return this._libs[name];
    }

    /* Enkel eller detaljerad Hem-vy. VSettings äger valet (localStorage, per
       enhet) och speglar det till <html data-hemmode>. Läs alltid attributet –
       då fungerar växlingen även om settings.js inte hunnit initiera. */
    hemMode() {
      const v = document.documentElement.getAttribute("data-hemmode");
      return v === "detaljerad" ? "detaljerad" : "enkel";
    }
    // Markerar rätt knapp i växeln (aria-pressed styr både utseende och skärmläsare).
    syncHemToggle() {
      const cur = this.hemMode();
      document.querySelectorAll("[data-hemmode-set]").forEach(b =>
        b.setAttribute("aria-pressed", String(b.dataset.hemmodeSet === cur)));
    }

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
      const alEl = this.el("alerts"); if (alEl) alEl.innerHTML = R.renderAlerts(S.alerts, this.P.monitorStatus(S.alerts));
      const srEl = this.el("statusRow");
      if (srEl) srEl.innerHTML = R.renderStatusRow(latestDaily, this.P.nextRoutineRun(new Date()));
      this.el("kpis").innerHTML = R.renderKPIs(S.portfolio, latestDaily);
      this.el("market").innerHTML = R.renderMarket(latestDaily);
      this.el("holdings").innerHTML = R.renderHoldings(latestDaily, S.portfolio, this.buildLiveMap(), this.buildDecisionMap(latestDaily), this.P.diffDailies(S.dailies[0], S.dailies[1]));
      this.renderPxBadge();
      // Rollerna gör Kurser-vyn läsbar: innehav, plan, bubblare, indexdel och
      // rena bevakningar såg tidigare exakt likadana ut.
      const roles = this.P.tickerRoles({
        portfolio: S.portfolio, portfolioUs: S.portfolioUs,
        weekly: S.weeklies[0], usWeekly: S.usWeeklies[0],
        watchlist: S.watchlist, watchlistUs: S.watchlistUs
      });
      const pxEl = this.el("prices"); if (pxEl) pxEl.innerHTML = R.renderPrices(S.prices, S.priceHistory, roles);
      this.el("feed").innerHTML = R.renderFeed(S.feed);
      const sbEl = this.el("scoutBody"); if (sbEl) sbEl.innerHTML = R.renderScout(S.scouts[0] || null);
      this.renderAnalysisIndex();
      /* Avkastning-vyn visar BÅDA böckerna, i var sitt block. Samma rena
         funktioner för båda – bara kostnadsmodell, benchmark och id-prefix
         skiljer. De slås aldrig ihop: ett gemensamt alpha över en SEK-affär mot
         OMXS30 och en USD-affär mot S&P 500 vore meningslöst. Blandad total
         finns i Total-vyn. */
      this.renderBookStats("", S.portfolio, "nordic", "^OMX", "OMXS30");
      this.renderBookStats("us", S.portfolioUs, "us", "^GSPC", "S&P 500");
      this.renderBothBooks();
      // Beslutsloggen: gör kalibreringsunderlaget synligt (och synligt när det slutat fyllas).
      const dlEl = this.el("decisionStats");
      if (dlEl) dlEl.innerHTML = R.renderDecisionStats(this.P.decisionStats(S.decisions));
      // Urvalsmätningen: svarar på om katalysatorurvalet tillför något, utan att
      // invänta stängda affärer. Ligger öppet (inte i en details) eftersom det är
      // den frågan backtestet lämnade obesvarad.
      const deEl = this.el("decisionEval");
      if (deEl) deEl.innerHTML = R.renderDecisionEval(S.decisionEval);
      this.el("bubblare").innerHTML = R.renderBubblare(S.weeklies[0]);
      this.renderTotalView();
      this.renderUs();
      this.renderRetro();
      this.renderHem();
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

    // Fritext OCH rollchip filtrerar samma lista – båda måste stämma.
    filterPrices() {
      const inp = this.el("pxSearch"), grid = this.el("pxGrid");
      if (!grid) return;
      const q = ((inp && inp.value) || "").toUpperCase().trim();
      this._pxQuery = q;
      const role = this._pxRole || "alla";
      grid.querySelectorAll(".px-item").forEach(it => {
        const okText = !q || (it.dataset.tk || "").includes(q);
        const okRole = role === "alla" || (it.dataset.role || "") === role;
        it.style.display = okText && okRole ? "" : "none";
      });
    }
    setPriceRole(role) {
      this._pxRole = role || "alla";
      const chips = this.el("pxChips");
      if (chips) chips.querySelectorAll(".px-chip").forEach(c =>
        c.classList.toggle("on", (c.dataset.role || "alla") === this._pxRole));
      this.filterPrices();
    }
    sortPrices() {
      const sel = this.el("pxSort"), grid = this.el("pxGrid");
      if (!grid) return;
      const mode = (sel && sel.value) || "role";
      this._pxSort = mode;
      // Rollordningen är densamma som i VParse.ROLE_ORDER: det man äger först,
      // rena bevakningar sist. Inom en roll sorteras alfabetiskt.
      const order = this.P.ROLE_ORDER || ["innehav", "plan", "bubblare", "sleeve", "index", "valuta", "bevakad"];
      const rank = n => { const i = order.indexOf(n.dataset.role || "bevakad"); return i < 0 ? order.length : i; };
      const chg = n => {
        const t = (n.querySelector(".px-chg") || {}).textContent || "";
        const v = parseFloat(String(t).replace(",", ".").replace(/[^\d.+-]/g, ""));
        return isNaN(v) ? -Infinity : v;
      };
      const az = (a, b) => (a.dataset.tk || "").localeCompare(b.dataset.tk || "", "sv");
      [...grid.children].sort((a, b) => {
        if (mode === "fresh") return (Number(b.dataset.t) || 0) - (Number(a.dataset.t) || 0);
        if (mode === "chg") return chg(b) - chg(a);
        if (mode === "role") return (rank(a) - rank(b)) || az(a, b);
        return az(a, b);
      }).forEach(n => grid.appendChild(n));
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
      if (inp && this._pxQuery) { inp.value = this._pxQuery; }
      if (this._pxRole && this._pxRole !== "alla") this.setPriceRole(this._pxRole);
      else this.filterPrices();
      if (sel) { sel.value = this._pxSort || "role"; this.sortPrices(); }
    }

    // ---- kurshistorik-modal (klick på kort i Kurser) ----
    async openPxChart(tk) {
      const modal = this.el("pxModal");
      if (!modal) return;
      /* Diagrambiblioteken hämtas först här – modalen öppnas sällan och de två
         väger tillsammans 370 kB. Lightweight Charts är förstahandsval; går den
         inte att hämta försöker vi med Chart.js som reserv. */
      if (!root.LightweightCharts && !root.Chart) {
        if (!await this.lib("LightweightCharts")) await this.lib("Chart");
      }
      // Endera diagrambiblioteket räcker – Lightweight Charts är förstahandsval,
      // Chart.js reserv. Kräv inte Chart.js när LWC finns.
      if (!(root.LightweightCharts || root.Chart)) return;
      this.el("pxModalTitle").textContent = tk;
      modal.classList.add("open");
      const av = this.el("pxModalAvanza");
      if (av) { const url = this.avanzaUrl(tk); if (url) { av.href = url; av.hidden = false; } else av.hidden = true; }
      const note = this.el("pxModalNote");
      const ser = this.state.priceHistory && this.state.priceHistory.series && this.state.priceHistory.series[tk];
      if (this._pxChart) { this._pxChart.destroy(); this._pxChart = null; }
      const host = this.el("pxModalChart"); if (host) host.innerHTML = "";  // annars staplas diagram
      const lg0 = this.el("pxLegend"); if (lg0) { lg0.hidden = true; lg0.innerHTML = ""; }
      if (!ser || ser.length < 2) {
        note.textContent = "Ingen kurshistorik ännu för " + tk + " – fylls på av pris-actionen (rullande 60 dagar).";
        return;
      }
      const q = this.state.prices && this.state.prices.quotes && this.state.prices.quotes[tk];
      note.textContent = ser.length + " dagar · stängningskurser ur price_history.json" + (q && q.currency ? " · " + q.currency : "");
      const up = ser[ser.length - 1][1] >= ser[0][1];
      if (root.LightweightCharts) this.drawPxLightweight(tk, ser, up);
      else this.drawPxFallback(tk, ser, up);
    }

    // Lightweight Charts: hårkors som följer muspekaren, zoom med hjulet och
    // panorering med drag. Färgerna läses ur temats CSS-variabler så diagrammet
    // följer ljust/mörkt läge utan egen konfiguration.
    drawPxLightweight(tk, ser, up) {
      const host = this.el("pxModalChart");
      const legend = this.el("pxLegend");
      const css = getComputedStyle(document.documentElement);
      const v = (n, fb) => (css.getPropertyValue(n) || "").trim() || fb;
      const col = up ? v("--trade-up", "#10B981") : v("--trade-down", "#EF4444");
      const LC = root.LightweightCharts;

      const chart = LC.createChart(host, {
        autoSize: true,
        layout: { background: { type: "solid", color: "transparent" }, textColor: v("--chart-tick", "#94A3B8"), fontSize: 11 },
        grid: { vertLines: { color: v("--chart-grid", "rgba(255,255,255,.06)") }, horzLines: { color: v("--chart-grid", "rgba(255,255,255,.06)") } },
        rightPriceScale: { borderColor: v("--chart-border", "#31425F") },
        timeScale: { borderColor: v("--chart-border", "#31425F"), fixLeftEdge: true, fixRightEdge: true },
        crosshair: { mode: LC.CrosshairMode ? LC.CrosshairMode.Normal : 0 },
        localization: { locale: "sv-SE" },
        handleScale: { axisPressedMouseMove: false }
      });
      const series = chart.addAreaSeries({
        lineColor: col, lineWidth: 2, topColor: col + "44", bottomColor: col + "05",
        priceLineVisible: false, lastValueVisible: true
      });
      series.setData(ser.map(p => ({ time: p[0], value: p[1] })));
      chart.timeScale().fitContent();

      // Hårkorset matar en egen liten legend – LWC har ingen inbyggd tooltip.
      const last = ser[ser.length - 1];
      const fmt = (d, val) => `<b>${this.R.esc(tk)}</b><span class="px-lg-d">${this.R.esc(d)}</span>` +
        `<span class="px-lg-v">${Number(val).toLocaleString("sv-SE", { maximumFractionDigits: 2 })}</span>`;
      if (legend) { legend.hidden = false; legend.innerHTML = fmt(last[0], last[1]); }
      chart.subscribeCrosshairMove(param => {
        if (!legend) return;
        const p = param.seriesData && param.seriesData.get(series);
        if (!p || !param.time) { legend.innerHTML = fmt(last[0], last[1]); return; }
        legend.innerHTML = fmt(param.time, p.value);
      });

      this._pxChart = { destroy: () => chart.remove(), _lwc: true };
    }

    // Reserv när CDN:et inte når fram (offline): samma data i Chart.js.
    drawPxFallback(tk, ser, up) {
      if (!root.Chart) return;
      const host = this.el("pxModalChart");
      host.innerHTML = '<canvas></canvas>';
      const ctx = host.firstChild.getContext("2d");
      const col = up ? "#10B981" : "#EF4444";
      const grd = ctx.createLinearGradient(0, 0, 0, 280);
      grd.addColorStop(0, up ? "rgba(16,185,129,0.22)" : "rgba(239,68,68,0.2)");
      grd.addColorStop(1, "rgba(0,0,0,0)");
      this._pxChart = new Chart(ctx, {
        type: "line",
        data: { labels: ser.map(p => p[0]), datasets: [{ label: tk, data: ser.map(p => p[1]), borderColor: col, backgroundColor: grd, fill: true, tension: 0.2, pointRadius: 2, borderWidth: 2 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
      });
    }
    closePxChart() {
      const modal = this.el("pxModal");
      if (modal) modal.classList.remove("open");
      if (this._pxChart) { this._pxChart.destroy(); this._pxChart = null; }
      const host = this.el("pxModalChart"); if (host) host.innerHTML = "";
      const lg = this.el("pxLegend"); if (lg) { lg.hidden = true; lg.innerHTML = ""; }
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
        const alEl = this.el("alerts"); if (alEl) alEl.innerHTML = this.R.renderAlerts(alerts, this.P.monitorStatus(alerts));
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
      const docs = await this.searchDocs();
      // Indexet täcker de N senaste rapporterna, inte alla. Säg det – en tyst
      // lucka i sökningen är värre än en synlig gräns.
      const m = this._searchMeta;
      const note = (m && m.covered < m.total)
        ? '<div class="sr-scope">Sökningen täcker de <b>' + m.covered + '</b> senaste rapporterna av ' +
          m.total + (m.oldest ? ' (tillbaka till ' + this.R.esc(m.oldest) + ')' : '') +
          '. Äldre rapporter öppnas via väljaren ovan.</div>'
        : "";
      body.innerHTML = note + this.R.renderSearchResults(this.P.searchDocs(docs, q), q);
      this.clearReportRail();   // träfflistan har ingen innehållsförteckning
    }
    // Dokumenten att söka i. Förbyggt index = EN hämtning (cachas för sessionen);
    // utan index faller vi tillbaka på en hämtning per rapport, som tidigare.
    async searchDocs() {
      if (this._searchDocs) return this._searchDocs;
      try {
        const idx = await this.fetchJSON(this.raw("state/search-index.json"));
        if (idx && idx.version === 1 && Array.isArray(idx.docs) && idx.docs.length) {
          this._searchDocs = idx.docs;
          this._searchMeta = { covered: idx.covered || idx.docs.length, total: idx.total || idx.docs.length, oldest: idx.oldest || null };
          return this._searchDocs;
        }
      } catch (e) {
        console.warn("[dashboard] sökindex otillgängligt – hämtar rapporterna en och en:", e && e.message);
      }
      return Promise.all(this.state.metas.map(async m => ({ meta: m, text: await this.getMd(m.path).catch(() => "") })));
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
        await this.ensureMarked();
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
      // Valutan: us-boken redovisas i USD. Vi kan inte räkna om historiken (kursen
      // vid varje affär är inte loggad), så vi visar vad som exkluderas.
      meta.fx = this.P.fxRate(S.prices);
      el.innerHTML = this.R.renderTotal(books, split, meta);
    }

    // ---- US-rotation (egen USD-bok, ny flik) ----
    /* Ett bokblock i Avkastning-vyn: handelsstatistik, riskmått, alpha,
       månadsutfall och historik. `prefix` är "" för nordiska boken (id:n
       tradeStats, riskStats …) och "us" för den amerikanska (usTradeStats,
       usRiskStats …). Saknas boken lämnas blocket tomt med en förklaring i
       stället för att försvinna tyst.
       Returnerar alpha-kartan, som historiktabellen och Hem också använder. */
    renderBookStats(prefix, portfolio, costKey, benchTicker, benchLabel) {
      const S = this.state, R = this.R;
      const id = n => prefix ? prefix + n[0].toUpperCase() + n.slice(1) : n;
      const set = (n, html) => { const el = this.el(id(n)); if (el) el.innerHTML = html; };
      if (!portfolio) {
        set("tradeStats", '<div class="empty">Boken finns inte ännu.</div>');
        ["riskStats", "alphaStats", "monthly", "history"].forEach(n => set(n, ""));
        return {};
      }
      const hist = portfolio.history || [];
      const cost = this.P.costFor(costKey, S.costs);
      const alphaMap = this.P.computeAlpha(hist, S.priceHistory, benchTicker);
      set("tradeStats", R.renderTradeStats(this.P.computeTradeStats(hist, cost)));
      set("riskStats", R.renderRiskStats(this.P.computeRiskStats(hist)));
      set("alphaStats", R.renderAlphaStats(this.P.computeAlphaStats(hist, S.priceHistory, benchTicker), benchLabel));
      set("monthly", R.renderMonthlyHeatmap(this.P.buildMonthlyStats(hist)));
      set("history", R.renderHistory(portfolio, alphaMap, benchLabel));
      return alphaMap;
    }

    /* Gemensamma blocket: alla stängda affärer ur BÅDA böckerna i en tabell.
       Varje rad märks med sin bok, och den märkningen styr sedan både
       rundturskostnaden (nordiskt ~0,25 %, USD ~0,75 % med växlingspåslag) och
       vilket index affären mäts mot. Det är därför de rena funktionerna tar
       emot en funktion i stället för ett fast värde – ett snitt hade gjort
       nettot fel åt båda håll och alpha jämfört mot fel marknad.

       Riskmått och månadsutfall utelämnas AVSIKTLIGT: båda kedjar en
       equity-kurva, och två separat finansierade böcker i olika valutor har
       ingen gemensam kurva. Blandad avkastning hör hemma i Total-vyn. */
    renderBothBooks() {
      const S = this.state, R = this.R;
      const el = this.el("allTradeStats"); if (!el) return;
      const tag = (rows, bok) => (rows || [])
        .filter(o => o && o["Aktie"] && !/^[–\-]$/.test(String(o["Aktie"]).trim()))
        .map(o => Object.assign({ Bok: bok }, o));
      const hist = tag(S.portfolio && S.portfolio.history, "Nordisk")
        .concat(tag(S.portfolioUs && S.portfolioUs.history, "US"))
        .sort((a, b) => String(b["Stängd"] || "").localeCompare(String(a["Stängd"] || "")));
      const set = (id, html) => { const e = this.el(id); if (e) e.innerHTML = html; };
      if (!hist.length) {
        set("allTradeStats", '<div class="empty">Inga stängda affärer i någon av böckerna ännu.</div>');
        set("allHistory", ""); set("allAlphaStats", "");
        return;
      }
      const isUs = o => o.Bok === "US";
      const costOf = o => this.P.costFor(isUs(o) ? "us" : "nordic", S.costs);
      const benchOf = o => isUs(o) ? "^GSPC" : "^OMX";
      set("allTradeStats", R.renderTradeStats(this.P.computeTradeStats(hist, costOf)));
      set("allAlphaStats", R.renderAlphaStats(this.P.computeAlphaStats(hist, S.priceHistory, benchOf), "sitt index"));
      set("allHistory", R.renderHistory({ history: hist }, this.P.computeAlpha(hist, S.priceHistory, benchOf), "Index"));
    }

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
        /* Den här vyn visar BOKEN just nu: nyckeltal, marknadsläge och öppna
           positioner. Handelsstatistik, riskmått, alpha och historik låg
           tidigare också här, men fanns då på två flikar samtidigt – de bor
           numera enbart i Avkastning-vyn, bredvid nordiska bokens motsvarande
           block. Duplicera inte tillbaka dem hit. */
        el.innerHTML = R.renderKPIs(p, latest) + R.renderMarket(latest)
          + R.renderHoldings(latest, p, live, {}, diff)
          + '<p class="stat-note" style="margin:16px 0 0">Handelsstatistik, riskmått, alpha och historik för den '
          + 'här boken finns under <button type="button" class="rail-more" data-goto-view="avkastning">Avkastning →</button></p>';
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
      try { const md = await this.getMd(meta.path); await this.ensureMarked(); body.innerHTML = this.mdToHtml(md); }
      catch (e) { body.innerHTML = '<div class="empty">Kunde inte h\u00e4mta rapporten.</div>'; }
    }

    // ---- Hem: handlingsytan (innehav + dagens beslut + vad som händer) ----
    /* Modellen bakom enkla vyn. Samma state som den detaljerade vyn läser –
       skillnaden är att allt plockas ned till namn, beslut och en mening.
       Byggs här (DOM/state) så att VRender.renderSimple förblir ren. */
    simpleModel() {
      const S = this.state, P = this.P;
      const SLEEVE = /XACT|SPY|indexsleeve|indexdel/i;
      /* VAD som ägs kommer ur portfolj.md (sanningen om öppna positioner).
         VAD SOM BESLUTADES kommer ur dagens rapport. De två är inte samma sak:
         en LÄGE B-rapport kan sakna beslutsrader helt utan att innehavet ändrats,
         och en tidig version av den här vyn påstod då "äger inget" trots att
         portföljen hade en position. */
      const bookOf = (label, portfolio, daily) => {
        const live = this.liveMapFor(portfolio, daily);
        return {
          label,
          accum: portfolio && portfolio.accum != null ? portfolio.accum : null,
          holdings: ((portfolio && portfolio.holdings) || []).map(row => {
            const name = this.P.stripMd(row["Aktie"] || "");
            const ticker = this.P.stripMd(row["Yahoo-ticker"] || "");
            const lv = live[(ticker || "").toUpperCase()];
            return {
              name, ticker,
              since: lv && lv.pnlPct != null ? this.R.plainPct(lv.pnlPct) : "",
              isSleeve: SLEEVE.test(ticker) || SLEEVE.test(name)
            };
          })
        };
      };
      const books = [bookOf("Nordiska aktier", S.portfolio, S.dailies[0])];
      if (S.portfolioUs) books.push(bookOf("Amerikanska aktier", S.portfolioUs, S.usDailies[0]));

      // Dagens beslut, oavsett om aktien ligger i portföljen än.
      const actions = [];
      [[S.dailies[0], "n"], [S.usDailies[0], "u"]].forEach(([d]) => {
        ((d && d.holdings) || []).forEach(h => {
          if (!h.decision) return;
          actions.push({ decision: h.decision, ticker: h.ticker, name: h.name,
            why: this.P.stripMd(h.motivation || "") });
        });
      });

      const nAcc = S.portfolio && S.portfolio.accum, uAcc = S.portfolioUs && S.portfolioUs.accum;
      const accs = [nAcc, uAcc].filter(v => v != null);
      const nx = P.nextRoutineRun(new Date());
      return {
        totalAccum: accs.length ? accs.reduce((a, b) => a + b, 0) / accs.length : null,
        books, actions,
        blocked: !!(S.dailies[0] && S.dailies[0].blocked),
        dateLabel: (S.dailies[0] && S.dailies[0].dateISO) || "",
        next: nx ? `${nx.label} ${nx.when}` : ""
      };
    }

    renderHem() {
      const S = this.state, R = this.R, P = this.P;
      const main = this.el("hemMain"), rail = this.el("hemRail");
      if (!main || !rail) return;
      const st = this.el("hemStatus");
      if (st) st.innerHTML = R.renderStatusRow(S.dailies[0] || null, P.nextRoutineRun(new Date()));

      /* Enkel vy: samma data, klarspråk, ingen högerspalt. Läget ligger som
         data-attribut på <html> (skrivet av VSettings) så CSS kan dölja det
         som bara hör till den detaljerade vyn. */
      if (this.hemMode() === "enkel") {
        main.innerHTML = R.renderSimple(this.simpleModel());
        rail.innerHTML = "";
        return;
      }

      // Vänsterspalten: båda böckernas innehav, beslut och pending-planer.
      const nAcc = S.portfolio && S.portfolio.accum;
      const uAcc = S.portfolioUs && S.portfolioUs.accum;
      const accTag = a => a == null ? "" : `<span class="acc ${a > 0 ? "pos" : a < 0 ? "neg" : ""}" style="color:${a > 0 ? "var(--green)" : a < 0 ? "var(--red)" : "var(--muted)"}">${R.signPct(a)}</span>`;
      let html = `<div class="book-block"><div class="book-h"><span class="bk bk--n"></span>Nordisk bok${accTag(nAcc)}</div>`
        + R.renderHoldings(S.dailies[0] || null, S.portfolio || { holdings: [], pending: [] }, this.buildLiveMap(), this.buildDecisionMap(S.dailies[0] || null), P.diffDailies(S.dailies[0], S.dailies[1]))
        + `</div>`;
      if (S.portfolioUs) {
        html += `<div class="book-block"><div class="book-h"><span class="bk bk--u"></span>US-bok${accTag(uAcc)}</div>`
          + R.renderHoldings(S.usDailies[0] || null, S.portfolioUs, this.liveMapFor(S.portfolioUs, S.usDailies[0]), {}, P.diffDailies(S.usDailies[0], S.usDailies[1]))
          + `</div>`;
      }
      main.innerHTML = html;

      // Högerspalten: bevakning, radar, senaste nytt, lärdomar.
      const esc = R.esc;
      const card = (title, body, count, moreView, moreLabel) =>
        `<div class="rail-card"><div class="rail-t">${esc(title)}${count != null ? `<span class="n">${count}</span>` : ""}</div>${body}`
        + (moreView ? `<button type="button" class="rail-more" data-goto-view="${esc(moreView)}">${esc(moreLabel || "Visa allt")} →</button>` : "") + `</div>`;
      let railHtml = "";

      const watch = [].concat((S.dailies[0] && S.dailies[0].watch) || [], (S.usDailies[0] && S.usDailies[0].watch) || []);
      railHtml += card("Bevakning inför imorgon",
        watch.length ? `<ul class="rail-list">${watch.slice(0, 6).map(w => `<li>${esc(P.stripMd(w))}</li>`).join("")}</ul>`
                     : `<div class="empty">Inget särskilt flaggat.</div>`, watch.length || null);

      const radar = (S.weeklies[0] && S.weeklies[0].radar) || [];
      railHtml += card("Veckans radar",
        radar.length ? `<ul class="rail-list">${radar.slice(0, 5).map(r => `<li><b>${esc(r.day || "•")}</b> ${esc(P.stripMd(r.text).slice(0, 160))}</li>`).join("")}</ul>`
                     : `<div class="empty">Ingen radar i senaste veckorapporten.</div>`, radar.length || null, "nyheter", "Nyheter & radar");

      const news = (S.feed && S.feed.news) || [];
      railHtml += card("Senaste nytt",
        news.length ? `<ul class="rail-list rail-news">${news.slice(0, 4).map(n =>
            `<li><span class="d">${esc(n.date)}</span><span class="s">${esc(n.subject)}</span> — ${esc(n.text.slice(0, 130))}${n.text.length > 130 ? "…" : ""}</li>`).join("")}</ul>`
                    : `<div class="empty">Inga nya bolagsnyheter.</div>`, news.length || null, "nyheter", "Alla nyheter");

      const lessons = (S.lessons && S.lessons.active) || [];
      if (lessons.length) {
        const lcol = (o, re) => { const k = Object.keys(o).find(x => re.test(x)); return k ? P.stripMd(o[k]) : ""; };
        railHtml += card("Aktiva lärdomar",
          `<ul class="rail-list">${lessons.slice(0, 3).map(o => `<li><b>${esc(lcol(o, /^id$/i))}</b> ${esc(lcol(o, /^regel$/i).slice(0, 110))}…</li>`).join("")}</ul>`,
          lessons.length, "retro", "Retro & lärdomar");
      }
      rail.innerHTML = railHtml;
    }

    // ---- Retro & Lärdomar (miss-retron, ny flik) ----
    renderRetro() {
      const lb = this.el("lessonsBody");
      if (lb) lb.innerHTML = this.R.renderLessons(this.state.lessons);
      const sel = this.el("retroSelect"); if (!sel) return;
      const metas = this.state.metas.filter(m => m.type === "retro");
      sel.innerHTML = metas.map((m, i) => `<option value="${this.R.esc(m.name)}"${i === 0 ? " selected" : ""}>${this.R.esc(m.dateISO)} — ${this.R.esc(m.label)}</option>`).join("");
      if (sel.value) this.showRetroReport(sel.value);
      else this.el("retroBody").innerHTML = '<div class="empty">Inga retro-rapporter ännu – skapas när miss-retron kört (fredag kväll/helg).</div>';
    }
    async showRetroReport(name) {
      const meta = this.state.metas.find(m => m.name === name);
      const body = this.el("retroBody"); if (!body) return;
      if (!meta) { body.innerHTML = '<div class="empty">Ingen rapport vald.</div>'; return; }
      const gh = this.el("retroGhLink"); if (gh) gh.href = this.ghBlob(meta.path);
      body.innerHTML = '<div class="empty">Hämtar…</div>';
      try { const md = await this.getMd(meta.path); await this.ensureMarked(); body.innerHTML = this.mdToHtml(md); }
      catch (e) { body.innerHTML = '<div class="empty">Kunde inte hämta rapporten.</div>'; }
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
        await this.ensureMarked();
        this.el("reportBody").innerHTML = this.el("rawToggle").checked ? '<pre class="raw">' + this.R.esc(md) + '</pre>' : this.mdToHtml(md);
        this.buildReportRail(md, meta);
      } catch (e) {
        this.el("reportBody").innerHTML = '<div class="empty">Kunde inte hämta rapporten.</div>';
        this.clearReportRail();
      }
    }

    // ---- högerspalten i Rapporter ----
    clearReportRail() { const r = this.el("reportRail"); if (r) r.innerHTML = ""; }

    buildReportRail(md, meta) {
      const rail = this.el("reportRail"); if (!rail) return;
      // Rådataläget visar ren markdown – då finns inga rubriker att länka till.
      if (this.el("rawToggle") && this.el("rawToggle").checked) { rail.innerHTML = ""; return; }

      const outline = this.P.reportOutline(md);
      // Ge rubrikerna i den renderade texten samma id som innehållsförteckningen
      // pekar på. Ordningen är densamma eftersom båda kommer ur samma markdown.
      const heads = [...this.el("reportBody").querySelectorAll("h2, h3")];
      outline.forEach((h, i) => { if (heads[i]) heads[i].id = "rep-" + h.id; });

      // grannar av samma rapporttyp (listan är sorterad nyast först)
      const same = this.state.metas.filter(m => m.type === meta.type);
      const i = same.findIndex(m => m.name === meta.name);
      const nb = m => m ? { name: m.name, label: m.label || m.dateISO || m.name } : null;

      rail.innerHTML = this.R.renderReportRail({
        outline,
        digest: this.P.reportDigest(md, meta),
        tickers: this.P.tickersInText(md),
        prev: nb(i > 0 ? same[i - 1] : null),          // nyare
        next: nb(i >= 0 ? same[i + 1] : null)          // äldre
      });
      this.refreshClamps();
      this.wireReportToc();
    }

    // Klick i innehållsförteckningen rullar till avsnittet, och avsnittet
    // markeras medan man rullar. Rapporten har en EGEN rullningsbox (74 vh)
    // utom i "full höjd"-läget – då rullar sidan i stället, så båda måste
    // hanteras.
    wireReportToc() {
      const rail = this.el("reportRail"), body = this.el("reportBody");
      if (!rail || !body) return;
      const links = [...rail.querySelectorAll("[data-toc]")];
      if (!links.length) return;
      const scroller = body.scrollHeight > body.clientHeight + 4 ? body : null;

      rail.querySelectorAll("[data-toc]").forEach(a => a.addEventListener("click", () => {
        const t = document.getElementById("rep-" + a.dataset.toc);
        if (!t) return;
        if (scroller) scroller.scrollTo({ top: t.offsetTop - body.offsetTop - 8, behavior: "smooth" });
        else t.scrollIntoView({ behavior: "smooth", block: "start" });
      }));

      const mark = () => {
        const top = scroller ? scroller.getBoundingClientRect().top + 12 : 90;
        let cur = links[0];
        for (const a of links) {
          const t = document.getElementById("rep-" + a.dataset.toc);
          if (t && t.getBoundingClientRect().top <= top) cur = a; else break;
        }
        links.forEach(a => a.classList.toggle("on", a === cur));
      };
      if (this._tocOff) this._tocOff();
      const target = scroller || root;
      target.addEventListener("scroll", mark, { passive: true });
      this._tocOff = () => target.removeEventListener("scroll", mark);
      mark();
    }
    /* Väntar in marked innan markdown renderas. Anropas före varje mdToHtml
       som gäller ett helt dokument – den synkrona mdToHtml behålls oförändrad
       så alla befintliga anrop fortsätter fungera (då utan formatering, precis
       som när CDN:et var nere tidigare). */
    ensureMarked() { return this.lib("marked"); }
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
        await this.ensureMarked();
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
    async drawChart() {
      const canvas = this.el("returnChart");
      if (canvas) await this.lib("Chart");   // hämtas först när Avkastning öppnas
      if (!canvas || !root.Chart) { if (this.el("chartWrap")) this.el("chartWrap").style.display = "none"; this.el("chartNote").textContent = root.Chart ? "" : "Diagram kunde inte laddas (offline?)."; return; }
      const strat = this.P.buildReturnSeries(this.state.weeklies, this.state.portfolio);
      const trades = this.P.buildTradeSeries(this.state.portfolio.history, this.P.costFor("nordic", this.state.costs));
      const benches = [];
      const omx = this.P.buildBenchmarkSeries(this.state.priceHistory, "^OMX");
      const spx = this.P.buildBenchmarkSeries(this.state.priceHistory, "^GSPC");
      if (omx) benches.push({ label: "OMXS30", color: "#3B82F6", pts: omx });
      if (spx) benches.push({ label: "S&P 500", color: "#8B5CF6", pts: spx });

      // gemensam datumaxel (union), carry-forward-mappning per serie
      const labelSet = new Set(strat.map(p => p.date));
      trades.forEach(p => labelSet.add(p.date));
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
      if (trades.length >= 2){
        // per-affär-kurva: en punkt per stängd position (kedjad, viktad)
        const tradeByDate = new Map(trades.map(p => [p.date, p]));
        datasets.push({
          label: "Per affär (kedjad)", data: this.P.seriesOnLabels(labels, trades),
          borderColor: "#F59E0B", borderWidth: 1.5, borderDash: [3, 3],
          fill: false, tension: 0, spanGaps: true,
          pointRadius: labels.map(d => tradeByDate.has(d) ? 4 : 0),
          pointBackgroundColor: "#F59E0B",
          _tradeByDate: tradeByDate
        });
      }
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
            tooltip: { callbacks: { label: c => {
              const t = c.dataset._tradeByDate && c.dataset._tradeByDate.get(c.label);
              const extra = t ? " (" + t.name + " " + (t.pct > 0 ? "+" : "") + t.pct + " %)" : "";
              return " " + c.dataset.label + ": " + c.parsed.y + " %" + extra;
            } } }
          },
          scales: {
            x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#94A3B8" } },
            y: { grid: { color: "rgba(255,255,255,0.06)" }, ticks: { color: "#94A3B8", callback: v => v + " %" }, suggestedMin: allZero && !benches.length ? -1 : undefined, suggestedMax: allZero && !benches.length ? 1 : undefined }
          }
        }
      });
    }

    // ---- status / ui ----
    // Laddningsskelett i tomma vyer under första hämtningen (i stället för tomrum).
    showSkeletons() {
      const sk = n => `<div class="skel-grid">${Array.from({ length: n }, () => '<div class="skel"></div>').join("")}</div>`;
      [["hemMain", 4], ["hemRail", 2], ["kpis", 4], ["totalBody", 4], ["holdings", 2], ["feed", 2], ["scoutBody", 2], ["usBody", 4]].forEach(([id, n]) => {
        const el = this.el(id); if (el && !el.childElementCount) el.innerHTML = sk(n);
      });
    }
    setStatus(kind, err) {
      const dot = this.el("liveDot"), txt = this.el("statusTxt");
      if (kind === "loading") { dot.className = "dot dot--load"; txt.textContent = "Hämtar…"; this.showSkeletons(); }
      else if (kind === "ok") {
        dot.className = "dot dot--live"; txt.textContent = "Live";
        // "Uppdaterad" är hämtningstiden. På den förbyggda vägen är det INTE
        // samma sak som datans ålder: mellan att en routine pushat och att
        // dashboard-actionen kört visar filen gårdagens läge. Är bygget mer än
        // 6 h gammalt sägs det rakt ut, annars blir inaktuell data osynlig.
        let s = "Uppdaterad " + this.nowStr();
        if (this._prebuiltAt) {
          const ageH = (Date.now() - Date.parse(this._prebuiltAt)) / 3600000;
          if (ageH > 6) s += " · data byggd för " + Math.round(ageH) + " h sedan";
        }
        this.el("updated").textContent = s;
      }
      else if (kind === "error") {
        dot.className = "dot dot--err"; txt.textContent = "Fel";
        this.el("banner").innerHTML = '<div class="banner banner--err"><span class="banner-ico">⚠</span><span class="banner-text">Kunde inte hämta data från GitHub (' + this.R.esc(String(err && err.message || err)) + '). Kontrollera att repot är publikt och prova Uppdatera.</span></div>';
      }
    }
    nowStr() { try { return new Date().toLocaleString("sv-SE", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" }); } catch (e) { return new Date().toISOString().slice(0, 16).replace("T", " "); } }

    // ---- wiring ----
    showView(view) {
      // View Transitions API (inbyggt i webbläsaren, inget bibliotek): mjuk
      // övergång mellan vyer. Saknas stödet – eller vill användaren ha mindre
      // rörelse – byts vyn direkt som förut.
      /* VIEW TRANSITIONS API ÄR BORTTAGET (2026-08-03) – ÅTERINFÖR DET INTE.
         Det lades till i `e6bd08e` (2026-08-02 15:49) och orsakade exakt det
         Dren rapporterade: flikbyten kändes tröga och "hela sidan laddades om,
         även menyn". Bisect av dagens 28 commits pekade ut just den commiten:
         `d291eef` dessförinnan var felfri.

         Orsaken var att TRE animationer staplades på varje flikbyte:
           1. `::view-transition-old/new(page)` på .wrap (160 + 200 ms)
           2. webbläsarens STANDARD-crossfade av `root`-lagret – den täcker allt
              som inte har ett eget view-transition-name, alltså ramen runt om,
              och den var aldrig avstängd. Det var den som fick hela sidan att
              se ut att laddas om.
           3. den befintliga `.view{animation:fade .18s}` ovanpå.
         Dessutom tar startViewTransition en ögonblicksbild av HELA vyporten vid
         varje klick, vilket är det som kostade tid.

         Kvar är `.view{animation:fade .18s}` i base.css – samma diskreta toning
         som fanns före e6bd08e och som fungerade felfritt. `data-motion="off"`
         stänger av även den. */
      try { root.scrollTo(0, 0); } catch (e) {}
      this.swapView(view);
      this.refreshClamps();
      if (view === "avkastning") requestAnimationFrame(() => this.drawChart());
    }
    swapView(view) {
      const views = [...document.querySelectorAll(".view")];
      if (!views.some(v => v.dataset.view === view)) view = views.some(v => v.dataset.view === "hem") ? "hem" : "oversikt";
      views.forEach(v => v.classList.toggle("active", v.dataset.view === view));
      let activeLink = null;
      document.querySelectorAll(".subnav a").forEach(l => {
        const on = l.dataset.view === view;
        l.classList.toggle("active", on);
        if (on) activeLink = l;
      });
      // Mobilens botten-bar rymmer inte elva flikar – rulla in den aktiva, annars
      // kan man byta vy med tangentbord/hash och inte se var man hamnade.
      const nav = document.querySelector(".subnav");
      if (activeLink && nav && nav.scrollWidth > nav.clientWidth + 4) {
        const a = activeLink.getBoundingClientRect(), n = nav.getBoundingClientRect();
        if (a.left < n.left + 8 || a.right > n.right - 8)
          nav.scrollTo({ left: nav.scrollLeft + (a.left - n.left) - (n.width - a.width) / 2, behavior: "smooth" });
      }
      try { history.replaceState(null, "", "#" + view); } catch (e) {}
    }
    initNav() {
      document.querySelectorAll(".subnav a").forEach(a =>
        a.addEventListener("click", e => { e.preventDefault(); this.showView(a.dataset.view); }));
      const h = (location.hash || "").slice(1);
      if (h && document.querySelector('.view[data-view="' + h + '"]')) { this.showView(h); return; }
      // Ingen hash: öppna den vy användaren valt i Inställningar (standard "hem").
      const start = root.VSettings && root.VSettings.get("startview");
      if (start && start !== "hem" && document.querySelector('.view[data-view="' + start + '"]')) this.showView(start);
    }
    initEvents() {
      this.el("refreshBtn").addEventListener("click", () => { this.state.md.clear(); this.load(true); });

      /* Bokväljaren i Avkastning-vyn. Båda böckerna renderas alltid – knappen
         byter bara vilken som visas, så inget behöver räknas om. Valet är
         medvetet INTE sparat: det är en jämförelseväxel man klickar fram och
         tillbaka på, inte en inställning. */
      const setBook = b => {
        const v = this.el("view-avkastning"); if (!v) return;
        v.setAttribute("data-book", b);
        document.querySelectorAll("[data-book-set]").forEach(x =>
          x.setAttribute("aria-pressed", String(x.dataset.bookSet === b)));
      };
      document.querySelectorAll("[data-book-set]").forEach(b =>
        b.addEventListener("click", () => setBook(b.dataset.bookSet)));
      setBook("nordic");

      /* Växeln i Hem-vyn. Den skriver via VSettings så valet hamnar på samma
         ställe som allt annat användaren ställt in – ingen egen lagring. */
      document.querySelectorAll("[data-hemmode-set]").forEach(b =>
        b.addEventListener("click", () => {
          const v = b.dataset.hemmodeSet;
          if (root.VSettings) root.VSettings.set("hemmode", v);
          else document.documentElement.setAttribute("data-hemmode", v);
        }));
      /* Läget kan också ändras inne i Inställningar. Observera attributet i
         stället för att koppla ihop modulerna – app.js behöver aldrig veta HUR
         det ändrades, bara ATT det gjorde det. */
      if (root.MutationObserver) {
        let last = this.hemMode();
        new MutationObserver(() => {
          const now = this.hemMode();
          if (now === last) return;
          last = now;
          this.syncHemToggle();
          this.renderHem();
        }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-hemmode"] });
      }
      this.syncHemToggle();
      const ab = this.el("analysBtn"), ai = this.el("analysInput");
      if (ab) ab.addEventListener("click", () => this.analyse(ai ? ai.value : ""));
      if (ai) ai.addEventListener("keydown", e => { if (e.key === "Enter") this.analyse(ai.value); });
      this.el("reportSelect").addEventListener("change", e => this.showReport(e.target.value));
      const usSel = this.el("usReportSelect");
      if (usSel) usSel.addEventListener("change", e => this.showUsReport(e.target.value));
      const reSel = this.el("retroSelect");
      if (reSel) reSel.addEventListener("change", e => this.showRetroReport(e.target.value));
      this.el("rawToggle").addEventListener("change", () => {
        const b = this.el("reportBody"); const md = b.dataset.raw || ""; if (!md) return;
        const raw = this.el("rawToggle").checked;
        b.innerHTML = raw ? '<pre class="raw">' + this.R.esc(md) + '</pre>' : this.mdToHtml(md);
        // Rådataläget har inga rubriker att länka till – bygg om spalten.
        const meta = this.state.metas.find(m => m.name === (this.el("reportSelect") || {}).value);
        if (raw || !meta) this.clearReportRail(); else this.buildReportRail(md, meta);
      });
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
        // Samma val finns i Inställningar – håll dem i synk, annars visar
        // inställningsvyn ett annat läge än knappen precis satte.
        if (root.VSettings) root.VSettings.set("reportfull", full ? "on" : "off");
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
        const gv = e.target.closest("[data-goto-view]");
        if (gv) { this.showView(gv.dataset.gotoView); return; }
        const th = e.target.closest(".tbl--sort th");
        if (th) { this.sortTable(th); return; }
        const sr = e.target.closest("[data-open-report]");
        if (sr) { this.openReportByName(sr.dataset.openReport, sr.dataset.rtype); return; }
        // föregående/nästa rapport ur högerspalten
        const rn = e.target.closest("[data-report]");
        if (rn) {
          const sel = this.el("reportSelect");
          if (sel) { sel.value = rn.dataset.report; }
          this.showReport(rn.dataset.report);
          const rb = this.el("reportBody"); if (rb) rb.scrollTop = 0;
          return;
        }
        const chip = e.target.closest(".px-chip");
        if (chip) { this.setPriceRole(chip.dataset.role || "alla"); return; }
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
    // Service worker: gör appen användbar offline. Nät-först, cache som reserv –
    // se sw.js för varför det INTE är tvärtom. Registreras bara över https
    // (GitHub Pages) eller localhost; file:// stöder inte service workers.
    registerSW() {
      if (!("serviceWorker" in navigator)) return;
      if (location.protocol !== "https:" && location.hostname !== "localhost") return;
      navigator.serviceWorker.register("sw.js").catch(e =>
        console.warn("[dashboard] service worker kunde inte registreras:", e && e.message));
    }
    boot() {
      this.initNav(); this.initEvents(); this.registerSW(); this.load(false);
      // Tickande nedräkning till nästa körning (statusraden på Översikt).
      setInterval(() => {
        if (!this.state.dailies.length) return;
        const row = this.R.renderStatusRow(this.state.dailies[0] || null, this.P.nextRoutineRun(new Date()));
        const el = this.el("statusRow"); if (el) el.innerHTML = row;
        const hs = this.el("hemStatus"); if (hs) hs.innerHTML = row;
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
