# Vecko_agent — historik (daterad ändringslogg)

Utflyttad ur `CLAUDE.md` 2026-08-02 för att den filen läses in vid varje sessionsstart och
hade vuxit till 1,5× gränsen där Claude Code varnar för stora minnesfiler. Innehållet är
oförändrat. Läs den här filen när du behöver VARFÖR bakom ett designval, en tidigare bugg
eller en backtest-siffra – nuläget och de bindande reglerna står kvar i `CLAUDE.md`.

## 5. Nuläge — vad som är gjort (allt live i repot)

- ✅ 2026-08-02 (HTML-städning – tre stubbar bort, manualernas CSS bruten ut, en sw.js-bugg):
  **`index_2/3/4.html` raderade.** De var 18-raders stubbar som vidarebefordrade till
  `index.html?theme=X` och fanns för gamla bokmärken. De kunde INTE slås ihop till en fil –
  GitHub Pages är statisk hosting, en URL kräver en fil, och det finns ingen rewrite-regel att
  ta till. Valet stod alltså mellan att radera eller behålla. De skapades samma dag (commit
  `d291eef`) när temana slogs ihop, så eventuella bokmärken var timmar gamla och bara Drens egna.
  **`assets/manual.css` utbruten.** `Kom-igang.html` och `Systemguide.html` hade var sitt inline
  `<style>`-block där **28 av ~45 rader var identiska**, och de rader som skilde sig hade glidit
  isär av misstag: `max-width` 760 mot 780, h2-marginal 34 mot 36, tabellfont 14 mot 13,6.
  Basvärdena i den nya filen är Kom-igångs, och Systemguiden skriver över nio rader i sitt eget
  block. **Utseendet är oförändrat** – poängen var att göra skillnaderna explicita i stället för
  att låta dem gömma sig i två kopior av hela stilmallen.
  **Verifierat med ett kontrollexperiment.** Att bara jämföra PDF-storlek före och efter säger
  ingenting om man inte vet hur ett MISSLYCKANDE ser ut. Därför renderades en kopia med medvetet
  trasig `href`: ostylad blev **210 358 byte**, mot 187 862 för den riktiga och 188 218 före
  ändringen. Skillnaden mot baseline är 0,19 %, mot 12 % för den ostylade – alltså laddas och
  tillämpas den externa stilmallen även över `file://`, vilket är vad `make-manual.bat` använder.
  **Bugg funnen på vägen:** `assets/settings.js` laddas av `index.html` men saknades i `SHELL` i
  `sw.js`, så inställningsmodulen aldrig precachades och vyn "Inställningar" var trasig offline.
  Tillagd. `CACHE`-namnet behövde INTE bumpas: en ändrad `sw.js` utlöser `install`, som lägger
  till hela `SHELL` i samma cache – bumpning krävs bara när FORMATET på det cachade ändras.

- ✅ 2026-08-02 (`push.bat` klarar rebase-konflikten i de genererade filerna):
  **Fyndet.** Samma konflikt slog till TVÅ gånger på en dag. `dashboard.yml` skriver
  `state/dashboard.json` och `state/search-index.json` var 30:e minut; pushar man nära en sådan
  körning fastnar `git pull --rebase` i konflikt. Gamla `push.bat` hade ingen hantering alls: den
  lämnade repot i pågående rebase med **detached HEAD**, körde ändå sitt avslutande `pause`, och
  ingenting nådde GitHub. Det såg ut som en lyckad körning.
  **Åtgärd.** Skriptet fick en `:resolve_rebase`-subrutin som loopar (max 10 varv) så länge en
  rebase pågår: den listar konfliktfilerna med `git diff --name-only --diff-filter=U` och kör
  `build-dashboard.mjs` + `git add` + `rebase --continue` ENDAST om varenda konfliktfil är en av de
  två genererade. Är någon annan fil med i konflikten körs `git rebase --abort` och skriptet
  lämnar över till människa. Den gissar aldrig, och löser aldrig delvis.
  **Verifierat i tre isolerade testrepon** (inte på main), med subrutinen extraherad ur den
  riktiga filen med `sed` så testet inte kunde driva ifrån originalet:
  A) konflikt bara i de två genererade filerna → ombyggd, rebase klar, exit 0;
  B1) konflikt i en vanlig fil → abort, exit 1, arbetsträdet orört;
  B2) BLANDAD konflikt (vanlig fil + `dashboard.json`) → abort, exit 1, och `dashboard.json` låg
  kvar med sitt LOKALA innehåll, dvs. ingen partiell auto-lösning.
  **Följdändringar.** `MANUAL.md` avsnitt 4 (beskrev dessutom fortfarande auto-pushen som aktiv,
  vilket den inte varit sedan samma dag) och CLAUDE.md avsnitt 7.

- ✅ 2026-08-02 (filstädning – sju filer raderade efter beslut av Dren):
  Repot hade samlat på sig parallella filer som beskrev samma sak, vilket är en tyst risk: när två
  dokument säger olika saker om samma regel vinner det som råkar läsas först.
  **Raderat:**
  `Anvandarguide.html`, `Anvandarmanual.html` och `Anvandarmanual.pdf` – båda överlappade
  `Kom-igang.html` (använda dashboarden) och `Systemguide.html` (förstå besluten). CLAUDE.md
  definierar tre målgrupper; det fanns fem filer för dem. Webbappen länkade inte till någon av de
  raderade, så inget bröts.
  `prompts/veckoprompt.md` – stubben efter den separata måndagsprompten. Filen sa själv
  "kan raderas helt: `git rm prompts/veckoprompt.md`". REGELN står kvar på fyra ställen
  (CLAUDE.md, MANUAL.md, START.md, den här filen), omformulerad från "schemalägg inte filen" till
  **"lägg aldrig till en separat måndagsprompt"** – regeln behövde inte en fil för att gälla.
  `templates/case_rapport.md` – tidig scoutmall, ersatt av `templates/scout_case.md`, noll
  referenser i hela repot.
  `auto_push.bat` + `setup_autopush.bat` – auto-pushen stängdes av 2026-08-02 (poppade upp ett
  konsolfönster var 30:e minut). Skripten är borta OCH Windows-uppgiften `VeckoAgent AutoPush`
  avregistrerades samma dag, så det finns inget halvdött kvar som pekar på en raderad fil.
  `push.bat` är enda vägen ut till GitHub.
  **Behållet medvetet:** de tre gamla backtest-rapporterna (`backtest-260731-*`,
  `backtest-260802-nordic.md`) från 2-positionsgridet. De har noll referenser, men de är
  bevisunderlaget för de beslut som fattades då – och hela poängen med det här repot är att
  besluten går att granska i efterhand. (`index_2/3/4.html` behölls i den här omgången men
  raderades i nästa – se posten ovan om HTML-städningen.)
  **Följdändringar:** `make-manual.bat` renderar nu två manualer i stället för tre, CLAUDE.md
  avsnitt 2/4/5b/7/8, `MANUAL.md` (filkartan fick rader för `docs/` och repo-roten) och
  `prompts/START.md`. Regeln "radera aldrig mallarna" preciserades till att gälla de mallar en
  prompt faktiskt läser, med `grep -r templates/ prompts/` som kontroll.

