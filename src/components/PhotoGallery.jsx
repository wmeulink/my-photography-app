import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function PhotoGallery() {
  const [photos, setPhotos] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [selected, setSelected] = React.useState(null);

  React.useEffect(() => {
    fetch('https://localhost:5000/api/photos')
      .then(res => res.json())
      .then(data => {
        setPhotos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading photos...</p>;
  if (!photos || photos.length === 0) return <p>No photos found.</p>;

  return (
    <Box sx={{ display: 'flex', gap: 3}}>
      {/* Left: Grid of images */}
      <ImageList sx={{ width: 700, height: 'auto' }} cols={3} rowHeight={250}>
        {photos.map((photo) => (
          <ImageListItem key={photo.id} onClick={() => setSelected(photo)}>
            <img
              src={`https://localhost:5000${photo.fileName}`}
              alt={photo.title}
              loading="lazy"
              style={{ borderRadius: '10px', cursor: 'pointer' }}
            />
          </ImageListItem>
        ))}
      </ImageList>

      {/* Right: Selected image preview */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        {selected ? (
          <>
            <img
              src={`https://localhost:5000${selected.fileName}`}
              alt={selected.title}
              style={{ maxWidth: '100%', maxHeight: 500, borderRadius: '10px' }}
            />
            <Typography variant="h6" gutterBottom>
              {selected.title}
            </Typography>
          </>
        ) : (
          <Typography variant="body1" sx={{ mt: 10 }}>
            Click an image to preview
          </Typography>
        )}
      </Box>
    </Box>
  );
}