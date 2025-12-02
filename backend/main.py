"""
DealFlow Backend - Main Application Entry Point
FastAPI application with MongoDB, JWT auth, and AI scoring
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from loguru import logger

from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.api.routes import api_router


# Rate limiter
limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    logger.info("Starting DealFlow Backend...")
    await connect_to_mongo()
    logger.info("DealFlow Backend started successfully!")
    
    yield
    
    # Shutdown
    logger.info("Shutting down DealFlow Backend...")
    await close_mongo_connection()
    logger.info("DealFlow Backend shutdown complete.")


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    description="""
    DealFlow - Deal Flow Intelligence Platform API
    
    A comprehensive backend for VC deal flow management:
    - 🔍 Startup Discovery from YC, Crunchbase, AngelList
    - 🤖 AI-powered Scoring Engine
    - 📊 Deal Pipeline Management
    - ✉️ Automated Outreach Generation
    - 🔐 JWT Authentication
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Add rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/")
async def root():
    """Root endpoint - API health check"""
    return {
        "name": settings.APP_NAME,
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "database": "connected"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
