# Fund Thesis Storage Setup - Complete Guide

## ✅ What's Been Fixed

### 1. CORS Configuration
**Problem**: The backend wasn't allowing requests from `localhost:3001` and `localhost:3002`
**Solution**: Updated `.env` file to include all frontend ports

**`.env` Updated**:
```ini
# Before
CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]

# After
CORS_ORIGINS=["http://localhost:5173","http://localhost:3000","http://localhost:3001","http://localhost:3002"]
```

### 2. Thesis Storage Architecture
The thesis storage system is **already implemented** in the backend:

```
Flow: User Onboarding → FundThesisOnboarding Component → updateThesis() → Backend PUT /auth/thesis → MongoDB
```

## 📋 System Components

### Backend Components Already Set Up

1. **User Model** (`app/models/user.py`)
   - Has `thesis: Optional[FundThesis]` field
   - Has `onboarding_complete: bool` flag
   - Stores in MongoDB

2. **FundThesis Model** (`app/models/user.py`)
   ```python
   class FundThesis(BaseModel):
       fund_name: Optional[str]
       fund_size: Optional[str]
       check_size_min: Optional[float]
       check_size_max: Optional[float]
       stages: List[str]              # "Seed", "Series A", etc.
       sectors: List[str]             # "HealthTech", "FinTech", etc.
       geographies: List[str]         # "US", "Europe", etc.
       thesis_description: Optional[str]
       anti_portfolio: List[str]      # "Deal Breakers"
   ```

3. **Auth Endpoint** (`app/api/routes/auth.py`)
   - ✅ `PUT /auth/thesis` - Update/Save user thesis
   - ✅ `GET /auth/me` - Get current user (includes thesis)
   - ✅ `POST /auth/register` - Register user
   - ✅ `POST /auth/login` - Login user

### Frontend Components Already Set Up

1. **FundThesisOnboarding Component** (`frontend/src/components/FundThesisOnboarding.jsx`)
   - Collects thesis preferences from user
   - Calls `updateThesis()` on completion
   - Falls back to localStorage if backend fails

2. **Auth API** (`frontend/src/lib/api.js`)
   ```javascript
   updateThesis: async (thesisData) => {
     return apiRequest('/auth/thesis', {
       method: 'PUT',
       body: JSON.stringify({
         fund_name: thesisData.fundName,
         fund_size: thesisData.fundSize,
         stages: thesisData.investmentStage,
         sectors: thesisData.sectors,
         geographies: thesisData.geography,
         // ... other fields
       }),
     });
   }
   ```

## 🚀 How to Use

### Step 1: Restart Backend with New CORS Config
```powershell
cd C:\Users\moham\Downloads\Deal Flow\backend

# Stop any running instance (Ctrl+C)

# Start with new config
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Step 2: Access Application
```
Frontend: http://localhost:3001 (or 3002)
Backend:  http://localhost:8000
```

### Step 3: Test the Full Flow

#### A. Register New User
1. Go to http://localhost:3001
2. Click "Sign Up"
3. Enter email and password
4. Confirm registration

#### B. Complete Fund Thesis Onboarding
1. After registration, you'll see onboarding steps
2. Step 1: Select investment stages (Seed, Series A, Series B, etc.)
3. Step 2: Set check size and fund info
4. Step 3: Select geographies (US, Europe, Asia, etc.)
5. Step 4: Choose sector focus (HealthTech, FinTech, etc.)
6. Step 5: Select key metrics to track
7. Step 6: Mark deal breakers
8. Click "Complete Onboarding"

#### C. Verify Data Stored
1. Open browser DevTools (F12)
2. Go to Console
3. Run: `localStorage.getItem('fundThesis')`
4. Should see JSON with all your selections

#### D. Verify Backend Storage
1. Open MongoDB (mongosh or Compass)
2. Database: `dealflow`
3. Collection: `users`
4. Find your user document
5. Should see `thesis` field with all data

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   User Registration                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ FundThesisOnboarding         │
        │ (6 Steps - Questions)        │
        │ - Investment Stages          │
        │ - Check Size                 │
        │ - Geographies                │
        │ - Sectors                    │
        │ - Key Metrics                │
        │ - Deal Breakers              │
        └────────────┬─────────────────┘
                     │
                     ▼
      ┌──────────────────────────────────┐
      │  AuthContext.updateThesis()      │
      │  - Transforms frontend data      │
      │  - Calls API endpoint            │
      └────────────┬─────────────────────┘
                   │
                   ▼
        ┌────────────────────────────────┐
        │  API: PUT /api/v1/auth/thesis  │
        │  (with JWT auth token)         │
        │  Content-Type: application/json│
        └────────────┬────────────────────┘
                     │
                     ▼
        ┌────────────────────────────────┐
        │  Backend Auth Route            │
        │  - Validates user              │
        │  - Creates FundThesis object   │
        │  - Saves to User document      │
        │  - Flags onboarding_complete   │
        └────────────┬────────────────────┘
                     │
                     ▼
          ┌────────────────────────┐
          │   MongoDB User Doc     │
          │ {                      │
          │   email: "...",        │
          │   thesis: {            │
          │     stages: [...],     │
          │     sectors: [...],    │
          │     geographies: [...],│
          │     ...                │
          │   },                   │
          │   onboarding: true     │
          │ }                      │
          └────────────────────────┘
```

