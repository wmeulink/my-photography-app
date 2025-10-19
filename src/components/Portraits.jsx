import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
} from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import UploadPhoto from "./UploadPhoto";
import CustomLightbox from "./CustomLightBox";
import { sharedButtonStyles } from "../helpers/helpers";
import "./Portraits.css";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Portraits() {
  const [portraits, setPortraits] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Fetch portraits
  const fetchPortraits = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/Portraits`);
      const data = await res.json();

      const converted = data.map((p) => ({
        ...p,
        thumbnailSrc: p.thumbnail
          ? `data:image/jpeg;base64,${p.thumbnail}`
          : null,
        fullSrc: p.full
          ? `data:image/jpeg;base64,${p.full}`
          : null,
      }));

      setPortraits(converted);
    } catch (err) {
      console.error(err);
      setPortraits([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all available tags
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

  // Filter portraits by selected tags (AND logic)
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
        {/* Toolbar */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 1,
            mb: 3,
          }}
        >
          <Button
            variant="contained"
            onClick={() => setUploadModalOpen(true)}
            sx={{ ...sharedButtonStyles, textTransform: "none" }}
          >
            Upload Portrait
          </Button>

          {/* Tag filter chips */}
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
          <Typography>
            No portraits match selected tags.
          </Typography>
        ) : (
          <Masonry
            columns={{ xs: 1, sm: 2, md: 3 }}
            spacing={2}
            className="my-masonry-grid"
          >
            {filteredPortraits.map((item, index) => (
              <div
                className="polaroid"
                key={index}
                onClick={() => openLightbox(index)}
              >
                <img
                  src={item.thumbnailSrc}
                  alt={item.title}
                  loading="lazy"
                  className="portrait-img"
                />
                <div className="label">{item.title || "Untitled"}</div>
              </div>
            ))}
          </Masonry>
        )}

        {/* Lightbox */}
        {lightboxOpen && (
          <CustomLightbox
            photos={filteredPortraits.map((l) => ({
              src: l.fullSrc,
              title: l.title,
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

        {/* Upload Modal */}
        <Dialog
          open={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Upload New Portrait</DialogTitle>
          <DialogContent>
            <UploadPhoto
              type="portrait"
              onUploadSuccess={() => {
                fetchPortraits();
                setUploadModalOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </Box>
    </div>
  );
}