- ✅ 2026-08-02 (backtestmotorn ombyggd – sex mätfel, och två slutsatser som föll):
  **Fyndet.** En genomgång av `backtest.mjs` hittade sex fel som alla drog åt samma håll: gridet
  mätte något annat än det böckerna gör.
  1. **Indexsleeven modellerades inte.** Kedjningen multiplicerade ihop STÄNGDA affärer i
     exit-ordning och hade därför ingen tidsaxel alls – en tom plats bidrog med noll, fast den
     live ligger i `XACT-OMXS30.ST` respektive SPY. Max drawdown mättes på samma affärskedja,
     alltså inte på något som liknade en portföljkurva.
  2. **Lookback-fönstret testades bara på 10 och 20 dagar.** Två till fyra veckor är kortsiktig
     REVERSAL-horisont; att köpa topp N på det fönstret ligger nära att köpa det mest överköpta.
  3. **Ingen out-of-sample-kontroll.** Nivåbanden i prompterna kom ur den bästa av 24 celler,
     valda på hela perioden.
  4. **Survivorship bias oredovisad.** Universumfilerna är dagens mest likvida namn.
  5. **Inget regimfilter.**
  6. **`maxHoldDays` hårdkodad till 30** i gridet.
  **Åtgärd – motorn.** `backtestUniverse` räknar nu en **daglig equity-kurva** på en gemensam
  datumaxel (unionen av alla börsers handelsdagar, eftersom .ST/.OL/.CO/.HE har olika helgdagar).
  Varje plats håller antingen en aktie – med aktiens dagsavkastning, teleskoperande till exakt
  `exitPrice/entryPrice` – eller sleeven. Kostnaden dras på exitdagen. Upptagen plats gäller HELA
  innehavsperioden, även dagar då just den börsen var stängd, annars hade sleeven felaktigt fått
  de dagarna. `momentumAt` fick en `skip`-parameter (momentum-litteraturens hoppfönster),
  `simulateTrade` exponerar entry/exit för kurvan, och `chainedPct` finns kvar oförändrat så
  äldre rapporter går att jämföra med. Rapporten fick fem svep i stället för ett kors: huvudgrid
  (läge × 4 lookbacks × 3 nivåer), skip, sleeve av/på, hålltid, regimfilter, plus out-of-sample.
  **Fälla som kostade en runda:** den första sleeve-diagnostiken redovisade benchmarks utveckling
  under lediga dagar OVIKTAT, vilket fick rapporten att dra motsatt slutsats. Rätt facit är
  `sleeveNeutralPct` – benchmarks totalavkastning upphöjt till andelen ledig tid. Ligger utfallet
  långt under det är den lediga tiden koncentrerad till svaga perioder.
  **Resultat 1 – lookbacken var hela skillnaden.** Nordiska boken: med 120 dagars fönster och
  hållregeln ger skelettet **+43,7 % mot ^OMX +36,3 %** (PF 1,13, DD −17,8 %); med 10–20 dagar
  −18,9 till −34,1 %. Slutsatsen "ramverket bär sig inte självt" var alltså en egenskap hos ett
  fönster som aldrig testades. US: +53,2 % vid 120 dagar och +55,7 % vid 10 dagar mot ^GSPC
  +70,7 % – fortfarande under index, men 60 dagars fönster med 20 dagars skip ger +110,3 %
  (PF 1,26, DD −25,9 %). I US-boken är det stoppbredden, inte fönstret, som styr.
  **Resultat 2 – nordiska stoppbandet var brus.** Out-of-sample-testet delar femårsperioden på
  mitten: samma stop/mål-nivå vinner i båda halvorna i **1 av 8** kombinationer i nordiska boken,
  men **5 av 8** i US-boken. Omkalibreringen till −4 %/+8 % samma dag (posten nedan) byggde alltså
  på urvalsbrus. Nordiska bandet skrevs om till en RISKREGEL (3–5 %, tekniskt satt, R/R 2:1 och
  kostnadströskeln binder), US-bandet 5–6 % står kvar som kalibrerat.
  **Resultat 3 – regimfiltret är det starkaste enskilda filtret efter hållregeln.** Att bara
  öppna NYA positioner när benchmark ligger över sitt glidande medel: nordiska boken −18,9 % →
  **+28,9 % (MA100)**, DD −41,4 % → −29,1 %. US: +42,1 % → **+70,2 % (MA200)**, DD −29,3 % →
  −23,6 %. Infört som punkt 2b i båda prompterna – gäller ENBART nyöppning och får aldrig
  användas som skäl att strunta i ett stop.
  **Resultat 4 – sleevens verkliga värde.** US-boken: +30,8 % → +42,1 % enbart av att oallokerat
  kapital faktiskt ligger i index. Nordiska boken: +0,78 % mot ett neutralt facit på +5,52 % –
  den lediga tiden inföll när ^OMX var svagt, vilket är väntat eftersom platser blir tomma när
  positioner stoppas ut.
  **Resultat 5 – hålltiden skiljer sig mellan böckerna.** Nordisk: 60 dagar (−10,0 %) slår 30
  (−18,9 %) och 20 (−24,2 %). US: 30 dagar (+42,1 %) slår både 20 (+3,4 %) och 60 (+27,9 %).
  **Följdändringar.** `prompts/dagligprompt.md` och `prompts/us_dagligprompt.md` (punkterna 0–5),
  `Systemguide.html` avsnitt 4, 5, 6, 7 och 9 (avsnitt 9 helt omskrivet – de gamla siffrorna var
  hämtade ur affärskedjan), samt 21 nya tester i `tests/run.mjs` (347 totalt) som låser
  teleskoperingen, sleevens av/på-invariant, regimfiltret, hålltiden och kostnadsavdraget.
  **Sista buggen i ombyggnaden:** equity-loopen startade på `k=1`, vilket tyst tappade
  entry-dagens avkastning för de affärer som öppnades på strategins allra första dag. Fångas nu
  av invarianttestet "equity = kedjan av affärernas dagsben när boken är fullinvesterad": med en
  plats, vikt 1 och orimligt vida nivåer MÅSTE equity vara exakt lika med affärskedjan.

- ✅ 2026-08-02 (strategiomkalibrering – hållregeln mätt, stoppbanden var artefakter):
  **Fyndet.** Backtestets exit-orsaker visade att **46 % av alla affärer i bästa nordiska cellen
  stängdes av femdagarsklockan** – varken mål eller stop, alltså full rundturskostnad för noll
  information. I bredare celler 62–73 %. Samtidigt hade prompterna redan gått över till
  "BEHÅLL är standardvalet" (2026-07-31), men `backtest.mjs` hade `holdDays: 5` hårdkodat –
  **gridet mätte alltså en strategi böckerna inte längre kör, och nivåbanden i prompterna var
  hämtade ur just det gridet.**
  **Åtgärd 1 – mätningen.** `backtestUniverse` fick ett `mode`-läge. `weekly` = originalet
  (boken byggs om varje måndag, 5 dagars håll). `hold` = platsbaserad portfölj: topN platser, en
  position behåller sin plats tills stop/mål eller `maxHoldDays` (30 handelsdagar ≈ längsta
  katalysatorhorisonten), rotationen fyller bara TOMMA platser. Kedjningen gjordes om till per
  stängd affär i exit-ordning (en veckovis kedja kan varken hantera positioner som spänner över
  flera veckor eller jämföras mellan lägena). Nya nyckeltal: `tradesPerYear`, `avgHoldDays`,
  `costDragPctPerYear`. Gridet kör nu båda lägena och rapporten har en jämförelse cell för cell.
  **Resultat, nordisk bok:** omsättning **205 → 68–112 affärer/år**, tidsexits 470–747 → 12–51,
  kedjat utfall bättre i fyra av sex celler, max drawdown −41,7 % → −28,5 %. PF i stort oförändrad
  (0,89–0,96 → 0,91–0,96) – hållregeln skapar alltså ingen edge, den slutar bränna kostnad.
  **Resultat, US-bok – störst effekt av allt:** PF 0,65–0,79 → **0,80–1,17**, kedjat −72/−85 %
  → **+50,1 %** i bästa cellen (10d −5 %/+10 %). Växlingspåslaget gör varje undviken affär tre
  gånger så värdefull som i den nordiska boken. **Detta motbevisade min egen tidigare slutsats**
  att US-boken inte kunde fungera – den byggde på veckoläget.
  **Åtgärd 2 – rangordningen inverterade, banden skrevs om.** Under femdagarsklockan vann smala
  stopp (−3 %/+6 %) eftersom breda stopp lät fler affärer hinna till tidsexit. Med hållregeln
  vänder det: nordiskt är **−4 %/+8 %** bäst (PF 0,96, kedjat −15,9 %), i US **−5 %/+10 %**
  (PF 1,17). Nordiska bandet ändrat 3–5 % → **4–5 %**, US 4–6 % → **5–6 %**, och förbudet
  "bredda ALDRIG stoppen" är struket – det var en artefakt, inte en marknadsegenskap.
  Katalysatortabellernas stoppkolumner följde med (nordiskt 4–5 % rakt igenom, US 5–6 %), med
  höjda målavstånd i ryktesraden så R/R-kravet 2:1 fortfarande håller.
  **Åtgärd 3 – beslutstakten kopplad till horisonten.** Ny punkt 0b i båda prompterna: i LÄGE A
  poängsätts nya case bara för LEDIGA platser. En position som varken träffat stop/mål eller fått
  sin tes punkterad omprövas inte varje måndag. Att alla platser är upptagna är ett giltigt skäl
  att inte handla alls den veckan.
  **Vad som INTE ändrades:** skelettet ligger fortfarande under köp-och-behåll i båda böckerna
  (nordiskt −15,9 % mot ^OMX +36,3 %; US +50,1 % mot ^GSPC +70,7 %). Indexsleeven är därför
  fortsatt rätt standardplacering och LLM-urvalet måste fortfarande tillföra hela skillnaden.
  Poängvikterna 35/30/15/20 är fortsatt okalibrerade – det kräver ≥ 15 stängda affärer i
  beslutsloggen.

- ✅ 2026-08-02 (högerspalt i Rapporter): rapporttexten är kapad i bredd med flit (radlängd är
  en läsbarhetsfråga), vilket lämnade halva skärmen tom på en bred skärm. Ytan fylls nu med en
  spalt som innehåller **innehållsförteckning** (klickbar, markerar aktivt avsnitt vid rullning),
  **"I korthet"** (läge/marknad/portfölj för dagliga, vecka/klimat/antal bubblare för vecko,
  klimat för scout), **innehav eller case** med beslutsbadge respektive ticker, **bevakning**,
  **nämnda tickers** som klickbara pillar, och **grannavigering** till föregående/nästa rapport
  av samma typ. Allt härleds MEKANISKT ur rapportens markdown – ingen språkmodell, inga nya
  datakällor.
  Nya rena funktioner: `VParse.slugify`, `reportOutline` (hoppar över rubriker i kodblock, ger
  unika id vid dubbletter) och `reportDigest` (en gren per rapporttyp – fälten skiljer sig, och
  ett gemensamt antagande gav tysta tomma kort), plus `VRender.renderReportRail`. App.js sätter
  samma id på de renderade rubrikerna som innehållsförteckningen pekar på, och hanterar att
  rapporten har en EGEN rullningsbox utom i "full höjd"-läget – båda fallen behövs för att
  markeringen ska följa med. Spalten töms i rådataläget och vid sökträffar, där den saknar mening.
  **Bugg som mätningen fångade:** media queryn använde `1fr`, och ett fr-spår har min-content som
  undre gräns. Temat "enkel" låter rapporten flöda utan egen rullningsbox, så en bred tabell
  tryckte isär spåret – **+368 px horisontell översvämning på 390 px skärm**. Fixat med
  `minmax(0,1fr)` + `min-width:0` på `.report`. Verifierat i headless Chrome: 4 teman × 2 bredder,
  alla utan anmärkning. Testsviten: **326 enhetstester** (+18 för de nya funktionerna).

