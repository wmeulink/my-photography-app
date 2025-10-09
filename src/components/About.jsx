import { Box, Typography, Button, Card, CardMedia, CardContent, IconButton } from "@mui/material";
import { LinkedIn, GitHub, Instagram } from "@mui/icons-material";

export default function About() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" p={4}>
      <Card
        sx={{
          display: "flex",
          maxWidth: 900,
          boxShadow: 3,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <CardMedia
          component="img"
          sx={{ width: 300, objectFit: "cover" }}
          image="/public/IMG_6509.JPG"
          alt="Whitney Elliott"
        />
        <CardContent sx={{ flex: 1, p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Hi, I’m Whitney Elliott
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            I’m a software engineer with a creative streak. I love clean design, vivid color, and thoughtful composition, both in code and behind the camera.
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            Photography is where my artistic side comes alive. It’s my way of slowing down, observing details, and capturing moments that feel honest and intentional.
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            This site is where my two worlds meet: creativity and technology: reflecting the same care, precision, and curiosity that I bring to every project I build.
          </Typography>

          <Box display="flex" alignItems="center" gap={1.5} mt={2}>
            <IconButton
              component="a"
              href="https://www.linkedin.com/in/whitney-meulink-10a04585/"
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
            >
              <LinkedIn />
            </IconButton>

            <IconButton
              component="a"
              href="https://github.com/wmeulink"
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
            >
              <GitHub />
            </IconButton>

            <IconButton
              component="a"
              href="https://www.instagram.com/whittyelliottt"
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
            >
              <Instagram />
            </IconButton>
          </Box>

          <Button
            variant="contained"
            sx={{
              mt: 3,
              borderRadius: "20px",
              textTransform: "none",
              px: 3,
            }}
            href="/contact"
          >
            Let’s Connect
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
