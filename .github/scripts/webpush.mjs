#!/usr/bin/env node
/* ============================================================================
   webpush.mjs — Web Push (RFC 8291 aes128gcm + RFC 8292 VAPID) med ENBART
   node:crypto. Inga npm-beroenden.

   VARFÖR EGEN IMPLEMENTATION I STÄLLET FÖR `web-push`-paketet:
   monitor.yml/news.yml m.fl. körs utan `npm install` – de har aldrig behövt
   det. Ett beroende här hade tvingat in ett installationssteg i den enda
   action som måste vara snabb och pålitlig varje timme. Kryptot är ~80 rader
   och verifieras mot RFC 8291:s officiella testvektor i tests/run.mjs
   ("webpush: RFC 8291 §5"). ÄNDRA ALDRIG NÅGOT HÄR UTAN ATT KÖRA DET TESTET –
   ett fel i nyckelhärledningen ger inget synligt fel någonstans i kedjan:
   push-tjänsten accepterar (den läser aldrig innehållet), och telefonen
   kastar paketet tyst. Symptomet blir "inga notiser", utan ett enda felmeddelande.

   Funktionerna är rena och tar salt/nycklar som argument just för att kunna
   testas mot en fast vektor.
   ========================================================================== */
import { createHmac, createCipheriv, createPublicKey, createPrivateKey,
         diffieHellman, generateKeyPairSync, randomBytes, sign as signRaw } from "node:crypto";

export const b64u = buf => Buffer.from(buf).toString("base64")
  .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
export const unb64u = s => Buffer.from(String(s).replace(/-/g, "+").replace(/_/g, "/"), "base64");

const hmac = (key, data) => createHmac("sha256", key).update(data).digest();
// HKDF-Expand med EN blockrunda – allt vi behöver är ≤ 32 byte.
const expand = (prk, info, len) => hmac(prk, Buffer.concat([info, Buffer.from([1])])).subarray(0, len);

/* Rå okomprimerad P-256-punkt (65 byte, 0x04||X||Y) -> KeyObject, och tvärtom. */
export function pubFromRaw(raw){
  const b = Buffer.from(raw);
  if (b.length !== 65 || b[0] !== 4) throw new Error("Väntade 65 byte okomprimerad P-256-punkt, fick " + b.length);
  return createPublicKey({ format: "jwk", key: {
    kty: "EC", crv: "P-256", x: b64u(b.subarray(1, 33)), y: b64u(b.subarray(33, 65)) } });
}
export function rawFromPub(keyObject){
  const jwk = keyObject.export({ format: "jwk" });
  return Buffer.concat([Buffer.from([4]), unb64u(jwk.x), unb64u(jwk.y)]);
}
/* Privat nyckel ur VAPID-paret: d (32 byte) + den publika punkten (65 byte). */
export function privFromRaw(dRaw, pubRaw){
  const p = Buffer.from(pubRaw);
  return createPrivateKey({ format: "jwk", key: {
    kty: "EC", crv: "P-256", d: b64u(dRaw), x: b64u(p.subarray(1, 33)), y: b64u(p.subarray(33, 65)) } });
}

export function generateVapidKeys(){
  const { publicKey, privateKey } = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
  return { publicKey: b64u(rawFromPub(publicKey)), privateKey: privateKey.export({ format: "jwk" }).d };
}

/* ---------------------------------------------------------------------------
   RFC 8291 §3.4: kryptera nyttolasten mot mottagarens p256dh + auth.
   `opts.salt` och `opts.as` finns BARA för testvektorn – i drift slumpas båda.
   Returnerar hela kroppen (salt || rs || idlen || as_public || ciphertext).
   ------------------------------------------------------------------------- */
