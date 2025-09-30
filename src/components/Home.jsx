import React from "react";
import Masonry from "react-masonry-css";
import "./Home.css";

function Home() {
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  const [photos, setPhotos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("https://localhost:5000/api/photos")
      .then(res => res.json())
      .then(data => {
        console.log("Fetched photos:", data);
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
    <div class="home-container">
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {photos.map(photo => (
        <img
          key={photo.id}
          src={`https://localhost:5000${photo.fileName}`} // absolute path to backend
          alt={photo.title}
          style={{ width: "100%", borderRadius: "8px" }}
        />
      ))}
    </Masonry>
    </div>
  );
}

export default Home;