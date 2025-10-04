import React, { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import "./Home.css";
import CustomLightbox from "./CustomLightBox";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Home() {
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/photos`);
        if (!res.ok) throw new Error("Failed to fetch photos");
        setPhotos(await res.json());
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    })();
  }, []);

  const breakpoints = {
    default: 3,
    1100: 2,
    700: 1,
  };

  const handlePrev = () => {
    setPhotoIndex((photoIndex + photos.length - 1) % photos.length);
  };

  const handleNext = () => {
    setPhotoIndex((photoIndex + 1) % photos.length);
  };

  return (
    <div className="page-container">
      <div className="home-container">
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {!error && photos.length === 0 && <p>No photos found.</p>}

        <Masonry
          breakpointCols={breakpoints}
          className="my-masonry-grid masonry-item"
          columnClassName="my-masonry-grid_column"
        >
          {photos.map((photo, i) => (
            <img
              key={photo.id}
              src={photo.thumbnail}
              alt={photo.title}
              className="masonry-image"

              onClick={() => {
                setPhotoIndex(i);
                setLightboxOpen(true);
              }}
            />
          ))}
        </Masonry>

        {lightboxOpen && (
          <CustomLightbox
            photos={photos}
            currentIndex={photoIndex}
            onClose={() => setLightboxOpen(false)}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </div>
    </div>
  );
}
