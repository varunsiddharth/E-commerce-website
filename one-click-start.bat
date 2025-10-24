@echo off
title E-Commerce One-Click Start

echo ========================================
echo    E-Commerce One-Click Start
echo ========================================
echo.

:: Get project directory
set "PROJECT_DIR=%~dp0"
set "PROJECT_DIR=%PROJECT_DIR:~0,-1%"

:: Start backend
echo [1/3] Starting Backend...
start "Backend" cmd /k "cd /d \"%PROJECT_DIR%\backend\" & npm start"

:: Wait
echo [2/3] Waiting for backend...
timeout /t 8 /nobreak >nul

:: Start frontend
echo [3/3] Starting Frontend...
start "Frontend" cmd /k "cd /d \"%PROJECT_DIR%\frontend\" & npx live-server --port=8080 --entry-file=index.html --no-browser"

:: Wait and open browser
timeout /t 5 /nobreak >nul
start http://localhost:8080/index.html

echo.
echo [SUCCESS] E-Commerce started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:8080
echo.
echo Make sure MongoDB is running (mongod command)
echo Close the server windows to stop the application.
echo.
pause
