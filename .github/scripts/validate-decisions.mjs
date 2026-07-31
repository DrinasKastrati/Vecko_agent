#!/usr/bin/env node
/* ============================================================
   Validerar state/decisions.json mot schemat i filens comment-fält.
   Prompterna säger "validera med JSON.parse" – det fångar bara trasig
   JSON, inte fel enum-värden, saknade fält eller ändrade historiska
   rader. Det här skriptet fångar allt tre och körs i CI (test.yml).

   Kör:  node .github/scripts/validate-decisions.mjs
         node .github/scripts/validate-decisions.mjs --base <fil>   (append-only-kontroll)
   Exit 1 vid fel.
   ============================================================ */
import { readFileSync, existsSync } from "node:fs";

export const CATALYST_TYPES = ["earnings", "order", "ma_rumor", "regulatory", "insider",
                               "buyback", "index", "macro", "turnaround", "other"];
export const ACTIONS = ["KÖP", "SÄLJ", "BEHÅLL", "AVVAKTA"];
export const BOOKS = ["nordic", "us"];

const isNum = v => typeof v === "number" && isFinite(v);
const isNumOrNull = v => v === null || isNum(v);

// Validerar EN rad. Returnerar array med felmeddelanden (tom = giltig).
export function validateDecision(row, i){
  const e = [];
  const at = f => `rad ${i} (${(row && row.date) || "?"}/${(row && row.ticker) || "?"}): ${f}`;
  if (!row || typeof row !== "object") return [`rad ${i}: inte ett objekt`];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date || "")) e.push(at("date måste vara åååå-mm-dd"));
  if (!BOOKS.includes(row.book)) e.push(at(`book måste vara ${BOOKS.join("|")}`));
  if (!["A", "B"].includes(row.mode)) e.push(at("mode måste vara A eller B"));
  if (!row.ticker || typeof row.ticker !== "string") e.push(at("ticker saknas"));
  if (!ACTIONS.includes(row.action)) e.push(at(`action måste vara ${ACTIONS.join("|")}`));
  if (!isNumOrNull(row.price)) e.push(at("price måste vara tal eller null"));
  if (!isNumOrNull(row.weight)) e.push(at("weight måste vara tal eller null"));
  if (isNum(row.weight) && (row.weight < 0 || row.weight > 1)) e.push(at("weight är en andel 0–1, inte procent"));
  for (const f of ["entry", "stop", "target", "rr", "rsi"])
    if (!isNumOrNull(row[f])) e.push(at(`${f} måste vara tal eller null`));
  // Fält som tillkom 2026-07-31 – valfria, men måste vara tal när de finns.
  for (const f of ["horizonDays", "benchPct", "alphaPct", "realizedRr"])
    if (f in row && !isNumOrNull(row[f])) e.push(at(`${f} måste vara tal eller null`));
  if (isNum(row.horizonDays) && row.horizonDays <= 0) e.push(at("horizonDays måste vara > 0"));
  if (isNum(row.benchPct) && isNum(row.outcomePct) && isNum(row.alphaPct) &&
      Math.abs(row.alphaPct - (row.outcomePct - row.benchPct)) > 0.011)
    e.push(at("alphaPct stämmer inte med outcomePct − benchPct"));
  if (row.catalystType != null && !CATALYST_TYPES.includes(row.catalystType))
    e.push(at(`catalystType "${row.catalystType}" finns inte i enum (${CATALYST_TYPES.join("|")})`));
  if (row.action === "SÄLJ"){
    if (!isNum(row.outcomePct)) e.push(at("SÄLJ kräver outcomePct som tal"));
    if (!isNum(row.holdDays)) e.push(at("SÄLJ kräver holdDays som tal"));
  }
  if (typeof row.reason !== "string" || !row.reason.trim()) e.push(at("reason saknas"));
  else if (row.reason.length > 200) e.push(at(`reason är ${row.reason.length} tecken (max 200)`));
  if (row.lessonIds != null && !Array.isArray(row.lessonIds)) e.push(at("lessonIds måste vara en array"));
  return e;
}

// Validerar hela filen (redan parsad).
export function validateDb(db){
  const e = [];
  if (!db || typeof db !== "object") return { errors: ["filen är inte ett objekt"], count: 0 };
  if (db.version !== 1) e.push("version måste vara 1");
  if (!Array.isArray(db.decisions)) return { errors: e.concat("decisions måste vara en array"), count: 0 };
  db.decisions.forEach((r, i) => e.push(...validateDecision(r, i)));
  return { errors: e, count: db.decisions.length };
}

// APPEND-ONLY: den nya arrayen måste börja med exakt den gamla (djup jämförelse).
export function isAppendOnly(oldRows, newRows){
  const o = oldRows || [], n = newRows || [];
  if (n.length < o.length) return false;
  for (let i = 0; i < o.length; i++)
    if (JSON.stringify(o[i]) !== JSON.stringify(n[i])) return false;
  return true;
}

// ---- CLI ---------------------------------------------------------------
function main(){
  const file = "state/decisions.json";
  if (!existsSync(file)){ console.error("Saknar " + file); process.exit(1); }
  let db;
  try { db = JSON.parse(readFileSync(file, "utf8")); }
  catch (err){ console.error("decisions.json parsar inte: " + err.message); process.exit(1); }

  const { errors, count } = validateDb(db);

  const bi = process.argv.indexOf("--base");
  if (bi > -1 && process.argv[bi + 1]){
    try {
      const base = JSON.parse(readFileSync(process.argv[bi + 1], "utf8"));
      if (!isAppendOnly(base.decisions, db.decisions))
        errors.push("APPEND-ONLY brutet: befintliga rader har ändrats, raderats eller sorterats om");
    } catch (err){ errors.push("kunde inte läsa basfilen: " + err.message); }
  }

  if (errors.length){
    console.error(`decisions.json: ${errors.length} fel`);
    errors.forEach(x => console.error("  - " + x));
    process.exit(1);
  }
  console.log(`decisions.json OK – ${count} rader.`);
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/").split("/").pop());
if (isMain) main();
