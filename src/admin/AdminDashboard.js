import React from 'react';
import { FaUsers, FaMoneyBillWave, FaUserPlus, FaExclamationTriangle } from 'react-icons/fa';
// Reutilizamos estilos del portal o creamos Admin.css
// Asumimos que usamos las clases .dashboard-widget del portal padre por simplicidad

const AdminDashboard = () => {
  // Datos simulados
  const stats = {
    totalUsuarios: 1250,
    ingresosMes: '$45,200',
    nuevosUsuarios: 85,
    reportesPendientes: 3
  };

  return (
    <div className="portal-page">
      <h2>Panel de Control</h2>
      <p className="portal-subtitle">Resumen general de la plataforma Ingenioware.</p>

      <div className="dashboard-grid" style={{gridTemplateColumns: 'repeat(4, 1fr)'}}>
        {/* KPI Cards */}
        <div className="dashboard-widget" style={{borderLeft: '5px solid #4B0082'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
             <div>
                <h4 style={{margin:0, color:'#666'}}>Usuarios Totales</h4>
                <span style={{fontSize:'2rem', fontWeight:'bold'}}>{stats.totalUsuarios}</span>
             </div>
             <FaUsers size={30} color="#4B0082" opacity={0.3} />
          </div>
        </div>

        <div className="dashboard-widget" style={{borderLeft: '5px solid #28a745'}}>
           <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
             <div>
                <h4 style={{margin:0, color:'#666'}}>Ingresos (Mes)</h4>
                <span style={{fontSize:'2rem', fontWeight:'bold'}}>{stats.ingresosMes}</span>
             </div>
             <FaMoneyBillWave size={30} color="#28a745" opacity={0.3} />
          </div>
        </div>

        <div className="dashboard-widget" style={{borderLeft: '5px solid #17a2b8'}}>
           <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
             <div>
                <h4 style={{margin:0, color:'#666'}}>Nuevos (7d)</h4>
                <span style={{fontSize:'2rem', fontWeight:'bold'}}>+{stats.nuevosUsuarios}</span>
             </div>
             <FaUserPlus size={30} color="#17a2b8" opacity={0.3} />
          </div>
        </div>

        <div className="dashboard-widget" style={{borderLeft: '5px solid #dc3545'}}>
           <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
             <div>
                <h4 style={{margin:0, color:'#666'}}>Soporte</h4>
                <span style={{fontSize:'2rem', fontWeight:'bold'}}>{stats.reportesPendientes}</span>
             </div>
             <FaExclamationTriangle size={30} color="#dc3545" opacity={0.3} />
          </div>
        </div>
      </div>

      <div style={{marginTop: '2rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem'}}>
        <div className="dashboard-widget">
            <h3>Actividad Reciente</h3>
            <ul style={{listStyle: 'none', padding: 0}}>
                <li style={{padding: '10px 0', borderBottom: '1px solid #eee'}}>👤 <strong>Juan Pérez</strong> se registró (Plan Básico) <small style={{float:'right', color:'#999'}}>Hace 5 min</small></li>
                <li style={{padding: '10px 0', borderBottom: '1px solid #eee'}}>💰 <strong>Maria Lopez</strong> renovó suscripción <small style={{float:'right', color:'#999'}}>Hace 20 min</small></li>
                <li style={{padding: '10px 0', borderBottom: '1px solid #eee'}}>⚠️ <strong>Sistema</strong> Alerta de servidor menor <small style={{float:'right', color:'#999'}}>Hace 1 hora</small></li>
            </ul>
        </div>
        <div className="dashboard-widget">
            <h3>Accesos Rápidos</h3>
            <button className="btn-submit" style={{marginBottom: '10px', backgroundColor: '#2c3e50'}}>+ Crear Nuevo Cuento</button>
            <button className="btn-submit" style={{marginBottom: '10px', backgroundColor: '#2c3e50'}}>+ Añadir Item a Tienda</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;