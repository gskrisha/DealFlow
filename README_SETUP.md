# 🚀 DealFlow - Complete Setup Guide

## ✨ What Has Been Set Up

Your DealFlow application is fully configured with:

### Backend Infrastructure ✅
- **FastAPI** server running on `http://localhost:8000`
- **MongoDB** database connected at `mongodb://localhost:27017`
- **JWT Authentication** for secure API access
- **5 Sample Startups** seeded in database
- **CORS** enabled for frontend integration

### Frontend Integration ✅
- **React + Vite** running on `http://localhost:3000`
- **Authentication Context** for state management
- **API Client** with automatic token handling
- **Custom Hooks** for data fetching
- **All Components** connected to backend

### Database with Authentication ✅
- **Admin User**: `dealflow_admin` / `dealflow_secure_password_2025`
- **App User**: `dealflow_user` / `dealflow_app_password_2025`
- **Credentials** stored in `.env` file
- **Fallback** support for development

---

## 🎯 Current Status

| Component | Status | Port | URL |
|-----------|--------|------|-----|
| MongoDB | ✅ Running | 27017 | `mongodb://localhost:27017` |
| Backend | ✅ Running | 8000 | `http://localhost:8000` |
| Frontend | ✅ Running | 3000 | `http://localhost:3000` |
| Sample Data | ✅ Loaded | - | 5 startups in DB |

---

## 🔐 Database Connection Details

### Configuration File
**Location**: `backend/.env`
```env
MONGODB_USER=dealflow_admin
MONGODB_PASSWORD=dealflow_secure_password_2025
MONGODB_HOST=localhost
MONGODB_PORT=27017
DATABASE_NAME=dealflow
```

### Connection String
```
mongodb://dealflow_admin:dealflow_secure_password_2025@localhost:27017/dealflow
```

### How It Works
1. Backend reads credentials from `.env`
2. Builds authenticated connection string
3. Connects with Motor (async MongoDB driver)
4. Falls back to unauthenticated if needed
5. Logs connection status on startup

---

## 🧪 Testing Everything

### Test 1: Check Backend Connection
```bash
# Should show "Successfully connected to MongoDB"
cd backend
python main.py 2>&1 | grep -i "successfully"
```

### Test 2: Test API Endpoints

**Public endpoint (no auth needed):**
```bash
curl http://localhost:8000/api/v1/startups
```

**Expected response:**
```json
[
  {
    "id": "...",
    "name": "TechVenture AI",
    "sector": "AI/ML",
    "stage": "Series A",
    ...
  },
  ...
]
```

**Protected endpoint (requires auth):**
```bash
# First login
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}' \
  | jq -r '.access_token')

# Then access protected endpoint
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/deals/pipeline
```

### Test 3: Test Frontend
1. Open `http://localhost:3000` in browser
2. Should see landing page with startup discovery
3. Can browse startups without logging in
4. Click login to access protected features

### Test 4: Check Database
```bash
# Connect to MongoDB with credentials
mongosh -u dealflow_admin -p dealflow_secure_password_2025 --eval "use dealflow; db.startup.find().limit(1).pretty()"
```

---

## 📁 Key Files & Their Purpose

### Configuration
| File | Purpose |
|------|---------|
| `.env` | Database credentials & API settings |
| `app/core/config.py` | Settings loader with auth support |
| `app/core/database.py` | MongoDB connection logic |

### Authentication
| File | Purpose |
|------|---------|
| `app/core/security.py` | JWT token creation/verification |
| `app/api/routes/auth.py` | Login/register endpoints |
| `app/api/deps.py` | Authentication dependencies |

### Models
| File | Purpose |
|------|---------|
| `app/models/user.py` | User schema with password hashing |
| `app/models/startup.py` | Startup data model |
| `app/models/deal.py` | Deal tracking model |

### Frontend
| File | Purpose |
|------|---------|
| `src/lib/AuthContext.jsx` | Token & auth state management |
| `src/lib/api.js` | API client with auto token handling |
| `src/lib/hooks.js` | Custom hooks for data fetching |

### Documentation
| File | Purpose |
|------|---------|
| `DATABASE_SETUP_COMPLETE.md` | Complete DB setup guide |
| `API_AUTHENTICATION.md` | API auth reference |
| `MONGODB_SETUP.md` | MongoDB detailed docs |

---

## 🚀 Quick Commands

### Backend
```bash
# Start backend
cd backend && python main.py

# Check connection
curl http://localhost:8000/api/v1/startups

# View logs (Windows PowerShell)
# The terminal where you ran main.py shows logs
```

### Frontend
```bash
# Start frontend (in new terminal)
cd frontend && npm run dev

# Build for production
npm run build
```

### Database
```bash
# Connect to MongoDB
mongosh -u dealflow_admin -p dealflow_secure_password_2025

# View startups
use dealflow
db.startup.find()

# View users
db.user.find()
```

### Docker (Alternative)
```bash
# Start MongoDB with Docker
docker-compose up -d mongodb

# Check status
docker ps | findstr dealflow_mongodb

# View logs
docker logs -f dealflow_mongodb
```

---

## 🔑 API Authentication Flow

### Step 1: Register
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "username",
    "password": "SecurePass123!",
    "full_name": "Full Name"
  }'
