import React, { useEffect, useState } from "react";
import "./Categories.css";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Categories({ category, setCategory }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/Landscapes/categories`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="category-dropdown-container">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="category-select"
      >
        <option value="">Select a category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>
      <div className="info-icon" title="Choose a category to filter the gallery">
        i
      </div>
    </div>
  );
}
