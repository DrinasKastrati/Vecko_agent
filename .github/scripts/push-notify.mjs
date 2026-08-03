#!/usr/bin/env node
/* ============================================================================
   push-notify.mjs — skickar PUSH-NOTISER till telefonen när ett KÖP/SÄLJ sker.
   LLM-FRITT, ren aritmetik + krypto (se webpush.mjs). Körs av monitor.yml
   direkt efter alerts.mjs, alltså varje timme under börstid.

   VARFÖR DEN FINNS: dashboardens 🔔-knapp kunde bara visa en notis medan
   fliken låg öppen (en setInterval i app.js). På en telefon betyder det i
   praktiken aldrig – appen är stängd när signalen kommer. En äkta push måste
   skickas FRÅN en server till push-tjänsten (FCM/Mozilla), som väcker
   service workern på telefonen även när appen inte körs. Servern här är
   GitHub-runnern.

   VAD SOM UTLÖSER EN NOTIS (två källor, samma avsändare):
     1. state/alerts.json → active[]  – intradag-monitorns nivåkorsningar.
     2. state/decisions.json          – routinens KÖP/SÄLJ-rader.
        AVVAKTA/BEHÅLL notifieras ALDRIG: systemet lägger inga ordrar, så bara
        KÖP/SÄLJ är något Dren faktiskt kan behöva agera på. Samma regel som
        styr "något att göra?" i Hem-vyn – håll dem i synk.

   DEDUPE: state/push_sent.json (append-only lista med nycklar, max 400).
   FÖRSTA KÖRNINGEN SKICKAR INGENTING – den fyller bara listan. Utan det hade
   femton historiska beslut landat som femton notiser samtidigt.

   Kör:  node .github/scripts/push-notify.mjs
         node .github/scripts/push-notify.mjs --test     (en testnotis, inget annat)
         node .github/scripts/push-notify.mjs --dry-run  (visa vad som skulle skickas)
   ========================================================================== */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { sendPush } from "./webpush.mjs";

const SENT_PATH = "state/push_sent.json";
const SUBS_PATH = "state/push_subs.json";
const CFG_PATH  = "config/push.json";
const MAX_PER_RUN = 5;   // spärr mot notislavin om något går fel i en källa
const MAX_KEYS = 400;

const readJSON = (p, fallback) => {
  try { return JSON.parse(readFileSync(p, "utf8")); } catch { return fallback; }
};

/* ---- rena funktioner (testas i tests/run.mjs) ---------------------------- */

export function alertNotifications(alerts){
  return ((alerts && alerts.active) || []).map(s => ({
    key: ["alert", s.ticker, s.type, s.reason, s.level].join("|"),
    title: (s.type === "KÖP" ? "🟢 KÖP" : "🔴 SÄLJ") + " · " + s.ticker,
    body: s.reason
      + (s.level != null ? " (nivå " + s.level + ")" : "")
      + (s.price != null ? " · kurs " + s.price + (s.currency ? " " + s.currency : "") : ""),
    tag: "alert-" + s.ticker,
    url: "#hem"
  }));
}

// Bara KÖP/SÄLJ. `maxAgeDays` hindrar att en gammal rad som råkar falla ur
// dedupe-listan (den är kapad till MAX_KEYS) väcker telefonen veckor senare.
export function decisionNotifications(decisions, today = new Date(), maxAgeDays = 3){
  const rows = (decisions && decisions.decisions) || [];
  const cutoff = new Date(today.getTime() - maxAgeDays * 86400000).toISOString().slice(0, 10);
  return rows
    .filter(d => (d.action === "KÖP" || d.action === "SÄLJ") && String(d.date || "") >= cutoff)
    .map(d => ({
      key: ["beslut", d.date, d.book, d.ticker, d.action].join("|"),
      title: (d.action === "KÖP" ? "🟢 KÖP" : "🔴 SÄLJ") + " · " + d.ticker
             + (d.book === "us" ? " (US)" : ""),
      body: (d.price != null ? "Kurs " + d.price + (d.currency ? " " + d.currency : "") + ". " : "")
            + String(d.reason || "").slice(0, 140),
      tag: "beslut-" + d.ticker,
      url: d.book === "us" ? "#us" : "#oversikt"
    }));
}

export function pending(notifications, sentKeys, max = MAX_PER_RUN){
  const seen = new Set(sentKeys || []);
  const out = [];
  for (const n of notifications) if (!seen.has(n.key) && !out.some(o => o.key === n.key)) out.push(n);
  return out.slice(0, max);
}

/* ---- drift -------------------------------------------------------------- */

