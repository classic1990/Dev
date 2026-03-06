import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button.jsx';
import { Film, Plus, Trash2, Edit } from 'lucide-react';

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMovie, setEditingMovie] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const moviesCollection = collection(db, 'movies');
      const snapshot = await getDocs(moviesCollection);
      const moviesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMovies(moviesList);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (movieId) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await deleteDoc(doc(db, 'movies', movieId));
        setMovies(movies.filter(movie => movie.id !== movieId));
      } catch (error) {
        console.error('Error deleting movie:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading movies...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Movies</h2>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Movie
        </Button>
      </div>

      <div className="grid gap-4">
        {movies.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No movies found. Add your first movie!
          </div>
        ) : (
          movies.map(movie => (
            <div key={movie.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Film className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold">{movie.title || 'Untitled Movie'}</h3>
                  <p className="text-sm text-gray-600">{movie.description || 'No description'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(movie.id)} className="flex items-center gap-1">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageMovies;
