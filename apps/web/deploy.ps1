# คำสั่ง PowerShell สำหรับ Deploy
# ใช้: .\deploy.ps1

Write-Host "🚀 Starting deployment process..." -ForegroundColor Green

Write-Host "📦 Building project..." -ForegroundColor Yellow
$buildResult = npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    
    Write-Host "🌐 Deploying to Vercel..." -ForegroundColor Yellow
    npx vercel --prod
    
    Write-Host "🎉 Deployment completed!" -ForegroundColor Green
    Write-Host "🔗 Live at: https://web-duydode-th.vercel.app" -ForegroundColor Cyan
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}
