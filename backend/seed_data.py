"""
Seed script to populate database with demo data
"""
import asyncio
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from app.models.startup import Startup
from app.models.deal import Deal
from app.models.user import User
from app.core.config import settings
from app.core.security import get_password_hash


async def seed_database():
    """Populate database with demo data"""
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    await init_beanie(
        database=client[settings.DATABASE_NAME],
        document_models=[Startup, User, Deal]
    )
    
    print("🌱 Seeding database with demo data...")
    
    # Create a demo user
    demo_user = User(
        email="demo@dealflow.com",
        username="demo",
        full_name="Demo User",
        hashed_password=get_password_hash("demo123"),
        is_active=True
    )
    existing_user = await User.find_one({"email": "demo@dealflow.com"})
    if not existing_user:
        await demo_user.insert()
        print("✅ Created demo user: demo@dealflow.com")
    
    # Sample startups data - COMMENTED OUT: Seed data disabled
    # Users should use "Run AI Discovery" to populate real startup data
    # startups_data = [
    #     {
    #         "name": "TechVenture AI",
    #         "tagline": "AI-powered analytics for investors",
    #         ...
    #     },
    #     ...
    # ]
    # 
    # # Insert startups
    # for startup_data in startups_data:
    #     existing = await Startup.find_one({"name": startup_data["name"]})
    #     if not existing:
    #         startup = Startup(**startup_data)
    #         await startup.insert()
    #         print(f"✅ Created startup: {startup_data['name']}")
    
    print("📝 Seed startup data disabled - use 'Run AI Discovery' to add real startups")
    
    # Sample deals data
    print("\nSkipping deal seeding - will add later")
    
    print("\n✨ Database seeding complete!")
    if client:
        client.close()


if __name__ == "__main__":
    asyncio.run(seed_database())
