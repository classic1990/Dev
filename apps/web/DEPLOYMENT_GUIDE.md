# คู่มือการ Deploy เว็บไซต์ DuyKan Movie Platform

## 📋 บทนำ

คู่มือนี้จะแสดงขั้นตอนการ Deploy เว็บไซต์ไปยัง Production Server ด้วย Vercel และ Firebase Hosting

## 🛠️ สิ่งที่ต้องเตรียม

1. **บัญชี Vercel** (<https://vercel.com>)
2. **บัญชี Firebase** (<https://firebase.google.com>)
3. **โปรเจคที่พร้อม Deploy**
4. **Environment Variables** สำหรับ Production

## 🚀 วิธีที่ 1: Deploy ด้วย Vercel (แนะนำ)

### ขั้นตอนที่ 1: ติดตั้ง Vercel CLI

```bash
# ติดตั้ง Vercel CLI แบบ global
npm install -g vercel

# หรือใช้ npx ถ้าไม่ต้องการติดตั้ง
npx vercel
```

### ขั้นตอนที่ 2: เข้าสู่โฟลเดอร์โปรเจค

```bash
cd "C:\Users\รัชชานนท์\Desktop\duykan\apps\web"
```

### ขั้นตอนที่ 3: Build โปรเจค

```bash
npm run build
```

### ขั้นตอนที่ 4: Deploy ครั้งแรก

```bash
npx vercel
```

Vercel จะถามคำถามต่อไปนี้:

```
? Set up and deploy "~/Desktop/duykan/apps/web"? [y/N] y
? Which scope should contain your project? [เลือกบัญชีของคุณ]
? Link to existing project? [y/N] n
? What's your project's name? web
? In which directory is your code located? ./
> Auto-detected Project Settings for Vite
? Want to modify these settings? [y/N] n
? Do you want to change additional project settings? [y/N] n
```

### ขั้นตอนที่ 5: Deploy ไป Production

```bash
# Deploy ไป Production (จะทับซ้อนเวอร์ชันเดิม)
npx vercel --prod
```

### ขั้นตอนที่ 6: ตั้งค่า Environment Variables

1. เข้าไปที่ Vercel Dashboard: <https://vercel.com/duydode-th/web/settings>
2. ไปที่ "Environment Variables"
3. เพิ่มตัวแปรต่อไปนี้:

```
VITE_FIREBASE_API_KEY=AIzaSyBuhTA1YwcsNyxR0NLYW6JrxUQ9U7vyVeo
VITE_FIREBASE_AUTH_DOMAIN=classic-e8ab7.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=classic-e8ab7
VITE_FIREBASE_STORAGE_BUCKET=classic-e8ab7.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=596308927760
VITE_FIREBASE_APP_ID=1:596308927760:web:63043fd2786459082cb195
VITE_POCKETBASE_URL=https://your-production-pocketbase-url.com
VITE_API_URL=https://your-production-api-url.com/api
```

---

## 🔥 วิธีที่ 2: Deploy ด้วย Firebase Hosting

### ขั้นตอนที่ 1: ติดตั้ง Firebase CLI

```bash
npm install -g firebase-tools
```

### ขั้นตอนที่ 2: Login บัญชี Firebase

```bash
firebase login
```

### ขั้นตอนที่ 3: สร้างไฟล์ firebase.json

สร้างไฟล์ `firebase.json` ในโฟลเดอร์ root:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### ขั้นตอนที่ 4: Build โปรเจค

```bash
npm run build
```

### ขั้นตอนที่ 5: Deploy

```bash
# Deploy ไป Firebase
firebase deploy --only hosting -project classic-e8ab7

# หรือ deploy ไป Production
firebase deploy --only hosting -project classic-e8ab7
```

---

## 🔄 การ Deploy อัตโนมัติ (CI/CD)

### การตั้งค่า GitHub กับ Vercel

1. **Push โค้ดไป GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/duykan-web.git
git push -u origin main
```

1. **เชื่อมต่อ GitHub กับ Vercel**

- เข้า Vercel Dashboard
- คลิก "Add New" → "Project"
- เลือก "Import Git Repository"
- เลือก repository ของคุณ
- Vercel จะ Deploy อัตโนมัติทุกครั้งที่ push ไป main branch

## 📝 Script สำหรับการ Deploy

### สำหรับ macOS/Linux

สร้างไฟล์ `deploy.sh`:

```bash
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
```

ใช้งาน:

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 🛠️ การแก้ไขปัญหาที่พบบ่อย

### ปัญหา 1: Build ไม่สำเร็จ

```bash
# ลบ node_modules และติดตั้งใหม่
rm -rf node_modules
npm install

# Build ใหม่
npm run build
```

### ปัญหา 2: Environment Variables ไม่ทำงาน

- ตรวจสอบว่าตัวแปรขึ้นต้นด้วย `VITE_`
- ตรวจสอบว่าตั้งค่าใน Vercel Dashboard แล้ว
- Restart deployment หลังจากเพิ่ม environment variables

### ปัญหา 3: Firebase Authentication ไม่ทำงาน

- ตรวจสอบว่า Firebase Config ถูกต้อง
- ตรวจสอบว่าเพิ่ม domain ใน Firebase Authentication settings
- ตรวจสอบว่า Email/Password authentication ถูกเปิดใช้งาน

---

## 📊 การตรวจสอบสถานะ

### ตรวจสอบ Deployment Status

```bash
# Vercel
npx vercel ls

# Firebase
firebase hosting:sites:list
```

### ตรวจสอบ Logs

```bash
# Vercel logs
npx vercel logs

# Firebase logs
firebase hosting:sites:default:logs
```

---

## 🎯 Best Practices

1. **ทดสอบใน Staging ก่อน Production**

   ```bash
   npx vercel  # Deploy ไป preview URL
   ```

2. **ใช้ Environment Variables อย่างถูกต้อง**
   - ไม่เก็บ secrets ใน code
   - ใช้คำนำหน้า `VITE_` สำหรับ frontend

3. **Monitor Performance**
   - ใช้ Vercel Analytics
   - ตรวจสอบ Core Web Vitals

4. **Security**
   - เปิดใช้ HTTPS
   - ตั้งค่า CSP headers
   - ตรวจสอบ dependencies บ่อยๆ

---

## 🆘 การขอความช่วยเหลือ

- **Vercel Docs**: <https://vercel.com/docs>
- **Firebase Docs**: <https://firebase.google.com/docs>
- **Community Forum**: <https://vercel.com/discord>

---

## 📞 ติดต่อ

หากมีปัญหาในการ Deploy สามารถติดต่อได้ที่:

- Email: <support@duykan.com>
- GitHub: <https://github.com/duydode-th/issues>

---

**🎉 ขอให้โชคดีกับการ Deploy!**
