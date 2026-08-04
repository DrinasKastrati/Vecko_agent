#!/usr/bin/env node
/* ============================================================
   Validerar state/scout_candidates.json – bryggan mellan scouten och böckerna.

   Filen skrivs av en LLM-routine, och en LLM som skriver JSON gör tre sorters
   fel: trasig syntax, uppfunna enum-värden och tysta utelämnanden. Bara det
   första fångas av JSON.parse. Samma mönster som validate-decisions.mjs.

   DEN VIKTIGASTE KONTROLLEN ÄR INTE SCHEMAT. Det är `--stale`: en kandidat som
   ligger kvar med status "new" efter att ha passerat sitt expiresAt betyder att
   en bok fick ett flaggat case och aldrig tog ställning. Det är exakt buggen
   filen byggdes för att göra omöjlig (Palantir, 2026-08-01..03), och den är
   TYST – ingenting går sönder, rapporten ser normal ut, kandidaten bara
   försvinner. Kontrollen körs i watchdogen, inte i CI-grinden: en gammal
   kandidat ska larma till Dren, men den ska inte blockera en push som råkar
   ske samma dag.

   Kör:  node .github/scripts/validate-scout-candidates.mjs
         node .github/scripts/validate-scout-candidates.mjs --stale   (kräver att inga 'new' passerat expiresAt)
   Exit 1 vid fel.
   ============================================================ */
import { readFileSync, existsSync } from "node:fs";
import { CATALYST_TYPES } from "./validate-decisions.mjs";

export const STATUSES = ["new", "rejected", "promoted", "expired"];
export const SOURCES = ["scout", "analys", "monitor"];
export const BOOKS = ["nordic", "us"];

const isNum = v => typeof v === "number" && isFinite(v);
const isNumOrNull = v => v === null || isNum(v);
const isIso = v => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);

/* Validerar EN kandidat. Returnerar array med felmeddelanden (tom = giltig). */
export function validateCandidate(c, i){
  const e = [];
  const at = f => `kandidat ${i} (${(c && c.id) || "?"}): ${f}`;
  if (!c || typeof c !== "object") return [`kandidat ${i}: inte ett objekt`];

  if (!/^\d{6}-[A-Z0-9.\-^]{1,14}$/.test(c.id || "")) e.push(at("id måste vara yymmdd-TICKER"));
  if (!isIso(c.date)) e.push(at("date måste vara åååå-mm-dd"));
  if (!c.ticker || typeof c.ticker !== "string") e.push(at("ticker saknas"));
  if (!BOOKS.includes(c.book)) e.push(at(`book måste vara ${BOOKS.join("|")}`));
  if (!SOURCES.includes(c.source)) e.push(at(`source måste vara ${SOURCES.join("|")}`));
  if (!CATALYST_TYPES.includes(c.catalystType))
    e.push(at(`catalystType måste vara ur enum: ${CATALYST_TYPES.join("|")}`));
  if (!isIso(c.catalystDate)) e.push(at("catalystDate måste vara åååå-mm-dd"));
  if (typeof c.confirmed !== "boolean") e.push(at("confirmed måste vara true/false"));
  if (!c.thesis || typeof c.thesis !== "string") e.push(at("thesis saknas"));
  else if (c.thesis.length > 300) e.push(at("thesis får vara högst 300 tecken"));
  if (!c.sourceRef || typeof c.sourceRef !== "string") e.push(at("sourceRef saknas (källa + datum)"));
  if (!isNumOrNull(c.price)) e.push(at("price måste vara tal eller null"));
  if (c.priceAsOf != null && typeof c.priceAsOf !== "string") e.push(at("priceAsOf måste vara ISO-sträng eller null"));
  // En kurs utan tidsstämpel är inte en verifierad kurs. Kravet är detsamma som
  // i prompterna och får inte sänkas här bara för att fältet är valfritt.
  if (isNum(c.price) && !c.priceAsOf) e.push(at("price angiven utan priceAsOf – en kurs utan tidsstämpel är inte verifierad"));
  if (!STATUSES.includes(c.status)) e.push(at(`status måste vara ${STATUSES.join("|")}`));
  if (!isIso(c.expiresAt)) e.push(at("expiresAt måste vara åååå-mm-dd"));
  if (isIso(c.date) && isIso(c.expiresAt) && c.expiresAt < c.date)
    e.push(at("expiresAt ligger före date"));

  if (c.status === "new"){
    if (c.decidedBy != null || c.decidedAt != null)
      e.push(at("status 'new' får inte ha decidedBy/decidedAt"));
  } else {
    if (!c.decisionReason || typeof c.decisionReason !== "string")
      e.push(at(`status '${c.status}' kräver decisionReason med namngiven spärr eller motivering`));
    else if (c.decisionReason.length > 200) e.push(at("decisionReason får vara högst 200 tecken"));
    if (c.status !== "expired" && !c.decidedBy)
      e.push(at(`status '${c.status}' kräver decidedBy (rapportfilen som tog ställning)`));
    if (c.status !== "expired" && !isIso(c.decidedAt))
      e.push(at(`status '${c.status}' kräver decidedAt (åååå-mm-dd)`));
  }

  /* KURSVERIFIERINGSKRAVET. En kandidat utan verifierad kurs får loggas och
     avfärdas – det är hela poängen med att den syns – men den får ALDRIG
     promotas till ett köp. Samma regel som gör att en decisions.json-rad med
     price: null aldrig får bli ett KÖP. */
  if (c.status === "promoted" && !isNum(c.price))
    e.push(at("promoted kräver verifierad kurs – en kandidat utan kurs får aldrig bli ett köp"));

  /* En OBEKRÄFTAD katalysator (rykte, väntat men ej släppt event) får inte
     heller promotas. Backtestet 2026-08-04 underkände uttryckligen att köpa
     inför ett event: PRE_ALL och PRE_MOM föll i alla fyra körningarna
     (us/nordic × 5y/10y), med negativ alpha i nordiska boken. */
  if (c.status === "promoted" && c.confirmed !== true)
    e.push(at("promoted kräver confirmed: true – att köpa inför ett obekräftat event är underkänt i backtestet"));

  return e;
}

