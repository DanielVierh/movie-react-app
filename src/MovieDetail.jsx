import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Review from "./components/Review";
import StickyHeader from "./components/StickyHeader";
import Recommondations from "./components/Recommondations";
import SwiperSlides from "./components/SwiperSlides";
import CreditsCard from "./components/CreditsCards";
import useWatchlist from "./hooks/useWatchlist";

const API_BASE_URL = "https://api.themoviedb.org/3";
const SCRT = import.meta.env.VITE_TMDB;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${SCRT}`,
  },
};

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [ageRating, setAgeRating] = useState(null);
  const [ageRatingLoading, setAgeRatingLoading] = useState(true);
  const [watchProviders, setWatchProviders] = useState(null);
  const [watchProvidersLoading, setWatchProvidersLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [similar, setSimilar] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [credits, setCredits] = useState([]);
  const [creditsLoading, setCreditsLoading] = useState(true);

  const { addMovie, removeMovie, isMovieInWatchlist } = useWatchlist();

  useEffect(() => {
    const fetchMovie = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(
          `${API_BASE_URL}/movie/${id}`,
          API_OPTIONS,
        );
        if (!response.ok) throw new Error("Film konnte nicht geladen werden");
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        console.log(err);

        setError("Fehler beim Laden des Films.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  useEffect(() => {
    const fetchAgeRating = async () => {
      setAgeRatingLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/movie/${id}/release_dates`,
          API_OPTIONS,
        );
        if (!response.ok)
          throw new Error("Altersfreigabe konnte nicht geladen werden");
        const data = await response.json();

        const results = Array.isArray(data?.results) ? data.results : [];

        const pickCertification = (country) => {
          const entry = results.find((r) => r?.iso_3166_1 === country);
          const dates = Array.isArray(entry?.release_dates)
            ? entry.release_dates
            : [];
          const cert = dates
            .map((d) =>
              typeof d?.certification === "string"
                ? d.certification.trim()
                : "",
            )
            .find((c) => c);
          return cert || null;
        };

        const de = pickCertification("DE");
        const us = pickCertification("US");

        const chosen =
          de && de !== "0"
            ? { country: "DE", value: de }
            : us && us !== "0"
              ? { country: "US", value: us }
              : null;
        setAgeRating(chosen);
      } catch (err) {
        console.log(err);
        setAgeRating(null);
      } finally {
        setAgeRatingLoading(false);
      }
    };

    fetchAgeRating();
  }, [id]);

  useEffect(() => {
    const fetchWatchProviders = async () => {
      setWatchProvidersLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/movie/${id}/watch/providers`,
          API_OPTIONS,
        );
        if (!response.ok)
          throw new Error("Streaming-Infos konnten nicht geladen werden");
        const data = await response.json();

        const results =
          data?.results && typeof data.results === "object" ? data.results : {};

        const pickCountry = (code) => {
          const entry = results?.[code];
          return entry && typeof entry === "object" ? entry : null;
        };

        const chosen =
          pickCountry("DE") ||
          pickCountry("AT") ||
          pickCountry("CH") ||
          pickCountry("US") ||
          pickCountry(Object.keys(results)[0]);

        setWatchProviders(chosen);
      } catch (err) {
        console.log(err);
        setWatchProviders(null);
      } finally {
        setWatchProvidersLoading(false);
      }
    };

    fetchWatchProviders();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/movie/${id}/reviews?language=en-US&page=1`,
          API_OPTIONS,
        );
        if (!response.ok)
          throw new Error("Reviews konnten nicht geladen werden");
        const data = await response.json();
        setReviews(data.results || []);
      } catch (err) {
        console.log(err);

        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  //* Credits
  useEffect(() => {
    const fetchCredits = async () => {
      setCreditsLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/movie/${id}/credits`,
          API_OPTIONS,
        );
        if (!response.ok)
          throw new Error("Credits konnten nicht geladen werden");
        const data = await response.json();
        console.log("Raw_Data", data.cast);

        setCredits(data.cast || []);
      } catch (err) {
        console.log(err);
        setCredits([]);
      } finally {
        setCreditsLoading(false);
      }
    };
    fetchCredits();
  }, [id]);

  useEffect(() => {
    const fetchSimilar = async () => {
      setSimilarLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/movie/${id}/recommendations?language=en-US&page=1`,
          API_OPTIONS,
        );
        if (!response.ok)
          throw new Error("Ähnliche Filme konnten nicht geladen werden");
        const data = await response.json();
        setSimilar(data.results || []);
      } catch (err) {
        console.log(err);
        setSimilar([]);
      } finally {
        setSimilarLoading(false);
      }
    };
    fetchSimilar();
  }, [id]);

  useEffect(() => {
    const fetchImages = async () => {
      setImagesLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/movie/${id}/images`,
          API_OPTIONS,
        );
        if (!response.ok)
          throw new Error("Bilder konnten nicht geladen werden");
        const data = await response.json();
        setImages(data.backdrops || []);
      } catch (err) {
        console.log(err);
        setImages([]);
      } finally {
        setImagesLoading(false);
      }
    };
    fetchImages();
  }, [id]);

  if (isLoading) return <p>Lade...</p>;
  if (error)
    return (
      <div>
        <p className="text-red-500">{error}</p>
        <Link to="/">Zurück zur Liste</Link>
      </div>
    );
  if (!movie) return null;

  const movieId = Number(id);
  const inWatchlist = Number.isFinite(movieId) && isMovieInWatchlist(movieId);

  return (
    <div className="p-8 max-w-xl mx-auto text-white">
      <StickyHeader title={movie.title} link_to_main={"/"} />
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
            : "/no-movie.png"
        }
        alt={movie.title}
        className="mb-4 rounded-lg mt-20"
      />
      <h2 className="text-2xl font-bold mb-2">
        {movie.title} ({movie.release_date?.split("-")[0]})
      </h2>

      <button
        type="button"
        className="type-cta"
        onClick={() => {
          if (!Number.isFinite(movieId)) return;
          if (inWatchlist) removeMovie(movieId);
          else addMovie(movie);
        }}
      >
        {inWatchlist ? "Aus Watchlist entfernen" : "Zur Watchlist hinzufügen"}
      </button>

      <p className="mb-4">{movie.overview}</p>
      <p>Sprache: {movie.original_language}</p>
      <p>
        FSK:{" "}
        {ageRatingLoading
          ? "Lade..."
          : ageRating?.country === "DE"
            ? ageRating.value
            : "-"}
        {ageRating?.country === "US" ? ` (US: ${ageRating.value})` : ""}
      </p>
      <p>Laufzeit: {movie.runtime === 0 ? "-" : movie.runtime} Minuten</p>
      <p>
        Release Datum:{" "}
        {movie.release_date
          ? new Date(movie.release_date).toLocaleDateString("de-DE")
          : ""}
      </p>
      <p>
        Bewertung:{" "}
        {movie.vote_average === 0 ? "-" : movie.vote_average?.toFixed(1)} (
        {movie.vote_count === 0
          ? "-"
          : movie.vote_count.toLocaleString("de-DE")}{" "}
        Bewertungen)
      </p>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Streaming</h3>
        {watchProvidersLoading ? (
          <p>Lade Streaming-Infos...</p>
        ) : !watchProviders ? (
          <p className="text-gray-100">Keine Streaming-Infos verfügbar.</p>
        ) : (
          <>
            {watchProviders?.link && (
              <a
                href={watchProviders.link}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 underline"
              >
                Öffnen (JustWatch)
              </a>
            )}

            {(() => {
              const groups = [
                { key: "flatrate", label: "Streaming" },
                { key: "free", label: "Gratis" },
                { key: "ads", label: "Mit Werbung" },
                { key: "rent", label: "Leihen" },
                { key: "buy", label: "Kaufen" },
              ];

              const renderProviders = (providers) => (
                <div className="flex flex-wrap gap-2 mt-2">
                  {providers.slice(0, 10).map((p) => (
                    <div
                      key={`${p.provider_id}-${p.provider_name}`}
                      className="flex items-center gap-2 bg-dark-100/60 px-2 py-1 rounded"
                      title={p.provider_name}
                    >
                      {p.logo_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w45${p.logo_path}`}
                          alt={p.provider_name}
                          className="w-6 h-6 rounded"
                        />
                      )}
                      <span className="text-sm text-gray-100">
                        {p.provider_name}
                      </span>
                    </div>
                  ))}
                </div>
              );

              return (
                <div className="mt-2 space-y-3">
                  {groups.map((g) => {
                    const list = Array.isArray(watchProviders?.[g.key])
                      ? watchProviders[g.key]
                      : [];
                    if (list.length === 0) return null;
                    return (
                      <div key={g.key}>
                        <div className="font-semibold">{g.label}</div>
                        {renderProviders(list)}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </>
        )}
      </div>

      <p>
        Budget:{" "}
        {movie.budget === 0 ? "-" : movie.budget.toLocaleString("de-DE")} $
      </p>
      {movie.genres && movie.genres.length > 0 && (
        <div className="mb-4">
          <span className="font-semibold">Genres: </span>
          {movie.genres.map((genre, idx) => (
            <span key={genre.id}>
              {genre.name}
              {idx < movie.genres.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Bilder</h3>
        {imagesLoading ? (
          <p>Lade Bilder...</p>
        ) : (
          <SwiperSlides images={images} />
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Schauspieler</h3>
        {creditsLoading ? (
          <p>Lade Schauspieler...</p>
        ) : (
          <CreditsCard data={credits} />
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Reviews</h3>
        {reviewsLoading ? (
          <p>Lade Reviews...</p>
        ) : reviews.length === 0 ? (
          <p>Keine Reviews vorhanden.</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <Review key={review.id} review={review} />
            ))}
          </ul>
        )}
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Empfehlungen</h3>
        {similarLoading ? (
          <p>Lade Empfehlungen...</p>
        ) : similar.length === 0 ? (
          <p>Keine Empfehlungen gefunden.</p>
        ) : (
          <ul className="space-y-4">
            {similar.map((sim) => (
              <Recommondations
                key={sim.id}
                title={sim.title}
                poster_path={sim.poster_path}
                id={sim.id}
                release_date={sim.release_date}
                vote_average={sim.vote_average}
                type="movie"
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MovieDetail;
