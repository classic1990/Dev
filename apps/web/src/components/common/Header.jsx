import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Film, LogOut, LayoutDashboard } from 'lucide-react';

const Header = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Film className="w-8 h-8 text-red-500" />
            <span className="text-2xl font-bold">MovieHub</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link to="/" className="hover:text-red-400 transition-colors font-medium">
              หน้าแรก
            </Link>

            {!currentUser && (
              <Link to="/login">
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900">
                  เข้า Admin
                </Button>
              </Link>
            )}

            {currentUser && isAdmin() && (
              <>
                <Link to="/admin">
                  <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900 flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    แดชบอร์ด
                  </Button>
                </Link>
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  className="bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  ออกจากระบบ
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;