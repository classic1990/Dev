# 🔐 นโยบายความปลอดภัย DUY-DOE FILM

## 📋 **ภาพรวมนโยบายความปลอดภัย**

เอกสารนี้กำหนดกฎและมาตรการความปลอดภัยสำหรับแพลตฟอร์มสตรีมมิ่งหนัง DUY-DOE FILM เพื่อป้องกันการถูกโจมตี ปกป้องข้อมูลผู้ใช้ และรักษาความปลอดภัยของระบบ

---

## 🛡️ **ระดับความปลอดภัย**

### 🔴 **ระดับสูง (HIGH SECURITY)**
- การเข้าถึงข้อมูลผู้ใช้
- การจัดการสิทธิ์ Admin
- การป้องกันการโจมตี

### 🟡 **ระดับกลาง (MEDIUM SECURITY)**
- การจัดการเนื้อหา
- การตรวจสอบความถูกต้อง
- การบันทึก Log

### 🟢 **ระดับพื้นฐาน (BASIC SECURITY)**
- การเข้าถึงทั่วไป
- การแสดงเนื้อหา
- การใช้งานระบบ

---

## 🔐 **กฎความปลอดภัยหลัก**

### 1. **การยืนยันตัวตน (Authentication)**

#### ✅ **กฎที่ต้องปฏิบัติ:**
- **Google OAuth 2.0** เท่านั้น - ไม่รองรับ Email/Password
- **Multi-Factor Authentication (MFA)** สำหรับ Admin
- **Session Timeout** 30 นาทีสำหรับผู้ใช้ทั่วไป
- **Session Timeout** 2 ชั่วโมงสำหรับ Admin
- **Rate Limiting** 5 ครั้ง/นาทีสำหรับการล็อกอิน

#### ⚠️ **การป้องกัน:**
```javascript
// Rate Limiting สำหรับ Login
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 นาที

function checkLoginAttempts(ip) {
    const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 };
    
    if (attempts.count >= MAX_ATTEMPTS && 
        Date.now() - attempts.lastAttempt < LOCKOUT_TIME) {
        return false; // ถูก block
    }
    
    return true;
}
```

### 2. **การควบคุมสิทธิ์ (Authorization)**

#### ✅ **ระดับสิทธิ์:**
```javascript
const ROLES = {
    GUEST: 'guest',           // ผู้ใช้ทั่วไป
    USER: 'user',             // ผู้ใช้ที่ล็อกอิน
    PREMIUM: 'premium',       // ผู้ใช้พรีเมียม
    MODERATOR: 'moderator',   // ผู้ดูแลระบบ
    ADMIN: 'admin',           // ผู้ดูแลระบบสูงสุด
    SUPER_ADMIN: 'super_admin' // เจ้าของระบบ
};
```

#### ⚠️ **การตรวจสอบสิทธิ์:**
```javascript
function checkPermission(userRole, requiredRole) {
    const roleHierarchy = {
        'guest': 0,
        'user': 1,
        'premium': 2,
        'moderator': 3,
        'admin': 4,
        'super_admin': 5
    };
    
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}
```

### 3. **การป้องกันการโจมตี (Attack Prevention)**

#### 🛡️ **XSS Protection:**
```javascript
// Content Security Policy
const CSP = {
    'default-src': "'self'",
    'script-src': "'self' 'unsafe-inline' https://www.gstatic.com",
    'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com",
    'img-src': "'self' data: https: blob:",
    'connect-src': "'self' https://*.firebaseio.com https://www.googleapis.com",
    'frame-src': "'self' https://www.youtube.com",
    'font-src': "'self' https://fonts.gstatic.com",
    'object-src': "'none'",
    'media-src': "'self' https:",
    'worker-src': "'self' blob:"
};
```

#### 🛡️ **CSRF Protection:**
```javascript
// CSRF Token สำหรับทุก request
function generateCSRFToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// ตรวจสอบ CSRF token ในทุก request
function validateCSRFToken(request) {
    const token = request.headers['x-csrf-token'];
    const sessionToken = sessionStorage.getItem('csrf-token');
    return token === sessionToken;
}
```

#### 🛡️ **SQL Injection Prevention:**
```javascript
// ใช้ Firestore แทน SQL ป้องกัน SQL Injection 100%
// แต่ยังต้องป้องกัน NoSQL Injection
function sanitizeQuery(input) {
    if (typeof input !== 'string') return input;
    
    // ลับอักขระพิเศษ
    return input.replace(/[\[\]\\{}()*+?.^$|]/g, '\\$&');
}
```

#### 🛡️ **Rate Limiting:**
```javascript
const RATE_LIMITS = {
    'api/search': { requests: 10, window: 60000 },      // 10 ครั้ง/นาที
    'api/movies': { requests: 30, window: 60000 },      // 30 ครั้ง/นาที
    'api/auth': { requests: 5, window: 60000 },         // 5 ครั้ง/นาที
    'api/admin': { requests: 20, window: 60000 }        // 20 ครั้ง/นาที
};
```

---

## 🔒 **กฎการเข้าถึงข้อมูล**

### 1. **ข้อมูลผู้ใช้ (User Data)**
- **เข้าถึงได้เฉพาะตัวเอง** - ไม่สามารถดูข้อมูลผู้อื่น
- **Admin เท่านั้น** - สามารถดูข้อมูลทั้งหมด
- **Encryption** - ข้อมูลสำคัญถูกเข้ารหัส

### 2. **เนื้อหาหนัง (Movie Content)**
- **Public Access** - ทุกคนสามารถดูรายการหนังได้
- **Admin Only** - การเพิ่ม/แก้ไข/ลบหนัง
- **Content Validation** - ตรวจสอบความปลอดภัยของ URL

