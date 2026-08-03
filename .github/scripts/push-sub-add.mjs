#!/usr/bin/env node
/* ============================================================================
   push-sub-add.mjs — lägger en push-prenumeration i state/push_subs.json.
   Anropas av push_subscribe.yml när ÄGAREN öppnar ett issue "push: <enhet>"
   med prenumerationens JSON i kroppen. Samma nyckellösa mönster som
   analys_queue.yml (issue -> Action -> statefil -> stängt issue).

   Kör:  node .github/scripts/push-sub-add.mjs <issue-kropp> <etikett>
         (kroppen läses från argv[2] eller stdin)

   OM PUBLICITETEN: filen ligger i ett publikt repo. En endpoint är ändå
   oanvändbar för en utomstående – push-tjänsten kräver att varje anrop är
   signerat med den VAPID-privatnyckel som prenumerationen skapades mot, och
   den ligger som hemlighet. Vill man ändå inte publicera endpointen: hoppa
   över det här flödet och lägg hela JSON:en i hemligheten PUSH_SUBSCRIPTIONS
   i stället – push-notify.mjs läser båda.
   ========================================================================== */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const PATH = "state/push_subs.json";
const MAX_SUBS = 10;   // en person, några enheter – fler är ett tecken på fel

// Plockar ut första JSON-objektet ur en issue-kropp (med eller utan ```-block).
export function parseSubscription(body){
  const src = String(body || "");
  const fenced = src.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : src.slice(src.indexOf("{"), src.lastIndexOf("}") + 1);
  let sub;
  try { sub = JSON.parse(raw); } catch { throw new Error("Hittade ingen giltig JSON i issue-kroppen."); }
  return validate(sub);
}

export function validate(sub){
  if (!sub || typeof sub.endpoint !== "string") throw new Error("Saknar endpoint.");
  let u;
  try { u = new URL(sub.endpoint); } catch { throw new Error("endpoint är ingen giltig URL."); }
  if (u.protocol !== "https:") throw new Error("endpoint måste vara https.");
  const k = sub.keys || {};
  const len = s => { try { return Buffer.from(String(s).replace(/-/g, "+").replace(/_/g, "/"), "base64").length; } catch { return 0; } };
  // 65 byte = okomprimerad P-256-punkt, 16 byte = auth-hemlighet (RFC 8291).
  if (len(k.p256dh) !== 65) throw new Error("keys.p256dh ska vara 65 byte (base64url).");
  if (len(k.auth) !== 16) throw new Error("keys.auth ska vara 16 byte (base64url).");
  return { endpoint: sub.endpoint, keys: { p256dh: k.p256dh, auth: k.auth } };
}

export function upsert(file, sub, label, nowISO){
  const subs = (file && file.subscriptions) || [];
  const kept = subs.filter(s => s.endpoint !== sub.endpoint);
  kept.push(Object.assign({}, sub, { label: label || "enhet", addedAt: nowISO }));
  return { updatedAt: nowISO, subscriptions: kept.slice(-MAX_SUBS) };
}

const invokedDirectly = process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("push-sub-add.mjs");
if (invokedDirectly){
  const body = process.argv[2] || readFileSync(0, "utf8");
  const label = (process.argv[3] || "enhet").slice(0, 40);
  const sub = parseSubscription(body);
  const file = existsSync(PATH) ? JSON.parse(readFileSync(PATH, "utf8")) : { subscriptions: [] };
  writeFileSync(PATH, JSON.stringify(upsert(file, sub, label, new Date().toISOString()), null, 2) + "\n");
  console.log("Registrerade prenumeration för " + label + " (" + new URL(sub.endpoint).host + ").");
}
