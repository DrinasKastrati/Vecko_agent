/* ============================================================
   Vecko Rotation – pure render helpers (return HTML strings).
   No DOM access, no network. Shared with index.html + Node tests.
   ============================================================ */
(function (root) {
  "use strict";
  const strip = (root.VParse && root.VParse.stripMd) ||
                (typeof require !== "undefined" && require("./vparse.js").stripMd);

  function esc(s){
    return String(s == null ? "" : s).replace(/[&<>"']/g, c =>
      ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  }
  function signPct(n){
    if (n == null || isNaN(n)) return "–";
    return (n > 0 ? "+" : "") + Number(n).toFixed(2) + " %";
  }
  function trendClass(n){
    if (n == null || isNaN(n) || n === 0) return "flat";
    return n > 0 ? "pos" : "neg";
  }
  function decClass(d){
    return ({ "KÖP":"kop","SÄLJ":"salj","BEHÅLL":"behall","AVVAKTA":"avvakta" })[d] || "none";
  }
  function pill(text){ return `<span class="pill">${esc(text)}</span>`; }
  function truncate(s, n){ s = strip(s||""); return s.length > n ? s.slice(0, n-1) + "…" : s; }

  // ---- KPI cards --------------------------------------------------------
  function renderKPIs(portfolio, latestDaily){
    const accum = portfolio.accum;
    const cashPct = (portfolio.cash.match(/(-?\d+(?:[.,]\d+)?)\s*%/) || [])[1];
    const cash = cashPct ? cashPct.replace(",", ".") + " %" : truncate(portfolio.cash, 18) || "–";
    const open = portfolio.holdings.length;
    const pend = portfolio.pending.filter(p => !p._struck).length;
    const upd = (portfolio.updated || "").replace(/\s*\(.*$/, "") ||
                (latestDaily ? latestDaily.dateISO : "");
    const card = (label, value, cls, sub) =>
      `<div class="kpi">
         <div class="kpi-label">${esc(label)}</div>
         <div class="kpi-value ${cls||""}">${value}</div>
         ${sub ? `<div class="kpi-sub">${esc(sub)}</div>` : ""}
       </div>`;
    return `<div class="kpi-grid">
      ${card("Ackumulerad avkastning", esc(signPct(accum)), "num "+trendClass(accum), "sedan strategistart")}
      ${card("Kassa", esc(cash), "num", open ? `${open} position(er) öppna` : "inga öppna positioner")}
      ${card("Aktiva planer", String(pend), "num", pend ? "pending rotation" : "avvaktar")}
      ${card("Senast uppdaterad", `<span class="upd">${esc(upd)}</span>`, "", latestDaily ? esc(truncate(latestDaily.mode, 34)) : "")}
    </div>`;
  }

  // ---- market strip -----------------------------------------------------
  function renderMarket(latestDaily){
    if (!latestDaily) return "";
    return `<div class="market">
      <span class="market-tag">Marknadsläget</span>
      <span class="market-text">${esc(strip(latestDaily.market)) || "—"}</span>
    </div>`;
  }

  // ---- holding / decision cards ----------------------------------------
  // ---- statusrad (Översikt) ---------------------------------------------
  function renderStatusRow(latestDaily, next){
    if (!latestDaily && !next) return "";
    let left = "";
    if (latestDaily){
      const counts = {};
      (latestDaily.holdings || []).forEach(h => { counts[h.decision] = (counts[h.decision] || 0) + 1; });
      const chips = Object.keys(counts).map(k =>
        `<span class="st-chip st-chip--${decClass(k)}">${counts[k]}× ${esc(k)}</span>`).join("");
      left = `<span class="st-date">${esc(latestDaily.dateISO)}</span>`
           + (latestDaily.mode ? `<span class="st-mode">${esc(truncate(latestDaily.mode, 30))}</span>` : "")
           + chips;
    } else {
      left = `<span class="st-mode">Ingen daglig rapport ännu.</span>`;
    }
    const right = next
      ? `<span class="st-next" title="Schemalagd Cowork-körning – kräver att Claude-appen är igång">nästa: ${esc(next.label)} ${esc(next.when)} · ${esc(next.rel)}</span>`
      : "";
    return `<div class="status-row">${left}${right}</div>`;
  }

  // Positionsmätare: stopp → entry → nu → mål (procentlägen ur VParse.computeGauge).
  function gaugeStrip(lv){
    if (!lv || !lv.gauge) return "";
    const g = lv.gauge;
    const fillCls = lv.pnlPct != null && lv.pnlPct < 0 ? " neg" : "";
    return `<div class="gauge"><div class="gauge-track">
      <div class="gauge-fill${fillCls}" style="width:${g.nowPct}%"></div>
      <span class="gauge-tick tick-stop"></span>
      <span class="gauge-tick tick-entry" style="left:${g.entryPct}%"></span>
      <span class="gauge-tick tick-now" style="left:${g.nowPct}%"></span>
      <span class="gauge-tick tick-target"></span>
    </div>
    <div class="gauge-lbls"><span class="neg">stopp ${esc(String(lv.stopNum))}</span><span>entry ${esc(String(lv.entryNum))}</span><span class="pos">mål ${esc(String(lv.targetNum))}</span></div></div>`;
  }

  // Besluts-historik: en punkt per handelsdag (äldst → nyast).
  function decisionDots(decisions){
    if (!decisions || decisions.length < 2) return "";
    const dots = decisions.map(d =>
      `<span class="ddot ddot--${decClass(d.decision)}" title="${esc(d.date)}: ${esc(d.decision)}"></span>`).join("");
    return `<div class="dhist"><span class="dhist-l">${decisions.length} dgr</span>${dots}</div>`;
  }

  // Live-remsa: verifierad kurs ur prices.json + P/L mot entry och avstånd
  // till stopp/mål (beräknas i VParse.computeHoldingLive).
  function liveStrip(lv){
    if (!lv || lv.price == null) return "";
    const px = String(lv.price) + (lv.currency ? " " + lv.currency : "");
    const bits = [`<span class="lv-px">${esc(px)}</span>`];
    if (lv.pnlPct != null)      bits.push(`<span class="lv ${lv.pnlPct >= 0 ? "pos" : "neg"}">${esc(signPct(lv.pnlPct))} sedan entry</span>`);
    if (lv.toTargetPct != null) bits.push(`<span class="lv">${esc(signPct(lv.toTargetPct))} till mål</span>`);
    if (lv.toStopPct != null)   bits.push(`<span class="lv">${esc(signPct(lv.toStopPct))} till stopp</span>`);
    const tm = lv.marketTime ? String(lv.marketTime).slice(0, 16).replace("T", " ") : "";
    return `<div class="hold-live"><span class="k">Live</span>${bits.join("")}${tm ? `<span class="lv-tm">${esc(tm)}</span>` : ""}</div>`;
  }
  function holdingCard(h, live, decisions){
    return `<div class="hold">
      <div class="hold-top">
        <div class="hold-name">${esc(h.name)}</div>
        <span class="badge badge--${decClass(h.decision)}">${esc(h.decision)}</span>
      </div>
      <div class="hold-tickers">${pill(h.ticker)}${pill(h.exchange)}</div>
      <div class="hold-grid">
        <div><span class="k">Kurs</span><span class="v">${esc(truncate(h.price, 30) || "–")}</span></div>
        <div><span class="k">Sedan entry</span><span class="v">${esc(h.since || "–")}</span></div>
        <div><span class="k">Stop-loss</span><span class="v">${esc(h.stop || "–")}</span></div>
        <div><span class="k">Målkurs</span><span class="v">${esc(h.target || "–")}</span></div>
      </div>
      ${gaugeStrip(live)}
      ${liveStrip(live)}
      ${decisionDots(decisions)}
      ${h.motivation ? `<div class="hold-note">${esc(truncate(h.motivation, 180))}</div>` : ""}
    </div>`;
  }
  function pendingCard(p){
    const name = strip(p["Aktie"] || "");
    const ticker = strip(p["Yahoo-ticker"] || "");
    const entry = strip(p["Planerad entry (villkor)"] || p["Planerad entry"] || "");
    const stop = strip(p["Planerad stop-loss"] || "");
    const target = strip(p["Planerad målkurs"] || "");
    const rr = strip(p["R/R"] || "");
    const status = strip(p["Status"] || "");
    return `<div class="hold ${p._struck ? "hold--struck" : ""}">
      <div class="hold-top">
        <div class="hold-name">${esc(name)}</div>
        <span class="badge badge--${p._struck ? "none" : "plan"}">${p._struck ? "AVFÖRD" : "PENDING"}</span>
      </div>
      <div class="hold-tickers">${ticker ? pill(ticker) : ""}</div>
      <div class="hold-grid">
        <div><span class="k">Planerad entry</span><span class="v">${esc(truncate(entry, 34) || "–")}</span></div>
        <div><span class="k">Stop-loss</span><span class="v">${esc(stop || "–")}</span></div>
        <div><span class="k">Målkurs</span><span class="v">${esc(target || "–")}</span></div>
        <div><span class="k">R/R</span><span class="v">${esc(rr || "–")}</span></div>
      </div>
      ${status ? `<div class="hold-note">${esc(truncate(status, 160))}</div>` : ""}
    </div>`;
  }

  // Kort för en FAKTISK öppen position ur portfolj.md:s "Aktuellt innehav".
  function heldCard(o, live){
    const name = strip(o["Aktie"] || "");
    const ticker = strip(o["Yahoo-ticker"] || "");
    const exchange = strip(o["Börs"] || "");
    const entry = strip(o["Entry"] || "");
    const stop = strip(o["Stop-loss"] || "");
    const target = strip(o["Målkurs"] || "");
    const edate = strip(o["Entry-datum"] || "");
    const note = strip(o["Anteckning"] || "");
    return `<div class="hold">
      <div class="hold-top">
        <div class="hold-name">${esc(name)}</div>
        <span class="badge badge--behall">INNEHAV</span>
      </div>
      <div class="hold-tickers">${ticker ? pill(ticker) : ""}${exchange ? pill(exchange) : ""}</div>
      <div class="hold-grid">
        <div><span class="k">Entry</span><span class="v">${esc(truncate(entry, 22) || "–")}</span></div>
        <div><span class="k">Entry-datum</span><span class="v">${esc(edate || "–")}</span></div>
        <div><span class="k">Stop-loss</span><span class="v">${esc(stop || "–")}</span></div>
        <div><span class="k">Målkurs</span><span class="v">${esc(target || "–")}</span></div>
      </div>
      ${gaugeStrip(live)}
      ${liveStrip(live)}
      ${note ? `<div class="hold-note">${esc(truncate(note, 180))}</div>` : ""}
    </div>`;
  }

  function renderHoldings(latestDaily, portfolio, liveByTicker, decisionsByTicker){
    let html = "";
    const lv = liveByTicker || {}, dh = decisionsByTicker || {};
    const held = (portfolio.holdings || []).filter(o => o && o["Aktie"] && !/^[–\-]$/.test(String(o["Aktie"]).trim()));
    if (held.length){
      const upd = (portfolio.updated || "").replace(/\s*\(.*$/, "").slice(0, 16);
      html += `<h3 class="sub">Aktuellt innehav${upd ? ` <span class="sub-date">${esc(upd)}</span>` : ""}</h3>
        <div class="hold-grid-wrap">${held.map(o => { const t = (o["Yahoo-ticker"] || "").trim().toUpperCase(); return heldCard(o, lv[t]); }).join("")}</div>`;
    }
    const monitored = latestDaily ? latestDaily.holdings : [];
    if (monitored.length){
      html += `<h3 class="sub">Dagens beslut <span class="sub-date">${esc(latestDaily.dateISO)}</span></h3>
        <div class="hold-grid-wrap">${monitored.map(h => { const t = (h.ticker || "").trim().toUpperCase(); return holdingCard(h, lv[t], dh[t]); }).join("")}</div>`;
    }
    const pend = portfolio.pending || [];
    if (pend.length){
      html += `<h3 class="sub">Portföljplan (rotation)</h3>
        <div class="hold-grid-wrap">${pend.map(pendingCard).join("")}</div>`;
    }
    if (!held.length && !monitored.length && !pend.length)
      html += `<div class="empty">Inga innehav eller planerade rotationer just nu.</div>`;
    return html;
  }

  // ---- news + radar feed ------------------------------------------------
  function renderFeed(feed){
    const news = feed.news.length
      ? feed.news.map(n => `<li class="feed-item">
          <span class="chip chip--date">${esc(n.date)}</span>
          <div class="feed-body"><span class="feed-subj">${esc(n.subject)}</span>${esc(truncate(n.text, 320))}</div>
        </li>`).join("")
      : `<li class="empty">Inga nya bolagsspecifika nyheter i de senaste rapporterna.</li>`;

    const radar = feed.radar.length
      ? feed.radar.map(r => `<li class="feed-item">
          <span class="chip chip--day">${esc(r.day || "•")}</span>
          <div class="feed-body">${esc(truncate(r.text, 300))}</div>
        </li>`).join("")
      : `<li class="empty">Ingen radar i senaste veckorapporten.</li>`;

    const cats = feed.catalysts.length
      ? feed.catalysts.map(c => `<div class="cat">
          <div class="cat-top">${esc(c.name)} ${pill(c.ticker)} ${c.rumor ? `<span class="badge badge--rumor">⚠️ RYKTE</span>` : ""}</div>
          <div class="cat-text">${esc(truncate(c.text, 260))}</div>
        </div>`).join("")
      : `<div class="empty">Inga aktiva case.</div>`;

    return `
      <div class="feed-cols">
        <div class="feed-col">
          <h3 class="sub">Senaste nyheterna</h3>
          <ul class="feed">${news}</ul>
        </div>
        <div class="feed-col">
          <h3 class="sub">Veckans radar</h3>
          <ul class="feed">${radar}</ul>
        </div>
      </div>
      <h3 class="sub">Aktiva katalysatorer</h3>
      <div class="cat-wrap">${cats}</div>`;
  }

  // ---- history + bubblare ----------------------------------------------
  function renderHistory(portfolio){
    if (!portfolio.history.length)
      return `<div class="empty">Inga stängda positioner ännu – strategin är i baslinjeläge (0 %).</div>`;
    const cols = Object.keys(portfolio.history[0]);
    const head = cols.map(c => `<th>${esc(c)}</th>`).join("");
    const rows = portfolio.history.map(r =>
      `<tr>${cols.map(c => `<td>${esc(strip(r[c]))}</td>`).join("")}</tr>`).join("");
    return `<table class="tbl"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>`;
  }
  function renderBubblare(weekly){
    if (!weekly || !weekly.bubblare.length) return "";
    return `<h3 class="sub">Bubblare (watchlist)</h3>
      <ul class="bubbl">${weekly.bubblare.map(b =>
        `<li>${esc(truncate(b, 180))}</li>`).join("")}</ul>`;
  }

  // ---- report picker options -------------------------------------------
  function renderOptions(metas, type){
    return metas.filter(m => m.type === type)
      .map((m, i) => `<option value="${esc(m.name)}"${i===0?" selected":""}>${esc(m.dateISO)} — ${esc(m.label)}</option>`)
      .join("");
  }

  // ---- status banner ----------------------------------------------------
  function renderBanner(note){
    if (!note) return "";
    return `<div class="banner ${note.blocked ? "banner--warn" : ""}">
      <span class="banner-ico">${note.blocked ? "⚠" : "ℹ"}</span>
      <span class="banner-text">${esc(truncate(note.text, 400))}</span>
    </div>`;
  }

  // ---- prices freshness (state/prices.json) -----------------------------
  function pxAge(iso){
    const t = iso ? Date.parse(iso) : NaN;
    if (isNaN(t)) return { txt: "okänd tid", cls: "px-stale" };
    const mins = Math.round((Date.now() - t) / 60000);
    const txt = mins < 60 ? mins + " min sedan"
              : mins < 1440 ? Math.round(mins / 60) + " tim sedan"
              : Math.round(mins / 1440) + " dygn sedan";
    return { txt, cls: mins > 3 * 1440 ? "px-stale" : "px-fresh" };
  }
  function renderPrices(prices, history){
    if (!prices || !prices.quotes)
      return `<div class="px-card"><div class="px-head"><span class="t">Kurser (prices.json)</span></div>`
           + `<div class="empty">Inga kurser hämtade ännu – kör pris-actionen (Actions → “Hämta kurser”).</div></div>`;
    const gen = pxAge(prices.generatedAt);
    const syms = Object.keys(prices.quotes);
    const ok = prices.okCount != null ? prices.okCount
             : syms.filter(s => prices.quotes[s] && !prices.quotes[s].error).length;
    const items = syms.map(s => {
      const q = prices.quotes[s] || {};
      if (q.error || q.price == null)
        return `<div class="px-item"><div class="px-tk"><span>${esc(s)}</span><span class="px-err">⚠</span></div>`
             + `<div class="px-pr px-err">–</div><div class="px-tm">${esc(truncate(q.error || "ingen kurs", 22))}</div></div>`;
      const mt = pxAge(q.marketTime);
      const price = String(q.price) + (q.currency ? " " + q.currency : "");
      const tm = q.marketTime ? q.marketTime.slice(0, 16).replace("T", " ") : "okänd tid";
      const ser = history && history.series && history.series[q.symbol || s];
      return `<div class="px-item"><div class="px-tk"><span>${esc(q.symbol || s)}</span>`
           + `<span class="${mt.cls}">${mt.cls === "px-fresh" ? "✓" : "⚠"}</span></div>`
           + `<div class="px-pr">${esc(price)}</div><div class="px-tm">${esc(tm)}</div>${sparkline(ser)}</div>`;
    }).join("");
    return `<div class="px-card">
      <div class="px-head">
        <span class="t">Kurser (prices.json)</span>
        <span class="px-age ${gen.cls}">hämtad ${esc(gen.txt)}</span>
        <span class="px-sum">${ok}/${syms.length} med verifierad kurs</span>
      </div>
      ${syms.length ? `<div class="px-grid">${items}</div>`
                    : `<div class="empty">Inga tickers i prices.json ännu – fyll <code>config/watchlist.txt</code>.</div>`}
    </div>`;
  }

  // ---- scout (USA & krypto) --------------------------------------------
  function textToHtml(t){
    const lines = String(t || "").split("\n").map(l => l.trim()).filter(Boolean);
    if (!lines.length) return "";
    const bullets = lines.filter(l => /^[-*•]/.test(l)).length;
    if (bullets >= Math.max(2, lines.length - 1))
      return `<ul class="slist">${lines.map(l => `<li>${esc(strip(l.replace(/^[-*•]\s?/, "")))}</li>`).join("")}</ul>`;
    return lines.map(l => `<p>${esc(strip(l))}</p>`).join("");
  }
  function scoutBlock(title, text){
    if (!text) return "";
    return `<div class="sblock"><h3 class="sub">${esc(title)}</h3><div class="sblock-body">${textToHtml(text)}</div></div>`;
  }
  function scoutCaseCard(c){
    return `<div class="scase">
      <div class="scase-top">
        <div class="scase-name">${esc(c.name)}</div>
        <div class="hold-tickers">${c.ticker ? pill(c.ticker) : ""}${c.exchange ? pill(c.exchange) : ""}</div>
      </div>
      ${c.catalyst ? `<div class="scase-cat"><span class="k">Katalysator</span> ${esc(truncate(c.catalyst, 300))}</div>` : ""}
      <div class="scase-bb">
        <div class="bb bb--bull"><span class="k">Bull</span>${esc(truncate(c.bull, 240)) || "–"}</div>
        <div class="bb bb--bear"><span class="k">Bear</span>${esc(truncate(c.bear, 240)) || "–"}</div>
      </div>
      ${c.setup ? `<div class="scase-setup"><span class="k">Setup</span> ${esc(truncate(c.setup, 240))}</div>` : ""}
    </div>`;
  }
  function renderScout(scout){
    if (!scout)
      return `<div class="empty">Ingen scout-rapport ännu – kör scout-routinen (skapar <code>reports/scout/rapport-yymmdd.md</code>).</div>`;
    const climate = scout.climate
      ? `<div class="market"><span class="market-tag">Marknadsklimat</span><span class="market-text">${esc(strip(scout.climate))}</span></div>` : "";
    const cases = scout.cases && scout.cases.length
      ? `<h3 class="sub">Dagens case <span class="sub-date">${esc(scout.dateISO || "")}</span></h3>`
        + `<div class="scase-wrap">${scout.cases.map(scoutCaseCard).join("")}</div>`
      : `<div class="empty">Inga case i senaste rapporten – marknaden avvaktande.</div>`;
    return climate
      + scoutBlock("Marknadsöversikt", scout.recap)
      + scoutBlock("Ekonomiska siffror & kalender", scout.econ)
      + scoutBlock("Aktuella händelser & katalysatorer", scout.events)
      + cases
      + scoutBlock("Makro- & sektorfaktorer", scout.macro);
  }

  // ---- analys-index (på begäran) ----------------------------------------
  function renderAnalysisIndex(list, pending){
    const daysSince = iso => { const t = Date.parse(iso); return isNaN(t) ? null : Math.floor((Date.now() - t) / 86400000); };
    let html = "";
    if (pending && pending.length)
      html += `<div class="an-queue">I kö: ${pending.map(t => pill(t)).join(" ")} <span style="color:var(--faint)">· väntar på arbetaren</span></div>`;
    if (!list || !list.length)
      html += `<div class="empty">Inga analyser i cachen ännu – skriv en ticker ovan och tryck Analysera.</div>`;
    else
      html += `<div class="an-grid">` + list.map(m => {
        const d = daysSince(m.dateISO);
        const stale = d != null && d > 7;
        const age = d != null ? (d === 0 ? "idag" : d + " dgr") : "";
        return `<button class="an-chip${stale ? " an-stale" : ""}" data-ticker="${esc(m.ticker)}" title="${stale ? "Gammal analys – klicka för att köra om" : "Klicka för att öppna"}">`
          + `<span class="an-chip-tk">${esc(m.ticker)}</span>`
          + `<span class="an-chip-dt">${esc(m.dateISO)}${age ? " · " + age : ""}${stale ? " · gammal" : ""}</span></button>`;
      }).join("") + `</div>`;
    return html;
  }

  // ---- sparkline (SVG) --------------------------------------------------
  function sparkline(points, w, h){
    w = w || 96; h = h || 24;
    if (!points || points.length < 2) return "";
    const vals = points.map(p => p[1]);
    const min = Math.min.apply(null, vals), max = Math.max.apply(null, vals), rng = (max - min) || 1;
    const step = w / (points.length - 1);
    const path = points.map((p, i) => (i * step).toFixed(1) + "," + (h - 2 - ((p[1] - min) / rng) * (h - 4)).toFixed(1)).join(" ");
    const col = vals[vals.length - 1] >= vals[0] ? "var(--green)" : "var(--red)";
    return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><polyline points="${path}" fill="none" stroke="${col}" stroke-width="1.5"/></svg>`;
  }

  // ---- trade-statistik --------------------------------------------------
  function renderTradeStats(s){
    if (!s || !s.trades)
      return `<div class="empty">Inga stängda affärer ännu – statistiken fylls i när positioner stängs.</div>`;
    const pf = s.profitFactor == null ? "–" : (s.profitFactor === Infinity ? "∞" : s.profitFactor.toFixed(2));
    const cell = (label, val, cls, sub) =>
      `<div class="stat"><div class="stat-l">${esc(label)}</div><div class="stat-v ${cls || ""}">${val}</div>${sub ? `<div class="stat-s">${esc(sub)}</div>` : ""}</div>`;
    return `<div class="stat-grid">
      ${cell("Affärer", String(s.trades), "", s.wins + " vinst / " + s.losses + " förlust")}
      ${cell("Träffsäkerhet", s.winRate != null ? Math.round(s.winRate * 100) + " %" : "–", s.winRate >= 0.5 ? "pos" : "")}
      ${cell("Snittvinst", s.avgWin != null ? esc(signPct(s.avgWin)) : "–", "pos")}
      ${cell("Snittförlust", s.avgLoss != null ? esc(signPct(s.avgLoss)) : "–", "neg")}
      ${cell("Profit factor", pf, s.profitFactor >= 1 ? "pos" : "neg")}
      ${cell("Bästa / sämsta", esc((s.best != null ? signPct(s.best) : "–") + " / " + (s.worst != null ? signPct(s.worst) : "–")))}
      ${cell("Snitt hålltid", s.avgHoldDays != null ? Math.round(s.avgHoldDays) + " dgr" : "–")}
      ${cell("Mål / stopp / rot.", s.byReason.target + " / " + s.byReason.stop + " / " + s.byReason.rotation, "", "orsak till stängning")}
    </div>
    <div class="stat-note">Grov kedjad avkastning (50 % vikt/affär): ${esc(signPct(s.chainedPct))} · summa utfall: ${esc(signPct(s.sumPct))} — jämför med routinens angivna ackumulerade siffra.</div>`;
  }

  // ---- intradag-signaler (monitor) -------------------------------------
  function renderAlerts(alerts){
    const active = (alerts && alerts.active) || [];
    if (!active.length) return "";
    const items = active.map(s => {
      const cls = s.type === "KÖP" ? "al-kop" : "al-salj";
      const px = s.price != null ? (s.price + (s.currency ? " " + s.currency : "")) : "";
      const tm = s.marketTime ? String(s.marketTime).slice(0, 16).replace("T", " ") : "";
      return `<div class="al-item ${cls}"><span class="al-tag">${esc(s.type)}</span><b>${esc(s.ticker)}</b> — ${esc(s.reason)}`
        + `${s.level != null ? ` (nivå ${esc(String(s.level))})` : ""}${px ? ` · kurs ${esc(String(px))}` : ""}${tm ? ` · ${esc(tm)}` : ""}</div>`;
    }).join("");
    return `<div class="al-wrap"><div class="al-head">⚠ Aktiva intradag-signaler (${active.length})</div>${items}</div>`;
  }

  const API = { esc, signPct, trendClass, decClass, truncate, sparkline, pxAge,
    renderStatusRow, renderKPIs, renderMarket, renderHoldings, renderFeed,
    renderHistory, renderBubblare, renderOptions, renderBanner, renderPrices, renderScout,
    renderAnalysisIndex, renderTradeStats, renderAlerts };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else root.VRender = API;
})(typeof window!=="undefined"?window:this);
