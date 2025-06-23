import React from "react";

const Review = ({review}) => {
  return (
    <div>
      <li key={review.id} className="bg-gray-800 p-4 rounded">
        <p className="font-bold">{review.author}</p>
        <p>
          Rating:{" "}
          {review.author_details.rating === 0
            ? "-"
            : review.author_details.rating}
        </p>
        <p className="text-sm text-gray-300">{review.content}</p>
      </li>
    </div>
  );
};

export default Review;
