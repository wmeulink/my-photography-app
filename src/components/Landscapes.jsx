import React, { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import CustomLightbox from "./CustomLightBox";
import "./Landscapes.css";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Landscapes() {
  const [landscapes, setLandscapes] = useState([]);
  const [category, setCategory] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLandscapes = async () => {
      setLoading(true);
      setError(null);
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

    fetchLandscapes();
  }, [category]);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const breakpointColumnsObj = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1,
  };

  if (loading) return <div className="loading">Loading Landscapes...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (

    <div className="page-container">
      <div className="home-container">
      <h2>Landscapes Gallery</h2>

      {/* Category Filter */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="category-select"
      >
        <option value="">All</option>
        <option value="Trails">Trails</option>
        <option value="Flowers">Flowers</option>
        <option value="Sunrise">Sunrise</option>
        <option value="Sunset">Sunset</option>
        <option value="Foggy">Foggy</option>
        <option value="Ranch">Ranch</option>
      </select>

      {/* No Results */}
      {landscapes.length === 0 ? (
        <p className="no-results">No landscapes found for this category.</p>
      ) : (
        <Masonry
  breakpointCols={breakpointColumnsObj}
  className={`my-masonry-grid masonry-item ${
    landscapes.length === 1 ? "single-photo-grid" : ""
  }`}
  columnClassName="my-masonry-grid_column"
>
          {landscapes.map((landscape, index) => (
            <img
              key={landscape.id}
              src={landscape.thumbnail}
              alt={landscape.title || "Landscape"}
              onClick={() => openLightbox(index)}
              loading="lazy"
              className="masonry-image"
            />
          ))}
        </Masonry>
      )}

      {/* Custom Lightbox */}
      {lightboxOpen && (
        <CustomLightbox
          photos={landscapes.map((l) => ({
            ...l,
            thumbnail: l.full, // Force lightbox to use full-size images
          }))}
          currentIndex={currentIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={() =>
            setCurrentIndex(
              (currentIndex + landscapes.length - 1) % landscapes.length
            )
          }
          onNext={() =>
            setCurrentIndex((currentIndex + 1) % landscapes.length)
          }
        />
      )}
    </div>
    </div>
  );
}
