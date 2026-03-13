import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Box, Chip, Typography } from "@mui/material";
import Masonry from "react-masonry-css";
import CustomLightbox from "./CustomLightBox";
import SEO from "./SEO.jsx";

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

  useEffect(() => setSelectedCategory(categoryParam || ""), [categoryParam]);

  const fetchLandscapes = async () => {
    setLoading(true);
    try {
      const url = selectedCategory
        ? `${API_URL}/api/Landscapes/category/${selectedCategory}`
        : `${API_URL}/api/Landscapes`;

      const res = await fetch(url);
      const data = await res.json();

    const converted = data.map((l) => ({
  ...l,
  thumbnailSrc: l.id ? `${API_URL}/api/Landscapes/${l.id}/thumb` : null,
  fullSrc: l.id ? `${API_URL}/api/Landscapes/${l.id}/full` : null,
}));

      setLandscapes(converted);
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

  const visibleLandscapes = useMemo(() => {
    if (!selectedTags.length) return landscapes;
    return landscapes.filter((l) =>
      selectedTags.every((tag) => l.tags.includes(tag))
    );
  }, [selectedTags, landscapes]);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const breakpointColumnsObj = { default: 3, 1100: 3, 700: 2, 500: 1 };

  return (
    <div className="landscape-container">
      <SEO
        title={`Landscapes | Elliott Photography Co.${selectedCategory ? ` - ${selectedCategory}` : ""}`}
        description="Explore Whitney Elliott's landscape photography portfolio featuring the Pacific Northwest."
        keywords={`Landscape photography, Pacific Northwest photography, Washougal, Camas, Vancouver, Portland, ${selectedCategory || ""}`}
        url={`https://elliottphotographyco.com/landscapes${selectedCategory ? `/${selectedCategory}` : ""}`}
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
          />
        )}
        {tags.map((tagObj) => (
          <Chip
            key={tagObj.name}
            label={tagObj.name}
            onClick={() => toggleTag(tagObj.name)}
            color={selectedTags.includes(tagObj.name) ? "secondary" : "default"}
            variant={selectedTags.includes(tagObj.name) ? "filled" : "outlined"}
            sx={{ cursor: "pointer", margin: "0 4px" }}
          />
        ))}
      </Box>

      {/* Gallery */}
      {loading ? (
        <Typography>Loading landscapes...</Typography>
      ) : visibleLandscapes.length === 0 ? (
        <Typography>No landscapes match selected filters.</Typography>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="masonry-wrapper"
          columnClassName=""
        >
          {visibleLandscapes.map((l, i) => (
            <img
              key={l.id}
              src={l.thumbnailSrc}
              alt={l.title || "Landscape"}
              onClick={() => openLightbox(i)}
              loading="lazy"
              className="masonry-image"
              style={{ cursor: "pointer" }}
            />
          ))}
        </Masonry>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <CustomLightbox
          photos={visibleLandscapes.map((l) => ({
            src: l.fullSrc,
            title: l.title,
          }))}
          currentIndex={currentIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={() =>
            setCurrentIndex(
              (currentIndex + visibleLandscapes.length - 1) % visibleLandscapes.length
            )
          }
          onNext={() =>
            setCurrentIndex((currentIndex + 1) % visibleLandscapes.length)
          }
        />
      )}
    </div>
  );
}