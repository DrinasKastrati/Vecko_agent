# Mina verkliga affärer — lokalt ifyllda köp- och säljkurser

**Datum:** 2026-08-07
**Ägare:** Dren
**Status:** Godkänd design, ej implementerad
**Skarp start:** måndag 2026-08-10 (v33-rotationen, LÄGE A)

---

## 1. Bakgrund och syfte

Systemet lägger inga ordrar. Roboten skriver `| Saab (SAAB-B.ST) | … | 620,00 kr |`
i `state/portfolj.md` och Dren utför affären hos mäklaren. Kursen 620 är den
**verifierade kurs roboten såg när beslutet fattades** — inte det pris som
faktiskt betalades.

Under pappersperioden spelade skillnaden ingen roll. Från v33-rotationen
2026-08-10 är det riktiga pengar, och då gäller att:

- fylls ordern på 623 i stället för 620 räknar boken ändå på 620,
- hinner Dren inte utföra affären alls redovisar boken en position som inte finns,
- köps ojämna belopp stämmer inte viktningen som avkastningen bygger på.

Felet är litet per affär och **kumulativt över tid**, och ingenting mäter det
i dag. Syftet med den här funktionen är att göra avvikelsen synlig och att låta
Dren se sin egen faktiska avkastning vid sidan av robotens modellerade.

**Ingenting är trasigt.** Roboten gör inte fel — den redovisar korrekt vad den
beslutade. Det som saknas är den andra halvan: vad som verkligen hände.

## 2. Beslut som styr designen

Fem val gjorda av Dren 2026-08-07:

1. **Lagringen är LOKAL**, på samma sätt som temat: `localStorage`, alltså per
   enhet och webbläsare. Inget committas, inget delas, inget syns för någon annan.
2. **Funktionen gör två saker:** visar skillnaden mot robotens kurs på innehavet,
   OCH räknar om avkastningen på Drens egna siffror i ett eget läge.
3. **Fyra fält per affär:** kurs och antal aktier vid köp, kurs och antal vid
   försäljning. Courtaget schabloniseras ur `config/kostnader.json` — det ligger
   på ~0,25 % och påverkar sista decimalen, så manuell inmatning av
   kronor-courtage är inte värd knapptryckningarna.
4. **Inmatningen ligger på innehavskortet i Översikt**, där Dren ändå tittar
   varje dag. Ingen ny flik — det finns redan elva.
5. **En stängd affär utan ifylld säljkurs syns tills den är ifylld.** Rutan
   ligger kvar i Översikt.

### 2.1 Varför siffrorna INTE påverkar robotens beslut

Prompterna kör i GitHub Actions och i Cowork. De kan inte läsa `localStorage`.
Stop-loss, målkurs och entry-villkor prövas därför fortsatt mot **robotens**
entry, aldrig mot Drens.

Det är en avsiktlig begränsning, inte en teknisk eftergift. Läste besluten Drens
lokala siffror skulle två enheter med olika ifylld data ge **olika signaler för
samma position**, och intradag-monitorn (som kör på en runner utan tillgång till
någondera) skulle ge en tredje. Dessutom är beslutsunderlaget kravbundet: varje
kurs ska ha verifierad källa och tidsstämpel (CLAUDE.md avsnitt 4), vilket en
handinmatad siffra per definition inte har.

**Drens siffror mäter utfall. De styr inte beslut.** Godkänt av Dren 2026-08-07.

## 3. Omfattning

**Ingår:**

- Ny modul `assets/fills.js` (`window.VFills`) — lagring, nyckling, beräkning.
- Inmatning på innehavskortet i Översikt.
- Ruta i Översikt för stängda affärer som saknar säljkurs.
- Fjärde läge i Avkastning: **Mina verkliga**, bredvid Nordiska · Amerikanska ·
  Gemensamt.
- Rena funktioner testade i `tests/run.mjs`; vy-integrationen i `tests/sim.mjs`.

