import React, { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
// import "./Landscapes.css";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Landscapes() {
  const [landscapes, setLandscapes] = useState([]);
  const [category, setCategory] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let url = `${API_URL}/api/Landscapes`;
    if (category) {
      url += `/category/${category}`;
    }
    fetch(url)
      .then((res) => res.json())
      .then(setLandscapes)
      .catch(console.error);
  }, [category]);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  console.log("landscapes", landscapes);
  console.log("category", category)
  const images = landscapes.map((l) => `${API_URL}/images/${l.filename}`);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  landscapes.map((landscape,index) => {
    console.log("First image URL:", landscape.filename);
  })

  return (
    <div className="landscapes-container">
      <h2>Landscapes Gallery</h2>

      {/* Category Filter */}
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All</option>
        <option value="Trails">Trails</option>
        <option value="Flowers">Flowers</option>
      </select>

      {/* Masonry Gallery */}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {landscapes.map((landscape, index) => (
  landscape.filename && (
    <img
      key={landscape.id}
      src={`${API_URL}/images/${landscape.filename}`}
      alt={landscape.title}
      onClick={() => openLightbox(index)}
    />
  )
))}
      </Masonry>

      {/* Lightbox */}
      {isOpen && (
        <Lightbox
          mainSrc={images[currentIndex]}
          nextSrc={images[(currentIndex + 1) % images.length]}
          prevSrc={images[(currentIndex + images.length - 1) % images.length]}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setCurrentIndex((currentIndex + images.length - 1) % images.length)
          }
          onMoveNextRequest={() =>
            setCurrentIndex((currentIndex + 1) % images.length)
          }
        />
      )}
    </div>
  );
}
