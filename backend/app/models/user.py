"""
DealFlow Backend - User Model
"""
from datetime import datetime
from typing import List, Optional
from beanie import Document
from pydantic import BaseModel, EmailStr, Field


class FundThesis(BaseModel):
    """Fund investment thesis configuration - matches frontend FundThesisOnboarding"""
    # Step 1: Investment Stage
    investment_stage: List[str] = Field(default_factory=list)  # Pre-Seed, Seed, Series A, etc.
    
    # Step 2: Check Size & Fund
    check_size: Optional[str] = None  # $100K-$500K, $500K-$1M, etc.
    fund_size: Optional[str] = None  # Under $10M, $10M-$50M, etc.
    portfolio_size: Optional[str] = None  # 10-20 companies, 20-30, etc.
    
    # Step 3: Geography
    geography: List[str] = Field(default_factory=list)  # North America, Europe, etc.
    
    # Step 4: Sector Focus
    sectors: List[str] = Field(default_factory=list)  # B2B SaaS, FinTech, AI/ML, etc.
    
    # Step 5: Key Metrics
    key_metrics: List[str] = Field(default_factory=list)  # Revenue Growth, Team Quality, etc.
    
    # Step 6: Deal Breakers
    deal_breakers: List[str] = Field(default_factory=list)  # Solo Founder, No Revenue, etc.
    
    # Legacy fields for backward compatibility
    fund_name: Optional[str] = None
    check_size_min: Optional[float] = None
    check_size_max: Optional[float] = None
    geographies: List[str] = Field(default_factory=list)  # Alias for geography
    stages: List[str] = Field(default_factory=list)  # Alias for investment_stage
    thesis_description: Optional[str] = None
    anti_portfolio: List[str] = Field(default_factory=list)  # Sectors to avoid


class User(Document):
    """
    User document model for MongoDB
    Represents a user (investor) on the platform
    """
    email: EmailStr = Field(..., unique=True)
    hashed_password: str
    full_name: str
    company: Optional[str] = None
    role: Optional[str] = None  # Partner, Associate, Analyst, etc.
    
    # Profile
    avatar_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    bio: Optional[str] = None
    
    # Fund Thesis (for personalized discovery)
    thesis: Optional[FundThesis] = None
    onboarding_complete: bool = Field(default=False)
    
    # Account Status
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)
    is_superuser: bool = Field(default=False)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    
    class Settings:
        name = "users"
        indexes = ["email"]


class UserCreate(BaseModel):
    """Schema for user registration"""
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str
    company: Optional[str] = None
    role: Optional[str] = None


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    """Schema for updating user profile"""
    full_name: Optional[str] = None
    company: Optional[str] = None
    role: Optional[str] = None
    avatar_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    bio: Optional[str] = None


class ThesisUpdate(BaseModel):
    """Schema for updating fund thesis - accepts frontend onboarding data"""
    # Frontend field names (camelCase from JS)
    investmentStage: Optional[List[str]] = None
    checkSize: Optional[str] = None
    fundSize: Optional[str] = None
    portfolioSize: Optional[str] = None
    geography: Optional[List[str]] = None
    sectors: Optional[List[str]] = None
    keyMetrics: Optional[List[str]] = None
    dealBreakers: Optional[List[str]] = None
    
    # Legacy backend field names (for API compatibility)
    fund_name: Optional[str] = None
    check_size_min: Optional[float] = None
    check_size_max: Optional[float] = None
    stages: Optional[List[str]] = None
    geographies: Optional[List[str]] = None
    thesis_description: Optional[str] = None
    anti_portfolio: Optional[List[str]] = None
    investment_stage: Optional[List[str]] = None
    check_size: Optional[str] = None
    fund_size: Optional[str] = None
    portfolio_size: Optional[str] = None
    key_metrics: Optional[List[str]] = None
    deal_breakers: Optional[List[str]] = None


class UserResponse(BaseModel):
    """API Response schema for user"""
    id: str
    email: EmailStr
    full_name: str
    company: Optional[str] = None
    role: Optional[str] = None
    avatar_url: Optional[str] = None
    thesis: Optional[FundThesis] = None
    onboarding_complete: bool
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """JWT Token response"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
