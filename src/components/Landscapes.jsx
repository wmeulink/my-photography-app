import React, { useEffect, useState, useMemo } from "react";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, Chip } from "@mui/material";
import Masonry from "react-masonry-css";
import UploadPhoto from "./UploadPhoto";
import CustomLightbox from "./CustomLightBox";
import { sharedButtonStyles } from "../helpers/helpers";
import './Landscapes.css'

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Landscapes() {
  const [landscapes, setLandscapes] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Fetch landscapes
  const fetchLandscapes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/Landscapes`);
      const data = await res.json();
      const converted = data.map((l) => ({
        ...l,
        thumbnailSrc: l.thumbnail ? `data:image/jpeg;base64,${l.thumbnail}` : null,
        fullSrc: l.full ? `data:image/jpeg;base64,${l.full}` : null,
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
      setTags(data.map((t) => t.name));
    } catch (err) {
      console.error("Failed to fetch tags:", err);
    }
  };

  useEffect(() => {
    fetchLandscapes();
    fetchTags();
  }, []);

  // Filter landscapes by selected tags
  const filteredLandscapes = useMemo(() => {
    if (!selectedTags.length) return landscapes;
    return landscapes.filter((l) => selectedTags.every((tag) => l.tags.includes(tag)));
  }, [selectedTags, landscapes]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

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

  return (
    <div className="landscape-container">
      {/* Toolbar */}
      <Box className="landscape-toolbar">
        <Button
          variant="contained"
          onClick={() => setUploadModalOpen(true)}
          sx={{ ...sharedButtonStyles, textTransform: "none" }}
        >
          Upload Photo
        </Button>

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
        <Typography className="loading">Loading landscapes...</Typography>
      ) : filteredLandscapes.length === 0 ? (
        <Typography className="error-message">No landscapes match selected tags.</Typography>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="masonry-wrapper"
          columnClassName=""
        >
          {filteredLandscapes.map((l, index) => (
            <img
              key={l.id}
              src={l.thumbnailSrc}
              alt={l.title || "Landscape"}
              onClick={() => openLightbox(index)}
              loading="lazy"
              className="masonry-image"
            />
          ))}
        </Masonry>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <CustomLightbox
          photos={filteredLandscapes.map((l) => ({ src: l.fullSrc, title: l.title }))}
          currentIndex={currentIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={() =>
            setCurrentIndex((currentIndex + filteredLandscapes.length - 1) % filteredLandscapes.length)
          }
          onNext={() =>
            setCurrentIndex((currentIndex + 1) % filteredLandscapes.length)
          }
        />
      )}

      {/* Upload Modal */}
      <Dialog open={uploadModalOpen} onClose={() => setUploadModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload New Landscape</DialogTitle>
        <DialogContent>
          <UploadPhoto
            type="landscape"
            onUploadSuccess={() => {
              fetchLandscapes();
              setUploadModalOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
