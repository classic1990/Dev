import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/lib/firebase.js';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut 
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const isAdmin = result.user?.email === 'duy.kan1234@gmail.com';
    return { ...result, isAdmin };
  };

  const logout = async () => {
    await signOut(auth);
  };

  const isAdmin = () => {
    return currentUser?.email === 'duy.kan1234@gmail.com';
  };

  const value = {
    currentUser,
    loginWithGoogle,
    logout,
    isAdmin,
    loading,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
