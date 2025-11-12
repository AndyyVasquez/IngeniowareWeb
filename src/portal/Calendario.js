// src/portal/Calendario.js
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // ¡CSS de la librería!
import '../css/Portal.css'; // Tu CSS personalizado
import { FaCalendarPlus, FaTimes } from 'react-icons/fa';

// Configura el localizador de fechas para español
require('moment/locale/es.js'); // Importa el idioma español
const localizer = momentLocalizer(moment);

// --- Simulación de Datos ---
// Eventos que vienen AUTOMÁTICAMENTE de la app
const hitosDeLaApp = [
  {
    id: 'h1',
    title: '🏆 ¡Leo completó el juego de "Honestidad"!',
    start: new Date(2025, 10, 8, 10, 0, 0), // (Año, Mes-1, Día, Hora)
    end: new Date(2025, 10, 8, 10, 30, 0),
    type: 'hito', // Para darle color
  },
  {
    id: 'h2',
    title: '🎁 ¡Sofi compró la "Corona" en el Armario!',
    start: new Date(2025, 10, 10, 15, 0, 0),
    end: new Date(2025, 10, 10, 15, 30, 0),
    type: 'hito',
  },
];

// Eventos que el PADRE añade
const eventosPersonales = [
  {
    id: 'p1',
    title: 'Cita con el dentista (Leo)',
    start: new Date(2025, 10, 12, 9, 0, 0),
    end: new Date(2025, 10, 12, 10, 0, 0),
    type: 'personal',
  },
];
// --- Fin Simulación ---


const Calendario = () => {
  const [eventos, setEventos] = useState([...hitosDeLaApp, ...eventosPersonales]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [tituloEvento, setTituloEvento] = useState('');

  // Función para dar estilo a cada evento
  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.type === 'hito' ? '#28a745' : '#4B0082', // Verde para hitos, morado para personal
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    };
    return { style };
  };

  // Se activa al hacer clic en un día vacío del calendario
  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
    setTituloEvento('');
    setModalVisible(true);
  };

  // Se activa al hacer clic en un evento que YA existe
  const handleSelectEvent = (event) => {
    alert(`Evento: ${event.title}\nTipo: ${event.type === 'hito' ? 'Hito de la App' : 'Personal'}`);
  };

  // Lógica del modal para guardar
  const handleGuardarEvento = () => {
    if (!tituloEvento.trim()) {
      alert('Por favor, escribe un título para el evento.');
      return;
    }
    
    const nuevoEvento = {
      id: `p${Date.now()}`,
      title: tituloEvento,
      start: selectedSlot.start,
      end: selectedSlot.end,
      type: 'personal',
    };

    setEventos([...eventos, nuevoEvento]);
    setModalVisible(false);
  };

  return (
    <div className="portal-page portal-calendar-page">
      <h2>Calendario Familiar</h2>
      <p className="portal-subtitle">
        Revisa los hitos de tus hijos y añade tus propios eventos.
      </p>
      
      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={eventos}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '70vh' }} // 70% de la altura de la ventana
          eventPropGetter={eventStyleGetter}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable={true} // Permite hacer clic en días vacíos
          messages={{
            next: "Sig >",
            previous: "< Ant",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            agenda: "Agenda",
            noEventsInRange: "No hay eventos en este rango.",
            showMore: total => `+ ${total} más`,
          }}
        />
      </div>

      {/* --- Modal para Añadir Evento --- */}
      {modalVisible && (
        <div className="portal-modal-overlay">
          <div className="portal-modal-card auth-card">
            <button className="modal-close-btn" onClick={() => setModalVisible(false)}>
              <FaTimes />
            </button>
            <h3>Añadir Evento</h3>
            <p>
              Evento para el día: <strong>{moment(selectedSlot.start).format('LL')}</strong>
            </p>
            <div className="form-group">
              <label htmlFor="tituloEvento">Título del Evento</label>
              <input
                type="text"
                id="tituloEvento"
                name="tituloEvento"
                value={tituloEvento}
                onChange={(e) => setTituloEvento(e.target.value)}
                autoFocus
              />
            </div>
            <button onClick={handleGuardarEvento} className="btn-submit">
              <FaCalendarPlus /> Guardar Evento
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Calendario;