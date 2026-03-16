import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import About from './components/About';
import Home from './components/Home';
import Contact from './components/Contact';
import Landscapes from './components/Landscapes';
import LandscapeAlbums from './components/LandscapeAlbums';
import Portraits from './components/Portraits';
import Navbar from './components/Navbar';
import "./App.css";

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="navbar-container">
      <header className="site-header">
        <div className="header-inner">
          <h1>Elliott Photography</h1>

          {/* Desktop nav */}
          <nav className="desktop-nav">
            <Navbar />
          </nav>

          {/* Hamburger button */}
          <button
            className="hamburger"
            onClick={toggleMobileMenu}
            aria-label="Open mobile menu"
          >
            ☰
          </button>

          {/* Mobile modal */}
       {mobileMenuOpen && (
  <>
    <div className="modal-overlay" onClick={closeMobileMenu}></div>
    <nav className="mobile-modal">
      <Navbar closeMenu={closeMobileMenu} mobile={true} />
    </nav>
  </>
)}
        </div>
      </header>

      <main className="site-content" onClick={closeMobileMenu}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/albums" element={<LandscapeAlbums />} />
          <Route path="/landscapes" element={<Landscapes />} />
          <Route path="/landscapes/:category" element={<Landscapes />} />
          <Route path="/portraits" element={<Portraits />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <p>© 2026 Developed & Designed by Whitney Elliott</p>
        </div>
      </footer>
    </div>
  );
}

export default App;