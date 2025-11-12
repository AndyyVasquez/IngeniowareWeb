import React from 'react';
import '../css/Features.css';

const Features = () => {
  const features = [
    {
      emoji: '📚',
      title: 'Cuentos Interactivos',
      description: 'Historias mágicas que enseñan valores importantes',
      color: '#4ECDC4',
    },
    {
      emoji: '🎮',
      title: 'Juegos Educativos',
      description: 'Aprende jugando con actividades divertidas',
      color: '#FF6B6B',
    },
    {
      emoji: '🎵',
      title: 'Canciones',
      description: 'Ritmos del corazón que enseñan y entretienen',
      color: '#FFD93D',
    },
    {
      emoji: '⭐',
      title: 'Sistema de Logros',
      description: 'Recompensas y estrellas por cada avance',
      color: '#A06CD5',
    },
    {
      emoji: '❤️',
      title: 'Buenos Momentos',
      description: 'Captura y celebra los momentos especiales',
      color: '#FF8FAB',
    },
    {
      emoji: '📊',
      title: 'Seguimiento',
      description: 'Los padres pueden ver el progreso en tiempo real',
      color: '#95E1D3',
    },
  ];

  return (
    <section id="features" className="features section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Características principales</h2>
          <p className="section-subtitle">
            Todo lo que necesitas para que tus hijos aprendan valores 
            mientras se divierten
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="feature-emoji" style={{ background: feature.color }}>
                {feature.emoji}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;