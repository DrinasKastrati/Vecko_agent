# Investeringsfokus & Preferenser – US-rotation (traded portfolio)

> Denna fokusfil gäller ENDAST den amerikanska rotations-routinen (`prompts/us_dagligprompt.md`).
> Den är en EGEN portfölj i USD, parallell med och helt separat från den nordiska rotationen
> (`config/fokus.md`) och från scout-idéerna (`config/fokus_scout.md`). Blanda ALDRIG nordiska
> innehav eller kassaflöden hit. Krypto ingår INTE i den handlade rotationen (scout täcker
> kryptoidéer separat) – detta är en ren US-aktierotation.

## Marknad & universum
- [X] USA: NYSE & NASDAQ (samt NYSE American / Arca). Alla bolagsstorlekar tillåtna.
- [ ] Krypto – UTESLUTS ur den handlade rotationen (scout genererar kryptoidéer separat).
- [ ] Norden – UTESLUTS (täcks av den nordiska rotationen).
- Valuta: **USD**. All P/L, entry, stop, mål och ackumulerad avkastning räknas i USD/procent.

## Strategi (samma ramverk som nordiska rotationen, egen bok)
- Normalt 2 aktier viktade 50/50, roteras varje vecka (måndag = full rotation).
- Dagligt beslut per aktie: KÖP / SÄLJ / BEHÅLL (AVVAKTA om kurs ej kan verifieras).
- Körs FÖRE US-öppning (~15:00 CET / ~09:30 ET-open). Pre-market och gårdagens
  efterhandelsrörelser (after-hours) ska ALLTID vägas in – se prompten.

## Sektorer & teman av intresse
- AI-infrastruktur & halvledare (NVDA, AMD, AVGO, TSM, MU, ASML-ADR).
- Moln & mjukvara med stark prissättningsförmåga och återkommande intäkter.
- Megacap-kvalitet med katalysator (AAPL, MSFT, AMZN, GOOGL, META).
- Utvalda tillväxtbolag som gynnas av fallande/stabila räntor.
- Cykliska vinnare vid tydlig makromedvind (energi vid oljespik, banker vid brant räntekurva).

## Katalysatorer att prioritera
- **Earnings surprises:** bolag som krossat estimat + höjt guidance senaste rapporten.
- **After-hours-/pre-market-rörelser:** rapporter släppta efter stängning eller före öppning
  som ännu inte fullt prisats in i reguljär sessions-kurs.
- **Produkt-/FDA-/regulatoriska godkännanden**, stora kontrakt/ordrar, indexinkludering (S&P/Nasdaq-100).
- **Stora insiderköp** (Form 4), aggressiva återköpsprogram, bekräftade M&A/bud.

## Makro att alltid väga in (USA)
- Fed/FOMC, räntebesked & "dot plot"; CPI/PCE; jobb (NFP, jobless claims); BNP; ISM; PMI.
- DXY (dollarindex), realräntor, 10-årig statsränta, VIX/riskaptit, sektorrotation.
- Definiera vilka US-sektorer som har MEDVIND respektive MOTVIND kommande vecka.

## Likviditets- & riskkrav
- Snittomsättning ≥ 20 MUSD/dag (undvik illikvida small caps med breda spreadar).
- Undvik binära event genom positionen om inte tesen uttryckligen bygger på utfallet.
- Risk/Reward minst 2:1 vid nytt köp. Tvinga aldrig fram case – hellre kassa.
