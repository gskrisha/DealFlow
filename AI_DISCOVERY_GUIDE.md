# AI Discovery Pipeline - Complete Implementation Guide

## Overview

The AI Discovery pipeline is a **complete end-to-end system** that:

1. **Fetches data** from multiple APIs (YC, Crunchbase, AngelList)
2. **Stores results** in MongoDB with full indexing
3. **Generates AI insights** for each discovered startup
4. **Calculates fit scores** based on your investment thesis
5. **Displays results** in an interactive dashboard

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
├─────────────────────────────────────────────────────────────┤
│  AIDiscoveryFeed.jsx                                         │
│  - Start discovery job                                      │
│  - Monitor progress                                         │
│  - Save/pass results                                        │
│  - View saved startups                                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Backend (FastAPI)                           │
├─────────────────────────────────────────────────────────────┤
│  Discovery Routes (/api/v1/discovery)                       │
│  ├─ POST /run           → Start background job              │
│  ├─ GET /jobs/{id}      → Check job status                  │
│  ├─ GET /jobs/{id}/results → Fetch results                  │
│  ├─ POST /results/{id}/save → Save startup                  │
│  └─ GET /saved          → View saved startups               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Ingestion & Scoring Services                    │
├─────────────────────────────────────────────────────────────┤
│  IngestionService                                            │
│  ├─ fetch_yc_startups()                                    │
│  ├─ fetch_crunchbase_startups()                            │
│  └─ fetch_angellist_startups()                             │
│                                                              │
│  ScoringService                                              │
│  ├─ generate_insights()     → AI-powered analysis           │
│  └─ calculate_fit_score()   → Thesis matching              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   MongoDB Database                           │
├─────────────────────────────────────────────────────────────┤
│  Collections:                                                │
│  ├─ discovery_job      → Job metadata & progress            │
│  └─ discovery_result   → Discovered startups with scores   │
└─────────────────────────────────────────────────────────────┘
```

## How It Works

### Step 1: Start Discovery Job

```javascript
// Frontend initiates discovery
POST /api/v1/discovery/run
{
  "sources": ["yc", "crunchbase", "angellist"],
  "limit_per_source": 20
}

Response:
{
  "job_id": "uuid-here",
  "status": "pending",
  "message": "Discovery job started..."
}
```

### Step 2: Background Processing

The backend:
1. **Fetches** from each API source
2. **Stores** results in MongoDB
3. **Generates AI insights** for each startup
4. **Calculates fit scores** against your thesis
5. **Updates job progress** every fetch

### Step 3: Frontend Polling

Frontend polls job status every 2 seconds:

```javascript
GET /api/v1/discovery/jobs/{job_id}

Response:
{
  "job_id": "uuid-here",
  "status": "running",
  "progress": 75,
  "startups_found": 150,
  "startups_added": 42,
  "current_source": "crunchbase",
  "errors": []
}
```

### Step 4: Display Results

Once complete, fetch and display results:

```javascript
GET /api/v1/discovery/jobs/{job_id}/results

Response:
[
  {
    "id": "result-id",
    "name": "StartupXYZ",
    "sector": "AI/ML",
    "stage": "Series A",
    "location": "San Francisco",
    "website": "https://startup.com",
    "discovery_score": 0.85,
    "fit_score": 0.92,
    "sources": [{"name": "yc", "relevance_score": 0.9}],
    "ai_insights": [...]
  }
]
```

## Key Components

### 1. Discovery Models (`app/models/discovery.py`)

```python
class DiscoveryJob(Document):
    """Tracks discovery job progress"""
    job_id: str
    status: str  # pending, running, completed, failed
    sources: List[str]
    startups_found: int
    startups_added: int
    progress: int  # 0-100

class DiscoveryResult(Document):
    """Individual discovered startup"""
    job_id: str
    name: str
    sector: str
    discovery_score: float
    fit_score: Optional[float]
    ai_insights: List[DiscoveryInsight]
    is_saved: bool
```

### 2. Ingestion Service (`app/services/ingestion.py`)

Fetches from multiple sources with fallback to mock data:

```python
# Y Combinator
startups = await service.fetch_yc_startups(limit=20)

# Crunchbase (requires API key)
startups = await service.fetch_crunchbase_startups(
    sectors=["AI/ML"],
    limit=20
)

# AngelList
startups = await service.fetch_angellist_startups(
    tags=["AI", "SaaS"],
    limit=20
)

# All sources
all_startups = await service.fetch_from_all_sources(limit_per_source=20)
```

### 3. Discovery Routes (`app/api/routes/discovery.py`)

**POST /api/v1/discovery/run** - Start job
- Sources: yc, crunchbase, angellist
- Returns job_id for tracking

**GET /api/v1/discovery/jobs/{job_id}** - Check status
- Progress: 0-100%
- Current source being fetched
- Number of startups found/added

**GET /api/v1/discovery/jobs/{job_id}/results** - Fetch results
- Pagination: skip, limit
- Returns discovered startups with scores

**POST /api/v1/discovery/results/{result_id}/save** - Save startup
- Marks result as saved for later

**GET /api/v1/discovery/saved** - View saved startups
- Only returns startups saved by current user

### 4. Frontend Component (`src/components/AIDiscoveryFeed.jsx`)

**Features:**
- Select data sources to fetch from
- Set limit per source
- Monitor job progress in real-time
- View discovered startups with scores
- Save or pass on each startup
- See AI insights for each discovery

## Data Flow Example

### Complete Workflow

```
1. User clicks "Start Discovery"
   ├─ Selects sources: [YC, Crunchbase]
   └─ Sets limit: 20 per source