- ✅ 2026-08-02 (två manualer, två målgrupper): den befintliga `Anvandarmanual.html` (19 sidor,
  14 avsnitt) var både för lång för någon som bara vill använda dashboarden och saknade allt som
  byggdes 2026-08-02 – noll träffar på "tema", "inställningar", "ljust", "kugghjul". Delad i två:
  **`Kom-igang.html`** (9 avsnitt, ~7 sidor): vad systemet är och inte är, öppna/installera,
  skärmen på 30 sekunder, läsa ett innehavskort inkl. positionsmätaren, de fyra beskeden,
  utseendeinställningarna, daglig rutin på fem minuter, felsymptomtabell, ordlista. Klarspråk,
  ingen teknik, ingen strategi.
  **`Systemguide.html`** (12 avsnitt, ~10 sidor): de nio delarna och hur de hänger ihop
  (AI-körningar vs nyckellös aritmetik), schemat och varför ordningen ser ut som den gör,
  poängmodellen 35/30/15/20 med de hårda kraven, positionsstorlek och varför kapitalet aldrig
  ligger som kassa, stoppband/kostnadströskel/nåbart mål med härledningen ur backtestet,
  katalysatortabellen, varför BEHÅLL är standardvalet, hur resultatet mäts (brutto vs netto vs
  alpha), **vad backtestet faktiskt visade** (PF < 1,0 netto i båda marknaderna – AI-urvalet
  måste tillföra hela edgen), lärloopen med facit-filtret, kursverifiering och färskhetsspärrar,
  samt en tabell över kända begränsningar (statistiken är ännu brus, vikterna okalibrerade,
  valutaeffekt saknas, ingen orderkoppling).
  `make-manual.bat` skriven om till en `:render`-subrutin som renderar alla tre manualerna,
  hoppar över filer som saknas och räknar misslyckanden i stället för att avbryta på första.
  Verifierat: alla tre PDF:er renderade (184 / 244 / 762 kB) och båda nya kontrollerade visuellt.

- ✅ 2026-08-02 (inställningsvy + konfliktskydd):
  **(1) `assets/settings.js`** (`window.VSettings`) – ny vy `installningar` bakom kugghjulet i
  toppraden. Deklarativ `SCHEMA`-tabell: tema, ljust/mörkt (följ temat / följ systemet / ljust /
  mörkt), textstorlek, täthet, startvy, animationer, rapporthöjd, plus en Data-ruta som visar om
  datan kom förbyggd eller live och som kan hämta om / återställa allt. Vyn renderas ur tabellen,
  så en ny inställning är en post + oftast en rad CSS. Valen blir data-attribut på `<html>` och
  fångas av `base.css` som token-överskrivningar – inget tema behöver känna till dem.
  **Lagring i `localStorage` per enhet och webbläsare**, aldrig i repot. Textstorleken använder
  `zoom` på `.wrap`; alternativet (göra om ~250 px-värden till rem) var en refaktor med långt
  större risk än nyttan. Filen laddas i `<head>` och sätter attributen synkront, annars blinkar
  standardvärdena till före första målningen.
  **Bugg som testet fångade:** inställningarnas `applyMode()` körde vid varje laddning och skrev
  över `?mode=` i URL:en – delbara länkar till ett bestämt läge slutade fungera. Precedensen är
  nu URL > sparat val > temats standardläge.
  **(2) Mobilputs:** temaknapparna flyttade till Inställningar (nås via kugghjulet) och
  varumärkestexten dold – **toppraden 172 → 55 px**, allt på en rad. `.set-opts` fick
  `flex:1 1 auto;min-width:0` sedan startvyns elva alternativ svämmat ut åt höger.
  Verifierat med headless Chrome i en ram på exakt 390 CSS-px: **alla 48 kombinationer**
  (4 teman × 12 vyer) utan anmärkning.
  **(3) `.gitattributes`: `state/dashboard.json` och `search-index.json` märkta `-merge -diff`.**
  Både `dashboard.yml` och lokala körningar skriver filerna, och eftersom hela JSON:en är EN rad
  blev varje samtidig ändring en konflikt – git skrev in `<<<<<<<` mitt i datan, filen slutade gå
  att parsa och webbappen föll TYST tillbaka på ~60 hämtningar. Det inträffade skarpt samma dag
  (auto-committen rebasade mitt i ett lokalt bygge och fastnade). Med `-merge` lämnas filen orörd
  och konflikten flaggas; rätt åtgärd är alltid att bygga om och `git add`.
  Testsviterna: 308 enhet · 96 sim · 30 data · 64 tema+inställningar.

- ✅ 2026-08-02 (mobilvyn – mätt, inte gissad): sökindexet takat till de 30 senaste
  rapporterna (496 → 292 kB) eftersom filen byggs om varje gång en rapport pushas; taket
  redovisas ovanför träfflistan så luckan aldrig är osynlig. Lightweight Charts verifierat mot
  det RIKTIGA v4.2.0-bygget från CDN (14 kontroller: varje anropat API finns, riktig
  price_history-data matas in). **Mobilvyn granskad med headless Chrome i en ram på exakt
  390 CSS-px** – en diagnostiksida svepte 4 teman × 11 vyer och mätte det en skärmbild inte
  visar. Tre verkliga fel hittades och åtgärdades:
  **(1) Botten-baren hamnade på `top=115` i stället för längst ned.** `backdrop-filter` på
  `.headwrap` gör elementet till *containing block* för `position:fixed`-barn – baren
  positionerades relativt toppraden, inte viewporten. Infört i temarefaktorn samma dag när
  toppraden och menyn lades i en gemensam behållare. Fix: `.headwrap{display:contents}` på
  mobil, sticky och bakgrund flyttade till `.topbar`.
  **(2) Toppraden var 172 px hög** (fyra rader) – `.spacer{flex:1}` knuffade allt efter sig till
  egna rader. Fix: spacern döljs på mobil, varumärkesunderrubriken bort, temaväxlaren får en
  egen tunn rad. 172 → 103 px.
  **(3) Tryckytor på 19–32 px** (pillar, chips, "Visa mer", kryssrutor, sorteringsväljare) mot
  riktlinjens ~44. Alla lyfta över 40.
  Dessutom: terminal-temats `.topbar{height:38px}` var ovillkorlig och klippte mobilens andra
  rad – nu scopad till ≥861 px; enkel-temats mobilbrytpunkt flyttad 820 → 860 så spannet
  821–860 inte föll mellan stolarna; aktiv flik rullas in i den scrollbara baren (elva flikar
  ryms inte på en telefonskärm). **Slutresultat: alla 44 kombinationer utan anmärkning.**
  Testsviterna: 308 enhet · 96 sim · 30 data · 48 tema.

- ✅ 2026-08-02 (prestanda + interaktivitet – 4 delar):
  **(1) Förbyggd data.** Webbappen gjorde ~106 nätanrop vid varje laddning (filträd via
  GitHub-API:t + upp till 56 råhämtningar av markdown + JSON) och parsade allt i webbläsaren;
  sökningen hämtade SAMTLIGA 57 rapporter. Kostnaden växte linjärt med 4–5 nya rapportfiler per
  dag. Ny nyckellös, LLM-fri `dashboard.yml` + `.github/scripts/build-dashboard.mjs` kör i
  repo-utcheckningen (ingen nätåtkomst), laddar **samma `assets/vparse.js`** som webbappen –
  ingen ny parsningslogik, samma 308 tester – och skriver `state/dashboard.json` (98 kB, 29 kB
  gzip) + `state/search-index.json` (lat laddad, ersätter 57 hämtningar med 1).
  **Mätt: 106 → 23 anrop, 84 → 6 markdown-hämtningar.** De 6 som är kvar är avsiktliga:
  rapportväljarna visar en vald rapport direkt, och rapporttexten ligger inte i dashboard.json.
  Live-vägen finns kvar som fallback och används automatiskt när filen saknas eller är av fel
  version. Taken per rapporttyp är satta efter vad appen FAKTISKT läser (bara `scouts[0]`
  renderas – de övriga elva stod för 132 av 144 kB i första versionen).
  **(2) Lightweight Charts** (TradingView, 45 kB) i kursmodalen: hårkors som följer muspekaren
  med egen legend, zoom med hjulet, panorering med drag. Chart.js ritar fortfarande
  avkastningskurvan (flera serier + legend). Färgerna läses ur temats CSS-variabler, så
  diagrammet följer ljust/mörkt läge. Chart.js är reserv om CDN:et inte når fram; utan något
  bibliotek tiger modalen i stället för att krascha. OBS: `price_history.json` innehåller bara
  `[datum, stängning]` – **candlesticks är inte möjliga** förrän OHLC hämtas.
  **(3) View Transitions API** (inbyggt i webbläsaren, inget bibliotek) för mjuka vybyten.
  Toppraden/menyn hålls utanför övergången via eget `view-transition-name`, annars blinkar hela
  ramen vid varje flikbyte. Respekterar `prefers-reduced-motion`.
  **(4) `sw.js`** – service worker, appen fungerar offline. **Nät-först, cache som reserv** och
  aldrig tvärtom: appen uppdateras genom filpush utan versionsstämplade filnamn, så cache-först
  skulle servera gammal `vparse.js` mot nya rapporter = tyst felparsning. GitHub-API:t cachas
  aldrig (ett gammalt filträd får appen att leta rapporter som inte finns).
  Nya tester: `tests/data.mjs` (28 kontroller – bevisar att den förbyggda vägen FAKTISKT tas,
  inte bara att appen renderar; mäter anropen per väg) och 8 nya kontroller i `tests/sim.mjs`
  för diagrammets tre vägar. `test.yml` kör båda + bygger dashboard-datan.
  Verifierat 2026-08-02: **308 enhetstester · 96 sim · 28 data · 48 tema**, allt grönt.
