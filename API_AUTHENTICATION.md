# 🔐 DealFlow API Authentication Guide

## Overview

DealFlow uses **JWT (JSON Web Tokens)** for API authentication with both public and protected endpoints.

| Endpoint Type | Auth Required | Use Case |
|---------------|---------------|----------|
| **Public** | ❌ No | Browse startups, view stats |
| **Protected** | ✅ Yes | Personal data, write operations |

---

## Quick Start

### 1. Register/Login to Get Token

**Register:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d {
    "email": "user@example.com",
    "username": "username",
    "password": "securepassword123",
    "full_name": "Full Name"
  }
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d {
    "email": "user@example.com",
    "password": "securepassword123"
  }
```

### 2. Use Token for Protected Endpoints

**Add to Headers:**
```bash
Authorization: Bearer {access_token}
```

**Example:**
```bash
curl -X GET http://localhost:8000/api/v1/deals/pipeline \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Refresh Token When Expired

**Access Token Expires:** 30 minutes  
**Refresh Token Expires:** 7 days

```bash
curl -X POST http://localhost:8000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d {
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
```

---

## API Endpoints Reference

### Public Endpoints (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/startups` | List all startups |
| `GET` | `/api/v1/startups/stats` | Aggregated statistics |
| `GET` | `/api/v1/discovery/sources` | Available discovery sources |
| `GET` | `/api/v1/outreach/stats` | Demo outreach statistics |

**Example:**
```bash
curl http://localhost:8000/api/v1/startups?limit=10
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register new user |
| `POST` | `/api/v1/auth/login` | Login and get tokens |
| `POST` | `/api/v1/auth/refresh` | Refresh access token |
| `POST` | `/api/v1/auth/logout` | Logout (optional) |

### Protected Endpoints (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/deals/pipeline` | User's deal pipeline |
| `POST` | `/api/v1/deals` | Create new deal |
| `PUT` | `/api/v1/deals/{id}` | Update deal |
| `GET` | `/api/v1/outreach` | User's outreach history |
| `POST` | `/api/v1/outreach` | Create outreach |
| `POST` | `/api/v1/outreach/generate` | AI-generate outreach |
| `POST` | `/api/v1/outreach/send` | Send outreach |

---

## Token Structure

### Access Token
```json
{
  "sub": "user_id",
  "exp": 1234567890,
  "iat": 1234567800,
  "type": "access"
}
```

### Refresh Token
```json
{
  "sub": "user_id",
  "exp": 1234567890,
  "iat": 1234567800,
  "type": "refresh"
}
```

---

## Frontend Implementation

### React Context (Already Implemented)

**Location:** `src/lib/AuthContext.jsx`

```javascript
import { useAuth } from './lib/AuthContext';

function MyComponent() {
  const { user, token, loading, login, logout } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <button onClick={() => login(email, password)}>Login</button>;
  }
  
  return <div>Welcome {user.username}</div>;
}
```

### API Client (Already Implemented)

**Location:** `src/lib/api.js`

```javascript
import { api } from './api';

// Automatically includes auth token
async function fetchUserDeals() {
  const deals = await api.get('/deals/pipeline');
  return deals;
}
```

### Usage in Hooks

**Location:** `src/lib/hooks.js`

```javascript
function useDeals() {
  const { user } = useAuth();
  const [deals, setDeals] = useState([]);
  
  useEffect(() => {
    if (user?.id) {
      fetchUserDeals();
    }
  }, [user]);
  
  return deals;
}
```

---

## Configuration

### JWT Settings (Backend)

**File:** `backend/app/core/config.py`

```python
JWT_SECRET_KEY = "your-super-secret-key-change-in-production"
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7
```

### Update for Production

```env
JWT_SECRET_KEY=your-production-secret-key-min-32-chars
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

---

## Error Responses

### Unauthorized (401)
```json
{
  "detail": "Not authenticated"
}
```

**Solution:** Provide valid token in Authorization header

### Forbidden (403)
```json
{
  "detail": "Not enough permissions"
}
```

**Solution:** User doesn't have access to this resource

### Token Expired (401)
```json
{
  "detail": "Token has expired"
}
```

**Solution:** Call `/auth/refresh` to get new token

### Invalid Token (401)
```json
{
  "detail": "Could not validate credentials"
}
```

**Solution:** Check token format and validity

---

## Best Practices

### 1. **Secure Token Storage** (Frontend)
```javascript
// ✅ Good: HTTPOnly Cookie (automatic)
// ✅ Good: Secure localStorage (frontend storage)
// ❌ Avoid: URL parameters
// ❌ Avoid: Local Storage for sensitive data
```

### 2. **Token Transmission**
```bash
# ✅ Correct
Authorization: Bearer {token}

# ❌ Wrong
Authorization: {token}
Authorization: JWT {token}
```

### 3. **Refresh Strategy** (Frontend)
```javascript
// Refresh before expiry
const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes

setTimeout(() => {
  api.post('/auth/refresh', { refresh_token });
}, ACCESS_TOKEN_EXPIRE_MS - REFRESH_THRESHOLD);
```

### 4. **Error Handling**
```javascript
try {
  const data = await api.get('/protected-endpoint');
} catch (error) {
  if (error.status === 401) {
    // Token expired or invalid
    // Try refresh, then retry
    // If refresh fails, redirect to login
  }
}
```

### 5. **HTTPS Only** (Production)
```env
# Production ONLY
HTTPS_ONLY=true
SECURE_COOKIES=true
CORS_ALLOW_CREDENTIALS=true
```

---

## Development vs Production

### Development
```env
JWT_SECRET_KEY=dev-secret-key
DEBUG=true
CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]
```

### Production
```env
JWT_SECRET_KEY=super-secret-production-key-min-32-chars-random
DEBUG=false
CORS_ORIGINS=["https://dealflow.app", "https://www.dealflow.app"]
HTTPS_ONLY=true
```

---

## Testing Authentication

### Test Register
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "TestPass123!",
    "full_name": "Test User"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

### Test Protected Endpoint
```bash
TOKEN="your_access_token_here"
curl -X GET http://localhost:8000/api/v1/deals/pipeline \
  -H "Authorization: Bearer $TOKEN"
```

### Test Refresh
```bash
curl -X POST http://localhost:8000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "your_refresh_token_here"
  }'
```

---

## Troubleshooting

### "Not authenticated" Error
**Cause:** Missing or invalid token

**Solution:**
```javascript
// Check token exists
console.log(localStorage.getItem('accessToken'));

// Verify token format
// Token should start with "eyJ"

// Resend with correct header
fetch('/api/v1/endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### "Token has expired" Error
**Cause:** Access token expired

**Solution:**
```javascript
// Use refresh token to get new access token
const response = await fetch('/api/v1/auth/refresh', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ refresh_token })
});
```

### CORS Authentication Error
**Cause:** Credentials not sent with CORS request

**Solution:**
```javascript
// Add credentials: 'include'
fetch('/api/v1/endpoint', {
  credentials: 'include',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## API Documentation

For OpenAPI/Swagger documentation:
```
http://localhost:8000/docs
```

Interactive API testing available at docs endpoint.
