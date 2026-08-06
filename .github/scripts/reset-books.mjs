#!/usr/bin/env node
/* ============================================================
   reset-books.mjs — nollställer portföljböckerna inför en skarp
   start med riktiga pengar.

   Kör:  node .github/scripts/reset-books.mjs              (torrkörning)
         node .github/scripts/reset-books.mjs --apply      (utför)
         node .github/scripts/reset-books.mjs --apply --force
         node .github/scripts/reset-books.mjs --start=2026-08-10

   Designen står i docs/superpowers/specs/2026-08-06-nollstallning-
   skarp-start-design.md. Tre saker i den som INTE får luckras upp:

   1. TORRKÖRNING ÄR STANDARD. Operationen skriver över bokförda data
      i arbetskopian och kan bara ångras via git. Utan --apply skrivs
      ingenting.
   2. TABELLHUVUDENA ÅTERANVÄNDS UR DEN BEFINTLIGA FILEN, de skrivs
      aldrig av skriptet. Kolumnuppsättningen är dashboardens
      parsningskontrakt (assets/vparse.js:parsePortfolio) och skiljer
      sig mellan böckerna; en hårdkodad rubrikrad här skulle tyst
      driva isär från det vparse.js faktiskt läser.
   3. INGA RADER SKRIVS I decisions.json. Beslutsloggen mäter om
      URVALET slår index och löper vidare över snittet. Att bokföra
      en SÄLJ för positioner som aldrig ägdes på riktigt skulle
      förgifta just den mätningen. Snittet markeras i live_start.json.
   ============================================================ */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

export const BOOKS = [
  { key: "nordic", file: "state/portfolj.md",    archive: "state/archive/portfolj-paper-{yymmdd}.md" },
  { key: "us",     file: "state/portfolj_us.md", archive: "state/archive/portfolj_us-paper-{yymmdd}.md" }
];
export const LIVE_START = "state/live_start.json";

// ---- små hjälpare -------------------------------------------------------

// Nästa måndag från `d`. Är `d` redan en måndag returneras den dagen.
export function nextMonday(d){
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  x.setUTCDate(x.getUTCDate() + ((8 - x.getUTCDay()) % 7));
  return x.toISOString().slice(0, 10);
}

export const yymmdd = iso => iso.slice(2, 4) + iso.slice(5, 7) + iso.slice(8, 10);

// ISO-vecka, för "v 33" i allocation.json.
export function isoWeek(iso){
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const jan1 = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - jan1) / 86400000 + 1) / 7);
}

// En platshållarrad med lika många kolumner som tabellhuvudet.
export function placeholderRow(headerLine){
  const n = headerLine.split("|").length - 2;
  return "| " + Array(Math.max(n, 1)).fill("–").join(" | ") + " |";
}

