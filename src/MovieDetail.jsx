// ...existing imports...
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE_URL}/movie/${id}`, API_OPTIONS);
        if (!response.ok) throw new Error('Film konnte nicht geladen werden');
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        console.log(err);
        
        setError('Fehler beim Laden des Films.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/movie/${id}/reviews?language=en-US&page=1`, API_OPTIONS);
        if (!response.ok) throw new Error('Reviews konnten nicht geladen werden');
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
  if (error) return (
    <div>
      <p className="text-red-500">{error}</p>
      <Link to="/">Zurück zur Liste</Link>
    </div>
  );
  if (!movie) return null;

return (
    <div className="p-8 max-w-xl mx-auto text-white">
            <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '/no-movie.png'} alt={movie.title} className="mb-4 rounded-lg" />
            <h2 className="text-2xl font-bold mb-2">{movie.title} ({movie.release_date?.split('-')[0]})</h2>
            <p className="mb-4">{movie.overview}</p>
            <p>Sprache: {movie.original_language}</p>
            <p>Laufzeit: {movie.runtime === 0 ? '-' : movie.runtime} Minuten</p>
            <p>
                Release Datum:{" "}
                {movie.release_date
                    ? new Date(movie.release_date).toLocaleDateString("de-DE")
                    : ""}
            </p>
            <p>Bewertung: {movie.vote_average === 0 ? '-' : movie.vote_average?.toFixed(1)} ({movie.vote_count === 0 ? '-' : movie.vote_count.toLocaleString('de-DE')} Bewertungen)</p>
            <p>Budget: {movie.budget === 0 ? '-' : movie.budget.toLocaleString('de-DE')} $</p>
            {movie.genres && movie.genres.length > 0 && (
                    <div className="mb-4">
                            <span className="font-semibold">Genres: </span>
                            {movie.genres.map((genre, idx) => (
                                    <span key={genre.id}>
                                            {genre.name}{idx < movie.genres.length - 1 ? ', ' : ''}
                                    </span>
                            ))}
                    </div>
            )}
        <Link to="/" className="text-blue-400 underline mt-4 block">Zurück zur Liste</Link>

        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2">Reviews</h3>
            {reviewsLoading ? (
                <p>Lade Reviews...</p>
            ) : reviews.length === 0 ? (
                <p>Keine Reviews vorhanden.</p>
            ) : (
                <ul className="space-y-4">
                    {reviews.map(review => (
                        <li key={review.id} className="bg-gray-800 p-4 rounded">
                            <p className="font-bold">{review.author}</p>
                            <p>Rating: {review.author_details.rating === 0 ? '-' : review.author_details.rating}</p>
                            <p className="text-sm text-gray-300">{review.content}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    </div>
);
}

export default MovieDetail;