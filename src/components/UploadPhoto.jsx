import React, { useEffect, useState } from "react";
import "./UploadPhoto.css";
import Categories from "./Categories"; // <- import the reusable Categories component

const API_URL = import.meta.env.VITE_API_URL || "";

export default function UploadPhoto({ type = "landscape", onUploadSuccess }) {
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState(""); // For Category component
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(null);

  // Fetch tags
  useEffect(() => {
    fetch(`${API_URL}/api/Tags`)
      .then((res) => res.json())
      .then(setTags)
      .catch((err) => console.error("Error fetching tags:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !title || !category) {
      setMessage("Please fill out all required fields.");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("categoryId", category); // category ID from Category component
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tagNames", selectedTags.join(",")); // comma-separated

    // Correct endpoint based on type
// Correct endpoint based on type
const endpoint =
  type === "portrait"
    ? `${API_URL}/api/Portraits/upload`
    : `${API_URL}/api/Landscapes/upload`;


    try {
      const res = await fetch(endpoint, { method: "POST", body: formData });
      if (!res.ok) {
        const errData = await res.json();
        console.error("Upload failed:", errData);
        setMessage("Upload failed. Check console for details.");
        return;
      }

      setMessage("Upload successful!");
      onUploadSuccess && onUploadSuccess();

      // Reset form
      setFile(null);
      setTitle("");
      setDescription("");
      setCategory("");
      setSelectedTags([]);
      setPreview(null);
    } catch (err) {
      console.error("Network error:", err);
      setMessage("Upload failed due to a network error.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-section">
      <button
        type="button"
        className="upload-exit-btn"
        onClick={onUploadSuccess}
        aria-label="Close upload form"
      >
        &times;
      </button>

      <h3 className="upload-title">
        Upload New {type === "portrait" ? "Portrait" : "Landscape"}
      </h3>

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="upload-fields">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="upload-input"
            required
          />

          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="upload-textarea"
          />

          {/* Use Category component for dropdown */}
          <Categories category={category} setCategory={setCategory} apiEndpoint={
            type === "portrait"
              ? "/api/Portraits/categories"
              : "/api/Landscapes/categories"
          } />

          <select
            multiple
            value={selectedTags}
            onChange={(e) =>
              setSelectedTags(
                Array.from(e.target.selectedOptions, (opt) => opt.value)
              )
            }
            className="upload-select"
          >
            {tags.map((tag) => (
              <option key={tag.id} value={tag.name}>
                {tag.name}
              </option>
            ))}
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files[0];
              setFile(f);
              setPreview(f ? URL.createObjectURL(f) : null);
            }}
            className="upload-input"
            required
          />
        </div>

        {preview && (
          <div className="upload-preview">
            <img src={preview} alt="Preview" className="preview-img" />
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className={`upload-btn ${uploading ? "disabled" : ""}`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>

        {message && <p className="upload-message">{message}</p>}
      </form>
    </div>
  );
}
