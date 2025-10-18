import React, { useEffect, useState } from "react";
import { Box, FormControl, Select, MenuItem } from "@mui/material";
import { sharedButtonStyles } from "../helpers/helpers";
import "./Categories.css";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Categories({ category, setCategory }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/categories`);
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
            if (!selected) return <span style={{ color: "black" }}>All Categories</span>;
            const found = categories.find((c) => c.id === selected);
            return found ? found.name : selected;
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
            <MenuItem key={c.id} value={c.id}>
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
