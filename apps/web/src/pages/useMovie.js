import { useState, useEffect } from 'react';
import { getMovieById } from '@/services/movieService.js';

export const useMovie = (id) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(null);
        const movieData = await getMovieById(id);
        if (movieData) {
          setMovie(movieData);
        } else {
          setError('ไม่พบข้อมูลหนังสำหรับ ID นี้');
        }
      } catch (err) {
        console.error("Error fetching movie:", err);
        setError('เกิดข้อผิดพลาดในการดึงข้อมูลหนัง');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  return { movie, loading, error };
};