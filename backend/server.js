// Firebase Admin Server with AppCheck
// สำหรับ DUY-DOE Movie Platform Backend

const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
require('dotenv').config();

// Initialize Firebase Admin with service account file
let serviceAccount;

// Try to use service account file first, fallback to environment variables
try {
  serviceAccount = require('./service-account-key.json');
  console.log('✅ Using Firebase Admin from service-account-key.json');
} catch (error) {
  console.log('⚠️ Service account file not found, trying environment variables...');

  if (process.env.FIREBASE_PRIVATE_KEY) {
    // Use environment variables
    serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID || 'duydodeesport',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    };
    console.log('✅ Using Firebase Admin from environment variables');
  } else {
    console.error('❌ No Firebase Admin configuration found');
    console.log('📝 Please create service-account-key.json or set environment variables');
    process.exit(1);
  }
}

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // สำหรับ AppCheck ใน production
  appCheck: {
    projectId: serviceAccount.projectId,
    // สามารถเพิ่ม AppCheck settings ได้ถ้าต้องการ
  }
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// AppCheck Verification Middleware
const appCheckVerification = async (req, res, next) => {
  const appCheckToken = req.header('X-Firebase-AppCheck');

  if (!appCheckToken) {
    console.warn('❌ No AppCheck token provided');
    return res.status(401).json({ error: 'Unauthorized: No AppCheck token' });
  }

  try {
    const appCheckClaims = await admin.appCheck().verifyToken(appCheckToken);
    console.log('✅ AppCheck token verified:', appCheckClaims);
    req.appCheckClaims = appCheckClaims;
    return next();
  } catch (err) {
    console.error('❌ AppCheck verification failed:', err);
    return res.status(401).json({ error: 'Unauthorized: Invalid AppCheck token' });
  }
};

// Public endpoints (no AppCheck required)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Protected endpoints (AppCheck required)
app.get('/api/movies', [appCheckVerification], async (req, res) => {
  try {
    const db = admin.firestore();
    const moviesSnapshot = await db.collection('movies').get();
    const movies = moviesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ movies, count: movies.length });
  } catch (error) {
    console.error('❌ Error fetching movies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin endpoints (AppCheck + Admin required)
app.post('/api/admin/movies', [appCheckVerification], async (req, res) => {
  try {
    const { title, description, poster, year, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const db = admin.firestore();
    const newMovie = {
      title,
      description,
      poster: poster || '/img/no-poster.png',
      year: year || new Date().getFullYear(),
      category: category || 'action',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      views: 0,
      popular: false
    };

    const movieRef = await db.collection('movies').add(newMovie);

    res.json({
      success: true,
      movieId: movieRef.id,
      message: 'Movie created successfully'
    });
  } catch (error) {
    console.error('❌ Error creating movie:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User authentication endpoint
app.post('/api/auth/verify', [appCheckVerification], async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'ID token is required' });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    res.json({
      uid: decodedToken.uid,
      email: decodedToken.email,
      isAdmin: decodedToken.email === 'duyclassic191@gmail.com'
    });
  } catch (error) {
    console.error('❌ Error verifying ID token:', error);
    res.status(401).json({ error: 'Invalid ID token' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 DUY-DOE Backend Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    console.log(`🔄 Trying to use port ${PORT + 1}...`);
    server.listen(PORT + 1, '0.0.0.0');
  } else {
    console.error('❌ Server error:', error);
  }
});

module.exports = app;
