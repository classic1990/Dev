import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/common/Header.jsx';
import { Button } from '@/components/ui/button.jsx';
import { ArrowLeft, ExternalLink, Star, Clock, Calendar, AlertCircle } from 'lucide-react';
import { useMovie } from '@/hooks/useMovie.js';

const MoviePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { movie, loading, error } = useMovie(id);

  const formatDurationFromMinutes = (minutes) => {
    if (!minutes || minutes <= 0) return null;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const parts = [];
    if (h > 0) parts.push(`${h} ชั่วโมง`);
    if (m > 0) parts.push(`${m} นาที`);
    return parts.join(' ');
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>กำลังโหลด... - MovieHub</title>
        </Helmet>
        <div className="min-h-screen bg-gray-900 text-white">
          <Header />
          <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-gray-400">กำลังโหลด...</p>
            </div>
          </main>
        </div>
      </>
    );
  }

  if (error || !movie) {
    return (
      <>
        <Helmet>
          <title>ข้อผิดพลาด - MovieHub</title>
        </Helmet>
        <div className="min-h-screen bg-gray-900 text-white">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto text-center py-12 bg-gray-800 rounded-lg shadow-lg p-8">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">เกิดข้อผิดพลาด</h2>
              <p className="text-gray-400 mb-6">{error || 'ไม่พบข้อมูลหนัง'}</p>
              <Button onClick={() => navigate('/')} variant="outline" className="text-gray-900">
                กลับหน้าแรก
              </Button>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${movie.title} - MovieHub`}</title>
        <meta name="description" content={movie.description || `Watch ${movie.title} on MovieHub`} />
      </Helmet>
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost" 
            className="mb-6 text-gray-300 hover:text-white hover:bg-gray-800 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับหน้าแรก
          </Button>

          <div className="bg-black rounded-xl overflow-hidden shadow-2xl mb-8 aspect-video w-full max-w-5xl mx-auto">
            {movie.videoId ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${movie.videoId}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3`}
                title={movie.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <p className="text-gray-400">ไม่มีวิดีโอสำหรับหนังเรื่องนี้</p>
              </div>
            )}
          </div>

          <div className="max-w-5xl mx-auto bg-gray-800 rounded-xl p-6 md:p-8 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{movie.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-300">
                  {movie.rating && (
                    <div className="flex items-center gap-1 bg-gray-700 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-white">{movie.rating.toFixed(1)}</span>
                    </div>
                  )}
                  {movie.year && (
                    <div className="flex items-center gap-1 bg-gray-700 px-3 py-1 rounded-full">
                      <Calendar className="w-4 h-4" />
                      <span>{movie.year}</span>
                    </div>
                  )}
                  {movie.duration && (
                    <div className="flex items-center gap-1 bg-gray-700 px-3 py-1 rounded-full">
                      <Clock className="w-4 h-4" />
                      <span>{formatDurationFromMinutes(movie.duration)}</span>
                    </div>
                  )}
                  {movie.category && (
                    <span className="bg-red-900/50 text-red-200 px-3 py-1 rounded-full border border-red-800">
                      {movie.category}
                    </span>
                  )}
                </div>

                <div className="prose prose-invert max-w-none">
                  <h3 className="text-xl font-semibold mb-2 text-gray-200">เรื่องย่อ</h3>
                  <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
                    {movie.description || 'ไม่มีรายละเอียด'}
                  </p>
                </div>
              </div>

              <div className="flex-shrink-0 w-full md:w-auto">
                {movie.youtubeUrl && (
                  <Button 
                    onClick={() => window.open(movie.youtubeUrl, '_blank')}
                    className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 py-6 px-8 text-lg font-semibold rounded-xl shadow-lg shadow-red-900/20 transition-all hover:scale-105"
                  >
                    <ExternalLink className="w-5 h-5" />
                    ดูหนังเต็มเรื่อง
                  </Button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default MoviePlayer;
