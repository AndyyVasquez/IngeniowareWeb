import React, { useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import '../css/Pricing.css';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Básico',
      description: 'Perfecto para comenzar',
      priceMonthly: 99,
      priceYearly: 990,
      color: '#4ECDC4',
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
      popular: false,
    },
    {
      name: 'Premium',
      description: 'El más popular',
      priceMonthly: 199,
      priceYearly: 1990,
      color: '#A06CD5',
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
      popular: true,
    },
    {
      name: 'Familiar',
      description: 'Para toda la familia',
      priceMonthly: 299,
      priceYearly: 2990,
      color: '#FF8FAB',
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
      popular: false,
    },
  ];

  const getPrice = (plan) => {
    return billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;
  };

  const getSavings = (plan) => {
    const monthlyCost = plan.priceMonthly * 12;
    const yearlyCost = plan.priceYearly;
    return Math.round(((monthlyCost - yearlyCost) / monthlyCost) * 100);
  };

  return (
    <section id="pricing" className="pricing section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Planes para cada familia</h2>
          <p className="section-subtitle">
            Elige el plan que mejor se adapte a tus necesidades. 
            Todos incluyen 14 días de prueba gratis.
          </p>
        </div>

        <div className="billing-toggle">
          <button
            className={billingCycle === 'monthly' ? 'active' : ''}
            onClick={() => setBillingCycle('monthly')}
          >
            Mensual
          </button>
          <button
            className={billingCycle === 'yearly' ? 'active' : ''}
            onClick={() => setBillingCycle('yearly')}
          >
            Anual
            <span className="save-badge">Ahorra hasta 20%</span>
          </button>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`pricing-card fade-in-up ${plan.popular ? 'popular' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && <div className="popular-badge">Más Popular</div>}
              
              <div className="plan-header" style={{ background: plan.color }}>
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
              </div>

              <div className="plan-price">
                <span className="currency">$</span>
                <span className="amount">{getPrice(plan)}</span>
                <span className="period">
                  /{billingCycle === 'monthly' ? 'mes' : 'año'}
                </span>
              </div>

              {billingCycle === 'yearly' && (
                <div className="savings">
                  Ahorras {getSavings(plan)}% anualmente
                </div>
              )}

              <ul className="features-list">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className={feature.included ? 'included' : 'not-included'}>
                    {feature.included ? (
                      <FaCheck className="check-icon" />
                    ) : (
                      <FaTimes className="times-icon" />
                    )}
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>

              <button
                className="btn-plan"
                style={{
                  background: plan.popular ? plan.color : 'transparent',
                  color: plan.popular ? 'white' : plan.color,
                  border: `2px solid ${plan.color}`,
                }}
              >
                Comenzar Prueba Gratis
              </button>
            </div>
          ))}
        </div>

        <div className="pricing-note">
          <p>✨ Todas las suscripciones incluyen 14 días de prueba gratis</p>
          <p>💳 Sin tarjeta de crédito requerida para probar</p>
          <p>🔄 Cancela en cualquier momento</p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;