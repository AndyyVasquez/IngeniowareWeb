import React, { useState, useEffect } from 'react';
import { FaMusic, FaTrash, FaUpload, FaPlayCircle } from 'react-icons/fa';
import '../css/Portal.css'; 

const GestionCanciones = () => {
  const [canciones, setCanciones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  // Estados del formulario
  const [titulo, setTitulo] = useState('');
  const [artista, setArtista] = useState('Ingenioware');
  const [portadaUrl, setPortadaUrl] = useState('');
  const [audioFile, setAudioFile] = useState(null);

  const fetchCanciones = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/canciones');
      const data = await res.json();
      if (data.success) setCanciones(data.canciones);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchCanciones(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!audioFile) return alert("Selecciona un archivo MP3");

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('artista', artista);
    formData.append('portada_url', portadaUrl);
    formData.append('duracion', '3:00'); 
    formData.append('audio_file', audioFile); 

    try {
      const res = await fetch('http://localhost:3000/api/canciones', {
        method: 'POST',
        body: formData // No lleva header Content-Type manual
      });
      const data = await res.json();
      if (data.success) {
        alert('¡Música subida!');
        setShowModal(false);
        fetchCanciones();
        setTitulo(''); setAudioFile(null);
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      alert('Error de conexión');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("¿Borrar canción?")) {
        await fetch(`http://localhost:3000/api/canciones/${id}`, { method: 'DELETE' });
        fetchCanciones();
    }
  };

  return (
    <div className="portal-page">
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:'2rem'}}>
        <h2>Gestión de Música 🎵</h2>
        <button className="btn-submit" style={{width:'auto'}} onClick={() => setShowModal(true)}>
            <FaUpload /> Subir Canción
        </button>
      </div>

      <div className="store-grid">
        {canciones.map(c => (
            <div key={c.id} className="store-card">
                <img src={c.portada_url || 'https://via.placeholder.com/150'} alt="cover" style={{width:'100%', borderRadius:'8px', height:'150px', objectFit:'cover'}} />
                <div style={{padding:'10px', textAlign:'center'}}>
                    <h4>{c.titulo}</h4>
                    <p style={{color:'#666', fontSize:'0.9rem'}}>{c.artista}</p>
                    <button onClick={() => handleDelete(c.id)} className="btn-icon btn-danger" style={{marginTop:'10px'}}><FaTrash /> Eliminar</button>
                </div>
            </div>
        ))}
      </div>

      {showModal && (
        <div className="portal-modal-overlay">
            <div className="portal-modal-card auth-card">
                <h3>Subir Nueva Canción</h3>
                <form onSubmit={handleSave}>
                    <div className="form-group">
                        <label>Título</label>
                        <input type="text" value={titulo} onChange={e=>setTitulo(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Artista</label>
                        <input type="text" value={artista} onChange={e=>setArtista(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>URL Portada (Imagen)</label>
                        <input type="text" value={portadaUrl} onChange={e=>setPortadaUrl(e.target.value)} placeholder="https://..." />
                    </div>
                    <div className="form-group">
                        <label>Archivo MP3</label>
                        <div className="input-wrapper">
                            <input type="file" accept="audio/*" onChange={e=>setAudioFile(e.target.files[0])} required />
                        </div>
                    </div>
                    <button type="submit" className="btn-submit">Subir</button>
                    <button type="button" className="btn-submit" style={{backgroundColor:'#ccc', marginTop:'10px'}} onClick={()=>setShowModal(false)}>Cancelar</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default GestionCanciones;