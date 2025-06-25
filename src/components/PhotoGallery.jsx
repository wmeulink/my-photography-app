import React, { useEffect, useState } from 'react';

function PhotoGallery() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetch('https://localhost:7071/api/photos')
      .then(res => res.json())
      .then(data => setPhotos(data))
      .catch(console.error);
  }, []);

  console.log("photos", photos);

  return (
    <div>
      {photos.map(photo => (
        <div key={photo.id}>
          <h3>{photo.title}</h3>
          <img 
            src={`https://localhost:7071/images/${photo.filename}`} 
            alt={photo.title} 
            style={{ maxWidth: '300px', borderRadius: '10px' }}
          />
        </div>
      ))}
    </div>
  );
}

export default PhotoGallery;