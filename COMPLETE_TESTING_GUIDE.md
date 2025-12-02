# 🧪 DealFlow - Complete Testing Guide

## Overview
This guide walks you through testing the entire flow:
1. ✅ Backend Health
2. ✅ User Signup
3. ✅ Fund Thesis Onboarding
4. ✅ Data Storage in MongoDB
5. ✅ AI Discovery Integration

---

## 📋 Pre-Test Checklist

Before starting, verify:
- ✅ Backend running: `http://localhost:8000/health` returns `{"status": "healthy", "database": "connected"}`
- ✅ Frontend running: `http://localhost:3001` or `http://localhost:3002` loads without errors
- ✅ MongoDB running: `mongosh` connects to `mongodb://localhost:27017`
- ✅ No CORS errors in browser console

---

## 🧪 Test 1: Backend Health Check

### Via Browser
1. Open `http://localhost:8000/health`
2. Should see JSON response:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

### Via Command Line
```powershell
curl -s http://localhost:8000/health | ConvertFrom-Json | ConvertTo-Json
```

### Expected Result
✅ Backend is responsive and database is connected

---

## 🧪 Test 2: User Registration (Signup)

### Manual Steps

1. **Open Frontend**
   - Navigate to `http://localhost:3001` (or 3002)
   - Click "Sign Up" or "Create Account"

2. **Fill Registration Form**
   - Email: `testuser@dealflow.test` (or any unique email)
   - Password: `TestPassword123!`
   - Full Name: `Test User`
   - Company: `Test Company`
   - Role: `Partner`

3. **Submit Form**
   - Click "Sign Up" button
   - Watch for success message

4. **Check Browser Console** (F12 → Console)
   - Should see no CORS errors
   - Should see success response

### Expected Result
✅ User created successfully
✅ Redirected to onboarding or login page
✅ No errors in console

### Troubleshooting
If you see CORS error:
- Backend `.env` CORS_ORIGINS list may be outdated
- Restart backend: `python -m uvicorn main:app --reload`

---

## 🧪 Test 3: User Login

### Manual Steps

1. **Go to Login Page** (if not already there)
   - Click "Login" if you completed signup
   - Or navigate back and click "Already have account?"

2. **Fill Login Form**
   - Email: (same email from signup)
   - Password: (same password from signup)

3. **Submit Form**
   - Click "Login" button
   - Watch for redirect to dashboard

### Expected Result
✅ Login successful
✅ Redirected to Dashboard or Onboarding
✅ No authentication errors

---

## 🧪 Test 4: Fund Thesis Onboarding

### Manual Steps

After logging in, you should see **Fund Thesis Onboarding** with 6 steps:

#### Step 1: Investment Stages
- Select: `Seed`, `Series A`, `Series B`
- Click "Next"

#### Step 2: Check Size & Fund
- Fund Size: `$50M`
- Check Size: `$500k-$5M` (or similar range)
- Portfolio Size: `30`
- Click "Next"

#### Step 3: Geography
- Select: `United States`, `Europe`, `Asia`
- Click "Next"

#### Step 4: Sector Focus
- Select: `HealthTech`, `FinTech`, `EdTech`
- Click "Next"

#### Step 5: Key Metrics
- Select: `Revenue Growth`, `User Retention`, `Market Size`
- Click "Next"

#### Step 6: Deal Breakers
- Select: `Real Estate`, `Oil & Gas`, `Tobacco`
- Click "Complete Onboarding"

### Expected Result
✅ All 6 steps complete
✅ No errors during progression
✅ Final page shows "Onboarding Complete" or redirects to dashboard

### Verification in Browser

After completion, open DevTools (F12) and check localStorage:

```javascript
// In Console:
JSON.parse(localStorage.getItem('fundThesis'))
```

Should output something like:
```javascript
{
  "investmentStage": ["Seed", "Series A", "Series B"],
  "checkSize": "$500k-$5M",
  "geography": ["United States", "Europe", "Asia"],
  "sectors": ["HealthTech", "FinTech", "EdTech"],
  "keyMetrics": ["Revenue Growth", "User Retention", "Market Size"],
  "dealBreakers": ["Real Estate", "Oil & Gas", "Tobacco"],
  "fundSize": "$50M",
  "portfolioSize": "30"
}
```

---

## 🧪 Test 5: Backend Response Verification

### Check Network Requests

1. Open DevTools (F12) → Network tab
2. Go through onboarding steps
3. Look for request to `PUT /api/v1/auth/thesis`

#### Expected Request
```
Method: PUT
URL: http://localhost:8000/api/v1/auth/thesis
Headers:
  Authorization: Bearer eyJ...
  Content-Type: application/json
Body:
{
  "fund_name": "$50M",
  "check_size_min": 500000,
  "check_size_max": 5000000,
  "stages": ["Seed", "Series A", "Series B"],
  "sectors": ["HealthTech", "FinTech", "EdTech"],
  "geographies": ["United States", "Europe", "Asia"],
  ...
}
```

#### Expected Response (200 OK)
```json
{
  "id": "user-id-here",
  "email": "testuser@dealflow.test",
  "full_name": "Test User",
  "thesis": {
    "fund_name": "$50M",
    "stages": ["Seed", "Series A", "Series B"],
    "sectors": ["HealthTech", "FinTech", "EdTech"],
    ...
  },
  "onboarding_complete": true,
  ...
}
```

---

## 🧪 Test 6: Verify Data in MongoDB

### Using MongoDB Shell (mongosh)

```bash
# Connect to MongoDB
mongosh

# Show databases
show dbs

# Use dealflow database
use dealflow

# Find users with thesis
db.users.find({ thesis: { $ne: null } })

# Find specific user by email
db.users.findOne({ email: "testuser@dealflow.test" })
```