2. Frontend sends POST /api/v1/discovery/run
   └─ Backend returns job_id: "abc-123"

3. Backend starts background job
   ├─ Fetches from YC API (20 startups)
   ├─ Stores in MongoDB discovery_result collection
   ├─ Generates AI insights for each
   ├─ Calculates fit scores
   ├─ Updates progress to 50%
   ├─ Fetches from Crunchbase (20 startups)
   ├─ Stores in MongoDB
   ├─ Generates insights & scores
   └─ Updates progress to 100%

4. Frontend polls GET /api/v1/discovery/jobs/abc-123
   ├─ Progress: 50% → Crunchbase fetching
   ├─ Progress: 100% → Complete!
   └─ Startups added: 40

5. Frontend fetches GET /api/v1/discovery/jobs/abc-123/results
   └─ Returns 40 startups with scores

6. User reviews results
   ├─ Clicks "Save" on interested startups
   ├─ Clicks "Pass" on not interested
   └─ Saved startups go to /api/v1/discovery/saved

7. Later, user can view saved startups
   └─ GET /api/v1/discovery/saved
```

## API Endpoints Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/discovery/run` | Start discovery job |
| GET | `/api/v1/discovery/jobs/{job_id}` | Check job status |
| GET | `/api/v1/discovery/jobs/{job_id}/results` | Fetch results (paginated) |
| POST | `/api/v1/discovery/results/{result_id}/save` | Save a result |
| POST | `/api/v1/discovery/results/{result_id}/pass` | Pass on a result |
| GET | `/api/v1/discovery/saved` | View all saved results |

## Database Schema

### discovery_job collection

```json
{
  "_id": ObjectId,
  "job_id": "string (unique)",
  "user_id": "optional",
  "status": "pending|running|completed|failed",
  "sources": ["yc", "crunchbase"],
  "startups_found": 0,
  "startups_added": 0,
  "progress": 75,
  "current_source": "crunchbase",
  "errors": [],
  "created_at": ISODate,
  "started_at": ISODate,
  "completed_at": ISODate
}
```

### discovery_result collection

```json
{
  "_id": ObjectId,
  "job_id": "string",
  "user_id": "optional",
  "name": "string",
  "sector": "string",
  "stage": "string",
  "location": "string",
  "website": "string",
  "description": "string",
  "sources": [
    {
      "name": "yc",
      "url": "string",
      "discovered_at": ISODate,
      "relevance_score": 0.85
    }
  ],
  "discovery_score": 0.85,
  "fit_score": 0.92,
  "ai_insights": [
    {
      "insight_type": "market_size",
      "content": "...",
      "confidence": 0.9,
      "generated_at": ISODate
    }
  ],
  "is_saved": false,
  "is_passed": false,
  "created_at": ISODate,
  "updated_at": ISODate
}
```

## Testing the System

### 1. Start the Backend
```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Start Discovery
```bash
curl -X POST http://localhost:8000/api/v1/discovery/run \
  -H "Content-Type: application/json" \
  -d '{"sources": ["yc"], "limit_per_source": 5}'
```

### 3. Check Status
```bash
curl http://localhost:8000/api/v1/discovery/jobs/{job_id}
```

### 4. Get Results
```bash
curl http://localhost:8000/api/v1/discovery/jobs/{job_id}/results
```

### 5. Save a Result
```bash
curl -X POST http://localhost:8000/api/v1/discovery/results/{result_id}/save
```

## Configuration

### Environment Variables (.env)

```
# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGO_DB_NAME=dealflow
MONGO_USERNAME=your_username
MONGO_PASSWORD=your_password

# API Keys (optional - uses mock data if not configured)
CRUNCHBASE_API_KEY=your_api_key
ANGELLIST_API_KEY=your_api_key
PROXYCURL_API_KEY=your_api_key

# JWT
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

## Performance Considerations

- **Job Tracking**: Currently in-memory (upgrade to Redis for production)
- **Concurrency**: Handles multiple discovery jobs simultaneously
- **Rate Limiting**: Implement API rate limits for data sources
- **Pagination**: Results paginated at 20 items per page
- **Caching**: Consider caching popular sources

## Future Enhancements

1. **Real-time WebSocket Updates** - Stream progress instead of polling
2. **Redis Job Queue** - Scale to multiple workers
3. **Advanced Filtering** - By valuation, team size, growth rate
4. **Deal Matching** - Automatic matching to pipeline stages
5. **Duplicate Detection** - Prevent duplicate discoveries
6. **Export Reports** - CSV/PDF export of results
7. **Scheduled Discovery** - Daily/weekly automated runs
8. **API Integration** - Connect to more data sources

## Troubleshooting

**Job seems stuck**
- Check backend logs for errors
- Job status should update every 2 seconds
- Max timeout is 30 seconds per API call

**Results not appearing**
- Verify sources are correct (yc, crunchbase, angellist)
- Check job status shows "completed"
- Try with smaller limit first

**MongoDB errors**
- Ensure MongoDB is running: `mongod`
- Check connection string in .env
- Verify collections are indexed

**API key issues**
- Crunchbase requires paid API key
- Other sources have free tiers
- System falls back to mock data if keys missing
