#!/usr/bin/env node
/* ============================================================
   Watchdog (LLM-FRITT, inga tokens). Flaggar TYSTA fel:
   - state/prices.json äldre än 26 h på en vardag (pris-actionen nere)
   - dagens nordiska rapport saknas (routinen/appen har inte kört,
     eller inget har pushats)
   - dagens scout-rapport saknas
   - state/alerts.json:s checkedAt äldre än 6 h på en vardag (intradag-
     monitorn nere – utan den larmar inget mellan routinekörningarna)
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
// latestDecisionDate/newsGeneratedAt är valfria – utelämnas de görs ingen
// kontroll (håller äldre anrop bakåtkompatibla).
export function checkStale(opts){
  const { now, pricesGeneratedAt, latestDaily, latestWeekly, latestScout } = opts;
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

  // Beslutsloggen: en pushad rapport UTAN motsvarande rad i decisions.json betyder
  // att routinen hoppade över loggningen – då dör kalibreringsunderlaget tyst.
  if ("latestDecisionDate" in opts && nordic === today && opts.latestDecisionDate !== today)
    problems.push({ key: "decisions", title: "Watchdog: beslutsloggen saknar dagens rader",
      body: "Dagens rapport är pushad men `state/decisions.json` har ingen rad för idag (senaste: " +
        (opts.latestDecisionDate || "ingen") + "). Rotationsprompterna kräver en rad per beslut, " +
        "även AVVAKTA – utan dem kan retrons beslutsstatistik aldrig kalibrera poängvikterna." });

  // Intradag-monitorn: alerts.mjs stämplar checkedAt minst var 3:e timme under
  // börstid (07-20 UTC vardagar). Watchdogen kör 10:30 UTC, då är färskaste
  // tillåtna hjärtslag ~3,5 h gammalt – 6 h ger marginal och fångar ändå en
  // monitor som dött. Kontrollen finns för att en tyst död monitor annars är
  // OSYNLIG: filen ser likadan ut som "frisk monitor utan signaler".
  if ("alertsCheckedAt" in opts){
    const at = opts.alertsCheckedAt ? Date.parse(opts.alertsCheckedAt) : NaN;
    if (isNaN(at) || (n.getTime() - at) > 6 * 3600 * 1000)
      problems.push({ key: "alerts", title: "Watchdog: intradag-monitorn har tystnat",
        body: "`state/alerts.json` har checkedAt `" + (opts.alertsCheckedAt || "saknas") +
          "` (äldre än 6 h på en vardag). Kontrollera Actions → \"Intradag-monitor\". " +
          "Utan monitorn larmar ingenting när ett innehav korsar stop-loss eller mål " +
          "mellan routinekörningarna. Saknas fältet helt kör actionen en version av " +
          "`alerts.mjs` som är äldre än hjärtslags-fixen." });
  }

  // Veckans rörelser: movers.yml kör lördagar. Filen är miss-retrons PRIMÄRA missdetektion,
  // så en död action gör att retron tyst tappar hela sin breddsökning. 9 dygn = en hel
  // lördagskörning har uteblivit (7 dygn + marginal för sen körning).
  if ("moversGeneratedAt" in opts){
    const mt = opts.moversGeneratedAt ? Date.parse(opts.moversGeneratedAt) : NaN;
    if (isNaN(mt) || (n.getTime() - mt) > 9 * 24 * 3600 * 1000)
      problems.push({ key: "movers", title: "Watchdog: movers.json är inaktuell",
        body: "`state/movers.json` har generatedAt `" + (opts.moversGeneratedAt || "saknas") +
          "` (äldre än 9 dygn). Kontrollera Actions → \"Veckans rörelser\". Utan filen faller " +
          "miss-retron tillbaka på `price_history.json`, som bara täcker de ~10 bevakade " +
          "nordiska tickerna och därför per konstruktion inte kan hitta en miss utanför dem." });
  }

  // Nyhetsflödet: news.yml kör varannan timme vardagar, så >6 h = actionen är nere.
  if ("newsGeneratedAt" in opts){
    const nt = opts.newsGeneratedAt ? Date.parse(opts.newsGeneratedAt) : NaN;
    if (isNaN(nt) || (n.getTime() - nt) > 6 * 3600 * 1000)
      problems.push({ key: "news", title: "Watchdog: news_feed.json är inaktuell",
        body: "`state/news_feed.json` har generatedAt `" + (opts.newsGeneratedAt || "saknas") +
          "` (äldre än 6 h på en vardag). Kontrollera Actions → \"Hämta nyheter\" och " +
          "`feeds`-statusen i filen – routinerna använder den som PRIMÄR nyhetsradar." });
  }

  return problems;
}

// Senaste datum i decisions.json som yymmdd, eller null.
export function latestDecisionYmd(db){
  const rows = (db && db.decisions) || [];
  let best = null;
  for (const r of rows){
    const m = String(r && r.date || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) continue;
    const ymd = m[1].slice(2) + m[2] + m[3];
    if (!best || ymd > best) best = ymd;
  }
  return best;
}

function main(){
  let gen = null;
  try { gen = JSON.parse(readFileSync("state/prices.json", "utf8")).generatedAt || null; } catch {}
  let newsGen = null;
  try { newsGen = JSON.parse(readFileSync("state/news_feed.json", "utf8")).generatedAt || null; } catch {}
  let decisions = null;
  try { decisions = latestDecisionYmd(JSON.parse(readFileSync("state/decisions.json", "utf8"))); } catch {}
  let moversAt = null;
  try { moversAt = JSON.parse(readFileSync("state/movers.json", "utf8")).generatedAt || null; } catch {}
  let alertsAt = null;
  try {
    const a = JSON.parse(readFileSync("state/alerts.json", "utf8"));
    alertsAt = a.checkedAt || null;   // generatedAt duger INTE – se checkStale
  } catch {}
  const ls = d => { try { return readdirSync(d); } catch { return []; } };
  const problems = checkStale({
    now: new Date(),
    pricesGeneratedAt: gen,
    latestDaily: latestReportDate(ls("reports/daily"), "daglig"),
    latestWeekly: latestReportDate(ls("reports/weekly"), "veckorapport"),
    latestScout: latestReportDate(ls("reports/scout"), "rapport"),
    latestDecisionDate: decisions,
    alertsCheckedAt: alertsAt,
    moversGeneratedAt: moversAt,
    newsGeneratedAt: newsGen
  });
  writeFileSync((process.env.RUNNER_TEMP || ".") + "/watchdog.json", JSON.stringify(problems, null, 2) + "\n");
  console.log(problems.length ? "Problem:\n" + problems.map(p => "- " + p.title).join("\n") : "Allt friskt.");
}

const invokedDirectly = process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("watchdog.mjs");
if (invokedDirectly) main();
