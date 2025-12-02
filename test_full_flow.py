#!/usr/bin/env python3
"""
DealFlow - Comprehensive Testing Script
Tests: Signup → Onboarding → DB Verification → Discovery
"""

import asyncio
import json
import aiohttp
from datetime import datetime
import sys

# Configuration
API_BASE_URL = "http://localhost:8000/api/v1"
TEST_EMAIL = f"test_{datetime.now().timestamp()}@dealflow.test"
TEST_PASSWORD = "TestPassword123!"

# Test data
TEST_THESIS = {
    "fundName": "Test Fund 2025",
    "fundSize": "$50M",
    "checkSize": "$500k-$5M",
    "investmentStage": ["Seed", "Series A", "Series B"],
    "sectors": ["HealthTech", "FinTech", "EdTech"],
    "geography": ["United States", "Europe", "Asia"],
    "portfolioSize": "30",
    "keyMetrics": ["Revenue Growth", "User Retention", "Market Size"],
    "dealBreakers": ["Real Estate", "Oil & Gas", "Tobacco"],
    "thesisDescription": "Investing in early-stage tech startups solving real problems"
}

class Colors:
    """ANSI color codes for terminal output"""
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    END = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_header(text):
    """Print colored header"""
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'=' * 70}{Colors.END}")
    print(f"{Colors.HEADER}{Colors.BOLD}{text.center(70)}{Colors.END}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'=' * 70}{Colors.END}\n")

def print_section(text):
    """Print colored section"""
    print(f"\n{Colors.BLUE}{Colors.BOLD}→ {text}{Colors.END}")

def print_success(text):
    """Print success message"""
    print(f"{Colors.GREEN}✓ {text}{Colors.END}")

def print_error(text):
    """Print error message"""
    print(f"{Colors.RED}✗ {text}{Colors.END}")

def print_warning(text):
    """Print warning message"""
    print(f"{Colors.YELLOW}⚠ {text}{Colors.END}")

def print_info(text):
    """Print info message"""
    print(f"{Colors.CYAN}ℹ {text}{Colors.END}")

async def test_backend_health():
    """Test if backend is running"""
    print_section("Step 1: Verify Backend Health")
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{API_BASE_URL.replace('/api/v1', '')}/health") as resp:
                if resp.status == 200:
                    data = await resp.json()
                    print_success(f"Backend is healthy: {data['status']}")
                    print_success(f"Database connection: {data['database']}")
                    return True
                else:
                    print_error(f"Backend returned status {resp.status}")
                    return False
    except Exception as e:
        print_error(f"Cannot connect to backend: {str(e)}")
        print_warning("Make sure backend is running: python -m uvicorn main:app --reload")
        return False

async def test_signup():
    """Test user registration"""
    print_section("Step 2: Register New User")
    print_info(f"Email: {TEST_EMAIL}")
    print_info(f"Password: {TEST_PASSWORD}")
    
    try:
        async with aiohttp.ClientSession() as session:
            payload = {
                "email": TEST_EMAIL,
                "password": TEST_PASSWORD,
                "full_name": "Test User",
                "company": "Test Company",
                "role": "Partner"
            }
            
            async with session.post(f"{API_BASE_URL}/auth/register", json=payload) as resp:
                if resp.status == 201:
                    data = await resp.json()
                    print_success(f"User registered successfully!")
                    print_info(f"User ID: {data['id']}")
                    print_info(f"Email: {data['email']}")
                    print_info(f"Onboarding complete: {data['onboarding_complete']}")
                    return data, TEST_EMAIL, TEST_PASSWORD
                else:
                    error = await resp.text()
                    print_error(f"Registration failed with status {resp.status}")
                    print_warning(f"Response: {error}")
                    return None, None, None
    except Exception as e:
        print_error(f"Registration error: {str(e)}")
        return None, None, None

async def test_login(email, password):
    """Test user login"""
    print_section("Step 3: Login User")
    
    try:
        async with aiohttp.ClientSession() as session:
            payload = {
                "email": email,
                "password": password
            }
            
            async with session.post(f"{API_BASE_URL}/auth/login", json=payload) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    token = data['access_token']
                    print_success("Login successful!")
                    print_info(f"Access token: {token[:20]}...")
                    return token
                else:
                    error = await resp.text()
                    print_error(f"Login failed with status {resp.status}")
                    print_warning(f"Response: {error}")
                    return None
    except Exception as e:
        print_error(f"Login error: {str(e)}")
        return None

async def test_get_user(token):
    """Get current user info"""
    print_section("Step 4: Get Current User")
    
    try:
        async with aiohttp.ClientSession() as session:
            headers = {"Authorization": f"Bearer {token}"}
            async with session.get(f"{API_BASE_URL}/auth/me", headers=headers) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    print_success("User retrieved successfully!")
                    print_info(f"Email: {data['email']}")
                    print_info(f"Full Name: {data['full_name']}")
                    print_info(f"Onboarding Complete: {data['onboarding_complete']}")
                    print_info(f"Thesis: {'Saved' if data['thesis'] else 'Not saved yet'}")
                    return data
                else:
                    error = await resp.text()
                    print_error(f"Get user failed with status {resp.status}")
                    print_warning(f"Response: {error}")
                    return None
    except Exception as e:
        print_error(f"Get user error: {str(e)}")
        return None

