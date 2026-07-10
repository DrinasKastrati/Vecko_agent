/* ============================================================
   Vecko Rotation – pure render helpers (return HTML strings).
   No DOM access, no network. Shared with index.html + Node tests.
   ============================================================ */
(function (root) {
  "use strict";
  const strip = (root.VParse && root.VParse.stripMd) ||
                (typeof require !== "undefined" && require("/sessions/amazing-wonderful-thompson/mnt/outputs/vparse.js").stripMd);

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
  function holdingCard(h){
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

  function renderHoldings(latestDaily, portfolio){
    let html = "";
    const monitored = latestDaily ? latestDaily.holdings : [];
    if (monitored.length){
      html += `<h3 class="sub">Dagens beslut <span class="sub-date">${esc(latestDaily.dateISO)}</span></h3>
        <div class="hold-grid-wrap">${monitored.map(holdingCard).join("")}</div>`;
    }
    const pend = portfolio.pending || [];
    if (pend.length){
      html += `<h3 class="sub">Portföljplan (rotation)</h3>
        <div class="hold-grid-wrap">${pend.map(pendingCard).join("")}</div>`;
    }
    if (!monitored.length && !pend.length)
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

  const API = { esc, signPct, trendClass, decClass, truncate,
    renderKPIs, renderMarket, renderHoldings, renderFeed,
    renderHistory, renderBubblare, renderOptions, renderBanner };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else root.VRender = API;
})(typeof window!=="undefined"?window:this);
