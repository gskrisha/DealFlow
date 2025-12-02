"""
DealFlow Backend - Deal Model
Represents a deal/investment opportunity in the pipeline
"""
from datetime import datetime
from typing import List, Optional
from beanie import Document, Link
from pydantic import BaseModel, Field


class Note(BaseModel):
    """Note attached to a deal"""
    content: str
    author_id: str
    author_name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Activity(BaseModel):
    """Activity log for a deal"""
    action: str  # status_change, note_added, meeting_scheduled, etc.
    description: str
    user_id: str
    user_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: dict = Field(default_factory=dict)


class Deal(Document):
    """
    Deal document model for MongoDB
    Represents a deal being tracked in the pipeline
    """
    # References
    startup_id: str = Field(..., description="Reference to Startup document")
    user_id: str = Field(..., description="User who owns this deal")
    
    # Basic Info (denormalized from startup for quick access)
    startup_name: str
    startup_sector: str
    startup_stage: str
    startup_score: float
    
    # Pipeline Status
    status: str = Field(default="new")  # new, contacted, meeting, diligence, passed, invested
    priority: str = Field(default="medium")  # low, medium, high, urgent
    
    # Assignment
    assigned_to: Optional[str] = None  # User ID of assigned team member
    assigned_name: Optional[str] = None
    
    # Investment Details
    proposed_amount: Optional[float] = None
    valuation: Optional[float] = None
    terms: Optional[str] = None
    
    # Tracking
    notes: List[Note] = Field(default_factory=list)
    activities: List[Activity] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    
    # Dates
    first_contact_date: Optional[datetime] = None
    next_meeting_date: Optional[datetime] = None
    decision_deadline: Optional[datetime] = None
    
    # Outcome
    outcome: Optional[str] = None  # invested, passed, founder_declined
    outcome_reason: Optional[str] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "deals"
        indexes = [
            "startup_id",
            "user_id",
            "status",
            "priority",
            "assigned_to"
        ]


class DealCreate(BaseModel):
    """Schema for creating a deal"""
    startup_id: str
    status: str = "new"
    priority: str = "medium"
    assigned_to: Optional[str] = None
    tags: List[str] = Field(default_factory=list)


class DealUpdate(BaseModel):
    """Schema for updating a deal"""
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_to: Optional[str] = None
    proposed_amount: Optional[float] = None
    valuation: Optional[float] = None
    terms: Optional[str] = None
    tags: Optional[List[str]] = None
    next_meeting_date: Optional[datetime] = None
    decision_deadline: Optional[datetime] = None
    outcome: Optional[str] = None
    outcome_reason: Optional[str] = None


class DealResponse(BaseModel):
    """API Response schema for deal"""
    id: str
    startup_id: str
    startup_name: str
    startup_sector: str
    startup_stage: str
    startup_score: float
    status: str
    priority: str
    assigned_to: Optional[str] = None
    assigned_name: Optional[str] = None
    notes_count: int = 0
    tags: List[str] = []
    next_meeting_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