### 3. **ความคิดเห็น (Comments)**
- **Logged-in Users** - สามารถคอมเมนต์ได้
- **Content Filtering** - กรองคำไม่สุภาพ
- **Rate Limiting** - จำกัดการคอมเมนต์

---

## 🔍 **การตรวจสอบและบันทึก (Monitoring & Logging)**

### 1. **Security Events ที่ต้องบันทึก:**
- ❌ **Failed Login Attempts**
- ❌ **Suspicious Activities**
- ❌ **Admin Actions**
- ❌ **Data Access Violations**
- ❌ **System Errors**

### 2. **Log Format:**
```javascript
const securityLog = {
    timestamp: new Date().toISOString(),
    level: 'ERROR|WARN|INFO|DEBUG',
    event: 'LOGIN_FAILED|DATA_ACCESS|ADMIN_ACTION',
    userId: 'user_id_or_null',
    ip: 'client_ip_address',
    userAgent: 'browser_info',
    details: { /* additional_data */ }
};
```

### 3. **Real-time Alerts:**
- 🚨 **Multiple Failed Logins** (>5 ครั้ง)
- 🚨 **Admin Access** จาก IP ใหม่
- 🚨 **Data Breach Attempts**
- 🚨 **System Anomalies**

---

## 🛠️ **การ Implement มาตรการความปลอดภัย**

### 1. **Frontend Security:**
```javascript
// Security Headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000');
    res.setHeader('Content-Security-Policy', getCSP());
    next();
});

// Input Validation
function validateInput(input, type) {
    const patterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        movieTitle: /^.{1,100}$/,
        search: /^.{1,50}$/
    };
    
    return patterns[type].test(input);
}
```

### 2. **Backend Security:**
```javascript
// Firebase Security Rules
const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Movies are public, but only admins can write
    match /movies/{movieId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.email in ['duyclassic191@gmail.com', 'duy.kan1234@gmail.com'];
    }
    
    // Comments require authentication
    match /comments/{commentId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
`;
```

### 3. **Database Security:**
```javascript
// Data Encryption
function encryptSensitiveData(data, key) {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    return encrypted;
}

// Access Control
function checkDataAccess(userId, dataId, action) {
    const permissions = {
        'read': ['owner', 'admin', 'public'],
        'write': ['owner', 'admin'],
        'delete': ['admin']
    };
    
    return permissions[action].includes(getUserRole(userId));
}
```

---

## 🚨 **การตอบสนองต่อเหตุการณ์ฉุกเฉิน**

### 1. **Security Incident Response:**
1. **Detection** - ตรวจพบเหตุการณ์
2. **Analysis** - วิเคราะห์ความรุนแรง
3. **Containment** - จำกัดความเสียหาย
4. **Eradication** - กำจัดภัยคุกคาม
5. **Recovery** - ฟื้นฟูระบบ
6. **Lessons Learned** - บันทึกบทเรียน

### 2. **Emergency Contacts:**
- 📞 **Security Team**: [security-team@duydoe.com]
- 📞 **System Admin**: [admin@duydoe.com]
- 📞 **Legal Team**: [legal@duydoe.com]

---

## 📋 **Checklist ความปลอดภัย**

### ✅ **Daily Checklist:**
- [ ] ตรวจสอบ Security Logs
- [ ] ตรวจสอบ Failed Login Attempts
- [ ] ตรวจสอบ System Performance
- [ ] ตรวจสอบ Backup Status

### ✅ **Weekly Checklist:**
- [ ] อัปเดต Security Patches
- [ ] ตรวจสอบ User Access Logs
- [ ] สแกน Vulnerabilities
- [ ] ทบทวน Security Policies

### ✅ **Monthly Checklist:**
- [ ] Security Audit
- [ ] Penetration Testing
- [ ] อัปเดต Documentation
- [ ] Training Session

---

## 🎯 **Best Practices**

### 1. **สำหรับ Developers:**
- ✅ เขียนโค้ดตามหลัก Secure Coding
- ✅ ตรวจสอบ Input ทุกครั้ง
- ✅ ใช้ HTTPS เท่านั้น
- ✅ ไม่เก็บข้อมูลสำคัญใน Client-side

### 2. **สำหรับ Users:**
- ✅ ใช้ Password ที่แข็งแกร่ง
- ✅ เปิดใช้งาน 2FA
- ✅ ไม่แชร์ข้อมูลส่วนตัว
- ✅ รายงานปัญหาความปลอดภัย

### 3. **สำหรับ Admins:**
- ✅ ใช้ Multi-Factor Authentication
- ✅ ไม่ใช้ WiFi สาธารณะ
- ✅ อัปเดตรหัสผ่านทุก 90 วัน
- ✅ ตรวจสอบ Access Logs ประจำ

---

## 🔧 **Tools & Resources**

### **Security Tools:**
- **Firebase Security Rules** - Database protection
- **Google Cloud Security** - Infrastructure protection
- **OWASP ZAP** - Security scanning
- **Burp Suite** - Penetration testing

### **Monitoring Tools:**
- **Firebase Performance Monitoring** - Performance tracking
- **Google Cloud Logging** - Log management
- **Sentry** - Error tracking
- **Datadog** - System monitoring

---

## 📞 **การรายงานปัญหาความปลอดภัย**

หากพบปัญหาความปลอดภัย กรุณารายงานที่:
- 📧 **Email**: security@duydoe.com
- 📱 **Hotline**: +66-XX-XXX-XXXX
- 🌐 **Web**: https://security.duydoe.com

**เราให้ความสำคัญกับความปลอดภัยของข้อมูลคุณเป็นอันดับหนึ่ง** 🛡️

---

*📝 อัปเดตล่าสุด: 1 เมษายน 2026*
*👤 ผู้รับผิดชอบ: Security Team - DUY-DOE FILM*
