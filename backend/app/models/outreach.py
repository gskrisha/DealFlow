"""
DealFlow Backend - Outreach Model
Represents outreach messages and templates
"""
from datetime import datetime
from typing import List, Optional
from beanie import Document
from pydantic import BaseModel, Field


class OutreachTemplate(BaseModel):
    """Outreach message template"""
    id: str
    name: str
    subject: str
    body: str
    type: str = "email"  # email, linkedin, intro_request
    variables: List[str] = Field(default_factory=list)  # e.g., ["founder_name", "company_name"]
    is_ai_generated: bool = False


class Outreach(Document):
    """
    Outreach document model for MongoDB
    Represents an outreach attempt to a startup
    """
    # References
    user_id: str
    startup_id: str
    deal_id: Optional[str] = None
    
    # Message Details
    type: str = "email"  # email, linkedin, intro_request
    subject: Optional[str] = None
    body: str
    template_id: Optional[str] = None
    
    # Recipient
    recipient_name: str
    recipient_email: Optional[str] = None
    recipient_linkedin: Optional[str] = None
    
    # Status
    status: str = "draft"  # draft, scheduled, sent, opened, replied, bounced
    scheduled_for: Optional[datetime] = None
    sent_at: Optional[datetime] = None
    opened_at: Optional[datetime] = None
    replied_at: Optional[datetime] = None
    
    # AI
    is_ai_generated: bool = False
    ai_personalization_score: Optional[float] = None
    
    # Follow-ups
    follow_up_count: int = 0
    last_follow_up: Optional[datetime] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "outreach"
        indexes = [
            "user_id",
            "startup_id",
            "status",
            "type"
        ]


class OutreachCreate(BaseModel):
    """Schema for creating an outreach"""
    startup_id: str
    type: str = "email"
    subject: Optional[str] = None
    body: str
    recipient_name: str
    recipient_email: Optional[str] = None
    recipient_linkedin: Optional[str] = None
    scheduled_for: Optional[datetime] = None


class OutreachGenerate(BaseModel):
    """Schema for AI-generated outreach"""
    startup_id: str
    type: str = "email"  # email, linkedin, intro_request
    tone: str = "professional"  # professional, friendly, casual
    include_thesis_fit: bool = True
    custom_notes: Optional[str] = None


class OutreachUpdate(BaseModel):
    """Schema for updating an outreach"""
    subject: Optional[str] = None
    body: Optional[str] = None
    status: Optional[str] = None
    scheduled_for: Optional[datetime] = None


class OutreachResponse(BaseModel):
    """API Response schema for outreach"""
    id: str
    startup_id: str
    type: str
    subject: Optional[str] = None
    body: str
    recipient_name: str
    status: str
    is_ai_generated: bool
    sent_at: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True
