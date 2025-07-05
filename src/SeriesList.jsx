import React, { useEffect, useState } from 'react'
import Search from './components/Search.jsx'
import Spinner from './components/Spinner.jsx';
import SeriesCard from './components/SeriesCard.jsx';
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

const SeriesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('')
  const [SeriesList, setSeriesList] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [debouncedSearchTerm, setdebouncedSearchTerm] = useState('');

  useDebounce(()=>setdebouncedSearchTerm(searchTerm), 1000, [searchTerm])

  const fetchSeries = async (query = '') => {
    setisLoading(true);
    setErrorMessage('');
    try {
      const endpoint = query ?
        `${API_BASE_URL}/search/series?query=${encodeURIComponent(query)}` :
        `${API_BASE_URL}/trending/tv/day?language=en-US`;
      const response = await fetch(endpoint, API_OPTIONS)
      if (!response.ok) {
        throw new Error('Filme konnten nicht geladen werden');
      }
      const data = await response.json();
      if (data.Response === 'false') {
        setErrorMessage(data.Error || 'Failed to fetch Series');
        setSeriesList([]);
        return;
      }
      setSeriesList(data.results || []);
      console.log('Series', data);
      
    } catch (error) {
      console.log(error);
      
      setErrorMessage(`Error fetching Series, please try again later`)
    } finally {
      setisLoading(false);
    }
  }

  //* runs at the start and if dependency (searchterm) is changing
  useEffect(() => {
    fetchSeries(debouncedSearchTerm);
  }, [debouncedSearchTerm])

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <TypeSelect />
          <header>
            <img src="./hero.png" alt="Hero Banner" />
            <h1>Find the <span className="text-gradient">Series</span> You'll Enjoy Without the Hussle</h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          <section className="all-Series">
            <h2 className='mt-[40px]'>Series</h2>

            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className='text-red-500'>{errorMessage}</p>
            ) : (
              <ul>
                {SeriesList.map((series) => (
                  <SeriesCard key={series.id} series={series} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

export default SeriesList