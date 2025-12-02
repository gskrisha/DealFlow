"""
MongoDB Connection Test Script
Verifies MongoDB authentication and connection
"""
import asyncio
import sys
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.startup import Startup
from app.models.user import User
from app.models.deal import Deal
from app.models.pipeline import Pipeline
from app.models.outreach import Outreach
from loguru import logger

logger.add(sys.stderr, format="<level>{level: <8}</level> | {message}")


async def test_connection():
    """Test MongoDB connection with authentication"""
    
    print("\n🔗 Testing MongoDB Connection\n")
    print(f"Host: {settings.MONGODB_HOST}:{settings.MONGODB_PORT}")
    print(f"User: {settings.MONGODB_USER}")
    print(f"Database: {settings.DATABASE_NAME}")
    
    connection_string = settings.mongodb_connection_string
    print(f"\n📝 Connection String: {connection_string.replace(settings.MONGODB_PASSWORD, '****')}\n")
    
    try:
        # Create client
        print("🔐 Connecting to MongoDB...")
        client = AsyncIOMotorClient(connection_string, connectTimeoutMS=5000, serverSelectionTimeoutMS=5000)
        
        # Verify connection with ping
        print("🏓 Sending ping command...")
        result = await client.admin.command('ping')
        print(f"✅ Ping successful: {result}\n")
        
        # Initialize Beanie
        print("📦 Initializing Beanie ORM...")
        await init_beanie(
            database=client[settings.DATABASE_NAME],
            document_models=[Startup, User, Deal, Pipeline, Outreach]
        )
        print("✅ Beanie initialized successfully\n")
        
        # Test basic operations
        print("📊 Testing database operations...")
        
        # Count startups
        startup_count = await Startup.count()
        print(f"  • Startups in database: {startup_count}")
        
        # Count users
        user_count = await User.count()
        print(f"  • Users in database: {user_count}")
        
        # Get sample startup
        sample = await Startup.find_one()
        if sample:
            print(f"  • Sample startup: {sample.name} ({sample.sector})")
        
        print("\n✨ All tests passed! MongoDB is properly configured with authentication.")
        
        # Close connection
        client.close()
        return True
        
    except Exception as e:
        print(f"\n❌ Connection failed: {str(e)}")
        print("\n🔧 Troubleshooting tips:")
        print("  1. Ensure MongoDB is running: mongosh")
        print("  2. Check authentication credentials in .env")
        print("  3. Verify network connectivity to MongoDB host")
        print("  4. Check MongoDB logs for errors")
        return False


if __name__ == "__main__":
    success = asyncio.run(test_connection())
    sys.exit(0 if success else 1)
