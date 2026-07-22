# Daglig bevakning – US-rotation
**Datum:** 2026-07-22 | **Läge:** Daglig bevakning (USD)
**Marknadsläget i korthet:** S&P 500 stängde tisdag 2026-07-21 på 7 509,20 (+0,89 %, prices.json/Yahoo chart API, marketTime 2026-07-21T20:39:59Z) och Nasdaq Composite på 25 837,21 (+1,29 %, samma källa marketTime 21:15:59Z); Dow +385,38 punkter (+0,74 %) till 52 224,64 (CNBC/TheStreet). Rallyt drevs av halvledarsektorn medan investerare blickade förbi Iran-konflikten mot veckans stora rapporter (Alphabet och Tesla efter stängning i kväll onsdag, IBM senare i veckan). Olja volatil: WTI steg ~2 % till runt 84,91 USD/fat och Brent till ~91,01 USD/fat (Investing.com, tisdag kväll) efter rapporter om ett medlarförslag om 10 dagars eldupphör mellan USA och Iran – ett ev. eldupphör vore ett tvåeggat svärd för XOM-tesen (minskad geopolitisk premie på olja, men också minskad eskaleringsrisk).
**Pre-/after-hours:** Ingen verifierbar pre-market-nivå kunde hämtas för JPM eller XOM vid dagens körningstillfälle (06:42 UTC / 02:42 ET) – det är innan amerikansk pre-market-handel normalt blivit likvid nog för tillförlitliga citat. Dagens beslut baseras på senast verifierade reguljära stängningskurser i `state/prices.json` (tisdag 2026-07-21, inkl. dagshögsta/dagslägsta).
**Portföljvikt & kassa:** 45 % JPM + 55 % kassa (öronmärkt XOM-pending, ej triggat) – oförändrat sedan igår.

---

## Innehav 1: JPMorgan Chase (JPM / NYSE)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| 345,23 USD – prices.json/Yahoo chart API, marketTime 2026-07-21T20:00:02Z (reguljär stängning tis 21/7) | +2,14 % | 330,50 USD (−4,3 %) | 356,00 USD (+3,1 %) | **BEHÅLL** |

**Pre-/after-hours:** Ingen bolagsspecifik pre-/after-hours-nivå kunde verifieras för i morse (se marknadsnotis ovan om körningstidpunkten).
**Nyheter senaste 24h:** JPM steg fraktionellt i tisdagens pre-market på rapporter om att banken kan delta i en 550 mdr USD USA–Japan-handelsöverenskommelse (Yahoo Finance, 2026-07-21) – redan inprisat i tisdagens stängningskurs (345,23 USD). VD Jamie Dimon upprepade i en Motley Fool-artikel (2026-07-21) tidigare uttalanden om att AI redan skurit 30–40 % av bemanningen i vissa enheter – bakgrundsinformation från Q2-rapporten 14/7, ingen ny punkterande eller förstärkande händelse. Ingen ny analytiker-riktkurshöjning identifierad senaste dygnet utöver de tidigare noterade (352–370 USD-intervallet).
**Motivering:** Ingen stop- eller målnivå har brutits (kurs 345,23 USD ligger mitt emellan, +2,14 % sedan entry). Tesen (sektortailwind efter starka Q2-bankrapporter, nu även stöttad av potentiellt positivt handelsavtalsnyheter) är intakt – ingen punkterande händelse identifierad. Inget binärt event (rapport/FDA/dom) inom 2 handelsdagar – nästa kvartalsrapport ligger månader bort. Håller enligt plan.

---

## Pending-planer
- **XOM (Exxon Mobil):** villkor köp ENDAST vid rekyl ≤ 142,00 USD – **EJ TRIGGAD** (stängning 151,71 USD, dagslägsta 148,48 USD, dagshögsta 151,75 USD, prices.json/Yahoo chart API, marketTime 2026-07-21T20:02:17Z; dagslägsta ligger ~6,8 % över villkoret, gapet har vidgats ytterligare sedan i måndags). Ingen åtgärd – planen kvarstår aktiv (55 % öronmärkt kassa). Notera risk: ett ev. 10-dagars eldupphör mellan USA och Iran (se marknadsnotis ovan) skulle kunna dämpa oljepremien och därmed försvaga XOM-katalysatorn ytterligare framöver; bevakas inför XOM:s Q2-rapport 2026-07-31.

## Åtgärder i portfolj_us.md
Inga ändringar i innehav eller kassa – endast "Senast uppdaterad" uppdaterad. Inget SÄLJ/KÖP idag; inget stängt i Historik.

## Bevakning inför imorgon
- **Ons 22/7 (ikväll, efter stängning):** Alphabet och Tesla rapporterar – kan påverka bred tech-/riskaptit (indirekt, ingen direkt koppling till JPM/XOM).
- **Tor 23/7:** Intel rapporterar samt veckans jobless claims (Fed-relevant inför FOMC 28–29/7).
- **Fre 24/7:** Chevron (CVX) rapporterar FÖRE öppning – viktig sektorläsning för XOM-tesen inför XOM:s egen rapport 31/7.
- Eldupphörsförhandlingarna USA–Iran (medlarförslag om 10 dagars vapenvila) – bevaka för snabb de-eskalering (nedåtrisk för oljepremien/XOM-tesen) eller kollaps av samtalen (förnyad eskalering, uppåtrisk för XOM-rekylvillkoret att triggas).
- **OBS driftnotis (kvarstår från igår):** verifiera att `monitor.yml` (intradag-monitorn) fångar framtida nivåkorsningar i tid för JPM/XOM – `state/alerts.json` visade inga aktiva signaler för någotdera vid dagens körning.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
