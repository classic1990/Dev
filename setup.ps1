<#
.SYNOPSIS
    DUY-DOE FILM Setup Script
    Prepares environment for deployment

.DESCRIPTION
    This script sets up the development environment for DUY-DOE FILM:
    - Sets PowerShell execution policy
    - Installs required tools
    - Configures Git repository
    - Validates setup

.AUTHOR
    DUY-DOE FILM Team

.VERSION
    1.0.0
#>

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

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Colors[$Color]
}

function Write-Section {
    param([string]$Title)
    Write-ColorOutput "`n=== $Title ===" "Cyan"
}

function Write-Step {
    param([string]$Message)
    Write-ColorOutput "→ $Message" "Yellow"
}

function Write-Success {
    param([string]$Message)
    Write-ColorOutput "✓ $Message" "Green"
}

function Write-Error-Message {
    param([string]$Message)
    Write-ColorOutput "✗ $Message" "Red"
}

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

# Main setup function
function Main {
    Write-ColorOutput "`n🔧 DUY-DOE FILM Setup Script 🔧" "Magenta"
    Write-ColorOutput "================================" "Magenta"
    
    try {
        # Check Administrator privileges
        if (-not (Test-Administrator)) {
            Write-Step "Requesting Administrator privileges..."
            Start-Process powershell -Verb RunAs "-File `"$PSCommandPath`""
            exit
        }
        
        Write-Section "SETTING UP POWERSHELL ENVIRONMENT"
        
        # Set execution policy
        Write-Step "Setting PowerShell execution policy..."
        Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
        Write-Success "Execution policy set to RemoteSigned"
        
        # Enable script execution
        Write-Step "Enabling script execution..."
        $policy = Get-ExecutionPolicy -Scope CurrentUser
        Write-Success "Current execution policy: $policy"
        
        Write-Section "INSTALLING REQUIRED TOOLS"
        
        # Install Chocolatey (if not present)
        Write-Step "Checking Chocolatey..."
        if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
            Write-Info "Installing Chocolatey..."
            Set-ExecutionPolicy Bypass -Scope Process -Force
            [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
            iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
            Write-Success "Chocolatey installed"
        } else {
            Write-Success "Chocolatey already installed"
        }
        
        # Install Node.js
        Write-Step "Installing Node.js..."
        choco install nodejs -y --force
        Write-Success "Node.js installed"
        
        # Install Git
        Write-Step "Installing Git..."
        choco install git -y --force
        Write-Success "Git installed"
        
        # Refresh environment variables
        Write-Step "Refreshing environment variables..."
        $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")
        Write-Success "Environment variables refreshed"
        
        # Install Firebase CLI
        Write-Step "Installing Firebase CLI..."
        npm install -g firebase-tools
        Write-Success "Firebase CLI installed"
        
        # Install build tools
        Write-Step "Installing build optimization tools..."
        npm install -g cleancss-cli terser
        Write-Success "Build tools installed"
        
        Write-Section "VALIDATING INSTALLATION"
        
        # Test installations
        Write-Step "Testing Node.js..."
        $nodeVersion = node --version
        Write-Success "Node.js: $nodeVersion"
        
        Write-Step "Testing npm..."
        $npmVersion = npm --version
        Write-Success "npm: $npmVersion"
        
        Write-Step "Testing Git..."
        $gitVersion = git --version
        Write-Success "Git: $gitVersion"
        
        Write-Step "Testing Firebase CLI..."
        $firebaseVersion = firebase --version
        Write-Success "Firebase CLI: $firebaseVersion"
        
        Write-Section "CONFIGURING PROJECT"
        
        # Install project dependencies
        Write-Step "Installing project dependencies..."
        Set-Location $PSScriptRoot
        npm install
        Write-Success "Dependencies installed"
        
        # Initialize Git repository (if not already)
        Write-Step "Checking Git repository..."
        if (-not (Test-Path ".git")) {
            git init
            git add .
            git commit -m "Initial commit - DUY-DOE FILM setup"
            Write-Success "Git repository initialized"
        } else {
            Write-Success "Git repository already exists"
        }
        
        # Login to Firebase
        Write-Step "Firebase login required..."
        Write-Info "Please login to Firebase when prompted..."
        firebase login
        
        Write-Section "SETUP COMPLETED"
        Write-Success "🎉 Setup completed successfully!"
        Write-Info "You can now deploy the website using:"
        Write-Info "  .\deploy.ps1"
        Write-Info "Or run locally:"
        Write-Info "  npm run dev"
        
        # Open deployment guide
        Write-Step "Opening deployment guide..."
        Start-Process "DEPLOYMENT.md"
        
    }
    catch {
        Write-Section "SETUP FAILED"
        Write-Error-Message "Setup failed: $($_.Exception.Message)"
        Write-Info "Please check the error messages above and try again."
        exit 1
    }
}

# Execute main function
Main
