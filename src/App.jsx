import About from './components/About';
import Home from './components/Home';
import Contact from './components/Contact';
import Navbar from './components/NavBar';
import { Routes, Route } from 'react-router-dom';
import Landscapes from './components/Landscapes';
import Events from './components/Events';
import Portraits from './components/Portraits';
import "./App.css";

function App() {

  return (
    <div className="navbar-container">
      <header className="site-header">
        <h1>Elliott Photography Portfolio</h1>
        <Navbar/>
      </header>
      
      <Routes>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/landscapes" element={<Landscapes />} />
        <Route path="/portraits" element={<Portraits />} />
      </Routes>

      <footer className='footer-container'>
      <p>© 2025 Created & Designed by Whitney Elliott</p>
    </footer>
    </div>
  )
}

export default App