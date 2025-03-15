import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { StreamList } from "./components/Navigation/StreamList/StreamList";
import { Movies } from "./components/Pages/Movies/Movies";
import { Cart } from "./components/Pages/Cart/Cart";
import { About } from "./components/Pages/About/About";
import Navigation from "./components/Navigation/Navigation";

import "./styles.css";

// Define interfaces for better type safety
export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
}

export interface WatchedMovies {
  [key: number]: boolean;
}

interface Notification {
  message: string;
  type: 'success' | 'error';
}

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [streamList, setStreamList] = useState<Movie[]>([]);
  const [watchedMovies, setWatchedMovies] = useState<WatchedMovies>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const storedStreamList = JSON.parse(localStorage.getItem('streamList') || '[]');
      const storedWatchedMovies = JSON.parse(localStorage.getItem('watchedMovies') || '{}');
      const storedDarkMode = localStorage.getItem('darkMode') === 'true';
      
      setStreamList(storedStreamList);
      setWatchedMovies(storedWatchedMovies);
      setDarkMode(storedDarkMode);
    } catch (err) {
      console.error("Error loading data from localStorage:", err);
      setError("Failed to load your saved data. Please refresh the page.");
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('streamList', JSON.stringify(streamList));
    localStorage.setItem('watchedMovies', JSON.stringify(watchedMovies));
    localStorage.setItem('darkMode', String(darkMode));
  }, [streamList, watchedMovies, darkMode]);

  // Clear notification after timeout
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const addToStreamList = (movie: Movie) => {
    setIsLoading(true);
    try {
      const isAlreadyAdded = streamList.some((m) => m.id === movie.id);
      
      if (!isAlreadyAdded) {
        setStreamList((prevList) => [...prevList, movie]);
        setIsLoading(false);
        return { success: true, message: `${movie.title} added to your Stream List!` };
      } else {
        setIsLoading(false);
        return { success: false, message: `${movie.title} is already in your Stream List.` };
      }
    } catch (err) {
      setError("Failed to add movie to stream list.");
      setIsLoading(false);
      return { success: false, message: "An error occurred. Please try again." };
    }
  };

  const removeFromStreamList = (id: number) => {
    setIsLoading(true);
    try {
      const movieToRemove = streamList.find(movie => movie.id === id);
      setStreamList((prevList) => prevList.filter((movie) => movie.id !== id));
      setIsLoading(false);
      
      if (movieToRemove) {
        setNotification({
          message: `${movieToRemove.title} removed from your Stream List.`,
          type: 'success'
        });
      }
      
      return { success: true };
    } catch (err) {
      setError("Failed to remove movie from stream list.");
      setIsLoading(false);
      return { success: false };
    }
  };

  const toggleWatched = (id: number) => {
    setIsLoading(true);
    try {
      const movie = streamList.find(movie => movie.id === id);
      const newWatchedStatus = !watchedMovies[id];
      
      setWatchedMovies((prev) => ({ ...prev, [id]: newWatchedStatus }));
      setIsLoading(false);
      
      if (movie) {
        setNotification({
          message: newWatchedStatus 
            ? `${movie.title} marked as watched.` 
            : `${movie.title} marked as unwatched.`,
          type: 'success'
        });
      }
      
      return { success: true };
    } catch (err) {
      setError("Failed to update watched status.");
      setIsLoading(false);
      return { success: false };
    }
  };

  const clearError = () => setError(null);
  const clearNotification = () => setNotification(null);

  // Apply dark mode to body element
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className={`App ${darkMode ? "dark-mode" : ""}`}>
        <Navigation darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        {error && (
          <div className="error-notification">
            <p>{error}</p>
            <button onClick={clearError}>Dismiss</button>
          </div>
        )}
        
        {notification && (
          <div className={`notification-container ${notification.type}`}>
            <div className="notification-icon">
              {notification.type === 'success' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              )}
            </div>
            <p className="notification-message">{notification.message}</p>
            <button className="notification-close" onClick={clearNotification}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        )}
        
        <main className="content">
          <Routes>
            <Route
              path="/"
              element={
                <StreamList
                  streamList={streamList}
                  watchedMovies={watchedMovies}
                  removeFromStreamList={removeFromStreamList}
                  toggleWatched={toggleWatched}
                  isLoading={isLoading}
                />
              }
            />
            <Route 
              path="/movies" 
              element={
                <Movies 
                  addToStreamList={addToStreamList}
                />
              } 
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