```

### Step 2: Get Tokens
**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

### Step 3: Use Token
```bash
curl -H "Authorization: Bearer {access_token}" \
  http://localhost:8000/api/v1/deals/pipeline
```

### Step 4: Refresh Token (30 min before expiry)
```bash
curl -X POST http://localhost:8000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "{refresh_token}"}'
```

---

## 🛠️ Troubleshooting

### Backend Won't Connect to MongoDB
```bash
# 1. Check MongoDB is running
mongosh  # Should connect

# 2. Verify credentials
mongosh -u dealflow_admin -p dealflow_secure_password_2025

# 3. Check port 27017
netstat -an | findstr 27017

# 4. View backend logs for error messages
# Look for "Successfully connected" or error details
```

### "401 Unauthorized" Errors
```bash
# Check token is in localStorage
# Open DevTools → Application → localStorage
# Look for: accessToken, refreshToken

# Verify token format
# Token should start with "eyJ"

# Try login again to get fresh token
```

### CORS Errors
```bash
# Verify frontend URL in CORS_ORIGINS (.env)
CORS_ORIGINS=["http://localhost:3000"]

# Restart backend after updating .env
```

### Database Connection String Error
```bash
# Verify credentials in .env match MongoDB user
mongosh -u dealflow_admin -p dealflow_secure_password_2025

# If failed, user may not exist, create with:
use admin
db.createUser({
  user: "dealflow_admin",
  pwd: "dealflow_secure_password_2025",
  roles: ["root"]
})
```

---

## 📊 Sample Data

### Seeded Startups (5 companies)
1. **TechVenture AI** - AI/ML, Series A
2. **GreenScale Energy** - ClimaTech, Seed
3. **HealthLink Digital** - HealthTech, Series B
4. **Quantum Materials Inc** - DeepTech, Seed
5. **FoodTech Solutions** - FoodTech, Series A

### Database Collections
- `startup` - Company information
- `user` - User accounts & credentials
- `deal` - Investment deals pipeline
- `pipeline` - Deal stage tracking
- `outreach` - Outreach activities

---

## 🔒 Security Features

| Feature | Status | Details |
|---------|--------|---------|
| Authentication | ✅ JWT | 30 min expiry, refresh tokens |
| Password Hashing | ✅ Bcrypt | Salted, 12+ char recommended |
| CORS Protection | ✅ Configured | Whitelisted origins only |
| Rate Limiting | ✅ 60/min | Per IP address |
| Optional Auth | ✅ Read | Public endpoints for browsing |
| Required Auth | ✅ Write | Protected for data modification |

---

## 📈 Next Steps

### Development
1. ✅ Backend API running
2. ✅ Frontend connected
3. ⏭️ Test all features with data
4. ⏭️ Build outreach generation with OpenAI
5. ⏭️ Add email notifications

### Testing
1. ⏭️ Register new user
2. ⏭️ Login and verify token
3. ⏭️ Create deals in pipeline
4. ⏭️ Test outreach features
5. ⏭️ Verify data persists

### Production Preparation
1. ⏭️ Use MongoDB Atlas (cloud)
2. ⏭️ Enable TLS/SSL
3. ⏭️ Set strong JWT secret
4. ⏭️ Configure monitoring
5. ⏭️ Set up backups

---

## 📚 Documentation Files

| File | Read For |
|------|----------|
| `DATABASE_SETUP_COMPLETE.md` | Detailed database setup (Docker, Windows, Atlas) |
| `API_AUTHENTICATION.md` | API auth guide with examples |
| `MONGODB_SETUP.md` | MongoDB reference & troubleshooting |
| `SETUP_SUMMARY.md` | Configuration summary |
| `README.md` | (This file) Quick start & overview |

---

## ✅ Verification Checklist

Run through this to verify everything is working:

- [ ] Backend running: `curl http://localhost:8000/api/v1/startups` returns data
- [ ] Frontend running: `http://localhost:3000` loads in browser
- [ ] MongoDB connected: Backend logs show "Successfully connected"
- [ ] Sample data exists: Curl returns 5 startups
- [ ] Auth working: Can create account on frontend
- [ ] Token stored: Check localStorage after login
- [ ] API accessible: Can fetch user data with token
- [ ] Database credentials: Can connect with mongosh directly

---

## 🆘 Getting Help

1. **Check Logs**: Look at backend terminal output
2. **Read Docs**: See documentation files for detailed guides
3. **Verify Credentials**: Check `.env` matches MongoDB user
4. **Test Connection**: Run `mongosh -u dealflow_admin -p dealflow_secure_password_2025`
5. **Check Ports**: Ensure 3000, 8000, 27017 are available

---

## 📞 Support Resources

- **FastAPI**: https://fastapi.tiangolo.com
- **MongoDB**: https://docs.mongodb.com
- **JWT**: https://jwt.io
- **React**: https://react.dev

---

## 🎉 You're All Set!

Your DealFlow platform is now ready for development:

✅ Database with authentication  
✅ Backend API with JWT security  
✅ Frontend connected to backend  
✅ Sample data loaded  
✅ All endpoints working  

Start by:
1. Opening `http://localhost:3000` in your browser
2. Creating a test account
3. Exploring the startup discovery features
4. Testing the deal pipeline

Happy developing! 🚀
