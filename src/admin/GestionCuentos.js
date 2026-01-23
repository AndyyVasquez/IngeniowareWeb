import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaImage, FaTimes, FaBook } from 'react-icons/fa';
import '../css/Portal.css'; 
import API_URL from '../config/api';

const GestionCuentos = () => {
  const [cuentos, setCuentos] = useState([]);
  const [valoresDB, setValoresDB] = useState([]); // Lista de valores para el select
  const [isLoading, setIsLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Formulario
  const [formData, setFormData] = useState({
    id: null,
    titulo: '',
    valor_id: '', // Ahora usamos ID, no string
    sinopsis: '',
    portada_url: '',
    contenido_url: '' // URL del texto o audio
  });

  // --- 1. CARGAR DATOS (Cuentos y Valores) ---
  const fetchData = async () => {
    try {
      // Cargamos valores y cuentos en paralelo
      const [resValores, resCuentos] = await Promise.all([
        fetch(`${API_URL}/valores`),
       
        fetch(`${API_URL}/cuentos`)
      ]);

      const dataValores = await resValores.json();
      const dataCuentos = await resCuentos.json();

      if (dataValores.success) setValoresDB(dataValores.valores);
      if (dataCuentos.success) setCuentos(dataCuentos.cuentos);

    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- MANEJADORES ---

  const handleNew = () => {
    // Valor por defecto: el primer valor de la lista o 1
    const defaultValor = valoresDB.length > 0 ? valoresDB[0].id : '';
    setFormData({ id: null, titulo: '', valor_id: defaultValor, sinopsis: '', portada_url: '', contenido_url: '' });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEdit = (cuento) => {
    setFormData({
        id: cuento.id,
        titulo: cuento.titulo,
        valor_id: cuento.valor_id,
        sinopsis: cuento.sinopsis,
        portada_url: cuento.portada_url,
        contenido_url: cuento.contenido_url
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    const endpoint = isEditing 
        ? `${API_URL}/cuentos/${formData.id}`
        : `${API_URL}/cuentos`;
    
    const method = isEditing ? 'PUT' : 'POST';

    try {
        const response = await fetch(endpoint, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const data = await response.json();

        if (data.success) {
            alert(isEditing ? 'Cuento actualizado' : 'Cuento creado');
            setShowModal(false);
            fetchData(); // Recargar la lista
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error(error);
        alert('Error al conectar con el servidor');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('¿Seguro que quieres eliminar este cuento?')) {
        try {
            await fetch(`${API_URL}/cuentos/${id}`, { method: 'DELETE' });
            fetchData(); // Recargar
        } catch (error) {
            alert('Error al eliminar');
        }
    }
  };

  return (
    <div className="portal-page">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem'}}>
        <div>
            <h2>Gestión de Cuentos</h2>
            <p className="portal-subtitle">Sube y edita el contenido educativo de la app.</p>
        </div>
        <button className="btn-submit" style={{width: 'auto', padding: '0.8rem 1.5rem'}} onClick={handleNew}>
            <FaPlus /> Nuevo Cuento
        </button>
      </div>

      {isLoading ? <p>Cargando contenido...</p> : (
          <div className="admin-content-grid">
            {cuentos.length > 0 ? cuentos.map(cuento => (
                <div key={cuento.id} className="content-card">
                    <div className="content-card-img" style={{backgroundImage: `url(${cuento.portada_url || 'https://via.placeholder.com/400x200'})`}}>
                        <span className="badge" style={{position:'absolute', top:'10px', right:'10px', backgroundColor: cuento.color_hex || '#ccc', color:'#fff'}}>
                            {cuento.nombre_valor}
                        </span>
                    </div>
                    <div className="content-card-body">
                        <h3>{cuento.titulo}</h3>
                        <p>{cuento.sinopsis}</p>
                        <div className="content-actions">
                            <button onClick={() => handleEdit(cuento)} className="btn-icon"><FaEdit /> Editar</button>
                            <button onClick={() => handleDelete(cuento.id)} className="btn-icon btn-danger"><FaTrash /></button>
                        </div>
                    </div>
                </div>
            )) : <p>No hay cuentos registrados.</p>}
          </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="portal-modal-overlay">
            <div className="portal-modal-card auth-card" style={{maxWidth: '600px'}}>
                <button className="modal-close-btn" onClick={() => setShowModal(false)}><FaTimes /></button>
                <h3>{isEditing ? 'Editar Cuento' : 'Crear Nuevo Cuento'}</h3>
                
                <form onSubmit={handleSave}>
                    <div className="form-group">
                        <label>Título del Cuento</label>
                        <input type="text" value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} required />
                    </div>
                    
                    <div className="form-group">
                        <label>Valor Principal</label>
                        <select 
                            value={formData.valor_id} 
                            onChange={(e) => setFormData({...formData, valor_id: e.target.value})}
                            style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc'}}
                        >
                            {valoresDB.map(valor => (
                                <option key={valor.id} value={valor.id}>{valor.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>URL de Portada (Imagen)</label>
                        <div className="input-wrapper">
                            <FaImage className="input-icon" />
                            <input type="text" placeholder="https://..." value={formData.portada_url} onChange={(e) => setFormData({...formData, portada_url: e.target.value})} />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>URL del Contenido (Texto/PDF/Audio)</label>
                        <div className="input-wrapper">
                            <FaBook className="input-icon" />
                            <input type="text" placeholder="https://..." value={formData.contenido_url} onChange={(e) => setFormData({...formData, contenido_url: e.target.value})} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Sinopsis</label>
                        <textarea 
                            rows="3"
                            value={formData.sinopsis}
                            onChange={(e) => setFormData({...formData, sinopsis: e.target.value})}
                            style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontFamily: 'inherit'}}
                        />
                    </div>

                    <button type="submit" className="btn-submit">
                        {isEditing ? 'Guardar Cambios' : 'Publicar Cuento'}
                    </button>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};

export default GestionCuentos;