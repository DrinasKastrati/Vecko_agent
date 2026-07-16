/* ============================================================
   Vecko Rotation – pure parsing functions (no DOM, no network).
   Shared verbatim between the Node test harness and index.html.
   ============================================================ */
(function (root) {
  "use strict";

  const MONTHS_SV = ["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec"];

  function escapeRe(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  // Grab a **Label:** value from markdown. Stops at newline or a pipe (|).
  function field(md, label){
    const re = new RegExp("\\*\\*\\s*" + escapeRe(label) + "\\s*:?\\s*\\*\\*\\s*([^\\n|]*)", "i");
    const m = md.match(re);
    return m ? m[1].trim() : "";
  }

  function firstNumberPct(s){
    const m = (s||"").replace(",", ".").match(/(-?\d+(?:\.\d+)?)\s*%/);
    return m ? parseFloat(m[1]) : null;
  }

  function stripMd(s){
    return (s||"")
      .replace(/~~/g,"")
      .replace(/\*\*/g,"")
      .replace(/`/g,"")
      .replace(/\s+/g," ")
      .trim();
  }

  // Parse all markdown tables in a chunk of text -> [{header:[], rows:[[]]}]
  function parseTables(md){
    const lines = md.split("\n");
    const groups = []; let cur = null;
    for (const ln of lines){
      if (/^\s*\|.*\|\s*$/.test(ln)) { (cur = cur || []).push(ln); }
      else { if (cur){ groups.push(cur); cur = null; } }
    }
    if (cur) groups.push(cur);
    return groups.map(rows => {
      const cells = rows.map(r =>
        r.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(c => c.trim())
      );
      const header = cells[0] || [];
      const body = cells.slice(1).filter(r => !r.every(c => /^:?-{2,}:?$/.test(c) || c === ""));
      return { header, rows: body };
    });
  }

  // Split a document into sections keyed by "## Heading"
  function splitSections(md){
    const parts = md.split(/\n(?=##\s)/);
    return parts.map(p => {
      const m = p.match(/^##\s+(.*)/);
      return { heading: m ? m[1].trim() : "", body: p };
    });
  }

  // ---- filename -> {type,date...} ---------------------------------------
  function parseFilename(name){
    let m;
    if ((m = name.match(/^daglig-(\d{2})(\d{2})(\d{2})(?:_(\d+))?\.md$/i)))
      return mk("daily", m);
    if ((m = name.match(/^veckorapport-(\d{2})(\d{2})(\d{2})(?:_(\d+))?\.md$/i)))
      return mk("weekly", m);
    if ((m = name.match(/^case[-_](\d{2})(\d{2})(\d{2})(?:_(\d+))?\.md$/i)))
      return mk("case", m);
    if ((m = name.match(/^rapport-(\d{2})(\d{2})(\d{2})(?:_(\d+))?\.md$/i)))
      return mk("scout", m);
    if ((m = name.match(/^analys-(.+?)-(\d{2})(\d{2})(\d{2})(?:_(\d+))?\.md$/i))){
      const r = mk("analysis", [null, m[2], m[3], m[4], m[5]]);
      r.ticker = m[1].toUpperCase();
      r.label = r.ticker + " · " + r.label;
      return r;
    }
    return null;
    function mk(type, m){
      const yy = 2000 + parseInt(m[1],10), mm = parseInt(m[2],10), dd = parseInt(m[3],10);
      const iso = `${yy}-${String(mm).padStart(2,"0")}-${String(dd).padStart(2,"0")}`;
      const sortKey = yy*10000 + mm*100 + dd + (m[4] ? parseInt(m[4],10)*0.001 : 0);
      return {
        name, type, dateISO: iso, sortKey,
        suffix: m[4] ? parseInt(m[4],10) : 0,
        label: `${dd} ${MONTHS_SV[mm-1]}` + (m[4] ? ` (${m[4]})` : "")
      };
    }
  }

  // ---- decision normalisation ------------------------------------------
  function normDecision(raw){
    const t = stripMd(raw).toUpperCase();
    if (/AVVAKTA|AVVAKTAR/.test(t)) return "AVVAKTA";
    if (/\bSÄLJ/.test(t))          return "SÄLJ";
    if (/BEHÅLL/.test(t))          return "BEHÅLL";
    if (/\bKÖP/.test(t))           return "KÖP";
    return t ? t.split(/[\s–-]/)[0] : "—";
  }

  // ---- blockquote status banner ----------------------------------------
  function extractNote(md){
    const lines = md.split("\n");
    const buf = [];
    for (const ln of lines){
      if (/^\s*>/.test(ln)) buf.push(ln.replace(/^\s*>\s?/, ""));
      else if (buf.length) break;
    }
    const text = stripMd(buf.join(" "));
    if (!text) return null;
    return { text, blocked: /BLOCKERAD|403|blockerad/i.test(text) };
  }

  // ---- portfolj.md ------------------------------------------------------
  function parsePortfolio(md){
    const out = {
      updated: field(md, "Senast uppdaterad"),
      accumText: field(md, "Ackumulerad avkastning sedan start"),
      accum: null, cash: "", holdings: [], pending: [], history: [],
      note: extractNote(md)
    };
    out.accum = firstNumberPct(out.accumText);

    const secs = splitSections(md);
    for (const s of secs){
      const h = s.heading.toLowerCase();
      if (h.startsWith("aktuellt innehav")){
        const t = parseTables(s.body)[0];
        if (t) out.holdings = t.rows
          .map(r => rowObj(t.header, r))
          .filter(o => o["Aktie"] && !/^[–\-]$/.test(o["Aktie"]));
      } else if (h.startsWith("kassa")){
        out.cash = stripMd(s.body.replace(/^##.*\n/, "")).trim();
      } else if (h.startsWith("historik")){
        const t = parseTables(s.body)[0];
        if (t) out.history = t.rows.map(r => rowObj(t.header, r))
          .filter(o => Object.values(o).some(v => v && !/^[–\-]$/.test(v)));
      }
    }
    // pending sits under a ### sub-heading; grab its table directly
    const pendIdx = md.search(/###\s+Pending/i);
    if (pendIdx >= 0){
      const t = parseTables(md.slice(pendIdx))[0];
      if (t) out.pending = t.rows.map(r => {
        const o = rowObj(t.header, r);
        o._struck = r.some(c => /~~/.test(c));
        return o;
      });
    }
    return out;
  }

  function rowObj(header, row){
    const o = {};
    header.forEach((h, i) => { o[h] = (row[i] || "").trim(); });
    return o;
  }

  // ---- daglig-*.md ------------------------------------------------------
  function parseDaily(md, meta){
    const out = {
      meta, dateISO: meta ? meta.dateISO : field(md, "Datum"),
      mode: field(md, "Läge"),
      market: field(md, "Marknadsläget i korthet"),
      portfStatus: field(md, "Portföljstatus"),
      note: extractNote(md),
      holdings: [], watch: []
    };
    for (const s of splitSections(md)){
      const H = s.heading;
      if (/^Innehav\s+\d+/i.test(H)){
        const hm = H.match(/Innehav\s+\d+:\s*(.+?)\s*\(([^/]+)\/([^)]+)\)/);
        if (!hm) continue; // e.g. "Innehav 2: —"
        const tbl = parseTables(s.body)[0];
        let priceCell="", since="", stop="", target="", decision="—";
        if (tbl && tbl.rows[0]){
          const r = tbl.rows[0];
          priceCell = stripMd(r[0]||""); since = stripMd(r[1]||"");
          stop = stripMd(r[2]||""); target = stripMd(r[3]||"");
          decision = normDecision(r[4]||"");
        }
        out.holdings.push({
          name: stripMd(hm[1]), ticker: hm[2].trim(), exchange: hm[3].trim(),
          price: priceCell, since, stop, target, decision,
          news: field(s.body, "Nyheter senaste 24h"),
          motivation: field(s.body, "Motivering")
        });
      } else if (/Bevakning inför imorgon/i.test(H)){
        out.watch = bullets(s.body);
      }
    }
    return out;
  }

  // ---- veckorapport-*.md ------------------------------------------------
  function parseWeekly(md, meta){
    const out = {
      meta, dateISO: meta ? meta.dateISO : field(md, "Datum"),
      week: field(md, "Vecka"),
      climate: field(md, "Marknadsklimat"),
      facit: { accum: null, outcome: "", lesson: "" },
      cases: [], bubblare: [], radar: []
    };
    out.facit.accum = firstNumberPct(field(md, "Ackumulerad avkastning sedan strategistart"));
    out.facit.outcome = field(md, "Veckans portföljutfall (50/50)");
    out.facit.lesson = field(md, "Lärdom");

    for (const s of splitSections(md)){
      const H = s.heading;
      if (/^Case\s+\d+/i.test(H)){
        const hm = H.match(/Case\s+\d+:\s*(.+?)\s*\(([^/]+)\/([^)]+)\)/);
        const name = hm ? stripMd(hm[1]) : stripMd(H);
        const cat = sub(s.body, "Katalysatorn");
        const tbl = parseTables(s.body).slice(-1)[0]; // handelsplan is last table
        let plan = null;
        if (tbl && tbl.rows[0]){
          const r = tbl.rows[0];
          plan = { entry: stripMd(r[0]), stop: stripMd(r[1]), target: stripMd(r[2]), rr: stripMd(r[3]) };
        }
        out.cases.push({
          name, ticker: hm ? hm[2].trim() : "", exchange: hm ? hm[3].trim() : "",
          hold: /BEHÅLL/i.test(H), rumor: /RYKTE/i.test(cat),
          catalyst: stripMd(cat), plan // full text – klampas visuellt i vrender
        });
      } else if (/^Bubblare/i.test(H)){
        out.bubblare = bullets(s.body).map(stripMd);
      } else if (/Veckans radar/i.test(H)){
        out.radar = bullets(s.body).map(b => {
          const clean = stripMd(b);
          const m = clean.match(/^(.+?)\s+[–—-]\s+([\s\S]+)$/); // split on first spaced dash
          return m ? { day: m[1].trim(), text: m[2].trim() } : { day: "", text: clean };
        });
      }
    }
    return out;
  }

  // helpers
  function sub(body, name){
    const re = new RegExp("###[^\\n]*" + escapeRe(name) + "[\\s\\S]*?(?=\\n###|$)", "i");
    const m = body.match(re);
    return m ? m[0].replace(/^###[^\n]*\n/, "").trim() : "";
  }
  function firstSentences(text, n){
    const clean = stripMd(text).replace(/\*/g,"");
    const parts = clean.split(/(?<=[.!?])\s+/);
    return parts.slice(0, n).join(" ");
  }
  function bullets(body){
    return body.split("\n")
      .map(l => l.trim())
      .filter(l => /^([*\-]|\d+\.)\s+/.test(l))
      .map(l => l.replace(/^([*\-]|\d+\.)\s+/, ""));
  }

  // ---- aggregate news / radar feed -------------------------------------
  function buildFeed(dailies, weeklies){
    const news = [];
    for (const d of dailies){
      for (const h of d.holdings){
        if (h.news && !/^inga\b/i.test(stripMd(h.news)))
          news.push({ date: d.dateISO, subject: h.name, text: stripMd(h.news) });
      }
    }
    news.sort((a,b) => (a.date < b.date ? 1 : -1));
    const latestWeekly = weeklies[0] || null;
    return {
      news,
      radar: latestWeekly ? latestWeekly.radar : [],
      catalysts: latestWeekly ? latestWeekly.cases.map(c => ({
        name: c.name, ticker: c.ticker, rumor: c.rumor, text: c.catalyst
      })) : []
    };
  }

  // ---- return series over time -----------------------------------------
  function buildReturnSeries(weeklies, portfolio){
    // ascending by date; use each weekly's accumulated return, then portfolio's latest
    const pts = [];
    const asc = [...weeklies].sort((a,b) => a.meta.sortKey - b.meta.sortKey);
    for (const w of asc){
      pts.push({ date: w.dateISO, value: w.facit.accum == null ? 0 : w.facit.accum });
    }
    if (portfolio && portfolio.accum != null){
      const last = pts[pts.length-1];
      if (!last || last.value !== portfolio.accum || asc.length === 0)
        pts.push({ date: (portfolio.updated||"").slice(0,10) || "nu", value: portfolio.accum });
    }
    // de-dup consecutive identical dates
    const seen = new Set(); const clean = [];
    for (const p of pts){ const k = p.date; if (seen.has(k)) { clean[clean.length-1]=p; } else { seen.add(k); clean.push(p);} }
    return clean;
  }

  // ---- benchmark-serie ur price_history.json (overlay i Avkastning) -----
  // history.series["^OMX"] = [["2026-07-10", 2650.1], ...] -> %-utveckling från
  // seriens första punkt. null om det inte finns minst 2 punkter.
  function buildBenchmarkSeries(history, sym){
    const arr = history && history.series && history.series[sym];
    if (!Array.isArray(arr) || arr.length < 2) return null;
    const base = Number(arr[0] && arr[0][1]);
    if (!base || isNaN(base)) return null;
    return arr
      .filter(p => p && p[0] != null && !isNaN(Number(p[1])))
      .map(p => ({ date: String(p[0]), value: Math.round((Number(p[1]) / base - 1) * 10000) / 100 }));
  }

  // Mappa en {date,value}-serie på en gemensam label-axel med carry-forward
  // (senast kända värde behålls tills ett nytt kommer; null före första punkten).
  function seriesOnLabels(labels, series){
    const map = new Map((series || []).map(p => [p.date, p.value]));
    let last = null; const out = [];
    for (const d of labels){ if (map.has(d)) last = map.get(d); out.push(last); }
    return out;
  }

  // ---- live-P/L för innehav (portfolj.md-rad + prices.json-quote) --------
  function numFrom(s){
    const m = String(s == null ? "" : s).replace(/\s/g, "").replace(",", ".").match(/-?\d+(?:\.\d+)?/);
    return m ? parseFloat(m[0]) : null;
  }
  // Positionsmätare: var ligger nu/entry på skalan stopp→mål (0–100 %)?
  function computeGauge(entry, stop, target, price){
    if ([entry, stop, target, price].some(v => v == null || isNaN(v))) return null;
    const span = target - stop;
    if (!(span > 0) || !(entry > stop) || !(entry < target)) return null;
    const pct = v => Math.max(0, Math.min(100, ((v - stop) / span) * 100));
    return { nowPct: Math.round(pct(price) * 10) / 10, entryPct: Math.round(pct(entry) * 10) / 10 };
  }
  function computeHoldingLive(row, quotes){
    if (!row || !quotes) return null;
    const ticker = String(row["Yahoo-ticker"] || "").trim().toUpperCase();
    const q = ticker && quotes[ticker];
    if (!q || q.error || q.price == null) return null;
    const entry = numFrom(row["Entry"]), stop = numFrom(row["Stop-loss"]), target = numFrom(row["Målkurs"]);
    return {
      ticker, price: q.price, currency: q.currency || "", marketTime: q.marketTime || null,
      entryNum: entry, stopNum: stop, targetNum: target,
      gauge: computeGauge(entry, stop, target, q.price),
      pnlPct:      entry  ? (q.price / entry - 1) * 100 : null,
      toStopPct:   stop   ? (stop / q.price - 1) * 100 : null,   // negativ = utrymme ned till stoppen
      toTargetPct: target ? (target / q.price - 1) * 100 : null  // positiv = kvar upp till målet
    };
  }

  // ---- besluts-historik per ticker ur dagliga rapporter -------------------
  // dailies antas nyast-först (som i dashboardens state); returnerar äldst→nyast.
  function buildDecisionHistory(dailies, ticker){
    const t = String(ticker || "").trim().toUpperCase();
    const out = [];
    for (const d of (dailies || [])){
      const h = (d && d.holdings || []).find(x => String(x.ticker || "").trim().toUpperCase() === t);
      if (h) out.push({ date: d.dateISO, decision: h.decision });
    }
    return out.reverse();
  }

  // ---- nästa schemalagda routine-körning ----------------------------------
  // OBS: hårdkodat spegelvärde av Cowork-schemat (scout dagligen 07:47,
  // rotation mån–fre 08:40, lokal tid) – uppdatera här om tasken ändras.
  function nextRoutineRun(now){
    const n = now instanceof Date ? now : new Date(now || Date.now());
    const cands = [];
    for (let d = 0; d < 8; d++){
      const day = new Date(n.getFullYear(), n.getMonth(), n.getDate() + d);
      const dow = day.getDay(); // 0 = söndag
      const add = (h, m, label) => {
        const t = new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, m);
        if (t > n) cands.push({ t, label });
      };
      add(7, 47, "scout");
      if (dow >= 1 && dow <= 5) add(8, 40, "rotation");
    }
    if (!cands.length) return null;
    cands.sort((a, b) => a.t - b.t);
    const c = cands[0];
    const mins = Math.round((c.t - n) / 60000);
    const rel = mins < 60 ? "om " + mins + " min"
              : mins < 2880 ? "om " + Math.round(mins / 60) + " tim"
              : "om " + Math.round(mins / 1440) + " dygn";
    const days = ["sön","mån","tis","ons","tor","fre","lör"];
    const when = days[c.t.getDay()] + " " + String(c.t.getHours()).padStart(2, "0") + ":" + String(c.t.getMinutes()).padStart(2, "0");
    return { label: c.label, when, rel, minutes: mins };
  }

  // ---- scout: rapport-*.md (USA & krypto) -------------------------------
  function scoutField(block, labels){
    for (const label of labels){
      const re = new RegExp("\\*\\*\\s*" + escapeRe(label) + "\\s*:?\\s*\\*\\*\\s*([\\s\\S]*?)(?=\\n\\s*\\*\\*|\\n##|$)", "i");
      const m = block.match(re);
      if (m && m[1].trim()) return m[1].trim();
    }
    return "";
  }
  function parseScoutCases(md){
    const cases = [];
    const re = /###\s*Case\s*\d*\s*:?\s*([^\n(]+?)\s*\(\s*([^/)]+?)\s*\/\s*([^)]+?)\)\s*([\s\S]*?)(?=\n###\s|\n##\s|$)/gi;
    let m;
    while ((m = re.exec(md))){
      const block = m[4] || "";
      cases.push({
        name: m[1].trim(), ticker: m[2].trim(), exchange: m[3].trim(),
        catalyst: scoutField(block, ["Katalysator"]),
        bull: scoutField(block, ["Bull case", "Bull"]),
        bear: scoutField(block, ["Bear case", "Bear"]),
        setup: scoutField(block, ["Setup", "Finansiell & Teknisk Setup"])
      });
    }
    return cases;
  }
  function parseScout(md, meta){
    const sectionBody = b => (b || "").replace(/^\s*##[^\n]*\n?/, "").trim();
    const out = {
      meta, dateISO: meta ? meta.dateISO : field(md, "Datum"),
      climate: field(md, "Marknadsklimat"),
      recap: "", econ: "", events: "", macro: "", followup: "", cases: [],
      note: extractNote(md)
    };
    for (const s of splitSections(md)){
      const h = s.heading.toLowerCase();
      if (h.startsWith("marknadsöversikt")) out.recap = sectionBody(s.body);
      else if (h.startsWith("ekonomiska siffror")) out.econ = sectionBody(s.body);
      else if (h.startsWith("aktuella händelser")) out.events = sectionBody(s.body);
      else if (h.startsWith("uppföljning")) out.followup = sectionBody(s.body);
      else if (h.startsWith("makro")) out.macro = sectionBody(s.body);
      else if (h.startsWith("dagens case") || h === "case") out.cases = parseScoutCases(s.body);
    }
    if (!out.cases.length) out.cases = parseScoutCases(md);
    return out;
  }

  // ---- dagsdiff: vad ändrades sedan gårdagens rapport? -------------------
  // Jämför senaste två dagliga rapporterna per ticker. Returnerar
  // { TICKER: { isNew, changes: [{field, from, to, up?}] } } – bara ändrade.
  function diffDailies(today, yesterday){
    const out = {};
    if (!today || !yesterday) return out;
    const prev = {};
    (yesterday.holdings || []).forEach(h => {
      const t = String(h.ticker || "").trim().toUpperCase();
      if (t) prev[t] = h;
    });
    (today.holdings || []).forEach(h => {
      const t = String(h.ticker || "").trim().toUpperCase();
      if (!t) return;
      const p = prev[t];
      if (!p) { out[t] = { isNew: true, changes: [] }; return; }
      const changes = [];
      if (p.decision !== h.decision && h.decision)
        changes.push({ field: "beslut", from: p.decision, to: h.decision });
      for (const [label, key] of [["stopp", "stop"], ["mål", "target"]]){
        const a = numFrom(p[key]), b = numFrom(h[key]);
        if (a != null && b != null && a !== b)
          changes.push({ field: label, from: a, to: b, up: b > a });
      }
      if (changes.length) out[t] = { isNew: false, changes };
    });
    return out;
  }

  // ---- trade-statistik (från Historik) ----------------------------------
  function computeTradeStats(history){
    const rows = (history || []).filter(o => o && o["Aktie"] && !/^[–\-]$/.test(String(o["Aktie"]).trim()));
    const out = { trades:0, wins:0, losses:0, winRate:null, avgWin:null, avgLoss:null,
      profitFactor:null, best:null, worst:null, avgHoldDays:null,
      byReason:{ target:0, stop:0, rotation:0, other:0 }, chainedPct:null, sumPct:null };
    if (!rows.length) return out;
    const pcts = [], holds = [];
    let sumWin = 0, sumLoss = 0, chain = 1;
    for (const o of rows){
      const reasonKey = Object.keys(o).find(k => /sk[aä]l/i.test(k));
      const reason = String((reasonKey && o[reasonKey]) || "").toLowerCase();
      if (/m[aå]l/.test(reason)) out.byReason.target++;
      else if (/stop/.test(reason)) out.byReason.stop++;
      else if (/rotation/.test(reason)) out.byReason.rotation++;
      else out.byReason.other++;
      const p = firstNumberPct(o["Utfall %"] || o["Utfall"] || "");
      if (p != null){
        out.trades++; pcts.push(p);
        if (p > 0){ out.wins++; sumWin += p; } else if (p < 0){ out.losses++; sumLoss += p; }
        chain *= (1 + 0.5 * p / 100);
      }
      const d1 = Date.parse(String(o["Entry-datum"] || "").slice(0, 10));
      const d2 = Date.parse(String(o["Stängd"] || "").slice(0, 10));
      if (!isNaN(d1) && !isNaN(d2) && d2 >= d1) holds.push((d2 - d1) / 86400000);
    }
    if (!out.trades) return out;
    out.winRate = out.wins / out.trades;
    out.avgWin = out.wins ? sumWin / out.wins : null;
    out.avgLoss = out.losses ? sumLoss / out.losses : null;
    out.profitFactor = sumLoss !== 0 ? Math.abs(sumWin / sumLoss) : (sumWin > 0 ? Infinity : null);
    out.best = Math.max.apply(null, pcts); out.worst = Math.min.apply(null, pcts);
    out.sumPct = pcts.reduce((a, b) => a + b, 0);
    out.chainedPct = (chain - 1) * 100;
    if (holds.length) out.avgHoldDays = holds.reduce((a, b) => a + b, 0) / holds.length;
    return out;
  }

  const API = {
    field, firstNumberPct, stripMd, parseTables, splitSections, parseFilename,
    normDecision, extractNote, parsePortfolio, parseDaily, parseWeekly, parseScout,
    computeTradeStats, buildFeed, buildReturnSeries,
    buildBenchmarkSeries, seriesOnLabels, numFrom, computeHoldingLive,
    computeGauge, buildDecisionHistory, nextRoutineRun, diffDailies
  };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else root.VParse = API;
})(typeof window!=="undefined"?window:this);
