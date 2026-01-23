import React, { useState, useEffect } from 'react';
import { FaUserShield, FaLock, FaToggleOn, FaToggleOff, FaTrash, FaPlus } from 'react-icons/fa';
import API_URL from '../config/api';
import '../css/Portal.css';

const Configuracion = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

 
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    allowRegistrations: true,
  });

  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

  // 1. CARGAR ADMINS REALES AL INICIAR
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
        const res = await fetch(`${API_URL}/admin/list`);
        const data = await res.json();
        if(data.success) setAdmins(data.admins);
    } catch (error) {
        console.error("Error cargando admins:", error);
    } finally {
        setLoading(false);
    }
  };

  // --- MANEJADORES ---

  const handleSystemToggle = (setting) => {
    setSystemSettings({ ...systemSettings, [setting]: !systemSettings[setting] });
    alert("Configuración cambiada (Efecto visual, requiere tabla de configuración en BD para persistir)");
  };

  const handleDeleteAdmin = async (id, role) => {
    if (role === 'Super Admin') {
      alert('No puedes eliminar al Super Admin principal.');
      return;
    }
    if (window.confirm('¿Seguro que deseas eliminar este administrador?')) {
      try {
        const res = await fetch(`${API_URL}/admin/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
            alert('Administrador eliminado');
            fetchAdmins(); // Recargar lista
        } else {
            alert(data.message);
        }
      } catch (error) {
        alert('Error de conexión');
      }
    }
  };

  const handleAddAdmin = async () => {
    const email = prompt('Ingresa el correo del nuevo administrador:');
    if (!email) return;

    
    const password = prompt('Asigna una contraseña para este nuevo admin:');
    if (!password) return;

    try {
        const res = await fetch(`${API_URL}/admin/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role: 'Moderador' })
        });
        const data = await res.json();
        
        if (data.success) {
            alert('¡Nuevo admin creado con éxito!');
            fetchAdmins(); // Recargar lista
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        alert('No se pudo conectar con el servidor');
    }
  };


  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      alert('Las contraseñas no coinciden.');
      return;
    }
    alert('Función pendiente: Para esto necesitas un endpoint /api/admin/change-password');
  };

  return (
    <div className="portal-page">
      <h2>Configuración</h2>
      <p className="portal-subtitle">Ajustes de seguridad y control del sistema.</p>

      <div className="admin-config-grid">
        
        
        <div className="auth-card portal-form-card">
          <h3><FaUserShield /> Mi Perfil Admin</h3>
          <form onSubmit={handlePasswordChange}>
             <div className="form-group">
                <label>Correo Actual</label>
                <input type="text" value="Sesión Actual" disabled style={{backgroundColor: '#f9f9f9', cursor: 'not-allowed'}} />
             </div>
             <hr className="form-divider" />
             <h4 style={{margin: '1rem 0', color: '#666', fontSize: '0.9rem'}}>Cambiar Contraseña</h4>
             <div className="form-group">
                <label>Nueva Contraseña</label>
                <input type="password" value={passwordData.new} onChange={e => setPasswordData({...passwordData, new: e.target.value})} />
             </div>
             <div className="form-group">
                <label>Confirmar Nueva Contraseña</label>
                <input type="password" value={passwordData.confirm} onChange={e => setPasswordData({...passwordData, confirm: e.target.value})} />
             </div>
             <button type="submit" className="btn-submit">Actualizar Credenciales</button>
          </form>
        </div>

        <div className="admin-config-right-col">
            
            
            <div className="auth-card portal-form-card" style={{marginBottom: '2rem'}}>
                <h3><FaLock /> Sistema</h3>
                <div className="toggle-group">
                    <label>
                        <strong>Modo Mantenimiento</strong>
                        <p>Desactiva el acceso a usuarios.</p>
                    </label>
                    <div onClick={() => handleSystemToggle('maintenanceMode')} style={{cursor: 'pointer', fontSize: '2rem', color: systemSettings.maintenanceMode ? '#dc3545' : '#ccc'}}>
                        {systemSettings.maintenanceMode ? <FaToggleOn /> : <FaToggleOff />}
                    </div>
                </div>
            </div>

            
            <div className="auth-card portal-form-card">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '1rem'}}>
                    <h3 style={{marginBottom:0}}>Equipo ({admins.length})</h3>
                    <button onClick={handleAddAdmin} className="btn-icon-small" title="Agregar Admin" style={{backgroundColor: '#e0f2f1', color: '#00695c', borderRadius: '50%', padding: '8px'}}>
                        <FaPlus />
                    </button>
                </div>
                
                {loading ? <p>Cargando equipo...</p> : (
                    <ul className="admin-team-list">
                        {admins.map(admin => (
                            <li key={admin.id} className="admin-team-item">
                                <div>
                                    <strong>{admin.email}</strong>
                                    <span style={{display:'block', fontSize:'0.8rem', color: admin.role === 'Super Admin' ? '#4B0082' : '#999'}}>
                                        {admin.role}
                                    </span>
                                </div>
                                {admin.role !== 'Super Admin' && (
                                    <button onClick={() => handleDeleteAdmin(admin.id, admin.role)} className="btn-icon-small btn-danger"><FaTrash /></button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

        </div>
      </div>
    </div>
  );
};

export default Configuracion;