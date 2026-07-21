# Daglig bevakning – US-rotation
**Datum:** 2026-07-21 | **Läge:** Daglig bevakning (USD)
**Marknadsläget i korthet:** S&P 500 stängde måndag 2026-07-20 på 7 443,28 (−0,19 % mot fredagens 7 457,69, prices.json/Yahoo chart API, marketTime 2026-07-20T21:08:18Z) och Nasdaq Composite på 25 508,07 (−0,05 %, i praktiken oförändrad, samma källa marketTime 21:15:59Z); Dow −307 punkter (CNBC). Konflikten mellan USA och Iran fortsatte eskalera över natten till tisdag: USA:s militär genomförde sin tionde natt i rad med attacker mot Iran, Iran vedergällde mot Kuwait med robotar/drönare, och Houthi-miliser i Jemen deklarerade en maritim blockad mot Saudiarabien (Bloomberg/tradingeconomics, 2026-07-20/21) – oljan handlas fortsatt förhöjd men konsoliderande (WTI ~83 USD/fat, Brent strax under 89 USD/fat, tradingeconomics.com 2026-07-21). Halvledarrallyt inför veckans stora techrapporter (Alphabet/Tesla onsdag, Intel torsdag) lyfte terminerna svagt i övernattshandeln (S&P-terminer +0,17 %, CNBC 2026-07-20 kväll).
**Pre-/after-hours:** Ingen bolagsspecifik pre-/after-hours-rörelse kunde verifieras för XOM eller JPM specifikt via sökning 2026-07-21 (endast bred marknadsbild ovan, ej en enskild källa+tidsstämpel per aktie) – dagens beslut baseras på senast verifierade reguljära kurser i `state/prices.json` (måndag 2026-07-20 stängning, inkl. dagslägsta/dagshögsta).
**Portföljvikt & kassa:** 45 % JPM (nyöppnad idag, se Innehav 1) + 55 % kassa (öronmärkt för XOM-pending, ej triggat).

---

## Innehav 1: JPMorgan Chase (JPM / NYSE)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| 338,87 USD – prices.json/Yahoo chart API, marketTime 2026-07-20T20:00:02Z (reguljär stängning mån 20/7) | +0,26 % | 330,50 USD (−2,5 %) | 356,00 USD (+5,1 %) | **KÖP** |

**Pre-/after-hours:** Ingen bolagsspecifik pre-/after-hours-nivå kunde verifieras för idag – se övergripande marknadsnotis ovan.
**Nyheter senaste 24h:** Ingen ny enskild JPM-händelse identifierad senaste dygnet. Fortsatt positivt analytikersentiment sedan Q2-rapporten 14/7 kvarstår: flera storbanker har höjt riktkurser till intervallet 352–370 USD (RBC 370, Morgan Stanley 370, Citi 360, Truist 352 – TipRanks/Benzinga, veckan efter rapporten) – ingen exakt tidsstämpel senaste 24h kunde verifieras för dessa specifika höjningar, så de räknas som bakgrund snarare än färsk katalysator.
**Motivering:** Rekyl-villkoret från veckorapporten (köp ≤ 338,00 USD) uppfylldes intradag måndag 2026-07-20 – dagslägsta 337,37 USD (prices.json/Yahoo chart API, marketTime 2026-07-20T20:00:02Z, dagshögsta 344,26 USD), dvs. under villkorets nivå trots att stängningen (338,87 USD) hamnade strax över. Position öppnas enligt plan till entry 338,00 USD, vikt 45 %. Tesen (brett sektortailwind efter samtliga fem storbankers Q2-rapportslag, se `us-veckorapport-260720.md`) är intakt – ingen ny punkterande händelse identifierad. Kända risker kvarstår oförändrade: katalysatorn är ~5 handelsdagar gammal och Fed-ordförande Warsh behåller hökaktig ton inför FOMC 28–29/7.

---

## Pending-planer
- **XOM (Exxon Mobil):** villkor köp ≤ 142,00 USD (rekyl) – **EJ TRIGGAD** (dagslägsta 146,25 USD, stängning 148,36 USD, prices.json/Yahoo chart API, marketTime 2026-07-20T20:02:32Z; dagslägsta ligger ~3,0 % över villkoret) → ingen åtgärd, planen kvarstår aktiv (55 % öronmärkt kassa). Oljekatalysatorn (Iran/Hormuz-eskalering) förblir intakt och har snarare förstärkts över natten (Houthi-blockad mot Saudiarabien, Iran-attack mot Kuwait, se marknadsnotis ovan) – ingen de-eskalering som skulle punktera tesen, men ingen rekyl till köpvärd nivå har heller skett.
- **JPM (JPMorgan Chase):** villkor köp ≤ 338,00 USD (rekyl) – **TRIGGAD** (dagslägsta 337,37 USD måndag 2026-07-20, prices.json/Yahoo chart API, marketTime 2026-07-20T20:00:02Z) → KÖP genomfört, se Innehav 1 ovan.

## Åtgärder i portfolj_us.md
KÖP JPM @ 338,00 USD (entry-villkor triggat via dagslägsta 337,37 USD mån 20/7) → ny rad i "Aktuellt innehav" med stop 330,50 USD, mål 356,00 USD, vikt 45 %. Pending-raden för JPM i v30-tabellen markerad TRIGGAT (struken, ej raderad) med hänvisning till den nya innehavsraden. XOM-pending kvarstår oförändrad. "Senast uppdaterad" och kassa (55 %, öronmärkt XOM) uppdaterad. Ingen Historik-ändring (inget stängt).

## Bevakning inför imorgon
- **Ons 22/7:** Alphabet och Tesla rapporterar efter stängning – kan påverka bred tech-/riskaptit (indirekt smitta, ingen direkt koppling till JPM/XOM).
- **Tor 23/7:** Intel rapporterar samt veckans jobless claims (Fed-relevant inför FOMC 28–29/7).
- **Fre 24/7:** Chevron (CVX) rapporterar FÖRE öppning – viktig sektorläsning för XOM-tesen trots att XOM själv rapporterar först 31/7.
- Iran/Hormuz-konflikten (Houthi-blockad mot Saudiarabien, Kuwait-attack) – bevaka för ev. rekyl till XOM:s villkor ≤ 142 USD eller för tecken på snabb de-eskalering som skulle kunna punktera oljetesen.
- **OBS driftnotis:** `state/alerts.json` (intradag-monitorn) är oförändrad sedan 2026-07-20T13:05:29Z – dvs. den täcker INTE måndagens handelssession (13:30–20:00 UTC) där JPM:s rekyl faktiskt inträffade. Dagens TRIGGAD-bedömning för JPM gjordes manuellt mot `prices.json`:s dagslägsta eftersom monitorn inte hunnit flagga den. Värt att verifiera att `monitor.yml` kör som väntat kommande handelsdagar så att framtida intradag-korsningar fångas i tid.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
