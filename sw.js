/* ============================================================================
   sw.js — service worker. Gör dashboarden användbar OFFLINE och snabbare på
   dålig uppkoppling. Registreras av assets/app.js.

   STRATEGI: nätet först, cachen som reserv – för ALLT.

   Det motsatta (cachen först) vore snabbare men farligt här: appen uppdateras
   genom att filer pushas till main, utan byggsteg och utan versionsstämpel i
   filnamnen. En cache-först-strategi skulle servera gammal app-kod tills cachen
   råkar gå ut, och en användare med gammal vparse.js mot nya rapporter får tyst
   fel parsning. Nät-först betyder att den som är online ALLTID kör senaste
   koden mot senaste datan; cachen används bara när nätet faktiskt fallerar.

   Cachen töms inte automatiskt på gamla nycklar – CACHE-namnet nedan bumpas
   manuellt om formatet på det som cachas ändras.
   ========================================================================== */
const CACHE = "vecko-agent-v1";

/* Skalet som måste finnas för att sidan ska kunna rendera offline.
   Sökvägarna är relativa till service workerns scope (GitHub Pages: /Vecko_agent/). */
const SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./assets/theme.js",
  "./assets/settings.js",
  "./assets/vparse.js",
  "./assets/vrender.js",
  "./assets/app.js",
  "./assets/themes/base.css",
  "./assets/themes/deck.css",
  "./assets/themes/nordlys.css",
  "./assets/themes/terminal.css",
  "./assets/themes/enkel.css"
];

self.addEventListener("install", e => {
  // addAll fallerar om EN fil saknas – lägg dem en och en så en felstavad
  // sökväg inte gör hela installationen misslyckad.
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(
    SHELL.map(u => c.add(u).catch(() => {}))
  )).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // GitHub-API:t (filträdet) cachas aldrig: ett gammalt träd får appen att
  // hämta rapporter som inte finns, eller missa dem som gör det.
  if (url.hostname === "api.github.com") return;

  /* CACHEN FÖRST för OFÖRÄNDERLIGA tredjepartsfiler.
     Nät-först är rätt för VÅRA filer: de pushas utan versionsstämpel i namnet,
     så cache-först skulle servera gammal kod mot ny data. Det argumentet gäller
     INTE här – jsdelivr-URL:erna är versionspinnade (chart.js@4.4.3) och Googles
     typsnittsfiler har innehållshash i sökvägen. Samma URL ger alltid samma
     byte. Att ändå gå ut på nätet varje gång kostade en rundtur per fil och
     gjorde att typsnitten kunde byta mitt i renderingen (synligt flimmer). */
  const IMMUTABLE = ["cdn.jsdelivr.net", "fonts.gstatic.com", "fonts.googleapis.com"];
  if (IMMUTABLE.indexOf(url.hostname) !== -1) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        if (res && (res.ok || res.type === "opaque")) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      }))
    );
    return;
  }

  e.respondWith(
    fetch(req)
      .then(res => {
        // Bara lyckade svar av vår egen sort sparas. Opaka svar (no-cors från
        // CDN) sparas också – de går inte att inspektera men fungerar offline.
        if (res && (res.ok || res.type === "opaque")) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req).then(hit => hit || (
        // Navigering utan träff: servera skalet så appen åtminstone startar.
        req.mode === "navigate" ? caches.match("./index.html") : undefined
      )))
  );
});
