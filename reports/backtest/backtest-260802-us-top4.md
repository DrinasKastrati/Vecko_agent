# Backtest av mekaniska skelettet – us (5y)
**Datum:** 2026-08-02 | **Universum:** 30 symboler | **Positioner:** 4 à 25 % | **Benchmark (^GSPC) köp-och-behåll:** +70.72 % | **Transaktionskostnad:** 0.75 % per affär (netto)

> Momentum-proxy (positiv lookback-avkastning, topp 2) ersätter LLM:ens case-urval.
> Resultatet validerar RAMVERKET (rotationstakt, stop-/målnivåer, hållregel) – inte strategin som helhet.
> **VECKOVIS** = boken byggs om varje måndag, max 5 dagars håll (originalet).
> **BEHÅLL** = platsen behålls tills stop/mål eller 30 handelsdagar; rotationen fyller bara tomma platser (regeln böckerna kör sedan 2026-07-31).
> Kedjningen sker per stängd affär i exit-ordning, viktad – samma metod i båda lägena.

| Läge | Lookback | Stop | Mål | Affärer | Aff./år | Snitt dagar | Träff % | PF | Kedjat % | Max DD | Mål/Stop/Tid |
|---|---|---|---|---|---|---|---|---|---|---|---|
| veckovis | 10d | −3 % | +6 % | 1013 | 204 | 3.5 | 38 % | 0.65 | -85.23 % | −85.9 % | 174/488/351 |
| veckovis | 10d | −4 % | +8 % | 1013 | 204 | 4.0 | 41 % | 0.69 | -83.47 % | −84.3 % | 109/378/526 |
| veckovis | 10d | −5 % | +10 % | 1013 | 204 | 4.4 | 43 % | 0.75 | -77.95 % | −79.8 % | 69/279/665 |
| veckovis | 20d | −3 % | +6 % | 1012 | 206 | 3.4 | 39 % | 0.71 | -79.03 % | −79.3 % | 189/485/338 |
| veckovis | 20d | −4 % | +8 % | 1012 | 206 | 4.0 | 42 % | 0.73 | -79.46 % | −79.7 % | 120/390/502 |
| veckovis | 20d | −5 % | +10 % | 1012 | 206 | 4.4 | 44 % | 0.79 | -71.76 % | −72.9 % | 74/287/651 |
| BEHÅLL | 10d | −3 % | +6 % | 621 | 125 | 5.6 | 36 % | 0.80 | -56.62 % | −59.6 % | 216/395/10 |
| BEHÅLL | 10d | −4 % | +8 % | 485 | 98 | 8.1 | 38 % | 0.89 | -36.73 % | −40.0 % | 163/293/29 |
| BEHÅLL | 10d | −5 % | +10 % | 351 | 71 | 12.0 | 44 % | 1.17 | +50.07 % | −31.3 % | 121/186/44 |
| BEHÅLL | 20d | −3 % | +6 % | 653 | 133 | 5.1 | 37 % | 0.82 | -54.21 % | −58.2 % | 234/407/12 |
| BEHÅLL | 20d | −4 % | +8 % | 507 | 103 | 7.6 | 39 % | 0.93 | -28.85 % | −34.2 % | 183/303/21 |
| BEHÅLL | 20d | −5 % | +10 % | 381 | 77 | 10.8 | 44 % | 1.12 | +35.61 % | −23.5 % | 134/204/43 |

**Hållregelns effekt, cell för cell:**

| Cell | PF veckovis → BEHÅLL | Kedjat % veckovis → BEHÅLL | Affärer/år veckovis → BEHÅLL |
|---|---|---|---|
| 10d −3/+6 % | 0.65 → **0.80** | -85.23 → **-56.62** | 204 → **125** |
| 10d −4/+8 % | 0.69 → **0.89** | -83.47 → **-36.73** | 204 → **98** |
| 10d −5/+10 % | 0.75 → **1.17** | -77.95 → **+50.07** | 204 → **71** |
| 20d −3/+6 % | 0.71 → **0.82** | -79.03 → **-54.21** | 206 → **133** |
| 20d −4/+8 % | 0.73 → **0.93** | -79.46 → **-28.85** | 206 → **103** |
| 20d −5/+10 % | 0.79 → **1.12** | -71.76 → **+35.61** | 206 → **77** |

**Tolkning:** kedjat % över benchmark med rimlig max DD ⇒ skelettet bär sin egen vikt; under ⇒ LLM-urvalet måste tillföra hela edgen. Jämför cellerna mot varandra snarare än absoluttalen (momentum-proxyn är trubbigare än case-urvalet). **Skiljer sig rangordningen mellan lägena är nivåbanden en artefakt av hållregeln, inte en egenskap hos marknaden.**

*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
