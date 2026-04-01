# DUY-DOE FILM - Clean Version

## 🎬 รายละเอียดโปรเจค

DUY-DOE FILM เป็นแพลตฟอร์มสตรีมมิ่งหนังออนไลน์ 4K คุณภาพ พัฒนาด้วยเทคโนโลยีสุดมัน รองรับการใช้งานคล้าย Netflix และ Disney+

## 🚀 คุณสมบัติ

- ✅ **4K HDR** - คุณภาพวิดีโอสูงสุด
- ✅ **Dark Theme** - ธีมสีดำ Netflix-inspired
- ✅ **Responsive Design** - รองรับทุกอุปกรณ์
- ✅ **Firebase Backend** - ฐานข้อมูลและ Authentication
- ✅ **Admin Dashboard** - จัดการหนังง่ายๆ
- ✅ **PWA Ready** - ติดตั้งบนมือถือได้
- ✅ **SEO Optimized** - ค้นหาได้ง่าย

## 📁 โครงสร้างโปรเจค

```
v1.2.1-clean/
├── 📄 package.json              - Dependencies และ Scripts
├── 📄 firebase.json             - Firebase Hosting Config
├── 📄 .firebaserc                - Firebase Project Config
├── 📁 public/                   - Frontend Files
│   ├── 📄 index.html            - Main HTML Page
│   ├── 📁 assets/
│   │   ├── 📁 css/
│   │   │   └── 📄 style-unified.css - Complete CSS Framework
│   │   └── 📁 js/
│   │       ├── 📄 main.js         - Main Application Logic
│   │       ├── 📄 watch.js        - Video Player Page
│   │       └── 📁 core/
│   │           ├── 📄 constants.js   - App Constants
│   │           ├── 📄 utils.js        - Utility Functions
│   │           ├── 📄 error-handler.js - Error Management
│   │           └── 📄 firebase-config.js - Firebase Setup
├── 📁 backend/                  - Backend Server
│   ├── 📄 server.js              - Express Server
│   ├── 📄 package.json           - Backend Dependencies
│   ├── 📄 service-account-key.json - Firebase Service Account
│   └── 📄 .env                    - Environment Variables
├── 📁 scripts/                  - Utility Scripts
├── 📁 src/                      - Source Files (if needed)
└── 📄 README.md                 - This File
```

## 🛠️ การติดตั้ง

### **1. ติดตั้ง Dependencies**
```bash
npm install
```

### **2. ติดตั้ง Firebase Tools**
```bash
npm run install-global
```

### **3. ติดตั้ง Backend Dependencies**
```bash
cd backend
npm install
```

### **4. ตั้งค่า Environment**
```bash
# คัดลอก backend/.env.example เป็น backend/.env
# และใส่ค่าจริง Firebase ของคุณ
```

## 🚀 การใช้งาน

### **Development Mode**
```bash
npm run dev
```

### **Production Deploy**
```bash
npm run deploy
```

### **Local Backend**
```bash
cd backend
npm start
```

### **Linting**
```bash
npm run lint
npm run lint:fix
```

### **Security Check**
```bash
npm run security:check
```

## 🔧 การตั้งค่า

### **Firebase**
1. สร้างโปรเจคใน [Firebase Console](https://console.firebase.google.com/)
2. คัดลอก `service-account-key.json` ไว้ `backend/`
3. อัปเดต `backend/.env` ด้วยค่าจริงของคุณ

### **Environment Variables**
```env
# Firebase Admin Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Server Configuration
PORT=3000
NODE_ENV=development
```

## 📱 Features

### **Frontend**
- 🎨 **Modern UI** - Netflix-inspired dark theme
- 📱 **Responsive** - ทำงานบทุกอุปกรณ์
- 🔍 **Search** - ค้นหาหนังแบบ real-time
- 🎭 **Categories** - กรองตามหมวดหมู่
- ❤️ **Favorites** - บันทึกรายการโปรด
- 👤 **User Auth** - ล็อกอิน/เข้าสู่ระบบ
- 📺 **Video Player** - YouTube + HTML5 support
- 🔄 **Autoplay** - เล่นหนังถัดไปอัตโนมัติ

### **Backend**
- 🔐 **Firebase Admin** - Authentication และ Database
- 🛡️ **AppCheck** - Security verification
- 📊 **API Endpoints** - RESTful API
- 🎬 **Movie Management** - CRUD operations
- 👑 **Admin Panel** - จัดการหนังง่ายๆ
- 📝 **Logging** - Error tracking และ monitoring

## 🔐 Security

- ✅ **Firebase Authentication** - การยืนยันตัวตนที่ปลอดภัย
- ✅ **AppCheck** - ป้องกันการเข้าถึง API ผิดกฎหมาย
- ✅ **Input Validation** - ตรวจสอบข้อมูลที่ป้อนเข้ามา
- ✅ **XSS Protection** - ป้องกัน Cross-Site Scripting
- ✅ **CSRF Protection** - ป้องกัน Cross-Site Request Forgery

## 📊 Performance

- ⚡ **Lazy Loading** - โหลดเฉพาะเมื่อต้องการ
- 🗜️ **Code Splitting** - แยกโค้ดเพื่อ performance
- 📦 **Bundle Optimization** - บีบอัด CSS และ JavaScript
- 🎯 **Image Optimization** - ปรับแต่งรูปภาพ
- 💾 **Caching** - เก็บข้อมูลไว้ใน cache

## 🌐 SEO

- ✅ **Meta Tags** - Complete Open Graph และ Twitter Cards
- ✅ **Structured Data** - JSON-LD schema markup
- ✅ **Sitemap** - สร้าง sitemap อัตโนมัติ
- ✅ **Clean URLs** - SEO-friendly URL structure
- ✅ **Fast Loading** - Core Web Vitals optimization

## 📝 การพัฒนา

### **Code Style**
- 📝 **ESLint** - JavaScript linting
- 🎨 **Prettier** - Code formatting
- 📋 **TypeScript Ready** - พร้อมเปลี่ยนเป็น TypeScript

### **Git Workflow**
```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

### **Branch Strategy**
- `main` - Production code
- `develop` - Development code
- `feature/*` - Feature branches

## 🚨 การแก้ไขปัญหา

### **Common Issues**

**1. Firebase Connection Error**
```bash
# ตรวจสอบ service account key
ls backend/service-account-key.json

# ตรวจสอบ environment variables
cat backend/.env
```

**2. Backend Server Error**
```bash
cd backend
npm start
# ตรวจสอบ error logs
```

**3. Frontend Error**
```bash
npm run lint
npm run security:check
```

## 📞 ติดต่อ

- **Email:** support@duydoe-film.com
- **Website:** https://duydodeesport.web.app
- **GitHub:** https://github.com/duydoe/film

## 📜 License

MIT License - ดู [LICENSE](LICENSE) สำหรับรายละเอียดครบถ้วน

## 🙏 ขอบคุณ

- Firebase Team - สำหรับ hosting และ database services
- Font Awesome - สำหรับ icons
- Google Fonts - สำหรับ typography
- ชุมพัฒนา DUY-DOE FILM - สำหรับการพัฒนา

---

**🎬 DUY-DOE FILM - สตรีมมิ่งหนัง 4K คุณภาพ พร้อมเทคโนโลยี สุดมัน!**
