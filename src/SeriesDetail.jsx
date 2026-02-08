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

function SeriesDetail() {
  const { id } = useParams();
  const [series, setSeries] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [ageRating, setAgeRating] = useState(null);
  const [ageRatingLoading, setAgeRatingLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [recommondations, setRecommondations] = useState([]);
  const [recommondationsLoading, setRecommondationsLoading] = useState(true);
  const [credits, setCredits] = useState([]);
  const [creditsLoading, setCreditsLoading] = useState(true);

  const { addSeries, removeSeries, isSeriesInWatchlist } = useWatchlist();

  useEffect(() => {
    const fetchSeries = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_BASE_URL}/tv/${id}`, API_OPTIONS);
        if (!response.ok) throw new Error("Serie konnte nicht geladen werden");
        const data = await response.json();
        setSeries(data);
        console.log("Series Details", data);
      } catch (err) {
        console.log(err);

        setError("Fehler beim Laden des Films.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSeries();
  }, [id]);

  useEffect(() => {
    const fetchAgeRating = async () => {
      setAgeRatingLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/tv/${id}/content_ratings`,
          API_OPTIONS,
        );
        if (!response.ok)
          throw new Error("Altersfreigabe konnte nicht geladen werden");
        const data = await response.json();

        const results = Array.isArray(data?.results) ? data.results : [];

        const pick = (country) => {
          const entry = results.find((r) => r?.iso_3166_1 === country);
          const rating =
            typeof entry?.rating === "string" ? entry.rating.trim() : "";
          return rating || null;
        };

        const de = pick("DE");
        const us = pick("US");

        const chosen = de
          ? { country: "DE", value: de }
          : us
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

  //* Credits
  useEffect(() => {
    const fetchCredits = async () => {
      setCreditsLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/tv/${id}/credits`,
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
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/tv/${id}/reviews?language=en-US&page=1`,
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

  useEffect(() => {
    const fetchImages = async () => {
      setImagesLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/tv/${id}/images`,
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

  useEffect(() => {
    const fetchSimilar = async () => {
      setRecommondationsLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/tv/${id}/recommendations?language=en-US&page=1`,
          API_OPTIONS,
        );
        if (!response.ok)
          throw new Error("Ähnliche Filme konnten nicht geladen werden");
        const data = await response.json();
        setRecommondations(data.results || []);
      } catch (err) {
        console.log(err);
        setRecommondations([]);
      } finally {
        setRecommondationsLoading(false);
      }
    };
    fetchSimilar();
  }, [id]);

  if (isLoading) return <p>Lade...</p>;
  if (error)
    return (
      <div>
        <p className="text-red-500">{error}</p>
        <Link to="/">Zurück zur Liste</Link>
      </div>
    );
  if (!series) return null;

  const seriesId = Number(id);
  const inWatchlist =
    Number.isFinite(seriesId) && isSeriesInWatchlist(seriesId);

  return (
    <div className="p-8 max-w-xl mx-auto text-white">
      <StickyHeader title={series.name} link_to_main={"/Series"} />
      <img
        src={
          series.poster_path
            ? `https://image.tmdb.org/t/p/w500/${series.poster_path}`
            : "/no-movie.png"
        }
        alt={series.name}
        className="mb-4 rounded-lg mt-20"
      />
      <h2 className="text-2xl font-bold mb-2">
        {series.name} ({series.first_air_date?.split("-")[0]})
      </h2>

      <button
        type="button"
        className="type-cta"
        onClick={() => {
          if (!Number.isFinite(seriesId)) return;
          if (inWatchlist) removeSeries(seriesId);
          else addSeries(series);
        }}
      >
        {inWatchlist ? "Aus Watchlist entfernen" : "Zur Watchlist hinzufügen"}
      </button>

      <p className="mb-4">{series.overview}</p>
      <p>Sprache: {series.original_language}</p>
      <p>
        FSK:{" "}
        {ageRatingLoading
          ? "Lade..."
          : ageRating?.country === "DE"
            ? ageRating.value
            : "-"}
        {ageRating?.country === "US" ? ` (US: ${ageRating.value})` : ""}
      </p>
      <p>Laufzeit: {series.runtime === 0 ? "-" : series.runtime} Minuten</p>
      <p>
        Release Datum:{" "}
        {series.first_air_date
          ? (() => {
              const [year, month, day] = series.first_air_date.split("-");
              return `${day}.${month}.${year}`;
            })()
          : ""}
      </p>
      <p>
        Bewertung:{" "}
        {series.vote_average === 0 ? "-" : series.vote_average?.toFixed(1)} (
        {series.vote_count === 0
          ? "-"
          : series.vote_count.toLocaleString("de-DE")}{" "}
        Bewertungen)
      </p>
      <p>Anzahl Staffeln: {series.number_of_seasons}</p>
      <p>Anzahl Folgen: {series.number_of_episodes}</p>
      {series.genres && series.genres.length > 0 && (
        <div className="mb-4">
          <span className="font-semibold">Genres: </span>
          {series.genres.map((genre, idx) => (
            <span key={genre.id}>
              {genre.name}
              {idx < series.genres.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>
      )}
      <br />
      <div className="mb-6">
        {imagesLoading ? (
          <p>Lade Bilder...</p>
        ) : (
          <SwiperSlides headline="Bilder" images={images} />
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
        {recommondationsLoading ? (
          <p>Lade Empfehlungen...</p>
        ) : recommondations.length === 0 ? (
          <p>Keine Empfehlungen gefunden.</p>
        ) : (
          <ul className="space-y-4">
            {recommondations.map((sim) => (
              <Recommondations
                key={sim.id}
                title={sim.name}
                poster_path={sim.poster_path}
                id={sim.id}
                release_date={sim.first_air_date}
                vote_average={sim.vote_average}
                type="series"
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SeriesDetail;
