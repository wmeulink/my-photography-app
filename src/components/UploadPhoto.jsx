import React, { useEffect, useState } from "react";
import "./UploadPhoto.css";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Upload({ onUploadSuccess }) {
    const [categories, setCategories] = useState([]);
    const [file, setFile] = useState(null);
    const [categoryId, setCategoryId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        fetch(`${API_URL}/api/Landscapes/categories`)
            .then((res) => res.json())
            .then(setCategories)
            .catch((err) => console.error("Error fetching categories:", err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file || !title || !description || !categoryId) {
            console.error("All fields are required");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("categoryId", categoryId);
        formData.append("title", title);
        formData.append("description", description);

        try {
            const res = await fetch(`${API_URL}/api/Landscapes/upload`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const errData = await res.json();
                console.error("Upload failed:", errData);
                setMessage("Upload failed");
                return;
            }

            setMessage("Upload successful!");
            onUploadSuccess && onUploadSuccess();
        } catch (err) {
            console.error("Error uploading:", err);
            setMessage("Upload failed due to a network error");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="upload-section">
            <h3 className="upload-title">Upload New Photo</h3>

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

                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="upload-select"
                        required
                    >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setFile(file);
                            if (file) {
                                setPreview(URL.createObjectURL(file));
                            } else {
                                setPreview(null);
                            }
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
