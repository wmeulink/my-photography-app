import React, { useEffect, useState, useMemo } from "react";
import { Box, Typography, Chip } from "@mui/material";
import CustomLightbox from "./CustomLightBox";
import SEO from "./SEO.jsx";
import './Portraits.css';

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Portraits() {
  const [portraits, setPortraits] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchPortraits = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/Portraits`);
        const data = await res.json();
        const converted = data.map(p => ({
          ...p,
          thumbnailSrc: p.id ? `${API_URL}/api/Portraits/${p.id}/thumb` : null,
          fullSrc: p.id ? `${API_URL}/api/Portraits/${p.id}/full` : null,
        }));
        setPortraits(converted);
      } catch (err) {
        console.error("Failed to fetch portraits:", err);
        setPortraits([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchTags = async () => {
      try {
        const res = await fetch(`${API_URL}/api/Tags`);
        const data = await res.json();
        setTags(data.map(t => t.name));
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      }
    };

    fetchPortraits();
    fetchTags();
  }, []);

  const filteredPortraits = useMemo(() => {
    if (!selectedTags.length) return portraits;
    return portraits.filter(p => selectedTags.every(tag => p.tags.includes(tag)));
  }, [selectedTags, portraits]);

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // ✅ Lightbox open/close with scroll lock
  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden"; // prevent background scroll
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto"; // restore scroll
  };

  return (
    <div className="portraits-container">
      <Box className="page-container">
        <SEO
          title="Portraits | Elliott Photography"
          description="Professional portrait photography by Whitney Elliott."
          keywords="Portrait photography, family portraits, engagement photography, Washougal, Camas, Vancouver, Portland"
          url="https://whittyelliott.com/portraits"
          image={portraits[0]?.thumbnailSrc || "/images/preview-photo.jpg"}
        />

        {/* Tag filters */}
        <Box className="portrait-buttons-container">
          {tags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              onClick={() => toggleTag(tag)}
              color={selectedTags.includes(tag) ? "primary" : "default"}
              variant={selectedTags.includes(tag) ? "filled" : "outlined"}
              className="upload-chip"
            />
          ))}
        </Box>

        {/* Gallery */}
        {loading ? (
          <Typography className="loading">Loading portraits...</Typography>
        ) : filteredPortraits.length === 0 ? (
          <Typography className="no-results">No portraits match selected tags.</Typography>
        ) : (
          <Box className="my-masonry-grid">
            {filteredPortraits.map((p, i) => (
              <div key={i} className="polaroid" onClick={() => openLightbox(i)}>
                <img
                  src={p.thumbnailSrc}
                  alt={p.title || "Portrait"}
                  loading="lazy"
                  className="polaroid-img" // uses CSS for responsive polaroid aspect
                />
                <div className="label">{p.title || "Untitled"}</div>
              </div>
            ))}
          </Box>
        )}

        {/* Lightbox */}
        {lightboxOpen && (
          <CustomLightbox
            photos={filteredPortraits.map(p => ({ src: p.fullSrc, title: p.title }))}
            currentIndex={currentIndex}
            onClose={closeLightbox}
            onPrev={() => setCurrentIndex((currentIndex + filteredPortraits.length - 1) % filteredPortraits.length)}
            onNext={() => setCurrentIndex((currentIndex + 1) % filteredPortraits.length)}
          />
        )}
      </Box>
    </div>
  );
}