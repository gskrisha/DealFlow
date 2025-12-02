"""Test YC-only discovery"""
import requests
import time

# Start YC discovery
r = requests.post('http://localhost:8000/api/v1/discovery/run', json={
    'sources': ['yc'], 
    'limit_per_source': 10
})
print('Job:', r.json())
job_id = r.json()['job_id']

time.sleep(5)

res = requests.get(f'http://localhost:8000/api/v1/discovery/jobs/{job_id}/results')
data = res.json()

if isinstance(data, list):
    print(f'\nYC Results: {len(data)} startups\n')
    for d in data[:10]:
        print(f"  - {d['name']}")
        print(f"    Tagline: {d.get('tagline', 'NO TAG')[:70]}...")
        print(f"    Location: {d.get('location', 'N/A')}")
        print(f"    Sector: {d.get('sector', 'N/A')}")
        print()
else:
    print('Response:', data)
