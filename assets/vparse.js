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

  /* ---- rapportens innehållsförteckning -------------------------------------
     Rapporterna är långa och rullas i en box; utan innehållsförteckning är enda
     sättet att hitta ett avsnitt att skrolla. Rubrikerna plockas ur MARKDOWN:en
     (inte ur den renderade HTML:en) så samma funktion kan testas utan DOM.
     `slugify` måste ge samma id här som app.js sätter på rubrikelementen –
     ändras den ena måste den andra följa med. */
  function slugify(s){
    return stripMd(s).toLowerCase()
      .replace(/[^\wåäöéèüæø\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "avsnitt";
  }

  function reportOutline(md){
    const out = [];
    const seen = Object.create(null);
    const lines = String(md || "").split(/\r?\n/);
    let fence = false;
    for (const line of lines){
      if (/^\s*(```|~~~)/.test(line)) { fence = !fence; continue; }   // hoppa kodblock
      if (fence) continue;
      const m = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
      if (!m) continue;
      const text = stripMd(m[2]);
      if (!text) continue;
      let id = slugify(text);
      if (seen[id] != null) { seen[id]++; id = id + "-" + seen[id]; } else seen[id] = 0;
      out.push({ level: m[1].length, text, id });
    }
    return out;
  }

  /* Kort faktasammanfattning av EN rapport, byggd ur markdown:en med samma
     parsers som vyerna använder. Ingen språkmodell inblandad – bara de fält
     rapportmallarna redan garanterar. */
  /* Fälten skiljer sig per rapporttyp – dagliga har beslut per innehav, vecko-
     och scoutrapporter har case utan beslut. Därför en gren per typ i stället
     för ett gemensamt antagande som tyst ger tomma kort. */
  function reportDigest(md, meta){
    const type = (meta && meta.type) || "";
    const facts = [];
    const push = (k, v) => { const t = stripMd(v); if (t) facts.push({ k, v: t }); };
    let items = [], watch = [];
    try {
      if (type === "daily" || type === "us_daily"){
        const d = parseDaily(md, meta || {});
        push("Läge", d.mode);
        push("Marknad", d.market);
        push("Portfölj", d.portfStatus);
        items = (d.holdings || []).map(h =>
          ({ name: h.name || h.ticker || "", decision: h.decision || "", ticker: h.ticker || "" }));
        watch = (d.watch || []).map(stripMd);
      } else if (type === "weekly" || type === "us_weekly"){
        const w = parseWeekly(md, meta || {});
        push("Vecka", w.week);
        push("Marknadsklimat", w.climate);
        items = (w.cases || []).map(c =>
          ({ name: c.name || c.ticker || "", decision: "", ticker: c.ticker || "" }));
        if ((w.bubblare || []).length) push("Bubblare", w.bubblare.length + " st");
        watch = (w.radar || []).map(r => stripMd((r.day ? r.day + ": " : "") + (r.text || "")));
      } else if (type === "scout"){
        const s = parseScout(md, meta || {});
        push("Marknadsklimat", s.climate);
        items = (s.cases || []).map(c =>
          ({ name: c.name || c.ticker || "", decision: "", ticker: c.ticker || "" }));
        watch = (s.events || []).map(stripMd);
      }
    } catch (e) { /* en avvikande rapport ska inte släcka hela vyn */ }
    return {
      type,
      facts,
      items: items.filter(x => x.name),
      watch: (watch || []).filter(Boolean).slice(0, 5)
    };
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
    if ((m = name.match(/^retro-(\d{2})(\d{2})(\d{2})(?:_(\d+))?\.md$/i)))
      return mk("retro", m);
    if ((m = name.match(/^us-daglig-(\d{2})(\d{2})(\d{2})(?:_(\d+))?\.md$/i)))
      return mk("us_daily", m);
    if ((m = name.match(/^us-veckorapport-(\d{2})(\d{2})(\d{2})(?:_(\d+))?\.md$/i)))
      return mk("us_weekly", m);
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
      }).filter(o => o["Aktie"] && !/^[–\-]$/.test(String(o["Aktie"]).trim()));
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
    // Mallen skriver "(viktat)" sedan 4 positioner infördes; äldre rapporter har "(50/50)".
    out.facit.outcome = field(md, "Veckans portföljutfall (viktat)")
      || field(md, "Veckans portföljutfall (50/50)");
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

  // ---- benchmark över EN affärs hållperiod (alpha) -----------------------
  // Senast kända stängning på eller före `date` i price_history.series[sym].
  // Carry-forward eftersom entry-/exitdatum kan falla på en helg eller helgdag.
  function closeOnOrBefore(series, date){
    if (!Array.isArray(series) || !date) return null;
    let best = null;
    for (const p of series){
      if (!p || p[0] == null || isNaN(Number(p[1]))) continue;
      const d = String(p[0]);
      if (d <= date && (!best || d > best[0])) best = [d, Number(p[1])];
    }
    return best ? best[1] : null;
  }

  // Benchmarkets avkastning i procent mellan två datum. null om historiken
  // inte täcker perioden – då redovisas alpha som okänt i stället för noll.
  function benchReturnPct(priceHistory, sym, fromDate, toDate){
    const series = priceHistory && priceHistory.series && priceHistory.series[sym];
    if (!Array.isArray(series) || !series.length) return null;
    const first = String(series[0][0] || "");
    if (!fromDate || !toDate || fromDate < first) return null;  // före historikens start
    const a = closeOnOrBefore(series, fromDate), b = closeOnOrBefore(series, toDate);
    if (a == null || b == null || !a) return null;
    return (b / a - 1) * 100;
  }

  // Alpha per stängd affär: utfall − benchmark över SAMMA hållperiod.
  // Returnerar { ALPHA_KEY: {benchPct, alphaPct} } nycklat på "entry|stängd|aktie".
  function alphaKey(o){
    return [String(o["Entry-datum"] || "").slice(0, 10), String(o["Stängd"] || "").slice(0, 10),
            stripMd(o["Aktie"] || "")].join("|");
  }
  /* `benchSym` får vara en TICKER eller en FUNKTION (rad) => ticker. Funktionen
     behövs för den gemensamma vyn: där mäts varje affär mot SITT eget index
     (nordiska mot ^OMX, amerikanska mot ^GSPC). Just därför är ett gemensamt
     alpha meningsfullt även om en gemensam avkastning inte är det – alpha är
     redan differensen mot rätt jämförelse innan de vägs samman. */
  function computeAlpha(history, priceHistory, benchSym){
    const out = {};
    const symOf = typeof benchSym === "function" ? benchSym : (() => benchSym);
    for (const o of history || []){
      if (!o || !o["Aktie"] || /^[–\-]$/.test(String(o["Aktie"]).trim())) continue;
      const pct = firstNumberPct(o["Utfall %"] || o["Utfall"] || "");
      const from = String(o["Entry-datum"] || "").slice(0, 10);
      const to = String(o["Stängd"] || "").slice(0, 10);
      const bench = benchReturnPct(priceHistory, symOf(o), from, to);
      out[alphaKey(o)] = {
        benchPct: bench,
        alphaPct: (pct != null && bench != null) ? pct - bench : null
      };
    }
    return out;
  }

  // Aggregerat: hur många affärer slog sitt benchmark, och snitt-alpha.
  function computeAlphaStats(history, priceHistory, benchSym){
    const map = computeAlpha(history, priceHistory, benchSym);
    const vals = Object.values(map).map(v => v.alphaPct).filter(v => v != null);
    if (!vals.length) return { trades: 0, beat: 0, beatRate: null, avgAlphaPct: null, sumAlphaPct: null };
    const beat = vals.filter(v => v > 0).length;
    const sum = vals.reduce((a, b) => a + b, 0);
    return { trades: vals.length, beat, beatRate: beat / vals.length,
             avgAlphaPct: sum / vals.length, sumAlphaPct: sum };
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
  // nordisk rotation mån–fre 08:40, US-rotation mån–fre 15:00, lokal tid) – uppdatera här om tasken ändras.
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
      // Schemat speglar Drens routines. Ordningen är styrd av vilka Actions som
      // måste ha skrivit sin fil först (kurser 05/06 UTC, nyheter från 05:17 UTC).
      add(7, 47, "scout");
      if (dow >= 1 && dow <= 5) add(8, 40, "rotation");      // efter kurshämtning, före Stockholm 09:00
      if (dow >= 1 && dow <= 5) add(15, 0, "us-rotation");   // före US-öppning 15:30 (CEST)
      if (dow === 1) add(15, 30, "allokering");              // måndag, efter BÅDA veckorotationerna
      if (dow === 6) add(10, 0, "retro");                    // lördag: fredagens US-stängning (21:10 UTC) finns i price_history
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

  // ---- fulltextsökning över rapporter --------------------------------------
  // docs = [{ meta, text }]. Returnerar träffar (nyast först) med max 3 snippets.
  function searchDocs(docs, query){
    const q = String(query || "").trim().toLowerCase();
    if (q.length < 2) return [];
    const out = [];
    for (const d of (docs || [])){
      if (!d || !d.text || !d.meta) continue;
      const lines = d.text.split("\n");
      let count = 0;
      const snippets = [];
      for (const ln of lines){
        if (ln.toLowerCase().includes(q)){
          count++;
          if (snippets.length < 3) snippets.push(stripMd(ln).slice(0, 220));
        }
      }
      if (count) out.push({ meta: d.meta, count, snippets });
    }
    out.sort((a, b) => b.meta.sortKey - a.meta.sortKey);
    return out;
  }

  // ---- blended avkastning över böckerna (Total-vyn) ----------------------
  // Viktar varje boks ackumulerade avkastning med kapitalfördelningen. Rena
  // procenttal ⇒ ingen FX behövs. splitNordic = andel (0–1) i nordiska boken.
  function combinedReturn(nordicPortfolio, usPortfolio, splitNordic){
    const wN = (splitNordic == null ? 0.5 : splitNordic), wU = 1 - wN;
    const n = nordicPortfolio && nordicPortfolio.accum != null ? nordicPortfolio.accum : null;
    const u = usPortfolio && usPortfolio.accum != null ? usPortfolio.accum : null;
    if (n == null && u == null) return null;
    return (n == null ? 0 : n) * wN + (u == null ? 0 : u) * wU;
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

  // Positionsvikt ur en historik-/innehavsrad ("Vikt": "50 %"). Default 0,5
  // (bakåtkompatibelt: gamla rader utan Vikt-kolumn räknas som 50/50).
  function weightFrac(o){
    const key = Object.keys(o || {}).find(k => /vikt/i.test(k));
    const w = key ? firstNumberPct(o[key]) : null;
    return (w != null && w > 0 && w <= 100) ? w / 100 : 0.5;
  }

  // ---- lessons.md (miss-retrons lärdomar) --------------------------------
  // Läser "## Aktiva lärdomar" + "## Arkiv"-tabellerna. Radobjekt per kolumnnamn.
  function parseLessons(md){
    const out = { active: [], archived: [] };
    if (!md) return out;
    for (const s of splitSections(md)){
      const h = s.heading.toLowerCase();
      const t = parseTables(s.body)[0];
      if (!t) continue;
      const rows = t.rows.map(r => rowObj(t.header, r))
        .filter(o => Object.values(o).some(v => v && !/^[–\-]$/.test(v)));
      if (h.startsWith("aktiva")) out.active = rows;
      else if (h.startsWith("arkiv")) out.archived = rows;
    }
    return out;
  }

  // ---- transaktionskostnader ---------------------------------------------
  // Rundturskostnad (courtage + spread, samt växlingspåslag för us-boken) i
  // procent av positionens värde. Läses ur config/kostnader.json; fallback här
  // gör att alla funktioner fungerar även om filen saknas.
  const DEFAULT_COSTS = { nordic: { roundTripPct: 0.25 },
                          us: { roundTripPct: 0.25, fxSpreadPct: 0.5 } };

  function costFor(book, costs){
    const c = (costs || DEFAULT_COSTS)[book === "us" ? "us" : "nordic"] ||
              DEFAULT_COSTS[book === "us" ? "us" : "nordic"];
    const rt = Number(c.roundTripPct) || 0;
    const fx = Number(c.fxSpreadPct) || 0;
    return rt + fx;
  }

  // Bruttoutfall i procent -> nettoutfall efter rundturskostnad.
  // Kostnaden tas på hela positionen, alltså INNAN vikten appliceras.
  function netPct(grossPct, costPct){
    if (grossPct == null || isNaN(grossPct)) return null;
    return grossPct - (Number(costPct) || 0);
  }

  // ---- equity-serie per affär (kedjad, viktad) ---------------------------
  // En punkt per STÄNGD position (kronologiskt på "Stängd"-datum): kumulativ
  // avkastning kedjad med per-affär-vikt. Ger tätare kurva än veckopunkterna.
  // costPct (valfri) dras från varje affärs bruttoutfall -> nettokurva.
  function buildTradeSeries(history, costPct){
    const rows = (history || []).filter(o => o && o["Aktie"] && !/^[–\-]$/.test(String(o["Aktie"]).trim()));
    const dated = rows
      .map(o => ({ o, d: String(o["Stängd"] || "").slice(0, 10) }))
      .filter(x => /^\d{4}-\d{2}-\d{2}$/.test(x.d))
      .sort((a, b) => (a.d < b.d ? -1 : a.d > b.d ? 1 : 0));
    let chain = 1; const pts = [];
    for (const { o, d } of dated){
      const gross = firstNumberPct(o["Utfall %"] || o["Utfall"] || "");
      if (gross == null) continue;
      const p = netPct(gross, costPct);
      chain *= (1 + weightFrac(o) * p / 100);
      pts.push({ date: d, value: Math.round((chain - 1) * 10000) / 100, name: stripMd(o["Aktie"]), pct: p, grossPct: gross });
    }
    return pts;
  }

  // ---- månadsutfall (heatmap i Avkastning) -------------------------------
  // Grupperar stängda affärer per "Stängd"-månad; kedjar viktade utfall inom
  // månaden. Returnerar äldst→nyast: [{month:"2026-07", pct, trades, wins}].
  function buildMonthlyStats(history){
    const rows = (history || []).filter(o => o && o["Aktie"] && !/^[–\-]$/.test(String(o["Aktie"]).trim()));
    const map = new Map();
    for (const o of rows){
      const mo = String(o["Stängd"] || "").slice(0, 7);
      if (!/^\d{4}-\d{2}$/.test(mo)) continue;
      const p = firstNumberPct(o["Utfall %"] || o["Utfall"] || "");
      if (p == null) continue;
      const m = map.get(mo) || { month: mo, chain: 1, trades: 0, wins: 0 };
      m.chain *= (1 + weightFrac(o) * p / 100);
      m.trades++; if (p > 0) m.wins++;
      map.set(mo, m);
    }
    return [...map.values()]
      .sort((a, b) => (a.month < b.month ? -1 : 1))
      .map(m => ({ month: m.month, pct: Math.round((m.chain - 1) * 10000) / 100, trades: m.trades, wins: m.wins }));
  }

  // ---- riskmått (från Historik + equity-serien) --------------------------
  // Max drawdown mäts på den kedjade equity-kurvan (per-affär-vikt, samma som
  // buildTradeSeries). Volatilitet = populations-stddev av per-affär-utfall
  // (rådata, oviktat). Payoff = snittvinst / |snittförlust|.
  function computeRiskStats(history){
    const pts = buildTradeSeries(history);
    const out = { trades: pts.length, maxDrawdownPct: null, lossStreak: 0, winStreak: 0,
      stdevPct: null, payoff: null };
    if (!pts.length) return out;
    let peak = 1, maxDd = 0;
    for (const p of pts){
      const eq = 1 + p.value / 100;
      if (eq > peak) peak = eq;
      const dd = 1 - eq / peak;
      if (dd > maxDd) maxDd = dd;
    }
    out.maxDrawdownPct = Math.round(maxDd * 10000) / 100;
    let ls = 0, ws = 0;
    const wins = [], losses = [], all = [];
    for (const p of pts){
      all.push(p.pct);
      if (p.pct > 0){ wins.push(p.pct); ws++; ls = 0; }
      else if (p.pct < 0){ losses.push(p.pct); ls++; ws = 0; }
      else { ls = 0; ws = 0; }
      if (ls > out.lossStreak) out.lossStreak = ls;
      if (ws > out.winStreak) out.winStreak = ws;
    }
    const mean = all.reduce((a, b) => a + b, 0) / all.length;
    out.stdevPct = Math.round(Math.sqrt(all.reduce((a, b) => a + (b - mean) * (b - mean), 0) / all.length) * 100) / 100;
    if (wins.length && losses.length){
      const aw = wins.reduce((a, b) => a + b, 0) / wins.length;
      const al = losses.reduce((a, b) => a + b, 0) / losses.length;
      out.payoff = Math.round((aw / Math.abs(al)) * 100) / 100;
    }
    return out;
  }

  // ---- trade-statistik (från Historik) ----------------------------------
  // costPct (valfri): rundturskostnad i procent per affär. Anges den redovisas
  // även netto-varianterna – bruttotalen lämnas orörda så jämförelser bakåt håller.
  /* `costPct` får vara ett TAL (samma kostnad för alla affärer) eller en
     FUNKTION (rad) => kostnad. Funktionsformen behövs för den gemensamma vyn,
     där nordiska affärer bär ~0,25 % rundtur och amerikanska ~0,75 % inklusive
     växlingspåslag – att applicera ett snitt hade gjort nettotalen fel åt båda
     håll. Vid funktion rapporteras `costPct: null` (ingen enskild siffra gäller). */
  function computeTradeStats(history, costPct){
    const rows = (history || []).filter(o => o && o["Aktie"] && !/^[–\-]$/.test(String(o["Aktie"]).trim()));
    const perRow = typeof costPct === "function";
    const costOf = perRow ? (o => Number(costPct(o)) || 0) : (() => Number(costPct) || 0);
    const cost = perRow ? null : (Number(costPct) || 0);
    const out = { trades:0, wins:0, losses:0, winRate:null, avgWin:null, avgLoss:null,
      profitFactor:null, best:null, worst:null, avgHoldDays:null,
      byReason:{ target:0, stop:0, rotation:0, other:0 }, chainedPct:null, sumPct:null,
      costPct: cost, netChainedPct: null, netWinRate: null, netProfitFactor: null, costDragPct: null };
    if (!rows.length) return out;
    const pcts = [], holds = [];
    let sumWin = 0, sumLoss = 0, chain = 1;
    let netChain = 1, netWins = 0, netSumWin = 0, netSumLoss = 0;
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
        chain *= (1 + weightFrac(o) * p / 100); // per-affär vikt (default 50 %)
        const np = netPct(p, costOf(o));
        netChain *= (1 + weightFrac(o) * np / 100);
        if (np > 0){ netWins++; netSumWin += np; } else if (np < 0){ netSumLoss += np; }
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
    out.netChainedPct = (netChain - 1) * 100;
    out.costDragPct = out.chainedPct - out.netChainedPct;
    out.netWinRate = netWins / out.trades;
    out.netProfitFactor = netSumLoss !== 0 ? Math.abs(netSumWin / netSumLoss) : (netSumWin > 0 ? Infinity : null);
    if (holds.length) out.avgHoldDays = holds.reduce((a, b) => a + b, 0) / holds.length;
    return out;
  }

  // ---- beslutsloggen (state/decisions.json) ------------------------------
  // Loggen är kalibreringsunderlaget: den ska svara på vilka KATALYSATORTYPER
  // som faktiskt tjänar pengar, så att poängvikterna (35/30/15/20) kan sättas
  // mot data i stället för känsla. Problemet den löser är att underlaget dör
  // tyst – 2026-08-02 innehöll filen 6 rader, samtliga backfyllda, trots två
  // veckors körningar. Genom att visa loggen i dashboarden syns det direkt.
  function parseDecisions(db){
    const rows = (db && db.decisions) || [];
    return rows.filter(r => r && r.ticker && r.action).map(r => ({
      date: r.date || null,
      book: r.book || null,
      ticker: r.ticker,
      action: String(r.action).toUpperCase(),
      catalystType: r.catalystType || "other",
      outcomePct: typeof r.outcomePct === "number" ? r.outcomePct : null,
      alphaPct: typeof r.alphaPct === "number" ? r.alphaPct : null,
      holdDays: typeof r.holdDays === "number" ? r.holdDays : null,
      source: r.source || null
    }));
  }

  // Aggregerar SÄLJ-raderna per katalysatortyp. Sleeve-transaktioner
  // (catalystType "index") räknas ALDRIG med – de mäter marknaden, inte urvalet.
  // minPerType/minTotal speglar retrons trösklar: under dem är siffrorna brus
  // och ska presenteras som brus, inte som resultat.
  function decisionStats(db, opts){
    const { minTotal = 15, minPerType = 8 } = opts || {};
    const rows = parseDecisions(db);
    const closed = rows.filter(r => r.action === "SÄLJ" && r.outcomePct != null && r.catalystType !== "index");
    const by = {};
    for (const r of closed){
      const k = r.catalystType || "other";
      (by[k] = by[k] || []).push(r);
    }
    const byCatalyst = Object.entries(by).map(([type, rs]) => {
      const wins = rs.filter(r => r.outcomePct > 0).length;
      const sum = rs.reduce((a, r) => a + r.outcomePct, 0);
      const alphas = rs.filter(r => r.alphaPct != null);
      return {
        type, n: rs.length,
        winRate: rs.length ? wins / rs.length : null,
        avgPct: rs.length ? sum / rs.length : null,
        sumPct: sum,
        avgAlphaPct: alphas.length ? alphas.reduce((a, r) => a + r.alphaPct, 0) / alphas.length : null,
        // Under tröskeln är kategorin inte utvärderingsbar – flaggas explicit.
        reliable: rs.length >= minPerType
      };
    }).sort((a, b) => b.n - a.n);
    const books = {};
    for (const r of rows) books[r.book || "okänd"] = (books[r.book || "okänd"] || 0) + 1;
    const dates = rows.map(r => r.date).filter(Boolean).sort();
    return {
      rows: rows.length,
      closedCount: closed.length,
      minTotal, minPerType,
      needed: Math.max(0, minTotal - closed.length),
      calibratable: closed.length >= minTotal,
      backfilled: rows.filter(r => r.source && /backfill/i.test(r.source)).length,
      firstDate: dates[0] || null,
      lastDate: dates[dates.length - 1] || null,
      byBook: books,
      byCatalyst
    };
  }

  // ---- tickerns ROLL (Kurser-vyn) ----------------------------------------
  // Kurser-vyn visade 38 identiska kort: ett innehav såg likadant ut som ett
  // index, ett valutapar eller en ticker som bara låg kvar i watchlisten. Den
  // vanligaste frågan – "vilka aktier bevakar den egentligen?" – gick alltså
  // inte att besvara ur gränssnittet. Funktionen klassificerar varje ticker
  // efter den roll den FAKTISKT har, i prioritetsordning: ett innehav som
  // också står i watchlisten är ett innehav.
  const SLEEVE_TICKERS = ["XACT-OMXS30.ST", "SPY"];
  const ROLE_ORDER = ["innehav", "plan", "bubblare", "sleeve", "index", "valuta", "bevakad"];
  const ROLE_LABEL = {
    innehav: "Innehav", plan: "Plan", bubblare: "Bubblare", sleeve: "Indexdel",
    index: "Index", valuta: "Valuta", bevakad: "Bevakad"
  };

  // Tickers ur en watchlist-fil (kommentarer och tomrader bort).
  function parseWatchlist(txt){
    return String(txt || "").split(/\r?\n/).map(l => l.trim())
      .filter(l => l && !l.startsWith("#")).map(l => l.toUpperCase());
  }

  // Bubblarlistan i veckorapporten är fritext ("Hansa Biopharma (HNSA.ST) – …"),
  // inte tabellrader, så tickern måste plockas ur texten. Nordiska känns igen på
  // börssuffixet; amerikanska bara när de står inom parentes, annars skulle
  // versaler mitt i en mening (VD, USA, AI) tolkas som tickers.
  function tickersInText(s){
    const t = String(s || ""), out = [];
    const nordic = /\b[A-Z][A-Z0-9]{0,5}(?:-[A-Z0-9]{1,4})?\.(?:ST|OL|CO|HE)\b/g;
    let m;
    while ((m = nordic.exec(t))) out.push(m[0]);
    const paren = /\(([A-Z]{1,5})(?:\s*[/|]|\))/g;
    while ((m = paren.exec(t))) out.push(m[1]);
    return [...new Set(out)];
  }

  function tickerRoles(o){
    o = o || {};
    const out = {};
    const set = (t, role, book) => {
      const k = String(t || "").trim().toUpperCase();
      if (!k) return;
      const prev = out[k];
      // Lägre index i ROLE_ORDER vinner – en ticker byter aldrig ned sig.
      if (prev && ROLE_ORDER.indexOf(prev.role) <= ROLE_ORDER.indexOf(role)) return;
      out[k] = { role, label: ROLE_LABEL[role], book: book || (prev && prev.book) || null };
    };
    const rowsOf = (p, key) => (p && Array.isArray(p[key])) ? p[key] : [];
    const tickerOf = r => r && (r.ticker || r.Ticker || r["Yahoo-ticker"] || "");

    for (const [p, book] of [[o.portfolio, "nordic"], [o.portfolioUs, "us"]]){
      for (const h of rowsOf(p, "holdings")) set(tickerOf(h), "innehav", book);
      for (const h of rowsOf(p, "pending")) set(tickerOf(h), "plan", book);
    }
    for (const [w, book] of [[o.weekly, "nordic"], [o.usWeekly, "us"]])
      for (const b of rowsOf(w, "bubblare")){
        if (typeof b === "string") for (const t of tickersInText(b)) set(t, "bubblare", book);
        else set(tickerOf(b), "bubblare", book);
      }
    for (const [txt, book] of [[o.watchlist, "nordic"], [o.watchlistUs, "us"]])
      for (const t of parseWatchlist(txt)) set(t, "bevakad", book);

    // Mönsterbaserade roller läggs sist men vinner över "bevakad": ett index är
    // ett index även när det står i en watchlist-fil.
    for (const t of Object.keys(out)){
      if (SLEEVE_TICKERS.includes(t)) { if (out[t].role === "bevakad") out[t] = { role: "sleeve", label: ROLE_LABEL.sleeve, book: out[t].book }; }
      else if (/^\^/.test(t)) out[t] = { role: "index", label: ROLE_LABEL.index, book: out[t].book };
      else if (/=X$/.test(t)) out[t] = { role: "valuta", label: ROLE_LABEL.valuta, book: out[t].book };
    }
    return out;
  }

  // Roll för en ticker som inte fanns i någon källa (t.ex. hämtad ur en rapport).
  function roleFor(roles, ticker){
    const k = String(ticker || "").trim().toUpperCase();
    if (roles && roles[k]) return roles[k];
    if (SLEEVE_TICKERS.includes(k)) return { role: "sleeve", label: ROLE_LABEL.sleeve, book: null };
    if (/^\^/.test(k)) return { role: "index", label: ROLE_LABEL.index, book: null };
    if (/=X$/.test(k)) return { role: "valuta", label: ROLE_LABEL.valuta, book: null };
    return { role: "bevakad", label: ROLE_LABEL.bevakad, book: null };
  }

  // Dagsrörelse ur prices.json. Returnerar null om filen saknar schemaVersion:
  // previousClose pekade då ~en vecka bakåt och talet vore en veckorörelse
  // förklädd till dagsrörelse (se fetch-prices.mjs). Hellre tomt än fel.
  function dayChangePct(prices, sym){
    if (!prices || !prices.schemaVersion) return null;
    const q = prices.quotes && prices.quotes[sym];
    if (!q || q.price == null || !q.previousClose) return null;
    return (q.price / q.previousClose - 1) * 100;
  }

  // ---- intradag-monitorns hälsa ------------------------------------------
  // alerts.json skrevs tidigare bara när signalmängden ändrades, så en tom fil
  // betydde antingen "frisk monitor utan signaler" eller "monitorn har varit
  // död sedan i onsdags" – omöjligt att skilja åt. alerts.mjs stämplar nu
  // checkedAt vid varje körning (minst var 3:e timme under börstid 07-20 UTC
  // vardagar). Funktionen översätter stämpeln till ett läge dashboarden kan
  // visa. generatedAt duger INTE som fallback för färskhet – den betyder
  // fortfarande "senast signalerna ändrades" – men saknas checkedAt helt kör
  // actionen en version som är äldre än hjärtslags-fixen, och det ska synas.
  function monitorStatus(alerts, now){
    if (!alerts) return null;
    const t = alerts.checkedAt ? Date.parse(alerts.checkedAt) : NaN;
    const ref = now instanceof Date ? now.getTime() : (now != null ? Date.parse(now) : Date.now());
    if (isNaN(t)) return { state: "unknown", checkedAt: null, ageH: null,
      label: "Monitorns hjärtslag saknas" };
    const ageH = (ref - t) / 3600000;
    const hhmm = new Date(t).toISOString().slice(11, 16);
    const day = new Date(t).toISOString().slice(0, 10);
    // Helg och natt är tysta enligt schema, så gränsen sätts vid 6 h på samma
    // sätt som watchdogen – då fångas en död monitor utan falsklarm på helger.
    const dow = new Date(ref).getUTCDay();
    const weekday = dow >= 1 && dow <= 5;
    const stale = weekday && ageH > 6;
    return {
      state: stale ? "stale" : "fresh",
      checkedAt: alerts.checkedAt, ageH,
      watched: Array.isArray(alerts.watched) ? alerts.watched.length : null,
      label: (stale ? "Monitorn har tystnat – senast kontrollerad " : "Monitorn kontrollerad ")
        + (ageH > 20 ? day + " " : "") + hhmm + " UTC"
    };
  }

  // ---- valuta (us-boken är USD-denominerad) ------------------------------
  // Total-vyn blandar två böcker som RENA procenttal. För en svensk depå är
  // us-bokens avkastning dessutom beroende av USD/SEK. Vi kan inte räkna om
  // historiken (växelkursen vid varje affär är inte loggad), så funktionen
  // returnerar dagens kurs + dygnsrörelse för att kunna redovisa vad som
  // EXKLUDERAS – inte för att smyga in en justering.
  function fxRate(prices, pair){
    const q = prices && prices.quotes && prices.quotes[pair || "USDSEK=X"];
    if (!q || q.price == null) return null;
    const prev = q.previousClose;
    return {
      pair: pair || "USDSEK=X",
      rate: q.price,
      changePct: (prev && prev > 0) ? (q.price / prev - 1) * 100 : null,
      marketTime: q.marketTime || null
    };
  }

  const API = {
    field, firstNumberPct, stripMd, parseTables, splitSections, parseFilename,
    normDecision, extractNote, parsePortfolio, parseDaily, parseWeekly, parseScout,
    computeTradeStats, buildFeed, buildReturnSeries,
    buildBenchmarkSeries, seriesOnLabels, numFrom, computeHoldingLive,
    computeGauge, buildDecisionHistory, nextRoutineRun, diffDailies, searchDocs, weightFrac, combinedReturn,
    parseLessons, buildTradeSeries, buildMonthlyStats, computeRiskStats,
    costFor, netPct, fxRate, DEFAULT_COSTS, monitorStatus,
    tickerRoles, roleFor, parseWatchlist, tickersInText, dayChangePct, ROLE_ORDER, ROLE_LABEL,
    benchReturnPct, computeAlpha, computeAlphaStats, alphaKey,
    parseDecisions, decisionStats,
    slugify, reportOutline, reportDigest
  };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else root.VParse = API;
})(typeof window!=="undefined"?window:this);
