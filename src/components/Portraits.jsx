import React, { useEffect, useState, useMemo } from "react";
import { Box, Typography, Chip } from "@mui/material";
import CustomLightBox from "./CustomLightBox";
import SEO from "./SEO.jsx";
import { useLightbox } from "./LightBoxContext";
import "./Portraits.css";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Portraits() {
  const [portraits, setPortraits] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const { lightboxOpen, setLightboxOpen } = useLightbox();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch portraits and tags
  useEffect(() => {
    const fetchPortraits = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/Portraits`);
        const data = await res.json();
        console.log("RAW PORTRAITS DATA:", data); // raw backend data

        const formatted = data.map(p => ({
          ...p,
          thumbnailSrc: `${API_URL}/api/Portraits/${p.id}/thumb`,
          fullSrc: `${API_URL}/api/Portraits/${p.id}/full`,
        }));
        setPortraits(formatted);
        console.log("PORTRAITS STATE AFTER FETCH:", formatted);
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
        console.log("RAW TAGS DATA:", data);

        const tagNames = data.map(t => t.name);
        console.log("TAG NAMES:", tagNames);

        setTags(tagNames);
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      }
    };

    fetchPortraits();
    fetchTags();
  }, []);

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

 const visiblePortraits = useMemo(() => {
  if (!portraits.length) return [];
  return portraits.filter(p =>
    selectedTags.length ? selectedTags.every(tag => p.tags?.includes(tag)) : true
  );
}, [selectedTags, portraits]);

  const openLightbox = (index) => {
    console.log("OPEN LIGHTBOX INDEX:", index);
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const handlePrev = () => {
    const newIndex = (currentIndex + visiblePortraits.length - 1) % visiblePortraits.length;
    setCurrentIndex(newIndex);
  };
  const handleNext = () => {
    const newIndex = (currentIndex + 1) % visiblePortraits.length;
    setCurrentIndex(newIndex);
  };

  console.log("CURRENT PORTRAITS STATE:", portraits);
  console.log("CURRENT TAGS STATE:", tags);

  return (
    <div className="portraits-container">
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
      ) : visiblePortraits.length === 0 ? (
        <Typography className="no-results">No portraits match selected tags.</Typography>
      ) : (
        <Box className="my-masonry-grid">
          {visiblePortraits.map((p, i) => (
            <div key={p.id || i} className="polaroid" onClick={() => openLightbox(i)}>
              <img
                src={p.thumbnailSrc}
                alt={p.title || "Portrait"}
                loading="lazy"
                className="polaroid-img"
              />
              <div className="label">{p.title || "Untitled"}</div>
            </div>
          ))}
        </Box>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <CustomLightBox
          photos={visiblePortraits.map(p => ({ src: p.fullSrc, title: p.title }))}
          currentIndex={currentIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
}