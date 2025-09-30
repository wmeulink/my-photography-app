import React, { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import "react-image-lightbox/style.css";
import Lightbox from "react-image-lightbox";
import "./Home.css";

const API_URL = import.meta.env.VITE_API_URL || "";

function Home() {
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch(`${API_URL}/api/photos`);
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Failed to fetch photos");
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Backend did not return JSON");
        }

        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("Invalid JSON structure from backend");
        }

        setPhotos(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  if (loading) return <p>Loading photos...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!photos.length) return <p>No photos found.</p>;

  return (
    <div className="home-container">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {photos.map((photo, index) => (
          <img
            key={photo.id}
            src={photo.thumbnail}
            alt={photo.title}
            style={{ width: "100%", borderRadius: "8px", cursor: "pointer" }}
            onClick={() => {
              setPhotoIndex(index);
              setLightboxOpen(true);
            }}
          />
        ))}
      </Masonry>

      {lightboxOpen && (
        <Lightbox
          mainSrc={photos[photoIndex].full}
          nextSrc={photos[(photoIndex + 1) % photos.length].full}
          prevSrc={photos[(photoIndex + photos.length - 1) % photos.length].full}
          onCloseRequest={() => setLightboxOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + photos.length - 1) % photos.length)
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % photos.length)
          }
        />
      )}
    </div>
  );
}

export default Home;
