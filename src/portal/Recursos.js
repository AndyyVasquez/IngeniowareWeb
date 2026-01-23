import React, { useState, useEffect } from 'react';
import { FaBookOpen, FaChild, FaBrain, FaSearch } from 'react-icons/fa';
import '../css/Portal.css'; 
import API_URL from '../config/api';

const categorias = [
  { id: 'todos', nombre: 'Todos los artículos', icono: <FaBookOpen /> },
  { id: 'crianza', nombre: 'Crianza y Psicología', icono: <FaBrain /> },
  { id: 'valores', nombre: 'Enseñando Valores', icono: <FaChild /> },
  { id: 'app', nombre: 'Guías de la App', icono: <FaBookOpen /> },
];

const Recursos = () => {
  const [articulos, setArticulos] = useState([]); // Datos reales
  const [isLoading, setIsLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  // --- CONEXIÓN CON API ---
  useEffect(() => {
    const fetchRecursos = async () => {
      try {
        const response = await fetch(`${API_URL}/recursos`);
        const data = await response.json();
        if (data.success) {
          setArticulos(data.recursos);
        }
      } catch (error) {
        console.error("Error cargando recursos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecursos();
  }, []);
  // -----------------------

  const articulosFiltrados = articulos.filter(articulo => {
    const pasaFiltroCategoria = filtro === 'todos' || articulo.categoria === filtro;
    const pasaFiltroBusqueda = articulo.titulo.toLowerCase().includes(busqueda.toLowerCase()) || 
                             articulo.contenido.toLowerCase().includes(busqueda.toLowerCase());
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
        {/* --- Menú Lateral --- */}
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
          {isLoading ? <p>Cargando biblioteca...</p> : (
            articulosFiltrados.length > 0 ? (
              articulosFiltrados.map(articulo => (
                <div key={articulo.id} className="resource-card">
                  <div className="resource-card-image" style={{backgroundImage: `url(${articulo.imagen_url || 'https://via.placeholder.com/400'})`}}></div>
                  <div className="resource-card-content">
                    <span className="resource-card-categoria">{articulo.categoria}</span>
                    <h3 className="resource-card-title">{articulo.titulo}</h3>
                    <p className="resource-card-resumen">
                        {articulo.contenido.substring(0, 100)}...
                    </p>
                    <div className="resource-card-footer">
                      <span>{articulo.tiempo_lectura_min} min de lectura</span>
                      <span className="widget-link">Leer más →</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No se encontraron artículos.</p>
            )
          )}
        </main>
      </div>
    </div>
  );
};

export default Recursos;