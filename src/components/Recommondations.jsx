import React from "react";
import { Link } from "react-router-dom";


const Recommondations = ({poster_path, title, id, release_date, vote_average, type}) => {
  return (
    <li key={id} className="flex items-center space-x-4">
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w92/${poster_path}`
            : "/no-movie.png"
        }
        alt={title}
        className="w-16 h-24 object-cover rounded"
      />
      <div>
        <Link to={`/${type}/${id}`} className="text-blue-400 underline">
          {title}
        </Link>
        <div className="text-sm text-gray-400">
          {release_date ? release_date.split("-")[0] : ""}
        </div>
        <div className="text-sm">
          Bewertung:{" "}
          {vote_average === 0 ? "-" : vote_average?.toFixed(1)}
        </div>
      </div>
    </li>
  );
};

export default Recommondations;
