import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/common/Header.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Film, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await loginWithGoogle();
      if (result.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('เข้าสู่ระบบด้วย Google ล้มเหลว กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>เข้าสู่ระบบ - MovieHub</title>
        <meta name="description" content="Login page for MovieHub" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <Film className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">เข้าสู่ระบบ</h1>
              <p className="text-gray-600">เข้าสู่ระบบเพื่อจัดการข้อมูล</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 flex items-center justify-center gap-3 py-6 text-lg font-medium"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  กำลังเข้าสู่ระบบ...
                </>
              ) : (
                'เข้าสู่ระบบด้วย Google'
              )}
            </Button>

            <p className="text-center text-gray-500 text-sm mt-6">
              เฉพาะ duy.kan1234@gmail.com เท่านั้นที่สามารถจัดการข้อมูลได้
            </p>
          </div>
        </main>
      </div>
    </>
  );
};

export default LoginPage;
