"""
DealFlow Backend - API Routes Initialization
"""
from fastapi import APIRouter
from app.api.routes import auth, startups, discovery, deals, outreach

api_router = APIRouter()

# Include all route modules
api_router.include_router(auth.router)
api_router.include_router(startups.router)
api_router.include_router(discovery.router)
api_router.include_router(deals.router)
api_router.include_router(outreach.router)
