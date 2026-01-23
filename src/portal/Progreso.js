import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartPie, FaAward, FaCoins, FaGift, FaSadTear, FaSmile, FaAngry, FaShieldAlt, FaHeart, FaRocket, FaHandHoldingHeart, FaFire } from 'react-icons/fa';
import API_URL from '../config/api'; // Importamos la configuración real
import '../css/Portal.css'; 

// Mapeo de iconos para los valores (basado en el nombre que viene de la BD)
const getValorIcon = (nombreValor) => {
  const nombre = nombreValor.toLowerCase();
  if (nombre.includes('honestidad')) return <FaShieldAlt />;
  if (nombre.includes('empatía') || nombre.includes('empatia')) return <FaHeart />;
  if (nombre.includes('generosidad')) return <FaGift />;
  if (nombre.includes('responsabilidad')) return <FaRocket />;
  if (nombre.includes('paciencia')) return <FaHandHoldingHeart />;
  if (nombre.includes('valentía') || nombre.includes('valentia')) return <FaFire />;
  return <FaAward />; // Icono por defecto
};

// Iconos para emociones
const emocionIcono = {
  feliz: <FaSmile style={{ color: '#28a745' }} />,
  triste: <FaSadTear style={{ color: '#007bff' }} />,
  enojado: <FaAngry style={{ color: '#dc3545' }} />,
  miedo: <FaSadTear style={{ color: '#6610f2' }} />, // Agregamos miedo por si acaso
};

