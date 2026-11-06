@echo off
title Sunday Bazar 1-Click Launcher
color 0A

echo ================================================================
echo         Sunday Bazar - High Performance MERN Stack
echo ================================================================
echo.

echo [Step 1/2] Launching Backend Express Server (MongoDB Atlas Connected)...
start "Sunday Bazar [Backend]" cmd /k "cd /d D:\Mern Sunday-Bazar Web-App\server && npm run dev"

timeout /t 3 /nobreak >nul

echo [Step 2/2] Launching Frontend React App (Vite Development Server)...
start "Sunday Bazar [Frontend]" cmd /k "cd /d D:\Mern Sunday-Bazar Web-App\client && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo Launching Sunday Bazar in your browser...
start http://localhost:5173

echo.
echo ================================================================
echo Sunday Bazar is up and running!
echo Keep the two CMD windows open in background while using the web app.
echo ================================================================
pause
