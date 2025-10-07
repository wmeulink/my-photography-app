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
        const res = await fetch(`${API_URL}/api/Landscapes/categories`);
        const data = await res.json();
        const withCovers = await Promise.all(
          data.map(async (cat) => {
            try {
              const imgRes = await fetch(`${API_URL}/api/Landscapes/category/${cat.name}`);
              const images = await imgRes.json();
              return { ...cat, cover: images[0]?.thumbnail || "/default-cover.jpg" };
            } catch {
              return { ...cat, cover: "/default-cover.jpg" };
            }
          })
        );
        setAlbums(withCovers);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAlbums();
  }, []);

  return (
    <div className="album-page">
      <h1 className="album-title">Landscape Albums</h1>
      <div className="album-grid">
        {albums.map((a) => (
          <div
            key={a.id}
            className="album-card"
            onClick={() => navigate(`/landscapes/${a.name}`)}
          >
            <img src={a.cover} alt={a.name} className="album-cover" />
            <div className="album-label">{a.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
