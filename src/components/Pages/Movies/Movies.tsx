import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Movies.css';
import { Loader, AlertCircle, CheckCircle, X } from 'lucide-react';
import { Movie } from '../../../App';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

interface MoviesProps {
  addToStreamList: (movie: Movie) => { success: boolean; message: string };
}

export const Movies: React.FC<MoviesProps> = ({ addToStreamList }) => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const storedQuery = localStorage.getItem('movieSearchQuery');
    if (storedQuery) {
      setQuery(storedQuery);
      handleSearch(storedQuery);
    }
  }, []);

  useEffect(() => {
    if (query.trim()) {
      localStorage.setItem('movieSearchQuery', query);
    }
  }, [query]);

  const handleSearch = async (searchQuery?: string) => {
    const queryToUse = searchQuery || query;
    if (!queryToUse.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          query: queryToUse,
        },
      });

      setMovies(response.data.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to fetch movies. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAddToStreamList = (movie: Movie) => {
    const result = addToStreamList(movie);
    
    // Show notification
    setNotification({
      message: result.message,
      type: result.success ? 'success' : 'error'
    });
    
    console.log("Notification set:", result.message, result.success ? 'success' : 'error');
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const clearNotification = () => {
    setNotification(null);
  };

  return (
    <div className="movies-page">
      <h2>Search Movies</h2>
      
      {notification && (
        <div className={`notification-container ${notification.type}`}>
          <div className="notification-icon">
            {notification.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
          </div>
          <p className="notification-message">{notification.message}</p>
          <button className="notification-close" onClick={clearNotification}>
            <X size={16} />
          </button>
        </div>
      )}
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={() => handleSearch()} disabled={isLoading}>
          {isLoading ? <Loader size={16} className="spinner" /> : 'Search'}
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}
      
      {isLoading ? (
        <div className="loading-container">
          <Loader size={40} className="spinner" />
          <p>Searching for movies...</p>
        </div>
      ) : (
        <div className="movies-list">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div key={movie.id} className="movie-card">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                  />
                ) : (
                  <div className="no-image">No Image</div>
                )}
                <div className="movie-details">
                  <h3>{movie.title}</h3>
                  <p>Release Date: {movie.release_date || 'N/A'}</p>
                  <p>{movie.overview || 'No description available.'}</p>
                  <button onClick={() => handleAddToStreamList(movie)}>
                    Add to Stream List
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No movies found. Try searching for something!</p>
          )}
        </div>
      )}
    </div>
  );
};
