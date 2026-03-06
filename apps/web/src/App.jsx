import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import Header from '@/components/common/Header.jsx';
import ScrollToTop from '@/components/common/ScrollToTop.jsx';
import ProtectedRoute from '@/components/admin/ProtectedRoute.jsx';
import HomePage from '@/pages/HomePage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import AdminDashboard from '@/pages/AdminDashboard.jsx';
import MoviePlayer from '@/pages/MoviePlayer.jsx';
import { Toaster } from '@/components/ui/toaster.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/movie/:id" element={<MoviePlayer />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;