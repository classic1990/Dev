<#
.SYNOPSIS
    DUY-DOE FILM Deployment Script
    Automates Firebase deployment with pre-deployment checks

.DESCRIPTION
    This script handles the complete deployment process for DUY-DOE FILM website:
    - Pre-deployment validation
    - Firebase authentication check
    - Build optimization
    - Deployment to Firebase Hosting
    - Post-deployment verification

.AUTHOR
    DUY-DOE FILM Team

.VERSION
    1.2.0

.EXAMPLE
    .\deploy.ps1
    .\deploy.ps1 -SkipTests
    .\deploy.ps1 -Environment production
#>

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("development", "staging", "production")]
    [string]$Environment = "production",
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipTests,
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipBuild,
    
    [Parameter(Mandatory=$false)]
    [switch]$Force,
    
    [Parameter(Mandatory=$false)]
    [string]$CustomMessage
)

# Script Configuration
$ErrorActionPreference = "Stop"
$ProgressPreference = "Continue"

# Colors for output
$Colors = @{
    Red = "Red"
    Green = "Green"
    Yellow = "Yellow"
    Blue = "Blue"
    Cyan = "Cyan"
    Magenta = "Magenta"
    White = "White"
}

# Project Information
$ProjectInfo = @{
    Name = "DUY-DOE FILM"
    Description = "Movie Streaming Platform"
    FirebaseProject = "duydodeesport"
    LocalPort = 5000
    ProductionUrl = "https://duydodeesport.web.app"
}

# Write-ColorOutput function
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Colors[$Color]
}

# Write-Section function
function Write-Section {
    param([string]$Title)
    Write-ColorOutput "`n=== $Title ===" "Cyan"
}

# Write-Step function
function Write-Step {
    param([string]$Message)
    Write-ColorOutput "→ $Message" "Yellow"
}

# Write-Success function
function Write-Success {
    param([string]$Message)
    Write-ColorOutput "✓ $Message" "Green"
}

# Write-Error function
function Write-Error-Message {
    param([string]$Message)
    Write-ColorOutput "✗ $Message" "Red"
}

# Write-Info function
function Write-Info {
    param([string]$Message)
    Write-ColorOutput "ℹ $Message" "Blue"
}

# Check if running as Administrator
function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Check prerequisites
function Test-Prerequisites {
    Write-Section "CHECKING PREREQUISITES"
    
    # Check Node.js
    Write-Step "Checking Node.js..."
    try {
        $nodeVersion = node --version
        Write-Success "Node.js found: $nodeVersion"
    }
    catch {
        Write-Error-Message "Node.js not found. Please install Node.js first."
        exit 1
    }
    
    # Check npm
    Write-Step "Checking npm..."
    try {
        $npmVersion = npm --version
        Write-Success "npm found: $npmVersion"
    }
    catch {
        Write-Error-Message "npm not found. Please install npm first."
        exit 1
    }
    
    # Check Firebase CLI
    Write-Step "Checking Firebase CLI..."
    try {
        $firebaseVersion = firebase --version
        Write-Success "Firebase CLI found: $firebaseVersion"
    }
    catch {
        Write-Info "Firebase CLI not found. Installing..."
        npm install -g firebase-tools
        Write-Success "Firebase CLI installed successfully"
    }
    
    # Check Git
    Write-Step "Checking Git..."
    try {
        $gitVersion = git --version
        Write-Success "Git found: $gitVersion"
    }
    catch {
        Write-Error-Message "Git not found. Please install Git first."
        exit 1
    }
}

# Validate project structure
function Test-ProjectStructure {
    Write-Section "VALIDATING PROJECT STRUCTURE"
    
    $requiredFiles = @(
        "firebase.json",
        "package.json",
        "firestore.rules",
        "public/index.html",
        "public/watch.html",
        "public/assets/css/style-unified.css",
        "public/assets/js/main.js",
        "public/assets/js/watch-enhanced.js",
        "public/assets/js/core/firebase-config.js"
    )
    
    foreach ($file in $requiredFiles) {
        Write-Step "Checking $file..."
        if (Test-Path $file) {
            Write-Success "Found: $file"
        } else {
            Write-Error-Message "Missing: $file"
            if (-not $Force) {
                exit 1
            }
        }
    }
}

