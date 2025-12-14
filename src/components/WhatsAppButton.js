// src/components/WhatsAppButton.js

import React from 'react';

const WhatsAppButton = () => {
  const handleClick = () => {
    window.open('https://wa.me/447763607372', '_blank'); // Replace with your WhatsApp number
  };

  return (
    <div
      className="whatsapp-float"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <i className="fab fa-whatsapp" style={{ fontSize: '30px', color: 'white' }}></i>
    </div>
  );
};

export default WhatsAppButton;
