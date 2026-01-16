import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import PortalLayout from './portal/PortalLayout';
import Suscripcion from './portal/Suscripcion';
import Dashboard from './portal/Dashboard';
import Perfiles from './portal/Perfiles'; 
import Cuenta from './portal/Cuenta';
import Progreso from './portal/Progreso';
import Calendario from './portal/Calendario';
import Recursos from './portal/Recursos';
import LoginAdmin from './pages/LoginAdmin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import Usuarios from './admin/Usuarios';
import GestionCuentos from './admin/GestionCuentos';
import GestionTienda from './admin/GestionTienda';
import Configuracion from './admin/Configuracion';
import GestionCanciones  from './admin/GestorCanciones';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        

        {/* --- 3. Rutas Privadas (El Portal del Padre) --- */}
        {/* Primero, el Guardia (ProtectedRoute) revisa si hay sesión */}
        <Route element={<ProtectedRoute />}>
          {/* Si hay sesión, muestra el Layout del Portal */}
          <Route path="/portal" element={<PortalLayout />}>
            
            {/* La ruta "/portal" por defecto mostrará Suscripción */}
            <Route index element={<Dashboard />} /> 
            
            {/* Las sub-rutas */}
            <Route path="suscripcion" element={<Suscripcion />} />
             <Route path="perfiles" element={<Perfiles />} />
             <Route path="cuenta" element={<Cuenta />} /> 
             <Route path="progreso" element={<Progreso />} />
             <Route path="calendario" element={<Calendario />} />
             <Route path="recursos" element={<Recursos />} /> 
          </Route>
        </Route>
        
        {/* Opcional: una ruta 'catch-all' para redirigir al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />

      <Route path="/admin-login" element={<LoginAdmin />} />
        
        <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="usuarios" element={<Usuarios />} />
                <Route path="contenido" element={<GestionCuentos />} />
                <Route path="tienda" element={<GestionTienda />} />
                <Route path="configuracion" element={<Configuracion />} />
                <Route path="canciones" element={<GestionCanciones />} />
            </Route>
        </Route>x 

      </Routes>
    </Router>
  );
}

export default App;