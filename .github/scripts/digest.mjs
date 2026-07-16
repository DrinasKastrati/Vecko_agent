#!/usr/bin/env node
/* ============================================================
   Daglig digest (LLM-FRITT, inga tokens). Bygger en kort
   sammanfattning av DAGENS rapport (vecko på måndagar, annars
   daglig) och skriver {title, body} till $RUNNER_TEMP/digest.json.
   digest.yml skapar sedan ett GitHub-issue av den -> e-postnotis.
   ============================================================ */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

export function yymmdd(d){
  const t = d instanceof Date ? d : new Date(d);
  return String(t.getUTCFullYear()).slice(2) +
    String(t.getUTCMonth() + 1).padStart(2, "0") +
    String(t.getUTCDate()).padStart(2, "0");
}

// Ren funktion: plockar marknadsläge, beslut per innehav, pending-planer
// och (för vecko) utfall ur rapport-markdown. Testas i tests/run.mjs.
export function buildDigest(md, dateISO, isWeekly){
  const clean = s => String(s || "").replace(/\*\*/g, "").replace(/~~/g, "").replace(/`/g, "").replace(/\s+/g, " ").trim();
  const out = [];
  const m1 = md.match(/\*\*Marknadsläget i korthet:?\*\*\s*([^\n|]*)/i) || md.match(/\*\*Marknadsklimat:?\*\*\s*([^\n|]*)/i);
  if (m1 && clean(m1[1])) out.push("**Marknadsläget:** " + clean(m1[1]));
  const blocks = md.split(/\n(?=##\s+Innehav\s+\d+)/i).slice(1);
  const decisions = [];
  for (const b of blocks){
    const h = b.match(/^##\s+Innehav\s+\d+:\s*(.+?)\s*\(([^/)]+)\/[^)]*\)/i);
    if (!h) continue; // t.ex. "Innehav 2: —"
    const rows = b.split("\n").filter(l => /^\s*\|.*\|\s*$/.test(l));
    let dec = "";
    if (rows.length >= 3){
      const cells = rows[2].trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(c => clean(c));
      dec = cells[cells.length - 1] || "";
    }
    const mot = (b.match(/\*\*Motivering:?\*\*\s*([^\n]*)/i) || [])[1] || "";
    decisions.push("- **" + clean(h[1]) + "** (" + h[2].trim() + "): **" + (dec || "–") + "**" + (clean(mot) ? " – " + clean(mot) : ""));
  }
  if (decisions.length) out.push("", "**Dagens beslut:**", ...decisions);
  const pend = md.match(/##\s+Pending-planer\s*\n([\s\S]*?)(?=\n##\s|$)/i);
  if (pend && clean(pend[1])) out.push("", "**Pending-planer:** " + clean(pend[1]).slice(0, 600));
  if (isWeekly){
    const facit = md.match(/\*\*Veckans portföljutfall \(50\/50\):?\*\*\s*([^\n|]*)/i);
    if (facit && clean(facit[1])) out.push("", "**Veckans utfall:** " + clean(facit[1]));
  }
  out.push("", "_Automatisk digest ur " + (isWeekly ? "veckorapporten" : "dagliga rapporten") +
    " " + dateISO + " (LLM-fri). Beslutsstöd, inte finansiell rådgivning._");
  const title = "Digest: " + (isWeekly ? "Veckorotation" : "Dagens beslut") + " " + dateISO;
  return { title, body: out.join("\n") };
}

function main(){
  const key = yymmdd(new Date());
  const dateISO = "20" + key.slice(0, 2) + "-" + key.slice(2, 4) + "-" + key.slice(4, 6);
  const weekly = "reports/weekly/veckorapport-" + key + ".md";
  const daily = "reports/daily/daglig-" + key + ".md";
  let file = null, isWeekly = false;
  if (existsSync(weekly)) { file = weekly; isWeekly = true; }
  else if (existsSync(daily)) file = daily;
  const outPath = (process.env.RUNNER_TEMP || ".") + "/digest.json";
  if (!file){
    writeFileSync(outPath, "null\n");
    console.log("Ingen rapport för idag (" + key + ") – ingen digest.");
    return;
  }
  const d = buildDigest(readFileSync(file, "utf8"), dateISO, isWeekly);
  writeFileSync(outPath, JSON.stringify(d, null, 2) + "\n");
  console.log("Digest byggd ur " + file + ": " + d.title);
}

const invokedDirectly = process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("digest.mjs");
if (invokedDirectly) main();
