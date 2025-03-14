import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const MovieCard = ({ movie }) => (
  <div className="movie-card">
    <Link to={`/movie/${movie.imdbID}`}>
      <img src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200'} alt={movie.Title} />
      <h3>{movie.Title} ({movie.Year})</h3>
    </Link>
  </div>
);

export default MovieCard;
