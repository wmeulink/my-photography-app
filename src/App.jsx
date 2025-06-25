import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Card from './components/card'
import PhotoGallery from './components/PhotoGallery'

function App() {

  return (
    <>
      <Card image={"../public/flower.JPG"} size="small"/>
      <PhotoGallery />
    </>
  )
}

export default App