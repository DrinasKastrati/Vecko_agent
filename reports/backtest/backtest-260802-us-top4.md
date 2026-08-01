# Backtest av mekaniska skelettet – us (5y)
**Datum:** 2026-08-02 | **Universum:** 30 symboler | **Positioner:** 4 à 25 % | **Benchmark (^GSPC) köp-och-behåll:** +70.72 % | **Transaktionskostnad:** 0.75 % per affär (netto)

> Momentum-proxy (positiv lookback-avkastning, topp 2) ersätter LLM:ens case-urval.
> Resultatet validerar RAMVERKET (rotationstakt, stop-/målnivåer, 5-dagars håll) – inte strategin som helhet.

| Lookback | Stop | Mål | Veckor | Affärer | Träff % | Snittvinst | Snittförlust | PF | Kedjat % | Max DD | Mål/Stop/Rot |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 10d | −3 % | +6 % | 258 | 1013 | 38 % | +3.62 % | -3.39 % | 0.65 | -85.66 % | −86.0 % | 174/488/351 |
| 10d | −4 % | +8 % | 258 | 1013 | 41 % | +3.80 % | -3.79 % | 0.69 | -84.12 % | −84.7 % | 109/378/526 |
| 10d | −5 % | +10 % | 258 | 1013 | 43 % | +3.91 % | -3.92 % | 0.75 | -78.99 % | −80.5 % | 69/279/665 |
| 20d | −3 % | +6 % | 256 | 1012 | 39 % | +3.76 % | -3.41 % | 0.71 | -79.52 % | −79.5 % | 189/485/338 |
| 20d | −4 % | +8 % | 256 | 1012 | 42 % | +3.95 % | -3.88 % | 0.73 | -80.20 % | −80.2 % | 120/390/502 |
| 20d | −5 % | +10 % | 256 | 1012 | 44 % | +4.05 % | -4.01 % | 0.79 | -72.94 % | −73.7 % | 74/287/651 |

**Tolkning:** kedjat % över benchmark med rimlig max DD ⇒ skelettet bär sin egen vikt; under ⇒ LLM-urvalet måste tillföra hela edgen. Jämför stop/mål-kombinationerna mot varandra snarare än absoluttalen (momentum-proxyn är trubbigare än case-urvalet).

*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
