import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserShield, FaLock, FaArrowLeft } from 'react-icons/fa';
import '../css/Auth.css'; 
import API_URL from '../config/api'; // Importamos la configuración de la API

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        // 1. Petición REAL al servidor
        const response = await fetch(`${API_URL}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            // 2. Guardar credenciales y ROL
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminRole', data.admin.role); // 'Super Admin' o 'Moderador'
            localStorage.setItem('adminEmail', data.admin.email);
            
          // LoginAdmin.js (Fragmento)

if (data.success) {
    // ... guardar tokens ...
    localStorage.setItem('adminRole', data.admin.role);

    // REDIRECCIÓN INTELIGENTE
    if (data.admin.role === 'SuperAdmin') {
        navigate('/admin/dashboard', { replace: true });
    } else {
        // Si es moderador, lo mandamos directo a su trabajo
        navigate('/admin/contenido', { replace: true });
    }
}
        } else {
            alert(data.message || 'Error al iniciar sesión');
        }

    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo conectar con el servidor.");
    } finally {
        setIsLoading(false);
    }
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
              {isLoading ? 'Verificando...' : 'Entrar al Panel'}
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