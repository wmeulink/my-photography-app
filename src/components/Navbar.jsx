import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Box } from "@mui/material";

function Navbar({ closeMenu, mobile }) {
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
      <Toolbar
        sx={{
          display: "flex",
          flexDirection: mobile ? "column" : "row",
          alignItems: mobile ? "flex-start" : "center",
          gap: 2,
          justifyContent: mobile ? "flex-start" : "space-around",
          width: "100%",
          padding: mobile ? "0" : "0 1rem",
        }}
      >
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
              onClick={closeMenu ? closeMenu : undefined}
              sx={{
                justifyContent: mobile ? "flex-start" : "center",
                textAlign: mobile ? "left" : "center",
                width: mobile ? "100%" : "auto",
                paddingLeft: mobile ? 0 : undefined,
                paddingBottom: mobile ? "4px" : undefined,
              }}
            >
              {link.label}
            </Button>
          );
        })}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;