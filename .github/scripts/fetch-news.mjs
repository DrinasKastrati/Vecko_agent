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
const MAX_ITEMS = 300;         // tak i news_feed.json
const MAX_AGE_H = 48;          // äldre poster än så rensas

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
async function main(){
  const feeds = parseFeedList(existsSync("config/news_feeds.txt") ? readFileSync("config/news_feeds.txt", "utf8") : "");
  if (!feeds.length){ console.log("Inga flöden i config/news_feeds.txt – avslutar."); return; }

  let old = { items: [] };
  try { old = JSON.parse(readFileSync("state/news_feed.json", "utf8")); } catch {}

  const nowIso = new Date().toISOString();
  const status = {};
  let fresh = [];
  for (const f of feeds){
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 20000);
      const r = await fetch(f.url, { headers: { "User-Agent": UA, "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml, */*" }, signal: ctrl.signal });
      clearTimeout(timer);
      if (!r.ok){ status[f.name] = "HTTP " + r.status; continue; }
      const items = parseRss(await r.text(), f.name);
      status[f.name] = items.length + " poster";
      fresh = fresh.concat(items);
    } catch (e) {
      status[f.name] = "fel: " + String(e && e.message || e).slice(0, 60);
    }
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