const Progreso = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState(null);
  
  // Estados para los datos REALES
  const [emotionData, setEmotionData] = useState([]);
  const [valueProgress, setValueProgress] = useState({ completados: [], pendientes: [] });
  const [economyData, setEconomyData] = useState({ balance: 0, logros: 0, racha: 0 });

  useEffect(() => {
    loadRealData();
  }, []);

  const loadRealData = async () => {
    setIsLoading(true);
    try {
        // 1. Obtener ID del Padre y buscar sus hijos
        const parentData = JSON.parse(localStorage.getItem('parentData'));
        if (!parentData) {
            navigate('/login');
            return;
        }

        // Llamamos a la API para tener la lista fresca de hijos
        const resNinos = await fetch(`${API_URL}/ninos/${parentData.id}`);
        const dataNinos = await resNinos.json();

        if (dataNinos.success && dataNinos.ninos.length > 0) {
            // Por defecto seleccionamos al primer hijo (puedes agregar un selector luego)
            const hijo = dataNinos.ninos[0];
            setSelectedChild(hijo);

            // --- AHORA CARGAMOS LOS 3 REPORTES EN PARALELO ---
            
            // A) Reporte de Emociones (Diario)
            const resDiario = await fetch(`${API_URL}/diario/${hijo.id}`);
            const dataDiario = await resDiario.json();
            processEmotionData(dataDiario.entradas || []);

            // B) Reporte de Valores (Logros/Medallas)
            const resLogros = await fetch(`${API_URL}/logros/${hijo.id}`);
            const dataLogros = await resLogros.json();
            processValuesData(dataLogros.trofeos || []);

            // C) Reporte de Economía y Racha
            const resProgreso = await fetch(`${API_URL}/progreso/${hijo.id}`);
            const dataProgreso = await resProgreso.json();
            if (dataProgreso.success) {
                setEconomyData({
                    balance: dataProgreso.stats.monedas,
                    logros: dataProgreso.stats.logros,
                    racha: dataProgreso.stats.racha
                });
            }

        } else {
            console.log("No se encontraron hijos registrados");
        }

    } catch (error) {
        console.error("Error cargando reportes:", error);
    } finally {
        setIsLoading(false);
    }
  };

  // Procesar datos crudos del diario para hacer la gráfica
  const processEmotionData = (entradas) => {
    if (entradas.length === 0) {
        setEmotionData([]);
        return;
    }

    const counts = entradas.reduce((acc, entry) => {
      const emocion = entry.emocion ? entry.emocion.toLowerCase() : 'desconocido';
      acc[emocion] = (acc[emocion] || 0) + 1;
      return acc;
    }, {});
    
    const totalEntries = entradas.length;
    const emotionArray = Object.keys(counts).map(key => ({
      nombre: key.charAt(0).toUpperCase() + key.slice(1), // Capitalizar
      icono: emocionIcono[key] || <FaSmile />,
      percent: (counts[key] / totalEntries) * 100,
      count: counts[key]
    })).sort((a, b) => b.percent - a.percent); // Ordenar por frecuencia
    
    setEmotionData(emotionArray);
  };

  // Separar trofeos ganados de los pendientes
  const processValuesData = (trofeos) => {
    const ganados = trofeos.filter(t => t.ganado);
    const pendientes = trofeos.filter(t => !t.ganado);
    setValueProgress({ completados: ganados, pendientes: pendientes });
  };

  const handleSendReward = async () => {
      // Esta función es un ejemplo. Podrías llamar al endpoint /api/mensajes con monedas_regalo > 0
      const amount = prompt("¿Cuántas monedas quieres regalarle por su buen comportamiento?");
      if (amount && selectedChild) {
        try {
            const parentData = JSON.parse(localStorage.getItem('parentData'));
            await fetch(`${API_URL}/mensajes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    padre_id: parentData.id,
                    nino_id: selectedChild.id,
                    mensaje: "¡Te ganaste un premio por tu esfuerzo!",
                    monedas_regalo: parseInt(amount)
                })
            });
            alert(`¡Enviaste ${amount} monedas!`);
            loadRealData(); // Recargar para ver el nuevo saldo
        } catch (e) {
            alert("Error al enviar recompensa");
        }
      }
  };

  if (isLoading) {
    return (
      <div className="portal-page">
        <h2>Reportes de Progreso</h2>
        <p>Conectando con la base de datos...</p>
      </div>
    );
  }

  if (!selectedChild) {
      return (
        <div className="portal-page">
            <h2>Reportes de Progreso</h2>
            <p>No se encontraron perfiles de niños asociados. Ve al inicio para crear uno.</p>
        </div>
      );
  }

  return (
    <div className="portal-page">
      <h2>Reportes de {selectedChild.nombre}</h2>
      <p className="portal-subtitle">
        Datos en tiempo real basados en su actividad en la app.
      </p>

      <div className="report-grid">
        {/* --- 1. TARJETA DE BIENESTAR EMOCIONAL (REAL) --- */}
        <div className="report-card report-card-full">
          <h3><FaChartPie /> Historial de Emociones</h3>
          {emotionData.length > 0 ? (
            <div className="bar-chart-container">
              {emotionData.map(emocion => (
                <div key={emocion.nombre} className="bar-chart-row">
                  <span className="bar-chart-icon">{emocion.icono}</span>
                  <span className="bar-chart-label">{emocion.nombre}</span>
                  <div className="bar-chart-bar">
                    <div 
                      className="bar-chart-fill" 
                      style={{ width: `${emocion.percent}%` }}
                    ></div>
                  </div>
                  <span className="bar-chart-percent">{emocion.percent.toFixed(0)}%</span>
                </div>
              ))}
              <p style={{fontSize: '0.8rem', color: '#666', marginTop: '10px', textAlign:'center'}}>
                Basado en {emotionData.reduce((a, b) => a + b.count, 0)} registros del diario.
              </p>
            </div>
          ) : (
            <div style={{padding: '20px', textAlign: 'center', color: '#666'}}>
                <p>Tu hijo aún no ha registrado emociones en su diario.</p>
                <small>Cuando use la app móvil, verás aquí cómo se siente.</small>
            </div>
          )}
        </div>

        {/* --- 2. TARJETA DE PROGRESO DE VALORES (REAL) --- */}
        <div className="report-card">
          <h3><FaAward /> Medallas y Valores</h3>
          <p>Valores desbloqueados mediante juegos y cuentos.</p>
          
          <h4>Completados ({valueProgress.completados.length})</h4>
          <div className="badge-container">
            {valueProgress.completados.length > 0 ? valueProgress.completados.map(val => (
              <span key={val.id} className="value-badge completed" title={val.descripcion}>
                {getValorIcon(val.titulo)} {val.titulo}
              </span>
            )) : <p style={{fontSize:'0.9rem', color:'#999'}}>Aún no ha ganado medallas.</p>}
          </div>
          
          <hr className="form-divider" />
          
          <h4>Por descubrir</h4>
          <div className="badge-container">
            {valueProgress.pendientes.map(val => (
              <span key={val.id} className="value-badge pending">
                {getValorIcon(val.titulo)} {val.titulo}
              </span>
            ))}
          </div>
        </div>

        {/* --- 3. TARJETA DE ECONOMÍA (REAL) --- */}
        <div className="report-card">
          <h3><FaCoins /> Economía y Racha</h3>
          
          <div className="economy-balance">
            <span>Balance Actual</span>
            <span className="economy-total">{economyData.balance} 🪙</span>
          </div>
          
          <div className="economy-details">
            {/* Como la API solo da totales, mostramos datos acumulados reales */}
            <p>Logros Totales: <span>{economyData.logros} 🏆</span></p>
            <p>Racha de uso: <span>{economyData.racha} días 🔥</span></p>
          </div>
          
          <button 
            className="btn-submit" 
            style={{marginTop: '1rem'}}
            onClick={handleSendReward}
          >
            <FaGift /> Enviar Regalo (Monedas)
          </button>
        </div>

      </div>
    </div>
  );
};

export default Progreso;