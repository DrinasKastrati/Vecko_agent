# Backtest av mekaniska skelettet – nordic (5y)
**Datum:** 2026-08-02 | **Universum:** 30 symboler | **Positioner:** 4 à 25 % | **Benchmark (^OMX) köp-och-behåll:** +36.33 % | **Transaktionskostnad:** 0.25 % per affär (netto)

> Momentum-proxy (positiv lookback-avkastning, topp 2) ersätter LLM:ens case-urval.
> Resultatet validerar RAMVERKET (rotationstakt, stop-/målnivåer, hållregel) – inte strategin som helhet.
> **VECKOVIS** = boken byggs om varje måndag, max 5 dagars håll (originalet).
> **BEHÅLL** = platsen behålls tills stop/mål eller 30 handelsdagar; rotationen fyller bara tomma platser (regeln böckerna kör sedan 2026-07-31).
> Kedjningen sker per stängd affär i exit-ordning, viktad – samma metod i båda lägena.

| Läge | Lookback | Stop | Mål | Affärer | Aff./år | Snitt dagar | Träff % | PF | Kedjat % | Max DD | Mål/Stop/Tid |
|---|---|---|---|---|---|---|---|---|---|---|---|
| veckovis | 10d | −3 % | +6 % | 1015 | 204 | 3.9 | 46 % | 0.95 | -20.22 % | −41.7 % | 145/393/477 |
| veckovis | 10d | −4 % | +8 % | 1015 | 204 | 4.3 | 47 % | 0.90 | -36.21 % | −53.2 % | 82/292/641 |
| veckovis | 10d | −5 % | +10 % | 1015 | 204 | 4.5 | 48 % | 0.89 | -43.59 % | −61.2 % | 42/232/741 |
| veckovis | 20d | −3 % | +6 % | 1019 | 206 | 3.9 | 47 % | 0.96 | -19.29 % | −38.7 % | 145/404/470 |
| veckovis | 20d | −4 % | +8 % | 1019 | 206 | 4.3 | 49 % | 0.95 | -23.46 % | −39.5 % | 85/299/635 |
| veckovis | 20d | −5 % | +10 % | 1019 | 206 | 4.5 | 50 % | 0.93 | -29.74 % | −42.7 % | 44/228/747 |
| BEHÅLL | 10d | −3 % | +6 % | 540 | 108 | 6.9 | 37 % | 0.94 | -19.36 % | −28.5 % | 183/340/17 |
| BEHÅLL | 10d | −4 % | +8 % | 416 | 84 | 9.9 | 38 % | 0.96 | -15.90 % | −38.1 % | 130/252/34 |
| BEHÅLL | 10d | −5 % | +10 % | 340 | 68 | 12.7 | 37 % | 0.91 | -26.41 % | −37.0 % | 91/200/49 |
| BEHÅLL | 20d | −3 % | +6 % | 552 | 112 | 6.6 | 37 % | 0.93 | -21.17 % | −37.6 % | 191/349/12 |
| BEHÅLL | 20d | −4 % | +8 % | 418 | 85 | 9.8 | 36 % | 0.95 | -17.42 % | −34.5 % | 131/259/28 |
| BEHÅLL | 20d | −5 % | +10 % | 342 | 69 | 12.5 | 36 % | 0.94 | -20.05 % | −37.5 % | 93/198/51 |

**Hållregelns effekt, cell för cell:**

| Cell | PF veckovis → BEHÅLL | Kedjat % veckovis → BEHÅLL | Affärer/år veckovis → BEHÅLL |
|---|---|---|---|
| 10d −3/+6 % | 0.95 → **0.94** | -20.22 → **-19.36** | 204 → **108** |
| 10d −4/+8 % | 0.90 → **0.96** | -36.21 → **-15.90** | 204 → **84** |
| 10d −5/+10 % | 0.89 → **0.91** | -43.59 → **-26.41** | 204 → **68** |
| 20d −3/+6 % | 0.96 → **0.93** | -19.29 → **-21.17** | 206 → **112** |
| 20d −4/+8 % | 0.95 → **0.95** | -23.46 → **-17.42** | 206 → **85** |
| 20d −5/+10 % | 0.93 → **0.94** | -29.74 → **-20.05** | 206 → **69** |

**Tolkning:** kedjat % över benchmark med rimlig max DD ⇒ skelettet bär sin egen vikt; under ⇒ LLM-urvalet måste tillföra hela edgen. Jämför cellerna mot varandra snarare än absoluttalen (momentum-proxyn är trubbigare än case-urvalet). **Skiljer sig rangordningen mellan lägena är nivåbanden en artefakt av hållregeln, inte en egenskap hos marknaden.**

*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
