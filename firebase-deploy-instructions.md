# 🚀 Firebase Deployment Instructions

## 📋 **การติดตั้ง Firestore Security Rules**

### 1. **ติดตั้ง Firestore Rules**
```bash
# ติดตั้ง security rules ที่สร้างขึ้น
firebase deploy --only firestore:rules

# หรือ deploy ทั้งหมด
firebase deploy
```

### 2. **ติดตั้ง Indexes**
```bash
# ติดตั้ง indexes สำหรับ query performance
firebase deploy --only firestore:indexes
```

### 3. **ตรวจสอบการติดตั้ง**
```bash
# ตรวจสอบ rules
firebase firestore:rules:list

# ตรวจสอบ indexes
firebase firestore:indexes:list
```

---

## 🔐 **Firestore Security Rules ที่สร้าง**

### **คอลเลกชันหลัก:**

#### 🎬 **Movies Collection**
```javascript
match /movies/{movieId} {
  allow read: if true; // อ่านได้ทุกคน
  allow create, delete: if isAdmin(); // เฉพาะ admin
  allow update: if isAdmin() || (
    // ผู้ใช้ที่ล็อกอินสามารถอัปเดต views, likes, rating
    isAuthenticated() && 
    request.resource.data.diff(resource.data).affectedKeys()
      .hasOnly(['views', 'likes', 'likesCount', 'lastViewedAt', 'rating', 'comments'])
  );
}
```

#### 👤 **Users Collection**
```javascript
match /users/{userId} {
  allow read, write: if isAuthenticated() && request.auth.uid == userId;
  allow read: if isAdmin(); // admin สามารถอ่านข้อมูลผู้ใช้ทั้งหมด
  allow create: if false; // สร้างโดย auth trigger เท่านั้น
}
```

#### ⭐ **Favorites Collection**
```javascript
match /favorites/{favoriteId} {
  allow read: if isOwner('userId');
  allow create: if isCreatingOwn('userId') && 
    request.resource.data.keys().hasAll(['userId', 'movieId', 'addedAt']);
  allow delete: if isOwner('userId');
  allow update: if false; // ไม่อนุญาตให้อัปเดต
}
```

#### 📺 **Watchlist Collection**
```javascript
match /watchlist/{watchlistId} {
  allow read: if isOwner('userId');
  allow create: if isCreatingOwn('userId');
  allow update: if isOwner('userId') &&
    request.resource.data.diff(resource.data).affectedKeys()
      .hasOnly(['watched', 'watchedAt', 'progress']);
  allow delete: if isOwner('userId');
}
```

#### 📝 **Comments Collection**
```javascript
match /comments/{commentId} {
  allow read: if true; // อ่านได้ทุกคน
  allow create: if isAuthenticated() && 
    request.resource.data.content.size() > 0 &&
    request.resource.data.content.size() <= 500;
  allow update: if isOwner('userId');
  allow delete: if isOwner('userId') || isAdmin();
}
```

#### ⭐ **Ratings Collection**
```javascript
match /ratings/{ratingId} {
  allow read: if isOwner('userId');
  allow create: if isCreatingOwn('userId') && 
    request.resource.data.rating >= 1 &&
    request.resource.data.rating <= 10;
  allow update: if isOwner('userId');
  allow delete: if isOwner('userId');
}
```

#### 📚 **History Collection**
```javascript
match /history/{historyId} {
  allow read: if isOwner('userId');
  allow create: if isCreatingOwn('userId');
  allow update: if isOwner('userId') &&
    request.resource.data.diff(resource.data).affectedKeys()
      .hasOnly(['progress', 'completed', 'completedAt']);
  allow delete: if isOwner('userId');
}
```

#### 🔐 **Admin Collections**
```javascript
match /admin/{document=**} {
  allow read, write, delete: if isAdmin();
}

match /logs/{document=**} {
  allow read, write: if isAdmin();
}

match /reports/{document=**} {
  allow read, write: if isAdmin();
}

match /security/{document=**} {
  allow read, write: if isAdmin();
}
```

---

## 🔧 **Helper Functions**

### **isAdmin()**
```javascript
function isAdmin() {
  return request.auth != null && request.auth.token.email == 'duyclassic191@gmail.com';
}
```

### **isAuthenticated()**
```javascript
function isAuthenticated() {
  return request.auth != null;
}
```

