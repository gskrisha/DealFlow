"""
DealFlow Backend - Database Connection
"""
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.startup import Startup
from app.models.user import User
from app.models.deal import Deal
from app.models.pipeline import Pipeline
from app.models.outreach import Outreach
from app.models.discovery import DiscoveryJob, DiscoveryResult
from loguru import logger


class Database:
    client: AsyncIOMotorClient = None


db = Database()


async def connect_to_mongo():
    """Create database connection"""
    connection_string = settings.mongodb_connection_string
    logger.info(f"Connecting to MongoDB at {settings.MONGODB_HOST}:{settings.MONGODB_PORT}...")
    logger.info(f"Database: {settings.DATABASE_NAME}")
    logger.info(f"User: {settings.MONGODB_USER}")
    
    try:
        # Try connection with authentication first
        db.client = AsyncIOMotorClient(connection_string, connectTimeoutMS=5000)
        
        # Test connection
        await db.client.admin.command('ping')
        logger.info("✅ Successfully connected to MongoDB with authentication")
        
    except Exception as e:
        logger.warning(f"⚠️  Could not connect with authentication: {str(e)}")
        logger.info("🔄 Attempting connection without authentication...")
        
        try:
            # Fallback to connection without auth
            fallback_url = f"mongodb://{settings.MONGODB_HOST}:{settings.MONGODB_PORT}"
            db.client = AsyncIOMotorClient(fallback_url, connectTimeoutMS=5000)
            
            # Test connection
            await db.client.admin.command('ping')
            logger.warning("⚠️  Connected to MongoDB WITHOUT authentication")
            logger.warning("🔐 For production, please enable authentication:")
            logger.warning(f"   Connection String: {settings.mongodb_connection_string}")
            
        except Exception as e2:
            logger.error(f"❌ Failed to connect to MongoDB: {str(e2)}")
            raise
    
    # Initialize Beanie with document models
    await init_beanie(
        database=db.client[settings.DATABASE_NAME],
        document_models=[
            Startup,
            User,
            Deal,
            Pipeline,
            Outreach,
            DiscoveryJob,
            DiscoveryResult
        ]
    )
    logger.info("Successfully connected to MongoDB")


async def close_mongo_connection():
    """Close database connection"""
    logger.info("Closing MongoDB connection...")
    if db.client:
        db.client.close()
    logger.info("MongoDB connection closed")


def get_database():
    """Get database instance"""
    return db.client[settings.DATABASE_NAME]


def get_mongo_client():
    """Get MongoDB client instance"""
    return db.client


async def close_mongo_connection():
    """Close database connection"""
    logger.info("Closing MongoDB connection...")
    if db.client:
        db.client.close()
    logger.info("MongoDB connection closed")


def get_database():
    """Get database instance"""
    return db.client[settings.DATABASE_NAME]
