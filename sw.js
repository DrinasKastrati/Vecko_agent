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
// v4 (2026-08-04): index.html fick två nya behållare – "candidates" (kandidatkön
// i Scout-vyn) och "earningsSoon" (rapporter på väg i Översikt). app.js renderar
// till dem, så ett cachat skal från v3 saknar dem. Strategin är nät-först och
// renderingen är null-säkrad, så följden hade blivit tysta tomma rutor snarare än
// ett fel – men just det är skälet att bumpa: format på det som cachas ändrades.
const CACHE = "vecko-agent-v4";

/* Skalet som måste finnas för att sidan ska kunna rendera offline.
   Sökvägarna är relativa till service workerns scope (GitHub Pages: /Vecko_agent/). */
const SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  // Notisikonerna: hämtas av systemet när en notis visas, ofta utan nät.
  "./assets/icon-192.png",
  "./assets/badge-96.png",
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

/* ============================================================================
   PUSH-NOTISER (KÖP/SÄLJ till telefonen även när appen är STÄNGD).

   Det här är den enda vägen till en notis på en telefon. Sidan kan visa en
   notis via `new Notification(...)` på skrivbordet, men på Android kastar den
   konstruktorn "Illegal constructor" – och den kräver ändå att fliken är
   öppen. En push väcker service workern utan att appen körs; avsändaren är
   .github/scripts/push-notify.mjs på GitHub-runnern.

   Nyttolasten är JSON: { title, body, tag, url, ts }. Saknas eller är trasig
   visas ändå EN notis – en tyst push är värre än en vag, eftersom vissa
   webbläsare avregistrerar prenumerationen om ett push-event inte resulterar
   i en synlig notis.
   ========================================================================== */
self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { try { d = { body: e.data.text() }; } catch (e2) {} }
  const title = d.title || "Aktie bot";
  e.waitUntil(self.registration.showNotification(title, {
    body: d.body || "Ny signal i portföljen.",
    tag: d.tag || "vecko-agent",
    renotify: true,
    // Vibration + krav på interaktion: en KÖP/SÄLJ-signal ska inte kunna
    // försvinna oläst ur notisskuggan medan telefonen ligger i fickan.
    vibrate: [120, 60, 120],
    requireInteraction: true,
    timestamp: d.ts || Date.now(),
    // MÅSTE VARA PNG. Android/Chrome renderar inte svg i en notis – pekade man
    // hit på assets/icon.svg blev notisen helt utan ikon, utan att något
    // felmeddelande syntes någonstans. `badge` är statusradens lilla symbol och
    // tonas om till en enfärgad mask, därav den separata vita filen.
    // Byggs av .github/scripts/make-icons.mjs.
    icon: "./assets/icon-192.png",
    badge: "./assets/badge-96.png",
    data: { url: d.url || "#hem" }
  }));
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  const hash = (e.notification.data && e.notification.data.url) || "#hem";
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    // Finns appen redan öppen: fokusera den och byt vy, öppna inte ett andra fönster.
    for (const c of list) {
      if (c.url.indexOf(self.registration.scope) === 0 && "focus" in c) {
        c.navigate(self.registration.scope + hash).catch(() => {});
        return c.focus();
      }
    }
    return self.clients.openWindow(self.registration.scope + hash);
  }));
});

/* Prenumerationen roteras ibland av push-tjänsten. Utan det här slutar
   notiserna tyst – den gamla endpointen svarar 410 och den nya är okänd. */
self.addEventListener("pushsubscriptionchange", e => {
  e.waitUntil(self.clients.matchAll({ includeUncontrolled: true }).then(list =>
    list.forEach(c => c.postMessage({ type: "push-resubscribe" }))));
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // GitHub-API:t (filträdet) cachas aldrig: ett gammalt träd får appen att
  // hämta rapporter som inte finns, eller missa dem som gör det.
  if (url.hostname === "api.github.com") return;

  /* TYPSNITTS-CSS:EN RÖRS INTE AV SERVICE WORKERN.
     `<link rel="stylesheet">` mot fonts.googleapis.com skickas som **no-cors**.
     Svaret blir därmed OPAKT, och ett opakt svar går inte att använda som CSS –
     webbläsaren blockerar det (ERR_BLOCKED_BY_ORB), och en cachad kopia serveras
     sedan som 400. Följden var att INGA webbtypsnitt laddades så fort service
     workern kontrollerade sidan: texten föll tillbaka på systemtypsnitt, med
     andra teckenmått och synligt omflöde. Mätt med CDP 2026-08-03:
     "webbtypsnitt laddade: 0" på varje kontrollerad laddning.
     Låt webbläsaren hämta den själv – den har redan sin egen HTTP-cache. */
  if (url.hostname === "fonts.googleapis.com") return;

  /* CACHEN FÖRST för OFÖRÄNDERLIGA tredjepartsfiler.
     Nät-först är rätt för VÅRA filer: de pushas utan versionsstämpel i namnet,
     så cache-först skulle servera gammal kod mot ny data. Det argumentet gäller
     INTE här – jsdelivr-URL:erna är versionspinnade (chart.js@4.4.3) och
     typsnittsfilerna på fonts.gstatic.com har innehållshash i sökvägen. Samma
     URL ger alltid samma byte, och de hämtas med CORS så svaren är inte opaka. */
  const IMMUTABLE = ["cdn.jsdelivr.net", "fonts.gstatic.com"];
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
