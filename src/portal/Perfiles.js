import React, { useState, useEffect } from 'react';
import { FaEdit, FaKey, FaTrash, FaPlus, FaTimes, FaUserAstronaut } from 'react-icons/fa';
import '../css/Portal.css'; // Reutilizamos CSS

const Perfiles = () => {
  const [perfiles, setPerfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Estado para el formulario de nuevo niño
  const [nuevoNino, setNuevoNino] = useState({
    nombre: '',
    apodo: '',
    fecha_nacimiento: '',
    avatar_emoji: '🦁',
    pin: ''
  });

  // Obtener ID del padre de la sesión
  const getParentId = () => {
    const parentData = localStorage.getItem('parentData');
    if (parentData) {
      return JSON.parse(parentData).id;
    }
    return null;
  };

  // --- 1. CARGAR PERFILES (GET) ---
  const fetchPerfiles = async () => {
    const padreId = getParentId();
    if (!padreId) return;

    try {
      const response = await fetch(`http://localhost:3000/api/ninos/${padreId}`);
      const data = await response.json();
      
      if (data.success) {
        setPerfiles(data.ninos);
        // Actualizamos también el localStorage para que otras partes de la app (como el Dashboard) estén al día
        localStorage.setItem('childDataList', JSON.stringify(data.ninos));
      }
    } catch (error) {
      console.error("Error al cargar perfiles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPerfiles();
  }, []);

  // --- 2. CREAR NIÑO (POST) ---
  const handleSaveChild = async (e) => {
    e.preventDefault();
    const padreId = getParentId();

    if (!nuevoNino.pin || nuevoNino.pin.length !== 4) {
      alert("El PIN debe ser de 4 dígitos");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/ninos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          padre_id: padreId,
          ...nuevoNino
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('¡Perfil creado con éxito!');
        setShowModal(false);
        setNuevoNino({ nombre: '', apodo: '', fecha_nacimiento: '', avatar_emoji: '🦁', pin: '' }); // Limpiar form
        fetchPerfiles(); // Recargar lista
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Error al conectar con el servidor');
    }
  };

  // --- 3. ELIMINAR NIÑO (DELETE) ---
  const handleDeleteProfile = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el perfil de ${nombre}?`)) {
      try {
        const response = await fetch(`http://localhost:3000/api/ninos/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();

        if (data.success) {
          alert('Perfil eliminado.');
          fetchPerfiles(); // Recargar lista
        }
      } catch (error) {
        console.error(error);
        alert('No se pudo eliminar el perfil.');
      }
    }
  };

  const handleEditProfile = (id) => {
    alert(`Próximamente: Editar perfil ${id} (Implementa el PUT en el backend primero)`);
  };

  const handleResetPin = (nombre) => {
    alert(`Próximamente: Reset PIN para ${nombre}`);
  };

  return (
    <div className="portal-page">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
           <h2>Perfiles de Niños</h2>
           <p className="portal-subtitle">Administra quién usa la app en casa.</p>
        </div>
      </div>

      {isLoading ? (
        <p>Cargando perfiles...</p>
      ) : (
        <div className="profile-list">
          {perfiles.length > 0 ? perfiles.map((perfil) => (
            <div key={perfil.id} className="profile-card">
              <div className="profile-card-info">
                <span className="profile-card-avatar">{perfil.avatar_emoji}</span>
                <div>
                  <span className="profile-card-name">{perfil.nombre}</span>
                  <span className="profile-card-details">
                    {/* Calculamos edad simple si hay fecha, sino mostramos 'Sin edad' */}
                    {perfil.fecha_nacimiento ? `${new Date().getFullYear() - new Date(perfil.fecha_nacimiento).getFullYear()} años` : ''} 
                    {perfil.apodo ? ` - (Apodo: ${perfil.apodo})` : ''}
                  </span>
                  <div style={{fontSize:'0.85rem', color:'#4B0082', marginTop:'4px'}}>
                     💰 {perfil.monedas} Monedas
                  </div>
                </div>
              </div>
              <div className="profile-card-actions">
                <button onClick={() => handleEditProfile(perfil.id)} className="btn-icon">
                  <FaEdit /> Editar
                </button>
                <button onClick={() => handleResetPin(perfil.nombre)} className="btn-icon">
                  <FaKey /> PIN
                </button>
                <button onClick={() => handleDeleteProfile(perfil.id, perfil.nombre)} className="btn-icon btn-danger">
                  <FaTrash />
                </button>
              </div>
            </div>
          )) : (
            <div className="empty-state" style={{textAlign:'center', padding:'2rem', background:'#f9f9f9', borderRadius:'12px'}}>
                <FaUserAstronaut size={40} color="#ccc" />
                <p style={{color:'#666', marginTop:'1rem'}}>Aún no has agregado perfiles de niños.</p>
            </div>
          )}
          
          <button onClick={() => setShowModal(true)} className="btn-submit btn-add-profile">
            <FaPlus /> Añadir Nuevo Perfil de Niño
          </button>
        </div>
      )}

      {/* --- MODAL PARA AÑADIR NIÑO --- */}
      {showModal && (
        <div className="portal-modal-overlay">
            <div className="portal-modal-card auth-card" style={{maxWidth: '500px'}}>
                <button className="modal-close-btn" onClick={() => setShowModal(false)}><FaTimes /></button>
                <h3>Nuevo Aventurero</h3>
                
                <form onSubmit={handleSaveChild}>
                    <div className="form-group">
                        <label>Nombre del Niño</label>
                        <input 
                            type="text" 
                            value={nuevoNino.nombre} 
                            onChange={e => setNuevoNino({...nuevoNino, nombre: e.target.value})} 
                            required 
                            placeholder="Ej. Leonardo"
                        />
                    </div>
                    <div className="form-row" style={{display:'flex', gap:'1rem'}}>
                         <div className="form-group" style={{flex:1}}>
                            <label>Apodo (Opcional)</label>
                            <input 
                                type="text" 
                                value={nuevoNino.apodo} 
                                onChange={e => setNuevoNino({...nuevoNino, apodo: e.target.value})} 
                                placeholder="Ej. Leo"
                            />
                        </div>
                        <div className="form-group" style={{width:'140px'}}>
                            <label>Fecha Nac.</label>
                            <input 
                                type="date" 
                                value={nuevoNino.fecha_nacimiento} 
                                onChange={e => setNuevoNino({...nuevoNino, fecha_nacimiento: e.target.value})} 
                            />
                        </div>
                    </div>

                    <div className="form-row" style={{display:'flex', gap:'1rem'}}>
                        <div className="form-group" style={{flex:1}}>
                            <label>Elige un Avatar</label>
                            <select 
                                value={nuevoNino.avatar_emoji}
                                onChange={e => setNuevoNino({...nuevoNino, avatar_emoji: e.target.value})}
                                style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ccc', fontSize:'1.2rem'}}
                            >
                                <option value="🦁">🦁 León</option>
                                <option value="🦄">🦄 Unicornio</option>
                                <option value="🦖">🦖 Dinosaurio</option>
                                <option value="🚀">🚀 Cohete</option>
                                <option value="🐱">🐱 Gato</option>
                                <option value="🐶">🐶 Perro</option>
                            </select>
                        </div>
                        <div className="form-group" style={{flex:1}}>
                            <label>PIN del Niño</label>
                            <input 
                                type="text" 
                                maxLength={4}
                                pattern="\d*"
                                placeholder="0000"
                                value={nuevoNino.pin} 
                                onChange={e => setNuevoNino({...nuevoNino, pin: e.target.value})} 
                                required 
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-submit">Crear Perfil</button>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};

export default Perfiles;