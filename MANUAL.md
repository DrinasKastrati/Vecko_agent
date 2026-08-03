# Användarmanual – Vecko_agent

*Senast uppdaterad: 2026-08-01. Teknisk dokumentation finns i `CLAUDE.md` – det här är
bruksanvisningen.*

---

## 1. Vad är det här?

Ett automatiserat beslutsstöd för aktiehandel. Varje handelsdag analyserar AI-routiner
marknaden, fattar beslut (KÖP / SÄLJ / BEHÅLL) om två portföljer och skriver rapporter som du
läser i en webb-dashboard. Systemet lär sig av sina misstag varje vecka och blir mätbart bättre
över tid.

**Viktigt:** allt är beslutsstöd, inte finansiell rådgivning. Systemet handlar inte med riktiga
pengar – det föreslår, du bestämmer.

**De två portföljerna ("böckerna"):**

| Bok | Innehåll | Valuta |
|---|---|---|
| Nordisk | Upp till 4 aktier à ~25 % + indexsleeve (XACT-OMXS30) för oallokerat kapital | SEK |
| US | Amerikanska aktier + SPY-sleeve, helt separat bok | USD |

Kapital som inte har ett aktivt case parkeras i indexfonden i stället för på kontot – tid
utanför marknaden är en kostnad.

---

## 2. Vad händer när? (veckans rytm)

Allt sköts automatiskt via dina routines (tider i svensk tid):

| När | Vad | Gör |
|---|---|---|
| Varje dag 07:47 | Scout USA & Krypto | Marknadsläge, makro, 2–3 nya case-idéer |
| Mån–fre 08:40 | Nordisk rotation | Måndag: full veckorotation. Övriga dagar: bevakning + beslut per innehav |
| Mån–fre 15:00 | US-rotation | Samma för US-boken, före USA-öppning |
| Måndag 15:30 | Kapitalallokering | Sätter fördelningen nordisk/US-bok för veckan |
| Lördag 10:00 | Miss-retro | Granskar veckans missade vinnare + sälj + idéflöde, destillerar lärdomar |

Dessutom kör GitHub automatiskt (utan AI, gratis): kurshämtning var 30:e minut under
handelsdagen, nyhetsinsamling varannan timme, intradag-larm varje timme (flaggar när ett
innehav korsar stopp/mål/entry), daglig sammanfattning via e-post och en vakthund som larmar
om något tystnat.

Routinerna körs bara när Claude-appen är igång. Missad tid körs vid nästa appstart.

---

## 3. Dashboarden

