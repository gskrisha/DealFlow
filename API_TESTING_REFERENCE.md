# 🔌 DealFlow API Testing Guide

Quick reference for testing all endpoints using curl or Postman.

## 🔑 Configuration

```
API_BASE_URL = http://localhost:8000/api/v1
BACKEND_PORT = 8000
```

---

## 🧪 Test 1: Backend Health

### Request
```bash
curl -i http://localhost:8000/health
```

### Expected Response
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "healthy",
  "database": "connected"
}
```

---

## 🧪 Test 2: User Registration

### Request
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPassword123!",
    "full_name": "Test User",
    "company": "Test Company",
    "role": "Partner"
  }'
```

### Expected Response (201 Created)
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "testuser@example.com",
  "full_name": "Test User",
  "company": "Test Company",
  "role": "Partner",
  "thesis": null,
  "onboarding_complete": false,
  "is_active": true,
  "created_at": "2025-12-02T18:00:00"
}
```

### Error Responses
```
400 Bad Request:
{
  "detail": "Email already registered"
}

422 Unprocessable Entity:
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "invalid email format",
      "type": "value_error.email"
    }
  ]
}
```

---

## 🧪 Test 3: User Login

### Request
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPassword123!"
  }'
```

### Expected Response (200 OK)
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Save the `access_token` - you'll need it for authenticated requests**

### Error Responses
```
401 Unauthorized:
{
  "detail": "Incorrect email or password"
}

403 Forbidden:
{
  "detail": "User account is disabled"
}
```

---

## 🧪 Test 4: Get Current User

### Request
```bash
# Replace TOKEN with actual access_token from login
TOKEN="eyJhbGc..."

curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Expected Response (200 OK)
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "testuser@example.com",
  "full_name": "Test User",
  "company": "Test Company",
  "role": "Partner",
  "avatar_url": null,
  "thesis": null,
  "onboarding_complete": false,
  "is_active": true,
  "created_at": "2025-12-02T18:00:00"
}
```

### Error Responses
```
401 Unauthorized:
{
  "detail": "Not authenticated"
}

401 Unauthorized:
{
  "detail": "Invalid authentication credentials"
}
```

---

## 🧪 Test 5: Save Fund Thesis ⭐ KEY TEST

### Request
```bash
TOKEN="eyJhbGc..."

curl -X PUT http://localhost:8000/api/v1/auth/thesis \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fund_name": "Tech Fund 2025",
    "fund_size": "$50M",
    "check_size_min": 500000,
    "check_size_max": 5000000,
    "stages": ["Seed", "Series A", "Series B"],
    "sectors": ["HealthTech", "FinTech", "EdTech"],
    "geographies": ["United States", "Europe", "Asia"],
    "thesis_description": "Investing in early-stage tech startups solving real problems",
    "anti_portfolio": ["Real Estate", "Oil & Gas", "Tobacco"]
  }'
```

### Expected Response (200 OK)
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "testuser@example.com",
  "full_name": "Test User",
  "thesis": {
    "fund_name": "Tech Fund 2025",
    "fund_size": "$50M",
    "check_size_min": 500000,
    "check_size_max": 5000000,
    "stages": ["Seed", "Series A", "Series B"],
    "sectors": ["HealthTech", "FinTech", "EdTech"],
    "geographies": ["United States", "Europe", "Asia"],
    "thesis_description": "Investing in early-stage tech startups solving real problems",
    "anti_portfolio": ["Real Estate", "Oil & Gas", "Tobacco"]
  },
  "onboarding_complete": true,
  "is_active": true,
  "created_at": "2025-12-02T18:00:00"
}
```

### Important Notes
- ✅ `onboarding_complete` is set to `true` after saving
- ✅ All thesis fields are persisted
- ✅ Data is stored in MongoDB `users` collection

---

## 🧪 Test 6: Get User with Thesis

### Request
```bash
TOKEN="eyJhbGc..."

curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Expected Response (200 OK)
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "testuser@example.com",
  "full_name": "Test User",
  "thesis": {
    "fund_name": "Tech Fund 2025",
    "stages": ["Seed", "Series A", "Series B"],
    "sectors": ["HealthTech", "FinTech", "EdTech"],
    "geographies": ["United States", "Europe", "Asia"],
    ...
  },
  "onboarding_complete": true,
  "is_active": true,
  "created_at": "2025-12-02T18:00:00"
}
```

### Verification
✅ Thesis field is populated  
✅ All fields from save request are present  
✅ `onboarding_complete` is true  

---

## 🧪 Test 7: Start Discovery (Optional)

### Request
```bash
TOKEN="eyJhbGc..."

curl -X POST http://localhost:8000/api/v1/discovery/run \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sources": ["yc"],
    "sectors": ["HealthTech", "FinTech"],
    "stages": ["Seed", "Series A"],
    "limit_per_source": 10
  }'
