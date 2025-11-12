import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import '../css/Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">✨</span>
          <span className="logo-text">Ingenioware</span>
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <button onClick={() => scrollToSection('about')} className="nav-link">
            Nosotros
          </button>
          <button onClick={() => scrollToSection('features')} className="nav-link">
            Características
          </button>
          <button onClick={() => scrollToSection('pricing')} className="nav-link">
            Planes
          </button>
          
          <div className="navbar-buttons">
            <Link to="/login" className="btn-secondary">
              Iniciar Sesión
            </Link>
            <Link to="/registro" className="btn-primary">
              Registrarse
            </Link>
          </div>
        </div>

        <button className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

