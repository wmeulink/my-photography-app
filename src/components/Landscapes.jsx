import React, { useEffect, useState, useRef } from "react";
import Masonry from "react-masonry-css";
import CustomLightbox from "./CustomLightBox";
import "./Landscapes.css";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Landscapes() {
  const [landscapes, setLandscapes] = useState([]);
  const [prevLandscapes, setPrevLandscapes] = useState(null);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // transition states
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [lockedHeight, setLockedHeight] = useState(null);

  const wrapperRef = useRef(null);
  const transitionTimerRef = useRef(null);

  const breakpointColumnsObj = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1,
  };

  // fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/Landscapes/categories`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        setCategories(await res.json());
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // helper: preload images but with a timeout fallback
  const preloadWithTimeout = (urls = [], timeoutMs = 3000) => {
    return new Promise((resolve) => {
      if (!urls || urls.length === 0) return resolve();
      let loaded = 0;
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        resolve();
      };
      urls.forEach((u) => {
        try {
          const img = new Image();
          img.onload = () => {
            loaded++;
            if (loaded === urls.length) finish();
          };
          img.onerror = () => {
            loaded++;
            if (loaded === urls.length) finish();
          };
          // start loading (cache will make this instant if already available)
          img.src = u;
        } catch {
          loaded++;
          if (loaded === urls.length) finish();
        }
      });
      // fallback timeout
      setTimeout(finish, timeoutMs);
    });
  };

  // fetch landscapes when category changes - with height lock + preload + crossfade
  useEffect(() => {
    // cleanup any pending timer on reruns
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }

    const fetchAndTransition = async () => {
      setError(null);

      // lock wrapper height to prevent collapse
      const wrapper = wrapperRef.current;
      if (wrapper) {
        const h = wrapper.offsetHeight || wrapper.clientHeight || 0;
        if (h > 0) setLockedHeight(h);
      }

      // preserve previous images so we can crossfade
      if (landscapes && landscapes.length > 0) {
        setPrevLandscapes(landscapes);
        setIsTransitioning(true);
      }

      setLoading(true);
      try {
        const url = category
          ? `${API_URL}/api/Landscapes/category/${encodeURIComponent(category)}`
          : `${API_URL}/api/Landscapes`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch landscapes (${res.status})`);
        const data = await res.json();

        // pick thumbnail URLs (fall back to full if thumbnail missing)
        const urls = (data || []).map((d) => d.thumbnail || d.full).filter(Boolean);

        // preload thumbnails with a fallback timeout (so we don't wait forever)
        await preloadWithTimeout(urls, 3000);

        // now swap in the new data (images should be cached or loading already)
        setLandscapes(data);

        // leave prevLandscapes for the duration of CSS animation, then clear
        transitionTimerRef.current = setTimeout(() => {
          setPrevLandscapes(null);
          setIsTransitioning(false);
          setLockedHeight(null); // unlock height so it can resize naturally
        }, 600 + 80); // match CSS transition (600ms) + small buffer
      } catch (err) {
        console.error(err);
        setError(err.message);
        // still clear transition state if error
        setPrevLandscapes(null);
        setIsTransitioning(false);
        setLockedHeight(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAndTransition();

    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

  // initial load: category = "" will trigger effect; keep loading handled
  useEffect(() => {
    // nothing else here; initial fetch is handled by the category effect
  }, []);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  // UI states
  if (loading && !landscapes.length) return <div className="loading">Loading Landscapes...</div>;
  if (error && !landscapes.length) return <div className="error">Error: {error}</div>;

  const wrapperClass = `masonry-wrapper ${prevLandscapes ? "has-prev" : ""} ${
    isTransitioning ? "animating" : ""
  }`;

  return (
    <div className="page-container">
      <div className="home-container">
        <h2 className="landscape-header">Landscapes Gallery</h2>

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

        <div
          ref={wrapperRef}
          className={wrapperClass}
          style={lockedHeight ? { minHeight: `${lockedHeight}px` } : undefined}
        >
          {/* PREVIOUS LAYER (kept for crossfade) */}
          {prevLandscapes && (
            <div className="grid-layer prev">
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid masonry-item"
                columnClassName="my-masonry-grid_column"
              >
                {prevLandscapes.map((l, idx) => (
                  <img
                    key={`prev-${l.id}-${idx}`}
                    src={l.thumbnail || l.full}
                    alt={l.title || "Landscape"}
                    className="masonry-image"
                    loading="lazy"
                  />
                ))}
              </Masonry>
            </div>
          )}

          {/* CURRENT LAYER */}
          <div className="grid-layer current">
            {landscapes.length === 0 ? (
              <p className="no-results">No landscapes found for this category.</p>
            ) : (
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid masonry-item"
                columnClassName="my-masonry-grid_column"
              >
                {landscapes.map((l, index) => (
                  <img
                    key={`cur-${l.id}-${index}`}
                    src={l.thumbnail || l.full}
                    alt={l.title || "Landscape"}
                    onClick={() => openLightbox(index)}
                    loading="lazy"
                    className="masonry-image"
                  />
                ))}
              </Masonry>
            )}
          </div>
        </div>

        {/* Lightbox */}
        {lightboxOpen && (
          <CustomLightbox
            photos={landscapes.map((l) => ({ ...l, thumbnail: l.full }))}
            currentIndex={currentIndex}
            onClose={() => setLightboxOpen(false)}
            onPrev={() =>
              setCurrentIndex((currentIndex + landscapes.length - 1) % landscapes.length)
            }
            onNext={() => setCurrentIndex((currentIndex + 1) % landscapes.length)}
          />
        )}
      </div>
    </div>
  );
}
