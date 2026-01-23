import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaArrowLeft, FaKey } from 'react-icons/fa';
import '../css/Auth.css';
import API_URL from '../config/api';

const Register = () => {
  const navigate = useNavigate();
  
  // Estado actualizado con campos separados
  const [formData, setFormData] = useState({
    primer_nombre: '',
    segundo_nombre: '', // Opcional
    apellido_paterno: '',
    apellido_materno: '',
    email: '',
    password: '',
    confirmPassword: '',
    pin_seguridad: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }
    if (formData.pin_seguridad.length !== 4) {
      alert('El PIN de seguridad debe ser de 4 dígitos.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primer_nombre: formData.primer_nombre,
          segundo_nombre: formData.segundo_nombre, // Se envía aunque esté vacío
          apellido_paterno: formData.apellido_paterno,
          apellido_materno: formData.apellido_materno,
          email: formData.email,
          password: formData.password,
          pin_seguridad: formData.pin_seguridad
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrarse');
      }

      console.log('Registro exitoso:', data);
      alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
      navigate('/login');

    } catch (error) {
      console.error('Error de registro:', error);
      alert(error.message || 'No se pudo conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container" style={{maxWidth: '500px'}}> {/* Un poco más ancho para los nombres */}
        <Link to="/" className="back-button">
          <FaArrowLeft /> Volver al inicio
        </Link>

        <div className="auth-card">
          <div className="auth-header">
            <div className="logo">
              <span className="logo-icon">✨</span>
              <span className="logo-text">Ingenioware</span>
            </div>
            <h1>Crear Cuenta</h1>
            <p>Únete a nosotros y empieza la aventura</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            
            {/* Fila 1: Nombres */}
            <div className="form-row" style={{display: 'flex', gap: '1rem'}}>
              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="primer_nombre">Primer Nombre *</label>
                <div className="input-wrapper">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    id="primer_nombre"
                    name="primer_nombre"
                    placeholder="Juan"
                    value={formData.primer_nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="segundo_nombre">Segundo Nombre</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="segundo_nombre"
                    name="segundo_nombre"
                    placeholder="Carlos (Opcional)"
                    value={formData.segundo_nombre}
                    onChange={handleChange}
                    style={{paddingLeft: '15px'}} 
                  />
                </div>
              </div>
            </div>

            {/* Fila 2: Apellidos */}
            <div className="form-row" style={{display: 'flex', gap: '1rem'}}>
              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="apellido_paterno">Apellido Paterno *</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="apellido_paterno"
                    name="apellido_paterno"
                    placeholder="Pérez"
                    value={formData.apellido_paterno}
                    onChange={handleChange}
                    required
                    style={{paddingLeft: '15px'}}
                  />
                </div>
              </div>
              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="apellido_materno">Apellido Materno</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="apellido_materno"
                    name="apellido_materno"
                    placeholder="García"
                    value={formData.apellido_materno}
                    onChange={handleChange}
                    style={{paddingLeft: '15px'}}
                  />
                </div>
              </div>
            </div>

            {/* Resto del formulario igual (Email, Pass, PIN) */}
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="pin_seguridad">PIN de Padre (4 dígitos)</label>
              <div className="input-wrapper">
                <FaKey className="input-icon" />
                <input
                  type="text"
                  id="pin_seguridad"
                  name="pin_seguridad"
                  placeholder="1234"
                  maxLength={4}
                  pattern="\d*"
                  value={formData.pin_seguridad}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="link-primary">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;