async def test_save_thesis(token):
    """Test saving fund thesis"""
    print_section("Step 5: Save Fund Thesis")
    print_info("Thesis data:")
    for key, value in TEST_THESIS.items():
        print_info(f"  {key}: {value}")
    
    try:
        async with aiohttp.ClientSession() as session:
            headers = {"Authorization": f"Bearer {token}"}
            
            # Convert frontend format to backend format
            payload = {
                "fund_name": TEST_THESIS["fundName"],
                "fund_size": TEST_THESIS["fundSize"],
                "check_size_min": 500000,  # Parse from "$500k-$5M"
                "check_size_max": 5000000,
                "stages": TEST_THESIS["investmentStage"],
                "sectors": TEST_THESIS["sectors"],
                "geographies": TEST_THESIS["geography"],
                "thesis_description": TEST_THESIS["thesisDescription"],
                "anti_portfolio": TEST_THESIS["dealBreakers"]
            }
            
            async with session.put(f"{API_BASE_URL}/auth/thesis", json=payload, headers=headers) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    print_success("Thesis saved successfully!")
                    print_info(f"Onboarding complete: {data['onboarding_complete']}")
                    thesis = data.get('thesis')
                    if thesis:
                        print_success("Thesis data in response:")
                        print_info(f"  Fund: {thesis.get('fund_name')}")
                        print_info(f"  Stages: {thesis.get('stages')}")
                        print_info(f"  Sectors: {thesis.get('sectors')}")
                        print_info(f"  Geographies: {thesis.get('geographies')}")
                    return data
                else:
                    error = await resp.text()
                    print_error(f"Save thesis failed with status {resp.status}")
                    print_warning(f"Response: {error}")
                    return None
    except Exception as e:
        print_error(f"Save thesis error: {str(e)}")
        return None

async def test_get_user_with_thesis(token):
    """Verify thesis is saved in user profile"""
    print_section("Step 6: Verify Thesis Saved in User Profile")
    
    try:
        async with aiohttp.ClientSession() as session:
            headers = {"Authorization": f"Bearer {token}"}
            async with session.get(f"{API_BASE_URL}/auth/me", headers=headers) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    thesis = data.get('thesis')
                    
                    if thesis:
                        print_success("Thesis retrieved from user profile!")
                        print_success(f"Fund Name: {thesis.get('fund_name')}")
                        print_success(f"Stages: {thesis.get('stages')}")
                        print_success(f"Sectors: {thesis.get('sectors')}")
                        print_success(f"Geographies: {thesis.get('geographies')}")
                        return True
                    else:
                        print_error("Thesis field is empty or null")
                        return False
                else:
                    print_error(f"Get user failed with status {resp.status}")
                    return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

async def test_start_discovery(token):
    """Test starting AI Discovery"""
    print_section("Step 7: Test AI Discovery with Saved Thesis")
    
    try:
        async with aiohttp.ClientSession() as session:
            headers = {"Authorization": f"Bearer {token}"}
            payload = {
                "sources": ["yc"],
                "limit_per_source": 5
            }
            
            async with session.post(f"{API_BASE_URL}/discovery/run", json=payload, headers=headers) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    print_success("Discovery job started!")
                    print_info(f"Job ID: {data.get('job_id')}")
                    print_info(f"Status: {data.get('status')}")
                    print_info(f"Message: {data.get('message')}")
                    return data.get('job_id')
                else:
                    error = await resp.text()
                    print_warning(f"Discovery start failed: {resp.status}")
                    print_warning(f"Response: {error}")
                    return None
    except Exception as e:
        print_warning(f"Discovery error (may not be implemented): {str(e)}")
        return None

async def main():
    """Run all tests"""
    print_header("DealFlow - Comprehensive Testing Suite")
    print_info(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print_info(f"Test Email: {TEST_EMAIL}")
    
    # Step 1: Check backend health
    if not await test_backend_health():
        print_error("Backend is not running. Cannot continue with tests.")
        sys.exit(1)
    
    # Step 2: Register user
    user_data, email, password = await test_signup()
    if not user_data:
        print_error("Registration failed. Cannot continue.")
        sys.exit(1)
    
    # Step 3: Login
    token = await test_login(email, password)
    if not token:
        print_error("Login failed. Cannot continue.")
        sys.exit(1)
    
    # Step 4: Get user
    await test_get_user(token)
    
    # Step 5: Save thesis
    await test_save_thesis(token)
    
    # Step 6: Verify thesis
    thesis_ok = await test_get_user_with_thesis(token)
    
    # Step 7: Start discovery
    job_id = await test_start_discovery(token)
    
    # Summary
    print_header("Test Summary")
    if thesis_ok:
        print_success("✅ Signup and Onboarding Flow: PASSED")
        print_success("✅ Thesis Storage: PASSED")
        print_success("✅ Data Persistence: PASSED")
        if job_id:
            print_success("✅ Discovery Integration: PASSED")
        else:
            print_warning("⚠ Discovery Integration: Not fully tested")
        
        print_info(f"\n📊 Test Results:")
        print_info(f"   - User email: {TEST_EMAIL}")
        print_info(f"   - User token: {token[:20]}...")
        print_info(f"   - Thesis saved: YES")
        print_info(f"   - Next step: Verify in MongoDB")
    else:
        print_error("❌ Some tests failed")
        sys.exit(1)
    
    print_info(f"\nCompleted: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    asyncio.run(main())
