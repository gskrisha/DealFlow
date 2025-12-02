# DealFlow Backend

A FastAPI-based backend for the DealFlow Deal Flow Intelligence Platform.

## 🚀 Features

- **Startup Discovery**: Fetch startups from YC, Crunchbase, AngelList, and Proxycurl (LinkedIn)
- **AI Scoring Engine**: Score startups based on Team, Traction, Market, and Investor Fit
- **Deal Pipeline**: Track deals through customizable pipeline stages
- **Outreach Automation**: AI-powered personalized outreach message generation
- **JWT Authentication**: Secure user authentication with access and refresh tokens
- **Fund Thesis**: Personalized startup recommendations based on investment thesis

## 📁 Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
└── app/
    ├── api/
    │   ├── deps.py        # API dependencies (auth)
    │   └── routes/
    │       ├── auth.py    # Authentication endpoints
    │       ├── startups.py # Startup CRUD & search
    │       ├── discovery.py # Data ingestion
    │       ├── deals.py   # Deal pipeline management
    │       └── outreach.py # Outreach generation
    ├── core/
    │   ├── config.py      # Settings & configuration
    │   ├── database.py    # MongoDB connection
    │   └── security.py    # JWT & password hashing
    ├── models/
    │   ├── startup.py     # Startup document model
    │   ├── user.py        # User & auth models
    │   ├── deal.py        # Deal tracking model
    │   ├── pipeline.py    # Pipeline stages model
    │   └── outreach.py    # Outreach message model
    └── services/
        ├── ingestion.py   # YC, Crunchbase, AngelList fetchers
        ├── scoring.py     # AI scoring engine
        └── outreach.py    # Message generation service
```

## 🛠️ Setup

### Prerequisites

- Python 3.10+
- MongoDB (local or Atlas)
- API Keys (optional):
  - Crunchbase API Key
  - Proxycurl API Key
  - OpenAI API Key

### Installation

1. **Create virtual environment**
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your settings
```

4. **Start MongoDB**
```bash
# If using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use MongoDB Atlas (update MONGODB_URL in .env)
```

5. **Run the server**
```bash
uvicorn main:app --reload --port 8000
```

## 📚 API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔗 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get tokens
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/thesis` - Update fund thesis

### Startups
- `GET /api/v1/startups` - List startups (with filters)
- `GET /api/v1/startups/{id}` - Get startup details
- `POST /api/v1/startups` - Create startup
- `PUT /api/v1/startups/{id}` - Update startup
- `POST /api/v1/startups/{id}/score` - Re-calculate AI score

### Discovery
- `POST /api/v1/discovery/run` - Start discovery job
- `GET /api/v1/discovery/status/{job_id}` - Check job status
- `GET /api/v1/discovery/sources` - List available sources

### Deals
- `GET /api/v1/deals` - List deals
- `GET /api/v1/deals/pipeline` - Get pipeline view
- `POST /api/v1/deals` - Create deal from startup
- `PUT /api/v1/deals/{id}` - Update deal status
- `POST /api/v1/deals/{id}/notes` - Add note to deal

### Outreach
- `GET /api/v1/outreach` - List outreach messages
- `POST /api/v1/outreach` - Create outreach
- `POST /api/v1/outreach/generate` - AI-generate outreach
- `POST /api/v1/outreach/{id}/send` - Mark as sent

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URL` | MongoDB connection string | Yes |
| `DATABASE_NAME` | Database name | Yes |
| `JWT_SECRET_KEY` | Secret key for JWT | Yes |
| `CRUNCHBASE_API_KEY` | Crunchbase API key | No |
| `PROXYCURL_API_KEY` | Proxycurl API key | No |
| `OPENAI_API_KEY` | OpenAI API key | No |
| `CORS_ORIGINS` | Allowed CORS origins | Yes |

## 🔌 Data Sources

| Source | Status | API Key Required |
|--------|--------|------------------|
| Y Combinator | ✅ Active | No |
| Crunchbase | ✅ Active | Yes |
| AngelList | ✅ Active | No |
| Proxycurl (LinkedIn) | ✅ Active | Yes |

## 🧪 Testing

```bash
pytest tests/ -v
```

## 📦 Deployment

### Docker

```bash
docker build -t dealflow-backend .
docker run -p 8000:8000 --env-file .env dealflow-backend
```

### Production Recommendations

1. Use MongoDB Atlas for managed database
2. Set `DEBUG=False` in production
3. Use strong `JWT_SECRET_KEY`
4. Configure proper CORS origins
5. Use HTTPS (via reverse proxy like Nginx)
6. Set up monitoring (Sentry, Datadog, etc.)

## 📄 License

MIT License
