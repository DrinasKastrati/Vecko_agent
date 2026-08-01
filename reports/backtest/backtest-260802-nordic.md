# Backtest av mekaniska skelettet – nordic (5y)
**Datum:** 2026-08-01 | **Universum:** 30 symboler | **Benchmark (^OMX) köp-och-behåll:** +36.33 % | **Transaktionskostnad:** 0.25 % per affär (netto)

> Momentum-proxy (positiv lookback-avkastning, topp 2) ersätter LLM:ens case-urval.
> Resultatet validerar RAMVERKET (rotationstakt, stop-/målnivåer, 5-dagars håll) – inte strategin som helhet.

| Lookback | Stop | Mål | Veckor | Affärer | Träff % | Snittvinst | Snittförlust | PF | Kedjat % | Max DD | Mål/Stop/Rot |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 10d | −3 % | +6 % | 259 | 515 | 43 % | +3.40 % | -2.86 % | 0.91 | -35.98 % | −54.3 % | 81/217/217 |
| 10d | −4 % | +8 % | 259 | 515 | 45 % | +3.43 % | -3.23 % | 0.88 | -48.90 % | −63.5 % | 51/165/299 |
| 10d | −5 % | +10 % | 259 | 515 | 47 % | +3.61 % | -3.58 % | 0.89 | -48.24 % | −69.4 % | 30/130/355 |
| 20d | −3 % | +6 % | 257 | 513 | 45 % | +3.20 % | -3.00 % | 0.86 | -50.46 % | −58.1 % | 73/221/219 |
| 20d | −4 % | +8 % | 257 | 513 | 46 % | +3.43 % | -3.44 % | 0.85 | -57.24 % | −64.8 % | 46/174/293 |
| 20d | −5 % | +10 % | 257 | 513 | 47 % | +3.60 % | -3.70 % | 0.87 | -54.58 % | −65.0 % | 28/133/352 |

**Tolkning:** kedjat % över benchmark med rimlig max DD ⇒ skelettet bär sin egen vikt; under ⇒ LLM-urvalet måste tillföra hela edgen. Jämför stop/mål-kombinationerna mot varandra snarare än absoluttalen (momentum-proxyn är trubbigare än case-urvalet).

*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
