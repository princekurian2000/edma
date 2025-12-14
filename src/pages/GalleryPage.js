import React, { useState } from 'react';
import './GalleryPage.css';

// Local images
import onam1 from '../assets/gallerypage/onam1.jpg';
import onam2 from '../assets/gallerypage/onam2.jpg';
import onam3 from '../assets/gallerypage/onam3.jpg';
import christmas1 from '../assets/gallerypage/christmas1.jpg';
import christmas2 from '../assets/gallerypage/christmas2.jpg';
import christmas3 from '../assets/gallerypage/christmas3.jpg';
import easter1 from '../assets/gallerypage/easter1.jpg';
import easter2 from '../assets/gallerypage/easter2.jpg';
import easter3 from '../assets/gallerypage/easter3.jpg';

// Albums (local and remote)
const albums = {
  'Onam 2024': [
    { thumb: onam1, full: onam1 },
    { thumb: onam2, full: onam2 },
    { thumb: onam3, full: onam3 },
  ],
  'Christmas 2024': [
    { thumb: christmas1, full: christmas1 },
    { thumb: christmas2, full: christmas2 },
    { thumb: christmas3, full: christmas3 },
  ],
  'Easter 2025': [
    { thumb: easter1, full: easter1 },
    { thumb: easter2, full: easter2 },
    { thumb: easter3, full: easter3 },
  ],
  'BBQ 2025': [
    {
      thumb: 'https://drive.google.com/thumbnail?id=1PSLyEEkG_9UAI1d7KFLikyADN98x24Kl&sz=w300',
      full: 'https://drive.google.com/uc?export=view&id=1PSLyEEkG_9UAI1d7KFLikyADN98x24Kl',
    },
    {
      thumb: 'https://drive.google.com/thumbnail?id=1E6Os8pHaW2kPYzgB5y4-5L-p3jeelynh&sz=w300',
      full: 'https://drive.google.com/uc?export=view&id=1E6Os8pHaW2kPYzgB5y4-5L-p3jeelynh',
    },
    {
      thumb: 'https://drive.google.com/thumbnail?id=17y2K8hbe4EWHmke8sZckmodMnxWeolE1&sz=w300',
      full: 'https://drive.google.com/uc?export=view&id=17y2K8hbe4EWHmke8sZckmodMnxWeolE1',
    },
    {
      thumb: 'https://drive.google.com/thumbnail?id=1jAc4moRiITMPHtzl3bs1Nd0JSQH5jRr1&sz=w300',
      full: 'https://drive.google.com/uc?export=view&id=1jAc4moRiITMPHtzl3bs1Nd0JSQH5jRr1',
    },
    {
      thumb: 'https://drive.google.com/thumbnail?id=18AUnxozRm6S1vU-8SO3crXdURCD0Wrwb&sz=w300',
      full: 'https://drive.google.com/uc?export=view&id=18AUnxozRm6S1vU-8SO3crXdURCD0Wrwb',
    },
    {
      thumb: 'https://drive.google.com/thumbnail?id=1vBdVuI6xMne_u139QOTKc7JzJhS-5Z-F&sz=w300',
      full: 'https://drive.google.com/uc?export=view&id=1vBdVuI6xMne_u139QOTKc7JzJhS-5Z-F',
    },
    {
      thumb: 'https://drive.google.com/thumbnail?id=1d6sCb6m_RcGJZE_duUEjfWhonWXs3-bT&sz=w300',
      full: 'https://drive.google.com/uc?export=view&id=1d6sCb6m_RcGJZE_duUEjfWhonWXs3-bT',
    },
    {
      thumb: 'https://drive.google.com/thumbnail?id=1jrQDf2Q8teATyz4-Id9es75sXg_M8Jc8&sz=w300',
      full: 'https://drive.google.com/uc?export=view&id=1jrQDf2Q8teATyz4-Id9es75sXg_M8Jc8',
    },
    {
      thumb: 'https://drive.google.com/thumbnail?id=1DaFRsuriQ7ZBkMYBG7XJQOML76tPuI01&sz=w300',
      full: 'https://drive.google.com/uc?export=view&id=1DaFRsuriQ7ZBkMYBG7XJQOML76tPuI01',
    },
    {
      thumb: 'https://drive.google.com/thumbnail?id=1mgQDtwhb19T_nT7LeYjrkKqZfenOuQ2-&sz=w300',
      full: 'https://drive.google.com/uc?export=view&id=1mgQDtwhb19T_nT7LeYjrkKqZfenOuQ2-',
    },
    {
      thumb: 'https://drive.google.com/thumbnail?id=146u__q_p5PtPvRdlW4Zefe28Qj13BMYv&sz=w300',
      full: 'https://drive.google.com/uc?export=view&id=146u__q_p5PtPvRdlW4Zefe28Qj13BMYv',
    },
    {
      thumb: 'https://drive.google.com/thumbnail?id=1AIA3JZOgkq-VGZm7PmCsM8975x7Pu6R-&sz=w300',
      full: 'https://drive.google.com/uc?export=view&id=1AIA3JZOgkq-VGZm7PmCsM8975x7Pu6R-',
    },
    {
      thumb: 'https://drive.google.com/thumbnail?id=1WkeOArumL1SSG2ZX8nlEcaMu4xQCOZQZ&sz=w300',
      full: 'https://drive.google.com/uc?export=view&id=1WkeOArumL1SSG2ZX8nlEcaMu4xQCOZQZ',
    },
    {
      thumb: 'https://drive.google.com/thumbnail?id=1-k4OlFzUwk4ad6sBE0Ov5yFX9jXNhuF5&sz=w300',
      full: 'https://drive.google.com/uc?export=view&id=1-k4OlFzUwk4ad6sBE0Ov5yFX9jXNhuF5',
    },
    {
      thumb: 'https://drive.google.com/thumbnail?id=1vb459-mbhITLgVOMgor5hUcEGFa84M-3&sz=w300',
      full: 'https://drive.google.com/uc?export=view&id=1vb459-mbhITLgVOMgor5hUcEGFa84M-3',
    },
    {
      thumb: 'https://drive.google.com/thumbnail?id=16cZ5NDiR7Kvrnrz3vOqpfmcoiJHTPQCX&sz=w300',
      full: 'https://drive.google.com/uc?export=view&id=16cZ5NDiR7Kvrnrz3vOqpfmcoiJHTPQCX',
    },
  ],
};

