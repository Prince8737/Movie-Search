import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const API_URL = 'https://www.omdbapi.com/';
const API_KEY = 'a31b1bf0';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}?i=${id}&apikey=${API_KEY}`)
      .then(res => {
        if (res.data.Response === 'True') {
          setMovie(res.data);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  const handleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.find(fav => fav.imdbID === movie.imdbID)) {
      favorites.push(movie);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      alert('Added to Favorites!');
    } else {
      alert('Already in Favorites!');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="skeleton-poster"></div>
        <div className="skeleton-text"></div>
      </div>
    );
  }

  if (error || !movie) return <div className="error-message">Error loading movie details.</div>;

  return (
    <div className="movie-detail">
      <button onClick={() => navigate('/')} className="back-button">← Back to Home</button>
      <h1>{movie.Title}</h1>
      <img src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200'} alt={movie.Title} className="movie-poster" />
      <div className="movie-info">
        <p><strong>Year:</strong> {movie.Year}</p>
        <p><strong>Genre:</strong> {movie.Genre}</p>
        <p><strong>Director:</strong> {movie.Director}</p>
        <p><strong>Actors:</strong> {movie.Actors}</p>
        <p><strong>Plot:</strong> {movie.Plot}</p>
        <p><strong>IMDB Rating:</strong> {movie.imdbRating}</p>
        <button onClick={handleFavorite} className="favorite-btn">Add to Favorites</button>
      </div>
    </div>
  );
};

export default MovieDetail;
