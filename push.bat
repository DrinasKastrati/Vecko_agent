@echo off
rem =====================================================
rem  Enklicks-push: committar ALLA lokala andringar och
rem  pushar till main. Dubbelklicka efter en Cowork-session
rem  (Claude kan skriva filer men inte pusha).
rem  Pushar AVEN redan committade andringar (Cowork kan
rem  committa lokalt utan att kunna pusha).
rem =====================================================
cd /d "%~dp0"

git add -A
git diff --cached --quiet
if %errorlevel% neq 0 (
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

echo Pushar %AHEAD% commit(s) till GitHub...
git pull --rebase --autostash origin main
git push origin main

if %errorlevel%==0 (
  echo.
  echo Klart! Dashboarden uppdateras inom nagon minut.
) else (
  echo.
  echo NAGOT GICK FEL - se felmeddelandet ovan. Vanligaste orsaken
  echo ar en laskonflikt (.git/index.lock) - vanta 10 sek och kor igen.
)
pause
