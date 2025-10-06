import React, { useEffect, useState, useRef } from "react";
import Masonry from "react-masonry-css";
import CustomLightbox from "./CustomLightBox";
import Categories from "./Categories";
import UploadPhoto from "./UploadPhoto";
import { Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
import "./Landscapes.css";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Landscapes() {
  const [landscapes, setLandscapes] = useState([]);
  const [category, setCategory] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const wrapperRef = useRef(null);

  const breakpointColumnsObj = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1,
  };

  const fetchLandscapes = async () => {
    setError(null);
    setLoading(true);

    try {
      const url = category
        ? `${API_URL}/api/Landscapes/category/${category}`
        : `${API_URL}/api/Landscapes`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch landscapes`);
      }

      const data = await res.json();
      setLandscapes(data);

      if (data.length === 0) {
        setError(`No landscapes found for category "${category || "All"}".`);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch landscapes");
      setLandscapes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLandscapes();
  }, [category]);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="page-container">
      <div className="home-container">
        <div className="category-container">
          <div className="category-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Explore Landscapes</span>
            <Button variant="contained" color="primary" onClick={() => setUploadModalOpen(true)}>
              Upload Photo
            </Button>
          </div>

          <Categories category={category} setCategory={setCategory} />
        </div>

        {loading && <div className="loading">Loading Landscapes...</div>}
        {!loading && error && <div className="error-message">{error}</div>}

        <div ref={wrapperRef} className={`masonry-wrapper fade-in ${loading ? "hidden" : ""}`}>
          {landscapes.length === 0 && !error ? (
            <p className="no-results">No landscapes to display.</p>
          ) : (
            <Masonry breakpointCols={breakpointColumnsObj} className="my-masonry-grid masonry-item" columnClassName="my-masonry-grid_column">
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
            onPrev={() => setCurrentIndex((currentIndex + landscapes.length - 1) % landscapes.length)}
            onNext={() => setCurrentIndex((currentIndex + 1) % landscapes.length)}
          />
        )}

        {/* Upload Modal */}
        <Dialog open={uploadModalOpen} onClose={() => setUploadModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Upload New Landscape</DialogTitle>
          <DialogContent>
            <UploadPhoto
              onUploadSuccess={() => {
                fetchLandscapes(); // Refresh gallery
                setUploadModalOpen(false); // Close modal
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
