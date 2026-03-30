import React from "react";
import "./CustomLightBox.css";

export default function CustomLightbox({ photos, currentIndex, onClose, onPrev, onNext }) {
  const photo = photos[currentIndex];
  if (!photo) return null;

  return (
    <div className="custom-lightbox">
      <span className="close" onClick={onClose}>&times;</span>

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