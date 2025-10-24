# 🔧 E-Commerce Troubleshooting Guide

## Quick Fix for "Error Loading Products"

### Step 1: Start MongoDB
Make sure MongoDB is running:
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud) - update MONGO_URI in backend/.env
```

### Step 2: Start Backend Server
```bash
cd backend
npm start
```
You should see: `🚀 Server running on port 5000`

### Step 3: Seed Database (if empty)
```bash
cd backend
npm run seed
```
You should see: `Database seeding completed!`

### Step 4: Start Frontend Server
```bash
cd frontend
python -m http.server 3000
```

### Step 5: Test the Application
1. Open http://localhost:3000/index.html
2. Open browser developer tools (F12)
3. Check Console tab for any errors
4. Check Network tab to see if API calls are being made

## Common Issues & Solutions

### Issue 1: "Error Loading Products" on Frontend
**Cause**: Frontend cannot connect to backend API

**Solutions**:
1. **Check if backend is running**: Visit http://localhost:5000/api/health
2. **Check CORS**: Backend should allow requests from http://localhost:3000
3. **Check browser console**: Look for CORS or network errors
4. **Verify API endpoint**: Test http://localhost:5000/api/products directly

### Issue 2: Empty Product List
**Cause**: Database is empty or not connected

**Solutions**:
1. **Seed the database**: Run `npm run seed` in backend directory
2. **Check MongoDB connection**: Verify MONGO_URI in backend/.env
3. **Check backend logs**: Look for database connection errors

### Issue 3: CORS Errors
**Cause**: Browser blocking cross-origin requests

**Solutions**:
1. **Use correct URLs**: Frontend on :3000, Backend on :5000
2. **Check CORS config**: Backend should allow frontend origin
3. **Try different browser**: Some browsers have stricter CORS policies

### Issue 4: Port Already in Use
**Cause**: Another process using the same port

**Solutions**:
1. **Kill existing processes**: 
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:5000 | xargs kill -9
   ```
2. **Use different ports**: Update PORT in backend/.env

## Testing Steps

### 1. Test Backend API
```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/products
```

### 2. Test Frontend
1. Open http://localhost:3000/index.html
2. Open Developer Tools (F12)
3. Check Console for errors
4. Check Network tab for API calls

### 3. Test Database
```bash
cd backend
node -e "
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ Database error:', err));
"
```

## Debug Information

### Backend Logs
The backend now logs all requests. Look for:
- `🚀 Server running on port 5000`
- `MongoDB Connected: localhost`
- Request logs: `2025-10-22T17:06:23.205Z - GET /api/products`

### Frontend Console
The frontend now logs API calls. Look for:
- `Loading products...`
- `Making API request to: http://localhost:5000/api/products`
- `API Response status: 200`
- `API Response data: {products: [...]}`

### Common Error Messages

1. **"Failed to fetch"**: Backend not running or CORS issue
2. **"Network Error"**: Check if backend is accessible
3. **"CORS policy"**: Backend CORS configuration issue
4. **"Cannot read properties"**: JavaScript error, check console

## Quick Start Script

Use the provided `start-app.bat` (Windows) or create similar for Mac/Linux:

```bash
# Windows
start-app.bat

# Mac/Linux
chmod +x start-app.sh
./start-app.sh
```

This will:
1. Start backend server
2. Start frontend server  
3. Open browser to frontend
4. Show status messages

## Still Having Issues?

1. **Check all services are running**:
   - MongoDB: `mongod` or MongoDB Atlas
   - Backend: `npm start` in backend/
   - Frontend: `python -m http.server 3000` in frontend/

2. **Verify URLs**:
   - Backend: http://localhost:5000/api/products
   - Frontend: http://localhost:3000/index.html

3. **Check browser console** for detailed error messages

4. **Test API directly** with curl or Postman

5. **Restart all services** if needed

---

**The application should work correctly after following these steps!** 🎉
