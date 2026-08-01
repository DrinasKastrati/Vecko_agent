# Backtest av mekaniska skelettet – nordic (5y)
**Datum:** 2026-08-02 | **Universum:** 30 symboler | **Positioner:** 4 à 25 % | **Benchmark (^OMX) köp-och-behåll:** +36.33 % | **Transaktionskostnad:** 0.25 % per affär (netto)

> Momentum-proxy (positiv lookback-avkastning, topp 2) ersätter LLM:ens case-urval.
> Resultatet validerar RAMVERKET (rotationstakt, stop-/målnivåer, 5-dagars håll) – inte strategin som helhet.

| Lookback | Stop | Mål | Veckor | Affärer | Träff % | Snittvinst | Snittförlust | PF | Kedjat % | Max DD | Mål/Stop/Rot |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 10d | −3 % | +6 % | 259 | 1015 | 46 % | +3.14 % | -2.79 % | 0.95 | -21.37 % | −40.5 % | 145/393/477 |
| 10d | −4 % | +8 % | 259 | 1015 | 47 % | +3.18 % | -3.14 % | 0.90 | -37.47 % | −52.8 % | 82/292/641 |
| 10d | −5 % | +10 % | 259 | 1015 | 48 % | +3.26 % | -3.43 % | 0.89 | -45.06 % | −60.8 % | 42/232/741 |
| 20d | −3 % | +6 % | 257 | 1019 | 47 % | +3.15 % | -2.89 % | 0.96 | -21.19 % | −39.5 % | 145/404/470 |
| 20d | −4 % | +8 % | 257 | 1019 | 49 % | +3.26 % | -3.24 % | 0.95 | -25.80 % | −40.7 % | 85/299/635 |
| 20d | −5 % | +10 % | 257 | 1019 | 50 % | +3.29 % | -3.51 % | 0.93 | -32.38 % | −44.2 % | 44/228/747 |

**Tolkning:** kedjat % över benchmark med rimlig max DD ⇒ skelettet bär sin egen vikt; under ⇒ LLM-urvalet måste tillföra hela edgen. Jämför stop/mål-kombinationerna mot varandra snarare än absoluttalen (momentum-proxyn är trubbigare än case-urvalet).

*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
