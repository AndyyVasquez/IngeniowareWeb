import React, { useState } from 'react';
import '../css/Portal.css'; 
import API_URL from '../config/api';

const Suscripcion = () => {
  const [loading, setLoading] = useState(false);

  const handleSuscribirse = async () => {
    setLoading(true);
    const parentData = JSON.parse(localStorage.getItem('parentData'));

    try {
      // 1. Pedimos al Backend que cree el link de suscripción
      const response = await fetch(`${API_URL}/mp/crear-suscripcion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          padre_id: parentData.id,
          email: parentData.email // Mercado Pago pide el email
        }),
      });

      const data = await response.json();

      if (data.url) {
        // 2. Redirigimos al usuario a Mercado Pago
        window.location.href = data.url;
      } else {
        alert("Error al generar el link de pago");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portal-page">
      <h2>Planes de Suscripción 💎</h2>
      <div className="pricing-grid">
        
        {/* Plan Gratis */}
        <div className="pricing-card">
          <h3>Básico</h3>
          <p className="price">$0</p>
          <button className="btn-outline" disabled>Tu Plan Actual</button>
        </div>

        {/* Plan Premium */}
        <div className="pricing-card featured">
          <h3>Premium</h3>
          <p className="price">$299 <span>/mes</span></p>
          <ul>
            <li>Cobro automático mensual</li>
            <li>Cancela cuando quieras</li>
            <li>Acceso total a reportes</li>
          </ul>
          
          <button 
            className="btn-submit" 
            onClick={handleSuscribirse}
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Suscribirse con Mercado Pago'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Suscripcion;