import React, { createContext, useState, useEffect, useContext } from "react";

// Create context
const LightboxContext = createContext();

// Provider component
export function LightboxProvider({ children }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle scroll lock globally
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  return (
    <LightboxContext.Provider
      value={{
        lightboxOpen,
        setLightboxOpen,
        currentIndex,
        setCurrentIndex
      }}
    >
      {children}
    </LightboxContext.Provider>
  );
}

// Custom hook for easy usage
export function useLightbox() {
  return useContext(LightboxContext);
}