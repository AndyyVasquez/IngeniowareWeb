import React from 'react';
import { FaHeart, FaBook, FaUsers } from 'react-icons/fa';
import '../css/About.css';

const About = () => {
  return (
    <section id="about" className="about section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">¿Qué es Ingenioware?</h2>
          <p className="section-subtitle">
            Una plataforma educativa diseñada para enseñar valores fundamentales 
            a niños de 4 a 12 años de manera divertida e interactiva.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-card fade-in-up">
            <div className="about-icon" style={{ background: '#FF6B6B' }}>
              <FaHeart />
            </div>
            <h3>Valores que importan</h3>
            <p>
              Enseñamos honestidad, respeto, amistad, responsabilidad y más 
              a través de contenido cuidadosamente diseñado.
            </p>
          </div>

          <div className="about-card fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="about-icon" style={{ background: '#4ECDC4' }}>
              <FaBook />
            </div>
            <h3>Aprendizaje divertido</h3>
            <p>
              Cuentos mágicos, juegos interactivos y canciones educativas 
              mantienen a los niños motivados y comprometidos.
            </p>
          </div>

          <div className="about-card fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="about-icon" style={{ background: '#FFD93D' }}>
              <FaUsers />
            </div>
            <h3>Seguimiento para padres</h3>
            <p>
              Los padres pueden monitorear el progreso, ver logros y 
              celebrar los momentos especiales de sus hijos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;