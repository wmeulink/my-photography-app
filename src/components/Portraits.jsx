import React, { useEffect, useState, useMemo } from "react";
import { Box, Typography, Chip } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import CustomLightbox from "./CustomLightBox";
import SEO from "./SEO.jsx";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Portraits() {
  const [portraits, setPortraits] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchPortraits = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/Portraits`);
      const data = await res.json();

      const converted = data.map((p) => ({
  ...p,
  thumbnailSrc: p.id ? `${API_URL}/api/photos/${p.id}/thumb` : null,
  fullSrc: p.id ? `${API_URL}/api/photos/${p.id}/full` : null,
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
      setTags(data.map((t) => t.name));
    } catch (err) {
      console.error("Failed to fetch tags:", err);
    }
  };

  useEffect(() => {
    fetchPortraits();
    fetchTags();
  }, []);

  const filteredPortraits = useMemo(() => {
    if (!selectedTags.length) return portraits;
    return portraits.filter((p) =>
      selectedTags.every((tag) => p.tags.includes(tag))
    );
  }, [selectedTags, portraits]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="portraits-container">
      <Box sx={{ p: 4 }} className="page-container">
        <SEO
          title="Portraits | Elliott Photography Co."
          description="Professional portrait photography by Whitney Elliott. Capture family, engagement, and personal moments in Washougal and nearby cities."
          keywords="Portrait photography, family portraits, engagement photography, Washougal photographer, Camas, Vancouver, Portland"
          url="https://elliottphotographyco.com/portraits"
          image={portraits[0]?.thumbnailSrc || "/images/preview-photo.jpg"}
        />

        {/* Tag filters */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onClick={() => toggleTag(tag)}
              color={selectedTags.includes(tag) ? "primary" : "default"}
              variant={selectedTags.includes(tag) ? "filled" : "outlined"}
              sx={{ cursor: "pointer" }}
            />
          ))}
        </Box>

        {/* Gallery */}
        {loading ? (
          <Typography>Loading portraits...</Typography>
        ) : filteredPortraits.length === 0 ? (
          <Typography>No portraits match selected tags.</Typography>
        ) : (
          <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
            {filteredPortraits.map((p, i) => (
              <div key={i} className="polaroid" onClick={() => openLightbox(i)}>
                <img
                  src={p.thumbnailSrc}
                  alt={p.title || "Portrait"}
                  loading="lazy"
                  className="portrait-img"
                />
                <div className="label">{p.title || "Untitled"}</div>
              </div>
            ))}
          </Masonry>
        )}

        {/* Lightbox */}
        {lightboxOpen && (
          <CustomLightbox
            photos={filteredPortraits.map((p) => ({
              src: p.fullSrc,
              title: p.title,
            }))}
            currentIndex={currentIndex}
            onClose={() => setLightboxOpen(false)}
            onPrev={() =>
              setCurrentIndex(
                (currentIndex + filteredPortraits.length - 1) %
                filteredPortraits.length
              )
            }
            onNext={() =>
              setCurrentIndex((currentIndex + 1) % filteredPortraits.length)
            }
          />
        )}
      </Box>
    </div>
  );
}