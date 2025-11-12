import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const useAuth = () => {
//Simulado en AsyncStorage por el momento
  const token = localStorage.getItem('authToken');
  
  // Si existe el token, el usuario está autenticado.
  return token ? true : false;
};

const ProtectedRoute = () => {
  const isAuth = useAuth();

  // Si no, lo "patea" de regreso a la pantalla de login.
  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;