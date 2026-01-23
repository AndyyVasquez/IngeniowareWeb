import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaImage, FaTimes, FaTshirt, FaGlasses, FaRedhat, FaTree } from 'react-icons/fa';
import '../css/Portal.css';
import API_URL from '../config/api';

const categorias = [
  { id: 'sombrero', nombre: 'Sombreros', icon: <FaRedhat /> },
  { id: 'lentes', nombre: 'Lentes', icon: <FaGlasses /> },
  { id: 'ropa', nombre: 'Ropa', icon: <FaTshirt /> },
  { id: 'fondo', nombre: 'Fondos', icon: <FaTree /> },
];

const GestionTienda = () => {
  const [items, setItems] = useState([]);
  const [filtro, setFiltro] = useState('sombrero');
  const [isLoading, setIsLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Formulario
  const [formData, setFormData] = useState({
    id: null,
    tipo: 'sombrero',
    nombre: '',
    precio: '',
    descripcion: '',
    imagen_url: ''
  });

  // --- 1. CARGAR ITEMS (GET) ---
  const fetchItems = async () => {
    try {
      const response = await fetch(`${API_URL}/tienda/items`);
      const data = await response.json();
      if (data.success) {
        setItems(data.items);
      }
    } catch (error) {
      console.error("Error cargando tienda:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const itemsFiltrados = items.filter(item => item.tipo === filtro);

  // --- MANEJADORES ---
  
  const handleNew = () => {
    setFormData({ id: null, tipo: filtro, nombre: '', precio: '', descripcion: '', imagen_url: '' });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setFormData(item);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if(window.confirm('¿Eliminar este artículo de la tienda?')) {
      try {
        await fetch(`${API_URL}/tienda/items/${id}`, { method: 'DELETE' });
        fetchItems(); // Recargar lista
      } catch (error) {
        alert('Error al eliminar');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Validar precio
    const precioNumerico = parseInt(formData.precio);
    if (isNaN(precioNumerico)) {
        alert("El precio debe ser un número");
        return;
    }

    const payload = { ...formData, precio: precioNumerico };
    const endpoint = isEditing 
        ? `${API_URL}/tienda/items/${formData.id}`
        : `${API_URL}/tienda/items`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
        const response = await fetch(endpoint, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();

        if (data.success) {
            alert(isEditing ? 'Artículo actualizado' : 'Artículo creado');
            setShowModal(false);
            fetchItems(); // Recargar lista
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        alert('Error de conexión');
    }
  };

  return (
    <div className="portal-page">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem'}}>
        <div>
            <h2>Gestión de Tienda</h2>
            <p className="portal-subtitle">Administra los accesorios y recompensas del Armario.</p>
        </div>
        <button className="btn-submit" style={{width: 'auto', padding: '0.8rem 1.5rem'}} onClick={handleNew}>
            <FaPlus /> Nuevo Item
        </button>
      </div>

      {/* --- PESTAÑAS DE CATEGORÍA --- */}
      <div className="admin-tabs">
        {categorias.map(cat => (
            <button 
                key={cat.id} 
                className={`admin-tab ${filtro === cat.id ? 'active' : ''}`}
                onClick={() => setFiltro(cat.id)}
            >
                {cat.icon} {cat.nombre}
            </button>
        ))}
      </div>

      {/* --- GRID DE ITEMS --- */}
      {isLoading ? <p>Cargando tienda...</p> : (
        <div className="store-grid">
            {itemsFiltrados.length > 0 ? itemsFiltrados.map(item => (
                <div key={item.id} className="store-card">
                    <div className="store-card-header">
                        <span className="store-price">{item.precio} 🪙</span>
                        <div className="store-actions-mini">
                            <button onClick={() => handleEdit(item)}><FaEdit /></button>
                            <button onClick={() => handleDelete(item.id)} className="danger"><FaTrash /></button>
                        </div>
                    </div>
                    <div className="store-image-preview">
                        <img 
                            src={item.imagen_url || 'https://via.placeholder.com/150'} 
                            alt={item.nombre} 
                            onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=Error'}
                        />
                    </div>
                    <div className="store-card-info">
                        <h4>{item.nombre}</h4>
                        <p>{item.descripcion}</p>
                    </div>
                </div>
            )) : (
                <div className="empty-state">
                    <p>No hay items en esta categoría.</p>
                </div>
            )}
        </div>
      )}

      {/* --- MODAL --- */}
      {showModal && (
        <div className="portal-modal-overlay">
            <div className="portal-modal-card auth-card" style={{maxWidth: '500px'}}>
                <button className="modal-close-btn" onClick={() => setShowModal(false)}><FaTimes /></button>
                <h3>{isEditing ? 'Editar Artículo' : 'Nuevo Artículo'}</h3>
                
                <form onSubmit={handleSave}>
                    <div className="form-row" style={{display:'flex', gap:'1rem'}}>
                        <div className="form-group" style={{flex: 1}}>
                            <label>Nombre</label>
                            <input type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required />
                        </div>
                        <div className="form-group" style={{width: '100px'}}>
                            <label>Precio (🪙)</label>
                            <input type="number" value={formData.precio} onChange={e => setFormData({...formData, precio: e.target.value})} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Categoría</label>
                        <select value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})} style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc'}}>
                            {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>URL de la Imagen (PNG transparente)</label>
                        <div className="input-wrapper">
                            <FaImage className="input-icon" />
                            <input type="text" placeholder="https://..." value={formData.imagen_url} onChange={e => setFormData({...formData, imagen_url: e.target.value})} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Descripción</label>
                        <input type="text" value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} />
                    </div>

                    <button type="submit" className="btn-submit">Guardar</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default GestionTienda;