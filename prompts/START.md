# START – korta laddare att klistra in i Claude-appens routines

**Problemet detta löser:** om hela prompten klistras in i routinen fryser den vid inklistringens
version. Varje gång en prompt i `prompts/` ändras måste du redigera routinen manuellt, och gör du
inte det kör roboten på gammal logik utan att någon märker det.

**Lösningen:** klistra in en femradig LADDARE i stället. Laddaren hämtar den senaste prompten ur
GitHub vid varje körning. Efter det räcker det att ändra filen i repot – routinen behöver aldrig
röras igen.

Texterna nedan är kompletta: kopiera hela blocket in i routinens prompt-fält, en gång per routine.

---

## Variant A – routinen kör i den lokala arbetskopian (rekommenderas)

Använd denna när routinen har tillgång till `C:\Users\drini\code\Vecko_agent`. Den är säkrast:
prompten läses från disk och rapporterna kan skrivas och committas direkt.

### Scout USA & Krypto (dagligen 07:47)
```
Arbeta i C:\Users\drini\code\Vecko_agent.
1. Kör `git pull` så arbetskopian är färsk.
2. Läs prompts/scoutprompt.md i sin helhet.
3. Följ den instruktionen exakt, från början till slut. Den är facit – följ den framför
   eventuella minnen av hur routinen brukade fungera.
Avvik inte från prompten och sammanfatta den inte. Är filen oläsbar: avbryt och rapportera det
i stället för att gissa dig fram.
```

### Nordisk rotation (mån–fre 08:40)
```
Arbeta i C:\Users\drini\code\Vecko_agent.
1. Kör `git pull` så arbetskopian är färsk.
2. Läs prompts/dagligprompt.md i sin helhet.
3. Följ den instruktionen exakt, från början till slut. Den väljer själv LÄGE A (måndag) eller
   LÄGE B (övriga handelsdagar) – gör inte det valet åt den.
Avvik inte från prompten och sammanfatta den inte. Är filen oläsbar: avbryt och rapportera det
i stället för att gissa dig fram.
```

### US-rotation (mån–fre 15:00)
```
Arbeta i C:\Users\drini\code\Vecko_agent.
1. Kör `git pull` så arbetskopian är färsk.
2. Läs prompts/us_dagligprompt.md i sin helhet.
3. Följ den instruktionen exakt, från början till slut. Den väljer själv LÄGE A (måndag) eller
   LÄGE B (övriga handelsdagar).
Avvik inte från prompten och sammanfatta den inte. Är filen oläsbar: avbryt och rapportera det
i stället för att gissa dig fram.
```

### Kapitalallokering (måndag 15:30)
```
Arbeta i C:\Users\drini\code\Vecko_agent.
1. Kör `git pull` så arbetskopian är färsk.
2. Läs prompts/allokering.md i sin helhet.
3. Följ den instruktionen exakt. Den rör ENDAST state/allocation.json – aldrig portföljer,
   rapporter eller mallar.
Avvik inte från prompten och sammanfatta den inte.
```

### Miss-retro (lördag 10:00)
```
Arbeta i C:\Users\drini\code\Vecko_agent.
1. Kör `git pull` så arbetskopian är färsk.
2. Läs prompts/miss_retro.md i sin helhet.
3. Följ den instruktionen exakt. Den skriver retro-rapporten och är den ENDA routine som får
   ändra state/lessons.md.
Avvik inte från prompten och sammanfatta den inte.
```

---

## Variant B – routinen har ingen lokal arbetskopia

Använd denna om routinen kör i en miljö utan repot på disk (molnagent, annan dator). Prompten
hämtas då direkt från GitHub. Byt filnamnet på sista raden per routine.

```
Hämta https://raw.githubusercontent.com/DrinasKastrati/Vecko_agent/main/prompts/dagligprompt.md
och följ instruktionen i den filen exakt, från början till slut.

Filen är facit. Följ den framför eventuella minnen av hur routinen brukade fungera, och
sammanfatta den inte – arbeta igenom den steg för steg.

Övriga filer den hänvisar till (state/, config/, templates/, reports/) ligger i samma repo och
hämtas på samma sätt:
https://raw.githubusercontent.com/DrinasKastrati/Vecko_agent/main/<sökväg>

Kan du inte skriva tillbaka till repot: skriv rapporten i svaret och notera tydligt att den
behöver sparas manuellt.
```

Byt ut `dagligprompt.md` mot `scoutprompt.md`, `us_dagligprompt.md`, `allokering.md` respektive
`miss_retro.md`.

**Variant B är sämre än A** – utan skrivrättigheter till repot kan routinen varken uppdatera
portföljfilen, beslutsloggen eller pusha rapporten, och kedjan till dashboarden bryts. Använd
den bara när A inte är möjlig.

---

## Efter bytet

1. Kör varje routine en gång manuellt ("Run now") och kontrollera att den läser rätt fil och
   producerar samma sorts rapport som tidigare.
2. Därefter: **ändra bara filerna i `prompts/` och pusha.** Nästa körning använder den nya
   versionen automatiskt.
3. Lägg ALDRIG till en separat måndagsprompt – `dagligprompt.md` gör LÄGE A på måndagar. Den
   gamla `veckoprompt.md` körde rotationen en andra gång, skapade dubbletter och är raderad.
4. `prompts/analysprompt.md` är MANUELL (körs när analyskön har poster) och behöver ingen routine.

## Varför laddaren säger "läs hela filen"

Prompterna är 50–300 rader och innehåller hårda spärrar – kursverifieringskrav, stop-disciplin,
append-only-regler. En modell som sammanfattar prompten i stället för att följa den tappar
typiskt just spärrarna, eftersom de läser som upprepningar. Därav den uttryckliga formuleringen.
