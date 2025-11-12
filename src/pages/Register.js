import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaPhone } from 'react-icons/fa';
import '../css/Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (!formData.acceptTerms) {
      alert('Debes aceptar los términos y condiciones');
      return;
    }

    setIsLoading(true);

    // Simulación de registro
    setTimeout(() => {
      console.log('Registro:', formData);
      alert('¡Registro exitoso!');
      setIsLoading(false);
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Link to="/" className="back-button">
          <FaArrowLeft /> Volver al inicio
        </Link>

        <div className="auth-card register-card">
          <div className="auth-header">
            <div className="logo">
              <span className="logo-icon">✨</span>
              <span className="logo-text">Ingenioware</span>
            </div>
            <h1>Crear Cuenta</h1>
            <p>Comienza tu aventura educativa hoy</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre">Nombre(s)</label>
                <div className="input-wrapper">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    placeholder="Juan"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="apellido_paterno">Apellido Paterno</label>
                <div className="input-wrapper">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    id="apellido_paterno"
                    name="apellido_paterno"
                    placeholder="Pérez"
                    value={formData.apellido_paterno}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="apellido_materno">Apellido Materno</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  id="apellido_materno"
                  name="apellido_materno"
                  placeholder="García"
                  value={formData.apellido_materno}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

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
              <label htmlFor="telefono">Teléfono (Opcional)</label>
              <div className="input-wrapper">
                <FaPhone className="input-icon" />
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  placeholder="+52 55 1234 5678"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
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
                    minLength="8"
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

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <div className="input-wrapper">
                  <FaLock className="input-icon" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label full-width">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  required
                />
                <span>
                  Acepto los{' '}
                  <Link to="/terminos" className="link-primary">
                    Términos y Condiciones
                  </Link>{' '}
                  y la{' '}
                  <Link to="/privacidad" className="link-primary">
                    Política de Privacidad
                  </Link>
                </span>
              </label>
            </div>

            <button type="submit" className="btn-submit" disabled={isLoading}>
{isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
</button>
</form>
<div className="auth-divider">
        <span>o</span>
      </div>

      <div className="auth-footer">
        <p>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="link-primary">
            Inicia sesión aquí
          </Link>
        </p>
      </div>

      <div className="benefits-note">
        <p>✨ 14 días de prueba gratis</p>
        <p>💳 Sin tarjeta de crédito</p>
        <p>🔄 Cancela cuando quieras</p>
      </div>
    </div>
  </div>
</div>
  );
};
export default Register;