**https://drinaskastrati.github.io/Vecko_agent/** – uppdateras automatiskt någon minut efter
att en routine pushat. Går även att installera som app på mobilen (öppna länken → "Lägg till
på hemskärmen").

| Vy | Vad du ser |
|---|---|
| **Hem** | Startsidan: båda böckernas innehav med live-kurser, dagens beslut, vad som bevakas inför imorgon, senaste nytt, aktiva lärdomar |
| Total | Blended avkastning över båda böckerna + kapitalfördelningen |
| Nordisk / US-rotation | Respektive boks detaljer: positionsmätare (stopp→kurs→mål), pending-planer, rapporter |
| USA & Krypto | Scoutens dagliga marknadsöversikt och case-idéer |
| Aktieanalys | Beställ analys av valfri aktie (se avsnitt 4) |
| Rapporter | Alla rapporter i fulltext + sökfunktion över allt |
| Nyheter & radar | Katalysatorer och kommande händelser |
| Kurser | Alla bevakade tickers med färskhet och kurshistorik (klicka för graf) |
| Avkastning | Handelsstatistik, riskmått, equity-kurva mot OMXS30/S&P 500, månadsheatmap, alla stängda affärer med alpha mot index |
| Retro & lärdomar | Vad systemet missat och vilka regler det lärt sig |

Tips: tangenterna 1–9 byter vy, R uppdaterar. En gul banner betyder att routinen inte kunde
verifiera kurser – det är ett skyddsbeteende, inte ett fel.

---

## 4. Saker du gör själv

**Publicera efter en Cowork-session:** dubbelklicka `push.bat` i repomappen. Den committar och
pushar allt (även sådant Cowork redan committat). **Det är enda vägen ut till GitHub** – auto-pushen
togs bort 2026-08-02.

Skriptet hanterar sedan 2026-08-02 den enda konflikt som uppstår i praktiken: `dashboard.yml` skriver
`state/dashboard.json` och `state/search-index.json` var 30:e minut, så pushar du nära en sådan
körning fastnar `git pull --rebase`. Båda filerna är GENERERADE, så rätt åtgärd är alltid att bygga
om dem – det gör `push.bat` själv och fortsätter sedan rebasen. Du ser raden
`Konflikt i de genererade JSON-filerna - bygger om dem...` när det händer.

Krockar någon **annan** fil avbryter skriptet rebasen och skriver ut filnamnet. Då är inget pushat
och inget förlorat – lös den för hand eller be Claude titta på den. Skriptet gissar aldrig.

**Beställa en aktieanalys:** skriv tickern i dashboardens Analys-vy → skicka in GitHub-ärendet
som öppnas (ett klick) → säg "analysera kön" i Cowork. Analysen dyker upp i dashboarden och
cachas där.

**Slå på push-notiser (engångsjobb, sedan bara 🔔 per telefon):**

1. I repomappen: `node .github/scripts/vapid-keys.mjs`. Den skriver den **publika** nyckeln till
   `config/push.json` (committas) och den **privata** till `.env`, som är gitignorerad. Den
   privata skrivs medvetet inte ut i terminalen – en utskriven hemlighet hamnar i skrollbufferten
   och i loggar. *(Kört 2026-08-03: nycklarna finns redan, hoppa till steg 2.)*
2. Öppna `.env`, kopiera värdet efter `VAPID_PRIVATE_KEY=` och lägg det som hemlighet i GitHub:
   Settings → Secrets and variables → Actions → New repository secret → namn `VAPID_PRIVATE_KEY`.
   Den får aldrig hamna i repot.
3. `push.bat` så `config/push.json` når GitHub.
4. På telefonen: öppna dashboarden, lägg till den på startskärmen, tryck 🔔, godkänn, och skicka
   in det förifyllda GitHub-ärendet ("push: …"). Enheten hamnar i `state/push_subs.json`.
5. Testa: Actions → "Intradag-monitor" → Run workflow → kryssa i `testnotis`. En testnotis ska
   dyka upp på telefonen inom några sekunder.

**Se hur notiserna ser ut** utan att vänta på en riktig signal (kräver att `.env` finns lokalt):

    node .github/scripts/push-notify.mjs --preview --dry-run   (bara i terminalen)
    node .github/scripts/push-notify.mjs --preview             (skickar till telefonen)

Exemplen byggs av samma funktioner som driften, så de visar exakt det format som kommer.
Varken `--preview` eller `--test` rör `push_sent.json`.

**Notisikonen** är `assets/icon-192.png` + `assets/badge-96.png` (statusradens lilla symbol).
De MÅSTE vara PNG – Android renderar inte svg i en notis, och en svg där ger en notis helt utan
ikon utan att något felmeddelande syns. Ändras `assets/icon.svg` eller `assets/icon-badge.svg`:
kör `node .github/scripts/make-icons.mjs` (formen ligger i skriptet och speglar SVG:erna).

Vill du inte ha enhetens endpoint publikt i repot: hoppa över steg 4:s ärende och lägg i stället
hela prenumerations-JSON:en i hemligheten `PUSH_SUBSCRIPTIONS` (en array). Avsändaren läser båda.

Notiserna skickas av `push-notify.mjs` från monitorns timkörning, alltså **inom en timme under
börstid** – inte i sekunden. En egen workflow hade inte hjälpt: GitHub startar inga workflows för
commits gjorda med `GITHUB_TOKEN`, och det är så både `alerts.json` och rapporterna når main.

Kommer inga notiser: kolla i tur och ordning att (a) `config/push.json` har en `vapidPublicKey`,
(b) hemligheten `VAPID_PRIVATE_KEY` finns, (c) `state/push_subs.json` innehåller telefonen,
(d) monitorns logg inte säger "Inga prenumerationer" eller "VAPID-nycklar saknas". Byt **aldrig**
VAPID-par i onödan – alla registrerade enheter blir tysta tills de tryckt 🔔 igen.

**Köra testerna** (efter kodändringar, i terminalen i repomappen):

    node tests/run.mjs        (enhetstester, ska vara 100 % gröna)
    node tests/sim.mjs        (bootar hela dashboarden mot riktig data; kräver: npm install jsdom)

**Köra backtest** (när universum eller stopp/mål-nivåer ändrats, kräver nät):

    node .github/scripts/backtest.mjs nordic 5y 4
    node .github/scripts/backtest.mjs us 5y 4

Sista siffran är antalet samtidiga positioner (vikten följer med: 4 ⇒ 25 % per position).
Utelämnas den används 4, dvs. samma uppsättning som böckerna faktiskt handlas med.

Resultatet hamnar i `reports/backtest/` och syns under Rapporter. Rapporten har fem avsnitt:
huvudgrid (läge × lookback × nivåer), lookback-/skip-svep, indexsleevens effekt, hålltid och
regimfilter, samt out-of-sample. **Läs alltid out-of-sample-avsnittet innan en nivå ändras i en
prompt** – det säger om "bästa cellen" håller i båda halvorna av perioden eller bara är brus.
Talet "Equity %" är den dagliga portföljkurvan (tomma platser ligger i indexsleeven) och är det
som ska jämföras med benchmark; "Kedjat %" är det gamla måttet och finns kvar för jämförelse
med rapporter före 2026-08-02.

---

## 5. Hur systemet lär sig

1. **Varje beslut loggas** strukturerat i `state/decisions.json` – katalysatortyp, nivåer,
   vikt, utfall, alpha mot index. När ~15 affärer stängts kan retron se statistiskt vilka
   typer av case som faktiskt tjänar pengar.
2. **Lördagens miss-retro** granskar tre saker: stora vinnare som systemet missade (och VAR i
   processen de föll bort), försäljningar (såldes för tidigt?), och hur bubblare/scout-idéer
   gick jämfört med det som valdes.
3. **Lärdomar** (max 10 aktiva, med ID som L-1) skrivs till `state/lessons.md` och läses av
   alla routiner vid varje körning. En lärdom är alltid en generaliserbar processregel –
   aldrig "köp aktie X".
4. **Skydd mot självlurendrejeri:** en aktie som steg bevisar inte att processen var fel. En
   enskild vecka är brus. Lärdomar får aldrig sänka säkerhetskraven.

---

## 6. Om något strular

| Symptom | Trolig orsak & åtgärd |
|---|---|
| `push.bat`: "Another git process is running" | Kvarlämnad låsfil. Vänta 10 sek och kör igen, eller ta bort `.git\index.lock` |
| Dashboarden visar gammal data | Kolla att `push.bat` körts och att GitHub Actions är gröna (repot → Actions) |
| Gul "DATAKÄLLA BLOCKERAD"-banner | Routinen kunde inte verifiera kurser och avstod från beslut – självläker oftast vid nästa kurskörning |
| Kurser-vyn tom / konstiga tecken i JSON-filer | Konfliktmarkörer efter auto-push-krock. Kör `git status` i repomappen och be Cowork lösa konflikten |
| Ett nyhetsflöde har slutat fungera | Öppna `state/news_feed.json`, se `feeds`-statusen, byt URL i `config/news_feeds.txt` |
| Vakthunden öppnar ett issue | Läs det – den talar om exakt vad som tystnat (kurser, rapporter, beslutslogg eller nyheter) |
| Rapport saknas en dag | Appen var inte igång vid körtiden – routinen kör vid nästa appstart |

Kör aldrig `fetch-prices.mjs`/`fetch-news.mjs` lokalt på vardagar – GitHub-actionen skriver
samma filer och auto-pushen kan fastna i en konflikt.

---

## 7. Regler som aldrig får brytas

1. **Kursverifieringen sänks aldrig.** Varje kurs kräver källa + tidsstämpel. Utan verifierad
   kurs fattas inget kursbaserat beslut – det är systemets viktigaste skydd.
2. **`state/portfolj.md` och `state/portfolj_us.md` raderas aldrig** – de bär historiken och
   den ackumulerade avkastningen. Historik-sektionerna är append-only.
3. **Mallarna i `templates/` ändras aldrig av routinerna** – dashboarden läser rapporterna
   maskinellt och exakta rubriker är kontraktet.
4. **Ingen separat måndagsprompt** – `dagligprompt.md` gör LÄGE A på måndagar. Den gamla
   `veckoprompt.md` skapade dubblettrapporter och är raderad; lägg aldrig till en ny.
5. **Stop-loss flyttas aldrig nedåt**, och lärdomar får aldrig mjuka upp stoppdisciplinen.
6. **`index.html` ligger alltid i repo-roten** (krav från GitHub Pages).

---

## 8. Filkarta i korthet

| Plats | Innehåll |
|---|---|
| `prompts/` | Instruktionerna till varje routine (= "hjärnorna") |
| `templates/` | Rapportmallar (rör ej) |
| `config/` | Dina preferenser, watchlists, nyhetsflöden, kostnader, backtest-universum |
| `state/` | Levande läge: portföljer, kurser, lärdomar, beslutslogg, nyheter, larm |
| `reports/` | Alla rapporter, sorterade per typ |
| `assets/` + `index.html` | Dashboarden |
| `tests/` | Testsvit + simuleringstest |
| `.github/` | Automatiken (Actions + skript) |
| `docs/` | `HISTORIK.md` (daterad ändringslogg) + skärmbilder till manualerna |
| repo-roten | `Kom-igang.html` (använda), `Systemguide.html` (förstå), `MANUAL.md` (drift) samt `push.bat` och `make-manual.bat` |

---

*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
