import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Star, Play, Clock, Search, Film, Loader2, AlertCircle } from 'lucide-react';
import { useMovies } from '@/hooks/useMovies.js';

const HomePage = () => {
  const navigate = useNavigate();
  const { movies, loading, error } = useMovies();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Action', 'Sci-Fi', 'Drama', 'Comedy'];

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title && movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || movie.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}ชม ${m}น` : `${m}น`;
  };

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />

        {/* Hero Section */}
        <section className="relative h-96 bg-gradient-to-r from-blue-900 to-gray-900">
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-bold mb-4">DuyKan Movie Platform</h1>
              <p className="text-xl mb-8 text-gray-200">ดูหนังออนไลน์ฟรี ครบทุกเรื่อง คมชัด HD</p>
              <Button className="bg-red-600 hover:bg-red-700 text-lg px-8 py-3">
                <Play className="w-5 h-5 mr-2" />
                เริ่มดูหนัง
              </Button>
            </div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ค้นหาหนัง..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-red-500 text-white placeholder-gray-400"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-red-500 text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'ทุกหมวดหมู่' : category}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 mx-auto animate-spin text-red-500" />
              <p className="mt-4 text-gray-400">กำลังโหลดข้อมูลหนัง...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-gray-800 rounded-lg p-8">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">เกิดข้อผิดพลาด</h2>
              <p className="text-gray-400">{error}</p>
            </div>
          ) : (
            <>
              {/* Movies Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredMovies.map(movie => (
                  <div
                    key={movie.id}
                    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  >
                    <div className="aspect-[2/3] bg-gray-700 relative overflow-hidden">
                      <img
                        src={movie.thumbnail}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded text-sm">
                        {movie.category}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-1 truncate">{movie.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span>{movie.rating}</span>
                        </div>
                        <span>•</span>
                        <span>{movie.year}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDuration(movie.duration)}</span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2">{movie.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {filteredMovies.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Film className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-xl text-gray-400 mb-2">ไม่พบหนังที่ค้นหา</p>
                  <p className="text-gray-500">ลองค้นหาด้วยคำอื่นหรือเปลี่ยนหมวดหมู่</p>
                </div>
              )}
            </>
          )}
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 border-t border-gray-700 py-8 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400">© 2024 DuyKan Movie Platform. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
