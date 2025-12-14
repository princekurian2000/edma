import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // Make sure logo.png is in the correct folder

const Navbar = () => {
  // State to manage the navbar collapse
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  // Toggle navbar state when the navbar button is clicked
  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  // Close navbar after clicking a link
  const closeNavbar = () => {
    setIsNavbarOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/" onClick={closeNavbar}>
          <img
            src={logo}
            alt="EDMA Logo"
            width="50"
            height="50"
            className="me-2 rounded-circle border border-light shadow-sm object-fit-cover"
          />
          <span className="fw-bold fs-5">EDMA</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#edmaNavbar"
          aria-controls="edmaNavbar"
          aria-expanded={isNavbarOpen ? 'true' : 'false'}
          aria-label="Toggle navigation"
          onClick={toggleNavbar} // Toggle navbar state on button click
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse ${isNavbarOpen ? 'show' : ''}`} id="edmaNavbar">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={closeNavbar}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/events" onClick={closeNavbar}>Videos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Committee" onClick={closeNavbar}>Committee</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/members" onClick={closeNavbar}>Members</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/gallery" onClick={closeNavbar}>Gallery</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/calendar" onClick={closeNavbar}>Calendar</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact" onClick={closeNavbar}>Contact</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login" onClick={closeNavbar}>Login</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
