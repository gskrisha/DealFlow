# 🚀 Complete DealFlow Database Setup Guide

## Quick Comparison: Connection Methods

| Method | Ease | Security | Recommended |
|--------|------|----------|-------------|
| **Docker** | ⭐⭐⭐ | ⭐⭐⭐ | ✅ Yes |
| **Windows Installer** | ⭐⭐ | ⭐⭐ | Development |
| **Cloud MongoDB** | ⭐ | ⭐⭐⭐⭐ | Production |

---

## Method 1: Docker (Recommended) ⭐⭐⭐

### Install Docker
- **Windows**: https://www.docker.com/products/docker-desktop
- **macOS**: Same link
- **Linux**: `sudo apt-get install docker.io docker-compose`

### Start MongoDB with Authentication

```bash
cd "Deal Flow"
docker-compose up -d mongodb
```

**What happens:**
- MongoDB 7.0 container starts
- Admin user created automatically
- Initialization script runs
- All data persists in `mongodb_data` volume

**Verify it's running:**
```bash
docker ps | findstr dealflow_mongodb
```

**Expected Output:**
```
dealflow_mongodb    mongo:7.0    Up 2 minutes    27017/tcp
```

**Connect to MongoDB inside Docker:**
```bash
docker exec -it dealflow_mongodb mongosh -u dealflow_admin -p dealflow_secure_password_2025
```

---

## Method 2: Windows Native Installation

### Step 1: Download and Install
1. Go to: https://www.mongodb.com/try/download/community
2. Select Windows, MSI, 64-bit
3. Download and run installer
4. Choose "Install MongoDB as a Service"
5. Complete installation and restart

### Step 2: Enable Authentication

**Open PowerShell as Administrator:**

```powershell
# Connect to MongoDB (no auth needed yet)
mongosh

# In mongosh, run:
use admin
db.createUser({
  user: "dealflow_admin",
  pwd: "dealflow_secure_password_2025",
  roles: ["root"]
})

# Exit mongosh
exit
```

### Step 3: Restart MongoDB with Authentication

**In PowerShell (as Administrator):**

```powershell
# Stop MongoDB
net stop MongoDB

# Start MongoDB (will now require authentication)
net start MongoDB
```

### Step 4: Verify Setup

```powershell
# This should fail (no credentials)
mongosh

# This should succeed
mongosh -u dealflow_admin -p dealflow_secure_password_2025
```

---

## Method 3: MongoDB Atlas (Cloud) ⭐⭐⭐⭐

### Step 1: Create Account
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Verify email

### Step 2: Create Cluster
1. Click "Create" → Choose "Build a Database"
2. Select "Free" tier
3. Select region (US preferred)
4. Click "Create Cluster"

### Step 3: Create Database User
1. Click "Database Access"
2. Click "Add New Database User"
3. Create user with same credentials:
   - Username: `dealflow_admin`
   - Password: `dealflow_secure_password_2025`
   - Role: "Admin"

### Step 4: Allow Network Access
1. Click "Network Access"
2. Click "Add IP Address"
3. Enter your IP or use `0.0.0.0/0` for development

### Step 5: Get Connection String
1. Click "Connect"
2. Choose "Drivers"
3. Select Node.js
4. Copy connection string
5. Replace `<password>` with your password
6. Update `.env`:

```env
MONGODB_URL=mongodb+srv://dealflow_admin:dealflow_secure_password_2025@cluster0.xxxxx.mongodb.net/dealflow?retryWrites=true&w=majority
```

---

## Configuration in DealFlow

### Update .env File

```env
# Local Docker/Windows Setup
MONGODB_USER=dealflow_admin
MONGODB_PASSWORD=dealflow_secure_password_2025
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_URL=mongodb://dealflow_admin:dealflow_secure_password_2025@localhost:27017

# For Cloud (MongoDB Atlas)
# MONGODB_URL=mongodb+srv://dealflow_admin:dealflow_secure_password_2025@cluster0.xxxxx.mongodb.net/dealflow

DATABASE_NAME=dealflow
```

### Backend Configuration

The backend (`app/core/config.py`) now:
- Reads credentials from `.env`
- Tries authenticated connection first
- Falls back to unauthenticated (for dev)
- Logs connection status

---

## Verification

### Test 1: Backend Logs
```bash
cd backend
python main.py
```