export function validateFile(json){
  const errors = [];
  if (!json || typeof json !== "object") return ["filen är inte ett objekt"];
  if (!Array.isArray(json.candidates)) return ["candidates saknas eller är inte en array"];
  const seen = new Set();
  json.candidates.forEach((c, i) => {
    errors.push(...validateCandidate(c, i));
    if (c && c.id){
      if (seen.has(c.id)) errors.push(`kandidat ${i}: dubblett-id ${c.id}`);
      seen.add(c.id);
    }
  });
  return errors;
}

/* Kandidater som passerat expiresAt utan att någon bok tagit ställning.
   `today` injiceras för att kontrollen ska gå att testa utan att bero på
   dagens datum. */
export function staleCandidates(json, today = new Date().toISOString().slice(0, 10)){
  const list = (json && Array.isArray(json.candidates)) ? json.candidates : [];
  return list.filter(c => c && c.status === "new" && isIso(c.expiresAt) && c.expiresAt < today);
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/").split("/").pop());
if (isMain){
  const file = "state/scout_candidates.json";
  if (!existsSync(file)){
    console.error("Saknar " + file);
    process.exit(1);
  }
  let json;
  try { json = JSON.parse(readFileSync(file, "utf8")); }
  catch (e){ console.error("Trasig JSON i " + file + ": " + e.message); process.exit(1); }

  const errors = validateFile(json);
  if (errors.length){
    console.error(`${file}: ${errors.length} fel`);
    for (const e of errors) console.error("  - " + e);
    process.exit(1);
  }
  console.log(`${file}: OK (${json.candidates.length} kandidater)`);

  if (process.argv.includes("--stale")){
    const stale = staleCandidates(json);
    if (stale.length){
      console.error(`\n${stale.length} kandidat(er) har passerat expiresAt utan avgörande:`);
      for (const c of stale)
        console.error(`  - ${c.id} (${c.book}, flaggad ${c.date}, gick ut ${c.expiresAt}) – ingen bok tog ställning`);
      process.exit(1);
    }
    console.log("Inga kandidater ligger kvar utan avgörande.");
  }
}
