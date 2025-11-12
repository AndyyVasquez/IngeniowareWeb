// src/portal/PortalLayout.js

import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
// import '../css/Portal.css'; // (Necesitarás crear este archivo CSS)

// Este es el "esqueleto" de la sección privada (el dashboard del padre)
const PortalLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Borra el token simulado y redirige al inicio
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <div className="portal-layout">
      {/* Este sería tu menú lateral (Sidebar) */}
      <nav className="portal-sidebar">
        <div className="portal-sidebar-header">
          {/* <img src={logo} alt="Ingenioware" /> */}
          <h3>Portal de Padre</h3>
        </div>
        <ul>
          {/* Estos links apuntan a tus rutas privadas */}
          <li><Link to="/portal/suscripcion">Mi Suscripción</Link></li>
          <li><Link to="/portal/perfiles">Perfiles de Niños</Link></li>
          <li><Link to="/portal/cuenta">Mi Cuenta</Link></li>
          <li><Link to="/portal/progreso">Reportes</Link></li>
        </ul>
        <button onClick={handleLogout} className="btn-logout">
          Cerrar Sesión
        </button>
      </nav>

      {/* El <Outlet> es el área donde se renderizará tu página */}
      <main className="portal-content">
        <Outlet />
      </main>
    </div>
  );
};

export default PortalLayout;