import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import { styled } from "@mui/material/styles";
import UploadPhoto from "./UploadPhoto";
import CustomLightbox from "./CustomLightBox";
import Categories from "./Categories";
import { sharedButtonStyles } from "../helpers/helpers";
import "./Portraits.css";

const API_URL = import.meta.env.VITE_API_URL || "";

const Label = styled("div")(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  textAlign: "center",
  color: (theme.vars || theme).palette.text.secondary,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
}));

export default function Portraits() {
  const [portraits, setPortraits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [category, setCategory] = useState("");

  const fetchPortraits = async () => {
    setLoading(true);
    try {
      const url = category
        ? `${API_URL}/api/Portraits/category/${category}`
        : `${API_URL}/api/Portraits`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch portraits");

      const data = await res.json();

      // Convert backend binary (Base64) into displayable format
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

  useEffect(() => {
    fetchPortraits();
  }, [category]);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="portraits-container">
      <Box sx={{ p: 4 }} className="page-container">
        <div className="portrait-upload-container">
          <h2 className="portrait-header">Portraits</h2>
          <div className="portrait-buttons-container">
            <Button
              variant="contained"
              onClick={() => setUploadModalOpen(true)}
              sx={{
                ...sharedButtonStyles,
                textTransform: "none",
                marginLeft: "4px",
              }}
            >
              Upload Portrait
            </Button>

            <Box sx={{ mb: 3 }}>
              <Categories
                category={category}
                setCategory={setCategory}
                apiEndpoint="/api/categories"
              />
            </Box>
          </div>
        </div>

        {loading ? (
          <Typography>Loading portraits...</Typography>
        ) : portraits.length === 0 ? (
          <Typography>No portraits found for "{category || "All"}".</Typography>
        ) : (
          <Masonry
            columns={{ xs: 1, sm: 2, md: 3 }}
            spacing={2}
            className="my-masonry-grid"
          >
            {portraits.map((item, index) => (
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

        {lightboxOpen && (
          <CustomLightbox
            photos={portraits.map((p) => ({
              src: p.fullSrc,
              title: p.title,
            }))}
            currentIndex={currentIndex}
            onClose={() => setLightboxOpen(false)}
            onPrev={() =>
              setCurrentIndex(
                (currentIndex + portraits.length - 1) % portraits.length
              )
            }
            onNext={() =>
              setCurrentIndex((currentIndex + 1) % portraits.length)
            }
          />
        )}

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
