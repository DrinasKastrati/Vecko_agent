/* ============================================================
   Vecko Rotation – pure render helpers (return HTML strings).
   No DOM access, no network. Shared with index.html + Node tests.
   ============================================================ */
(function (root) {
  "use strict";
  const VPref = root.VParse ||
                (typeof require !== "undefined" && require("./vparse.js"));
  const strip = VPref.stripMd;
  const numPct = VPref.firstNumberPct;

  function esc(s){
    return String(s == null ? "" : s).replace(/[&<>"']/g, c =>
      ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  }
  function signPct(n){
    if (n == null || isNaN(n)) return "–";
    return (n > 0 ? "+" : "") + Number(n).toFixed(2) + " %";
  }
  // Första talet i en sträng som "620,00 kr" -> 620. Svenskt decimalkomma.
  function numOf(s){
    const m = String(s == null ? "" : s).replace(/\s/g, "").replace(",", ".").match(/-?\d+(?:\.\d+)?/);
    return m ? parseFloat(m[0]) : null;
  }
  // Tal -> svensk sträng med komma, max två decimaler och inga onödiga nollor.
  function nf(n){
    if (n == null || isNaN(n)) return "–";
    return String(Math.round(Number(n) * 100) / 100).replace(".", ",");
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

  // Klickbar ticker-pill: hoppar till Analys-fliken (hanteras i app.js).
  function tickerPill(t){
    if (!t) return "";
    return `<button type="button" class="pill pill--lnk" data-goto-ticker="${esc(t)}" title="Öppna ${esc(t)} i Analys">${esc(t)}</button>`;
  }
  // Klampad text: HELA texten renderas, CSS visar N rader + "Visa mer"-knapp.
  // app.js visar knappen bara när texten faktiskt svämmar över (has-more).
  function clamp(text, lines){
    const t = strip(text || "");
    if (!t) return "";
    return `<div class="cw"><div class="clamp" style="--cl:${lines || 3}">${esc(t)}</div>`
         + `<button type="button" class="clamp-more" aria-expanded="false">Visa mer</button></div>`;
  }

  // ---- KPI cards --------------------------------------------------------
  function renderKPIs(portfolio, latestDaily){
    const accum = portfolio.accum;
    const cashPct = (portfolio.cash.match(/(-?\d+(?:[.,]\d+)?)\s*%/) || [])[1];
    const cash = cashPct ? cashPct.replace(",", ".") + " %" : truncate(portfolio.cash, 18) || "–";
    const open = portfolio.holdings.length;
    const pend = portfolio.pending.filter(p => !p._struck).length;
    const upd = (portfolio.updated || "").replace(/\s*\(.*$/, "") ||
                (latestDaily ? latestDaily.dateISO : "");
    const card = (label, value, cls, sub, title) =>
      `<div class="kpi"${title ? ` title="${esc(title)}"` : ""}>
         <div class="kpi-label">${esc(label)}</div>
         <div class="kpi-value ${cls||""}">${value}</div>
         ${sub ? `<div class="kpi-sub">${esc(sub)}</div>` : ""}
       </div>`;
    return `<div class="kpi-grid">
      ${card("Ackumulerad avkastning", esc(signPct(accum)), "num "+trendClass(accum), "sedan strategistart")}
      ${card("Kassa", esc(cash), "num", open ? `${open} position(er) öppna` : "inga öppna positioner", strip(portfolio.cash))}
      ${card("Aktiva planer", String(pend), "num", pend ? "pending rotation" : "avvaktar")}
      ${card("Senast uppdaterad", `<span class="upd">${esc(upd)}</span>`, "", latestDaily ? esc(truncate(latestDaily.mode, 34)) : "", latestDaily ? strip(latestDaily.mode) : "")}
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
           + (latestDaily.mode ? `<span class="st-mode" title="${esc(strip(latestDaily.mode))}">${esc(truncate(latestDaily.mode, 30))}</span>` : "")
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
  // "Ändrat idag"-remsa: skillnader mot gårdagens rapport (VParse.diffDailies).
  function diffStrip(d){
    if (!d) return "";
    if (d.isNew) return `<div class="hold-diff"><span class="chg chg--new">NY IDAG</span></div>`;
    if (!d.changes || !d.changes.length) return "";
    const bits = d.changes.map(c => {
      const arrow = c.up == null ? "" : (c.up ? " ▲" : " ▼");
      return `<span class="chg">${esc(c.field)} ${esc(String(c.from))} → <b>${esc(String(c.to))}</b>${arrow}</span>`;
    }).join("");
    return `<div class="hold-diff"><span class="chg-l">Ändrat idag</span>${bits}</div>`;
  }
  function holdingCard(h, live, decisions, diff){
    return `<div class="hold">
      <div class="hold-top">
        <div class="hold-name">${esc(h.name)}</div>
        <span class="badge badge--${decClass(h.decision)}">${esc(h.decision)}</span>
      </div>
      <div class="hold-tickers">${tickerPill(h.ticker)}${pill(h.exchange)}</div>
      ${diffStrip(diff)}
      <div class="hold-grid">
        <div><span class="k">Kurs</span><span class="v">${esc(strip(h.price) || "–")}</span></div>
        <div><span class="k">Sedan entry</span><span class="v">${esc(h.since || "–")}</span></div>
        <div><span class="k">Stop-loss</span><span class="v">${esc(h.stop || "–")}</span></div>
        <div><span class="k">Målkurs</span><span class="v">${esc(h.target || "–")}</span></div>
      </div>
      ${gaugeStrip(live)}
      ${liveStrip(live)}
      ${decisionDots(decisions)}
      ${h.motivation ? `<div class="hold-note">${clamp(h.motivation, 3)}</div>` : ""}
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
      <div class="hold-tickers">${ticker ? tickerPill(ticker) : ""}</div>
      <div class="hold-grid">
        <div><span class="k">Planerad entry</span><span class="v">${esc(entry || "–")}</span></div>
        <div><span class="k">Stop-loss</span><span class="v">${esc(stop || "–")}</span></div>
        <div><span class="k">Målkurs</span><span class="v">${esc(target || "–")}</span></div>
        <div><span class="k">R/R</span><span class="v">${esc(rr || "–")}</span></div>
      </div>
      ${status ? `<div class="hold-note">${clamp(status, 3)}</div>` : ""}
    </div>`;
  }

  // Kort för en FAKTISK öppen position ur portfolj.md:s "Aktuellt innehav".
  /* Raden på innehavskortet där Dren fyller i vad han FAKTISKT betalade.
     Robotens entry och Drens ligger bredvid varandra.

     REN funktion: fyllnaden kommer in som argument, inte ur localStorage, så
     den går att testa utan DOM och utan lagring. heldCard slår upp värdet.

     En avvikelse större än 1 % markeras — INFORMATIVT, inte som fel. Att priset
     skiljer sig från robotens är normalt; det är bara värt att se. Ett TOMT
     fält är heller ingen varning: en nyss öppnad position är inte ett problem.

     Indexsleeven har ingen entry-datum-rad att nyckla på och får därför ingen
     inmatning. Det är rätt — den är kapitalparkering, inte en affär. */
  function fillRow(row, fill){
    const VF = (typeof window !== "undefined" && window.VFills) || null;
    const key = VF ? VF.keyFor(row) : null;
    if (!key) return "";
    const min = fill && fill.kop ? fill.kop.kurs : null;
    if (min == null || !(min > 0)){
      return `<div class="fill-row"><button type="button" class="fill-btn" `
        + `data-fill-open="${esc(key)}">Vad betalade du?</button></div>`;
    }
    const robot = numOf(strip(row["Entry"] || ""));
    const antal = fill.kop.antal;
    const avvik = (robot && robot > 0) ? Math.abs(min / robot - 1) * 100 : 0;
    return `<div class="fill-row${avvik > 1 ? " fill-avvik" : ""}">`
      + `<span class="k">Du betalade</span>`
      + `<span class="v">${esc(nf(min))}${antal ? ` × ${esc(String(antal))}` : ""}</span>`
      + (avvik > 1 ? `<span class="fill-diff" title="Skillnad mot robotens entry">${esc(nf(avvik))} %</span>` : "")
      + `<button type="button" class="fill-btn" data-fill-open="${esc(key)}">Ändra</button></div>`;
  }

  /* Stängda affärer som saknar Drens siffror.

     Rutan ligger kvar tills de är ifyllda. Skulle den försvinna av sig själv
     går säljkursen förlorad, och "Mina verkliga" bygger då tyst på halv data –
     precis den sortens tystnad systemet i övrigt är byggt för att undvika.

     Ligger i Översikt UNDER intradag-bannern: en signal är åtgärdbar nu, en
     saknad säljkurs är bokföring. Poster utan nyckel hoppas över; utan nyckel
     finns inget att fylla i. */
  function renderFillsPending(saknar){
    const lista = (saknar || []).filter(s => s && s.key);
    if (!lista.length) return "";
    const n = lista.length;
    return `<div class="fills-pending"><div class="fp-head">`
      + `${n} affär${n === 1 ? "" : "er"} väntar på din säljkurs</div><div class="fp-list">`
      + lista.map(s => `<div class="fp-item"><b>${esc(s.ticker)}</b>`
        + `<span class="fp-what">saknar ${esc(s.vad)}</span>`
        + `<button type="button" class="fill-btn" data-fill-open="${esc(s.key)}">Fyll i</button></div>`).join("")
      + `</div></div>`;
  }

  /* Drens verkliga utfall för EN bok.

     Den får ALDRIG visa ett tal som computeMyStats inte gav. Är underlaget
     ofullständigt säger rutan hur många affärer som fattas och vilka — hellre
     "för tidigt" än en siffra som ser ut att betyda något. Samma regel som
     renderDecisionEval följer för `insufficient`.

     Valutan kommer in som argument: nordiskt och amerikanskt redovisas var för
     sig och summeras aldrig ihop. */
  function renderMyStats(s, bokLabel, valuta){
    if (!s || !s.totalt){
      return `<div class="empty">Inga stängda affärer i den ${esc(bokLabel)} boken ännu – `
        + `dina egna kurser fylls i på innehavskortet i Översikt.</div>`;
    }
    if (s.avkastningPct == null){
      return `<div class="empty">${s.klara} av ${s.totalt} affärer ifyllda – `
        + `fyll i resten för att se din avkastning.`
        + (s.saknar && s.saknar.length
            ? ` Saknas: ${s.saknar.map(x => esc(x.ticker)).join(", ")}.` : "")
        + `</div>`;
    }
    const rader = s.perAffar.map(a =>
      `<tr><td>${esc(a.ticker)}</td><td>${esc(nf(a.netto))} ${esc(valuta)}</td>`
      + `<td class="${a.pct >= 0 ? "pos" : "neg"}">${esc(nf(a.pct))} %</td></tr>`).join("");
    return `<div class="stat-grid">`
      + `<div class="stat"><div class="stat-l">Din avkastning</div>`
      + `<div class="stat-v ${s.avkastningPct >= 0 ? "pos" : "neg"}">${esc(nf(s.avkastningPct))} %</div>`
      + `<div class="stat-s">på ${esc(nf(s.investerat))} ${esc(valuta)} investerat</div></div>`
      + `<div class="stat"><div class="stat-l">Netto</div>`
      + `<div class="stat-v ${s.kronor >= 0 ? "pos" : "neg"}">${esc(nf(s.kronor))} ${esc(valuta)}</div>`
      + `<div class="stat-s">efter courtage</div></div></div>`
      + `<table class="tbl"><thead><tr><th>Aktie</th><th>Netto</th><th>Utfall</th></tr></thead>`
      + `<tbody>${rader}</tbody></table>`;
  }

  function heldCard(o, live){
    const name = strip(o["Aktie"] || "");
    const ticker = strip(o["Yahoo-ticker"] || "");
    const exchange = strip(o["Börs"] || "");
    const entry = strip(o["Entry"] || "");
    const stop = strip(o["Stop-loss"] || "");
    const target = strip(o["Målkurs"] || "");
    const edate = strip(o["Entry-datum"] || "");
    const weight = strip(o["Vikt"] || "");
    const note = strip(o["Anteckning"] || "");
    return `<div class="hold">
      <div class="hold-top">
        <div class="hold-name">${esc(name)}</div>
        <div class="hold-badges">${weight ? `<span class="wt-pill" title="Andel av portföljkapitalet">${esc(weight)}</span>` : ""}<span class="badge badge--behall">INNEHAV</span></div>
      </div>
      <div class="hold-tickers">${ticker ? tickerPill(ticker) : ""}${exchange ? pill(exchange) : ""}</div>
      <div class="hold-grid">
        <div><span class="k">Entry</span><span class="v">${esc(entry || "–")}</span></div>
        <div><span class="k">Vikt</span><span class="v">${esc(weight || "50 %")}</span></div>
        <div><span class="k">Stop-loss</span><span class="v">${esc(stop || "–")}</span></div>
        <div><span class="k">Målkurs</span><span class="v">${esc(target || "–")}</span></div>
      </div>
      ${fillRow(o, (typeof window !== "undefined" && window.VFills)
        ? window.VFills.get(window.VFills.keyFor(o)) : null)}
      ${gaugeStrip(live)}
      ${liveStrip(live)}
      ${note ? `<div class="hold-note">${clamp(note, 3)}</div>` : ""}
    </div>`;
  }

  function renderHoldings(latestDaily, portfolio, liveByTicker, decisionsByTicker, diffByTicker){
    let html = "";
    const lv = liveByTicker || {}, dh = decisionsByTicker || {}, df = diffByTicker || {};
    const held = (portfolio.holdings || []).filter(o => o && o["Aktie"] && !/^[–\-]$/.test(String(o["Aktie"]).trim()));
    if (held.length){
      const upd = (portfolio.updated || "").replace(/\s*\(.*$/, "").slice(0, 16);
      html += `<h3 class="sub">Aktuellt innehav${upd ? ` <span class="sub-date">${esc(upd)}</span>` : ""}</h3>
        <div class="hold-grid-wrap">${held.map(o => { const t = (o["Yahoo-ticker"] || "").trim().toUpperCase(); return heldCard(o, lv[t]); }).join("")}</div>`;
    }
    const monitored = latestDaily ? latestDaily.holdings : [];
    if (monitored.length){
      html += `<h3 class="sub">Dagens beslut <span class="sub-date">${esc(latestDaily.dateISO)}</span></h3>
        <div class="hold-grid-wrap">${monitored.map(h => { const t = (h.ticker || "").trim().toUpperCase(); return holdingCard(h, lv[t], dh[t], df[t]); }).join("")}</div>`;
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
          <div class="feed-body"><span class="feed-subj">${esc(n.subject)}</span>${clamp(n.text, 4)}</div>
        </li>`).join("")
      : `<li class="empty">Inga nya bolagsspecifika nyheter i de senaste rapporterna.</li>`;

    const radar = feed.radar.length
      ? feed.radar.map(r => `<li class="feed-item">
          <span class="chip chip--day">${esc(r.day || "•")}</span>
          <div class="feed-body">${clamp(r.text, 4)}</div>
        </li>`).join("")
      : `<li class="empty">Ingen radar i senaste veckorapporten.</li>`;

    const cats = feed.catalysts.length
      ? feed.catalysts.map(c => `<div class="cat">
          <div class="cat-top">${esc(c.name)} ${tickerPill(c.ticker)} ${c.rumor ? `<span class="badge badge--rumor">⚠️ RYKTE</span>` : ""}</div>
          <div class="cat-text">${clamp(c.text, 4)}</div>
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
  // alphaMap (valfri): { "entry|stängd|aktie": {benchPct, alphaPct} } från
  // VParse.computeAlpha. Ges den, läggs två kolumner till: benchmarkets
  // avkastning över SAMMA hållperiod och affärens alpha mot den.
  function renderHistory(portfolio, alphaMap, benchLabel){
    if (!portfolio.history.length)
      return `<div class="empty">Inga stängda positioner ännu – strategin är i baslinjeläge (0 %).</div>`;
    const cols = Object.keys(portfolio.history[0]);
    const extra = alphaMap
      ? `<th title="Benchmarkets avkastning över exakt samma hållperiod">${esc(benchLabel || "Index")}</th>`
        + `<th title="Affärens utfall minus benchmarkets – positiv siffra = urvalet tillförde något utöver marknaden">Alpha</th>`
      : "";
    const head = cols.map(c => `<th title="Klicka för att sortera">${esc(c)}</th>`).join("") + extra;
    const cell = n => n == null
      ? `<td class="faint">–</td>`
      : `<td><span class="${n > 0 ? "pos" : n < 0 ? "neg" : ""}">${esc(signPct(n))}</span></td>`;
    const rows = portfolio.history.map(r => {
      const a = alphaMap ? alphaMap[alphaKeyOf(r)] : null;
      return `<tr>${cols.map(c => {
        const v = strip(r[c]);
        if (/utfall/i.test(c)){
          const n = numPct(v);
          if (n != null) return `<td><span class="${n > 0 ? "pos" : n < 0 ? "neg" : ""}">${esc(v)}</span></td>`;
        }
        return `<td>${esc(v)}</td>`;
      }).join("")
      + (alphaMap ? cell(a && a.benchPct) + cell(a && a.alphaPct) : "")}</tr>`;
    }).join("");
    return `<div class="tbl-wrap"><table class="tbl tbl--sort"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
  }
  // Samma nyckel som VParse.alphaKey (vrender får inte bero på VParse).
  function alphaKeyOf(o){
    return [String(o["Entry-datum"] || "").slice(0, 10), String(o["Stängd"] || "").slice(0, 10),
            strip(o["Aktie"] || "")].join("|");
  }

  // ---- alpha-sammanfattning (Avkastning) --------------------------------
  function renderAlphaStats(a, benchLabel){
    if (!a || !a.trades)
      return `<div class="empty">Ingen alpha-mätning ännu – kräver stängda affärer vars hållperiod täcks av <code>price_history.json</code>.</div>`;
    const cell = (label, val, cls, sub, tip) =>
      `<div class="stat"${tip ? ` title="${esc(tip)}"` : ""}><div class="stat-l">${esc(label)}</div><div class="stat-v ${cls || ""}">${val}</div>${sub ? `<div class="stat-s">${esc(sub)}</div>` : ""}</div>`;
    return `<div class="stat-grid">
      ${cell("Snitt-alpha", esc(signPct(a.avgAlphaPct)), a.avgAlphaPct > 0 ? "pos" : "neg", "per affär mot " + esc(benchLabel || "index"),
        "Genomsnittligt utfall MINUS benchmarkets avkastning över samma hållperiod. Det är den här siffran som visar om aktieurvalet tillför något – absolut avkastning gör det inte.")}
      ${cell("Slog index", a.beat + " / " + a.trades, a.beatRate >= 0.5 ? "pos" : "neg",
        a.beatRate != null ? Math.round(a.beatRate * 100) + " % av affärerna" : "",
        "Hur många stängda affärer som gick bättre än benchmark under exakt sin hållperiod")}
      ${cell("Summa alpha", esc(signPct(a.sumAlphaPct)), a.sumAlphaPct > 0 ? "pos" : "neg", "oviktat",
        "Summan av alla affärers alpha – grov indikation på total meravkastning från urvalet")}
    </div>`;
  }
  function renderBubblare(weekly){
    if (!weekly || !weekly.bubblare.length) return "";
    return `<h3 class="sub">Bubblare (watchlist)</h3>
      <ul class="bubbl">${weekly.bubblare.map(b =>
        `<li>${clamp(b, 3)}</li>`).join("")}</ul>`;
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
      <div class="banner-text">${clamp(note.text, 3)}</div>
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
  // roles (valfri): VParse.tickerRoles(...) – utan den beter sig vyn som förut.
  // Rollen är hela poängen med kortet: ett innehav, en väntande plan, indexdelen
  // och en ticker som bara ligger kvar i watchlisten säger helt olika saker, men
  // såg tidigare exakt likadana ut.
  const ROLE_HINT = {
    innehav: "Öppen position i portföljen",
    plan: "Väntande plan – köps först när entry-villkoret nås",
    bubblare: "Case som var nära att väljas; följs upp vid nästa rotation",
    sleeve: "Indexdelen – bär kapital utan aktivt case, har varken stopp eller mål",
    index: "Jämförelseindex, inget innehav",
    valuta: "Valutakurs, inget innehav",
    bevakad: "Bevakad ticker ur watchlisten – inget innehav och ingen plan"
  };
  function renderPrices(prices, history, roles){
    if (!prices || !prices.quotes)
      return `<div class="px-card"><div class="px-head"><span class="t">Kurser (prices.json)</span></div>`
           + `<div class="empty">Inga kurser hämtade ännu – kör pris-actionen (Actions → “Hämta kurser”).</div></div>`;
    const gen = pxAge(prices.generatedAt);
    const syms = Object.keys(prices.quotes);
    const ok = prices.okCount != null ? prices.okCount
             : syms.filter(s => prices.quotes[s] && !prices.quotes[s].error).length;
    const order = ["innehav", "plan", "bubblare", "sleeve", "index", "valuta", "bevakad"];
    const roleOf = s => {
      const k = String(s).toUpperCase();
      const r = roles && roles[k];
      if (r) return r;
      if (/^\^/.test(k)) return { role: "index", label: "Index" };
      if (/=X$/.test(k)) return { role: "valuta", label: "Valuta" };
      return { role: "bevakad", label: "Bevakad" };
    };
    const counts = {};
    for (const s of syms){ const r = roleOf(s).role; counts[r] = (counts[r] || 0) + 1; }

    const items = syms.map(s => {
      const q = prices.quotes[s] || {};
      const tk = q.symbol || s;
      const r = roleOf(tk);
      const tMs = q.marketTime ? (Date.parse(q.marketTime) || 0) : 0;
      const badge = `<span class="px-role px-role--${esc(r.role)}" title="${esc(ROLE_HINT[r.role] || "")}">${esc(r.label)}</span>`;
      if (q.error || q.price == null)
        return `<div class="px-item" data-tk="${esc(String(tk).toUpperCase())}" data-t="0" data-role="${esc(r.role)}"><div class="px-tk"><span>${esc(s)}</span><span class="px-err">⚠</span></div>`
             + `<div class="px-pr px-err">–</div><div class="px-tm" title="${esc(q.error || "ingen kurs")}">${esc(truncate(q.error || "ingen kurs", 22))}</div>${badge}</div>`;
      const mt = pxAge(q.marketTime);
      const price = String(q.price) + (q.currency ? " " + q.currency : "");
      const tm = q.marketTime ? q.marketTime.slice(0, 16).replace("T", " ") : "okänd tid";
      const ser = history && history.series && history.series[q.symbol || s];
      // Dagsrörelsen kräver att filen är skriven efter previousClose-rättelsen
      // (schemaVersion). Saknas den visas inget tal alls – ett felaktigt
      // procenttal är värre än inget, det var precis så veckorörelser kunde
      // publiceras som dagsrörelser.
      const chg = (prices.schemaVersion && q.previousClose) ? (q.price / q.previousClose - 1) * 100 : null;
      const chgHtml = chg == null
        ? `<span class="px-chg px-chg--na" title="${esc(prices.schemaVersion ? "previousClose saknas för denna ticker" : "prices.json är skriven före previousClose-rättelsen (saknar schemaVersion) – dagsrörelse kan inte räknas ur den")}">–</span>`
        : `<span class="px-chg ${chg >= 0 ? "pos" : "neg"}" title="Sedan föregående sessions stängning">${esc(signPct(chg))}</span>`;
      return `<div class="px-item" data-tk="${esc(String(tk).toUpperCase())}" data-t="${tMs}" data-role="${esc(r.role)}"><div class="px-tk"><span>${esc(tk)}</span>`
           + `<span class="${mt.cls}">${mt.cls === "px-fresh" ? "✓" : "⚠"}</span></div>`
           + `<div class="px-pr">${esc(price)}${chgHtml}</div><div class="px-tm">${esc(tm)}</div>${sparkline(ser)}${badge}</div>`;
    }).join("");

    const CHIP_LABEL = { innehav: "Innehav", plan: "Planer", bubblare: "Bubblare",
      sleeve: "Indexdel", index: "Index", valuta: "Valuta", bevakad: "Bevakade" };
    const chips = [`<button class="px-chip on" data-role="alla">Alla ${syms.length}</button>`]
      .concat(order.filter(r => counts[r]).map(r =>
        `<button class="px-chip px-chip--${esc(r)}" data-role="${esc(r)}" title="${esc(ROLE_HINT[r] || "")}">${esc(CHIP_LABEL[r])} ${counts[r]}</button>`))
      .join("");

    return `<div class="px-card">
      <div class="px-head">
        <span class="t">Kurser (prices.json)</span>
        <span class="px-age ${gen.cls}">hämtad ${esc(gen.txt)}</span>
        <span class="px-sum">${ok}/${syms.length} med verifierad kurs</span>
        <div class="px-tools">
          <input id="pxSearch" class="px-search" type="search" placeholder="Filtrera ticker…" autocomplete="off" spellcheck="false"/>
          <select id="pxSort" class="px-sort" title="Sortering">
            <option value="role">Roll</option>
            <option value="az">A–Ö</option>
            <option value="fresh">Färskhet</option>
            <option value="chg">Dagsrörelse</option>
          </select>
        </div>
      </div>
      <div class="px-chips" id="pxChips">${chips}</div>
      ${prices.schemaVersion ? "" : `<div class="px-warn">Dagsrörelser visas inte: <code>prices.json</code> saknar <code>schemaVersion</code> och är skriven före rättelsen av <code>previousClose</code>. Talen fylls i vid nästa kurshämtning.</div>`}
      ${syms.length ? `<div class="px-grid" id="pxGrid">${items}</div>`
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
    return `<details class="sblock" data-key="${esc(title)}" open>
      <summary class="sub sub--sum">${esc(title)}</summary>
      <div class="sblock-body">${textToHtml(text)}</div>
    </details>`;
  }
  function scoutCaseCard(c){
    return `<div class="scase">
      <div class="scase-top">
        <div class="scase-name">${esc(c.name)}</div>
        <div class="hold-tickers">${c.ticker ? tickerPill(c.ticker) : ""}${c.exchange ? pill(c.exchange) : ""}</div>
      </div>
      ${c.catalyst ? `<div class="scase-cat"><span class="k">Katalysator</span>${clamp(c.catalyst, 3)}</div>` : ""}
      <div class="scase-bb">
        <div class="bb bb--bull"><span class="k">Bull</span>${clamp(c.bull, 5) || "–"}</div>
        <div class="bb bb--bear"><span class="k">Bear</span>${clamp(c.bear, 5) || "–"}</div>
      </div>
      ${c.setup ? `<div class="scase-setup"><span class="k">Setup</span>${clamp(c.setup, 3)}</div>` : ""}
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
      + scoutBlock("Uppföljning av tidigare case", scout.followup)
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
    const cell = (label, val, cls, sub, tip) =>
      `<div class="stat"${tip ? ` title="${esc(tip)}"` : ""}><div class="stat-l">${esc(label)}</div><div class="stat-v ${cls || ""}">${val}</div>${sub ? `<div class="stat-s">${esc(sub)}</div>` : ""}</div>`;
    return `<div class="stat-grid">
      ${cell("Affärer", String(s.trades), "", s.wins + " vinst / " + s.losses + " förlust", "Antal stängda positioner i historiken")}
      ${cell("Träffsäkerhet", s.winRate != null ? Math.round(s.winRate * 100) + " %" : "–", s.winRate >= 0.5 ? "pos" : "", "", "Andel stängda affärer med positivt utfall")}
      ${cell("Snittvinst", s.avgWin != null ? esc(signPct(s.avgWin)) : "–", "pos", "", "Genomsnittligt utfall för vinstaffärerna")}
      ${cell("Snittförlust", s.avgLoss != null ? esc(signPct(s.avgLoss)) : "–", "neg", "", "Genomsnittligt utfall för förlustaffärerna")}
      ${cell("Profit factor", pf, s.profitFactor >= 1 ? "pos" : "neg", "", "Summa vinster delat med summa förluster – över 1,0 = strategin tjänar mer än den förlorar")}
      ${cell("Bästa / sämsta", esc((s.best != null ? signPct(s.best) : "–") + " / " + (s.worst != null ? signPct(s.worst) : "–")), "", "", "Största vinsten respektive största förlusten per affär")}
      ${cell("Snitt hålltid", s.avgHoldDays != null ? Math.round(s.avgHoldDays) + " dgr" : "–", "", "", "Genomsnittligt antal kalenderdagar från entry till stängning")}
      ${cell("Mål / stopp / rot.", s.byReason.target + " / " + s.byReason.stop + " / " + s.byReason.rotation, "", "orsak till stängning", "Hur positionerna stängts: målkurs nådd / stop-loss / veckorotation")}
      ${cell("Netto efter kostnad", s.netChainedPct != null ? esc(signPct(s.netChainedPct)) : "–",
        s.netChainedPct > 0 ? "pos" : s.netChainedPct < 0 ? "neg" : "",
        s.costPct ? "−" + s.costPct.toFixed(2) + " % per affär" : "ingen kostnad satt",
        "Kedjad avkastning efter courtage och spread enligt config/kostnader.json – det är den här siffran som motsvarar vad depån faktiskt visar")}
    </div>
    <div class="stat-note">Kedjad avkastning (per-affär-vikt): ${esc(signPct(s.chainedPct))} brutto · ${esc(signPct(s.netChainedPct))} netto${s.costDragPct ? ` (kostnadsdrag ${esc(signPct(-Math.abs(s.costDragPct)))})` : ""} · summa utfall: ${esc(signPct(s.sumPct))} — jämför med routinens angivna ackumulerade siffra, som är brutto.</div>`;
  }

  // ---- riskmått (Avkastning) ---------------------------------------------
  function renderRiskStats(r){
    if (!r || !r.trades)
      return `<div class="empty">Inga stängda affärer ännu – riskmåtten fylls i när positioner stängs.</div>`;
    const cell = (label, val, cls, sub, tip) =>
      `<div class="stat"${tip ? ` title="${esc(tip)}"` : ""}><div class="stat-l">${esc(label)}</div><div class="stat-v ${cls || ""}">${val}</div>${sub ? `<div class="stat-s">${esc(sub)}</div>` : ""}</div>`;
    const dd = r.maxDrawdownPct;
    return `<div class="stat-grid">
      ${cell("Max drawdown", dd != null ? "−" + dd.toFixed(2) + " %" : "–", dd > 0 ? "neg" : "", "topp till dal", "Största tappet från en toppnivå i den kedjade equity-kurvan (per-affär-vikt) innan ny topp nåddes")}
      ${cell("Längsta förlustsvit", String(r.lossStreak), r.lossStreak >= 3 ? "neg" : "", r.winStreak ? "längsta vinstsvit: " + r.winStreak : "", "Flest förlustaffärer i rad (kronologiskt på stängningsdatum)")}
      ${cell("Volatilitet per affär", r.stdevPct != null ? "± " + r.stdevPct.toFixed(2) + " %" : "–", "", "standardavvikelse", "Spridningen i utfall per affär – högre = mer slagig strategi")}
      ${cell("Payoff ratio", r.payoff != null ? r.payoff.toFixed(2) : "–", r.payoff >= 1.5 ? "pos" : r.payoff != null && r.payoff < 1 ? "neg" : "", "snittvinst / snittförlust", "Hur mycket en genomsnittlig vinst ger i förhållande till en genomsnittlig förlust – över 1,5 ger marginal även vid medioker träffsäkerhet")}
    </div>`;
  }

  // ---- beslutsloggen (Avkastning) ----------------------------------------
  // Visar hur långt kalibreringsunderlaget kommit och vad det säger hittills.
  // Poängen är att en logg som slutat fyllas ska SYNAS – tidigare upptäcktes
  // det först när miss-retron letade efter statistik som inte fanns.
  const CATALYST_SV = {
    earnings: "Rapport", order: "Order", regulatory: "Myndighetsbesked",
    buyback: "Återköp", ma_rumor: "Uppköpsrykte", insider: "Insynshandel",
    index: "Indexändring", macro: "Makro", turnaround: "Vändningscase", other: "Övrigt"
  };
  function renderDecisionStats(s){
    if (!s || !s.rows)
      return `<div class="empty">Beslutsloggen är tom – rotationerna skriver en rad per beslut i <code>state/decisions.json</code>.</div>`;
    const pct = v => v == null ? "–" : signPct(v);
    const bar = s.calibratable ? 100 : Math.round(s.closedCount / s.minTotal * 100);
    const head = `<div class="stat-grid">
      <div class="stat" title="Alla loggade beslut, inklusive BEHÅLL och AVVAKTA"><div class="stat-l">Loggade beslut</div><div class="stat-v">${s.rows}</div><div class="stat-s">${esc(Object.entries(s.byBook).map(([b, n]) => b + " " + n).join(" · "))}</div></div>
      <div class="stat" title="Stängda affärer med utfall – sleeve-transaktioner räknas inte, de mäter marknaden och inte urvalet"><div class="stat-l">Utvärderbara SÄLJ</div><div class="stat-v ${s.calibratable ? "pos" : ""}">${s.closedCount} / ${s.minTotal}</div><div class="stat-s">${s.calibratable ? "underlaget räcker" : s.needed + " kvar till kalibrering"}</div></div>
      <div class="stat" title="Rader som backfyllts i efterhand i stället för att skrivas av en körning"><div class="stat-l">Backfyllda rader</div><div class="stat-v ${s.backfilled === s.rows && s.rows ? "neg" : ""}">${s.backfilled}</div><div class="stat-s">${s.backfilled === s.rows && s.rows ? "ingen live-loggning ännu" : "resten skrivna av körningar"}</div></div>
      <div class="stat" title="Första och senaste datum i loggen"><div class="stat-l">Period</div><div class="stat-v" style="font-size:15px">${esc(s.firstDate || "–")}</div><div class="stat-s">till ${esc(s.lastDate || "–")}</div></div>
    </div>
    <div class="dl-bar" title="Andel av de ${s.minTotal} stängda affärer som krävs innan poängvikterna kan kalibreras mot data"><span style="width:${Math.min(100, bar)}%"></span></div>`;
    if (!s.byCatalyst.length)
      return head + `<div class="empty">Inga stängda affärer med utfall ännu – tabellen per katalysatortyp fylls när positioner säljs.</div>`;
    const rows = s.byCatalyst.map(c => `<tr class="${c.reliable ? "" : "dl-thin"}">
      <td>${esc(CATALYST_SV[c.type] || c.type)}</td>
      <td>${c.n}${c.reliable ? "" : ` <span class="dl-flag" title="Under ${s.minPerType} affärer – siffrorna är brus, inte resultat">brus</span>`}</td>
      <td>${c.winRate == null ? "–" : Math.round(c.winRate * 100) + " %"}</td>
      <td class="${c.avgPct > 0 ? "pos" : c.avgPct < 0 ? "neg" : ""}">${pct(c.avgPct)}</td>
      <td class="${c.avgAlphaPct > 0 ? "pos" : c.avgAlphaPct < 0 ? "neg" : ""}">${pct(c.avgAlphaPct)}</td>
    </tr>`).join("");
    return head + `<div class="tbl-wrap"><table class="tbl">
      <thead><tr><th>Katalysatortyp</th><th title="Antal stängda affärer">Affärer</th><th>Träff</th>
      <th title="Genomsnittligt utfall per affär">Snittutfall</th>
      <th title="Genomsnittligt utfall minus index över samma hållperiod">Snitt-alpha</th></tr></thead>
      <tbody>${rows}</tbody></table></div>
      <div class="stat-note">Kategorier med färre än ${s.minPerType} affärer är markerade som brus – de får inte styra poängvikterna. Indexsleevens transaktioner är exkluderade.</div>`;
  }

  // ---- beslutsutvärdering (Avkastning) -----------------------------------
  // VARFÖR: backtestet visar att skelettet inte bär – edgen ska komma ur
  // katalysatorurvalet, och det mättes inte av någonting. Handelsstatistiken
  // kräver STÄNGDA affärer (två stycken 2026-08-03). Den här rutan mäter i
  // stället VARJE beslut mot efterföljande kurs, inklusive de AVVISADE. De
  // avvisade är hela poängen: går de bättre än de köpta är filtret för strängt.
  // Underlaget växer med ~10–15 rader i veckan i stället för ~1 i månaden.
  /* ---- KANDIDATKÖN (state/scout_candidates.json) -------------------------
     Rutan finns för att göra KÖN synlig, inte utfallet. Utfallet syns redan:
     en promotad kandidat blir ett KÖP i dagsrapporten och dyker upp i Hem-vyns
     "något att göra?", en avvisad blir en AVVAKTA-rad och hamnar under
     "Avvisade" i beslutsutvärderingen. Det som INTE gick att se förrän nu är
     en kandidat som ligger och väntar – och det var precis den tystnaden som
     lät Palantir flaggas tre dagar i rad utan att någon bok tog ställning.
     Renderaren är REN och testas utan DOM. */
  const CAND_STATUS_SV = { "new": "Väntar på avgörande", "promoted": "Köpt",
                           "rejected": "Avvisad", "expired": "Utgången" };
  function renderCandidates(db, today){
    /* Filtrera bort icke-objekt DIREKT. Filen skrivs av en LLM-routine, så en
       trasig eller null-post är ett realistiskt läge – och utan det här ledet
       kastar renderaren och SLÄCKER HELA VYN i stället för att visa de rader
       som faktiskt går att läsa. Validatorn fångar sådant i CI, men appen
       renderar det som ligger på main just nu. */
    const list = (db && Array.isArray(db.candidates))
      ? db.candidates.filter(c => c && typeof c === "object") : null;
    if (!list)
      return `<div class="empty">Ingen kandidatkö – <code>state/scout_candidates.json</code> skrivs av scouten och av beställda analyser, och avgörs av rotationerna.</div>`;
    if (!list.length)
      return `<div class="empty">Inga kandidater just nu. Scouten och analyserna lägger in nya här; rotationerna avgör dem samma dag.</div>`;
    const now = today || new Date().toISOString().slice(0, 10);
    // Väntande först (det är dem rutan finns för), sedan senast avgjorda.
    const rank = c => (c && c.status === "new") ? 0 : 1;
    list.sort((a, b) => rank(a) - rank(b) ||
      String((b && b.decidedAt) || (b && b.date) || "").localeCompare(String((a && a.decidedAt) || (a && a.date) || "")));
    const waiting = list.filter(c => c && c.status === "new");
    // En väntande kandidat som passerat expiresAt = ingen bok tog ställning.
    const stale = waiting.filter(c => c.expiresAt && c.expiresAt < now);
    const rows = list.slice(0, 20).map(c => {
      const st = CAND_STATUS_SV[c.status] || String(c.status || "");
      const isStale = c.status === "new" && c.expiresAt && c.expiresAt < now;
      const cls = c.status === "promoted" ? "kop" : c.status === "rejected" ? "avvakta"
                : isStale ? "salj" : "behall";
      const why = c.decisionReason ? ` <span class="cand-why">${esc(truncate(c.decisionReason, 140))}</span>` : "";
      const conf = c.confirmed === false
        ? ` <span class="badge badge--rumor" title="Obekräftad katalysator – kan aldrig bli ett köp">bevakning</span>` : "";
      const px = (typeof c.price === "number")
        ? ` <span class="cand-px">${esc(String(c.price))}</span>`
        : ` <span class="cand-px cand-px--none" title="Kurs kunde inte verifieras – kandidaten kan avfärdas men aldrig köpas">kurs saknas</span>`;
      return `<li class="cand cand--${cls}">
        <div class="cand-top">${tickerPill(c.ticker)}<span class="book-badge book-badge--${c.book === "us" ? 1 : 0}">${c.book === "us" ? "US" : "Nordisk"}</span>${conf}${px}
          <span class="cand-st">${esc(st)}${isStale ? " – FÖRSENAD" : ""}</span></div>
        <div class="cand-th">${esc(truncate(c.thesis || "", 180))}</div>
        <div class="cand-meta">flaggad ${esc(c.date || "?")} av ${esc(c.source || "?")}${c.expiresAt ? ` · gäller t.o.m. ${esc(c.expiresAt)}` : ""}${why}</div>
      </li>`;
    }).join("");
    const warn = stale.length
      ? `<div class="sv-warn">${stale.length} kandidat(er) har passerat sitt sista giltighetsdatum utan att någon bok tagit ställning. Rotationsprompternas punkt 2d kräver ett avgörande per körning – det här är ett processfel, inte ett marknadsläge.</div>`
      : "";
    return `${warn}<div class="cand-sum">${waiting.length} väntar på avgörande · ${list.length} totalt</div>
      <ul class="cand-list">${rows}</ul>
      <p class="stat-note">En kandidat måste avgöras av ansvarig bok samma dag: avvisad med namngiven spärr, eller köpt. Avvisade loggas som <code>AVVAKTA</code> och mäts i "Tillför urvalet något?" under Avkastning. En kandidat utan verifierad kurs kan aldrig bli ett köp.</p>`;
  }

  /* ---- RAPPORTER PÅ VÄG (state/earnings_calendar.json) -------------------
     Direkt handlingsbart: en rapport i ett INNEHAV är det prompten kallar
     "binär händelse inom 2 handelsdagar" och kan tvinga fram ett beslut före
     eventet. `isEstimate` måste märkas – Yahoo gissar då datumet ur förra
     årets kadens, och en gissning får aldrig läsas som ett bekräftat datum. */
  function renderEarningsSoon(cal, heldTickers){
    // Samma skäl som i renderCandidates: en trasig post får aldrig släcka vyn.
    const up = (cal && Array.isArray(cal.upcoming))
      ? cal.upcoming.filter(u => u && typeof u === "object") : null;
    if (!up)
      return `<div class="empty">Ingen rapportkalender – <code>state/earnings_calendar.json</code> hämtas av pris-jobbet varje morgon.</div>`;
    if (!up.length)
      return `<div class="empty">Inga rapporter inom ${esc(String((cal && cal.horizonDays) || 10))} handelsdagar bland bevakade bolag.</div>`;
    const held = new Set((heldTickers || []).filter(Boolean));
    const rows = up.slice(0, 12).map(u => {
      const own = held.has(u.symbol);
      const när = u.tradingDaysAway === 0 ? "i dag"
                : u.tradingDaysAway === 1 ? "i morgon"
                : `om ${u.tradingDaysAway} handelsdagar`;
      return `<li class="er${own ? " er--held" : ""}">
        ${tickerPill(u.symbol)}<span class="er-when">${esc(när)}</span>
        <span class="er-date">${esc(u.date || "")}</span>
        ${own ? `<span class="er-tag" title="Rapporten är en binär händelse i ett innehav">INNEHAV</span>` : ""}
        ${u.isEstimate ? `<span class="er-est" title="Yahoo gissar datumet ur förra årets kadens – inte bekräftat av bolaget">gissat datum</span>` : ""}
      </li>`;
    }).join("");
    return `<ul class="er-list">${rows}</ul>
      <p class="stat-note">Bolag markerade <b>INNEHAV</b> rapporterar medan boken äger dem – prompten kräver att positionen då motiveras explicit eller säljs i förväg. Ett <b>gissat datum</b> räknas aldrig som bekräftad binär händelse.</p>`;
  }

  const ACTION_SV = { "KÖP": "Köpta", "SÄLJ": "Sålda", "BEHÅLL": "Behållna", "AVVAKTA": "Avvisade" };
  function renderDecisionEval(ev){
    if (!ev || !ev.counts)
      return `<div class="empty">Ingen beslutsutvärdering ännu – <code>state/decision_eval.json</code> skrivs av pris-jobbet ur beslutsloggen och kurshistoriken.</div>`;
    const hs = ev.horizons || [5, 20];
    const h1 = hs[0], h2 = hs[1];
    const B = ev.byHorizon || {};
    const at = (h, key) => (B[h] && B[h].byAction && B[h].byAction[key]) || null;
    const edge = (B[h1] && B[h1].selectionEdge) || null;
    const clus = (B[h1] && B[h1].clustered) || null;
    const conv = (B[h1] && B[h1].convergence) || null;
    const pct = v => v == null ? "–" : signPct(v);
    const mature = ev.counts.measurable - ev.counts.pending;
    const cell = (label, val, cls, sub, tip) =>
      `<div class="stat"${tip ? ` title="${esc(tip)}"` : ""}><div class="stat-l">${esc(label)}</div><div class="stat-v ${cls || ""}">${val}</div>${sub ? `<div class="stat-s">${esc(sub)}</div>` : ""}</div>`;
    const edgeVal = edge && !edge.insufficient ? pct(edge.edgePct) : "för tidigt";
    const edgeSub = edge
      ? (edge.insufficient
          ? "behöver " + (edge.need.bought || 0) + " fler köpta, " + (edge.need.passed || 0) + " fler avvisade"
          : (edge.clusterCaveat ? edge.clusterCaveat : edge.verdict))
      : "";
    const head = `<div class="stat-grid">
      ${cell("Mätbara beslut", String(ev.counts.measurable) + " / " + ev.counts.decisions,
        ev.counts.missing ? "neg" : "",
        ev.counts.missing ? ev.counts.missing + " utan kurshistorik" : "alla har kurshistorik",
        "Beslut i decisions.json som går att mäta mot price_history.json. Indexsleeven räknas inte – den följer per definition sitt eget benchmark.")}
      ${cell("Mogna (" + h1 + " dgr)", String(mature),
        "", ev.counts.pending + " väntar på " + h1 + " handelsdagar",
        "Ett beslut kan mätas först när kurshistoriken sträcker sig " + h1 + " handelsdagar framåt. Omogna beslut räknas ALDRIG som nollresultat – det skulle dra alla medelvärden mot mitten.")}
      ${cell("Urvalsedge " + h1 + " dgr", edgeVal,
        // FÄRGEN GATEAS PÅ OBEROENDE MÄTFÖNSTER, INTE PÅ RADANTAL (2026-08-26).
        // selectionEdge gatear på radantal av historiska skäl – frontenden och testerna
        // läser `verdict`, och den lämnas orörd. Men ett grönt tal LÄSES som ett svar,
        // och det var precis den avläsningen som gjorde radantalsfelet dyrt: 191 rader
        // på 18 datum är 5 oberoende femdagarsfönster, alltså ~5× svagare än talet ser ut.
        // Bär uttalandet en clusterCaveat är siffran en RIKTNING – då färgas den inte,
        // och underraden säger varför. Rutan "Oberoende mätfönster" bredvid bär färgen.
        edge && !edge.insufficient && !edge.clusterCaveat
          ? (edge.edgePct > 0 ? "pos" : edge.edgePct < 0 ? "neg" : "") : "",
        edgeSub,
        "Skillnaden i snitt-alpha mellan de köpta och de avvisade kandidaterna. Positivt = urvalet skilde dem i rätt riktning. Detta är den enda mätningen som inte kräver stängda affärer. Talet färgas först när det vilar på tillräckligt många OBEROENDE mätfönster – radantalet räcker inte.")}
      ${cell("Köpta som slog index", at(h1, "KÖP") && at(h1, "KÖP").beatIndexPct != null
          ? at(h1, "KÖP").beatIndexPct + " %" : "–",
        "", at(h1, "KÖP")
          ? "n = " + at(h1, "KÖP").n + (at(h1, "KÖP").insufficient ? " – brus" : "")
          : "",
        "Andel köpbeslut vars kurs gick bättre än bokens index över " + h1 + " handelsdagar.")}
      ${cell("Oberoende mätfönster", clus ? String(clus.effectiveN) : "–",
        clus && clus.insufficient ? "neg" : "",
        clus ? clus.n + " rader på " + clus.nDates + " datum" : "",
        "Beslut inom samma mätfönster delar marknadsrörelse och är INTE oberoende observationer. "
        + "Det är den här siffran, inte radantalet, som avgör om något får utläsas ur tabellen nedan.")}
      ${cell("Konvergenstest", conv ? conv.decision : "–",
        conv && conv.decision === "konvergera mot indexsleeven" ? "neg" : "",
        conv ? (conv.reason || "") : "",
        "Tröskeln är deklarerad i förväg (STRATEGI.md 10.6): når urvalsedgen inte "
        + (conv && conv.declared ? "+" + conv.declared.minEdgePct + " pp på " + conv.declared.minClusters : "tröskeln på ")
        + " oberoende mätfönster ska boken konvergera mot indexsleeven. Det utfallet är godkänt, inte ett fel.")}
    </div>`;
    const order = ["KÖP", "AVVAKTA", "BEHÅLL", "SÄLJ"];
    const rows = order.filter(k => at(h1, k) || at(h2, k)).map(k => {
      const a = at(h1, k) || { n: 0 }, b = at(h2, k) || { n: 0 };
      const thin = a.insufficient;
      return `<tr class="${thin ? "dl-thin" : ""}">
        <td>${esc(ACTION_SV[k] || k)}</td>
        <td>${a.n}${thin ? ` <span class="dl-flag" title="Under ${ev.minN} mätpunkter – siffrorna är brus, inte resultat">brus</span>` : ""}</td>
        <td class="${a.meanAlphaPct > 0 ? "pos" : a.meanAlphaPct < 0 ? "neg" : ""}">${pct(a.meanAlphaPct)}</td>
        <td>${a.beatIndexPct == null ? "–" : a.beatIndexPct + " %"}</td>
        <td class="${b.meanAlphaPct > 0 ? "pos" : b.meanAlphaPct < 0 ? "neg" : ""}">${pct(b.meanAlphaPct)}</td>
      </tr>`;
    }).join("");
    const table = rows ? `<div class="tbl-wrap"><table class="tbl">
      <thead><tr><th>Beslut</th><th title="Antal mogna mätpunkter">Mätpunkter</th>
      <th title="Snittavkastning minus index över ${h1} handelsdagar">Snitt-alpha ${h1} d</th>
      <th title="Andel som gick bättre än index">Slog index</th>
      <th title="Snittavkastning minus index över ${h2} handelsdagar">Snitt-alpha ${h2} d</th></tr></thead>
      <tbody>${rows}</tbody></table></div>`
      : `<div class="empty">Inga beslut har hunnit mogna ${h1} handelsdagar ännu.</div>`;
    const miss = (ev.missingSymbols || []).length
      ? `<div class="stat-note">Omätbara tickers: ${esc(ev.missingSymbols.join(", "))} – de saknas i
         <code>state/price_history.json</code> och beslutet kan därför aldrig utvärderas. Lägg dem i
         <code>config/watchlist.txt</code> respektive <code>watchlist_us.txt</code> så hämtas de framöver.</div>`
      : "";
    return head + table + miss + `<div class="stat-note">Raderna med
      <span class="dl-flag">brus</span> har färre än ${ev.minN} mätpunkter och får inte styra något beslut.
      <b>Avvisade</b> är kandidater som fick AVVAKTA – de är det kontrafaktiska underlaget: går de
      systematiskt bättre än de köpta är urvalsfiltret för strängt, går de sämre tjänar det sitt
      uppehälle. Allt mäts mot bokens eget index (OMXS30 respektive S&amp;P 500) över exakt samma
      fönster, aldrig absolut.</div>`;
  }

  // ---- lärdomskort (Retro-fliken, ur state/lessons.md) -------------------
  function lessonCol(o, re){
    const k = Object.keys(o || {}).find(key => re.test(key));
    return k ? strip(o[k]) : "";
  }
  function renderLessons(lessons){
    const act = (lessons && lessons.active) || [];
    const arch = (lessons && lessons.archived) || [];
    if (!act.length && !arch.length)
      return `<div class="empty">Inga lärdomar ännu – fylls på när miss-retron körts (fredag kväll/helg).</div>`;
    const cards = act.map(o => {
      const id = lessonCol(o, /^id$/i);
      const date = lessonCol(o, /^datum$/i);
      const src = lessonCol(o, /källa/i);
      const rule = lessonCol(o, /^regel$/i);
      const scope = lessonCol(o, /gäller/i);
      return `<div class="lesson">
        <div class="lesson-top">${id ? `<span class="lesson-id">${esc(id)}</span>` : ""}${scope ? `<span class="lesson-scope">${esc(scope)}</span>` : ""}</div>
        <div class="lesson-rule">${esc(rule || "–")}</div>
        <div class="lesson-meta">${esc(date)}${src ? " · " + esc(src) : ""}</div>
      </div>`;
    }).join("");
    return (act.length ? `<div class="lesson-wrap">${cards}</div>`
                       : `<div class="empty">Inga aktiva lärdomar just nu.</div>`)
      + (arch.length ? `<div class="stat-note">${arch.length} arkiverad${arch.length > 1 ? "e" : ""} lärdom${arch.length > 1 ? "ar" : ""} – se <code>state/lessons.md</code>.</div>` : "");
  }

  // ---- månadsheatmap (Avkastning) ----------------------------------------
  function renderMonthlyHeatmap(months){
    if (!months || !months.length)
      return `<div class="empty">Inget månadsutfall ännu – fylls i när positioner stängs.</div>`;
    const MO = ["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec"];
    const max = Math.max.apply(null, months.map(m => Math.abs(m.pct))) || 1;
    const cells = months.map(m => {
      const mi = parseInt(m.month.slice(5), 10) - 1;
      const label = (MO[mi] || m.month.slice(5)) + " " + m.month.slice(0, 4);
      const a = (0.16 + 0.62 * Math.abs(m.pct) / max).toFixed(2);
      const bg = m.pct > 0 ? `rgba(16,185,129,${a})` : m.pct < 0 ? `rgba(239,68,68,${a})` : "rgba(148,163,184,.14)";
      return `<div class="hm-cell" style="background:${bg}" title="${m.trades} affär${m.trades > 1 ? "er" : ""}, ${m.wins} vinst – kedjat viktat utfall inom månaden">
        <span class="hm-m">${esc(label)}</span><span class="hm-v">${esc(signPct(m.pct))}</span><span class="hm-t">${m.trades} affär${m.trades > 1 ? "er" : ""}</span>
      </div>`;
    }).join("");
    return `<div class="hm-wrap">${cells}</div>`;
  }

  // ---- sökresultat (fulltextsökning i Rapporter) -------------------------
  function hilite(text, query){
    const t = esc(text);
    const q = esc(String(query || "").trim());
    if (!q) return t;
    const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "ig");
    return t.replace(re, m => `<mark>${m}</mark>`);
  }
  /* ---- högerspalten i Rapporter -------------------------------------------
     Rapporttexten är kapad i bredd med flit (radlängd), vilket lämnade halva
     skärmen tom på en bred skärm. Spalten fyller den med sådant som går att
     härleda MEKANISKT ur rapporten – innehållsförteckning, dagens beslut,
     bevakning, nämnda tickers – aldrig något genererat.
     `o` = { outline, digest, tickers, prev, next } från app.js. */
  function renderReportRail(o){
    o = o || {};
    const parts = [];
    const card = (title, body, n) =>
      `<div class="rail-card"><div class="rail-t">${esc(title)}` +
      (n != null ? `<span class="n">${n}</span>` : "") + `</div>${body}</div>`;

    const d = o.digest || {};
    // I korthet: fältrader + innehav/case. Dagliga rapporter har ett beslut per
    // rad; vecko- och scoutrapporter har case utan beslut – då visas tickern.
    if ((d.facts && d.facts.length) || (d.items && d.items.length)){
      let body = "";
      if (d.facts && d.facts.length)
        body += `<dl class="rep-facts">` + d.facts.map(f =>
          `<dt>${esc(f.k)}</dt><dd><span class="cw"><span class="clamp" style="--cl:3">${esc(f.v)}</span>` +
          `<button type="button" class="clamp-more">Visa mer</button></span></dd>`).join("") + `</dl>`;
      if (d.items && d.items.length)
        body += `<div class="rep-decs">` + d.items.slice(0, 8).map(x =>
          `<span class="rep-dec"><b>${esc(x.name)}</b>` +
          (x.decision ? `<span class="badge badge--${decClass(x.decision)}">${esc(x.decision)}</span>`
                      : x.ticker ? `<span class="pill">${esc(x.ticker)}</span>` : "") +
          `</span>`).join("") + `</div>`;
      parts.push(card("I korthet", body));
    }

    // Innehållsförteckning – klickbar, markerar aktivt avsnitt vid rullning
    const ol = o.outline || [];
    if (ol.length > 1)
      parts.push(card("Innehåll",
        `<ul class="rep-toc">` + ol.map(h =>
          `<li class="lvl${h.level}"><button type="button" class="rep-toc-a" data-toc="${esc(h.id)}">${esc(h.text)}</button></li>`
        ).join("") + `</ul>`, ol.length));

    // Bevakning (dagliga/vecko)
    if (d.watch && d.watch.length)
      parts.push(card("Bevakning", `<ul class="rail-list">` +
        d.watch.map(w => `<li>${esc(w)}</li>`).join("") + `</ul>`, d.watch.length));

    // Tickers som nämns – klick öppnar Analys-vyn
    const tk = o.tickers || [];
    if (tk.length)
      parts.push(card("Nämnda tickers", `<div class="rep-tks">` +
        tk.slice(0, 24).map(t => tickerPill(t)).join(" ") + `</div>`, tk.length));

    // Grannavigering
    if (o.prev || o.next)
      parts.push(card("Fler rapporter",
        `<div class="rep-nav">` +
        (o.prev ? `<button type="button" class="rep-nav-b" data-report="${esc(o.prev.name)}">← ${esc(o.prev.label)}</button>` : "") +
        (o.next ? `<button type="button" class="rep-nav-b" data-report="${esc(o.next.name)}">${esc(o.next.label)} →</button>` : "") +
        `</div>`));

    return parts.join("");
  }

  function renderSearchResults(results, query){
    if (!results || !results.length)
      return `<div class="empty">Inga träffar på "${esc(query)}" i rapporterna.</div>`;
    const TYPE = { daily: "Daglig", weekly: "Vecko", scout: "Scout", analysis: "Analys", case: "Case",
                   retro: "Retro", us_daily: "US-daglig", us_weekly: "US-vecko" };
    return `<div class="sr-list">` + results.map(r =>
      `<button type="button" class="sr-hit" data-open-report="${esc(r.meta.name)}" data-rtype="${esc(r.meta.type)}">
        <span class="sr-head"><span class="chip">${esc(TYPE[r.meta.type] || r.meta.type)}</span><b>${esc(r.meta.dateISO)}</b> — ${esc(r.meta.label)}<span class="sr-count">${r.count} träff${r.count > 1 ? "ar" : ""}</span></span>
        ${r.snippets.map(s => `<span class="sr-snip">${hilite(s, query)}</span>`).join("")}
      </button>`).join("") + `</div>`;
  }

  // ---- Total: kombinerad översikt över båda böckerna --------------------
  // books = [{ label, portfolio, live }]. splitNordic = kapitalandel (0–1) i
  // första boken. Blended avkastning = böckernas accum viktad med andelarna.
  function renderTotal(books, splitNordic, meta){
    books = books || [];
    const wN = splitNordic == null ? 0.5 : splitNordic;
    const weights = books.length === 2 ? [wN, 1 - wN] : books.map(() => 1 / (books.length || 1));
    const real = b => ((b.portfolio && b.portfolio.holdings) || []).filter(o => o && o["Aktie"] && !/^[–\-]$/.test(String(o["Aktie"]).trim()));
    let blended = 0, haveAny = false;
    books.forEach((b, i) => { const a = b.portfolio && b.portfolio.accum; if (a != null) { blended += a * weights[i]; haveAny = true; } });
    const kpi = (label, val, cls, sub) =>
      `<div class="kpi"><div class="kpi-label">${esc(label)}</div><div class="kpi-value ${cls || ""}">${val}</div>${sub ? `<div class="kpi-sub">${esc(sub)}</div>` : ""}</div>`;
    let openCount = 0; books.forEach(b => openCount += real(b).length);
    const kpis = `<div class="kpi-grid">
      ${kpi("Blended avkastning", haveAny ? esc(signPct(blended)) : "–", "num " + trendClass(haveAny ? blended : null), "viktad över böckerna")}
      ${books.map((b, i) => kpi(b.label + " avkastning", esc(signPct(b.portfolio && b.portfolio.accum)), "num " + trendClass(b.portfolio && b.portfolio.accum), Math.round(weights[i] * 100) + " % av kapitalet")).join("")}
      ${kpi("Öppna positioner", String(openCount), "num", books.map(b => real(b).length + " " + b.label.toLowerCase()).join(" · "))}
    </div>`;
    const alloc = `<div class="alloc-bar">${books.map((b, i) =>
      `<span class="alloc-seg alloc-seg--${i}" style="width:${Math.round(weights[i] * 100)}%">${esc(b.label)} ${Math.round(weights[i] * 100)} %</span>`).join("")}</div>`;
    let allocMeta = "";
    if (meta && meta.dynamic === false){
      allocMeta = `<div class="alloc-meta"><span class="alloc-meta-k">Kapitalvikt</span> baslinje 50/50 – allokerings-routinen har inte kört ännu.</div>`;
    } else if (meta && (meta.rationale || meta.updatedAt)){
      const upd = meta.updatedAt ? String(meta.updatedAt).slice(0, 10) : "";
      allocMeta = `<div class="alloc-meta"><span class="alloc-meta-k">Kapitalvikt</span> ${esc(strip(meta.rationale) || "–")}`
        + `<span class="alloc-meta-t">satt av allokerings-routinen${upd ? " · " + esc(upd) : ""}${meta.week ? " · " + esc(meta.week) : ""}</span></div>`;
    }
    // Valutaupplysning: us-boken är USD-denominerad och blended-talet räknar
    // procent mot procent. För en SEK-depå tillkommer USD/SEK-rörelsen – den
    // redovisas här i stället för att tyst antas vara noll.
    const fx = meta && meta.fx;
    const fxNote = fx && fx.rate != null
      ? `<div class="fx-meta"><span class="fx-meta-k">Valuta</span> US-boken redovisas i USD – blended-talet ovan är <strong>exkl. valutaeffekt</strong>. `
        + `USD/SEK ${esc(fx.rate.toFixed(2))}${fx.changePct != null ? ` (${esc(signPct(fx.changePct))} idag)` : ""}. `
        + `En SEK-depå får US-avkastningen multiplicerad med valutarörelsen sedan respektive affär.`
        + `<span class="fx-meta-t">växelkurs ur prices.json${fx.marketTime ? " · " + esc(String(fx.marketTime).slice(0, 10)) : ""}</span></div>`
      : `<div class="fx-meta"><span class="fx-meta-k">Valuta</span> US-boken redovisas i USD – blended-talet är <strong>exkl. valutaeffekt</strong>. `
        + `Lägg <code>USDSEK=X</code> i <code>config/watchlist_us.txt</code> så visas växelkursen här.</div>`;
    const rows = [];
    books.forEach((b, i) => real(b).forEach(o => {
      const tk = (o["Yahoo-ticker"] || "").trim().toUpperCase();
      rows.push({ label: b.label, bi: i, name: strip(o["Aktie"]), tk, entry: strip(o["Entry"]), weight: strip(o["Vikt"]) || "50 %", lv: (b.live || {})[tk] });
    }));
    const tbl = rows.length
      ? `<div class="tbl-wrap"><table class="tbl total-tbl"><thead><tr><th>Bok</th><th>Aktie</th><th>Ticker</th><th>Vikt</th><th>Entry</th><th>Kurs</th><th>P/L</th></tr></thead><tbody>${rows.map(r => {
          const px = r.lv && r.lv.price != null ? (r.lv.price + (r.lv.currency ? " " + r.lv.currency : "")) : "–";
          const pl = r.lv && r.lv.pnlPct != null ? `<span class="${r.lv.pnlPct >= 0 ? "pos" : "neg"}">${esc(signPct(r.lv.pnlPct))}</span>` : "–";
          return `<tr><td><span class="book-badge book-badge--${r.bi}">${esc(r.label)}</span></td><td>${esc(r.name)}</td><td>${tickerPill(r.tk)}</td><td>${esc(r.weight)}</td><td>${esc(r.entry || "–")}</td><td>${esc(px)}</td><td>${pl}</td></tr>`;
        }).join("")}</tbody></table></div>`
      : `<div class="empty">Inga öppna positioner i någon bok just nu.</div>`;
    return kpis
      + `<h3 class="sub">Kapitalfördelning</h3>${alloc}${allocMeta}`
      + `<h3 class="sub">Alla positioner</h3>${tbl}`
      + fxNote
      + `<div class="stat-note">Blended = böckernas ackumulerade avkastning viktad med kapitalfördelningen (${books.map((b, i) => b.label + " " + Math.round(weights[i] * 100) + " %").join(" / ")}). Rena procenttal – ingen valutaomräkning. P/L per position ur prices.json.</div>`;
  }

  // ---- intradag-signaler (monitor) -------------------------------------
  // mon (valfri): VParse.monitorStatus(alerts) – monitorns hjärtslag. Ges den
  // visas en statusrad ÄVEN när det inte finns några signaler, så att "frisk
  // monitor utan signaler" går att skilja från "monitorn har tystnat".
  function renderAlerts(alerts, mon){
    const active = (alerts && alerts.active) || [];
    const hist = (alerts && alerts.history) || [];
    const monHtml = mon
      ? `<div class="al-mon al-mon--${esc(mon.state)}" title="Intradag-monitorn kontrollerar stop-loss, mål och entry-nivåer varje timme under börstid. Hjärtslaget stämplas även när inga signaler finns.">`
        + `<span class="al-dot"></span>${esc(mon.label)}`
        + `${mon.watched ? ` · ${mon.watched} bevakade` : ""}</div>`
      : "";
    if (!active.length && !hist.length) return monHtml ? `<div class="al-wrap al-wrap--calm">${monHtml}</div>` : "";
    /* En intradagsignal utlöstes av dagens extrem, inte av senastekursen. Visas
       bara senastekursen läser larmet "målkurs nådd (nivå 635) · kurs 619,7" –
       motsägelsefullt, och ett larm man slutar lita på. Därför redovisas den
       korsande kursen först och senastekursen efter. */
    const priceBit = s => {
      const cur = s.currency ? " " + s.currency : "";
      if (s.basis === "intraday" && s.hitPrice != null)
        return ` · intradag ${esc(String(s.hitPrice) + cur)}`
          + (s.price != null ? ` · senast ${esc(String(s.price))}` : "");
      return s.price != null ? ` · kurs ${esc(String(s.price) + cur)}` : "";
    };
    const items = active.map(s => {
      const cls = s.type === "KÖP" ? "al-kop" : "al-salj";
      const tm = s.marketTime ? String(s.marketTime).slice(0, 16).replace("T", " ") : "";
      return `<div class="al-item ${cls}"><span class="al-tag">${esc(s.type)}</span><b>${esc(s.ticker)}</b> — ${esc(s.reason)}`
        + `${s.level != null ? ` (nivå ${esc(String(s.level))})` : ""}${priceBit(s)}${tm ? ` · ${esc(tm)}` : ""}</div>`;
    }).join("");
    const histItems = hist.map(s => {
      const cls = s.type === "KÖP" ? "al-kop" : "al-salj";
      const exp = s.expiredAt ? ` · utgick ${esc(String(s.expiredAt).slice(0, 16).replace("T", " "))}` : "";
      return `<div class="al-item al-exp ${cls}"><span class="al-tag">${esc(s.type)}</span><b>${esc(s.ticker)}</b> — ${esc(s.reason)}`
        + `${s.level != null ? ` (nivå ${esc(String(s.level))})` : ""}${exp}</div>`;
    }).join("");
    const histHtml = hist.length
      ? `<details class="al-hist"><summary>Tidigare signaler (${hist.length})</summary>${histItems}</details>` : "";
    if (!active.length) return `<div class="al-wrap al-wrap--calm">${monHtml}${histHtml}</div>`;
    return `<div class="al-wrap"><div class="al-head">⚠ Aktiva intradag-signaler (${active.length})</div>${items}${monHtml}${histHtml}</div>`;
  }

  /* ---- ENKEL VY -----------------------------------------------------------
     Hem-vyn i klarspråk. Samma data som den detaljerade vyn, men den svarar på
     tre frågor i tur och ordning i stället för att visa allt på en gång:

       1. Behöver JAG göra något?   (systemet handlar inte själv – Dren lägger
                                     ordern, så KÖP/SÄLJ i dag = en uppgift)
       2. Hur går det?
       3. Vad hände i dag, och vad händer härnäst?

     Inga tabeller, inga förkortningar, ingen jargong. Ord som "P/L", "sleeve"
     och "entry" är medvetet utskrivna i löptext. Ren funktion: tar en färdig
     modell (byggd i app.js) och returnerar HTML – därför testbar utan DOM. */
  var SIMPLE_VERB = { "KÖP": "köpte", "SÄLJ": "sålde", "BEHÅLL": "behöll",
                      "AVVAKTA": "avvaktade", "PLAN": "planerade" };

  /* Enkla vyn skriver tal som en svensk läser dem: decimalKOMMA, en decimal.
     Resten av appen använder signPct (punkt, två decimaler) och ändras INTE –
     de vyerna står bredvid tabeller och grafer där punktnotationen är normen. */
  function plainPct(n){
    if (n == null || isNaN(n)) return "–";
    return (n > 0 ? "+" : n < 0 ? "−" : "") + Math.abs(Number(n)).toFixed(1).replace(".", ",") + " %";
  }

  function renderSimple(m){
    m = m || {};
    /* KLARSPRÅK: sleeven heter "Indexsleeve (SPY)" i portfolj.md, och det ordet
       är branschjargong. Det ENKLA lägets hela uppgift är att slippa sådant, så
       namnet skrivs om VID VISNING – portfolj.md är parsningskontrakt och får
       inte döpas om. Sleeven blev ett innehav 2026-08-03; sedan dess visade
       startvyn ordet för en läsare som inte kan det, både i innehavslistan och i
       händelseloggen. Använd den här överallt där ett innehavsnamn skrivs ut. */
    const plainName = x => String((x && (x.name || x.ticker)) || "")
      .replace(/indexsleeven?/i, "Indexfond");
    const books = m.books || [];
    const todo = (m.actions || []).filter(a => a.decision === "KÖP" || a.decision === "SÄLJ");
    const held = [];
    books.forEach(b => (b.holdings || []).forEach(h => held.push(Object.assign({ book: b.label }, h))));

    /* 1. Uppgiften. Roboten är beslutsSTÖD – den lägger inga ordrar. Står det
          KÖP eller SÄLJ i dagens rapport är det något Dren faktiskt ska göra. */
    let verdict;
    if (todo.length){
      verdict = `<div class="sv-verdict sv-verdict--act">
        <div class="sv-q">Behöver du göra något i dag?</div>
        <div class="sv-a">Ja – ${todo.length} ${todo.length === 1 ? "affär" : "affärer"} att lägga.</div>
        <ul class="sv-todo">${todo.map(a =>
          `<li><b>${esc(a.decision === "KÖP" ? "Köp" : "Sälj")} ${esc(plainName(a))}</b>${
            a.why ? ` – ${esc(truncate(a.why, 150))}` : ""}</li>`).join("")}</ul>
        <p class="sv-note">Roboten lägger inga ordrar själv. Den föreslår, du bestämmer.</p>
      </div>`;
    } else {
      verdict = `<div class="sv-verdict sv-verdict--ok">
        <div class="sv-q">Behöver du göra något i dag?</div>
        <div class="sv-a">Nej.</div>
        <p class="sv-note">${held.length
          ? "Roboten behåller allt den äger. Att inte handla är ett aktivt beslut, inte en utebliven insats."
          : "Roboten äger inget just nu och har inte hittat något värt att köpa."}</p>
      </div>`;
    }

    /* 2. Hur går det. Ett tal, en mening. */
    const acc = m.totalAccum;
    const accCls = acc == null ? "" : acc > 0 ? "pos" : acc < 0 ? "neg" : "";
    const perBook = books.filter(b => b.accum != null).map(b =>
      `<li>${esc(b.label)}: <b class="${b.accum > 0 ? "pos" : b.accum < 0 ? "neg" : ""}">${plainPct(b.accum)}</b></li>`).join("");
    const howsit = `<div class="sv-card">
      <h3>Hur går det?</h3>
      <div class="sv-big ${accCls}">${acc == null ? "–" : plainPct(acc)}</div>
      <p>${acc == null
        ? "Ingen avkastning uträknad ännu – det behövs minst en avslutad affär."
        : "Så mycket har robotens affärer gett totalt sedan starten, efter courtage."}</p>
      ${perBook ? `<ul class="sv-books">${perBook}</ul>` : ""}
    </div>`;

    /* 3. Vad roboten äger, i klarspråk. */
    const ownList = held.length
      ? `<ul class="sv-own">${held.map(h => {
          const sinceTxt = h.since ? ` <span class="sv-since">${esc(h.since)} sedan köpet</span>` : "";
          const sleeve = h.isSleeve
            ? ` <span class="sv-tag">indexfond – här parkeras pengar som inte ligger i enskilda aktier</span>` : "";
          return `<li><b>${esc(plainName(h))}</b>${sinceTxt}${sleeve}</li>`;
        }).join("")}</ul>`
      : `<p class="sv-empty">Inget innehav just nu. Pengarna står i indexfonden.</p>`;
    const owns = `<div class="sv-card"><h3>Vad roboten äger</h3>${ownList}</div>`;

    /* 4. Dagens händelser som meningar. */
    const acts = (m.actions || []);
    const happened = acts.length
      ? `<ul class="sv-log">${acts.map(a =>
          `<li>Roboten <b>${esc(SIMPLE_VERB[a.decision] || String(a.decision || "").toLowerCase())}</b> ${esc(plainName(a))}${
            a.decision === "AVVAKTA"
              /* AVVAKTA hade FÖRR bara en möjlig orsak, och därför stod den
                 hårdkodad här. Sedan köpväg (d) infördes 2026-08-04 avvisas en
                 kandidat av sex olika skäl (obekräftad katalysator · kurs ej
                 verifierbar · regimen av · binär händelse inom 2 handelsdagar ·
                 full bok · fallen grind), så den gamla meningen påstod fel
                 orsak i de flesta fall. Motiveringen finns i modellen – använd
                 den, och påstå ingenting alls när den saknas. */
              ? (a.why ? ` – ${truncate(a.why, 120)}` : " och avstod från att agera")
              : ""}.</li>`).join("")}</ul>`
      : `<p class="sv-empty">Inga beslut fattade i dag.</p>`;
    const today = `<div class="sv-card">
      <h3>Vad hände i dag${m.dateLabel ? ` <span class="sv-date">${esc(m.dateLabel)}</span>` : ""}</h3>
      ${m.blocked ? `<p class="sv-warn">Roboten kunde inte bekräfta alla kurser och avstod därför från kursbaserade beslut. Det är avsiktligt – hellre inget beslut än ett på osäkra siffror.</p>` : ""}
      ${happened}
    </div>`;

    const next = m.next
      ? `<div class="sv-next">Roboten tittar till portföljen igen <b>${esc(m.next)}</b>.</div>` : "";

    const words = `<details class="sv-words"><summary>Vad betyder orden?</summary>
      <ul>
        <li><b>Köp / Sälj / Behåll</b> – vad roboten tycker att du ska göra med en aktie i dag.</li>
        <li><b>Avvakta</b> – kursen kunde inte bekräftas mot en pålitlig källa, så roboten avstår hellre än gissar.</li>
        <li><b>Stopp</b> – kursen där en förlorande position säljs, bestämd i förväg.</li>
        <li><b>Mål</b> – kursen där vinsten tas hem.</li>
        <li><b>Indexfond</b> – pengar utan eget case parkeras i en fond som följer börsen, i stället för att ligga still.</li>
      </ul></details>`;

    return `<div class="sv">${verdict}${howsit}${owns}${today}${next}${words}</div>`;
  }

  const API = { esc, signPct, plainPct, trendClass, decClass, truncate, clamp, tickerPill, diffStrip, sparkline, pxAge, renderSimple,
    renderStatusRow, renderKPIs, renderMarket, renderHoldings, renderFeed, fillRow, renderFillsPending, renderMyStats,
    renderHistory, renderBubblare, renderOptions, renderBanner, renderPrices, renderScout,
    renderAnalysisIndex, renderTradeStats, renderAlerts, renderSearchResults, renderReportRail, renderTotal,
    renderLessons, renderMonthlyHeatmap, renderRiskStats, renderAlphaStats, renderDecisionStats,
    renderDecisionEval, renderCandidates, renderEarningsSoon };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else root.VRender = API;
})(typeof window!=="undefined"?window:this);
