@echo off
rem =====================================================
rem  Enklicks-push: committar ALLA lokala andringar och
rem  pushar till main. Dubbelklicka efter en Cowork-session
rem  (Claude kan skriva filer men inte pusha).
rem  Pushar AVEN redan committade andringar (Cowork kan
rem  committa lokalt utan att kunna pusha).
rem
rem  KONFLIKTHANTERING (tillagd 2026-08-02):
rem  dashboard.yml skriver state/dashboard.json och
rem  state/search-index.json var 30:e minut. Pushar du nara
rem  en sadan korning fastnar "git pull --rebase" i konflikt
rem  och skriptet slutade da tyst utan att nagot nadde GitHub.
rem  De tva filerna ar GENERERADE och ska aldrig handmergas -
rem  ratt atgard ar alltid att bygga om dem. Det gor skriptet
rem  nu automatiskt. Konflikt i NAGON ANNAN fil avbryter
rem  rebasen och lamnar over till dig - inget gissande.
rem =====================================================
setlocal enabledelayedexpansion
cd /d "%~dp0"

git add -A
git diff --cached --quiet
if errorlevel 1 (
  git commit -m "Uppdatering via Cowork %date% %time%"
)

rem Finns lokala commits som inte ligger pa GitHub? (annars avsluta tyst)
git fetch origin main
for /f %%a in ('git rev-list --count origin/main..HEAD') do set AHEAD=%%a
if "%AHEAD%"=="0" (
  echo Inga andringar att pusha - lokalt och GitHub ar i synk.
  pause
  exit /b 0
)

rem  Parenteserna escapas aven har, trots att raden ligger utanfor ett if-block:
rem  hamnar den nagon gang INNE i ett block blir felet samma tysta exit 255 som pa
rem  rad 53, och det ar inte vart att upptacka en andra gang.
echo Pushar %AHEAD% commit^(s^) till GitHub...
git pull --rebase --autostash origin main
if errorlevel 1 call :resolve_rebase
if errorlevel 1 (
  echo.
  echo PUSHEN AVBROTS - inget ar skickat till GitHub.
  echo Ditt arbete ligger kvar committat lokalt och ar inte forlorat.
  pause
  exit /b 1
)

git push origin main

if errorlevel 1 (
  echo.
  echo NAGOT GICK FEL - se felmeddelandet ovan. Vanligaste orsaken
  rem  Parenteserna MASTE escapas med ^ inne i ett if-block. Oescapade stangde de
  rem  blocket i fortid nar cmd parsade filen, varpa resten av raden kordes som ett
  rem  eget kommando och skriptet dog med "- was unexpected at this time." EFTER en
  rem  lyckad push (exit 255 pa en korning som gjort allt ratt). 2026-08-03.
  echo ar en laskonflikt ^(.git/index.lock^) - vanta 10 sek och kor igen.
  pause
  exit /b 1
)

echo.
rem  Inget utropstecken har: med enabledelayedexpansion ater cmd ett ensamt "!"
rem  ur echo-texten, sa "Klart!" skrevs ut som "Klart".
echo Klart - dashboarden uppdateras inom nagon minut.
pause
exit /b 0

rem ---------------------------------------------------------------
rem  :resolve_rebase
rem  Loser rebase-konflikter som BARA ror de tva genererade
rem  JSON-filerna, genom att bygga om dem. Returnerar 0 om rebasen
rem  ar klar, 1 om den avbrutits och kraver handpaslaggning.
rem ---------------------------------------------------------------
:resolve_rebase
set /a TRIES=0

:rr_loop
set /a TRIES+=1
if !TRIES! gtr 10 (
  echo.
  echo For manga rebase-varv - nagot ar fel. Avbryter rebasen.
  git rebase --abort
  exit /b 1
)

rem  Ingen rebase pagar langre = allt loste sig
if not exist ".git\rebase-merge" if not exist ".git\rebase-apply" (
  echo   Rebasen ar klar.
  exit /b 0
)

rem  Vilka filer ar i konflikt just nu?
set "BAD="
set "ANY="
for /f "usebackq delims=" %%f in (`git diff --name-only --diff-filter=U`) do (
  set "ANY=1"
  if /i not "%%f"=="state/dashboard.json" if /i not "%%f"=="state/search-index.json" set "BAD=%%f"
)

if defined BAD (
  echo.
  echo KONFLIKT I EN FIL SOM INTE FAR LOSAS AUTOMATISKT:
  echo   !BAD!
  echo Bara state/dashboard.json och state/search-index.json ar
  echo genererade och kan byggas om. Rebasen avbryts nu - inget
  echo ar pushat och ingenting ar forlorat.
  git rebase --abort
  exit /b 1
)

if not defined ANY (
  rem  Rebasen pagar men inga konflikter kvar - fortsatt bara
  git -c core.editor=true rebase --continue
  goto :rr_loop
)

echo   Konflikt i de genererade JSON-filerna - bygger om dem...
where node >nul 2>&1
if errorlevel 1 (
  echo   Hittar inte node - kan inte bygga om. Avbryter rebasen.
  git rebase --abort
  exit /b 1
)
node .github\scripts\build-dashboard.mjs
if errorlevel 1 (
  echo   build-dashboard.mjs misslyckades. Avbryter rebasen.
  git rebase --abort
  exit /b 1
)
git add state/dashboard.json state/search-index.json
git -c core.editor=true rebase --continue
goto :rr_loop