- ✅ Dashboarden byggd, modulär, **flikbaserad omdesign** klar; GitHub Pages live.
- ✅ Tre routiner på plats: nordisk rotation (`dagligprompt.md`), scout USA/krypto
  (`scoutprompt.md`), aktieanalys på begäran (`analysprompt.md` + issue/kö-Action).
- ✅ Pris-hämtaren täcker nordiskt + USA/krypto, med **stooq-fallback** när Yahoo fallerar;
  skriver `prices.json` + rullande `price_history.json`.
- ✅ Analytics (handelsstatistik), sparklines och analys-färskhet i dashboarden.
- ✅ Testsvit `tests/run.mjs`; `.gitattributes` normaliserar radslut (OneDrive/CRLF).
- ✅ 2026-07-11: benchmark-overlay i Avkastning (OMXS30 `^OMX` + S&P `^GSPC` vs strategin),
  live-P/L-remsa på innehavskorten (prices.json), kursfärskhets-badge i topbaren, kortkommandon
  (1–7 flikar, R uppdatera), PWA-manifest (`manifest.json` + `assets/icon.svg`), `push.bat`
  (enklicks-commit+push), stängningskurs-crons i `prices.yml` (16:45 + 21:10 UTC),
  `price_history.json` committas nu av actionen (sparkline-fixen), ticker-regexen kräver ≥2 tecken
  i basen (inget "B.ST"-skräp ur "BAHN B.ST"), `config/watchlist.txt` skapad, `portfolj.md` städad,
  tickerformat-krav (bindestreck) tillagt i båda prompterna.
- ✅ 2026-07-11 (Översikt v2): statusrad (datum/läge/beslut-chips + nedräkning till nästa
  schemalagda körning), positionsmätare stopp→entry→nu→mål på innehavskorten, besluts-historik
  som färgpunkter (senaste 10 dagliga rapporterna). OBS: nedräkningen speglar schemat HÅRDKODAT i
  `vparse.js` (`nextRoutineRun`) – uppdatera funktionen om en routine schemaläggs om. Aktuell
  uppsättning står i avsnitt 5b under "SCHEMAT". Testsviten: 50 tester, gröna.
- ✅ 2026-07-12: allt ovan pushat till main och live på Pages. Schemalagda routinerna i drift:
  scout skrev `rapport-260712.md` (första automatiska körningen), `daglig-260711.md` (helgnotis).

- ✅ 2026-07-14: **intradag-monitor** (`monitor.yml` + `alerts.mjs`, LLM-fritt) → `state/alerts.json`
  + signalbanner/GitHub-issue; **Aktuellt innehav** visas nu på Översikt (öppna positioner ur
  `portfolj.md` med live-P/L); analys-loopen stänger cirkeln (köad ticker → watchlist → prices.json
  → verifierad kurs i analysen). Analyser hittills: SYNACT.ST, OSSD.ST, NVO, SAAB.ST.
- ✅ 2026-07-15: **interaktivitets-uppgradering av dashboarden** (ej pushad ännu – kör `push.bat`):
  all hård texttrunkering ersatt av CSS-klamp + "Visa mer/Visa mindre" per kort/notis (hela texten
  finns alltid i DOM; knappen visas bara när texten faktiskt svämmar över), veckans case-katalysator
  behåller nu FULL text i `parseWeekly` (2-menings-klippet borttaget), entry-/kurs-celler visas
  oavkortade. Nya interaktioner: klickbara ticker-pills (→ Analys-fliken, köar inget automatiskt),
  sorterbar Historik-tabell (datum/tal-medveten), filter + sortering (A–Ö/färskhet) i Kurser,
  hopfällbara scout-sektioner (`<details>`, minns läget i localStorage), "Full höjd"-knapp i
  Rapporter (74vh-boxen ↔ full höjd, minns valet). Testsviten: 62 tester, gröna.
  OBS sandlåde-fälla: OneDrive-monteringen serverade trunkerade JS-filer direkt efter redigering →
  testerna kördes mot en verifierad kopia och de verifierade bytesen skrevs tillbaka till repot.
- ✅ 2026-07-16: **arbetskopian flyttad** till `C:\Users\kastrdri\Git_proj\gitVecko_agent` (utanför
  OneDrive). **Prompt-pack:** dagligprompt fick 2b PENDING-PLANER (TRIGGAD/EJ TRIGGAD-check mot
  verifierad kurs), 2c INTRADAG-SIGNALER (läs `state/alerts.json`, agera eller motivera), 0b
  LÄRDOMAR (läs Lärdom-fältet i 4 senaste veckorapporterna) samt watchlist-hygien (≤ 25 tickers,
  14 dagars regel); scoutprompt fick 4b UPPFÖLJNING AV TIDIGARE CASE + watchlist_us-hygien;
  analysprompt fick c2 DELTA MOT CACHE ("Sedan senast"). Körsäkerhet i alla tre prompterna:
  datumverifiering före filnamn, push-fallback (lämna filer + notis till Dren i stället för att
  fastna), `git pull`/raw-URL för färskaste prices.json; daglig BEHÅLL kräver explicit motivering
  genom binära händelser (rapport ≤ 2 dagar bort); rapportkrav om EXAKTA mall-rubriker
  (dashboardens parsningskontrakt). Mallarna uppdaterade med matchande
  sektioner (`## Pending-planer` i daglig_mall, `## Uppföljning av tidigare case` i scout_case,
  `## Sedan senast` i analys_mall). **Dashboard:** "Ändrat idag"-remsa på beslutskorten (diff mot
  gårdagens rapport: beslut/stopp/mål + NY IDAG, `VParse.diffDailies`), klickbara Kurser-kort →
  kurshistorik-modal (Chart.js, 60 dagar), 🔔 Notiser-knapp (skrivbordsnotiser vid nya intradag-
  signaler, alerts.json pollas var 5:e min), tickande nedräkning i statusraden, scout-uppföljning
  parsas + renderas som egen sektion. Testsviten: 72 tester, gröna.
  OBS sandlåde-fälla generellt: sessions-monteringen visar GAMLA bytes en stund efter att filer
  redigerats (gäller ÄVEN utanför OneDrive) – kör tester mot en kopia i outputs-mappen om det
  strular direkt efter redigering.
- ✅ 2026-07-17: **sista webbupgrade-omgången.** Fulltextsökning i Rapporter-fliken (sökfält, Enter →
  söker i ALLA rapporttyper inkl. analyser, träfflista med markerade snippets, klick öppnar
  rapporten; `VParse.searchDocs` + `VRender.renderSearchResults`). "Jämför två"-läge i Analys
  (klicka två cachade analyser → sida vid sida-kolumner). Alert-historik: `alerts.mjs` fick
  `mergeHistory` (utgångna signaler sparas i `alerts.json.history`, max 50, med `expiredAt`) och
  dashboarden visar hopfällbar "Tidigare signaler". Testsviten: 82 tester, gröna.
  OBS: sandlåde-cachen fastnade på stale bytes hela sessionen → verifiering gjordes i en NYSKAPAD
  kopia (nya filer propagerar färskt) och de verifierade bytesen kopierades tillbaka till repot
  med bash-cp (sandlåde→host fungerar). Mönster vid strul: bygg om testträdet under NYTT filnamn.
- ✅ 2026-07-17 (automation-paket): **auto-push** (`auto_push.bat` tyst var 30:e min vardagar 07–19,
  registreras EN gång med `setup_autopush.bat`; loggar till gitignorade `auto_push.log`) – gör
  kedjan routine → push → Pages helt handsfree. **CI-tester** (`test.yml`: hela testsviten +
  node --check på alla JS-moduler vid varje push). **Daglig digest** (`digest.yml` + `digest.mjs`,
  LLM-fritt: bygger sammanfattning av dagens rapport → skapar+stänger issue → e-postnotis;
  dubblett-skydd via titelsökning). **Watchdog** (`watchdog.yml` + `watchdog.mjs`, 10:30 UTC
  vardagar: larmar via issue om prices.json >26 h gammal eller dagens nordiska/scout-rapport
  saknas; dedupe mot redan öppna issues). **Avanza-länk** i kurshistorik-modalen (app.js
  `avanzaUrl`: suffix strippas, klasstreck → mellanslag; döljs för ^index/-USD).
  Testsviten: 91 tester, gröna. **Push-race-fix:** monitor.yml/prices.yml:s commit-steg
  (pull --rebase || true; git push) kunde dö med exit 128 vid kollision med andra pushar
  (mycket vanligare nu med auto-push var 30:e min) – ersatt med retry-loop ×3:
  `pull --rebase -X theirs` (färsk action-data vinner konflikter) + `rebase --abort`-städning
  mellan försöken, samt `fetch-depth: 0` på checkout (grund klon kan inte rebasa när main
  hunnit flytta sig → fatal 128).
