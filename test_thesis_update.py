#!/usr/bin/env python3
"""
Test thesis update flow
"""
import aiohttp
import asyncio
import json

API_URL = "http://localhost:8000/api/v1"

async def test_thesis_flow():
    """Test the complete thesis update flow"""
    async with aiohttp.ClientSession() as session:
        # 1. Register
        print("1️⃣ Registering user...")
        register_data = {
            "email": f"test_{asyncio.get_event_loop().time()}@example.com",
            "password": "TestPassword123!",
            "full_name": "Test User",
            "company": "Test Fund",
            "role": "Partner"
        }
        
        async with session.post(
            f"{API_URL}/auth/register",
            json=register_data
        ) as resp:
            if resp.status == 201:
                user = await resp.json()
                print(f"   ✅ User registered: {user['email']}")
            else:
                error = await resp.json()
                print(f"   ❌ Registration failed: {error}")
                return
        
        # 2. Login
        print("\n2️⃣ Logging in...")
        async with session.post(
            f"{API_URL}/auth/login",
            json={"email": register_data["email"], "password": register_data["password"]}
        ) as resp:
            if resp.status == 200:
                tokens = await resp.json()
                access_token = tokens['access_token']
                print(f"   ✅ Logged in, token: {access_token[:20]}...")
            else:
                error = await resp.json()
                print(f"   ❌ Login failed: {error}")
                return
        
        # 3. Get user
        print("\n3️⃣ Getting user profile...")
        headers = {"Authorization": f"Bearer {access_token}"}
        async with session.get(
            f"{API_URL}/auth/me",
            headers=headers
        ) as resp:
            if resp.status == 200:
                user = await resp.json()
                print(f"   ✅ User retrieved: {user['email']}")
                print(f"      Onboarding complete: {user.get('onboarding_complete', False)}")
            else:
                print(f"   ❌ Failed to get user: {resp.status}")
                return
        
        # 4. Update thesis
        print("\n4️⃣ Updating thesis...")
        thesis_data = {
            "fund_name": "Test Fund",
            "fund_size": "50M",
            "check_size_min": 100000,
            "check_size_max": 1000000,
            "stages": ["Seed", "Series A"],
            "sectors": ["HealthTech", "Climate"],
            "geographies": ["United States"],
            "thesis_description": "Test thesis",
            "anti_portfolio": []
        }
        
        async with session.put(
            f"{API_URL}/auth/thesis",
            json=thesis_data,
            headers=headers
        ) as resp:
            if resp.status == 200:
                updated_user = await resp.json()
                print(f"   ✅ Thesis updated!")
                print(f"      Fund name: {updated_user['thesis']['fund_name']}")
                print(f"      Onboarding complete: {updated_user.get('onboarding_complete', False)}")
            else:
                error_text = await resp.text()
                print(f"   ❌ Failed to update thesis: {resp.status}")
                print(f"      Response: {error_text}")
                return
        
        print("\n✅ All tests passed!")

if __name__ == "__main__":
    asyncio.run(test_thesis_flow())
