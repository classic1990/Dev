import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/common/Header.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Film, Plus, LogOut, Settings } from 'lucide-react';
import ManageMovies from '@/components/admin/ManageMovies.jsx';
import { db } from '@/lib/firebase';
import { collection, getCountFromServer } from 'firebase/firestore';

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('movies');
  const navigate = useNavigate();
  const [totalMovies, setTotalMovies] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchStats = async () => {
        setLoadingStats(true);
        try {
          const moviesCollection = collection(db, 'movies');
          const snapshot = await getCountFromServer(moviesCollection);
          setTotalMovies(snapshot.data().count);
        } catch (error) {
          console.error("Error fetching total movies: ", error);
          // Handle error appropriately, maybe set an error state
        } finally {
          setLoadingStats(false);
        }
      };

      fetchStats();
    }, []);

    return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">ยินดีต้อนรับ, {currentUser?.displayName || currentUser?.email}</p>
              </div>
              <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                ออกจากระบบ
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('movies')}
                  className={`py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === 'movies'
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Film className="w-4 h-4 inline mr-2" />
                  จัดการหนัง
                </button>
                <button
                  onClick={() => setActiveTab('series')}
                  className={`py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === 'series'
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Settings className="w-4 h-4 inline mr-2" />
                  จัดการซีรีส์
                </button>
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {activeTab === 'movies' && (
              <ManageMovies />
            )}

            {activeTab === 'series' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">จัดการซีรีส์</h2>
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Plus className="w-4 h-4 mr-2" />
                    เพิ่มซีรีส์ใหม่
                  </Button>
                </div>
                
                <div className="text-center py-12 text-gray-500">
                  <Settings className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">ยังไม่มีข้อมูลซีรีส์</p>
                  <p className="text-sm">คลิก "เพิ่มซีรีส์ใหม่" เพื่อเริ่มต้น</p>
                </div>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">จำนวนหนังทั้งหมด</h3>
              {loadingStats ? (
                <p className="text-3xl font-bold text-red-600">กำลังโหลด...</p>
              ) : (
                <p className="text-3xl font-bold text-red-600">{totalMovies}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">เรื่อง</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">จำนวนซีรีส์ทั้งหมด</h3>
              <p className="text-3xl font-bold text-red-600">0</p>
              <p className="text-sm text-gray-500 mt-1">เรื่อง</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ผู้ใช้ทั้งหมด</h3>
              <p className="text-3xl font-bold text-red-600">1</p>
              <p className="text-sm text-gray-500 mt-1">คน</p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
