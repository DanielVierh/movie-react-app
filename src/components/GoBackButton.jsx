import React from "react";

const GoBackButton = () => {
  const handleGoBack = () => {
    window.history.length > 1
      ? window.history.back()
      : window.location.assign("/");
  };
  return (
    <button
      onClick={handleGoBack}
      className="type-cta"
    >
      Zurück
    </button>
  );
};

export default GoBackButton;
