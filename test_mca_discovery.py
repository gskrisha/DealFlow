"""
Test MCA (Ministry of Corporate Affairs, India) Discovery Integration
"""
import requests
import random
import time

BASE_URL = 'http://localhost:8000/api/v1'

def test_mca_discovery():
    # Register new user for test
    email = f'mca_test_{random.randint(1000,9999)}@example.com'
    register_data = {
        'email': email,
        'password': 'testpassword123',
        'full_name': 'MCA Test User'
    }

    print('=' * 60)
    print('Testing MCA (India) Discovery Integration')
    print('=' * 60)
    
    print('\n1. Registering user...')
    resp = requests.post(f'{BASE_URL}/auth/register', json=register_data)
    print(f'   Status: {resp.status_code}')
    
    if resp.status_code != 201:
        # Try login if already exists
        resp = requests.post(f'{BASE_URL}/auth/login', json={'email': email, 'password': 'testpassword123'})
    
    tokens = resp.json()
    token = tokens.get('access_token')
    headers = {'Authorization': f'Bearer {token}'}
    print(f'   ✅ Authenticated as: {email}')

    # Set thesis for Indian market
    print('\n2. Setting thesis for Indian startups...')
    thesis_data = {
        'sectors': ['FinTech', 'E-commerce', 'HealthTech', 'EdTech'],
        'stages': ['Seed', 'Series A', 'Series B', 'Series C+', 'Growth/Late Stage'],
        'geographies': ['India', 'Asia'],
        'check_size': '100K-500K'
    }
    resp = requests.put(f'{BASE_URL}/auth/thesis', json=thesis_data, headers=headers)
    print(f'   Status: {resp.status_code}')
    print(f'   ✅ Thesis set: FinTech, E-commerce, HealthTech, EdTech in India')

    # Run MCA Discovery
    print('\n3. Starting MCA Discovery...')
    discovery_data = {
        'sources': ['mca'],
        'limit_per_source': 15
    }
    resp = requests.post(f'{BASE_URL}/discovery/run', json=discovery_data, headers=headers)
    print(f'   Status: {resp.status_code}')

    if resp.status_code == 200:
        result = resp.json()
        job_id = result.get('job_id')
        print(f'   Job ID: {job_id}')
        print(f'   Message: {result.get("message")}')
        
        # Wait for completion
        print('\n4. Waiting for discovery to complete...')
        status = None
        for i in range(15):
            time.sleep(2)
            status_resp = requests.get(f'{BASE_URL}/discovery/jobs/{job_id}', headers=headers)
            status = status_resp.json()
            print(f'   Progress: {status.get("progress")}% - {status.get("status")}')
            
            if status.get('status') in ['completed', 'failed']:
                break
        
        print(f'\n5. Results:')
        print(f'   Startups Found: {status.get("startups_found")}')
        print(f'   Startups Added: {status.get("startups_added")}')
        
        # Fetch results
        if status.get('startups_added', 0) > 0:
            results_resp = requests.get(f'{BASE_URL}/discovery/jobs/{job_id}/results', headers=headers)
            if results_resp.status_code == 200:
                results = results_resp.json()
                print(f'\n6. Indian startups discovered ({len(results)} total):')
                for startup in results[:15]:
                    name = startup.get("name", "Unknown")
                    sector = startup.get("sector", "Unknown")
                    stage = startup.get("stage", "Unknown")
                    location = startup.get("location", "India")
                    print(f'   - {name} ({sector}) - {stage} - {location}')
    else:
        print(f'Error: {resp.text}')

    print('\n' + '=' * 60)
    print('✅ MCA Integration Test Complete!')
    print('=' * 60)

if __name__ == '__main__':
    test_mca_discovery()
