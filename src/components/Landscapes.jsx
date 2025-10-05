import React, { useEffect, useState, useRef } from "react";
import Masonry from "react-masonry-css";
import CustomLightbox from "./CustomLightBox";
import Categories from "./Categories";
import "./Landscapes.css";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Landscapes() {
  const [landscapes, setLandscapes] = useState([]);
  const [category, setCategory] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const wrapperRef = useRef(null);

  const breakpointColumnsObj = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1,
  };

  useEffect(() => {
    const fetchLandscapes = async () => {
      setError(null);
      setLoading(true);

      const wrapper = wrapperRef.current;
      if (wrapper) wrapper.style.minHeight = `${wrapper.offsetHeight}px`;

      try {
        const url = category
          ? `${API_URL}/api/Landscapes/category/${category}`
          : `${API_URL}/api/Landscapes`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch landscapes");

        const data = await res.json();
        setLandscapes(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Clear grid instantly before loading new data
    setLandscapes([]);
    fetchLandscapes();
  }, [category]);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="page-container">
      <div className="home-container">
        <h2>Landscapes Gallery</h2>

        {/* Categories Component */}
        <Categories category={category} setCategory={setCategory} />

        {error && <div className="error">Error: {error}</div>}
        {loading && <div className="loading">Loading Landscapes...</div>}

        <div ref={wrapperRef} className="masonry-wrapper">
          {!loading && landscapes.length === 0 && (
            <p className="no-results">No landscapes found for this category.</p>
          )}

          {!loading && landscapes.length > 0 && (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid masonry-item"
              columnClassName="my-masonry-grid_column"
            >
              {landscapes.map((l, index) => (
                <img
                  key={`cur-${l.id}-${index}`}
                  src={l.thumbnail}
                  alt={l.title || "Landscape"}
                  onClick={() => openLightbox(index)}
                  loading="lazy"
                  className="masonry-image"
                />
              ))}
            </Masonry>
          )}
        </div>

        {lightboxOpen && (
          <CustomLightbox
            photos={landscapes.map((l) => ({ ...l, thumbnail: l.full }))}
            currentIndex={currentIndex}
            onClose={() => setLightboxOpen(false)}
            onPrev={() =>
              setCurrentIndex((currentIndex + landscapes.length - 1) % landscapes.length)
            }
            onNext={() => setCurrentIndex((currentIndex + 1) % landscapes.length)}
          />
        )}
      </div>
    </div>
  );
}
