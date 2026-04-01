#!/bin/bash
# Database Connection Quick Fix Script
# สำหรับแก้ไขปัญหา database connection

echo "🔍 Database Connection Quick Fix Script"
echo "=================================="

# Check if service account key exists
if [ ! -f "backend/service-account-key.json" ]; then
    echo "❌ Service account key not found!"
    echo "📝 Please follow these steps:"
    echo "1. Go to Firebase Console: https://console.firebase.google.com/"
    echo "2. Select project 'duydodeesport'"
    echo "3. Go to Project Settings > Service accounts"
    echo "4. Click 'Generate new private key'"
    echo "5. Download JSON file"
    echo "6. Save as 'backend/service-account-key.json'"
    exit 1
fi

echo "✅ Service account key found"

# Check service account key format
if ! grep -q "private_key" backend/service-account-key.json; then
    echo "❌ Invalid service account key format!"
    echo "📝 Please download a new service account key from Firebase Console"
    exit 1
fi

echo "✅ Service account key format looks good"

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "❌ .env file not found!"
    echo "📝 Creating default .env file..."
    cat > backend/.env << 'EOF'
# Firebase Admin Configuration - Development
FIREBASE_PROJECT_ID=duydodeesport
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-[ID]@duydodeesport.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[YOUR_PRIVATE_KEY_HERE]\n-----END PRIVATE KEY-----\n"

# Server Configuration
PORT=3000
NODE_ENV=development
EOF
    echo "✅ .env file created"
    echo "⚠️ Please update FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY"
    exit 1
fi

echo "✅ .env file found"

# Extract service account info
PROJECT_ID=$(grep -o '"project_id": "[^"]*"' backend/service-account-key.json | cut -d'"' -f4)
CLIENT_EMAIL=$(grep -o '"client_email": "[^"]*"' backend/service-account-key.json | cut -d'"' -f4)

echo "📊 Service Account Info:"
echo "  Project ID: $PROJECT_ID"
echo "  Client Email: $CLIENT_EMAIL"

# Update .env file with correct values
echo "🔧 Updating .env file..."
sed -i.bak "s/FIREBASE_PROJECT_ID=.*/FIREBASE_PROJECT_ID=$PROJECT_ID/" backend/.env
sed -i.bak "s/FIREBASE_CLIENT_EMAIL=.*/FIREBASE_CLIENT_EMAIL=$CLIENT_EMAIL/" backend/.env

# Extract private key and format for .env
PRIVATE_KEY=$(grep -A 1 '"private_key":' backend/service-account-key.json | tail -1 | sed 's/^[[:space:]]*"//' | sed 's/"[[:space:]]*$//' | sed 's/\\n/\\\\n/g')
sed -i.bak "s/FIREBASE_PRIVATE_KEY=.*/FIREBASE_PRIVATE_KEY=\"$PRIVATE_KEY\"/" backend/.env

echo "✅ .env file updated"

# Install dependencies
echo "📦 Installing dependencies..."
cd backend && npm install

# Test connection
echo "🔍 Testing database connection..."
node database-test.js

echo "🎉 Quick fix completed!"
echo "📋 If tests still fail, please:"
echo "1. Check Firebase Console for project settings"
echo "2. Verify service account permissions"
echo "3. Check network connectivity"
echo "4. Review error logs above"
