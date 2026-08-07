#!/usr/bin/env node
/* ============================================================================
   issue-sync.mjs — vilka issues ska ÖPPNAS och vilka ska STÄNGAS.

   VARFÖR FILEN FINNS: monitorn och watchdogen öppnade issues men stängde dem
   aldrig. 2026-08-07 låg sju öppna, samtliga inaktuella — signaler från
   pappersperioden och watchdog-larm som för länge sedan var åtgärdade. En lista
   som bara växer säger ingenting om nuläget, och då slutar man läsa den.

   NYCKELN LIGGER I BRÖDTEXTEN, INTE I TITELN. Dedupen matchade tidigare på
   titel, och watchdog-titlar bär antal ("5 prissatt(a) bubblare utan
   avgörande"). Gick antalet 5 → 3 lästes det som ett NYTT problem: ett andra
   issue öppnades och det första låg kvar. Med en maskinnyckel i en HTML-kommentar
   är identiteten stabil även när formuleringen ändras, och kommentaren syns inte
   i renderad markdown.

   SÄKERHETSREGELN: ett issue UTAN markör rörs aldrig. Det är antingen
   handskrivet av en människa eller öppnat före den här mekanismen fanns, och
   att stänga något vi inte kan identifiera är värre än att låta det ligga.
   Samma sak för issues från en ANNAN källa — monitorn stänger aldrig
   watchdogens ärenden och tvärtom.

   Rena funktioner, testade i tests/run.mjs. Anropas av monitor.yml och
   watchdog.yml via dynamisk import i github-script-steget.
   ========================================================================== */

const MARKER = "vecko-key";

/* Osynlig i renderad markdown – GitHub visar inte HTML-kommentarer. */
export function keyMarker(source, key) {
  return `<!-- ${MARKER}: ${source}:${key} -->`;
}

export function parseKey(body) {
  const m = String(body == null ? "" : body).match(new RegExp("<!--\\s*" + MARKER + ":\\s*([^>]+?)\\s*-->"));
  return m ? m[1] : null;
}

/* Jämför öppna issues mot det som är LEVANDE just nu.

   `openIssues`: [{ number, title, body }] från GitHub-API:t.
   `live`:       [{ key, title, body }] — det källan rapporterar den här körningen.
   `source`:     "monitor" | "watchdog". Bara issues med den prefixen berörs.

   Returnerar { open, close }:
     open  – poster i `live` som ännu inte har ett öppet issue
     close – öppna issues vars nyckel inte längre finns i `live`

   Är `live` tom stängs allt från källan, vilket är hela poängen: "allt friskt"
   ska tömma listan, inte lämna den orörd. */
export function planIssues(openIssues, live, source) {
  const öppna = (openIssues || [])
    .map(i => ({ issue: i, key: parseKey(i && i.body) }))
    .filter(x => x.key && x.key.indexOf(source + ":") === 0)
    .map(x => ({ issue: x.issue, key: x.key.slice(source.length + 1) }));

  const levande = (live || []).filter(l => l && l.key != null);
  const levandeNycklar = new Set(levande.map(l => String(l.key)));
  const öppnaNycklar = new Set(öppna.map(x => x.key));

  return {
    open: levande.filter(l => !öppnaNycklar.has(String(l.key))),
    close: öppna.filter(x => !levandeNycklar.has(x.key))
      .map(x => ({ number: x.issue.number, key: x.key, title: x.issue.title }))
  };
}
