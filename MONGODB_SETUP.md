# MongoDB Authentication Setup Guide

## Quick Start with Docker (Recommended)

### Prerequisites
- Docker and Docker Compose installed
- Port 27017 available for MongoDB

### Steps

1. **Start MongoDB with Docker Compose:**
```bash
cd "Deal Flow"
docker-compose up -d mongodb
```

This will:
- Start MongoDB 7.0 container
- Create admin user: `dealflow_admin` / `dealflow_secure_password_2025`
- Create app user: `dealflow_user` / `dealflow_app_password_2025`
- Initialize collections and indexes
- Expose MongoDB on `localhost:27017`

2. **Start the Backend:**
```bash
cd backend
python -m pip install -r requirements.txt
python main.py
```

3. **Verify Connection:**
```bash
# The backend logs should show:
# ✅ Successfully connected to MongoDB
```

---

## Manual Setup (Windows)

### Step 1: Install MongoDB Community Edition

1. Download from: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Install MongoDB as a Service" (recommended)
4. Restart your computer

### Step 2: Enable Authentication

1. Open Command Prompt as Administrator
2. Connect to MongoDB without auth:
```bash
mongosh
```

3. Run these commands:
```javascript
use admin
db.createUser({
  user: "dealflow_admin",
  pwd: "dealflow_secure_password_2025",
  roles: ["root"]
})
```

4. Exit mongosh and restart MongoDB service:
```bash
net stop MongoDB
net start MongoDB
```

### Step 3: Verify Setup

Test the connection with credentials:
```bash
mongosh -u dealflow_admin -p dealflow_secure_password_2025
```

---

## Connection Strings

### With Authentication (Recommended)
```
mongodb://dealflow_admin:dealflow_secure_password_2025@localhost:27017
```

### Without Authentication (Development Only)
```
mongodb://localhost:27017
```

---

## Users and Credentials

| User | Password | Role | Purpose |
|------|----------|------|---------|
| `dealflow_admin` | `dealflow_secure_password_2025` | root | Administrative access |
| `dealflow_user` | `dealflow_app_password_2025` | readWrite | Application access |

---

## Environment Variables

Update `.env` file with:

```env
MONGODB_USER=dealflow_admin
MONGODB_PASSWORD=dealflow_secure_password_2025
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_URL=mongodb://dealflow_admin:dealflow_secure_password_2025@localhost:27017
DATABASE_NAME=dealflow
```

---

## Troubleshooting

### Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** 
- Check MongoDB is running: `mongosh`
- Restart MongoDB service
- Check port 27017 is not blocked

### Authentication Failed
```
Error: authentication failed
```
**Solution:**
- Verify username/password in .env
- Check user exists: `mongosh -u dealflow_admin -p dealflow_secure_password_2025`
- Recreate user if needed

### Permission Denied
```
Error: user is not authorized to perform this action
```
**Solution:**
- Use `dealflow_user` for app (readWrite role)
- Use `dealflow_admin` for admin tasks (root role)

---

## Security Best Practices

1. **Change Default Passwords**: Update credentials in production
2. **Use Network Restrictions**: Restrict MongoDB to specific IPs
3. **Enable Encryption**: Use TLS/SSL for connections
4. **Regular Backups**: Backup database regularly
5. **Update MongoDB**: Keep MongoDB updated to latest version

---

## Docker Commands

```bash
# View MongoDB logs
docker logs dealflow_mongodb

# Access MongoDB shell inside container
docker exec -it dealflow_mongodb mongosh -u dealflow_admin -p dealflow_secure_password_2025

# Stop MongoDB
docker-compose stop mongodb

# Remove MongoDB container (preserves data volume)
docker-compose down

# Remove MongoDB and all data
docker-compose down -v
```

---

## Backend Configuration

The backend automatically uses authentication credentials from:
1. Environment variables (.env file)
2. System environment variables
3. Default values in config.py

Connection is handled by `AsyncIOMotorClient` which supports authentication in the connection string.

---

## Verification Checklist

- [ ] MongoDB is running
- [ ] Admin user created
- [ ] .env file configured
- [ ] Backend connects successfully
- [ ] API endpoints respond
- [ ] Database contains seed data

Run the verification:
```bash
curl http://localhost:8000/api/v1/startups
```

Expected response: JSON array of startups