function loadSubscriptions(){
  // Två vägar, medvetet båda: hemligheten är privat men måste klistras in för
  // hand, repo-filen fylls med ett knapptryck i appen men är publik (endpointen
  // är dock oanvändbar utan VAPID-nyckeln – push-tjänsten avvisar osignerat).
  const subs = [];
  const env = process.env.PUSH_SUBSCRIPTIONS;
  if (env && env.trim()){
    try {
      const parsed = JSON.parse(env);
      for (const s of (Array.isArray(parsed) ? parsed : [parsed])) subs.push(s);
    } catch (e) { console.error("PUSH_SUBSCRIPTIONS kunde inte tolkas som JSON – hoppar över den."); }
  }
  const file = readJSON(SUBS_PATH, { subscriptions: [] });
  for (const s of (file.subscriptions || [])) subs.push(s);
  // Samma endpoint kan ligga i båda – skicka bara en gång.
  const byEndpoint = new Map();
  for (const s of subs) if (s && s.endpoint && s.keys && s.keys.p256dh && s.keys.auth) byEndpoint.set(s.endpoint, s);
  return [...byEndpoint.values()];
}

function dropGone(endpoints){
  if (!endpoints.length || !existsSync(SUBS_PATH)) return;
  const file = readJSON(SUBS_PATH, { subscriptions: [] });
  const before = (file.subscriptions || []).length;
  file.subscriptions = (file.subscriptions || []).filter(s => !endpoints.includes(s.endpoint));
  if (file.subscriptions.length !== before){
    file.updatedAt = new Date().toISOString();
    writeFileSync(SUBS_PATH, JSON.stringify(file, null, 2) + "\n");
    console.log(`Tog bort ${before - file.subscriptions.length} död(a) prenumeration(er).`);
  }
}

export async function run(argv = []){
  const test = argv.includes("--test");
  const dry  = argv.includes("--dry-run");

  const cfg = readJSON(CFG_PATH, {});
  const vapid = {
    publicKey: process.env.VAPID_PUBLIC_KEY || cfg.vapidPublicKey || "",
    privateKey: process.env.VAPID_PRIVATE_KEY || "",
    subject: cfg.subject || "mailto:kastratidrinas@gmail.com"
  };
  const subs = loadSubscriptions();

  if (!subs.length){ console.log("Inga prenumerationer – inget att skicka. (Tryck 🔔 i appen först.)"); return { sent: 0 }; }
  if (!vapid.publicKey || !vapid.privateKey){
    // Inte ett fel: repot fungerar utan push. Men det ska SYNAS i loggen,
    // annars ser en tyst körning likadan ut som en fungerande.
    console.log("VAPID-nycklar saknas (VAPID_PRIVATE_KEY-secret + config/push.json) – hoppar över push.");
    return { sent: 0 };
  }

  const sentFile = readJSON(SENT_PATH, null);
  const firstRun = sentFile === null;
  const sentKeys = (sentFile && sentFile.keys) || [];

  let queue;
  if (test){
    queue = [{ key: "test|" + Date.now(), title: "🔔 Testnotis", tag: "test",
               body: "Push fungerar. Riktiga notiser kommer vid KÖP/SÄLJ.", url: "#hem" }];
  } else {
    const all = [...alertNotifications(readJSON("state/alerts.json", {})),
                 ...decisionNotifications(readJSON("state/decisions.json", {}))];
    queue = pending(all, sentKeys);
    if (firstRun){
      // Fyll listan, skicka inget. Se filhuvudet. (--dry-run rör ingen fil.)
      if (!dry) writeFileSync(SENT_PATH, JSON.stringify({ updatedAt: new Date().toISOString(),
        keys: all.map(n => n.key).slice(-MAX_KEYS) }, null, 2) + "\n");
      console.log(`Första körningen: ${all.length} befintliga händelser markerade som redan sedda, inga notiser skickade.`);
      return { sent: 0, firstRun: true };
    }
  }

  if (!queue.length){ console.log("Inga nya KÖP/SÄLJ – inga notiser."); return { sent: 0 }; }
  if (dry){ console.log("DRY RUN – skulle skicka:\n" + queue.map(n => "  " + n.title + " — " + n.body).join("\n")); return { sent: 0, dry: queue.length }; }

  let sent = 0; const gone = [];
  for (const n of queue){
    const payload = JSON.stringify({ title: n.title, body: n.body, tag: n.tag, url: n.url, ts: Date.now() });
    for (const sub of subs){
      try {
        const r = await sendPush(sub, payload, vapid);
        if (r.ok) { sent++; }
        else if (r.gone) { gone.push(r.endpoint); console.log("Död prenumeration (" + r.status + ")."); }
        else console.error("Push misslyckades:", r.status, r.detail);
      } catch (e){ console.error("Push-fel:", e && e.message); }
    }
  }
  dropGone([...new Set(gone)]);

  if (!test){
    const keys = [...sentKeys, ...queue.map(n => n.key)].slice(-MAX_KEYS);
    writeFileSync(SENT_PATH, JSON.stringify({ updatedAt: new Date().toISOString(), keys }, null, 2) + "\n");
  }
  console.log(`Skickade ${sent} notis(er) till ${subs.length} enhet(er).`);
  return { sent };
}

const invokedDirectly = process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("push-notify.mjs");
if (invokedDirectly){
  mkdirSync("state", { recursive: true });
  run(process.argv.slice(2)).catch(e => { console.error("Fel:", e); process.exit(1); });
}
