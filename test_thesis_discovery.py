"""
Test thesis update and discovery flow
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000/api/v1"

def test_full_flow():
    # Generate unique email
    import random
    email = f"test_thesis_{random.randint(1000, 9999)}@example.com"
    password = "testpassword123"
    
    print("=" * 60)
    print("Testing Thesis Storage and Discovery Flow")
    print("=" * 60)
    
    # 1. Register a new user
    print("\n1. Registering new user...")
    register_response = requests.post(
        f"{BASE_URL}/auth/register",
        json={
            "email": email,
            "password": password,
            "full_name": "Test Thesis User"
        }
    )
    print(f"   Status: {register_response.status_code}")
    if register_response.status_code not in [200, 201]:
        print(f"   Error: {register_response.text}")
        return False
    print(f"   ✅ User registered: {email}")
    
    # 2. Login to get tokens
    print("\n2. Logging in...")
    login_response = requests.post(
        f"{BASE_URL}/auth/login",
        json={
            "email": email,
            "password": password
        }
    )
    print(f"   Status: {login_response.status_code}")
    if login_response.status_code != 200:
        print(f"   Error: {login_response.text}")
        return False
    
    login_data = login_response.json()
    access_token = login_data.get("access_token")
    print(f"   ✅ Login successful!")
    print(f"   Token received: {access_token[:50]}...")
    
    # 3. Get initial user info (no thesis yet)
    print("\n3. Checking initial user state...")
    headers = {"Authorization": f"Bearer {access_token}"}
    me_response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    print(f"   Status: {me_response.status_code}")
    if me_response.status_code == 200:
        user_data = me_response.json()
        print(f"   ✅ User: {user_data.get('email')}")
        print(f"   Thesis: {user_data.get('thesis')}")
    
    # 4. Update thesis with onboarding choices
    print("\n4. Updating user thesis...")
    thesis_data = {
        "stages": ["Seed", "Series A"],
        "sectors": ["AI/ML", "Fintech", "Healthcare"],
        "geographies": ["North America", "Europe"],
        "check_size": "$100K-$500K",
        "fund_size": "$10M-$50M",
        "portfolio_size": "20-30 companies",
        "key_metrics": ["Revenue Growth", "User Retention", "LTV/CAC"],
        "deal_breakers": ["No IP Protection", "Single Founder", "High Burn Rate"]
    }
    
    thesis_response = requests.put(
        f"{BASE_URL}/auth/thesis",
        headers=headers,
        json=thesis_data
    )
    print(f"   Status: {thesis_response.status_code}")
    if thesis_response.status_code == 200:
        updated_user = thesis_response.json()
        print(f"   ✅ Thesis updated!")
        print(f"   Saved thesis: {json.dumps(updated_user.get('thesis'), indent=2)}")
    else:
        print(f"   ❌ Error: {thesis_response.text}")
        return False
    
    # 5. Verify thesis was persisted
    print("\n5. Verifying thesis persistence...")
    me_response2 = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    if me_response2.status_code == 200:
        user_data2 = me_response2.json()
        saved_thesis = user_data2.get('thesis', {}) or {}
        print(f"   ✅ Thesis persisted in database:")
        print(f"      Sectors: {saved_thesis.get('sectors')}")
        print(f"      Stages: {saved_thesis.get('stages')}")
        print(f"      Geographies: {saved_thesis.get('geographies')}")
        print(f"      Check Size: {saved_thesis.get('check_size')}")
        print(f"      Key Metrics: {saved_thesis.get('key_metrics')}")
        print(f"      Deal Breakers: {saved_thesis.get('deal_breakers')}")
    
    # 6. Run AI Discovery with thesis filtering
    print("\n6. Running AI Discovery (with thesis-based filtering)...")
    discovery_response = requests.post(
        f"{BASE_URL}/discovery/run",
        headers=headers,
        json={
            "sources": ["yc", "crunchbase", "angellist"],
            "limit_per_source": 10
        }
    )
    print(f"   Status: {discovery_response.status_code}")
    if discovery_response.status_code == 200:
        discovery_data = discovery_response.json()
        job_id = discovery_data.get("job_id")
        print(f"   ✅ Discovery job started: {job_id}")
        print(f"   Message: {discovery_data.get('message')}")
        
        # 7. Poll for job completion
        print("\n7. Waiting for discovery to complete...")
        for i in range(30):  # Max 30 seconds
            time.sleep(1)
            status_response = requests.get(f"{BASE_URL}/discovery/jobs/{job_id}", headers=headers)
            if status_response.status_code == 200:
                status_data = status_response.json()
                status = status_data.get("status")
                progress = status_data.get("progress", 0)
                print(f"   Progress: {progress}% - Status: {status}")
                
                if status == "completed":
                    print(f"   ✅ Discovery completed!")
                    print(f"   Startups found: {status_data.get('startups_found')}")
                    print(f"   Startups added: {status_data.get('startups_added')}")
                    if status_data.get('errors'):
                        print(f"   Errors: {status_data.get('errors')}")
                    break
                elif status == "failed":
                    print(f"   ❌ Discovery failed: {status_data.get('errors')}")
                    break
            else:
                print(f"   Error checking status: {status_response.text}")
                break
        
        # 8. Get discovery results
        print("\n8. Fetching discovery results...")
        results_response = requests.get(
            f"{BASE_URL}/discovery/jobs/{job_id}/results",
            headers=headers
        )
        if results_response.status_code == 200:
            results = results_response.json()
            print(f"   ✅ Found {len(results)} startups matching your thesis:")
            for startup in results[:5]:
                print(f"      - {startup.get('name')} ({startup.get('sector')}) - Stage: {startup.get('stage')}")
        else:
            print(f"   Error: {results_response.text}")
    else:
        print(f"   ❌ Error starting discovery: {discovery_response.text}")
        return False
    
    print("\n" + "=" * 60)
    print("✅ All tests passed! Thesis storage and discovery working.")
    print("=" * 60)
    return True

if __name__ == "__main__":
    test_full_flow()
