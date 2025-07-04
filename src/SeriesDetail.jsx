import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Review from "./components/Review";

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
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    const fetchSeries = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(
          `${API_BASE_URL}/tv/${id}`,
          API_OPTIONS
        );
        if (!response.ok) throw new Error("Serie konnte nicht geladen werden");
        const data = await response.json();
        setSeries(data);
        console.log('Series Details', data);
        
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
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/tv/${id}/reviews?language=en-US&page=1`,
          API_OPTIONS
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

  if (isLoading) return <p>Lade...</p>;
  if (error)
    return (
      <div>
        <p className="text-red-500">{error}</p>
        <Link to="/">Zurück zur Liste</Link>
      </div>
    );
  if (!series) return null;

const handleGoBack = () => {
    window.history.length > 1 ? window.history.back() : window.location.assign("/");
};

return (
    <div className="p-8 max-w-xl mx-auto text-white">
        <img
            src={
                series.poster_path
                    ? `https://image.tmdb.org/t/p/w500/${series.poster_path}`
                    : "/no-movie.png"
            }
            alt={series.name}
            className="mb-4 rounded-lg"
        />
        <h2 className="text-2xl font-bold mb-2">
            {series.name} ({series.first_air_date?.split("-")[0]})
        </h2>
        <p className="mb-4">{series.overview}</p>
        <p>Sprache: {series.original_language}</p>
        <p>Laufzeit: {series.runtime === 0 ? "-" : series.runtime} Minuten</p>
        <p>
            Release Datum:{" "}
            {series.first_air_date
                ? (() => {
                        const [year, month, day] = series.first_air_date.split('-');
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
        <p>
            Anzahl Staffeln:{" "}
            {series.number_of_seasons}
        </p>
        <p>
            Anzahl Folgen: {" "}
            {series.number_of_episodes}
        </p>
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
        <button
            onClick={handleGoBack}
            className="text-blue-400 underline mt-4 block"
        >
            Zurück
        </button>

        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2">Reviews</h3>
            {reviewsLoading ? (
                <p>Lade Reviews...</p>
            ) : reviews.length === 0 ? (
                <p>Keine Reviews vorhanden.</p>
            ) : (
                <ul className="space-y-4">
                    {reviews.map((review) => (
                        <Review key={review.id} review={review}/>
                    ))}
                </ul>
            )}
        </div>
    </div>
);
}

export default SeriesDetail;