- ✅ 2026-07-17 (US-rotation): **ny sjunde del** – en EGEN, USD-denominerad amerikansk
  rotationsportfölj, HELT SEPARAT från nordiska rotationen och scout-idéerna. Egen prompt
  (`prompts/us_dagligprompt.md`, kör ~15:00 CET före US-öppning, LÄGE A måndag / LÄGE B
  bevakning), egna mallar (`templates/us_daglig_mall.md`, `us_vecko_rapport.md`), config
  (`config/fokus_us_rotation.md`), tillstånd (`state/portfolj_us.md`, USD-bok, baslinje 0 %) och
  rapporter (`reports/us_daily/us-daglig-yymmdd.md`, `reports/us_weekly/us-veckorapport-yymmdd.md`).
  **Pre-/after-hours-krav:** prompten kräver att pre-market och gårdagens after-hours-rörelser
  alltid vägs in (stop/mål brutet utanför reguljär session = brutet). **Prisinfra:**
  `fetch-prices.mjs` fick `extractUsPortfolioTickers` + `newestUsWeekly` så US-innehavens kurser
  garanterat hämtas; delar `prices.json`/`watchlist_us.txt`. **Monitor:** `alerts.mjs` läser nu
  BÅDE `portfolj.md` och `portfolj_us.md` (US-tickers får intradag-signaler). **Dashboard:** ny
  flik "US-rotation" (KPIs + innehav/beslut med live-USD-P/L + egen rapportväljare); parsers
  återanvänds oförändrat (parseFilename fick `us_daily`/`us_weekly`, `nextRoutineRun` fick
  us-rotation 15:00, `parsePortfolio` filtrerar nu bort dash-placeholder-rader ur pending).
  **Schemalagd Cowork-task:** `vecko-agent-us-rotation` (mån–fre 15:00, pekar på Git_proj-kopian).
  Testsviten: 100 tester, gröna. OBS: befintliga tasks (scout/nordisk) är `enabled:false` och
  pekar ännu på den UTFASADE OneDrive-kopian – US-tasken pekar korrekt på Git_proj.
- ✅ 2026-07-17 (conviction-viktning + Total-vy): **fast 50/50 ersatt av conviction-viktad sizing**
  i BÅDA böckerna. Prompterna tillåter nu 40–60 % per aktie + kassa (1 aktie + kassa, eller 100 %
  kassa vid svag conviction), varje avvikelse från 50/50 måste motiveras. Ny "Vikt"-kolumn i
  `Aktuellt innehav` + `Historik` (båda portfolj-filerna) och `Planerad vikt` i pending/veckomallar
  (positionellt parsade tabeller lämnades orörda; vikt läses via kolumnnamn så bakåtkompatibelt).
  **Avkastningsmatematiken** (`computeTradeStats`) läser nu per-affär-vikt (`VParse.weightFrac`,
  default 0,5) i stället för hårdkodat 0,5 → korrekt kedjad avkastning vid ojämna vikter.
  **Ny "Total"-flik** (FÖRSTA fliken, default): blended avkastning viktad med kapitalfördelningen
  mellan böckerna (default 50/50, `VParse.combinedReturn`), kapitalfördelnings-stapel och en
  kombinerad tabell med alla öppna positioner (bok-badge + live-P/L ur prices.json). Rena
  procenttal ⇒ ingen FX. `VRender.renderTotal`; "Översikt"-fliken heter nu "Nordisk". Vikt visas
  som pill på innehavskorten (`heldCard`). Testsviten: 115 tester, gröna.
- ✅ 2026-07-17 (dynamisk kapitalvikt mellan böckerna): **åttonde delen** – en veckovis
  ALLOKERINGS-routine som sätter hur totalkapitalet fördelas mellan nordiska och US-boken (i
  stället för fast 50/50 i Total-vyn). Böckerna förblir separata; detta är en övergripande vikt.
  Ny prompt `prompts/allokering.md` (läser båda veckorapporterna + portföljerna, sätter splitten
  inom bandet 0,2–0,8/bok, max ~15 pp rörelse/vecka, motivering krävs), nytt tillstånd
  `state/allocation.json` ({nordic, us, rationale, updatedAt, week}, baslinje 0,5/0,5). **Dashboard:**
  app.js läser allocation.json (defensiv clamp 0,2–0,8, annars 50/50-baslinje) och skickar splitten +
  motivering till `VRender.renderTotal(books, split, meta)`; Total-vyn visar kapitalvikts-stapeln
  enligt den dynamiska splitten + en rad med motiveringen/veckan. **Schemalagd Cowork-task:**
  `vecko-agent-allokering` (måndag ~15:30 CET, efter båda veckorotationerna, pekar på Git_proj).
  Testsviten: 119 tester, gröna. Kapital-splitten är nu det ENDA som allokerings-routinen rör –
  aktievalen sköts fortsatt av respektive boks rotation.

- ✅ 2026-07-31 (miss-retro): **nionde delen** – en veckovis LÄRANDE-loop som granskar veckans
  stora vinnare som INGEN routine fångade (t.ex. Microsoft efter stark rapport), spårar VAR i
  tratten de föll bort och destillerar generaliserbara processregler. Ny prompt
  `prompts/miss_retro.md` (körs fredag kväll/helg via Drens routines): STEG 1 hitta 3–5 missar
  (nyhetssök + `price_history.json`-veckorörelser; miss = varken ägd, pending/bubblare eller
  scout-case; rörelser utan katalysator = brus), STEG 2 traceback med klassificering
  A UTANFÖR UNIVERSUM / B SEDD MEN FÖRKASTAD / C SEDD MEN RANKAD UNDER / D SIGNAL FILTRERAD,
  STEG 3 facit-filter (PROCESSFEL kräver signal tillgänglig FÖRE rörelsen + generaliserbar regel;
  annars ACCEPTABELT UTFALL → "Ingen ändring" – skydd mot hindsight-överanpassning), STEG 4 max
  2 nya lärdomar/vecka till nya `state/lessons.md` (max 10 aktiva, L-ID, arkiv append-only,
  ENDAST retron får skriva i filen; lärdomar aldrig ticker-specifika, får ALDRIG sänka
  kursverifiering/risk-regler). Rapport: `reports/retro/retro-yymmdd.md` enligt nya strikta
  `templates/retro_mall.md`. **Loopen stängd:** dagligprompt/us_dagligprompt fick 1b LÄRDOMAR
  (läs lessons.md i båda lägena, referera L-ID i motiveringar) + utökad 0b; scoutprompt fick 1b.
  Retron rör ALDRIG portföljer/watchlists (genererar inga case). Dashboard-integration byggdes
  samma dag (se webb-paketet nedan).

- ✅ 2026-07-31 (webb-paket): **avkastning uppdateras vid varje SÄLJ** – LÄGE B punkt 8 i
  dagligprompt/us_dagligprompt kräver nu att "Ackumulerad avkastning sedan start" räknas om
  DIREKT i samma körning som ett SÄLJ (inte bara i måndagens FACIT); dashboardens KPI läser
  redan fältet live ur portfolj-filerna. **Ny flik "Retro"** (10:e fliken): aktiva lärdomar ur
  `state/lessons.md` som kort med L-ID-pill (`VParse.parseLessons` + `VRender.renderLessons`)
  + rapportväljare för `reports/retro/` (parseFilename fick typ `retro`; sökningen taggar nu
  även retro/us_daily/us_weekly). **Avkastning:** equity-kurva PER AFFÄR (`buildTradeSeries`:
  en punkt per stängd position, kedjad med per-affär-vikt; orange streckad serie i diagrammet
  med affärens namn+utfall i tooltip) och **månadsheatmap** (`buildMonthlyStats` +
  `renderMonthlyHeatmap`: kedjat viktat utfall per "Stängd"-månad, grön/röd intensitet).
  **Mobil:** scroll-skuggor på breda tabeller (background-attachment-tricket), större
  tryckytor (an-chip/px-item/rtype/sr-hit), modal maxhöjd + lägre diagram, heatmap 2 kolumner.
  **UI-polish:** laddningsskelett (shimmer) i tomma vyer under första hämtningen, tooltips på
  alla handelsstatistik-kort (profit factor förklarad m.m.), färgkodad Utfall %-kolumn i
  Historik, `.empty`-tomlägen som streckade boxar, kortkommando-hinten rättad (1–9 + Esc).
  Testsviten: 140 tester, gröna.

