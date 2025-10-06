import React, { useEffect, useState } from "react";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import "./Categories.css";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Categories({ category, setCategory }) {
  const [categories, setCategories] = useState([]);

  const sharedButtonStyles = {
    cursor: "pointer",
    height: "40px",
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 600,
    fontSize: "0.95rem",
    color: "#0c0a0aff",
    backgroundColor: "#f4f0f5",
    borderRadius: "6px",
    border: "none",
    boxShadow: "0px 2px 8px rgba(69, 46, 69, 0.936)",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0px 4px 12px rgba(69, 46, 69, 0.936)",
      backgroundColor: "#ebe6ec",
    },
    "&:active": {
      transform: "translateY(0px)",
      boxShadow: "0px 2px 8px rgba(69, 46, 69, 0.936)",
    },
  };
  useEffect(() => {
    let mounted = true;
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/Landscapes/categories`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        if (mounted) setCategories(data);
      } catch (err) {
        console.error("Categories fetch error:", err);
      }
    };
    fetchCategories();
    return () => (mounted = false);
  }, []);

  return (
    <Box className="category-dropdown-container" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <Select
          value={category || ""}
          onChange={(e) => setCategory(e.target.value)}
          displayEmpty
          renderValue={(selected) => {
            if (!selected) {
              return <span style={{ color: "black", fontStyle: "normal" }}>All Categories</span>;
            }
            return selected;
          }}
          sx={{
            ...sharedButtonStyles,
            width: "180px",
            "& fieldset": { border: "none" },
          }}
        >
          <MenuItem value="">
            <em>All Categories</em>
          </MenuItem>
          {categories.map((c) => (
            <MenuItem key={c.id} value={c.name}>
              {c.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>


      <div className="info-icon">
        i
        <div className="tooltip">Choose a category to filter the gallery</div>
      </div>
    </Box>
  );
}
