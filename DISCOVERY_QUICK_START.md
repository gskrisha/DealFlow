# Quick Start Guide - Running AI Discovery

## Prerequisites

- Backend running on http://localhost:8000
- MongoDB running on localhost:27017
- Frontend ready on http://localhost:3000

## Step 1: Ensure Backend is Running

```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Check it's running:
```
http://localhost:8000/docs
```

## Step 2: Start Frontend

```bash
cd frontend
npm run dev
```

Should open on http://localhost:3000

## Step 3: Navigate to Discovery

1. Go to http://localhost:3000
2. Login with your account
3. Find "AI Discovery" or "Discovery" section in the navigation
4. Click on it

## Step 4: Run Discovery

### Basic Discovery (Recommended for first test)

1. **Select YC only** (fastest):
   - ✓ Y Combinator
   - Limit: 5

2. Click **"Start Discovery"**

3. **Watch Progress**:
   - You'll see real-time status
   - Progress bar updates
   - Current source shown

### Full Discovery

1. **Select all sources**:
   - ✓ Y Combinator
   - ✓ Crunchbase
   - ✓ AngelList

2. Set **Limit: 20** per source

3. Click **"Start Discovery"**

4. Wait for completion (~30-60 seconds)

## Step 5: Review Results

Once complete, you'll see:

- **Startups List** - All discovered companies
- **Scores**:
  - Discovery Score: How well it matches the source
  - Fit Score: How well it matches your thesis (if set)
- **Details**:
  - Sector, Stage, Location
  - Website, Description
  - Sources from which it was found

## Step 6: Take Action

### Save Interesting Startups
- Click **"Save"** button
- Startup moves to your saved list
- Later access via "Discovery Saved" section

### Pass on Startups
- Click **"Pass"** button
- Removes from current view
- Won't show again in this job

## Step 7: View Saved Startups

1. Go to "Discovery" → "Saved"
2. See all your saved discoveries
3. Manage your leads

---

## What's Happening Behind the Scenes

When you click "Start Discovery":

1. **Frontend** sends request to backend
2. **Backend** gets a job ID back
3. **Frontend** polls every 2 seconds for status
4. **Backend** fetches from APIs:
   - Connects to Y Combinator API
   - Connects to Crunchbase (if key configured)
   - Connects to AngelList (if key configured)
5. **For each startup**, backend:
   - Stores in MongoDB
   - Generates AI insights
   - Calculates fit score
6. **Frontend** updates UI with results
7. **You** can save/pass on each

---

## Troubleshooting

### Discovery won't start
- Check backend is running (`http://localhost:8000/docs`)
- Check you're logged in
- Try refreshing the page

### Results not loading
- Wait a bit longer (takes 10-30 seconds)
- Check browser console for errors
- Check backend logs

### MongoDB errors in logs
- MongoDB authentication is fallback mode (normal)
- Should still work
- Check `mongod` is running

### Want just mock data (no API calls)
- This will use mock data automatically if APIs fail
- Perfect for testing UI

---

## API Endpoints You Can Test Directly

### Start Discovery
```bash
curl -X POST http://localhost:8000/api/v1/discovery/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"sources": ["yc"], "limit_per_source": 5}'
```

### Check Status
```bash
curl http://localhost:8000/api/v1/discovery/jobs/{job_id} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Results
```bash
curl http://localhost:8000/api/v1/discovery/jobs/{job_id}/results \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## File Structure

New files created:

```
backend/
  app/
    models/
      discovery.py              ← Discovery data models
    services/
      ingestion.py              ← API fetching service
    api/
      routes/
        discovery.py            ← Discovery endpoints (updated)

frontend/
  src/
    components/
      AIDiscoveryFeed.jsx       ← Discovery UI component (new)
      AIDiscoveryFeed.css       ← Discovery styles (new)
    services/
      discoveryService.js       ← API client (new)

Documentation:
  AI_DISCOVERY_GUIDE.md         ← Full technical guide
  DISCOVERY_QUICK_START.md      ← This file
```

---

## Next Steps

1. ✅ Run discovery from UI
2. ✅ Review results
3. ✅ Save interesting startups
4. Consider integrating with:
   - Deal pipeline (auto-create deals)
   - Outreach templates (auto-generate emails)
   - Scoring engine (auto-rank startups)

---

## Questions?

Check the detailed guide: `AI_DISCOVERY_GUIDE.md`

For debugging: Check backend logs for detailed error messages.
