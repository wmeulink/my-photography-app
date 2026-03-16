import React from "react";
import { Box, Typography, Button, Card, CardMedia, CardContent, IconButton } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import SEO from "./SEO";
import "./About.css";

export default function About() {
  return (
    <Box className="about-container">
      <SEO
        title="Elliott Photography | Whitney Elliott (Meulink) | Washougal Photographer"
        description="Browse professional photography by Whitney Elliott (Meulink), featuring landscapes, portraits, and event photos across Washougal, Camas, Vancouver, and Portland."
        keywords="Whitney Elliott, Whitney Meulink, Elliott Photography, Washougal photographer, Camas, Vancouver, Portland, portrait photography, landscape photography, event photography"
        url="https://whittyelliott.com/about"
        image="/images/whitney-profile.jpg"
      />

      <Card className="about-card">
        <CardMedia
          component="img"
          className="about-media"
          image="/images/IMG_6509.JPG"
          alt="Whitney Elliott"
        />
        <CardContent className="about-content">
          <Typography variant="h4">Hi, I’m Whitney Elliott</Typography>

          <Typography variant="body1" paragraph>
            I’m a software engineer with a creative streak. I love clean design, vivid color, and thoughtful composition, both in code and behind the camera.
          </Typography>

          <Typography variant="body1" paragraph>
            Photography is where my artistic side comes alive. It’s my way of slowing down, observing details, and capturing moments that feel honest and intentional.
          </Typography>

          <Typography variant="body1" paragraph>
            This site is where my two worlds meet: creativity and technology, reflecting the same care, precision, and curiosity that I bring to every project I build.
          </Typography>

          <Box className="social-icons">
            <IconButton component="a" href="https://www.linkedin.com/in/whitney-meulink-10a04585/" target="_blank" rel="noopener noreferrer" color="primary">
              <LinkedInIcon />
            </IconButton>
            <IconButton component="a" href="https://github.com/wmeulink" target="_blank" rel="noopener noreferrer" color="primary">
              <GitHubIcon />
            </IconButton>
            <IconButton component="a" href="https://www.instagram.com/whittyelliottt" target="_blank" rel="noopener noreferrer" color="primary">
              <InstagramIcon />
            </IconButton>
          </Box>

          <Button variant="contained" href="/contact" className="connect-button">
            Let’s Connect
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}