## 🔍 Verification Checklist

- ✅ Backend `.env` has correct CORS_ORIGINS
- ✅ Backend restarted after `.env` change
- ✅ User can register successfully
- ✅ Onboarding modal appears after registration
- ✅ User can complete all 6 onboarding steps
- ✅ No CORS errors in browser console
- ✅ Frontend receives success response from backend
- ✅ `fundThesis` stored in localStorage
- ✅ User document in MongoDB has `thesis` field
- ✅ `onboarding_complete` flag set to `true` in MongoDB

## 🐛 Troubleshooting

### Error: "Access to fetch...blocked by CORS policy"
**Solution**: 
1. Check `.env` file has correct CORS_ORIGINS
2. Restart backend: `python -m uvicorn main:app --reload`
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try again

### Error: "Failed to fetch"
**Solution**:
1. Verify backend is running: Check terminal output or visit `http://localhost:8000/health`
2. Verify correct port: Should be 8000 for backend
3. Check network tab in DevTools for actual error

### Thesis Not Saving to DB
**Solution**:
1. Check MongoDB connection: Backend logs should show "Successfully connected to MongoDB"
2. Verify auth token is being sent: Check Network tab in DevTools, look for `Authorization: Bearer ...` header
3. Check backend logs for errors during PUT request

### Thesis Data Lost on Page Refresh
**Solution**:
1. This is normal - data should be in MongoDB
2. Check MongoDB directly: `db.users.findOne({email: "your-email@example.com"})`
3. If thesis field is empty, check backend logs for error during save

## 📝 Next Steps

1. **Test Full Flow**: Follow Step 3 above
2. **Verify DB Storage**: Check MongoDB after completing onboarding
3. **Test Discovery**: Once thesis is saved, try running AI Discovery
4. **Monitor Backend**: Watch logs for any errors during thesis save

## 🎯 Expected Behavior

### After User Completes Onboarding:

**Frontend**:
- ✅ localStorage shows: `fundThesis: {...}`
- ✅ localStorage shows: `onboardingComplete: true`
- ✅ No CORS errors in console
- ✅ Redirect to main dashboard

**Backend Logs**:
- ✅ `PUT /api/v1/auth/thesis` logged
- ✅ User found and updated
- ✅ Thesis saved successfully
- ✅ `onboarding_complete` flag set to true

**MongoDB**:
- ✅ User document has `thesis` field populated
- ✅ All fields match what user selected
- ✅ `onboarding_complete: true`
- ✅ `updated_at` timestamp recent

---

**Status**: ✅ READY TO TEST
**Backend**: Configured for thesis storage
**Database**: Ready to receive and store data
**Frontend**: All components in place

Go ahead and restart the backend, then test the full flow!
