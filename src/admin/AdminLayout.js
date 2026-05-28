import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { FaChartLine, FaUsers, FaBook, FaStore, FaCog, FaSignOutAlt, FaMusic } from 'react-icons/fa';
import '../css/Portal.css'; 

const AdminLayout = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    // 1. Leer el rol y el token al cargar
    const token = localStorage.getItem('adminToken');
    const storedRole = localStorage.getItem('adminRole');

    if (!token) {
      navigate('/admin-login'); // Si no hay token, fuera
    } else {
      setRole(storedRole); // Guardamos el rol en el estado
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('adminEmail');
    navigate('/admin-login');
  };

  const adminSidebarStyle = {
    backgroundColor: '#1a252f',
    color: '#fff'
  };

  // Si aún no carga el rol, no mostramos nada para evitar "parpadeos"
  if (!role) return null;

  return (
    <div className="portal-layout">
      <nav className="portal-sidebar" style={adminSidebarStyle}>
        <div className="portal-sidebar-header">
          <h3 style={{color: '#fff', marginBottom:'5px'}}>Ingenioware</h3>
          <span style={{
              fontSize:'0.75rem', 
              background: role === 'SuperAdmin' ? '#e74c3c' : '#2ecc71',
              padding: '2px 8px',
              borderRadius: '4px',
              color: 'white'
          }}>
            {role || 'Admin'}
          </span>
        </div>

        <ul className="admin-menu">
          
          {/* --- BLOQUE 1: SOLO SUPER ADMIN --- */}
          {role === 'SuperAdmin' && (
            <>
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
            </>
          )}

          {/* --- BLOQUE 2: VISIBLE PARA TODOS (Moderadores y Admin) --- */}
          <li>
            <NavLink to="/admin/contenido" className={({ isActive }) => isActive ? 'active-admin' : ''}>
              <FaBook /> Gestión Cuentos
            </NavLink>
          </li>
          
          <li>
            <NavLink to="/admin/canciones" className={({ isActive }) => isActive ? 'active-admin' : ''}>
              <FaMusic /> Gestión Canciones
            </NavLink>
          </li>

          {/* --- BLOQUE 3: SOLO SUPER ADMIN --- */}
          {role === 'SuperAdmin' && (
            <>
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
            </>
          )}

        </ul>

        <button onClick={handleLogout} className="btn-logout" style={{backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', marginTop: 'auto'}}>
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