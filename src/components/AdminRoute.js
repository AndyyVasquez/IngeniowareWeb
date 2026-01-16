import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Este hook revisa si existe el token ESPECIAL de administrador.
 * No confundir con el 'authToken' de los padres.
 */
const useAdminAuth = () => {
  const token = localStorage.getItem('adminToken');
  return token ? true : false;
};

const AdminRoute = () => {
  const isAuth = useAdminAuth();

  // Si es admin, renderiza la página (Outlet).
  // Si no, lo manda al login de ADMIN (/admin-login), no al login normal.
  return isAuth ? <Outlet /> : <Navigate to="/admin-login" />;
};

export default AdminRoute;