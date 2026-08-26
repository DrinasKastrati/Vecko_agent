#!/usr/bin/env node
/* ============================================================
   Nyhetsingestion: läser RSS-/Atom-flöden ur config/news_feeds.txt
   och skriver ett normaliserat, dedupliserat state/news_feed.json.
   Körs av GitHub Actions (fri nätåtkomst), LLM-fritt – noll tokens.
   Routinerna läser sedan filen som PRIMÄR nyhetsradar (rubriker som
   sedan verifieras via länken innan de används i beslut).
   ============================================================ */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

/* ENDA User-Agent i filen (sedan 2026-08-26). SEC:s access-policy KRÄVER en UA som
   deklarerar kontaktuppgift, och en påhittad browser-UA ger 403 mot deras
   EDGAR-flöden. Sedan 2026-08-26 används den mot ALLA flöden – se uaFor() för
   mätningen som ledde dit. Lägg aldrig tillbaka en Mozilla-sträng här:
   `tests/run.mjs` larmar, och det var precis den som fick GlobeNewswire att
   tarpita oss i 16 dygn. */
const SEC_UA = "Vecko_agent/1.0 (kastratidrinas@gmail.com)";
// FÖNSTRET MÄTS I HANDELSDAGAR, INTE TIMMAR (ändrat 2026-08-03).
// Prompterna kräver "de senaste 5 handelsdagarna" ur den här filen. Ett fönster
// på 48 timmar KAN inte leverera det, och kollapsar dessutom just när det behövs
// mest: måndag 05:58 UTC ligger fredagens sista hämtning (22:14) 55 timmar bakåt,
// alltså utanför fönstret. Resultatet var att veckorotationen – körningen som mest
// av alla behöver flera dagars nyheter – läste ett fönster på 47 MINUTER och fick
// gå till git-historiken för att hitta fredagens poster.
// 10 handelsdagar ger dubbel marginal mot kravet på 5.
const WINDOW_TRADING_DAYS = 10;
const MAX_AGE_H = 48;          // reserv om fönstret inte kan räknas ut
// Tak per källa och dygn: ett pratigt flöde ska inte kunna tränga ut de andra, och
// – viktigare – DAGARNA måste överleva. mfn levererar ~40 poster i timmen på
// morgonen; utan ett per-dygn-tak fyller de senaste två dagarna hela filen och
// fönstret kollapsar igen, bara långsammare än 48-timmarsvarianten gjorde.
const MAX_PER_SOURCE_DAY = 30;
// Det GLOBALA taket är medvetet satt ÖVER vad per-dygn-taket kan producera
// (6 flöden × 30 × 10 dagar = 1800), så att det aldrig blir den bindande gränsen.
// Är det globala taket lägre är det per-dygn-taket verkningslöst: de nyaste dagarna
// äter platsen och de äldsta faller bort ändå. Ändras något av talen: kontrollera
// att MAX_ITEMS > flöden × MAX_PER_SOURCE_DAY × WINDOW_TRADING_DAYS.
const MAX_ITEMS = 2000;

/* ÄRLIG UA FÖR ALLA FLÖDEN (ändrat 2026-08-26) – utge dig aldrig för att vara Chrome.

   Fram till nu skickades en påhittad Chrome-UA till alla värdar utom sec.gov. Det
   slutade fungera mot GlobeNewswire mellan 2026-08-10 08:52 och 20:05 UTC: båda
   deras flöden slog i vår 20-sekunderstimeout vid VARJE körning i 16 dygn, och
   ingenting larmade (fönstrets täckning bars av de fyra övriga flödena).

   MÄTT 2026-08-26, samma maskin, samma nät, samma URL, enda skillnaden UA:

     curl/8.x (ärlig, ingen påhittad header)   HTTP 200   0,07 s
     Chrome/139 (påhittad)                     timeout   21,6 s
     Chrome/124 (den vi skickade)              timeout   25,0 s

   Alltså inte IP-blockering. GlobeNewswire tarpitar klienter som PÅSTÅR sig vara en
   webbläsare utan att bete sig som en (ingen browser-TLS-fingeravtryck, inga
   sec-ch-ua-headers) – vanlig bot-mitigering. En klient som säger vad den är
   släpps igenom direkt.

   Med kontakt-UA:n svarar SAMTLIGA SEX flöden 200 på under en sekund:
   globenewswire 20 poster, globenewswire-earnings 20, prnewswire 20, mfn 48,
   sec-8k 40, fed-press 20. SEC krävde den redan – nu är den enda UA:n i filen,
   och `UA`-konstanten finns inte längre att råka återinföra.

   Att höja timeouten hade varit fel åtgärd på rätt symptom: ett anrop som
   tarpitas svarar inte oavsett hur länge man väntar. */
export function uaFor(){
  return SEC_UA;
}

// ---- pure helpers (testbara) ------------------------------------------
function textBetween(block, tag){
  // <tag>…</tag> eller <tag attr="">…</tag>; CDATA packas upp.
  const re = new RegExp("<" + tag + "(?:\\s[^>]*)?>([\\s\\S]*?)</" + tag + ">", "i");
  const m = block.match(re);
  if (!m) return "";
  return m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ").trim();
}