### Expected Output
```javascript
{
  _id: ObjectId("..."),
  email: "testuser@dealflow.test",
  hashed_password: "...",
  full_name: "Test User",
  company: "Test Company",
  role: "Partner",
  thesis: {
    fund_name: "$50M",
    fund_size: "$50M",
    check_size_min: 500000,
    check_size_max: 5000000,
    stages: ["Seed", "Series A", "Series B"],
    sectors: ["HealthTech", "FinTech", "EdTech"],
    geographies: ["United States", "Europe", "Asia"],
    thesis_description: null,
    anti_portfolio: ["Real Estate", "Oil & Gas", "Tobacco"]
  },
  onboarding_complete: true,
  is_active: true,
  created_at: ISODate("2025-12-02..."),
  updated_at: ISODate("2025-12-02..."),
  ...
}
```

### Verification Checklist
- ✅ User document exists in `dealflow.users` collection
- ✅ `thesis` field is populated (not null)
- ✅ All thesis fields match what you selected
- ✅ `onboarding_complete: true`
- ✅ `created_at` is recent timestamp

---

## 🧪 Test 7: AI Discovery with Saved Thesis

### Manual Steps

1. **Navigate to Overview Dashboard**
   - After onboarding, you should see the main dashboard
   - Look for "Run AI Discovery" button (top right area)

2. **Click "Run AI Discovery"**
   - Modal opens showing data source selection
   - Sources should be: Y Combinator, Crunchbase, AngelList

3. **Select Data Sources**
   - Check "Y Combinator" (or your preferred source)
   - Click "Start Discovery"

4. **Watch Progress**
   - Progress bar should appear: 0% → 100%
   - Status message: "Discovering...", "Processing...", etc.

5. **View Results**
   - After discovery completes, see:
     - Top 5 startups on Overview page
     - Full list on Discovery page
     - Each startup shows: Name, Stage, Sector, Score, Location

### Verification

#### In Browser Console
```javascript
// Get saved thesis from context
// This is automatic in app, but you can verify in Network tab
```

#### In Backend Logs
```
Look for logs like:
INFO: Starting discovery job
INFO: Using thesis criteria: stages=["Seed", "Series A"], sectors=["HealthTech", "FinTech"]
INFO: Filtering results by user thesis
INFO: Discovery completed
```

#### Expected Results
✅ Discovery uses saved thesis (sectors, stages, geographies)
✅ Results are filtered based on thesis criteria
✅ Startups shown match investment stage preferences
✅ No errors in console or backend logs

---

## 🔍 Troubleshooting

### Problem: "Access to fetch blocked by CORS policy"
**Solution:**
1. Check `.env` file has all frontend ports
2. Restart backend: `python -m uvicorn main:app --reload`
3. Clear browser cache: Ctrl+Shift+Delete
4. Retry

### Problem: Onboarding fails silently
**Solution:**
1. Check Network tab for failed requests
2. Check browser console for errors
3. Verify backend is running
4. Check backend logs for errors

### Problem: Thesis not saving to database
**Solution:**
1. Verify MongoDB is running: `mongosh`
2. Check backend logs for database errors
3. Verify user is authenticated (token in request)
4. Manually check DB: `db.users.find()`

### Problem: Discovery doesn't use thesis
**Solution:**
1. Verify thesis is saved: Check MongoDB
2. Verify discovery endpoint receives thesis
3. Check backend logs for filtering logic
4. Test manually with API client (Postman)

---

## 📊 Test Results Template

Use this to document your test results:

```markdown
## Test Results - [Date]

### Backend Health
- Status: ✅ PASS / ❌ FAIL
- Response: healthy / error
- Notes: 

### User Signup
- Status: ✅ PASS / ❌ FAIL
- Email: 
- Password: 
- Errors: 

### Fund Thesis Onboarding
- Status: ✅ PASS / ❌ FAIL
- Steps completed: 1/2/3/4/5/6
- Errors: 
- localStorage saved: YES / NO

### Backend Thesis Save
- Status: ✅ PASS / ❌ FAIL
- Request sent: YES / NO
- Response status: 200/400/error
- Errors: 

### MongoDB Verification
- Status: ✅ PASS / ❌ FAIL
- User found: YES / NO
- Thesis saved: YES / NO
- All fields populated: YES / NO

### AI Discovery
- Status: ✅ PASS / ❌ FAIL
- Discovery started: YES / NO
- Progress tracked: YES / NO
- Results shown: YES / NO
- Results filtered by thesis: YES / NO

### Overall Status
- Total Tests: 7
- Passed: X
- Failed: Y
- Critical Issues: NONE / [list]
```

---

## ✅ Success Criteria

All tests PASS when:

1. ✅ Backend responds to health check
2. ✅ User can signup with email/password
3. ✅ User can complete 6-step onboarding
4. ✅ Data appears in localStorage
5. ✅ Backend receives and saves thesis to MongoDB
6. ✅ User document has thesis field populated
7. ✅ AI Discovery can be triggered
8. ✅ Discovery results are filtered by saved thesis
9. ✅ No CORS errors in console
10. ✅ No database errors in backend logs

---

## 🎯 Next Steps After Testing

If all tests PASS:
1. ✅ Deploy to staging environment
2. ✅ Run load testing
3. ✅ User acceptance testing (UAT)
4. ✅ Deploy to production

If any test FAILS:
1. 🔍 Check troubleshooting section
2. 📋 Document the error
3. 🐛 Fix the issue
4. 🔄 Re-run test

---

**Status**: Ready for Testing  
**Last Updated**: December 2, 2025  
**Created By**: GitHub Copilot

