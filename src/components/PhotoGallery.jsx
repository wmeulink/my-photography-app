import React, { useEffect, useState } from 'react';

function PhotoGallery() {
  const [photos, setPhotos] = useState(null); // null means not loaded
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    <div>
      {photos.map(photo => (
        <div key={photo.id}>
          <h3>{photo.title}</h3>
          <img
            src={`https://localhost:5000${photo.fileName}`}
            alt={photo.title}
            style={{ maxWidth: '300px', borderRadius: '10px' }}
          />
        </div>
      ))}
    </div>
  );
}

export default PhotoGallery;