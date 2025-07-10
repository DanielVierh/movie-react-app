import React from "react";

const TypeSelect = ({ type }) => {
  return (
    <div className="wrapper">
      <div className="flex">
        <a
          href="/"
          className={`type-cta ${type === "movies" ? "active" : ""}`}
        >
          Movies
        </a>
        <a href="/series" className={`type-cta ${type === "series" ? "active" : ""}`}>
          Series
        </a>
      </div>
    </div>
  );
};

export default TypeSelect;
