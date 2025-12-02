# 🎯 DealFlow - Quick Reference Card

**Print this for quick reference while testing!**

---

## 🚀 STARTUP CHECKLIST

Before testing, verify:

```
Backend running?          curl http://localhost:8000/health
Frontend running?         Open http://localhost:3001
MongoDB running?          mongosh connects
No CORS errors?           F12 → Console is clean
```

---

## 👤 TEST USER

```
Email:     testuser@dealflow.test
Password:  TestPassword123!
Token:     (From login response - save this)
```

---

## 🔑 Quick API Calls

### 1️⃣ Register
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Pass123!",
    "full_name":"Test User",
    "company":"Test Co",
    "role":"Partner"
  }'
```

### 2️⃣ Login (Save token!)
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Pass123!"
  }'
```

### 3️⃣ Save Thesis (Replace TOKEN)
```bash
curl -X PUT http://localhost:8000/api/v1/auth/thesis \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fund_name":"Test Fund",
    "stages":["Seed","Series A"],
    "sectors":["HealthTech"],
    "geographies":["United States"]
  }'
```

### 4️⃣ Verify Saved
```bash
curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer TOKEN"
```

---

## 🗄️ MongoDB Queries

### Find user with thesis
```javascript
db.users.findOne({email: "test@example.com"})
```

### Count users
```javascript
db.users.find({thesis: {$ne: null}}).count()
```

### View all thesis data
```javascript
db.users.findOne({email: "test@example.com"}).thesis
```

### Drop all test data (⚠️ be careful!)
```javascript
db.users.deleteMany({email: /test/})
```

---

## 📊 Expected Responses

### Signup (201 Created)
```json
{
  "id": "507f...",
  "email": "test@example.com",
  "full_name": "Test User",
  "onboarding_complete": false
}
```

### Login (200 OK)
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer"
}
```

### Save Thesis (200 OK)
```json
{
  "id": "507f...",
  "thesis": {
    "fund_name": "...",
    "stages": [...],
    "sectors": [...]
  },
  "onboarding_complete": true
}
```

---

## 🧪 7-Step Manual Test

| # | Step | Check | Status |
|---|------|-------|--------|
| 1 | Backend health | 200 OK + "healthy" | ☐ |
| 2 | Signup | Get user ID | ☐ |
| 3 | Login | Get access_token | ☐ |
| 4 | Get user | thesis is null | ☐ |
| 5 | Save thesis | onboarding_complete=true | ☐ |
| 6 | Get user again | thesis populated | ☐ |
| 7 | Check MongoDB | thesis field exists | ☐ |

---

## ⚠️ Common Errors

| Error | Fix |
|-------|-----|
| CORS policy blocked | Restart backend |
| 401 Unauthorized | Check token in header |
| 400 Bad Request | Check email format |
| No thesis field | Complete save test first |
| Can't connect to MongoDB | Check mongosh |

---

## 🔍 Debug Commands

```bash
# Check services
netstat -tuln | grep LISTEN

# View backend logs
# (terminal where uvicorn runs)

# Clear test data
mongosh
use dealflow
db.users.deleteMany({email: /test@/})

# View frontend console
F12 in browser → Console tab
```

---

## 📋 Documentation Files

```
COMPLETE_TESTING_GUIDE.md     ← Start here (manual steps)
API_TESTING_REFERENCE.md      ← API details
THESIS_STORAGE_SETUP.md       ← Architecture
test_full_flow.py             ← Run this script
verify_mongodb.py             ← MongoDB check script
```

---

## ✅ Success = All Green

```
✅ Signup works
✅ Login returns token
✅ Thesis saves (200 OK)
✅ GET /me shows thesis
✅ MongoDB has thesis
✅ No CORS errors
✅ No 401/403 errors
```

---

## 🚀 Next

1. Run COMPLETE_TESTING_GUIDE.md
2. Check results against expected
3. Verify in MongoDB
4. Test AI Discovery
5. Document findings

---

**Status**: Ready  
**Time**: 15 minutes  
**Difficulty**: Easy  

Go! 🎯

