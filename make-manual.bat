@echo off
REM ============================================================
REM  Renderar manualerna till PDF. Kor den har efter varje andring
REM  i en .html-manual, annars ligger PDF:en kvar pa gammalt
REM  innehall utan att nagon markar det.
REM
REM  Tva HTML-manualer, tva malgrupper (den tredje, MANUAL.md, ar ren
REM  markdown for drift och renderas inte):
REM    Kom-igang.html      -> anvanda dashboarden (enkel)
REM    Systemguide.html    -> forsta hur besluten fattas (djup)
REM
REM  Skarmbilderna i docs\manual\ bakas in automatiskt (relativa lankar).
REM
REM  BADA manualerna hamtar sitt gemensamma utseende ur assets\manual.css
REM  (relativ lank, fungerar aven over file:// som Chrome anvander har).
REM  Andrar du den filen: kor det har skriptet, annars ligger BADA PDF:erna
REM  kvar pa gammalt utseende.
REM
REM  Vill du ta nya skarmbilder av dashboarden:
REM    chrome --headless --screenshot="docs\manual\hem.png" ^
REM           --window-size=1400,1150 --virtual-time-budget=15000 ^
REM           "https://drinaskastrati.github.io/Vecko_agent/#hem"
REM ============================================================
setlocal enabledelayedexpansion

set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not exist "%CHROME%" (
  echo Hittar varken Chrome eller Edge - kan inte rendera PDF.
  exit /b 1
)

set "FEL=0"
call :render Kom-igang
call :render Systemguide

if "%FEL%"=="0" (
  echo.
  echo Klart - alla manualer renderade.
) else (
  echo.
  echo %FEL% manual^(er^) misslyckades.
  exit /b 1
)
endlocal
exit /b 0

REM ---- :render <basnamn>  (utan filandelse) -------------------
:render
if not exist "%~dp0%~1.html" (
  echo Hoppar over %~1.html - filen finns inte.
  exit /b 0
)
echo Renderar %~1.pdf ...
if exist "%~dp0%~1.pdf" del "%~dp0%~1.pdf"
"%CHROME%" --headless --disable-gpu --no-sandbox ^
  --print-to-pdf="%~dp0%~1.pdf" --print-to-pdf-no-header ^
  --virtual-time-budget=10000 "file:///%~dp0%~1.html"
if exist "%~dp0%~1.pdf" (
  echo   OK: %~1.pdf
) else (
  echo   MISSLYCKADES: %~1.pdf
  set /a FEL+=1
)
exit /b 0
