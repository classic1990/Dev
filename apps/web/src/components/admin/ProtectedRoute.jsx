import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { currentUser, isAdmin, initialLoading } = useAuth();

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-2">ไม่มีสิทธิ์เข้าถึง</h1>
          <p className="text-gray-700 mb-2">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
          <p className="text-gray-500 text-sm">กรุณาเข้าสู่ระบบในฐานะ Admin</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;