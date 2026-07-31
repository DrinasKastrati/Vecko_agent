# Backtest av mekaniska skelettet – us (5y)
**Datum:** 2026-07-31 | **Universum:** 30 symboler | **Benchmark (^GSPC) köp-och-behåll:** +71.07 % | **Transaktionskostnad:** 0.75 % per affär (netto)

> Momentum-proxy (positiv lookback-avkastning, topp 2) ersätter LLM:ens case-urval.
> Resultatet validerar RAMVERKET (rotationstakt, stop-/målnivåer, 5-dagars håll) – inte strategin som helhet.

| Lookback | Stop | Mål | Veckor | Affärer | Träff % | Snittvinst | Snittförlust | PF | Kedjat % | Max DD | Mål/Stop/Rot |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 10d | −3 % | +6 % | 258 | 513 | 36 % | +4.01 % | -3.42 % | 0.67 | -86.65 % | −88.2 % | 96/256/161 |
| 10d | −4 % | +8 % | 258 | 513 | 39 % | +4.32 % | -3.84 % | 0.73 | -83.39 % | −85.8 % | 69/199/245 |
| 10d | −5 % | +10 % | 258 | 513 | 41 % | +4.36 % | -4.10 % | 0.75 | -82.76 % | −85.2 % | 43/161/309 |
| 20d | −3 % | +6 % | 256 | 512 | 40 % | +4.01 % | -3.66 % | 0.72 | -81.49 % | −81.5 % | 108/265/139 |
| 20d | −4 % | +8 % | 256 | 512 | 43 % | +4.30 % | -4.28 % | 0.75 | -82.40 % | −82.4 % | 77/222/213 |
| 20d | −5 % | +10 % | 256 | 512 | 45 % | +4.38 % | -4.47 % | 0.80 | -76.41 % | −76.4 % | 46/167/299 |

**Tolkning:** kedjat % över benchmark med rimlig max DD ⇒ skelettet bär sin egen vikt; under ⇒ LLM-urvalet måste tillföra hela edgen. Jämför stop/mål-kombinationerna mot varandra snarare än absoluttalen (momentum-proxyn är trubbigare än case-urvalet).

*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
