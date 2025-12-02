"""
Test authentication endpoints
"""
import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

# Test data
test_user = {
    "email": "test@example.com",
    "password": "testpass123",
    "full_name": "Test User",
    "company": "Test Fund",
    "role": "investor"
}

print("=" * 60)
print("TESTING DEALFLOW AUTH ENDPOINTS")
print("=" * 60)

# Test 1: Register
print("\n1. Testing REGISTER endpoint...")
print(f"   POST {BASE_URL}/auth/register")
try:
    response = requests.post(
        f"{BASE_URL}/auth/register",
        json=test_user,
        timeout=10
    )
    print(f"   Status: {response.status_code}")
    print(f"   Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 201:
        print("   ✅ Register successful!")
    else:
        print(f"   ❌ Register failed!")
except Exception as e:
    print(f"   ❌ Error: {e}")

# Test 2: Login
print("\n2. Testing LOGIN endpoint...")
print(f"   POST {BASE_URL}/auth/login")
try:
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={
            "email": test_user["email"],
            "password": test_user["password"]
        },
        timeout=10
    )
    print(f"   Status: {response.status_code}")
    data = response.json()
    print(f"   Response: {json.dumps(data, indent=2)}")
    
    if response.status_code == 200:
        print("   ✅ Login successful!")
        token = data.get("access_token")
        
        # Test 3: Get Me
        print("\n3. Testing GET /me endpoint...")
        print(f"   GET {BASE_URL}/auth/me")
        try:
            response = requests.get(
                f"{BASE_URL}/auth/me",
                headers={"Authorization": f"Bearer {token}"},
                timeout=10
            )
            print(f"   Status: {response.status_code}")
            print(f"   Response: {json.dumps(response.json(), indent=2)}")
            
            if response.status_code == 200:
                print("   ✅ Get user successful!")
            else:
                print(f"   ❌ Get user failed!")
        except Exception as e:
            print(f"   ❌ Error: {e}")
    else:
        print(f"   ❌ Login failed!")
except Exception as e:
    print(f"   ❌ Error: {e}")

print("\n" + "=" * 60)
print("AUTH TESTS COMPLETE")
print("=" * 60)