// RSS 2.0 (<item>) och Atom (<entry>) -> [{t,u,d,src}]. Trasig XML ger [].
export function parseRss(xml, srcName){
  const out = [];
  if (!xml) return out;
  const blocks = [...xml.matchAll(/<(item|entry)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi)].map(m => m[2]);
  for (const b of blocks){
    const title = textBetween(b, "title");
    if (!title) continue;
    let url = textBetween(b, "link");
    if (!url){
      const lm = b.match(/<link[^>]*href=["']([^"']+)["']/i); // Atom: <link href="…"/>
      url = lm ? lm[1].trim() : "";
    }
    const dateRaw = textBetween(b, "pubDate") || textBetween(b, "published") ||
                    textBetween(b, "updated") || textBetween(b, "dc:date");
    const t = Date.parse(dateRaw);
    out.push({
      t: title.slice(0, 240),
      u: url.slice(0, 400),
      d: isNaN(t) ? null : new Date(t).toISOString(),
      src: srcName
    });
  }
  return out;
}

// Hur många TIMMAR bakåt är N handelsdagar, räknat från nowIso? Lördag och söndag
// hoppas över, och fönstret sträcker sig till 00:00 UTC den N:te handelsdagen bakåt
// så att hela den dagens poster ryms (annars beror fönstret på klockslaget).
export function ageHoursForTradingDays(nowIso, tradingDays){
  const now = new Date(nowIso);
  if (isNaN(now)) return MAX_AGE_H;
  const n = Math.max(1, tradingDays || 1);
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  let counted = 0;
  // Dagen vi står på räknas som den första handelsdagen om den är en vardag.
  if (d.getUTCDay() !== 0 && d.getUTCDay() !== 6) counted = 1;
  while (counted < n){
    d.setUTCDate(d.getUTCDate() - 1);
    if (d.getUTCDay() !== 0 && d.getUTCDay() !== 6) counted++;
  }
  return Math.ceil((now.getTime() - d.getTime()) / 3600e3);
}

// Postens dygn (UTC) – grupperingsnyckel för taket per källa och dag.
function dayOf(it){ return it && it.d ? String(it.d).slice(0, 10) : "okänt"; }

// Slår ihop gamla + nya poster: dedupe (url, annars titel+källa), åldersrensning,
// tak per källa och dygn, och till sist ett globalt tak.
export function mergeNews(oldItems, newItems, nowIso, maxAgeH, maxItems, perSourceDay){
  const cutoff = Date.parse(nowIso) - (maxAgeH || MAX_AGE_H) * 3600e3;
  const seen = new Set(); const out = [];
  for (const it of [...(newItems || []), ...(oldItems || [])]){
    if (!it || !it.t) continue;
    if (it.d && Date.parse(it.d) < cutoff) continue;
    const key = (it.u && it.u.length > 10) ? it.u : (it.src + "|" + it.t.toLowerCase());
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(it);
  }
  out.sort((a, b) => (b.d || "").localeCompare(a.d || ""));
  const cap = perSourceDay || MAX_PER_SOURCE_DAY;
  if (cap > 0){
    const perDay = new Map();
    const kept = [];
    for (const it of out){                       // out är sorterad nyast först
      const k = (it.src || "?") + "|" + dayOf(it);
      const n = (perDay.get(k) || 0);
      if (n >= cap) continue;                    // äldsta posterna i dygnet ryker
      perDay.set(k, n + 1);
      kept.push(it);
    }
    return kept.slice(0, maxItems || MAX_ITEMS);
  }
  return out.slice(0, maxItems || MAX_ITEMS);
}

// Täckningen i fönstret, så att en routine (och preflight) kan KONTROLLERA att
// filen faktiskt bär de handelsdagar prompten kräver – i stället för att anta det.
export function newsCoverage(items, nowIso, tradingDays){
  const list = (items || []).filter(i => i && i.d);
  const days = [...new Set(list.map(dayOf))].sort();
  const perDay = {}; const perSource = {};
  for (const it of list){
    perDay[dayOf(it)] = (perDay[dayOf(it)] || 0) + 1;
    perSource[it.src || "?"] = (perSource[it.src || "?"] || 0) + 1;
  }
  // Handelsdagar (vardagar) i fönstret som saknar poster helt.
  const wanted = [];
  const now = new Date(nowIso);
  if (!isNaN(now)){
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    while (wanted.length < Math.max(1, tradingDays || 1)){
      if (d.getUTCDay() !== 0 && d.getUTCDay() !== 6) wanted.push(d.toISOString().slice(0, 10));
      d.setUTCDate(d.getUTCDate() - 1);
    }
  }
  return {
    tradingDays: tradingDays || WINDOW_TRADING_DAYS,
    oldest: days[0] || null,
    newest: days[days.length - 1] || null,
    distinctDays: days.length,
    tradingDaysCovered: wanted.filter(d => perDay[d]).length,
    missingDays: wanted.filter(d => !perDay[d]),
    perDay, perSource
  };
}

