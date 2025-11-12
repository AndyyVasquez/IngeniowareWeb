// src/portal/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaUserFriends, FaCalendarAlt, FaBookOpen } from 'react-icons/fa';
import '../css/Portal.css'; // Reutilizamos los estilos del portal

const Dashboard = () => {
  const [parentName, setParentName] = useState('');
  const [childList, setChildList] = useState([]);
  
  // Simulamos alertas y datos que vendrían de tu API/Context
  const [alertsCount, setAlertsCount] = useState(2); 
  const [nextEvent, setNextEvent] = useState('Noche de película (Viernes)');
  const [newArticle, setNewArticle] = useState('3 formas de hablar sobre la empatía');

  useEffect(() => {
    // Cargar datos desde localStorage (simulando sesión)
    try {
      const parentDataStr = localStorage.getItem('parentData');
      if (parentDataStr) {
        const parentData = JSON.parse(parentDataStr);
        setParentName(parentData.nombre || 'Papá/Mamá');
      }

      const childListStr = localStorage.getItem('childDataList');
      if (childListStr) {
        setChildList(JSON.parse(childListStr));
      }
    } catch (error) {
      console.error("Error cargando datos del dashboard:", error);
    }
  }, []);

  return (
    <div className="portal-page">
      {/* 1. Encabezado Personalizado */}
      <h2>¡Hola, {parentName}!</h2>
      <p className="portal-subtitle">
        Aquí tienes un resumen de la actividad reciente de tu familia.
      </p>

      {/* 2. Grid de Widgets */}
      <div className="dashboard-grid">
        
        {/* Widget de Alertas */}
        <Link to="/portal/bienestar" className="dashboard-widget alert">
          <FaBell size={30} />
          <h3>Alertas Emocionales</h3>
          {alertsCount > 0 ? (
            <p>Tienes <strong>{alertsCount} nuevas alertas</strong> de Valo.</p>
          ) : (
            <p>Todo en calma. No hay alertas nuevas.</p>
          )}
        </Link>

        {/* Widget de Mis Hijos */}
        <div className="dashboard-widget children">
          <FaUserFriends size={30} />
          <h3>Mis Hijos</h3>
          <ul className="widget-child-list">
            {childList.length > 0 ? childList.map(child => (
              <li key={child.id}>
                <span className="widget-avatar">{child.avatar_emoji}</span>
                <span>{child.apodo} ({child.edad_nino} años)</span>
              </li>
            )) : (
              <p>Aún no has añadido perfiles de niños.</p>
            )}
          </ul>
          <Link to="/portal/perfiles" className="widget-link">
            Gestionar Perfiles →
          </Link>
        </div>

        {/* Widget de Recursos */}
        <div className="dashboard-widget resources">
          <FaBookOpen size={30} />
          <h3>Recursos para Padres</h3>
          <p>Nuevo artículo: <strong>{newArticle}</strong></p>
          {/* <Link to="/portal/recursos" className="widget-link">
            Ver todos los artículos →
          </Link> */}
        </div>

        {/* Widget de Calendario */}
        <div className="dashboard-widget calendar">
          <FaCalendarAlt size={30} />
          <h3>Calendario Familiar</h3>
          <p>Próximo evento: <strong>{nextEvent}</strong></p>
          {/* <Link to="/portal/calendario" className="widget-link">
            Abrir Calendario →
          </Link> */}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;