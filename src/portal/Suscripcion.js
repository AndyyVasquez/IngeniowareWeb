import React, { useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa'; // Importamos iconos
import '../css/Portal.css'; 
import API_URL from '../config/api';

const Suscripcion = () => {
  const [loading, setLoading] = useState(false);

  // Función genérica para suscribirse a cualquier plan
  const handleSuscribirse = async (planNombre, precio) => {
    setLoading(true);
    const parentData = JSON.parse(localStorage.getItem('parentData'));

    try {
      // Nota: Asegúrate de actualizar tu backend para que reciba 'precio' y 'plan' en el body
      // Si tu backend sigue "hardcodeado" a 299, cobrará 299 sin importar el botón.
      const response = await fetch(`${API_URL}/mp/crear-suscripcion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          padre_id: parentData.id,
          email: parentData.email,
          reason: `Suscripción ${planNombre}`, // Enviamos el nombre del plan
          price: precio // Enviamos el precio (requiere ajuste en backend)
        }),
      });

      const data = await response.json();

      if (data.url) {
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
      <h2 style={{textAlign: 'center', marginBottom: '10px'}}>Elige tu Plan Ideal 💎</h2>
      <p style={{textAlign: 'center', color: '#666', marginBottom: '40px'}}>Desbloquea todo el potencial de Ingenioware para tu familia.</p>
      
      <div className="pricing-grid-3-cols">
        
        {/* --- PLAN BÁSICO (Turquesa) --- */}
        <div className="pricing-card-modern">
          <div className="card-header-modern header-basic">
            <h3>Básico</h3>
            <p>Perfecto para comenzar</p>
          </div>
          <div className="card-body-modern">
             <div className="price-tag">
                <span className="symbol">$</span>
                <span className="amount">99</span>
                <span className="period">/mes</span>
             </div>
             
             <ul className="features-list-modern">
                <li><FaCheck className="icon-check"/> Acceso a 50 cuentos</li>
                <li><FaCheck className="icon-check"/> 20 juegos educativos</li>
                <li><FaCheck className="icon-check"/> 15 canciones</li>
                <li><FaCheck className="icon-check"/> 1 perfil de niño</li>
                <li><FaCheck className="icon-check"/> Seguimiento básico</li>
                <li className="disabled"><FaTimes className="icon-times"/> Contenido premium</li>
             </ul>

             <button className="btn-modern btn-basic" onClick={() => handleSuscribirse("Básico", 99)} disabled={loading}>
                Elegir Básico
             </button>
          </div>
        </div>

        {/* --- PLAN PREMIUM (Morado - Destacado) --- */}
        <div className="pricing-card-modern featured-modern">
          <div className="ribbon">Más Popular</div> {/* Listón en la esquina */}
          <div className="card-header-modern header-premium">
            <h3>Premium</h3>
            <p>El más popular</p>
          </div>
          <div className="card-body-modern">
             <div className="price-tag">
                <span className="symbol">$</span>
                <span className="amount">199</span>
                <span className="period">/mes</span>
             </div>
             
             <ul className="features-list-modern">
                <li><FaCheck className="icon-check"/> <strong>Acceso ilimitado</strong></li>
                <li><FaCheck className="icon-check"/> Todos los juegos</li>
                <li><FaCheck className="icon-check"/> Todas las canciones</li>
                <li><FaCheck className="icon-check"/> Hasta 3 perfiles</li>
                <li><FaCheck className="icon-check"/> Seguimiento avanzado</li>
                <li><FaCheck className="icon-check"/> Contenido Premium</li>
             </ul>

             <button className="btn-modern btn-premium" onClick={() => handleSuscribirse("Premium", 199)} disabled={loading}>
                {loading ? 'Procesando...' : 'Suscribirse Ahora'}
             </button>
          </div>
        </div>

        {/* --- PLAN FAMILIAR (Rosa) --- */}
        <div className="pricing-card-modern">
          <div className="card-header-modern header-family">
            <h3>Familiar</h3>
            <p>Para toda la familia</p>
          </div>
          <div className="card-body-modern">
             <div className="price-tag">
                <span className="symbol">$</span>
                <span className="amount">299</span>
                <span className="period">/mes</span>
             </div>
             
             <ul className="features-list-modern">
                <li><FaCheck className="icon-check"/> <strong>Todo lo de Premium</strong></li>
                <li><FaCheck className="icon-check"/> Perfiles ilimitados</li>
                <li><FaCheck className="icon-check"/> Contenido exclusivo</li>
                <li><FaCheck className="icon-check"/> Reportes personalizados</li>
                <li><FaCheck className="icon-check"/> Descarga offline</li>
             </ul>

             <button className="btn-modern btn-family" onClick={() => handleSuscribirse("Familiar", 299)} disabled={loading}>
                Obtener Familiar
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Suscripcion;