import React, { useEffect } from "react";
import "./CustomLightbox.css";

export default function CustomLightbox({ photos, currentIndex, onClose, onPrev, onNext }) {
  const photo = photos[currentIndex];

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  if (!photo) return null;

  return (
    <div className="custom-lightbox">
      <span className="close" onClick={onClose}>&times;</span>
      <img src={photo.full} alt={photo.title} className="lightbox-image" />
      <button className="prev" onClick={onPrev}>&lsaquo;</button>
      <button className="next" onClick={onNext}>&rsaquo;</button>
    </div>
  );
}