export function encryptPayload(payload, uaPublicRaw, authSecret, opts = {}){
  const uaPublic = Buffer.from(uaPublicRaw);
  const auth = Buffer.from(authSecret);
  let asPriv, asPubRaw;
  if (opts.as) { asPriv = opts.as.privateKey; asPubRaw = Buffer.from(opts.as.publicRaw); }
  else {
    const kp = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
    asPriv = kp.privateKey; asPubRaw = rawFromPub(kp.publicKey);
  }

  const shared  = diffieHellman({ privateKey: asPriv, publicKey: pubFromRaw(uaPublic) });
  const prkKey  = hmac(auth, shared);                                   // HKDF-Extract(auth, ecdh)
  const keyInfo = Buffer.concat([Buffer.from("WebPush: info\0", "utf8"), uaPublic, asPubRaw]);
  const ikm     = expand(prkKey, keyInfo, 32);

  const salt  = opts.salt ? Buffer.from(opts.salt) : randomBytes(16);
  const prk   = hmac(salt, ikm);
  const cek   = expand(prk, Buffer.from("Content-Encoding: aes128gcm\0", "utf8"), 16);
  const nonce = expand(prk, Buffer.from("Content-Encoding: nonce\0", "utf8"), 12);

  // 0x02 = paddingavgränsare för SISTA posten (0x01 vore "fler poster följer").
  const plain  = Buffer.concat([Buffer.from(payload, "utf8"), Buffer.from([2])]);
  const cipher = createCipheriv("aes-128-gcm", cek, nonce);
  const ct     = Buffer.concat([cipher.update(plain), cipher.final(), cipher.getAuthTag()]);

  const rs = Buffer.alloc(4); rs.writeUInt32BE(4096, 0);
  return Buffer.concat([salt, rs, Buffer.from([asPubRaw.length]), asPubRaw, ct]);
}

/* ---------------------------------------------------------------------------
   RFC 8292: Authorization-huvudet. `aud` är push-tjänstens ORIGIN, inte hela
   endpointen – FCM avvisar (401) om hela URL:en skickas.
   ------------------------------------------------------------------------- */
export function vapidAuthHeader(endpoint, vapidPublicB64, vapidPrivateB64, subject, nowSec = Math.floor(Date.now() / 1000)){
  const aud = new URL(endpoint).origin;
  const head = b64u(Buffer.from(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const body = b64u(Buffer.from(JSON.stringify({ aud, exp: nowSec + 12 * 3600, sub: subject })));
  const key = privFromRaw(unb64u(vapidPrivateB64), unb64u(vapidPublicB64));
  // ES256 kräver JOSE-format (r||s, 64 byte rått) – node ger annars DER.
  const sig = signRaw("sha256", Buffer.from(head + "." + body), { key, dsaEncoding: "ieee-p1363" });
  return "vapid t=" + head + "." + body + "." + b64u(sig) + ", k=" + vapidPublicB64;
}

/* Skickar EN notis till EN prenumeration. Returnerar { ok, status, endpoint }.
   404/410 = prenumerationen är död (avinstallerad app, rensad webbläsardata) –
   anroparen ska plocka bort den, inte försöka igen. */
export async function sendPush(sub, payload, vapid, fetchImpl = globalThis.fetch){
  const body = encryptPayload(payload, unb64u(sub.keys.p256dh), unb64u(sub.keys.auth));
  const res = await fetchImpl(sub.endpoint, {
    method: "POST",
    headers: {
      "Content-Encoding": "aes128gcm",
      "Content-Type": "application/octet-stream",
      "Content-Length": String(body.length),
      "TTL": String(vapid.ttl || 86400),
      "Urgency": "high",
      "Authorization": vapidAuthHeader(sub.endpoint, vapid.publicKey, vapid.privateKey, vapid.subject)
    },
    body
  });
  let detail = "";
  if (!res.ok) { try { detail = (await res.text()).slice(0, 200); } catch {} }
  return { ok: res.ok, status: res.status, gone: res.status === 404 || res.status === 410,
           endpoint: sub.endpoint, detail };
}
