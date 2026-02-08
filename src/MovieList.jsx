import React, { useEffect, useRef, useState } from "react";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
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

const MovieList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [debouncedSearchTerm, setdebouncedSearchTerm] = useState("");
  const [moviePage, setMoviePage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pendingScrollRestoreY = useRef(null);

  const MOVIE_BROWSE_MODES = [
    { key: "now_playing", label: "Neu im Kino" },
    { key: "popular", label: "Beliebt" },
    { key: "top_rated", label: "Top bewertet" },
    { key: "upcoming", label: "Neuerscheinungen" },
    { key: "top_100", label: "Top 100" },
  ];
  const [browseMode, setBrowseMode] = useState("now_playing");

  useDebounce(() => setdebouncedSearchTerm(searchTerm), 1000, [searchTerm]);

  const fetchMovies = async (query = "", page = 1, mode = "now_playing") => {
    setisLoading(true);
    setErrorMessage("");
    try {
      const effectiveMode = mode === "top_100" ? "top_rated" : mode;
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
            query,
          )}&page=${page}`
        : `${API_BASE_URL}/movie/${effectiveMode}?page=${page}`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Filme konnten nicht geladen werden");
      }
      const data = await response.json();
      if (data.Response === "false") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]);
        setHasMore(false);
        return;
      }

      if (page > 1) {
        setMovieList((prev) => [...prev, ...(data.results || [])]);
      } else {
        setMovieList(data.results || []);
      }

      const totalPages =
        typeof data.total_pages === "number" ? data.total_pages : 1;
      const pageLimit = mode === "top_100" ? 5 : totalPages;
      setHasMore(page < Math.min(totalPages, pageLimit));
    } catch (error) {
      console.log(error);
      setErrorMessage(`Error fetching Movies, please try again later`);
      setHasMore(false);
    } finally {
      setisLoading(false);
    }
  };

  // Bei Suchbegriff zurück auf Seite 1 und neue Suche
  useEffect(() => {
    setMoviePage(1);
    fetchMovies(debouncedSearchTerm, 1, browseMode);
  }, [debouncedSearchTerm, browseMode]);

  // Bei Seitenwechsel weitere Filme laden (auch bei Suche)
  useEffect(() => {
    if (moviePage > 1) {
      fetchMovies(debouncedSearchTerm, moviePage, browseMode);
    }
    // eslint-disable-next-line
  }, [moviePage]);

  const load_more = () => {
    pendingScrollRestoreY.current = window.scrollY;
    setMoviePage((prev) => prev + 1);
  };

  useEffect(() => {
    if (pendingScrollRestoreY.current == null) return;
    const y = pendingScrollRestoreY.current;
    pendingScrollRestoreY.current = null;

    requestAnimationFrame(() => {
      window.scrollTo({ top: y });
    });
  }, [movieList.length]);

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          {/* <TypeSelect type="movies"/> */}
          <header>
            <img src="./hero.png" alt="Hero Banner" />
            <h1>
              Find <span className="text-gradient">Movies</span>
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {MOVIE_BROWSE_MODES.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  className={`type-cta ${browseMode === m.key ? "active" : ""}`}
                  onClick={() => {
                    setBrowseMode(m.key);
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </header>

          <section className="all-movies">
            <h2 className="mt-[40px]">
              Movies
              {debouncedSearchTerm
                ? ` – Suche: ${debouncedSearchTerm}`
                : ` – ${
                    MOVIE_BROWSE_MODES.find((m) => m.key === browseMode)
                      ?.label ?? ""
                  }`}
            </h2>

            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
          </section>
          {hasMore && !isLoading && (
            <button type="button" className="load-button" onClick={load_more}>
              Mehr anzeigen
            </button>
          )}
          {isLoading && moviePage > 1 && <Spinner />}
        </div>
      </div>
    </main>
  );
};

export default MovieList;
