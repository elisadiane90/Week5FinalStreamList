import React from "react";
import "./StreamList.css";
import { Trash2, Eye, EyeOff, Loader } from "lucide-react";
import { Movie, WatchedMovies } from "../../../App";

interface StreamListProps {
  streamList: Movie[];
  watchedMovies: WatchedMovies;
  removeFromStreamList: (id: number) => { success: boolean };
  toggleWatched: (id: number) => { success: boolean };
  isLoading: boolean;
}

export const StreamList: React.FC<StreamListProps> = ({
  streamList,
  watchedMovies,
  removeFromStreamList,
  toggleWatched,
  isLoading
}) => {
  const handleRemoveFromStreamList = (id: number) => {
    removeFromStreamList(id);
  };

  const handleToggleWatched = (id: number) => {
    toggleWatched(id);
  };

  if (isLoading) {
    return (
      <div className="stream-list loading">
        <Loader size={40} className="spinner" />
        <p>Loading your stream list...</p>
      </div>
    );
  }

  return (
    <div className="stream-list">
      <h2>Your Stream List</h2>
      <div className="movies-list">
        {streamList.length > 0 ? (
          streamList.map((movie) => (
            <div
              key={movie.id}
              className={`movie-card ${watchedMovies[movie.id] ? "watched" : ""}`}
            >
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
                <p>Release Date: {movie.release_date || "N/A"}</p>
                <p>{movie.overview || "No description available."}</p>
                <div className="button-group">
                  <button
                    className="icon-btn"
                    onClick={() => handleToggleWatched(movie.id)}
                    title={
                      watchedMovies[movie.id]
                        ? "Mark as Unwatched"
                        : "Mark as Watched"
                    }
                  >
                    {watchedMovies[movie.id] ? (
                      <Eye size={20} />
                    ) : (
                      <EyeOff size={20} />
                    )}
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => handleRemoveFromStreamList(movie.id)}
                    title="Remove from Stream List"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No movies in your Stream List. Add some from the Movies tab!</p>
        )}
      </div>
    </div>
  );
};
