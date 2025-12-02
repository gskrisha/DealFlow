# 🚀 DealFlow Quick Start - READY TO USE

## ✅ Current Status

- **Backend**: ✅ Running on http://localhost:8000
- **Database**: ✅ Connected to MongoDB (localhost:27017)
- **Data**: ✅ 5 startups seeded
- **Frontend**: Ready to start

---

## 🎯 How to Continue Development

### Option 1: Start Frontend (Recommended)

```bash
cd frontend
npm run dev
```

Then visit: http://localhost:3000

### Option 2: Test API First

```bash
# List all startups
curl http://localhost:8000/api/v1/startups

# View API documentation
open http://localhost:8000/docs
```

### Option 3: Test Authentication

```bash
# Register new user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "TestPass123!",
    "full_name": "Test User"
  }'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

---

## 📊 API Endpoints Available

### Public (No Auth Required)
- `GET /api/v1/startups` - List all startups
- `GET /api/v1/startups/stats` - Startup statistics
- `GET /api/v1/discovery/sources` - Discovery sources
- `GET /api/v1/outreach/stats` - Demo outreach stats

### Authentication
- `POST /api/v1/auth/register` - Create new account
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token

### Protected (Auth Required)
- `GET /api/v1/deals/pipeline` - User's deals
- `POST /api/v1/deals` - Create deal
- `GET /api/v1/outreach` - User's outreach
- `POST /api/v1/outreach` - Create outreach

---

## 🔧 Configuration

### Backend Environment
- **Host**: localhost
- **Port**: 8000
- **Database**: dealflow
- **Reload**: Enabled (auto-reloads on code changes)

### Database
- **Type**: MongoDB
- **Connection**: mongodb://localhost:27017
- **Database**: dealflow
- **Auth**: Optional (currently unauthenticated)

### Frontend
- **Port**: 3000 (when started)
- **Framework**: React + Vite
- **API**: http://localhost:8000

---

## 🐛 Troubleshooting

### Backend not responding
```bash
# Check if running
curl http://localhost:8000/api/v1/startups

# Restart backend
# Press CTRL+C to stop
cd backend
python -m uvicorn main:app --reload --port 8000
```

### MongoDB connection error
```bash
# Check if MongoDB is running
mongosh

# If not running, start it (Docker)
docker-compose up -d mongodb

# Or check Windows service
net start MongoDB
```

### CORS error in frontend
- Make sure backend is running on http://localhost:8000
- Check CORS_ORIGINS in .env includes http://localhost:3000

---

## 📚 Documentation

- **DATABASE_SETUP_COMPLETE.md** - Database setup guide (3 methods)
- **API_AUTHENTICATION.md** - Authentication reference
- **SETUP_SUMMARY.md** - Configuration overview
- **README_SETUP.md** - Full setup instructions

---

## 🚀 What to Build Next

1. **Test Features**
   - [ ] User registration flow
   - [ ] Login authentication
   - [ ] Protected endpoint access
   - [ ] Token refresh mechanism

2. **Add Data**
   - [ ] More startups to database
   - [ ] Create test users
   - [ ] Add deals and pipeline items

3. **Frontend Features**
   - [ ] Dashboard styling
   - [ ] Deal management UI
   - [ ] Outreach interface
   - [ ] User settings

4. **Backend Features**
   - [ ] AI scoring (OpenAI)
   - [ ] Email notifications
   - [ ] Export functionality
   - [ ] Advanced search

---

## 💡 Development Tips

### View Real-time Logs
Backend logs print to console with timestamps and colors

### Change Port
Edit backend startup:
```bash
python -m uvicorn main:app --reload --port 8001
```

### Hot Reload
Backend auto-reloads on file changes (thanks to --reload flag)

### Database Queries
Access MongoDB directly:
```bash
mongosh
use dealflow
db.startup.find().pretty()
```

---

## 📞 Quick Commands Reference

```bash
# Backend
cd backend && python -m uvicorn main:app --reload --port 8000

# Frontend
cd frontend && npm run dev

# View Logs
# (Backend logs show in terminal)

# Test API
curl http://localhost:8000/api/v1/startups

# MongoDB
mongosh
```

---

## ✨ You're All Set!

Everything is configured and working. Start building! 🎉

Next: Run `cd frontend && npm run dev` to see the app in action.
