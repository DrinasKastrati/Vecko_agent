# Åtgärdsplan efter den externa strategigranskningen

**Skapad:** 2026-08-08 · **Underlag:** `docs/STRATEGI.md`, `docs/Vecko_agent_Arkitektoniskt_Beslutsunderlag.md`,
Gemini-granskningen (finns INTE i repot — överlever bara som referat inuti beslutsunderlaget).

Den här filen laddas **inte** automatiskt. CLAUDE.md avsnitt 5b pekar hit. Läs den när du ska
plocka upp nästa punkt i strategiarbetet.

**Ordningsprincipen:** systemet ska göras mätbart innan det görs mer sofistikerat. Ingen punkt
nedan ändrar en parameter för att förbättra avkastningen — de gör det möjligt att avgöra om
reglerna fungerar. Blanda inte ihop arkitekturarbete med parameteroptimering.

---

## Vad granskarna konvergerade på

Två oberoende granskare hittade samma två fel. Enligt granskningspromptens egen regel
("fynd som bara en modell hittar är oftast brus") är det de som är värda att agera på:

1. **Conviction sizing på obevisad signal** — poängen styrde både urval och kapitalrisk.
2. **LLM räknar matematik den inte ska räkna** — delvis redan åtgärdat i repot
   (`alerts.mjs`, `decision_eval.mjs`, `backtest.mjs` är deterministiska); kvar hos modellen är
   RSI/MACD/EMA-avläsning och R/R-räkning.

Punkt 1 är åtgärdad (se nedan). Punkt 2 är medvetet **inte** prioriterad: beslutsunderlagets
Fas 0–6 är månaders bygge för ett litet privat konto med obevisad edge. Bevisbördan gäller åt
båda håll — en ombyggnad måste också motivera sin kostnad.

---

## ✅ Utfört 2026-08-08

### Platt 25 % — conviction-bandet 15–35 % borttaget
`prompts/dagligprompt.md`, `prompts/us_dagligprompt.md`, `docs/STRATEGI.md`.

Poängvikterna (35/30/15/20) är uttryckligen antagna och kan inte kalibreras förrän ≥ 15 stängda
SÄLJ-rader finns. Ändå bestämde poängen **både** om aktien köptes och hur mycket kapital som
riskerades — en obevisad signal förstärkte alltså sin egen osäkerhet. Platt 25 % tar bort det
lagret till noll kostnad och är den nollmodell som en framtida volatilitetsjusterad sizing måste
mätas MOT.

Poängen loggas fortsatt och styr urval/rangordning, aldrig vikt.

**Spärr:** vikt får inte återinföras som conviction-mått förrän ≥ 15 stängda SÄLJ-rader finns
**och** poängen visat prediktiv kraft mot 5d/20d benchmark-relativ avkastning.

### Nåbarhetsmotsägelsen i `ma_rumor`/`insider`/`index`

Nivåtabellen föreskrev mål som grind 5 (nåbarhetstaket `2 × dagsrörelse × √handelsdagar`) gjorde
omöjliga. Mätt över 60 dagar på `state/price_history.json`:

| | föll vid 5 d | föll vid 10 d | föll vid 15 d |
|---|---|---|---|
| Nordiskt (24 namn) | 9 | 4 | ~0 |
| US (28 namn) | — | 9 | 3 (varav SPY = sleeven) |

Träffade namn var ASSA-B, SCA-B, BETS-B, JPM, WFC, XOM, CVX, AAPL — alltså de **mest likvida**.
Sambandet är mekaniskt: hög likviditet ⇒ låg dagsrörelse ⇒ lågt tak. Hela katalysatorklassen var
strukturellt oköpbar för en stor del av universumet, utan att synas någonstans.

**Ändring:** horisont 5–10 ⇒ **10–15 handelsdagar** i båda böckerna, tidsstopp 10 ⇒ 15.
Nordiskt mål 8–10 % ⇒ 6–10 % (golvet = kostnadströskeln). **US-målet kunde inte sänkas** —
stoppet 5–6 % är backtestat och låst, R/R 2:1 tvingar då mål ≥ 10 %, så horisonten var den enda
fria variabeln. 20 dagar prövades och räddar bara ett namn till för fem dagars extra
ryktesexponering; 15 är knäet.

**Detta är inte backtestat.** Det löser en intern motsägelse och gör inget påstående om
avkastning. Skriv aldrig att den är mätt eller kalibrerad.

---

## 1. Grind-funnel — aggregera avvisade beslut per namngiven spärr

**Högst prioritet.** Beslutsunderlagets Test 4 (gate ablation) till ~1 % av kostnaden.

Utöka `.github/scripts/decision_eval.mjs` så det svarar på: *vilken benchmark-relativ 5d/20d-
avkastning hade de kandidater som föll på grind X?*

Underlaget finns redan — ingen ny infrastruktur:
- `state/decisions.json` bär AVVAKTA-rader med namngiven spärr i `reason` (hela bruttolistan
  loggas i LÄGE A sedan 2026-08-03)
- `decision_eval.mjs` mäter redan varje rad mot 5/20 handelsdagar och mot bokens index

Saknas: gruppering per spärr. `reason` är fritext — överväg ett strukturerat `gate`-fält i
decisions-schemat, bakåtkompatibelt i `validate-decisions.mjs`.

**Ärvda regler som inte får luckras upp:** omoget beslut räknas aldrig som noll (utelämnas) ·
inget uttalande under `minN` (8) mätpunkter per grupp · skriv bara vid faktisk ändring.

