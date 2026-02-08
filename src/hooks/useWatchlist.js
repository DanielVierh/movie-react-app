import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "watchlist:v1";

const readStorage = () => {
  if (typeof window === "undefined") return { movies: [], series: [] };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { movies: [], series: [] };

    const parsed = JSON.parse(raw);
    const movies = Array.isArray(parsed?.movies) ? parsed.movies : [];
    const series = Array.isArray(parsed?.series) ? parsed.series : [];

    return { movies, series };
  } catch {
    return { movies: [], series: [] };
  }
};

const writeStorage = (value) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // ignore write errors (e.g., private mode / quota)
  }
};

const normalizeMovie = (movie) => {
  if (!movie) return null;
  return {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path ?? null,
    release_date: movie.release_date ?? null,
    vote_average: movie.vote_average ?? null,
    original_language: movie.original_language ?? null,
  };
};

const normalizeSeries = (series) => {
  if (!series) return null;
  return {
    id: series.id,
    name: series.name,
    poster_path: series.poster_path ?? null,
    first_air_date: series.first_air_date ?? null,
    vote_average: series.vote_average ?? null,
    original_language: series.original_language ?? null,
  };
};

export default function useWatchlist() {
  const [state, setState] = useState(() => readStorage());

  useEffect(() => {
    writeStorage(state);
  }, [state]);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== STORAGE_KEY) return;
      setState(readStorage());
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isMovieInWatchlist = useCallback(
    (id) => state.movies.some((m) => m?.id === id),
    [state.movies],
  );

  const isSeriesInWatchlist = useCallback(
    (id) => state.series.some((s) => s?.id === id),
    [state.series],
  );

  const addMovie = useCallback((movie) => {
    const item = normalizeMovie(movie);
    if (!item?.id) return;

    setState((prev) => {
      if (prev.movies.some((m) => m?.id === item.id)) return prev;
      return { ...prev, movies: [item, ...prev.movies] };
    });
  }, []);

  const removeMovie = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      movies: prev.movies.filter((m) => m?.id !== id),
    }));
  }, []);

  const addSeries = useCallback((series) => {
    const item = normalizeSeries(series);
    if (!item?.id) return;

    setState((prev) => {
      if (prev.series.some((s) => s?.id === item.id)) return prev;
      return { ...prev, series: [item, ...prev.series] };
    });
  }, []);

  const removeSeries = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      series: prev.series.filter((s) => s?.id !== id),
    }));
  }, []);

  const api = useMemo(
    () => ({
      movies: state.movies,
      series: state.series,
      isMovieInWatchlist,
      isSeriesInWatchlist,
      addMovie,
      removeMovie,
      addSeries,
      removeSeries,
    }),
    [
      state.movies,
      state.series,
      isMovieInWatchlist,
      isSeriesInWatchlist,
      addMovie,
      removeMovie,
      addSeries,
      removeSeries,
    ],
  );

  return api;
}
