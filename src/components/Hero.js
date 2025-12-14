import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import heroBg from '../assets/hero-bg.jpg';

const Hero = () => (
  <div
    className="hero-container d-flex justify-content-center align-items-center text-center text-white"
    style={{
      backgroundImage: `url(${heroBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      position: 'relative',
      animation: 'zoomBg 15s ease-in-out infinite alternate'
    }}
  >
    {/* Gradient overlay */}
    <div
      className="position-absolute top-0 start-0 w-100 h-100"
      style={{
        background: 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3))',
        zIndex: 0
      }}
    ></div>

    {/* Main text */}
    <div className="position-relative z-1 px-3">
      <h1 className="display-3 fw-bold mb-3" style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.7)' }}>
        Welcome to <span className="text-warning">EDMA</span>
      </h1>
      <h4 className="mb-4 fst-italic" style={{ textShadow: '1px 1px 5px rgba(0,0,0,0.5)' }}>
        East Devon Malayalee Association
      </h4>
      <p className="lead fw-light mb-5" style={{ fontSize: '1.3rem' }}>
        <span className="badge bg-light text-dark p-2 rounded-pill">
          ഇവിടെ മലയാളികളുടെ ഹൃദയങ്ങൾ ഒന്നിക്കുന്നു
        </span>
      </p>

      <Link to="/register" className="btn btn-warning btn-lg px-5 py-3 rounded-pill shadow">
          Register Us Today
      </Link>
    </div>

    {/* Add zoom animation */}
    <style>{`
      @keyframes zoomBg {
        0% { transform: scale(1); }
        100% { transform: scale(1.05); }
      }
    `}</style>
  </div>
);

export default Hero;
