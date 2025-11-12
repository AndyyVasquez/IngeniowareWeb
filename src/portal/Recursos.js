import React, { useState } from 'react';
import { FaBookOpen, FaChild, FaBrain, FaSearch } from 'react-icons/fa';
import '../css/Portal.css'; // Reutilizamos el CSS del portal

const todosLosArticulos = [
  { 
    id: 1, 
    categoria: 'crianza', 
    titulo: '3 formas de hablar sobre la empatía con tu hijo', 
    resumen: 'Aprende a usar situaciones cotidianas para enseñar empatía, la habilidad más importante...',
    img: 'https://images.pexels.com/photos/3931568/pexels-photo-3931568.jpeg?auto=compress&cs=tinysrgb&w=600',
    tiempoLectura: 5,
  },
  { 
    id: 2, 
    categoria: 'valores', 
    titulo: 'Manejando berrinches: ¿Qué hacer cuando dicen "No"?',
    resumen: 'Los berrinches son normales. Te damos un plan de 3 pasos para manejarlos con calma y respeto.',
    img: 'https://images.pexels.com/photos/4145763/pexels-photo-4145763.jpeg?auto=compress&cs=tinysrgb&w=600',
    tiempoLectura: 7,
  },
  { 
    id: 3, 
    categoria: 'valores', 
    titulo: 'La Honestidad: Más allá de "no decir mentiras"',
    resumen: 'Tu hijo/a completó el juego de la Honestidad. Aquí te explicamos cómo reforzar esa lección en casa.',
    img: 'https://images.pexels.com/photos/764681/pexels-photo-764681.jpeg?auto=compress&cs=tinysrgb&w=600',
    tiempoLectura: 4,
  },
  { 
    id: 4, 
    categoria: 'app', 
    titulo: 'Guía Rápida: Saca provecho al Diario de Valo',
    resumen: 'El diario es una herramienta poderosa. Aprende a interpretar el reporte emocional...',
    img: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=600',
    tiempoLectura: 3,
  },
];

const categorias = [
  { id: 'todos', nombre: 'Todos los artículos', icono: <FaBookOpen /> },
  { id: 'crianza', nombre: 'Crianza y Psicología', icono: <FaBrain /> },
  { id: 'valores', nombre: 'Enseñando Valores', icono: <FaChild /> },
  { id: 'app', nombre: 'Guías de la App', icono: <FaBookOpen /> },
];

const Recursos = () => {
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  const articulosFiltrados = todosLosArticulos.filter(articulo => {
    const pasaFiltroCategoria = filtro === 'todos' || articulo.categoria === filtro;
    const pasaFiltroBusqueda = articulo.titulo.toLowerCase().includes(busqueda.toLowerCase()) || 
                             articulo.resumen.toLowerCase().includes(busqueda.toLowerCase());
    return pasaFiltroCategoria && pasaFiltroBusqueda;
  });

  return (
    <div className="portal-page portal-recursos-page">
      <div className="recursos-header">
        <div>
          <h2>Biblioteca de Recursos</h2>
          <p className="portal-subtitle">
            Artículos y guías de expertos para ayudarte en la aventura de criar.
          </p>
        </div>
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar artículos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      <div className="recursos-container">
        {/* --- Menú Lateral de Categorías --- */}
        <nav className="recursos-sidebar">
          <h4>Categorías</h4>
          <ul>
            {categorias.map(cat => (
              <li key={cat.id}>
                <button 
                  className={`btn-categoria ${filtro === cat.id ? 'active' : ''}`}
                  onClick={() => setFiltro(cat.id)}
                >
                  {cat.icono} <span>{cat.nombre}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* --- Grid de Artículos --- */}
        <main className="recursos-grid">
          {articulosFiltrados.length > 0 ? (
            articulosFiltrados.map(articulo => (
              <div key={articulo.id} className="resource-card">
                <div className="resource-card-image" style={{backgroundImage: `url(${articulo.img})`}}></div>
                <div className="resource-card-content">
                  <span className="resource-card-categoria">{categorias.find(c => c.id === articulo.categoria).nombre}</span>
                  <h3 className="resource-card-title">{articulo.titulo}</h3>
                  <p className="resource-card-resumen">{articulo.resumen}</p>
                  <div className="resource-card-footer">
                    <span>{articulo.tiempoLectura} min de lectura</span>
                    <a href="#" className="widget-link">Leer más →</a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No se encontraron artículos que coincidan con tu búsqueda.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Recursos;