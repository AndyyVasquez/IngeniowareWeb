// src/portal/PortalLayout.js

import React from 'react';
import { Outlet, useNavigate, Link, NavLink } from 'react-router-dom';

const PortalLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Borra el token simulado y redirige al inicio
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <div className="portal-layout">
      <nav className="portal-sidebar">
        <div className="portal-sidebar-header">
          <h3>Portal de Padre</h3>
        </div>
        <ul>
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
      <main className="portal-content">
        <Outlet />
      </main>
    </div>
  );
};

export default PortalLayout;