**Ingår INTE (medvetet):**

- Export, synk mellan enheter, redigeringshistorik, ångra.
- Ändringar i `state/portfolj.md` eller någon annan fil i repot.
- Ändringar i prompterna eller i `alerts.mjs`.
- Antal aktier i robotens egen bok — kapitalmodellen förblir vikt-%
  (se `2026-08-06-nollstallning-skarp-start-design.md` punkt 1).

## 4. Datamodell

### 4.1 Nyckeln

Varje affär identifieras av **ticker + entry-datum**:

```
SAAB-B.ST|2026-08-10
```

Båda fälten finns i BÅDA tabellerna i `portfolj.md` — `Yahoo-ticker` +
`Entry-datum` under "Aktuellt innehav", och `Aktie` + `Entry-datum` i
"Historik". Nyckeln överlever därför att roboten flyttar positionen från
innehav till historik vid försäljning, vilket är precis vad som får inte gå
förlorat.

Tickern normaliseras till versaler och trimmas, som på andra ställen i
webbappen. Entry-datum används som det står i tabellen (ISO, `YYYY-MM-DD`).

### 4.2 Formen i localStorage

Nyckel: `vr_fills`. En rad per affär:

```json
{
  "SAAB-B.ST|2026-08-10": {
    "bok": "nordic",
    "kop":  { "kurs": 623.50, "antal": 40, "datum": "2026-08-10" },
    "salj": { "kurs": 661.00, "antal": 40, "datum": "2026-08-21" }
  }
}
```

`salj` saknas tills affären stängts och fyllts i. `bok` sätts när posten skapas
och avgör courtagesats och valuta; den härleds ur vilken portföljfil positionen
kom från, inte ur tickern (en US-listad nordisk aktie ska inte gissa fel).

### 4.3 Varför inte `vr_settings`

`VSettings` äger användarens *inställningar* och har en deklarativ `SCHEMA`-tabell
som vyn renderas ur. Affärsdata är inte en inställning och passar inte i den
tabellen. Egen nyckel håller `Återställ inställningar` från att radera
affärshistoriken — den knappen gör `localStorage.removeItem(KEY)`.

## 5. Beräkningen

Ren funktion i `assets/fills.js`, testbar utan DOM:

```
computeMyStats(fills, stangdaAffarer, bok, costPct) -> {
  klara, totalt, saknar[],        // hur många STÄNGDA affärer som går att räkna
  avkastningPct, kronor,          // null när klara < totalt
  perAffar[]                      // { ticker, in, ut, antal, brutto, netto }
}
```

**`totalt` räknar bara STÄNGDA affärer**, alltså rader i robotens historiktabell —
inte öppna positioner. En öppen position har per definition ingen säljkurs, och
räknades den in i nämnaren skulle `klara < totalt` alltid vara sant och talet
aldrig visas. Öppna positioner får därför fyllas i (köpkursen syns på kortet och
mäts mot robotens) men påverkar inte avkastningssiffran förrän roboten stängt dem.

Det speglar `computeTradeStats`, som också räknar på stängda affärer.

Nettot per affär: `(säljkurs − köpkurs) × antal − courtage`, där courtaget är
`roundTripPct` för boken ur `config/kostnader.json` applicerat på omsättningen.

Totalavkastningen viktas på **faktiskt investerat belopp** per affär
(`köpkurs × antal`), inte på robotens vikt-%. Det är hela poängen med att
begära antal.

### 5.1 Regeln som inte får luckras upp

**Ett tal visas aldrig när underlaget är ofullständigt.** Saknas en säljkurs för
en stängd affär redovisar vyn vad som fattas:

> *3 av 5 affärer ifyllda — fyll i resten för att se din avkastning*

Detta speglar `decision_eval.json`:s `insufficient`-regel och rutan "Tillför
urvalet något?" (CLAUDE.md avsnitt 3): hellre "för tidigt" än ett tal som ser
ut att betyda något. En halvfylld verklig avkastning är värre än ingen, för den
inbjuder till jämförelse med robotens.

