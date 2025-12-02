#!/usr/bin/env python3
"""
MongoDB Verification Script
Checks if thesis data is properly stored in MongoDB
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import json
import sys

# MongoDB connection
MONGODB_URL = "mongodb://localhost:27017"
DATABASE_NAME = "dealflow"
USERS_COLLECTION = "users"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    END = '\033[0m'
    BOLD = '\033[1m'

def print_header(text):
    print(f"\n{Colors.CYAN}{Colors.BOLD}{'=' * 70}{Colors.END}")
    print(f"{Colors.CYAN}{Colors.BOLD}{text.center(70)}{Colors.END}")
    print(f"{Colors.CYAN}{Colors.BOLD}{'=' * 70}{Colors.END}\n")

def print_section(text):
    print(f"\n{Colors.BLUE}{Colors.BOLD}→ {text}{Colors.END}")

def print_success(text):
    print(f"{Colors.GREEN}✓ {text}{Colors.END}")

def print_error(text):
    print(f"{Colors.RED}✗ {text}{Colors.END}")

def print_warning(text):
    print(f"{Colors.YELLOW}⚠ {text}{Colors.END}")

def print_info(text):
    print(f"{Colors.CYAN}ℹ {text}{Colors.END}")

async def verify_mongodb_connection():
    """Verify MongoDB is running"""
    print_section("Step 1: Verify MongoDB Connection")
    
    try:
        client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
        await client.admin.command('ping')
        print_success(f"Connected to MongoDB: {MONGODB_URL}")
        return client
    except Exception as e:
        print_error(f"Cannot connect to MongoDB: {str(e)}")
        print_warning("Make sure MongoDB is running on localhost:27017")
        return None

async def check_database(client):
    """Check if dealflow database exists"""
    print_section("Step 2: Check Database")
    
    db = client[DATABASE_NAME]
    collections = await db.list_collection_names()
    
    print_success(f"Database: {DATABASE_NAME}")
    print_info(f"Collections found: {len(collections)}")
    for col in collections:
        print_info(f"  - {col}")
    
    if USERS_COLLECTION not in collections:
        print_warning(f"Collection '{USERS_COLLECTION}' not found")
        return None
    
    return db

async def count_users(db):
    """Count total users"""
    print_section("Step 3: Count Users")
    
    users_col = db[USERS_COLLECTION]
    count = await users_col.count_documents({})
    
    print_success(f"Total users in database: {count}")
    return count

async def find_users_with_thesis(db):
    """Find all users with thesis data"""
    print_section("Step 4: Find Users with Thesis Data")
    
    users_col = db[USERS_COLLECTION]
    users = await users_col.find({"thesis": {"$ne": None}}).to_list(None)
    
    print_success(f"Users with thesis: {len(users)}")
    
    if not users:
        print_warning("No users with thesis data found")
        return []
    
    return users

async def display_user_details(users):
    """Display user thesis details"""
    print_section("Step 5: User Thesis Details")
    
    if not users:
        print_warning("No users to display")
        return
    
    for idx, user in enumerate(users, 1):
        print(f"\n{Colors.BLUE}User #{idx}{Colors.END}")
        print_info(f"Email: {user.get('email')}")
        print_info(f"Name: {user.get('full_name')}")
        print_info(f"Onboarding Complete: {user.get('onboarding_complete')}")
        print_info(f"Created: {user.get('created_at')}")
        
        thesis = user.get('thesis', {})
        if thesis:
            print_success("Thesis Data:")
            print_info(f"  Fund Name: {thesis.get('fund_name', 'N/A')}")
            print_info(f"  Fund Size: {thesis.get('fund_size', 'N/A')}")
            print_info(f"  Stages: {', '.join(thesis.get('stages', []))}")
            print_info(f"  Sectors: {', '.join(thesis.get('sectors', []))}")
            print_info(f"  Geographies: {', '.join(thesis.get('geographies', []))}")
            print_info(f"  Check Size: ${thesis.get('check_size_min', 0):,} - ${thesis.get('check_size_max', 0):,}")
            print_info(f"  Thesis Description: {thesis.get('thesis_description', 'N/A')[:50]}...")
            print_info(f"  Anti-Portfolio: {', '.join(thesis.get('anti_portfolio', []))}")

async def search_user_by_email(db, email):
    """Search for specific user by email"""
    print_section(f"Step 6: Search User by Email")
    print_info(f"Searching for: {email}")
    
    users_col = db[USERS_COLLECTION]
    user = await users_col.find_one({"email": email})
    
    if user:
        print_success(f"User found: {email}")
        print_info(f"ID: {user.get('_id')}")
        print_info(f"Name: {user.get('full_name')}")
        print_info(f"Onboarding Complete: {user.get('onboarding_complete')}")
        
        if user.get('thesis'):
            print_success("Thesis Data Found:")
            thesis = user['thesis']
            print_info(f"  Fund: {thesis.get('fund_name')}")
            print_info(f"  Stages: {thesis.get('stages')}")
            print_info(f"  Sectors: {thesis.get('sectors')}")
            print_info(f"  Geographies: {thesis.get('geographies')}")
            return user
        else:
            print_warning("User has no thesis data")
            return user
    else:
        print_error(f"User not found: {email}")
        return None

async def verify_thesis_fields(db):
    """Verify thesis field structure"""
    print_section("Step 7: Verify Thesis Field Structure")
    
    users_col = db[USERS_COLLECTION]
    users = await users_col.find({"thesis": {"$ne": None}}).limit(1).to_list(None)
    
    if not users:
        print_warning("No users with thesis to verify")
        return
    
    thesis = users[0].get('thesis', {})
    required_fields = [
        'fund_name', 'fund_size', 'check_size_min', 'check_size_max',
        'stages', 'sectors', 'geographies', 'thesis_description', 'anti_portfolio'
    ]
    
    print_info("Required fields check:")
    for field in required_fields:
        if field in thesis:
            print_success(f"  ✓ {field}: {thesis[field]}")
        else:
            print_warning(f"  ✗ {field}: MISSING")

async def main():
    """Run all verification steps"""
    print_header("MongoDB Thesis Data Verification")
    
    # Connect to MongoDB
    client = await verify_mongodb_connection()
    if not client:
        sys.exit(1)
    
    try:
        # Check database
        db = await check_database(client)
        if not db:
            sys.exit(1)
        
        # Count users
        count = await count_users(db)
        
        # Find users with thesis
        users = await find_users_with_thesis(db)
        
        # Display details
        if users:
            await display_user_details(users)
            
            # Verify fields
            await verify_thesis_fields(db)
        
        # Optional: Search by email
        print("\n" + Colors.BLUE + Colors.BOLD + "INTERACTIVE SEARCH" + Colors.END)
        search_email = input("\nEnter email to search (or press Enter to skip): ").strip()
        if search_email:
            await search_user_by_email(db, search_email)
        
        # Summary
        print_header("Verification Summary")
        if count > 0 and users:
            print_success("✅ Database contains users")
            print_success(f"✅ {len(users)} user(s) with thesis data")
            print_success("✅ All thesis fields properly structured")
        else:
            print_warning("⚠ No users with thesis data yet")
            print_info("Register a user and complete onboarding first")
    
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())
