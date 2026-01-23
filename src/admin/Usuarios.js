import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaBan, FaTrash, FaCheckCircle, FaTimesCircle, FaChild } from 'react-icons/fa';
import '../css/Portal.css'; 
import API_URL from '../config/api';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  // --- 1. CARGAR USUARIOS REALES ---
  const fetchUsuarios = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/usuarios`);
      const data = await response.json();
      if (data.success) {
        setUsuarios(data.usuarios);
      }
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Filtrado local (Buscador)
  const usuariosFiltrados = usuarios.filter(u => {
    const nombreCompleto = `${u.primer_nombre} ${u.ap_padre}`.toLowerCase();
    const email = u.email.toLowerCase();
    const term = busqueda.toLowerCase();
    return nombreCompleto.includes(term) || email.includes(term);
  });

  // --- 2. BLOQUEAR / DESBLOQUEAR ---
  const handleToggleBloqueo = async (usuario) => {
    const nuevoEstado = usuario.estado === 'activo' ? 'bloqueado' : 'activo';
    const confirmMsg = usuario.estado === 'activo' 
        ? '¿Bloquear acceso a este usuario?' 
        : '¿Reactivar acceso a este usuario?';

    if(window.confirm(confirmMsg)) {
        try {
            await fetch(`${API_URL}/admin/usuarios/${usuario.id}/estado`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: nuevoEstado })
            });
            fetchUsuarios(); // Recargar lista
        } catch (error) {
            alert('Error al cambiar estado');
        }
    }
  };

  // --- 3. ELIMINAR ---
  const handleEliminar = async (id) => {
    if(window.confirm('ADVERTENCIA: Esto eliminará al padre y a TODOS sus hijos. ¿Continuar?')) {
        try {
            await fetch(`${API_URL}/admin/usuarios/${id}`, { method: 'DELETE' });
            fetchUsuarios(); 
        } catch (error) {
            alert('Error al eliminar');
        }
    }
  };

  return (
    <div className="portal-page">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem'}}>
        <div>
            <h2>Gestión de Usuarios</h2>
            <p className="portal-subtitle">Administra a los padres registrados en la plataforma.</p>
        </div>
        <div className="search-bar" style={{width: '300px'}}>
            <FaSearch className="search-icon" />
            <input 
                type="text" 
                placeholder="Buscar por nombre o email..." 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />
        </div>
      </div>

      {isLoading ? <p>Cargando usuarios...</p> : (
        <div className="admin-table-container">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Hijos</th>
                        <th>Plan</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuariosFiltrados.map(usuario => (
                        <tr key={usuario.id} style={{opacity: usuario.estado === 'bloqueado' ? 0.6 : 1}}>
                            <td>#{usuario.id}</td>
                            <td>
                                <strong>{usuario.primer_nombre} {usuario.ap_padre}</strong>
                                <br/>
                                <small style={{color:'#999'}}>Reg: {new Date(usuario.created_at).toLocaleDateString()}</small>
                            </td>
                            <td>{usuario.email}</td>
                            <td>
                                <span style={{display:'flex', alignItems:'center', gap:'5px', background:'#f0f0f0', padding:'2px 8px', borderRadius:'10px', width:'fit-content'}}>
                                    <FaChild color="#666"/> {usuario.total_hijos}
                                </span>
                            </td>
                            <td>
                                <span className={`badge plan-${usuario.suscripcion_tipo}`}>
                                    {usuario.suscripcion_tipo || 'free'}
                                </span>
                            </td>
                            <td>
                                <span className={`status-indicator ${usuario.estado}`}>
                                    {usuario.estado === 'activo' ? <FaCheckCircle /> : <FaBan />}
                                    {usuario.estado}
                                </span>
                            </td>
                            <td>
                                <div className="action-buttons">
                                    <button 
                                        className={`btn-icon-small ${usuario.estado === 'activo' ? 'btn-warn' : ''}`} 
                                        onClick={() => handleToggleBloqueo(usuario)} 
                                        title={usuario.estado === 'activo' ? "Bloquear" : "Activar"}
                                    >
                                        <FaBan />
                                    </button>
                                    <button 
                                        className="btn-icon-small btn-danger" 
                                        onClick={() => handleEliminar(usuario.id)} 
                                        title="Eliminar"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {usuariosFiltrados.length === 0 && <p style={{textAlign:'center', padding:'20px', color:'#999'}}>No se encontraron usuarios.</p>}
        </div>
      )}
    </div>
  );
};

export default Usuarios;