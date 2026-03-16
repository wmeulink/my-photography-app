import React, { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import SEO from "./SEO";
import CustomLightbox from "./CustomLightBox";
import "./Home.css";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Home() {
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch(`${API_URL}/api/photos`);
        if (!res.ok) throw new Error("Failed to fetch photos");
        const data = await res.json();

        // convert to thumbnail/full URL pattern and add ratio placeholder
        const converted = data.map((p) => ({
          ...p,
          thumbnailSrc: `${API_URL}/api/photos/${p.id}/thumb`,
          fullSrc: `${API_URL}/api/photos/${p.id}/full`,
          _ratio: null, // will hold width/height once loaded
        }));

        setPhotos(converted);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchPhotos();
  }, []);

  const breakpoints = {
    default: 3,
    1100: 2,
    700: 1,
  };

  const handlePrev = () => {
    setPhotoIndex((photoIndex + photos.length - 1) % photos.length);
  };

  const handleNext = () => {
    setPhotoIndex((photoIndex + 1) % photos.length);
  };

  // onLoad handler: measure natural size and save ratio so we can reserve space
  const handleImageLoad = (e, id) => {
    const img = e.target;
    if (!img || !img.naturalWidth || !img.naturalHeight) return;

    const ratio = img.naturalWidth / img.naturalHeight;
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, _ratio: ratio } : p))
    );
  };

  // compute inline style for image container or img using stored ratio
  const imgStyleFor = (p) => {
    if (p._ratio) {
      // aspect-ratio expects width/height — use that if supported
      return { aspectRatio: `${p._ratio}` }; // modern browsers support this
    }
    // no ratio yet: return nothing; CSS fallback will apply
    return {};
  };

  // Structured Data (unchanged)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Elliott Photography Co.",
    description:
      "Professional portrait, event, and landscape photography by Whitney Elliott based in Washougal, WA, serving Camas, Vancouver, and Portland areas.",
    image: photos.slice(0, 5).map((p) => p.thumbnailSrc),
    creator: {
      "@type": "Person",
      name: "Whitney Elliott",
    },
    url: "https://whittyelliott.com",
  };

  return (
    <div className="page-container">
      <SEO
        title="Elliott Photography Co. | Washougal, WA Photographer"
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
            <div
              key={photo.id}
              className="masonry-item-wrapper"
            >
              <img
                key={photo.id}
                src={photo.thumbnailSrc}
                alt={photo.title || "Photography by Whitney Elliott"}
                className="masonry-image"
                loading="lazy"
                style={imgStyleFor(photo)}
                onLoad={(e) => handleImageLoad(e, photo.id)}
                onClick={() => {
                  setPhotoIndex(i);
                  setLightboxOpen(true);
                }}
              />
            </div>
          ))}
        </Masonry>

        {lightboxOpen && (
          <CustomLightbox
            photos={photos.map((p) => ({ src: p.fullSrc, title: p.title }))}
            currentIndex={photoIndex}
            onClose={() => setLightboxOpen(false)}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </div>
    </div>
  );
}
