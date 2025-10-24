@echo off
echo ========================================
echo    E-Commerce Quick Start
echo ========================================
echo.

:: Get the directory where this batch file is located
set "SCRIPT_DIR=%~dp0"
echo Script directory: %SCRIPT_DIR%

:: Check if directories exist
if not exist "%SCRIPT_DIR%backend" (
    echo ERROR: Backend directory not found at %SCRIPT_DIR%backend
    pause
    exit /b 1
)

if not exist "%SCRIPT_DIR%frontend" (
    echo ERROR: Frontend directory not found at %SCRIPT_DIR%frontend
    pause
    exit /b 1
)

echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d \"%SCRIPT_DIR%backend\" & echo Starting Backend... & npm start"

echo Waiting 5 seconds for backend to initialize...
timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d \"%SCRIPT_DIR%frontend\" & echo Starting Frontend... & npx live-server --port=8080 --entry-file=index.html --no-browser"

echo Waiting 3 seconds for frontend to start...
timeout /t 3 /nobreak >nul

echo.
echo Opening browser...
start http://localhost:8080/index.html

echo.
echo ========================================
echo    Quick Start Complete!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:8080
echo.
echo Check the opened windows for any errors.
echo Close the server windows to stop the application.
echo.
pause
