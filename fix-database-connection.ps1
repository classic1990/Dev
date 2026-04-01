# Database Connection Quick Fix Script (PowerShell)
# สำหรับแก้ไขปัญหา database connection

Write-Host "🔍 Database Connection Quick Fix Script" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Check if service account key exists
if (-not (Test-Path "backend/service-account-key.json")) {
    Write-Host "❌ Service account key not found!" -ForegroundColor Red
    Write-Host "📝 Please follow these steps:" -ForegroundColor Yellow
    Write-Host "1. Go to Firebase Console: https://console.firebase.google.com/" -ForegroundColor White
    Write-Host "2. Select project 'duydodeesport'" -ForegroundColor White
    Write-Host "3. Go to Project Settings > Service accounts" -ForegroundColor White
    Write-Host "4. Click 'Generate new private key'" -ForegroundColor White
    Write-Host "5. Download JSON file" -ForegroundColor White
    Write-Host "6. Save as 'backend/service-account-key.json'" -ForegroundColor White
    exit 1
}

Write-Host "✅ Service account key found" -ForegroundColor Green

# Check service account key format
$keyContent = Get-Content "backend/service-account-key.json" -Raw
if (-not ($keyContent -match "private_key")) {
    Write-Host "❌ Invalid service account key format!" -ForegroundColor Red
    Write-Host "📝 Please download a new service account key from Firebase Console" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Service account key format looks good" -ForegroundColor Green

# Check if .env file exists
if (-not (Test-Path "backend/.env")) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "📝 Creating default .env file..." -ForegroundColor Yellow
    
    $envContent = @"
# Firebase Admin Configuration - Development
FIREBASE_PROJECT_ID=duydodeesport
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-[ID]@duydodeesport.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[YOUR_PRIVATE_KEY_HERE]\n-----END PRIVATE KEY-----\n"

# Server Configuration
PORT=3000
NODE_ENV=development
"@
    
    $envContent | Out-File -FilePath "backend/.env" -Encoding UTF8
    Write-Host "✅ .env file created" -ForegroundColor Green
    Write-Host "⚠️ Please update FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ .env file found" -ForegroundColor Green

# Extract service account info
$keyData = Get-Content "backend/service-account-key.json" | ConvertFrom-Json
$projectId = $keyData.project_id
$clientEmail = $keyData.client_email

Write-Host "📊 Service Account Info:" -ForegroundColor Cyan
Write-Host "  Project ID: $projectId" -ForegroundColor White
Write-Host "  Client Email: $clientEmail" -ForegroundColor White

# Update .env file with correct values
Write-Host "🔧 Updating .env file..." -ForegroundColor Yellow
$envContent = Get-Content "backend/.env"
$envContent = $envContent -replace "FIREBASE_PROJECT_ID=.*", "FIREBASE_PROJECT_ID=$projectId"
$envContent = $envContent -replace "FIREBASE_CLIENT_EMAIL=.*", "FIREBASE_CLIENT_EMAIL=$clientEmail"

# Extract private key and format for .env
$privateKey = $keyData.private_key -replace "`n", "\\n"
$envContent = $envContent -replace "FIREBASE_PRIVATE_KEY=.*", "FIREBASE_PRIVATE_KEY=`"$privateKey`""

$envContent | Out-File -FilePath "backend/.env" -Encoding UTF8
Write-Host "✅ .env file updated" -ForegroundColor Green

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install

# Test connection
Write-Host "🔍 Testing database connection..." -ForegroundColor Yellow
node database-test.js

Write-Host "🎉 Quick fix completed!" -ForegroundColor Green
Write-Host "📋 If tests still fail, please:" -ForegroundColor Cyan
Write-Host "1. Check Firebase Console for project settings" -ForegroundColor White
Write-Host "2. Verify service account permissions" -ForegroundColor White
Write-Host "3. Check network connectivity" -ForegroundColor White
Write-Host "4. Review error logs above" -ForegroundColor White
