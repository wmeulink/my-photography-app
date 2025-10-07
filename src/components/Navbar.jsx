import { Link, useLocation } from "react-router-dom";
import './Navbar.css';
import { AppBar, Toolbar, Button, Box } from "@mui/material";

function Navbar() {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/albums", label: "Albums" },
    { to: "/landscapes", label: "Landscapes" },
    { to: "/portraits", label: "Portraits" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-around" }}>
        <Box className="navbar-buttons-container" sx={{ display: "flex", gap: 2 }}>
          {navLinks.map((link) => {
            const isActive =
              link.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(link.to);

            return (
              <Button
                key={link.to}
                component={Link}
                to={link.to}
                color="inherit"
                className={isActive ? "active-nav" : ""}
              >
                {link.label}
              </Button>
            );
          })}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