// Tabellhuvudet (rubrikrad + separatorrad) som följer efter rad `from`.
// Returnerar null om ingen tabell hittas innan nästa rubrik.
export function tableHeaderAfter(lines, from){
  for (let i = from; i < lines.length; i++){
    const t = lines[i].trim();
    if (/^#{2,3}\s/.test(t) && i > from) return null;
    if (t.startsWith("|") && (lines[i + 1] || "").trim().startsWith("|"))
      return { header: lines[i], sep: lines[i + 1], at: i };
  }
  return null;
}

// ---- pappersperiodens facit --------------------------------------------

export function paperStats(md){
  const accum = (md.match(/\*\*Ackumulerad avkastning sedan start:\*\*\s*([+\-−]?[\d.,]+\s*%)/) || [])[1] || null;
  const lines = md.split(/\r?\n/);
  const hi = lines.findIndex(l => /^##\s*Historik/i.test(l.trim()));
  let closed = 0;
  if (hi >= 0){
    const h = tableHeaderAfter(lines, hi);
    if (h) for (let i = h.at + 2; i < lines.length; i++){
      const t = lines[i].trim();
      if (!t.startsWith("|")) break;
      const cells = t.split("|").slice(1, -1).map(c => c.trim());
      if (cells.some(c => c && !/^[–\-~]+$/.test(c))) closed++;
    }
  }
  return { accum: accum ? accum.replace(/\s+/g, " ").trim() : null, closedTrades: closed };
}

// ---- själva ombyggnaden -------------------------------------------------

/* Bygger en tom bok av samma FORM som den befintliga. Rubriker och
   tabellhuvuden återanvänds ordagrant; bara innehållet töms. */
export function buildResetBook(md, opts){
  const { startDate, resetAt, archivePath, week } = opts;
  const lines = md.split(/\r?\n/);
  const find = re => lines.findIndex(l => re.test(l.trim()));

  const iTitle    = find(/^#\s/);
  const iUpdated  = lines.findIndex(l => /^\*\*Senast uppdaterad:\*\*/.test(l.trim()));
  const iAccum    = lines.findIndex(l => /^\*\*Ackumulerad avkastning sedan start:\*\*/.test(l.trim()));
  const iHold     = find(/^##\s*Aktuellt innehav/i);
  const iPend     = find(/^###\s*Pending/i);
  const iCash     = find(/^##\s*Kassa/i);
  const iHist     = find(/^##\s*Historik/i);

  const missing = [];
  if (iTitle < 0) missing.push("rubrik");
  if (iUpdated < 0) missing.push("Senast uppdaterad");
  if (iAccum < 0) missing.push("Ackumulerad avkastning sedan start");
  if (iHold < 0) missing.push("## Aktuellt innehav");
  if (iPend < 0) missing.push("### Pending");
  if (iCash < 0) missing.push("## Kassa");
  if (iHist < 0) missing.push("## Historik");
  if (missing.length) throw new Error(`portföljfilen saknar: ${missing.join(", ")}`);

  const hHold = tableHeaderAfter(lines, iHold);
  const hPend = tableHeaderAfter(lines, iPend);
  const hHist = tableHeaderAfter(lines, iHist);
  if (!hHold || !hPend || !hHist)
    throw new Error("kunde inte hitta tabellhuvudet i innehav/pending/historik");

  // Allt efter historik-tabellens sista rad är sidfot och följer med orört.
  let footFrom = hHist.at + 2;
  while (footFrom < lines.length && lines[footFrom].trim().startsWith("|")) footFrom++;
  const footer = lines.slice(footFrom).join("\n").replace(/^\n+/, "");

  const stats = paperStats(md);
  const out = [];
  out.push(lines[iTitle]);
  out.push(`**Senast uppdaterad:** ${resetAt} (NOLLSTÄLLD inför skarp start med riktiga ` +
    `pengar ${startDate}. Boken är tom: noll innehav, noll pending-planer, 100 % kassa och tom ` +
    `historik. Pappersperioden ligger oförändrad i \`${archivePath}\` och dess facit i ` +
    `\`${LIVE_START}\`. Kapitalmodellen är OFÖRÄNDRAD – boken räknar fortsatt i vikt-%, inte i ` +
    `belopp. Vad som köps avgörs helt av v${week}-rotationen (LÄGE A), indexsleeven inkluderad; ` +
    `inga positioner följde med över snittet, så en tidigare innehavd aktie måste väljas på nytt ` +
    `mot de fem grindarna. \`state/decisions.json\` och \`state/decision_eval.json\` nollställdes ` +
    `INTE – de mäter om urvalet slår index, vilket är oberoende av om pengarna var riktiga.)`);
  out.push(`**Ackumulerad avkastning sedan start:** +0,00 % (noll stängda affärer – skarp start ` +
    `${startDate}. Pappersperioden 2026-07-14–2026-08-06 slutade på ${stats.accum || "n/a"} på ` +
    `${stats.closedTrades} stängd(a) affär(er) och räknas INTE in här; den ligger i \`${archivePath}\`.)`);
  out.push("");
  out.push(lines[iHold]);
  out.push(hHold.header, hHold.sep, placeholderRow(hHold.header));
  out.push("");
  out.push(`### Pending veckorotation v${week} (ingen plan lagd – v${week}-rotationen ${startDate} avgör)`);
  out.push(hPend.header, hPend.sep, placeholderRow(hPend.header));
  out.push("");
  out.push("*Pappersperiodens pending-planer följde INTE med över snittet: de var prissatta mot ett " +
    "annat kapital och får inte trigga i skarp drift. De finns kvar i arkivfilen.*");
  out.push("");
  out.push(lines[iCash]);
  out.push(`100 % – hela kapitalet är oallokerat vid den skarpa starten. Fördelningen avgörs av ` +
    `v${week}-rotationen ${startDate} (LÄGE A), som också beslutar om indexsleeven enligt ` +
    `sleeve-regeln att oallokerat kapital aldrig ligger kvar på konto.`);
  out.push("");
  out.push(lines[iHist]);
  out.push(hHist.header, hHist.sep, placeholderRow(hHist.header));
  if (footer) out.push("", footer);
  return out.join("\n").replace(/\n*$/, "\n");
}

export function buildAllocation(prev, opts){
  const { startDate, resetAt, week } = opts;
  return {
    updatedAt: resetAt,
    week: `v ${week}`,
    nordic: 0.50,
    us: 0.50,
    rationale: `Standardläget 50/50 vid den skarpa starten ${startDate}. Båda böckerna ` +
      `nollställdes inför övergången till riktiga pengar och står på 100 % kassa utan innehav, ` +
      `så det finns per definition inget lägesberoende skäl att övervikta någon av dem: ` +
      `sleeve-mätaren, antalet levande utlösare och case-kvaliteten är identiska (noll) i båda. ` +
      `Fördelningen prövas första gången av allokeringsroutinen måndag ${startDate} 15:30 CEST, ` +
      `efter att BÅDA veckorotationerna kört och det finns faktiska case att väga mot varandra. ` +
      `Föregående fördelning (${typeof prev?.nordic === "number" ? Math.round(prev.nordic * 100) : "?"}/` +
      `${typeof prev?.us === "number" ? Math.round(prev.us * 100) : "?"}, ${prev?.week || "?"}) ` +
      `gällde pappersperioden och bärs inte över.`
  };
}

export function buildLiveStart(opts, stats){
  const { startDate, resetAt } = opts;
  return {
    startDate,
    note: "Skarp start med riktiga pengar. Pappersperioden 2026-07-14–2026-08-06 arkiverad; " +
          "portföljstatistiken nollställd, beslutsloggen (decisions.json + decision_eval.json) " +
          "löper vidare över snittet eftersom den mäter urvalet mot index, inte pengarnas utfall.",
    resetAt,
    archived: Object.fromEntries(stats.map(s => [s.key, s.archivePath])),
    paperStats: {
      ...Object.fromEntries(stats.map(s => [s.key, s.accum])),
      closedTrades: stats.reduce((n, s) => n + s.closedTrades, 0)
    }
  };
}

/* Räknar ut allt som ska skrivas UTAN att röra disken. Returnerar
   { writes: [{path, content}], stats } så torrkörningen och den skarpa
   körningen bevisligen producerar samma sak. */
export function planReset(read, opts){
  const stats = [];
  const writes = [];
  for (const b of BOOKS){
    const md = read(b.file);
    if (md == null) throw new Error(`${b.file} saknas`);
    const archivePath = b.archive.replace("{yymmdd}", yymmdd(opts.startDate));
    const ps = paperStats(md);
    stats.push({ key: b.key, archivePath, ...ps });
    writes.push({ path: archivePath, content: md, kind: "arkiv" });
    writes.push({ path: b.file, content: buildResetBook(md, { ...opts, archivePath }), kind: "nollställd" });
  }
  const prevAlloc = JSON.parse(read("state/allocation.json") || "null");
  writes.push({ path: "state/allocation.json", kind: "nollställd",
                content: JSON.stringify(buildAllocation(prevAlloc, opts), null, 2) + "\n" });
  writes.push({ path: LIVE_START, kind: "ny",
                content: JSON.stringify(buildLiveStart(opts, stats), null, 2) + "\n" });
  return { writes, stats };
}

// ---- CLI ----------------------------------------------------------------

function main(argv){
  const apply = argv.includes("--apply");
  const force = argv.includes("--force");
  const startArg = (argv.find(a => a.startsWith("--start=")) || "").split("=")[1];
  const startDate = startArg || nextMonday(new Date());
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)){
    console.error(`FEL: --start måste vara åååå-mm-dd (fick "${startDate}")`);
    return 1;
  }

  const abs = p => join(ROOT, p);
  if (existsSync(abs(LIVE_START)) && !force){
    console.error(`FEL: ${LIVE_START} finns redan – böckerna är redan nollställda.`);
    console.error("     Kör med --force om du verkligen vill göra om det.");
    return 1;
  }

  const opts = { startDate, resetAt: new Date().toISOString().replace(/\.\d+Z$/, "Z"),
                 week: isoWeek(startDate) };
  const read = p => existsSync(abs(p)) ? readFileSync(abs(p), "utf8") : null;

  let plan;
  try { plan = planReset(read, opts); }
  catch (e){ console.error("FEL:", e.message); return 1; }

  console.log(`Skarp start: ${startDate} (v${opts.week})`);
  for (const s of plan.stats)
    console.log(`  ${s.key.padEnd(7)} pappersfacit ${s.accum || "n/a"} på ${s.closedTrades} stängd(a) affär(er)`);
  console.log("");
  for (const w of plan.writes)
    console.log(`  ${w.kind.padEnd(11)} ${w.path}  (${w.content.length} tecken)`);
  console.log("");
  console.log("  ORÖRDA: state/decisions.json, state/decision_eval.json, reports/**, prompts/**");

  if (!apply){
    console.log("\nTORRKÖRNING – ingenting skrevs. Kör om med --apply för att utföra.");
    return 0;
  }

  mkdirSync(abs("state/archive"), { recursive: true });
  for (const w of plan.writes) writeFileSync(abs(w.path), w.content, "utf8");
  console.log(`\nKLART – ${plan.writes.length} filer skrivna.`);
  console.log("Granska med `git diff` och `git status`, kör testerna, pusha sedan med push.bat.");
  return 0;
}

if (import.meta.url === `file://${process.argv[1]}` ||
    process.argv[1]?.endsWith("reset-books.mjs"))
  process.exit(main(process.argv.slice(2)));
