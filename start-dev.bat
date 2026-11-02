@echo off
chcp 65001 >nul
title Capstone launcher
echo Starting the API and the React client in two windows...
start "Capstone API  (http://localhost:5000)" cmd /k "cd /d %~dp0server && npm run dev"
timeout /t 2 >nul
start "Capstone Web  (http://localhost:5173)" cmd /k "cd /d %~dp0client && npm run dev"
timeout /t 3 >nul
start "" http://localhost:5173
echo Done. Close the two terminal windows to stop the servers.