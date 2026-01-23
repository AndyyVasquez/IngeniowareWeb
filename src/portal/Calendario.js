import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../css/Portal.css';
import API_URL from '../config/api';
import { FaCalendarPlus, FaTimes, FaTrash } from 'react-icons/fa';

require('moment/locale/es.js');
const localizer = momentLocalizer(moment);

const Calendario = () => {
  const [eventos, setEventos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [tituloEvento, setTituloEvento] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Obtener ID del padre actual
  const getParentId = () => {
    const parentData = localStorage.getItem('parentData');
    return parentData ? JSON.parse(parentData).id : null;
  };

  //Cargar eventos 
  const fetchEventos = async () => {
    const padreId = getParentId();
    if (!padreId) return;

    try {
      const response = await fetch(`${API_URL}/calendario/${padreId}`);
      const data = await response.json();
      
      if (data.success) {
        // Convertimos las fechas de string (MySQL) a objetos Date (JS)  para que el calendario las entienda
        const eventosFormateados = data.eventos.map(ev => ({
            id: ev.id,
            title: ev.titulo,
            start: new Date(ev.fecha_inicio),
            end: new Date(ev.fecha_fin || ev.fecha_inicio), // Si no hay fin, es igual al inicio
            type: ev.es_hito_app ? 'hito' : 'personal',
            desc: ev.descripcion
        }));
        setEventos(eventosFormateados);
      }
    } catch (error) {
      console.error("Error cargando calendario:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  // Guardar evento
  const handleGuardarEvento = async () => {
    if (!tituloEvento.trim()) {
      alert('Por favor, escribe un título.');
      return;
    }
    
    const padreId = getParentId();
    const nuevoEvento = {
      padre_id: padreId,
      titulo: tituloEvento,
      fecha_inicio: selectedSlot.start,
      fecha_fin: selectedSlot.end,
      descripcion: 'Creado desde el portal web'
    };

    try {
        const response = await fetch(`${API_URL}/calendario`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoEvento)
        });
        const data = await response.json();
        
        if (data.success) {
            setModalVisible(false);
            setTituloEvento('');
            fetchEventos(); // Recargar lista
        } else {
            alert('Error al guardar');
        }
    } catch (error) {
        alert('Error de conexión');
    }
  };

  // Eliminar evento
  const handleSelectEvent = async (event) => {
    if (event.type === 'hito') {
        alert(`🏆 Hito Logrado: ${event.title}\n(Generado automáticamente por la app)`);
        return;
    }

    if(window.confirm(`¿Eliminar el evento "${event.title}"?`)) {
        try {
            await fetch(`${API_URL}/calendario/${event.id}`, { method: 'DELETE' });
            fetchEventos(); // Recargar
        } catch (error) {
            alert('Error al eliminar');
        }
    }
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
    setTituloEvento('');
    setModalVisible(true);
  };

  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.type === 'hito' ? '#28a745' : '#4B0082',
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    };
    return { style };
  };

  return (
    <div className="portal-page portal-calendar-page">
      <h2>Calendario Familiar</h2>
      <p className="portal-subtitle">
        Organiza las actividades de la familia. Haz clic en un día para añadir un evento.
      </p>
      
      <div className="calendar-container">
        {isLoading ? <p>Cargando agenda...</p> : (
            <Calendar
                localizer={localizer}
                events={eventos}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '70vh' }}
                eventPropGetter={eventStyleGetter}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                selectable={true}
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
        )}
      </div>

      {/* Modal Añadir */}
      {modalVisible && (
        <div className="portal-modal-overlay">
          <div className="portal-modal-card auth-card">
            <button className="modal-close-btn" onClick={() => setModalVisible(false)}>
              <FaTimes />
            </button>
            <h3>Añadir Evento</h3>
            <p>Para el día: <strong>{moment(selectedSlot.start).format('LL')}</strong></p>
            
            <div className="form-group">
              <label>Título del Evento</label>
              <input
                type="text"
                value={tituloEvento}
                onChange={(e) => setTituloEvento(e.target.value)}
                autoFocus
                placeholder="Ej. Clase de Natación"
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