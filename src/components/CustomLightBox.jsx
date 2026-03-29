import React, { useEffect, useState } from "react";
import "./CustomLightBox.css";

export default function CustomLightbox({ photos, currentIndex, onClose, onPrev, onNext }) {
  const [closing, setClosing] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const photo = photos[currentIndex];

  // Key controls
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onPrev, onNext]);

  // Window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!photo) return null;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 500);
  };

  return (
    <div className="custom-lightbox">
      <span className="close" onClick={handleClose}>
        &times;
      </span>

      <div className="lightbox-content">
        <img
          src={photo.src}
          alt={photo.title || "Photo"}
          className={`lightbox-image ${closing ? "slide-out" : "fade-in"}`}
          style={{
            maxWidth: windowSize.width < 768 ? "95vw" : "80vw",
            maxHeight: windowSize.height < 600 ? "80vh" : "90vh"
          }}
        />
      </div>

      <button className="prev" onClick={onPrev}>
        &lsaquo;
      </button>
      <button className="next" onClick={onNext}>
        &rsaquo;
      </button>
    </div>
  );
}