export function parseFeedList(txt){
  return (txt || "").split("\n")
    .map(l => l.trim())
    .filter(l => l && !l.startsWith("#"))
    .map(l => { const i = l.indexOf("|"); return i > 0 ? { name: l.slice(0, i).trim(), url: l.slice(i + 1).trim() } : null; })
    .filter(Boolean);
}

// ---- main --------------------------------------------------------------
// Ett flöde som svarar 404/5xx eller timeoutar EN gång är oftast en transient
// störning hos leverantören, inte en död URL: prnewswire levererade 20 poster
// 2026-07-31T20:37Z, svarade HTTP 404 i körningen 22:17Z samma kväll och är
// grön igen vid manuell kontroll (2026-08-02). Utan omförsök läses sådant som
// "flödet är dött" och URL:en byts i onödan. Ett (1) omförsök räcker; att det
// behövdes redovisas i status så att ett flöde som verkligen dör ändå syns.
export async function fetchFeedText(url, opts = {}){
  const {
    fetchImpl = globalThis.fetch, retries = 1, timeoutMs = 20000, delayMs = 2000,
    sleep = ms => new Promise(r => setTimeout(r, ms)), ua = uaFor(url)
  } = opts;
  let last = "okänt fel", lastMs = null;
  for (let attempt = 0; attempt <= retries; attempt++){
    if (attempt) await sleep(delayMs);
    const t0 = Date.now();
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), timeoutMs);
      const r = await fetchImpl(url, { headers: { "User-Agent": ua,
        "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml, */*" },
        signal: ctrl.signal });
      clearTimeout(timer);
      lastMs = Date.now() - t0;
      if (r.ok) return { ok: true, text: await r.text(), attempts: attempt + 1, ms: lastMs };
      last = "HTTP " + r.status;
    } catch (e) {
      lastMs = Date.now() - t0;
      last = "fel: " + String(e && e.message || e).slice(0, 60);
    }
  }
  /* SVARSTIDEN SKILJER TVÅ FEL MED OLIKA ÅTGÄRD (2026-08-26).
     "fel: This operation was aborted" ensamt säger inte OM värden avvisade oss eller
     hängde. Tiden gör det: ~timeoutMs betyder att anropet tarpitades (blockering av
     datacenter-IP ⇒ källan måste bytas, en högre timeout hjälper inte), medan några
     hundra ms betyder att uppkopplingen vägrades (DNS/TLS/nät ⇒ helt annan åtgärd).
     `globenewswire` och `globenewswire-earnings` slutade svara mellan 2026-08-10
     08:52 och 20:05 UTC efter att ha fungerat i månader; utan tiden i statusen gick
     de två fallen inte att skilja åt från loggen. */
  return { ok: false, status: last, attempts: retries + 1, ms: lastMs };
}

async function main(){
  const feeds = parseFeedList(existsSync("config/news_feeds.txt") ? readFileSync("config/news_feeds.txt", "utf8") : "");
  if (!feeds.length){ console.log("Inga flöden i config/news_feeds.txt – avslutar."); return; }

  let old = { items: [] };
  try { old = JSON.parse(readFileSync("state/news_feed.json", "utf8")); } catch {}

  const nowIso = new Date().toISOString();
  const status = {};
  let fresh = [];
  for (const f of feeds){
    const res = await fetchFeedText(f.url);
    const retried = res.attempts > 1 ? " (efter omförsök)" : "";
    if (!res.ok){
      status[f.name] = res.status + " – båda försöken" +
        (res.ms != null ? " (" + (res.ms / 1000).toFixed(1) + " s)" : "");
      console.log("  " + f.name + ": " + status[f.name]);
      continue;
    }
    const items = parseRss(res.text, f.name);
    // 200 men noll poster = trasig/utgången flödes-URL (t.ex. Business Wire som
    // svarar med ett tomt RSS-skal). Flaggas så den inte tystnar oupptäckt.
    status[f.name] = (items.length ? items.length + " poster" : "0 poster – kontrollera URL") + retried;
    fresh = fresh.concat(items);
  }

  const ageH = ageHoursForTradingDays(nowIso, WINDOW_TRADING_DAYS);
  const merged = mergeNews(old.items, fresh, nowIso, ageH, MAX_ITEMS, MAX_PER_SOURCE_DAY);
  const window = newsCoverage(merged, nowIso, WINDOW_TRADING_DAYS);
  writeFileSync("state/news_feed.json", JSON.stringify({
    generatedAt: nowIso,
    feeds: status,
    count: merged.length,
    window,
    items: merged
  }, null, 1) + "\n");
  console.log("news_feed.json:", merged.length, "poster,", window.tradingDaysCovered + "/" +
    window.tradingDays, "handelsdagar täckta (" + (window.oldest || "?") + " → " +
    (window.newest || "?") + ").", JSON.stringify(status));
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/").split("/").pop());
if (isMain) main().catch(e => { console.error(e); process.exit(1); });
