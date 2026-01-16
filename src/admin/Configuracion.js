import React, { useState } from 'react';
import { FaSave, FaUserShield, FaLock, FaToggleOn, FaToggleOff, FaTrash, FaPlus } from 'react-icons/fa';
import '../css/Portal.css';

// Datos simulados de otros admins
const initialAdmins = [
  { id: 1, email: 'admin@ingenioware.com', role: 'Super Admin' },
  { id: 2, email: 'soporte@ingenioware.com', role: 'Moderador' },
];

const Configuracion = () => {
  const [admins, setAdmins] = useState(initialAdmins);
  
  // Estado para ajustes del sistema
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    allowRegistrations: true,
    debugMode: false,
  });

  // Estado para cambio de contraseña
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

  // --- MANEJADORES ---

  const handleSystemToggle = (setting) => {
    setSystemSettings({ ...systemSettings, [setting]: !systemSettings[setting] });
    // Aquí harías una llamada a la API para actualizar el estado global
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      alert('Las contraseñas no coinciden.');
      return;
    }
    alert('Contraseña de administrador actualizada. (Simulado)');
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const handleDeleteAdmin = (id) => {
    if (id === 1) {
      alert('No puedes eliminar al Super Admin principal.');
      return;
    }
    if (window.confirm('¿Eliminar acceso a este administrador?')) {
      setAdmins(admins.filter(a => a.id !== id));
    }
  };

  const handleAddAdmin = () => {
    const email = prompt('Ingresa el correo del nuevo administrador:');
    if (email && email.includes('@')) {
      setAdmins([...admins, { id: Date.now(), email, role: 'Moderador' }]);
    } else if (email) {
        alert('Correo inválido');
    }
  };

  return (
    <div className="portal-page">
      <h2>Configuración</h2>
      <p className="portal-subtitle">Ajustes de seguridad y control del sistema.</p>

      <div className="admin-config-grid">
        
        {/* --- 1. MI CUENTA (Seguridad) --- */}
        <div className="auth-card portal-form-card">
          <h3><FaUserShield /> Mi Perfil Admin</h3>
          <form onSubmit={handlePasswordChange}>
             <div className="form-group">
                <label>Correo Actual</label>
                <input type="text" value="admin@ingenioware.com" disabled style={{backgroundColor: '#f9f9f9', cursor: 'not-allowed'}} />
             </div>
             <hr className="form-divider" />
             <h4 style={{margin: '1rem 0', color: '#666', fontSize: '0.9rem'}}>Cambiar Contraseña</h4>
             <div className="form-group">
                <label>Contraseña Actual</label>
                <input type="password" value={passwordData.current} onChange={e => setPasswordData({...passwordData, current: e.target.value})} />
             </div>
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
            
            {/* --- 2. AJUSTES DEL SISTEMA --- */}
            <div className="auth-card portal-form-card" style={{marginBottom: '2rem'}}>
                <h3><FaLock /> Sistema</h3>
                
                <div className="toggle-group">
                    <label>
                        <strong>Modo Mantenimiento</strong>
                        <p>Si activas esto, la app mostrará "En Mantenimiento" a todos los usuarios.</p>
                    </label>
                    <div onClick={() => handleSystemToggle('maintenanceMode')} style={{cursor: 'pointer', fontSize: '2rem', color: systemSettings.maintenanceMode ? '#dc3545' : '#ccc'}}>
                        {systemSettings.maintenanceMode ? <FaToggleOn /> : <FaToggleOff />}
                    </div>
                </div>

                <div className="toggle-group">
                    <label>
                        <strong>Permitir Nuevos Registros</strong>
                        <p>Desactívalo para cerrar temporalmente la creación de cuentas.</p>
                    </label>
                    <div onClick={() => handleSystemToggle('allowRegistrations')} style={{cursor: 'pointer', fontSize: '2rem', color: systemSettings.allowRegistrations ? '#28a745' : '#ccc'}}>
                        {systemSettings.allowRegistrations ? <FaToggleOn /> : <FaToggleOff />}
                    </div>
                </div>
            </div>

            {/* --- 3. EQUIPO (Otros Admins) --- */}
            <div className="auth-card portal-form-card">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '1rem'}}>
                    <h3 style={{marginBottom:0}}>Equipo</h3>
                    <button onClick={handleAddAdmin} className="btn-icon-small" style={{backgroundColor: '#e0f2f1', color: '#00695c', borderRadius: '50%', padding: '8px'}}><FaPlus /></button>
                </div>
                
                <ul className="admin-team-list">
                    {admins.map(admin => (
                        <li key={admin.id} className="admin-team-item">
                            <div>
                                <strong>{admin.email}</strong>
                                <span style={{display:'block', fontSize:'0.8rem', color:'#999'}}>{admin.role}</span>
                            </div>
                            {admin.id !== 1 && (
                                <button onClick={() => handleDeleteAdmin(admin.id)} className="btn-icon-small btn-danger"><FaTrash /></button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

        </div>

      </div>
    </div>
  );
};

export default Configuracion;