// src/portal/Perfiles.js
import React, { useState, useEffect } from 'react';
import { FaEdit, FaKey, FaTrash, FaPlus } from 'react-icons/fa';
import '../css/Portal.css'; // Reutilizamos el CSS del portal

const Perfiles = () => {
  const [perfiles, setPerfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carga los perfiles de niños desde localStorage
  useEffect(() => {
    try {
      const childDataListStr = localStorage.getItem('childDataList');
      if (childDataListStr) {
        setPerfiles(JSON.parse(childDataListStr));
      }
    } catch (error) {
      console.error("Error al cargar perfiles de niños:", error);
      alert('No se pudieron cargar los perfiles.');
    }
    setIsLoading(false);
  }, []);

  const handleResetPin = (nombre) => {
    // Lógica para restablecer el PIN (ej. abrir un modal)
    const nuevoPin = prompt(`Ingresa el nuevo PIN de 4 dígitos para ${nombre}:`);
    if (nuevoPin && /^\d{4}$/.test(nuevoPin)) {
      // Lógica de guardado (simulada)
      alert(`PIN para ${nombre} actualizado a ${nuevoPin}. (Simulado)`);
    } else if (nuevoPin) {
      alert('Error: El PIN debe ser de 4 números.');
    }
  };

  const handleEditProfile = (id) => {
    // Lógica para editar (ej. navegar a /portal/perfiles/editar/child_1)
    alert(`Navegando a la pantalla de edición para ${id}... (Próximamente)`);
  };

  const handleDeleteProfile = (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el perfil de ${nombre}?`)) {
      // Lógica para eliminar el perfil
      const nuevaLista = perfiles.filter(p => p.id !== id);
      setPerfiles(nuevaLista);
      // Actualizar localStorage
      localStorage.setItem('childDataList', JSON.stringify(nuevaLista));
      alert(`Perfil de ${nombre} eliminado.`);
    }
  };
  
  const handleAddProfile = () => {
    alert('Navegando a la pantalla de "Crear Nuevo Perfil de Niño"... (Próximamente)');
    // router.push('/portal/perfiles/nuevo')
  };

  return (
    <div className="portal-page">
      <h2>Perfiles de Niños</h2>
      <p className="portal-subtitle">
        Administra los perfiles, cambia nombres y restablece los PINes de tus hijos.
      </p>

      {isLoading ? (
        <p>Cargando perfiles...</p>
      ) : (
        <div className="profile-list">
          {perfiles.map((perfil) => (
            <div key={perfil.id} className="profile-card">
              <div className="profile-card-info">
                <span className="profile-card-avatar">{perfil.avatar_emoji}</span>
                <div>
                  <span className="profile-card-name">{perfil.nombre_completo}</span>
                  <span className="profile-card-details">
                    {perfil.edad_nino} años - (Apodo: {perfil.apodo})
                  </span>
                </div>
              </div>
              <div className="profile-card-actions">
                <button onClick={() => handleEditProfile(perfil.id)} className="btn-icon">
                  <FaEdit /> Editar
                </button>
                <button onClick={() => handleResetPin(perfil.nombre_completo)} className="btn-icon">
                  <FaKey /> Restablecer PIN
                </button>
                <button onClick={() => handleDeleteProfile(perfil.id, perfil.nombre_completo)} className="btn-icon btn-danger">
                  <FaTrash /> Eliminar
                </button>
              </div>
            </div>
          ))}
          
          <button onClick={handleAddProfile} className="btn-submit btn-add-profile">
            <FaPlus /> Añadir Nuevo Perfil de Niño
          </button>
        </div>
      )}
    </div>
  );
};

export default Perfiles;