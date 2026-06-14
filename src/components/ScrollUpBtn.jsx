import React from "react";
import { useEffect, useState } from "react";

const ScrollUpBtn = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    toggleVisibility();

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      className="scroll-up-btn"
      onClick={handleClick}
      aria-label="Nach oben scrollen"
      title="Nach oben"
    >
      ↑
    </button>
  );
};

export default ScrollUpBtn;
