import About from './components/About';
import Home from './components/Home';
import Contact from './components/Contact';
import Navbar from './components/NavBar';
import { Routes, Route } from 'react-router-dom';
import Landscapes from './components/Landscapes';
import Events from './components/Events';
import LandscapeAlbums from './components/LandscapeAlbums';
import Portraits from './components/Portraits';
import "./App.css";

function App() {

  return (
    <div className="navbar-container">
      <header className="site-header">
        <h1>Elliott Photography Co.</h1>
        <Navbar />
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/albums" element={<LandscapeAlbums />} />
        <Route path="/landscapes" element={<Landscapes />} />
        <Route path="/landscapes/:category" element={<Landscapes />} />
        <Route path="/portraits" element={<Portraits />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <div className='footer-container'>
      <footer className='footer'>
        <p>© 2025 Developed & Designed by Whitney Elliott</p>
      </footer>
      </div>
    </div>
  )
}

export default App