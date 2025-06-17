import React, { useEffect, useState } from 'react'
import Search from './components/Search.jsx'

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
  const fetchMovies = async () => {
    setisLoading(true);
    setErrorMessage('');
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
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

  useEffect(() => {
    fetchMovies();
  }, [])

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
            <h2>All Movies</h2>
            
            {isLoading ? (
              <p className='text-white'>Loading...</p>
            ): errorMessage ? (
               <p className='text-red-500'>{errorMessage}</p>
            ): (
              <ul>
                {movieList.map((movie)=>(
                  <p key={movie.id} className='text-white'>{movie.title}</p>
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
