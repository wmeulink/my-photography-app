 export const sharedButtonStyles = {
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