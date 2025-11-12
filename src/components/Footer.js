import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">✨</span>
              <span className="logo-text">Ingenioware</span>
            </div>
            <p className="footer-description">
              Donde el aprendizaje es una nueva aventura mágica. 
              Ayudamos a los niños a desarrollar valores importantes 
              mientras se divierten.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Producto</h3>
            <ul>
              <li><a href="#features">Características</a></li>
              <li><a href="#pricing">Planes</a></li>
              <li><Link to="/registro">Prueba Gratis</Link></li>
              <li><a href="#about">Sobre Nosotros</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Recursos</h3>
            <ul>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/guias">Guías para Padres</a></li>
              <li><a href="/ayuda">Centro de Ayuda</a></li>
              <li><a href="/faq">Preguntas Frecuentes</a></li>
            </ul>
          </div>

         
          <div className="footer-section">
            <h3>Contacto</h3>
            <ul className="contact-list">
              <li>
                <FaEnvelope />
                <a href="mailto:hola@ingenioware.com">hola@ingenioware.com</a>
              </li>
              <li>
                <FaPhone />
                <a href="tel:+525555555555">+52 55 5555 5555</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Ingenioware. Todos los derechos reservados.</p>
          <p>Hecho con ❤️ para ayudar a los niños a crecer con valores</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;