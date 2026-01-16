import React, { useState, useEffect } from 'react';
import { FaPaperPlane, FaGift, FaHeart } from 'react-icons/fa';
import '../css/Portal.css'; 

const CrearMomento = () => {
  const [ninos, setNinos] = useState([]);
  const [seleccionado, setSeleccionado] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [monedas, setMonedas] = useState(0);
  const [enviando, setEnviando] = useState(false);

  // 1. Cargar hijos para el select
  useEffect(() => {
    const parentData = JSON.parse(localStorage.getItem('parentData'));
    if (parentData) {
        fetch(`http://localhost:3000/api/ninos/${parentData.id}`)
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    setNinos(data.ninos);
                    if(data.ninos.length > 0) setSeleccionado(data.ninos[0].id);
                }
            });
    }
  }, []);

  const handleEnviar = async (e) => {
    e.preventDefault();
    if(!mensaje.trim()) return alert("Escribe un mensaje bonito.");
    
    setEnviando(true);
    const parentData = JSON.parse(localStorage.getItem('parentData'));

    try {
        const res = await fetch('http://localhost:3000/api/mensajes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                padre_id: parentData.id,
                nino_id: seleccionado,
                mensaje: mensaje,
                monedas_regalo: parseInt(monedas)
            })
        });
        const data = await res.json();
        
        if (data.success) {
            alert('¡Mensaje enviado con éxito!');
            setMensaje('');
            setMonedas(0);
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        alert('Error de conexión');
    } finally {
        setEnviando(false);
    }
  };

  return (
    <div className="portal-page">
      <h2>Enviar un Buen Momento ❤️</h2>
      <p className="portal-subtitle">Sorprende a tus hijos con un mensaje de aliento.</p>

      <div className="auth-card" style={{maxWidth: '600px', margin: '0 auto'}}>
        <form onSubmit={handleEnviar}>
            <div className="form-group">
                <label>¿Para quién es?</label>
                <select 
                    value={seleccionado} 
                    onChange={e => setSeleccionado(e.target.value)}
                    style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ccc'}}
                >
                    {ninos.map(n => (
                        <option key={n.id} value={n.id}>{n.avatar_emoji} {n.nombre}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Tu Mensaje</label>
                <textarea 
                    rows="4" 
                    placeholder="Ej: ¡Hiciste un gran trabajo hoy! Te quiero mucho."
                    value={mensaje}
                    onChange={e => setMensaje(e.target.value)}
                    style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ccc', fontFamily:'inherit'}}
                    required
                />
            </div>

            <div className="form-group">
                <label><FaGift color="#FFD700"/> Regalar Monedas (Opcional)</label>
                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <input 
                        type="range" 
                        min="0" max="50" step="5" 
                        value={monedas} 
                        onChange={e => setMonedas(e.target.value)}
                        style={{flex:1}}
                    />
                    <span style={{fontWeight:'bold', width:'40px'}}>{monedas}</span>
                </div>
            </div>

            <button type="submit" className="btn-submit" disabled={enviando}>
                {enviando ? 'Enviando...' : <><FaPaperPlane /> Enviar Mensaje</>}
            </button>
        </form>
      </div>
    </div>
  );
};

export default CrearMomento;