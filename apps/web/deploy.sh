#!/bin/bash

echo "🚀 Starting deployment process..."

# Build the project
echo "📦 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to Vercel
    echo "🌐 Deploying to Vercel..."
    npx vercel --prod
    
    echo "🎉 Deployment completed!"
    echo "🔗 Live at: https://web-duydode-th.vercel.app"
else
    echo "❌ Build failed!"
    exit 1
fi
