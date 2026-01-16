import React from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { FaChartLine, FaUsers, FaBook, FaStore, FaCog, FaSignOutAlt } from 'react-icons/fa';
import '../css/Portal.css'; 
const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  // Estilos en línea o clases específicas para diferenciarlo del portal de padres
  const adminSidebarStyle = {
    backgroundColor: '#1a252f', // Azul oscuro/Negro para admin
    color: '#fff'
  };

  return (
    <div className="portal-layout">
      {/* Sidebar Oscuro para Admin */}
      <nav className="portal-sidebar" style={adminSidebarStyle}>
        <div className="portal-sidebar-header">
          <h3 style={{color: '#fff'}}>Ingenioware <span style={{fontSize:'0.8rem', opacity: 0.7}}>Admin</span></h3>
        </div>
        <ul className="admin-menu">
          <li>
            <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active-admin' : ''}>
              <FaChartLine /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/usuarios" className={({ isActive }) => isActive ? 'active-admin' : ''}>
              <FaUsers /> Usuarios y Clientes
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/contenido" className={({ isActive }) => isActive ? 'active-admin' : ''}>
              <FaBook /> Gestión Cuentos
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/tienda" className={({ isActive }) => isActive ? 'active-admin' : ''}>
              <FaStore /> Gestión Tienda
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/configuracion" className={({ isActive }) => isActive ? 'active-admin' : ''}>
              <FaCog /> Configuración
            </NavLink>
          </li>
        </ul>
        <button onClick={handleLogout} className="btn-logout" style={{backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff'}}>
          <FaSignOutAlt /> Salir
        </button>
      </nav>

      <main className="portal-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;