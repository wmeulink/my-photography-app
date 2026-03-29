import React, { useState, useEffect, useCallback } from "react";
import "./CustomLightBox.css";

export default function CustomLightbox({ photos, currentIndex, onClose, onPrev, onNext }) {
  const [closing, setClosing] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const photo = photos[currentIndex];

  // Handle close with slide-out animation
  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 500); // match CSS slide-out duration
  }, [onClose]);

  // Key controls: Escape, ArrowLeft, ArrowRight
  useEffect(() => {
    const handleKey = (e) => {
      if (!photo) return;

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          handleClose();
          break;
        case "ArrowLeft":
          e.preventDefault();
          onPrev();
          break;
        case "ArrowRight":
          e.preventDefault();
          onNext();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [photo, onPrev, onNext, handleClose]);

  // Track window size for responsive scaling
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          className={`lightbox-image ${closing ? "slide-out" : "fade-in"}`}
          style={{
            maxWidth: windowSize.width < 768 ? "95vw" : "80vw",
            maxHeight: windowSize.height < 600 ? "80vh" : "90vh"
          }}
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