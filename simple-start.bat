@echo off
setlocal enabledelayedexpansion

:: Prevent the window from closing automatically
title E-Commerce Simple Startup

echo ========================================
echo    E-Commerce Simple Startup
echo ========================================
echo.

:: Get current directory (where this batch file is located)
set "CURRENT_DIR=%~dp0"
:: Remove trailing backslash
set "CURRENT_DIR=%CURRENT_DIR:~0,-1%"
echo [INFO] Project directory: %CURRENT_DIR%
echo [INFO] Current working directory: %CD%
echo.

:: Check if we're in the right place
echo [CHECK] Verifying project structure...
if not exist "%CURRENT_DIR%\backend" (
    echo [ERROR] Backend folder not found!
    echo Expected location: %CURRENT_DIR%\backend
    echo Please run this script from the project root directory.
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

if not exist "%CURRENT_DIR%\frontend" (
    echo [ERROR] Frontend folder not found!
    echo Expected location: %CURRENT_DIR%\frontend
    echo Please run this script from the project root directory.
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

echo [OK] Project structure verified
echo.

:: Quick dependency check
echo [CHECK] Verifying Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version 2^>nul') do echo [OK] Node.js version: %%i
)

echo.
echo [1/4] Starting Backend Server...
echo [START] Opening backend server window...
start "E-Commerce Backend Server" cmd /k "cd /d \"%CURRENT_DIR%\backend\" & echo [BACKEND] Starting Express server... & echo [BACKEND] Server will run on http://localhost:5000 & echo [BACKEND] Press Ctrl+C to stop the server & echo. & npm start"

echo [WAIT] Waiting 8 seconds for backend to start...
timeout /t 8 /nobreak >nul

echo.
echo [2/4] Testing Backend Connection...
curl -s http://localhost:5000/api/health >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Backend may not be ready yet, but continuing...
    echo [INFO] Check the backend window for any errors.
) else (
    echo [OK] Backend is responding! ✓
)

echo.
echo [3/4] Starting Frontend Server...
echo [START] Opening frontend server window...
start "E-Commerce Frontend Server" cmd /k "cd /d \"%CURRENT_DIR%\frontend\" & echo [FRONTEND] Starting live-server... & echo [FRONTEND] Server will run on http://localhost:8080 & echo [FRONTEND] Press Ctrl+C to stop the server & echo. & npx live-server --port=8080 --entry-file=index.html --no-browser"

echo [WAIT] Waiting 5 seconds for frontend to start...
timeout /t 5 /nobreak >nul

echo.
echo [4/4] Opening Browser...
echo [BROWSER] Opening http://localhost:8080 in your default browser...
timeout /t 2 /nobreak >nul
start "" "http://localhost:8080/index.html"

echo.
echo ========================================
echo    Simple Startup Complete!
echo ========================================
echo.
echo [INFO] Backend Server: http://localhost:5000
echo [INFO] Frontend Server: http://localhost:8080
echo [INFO] API Health Check: http://localhost:5000/api/health
echo.
echo [IMPORTANT] Make sure MongoDB is running:
echo   - Local: Run 'mongod' command in a separate terminal
echo   - Cloud: Update MONGO_URI in backend/.env for MongoDB Atlas
echo.
echo [CONTROL] To stop the servers:
echo   - Close the "Backend Server" window to stop backend
echo   - Close the "Frontend Server" window to stop frontend
echo.
echo [DEBUG] If you see errors:
echo   - Check the backend and frontend windows for error messages
echo   - Make sure ports 5000 and 8080 are not in use by other applications
echo   - Verify MongoDB is running and accessible
echo.
echo Press any key to close this startup window...
pause >nul
