import React, { useState } from 'react';
import './Gallery.css';

const images = [
  'gallery1.jpg', 'gallery2.jpg', 'gallery3.jpg', 'gallery4.jpg'
].map(img => require(`../assets/${img}`));

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Photo Gallery</h2>
      <div className="row g-3">
        {images.map((src, i) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={i}>
            <div className="gallery-img-wrapper" onClick={() => setSelectedImage(src)}>
              <img
                src={src}
                className="gallery-img"
                alt={`Gallery ${i}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Lightbox */}
      {selectedImage && (
        <div className="lightbox-overlay" onClick={() => setSelectedImage(null)}>
          <span className="lightbox-close" onClick={() => setSelectedImage(null)}>&times;</span>
          <img src={selectedImage} alt="Enlarged view" className="lightbox-img" />
        </div>
      )}
    </div>
  );
};

export default Gallery;
