// src/portal/Progreso.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartPie, FaAward, FaCoins, FaGift, FaSadTear, FaSmile, FaAngry, FaShieldAlt, FaHeart, FaRocket } from 'react-icons/fa';
import '../css/Portal.css'; // Reutilizamos el CSS del portal

// Definimos los valores aquí para el reporte (nombres e iconos)
const valoresDB = {
  honestidad: { nombre: 'Honestidad', icono: <FaShieldAlt /> },
  empatia: { nombre: 'Empatía', icono: <FaHeart /> },
  generosidad: { nombre: 'Generosidad', icono: <FaGift /> },
  responsabilidad: { nombre: 'Responsabilidad', icono: <FaRocket /> },
};

// Iconos para emociones
const emocionIcono = {
  feliz: <FaSmile style={{ color: '#28a745' }} />,
  triste: <FaSadTear style={{ color: '#007bff' }} />,
  enojado: <FaAngry style={{ color: '#dc3545' }} />,
//   preocupado: <FaWorry style={{ color: '#ffc107' }} />,
};

const Progreso = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [childName, setChildName] = useState('tu hijo/a');
  
  // Estados para los 3 reportes
  const [emotionData, setEmotionData] = useState([]);
  const [valueProgress, setValueProgress] = useState({ completados: [], pendientes: [] });
  const [economyData, setEconomyData] = useState({ balance: 0, ganadas: 0, gastadas: 0 });

  useEffect(() => {
    // Simulamos la carga de todos los datos del niño
    const loadReportData = async () => {
      setIsLoading(true);
      
      // --- 1. Cargar Nombre del Niño ---
      const childListStr = localStorage.getItem('childDataList');
      if (childListStr) {
        const childList = JSON.parse(childListStr);
        if (childList.length > 0) {
          setChildName(childList[0].apodo || childList[0].nombre_completo.split(' ')[0]);
        }
      }

      // --- 2. Cargar Reporte de Emociones (del Diario) ---
      // (Simulamos datos si no existen)
      const journalStr = localStorage.getItem('diarioEntradas') || JSON.stringify([
        { emocion: 'feliz' }, { emocion: 'feliz' }, { emocion: 'triste' },
        { emocion: 'feliz' }, { emocion: 'enojado' }, { emocion: 'feliz' },
      ]);
      const journalEntries = JSON.parse(journalStr);
      
      const counts = journalEntries.reduce((acc, entry) => {
        acc[entry.emocion] = (acc[entry.emocion] || 0) + 1;
        return acc;
      }, {});
      
      const totalEntries = journalEntries.length;
      const emotionArray = Object.keys(counts).map(key => ({
        nombre: key,
        icono: emocionIcono[key] || <FaSmile />,
        percent: totalEntries > 0 ? (counts[key] / totalEntries) * 100 : 0,
      })).sort((a, b) => b.percent - a.percent); // Ordenar por más frecuente
      
      setEmotionData(emotionArray);

      // --- 3. Cargar Progreso de Valores (de los Juegos) ---
      const progressStr = localStorage.getItem('progresoJuegos') || JSON.stringify(['honestidad', 'empatia']);
      const juegosCompletados = JSON.parse(progressStr);
      
      const todosLosValoresIds = Object.keys(valoresDB);
      const completados = todosLosValoresIds
        .filter(id => juegosCompletados.includes(id))
        .map(id => valoresDB[id]);
      
      const pendientes = todosLosValoresIds
        .filter(id => !juegosCompletados.includes(id))
        .map(id => valoresDB[id]);

      setValueProgress({ completados, pendientes });

      // --- 4. Cargar Economía ---
      const coinsStr = localStorage.getItem('monedas') || '50';
      setEconomyData({
        balance: parseInt(coinsStr, 10),
        ganadas: 30, // Simulado
        gastadas: 10, // Simulado
      });

      setIsLoading(false);
    };

    loadReportData();
  }, []);

  if (isLoading) {
    return (
      <div className="portal-page">
        <h2>Reportes de Progreso</h2>
        <p>Cargando reportes de {childName}...</p>
      </div>
    );
  }

  return (
    <div className="portal-page">
      <h2>Reportes de {childName}</h2>
      <p className="portal-subtitle">
        Analiza su bienestar emocional, progreso en valores y actividad económica.
      </p>

      <div className="report-grid">
        {/* --- 1. TARJETA DE BIENESTAR EMOCIONAL --- */}
        <div className="report-card report-card-full">
          <h3><FaChartPie /> Bienestar Emocional (Últimos 30 días)</h3>
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
            </div>
          ) : (
            <p>Aún no hay suficientes datos del Diario de Valo para generar un reporte.</p>
          )}
        </div>

        {/* --- 2. TARJETA DE PROGRESO DE VALORES --- */}
        <div className="report-card">
          <h3><FaAward /> Progreso de Valores</h3>
          <p>Estos son los valores que {childName} ha completado en los juegos.</p>
          <h4>Completados</h4>
          <div className="badge-container">
            {valueProgress.completados.length > 0 ? valueProgress.completados.map(val => (
              <span key={val.nombre} className="value-badge completed">
                {val.icono} {val.nombre}
              </span>
            )) : <p>Ninguno aún.</p>}
          </div>
          <hr className="form-divider" />
          <h4>Pendientes</h4>
          <div className="badge-container">
            {valueProgress.pendientes.map(val => (
              <span key={val.nombre} className="value-badge pending">
                {val.icono} {val.nombre}
              </span>
            ))}
          </div>
        </div>

        {/* --- 3. TARJETA DE ECONOMÍA --- */}
        <div className="report-card">
          <h3><FaCoins /> Resumen de Monedas</h3>
          <div className="economy-balance">
            <span>Balance Actual</span>
            <span className="economy-total">{economyData.balance} 🪙</span>
          </div>
          <div className="economy-details">
            <p>Ganadas (últ. 7 días): <span>+{economyData.ganadas} 🪙</span></p>
            <p>Gastadas (últ. 7 días): <span>-{economyData.gastadas} 🪙</span></p>
          </div>
          <button 
            className="btn-submit" 
            style={{marginTop: '1rem'}}
            // onClick={() => navigate('/portal/enviar-refuerzo')} // (Asegúrate de crear esta ruta)
          >
            <FaGift /> Enviar Recompensa
          </button>
        </div>

      </div>
    </div>
  );
};

export default Progreso;