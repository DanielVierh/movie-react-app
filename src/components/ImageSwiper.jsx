import { useState } from "react";

export default function ImageSwiper({ images }) {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) {
    return <p>Keine Bilder vorhanden.</p>;
  }

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative">
        <img
          src={`https://image.tmdb.org/t/p/w500${images[current].file_path}`}
          alt={`Movie Image ${current + 1}`}
          className="rounded-lg max-h-80"
        />
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 px-2 py-1 rounded-l text-white"
          onClick={prev}
          aria-label="Vorheriges Bild"
        >
          ◀
        </button>
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 px-2 py-1 rounded-r text-white"
          onClick={next}
          aria-label="Nächstes Bild"
        >
          ▶
        </button>
      </div>
      <div className="mt-2 text-sm text-gray-300">
        Bild {current + 1} von {images.length}
      </div>
    </div>
  );
}