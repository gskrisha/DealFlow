"""
DealFlow Backend Application
"""
from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.api.routes import api_router

__version__ = "1.0.0"

__all__ = [
    "settings",
    "connect_to_mongo",
    "close_mongo_connection",
    "api_router",
    "__version__"
]
