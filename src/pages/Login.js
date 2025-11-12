import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import '../css/Auth.css';

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

    // Simulación de login
    setTimeout(() => {
      console.log('Login:', formData);
      
      // --- ¡CAMBIO CLAVE AQUÍ! ---
      
      // 1. Simulamos el token de sesión del padre
      const fakeToken = 'jwt-token-simulado-12345';
      localStorage.setItem('authToken', fakeToken);
      
      // 2. Simulamos la LISTA de niños que este padre tiene
      const childDataList = [
        {
          id: 'child_1',
          nombre_completo: 'Santiago Matias Lozano',
          apodo: 'Santi',
          avatar_emoji: '🦁',
          edad_nino: 7,
        },
        // {
        //   id: 'child_2',
        //   nombre_completo: 'Sofía Pérez',
        //   apodo: 'Sofi',
        //   avatar_emoji: '🦄',
        //   edad_nino: 5,
        // }
      ];
      // Guardamos la LISTA en localStorage
      localStorage.setItem('childDataList', JSON.stringify(childDataList));
      
      // 3. Simulamos los datos del padre (para la pág de "Mi Cuenta")
      const parentData = {
        nombre: 'Juan',
        apellidos: 'Pérez García',
        email: formData.email,
      };
      localStorage.setItem('parentData', JSON.stringify(parentData));

      setIsLoading(false);
      
      // 4. Redirigimos al portal
      navigate('/portal', { replace: true }); // Lo mandamos directo a Perfiles
      

    }, 1500);
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
                  type={showPassword ? 'text' : 'password'}
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
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
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