**Expected log output:**
```
INFO     | app.core.database:connect_to_mongo:24 - Connecting to MongoDB at localhost:27017...
INFO     | app.core.database:connect_to_mongo:25 - Database: dealflow
INFO     | app.core.database:connect_to_mongo:26 - User: dealflow_admin
✅ Successfully connected to MongoDB with authentication
INFO     | main:lifespan:28 - DealFlow Backend started successfully!
```

### Test 2: API Endpoint
```bash
curl http://localhost:8000/api/v1/startups
```

**Expected response:** `[]` (empty array or list of startups)

### Test 3: Direct Connection
```bash
# Local
mongosh -u dealflow_admin -p dealflow_secure_password_2025

# Docker
docker exec -it dealflow_mongodb mongosh -u dealflow_admin -p dealflow_secure_password_2025

# Atlas (from any connection string shown)
mongosh "your-connection-string"
```

---

## Troubleshooting

### ❌ "Connection refused"
**Cause:** MongoDB not running

**Solutions:**
```bash
# Docker: Start container
docker-compose up -d mongodb

# Windows: Start service
net start MongoDB

# Check if running
mongosh
```

### ❌ "Authentication failed"
**Cause:** Wrong credentials

**Solutions:**
1. Check `.env` has correct username/password
2. Verify user exists: `mongosh -u dealflow_admin -p dealflow_secure_password_2025`
3. Recreate user if needed

### ❌ "Not authorized to perform this action"
**Cause:** User lacks permissions

**Solutions:**
```bash
# Use admin user for admin tasks
mongosh -u dealflow_admin -p dealflow_secure_password_2025

# Use application user for app
# In .env, user: dealflow_user
```

### ❌ "Connection timeout"
**Cause:** Network/firewall issue

**Solutions:**
1. Check MongoDB port: `netstat -an | findstr 27017`
2. Check firewall rules
3. For Docker: `docker logs dealflow_mongodb`
4. For Cloud: Verify IP whitelisting

---

## Security Checklist

- [ ] **Strong Passwords**: Change default passwords
- [ ] **Enable Encryption**: Use TLS/SSL for connections
- [ ] **Network Restrictions**: Limit access to trusted IPs
- [ ] **User Roles**: Use least-privilege principle
- [ ] **Backups**: Regular automated backups
- [ ] **Monitoring**: Track connection attempts
- [ ] **.env Security**: Never commit .env to git
- [ ] **Production**: Use managed service (Atlas)

---

## Production Recommendations

1. **Use MongoDB Atlas** (managed database)
   - Automatic backups
   - Built-in security
   - 99.99% uptime SLA

2. **Enable TLS/SSL**
   ```env
   MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/?tls=true
   ```

3. **Set Strong Passwords**
   ```
   Min 16 characters
   Include uppercase, lowercase, numbers, symbols
   ```

4. **Implement Monitoring**
   ```bash
   # Docker logs
   docker logs -f dealflow_mongodb
   
   # Application logs
   tail -f backend.log
   ```

5. **Regular Backups**
   ```bash
   # Automated via Atlas dashboard
   # Or manual:
   mongodump -u dealflow_admin -p dealflow_secure_password_2025
   ```

---

## Quick Commands Reference

```bash
# Docker Operations
docker-compose up -d mongodb          # Start MongoDB
docker-compose stop mongodb           # Stop MongoDB
docker-compose restart mongodb        # Restart MongoDB
docker-compose down -v mongodb        # Delete MongoDB and data

# MongoDB Shell (Local)
mongosh                               # Connect without auth
mongosh -u dealflow_admin -p dealflow_secure_password_2025  # Connect with auth

# MongoDB Shell (Docker)
docker exec -it dealflow_mongodb mongosh -u dealflow_admin -p dealflow_secure_password_2025

# Backup/Restore
mongodump --uri="mongodb://localhost:27017" --username dealflow_admin --password dealflow_secure_password_2025
mongorestore --uri="mongodb://localhost:27017" --username dealflow_admin --password dealflow_secure_password_2025

# View Logs
docker logs -f dealflow_mongodb
docker exec -it dealflow_mongodb tail -f /var/log/mongodb/mongod.log
```

---

## Support

For issues or questions:
1. Check logs: `docker logs dealflow_mongodb`
2. Test connection: `mongosh [connection-string]`
3. Verify credentials: Check `.env` file
4. Review this guide's troubleshooting section
