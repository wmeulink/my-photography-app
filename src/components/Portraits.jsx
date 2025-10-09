import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import { styled } from "@mui/material/styles";
import UploadPhoto from "./UploadPhoto";
import CustomLightbox from "./CustomLightBox";
import Categories from "./Categories"; // Add this
import { sharedButtonStyles } from "../helpers/helpers";
import "./Portraits.css";

const API_URL = import.meta.env.VITE_API_URL || "";

const Label = styled(Paper)(({ theme }) => ({
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
      setPortraits(data);
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
        <Box>
          <Typography variant="h4" fontWeight="500">
            Portraits
          </Typography>
          <div className="header-container">
          <Button
            variant="contained"
            onClick={() => setUploadModalOpen(true)}
            sx={{ ...sharedButtonStyles, textTransform: "none", marginLeft: "4px" }}
          >
            Upload Portrait
          </Button>

           <Box sx={{ mb: 3 }}>
            
          <Categories category={category} setCategory={setCategory} apiEndpoint="/api/Portraits/categories" />
          </Box>
          </div>
        
        </Box>

        {/* Category Filter */}
       

        {loading ? (
          <Typography>Loading portraits...</Typography>
        ) : portraits.length === 0 ? (
          <Typography>No portraits found for "{category || "All"}".</Typography>
        ) : (
          <Masonry
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
            columns={{ xs: 1, sm: 2, md: 3 }}
            spacing={2}
          >
            {portraits.map((item, index) => (
              <div className="polaroid" key={index} onClick={() => openLightbox(index)}>
                <img src={item.thumbnail} alt={item.title} loading="lazy" />
                <div className="label">{item.title || "Untitled"}</div>
              </div>
            ))}
          </Masonry>

        )}

        {/* Lightbox */}
        {lightboxOpen && (
          <CustomLightbox
            photos={portraits.map((p) => ({ ...p, thumbnail: p.full }))}
            currentIndex={currentIndex}
            onClose={() => setLightboxOpen(false)}
            onPrev={() => setCurrentIndex((currentIndex + portraits.length - 1) % portraits.length)}
            onNext={() => setCurrentIndex((currentIndex + 1) % portraits.length)}
          />
        )}

        {/* Upload Modal */}
        <Dialog open={uploadModalOpen} onClose={() => setUploadModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Upload New Portrait</DialogTitle>
          <DialogContent>
            <UploadPhoto
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
