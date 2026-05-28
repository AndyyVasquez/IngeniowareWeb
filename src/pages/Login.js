import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import '../css/Auth.css';
import API_URL from '../config/api';

const Login = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      console.log('Login Exitoso:', data);
      //Guardar Token
      localStorage.setItem('authToken', data.token);

      // Guardamos los datos del padre
      const parentData = {
        id: data.user.id_pad,
        nombre: data.user.nombre,
        apellidos: data.user.apellidos,
        email: data.user.email,
      };
      localStorage.setItem('parentData', JSON.stringify(parentData));
      //Datos de los hijos guardados
      if (data.user.hijos && data.user.hijos.length > 0) {
        localStorage.setItem('childDataList', JSON.stringify(data.user.hijos));
      } else {
        // Si no tiene hijos aún, guardamos una lista vacía para evitar errores
        localStorage.setItem('childDataList', JSON.stringify([]));
      }
      navigate('/portal', { replace: true });

    } catch (error) {
      console.error('Error de conexión:', error);
      alert(error.message || 'No se pudo conectar con el servidor. Revisa que esté encendido.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Link to="/" className="back-button">
          <FaArrowLeft /> Volver al inicio
        </Link>

        <div className="auth-card">
          <div className="auth-header">
            <div className="logo">
              <span className="logo-icon">✨</span>
              <span className="logo-text">Ingenioware</span>
            </div>
            <h1>Iniciar Sesión</h1>
            <p>Ingresa tus datos para continuar</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
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
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Recordarme</span>
              </label>
              <Link to="/recuperar" className="forgot-link">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? 'Conectando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="auth-divider">
            <span>o</span>
          </div>

          <div className="auth-footer">
            <p>
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="link-primary">
                Regístrate aquí
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;