# DUY-DOE FILM Deployment Guide

## 🚀 Quick Deployment

### Prerequisites
- Node.js 16+ 
- npm 8+
- Git
- Firebase CLI

### One-Click Deployment
```powershell
# Deploy to production
.\deploy.ps1

# Deploy with custom message
.\deploy.ps1 -CustomMessage "Added new movie feature"

# Skip tests (faster)
.\deploy.ps1 -SkipTests

# Force deploy even with errors
.\deploy.ps1 -Force
```

## 📋 Deployment Options

### Environment Selection
```powershell
# Production (default)
.\deploy.ps1 -Environment production

# Development
.\deploy.ps1 -Environment development

# Staging
.\deploy.ps1 -Environment staging
```

### Advanced Options
```powershell
# Skip build optimization
.\deploy.ps1 -SkipBuild

# Skip tests
.\deploy.ps1 -SkipTests

# Force deployment
.\deploy.ps1 -Force

# Combined options
.\deploy.ps1 -SkipTests -SkipBuild -CustomMessage "Hotfix deployment"
```

## 🔧 Manual Deployment Steps

If the script fails, you can deploy manually:

### 1. Install Dependencies
```bash
npm install
npm install -g firebase-tools
```

### 2. Test Locally
```bash
npm run dev
# Open http://localhost:5000
```

### 3. Deploy to Firebase
```bash
# Login to Firebase
firebase login

# Set project
firebase use duydodeesport

# Deploy
firebase deploy
```

## 📊 Deployment Features

### Automated Checks
- ✅ Node.js version validation
- ✅ npm availability check
- ✅ Firebase CLI installation
- ✅ Project structure validation
- ✅ Local server testing
- ✅ Firebase connection testing

### Build Optimization
- ✅ CSS minification (if cleancss available)
- ✅ JavaScript minification (if terser available)
- ✅ Asset optimization
- ✅ Bundle size reduction

### Post-Deployment
- ✅ Production URL testing
- ✅ Firebase Console link
- ✅ Automatic browser opening
- ✅ Deployment report generation

## 🛠️ Troubleshooting

### Common Issues

#### Firebase Login Issues
```bash
# Logout and login again
firebase logout
firebase login

# Check current login
firebase login --list
```

#### Port 5000 Already in Use
```bash
# Kill processes using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use different port
firebase serve --only hosting --port 5001
```

#### Deployment Permissions
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Node.js Version Issues
```bash
# Check Node.js version
node --version

# Install correct version (using nvm-windows)
nvm install 18
nvm use 18
```

### Error Messages

#### "Firebase project not found"
```bash
# List available projects
firebase projects:list

# Use correct project
firebase use duydodeesport
```

#### "Build failed"
```bash
# Check for syntax errors
npm run lint

# Clean and rebuild
npm run clean:deps
npm install
```

#### "Deployment timeout"
```bash
# Try again with increased timeout
firebase deploy --timeout 300000
```

## 📁 Project Structure

```
d:\DEV\
├── deploy.ps1              # Main deployment script
├── firebase.json           # Firebase configuration
├── package.json            # Node.js dependencies
├── firestore.rules         # Firestore security rules
├── public/                 # Static files
│   ├── index.html          # Homepage
│   ├── watch.html          # Movie player
│   ├── add-movie.html      # Add movie form
│   └── assets/             # CSS, JS, images
└── deployment-reports/     # Generated deployment reports
```

## 🔐 Security Considerations

### Firebase Rules
- Admin-only movie creation/deletion
- User-specific favorites/watchlist
- Public read access for movies
- Secure authentication

### Environment Variables
- Firebase API keys are handled securely
- No sensitive data in client-side code
- Environment-specific configurations

## 📈 Monitoring

### Firebase Console
- [Hosting Dashboard](https://console.firebase.google.com/project/duydodeesport/hosting)
- [Firestore Database](https://console.firebase.google.com/project/duydodeesport/firestore)
- [Usage Analytics](https://console.firebase.google.com/project/duydodeesport/usage)

### Performance Monitoring
- Page load times
- Bundle size analysis
- Error tracking
- User engagement metrics

## 🔄 CI/CD Integration

### GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Firebase
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm install -g firebase-tools
      - run: firebase deploy --token ${{ secrets.FIREBASE_TOKEN }}
```

## 📞 Support

### Documentation
- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [PowerShell Scripting Guide](https://docs.microsoft.com/en-us/powershell/)

### Contact
- Firebase Console: https://console.firebase.google.com/project/duydodeesport
- Production URL: https://duydodeesport.web.app
- Admin Email: duyclassic191@gmail.com

---

## 🎉 Quick Start Summary

1. **Install**: `npm install -g firebase-tools`
2. **Login**: `firebase login`
3. **Deploy**: `.\deploy.ps1`
4. **Visit**: https://duydodeesport.web.app

That's it! Your DUY-DOE FILM website is now live! 🎬✨
