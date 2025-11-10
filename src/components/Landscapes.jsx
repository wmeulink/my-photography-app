import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Box, Chip, Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";
import Masonry from "react-masonry-css";
import UploadPhoto from "./UploadPhoto";
import CustomLightbox from "./CustomLightBox";
import "./Landscapes.css";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Landscapes() {
  const { category: categoryParam } = useParams();

  const [landscapes, setLandscapes] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "");
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newlyUploadedId, setNewlyUploadedId] = useState(null);

  // Update category if URL changes
  useEffect(() => {
    setSelectedCategory(categoryParam || "");
  }, [categoryParam]);

  // Fetch landscapes (optionally filtered by category)
  const fetchLandscapes = async () => {
    setLoading(true);
    try {
      const url = selectedCategory
        ? `${API_URL}/api/Landscapes/category/${selectedCategory}`
        : `${API_URL}/api/Landscapes`;
      const res = await fetch(url);
      const data = await res.json();
      // Only use thumbnail endpoint for gallery
      const converted = data.map((l) => ({
        ...l,
        thumbnailSrc: `${API_URL}/api/Landscapes/${l.id}/thumb`,
        fullSrc: `${API_URL}/api/Landscapes/${l.id}/full`, // full image for lightbox
      }));
      setLandscapes(converted);
    } catch (err) {
      console.error(err);
      setLandscapes([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all tags
  const fetchTags = async () => {
    try {
      const res = await fetch(`${API_URL}/api/Tags`);
      const data = await res.json();
      setTags(data.map((t) => ({ name: t.name })));
    } catch (err) {
      console.error("Failed to fetch tags:", err);
    }
  };

  useEffect(() => {
    fetchLandscapes();
    fetchTags();
  }, [selectedCategory]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Determine visible landscapes
  const visibleLandscapes = useMemo(() => {
    if (!selectedTags.length) return landscapes;
    return landscapes.filter((l) => selectedTags.every((tag) => l.tags.includes(tag)));
  }, [selectedTags, landscapes]);

  const openLightbox = (visibleIndex) => {
    setCurrentIndex(visibleIndex);
    setLightboxOpen(true);
  };

  const breakpointColumnsObj = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1,
  };

  // Reset highlight after upload
  useEffect(() => {
    if (newlyUploadedId) {
      const timer = setTimeout(() => setNewlyUploadedId(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [newlyUploadedId]);

  return (
    <div className="landscape-container">
      {/* Toolbar */}
      <Box className="landscape-toolbar">
        {selectedCategory && (
          <div className="album-category">
            <Typography variant="caption" color="textSecondary" className="filter-label">
              Album
            </Typography>
            <Chip
              label={selectedCategory}
              color="secondary"
              variant="filled"
              onDelete={() => setSelectedCategory("")}
              className="tag-chip"
            />
          </div>
        )}

        {/* Tags */}
        <div className="test-styles">
          {tags.length > 0 && (
            <Typography variant="caption" color="textSecondary" className="tags-label">
              Tags
            </Typography>
          )}
          {tags.map((tagObj) => (
            <Chip
              key={tagObj.name}
              label={tagObj.name}
              onClick={() => toggleTag(tagObj.name)}
              color="secondary"
              variant={selectedTags.includes(tagObj.name) ? "filled" : "outlined"}
              onDelete={
                selectedTags.includes(tagObj.name) ? () => toggleTag(tagObj.name) : undefined
              }
              className="tag-chip"
            />
          ))}
        </div>

        {/* Upload Photo Chip */}
        <Chip
          label="Upload"
          color="secondary"
          variant="outlined"
          onClick={() => setUploadModalOpen(true)}
          className="upload-chip"
        />
      </Box>

      {/* Gallery */}
      {loading ? (
        <Typography className="loading">Loading landscapes...</Typography>
      ) : visibleLandscapes.length === 0 ? (
        <Typography className="error-message">No landscapes match selected filters.</Typography>
      ) : (
        <Masonry breakpointCols={breakpointColumnsObj} className="masonry-wrapper" columnClassName="">
          {landscapes.map((l) => {
            const visible =
              selectedTags.length === 0 || selectedTags.every((tag) => l.tags.includes(tag));
            const visibleIndex = visibleLandscapes.indexOf(l);

            return (
              <img
                key={l.id}
                src={l.thumbnailSrc} // only load thumbnail
                alt={l.title || "Landscape"}
                onClick={() => (visible ? openLightbox(visibleIndex) : null)}
                loading="lazy"
                className={`masonry-image ${l.id === newlyUploadedId ? "highlight" : ""}`}
                style={{
                  display: visible ? "block" : "none",
                  opacity: visible ? 1 : 0,
                  transition: "opacity 0.3s ease",
                  backgroundColor: "#eee", // placeholder while thumbnail loads
                }}
              />
            );
          })}
        </Masonry>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <CustomLightbox
          photos={visibleLandscapes.map((l) => ({
            src: l.fullSrc, // fetch full image on demand
            title: l.title,
          }))}
          currentIndex={currentIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={() =>
            setCurrentIndex((currentIndex + visibleLandscapes.length - 1) % visibleLandscapes.length)
          }
          onNext={() =>
            setCurrentIndex((currentIndex + 1) % visibleLandscapes.length)
          }
        />
      )}

      {/* Upload Modal */}
      <Dialog open={uploadModalOpen} onClose={() => setUploadModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload New Landscape</DialogTitle>
        <DialogContent>
          <UploadPhoto
            type="landscape"
            onUploadSuccess={(uploadedPhoto) => {
              fetchLandscapes();
              if (uploadedPhoto?.id) setNewlyUploadedId(uploadedPhoto.id);
              setUploadModalOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
