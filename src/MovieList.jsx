import React, { useEffect, useState } from 'react'
import Search from './components/Search.jsx'
import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';
import TypeSelect from './components/TypeSelect.jsx';
import { useDebounce } from 'react-use';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const SCRT = import.meta.env.VITE_TMDB;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${SCRT}`
  }
}

const MovieList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('')
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [debouncedSearchTerm, setdebouncedSearchTerm] = useState('');
  const [moviePage, setMoviePage] = useState(1);

  useDebounce(() => setdebouncedSearchTerm(searchTerm), 1000, [searchTerm])

const fetchMovies = async (query = '', page = 1) => {
  setisLoading(true);
  setErrorMessage('');
  try {
    const endpoint = query
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
      : `${API_BASE_URL}/discover/movie?page=${page}&sort_by=popularity.desc`;
    const response = await fetch(endpoint, API_OPTIONS)
    if (!response.ok) {
      throw new Error('Filme konnten nicht geladen werden');
    }
    const data = await response.json();
    if (data.Response === 'false') {
      setErrorMessage(data.Error || 'Failed to fetch movies');
      setMovieList([]);
      return;
    }
    if (page > 1) {
      setMovieList(prev => {
        const existingIds = new Set(prev.map(m => m.id));
        const newMovies = (data.results || []).filter(m => !existingIds.has(m.id));
        return [...prev, ...newMovies];
      });
    } else {
      setMovieList(data.results || []);
    }
  } catch (error) {
    console.log(error);
    setErrorMessage(`Error fetching Movies, please try again later`)
  } finally {
    setisLoading(false);
  }
}

  // Bei Suchbegriff zurück auf Seite 1 und neue Suche
  useEffect(() => {
    setMoviePage(1);
    fetchMovies(debouncedSearchTerm, 1);
    // eslint-disable-next-line
  }, [debouncedSearchTerm])

  // Bei Seitenwechsel weitere Filme laden (auch bei Suche)
  useEffect(() => {
    if (moviePage > 1) {
      fetchMovies(debouncedSearchTerm, moviePage);
    }
    // eslint-disable-next-line
  }, [moviePage])

  const load_more = () => {
    setMoviePage(prev => prev + 1);
  }

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <TypeSelect />
          <header>
            <img src="./hero.png" alt="Hero Banner" />
            <h1>Find <span className="text-gradient">Movies</span></h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          <section className="all-movies">
            <h2 className='mt-[40px]'>Movies</h2>

            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className='text-red-500'>{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
          </section>
          <div className='load-button' onClick={load_more}>Mehr anzeigen</div>
        </div>
      </div>
    </main>
  )
}

export default MovieList