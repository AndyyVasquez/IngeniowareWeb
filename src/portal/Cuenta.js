import React, { useState, useEffect } from 'react';
import { FaSave, FaShieldAlt, FaTrash, FaBell, FaExclamationCircle } from 'react-icons/fa';
import API_URL from '../config/api'; 
import '../css/Portal.css'; 
import '../css/Auth.css';   

const Cuenta = () => {
  // Obtenemos ID del localStorage
  const getParentId = () => {
    const data = localStorage.getItem('parentData');
    return data ? JSON.parse(data).id : null;
  };
  const padreId = getParentId();

  // Estados reales
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState({
    primer_nombre: '',
    segundo_nombre: '',
    ap_padre: '',
    am_padre: '',
    email: '',
  });

  const [seguridad, setSeguridad] = useState({
    passwordActual: '',
    nuevaPassword: '',
    confirmarPassword: '',
    parentPin: '',
  });

  // Nota: Las notificaciones usualmente requieren una tabla extra en BD.
  // Por ahora las guardaremos en el navegador (localStorage) para que persistan realmente en este dispositivo.
  const [notificaciones, setNotificaciones] = useState(() => {
    const saved = localStorage.getItem('userPrefs_notifications');
    return saved ? JSON.parse(saved) : { alertasCriticas: true, resumenSemanal: true, novedades: false };
  });

  // 1. CARGAR DATOS REALES AL INICIAR
  useEffect(() => {
    if (!padreId) return;

    fetch(`${API_URL}/padre/${padreId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
            setInfo({
                primer_nombre: data.padre.primer_nombre || '',
                segundo_nombre: data.padre.segundo_nombre || '',
                ap_padre: data.padre.ap_padre || '',
                am_padre: data.padre.am_padre || '',
                email: data.padre.email || ''
            });
            // Cargamos el PIN actual también para mostrarlo (o dejarlo en blanco por seguridad)
            setSeguridad(prev => ({ ...prev, parentPin: data.padre.pin_seguridad || '' }));
        }
      })
      .catch(err => console.error("Error cargando perfil:", err))
      .finally(() => setLoading(false));
  }, [padreId]);

  // Guardar notificaciones cuando cambien
  useEffect(() => {
    localStorage.setItem('userPrefs_notifications', JSON.stringify(notificaciones));
  }, [notificaciones]);


  // --- MANEJADORES DE CAMBIOS (INPUTS) ---
  const handleInfoChange = (e) => setInfo({ ...info, [e.target.name]: e.target.value });
  const handleSeguridadChange = (e) => setSeguridad({ ...seguridad, [e.target.name]: e.target.value });
  const handleNotifChange = (e) => setNotificaciones({ ...notificaciones, [e.target.name]: e.target.checked });

  // --- ACCIONES REALES CON EL SERVIDOR ---

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    try {
        const res = await fetch(`${API_URL}/padre/${padreId}/info`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(info)
        });
        const data = await res.json();
        alert(data.message);
        
        // Actualizar localStorage para que el saludo del portal también cambie
        if(data.success) {
            const currentLocal = JSON.parse(localStorage.getItem('parentData'));
            localStorage.setItem('parentData', JSON.stringify({
                ...currentLocal,
                nombre: info.primer_nombre, // Actualizamos nombre visible
                email: info.email
            }));
        }
    } catch (error) {
        alert('Error al conectar con el servidor');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (seguridad.nuevaPassword !== seguridad.confirmarPassword) {
        alert("La nueva contraseña no coincide con la confirmación");
        return;
    }
    if (!seguridad.passwordActual) {
        alert("Debes ingresar tu contraseña actual para hacer cambios");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/padre/${padreId}/seguridad`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                passwordActual: seguridad.passwordActual,
                password: seguridad.nuevaPassword
            })
        });
        const data = await res.json();
        
        if (data.success) {
            alert('Contraseña actualizada correctamente');
            setSeguridad({ ...seguridad, passwordActual: '', nuevaPassword: '', confirmarPassword: '' });
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        alert('Error de conexión');
    }
  };

  const handleUpdatePin = async () => {
    if (seguridad.parentPin.length !== 4) {
        alert("El PIN debe tener 4 dígitos");
        return;
    }

    // Para cambiar el PIN, pedimos la contraseña actual por seguridad (opcional, pero recomendado)
    const passConfirm = prompt("Por seguridad, ingresa tu contraseña para cambiar el PIN:");
    if (!passConfirm) return;

    try {
        const res = await fetch(`${API_URL}/padre/${padreId}/seguridad`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pin_seguridad: seguridad.parentPin,
                passwordActual: passConfirm
            })
        });
        const data = await res.json();
        alert(data.message);
    } catch (error) {
        alert('Error de conexión');
    }
  };
  
  const handleDeleteAccount = async () => {
    const confirmText = 'BORRAR';
    const userInput = prompt(`⚠️ PELIGRO: Esto borrará tu cuenta, la de tus hijos y todo el progreso.\n\nEscribe "${confirmText}" para confirmar.`);
    
    if (userInput === confirmText) {
      try {
        const res = await fetch(`${API_URL}/padre/${padreId}`, { method: 'DELETE' });
        const data = await res.json();
        
        if (data.success) {
            alert('Tu cuenta ha sido eliminada. Gracias por haber sido parte de Ingenioware.');
            localStorage.clear();
            window.location.href = '/'; 
        } else {
            alert('Error: ' + data.message);
        }
      } catch (error) {
        alert('No se pudo eliminar la cuenta por un error de conexión');
      }
    }
  };


  if (loading) return <div className="portal-page"><p>Cargando tus datos...</p></div>;

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
          
          <div className="form-row" style={{display:'flex', gap:'10px'}}>
            <div className="form-group" style={{flex:1}}>
                <label>Primer Nombre</label>
                <input type="text" name="primer_nombre" value={info.primer_nombre} onChange={handleInfoChange} required />
            </div>
            <div className="form-group" style={{flex:1}}>
                <label>Segundo Nombre</label>
                <input type="text" name="segundo_nombre" value={info.segundo_nombre} onChange={handleInfoChange} />
            </div>
          </div>

          <div className="form-row" style={{display:'flex', gap:'10px'}}>
            <div className="form-group" style={{flex:1}}>
                <label>Apellido Paterno</label>
                <input type="text" name="ap_padre" value={info.ap_padre} onChange={handleInfoChange} required />
            </div>
            <div className="form-group" style={{flex:1}}>
                <label>Apellido Materno</label>
                <input type="text" name="am_padre" value={info.am_padre} onChange={handleInfoChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Correo Electrónico</label>
            <input type="email" name="email" value={info.email} onChange={handleInfoChange} required />
          </div>

          <button type="submit" className="btn-submit">
            Guardar Cambios
          </button>
        </form>

        {/* --- 2. Formulario de Seguridad --- */}
        <form onSubmit={handleUpdatePassword} className="auth-card portal-form-card">
          <h3><FaShieldAlt /> Seguridad</h3>
          
          <div className="form-group">
            <label>Contraseña Actual (Requerida)</label>
            <input type="password" name="passwordActual" value={seguridad.passwordActual} onChange={handleSeguridadChange} placeholder="Ingresa para confirmar cambios" />
          </div>
          
          <hr className="form-divider" />
          
          <div className="form-group">
            <label>Nueva Contraseña</label>
            <input type="password" name="nuevaPassword" value={seguridad.nuevaPassword} onChange={handleSeguridadChange} />
          </div>
          <div className="form-group">
            <label>Confirmar Nueva Contraseña</label>
            <input type="password" name="confirmarPassword" value={seguridad.confirmarPassword} onChange={handleSeguridadChange} />
          </div>
          
          <button type="submit" className="btn-submit" disabled={!seguridad.nuevaPassword}>
            Actualizar Contraseña
          </button>

          <hr className="form-divider" style={{margin:'20px 0'}} />
          
          <div className="form-group">
            <label>PIN de Padre (4 dígitos)</label>
            <div style={{display:'flex', gap:'10px'}}>
                <input 
                    type="text" 
                    pattern="\d*" 
                    maxLength={4} 
                    name="parentPin" 
                    value={seguridad.parentPin} 
                    onChange={handleSeguridadChange} 
                    style={{letterSpacing: '5px', textAlign:'center', fontWeight:'bold'}}
                />
                <button type="button" onClick={handleUpdatePin} className="btn-submit btn-secondary" style={{width:'auto', whiteSpace:'nowrap'}}>
                    Cambiar PIN
                </button>
            </div>
          </div>
        </form>
      </div>

      {/* --- 3. Preferencias de Notificación (Local Storage) --- */}
      <div className="auth-card portal-form-card notification-prefs">
        <h3><FaBell /> Preferencias (En este dispositivo)</h3>
        
        <div className="toggle-group">
          <label htmlFor="alertasCriticas">
            <strong>Alertas Críticas</strong>
            <p>Avisos visuales cuando se detecten emociones fuertes.</p>
          </label>
          <label className="toggle-switch">
            <input type="checkbox" name="alertasCriticas" checked={notificaciones.alertasCriticas} onChange={handleNotifChange} />
            <span className="slider"></span>
          </label>
        </div>

        <div className="toggle-group">
          <label htmlFor="resumenSemanal">
            <strong>Modo Oscuro Automático</strong>
            <p>Ajustar interfaz según preferencia del sistema.</p>
          </label>
          <label className="toggle-switch">
            <input type="checkbox" name="resumenSemanal" checked={notificaciones.resumenSemanal} onChange={handleNotifChange} />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {/* --- 4. Zona de Peligro --- */}
      <div className="auth-card portal-form-card danger-zone">
        <h3><FaExclamationCircle /> Eliminar Cuenta</h3>
        <p>Esta acción es irreversible. Se borrará tu acceso y el progreso de todos tus hijos.</p>
        <button onClick={handleDeleteAccount} className="btn-danger">
          <FaTrash /> Eliminar mi cuenta permanentemente
        </button>
      </div>

    </div>
  );
};

export default Cuenta;