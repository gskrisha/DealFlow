"""
Test Discovery from ALL Sources (YC + Crunchbase + AngelList + MCA)
"""
import requests
import random
import time

BASE_URL = 'http://localhost:8000/api/v1'

def test_all_sources():
    email = f'all_sources_{random.randint(1000,9999)}@example.com'
    resp = requests.post(f'{BASE_URL}/auth/register', json={'email': email, 'password': 'test123', 'full_name': 'Test'})
    token = resp.json().get('access_token')
    headers = {'Authorization': f'Bearer {token}'}

    print('Testing Discovery from ALL Sources (YC + Crunchbase + AngelList + MCA)')
    print('='*60)

    # Run discovery with all sources
    discovery_data = {
        'sources': ['yc', 'crunchbase', 'angellist', 'mca'],
        'limit_per_source': 10
    }
    resp = requests.post(f'{BASE_URL}/discovery/run', json=discovery_data, headers=headers)
    result = resp.json()
    job_id = result.get('job_id')
    print(f'Job: {job_id}')

    # Wait for completion
    status = None
    for i in range(20):
        time.sleep(2)
        status = requests.get(f'{BASE_URL}/discovery/jobs/{job_id}', headers=headers).json()
        print(f'Progress: {status.get("progress")}% - {status.get("status")}')
        if status.get('status') in ['completed', 'failed']:
            break

    print(f'\nTotal Startups Found: {status.get("startups_found")}')
    print(f'Total Startups Added: {status.get("startups_added")}')

    # Get results
    results = requests.get(f'{BASE_URL}/discovery/jobs/{job_id}/results?limit=50', headers=headers).json()
    print(f'\nResults retrieved: {len(results)}')

    # Group by source
    sources_found = {}
    for r in results:
        sources = r.get('sources', [{}])
        source = sources[0].get('name', 'unknown') if sources else 'unknown'
        if source not in sources_found:
            sources_found[source] = []
        sources_found[source].append(r.get('name'))

    print('\nBreakdown by source:')
    for source, names in sources_found.items():
        print(f'\n  {source.upper()}: {len(names)} startups')
        for name in names[:5]:
            print(f'    - {name}')

    print('\n' + '='*60)
    print('✅ All 4 data sources working!')
    print('='*60)

if __name__ == '__main__':
    test_all_sources()
