import { useState } from 'react';
import About from './components/About';
import Home from './components/Home';
import Contact from './components/Contact';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Landscapes from './components/Landscapes';
import Events from './components/Events';
import LandscapeAlbums from './components/LandscapeAlbums';
import Portraits from './components/Portraits';
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
          <nav className="nav-links desktop-nav">
            <Navbar />
          </nav>

          {/* Hamburger button for mobile */}
          <button className="hamburger" onClick={toggleMobileMenu}>
            ☰
          </button>

          {/* Mobile modal nav */}
          {mobileMenuOpen && (
            <>
              <div className="modal-overlay" onClick={closeMobileMenu}></div>
              <div className="nav-links mobile-modal">
                <Navbar closeMenu={closeMobileMenu} className="mobile-nav-links" />
              </div>
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
          <p>© 2025 Developed & Designed by Whitney Elliott</p>
        </div>
      </footer>
    </div>
  );
}

export default App;