#!/usr/bin/env node
/* ============================================================================
   vapid-keys.mjs — engångsskript: skapar VAPID-nyckelparet som identifierar
   avsändaren mot push-tjänsterna (RFC 8292).

   Kör:  node .github/scripts/vapid-keys.mjs

   Den PUBLIKA nyckeln skrivs till config/push.json och committas – den ska
   vara publik, appen skickar den till push-tjänsten vid prenumeration.

   Den PRIVATA nyckeln SKRIVS ALDRIG UT och committas aldrig. Den läggs i
   .env, som är gitignorerad. Därifrån klistras den in som GitHub-hemlighet
   VAPID_PRIVATE_KEY (Settings -> Secrets and variables -> Actions -> New
   repository secret). Att den inte skrivs till terminalen är medvetet: en
   utskriven hemlighet hamnar i skrollbufferten, i loggar och i eventuella
   chattranskript.

   BYT ALDRIG NYCKELPAR I ONÖDAN: befintliga prenumerationer är bundna till
   den publika nyckeln de skapades med. Ett nytt par gör alla registrerade
   enheter tysta tills de tryckt 🔔 igen.
   ========================================================================== */
import { readFileSync, writeFileSync, appendFileSync, existsSync } from "node:fs";
import { generateVapidKeys } from "./webpush.mjs";

const CFG = "config/push.json";
const ENV = ".env";
const cfg = existsSync(CFG) ? JSON.parse(readFileSync(CFG, "utf8")) : {};

if (cfg.vapidPublicKey && !process.argv.includes("--force")){
  console.error("config/push.json har redan en publik nyckel:\n  " + cfg.vapidPublicKey +
    "\n\nEtt nytt par gör ALLA registrerade enheter tysta tills de prenumererar om." +
    "\nKör med --force om du verkligen vill byta.");
  process.exit(1);
}

const { publicKey, privateKey } = generateVapidKeys();
cfg.vapidPublicKey = publicKey;
cfg.subject = cfg.subject || "mailto:kastratidrinas@gmail.com";
writeFileSync(CFG, JSON.stringify(cfg, null, 2) + "\n");

// .env är gitignorerad. Lägg till, skriv inte över – filen kan ha annat i sig.
const prev = existsSync(ENV) ? readFileSync(ENV, "utf8") : "";
appendFileSync(ENV, (prev && !prev.endsWith("\n") ? "\n" : "") +
  "# VAPID-privatnyckel för push-notiser. Klistra in som GitHub-hemlighet\n" +
  "# VAPID_PRIVATE_KEY. Filen är gitignorerad och ska aldrig committas.\n" +
  "VAPID_PRIVATE_KEY=" + privateKey + "\n");

console.log("Publik nyckel skriven till " + CFG + " (committa den):\n  " + publicKey);
console.log("\nPRIVAT nyckel skriven till " + ENV + " (gitignorerad, skrivs medvetet inte ut här).");
console.log("Nästa steg:");
console.log("  1. Öppna .env och kopiera värdet efter VAPID_PRIVATE_KEY=");
console.log("  2. GitHub -> Settings -> Secrets and variables -> Actions -> New repository secret");
console.log("     Namn: VAPID_PRIVATE_KEY");
console.log("  3. push.bat, sedan 🔔 i appen på telefonen.\n");
