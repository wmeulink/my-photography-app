import React, { useEffect, useState } from "react";
import "./CustomLightBox.css";

export default function CustomLightbox({ photos, currentIndex, onClose, onPrev, onNext }) {
  const [closing, setClosing] = useState(false);
  const photo = photos[currentIndex];

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onPrev, onNext]);

  if (!photo) return null;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 500); // match CSS animation duration
  };

  return (
    <div className="custom-lightbox">
      <span className="close" onClick={handleClose}>
        &times;
      </span>
      <img
        src={photo.full}
        alt={photo.title}
        className={`lightbox-image ${closing ? "slide-out" : "fade-in"}`}
      />
      <button className="prev" onClick={onPrev}>
        &lsaquo;
      </button>
      <button className="next" onClick={onNext}>
        &rsaquo;
      </button>
    </div>
  );
}
