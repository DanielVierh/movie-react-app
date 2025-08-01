import React from "react";
import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const {
    id,
    title,
    vote_average,
    poster_path,
    release_date,
    original_language,
  } = movie;
  return (
    <Link
      to={`/movie/${id}`}
      onClick={(e) => {
        e.preventDefault();
        window.open(`/movie/${id}`, "_blank", "noopener,noreferrer");
      }}
    >
      <div className="movie-card cursor-pointer hover:shadow-lg transition">
        <img
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500/${poster_path}`
              : "/no-movie.png"
          }
          alt={title}
        />
        <div className="mt-4">
          <h3>{title}</h3>
        </div>
        <div className="content">
          <div className="rating">
            <img src="star.svg" alt="Star Icon" />
            <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
            <span>•</span>
            <p className="lang">{original_language}</p>
            <span>•</span>
            <p className="year">
              {release_date ? release_date.split("-")[0] : "-"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
