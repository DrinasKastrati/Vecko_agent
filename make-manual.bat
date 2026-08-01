@echo off
REM ============================================================
REM  Renderar om anvandarmanualen: Anvandarmanual.html -> Anvandarmanual.pdf
REM
REM  Kor den har efter varje andring i Anvandarmanual.html, annars
REM  ligger PDF:en kvar pa gammalt innehall utan att nagon markar det.
REM  Skarmbilderna i docs\manual\ bakas in automatiskt (relativa lankar).
REM
REM  Vill du ta nya skarmbilder av dashboarden:
REM    chrome --headless --screenshot="docs\manual\hem.png" ^
REM           --window-size=1400,1150 --virtual-time-budget=15000 ^
REM           "https://drinaskastrati.github.io/Vecko_agent/#hem"
REM ============================================================
setlocal

set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not exist "%CHROME%" (
  echo Hittar varken Chrome eller Edge - kan inte rendera PDF.
  exit /b 1
)

if not exist "%~dp0Anvandarmanual.html" (
  echo Saknar Anvandarmanual.html i %~dp0
  exit /b 1
)

echo Renderar Anvandarmanual.pdf ...
"%CHROME%" --headless --disable-gpu --no-sandbox ^
  --print-to-pdf="%~dp0Anvandarmanual.pdf" --print-to-pdf-no-header ^
  --virtual-time-budget=10000 "file:///%~dp0Anvandarmanual.html"

if exist "%~dp0Anvandarmanual.pdf" (
  echo Klart: %~dp0Anvandarmanual.pdf
) else (
  echo Renderingen misslyckades.
  exit /b 1
)

endlocal