const GalleryPage = () => {
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">📂 Photo Albums</h2>

      {/* Album List */}
      {!activeAlbum && (
        <div className="row g-4">
          {Object.keys(albums).map((album, idx) => (
            <div
              key={idx}
              className="col-6 col-md-4 col-lg-3 text-center"
              role="button"
              onClick={() => setActiveAlbum(album)}
            >
              <div className="folder-icon mb-2">
                <i className="bi bi-folder-fill fs-1 text-warning"></i>
              </div>
              <h6>{album}</h6>
            </div>
          ))}
        </div>
      )}

      {/* Image Grid */}
      {activeAlbum && (
        <>
          <div className="d-flex justify-content-between align-items-center my-4">
            <button className="btn btn-outline-secondary" onClick={() => setActiveAlbum(null)}>
              ← Back to Albums
            </button>
            <h4>{activeAlbum}</h4>
          </div>

          <div className="row g-3">
            {albums[activeAlbum].map((imgObj, i) => (
              <div className="col-6 col-md-4 col-lg-3" key={i}>
                <img
                  src={imgObj.thumb}
                  alt={`Image ${i + 1}`}
                  className="img-fluid rounded shadow-sm album-image"
                  style={{ height: '250px', objectFit: 'cover', width: '100%' }}
                  role="button"
                  onClick={() => setSelectedImg(imgObj.full)}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {selectedImg && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
          onClick={() => setSelectedImg(null)}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content bg-transparent border-0">
              <button
                type="button"
                className="btn-close btn-close-white ms-auto me-2 mt-2"
                onClick={() => setSelectedImg(null)}
              ></button>
              <img src={selectedImg} className="img-fluid rounded" alt="Enlarged" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
