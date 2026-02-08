import React from "react";
import { Link } from "react-router-dom";
import useWatchlist from "./hooks/useWatchlist";

const Watchlist = () => {
  const { movies, series, removeMovie, removeSeries } = useWatchlist();

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <h1>
              Your <span className="text-gradient">Watchlist</span>
            </h1>
          </header>

          <section className="all-movies">
            <h2 className="mt-[40px]">Filme</h2>
            {movies.length === 0 ? (
              <p className="text-gray-100">Keine Filme in der Watchlist.</p>
            ) : (
              <ul className="grid grid-cols-1 gap-3">
                {movies.map((m) => (
                  <li
                    key={`movie-${m.id}`}
                    className="bg-dark-100 p-4 rounded-2xl shadow-inner shadow-light-100/10 flex items-center gap-4"
                  >
                    <img
                      src={
                        m.poster_path
                          ? `https://image.tmdb.org/t/p/w92/${m.poster_path}`
                          : "/no-movie.png"
                      }
                      alt={m.title}
                      className="w-16 h-24 object-cover rounded"
                    />
                    <div className="flex-1 text-left">
                      <Link
                        to={`/movie/${m.id}`}
                        className="text-white font-bold"
                      >
                        {m.title}
                      </Link>
                      <div className="text-sm text-gray-100">
                        {m.release_date ? m.release_date.split("-")[0] : "-"}
                        {m.original_language ? ` • ${m.original_language}` : ""}
                      </div>
                      <div className="text-sm text-gray-100">
                        Bewertung:{" "}
                        {m.vote_average ? m.vote_average.toFixed(1) : "-"}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="type-cta"
                      onClick={() => removeMovie(m.id)}
                    >
                      Entfernen
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="all-Series">
            <h2 className="mt-[40px]">Serien</h2>
            {series.length === 0 ? (
              <p className="text-gray-100">Keine Serien in der Watchlist.</p>
            ) : (
              <ul className="grid grid-cols-1 gap-3">
                {series.map((s) => (
                  <li
                    key={`series-${s.id}`}
                    className="bg-dark-100 p-4 rounded-2xl shadow-inner shadow-light-100/10 flex items-center gap-4"
                  >
                    <img
                      src={
                        s.poster_path
                          ? `https://image.tmdb.org/t/p/w92/${s.poster_path}`
                          : "/no-movie.png"
                      }
                      alt={s.name}
                      className="w-16 h-24 object-cover rounded"
                    />
                    <div className="flex-1 text-left">
                      <Link
                        to={`/series/${s.id}`}
                        className="text-white font-bold"
                      >
                        {s.name}
                      </Link>
                      <div className="text-sm text-gray-100">
                        {s.first_air_date
                          ? s.first_air_date.split("-")[0]
                          : "-"}
                        {s.original_language ? ` • ${s.original_language}` : ""}
                      </div>
                      <div className="text-sm text-gray-100">
                        Bewertung:{" "}
                        {s.vote_average ? s.vote_average.toFixed(1) : "-"}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="type-cta"
                      onClick={() => removeSeries(s.id)}
                    >
                      Entfernen
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Watchlist;
