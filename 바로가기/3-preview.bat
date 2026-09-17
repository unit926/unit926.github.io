@echo off
chcp 65001 > nul
cd /d "C:\GameDev\AshenAfterimage_Site"
start "" /min powershell -NoProfile -Command "Start-Sleep -Seconds 4; Start-Process 'http://localhost:4321'"
call npm run dev
pause
