#!/usr/bin/env node
/* ============================================================
   Nyhetsingestion: läser RSS-/Atom-flöden ur config/news_feeds.txt
   och skriver ett normaliserat, dedupliserat state/news_feed.json.
   Körs av GitHub Actions (fri nätåtkomst), LLM-fritt – noll tokens.
   Routinerna läser sedan filen som PRIMÄR nyhetsradar (rubriker som
   sedan verifieras via länken innan de används i beslut).
   ============================================================ */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/124.0 Safari/537.36";
// SEC:s access-policy kräver en User-Agent som deklarerar kontaktuppgift; en
// browser-UA ger 403 mot deras EDGAR-flöden.
const SEC_UA = "Vecko_agent/1.0 (kastratidrinas@gmail.com)";
const MAX_ITEMS = 300;         // tak i news_feed.json
const MAX_AGE_H = 48;          // äldre poster än så rensas

// Rätt User-Agent per värd (sec.gov kräver kontakt-UA, övriga vill ha browser-UA).
export function uaFor(url){
  return /(^|\/\/|\.)sec\.gov(\/|$|:)/i.test(String(url || "")) ? SEC_UA : UA;
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

// Slår ihop gamla + nya poster: dedupe (url, annars titel+källa), åldersrensning, tak.
export function mergeNews(oldItems, newItems, nowIso, maxAgeH, maxItems){
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
  return out.slice(0, maxItems || MAX_ITEMS);
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
  let last = "okänt fel";
  for (let attempt = 0; attempt <= retries; attempt++){
    if (attempt) await sleep(delayMs);
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), timeoutMs);
      const r = await fetchImpl(url, { headers: { "User-Agent": ua,
        "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml, */*" },
        signal: ctrl.signal });
      clearTimeout(timer);
      if (r.ok) return { ok: true, text: await r.text(), attempts: attempt + 1 };
      last = "HTTP " + r.status;
    } catch (e) {
      last = "fel: " + String(e && e.message || e).slice(0, 60);
    }
  }
  return { ok: false, status: last, attempts: retries + 1 };
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
    if (!res.ok){ status[f.name] = res.status + " – båda försöken"; continue; }
    const items = parseRss(res.text, f.name);
    // 200 men noll poster = trasig/utgången flödes-URL (t.ex. Business Wire som
    // svarar med ett tomt RSS-skal). Flaggas så den inte tystnar oupptäckt.
    status[f.name] = (items.length ? items.length + " poster" : "0 poster – kontrollera URL") + retried;
    fresh = fresh.concat(items);
  }

  const merged = mergeNews(old.items, fresh, nowIso);
  writeFileSync("state/news_feed.json", JSON.stringify({
    generatedAt: nowIso,
    feeds: status,
    count: merged.length,
    items: merged
  }, null, 1) + "\n");
  console.log("news_feed.json:", merged.length, "poster.", JSON.stringify(status));
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/").split("/").pop());
if (isMain) main().catch(e => { console.error(e); process.exit(1); });
