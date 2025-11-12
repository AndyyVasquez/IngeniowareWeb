// src/portal/Suscripcion.js

import React, { useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa'; // Íconos que ya usas
import '../css/Pricing.css'; // ¡¡Reutilizamos tu CSS de planes!!
import '../css/Portal.css'; // (Para estilos extra del portal)

// 1. Defino los planes (basado en tu captura)
const planes = [
  {
    id: 'basico',
    nombre: 'Básico',
    precio: '$99',
    periodo: '/mes',
    descripcion: 'Perfecto para comenzar',
    features: [
      { text: 'Acceso a 50 cuentos', included: true },
      { text: '20 juegos educativos', included: true },
      { text: '15 canciones', included: true },
      { text: '1 perfil de niño', included: true },
      { text: 'Seguimiento básico', included: true },
      { text: 'Contenido premium', included: false },
      { text: 'Reportes detallados', included: false },
      { text: 'Soporte prioritario', included: false },
    ],
  },
  {
    id: 'premium',
    nombre: 'Premium',
    precio: '$199',
    periodo: '/mes',
    descripcion: 'El más popular',
    popular: true,
    features: [
      { text: 'Acceso ilimitado a cuentos', included: true },
      { text: 'Todos los juegos educativos', included: true },
      { text: 'Todas las canciones', included: true },
      { text: 'Hasta 3 perfiles de niños', included: true },
      { text: 'Seguimiento avanzado', included: true },
      { text: 'Todo el contenido premium', included: true },
      { text: 'Reportes detallados', included: true },
      { text: 'Soporte prioritario', included: false },
    ],
  },
  {
    id: 'familiar',
    nombre: 'Familiar',
    precio: '$299',
    periodo: '/mes',
    descripcion: 'Para toda la familia',
    features: [
      { text: 'Todo lo de Premium', included: true },
      { text: 'Perfiles ilimitados de niños', included: true },
      { text: 'Contenido exclusivo familiar', included: true },
      { text: 'Reportes personalizados', included: true },
      { text: 'Descarga de contenido offline', included: true },
      { text: 'Acceso a webinars de crianza', included: true },
      { text: 'Soporte prioritario 24/7', included: true },
      { text: 'Descuento en renovación', included: true },
    ],
  },
];

const Suscripcion = () => {
  // 2. Simulamos que el usuario tiene el plan "Premium".
  // En una app real, esto vendría de tu API o del localStorage.
  const [planActualId, setPlanActualId] = useState('premium');
  const [isLoading, setIsLoading] = useState(false);

  const handleCambiarPlan = (planId) => {
    if (planId === planActualId) return; // No hacer nada

    setIsLoading(true);
    // 3. Simulación de llamada a API (Stripe, etc.)
    setTimeout(() => {
      alert(`¡Plan cambiado a ${planId}! (Simulado)`);
      setPlanActualId(planId);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="portal-page">
      <h2>Gestionar mi Suscripción</h2>
      <p className="portal-subtitle">
        Tu plan actual está resaltado. Puedes mejorar, bajar o cambiar tu plan en cualquier momento.
      </p>

      {/* 4. Reutilizamos el contenedor de tu página de planes */}
      <div className="pricing-container">
        {planes.map((plan) => {
          const esPlanActual = plan.id === planActualId;

          return (
            <div
              key={plan.id}
              className={`pricing-card ${plan.popular ? 'popular' : ''} ${esPlanActual ? 'plan-actual' : ''}`}
            >
              {plan.popular && <div className="popular-badge">Más Popular</div>}
              
              <h3>{plan.nombre}</h3>
              <p className="plan-description">{plan.descripcion}</p>
              <div className="plan-price">
                <span className="price-amount">{plan.precio}</span>
                <span className="price-period">{plan.periodo}</span>
              </div>
              
              <ul className="features-list">
                {plan.features.map((feature, index) => (
                  <li key={index} className={!feature.included ? 'feature-disabled' : ''}>
                    {feature.included ? <FaCheck className="icon-check" /> : <FaTimes className="icon-times" />}
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
              
              {/* 5. Lógica de botones dinámicos */}
              <button
                className={`btn-submit ${esPlanActual ? 'btn-disabled' : ''}`}
                onClick={() => handleCambiarPlan(plan.id)}
                disabled={esPlanActual || isLoading}
              >
                {isLoading && !esPlanActual ? 'Cambiando...' : 
                 esPlanActual ? '✔ Tu Plan Actual' : `Cambiar a ${plan.nombre}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Suscripcion;