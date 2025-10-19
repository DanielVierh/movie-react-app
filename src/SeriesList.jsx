import React, { useEffect, useState } from "react";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import SeriesCard from "./components/SeriesCard.jsx";
import TypeSelect from "./components/TypeSelect.jsx";
import { useDebounce } from "react-use";

const API_BASE_URL = "https://api.themoviedb.org/3";
const SCRT = import.meta.env.VITE_TMDB;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${SCRT}`,
  },
};

const SeriesList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [seriesList, setSeriesList] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [debouncedSearchTerm, setdebouncedSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useDebounce(() => setdebouncedSearchTerm(searchTerm), 1000, [searchTerm]);

  const fetchSeries = async (query = "", pageNum = 1, append = false) => {
    setisLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/tv?query=${encodeURIComponent(
            query
          )}&page=${pageNum}`
        : `${API_BASE_URL}/trending/tv/week?language=en-US&page=${pageNum}`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Filme konnten nicht geladen werden");
      }
      const data = await response.json();
      if (data.Response === "false") {
        setErrorMessage(data.Error || "Failed to fetch Series");
        setSeriesList([]);
        setHasMore(false);
        return;
      }
      if (append) {
        setSeriesList((prev) => [...prev, ...(data.results || [])]);
      } else {
        setSeriesList(data.results || []);
      }
      setHasMore(data.page < data.total_pages);
    } catch (error) {
      console.log(error);
      setErrorMessage(`Error fetching Series, please try again later`);
      setHasMore(false);
    } finally {
      setisLoading(false);
    }
  };

  // Bei Suchbegriff oder Start zurücksetzen
  useEffect(() => {
    setPage(1);
    fetchSeries(debouncedSearchTerm, 1, false);
  }, [debouncedSearchTerm]);

  // Lade mehr Funktion
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchSeries(debouncedSearchTerm, nextPage, true);
  };

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          {/* <TypeSelect type="series"/> */}
          <header>
            <img src="./hero.png" alt="Hero Banner" />
            <h1>
              Find <span className="text-gradient">Series</span>
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          <section className="all-Series">
            <h2 className="mt-[40px]">Series</h2>

            {isLoading && page === 1 ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <>
                <ul>
                  {seriesList.map((series) => (
                    <SeriesCard key={series.id} series={series} />
                  ))}
                </ul>
                {hasMore && (
                  <button
                    className="load-button"
                    onClick={handleLoadMore}
                    disabled={isLoading}
                  >
                    {isLoading ? "Lädt..." : "Lade mehr"}
                  </button>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default SeriesList;
