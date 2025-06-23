import React from 'react';
import './Card.css';

function Card({ image, size }) {
  return (
    <div className={`card card--${size}`}>
      <img src={image} alt="" />
    </div>
  );
}

export default Card;