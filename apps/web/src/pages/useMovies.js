import { useState, useEffect } from 'react';
import { getAllMovies } from '@/services/movieService.js';

export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviesData = await getAllMovies();
        setMovies(moviesData);
      } catch (err) {
        console.error("Error fetching movies: ", err);
        setError('ไม่สามารถดึงข้อมูลหนังได้ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return { movies, loading, error };
};