**Godkännandekriterium, satt i förväg:** en grind mjukas upp först om dess "föll bara här"-grupp
visar konsekvent positiv inkrementell alpha i **båda** halvorna av perioden. Ett enskilt avvisat
namn som steg är facit-bias, inte en miss.

**Dashboard:** lägg per-grind-utfallet i `decision_eval.json`, som redan hämtas — `tests/data.mjs`
ligger på 29 av tak 30 hämtningar. En ny fil spränger taket.

---

## 2. Räkna om regimfiltret som active return

`STRATEGI.md` 9.2 kallar MA200 "den starkaste replikationen i hela materialet". Den siffran mäter
troligen fel sak: när regimen är AV går kapitalet till indexsleeven, så "regimfilter PÅ" betyder
"ligg i index under nedgångar". Förbättringen är då till stor del **sleeveavkastning**, inte
urvalsförbättring — vilket bara är avsnitt 2:s slutsats i annan förklädnad. Avsnitt 11.4 anar
detta men drar inte konsekvensen.

Kör om avsnitt 4 och 6 i `backtest.mjs` med `ActiveReturn = R_bok − R_sleeve` som primärt mått;
rapportera active Information Ratio, active drawdown, tracking error. Sleeveserien finns redan i
motorn sedan ombyggnaden 2026-08-02.

**Frågan:** förbättrar MA200 den aktiva overlayn, eller är den ett dyrt sätt att äga index?

Försvinner active alpha: behåll regeln tills vidare (den halverar mätt max drawdown), men
siffran i 9.2 får inte längre citeras som stöd för urvalskvalitet, och formuleringen skrivs om.

**Sekundärt — multipel-testning.** MA200 är den enda regel som befordrats till hård
produktionsspärr och kom ur ett sök över lookback (4) × hålltid (4) × stop/mål (8) × regim (3) ×
universum (3) × positioner (2). "Fyra av fyra halvor" har effektivt n≈2, inte 4 — två korrelerade
marknader, och 2020–2022 dominerar båda halvorna. Beslutsunderlaget citerar Harvey et al. om
multipel testning men applicerar den aldrig på just den här regeln.

Kräver nätåtkomst. Kör inte `fetch-prices.mjs`/`fetch-news.mjs` lokalt samtidigt som actionen.

---

## 3. Logga USD/SEK vid varje US-beslut

Kapitalallokeraren får flytta 15 procentenheter/vecka inom bandet 0,2–0,8. Dren är SEK-baserad.
En förflyttning 0,5 → 0,8 mot USA är en ohedgead FX-position på 30 % av kapitalet, beslutad
kvalitativt av en LLM — och den syns **ingenstans**, eftersom US-boken redovisas exklusive
USD/SEK-effekten.

Storleksordning: `USDSEK=X` har mätt dagsrörelse 0,41 % (60 d). Över sex veckor är det ±5 %,
jämförbart med hela målavståndet på ett enskilt case. Allokeraren kan alltså förlora mer på
valutan än aktieurvalet tjänar, utan att det går att se.

1. Logga `fxRate` + tidsstämpel på varje US-rad i `decisions.json`. Kursen finns redan i
   `prices.json` — ingen ny hämtning. `validate-decisions.mjs` bakåtkompatibelt.
2. Redovisa totalportföljen i SEK som **sekundärt** tal i Total-vyn. Böckerna fortsätter
   redovisas var för sig mot sitt eget index — den regeln står kvar.
3. Först när `fxRate` loggats en tid går allokeraren att utvärdera mot beslutsunderlagets Test 6
   (challengers: statisk 50/50 · volatilitetsbalanserad · nuvarande LLM-allokerare).

Utan punkt 1 kan Test 6 aldrig köras.

---

## 4. Bevaka `ma_rumor`-klassen efter horisontändringen

Uppföljning av ändringen ovan. Tidsstoppet 10 ⇒ 15 handelsdagar är den **enda faktiska
riskökningen** — ett obekräftat rykte hålls fem dagar längre, och obekräftade rykten dör tyst.

Kontrollera efter ~10 stängda affärer i klassen:
- `realizedRr` för `catalystType` i {`ma_rumor`, `insider`, `index`} — förlorar klassen
  systematiskt på de extra dagarna?
- Hur stor andel av klassens exits blev tidsstopp i stället för mål/stop?

**Om negativt:** tidsstoppet tillbaka till 10 dagar, och målgolvet bär hela anpassningen.
Nordiskt kan sänkas till kostnadströskeln 6 %. US kan inte — målet är låst av det backtestade
stoppet och R/R-kravet, så där återstår bara att acceptera att lugna megacaps stryks på grind 5.

Kopplat till punkt 1: dödzonen syns bara om varje strykning loggas med grind 5 **namngiven** i
`reason`. Båda prompterna instruerar detta explicit sedan 2026-08-08.

---

## Medvetet nedprioriterat

Från beslutsunderlagets Fas 0–6. Alla förutsätter att grundfrågan är besvarad; punkt 1 besvarar
den billigare.

- Probabilistisk scorer (Fas 4) — kräver data som inte finns än
- ATR-baserad stop och volatilitetsjusterad sizing (Fas 3) — platt 25 % är nollmodellen den
  ska mätas mot, och den finns nu
- Multi-agent-arkitektur — löser inte LLM-stokasticitet; korrelerade agenter, ökad latens
- Fast/slow lanes och latenstelemetri (Fas 5) — relevant först om en katalysatorklass visar edge
- Fullt experimentregister (Fas 0) — punkt 1 och 2 bär sina godkännandekriterier i den här filen

---

*Automatiserat beslutsstöd, inte finansiell rådgivning.*
