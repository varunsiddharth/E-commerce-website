@echo off
setlocal enabledelayedexpansion

title E-Commerce Perfect Startup

echo ========================================
echo    E-Commerce Perfect Startup
echo ========================================
echo.

:: Get project directory
set "PROJECT_DIR=%~dp0"
set "PROJECT_DIR=%PROJECT_DIR:~0,-1%"
echo [INFO] Project directory: %PROJECT_DIR%

:: Verify project structure
echo [CHECK] Verifying project structure...
if not exist "%PROJECT_DIR%\backend" (
    echo [ERROR] Backend directory not found!
    echo Expected: %PROJECT_DIR%\backend
    pause
    exit /b 1
)

if not exist "%PROJECT_DIR%\frontend" (
    echo [ERROR] Frontend directory not found!
    echo Expected: %PROJECT_DIR%\frontend
    pause
    exit /b 1
)

if not exist "%PROJECT_DIR%\frontend\index.html" (
    echo [ERROR] index.html not found in frontend directory!
    echo Expected: %PROJECT_DIR%\frontend\index.html
    pause
    exit /b 1
)

echo [OK] Project structure verified
echo.

:: Check Node.js
echo [CHECK] Verifying Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found! Please install Node.js.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version 2^>nul') do echo [OK] Node.js: %%i
)

echo.
echo [1/4] Starting Backend Server...
echo [START] Opening backend server...
start "E-Commerce Backend" cmd /k "cd /d \"%PROJECT_DIR%\backend\" & echo [BACKEND] Starting Express server... & echo [BACKEND] Server: http://localhost:5000 & echo [BACKEND] Press Ctrl+C to stop & echo. & npm start"

echo [WAIT] Waiting for backend to start...
timeout /t 10 /nobreak >nul

echo.
echo [2/4] Testing Backend...
curl -s http://localhost:5000/api/health >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Backend may not be ready, but continuing...
) else (
    echo [OK] Backend is responding!
)

echo.
echo [3/4] Starting Frontend Server...
echo [START] Opening frontend server...
start "E-Commerce Frontend" cmd /k "cd /d \"%PROJECT_DIR%\frontend\" & echo [FRONTEND] Starting live-server... & echo [FRONTEND] Server: http://localhost:8080 & echo [FRONTEND] Press Ctrl+C to stop & echo. & npx live-server --port=8080 --entry-file=index.html --no-browser --open=/index.html"

echo [WAIT] Waiting for frontend to start...
timeout /t 8 /nobreak >nul

echo.
echo [4/4] Opening Website...
echo [BROWSER] Opening e-commerce website...
timeout /t 3 /nobreak >nul
start "" "http://localhost:8080/index.html"

echo.
echo ========================================
echo    E-Commerce Started Successfully!
echo ========================================
echo.
echo [SUCCESS] Your e-commerce website is now running!
echo.
echo [URLS]
echo Backend API: http://localhost:5000
echo Frontend: http://localhost:8080
echo Website: http://localhost:8080/index.html
echo.
echo [IMPORTANT] Make sure MongoDB is running:
echo - Local: Run 'mongod' in a separate terminal
echo - Cloud: Update MONGO_URI in backend/.env
echo.
echo [CONTROL] To stop servers:
echo - Close the backend terminal window
echo - Close the frontend terminal window
echo.
echo [TROUBLESHOOTING] If you see directory listing:
echo - Check that frontend/index.html exists
echo - Make sure live-server is serving from frontend folder
echo - Verify the website opens at http://localhost:8080/index.html
echo.
echo Press any key to close this window...
pause >nul

