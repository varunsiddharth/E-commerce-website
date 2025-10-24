@echo off
echo ========================================
echo    E-Commerce Setup Script
echo ========================================
echo.

echo Setting up backend dependencies...
cd backend
npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies
    pause
    exit /b 1
)

echo.
echo Creating environment file...
if not exist .env (
    copy env.example .env
    echo Environment file created. Please edit .env with your settings.
) else (
    echo Environment file already exists.
)

echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Start MongoDB (mongod or MongoDB Atlas)
echo 2. Edit backend/.env with your database settings
echo 3. Run: npm run seed (to populate database)
echo 4. Run: npm start (to start backend server)
echo 5. Open frontend/index.html in your browser
echo.
echo Backend will run on: http://localhost:5000
echo Frontend should be served on: http://localhost:3000
echo.
pause
