#!/usr/bin/env node
/* ============================================================
   Validerar state/action_items.json – de åtgärdspunkter L-3 kräver, gjorda
   RÄKNEBARA.

   Varför filen finns: L-3 fungerar som synlighetsregel men slutade fungera som
   åtgärdsdrivare. Punkterna staplades i prosa – backfilldefekten rapporterades
   SJU gånger utan att något larmade, för ingenting mätte hur länge en punkt
   varit öppen. Ordet "ÅTERKOMMANDE" står i löptext under sex olika
   rubrikvarianter; att regexa det hade varit samma tysta felklass som
   mekanismen ska avskaffa. Se
   docs/superpowers/specs/2026-08-23-retro-atgardsloop-design.md.

   EN SKRIVARE: miss-retron (`prompts/miss_retro.md` STEG 5), samma ägarmodell
   som state/lessons.md. Rotationerna fortsätter skriva prosa; retron
   konsoliderar veckovis.

   Filen skrivs alltså av en LLM, och en LLM som skriver JSON gör tre sorters
   fel: trasig syntax, uppfunna enum-värden och tysta utelämnanden. Bara det
   första fångas av JSON.parse. Samma mönster som validate-scout-candidates.mjs.

   ATT FILEN SAKNAS ÄR INGET FEL – mekanismen är ny, och en retro som inte har
   någon öppen punkt behöver inte skapa den.

   Kör:  node .github/scripts/validate-action-items.mjs
   Exit 1 vid fel.
   ============================================================ */
import { readFileSync, existsSync } from "node:fs";

export const STATUSES = ["open", "resolved"];
export const PATH = "state/action_items.json";

const isIso = v => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
const isText = v => typeof v === "string" && v.trim() !== "";

/* Validerar EN punkt. Returnerar array med felmeddelanden (tom = giltig). */
export function validateItem(it, i){
  const e = [];
  const at = f => `punkt ${i} (${(it && it.id) || "?"}): ${f}`;
  if (!it || typeof it !== "object") return [`punkt ${i}: inte ett objekt`];

  /* id är NYCKELN som gör punkten följbar över veckor och som blir
     watchdogens problem-key (`action-item-<id>`), vilken i sin tur hamnar i
     issue-sync:ens HTML-kommentar. Ändras id:t tappas kopplingen och ett andra
     issue öppnas för samma defekt – exakt den dedupe-bugg issue-sync byggdes
     för att lösa. Därför strikt format och inga versaler eller understreck. */
  if (typeof it.id !== "string" || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(it.id) ||
      it.id.length < 3 || it.id.length > 60)
    e.push(at("id måste vara kebab-case, 3–60 tecken"));

  if (!isText(it.title) || it.title.length > 200) e.push(at("title måste vara icke-tom, ≤ 200 tecken"));
  if (!(it.file === null || isText(it.file))) e.push(at("file måste vara en sökväg eller null"));

  /* scope är L-3:s egen kärna: "kvantifierat omfång". En åtgärdspunkt utan
     omfång går inte att prioritera, och det var halva skälet till att de
     staplades. */
  if (!isText(it.scope)) e.push(at("scope måste vara ett kvantifierat omfång"));

  if (!isIso(it.firstSeen)) e.push(at("firstSeen måste vara åååå-mm-dd"));
  if (!isIso(it.lastSeen)) e.push(at("lastSeen måste vara åååå-mm-dd"));
  if (isIso(it.firstSeen) && isIso(it.lastSeen) && it.lastSeen < it.firstSeen)
    e.push(at("lastSeen ligger före firstSeen"));

  /* weeksOpen räknas av retron, inte ur datum: retron kan hoppa över en vecka,
     och en beräkning ur firstSeen hade då räknat upp en punkt ingen sett.
     Räknaren mäter antalet retros som OBSERVERAT punkten. */
  if (!Number.isInteger(it.weeksOpen) || it.weeksOpen < 1)
    e.push(at("weeksOpen måste vara ett heltal ≥ 1"));

  if (!STATUSES.includes(it.status)) e.push(at(`status måste vara en av ${STATUSES.join("/")}`));

  if (it.status === "resolved"){
    if (!isIso(it.resolvedAt)) e.push(at("resolved kräver resolvedAt (åååå-mm-dd)"));
    if (!isText(it.resolvedBy)) e.push(at("resolved kräver resolvedBy – vad som faktiskt åtgärdade den"));
  } else {
    if (it.resolvedAt !== null) e.push(at("öppen punkt får inte bära resolvedAt"));
    if (it.resolvedBy !== null) e.push(at("öppen punkt får inte bära resolvedBy"));
  }
  return e;
}

/* Filnivå: unika id + varje punkt. Saknad fil (null) är giltigt. */
export function validateDb(db){
  if (db === null || db === undefined) return [];
  const e = [];
  if (typeof db !== "object") return ["action_items.json: inte ett objekt"];
  const items = db.items;
  if (items === undefined) return [];
  if (!Array.isArray(items)) return ["action_items.json: items måste vara en array"];

  const sedda = new Map();
  items.forEach((it, i) => {
    e.push(...validateItem(it, i));
    const id = it && it.id;
    if (typeof id === "string" && id){
      if (sedda.has(id)) e.push(`punkt ${i} (${id}): dubblett av id, redan använt i punkt ${sedda.get(id)}`);
      else sedda.set(id, i);
    }
  });
  return e;
}

function main(){
  if (!existsSync(PATH)){
    console.log(`${PATH} saknas – inget att validera (mekanismen är ny).`);
    return 0;
  }
  let db;
  try { db = JSON.parse(readFileSync(PATH, "utf8")); }
  catch (err){ console.error(`${PATH}: trasig JSON – ${err.message}`); return 1; }

  const fel = validateDb(db);
  if (fel.length){
    console.error(`${PATH}: ${fel.length} fel`);
    for (const f of fel) console.error("  - " + f);
    return 1;
  }
  const n = (db.items || []).length;
  const öppna = (db.items || []).filter(i => i.status === "open").length;
  console.log(`${PATH}: OK – ${n} punkt(er), varav ${öppna} öppna.`);
  return 0;
}

if (import.meta.url === `file://${process.argv[1]}` ||
    process.argv[1]?.endsWith("validate-action-items.mjs"))
  process.exit(main());
