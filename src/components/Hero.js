import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';
import '../css/Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-container">
        <div className="hero-content fade-in-up">
          <h1 className="hero-title">
            Donde el aprendizaje es una{' '}
            <span className="gradient-text">nueva aventura mágica</span>
          </h1>
          <p className="hero-subtitle">
            Ingenioware ayuda a los niños a aprender valores importantes a través de 
            cuentos interactivos, juegos educativos y canciones divertidas.
          </p>
          <div className="hero-buttons">
            <Link to="/registro" className="btn-hero-primary">
              Comenzar Gratis
            </Link>
            <button className="btn-hero-secondary">
              <FaPlay /> Ver Demo
            </button>
          </div>
          <p className="hero-note">
            ✨ Sin tarjeta de crédito • Cancela cuando quieras
          </p>
        </div>

        <div className="hero-image float">
          <div className="hero-illustration">
            <div className="illustration-item" style={{ background: '#4ECDC4' }}>📚</div>
            <div className="illustration-item" style={{ background: '#FF6B6B' }}>🎮</div>
            <div className="illustration-item" style={{ background: '#FFD93D' }}>🎵</div>
            <div className="illustration-item" style={{ background: '#FF8FAB' }}>❤️</div>
            <div className="illustration-item" style={{ background: '#A06CD5' }}>⭐</div>
            <div className="illustration-central">🦁</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;