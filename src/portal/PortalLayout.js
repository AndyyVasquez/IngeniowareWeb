// src/portal/PortalLayout.js

import React from 'react';
import { Outlet, useNavigate, Link, NavLink } from 'react-router-dom';
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
          <li><NavLink to="/portal/suscripcion">Mi Suscripción</NavLink></li>
          <li><NavLink to="/portal/perfiles">Perfiles de Niños</NavLink></li>
          <li><NavLink to="/portal/cuenta">Mi Cuenta</NavLink></li>
          <li><NavLink to="/portal/progreso">Reportes</NavLink></li>
          <li><NavLink to="/portal/calendario">Calendario</NavLink></li>
          <li><NavLink to="/portal/recursos">Recursos</NavLink></li>
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