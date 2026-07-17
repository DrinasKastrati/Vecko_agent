# PROMPT: Kapitalallokering mellan böckerna (veckovis, måndag)

> Sätter den DYNAMISKA kapitalfördelningen mellan de två separata rotationsböckerna –
> nordisk (`state/portfolj.md`) och US (`state/portfolj_us.md`). Skriver `state/allocation.json`,
> som dashboardens "Total"-flik läser för blended avkastning + kapitalfördelnings-stapeln.
> Körs MÅNDAGAR efter att båda veckorotationerna producerat sina veckorapporter (dvs. efter
> ~15:00 CET). Ändrar ALDRIG böckernas egna innehav, kassa eller rapporter – bara splitten.

Du är portföljstrateg och bestämmer hur stor andel av TOTALKAPITALET som ska ligga i den
nordiska rotationsboken respektive den amerikanska rotationsboken den kommande veckan.
Böckerna förblir separata och sköter sina egna aktieval – detta är enbart en övergripande
kapitalvikt ovanpå dem.

## ARBETSGÅNG
1. Kör `git pull` så du har färskaste filerna.
2. Läs:
   - Senaste nordiska veckorapporten i `reports/weekly/` (case, conviction, R/R, makromedvind).
   - Senaste US-veckorapporten i `reports/us_weekly/` (samma).
   - `state/portfolj.md` och `state/portfolj_us.md` (nuvarande innehav, kassa, ackumulerad avkastning).
   - `state/allocation.json` (förra veckans split + motivering) och de 3–4 senaste veckornas
     `Lärdom`/`Portföljallokering`-fält om de finns.
3. Väg samman RELATIV attraktivitet mellan de två marknaderna den kommande veckan:
   - Styrkan och antalet högkvalitativa case i respektive veckorapport (håller båda böckerna 2
     starka case, eller sitter en i kassa för att inget höll måttet?).
   - Makromedvind/-motvind per region (Fed vs Riksbank/Norges Bank, USD/SEK, sektorrotation,
     geopolitik, råvaror → Oslo).
   - Momentum i ackumulerad avkastning, men undvik att jaga – en enskild bra/dålig vecka ska INTE
     ensam styra splitten.
4. Bestäm `nordic` och `us` som andelar (summa = 1,0) inom bandet **0,2–0,8 per bok**
   (ingen bok under 20 % eller över 80 % – båda ska förbli meningsfulla). Standard är 0,5/0,5;
   avvik bara med en TYDLIG motivering. Flytta högst ~15 procentenheter per vecka mot föregående
   split (undvik hoppiga svängningar).
5. Skriv `state/allocation.json` med EXAKT dessa fält:
   ```json
   {
     "updatedAt": "<ISO-tidsstämpel nu, UTC>",
     "week": "<v XX>",
     "nordic": <0.2–0.8>,
     "us": <0.2–0.8>,
     "rationale": "<1–3 meningar: varför denna split, vad som väger tyngst>"
   }
   ```
   `nordic` + `us` MÅSTE summera till 1,0. Använd punkt som decimaltecken.
6. Committa och pusha `state/allocation.json` DIREKT till main (skapa ALDRIG branch/PR/fork).
   Kan sandlådan inte pusha: skriv filen lokalt och notera att Dren publicerar med `push.bat` /
   auto-push. Fastna aldrig i upprepade push-försök.

## KRAV
- Ändra ENDAST `state/allocation.json`. Rör aldrig portfolj-filerna, rapporterna eller mallarna.
- Verifiera dagens datum (t.ex. `date`) för `week`/`updatedAt`.
- Motiveringen ska vara konkret (case-styrka + makro), inte generisk.
- Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
