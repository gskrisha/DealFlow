"""
DealFlow Backend - Startup Model
Matches the frontend Startup interface
"""
from datetime import datetime
from typing import List, Optional
from beanie import Document
from pydantic import BaseModel, Field


class Founder(BaseModel):
    """Founder information"""
    name: str
    role: str
    linkedin: Optional[str] = None
    background: Optional[str] = None


class ScoreBreakdown(BaseModel):
    """AI Score breakdown"""
    team: float = Field(ge=0, le=100)
    traction: float = Field(ge=0, le=100)
    market: float = Field(ge=0, le=100)
    fit: float = Field(ge=0, le=100)


class Metrics(BaseModel):
    """Startup metrics"""
    revenue: Optional[str] = None
    growth: Optional[str] = None
    users: Optional[str] = None
    funding: Optional[str] = None


class Startup(Document):
    """
    Startup document model for MongoDB
    Represents a startup company in the deal flow platform
    """
    name: str = Field(..., description="Startup name")
    tagline: Optional[str] = Field(None, description="Short tagline")
    sector: str = Field(..., description="Industry sector")
    stage: str = Field(..., description="Funding stage (Seed, Series A, etc.)")
    location: Optional[str] = Field(None, description="Location/HQ")
    
    # AI Scoring
    score: float = Field(default=0, ge=0, le=100, description="Overall AI score")
    score_breakdown: Optional[ScoreBreakdown] = None
    unicorn_probability: Optional[float] = Field(None, ge=0, le=100)
    
    # Team
    founders: List[Founder] = Field(default_factory=list)
    
    # Metrics & Signals
    metrics: Optional[Metrics] = None
    signals: List[str] = Field(default_factory=list)
    
    # Data Sources
    sources: List[str] = Field(default_factory=list)
    source_urls: dict = Field(default_factory=dict)  # {source: url}
    
    # Description
    description: Optional[str] = None
    investor_fit: Optional[str] = None
    
    # Deal Status
    deal_status: str = Field(default="new")  # new, contacted, meeting, diligence, passed, invested
    mutual_connections: int = Field(default=0)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_updated: Optional[str] = None  # Human readable (e.g., "2 hours ago")
    
    # External IDs for deduplication
    crunchbase_id: Optional[str] = None
    yc_id: Optional[str] = None
    angellist_id: Optional[str] = None
    linkedin_url: Optional[str] = None
    website: Optional[str] = None
    
    # YC specific data
    yc_batch: Optional[str] = None  # e.g., "W24", "S23"
    yc_status: Optional[str] = None  # active, acquired, dead
    
    class Settings:
        name = "startups"
        indexes = [
            "name",
            "sector",
            "stage",
            "score",
            "deal_status",
            "crunchbase_id",
            "yc_id",
        ]


class StartupCreate(BaseModel):
    """Schema for creating a startup"""
    name: str
    tagline: Optional[str] = None
    sector: str
    stage: str
    location: Optional[str] = None
    description: Optional[str] = None
    website: Optional[str] = None
    founders: List[Founder] = Field(default_factory=list)
    metrics: Optional[Metrics] = None


class StartupUpdate(BaseModel):
    """Schema for updating a startup"""
    name: Optional[str] = None
    tagline: Optional[str] = None
    sector: Optional[str] = None
    stage: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    deal_status: Optional[str] = None
    founders: Optional[List[Founder]] = None
    metrics: Optional[Metrics] = None
    signals: Optional[List[str]] = None


class StartupResponse(BaseModel):
    """API Response schema for startup"""
    id: str
    name: str
    tagline: Optional[str] = None
    sector: str
    stage: str
    location: Optional[str] = None
    score: float
    score_breakdown: Optional[ScoreBreakdown] = None
    unicorn_probability: Optional[float] = None
    founders: List[Founder] = []
    metrics: Optional[Metrics] = None
    signals: List[str] = []
    sources: List[str] = []
    description: Optional[str] = None
    investor_fit: Optional[str] = None
    deal_status: str
    mutual_connections: int
    last_updated: Optional[str] = None
    website: Optional[str] = None
    yc_batch: Optional[str] = None
    
    class Config:
        from_attributes = True
