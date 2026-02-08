import React, { useEffect, useRef, useState } from "react";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import SeriesCard from "./components/SeriesCard.jsx";
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
  const pendingScrollRestoreY = useRef(null);

  const SERIES_BROWSE_MODES = [
    { key: "trending_week", label: "Trending" },
    { key: "popular", label: "Beliebt" },
    { key: "top_rated", label: "Top bewertet" },
    { key: "on_the_air", label: "Neu im TV" },
    { key: "airing_today", label: "Heute" },
    { key: "top_100", label: "Top 100" },
  ];
  const [browseMode, setBrowseMode] = useState("trending_week");

  useDebounce(() => setdebouncedSearchTerm(searchTerm), 1000, [searchTerm]);

  const fetchSeries = async (
    query = "",
    pageNum = 1,
    append = false,
    mode = "trending_week",
  ) => {
    setisLoading(true);
    setErrorMessage("");
    try {
      const endpoint = (() => {
        if (query) {
          return `${API_BASE_URL}/search/tv?query=${encodeURIComponent(
            query,
          )}&page=${pageNum}`;
        }

        if (mode === "trending_week") {
          return `${API_BASE_URL}/trending/tv/week?language=en-US&page=${pageNum}`;
        }

        const effectiveMode = mode === "top_100" ? "top_rated" : mode;
        return `${API_BASE_URL}/tv/${effectiveMode}?language=en-US&page=${pageNum}`;
      })();
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

      const totalPages =
        typeof data.total_pages === "number" ? data.total_pages : 1;
      const pageLimit = mode === "top_100" ? 5 : totalPages;
      setHasMore(pageNum < Math.min(totalPages, pageLimit));
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
    fetchSeries(debouncedSearchTerm, 1, false, browseMode);
  }, [debouncedSearchTerm, browseMode]);

  // Lade mehr Funktion
  const handleLoadMore = () => {
    const nextPage = page + 1;
    pendingScrollRestoreY.current = window.scrollY;
    setPage(nextPage);
    fetchSeries(debouncedSearchTerm, nextPage, true, browseMode);
  };

  useEffect(() => {
    if (pendingScrollRestoreY.current == null) return;
    const y = pendingScrollRestoreY.current;
    pendingScrollRestoreY.current = null;

    requestAnimationFrame(() => {
      window.scrollTo({ top: y });
    });
  }, [seriesList.length]);

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

            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {SERIES_BROWSE_MODES.map((m) => (
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

          <section className="all-Series">
            <h2 className="mt-[40px]">
              Series
              {debouncedSearchTerm
                ? ` – Suche: ${debouncedSearchTerm}`
                : ` – ${
                    SERIES_BROWSE_MODES.find((m) => m.key === browseMode)
                      ?.label ?? ""
                  }`}
            </h2>

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