- ✅ 2026-07-31 (design-overhaul): **helt ny layout** – centrerade flik-designen ersatt av
  SIDOPANEL + full skärmbredd ("Quant Deck"-tema: förfinad mörk palett, sky-accent #38BDF8,
  grupperad meny Portfölj/Analys/Data, aktiv-indikator med glow). **Ny startvy "Hem"**
  (default, 11:e vyn): vänsterspalt med BÅDA böckernas innehav/dagens beslut/pending (bok-
  rubriker med ackumulerad avkastning), högerspalt ("rail") med Bevakning inför imorgon,
  Veckans radar, Senaste nytt och Aktiva lärdomar – alla med hopp-länkar till respektive vy
  (`data-goto-view`, delegerat klick i app.js). `renderHem()` i app.js komponerar allt av
  BEFINTLIGA renderare (renderHoldings/renderStatusRow m.fl.) ⇒ vrender orörd, alla 140
  enhetstester opåverkade. Mobil: sidopanelen blir scrollbar botten-bar (data-short-etiketter).
  showView-fallback ändrad till "hem"; statusraden tickar i både Nordisk- och Hem-vyn.
  **Nytt simuleringstest `tests/sim.mjs`** (jsdom, körs INTE i CI): bootar HELA appen med
  mockad fetch som serverar repots riktiga filer, verifierar Live-status, alla 11 vyer,
  navigering och fallback – 27 kontroller. Körs lokalt: `npm i jsdom && node tests/sim.mjs`
  (package.json/package-lock/node_modules gitignoreras). Verifierat 2026-07-31 på Drens
  dator: 140/140 enhetstester + 27/27 sim gröna.

- ✅ 2026-07-31 (sälj-facit + riskmått): **lärloopen täcker nu exits.** `prompts/miss_retro.md`
  fick STEG 3b SÄLJ-FACIT: varje position stängd under perioden utvärderas mot verifierad kurs
  ~5 handelsdagar efter exit → BRA EXIT / NEUTRAL / LÄMNADE PÅ BORDET (trösklar ~5 % Norden /
  ~4 % US), med samma facit-filter som missarna (rotationssälj som stiger = normalt ACCEPTABELT;
  stop-loss som vänder upp = kostnaden för skyddet – lärdomar får ALDRIG mjuka upp stopp-
  disciplin). Lärdomsbudgeten max 2/vecka delas mellan missar och exits. `templates/retro_mall.md`
  fick sektionen "## Sälj-facit (exits under perioden)" (tabell + bedömning). **Riskmått i
  Avkastning:** `VParse.computeRiskStats` (max drawdown på kedjade equity-kurvan, längsta
  förlust-/vinstsvit, volatilitet per affär (stddev), payoff ratio) + `VRender.renderRiskStats`
  (stat-kort med tooltips) i ny sektion under Handelsstatistik (`#riskStats`). Testsviten:
  149 tester; sim: 28 kontroller.

- ✅ 2026-07-31 (idé-pipeline): **bubblare & scout-case kopplade till besluten.**
  (A) OBLIGATORISKT INFLÖDE i LÄGE A: dagligprompt fick 1g BUBBLAR-ÅTERBRUK (förra veckans
  bubblare SKA in i bruttolistan, utfall redovisas som VALD/RANKAD UNDER/STRUKEN);
  us_dagligprompt fick 1g SCOUT-INFLÖDE (US-aktie-case med tes INTAKT ur de 5 senaste
  scout-rapporterna SKA poängsättas – scouten genererar, rotationen beslutar) + 1h
  bubblar-återbruk. (B) VILLKORADE BUBBLAR-PLANER: båda rotationerna FÅR lägga max 2 bubblare
  som pending-planer med explicita nivåer, märkta "BUBBLARE" – befintliga `monitor.yml` larmar
  då intradag utan tokens; KÖP-regeln i LÄGE B fick fall (c) (triggad bubblar-plan + ledig
  kapacitet); ej triggad på 5 handelsdagar → avförs. (C) IDÉFLÖDETS FACIT: miss_retro fick
  STEG 3c (förra veckans bubblare + 5–10 dagar gamla scout-case utvärderas mot verifierad kurs;
  träffbild idéer vs valda case; enskild vecka = brus, ≥ 3 veckors svit krävs för lärdom om
  rankningen). Vecko-mallarna fick fälten "Förra veckans bubblare"/"Scout-inflöde"/"Villkorade
  bubblar-planer" (parse-säkra fältrader); retro_mall fick "## Idéflödets facit". Inga
  JS-ändringar – testsvit/sim opåverkade (149/28).

- ✅ 2026-07-31 (datadrivet fundament – 3 delar):
  **(1) Beslutsdatabas:** nya `state/decisions.json` (version 1, append-only, schema i filens
  comment-fält: date/book/mode/ticker/action/price/weight/entry/stop/target/rr/catalystType-enum/
  sector/rsi/holdDays/outcomePct/reason/lessonIds). Båda rotationsprompterna fick sektionen
  BESLUTSDATABASEN: en rad per beslut varje körning (även AVVAKTA), aldrig ändra befintliga
  rader, JSON-validering med `node -e` före commit. miss_retro fick STEG 3d BESLUTSSTATISTIK
  (vid ≥ 15 SÄLJ-rader: utfall per catalystType/book → lärdomskandidater för poängmodellens
  viktning; ≥ 8 affärer per kategori krävs, annars brus). Syfte: kalibrera 35/30/15/20-vikterna
  mot data i stället för känsla.
  **(2) Nyhetsingestion (dödar kategori A-missar):** ny nyckellös Action `news.yml` (varannan
  timme vardagar) + `fetch-news.mjs` (LLM-fri): läser RSS/Atom ur nya `config/news_feeds.txt`
  (MFN, Cision, GlobeNewswire, PR Newswire, Business Wire; format namn|url, fallerande flöden
  hoppas över med status i JSON:en) → `state/news_feed.json` (dedupe på url, 48h-fönster, max
  300 poster, per-feed-status för felsökning). Rena funktioner parseRss/mergeNews/parseFeedList
  exporterade + testade. Alla tre prompterna fick "NYHETSFLÖDET FÖRST": news_feed.json är
  PRIMÄR nyhetsradar, rubriker verifieras via länken innan beslut, websök blir komplement.
  OBS: kontrollera `feeds`-statusen i news_feed.json efter första körningen och justera
  URL:er i news_feeds.txt om något flöde ger fel.
  **(3) Backtest av mekaniska skelettet:** nya `.github/scripts/backtest.mjs` + universum-filer
  `config/backtest_universe_{nordic,us}.txt` (~30 likvida namn per marknad). Simulerar RAMVERKET
  utan LLM-omdöme (momentum-proxy: topp 2 på lookback-avkastning varje måndag, entry på öppning,
  stop/mål i %, max 5 dagars håll, konservativ stop-före-mål + gap-hantering) över en parameter-
  grid (lookback 10/20 × stop/mål 3/6, 4/8, 5/10 %) och skriver `reports/backtest/backtest-
  yymmdd-<marknad>.md` med träff %, PF, kedjat utfall, max DD och benchmark-jämförelse (^OMX/
  ^GSPC). Körs MANUELLT på Drens dator (kräver nät): `node .github/scripts/backtest.mjs nordic`
  resp. `us` (valfri range, t.ex. `5y`). Rena funktioner (parseCandles/momentumAt/isWeekStart/
  simulateTrade/backtestUniverse/buyHoldPct) exporterade + testade. Testsviten: 168 tester.

- ✅ 2026-07-31 (avkastningspaket – 7 åtgärder mot faktiska läckor i systemet):
  **(1) Backtestet kört för första gången** (`reports/backtest/backtest-260731-{nordic,us}.md`,
  5 år, 30 symboler per marknad, 259/258 veckor). Resultat: BRUTTO ligger skelettet under sitt
  benchmark i båda marknaderna (nordic bäst +22,6 % vs ^OMX +36,3 %; us bäst +61,4 % vs
  ^GSPC +70,9 %) och NETTO efter courtage är allt kraftigt negativt (−36 % resp. −76 %).
  Slutsats: ramverket bär inte sin egen vikt – LLM-urvalet måste tillföra HELA edgen, och
  omsättningstakten (~100 affärer/år) är den enskilt största kostnaden. Nordiskt grid föredrog
  SMALASTE stoppen (−3 %/+6 %, PF 1,08), US-gridet de BREDASTE (20d/−5 %/+10 %, PF 1,13).
  **(2) Kostnader modellerade:** ny `config/kostnader.json` (nordic 0,25 % rundtur; us 0,25 % +
  0,5 % växlingspåslag). `VParse.costFor/netPct`, `computeTradeStats(history, costPct)` ger
  netChainedPct/netWinRate/netProfitFactor/costDragPct, `buildTradeSeries(history, costPct)` ger
  nettokurva med `grossPct` kvar per punkt, nytt stat-kort "Netto efter kostnad".
  `backtest.mjs` läser samma config (`params.costPct`). Bruttotalen är orörda.
  **(3) Valutan redovisad:** `USDSEK=X` tillagd i `config/watchlist_us.txt`, `VParse.fxRate`
  + valutarad i Total-vyn som säger explicit att blended-talet är EXKL. valutaeffekt (historiken
  kan inte räknas om – växelkursen per affär är inte loggad). OBS: `fetch-prices.mjs`
  filtrerade bort valutapar – `collectUsTickers` accepterar nu `^[A-Z]{6}=X$` och `fetchStooq`
  mappar `USDSEK=X` → `usdsek`. Utan den fixen hämtades paret aldrig (34/35 tickers, FX saknades).
  **(4) Beslutsloggen fungerar:** `state/decisions.json` backfylld med 6 historiska rader
  (5 KÖP/SÄLJ ur portföljhistoriken + dagens BEHÅLL Saab, alla märkta
  `"source": "backfill-260731"`), ny `.github/scripts/validate-decisions.mjs`
  (schema, enum, SÄLJ-fält, append-only mot föregående commit) körs i `test.yml`, och watchdogen
  larmar om dagens rapport pushas UTAN rader i loggen. Prompterna pekar nu på validatorn i
  stället för bara `JSON.parse`.
  **(5) Nyhetsingestionen live:** `cision-se` (HTTP 404) och `businesswire-tech` (tomt RSS-skal)
  var döda – ersatta med `sec-8k` (EDGAR Atom, kräver kontakt-UA → `uaFor()`), `fed-press` och
  `globenewswire-earnings`. 6/6 flöden gröna, 137 poster. Ett flöde som svarar 200 men 0 poster
  flaggas nu som "0 poster – kontrollera URL" i stället för att tystna. Watchdogen larmar om
  `news_feed.json` är > 6 h gammal.
  **(6) Prompt-kalibrering (båda rotationerna):** ny sektion "NIVÅER & OMSÄTTNING" med
  backtestade stoppband (nordic 3–5 %, us 4–6 %), **kostnadströskel** (entry→mål minst 6 %
  nordiskt / 8 % i US-boken) och **BEHÅLL som standardval** – 5-dagarsregeln säljer inte längre
  automatiskt, rotation kräver stop/mål, punkterad tes eller ≥ 2 poäng bättre nytt case.
  **(7) Delat entry (4a i båda prompterna):** halva vikten köps direkt vid rotationen, andra
  halvan som villkorad limit i Pending. Motverkar att kapitalet blir stående (Saab v30, Moreld,
  XOM triggade aldrig). Undantag vid gap > 3 % eller binär händelse inom 2 dagar.
  Dessutom: 1g0 NYHETSDRIVEN KANDIDATGENERERING (minst 5 kandidater ur `news_feed.json` innan
  scanning ur minnet) i båda rotationsprompterna, och LÄGE A punkt 0 (FACIT) omskriven i båda så
  den inte längre motsäger BEHÅLL-standarden.
  Testsviten: **214 tester**; sim: **31 kontroller**; `validate-decisions.mjs` OK (6 rader);
  watchdogen "Allt friskt". Allt verifierat på Drens dator 2026-07-31.
  ~~**OBS – inte pushat:**~~ **PUSHAT** – verifierat 2026-08-02: arbetskopian är i synk med
  `origin/main` (varken ahead eller behind). Notisen om att paketet låg lokalt är inaktuell.

