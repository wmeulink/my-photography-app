// Categories.jsx
import React, { useEffect, useState } from "react";
import "./Categories.css";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Categories({ selectedCategory, onChangeCategory }) {
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
    <select
      value={selectedCategory}
      onChange={(e) => onChangeCategory(e.target.value)}
      className="category-select"
    >
      <option value="">All</option>
      {categories.map((c) => (
        <option key={c.id} value={c.name}>
          {c.name}
        </option>
      ))}
    </select>
  );
}
