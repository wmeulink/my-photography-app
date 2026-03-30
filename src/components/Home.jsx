import React, { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import SEO from "./SEO";
import CustomLightBox from "./CustomLightBox";
import { useLightbox } from "./LightBoxContext";
import "./Home.css";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Home() {
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);

  // Lightbox context
  const { lightboxOpen, setLightboxOpen } = useLightbox();

  // Local state for current photo in lightbox
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch photos
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch(`${API_URL}/api/photos`);
        if (!res.ok) throw new Error("Failed to fetch photos");

        const data = await res.json();
        const converted = data.map(p => ({
          ...p,
          thumbnailSrc: `${API_URL}/api/photos/${p.id}/thumb`,
          fullSrc: `${API_URL}/api/photos/${p.id}/full`,
        }));

        setPhotos(converted);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchPhotos();
  }, []);

  // Masonry breakpoints
  const breakpoints = { default: 3, 1100: 2, 700: 1 };

  // Lightbox navigation
  const handlePrev = () =>
    setCurrentIndex((currentIndex + photos.length - 1) % photos.length);
  const handleNext = () =>
    setCurrentIndex((currentIndex + 1) % photos.length);

  // Open lightbox
  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  // Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Elliott Photography",
    description:
      "Professional portrait, event, and landscape photography by Whitney Elliott based in Washougal, WA, serving Camas, Vancouver, and Portland areas.",
    image: photos.slice(0, 5).map(p => p.thumbnailSrc),
    creator: { "@type": "Person", name: "Whitney Elliott" },
    url: "https://whittyelliott.com",
  };

  return (
    <div className="page-container">
      <SEO
        title="Elliott Photography | Washougal, WA Photographer"
        description="Browse the latest photography by Whitney Elliott, featuring landscapes, portraits, and event photos taken across Washougal, Camas, Vancouver, and Portland."
        keywords="Elliott Photography, Whitney Elliott, Washougal photographer, Camas photographer, Vancouver WA photographer, Portland photographer, Pacific Northwest photography, landscape photography, portrait photography, event photography, engagement photos, family photos, wedding photographer, outdoor photoshoot"
        url="https://whittyelliott.com"
        image={photos[0]?.thumbnailSrc || "/images/preview-photo.jpg"}
        structuredData={structuredData}
      />

      <div className="my-masonry-grid_column">
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {!error && photos.length === 0 && <p>No photos found.</p>}

        <Masonry
          breakpointCols={breakpoints}
          className="home my-masonry-grid masonry-item"
          columnClassName=""
        >
          {photos.map((photo, i) => (
            <div key={photo.id} className="masonry-item-wrapper">
              <img
                src={photo.thumbnailSrc}
                alt={photo.title || "Photography by Whitney Elliott"}
                className="masonry-image"
                loading="lazy"
                onClick={() => openLightbox(i)}
              />
            </div>
          ))}
        </Masonry>

        {lightboxOpen && (
          <CustomLightBox
            photos={photos.map(p => ({ src: p.fullSrc, title: p.title }))}
            currentIndex={currentIndex}
            onClose={() => setLightboxOpen(false)}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </div>
    </div>
  );
}