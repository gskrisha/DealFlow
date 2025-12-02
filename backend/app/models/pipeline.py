"""
DealFlow Backend - Pipeline Model
Represents customizable deal pipeline stages
"""
from datetime import datetime
from typing import List, Optional
from beanie import Document
from pydantic import BaseModel, Field


class PipelineStage(BaseModel):
    """Individual stage in the pipeline"""
    id: str
    name: str
    order: int
    color: str = "#6366f1"  # Default indigo
    description: Optional[str] = None
    is_terminal: bool = False  # True for "Invested" or "Passed"


class Pipeline(Document):
    """
    Pipeline document model for MongoDB
    Represents a customizable deal pipeline for a user/team
    """
    user_id: str = Field(..., description="User who owns this pipeline")
    name: str = Field(default="Default Pipeline")
    description: Optional[str] = None
    
    # Stages
    stages: List[PipelineStage] = Field(default_factory=lambda: [
        PipelineStage(id="new", name="New", order=0, color="#6366f1"),
        PipelineStage(id="contacted", name="Contacted", order=1, color="#8b5cf6"),
        PipelineStage(id="meeting", name="Meeting", order=2, color="#a855f7"),
        PipelineStage(id="diligence", name="Due Diligence", order=3, color="#d946ef"),
        PipelineStage(id="passed", name="Passed", order=4, color="#ef4444", is_terminal=True),
        PipelineStage(id="invested", name="Invested", order=5, color="#22c55e", is_terminal=True),
    ])
    
    # Settings
    is_default: bool = Field(default=True)
    is_active: bool = Field(default=True)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "pipelines"
        indexes = ["user_id"]


class PipelineCreate(BaseModel):
    """Schema for creating a pipeline"""
    name: str
    description: Optional[str] = None
    stages: Optional[List[PipelineStage]] = None


class PipelineUpdate(BaseModel):
    """Schema for updating a pipeline"""
    name: Optional[str] = None
    description: Optional[str] = None
    stages: Optional[List[PipelineStage]] = None
    is_active: Optional[bool] = None


class PipelineResponse(BaseModel):
    """API Response schema for pipeline"""
    id: str
    name: str
    description: Optional[str] = None
    stages: List[PipelineStage]
    is_default: bool
    is_active: bool
    
    class Config:
        from_attributes = True
