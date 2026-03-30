import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Chip } from "@mui/material";
import CustomLightbox from "./CustomLightBox";
import SEO from "./SEO.jsx";
import './Landscapes.css';

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Landscapes() {
  const { category: categoryParam } = useParams();

  // Core state
  const [landscapes, setLandscapes] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "");
  const [loading, setLoading] = useState(true);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sync category from URL and reset tags when category changes
  useEffect(() => {
    setSelectedCategory(categoryParam || "");
    setSelectedTags([]);
  }, [categoryParam]);

  // Fetch landscapes and tags
  useEffect(() => {
    const fetchLandscapes = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/Landscapes`);
        const data = await res.json();

        const formatted = data.map(l => ({
          ...l,
          thumbnailSrc: l.id ? `${API_URL}/api/Landscapes/${l.id}/thumb` : null,
          fullSrc: l.id ? `${API_URL}/api/Landscapes/${l.id}/full` : null,
          categoryName: l.categoryName || l.category?.name || "",
        }));

        const filtered = selectedCategory
          ? formatted.filter(l => l.categoryName.toLowerCase() === selectedCategory.toLowerCase())
          : formatted;

        setLandscapes(filtered);
      } catch (err) {
        console.error("Failed to fetch landscapes:", err);
        setLandscapes([]);
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

    fetchLandscapes();
    fetchTags();
  }, [selectedCategory]);

  // Toggle tag selection
  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Filter landscapes by selected tags
  const visibleLandscapes = useMemo(() => {
    return landscapes.filter(l =>
      selectedTags.length
        ? selectedTags.every(tag => l.tags.includes(tag))
        : true
    );
  }, [selectedTags, landscapes]);

  // Lightbox open/close (CSS handles overlay, no scroll hacks)
  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <div className="landscape-container">
      <SEO
        title={`Landscapes | Elliott Photography${selectedCategory ? ` - ${selectedCategory}` : ""}`}
        description="Explore Whitney Elliott's landscape photography portfolio."
        keywords={`Landscape photography, ${selectedCategory || ""}`}
        url={`https://whittyelliott.com/landscapes${selectedCategory ? `/${encodeURIComponent(selectedCategory)}` : ""}`}
        image={landscapes[0]?.thumbnailSrc || "/images/preview-photo.jpg"}
      />

      {/* Toolbar */}
      <Box className="landscape-toolbar">
        {selectedCategory && (
          <Chip
            label={selectedCategory}
            color="secondary"
            variant="filled"
            onDelete={() => setSelectedCategory("")}
            className="upload-chip"
          />
        )}
        {tags.map(tag => (
          <Chip
            key={tag}
            label={tag}
            onClick={() => toggleTag(tag)}
            color={selectedTags.includes(tag) ? "secondary" : "default"}
            variant={selectedTags.includes(tag) ? "filled" : "outlined"}
            className="tag-chip"
          />
        ))}
      </Box>

      {/* Gallery */}
      {loading ? (
        <Typography className="loading">Loading landscapes...</Typography>
      ) : visibleLandscapes.length === 0 ? (
        <Typography className="no-results">No landscapes match selected filters.</Typography>
      ) : (
        <Box className="my-masonry-grid">
          {visibleLandscapes.map((l, i) => (
            <img
              key={i}
              src={l.thumbnailSrc}
              alt={l.title || "Landscape"}
              loading="lazy"
              className="masonry-image"
              onClick={() => openLightbox(i)}
            />
          ))}
        </Box>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <CustomLightbox
          photos={visibleLandscapes.map(l => ({ src: l.fullSrc, title: l.title }))}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onPrev={() => setCurrentIndex((currentIndex + visibleLandscapes.length - 1) % visibleLandscapes.length)}
          onNext={() => setCurrentIndex((currentIndex + 1) % visibleLandscapes.length)}
        />
      )}
    </div>
  );
}