# Run tests
function Invoke-Tests {
    if ($SkipTests) {
        Write-Info "Skipping tests as requested"
        return
    }
    
    Write-Section "RUNNING TESTS"
    
    # Test local server
    Write-Step "Testing local server..."
    try {
        # Start local server in background
        $serverJob = Start-Job -ScriptBlock {
            Set-Location $using:PWD
            npm run dev
        }
        
        # Wait for server to start
        Start-Sleep -Seconds 5
        
        # Test if server is responding
        $response = Invoke-WebRequest -Uri "http://localhost:5000" -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Success "Local server is running correctly"
        } else {
            throw "Local server returned status code: $($response.StatusCode)"
        }
        
        # Stop server
        Stop-Job $serverJob
        Remove-Job $serverJob
    }
    catch {
        Write-Error-Message "Local server test failed: $($_.Exception.Message)"
        if (-not $Force) {
            exit 1
        }
    }
    
    # Test Firebase connection
    Write-Step "Testing Firebase connection..."
    try {
        $projects = firebase projects:list
        if ($projects -match $ProjectInfo.FirebaseProject) {
            Write-Success "Firebase project connection successful"
        } else {
            throw "Firebase project '$($ProjectInfo.FirebaseProject)' not found"
        }
    }
    catch {
        Write-Error-Message "Firebase connection test failed: $($_.Exception.Message)"
        if (-not $Force) {
            exit 1
        }
    }
}

# Optimize build
function Invoke-BuildOptimization {
    if ($SkipBuild) {
        Write-Info "Skipping build optimization as requested"
        return
    }
    
    Write-Section "OPTIMIZING BUILD"
    
    # Clean previous build
    Write-Step "Cleaning previous build..."
    if (Test-Path "dist") {
        Remove-Item -Recurse -Force "dist"
    }
    Write-Success "Build cleaned"
    
    # Optimize CSS
    Write-Step "Optimizing CSS..."
    try {
        if (Get-Command cleancss -ErrorAction SilentlyContinue) {
            cleancss --output dist/style.min.css public/assets/css/style-unified.css
            Write-Success "CSS optimized"
        } else {
            Write-Info "cleancss not found, skipping CSS optimization"
        }
    }
    catch {
        Write-Info "CSS optimization failed, continuing..."
    }
    
    # Optimize JavaScript
    Write-Step "Optimizing JavaScript..."
    try {
        if (Get-Command terser -ErrorAction SilentlyContinue) {
            $jsFiles = @(
                "public/assets/js/main.js",
                "public/assets/js/watch-enhanced.js",
                "public/assets/js/add-movie.js"
            )
            
            foreach ($file in $jsFiles) {
                if (Test-Path $file) {
                    $outputFile = "dist/" + (Split-Path $file -Leaf)
                    terser $file --output $outputFile --compress --mangle
                    Write-Success "Optimized: $(Split-Path $file -Leaf)"
                }
            }
        } else {
            Write-Info "terser not found, skipping JavaScript optimization"
        }
    }
    catch {
        Write-Info "JavaScript optimization failed, continuing..."
    }
    
    # Update firebase.json for optimized files if they exist
    if (Test-Path "dist") {
        Write-Info "Optimized files created in dist/ folder"
    }
}

# Deploy to Firebase
function Invoke-FirebaseDeployment {
    Write-Section "DEPLOYING TO FIREBASE"
    
    # Check Firebase authentication
    Write-Step "Checking Firebase authentication..."
    try {
        $loginStatus = firebase login --list
        if ($loginStatus -match "No current user") {
            Write-Info "Not logged in. Initiating login..."
            firebase login
        } else {
            Write-Success "Already logged in to Firebase"
        }
    }
    catch {
        Write-Error-Message "Firebase authentication check failed"
        exit 1
    }
    
    # Set correct project
    Write-Step "Setting Firebase project..."
    try {
        firebase use $ProjectInfo.FirebaseProject
        Write-Success "Project set to: $($ProjectInfo.FirebaseProject)"
    }
    catch {
        Write-Error-Message "Failed to set Firebase project"
        exit 1
    }
    
    # Deploy
    Write-Step "Deploying to Firebase Hosting..."
    try {
        $deployArgs = @("deploy")
        if ($Environment -eq "development") {
            $deployArgs += "--only", "hosting:duydodeesport"
        }
        
        $deployResult = firebase deploy $deployArgs
        Write-Success "Deployment completed successfully"
        
        # Extract deployment URL
        if ($deployResult -match "Hosting URL: (.+)") {
            $deployUrl = $matches[1].Trim()
            Write-Success "Website deployed to: $deployUrl"
        }
    }
    catch {
        Write-Error-Message "Deployment failed: $($_.Exception.Message)"
        exit 1
    }
}

