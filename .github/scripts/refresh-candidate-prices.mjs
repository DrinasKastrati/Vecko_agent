#!/usr/bin/env node
/* ============================================================
   Fyller `price`/`priceAsOf` på kandidater i state/scout_candidates.json –
   men BARA från en kurs som bevisligen ligger efter katalysatorn.

   VARFÖR REGELN ÄR SÅ SNÄV. 2026-08-05 låg ANET och AMD båda med price: null
   i kandidatfilen medan prices.json HADE en kurs för dem (190,51 resp. 518,58).
   Kurserna var den reguljära stängningen 2026-08-04 – och båda bolagen
   rapporterade 2026-08-04 AMC, alltså EFTER den tidpunkten. Scouten avvisade
   dem korrekt. Ett skript som fyllt i "kursen som fanns" hade skrivit en
   pre-event-kurs på en post-event-katalysator och gjort ett korrekt avstående
   till ett felaktigt köpunderlag.

   Nyckellöst, LLM-fritt, ingen nätåtkomst. Körs i prices.yml efter hämtningen.
   ============================================================ */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const DB = "state/scout_candidates.json";

/* Kvalificerad post-katalysatorisk kurs, eller null.

   Datum + sessionsetikett, ALDRIG klockslag: att jämföra mot börsens stängning
   kräver att man applicerar ett klockslag på ett annat datum, vilket går sönder
   vid sommartid och skiljer sig mellan Stockholm (15:30 UTC) och New York
   (20:00 UTC). En förbörspunkt dag D+1 ligger per definition efter stängning
   dag D, och en efterbörspunkt dag D likaså. */
export function postCatalystQuote(quote, catalystDate){
  if (!quote || !catalystDate) return null;
  const ok = v => typeof v === "number" && isFinite(v) && v > 0;

  if (ok(quote.extendedPrice) && typeof quote.extendedTime === "string"){
    const d = quote.extendedTime.slice(0, 10);
    const later = d > catalystDate;
    const postSameDay = d === catalystDate && quote.extendedSession === "post";
    if (later || postSameDay)
      return { price: quote.extendedPrice, at: quote.extendedTime,
               session: quote.extendedSession === "post" ? "post" : "pre" };
  }
  if (ok(quote.price) && typeof quote.marketTime === "string" &&
      quote.marketTime.slice(0, 10) > catalystDate)
    return { price: quote.price, at: quote.marketTime, session: "regular" };

  return null;
}

/* Ren funktion: returnerar { db, changed, filled }. Muterar inte indata. */
export function refreshCandidates(db, quotes){
  const cs = (db && Array.isArray(db.candidates)) ? db.candidates : null;
  if (!cs) return { db, changed: false, filled: [] };
  const filled = [];
  const out = cs.map(c => {
    if (!c || c.status !== "new" || c.price != null) return c;
    const q = quotes && quotes[c.ticker];
    const hit = postCatalystQuote(q, c.catalystDate);
    if (!hit) return c;
    filled.push(c.id || c.ticker);
    return Object.assign({}, c, { price: hit.price, priceAsOf: hit.at, priceSession: hit.session });
  });
  if (!filled.length) return { db, changed: false, filled: [] };
  return { db: Object.assign({}, db, { candidates: out }), changed: true, filled };
}

// ---- CLI ---------------------------------------------------------------
const invokedDirectly = process.argv[1] &&
  process.argv[1].replace(/\\/g, "/").endsWith("refresh-candidate-prices.mjs");
if (invokedDirectly){
  if (!existsSync(DB)){
    console.log("scout_candidates.json saknas – inget att uppdatera.");
    process.exit(0);
  }
  let db = null, quotes = {};
  try { db = JSON.parse(readFileSync(DB, "utf8")); }
  catch { console.log("scout_candidates.json går inte att parsa – lämnar den orörd."); process.exit(0); }
  try { quotes = (JSON.parse(readFileSync("state/prices.json", "utf8")) || {}).quotes || {}; }
  catch { console.log("prices.json går inte att läsa – inget att uppdatera."); process.exit(0); }

  const res = refreshCandidates(db, quotes);
  // Skriv BARA vid faktisk ändring: prices.yml kör var 30:e minut, och en
  // ovillkorlig skrivning gav decision_eval.mjs ~48 tomma commits per dygn.
  if (res.changed){
    writeFileSync(DB, JSON.stringify(res.db, null, 1) + "\n");
    console.log(`Fyllde kurs på ${res.filled.length} kandidat(er): ${res.filled.join(", ")}`);
  } else {
    console.log("Inga kandidater fick ny kurs – skriver inte (undviker tom commit).");
  }
}