- ✅ 2026-07-31 (strategipaket – 5 ändringar av hur kapitalet allokeras och mäts):
  **(1) INDEXSLEEVE ersätter kassa.** Oallokerat kapital parkeras i `XACT-OMXS30.ST` (nordiskt)
  respektive `SPY` (US) i stället för på konto, redovisat som en egen rad i "Aktuellt innehav"
  utan stop/mål. Skälet: backtestet visade att index slog skelettet, så tid utanför marknaden är
  en garanterad kostnad. Frågan strategin svarar på blir därmed den rätta – tillför urvalet något
  UTÖVER index? Sleevens transaktioner loggas med `catalystType: "index"` och ska filtreras bort
  ur urvalsstatistiken. Kassa (0 %) tillåts bara om sleeven inte kan handlas.
  **(2) 4 positioner à 25 % ersätter 2 à 50 %** (conviction-band 15–35 %, max 35 % per aktie,
  max 2 av 4 ryktesdrivna). Halverar enskild-aktie-variansen och fördubblar takten som
  beslutsloggen fylls i – med n=2 gick det inte att skilja skicklighet från slump. Färre än 4
  godkända case fyller bara de platser som håller; resten går till sleeven.
  **(3) ALPHA MOT INDEX (ren kod).** `VParse.benchReturnPct/computeAlpha/computeAlphaStats`
  räknar benchmarkets avkastning över varje affärs EXAKTA hållperiod ur `price_history.json`
  (carry-forward över helger; period utanför historiken ⇒ `null`, aldrig 0). Historik-tabellen
  fick kolumnerna "OMXS30" och "Alpha", och Avkastning-vyn en ny sektion `#alphaStats`
  (snitt-alpha, andel affärer som slog index, summa alpha). Första mätningen: Alleima
  **+6,89 % alpha** (+6,39 % mot OMX −0,50 % under 14–17 juli).
  **(4) KATALYSATORTYPEN STYR PLANEN.** Ny tabell i båda prompterna: `earnings`/`order`/
  `regulatory`/`buyback` ⇒ 3–6 veckors horisont, mål 12–15 % (US 14–18 %); `ma_rumor`/`insider`/
  `index` ⇒ 5–10 dagar, snävare mål och **tidsstopp efter 10 handelsdagar** om tesen inte
  bekräftats; `macro`/`turnaround`/`other` ⇒ 2–4 veckor. Nytt fält `horizonDays` i beslutsloggen.
  **(5) MÅLET MÅSTE VARA NÅBART + realiserad R/R loggas.** Målavståndet får vara högst
  2 × genomsnittlig dagsrörelse × √(handelsdagar i horisonten) – ett analytikerintervall är ett
  påstående, inte en mätning. Vid SÄLJ loggas `realizedRr` (utfall / planerat stoppavstånd).
  Validatorn kontrollerar de nya fälten och att `alphaPct = outcomePct − benchPct`.
  **Infrastruktur som krävdes:** `fetch-prices.mjs` fångade inte ETF-tickers – `TICKER_RE`:s
  efterled vidgat 3→6 tecken och watchlist-filtret 10→14 tecken, annars hade `XACT-OMXS30.ST`
  aldrig hämtats. Verifierat: 37/38 tickers, sleeve-kurserna på plats (XACT 486,10 SEK, SPY 747,03).
  Testsviten: **234 tester**; sim: **33 kontroller**. Allt grönt 2026-07-31.

