import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row text-center text-md-start">

          {/* About Section */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">EDMA</h5>
            <p>
              Empowering development and growth through collaboration, culture, and community.
              Join us in shaping the future.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-light text-decoration-none">Home</Link></li>
              <li><Link to="/members" className="text-light text-decoration-none">Members</Link></li>
              <li><Link to="/events" className="text-light text-decoration-none">Events</Link></li>
              <li><Link to="/gallery" className="text-light text-decoration-none">Gallery</Link></li>
              <li><Link to="/contact" className="text-light text-decoration-none">Contact</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">Follow Us</h5>
            <div className="d-flex justify-content-center justify-content-md-start">
              <a
                href="https://www.facebook.com/profile.php?id=61565893269539"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light fs-4 me-3"
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light fs-4 me-3"
              >
                <i className="bi bi-instagram"></i>
              </a>
              <a
                href="https://www.youtube.com/@EDMA-Malayalee"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light fs-4"
              >
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="text-center border-top border-secondary pt-3 mt-4">
          <small>&copy; {new Date().getFullYear()} EDMA. All rights reserved.</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
