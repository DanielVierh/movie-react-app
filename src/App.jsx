import React, { useEffect, useState } from 'react'
import Search from './components/Search.jsx'
import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('')
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const fetchMovies = async (query = '') => {
    setisLoading(true);
    setErrorMessage('');
    try {
      const endpoint = query ? 
      `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`:
      `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS)
      if(!response.ok) {
        throw new Error('Filme konnten nicht geladen werden');
      }
      const data = await response.json();
      if(data.Response === 'false') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);
      console.log(data);
      

    } catch (error) {
      console.log('Error fetching Movies', error);
      setErrorMessage(`Error fetching Movies, please try again later`)
    }finally {
      setisLoading(false);
    }
  }

  //* runs at the start and if dependency (searchterm) is changing
  useEffect(() => {
    fetchMovies(searchTerm);
  }, [searchTerm])

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="./hero.png" alt="Hero Banner" />
            <h1>Find the <span className="text-gradient">Movies</span> You'll Enjoy Without the Hussle</h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          <section className="all-movies">
            <h2 className='mt-[40px]'>All Movies</h2>
            
            {isLoading ? (
              <Spinner/>
            ): errorMessage ? (
               <p className='text-red-500'>{errorMessage}</p>
            ): (
              <ul>
                {movieList.map((movie)=>(
                  <MovieCard key={movie.id} movie={movie}/>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

export default App