### 5.2 Valutor hålls isär

Nordiska och amerikanska affärer redovisas var för sig. Ingen gemensam
avkastning, ingen gemensam equity-kurva — samma regel som Avkastning-vyns
gemensamt-läge redan följer (CLAUDE.md: två separat finansierade böcker i olika
valutor har ingen gemensam kurva).

## 6. Gränssnittet

### 6.1 Innehavskortet (Översikt)

En rad under kursen med robotens entry och Drens bredvid varandra. Är de ifyllda
och skiljer sig mer än **1 %** får raden en synlig markering — informativ, inte
ett fel. Tomma fält visas som en diskret "fyll i"-affordans, inte som en varning:
en position som just öppnats är inte ett problem.

### 6.2 Rutan för saknad säljkurs (Översikt)

Visas bara när minst en stängd affär saknar `salj`. Rubrik i klarspråk:

> *2 affärer väntar på din säljkurs*

Fälten ligger direkt i rutan så att det går att fylla i utan att navigera.
Rutan försvinner av sig själv när den sista är ifylld.

Positionen i Översikt är ovanför innehaven men under intradag-signalbannern —
en signal är åtgärdbar nu, en saknad säljkurs är bokföring.

### 6.3 Avkastning: läget "Mina verkliga"

Fjärde knapp i den befintliga bokväljaren (`data-book-set`). Följer samma mönster
som de tre andra: alla lägen renderas alltid och ligger i DOM:en, `data-book` på
`<section id="view-avkastning">` styr vad som visas, och valet sparas inte —
det är en jämförelseväxel, inte en inställning.

Innehåll: Drens avkastning per bok, en tabell per affär, och skillnaden mot
robotens redovisade utfall för samma affärer.

## 7. Konsekvenser att vara medveten om

1. **Data är per enhet.** Fylls något i på telefonen finns det inte på datorn.
   Samma villkor som temat och inställningarna, och det är valt medvetet — men
   det betyder att det inte finns någon backup. Rensad webbläsardata = borta.
2. **Roboten kan stänga en position Dren aldrig öppnade.** Fyller Dren inte i
   något köp för en position redovisar "Mina verkliga" den inte alls. Det är
   korrekt: den affären gjordes inte.
3. **`decision_eval.json` påverkas inte.** Den mäter urvalet mot index och är
   oberoende av vilket pris som faktiskt betalades.
4. **Roboten fortsätter räkna i vikt-%.** Antal aktier finns bara i Drens lokala
   data och läcker aldrig in i portföljfilerna.

## 8. Verifiering

- Rena funktioner (`nyckel`, `computeMyStats`, courtage, ofullständigt
  underlag, valutaseparation) i `tests/run.mjs`, TDD.
- Vy-integrationen i `tests/sim.mjs`, som ska hålla i BÅDA dataläget: tom bok
  (inget att fylla i) och fylld bok. Verifieras mot pappersperiodens böcker
  enligt metoden i CLAUDE.md — exportera en commit med fyllda böcker, bygg om
  dess `dashboard.json` och kör sim.mjs där också.
- `tests/theme.mjs` ska larma om `fills.js` saknas i `SHELL` i `sw.js`
  (samma krav som `settings.js`, vilket saknades där fram till 2026-08-02).
- Ingen ny nätverkshämtning ⇒ `tests/data.mjs` budget på ≤ 30 hämtningar
  är opåverkad (ligger på 29).

## 9. Genomförande

1. `assets/fills.js` med rena funktioner + tester först (TDD).
2. Rendering i `vrender.js`, inkoppling i `app.js`.
3. `fills.js` in i `SHELL` i `sw.js`, bumpa `CACHE`.
4. Avkastning-läget.
5. CLAUDE.md-avsnitt om lagringen, nyckeln och regeln i 5.1.

---

*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
