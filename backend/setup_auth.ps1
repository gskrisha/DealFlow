#!/bin/bash
# MongoDB Authentication Setup - Windows PowerShell Script

Write-Host "🚀 DealFlow MongoDB Setup Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is installed
$mongoInstalled = $false
$mongoPaths = @(
    "C:\Program Files\MongoDB\Server\7.0\bin\mongosh.exe",
    "C:\Program Files\MongoDB\Server\6.0\bin\mongosh.exe",
    "C:\Program Files\MongoDB\Server\5.0\bin\mongo.exe"
)

foreach ($path in $mongoPaths) {
    if (Test-Path $path) {
        Write-Host "✅ MongoDB found at: $path" -ForegroundColor Green
        $mongoInstalled = $true
        break
    }
}

if (-not $mongoInstalled) {
    Write-Host ""
    Write-Host "❌ MongoDB is not installed or mongosh not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 Installation Options:" -ForegroundColor Yellow
    Write-Host "  1. Download MongoDB Community: https://www.mongodb.com/try/download/community"
    Write-Host "  2. Use Docker: docker-compose up -d mongodb"
    Write-Host "  3. Use Homebrew (macOS): brew install mongodb-community"
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "🔐 Setting up MongoDB Authentication..." -ForegroundColor Cyan
Write-Host ""

# Create admin user
Write-Host "📝 Creating admin user (dealflow_admin)..." -ForegroundColor Yellow

$adminScript = @"
use admin
db.dropUser("dealflow_admin")
db.createUser({
    user: "dealflow_admin",
    pwd: "dealflow_secure_password_2025",
    roles: ["root"]
})
"@

try {
    $output = mongosh --eval $adminScript 2>&1
    if ($output -like "*User added*" -or $output -like "*successfully*") {
        Write-Host "✅ Admin user created successfully" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Output: $output" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error creating admin user: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 MongoDB Credentials:" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host "Admin User:"
Write-Host "  Username: dealflow_admin"
Write-Host "  Password: dealflow_secure_password_2025"
Write-Host ""
Write-Host "Connection String:"
Write-Host "  mongodb://dealflow_admin:dealflow_secure_password_2025@localhost:27017"
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""

Write-Host "✨ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📌 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Update .env with MongoDB credentials"
Write-Host "  2. Start backend: python main.py"
Write-Host "  3. Verify connection: curl http://localhost:8000/api/v1/startups"
Write-Host ""
