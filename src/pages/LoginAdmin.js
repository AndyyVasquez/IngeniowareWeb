import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserShield, FaLock, FaArrowLeft } from 'react-icons/fa';
import '../css/Auth.css'; 
const LoginAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (formData.email === 'admin@ingenioware.com' && formData.password === 'admin123') {
        localStorage.setItem('adminToken', 'admin-secret-token');
        navigate('/admin/dashboard', { replace: true });
      } else {
        alert('Credenciales de administrador incorrectas');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="auth-page admin-login-bg"> 
      <div className="auth-container">
        <div className="auth-card" style={{ borderTop: '5px solid #2c3e50' }}>
          <div className="auth-header">
            <div className="logo">
              <FaUserShield size={40} color="#2c3e50" /> 
            </div>
            <h1 style={{ color: '#2c3e50' }}>Admin Portal</h1>
            <p>Acceso restringido al personal</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Usuario Admin</label>
              <div className="input-wrapper">
                <FaUserShield className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="admin@ingenioware.com"
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
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-submit" 
              disabled={isLoading}
              style={{ backgroundColor: '#2c3e50' }} 
            >
              {isLoading ? 'Accediendo...' : 'Entrar al Panel'}
            </button>
          </form>
            
          <div style={{marginTop: '20px', textAlign: 'center'}}>
             <Link to="/" style={{color: '#666', textDecoration: 'none', fontSize: '0.9rem'}}>
                <FaArrowLeft /> Volver al sitio principal
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;