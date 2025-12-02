"""
DealFlow Backend - Configuration Settings
"""
from pydantic_settings import BaseSettings
from typing import List
import json


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # App
    APP_NAME: str = "DealFlow"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"
    
    # MongoDB - with authentication support
    MONGODB_USER: str = "dealflow_admin"
    MONGODB_PASSWORD: str = "dealflow_secure_password_2025"
    MONGODB_HOST: str = "localhost"
    MONGODB_PORT: int = 27017
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "dealflow"
    
    @property
    def mongodb_connection_string(self) -> str:
        """Build MongoDB connection string with optional authentication"""
        if self.MONGODB_USER and self.MONGODB_PASSWORD:
            return f"mongodb://{self.MONGODB_USER}:{self.MONGODB_PASSWORD}@{self.MONGODB_HOST}:{self.MONGODB_PORT}"
        return self.MONGODB_URL
    
    # JWT Authentication
    JWT_SECRET_KEY: str = "your-super-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # API Keys
    CRUNCHBASE_API_KEY: str = ""
    PROXYCURL_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    
    # MCA (Ministry of Corporate Affairs, India) API
    # Supported providers: signzy, surepass, gridlines
    MCA_API_KEY: str = ""
    MCA_API_PROVIDER: str = "signzy"  # Provider: signzy, surepass, gridlines
    MCA_API_BASE_URL: str = ""  # Optional custom base URL
    
    # CORS
    CORS_ORIGINS: str = '["http://localhost:5173","http://localhost:3000"]'
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from JSON string"""
        try:
            return json.loads(self.CORS_ORIGINS)
        except:
            return ["http://localhost:5173", "http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
