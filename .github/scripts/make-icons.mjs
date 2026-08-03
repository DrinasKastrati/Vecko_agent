#!/usr/bin/env node
/* ============================================================================
   make-icons.mjs — renderar notis- och app-ikonerna till PNG.

   VARFÖR PNG OCH INTE SVG: Android/Chrome renderar INTE svg i en notis. Fram
   till 2026-08-04 pekade sw.js på assets/icon.svg, vilket gav notiser HELT
   UTAN ikon – ett fel som inte syns någonstans, notisen ser bara tom ut.
   Samma sak gäller manifestets ikoner vid "Lägg till på startskärmen".

   VARFÖR EGEN RASTERISERING och inte Chrome headless (som make-manual.bat):
   ikonen är sex rundade rektanglar, och en webbläsare som skärmdumpar en
   fristående .svg skalar den efter fönstret på ett sätt som gav beskuren
   bild vid första försöket. Formen är enkel nog att rita exakt, och då blir
   resultatet detsamma på varje maskin utan att Chrome behöver finnas.

   FORMEN LIGGER I `SHAPES` NEDAN och speglar assets/icon.svg + icon-badge.svg.
   Ändras någon av dem: ändra här också och kör om skriptet. De två SVG:erna
   är kvar för webben (favicon, dashboardens logotyp) – de är fortfarande rätt
   format DÄR, det är bara notiser och manifest som kräver raster.

   Kör:  node .github/scripts/make-icons.mjs
   ========================================================================== */
import { writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

/* Motivet i SVG:ens koordinatsystem (viewBox 0 0 32 32). */
const GREEN = [0x26, 0xd0, 0x7c], RED = [0xff, 0x54, 0x70], BG = [0x0a, 0x0e, 0x17];
const BARS = [
  { x: 8,  y: 11, w: 4, h: 13, r: 1, c: GREEN },
  { x: 9,  y: 6,  w: 2, h: 6,  r: 0, c: GREEN },
  { x: 9,  y: 23, w: 2, h: 4,  r: 0, c: GREEN },
  { x: 20, y: 8,  w: 4, h: 11, r: 1, c: RED },
  { x: 21, y: 5,  w: 2, h: 4,  r: 0, c: RED },
  { x: 21, y: 18, w: 2, h: 7,  r: 0, c: RED }
];
const APP_SHAPES   = [{ x: 0, y: 0, w: 32, h: 32, r: 7, c: BG }, ...BARS];
// Badgen tonas om till en enfärgad mask av Android – all färg kastas, och en
// bakgrundsplatta skulle bli en vit klump. Vit på genomskinligt, inget mer.
const BADGE_SHAPES = BARS.map(b => ({ ...b, c: [255, 255, 255] }));

// Är punkten inne i den rundade rektangeln? Hörnen prövas mot cirkelradien.
function inside(s, px, py){
  if (px < s.x || py < s.y || px > s.x + s.w || py > s.y + s.h) return false;
  const r = s.r;
  if (!r) return true;
  const cx = px < s.x + r ? s.x + r : (px > s.x + s.w - r ? s.x + s.w - r : px);
  const cy = py < s.y + r ? s.y + r : (py > s.y + s.h - r ? s.y + s.h - r : py);
  return (px - cx) ** 2 + (py - cy) ** 2 <= r * r;
}

/* Supersampling 4×4 per pixel ger kantutjämning; utan den blir de rundade
   hörnen trappstegsformade och ikonen ser billig ut i notislistan. */
function render(shapes, size, ss = 4){
  const px = Buffer.alloc(size * size * 4);
  const scale = 32 / size;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++){
    let r = 0, g = 0, b = 0, a = 0;
    for (let sy = 0; sy < ss; sy++) for (let sx = 0; sx < ss; sx++){
      const ux = (x + (sx + 0.5) / ss) * scale, uy = (y + (sy + 0.5) / ss) * scale;
      // Sista träffen vinner – samma målarordning som i SVG:en.
      let hit = null;
      for (const s of shapes) if (inside(s, ux, uy)) hit = s;
      if (hit){ r += hit.c[0]; g += hit.c[1]; b += hit.c[2]; a += 255; }
    }
    const n = ss * ss, i = (y * size + x) * 4;
    // Färgen medelvärdesbildas över de TÄCKANDE delproven, alpha över alla –
    // annars dras kantpixlarna mot svart.
    const cov = a / 255;
    px[i]     = cov ? Math.round(r / cov) : 0;
    px[i + 1] = cov ? Math.round(g / cov) : 0;
    px[i + 2] = cov ? Math.round(b / cov) : 0;
    px[i + 3] = Math.round(a / n);
  }
  return px;
}

/* --- minimal PNG-skrivare (8-bitars RGBA, filtertyp 0) ------------------- */
const CRC = (() => { const t = new Int32Array(256);
  for (let n = 0; n < 256; n++){ let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c; } return t; })();
function crc32(buf){ let c = -1; for (const b of buf) c = CRC[(c ^ b) & 0xFF] ^ (c >>> 8); return (c ^ -1) >>> 0; }
function chunk(type, data){
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}
function png(pixels, size){
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6;   // 8 bitar/kanal, färgtyp 6 = RGBA
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++){
    raw[y * (size * 4 + 1)] = 0;   // filtertyp 0 (None) på varje scanline
    pixels.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}

for (const [file, shapes, size] of [
  ["assets/icon-192.png", APP_SHAPES, 192],
  ["assets/icon-512.png", APP_SHAPES, 512],
  ["assets/badge-96.png", BADGE_SHAPES, 96]
]){
  const buf = png(render(shapes, size), size);
  writeFileSync(file, buf);
  console.log(`${file}  ${size}×${size}  ${(buf.length / 1024).toFixed(1)} kB`);
}
