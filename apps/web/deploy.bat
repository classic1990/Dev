@echo off
echo 🚀 Starting deployment process...

echo 📦 Building the project...
npm run build

if %ERRORLEVEL% EQU 0 (
    echo ✅ Build successful!
    
    echo 🌐 Deploying to Vercel...
    npx vercel --prod
    
    echo 🎉 Deployment completed!
    echo 🔗 Live at: https://web-duydode-th.vercel.app
) else (
    echo ❌ Build failed!
    exit /b 1
)