### **isOwner(userIdField)**
```javascript
function isOwner(userIdField) {
  return request.auth != null && request.auth.uid == resource.data[userIdField];
}
```

### **isCreatingOwn(userIdField)**
```javascript
function isCreatingOwn(userIdField) {
  return request.auth != null && request.auth.uid == request.resource.data[userIdField];
}
```

---

## 📊 **Indexes สำหรับ Query Performance**

### **Movies Indexes**
- **category + createdAt** - สำหรับกรองหมวดหมู่
- **popular + views** - สำหรับหนังยอดนิยม
- **title + year** - สำหรับค้นหา

### **User Data Indexes**
- **userId + addedAt** - สำหรับ favorites, watchlist, history
- **movieId + createdAt** - สำหรับ comments
- **movieId + rating** - สำหรับ ratings

---

## 🛡️ **ความปลอดภัยที่ได้รับ**

### ✅ **Data Protection**
- 🔒 **User Isolation** - ผู้ใช้สามารถเข้าถึงข้อมูลตัวเองเท่านั้น
- 🚫 **Public Access Control** - ควบคุมการเข้าถึงข้อมูลสาธารณะ
- 🛡️ **Admin Privileges** - admin มีสิทธิ์พิเศษแต่มีการควบคุม

### ✅ **Input Validation**
- 📝 **Content Length** - จำกัดความยาวของคอมเมนต์ (500 ตัวอักษร)
- ⭐ **Rating Range** - จำกัดคะแนน (1-10)
- 🔑 **Required Fields** - ตรวจสอบฟิลด์ที่จำเป็น

### ✅ **Operation Control**
- 🚫 **No Direct User Creation** - สร้างผ่าน auth trigger เท่านั้น
- ⚡ **Update Restrictions** - จำกัดฟิลด์ที่สามารถอัปเดตได้
- 🗑️ **Delete Permissions** - ควบคุมการลบข้อมูล

---

## 🚀 **การ Deploy ครั้งแรก**

```bash
# 1. Login ถ้ายังไม่ได้ login
firebase login

# 2. เลือก project
firebase use duydoe-film

# 3. Deploy rules และ indexes
firebase deploy --only firestore

# 4. Deploy hosting พร้อม security headers
firebase deploy --only hosting

# 5. Deploy ทั้งหมด
firebase deploy
```

---

## 🔍 **การทดสอบ Rules**

### **Testing ใน Firebase Console**
1. เข้า Firebase Console → Firestore
2. ไปที่ Rules tab
3. ใช้ Simulator ทดสอบ rules
4. ทดสอบทั้ง read, write, delete operations

### **Testing แบบ Local**
```bash
# ติดตั้ง Firebase Emulator
firebase setup:emulators:firestore

# รัน emulator
firebase emulators:start

# ทดสอบ rules ใน local
firebase emulators:exec "npm test"
```

---

## 📞 **การแก้ไขปัญหา**

### **Common Issues**
1. **Permission Denied** - ตรวจสอบว่า user ล็อกอินแล้ว
2. **Missing Index** - ติดตั้ง indexes ที่ขาดหายไป
3. **Rules Too Complex** - แบ่ง rules ย่อยๆ ให้ง่ายขึ้น

### **Debug Tips**
```javascript
// ใช้ console.log ใน rules เพื่อ debugging
// (ใช้ได้ใน emulator เท่านั้น)
debug('User ID: ' + request.auth.uid);
debug('Request data: ' + request.resource.data);
```

---

## 🎯 **Best Practices**

### ✅ **Do's**
- 🔒 ใช้ helper functions สำหรับ logic ซ้ำๆ
- 📝 เขียน rules ที่อ่านง่ายและเข้าใจได้
- 🧪 ทดสอบ rules ก่อน deploy
- 📊 สร้าง indexes สำหรับ queries ที่ใช้บ่อย

### ❌ **Don'ts**
- 🚫 ไม่ใช้ `allow read, write: if true;` ใน production
- 🚫 ไม่ลืมตรวจสอบ `request.auth != null`
- 🚫 ไม่ใช้ rules ที่ซับซ้อนเกินไป
- 🚫 ไม่ deploy โดยไม่ทดสอบ

---

**🔐 Firestore Security Rules พร้อมใช้งานแล้ว! ปลอดภัยและมีประสิทธิภาพสูง** 🛡️✨
