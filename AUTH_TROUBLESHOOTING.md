# 🔧 DealFlow Auth Troubleshooting Guide

## ✅ What We Fixed

### Backend Issues
- ✅ Fixed discovery.py syntax error (malformed code)
- ✅ Added Discovery models to database initialization
- ✅ Created complete discovery routes with job processing
- ✅ Implemented IngestionService with YC/Crunchbase/AngelList APIs

### Frontend Issues
- ✅ Added 10-second timeout to auth requests (prevents indefinite loading)
- ✅ Added AbortController for request cancellation
- ✅ Added error handling with user-friendly messages
- ✅ Export API_BASE_URL for reusability

## 🧪 Verified Working

```bash
✅ Backend running: http://localhost:8000
✅ Register: POST /api/v1/auth/register → 201 Created
✅ Login: POST /api/v1/auth/login → 200 OK
✅ GetMe: GET /api/v1/auth/me → 200 OK
✅ MongoDB: Connected without auth (development mode)
```

## 🔍 If You Still See Loading

### Step 1: Check Backend is Running
```powershell
# In terminal 1:
cd "C:\Users\moham\Downloads\Deal Flow\backend"
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Step 2: Check Frontend is Running
```powershell
# In terminal 2:
cd "C:\Users\moham\Downloads\Deal Flow\frontend"
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxxx ms

➜  Local:   http://localhost:5173/
```

### Step 3: Check CORS Configuration
The backend CORS is set to allow:
- `http://localhost:5173` (Vite frontend)
- `http://localhost:3000` (Alternative frontend port)

### Step 4: Test Login Directly
Open browser console (F12) and test:

```javascript
// Test registration
fetch('http://localhost:8000/api/v1/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123',
    full_name: 'Test User',
    company: 'Test Fund',
    role: 'investor'
  })
}).then(r => r.json()).then(d => console.log(d))

// Test login
fetch('http://localhost:8000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
}).then(r => r.json()).then(d => console.log(d))
```

## 📋 Updated Components

### 1. Backend Discovery Route (`app/api/routes/discovery.py`)
- **POST /api/v1/discovery/run** - Start discovery job
- **GET /api/v1/discovery/jobs/{job_id}** - Get job status
- **GET /api/v1/discovery/jobs/{job_id}/results** - Get discovery results
- **POST /api/v1/discovery/results/{result_id}/save** - Save a result
- **GET /api/v1/discovery/saved** - Get saved results

### 2. Frontend Discovery Component (`components/AIDiscoveryFeed.jsx`)
- Allows selecting data sources (YC, Crunchbase, AngelList)
- Shows real-time progress bar
- Displays discovered startups with scores
- Save/Pass functionality

### 3. Discovery Service (`services/discoveryService.js`)
- Handles all discovery API calls
- Automatic token management
- Error handling

### 4. Improved Auth API (`lib/api.js`)
- Added 10-second timeout to all auth requests
- Proper AbortController implementation
- Better error messages
- Retry logic with token refresh

## 🚀 Next Steps

1. **Try logging in again** - The timeout fixes should help
2. **Check browser console** for specific error messages
3. **Check backend logs** for any 400/500 errors
4. **If timeout persists**, it might be:
   - MongoDB not running → Start MongoDB service
   - Firewall blocking localhost:8000 → Add firewall exception
   - Network issues → Check network connectivity

## 📊 Discovery Feature Status

### Completed ✅
- Data fetching from APIs (with mock fallbacks)
- MongoDB storage (DiscoveryResult documents)
- Background job processing
- Real-time progress tracking
- Frontend UI with results display
- Save/Pass functionality

### Ready to Test
1. Start both backend and frontend
2. Log in to your account
3. Navigate to "AI Discovery" component
4. Select sources (YC recommended for testing)
5. Click "Start Discovery"
6. Watch as results appear in real-time!

## 🐛 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Request timed out" | Backend not responding | Check backend is running on port 8000 |
| "Network error" | CORS issue | Check CORS origins in config.py |
| "Invalid email or password" | User not found | Register first before logging in |
| "Loading indefinitely" | No timeout set | Refresh page - timeout is now added |
| MongoDB connection fails | MongoDB not running | Install & start MongoDB service |

## 📞 Debug Commands

```powershell
# Test backend health
curl http://localhost:8000/health

# Test auth registration
python test_auth.py

# Check MongoDB connection
mongosh localhost:27017

# Check frontend build
cd frontend
npm run build
```

---

**Version**: 2.0 (with Discovery & Fixed Auth)
**Last Updated**: December 2, 2025
