import React, { useState, useCallback } from "react";
import "./CustomLightBox.css";

export default function CustomLightbox({ photos, currentIndex, onClose, onPrev, onNext }) {
  const [closing, setClosing] = useState(false);
  const photo = photos[currentIndex];

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 200); // optional small fade, can even remove entirely
  }, [onClose]);

  if (!photo) return null;

  return (
    <div className="custom-lightbox">
      <span className="close" onClick={handleClose}>
        &times;
      </span>

      <div className="lightbox-content">
        <img
          src={photo.src}
          alt={photo.title || "Photo"}
          className="lightbox-image"
        />
        <button className="prev" onClick={onPrev}>
          &lsaquo;
        </button>
        <button className="next" onClick={onNext}>
          &rsaquo;
        </button>
      </div>
    </div>
  );
}