# Post-deployment verification
function Invoke-PostDeployment {
    Write-Section "POST-DEPLOYMENT VERIFICATION"
    
    # Wait for deployment to propagate
    Write-Step "Waiting for deployment to propagate..."
    Start-Sleep -Seconds 10
    
    # Test production URL
    Write-Step "Testing production URL..."
    try {
        $response = Invoke-WebRequest -Uri $ProjectInfo.ProductionUrl -TimeoutSec 30
        if ($response.StatusCode -eq 200) {
            Write-Success "Production URL is accessible: $($ProjectInfo.ProductionUrl)"
        } else {
            throw "Production URL returned status code: $($response.StatusCode)"
        }
    }
    catch {
        Write-Error-Message "Production URL test failed: $($_.Exception.Message)"
        Write-Info "This might be normal if DNS hasn't propagated yet"
    }
    
    # Check Firebase console
    Write-Step "Opening Firebase Console..."
    Start-Process "https://console.firebase.google.com/project/$($ProjectInfo.FirebaseProject)/hosting"
    
    # Open website
    Write-Step "Opening deployed website..."
    Start-Process $ProjectInfo.ProductionUrl
}

# Generate deployment report
function New-DeploymentReport {
    $report = @"
===============================================
DUY-DOE FILM DEPLOYMENT REPORT
===============================================
Deployment Date: $(Get-Date)
Environment: $Environment
Project: $($ProjectInfo.Name)
Firebase Project: $($ProjectInfo.FirebaseProject)
Production URL: $($ProjectInfo.ProductionUrl)
Local Port: $($ProjectInfo.LocalPort)

Files Deployed:
$(Get-ChildItem -Path "public" -Recurse -File | ForEach-Object { "  - $($_.FullName.Replace('public\', '/'))" })

Deployment Status: SUCCESS
$($CustomMessage ? "Custom Message: $CustomMessage" : "")
===============================================
"@
    
    $reportFile = "deployment-report-$(Get-Date -Format 'yyyyMMdd-HHmmss').txt"
    $report | Out-File -FilePath $reportFile -Encoding UTF8
    Write-Success "Deployment report saved to: $reportFile"
}

# Main execution
function Main {
    try {
        Write-ColorOutput "`n🎬 DUY-DOE FILM Deployment Script 🎬" "Magenta"
        Write-ColorOutput "========================================" "Magenta"
        
        Write-Info "Environment: $Environment"
        Write-Info "Project: $($ProjectInfo.Name)"
        Write-Info "Firebase Project: $($ProjectInfo.FirebaseProject)"
        
        if ($CustomMessage) {
            Write-Info "Message: $CustomMessage"
        }
        
        # Run deployment steps
        Test-Prerequisites
        Test-ProjectStructure
        Invoke-Tests
        Invoke-BuildOptimization
        Invoke-FirebaseDeployment
        Invoke-PostDeployment
        New-DeploymentReport
        
        Write-Section "DEPLOYMENT COMPLETED"
        Write-Success "🎉 Deployment completed successfully!"
        Write-Info "Website is now live at: $($ProjectInfo.ProductionUrl)"
        Write-Info "Firebase Console: https://console.firebase.google.com/project/$($ProjectInfo.FirebaseProject)"
        
    }
    catch {
        Write-Section "DEPLOYMENT FAILED"
        Write-Error-Message "Deployment failed: $($_.Exception.Message)"
        Write-Info "Check the error messages above and try again."
        exit 1
    }
}

# Execute main function
Main
