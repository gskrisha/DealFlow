"""
Clear existing seed startup data from database
Run this to remove the 5 dummy startups
"""
import asyncio
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from app.models.startup import Startup
from app.models.deal import Deal
from app.models.user import User
from app.core.config import settings


async def clear_seed_data():
    """Remove demo startups from database"""
    
    # Connect to MongoDB
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URL)
        await init_beanie(
            database=client[settings.DATABASE_NAME],
            document_models=[Startup, User, Deal]
        )
    except Exception as e:
        print(f"⚠️  Auth with credentials failed, trying without auth: {e}")
        # Fall back to connection without auth
        mongodb_url = "mongodb://localhost:27017"
        client = AsyncIOMotorClient(mongodb_url)
        await init_beanie(
            database=client[settings.DATABASE_NAME],
            document_models=[Startup, User, Deal]
        )
    
    print("🗑️  Clearing seed startup data...")
    
    # List of seed startup names to remove
    seed_startup_names = [
        "TechVenture AI",
        "GreenScale Energy",
        "HealthLink Digital",
        "Quantum Materials Inc",
        "FoodTech Solutions"
    ]
    
    # Remove each seed startup
    deleted_count = 0
    for name in seed_startup_names:
        result = await Startup.find_one({"name": name})
        if result:
            await result.delete()
            print(f"❌ Deleted startup: {name}")
            deleted_count += 1
    
    if deleted_count == 0:
        print("ℹ️  No seed data found to delete")
    else:
        print(f"\n✨ Deleted {deleted_count} seed startups!")
    
    if client:
        client.close()


if __name__ == "__main__":
    asyncio.run(clear_seed_data())
