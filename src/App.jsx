import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Card from './components/Card'
import About from './components/About';
import Home from './components/Home';
import Contact from './components/Contact';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PhotoGallery from './components/PhotoGallery'

function App() {

  return (
    <>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/about">About</Link> |{" "}
        <Link to="/contact">Contact</Link>
      </nav>
       <Routes>
       <Route index element={<Home />} />
        <Route path="/about" element={<About />}/>
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  )
}

export default App