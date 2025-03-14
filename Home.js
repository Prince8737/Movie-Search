import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import MovieCard from './MovieCard';
import SkeletonLoader from './SkeletonLoader';

const API_URL = 'https://www.omdbapi.com/';
const API_KEY = 'a31b1bf0';

// Random movies to show on initial load
const randomQueries = [
  'avengers', 'batman', 'superman', 'matrix', 'jurassic', 'inception',
  'harry potter', 'star wars', 'spiderman', 'transformers'
];

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => setQuery(e.target.value);
  const handleClear = () => setQuery('');

  useEffect(() => {
    const timeout = setTimeout(() => onSearch(query), 300);
    return () => clearTimeout(timeout);
  }, [query, onSearch]);

  return (
    <div className="search-bar">
      <input type="text" value={query} onChange={handleChange} placeholder="Search movies..." />
      {query && <button onClick={handleClear} className="clear-btn">Clear</button>}
    </div>
  );
};

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);

  // Set random query on initial load
  useEffect(() => {
    if (!query) {
      const randomQuery = randomQueries[Math.floor(Math.random() * randomQueries.length)];
      setQuery(randomQuery);
    }
  }, []);

  const searchMovies = (newQuery) => {
    if (newQuery !== query) {
      setQuery(newQuery);
      setMovies([]);
      setPage(1);
      setError(false); // Reset error when searching
    }
  };

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    axios.get(`${API_URL}?s=${query}&page=${page}&apikey=${API_KEY}`)
      .then(res => {
        if (res.data.Response === 'False') {
          setError(true);
        } else {
          setMovies(prevMovies => [...prevMovies, ...(res.data.Search || [])]);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [query, page]);

  // Infinite Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 100 &&
        !loading
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  return (
    <div>
      <SearchBar onSearch={searchMovies} />
      {error && movies.length === 0 && (
        <div className="error-message">No movies found. Please try another search.</div>
      )}
      <div className="movie-grid">
        {movies.length > 0 ? (
          movies.map((movie) => <MovieCard key={movie.imdbID} movie={movie} />)
        ) : (
          loading ? Array.from({ length: 8 }).map((_, i) => <SkeletonLoader key={i} />) : (
            !error && <div className="no-movies">No movies available.</div>
          )
        )}
      </div>
    </div>
  );
};

export default Home;
