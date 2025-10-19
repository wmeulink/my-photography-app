import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandscapeAlbums.css";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function LandscapeAlbums() {
  const [albums, setAlbums] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        // Fetch all categories
        const catRes = await fetch(`${API_URL}/api/Categories`);
        const categories = await catRes.json();

        // Fetch all landscapes
        const landscapeRes = await fetch(`${API_URL}/api/Landscapes`);
        const landscapes = await landscapeRes.json();

        // Keep only categories that have at least one landscape
        const landscapeCategories = categories.filter(cat =>
          landscapes.some(l => l.categoryId === cat.id)
        );

        // For each category, pick the first landscape as cover
        const withCovers = landscapeCategories.map(cat => {
          const firstLandscape = landscapes.find(l => l.categoryId === cat.id);
          return {
            ...cat,
            cover: firstLandscape
              ? `data:image/jpeg;base64,${firstLandscape.thumbnail}`
              : "/default-cover.jpg",
          };
        });

        setAlbums(withCovers);
      } catch (err) {
        console.error("Failed to fetch landscape albums:", err);
      }
    };

    fetchAlbums();
  }, []);

  return (
    <div className="album-page">
      <h1 className="album-title">Landscape Albums</h1>
      <div className="album-grid">
        {albums.map(album => (
          <div
            key={album.id}
            className="album-card"
            onClick={() => navigate(`/landscapes/${album.name}`)}
          >
            <div className="album-cover-wrapper">
              <img src={album.cover} alt={album.name} className="album-cover" />
            </div>
            <div className="album-label">{album.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