```

### Expected Response (200 OK)
```json
{
  "job_id": "job_123abc",
  "status": "pending",
  "message": "Discovery job started",
  "startups_found": 0
}
```

### Note
- The job runs in background
- Poll `/discovery/status/{job_id}` to check progress
- When complete, results are stored in database

---

## 🔧 Complete Test Sequence (Bash Script)

Copy and save this as `test_api.sh`:

```bash
#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

API="http://localhost:8000/api/v1"
EMAIL="test_$(date +%s)@dealflow.test"
PASSWORD="TestPassword123!"

echo "Starting DealFlow API Tests..."
echo "======================================"

# Test 1: Health Check
echo -e "\n${GREEN}Test 1: Health Check${NC}"
curl -s http://localhost:8000/health | jq .

# Test 2: Register
echo -e "\n${GREEN}Test 2: User Registration${NC}"
REGISTER_RESPONSE=$(curl -s -X POST $API/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"full_name\": \"Test User\",
    \"company\": \"Test Company\",
    \"role\": \"Partner\"
  }")
echo "$REGISTER_RESPONSE" | jq .
USER_ID=$(echo "$REGISTER_RESPONSE" | jq -r '.id')
echo "User ID: $USER_ID"

# Test 3: Login
echo -e "\n${GREEN}Test 3: User Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST $API/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")
echo "$LOGIN_RESPONSE" | jq .
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token')
echo "Access Token: ${TOKEN:0:20}..."

# Test 4: Get Current User
echo -e "\n${GREEN}Test 4: Get Current User${NC}"
curl -s -X GET $API/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq .

# Test 5: Save Thesis
echo -e "\n${GREEN}Test 5: Save Fund Thesis${NC}"
THESIS_RESPONSE=$(curl -s -X PUT $API/auth/thesis \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fund_name": "Test Fund",
    "fund_size": "$50M",
    "check_size_min": 500000,
    "check_size_max": 5000000,
    "stages": ["Seed", "Series A"],
    "sectors": ["HealthTech", "FinTech"],
    "geographies": ["United States"],
    "thesis_description": "Test thesis",
    "anti_portfolio": ["Real Estate"]
  }')
echo "$THESIS_RESPONSE" | jq .
echo "Thesis saved: $(echo "$THESIS_RESPONSE" | jq '.thesis != null')"

# Test 6: Verify Thesis Saved
echo -e "\n${GREEN}Test 6: Verify Thesis in User Profile${NC}"
curl -s -X GET $API/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq '.thesis'

echo -e "\n${GREEN}All tests completed!${NC}"
```

### Run the script:
```bash
chmod +x test_api.sh
./test_api.sh
```

---

## 📊 API Response Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Request successful |
| 201 | Created | Resource created (registration) |
| 400 | Bad Request | Invalid input (email format, missing fields) |
| 401 | Unauthorized | Missing/invalid auth token |
| 403 | Forbidden | User disabled or insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 422 | Unprocessable Entity | Invalid data types or format |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Backend error |

---

## 🔐 Authentication Headers

All authenticated endpoints require:
```
Authorization: Bearer <access_token>
```

Example:
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:8000/api/v1/auth/me
```

---

## 📝 Field Requirements

### Registration
- `email`: Valid email format, unique
- `password`: String (at least 8 chars recommended)
- `full_name`: String
- `company`: String (optional)
- `role`: String (optional)

### Thesis
- `fund_name`: String (optional)
- `fund_size`: String (optional)
- `check_size_min`: Float/Integer (optional)
- `check_size_max`: Float/Integer (optional)
- `stages`: Array of strings (optional)
- `sectors`: Array of strings (optional)
- `geographies`: Array of strings (optional)
- `thesis_description`: String (optional)
- `anti_portfolio`: Array of strings (optional)

---

## 🐛 Common Errors & Solutions

### CORS Error
```
Access-Control-Allow-Origin missing
```
**Solution**: Restart backend with new CORS config
```bash
python -m uvicorn main:app --reload
```

### 401 Unauthorized
```json
{"detail": "Not authenticated"}
```
**Solution**: Add Authorization header with valid token

### 400 Bad Request
```json
{"detail": "Email already registered"}
```
**Solution**: Use a different email or login with existing account

### 422 Unprocessable Entity
```json
{"detail": "Invalid data type for field"}
```
**Solution**: Check field types (check_size_min should be number, not string)

---

## ✅ Success Criteria

Test is successful when:
- ✅ All 6 tests return expected responses
- ✅ No 401/403 authentication errors
- ✅ No 500 server errors
- ✅ Thesis field populated after save
- ✅ `onboarding_complete: true`
- ✅ Can retrieve thesis from `/auth/me`

---

**Status**: Ready for Testing  
**Last Updated**: December 2, 2025

