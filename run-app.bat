@echo off
title Sunday Bazar Launcher
echo ===================================================
echo       Launching Sunday Bazar E-Commerce App
echo ===================================================
echo.

echo [1/2] Starting Backend Server (Port 5000)...
start "Sunday Bazar - Backend" cmd /k "cd /d D:\Mern Sunday-Bazar Web-App\server && npm run dev"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Client (Port 5173)...
start "Sunday Bazar - Frontend" cmd /k "cd /d D:\Mern Sunday-Bazar Web-App\client && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo Opening Sunday Bazar in your default browser...
start http://localhost:5173

echo.
echo ===================================================
echo Both Backend & Frontend servers are running!
echo Keep the two black command windows open while using.
echo ===================================================
exit
