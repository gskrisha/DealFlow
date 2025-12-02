"""
DealFlow - Discovery Model
Tracks discovery jobs and results
"""
from datetime import datetime
from typing import List, Optional, Dict, Any
from beanie import Document
from pydantic import BaseModel, Field


class DiscoverySource(BaseModel):
    """Source where startup was discovered"""
    name: str  # yc, crunchbase, angellist, etc
    url: Optional[str] = None
    discovered_at: datetime = Field(default_factory=datetime.utcnow)
    relevance_score: Optional[float] = None


class DiscoveryInsight(BaseModel):
    """AI-generated insight about the startup"""
    insight_type: str  # market_size, growth_potential, competition, team_quality
    content: str
    confidence: float = Field(ge=0, le=1)
    generated_at: datetime = Field(default_factory=datetime.utcnow)


class DiscoveryJob(Document):
    """
    Discovery job tracking
    Stores results of AI discovery runs
    """
    user_id: Optional[str] = None
    job_id: str = Field(unique=True)
    status: str = "pending"  # pending, running, completed, failed
    
    # Job configuration
    sources: List[str]
    sectors: Optional[List[str]] = None
    stages: Optional[List[str]] = None
    limit: int = 50
    
    # Results
    startups_found: int = 0
    startups_added: int = 0
    startups_skipped: int = 0
    
    # Progress tracking
    progress: int = 0  # 0-100
    current_source: Optional[str] = None
    
    # Errors
    errors: List[str] = Field(default_factory=list)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    # Metadata
    execution_time: Optional[float] = None  # seconds
    
    class Settings:
        collection = "discovery_job"


class DiscoveryResult(Document):
    """
    Individual startup discovered during AI discovery
    """
    job_id: str
    user_id: Optional[str] = None
    startup_id: Optional[str] = None  # Link to Startup if created
    
    # Discovery info
    sources: List[DiscoverySource]
    discovery_score: float = Field(ge=0, le=100, default=0)
    
    # Startup data
    name: str
    sector: str
    stage: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    tagline: Optional[str] = None
    
    # AI insights
    ai_insights: List[DiscoveryInsight] = Field(default_factory=list)
    fit_score: Optional[float] = None  # How well it matches user thesis
    
    # Actions
    is_saved: bool = False
    is_passed: bool = False
    is_contacted: bool = False
    
    # Tracking
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        collection = "discovery_result"
