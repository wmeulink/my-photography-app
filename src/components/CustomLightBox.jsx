import React from "react";
import { useLightbox } from "../context/LightboxContext";
import "./CustomLightBox.css";

export default function CustomLightbox({ photos, currentIndex, onPrev, onNext }) {
  const { setLightboxOpen } = useLightbox();
  const photo = photos[currentIndex];
  if (!photo) return null;

  const handleClose = () => setLightboxOpen(false);

  return (
    <div className="custom-lightbox">
      <span className="close" onClick={handleClose}>&times;</span>

      <div className="lightbox-content">
        <img
          src={photo.src}
          alt={photo.title || "Photo"}
          className="lightbox-image"
        />
        <button className="prev" onClick={onPrev}>&lsaquo;</button>
        <button className="next" onClick={onNext}>&rsaquo;</button>
      </div>
    </div>
  );
}