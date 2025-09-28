import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

export default function PhotoGallery() {
  const [photos, setPhotos] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

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
    <ImageList sx={{ width: 950, height: 'auto' }} cols={3} rowHeight={304}>
      {photos.map((photo) => (
        <ImageListItem key={photo.id}>
          <img
            src={`${`https://localhost:5000${photo.fileName}`}?w=164&h=164&fit=crop&auto=format`}
            srcSet={`${`https://localhost:5000${photo.fileName}`}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            alt={photo.title}
            loading="lazy"
            style={{ borderRadius: '10px' }}
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}