- ✅ 2026-08-02 (genomgång + åtgärdspaket): en revision av hela systemet mot koden hittade tre
  VERIFIERADE buggar (två av dem hade miss-retron redan pekat ut som åtgärdspunkter till Dren)
  plus tre strukturella luckor. Allt åtgärdat:
  **(1) `previousClose` var fel för SAMTLIGA tickers.** `fetch-prices.mjs` läste
  `meta.chartPreviousClose`, som är stängningen före HELA det begärda fönstret – och fönstret är
  `range=5d`. En veckorörelse presenterades alltså som en dagsrörelse (MSFT "+21,7 %" i stället
  för +3,0 %; scouten flaggade och gick runt felet i fyra rapporter). Live-kontroll 2026-08-02
  visade dessutom att `meta.previousClose` **inte finns alls** i chart-API:ts svar, så fältet
  måste härledas ur serien. Ny exporterad `prevCloseFrom(res)`: sista stängningen DATERAD FÖRE
  `regularMarketTime` (inte "näst sista giltiga" – när dagens bar är okonsoliderad, close = null,
  hade det gett en tvåsessionersrörelse; sett på ELUX-B.ST 2026-07-31). Påverkar även
  dashboardens `fxRate` (USDSEK-dygnsrörelse).
  **(2) `alerts.json` saknade hjärtslag.** `alerts.mjs` returnerade tidigt när signalmängden var
  oförändrad, så `generatedAt` betydde "senast signalerna ändrades" – filen var 2 dygn gammal
  trots sex gröna körningar, och en död monitor gick inte att skilja från en tyst frisk. Ny
  `heartbeatDue(prev, nowISO, maxAgeH = 3)` + fälten `checkedAt` och `watched` skrivs nu även vid
  oförändrat läge, men högst var 3:e timme (annars en commit i timmen av ren tidsstämpel).
  `generatedAt` behåller sin gamla betydelse. `watchdog.mjs` fick nyckeln `alerts` (larmar när
  `checkedAt` > 6 h på en vardag ELLER saknas helt = actionen kör gammal kod). Dashboarden fick
  `VParse.monitorStatus` + en statusrad i `renderAlerts(alerts, mon)` som syns ÄVEN utan signaler
  (grön "Monitorn kontrollerad HH:MM UTC" / gul "Monitorn har tystnat"; tyst på helger).
  **(3) Nyhetsflöden byts inte längre på ett enda fel.** `prnewswire` svarade HTTP 404 en gång
  (2026-07-31T22:17Z) efter att ha levererat 20 poster två timmar tidigare, och svarar 200 vid
  manuell kontroll – transient, inte dött. Ny `fetchFeedText(url, opts)` med ETT omförsök;
  statusen i `news_feed.json` skriver ut "(efter omförsök)" så ett flöde som verkligen dör ändå
  syns. Ingen URL byttes.
  **(4) Breddad missdetektion (dödar kategori A-hålet).** `price_history.json` täcker bara de ~10
  bevakade nordiska tickerna, så retron kunde per konstruktion inte hitta en vinnare systemet
  inte redan tittat på – Electrolux +22 %, Scandi Standard +9,6 % och fem rapportreaktioner
  16–17 juli passerade osedda. Nytt nyckellöst `movers.mjs` + `movers.yml` (lördag 06:00 UTC,
  före retron) hämtar dagsstängningar för `config/universe_nordic_movers.txt` (~110 namn, Large
  OCH Mid Cap) och skriver `state/movers.json` med rörelser över tröskel (default vecka ±8 %,
  dag ±6 %). `miss_retro.md` STEG 1 börjar nu i den filen; `price_history.json` är degraderad
  till komplement med uttrycklig motivering. **Första körningen 2026-08-02 (107/110 hämtade)
  hittade 17 rörelser** och fångade exakt de kända missarna – plus SF.ST +63 %, CTM.ST +32 %,
  HEXA-B +20 % och STAR-B +18 % som ingen sett.
  **(5) Beslutsloggen är nu synlig i dashboarden.** `decisions.json` hade 6 rader, ALLA märkta
  `backfill-260731` – noll live-loggning på två veckor, och det upptäcktes bara för att retron
  letade efter statistik som inte fanns. Nya `VParse.parseDecisions/decisionStats` (aggregerar
  SÄLJ per `catalystType`, exkluderar `index`-sleeven, flaggar kategorier < 8 affärer som "brus",
  räknar backfyllda rader och hur många av de 15 som fattas) + `VRender.renderDecisionStats` i
  ny sektion `#decisionStats` under Handelsstatistik.
  **(6) Sleeve-migrering tvingad.** Båda rotationsprompterna fick punkt 4c: står "Kassa" på > 0 %
  vid rotationens start ska det flyttas till sleeven i DENNA körning (nordiska boken låg på 50 %
  kassa, US-boken på 100 % sedan 2026-07-30 – exakt det sleeven finns för att undvika). Loggas
  med `catalystType: "index"`. Dessutom: HCA/NOC/WFC/MS tillagda i `watchlist_us.txt` (L-2 –
  fyra av fem US-bubblare var omätbara).
  **(7) Slutanvändarmanual.** `Anvandarmanual.html` → `Anvandarmanual.pdf` (19 sidor, svenska,
  14 avsnitt: begrepp, positionsmätaren, besluten, alla vyer, nyckeltalen, analysbeställning,
  lärloopen, daglig rutin, felsökning, ordlista) med två inbäddade skärmbilder i `docs/manual/`
  och `make-manual.bat` för omrendering. Ren bruksanvisning – noll git/tester/filstruktur; den
  tekniska driftmanualen ligger kvar i `MANUAL.md`.
  **(8) Backtestet matchade inte strategin.** Gridet simulerade fortfarande `topN: 2` /
  `weight: 0.5` trots att böckerna gick till 4 à 25 % den 2026-07-31 – och det är UR DET GRIDET
  prompternas hårda stoppband och kostnadströsklar är hämtade. `backtest.mjs` tar nu antal
  positioner som fjärde argument (default 4, vikt = 1/topN), skriver det i rubriken och i
  filnamnet (`backtest-yymmdd-<marknad>-top<N>.md`). Båda marknaderna omkörda 5 år:
  **nordic top4 slår top2 i varje enskild cell** (PF 0,86–0,91 → 0,89–0,96, kedjat −50,5 % →
  −21,2 % i bästa cellen, max DD −58 % → −40 %) – spridningen gör det den ska, och −3 %/+6 %
  är fortfarande bästa bandet, så inga nivåregler behövde ändras. **US top4: PF 0,65–0,79**,
  kedjat −73 % till −86 %, med bredaste kombinationen fortsatt bäst; växlingspåslaget (0,75 %
  rundtur × ~200 affärer/år) äter hela bruttoedgen. Båda prompternas underlagssektion pekar nu
  på rätt fil med rätt siffror, och US-prompten säger uttryckligen att slutsatsen är HÖGRE
  selektivitet, inte jakt på igen-utfall. Bonusfix: filnamnet byggdes av lokalt datum medan
  rubriken skrev UTC, så en körning efter lokal midnatt gav "260802" med "Datum: 2026-08-01".
  **(9) Fyra mindre luckor:** US-boken mättes bara med ackumulerad avkastning – US-vyn har nu
  handelsstatistik, riskmått, alpha mot ^GSPC och historiktabell (samma rena funktioner, US-kostnad
  inkl. växlingspåslag). `price_history.json` höjt 60 → 250 punkter/ticker (alpha-mätningen föll
  tyst ur för affärer äldre än 60 dagar, medan katalysator-horisonten är upp till 6 veckor).
  Watchdogen larmar på `movers.json` äldre än 9 dygn (en död lördagsaction tystade annars
  retrons breddsökning). `SAAB.ST` borttagen ur `config/watchlist.txt` – tickern existerar inte
  på Yahoo (bolaget är `SAAB-B.ST`) och stod för hela "1 av 38 misslyckade" i prices.json.
  **(10) `prices.json` säger nu vilken kodversion som skrev den.** Natten till 2026-08-02 skrev
  den nordiska routinen i `daglig-260801.md` att "`prevCloseFrom`-fixen ser ut att ge korrekta
  värden" – och räknade det på en `prices.json` genererad 22:14 föregående kväll, alltså FÖRE
  fixen pushades. Det gamla felvärdet (601,00 mot korrekta 599,60 för SAAB-B.ST) såg rimligt ut
  för en nordisk ticker, så felet passerade som en verifiering. Grundorsaken var att filen inte
  kunde tala om vilken kod som skapat den. Nytt fält `schemaVersion: "2026-08-02-prevclose"` +
  utökad `note`; alla tre kursläsande prompter kräver nu fältet innan en dagsrörelse räknas ur
  filen, med uttryckligt förbud mot att kalla rättelsen verifierad utan det. Bumpa strängen när
  ett fälts BETYDELSE ändras – inte vid vanliga ändringar.
  **Om beslutsloggen:** de två körningarna 1–2 aug loggade noll rader, men det är KORREKT –
  börserna var stängda och rapporterna säger uttryckligen varför. Loggningskravet har existerat
  i exakt en handelsdag (2026-07-31, backfylld), så **måndag 2026-08-03 är första riktiga testet.**
  **(11) Kurser-vyn visar nu VAD varje ticker är.** Vyn renderade 38 identiska kort, så ett
  innehav såg likadant ut som ett index, ett valutapar eller en ticker som bara låg kvar i
  watchlisten – frågan "vilka aktier bevakar den egentligen?" gick inte att besvara ur
  gränssnittet. Ny `VParse.tickerRoles()` klassificerar varje ticker i prioritetsordning
  innehav > plan > bubblare > sleeve > index > valuta > bevakad, med källorna portföljfilerna,
  veckorapporternas bubblarlistor (fritext ⇒ `tickersInText`, som bara tar nordiska börssuffix
  och parentes-tickers för att inte tolka "VD"/"USA" som symboler) och båda watchlist-filerna
  (app.js hämtar dem nu). Korten fick färgad rollpill + dagsrörelse, vyn fick filterchips med
  antal per roll och sortering på roll (default) / A–Ö / färskhet / dagsrörelse.
  **Dagsrörelsen visas ENDAST om `prices.json` har `schemaVersion`** – annars renderas "–" plus
  en varningsremsa, eftersom previousClose i äldre filer pekar ~en vecka bakåt. Samma spärr som
  prompterna fick, fast i UI:t.
  Testsviten: **308 tester**; sim: **34 kontroller**; `validate-decisions.mjs` OK. Allt grönt.

- ✅ 2026-08-02 (temalager – 4 teman × ljust/mörkt, en enda markup): dashboarden hade under dagen
  vuxit till FYRA index-filer (`index.html` + `index_2/3/4.html`) med var sin komplett kopia av
  DOM:en. Det betydde att varje ny vy måste läggas till fyra gånger och att ljust/mörkt läge hade
  krävt åtta handskrivna paletter. Ersatt av arv:
  **(1) `assets/themes/base.css`** – ALL struktur (~250 selektorer), uttryckt i CSS-variabler.
  Hårdkoda aldrig en färg/radie/typsnittsfamilj där; lägg en token, annars kan inte temana styra
  den. Basen HÄRLEDER dessutom mjuka/linje-/wash-varianter med `color-mix`, och knepet för
  varningstext är att blanda mot `--text-main` (ljus i mörkt läge, mörk i ljust) – samma regel ger
  läsbar text i båda lägena. Ett tema sätter därför **19 tokens per läge**, inte ~50.
  **(2) Fyra temafiler** (`deck`, `nordlys`, `terminal`, `enkel`) med ljus + mörk palett och sina
  strukturella avvikelser: deck lyfter menyn till en fast sidopanel ≥861px, terminal lägger
  rutnät/rasterstruktur och numrerade menyposter, enkel DÖLJER de fem statistiktunga menylänkarna.
  **(3) `assets/theme.js`** (`window.VTheme`) – registret, val via `?theme=`/`?mode=` eller
  localStorage (läget sparas PER tema), växlaren i topbaren, och ETT Chart.js-plugin som läser
  diagramfärger ur CSS-variabler (app.js hårdkodar mörka rutnätsfärger – de skrivs om i
  `beforeInit` i stället för att app.js ändras). `boot()` körs synkront i `<head>` → ingen
  vit blinkning vid laddning. Kortkommandona 1–9 remappas i capture-fasen när ett tema döljer
  menyposter, annars hade "5" i Enkel hoppat till en dold vy.
  **(4) `index_2/3/4.html`** är nu 18-raders stubbar som vidarebefordrar till
  `index.html?theme=…` så gamla bokmärken lever vidare.
  **(5) `tests/theme.mjs`** – DEL A (tokentäckning + klamrar + att registret matchar filerna) körs
  i CI utan beroenden och larmar om ett nytt tema glömmer en variabel, vilket varken run.mjs eller
  sim.mjs kan upptäcka; DEL B kör motorn i jsdom och hoppas över när jsdom saknas. `test.yml` fick
  steget + `node --check assets/theme.js`.
  Verifierat 2026-08-02: **308 enhetstester · 48 temakontroller · 88 sim-kontroller**, allt grönt.
  OBS: `tests/sim.mjs` läser `index.html` hårdkodat – den testar alltså markupen, inte temana.

