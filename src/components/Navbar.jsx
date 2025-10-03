import { Link } from "react-router-dom";
import './Navbar.css';
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";

function Navbar() {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-around" }}>
        
        {/* Logo or Site Name */}
        {/* <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: "none",
            color: "inherit",
            fontWeight: "bold",
          }}
        >
          Elliott Photography
        </Typography> */}

        {/* Navigation Buttons */}
        <Box className="navbar-buttons-container" sx={{ display: "flex", gap: 2 }}>
          <Button component={Link} to="/" color="inherit">
            Home
          </Button>
          <Button component={Link} to="/landscapes" color="inherit">
            Landscapes
          </Button>
          <Button component={Link} to="/portraits" color="inherit">
            Portraits
          </Button>
          <Button component={Link} to="/events" color="inherit">
            Events
          </Button>
          <Button component={Link} to="/about" color="inherit">
            About
          </Button>
          <Button component={Link} to="/contact" color="inherit">
            Contact
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
