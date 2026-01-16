// src/portal/Cuenta.js
import React, { useState, useEffect } from 'react';
import { FaSave, FaShieldAlt, FaTrash, FaBell } from 'react-icons/fa';
import '../css/Portal.css'; 
import '../css/Auth.css';   

const mockParentData = {
  nombre: 'Juan',
  apellidos: 'Pérez García',
  email: 'tucorreo@ejemplo.com',
};

const Cuenta = () => {
  // Estado para formularios
  const [info, setInfo] = useState({
    nombre: '',
    apellidos: '',
    email: '',
  });
  const [seguridad, setSeguridad] = useState({
    passwordActual: '',
    nuevaPassword: '',
    parentPin: '',
  });
  const [notificaciones, setNotificaciones] = useState({
    alertasCriticas: true,
    resumenSemanal: true,
    novedades: false,
  });

  useEffect(() => {
    setInfo({
      nombre: mockParentData.nombre,
      apellidos: mockParentData.apellidos,
      email: mockParentData.email,
    });
  }, []);

  const handleInfoChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const handleSeguridadChange = (e) => {
    setSeguridad({ ...seguridad, [e.target.name]: e.target.value });
  };

  const handleNotifChange = (e) => {
    setNotificaciones({ ...notificaciones, [e.target.name]: e.target.checked });
  };

  const handleUpdateInfo = (e) => {
    e.preventDefault();
    alert('Información personal actualizada (Simulado)');
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    alert('Contraseña actualizada (Simulado)');
  };

  const handleUpdatePin = (e) => {
    e.preventDefault();
    alert('PIN de padre actualizado (Simulado)');
  };
  
  const handleDeleteAccount = () => {
    const confirmText = 'BORRAR MI CUENTA';
    const userInput = prompt(`Esto es irreversible y borrará todos los datos de tu familia.\n\nEscribe "${confirmText}" para confirmar.`);
    
    if (userInput === confirmText) {
      alert('Cuenta eliminada exitosamente. (Simulado)');

      localStorage.removeItem('authToken');
      window.location.href = '/'; // Redirigir a la home
    } else {
      alert('Acción cancelada.');
    }
  };


  return (
    <div className="portal-page">
      <h2>Mi Cuenta</h2>
      <p className="portal-subtitle">
        Actualiza tu información personal, seguridad y preferencias.
      </p>

      {/* Grid para los formularios principales */}
      <div className="account-grid">
        {/* --- 1. Formulario de Información Personal --- */}
        <form onSubmit={handleUpdateInfo} className="auth-card portal-form-card">
          <h3><FaSave /> Información Personal</h3>
          <div className="form-group">
            <label htmlFor="nombre">Nombre(s)</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={info.nombre}
              onChange={handleInfoChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="apellidos">Apellidos</label>
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              value={info.apellidos}
              onChange={handleInfoChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={info.email}
              onChange={handleInfoChange}
            />
          </div>
          <button type="submit" className="btn-submit">
            Guardar Cambios
          </button>
        </form>

        {/* --- 2. Formulario de Seguridad (PIN y Contraseña) --- */}
        <form onSubmit={handleUpdatePassword} className="auth-card portal-form-card">
          <h3><FaShieldAlt /> Seguridad</h3>
          <div className="form-group">
            <label htmlFor="passwordActual">Contraseña Actual</label>
            <input
              type="password"
              id="passwordActual"
              name="passwordActual"
              value={seguridad.passwordActual}
              onChange={handleSeguridadChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="nuevaPassword">Nueva Contraseña</label>
            <input
              type="password"
              id="nuevaPassword"
              name="nuevaPassword"
              value={seguridad.nuevaPassword}
              onChange={handleSeguridadChange}
            />
          </div>
          <button type="submit" className="btn-submit">
            Actualizar Contraseña
          </button>

          <hr className="form-divider" />
          
          <div className="form-group">
            <label htmlFor="parentPin">Cambiar PIN de Padre (4 dígitos)</label>
            <input
              type="text" // Usamos 'text' para poder usar maxLength
              pattern="\d*" // Solo números
              id="parentPin"
              name="parentPin"
              maxLength={4}
              placeholder="••••"
              value={seguridad.parentPin}
              onChange={handleSeguridadChange}
            />
          </div>
          <button onClick={handleUpdatePin} type="button" className="btn-submit btn-secondary">
            Actualizar PIN
          </button>
        </form>
      </div>

      {/* --- 3. Preferencias de Notificación --- */}
      <div className="auth-card portal-form-card notification-prefs">
        <h3><FaBell /> Preferencias de Notificación</h3>
        
        <div className="toggle-group">
          <label htmlFor="alertasCriticas">
            <strong>Alertas Críticas</strong>
            <p>Enviarme un correo si Valo detecta una alerta emocional urgente.</p>
          </label>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              id="alertasCriticas"
              name="alertasCriticas"
              checked={notificaciones.alertasCriticas}
              onChange={handleNotifChange}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="toggle-group">
          <label htmlFor="resumenSemanal">
            <strong>Resumen Semanal</strong>
            <p>Enviarme el reporte de progreso de mis hijos cada domingo.</p>
          </label>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              id="resumenSemanal"
              name="resumenSemanal"
              checked={notificaciones.resumenSemanal}
              onChange={handleNotifChange}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="toggle-group">
          <label htmlFor="novedades">
            <strong>Novedades de Ingenioware</strong>
            <p>Avisarme sobre nuevos juegos, cuentos y artículos para padres.</p>
          </label>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              id="novedades"
              name="novedades"
              checked={notificaciones.novedades}
              onChange={handleNotifChange}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {/* --- 4. Zona de Peligro --- */}
      <div className="auth-card portal-form-card danger-zone">
        <h3>Eliminar Cuenta</h3>
        <p>Esta acción es irreversible. Se borrarán todos los datos de tu cuenta, perfiles de niños, progreso y suscripción.</p>
        <button onClick={handleDeleteAccount} className="btn-danger">
          <FaTrash /> Eliminar mi cuenta permanentemente
        </button>
      </div>

    </div>
  );
};

export default Cuenta;