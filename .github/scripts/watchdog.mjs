#!/usr/bin/env node
/* ============================================================
   Watchdog (LLM-FRITT, inga tokens). Flaggar TYSTA fel:
   - state/prices.json äldre än 26 h på en vardag (pris-actionen nere)
   - dagens nordiska rapport saknas (routinen/appen har inte kört,
     eller inget har pushats)
   - dagens scout-rapport saknas
   Skriver problemlista till $RUNNER_TEMP/watchdog.json; watchdog.yml
   öppnar issues (med dedupe mot redan öppna).
   ============================================================ */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

// Senaste rapportdatum (yymmdd) bland filnamn med givet prefix, eller null.
export function latestReportDate(files, prefix){
  let best = null;
  for (const f of files || []){
    const m = String(f).match(new RegExp("^" + prefix + "-(\\d{6})(?:_\\d+)?\\.md$", "i"));
    if (m && (!best || m[1] > best)) best = m[1];
  }
  return best;
}

// Ren funktion (testas i tests/run.mjs): avgör vilka larm som ska öppnas.
export function checkStale({ now, pricesGeneratedAt, latestDaily, latestWeekly, latestScout }){
  const problems = [];
  const n = now instanceof Date ? now : new Date(now);
  const dow = n.getUTCDay();
  const weekday = dow >= 1 && dow <= 5;
  if (!weekday) return problems; // helg: allt får vara tyst
  const today = String(n.getUTCFullYear()).slice(2) +
    String(n.getUTCMonth() + 1).padStart(2, "0") +
    String(n.getUTCDate()).padStart(2, "0");

  const t = pricesGeneratedAt ? Date.parse(pricesGeneratedAt) : NaN;
  if (isNaN(t) || (n.getTime() - t) > 26 * 3600 * 1000)
    problems.push({ key: "prices", title: "Watchdog: prices.json är inaktuell",
      body: "`state/prices.json` har generatedAt `" + (pricesGeneratedAt || "saknas") +
        "` (äldre än 26 h på en vardag). Kontrollera Actions → \"Hämta kurser (prices.json)\" – " +
        "utan färska kurser AVVAKTAR routinen korrekt men fattar inga kursbaserade beslut." });

  const nordic = [latestDaily, latestWeekly].filter(Boolean).sort().pop() || null;
  if (nordic !== today)
    problems.push({ key: "daily", title: "Watchdog: dagens nordiska rapport saknas",
      body: "Ingen daglig-/veckorapport för idag är pushad (senaste: " + (nordic || "ingen") + "). " +
        "Vanligaste orsakerna: Claude-appen var inte igång vid 08:40, eller rapporten är skriven " +
        "lokalt men inte pushad (kör push.bat / kontrollera auto-push-tasken)." });

  if (latestScout !== today)
    problems.push({ key: "scout", title: "Watchdog: dagens scout-rapport saknas",
      body: "Ingen scout-rapport för idag är pushad (senaste: " + (latestScout || "ingen") + "). " +
        "Var Claude-appen igång vid 07:47? Är rapporten skriven men inte pushad?" });

  return problems;
}

function main(){
  let gen = null;
  try { gen = JSON.parse(readFileSync("state/prices.json", "utf8")).generatedAt || null; } catch {}
  const ls = d => { try { return readdirSync(d); } catch { return []; } };
  const problems = checkStale({
    now: new Date(),
    pricesGeneratedAt: gen,
    latestDaily: latestReportDate(ls("reports/daily"), "daglig"),
    latestWeekly: latestReportDate(ls("reports/weekly"), "veckorapport"),
    latestScout: latestReportDate(ls("reports/scout"), "rapport")
  });
  writeFileSync((process.env.RUNNER_TEMP || ".") + "/watchdog.json", JSON.stringify(problems, null, 2) + "\n");
  console.log(problems.length ? "Problem:\n" + problems.map(p => "- " + p.title).join("\n") : "Allt friskt.");
}

const invokedDirectly = process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("watchdog.mjs");
if (invokedDirectly) main();
