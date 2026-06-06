const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db');

const app = express();
const PORT = 3000;

// --- Importar Multer y Path ---
const multer = require('multer');
const path = require('path');

//mercadopago
const { MercadoPagoConfig, PreApproval } = require('mercadopago');
const client = new MercadoPagoConfig({ accessToken: '' });

// --- Configuración de Almacenamiento de Archivos ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Carpeta donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
    // Generamos un nombre único (fecha + nombre original) para evitar duplicados
    cb(null, Date.now() + '-' + file.originalname)
  }
});

// Inicializamos la variable 'upload' que te faltaba
const upload = multer({ storage: storage });

// --- IMPORTANTE: Hacer pública la carpeta uploads ---
// Esto permite que el celular pueda descargar/reproducir los archivos
app.use('/uploads', express.static('uploads'));

app.use(cors());
app.use(bodyParser.json());

//Ruta prueba
app.get('/', (req, res) => {
  res.send('API Ingenioware funcionando 🚀');
});

// Registro Padre
app.post('/api/register', async (req, res) => {
  const { 
    primer_nombre, 
    segundo_nombre, 
    apellido_paterno, // Ojo: El frontend envía esto
    apellido_materno, 
    email, 
    password, 
    pin_seguridad 
  } = req.body;

  try {
    // 1. Verificar duplicados
    const [existing] = await db.query('SELECT * FROM padres WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
    }

    // 2. Insertar en la Base de Datos
    // Nota: Usamos los nombres de columnas EXACTOS de tu imagen MariaDB
    // (ap_padre, am_padre)
    const [result] = await db.query(
      `INSERT INTO padres 
      (primer_nombre, segundo_nombre, ap_padre, am_padre, email, password, pin_seguridad) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        primer_nombre, 
        segundo_nombre || null, // Si viene vacío, guardamos NULL
        apellido_paterno,       // Se mapea a 'ap_padre'
        apellido_materno || null, // Se mapea a 'am_padre'
        email, 
        password, 
        pin_seguridad
      ]
    );

    res.json({ 
      success: true, 
      message: 'Padre registrado exitosamente',
      id_padre: result.insertId 
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar padre
    const [users] = await db.query('SELECT * FROM padres WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
    }

    const padre = users[0];

    // Verificar contraseña
    if (password !== padre.password) {
      return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
    }

    // Buscar hijos
    const [hijos] = await db.query('SELECT * FROM ninos WHERE padre_id = ?', [padre.id]);

    // Concatenar nombres para que el frontend no se rompa
    const nombreCompleto = `${padre.primer_nombre} ${padre.segundo_nombre || ''}`.trim();
    const apellidosCompletos = `${padre.ap_padre} ${padre.am_padre || ''}`.trim();

    res.json({
      success: true,
      token: 'jwt-simulado-' + padre.id,
      user: {
        id_pad: padre.id,
        nombre: nombreCompleto,      // Enviamos "Juan Carlos"
        apellidos: apellidosCompletos, // Enviamos "Pérez García"
        email: padre.email,
        pin: padre.pin_seguridad,
        hijos: hijos
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

// LOGIN DE ADMINISTRADORES
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar en la tabla de ADMINS (no padres)
    const [admins] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);

    if (admins.length === 0) {
      return res.status(401).json({ success: false, message: 'Administrador no encontrado' });
    }

    const admin = admins[0];

    // 2. Verificar contraseña (Directa por ahora, idealmente usarías hash)
    if (password !== admin.password) {
      return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
    }

    // 3. Devolver éxito con el ROL
    res.json({
      success: true,
      token: 'admin-token-' + admin.id, // Token simulado
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role // IMPORTANTE: Aquí va 'Super Admin' o 'Moderador'
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

// --- MÓDULO DE NIÑOS ---

//perfil del infante
app.post('/api/ninos', async (req, res) => {
  const { padre_id, nombre, apodo, fecha_nacimiento, avatar_emoji, pin } = req.body;

  // Validación básica
  if (!padre_id || !nombre || !pin) {
    return res.status(400).json({ success: false, message: 'Faltan datos obligatorios' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO ninos 
      (padre_id, nombre, apodo, fecha_nacimiento, avatar_emoji, pin, monedas) 
      VALUES (?, ?, ?, ?, ?, ?, 0)`,
      [padre_id, nombre, apodo || nombre, fecha_nacimiento, avatar_emoji || '🦁', pin]
    );

    res.json({ 
      success: true, 
      message: 'Perfil de niño creado exitosamente',
      id_nino: result.insertId 
    });

  } catch (error) {
    console.error('Error al crear niño:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

// obtener niños de un padre
app.get('/api/ninos/:padre_id', async (req, res) => {
  const { padre_id } = req.params;

  try {
    const [ninos] = await db.query('SELECT * FROM ninos WHERE padre_id = ?', [padre_id]);
    res.json({ success: true, ninos });
  } catch (error) {
    console.error('Error al obtener niños:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

// Actualizar datos del infante
app.put('/api/ninos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, apodo, avatar_emoji, pin } = req.body;

  try {
    await db.query(
      'UPDATE ninos SET nombre = ?, apodo = ?, avatar_emoji = ?, pin = ? WHERE id = ?',
      [nombre, apodo, avatar_emoji, pin, id]
    );
    res.json({ success: true, message: 'Perfil actualizado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al actualizar' });
  }
});

// Eliminar infante
app.delete('/api/ninos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM ninos WHERE id = ?', [id]);
    res.json({ success: true, message: 'Perfil eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al eliminar' });
  }
});

app.get('/api/valores', async (req, res) => {
  try {
    const [valores] = await db.query('SELECT * FROM valores');
    res.json({ success: true, valores });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener valores' });
  }
});

// Obtener todos los cuentos 
app.get('/api/cuentos', async (req, res) => {
  try {
    const [cuentos] = await db.query(`
      SELECT cuentos.*, valores.nombre as nombre_valor, valores.color_hex 
      FROM cuentos 
      LEFT JOIN valores ON cuentos.valor_id = valores.id
    `);
    res.json({ success: true, cuentos });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener cuentos' });
  }
});

// Crear cuento
app.post('/api/cuentos', async (req, res) => {
  const { titulo, sinopsis, valor_id, portada_url, contenido_url } = req.body;

  try {
    await db.query(
      'INSERT INTO cuentos (titulo, sinopsis, valor_id, portada_url, contenido_url) VALUES (?, ?, ?, ?, ?)',
      [titulo, sinopsis, valor_id, portada_url, contenido_url]
    );
    res.json({ success: true, message: 'Cuento publicado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al crear cuento' });
  }
});

// Acutalizar cuento
app.put('/api/cuentos/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, sinopsis, valor_id, portada_url, contenido_url } = req.body;

  try {
    await db.query(
      'UPDATE cuentos SET titulo = ?, sinopsis = ?, valor_id = ?, portada_url = ?, contenido_url = ? WHERE id = ?',
      [titulo, sinopsis, valor_id, portada_url, contenido_url, id]
    );
    res.json({ success: true, message: 'Cuento actualizado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar' });
  }
});

// Eliminar cuento
app.delete('/api/cuentos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM cuentos WHERE id = ?', [id]);
    res.json({ success: true, message: 'Cuento eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar' });
  }
});

// --- MÓDULO DE TIENDA  ---

//obtener items de la tienda
app.get('/api/tienda/items', async (req, res) => {
  try {
    const [items] = await db.query('SELECT * FROM items_tienda ORDER BY created_at DESC');
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener tienda' });
  }
});

//crear item de la tienda
app.post('/api/tienda/items', async (req, res) => {
  const { nombre, tipo, precio, descripcion, imagen_url } = req.body;

  try {
    await db.query(
      'INSERT INTO items_tienda (nombre, tipo, precio, descripcion, imagen_url) VALUES (?, ?, ?, ?, ?)',
      [nombre, tipo, precio, descripcion, imagen_url]
    );
    res.json({ success: true, message: 'Artículo añadido a la tienda' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al crear artículo' });
  }
});

//actualizar item de la tienda
app.put('/api/tienda/items/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, tipo, precio, descripcion, imagen_url } = req.body;

  try {
    await db.query(
      'UPDATE items_tienda SET nombre = ?, tipo = ?, precio = ?, descripcion = ?, imagen_url = ? WHERE id = ?',
      [nombre, tipo, precio, descripcion, imagen_url, id]
    );
    res.json({ success: true, message: 'Artículo actualizado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar' });
  }
});

//eliminar item de la tienda
app.delete('/api/tienda/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM items_tienda WHERE id = ?', [id]);
    res.json({ success: true, message: 'Artículo eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar' });
  }
});

// --- MÓDULO DE GESTIÓN DE USUARIOS ---

//obtener todos los usuarios
app.get('/api/admin/usuarios', async (req, res) => {
  try {
    // Hacemos un LEFT JOIN para contar cuántos hijos tiene cada padre
    const [usuarios] = await db.query(`
      SELECT 
        padres.id, 
        padres.primer_nombre, 
        padres.ap_padre, 
        padres.email, 
        padres.suscripcion_tipo, 
        padres.estado, 
        padres.created_at,
        COUNT(ninos.id) as total_hijos
      FROM padres
      LEFT JOIN ninos ON padres.id = ninos.padre_id
      GROUP BY padres.id
      ORDER BY padres.created_at DESC
    `);
    res.json({ success: true, usuarios });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al obtener usuarios' });
  }
});


//  OBTENER ESTADÍSTICAS REALES (Dashboard)
app.get('/api/admin/stats', async (req, res) => {
  try {
    // Contar usuarios totales
    const [usuarios] = await db.query('SELECT COUNT(*) as total FROM padres');
    
    // Contar nuevos usuarios (últimos 7 días)
    const [nuevos] = await db.query('SELECT COUNT(*) as total FROM padres WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)');
    
    // Calcular ingresos (Suma de precios de suscripciones activas)
    // Nota: Esto asume que guardas el precio en la tabla suscripciones
    const [ingresos] = await db.query('SELECT SUM(precio) as total FROM suscripciones WHERE estado = "activa"');
    
    // Reportes (Simulado por ahora si no tienes tabla de reportes, o cuenta mensajes no leídos)
    const reportes = 0; 

    res.json({
      success: true,
      stats: {
        totalUsuarios: usuarios[0].total,
        nuevosUsuarios: nuevos[0].total,
        ingresosMes: ingresos[0].total || 0,
        reportesPendientes: reportes
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al obtener estadísticas' });
  }
});

// GESTIONAR ADMINS (Obtener lista)
app.get('/api/admin/list', async (req, res) => {
  try {
    const [admins] = await db.query('SELECT id, email, role, created_at FROM admins');
    res.json({ success: true, admins });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al listar admins' });
  }
});

//  CREAR NUEVO ADMIN
app.post('/api/admin/create', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Faltan datos' });
  }

  try {
    await db.query(
      'INSERT INTO admins (email, password, role) VALUES (?, ?, ?)',
      [email, password, role || 'Moderador']
    );
    res.json({ success: true, message: 'Administrador creado correctamente' });
  } catch (error) {
    // Error 1062 es "Duplicado" en SQL
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ success: false, message: 'Ese correo ya es administrador' });
    }
    res.status(500).json({ success: false, message: 'Error al crear admin' });
  }
});

// ELIMINAR ADMIN
app.delete('/api/admin/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM admins WHERE id = ?', [id]);
    res.json({ success: true, message: 'Administrador eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar' });
  }
});

//cambiar estatus (activo/bloqueado)
app.put('/api/admin/usuarios/:id/estado', async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body; // Esperamos 'activo' o 'bloqueado'

  try {
    await db.query('UPDATE padres SET estado = ? WHERE id = ?', [estado, id]);
    res.json({ success: true, message: `Usuario ${estado}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar estado' });
  }
});

//Eliminar padre e hijos
app.delete('/api/admin/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM padres WHERE id = ?', [id]);
    res.json({ success: true, message: 'Usuario eliminado permanentemente' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar usuario' });
  }
});

// --- MÓDULO DE CALENDARIO  ---

// Obtener eventos del calendario
app.get('/api/calendario/:padre_id', async (req, res) => {
  const { padre_id } = req.params;
  try {
    const [eventos] = await db.query(
      'SELECT * FROM eventos_calendario WHERE padre_id = ? ORDER BY fecha_inicio ASC', 
      [padre_id]
    );
    res.json({ success: true, eventos });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al cargar calendario' });
  }
});

// Crear nuevo evento
app.post('/api/calendario', async (req, res) => {
  const { padre_id, titulo, fecha_inicio, fecha_fin, descripcion } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO eventos_calendario (padre_id, titulo, fecha_inicio, fecha_fin, descripcion) VALUES (?, ?, ?, ?, ?)',
      [padre_id, titulo, new Date(fecha_inicio), new Date(fecha_fin), descripcion]
    );
    res.json({ 
      success: true, 
      message: 'Evento guardado', 
      id: result.insertId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al crear evento' });
  }
});

// Eliminar evento
app.delete('/api/calendario/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM eventos_calendario WHERE id = ?', [id]);
    res.json({ success: true, message: 'Evento eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar evento' });
  }
});

// --- MÓDULO DE SUSCRIPCIONES ---

// Simulación de pago
app.post('/api/suscripcion/cambiar', async (req, res) => {
  const { padre_id, nuevo_plan, precio } = req.body;

  if (!padre_id || !nuevo_plan) {
    return res.status(400).json({ success: false, message: 'Datos incompletos' });
  }

  // Calculamos fecha de vencimiento (30 días después)
  const fechaFin = new Date();
  fechaFin.setDate(fechaFin.getDate() + 30);

  const connection = await db.getConnection(); // Usamos conexión directa para transacción

  try {
    await connection.beginTransaction();

    // 1. Actualizar el estado actual del padre
    await connection.query(
      'UPDATE padres SET suscripcion_tipo = ? WHERE id = ?',
      [nuevo_plan, padre_id]
    );

    // 2. Guardar en el historial
    await connection.query(
      `INSERT INTO suscripciones (padre_id, plan, precio, fecha_fin, estado) 
       VALUES (?, ?, ?, ?, 'activa')`,
      [padre_id, nuevo_plan, precio, fechaFin]
    );

    await connection.commit(); // Confirmar cambios

    res.json({ success: true, message: `¡Plan cambiado a ${nuevo_plan} con éxito!` });

  } catch (error) {
    await connection.rollback(); // Si algo falla, deshacer todo
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al procesar el pago' });
  } finally {
    connection.release();
  }
});

// Obtener plan actual de pago
// Útil para asegurarse de mostrar el plan real al cargar la página
app.get('/api/suscripcion/actual/:padre_id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT suscripcion_tipo FROM padres WHERE id = ?', [req.params.padre_id]);
        if (rows.length > 0) {
            res.json({ success: true, plan: rows[0].suscripcion_tipo });
        } else {
            res.status(404).json({ success: false, message: 'Padre no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener plan' });
    }
});

// --- MÓDULO DE PERFIL PADRE (MI CUENTA) ---

//  Obtener mis datos reales
app.get('/api/padre/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT primer_nombre, segundo_nombre, ap_padre, am_padre, email, pin_seguridad FROM padres WHERE id = ?', 
      [id]
    );
    if (rows.length > 0) {
      res.json({ success: true, padre: rows[0] });
    } else {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al cargar perfil' });
  }
});

// Actualizar Información Personal
app.put('/api/padre/:id/info', async (req, res) => {
  const { id } = req.params;
  const { primer_nombre, segundo_nombre, ap_padre, am_padre, email } = req.body;

  try {
    await db.query(
      'UPDATE padres SET primer_nombre = ?, segundo_nombre = ?, ap_padre = ?, am_padre = ?, email = ? WHERE id = ?',
      [primer_nombre, segundo_nombre, ap_padre, am_padre, email, id]
    );
    res.json({ success: true, message: 'Información actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al actualizar información' });
  }
});

// Actualizar Seguridad (Contraseña y PIN)
app.put('/api/padre/:id/seguridad', async (req, res) => {
  const { id } = req.params;
  const { password, pin_seguridad, passwordActual } = req.body;

  try {
    // Seguridad: Verificar contraseña actual antes de permitir cambios
    if (passwordActual) {
        const [rows] = await db.query('SELECT password FROM padres WHERE id = ?', [id]);
        if (rows.length === 0 || rows[0].password !== passwordActual) {
            return res.status(401).json({ success: false, message: 'La contraseña actual es incorrecta' });
        }
    }

    // Construir query dinámica (solo actualizamos lo que se envió)
    let campos = [];
    let valores = [];

    if (password) {
        campos.push('password = ?');
        valores.push(password);
    }
    if (pin_seguridad) {
        campos.push('pin_seguridad = ?');
        valores.push(pin_seguridad);
    }

    if (campos.length === 0) {
        return res.status(400).json({ success: false, message: 'No hay datos para actualizar' });
    }

    valores.push(id); // El ID va al final para el WHERE

    await db.query(`UPDATE padres SET ${campos.join(', ')} WHERE id = ?`, valores);
    res.json({ success: true, message: 'Credenciales actualizadas con éxito' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al actualizar seguridad' });
  }
});

// Eliminar la propia cuenta
app.delete('/api/padre/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Opcional: Aquí podrías hacer backup o borrar hijos primero
    await db.query('DELETE FROM padres WHERE id = ?', [id]);
    res.json({ success: true, message: 'Cuenta eliminada permanentemente' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar cuenta' });
  }
});

// --- MÓDULO DASHBOARD RESUMEN ---

// 23. OBTENER RESUMEN PARA DASHBOARD
app.get('/api/dashboard/:padre_id', async (req, res) => {
  const { padre_id } = req.params;

  try {
    // 1. Obtener el próximo evento del calendario (Solo futuros)
    const [eventos] = await db.query(
      `SELECT titulo, fecha_inicio FROM eventos_calendario 
       WHERE padre_id = ? AND fecha_inicio >= CURRENT_DATE() 
       ORDER BY fecha_inicio ASC LIMIT 1`,
      [padre_id]
    );

    // 2. Obtener un artículo destacado (el último subido)
    const [articulos] = await db.query(
      'SELECT titulo FROM recursos_padres ORDER BY created_at DESC LIMIT 1'
    );

    res.json({
      success: true,
      nextEvent: eventos.length > 0 ? eventos[0] : null,
      alertsCount: 0, // (Simulado hasta que tengamos la app móvil generando alertas)
      featuredArticle: articulos.length > 0 ? articulos[0] : null
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al cargar dashboard' });
  }
});


// --- MÓDULO DE RECURSOS (BLOG/BIBLIOTECA) ---

// 24. OBTENER TODOS LOS RECURSOS (Público/Padres)
app.get('/api/recursos', async (req, res) => {
  try {
    const [recursos] = await db.query('SELECT * FROM recursos_padres ORDER BY created_at DESC');
    res.json({ success: true, recursos });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener recursos' });
  }
});

// 25. CREAR RECURSO (Admin)
app.post('/api/recursos', async (req, res) => {
  const { titulo, contenido, categoria, imagen_url, tiempo_lectura_min } = req.body;

  try {
    await db.query(
      `INSERT INTO recursos_padres (titulo, contenido, categoria, imagen_url, tiempo_lectura_min) 
       VALUES (?, ?, ?, ?, ?)`,
      [titulo, contenido, categoria, imagen_url, tiempo_lectura_min]
    );
    res.json({ success: true, message: 'Artículo publicado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al publicar artículo' });
  }
});

// 26. ELIMINAR RECURSO (Admin)
app.delete('/api/recursos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM recursos_padres WHERE id = ?', [id]);
    res.json({ success: true, message: 'Artículo eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar' });
  }
});

// --- MÓDULO DE CANCIONES (MÚSICA) ---

// 27. OBTENER CANCIONES
app.get('/api/canciones', async (req, res) => {
  try {
    const [canciones] = await db.query('SELECT * FROM canciones ORDER BY created_at DESC');
    res.json({ success: true, canciones });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener canciones' });
  }
});

// 28. SUBIR CANCIÓN (Admin)
// 'audio_file' es el nombre del campo que enviaremos desde el formulario web
app.post('/api/canciones', upload.single('audio_file'), async (req, res) => {
  const { titulo, artista, portada_url, duracion } = req.body;

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Falta el archivo de audio' });
  }

  // Guardamos la ruta relativa (ej: 'uploads/cancion123.mp3')
  const archivo_url = `uploads/${req.file.filename}`;

  try {
    await db.query(
      'INSERT INTO canciones (titulo, artista, portada_url, archivo_url, duracion) VALUES (?, ?, ?, ?, ?)',
      [titulo, artista, portada_url, archivo_url, duracion]
    );
    res.json({ success: true, message: 'Canción subida exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al subir canción' });
  }
});

// 29. ELIMINAR CANCIÓN
app.delete('/api/canciones/:id', async (req, res) => {
  try {
    // Nota: Aquí idealmente también borrarías el archivo físico con fs.unlink()
    await db.query('DELETE FROM canciones WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Canción eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar' });
  }
});

// --- MÓDULO DIARIO EMOCIONAL ---

// 30. REGISTRAR EMOCIÓN (Niño)
app.post('/api/diario', async (req, res) => {
  const { nino_id, emocion, texto } = req.body;

  // Lógica simple de alertas (puedes mejorarla con IA después)
  let alerta_nivel = 0;
  const emocionesNegativas = ['triste', 'enojado', 'miedo', 'preocupado'];
  
  if (emocionesNegativas.includes(emocion.toLowerCase())) {
    alerta_nivel = 1; // Alerta amarilla/roja para el padre
  }

  try {
    await db.query(
      'INSERT INTO diario (nino_id, emocion, texto, alerta_nivel) VALUES (?, ?, ?, ?)',
      [nino_id, emocion, texto || '', alerta_nivel]
    );
    
    // Opcional: Dar monedas por expresarse
    await db.query('UPDATE ninos SET monedas = monedas + 5 WHERE id = ?', [nino_id]);

    res.json({ success: true, message: '¡Gracias por compartirlo!', monedasGanadas: 5 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al guardar diario' });
  }
});

// 31. OBTENER HISTORIAL (Para reportes del Padre)
app.get('/api/diario/:nino_id', async (req, res) => {
  try {
    const [entradas] = await db.query(
      'SELECT * FROM diario WHERE nino_id = ? ORDER BY fecha DESC LIMIT 20',
      [req.params.nino_id]
    );
    res.json({ success: true, entradas });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener diario' });
  }
});

// --- MÓDULO DE ECONOMÍA (TIENDA Y INVENTARIO) ---

// 32. COMPRAR ARTÍCULO (Transacción Segura)
app.post('/api/tienda/comprar', async (req, res) => {
  const { nino_id, item_id, precio } = req.body;

  const connection = await db.getConnection(); // Conexión directa para transacción

  try {
    await connection.beginTransaction();

    // 1. Verificar saldo actual del niño
    const [nino] = await connection.query('SELECT monedas FROM ninos WHERE id = ?', [nino_id]);
    
    if (nino.length === 0) throw new Error('Niño no encontrado');
    if (nino[0].monedas < precio) {
      throw new Error('No tienes suficientes monedas');
    }

    // 2. Verificar si ya tiene el item (Opcional, evita duplicados)
    const [inventario] = await connection.query(
      'SELECT id FROM inventario WHERE nino_id = ? AND item_id = ?', 
      [nino_id, item_id]
    );
    if (inventario.length > 0) {
      throw new Error('¡Ya tienes este artículo!');
    }

    // 3. Restar monedas
    await connection.query('UPDATE ninos SET monedas = monedas - ? WHERE id = ?', [precio, nino_id]);

    // 4. Agregar al inventario
    await connection.query(
      'INSERT INTO inventario (nino_id, item_id) VALUES (?, ?)',
      [nino_id, item_id]
    );

    await connection.commit(); // Confirmar todo

    // Devolvemos el nuevo saldo para actualizar la app
    res.json({ success: true, message: '¡Compra exitosa!', nuevoSaldo: nino[0].monedas - precio });

  } catch (error) {
    await connection.rollback(); // Cancelar todo si falla algo
    res.status(400).json({ success: false, message: error.message || 'Error en la compra' });
  } finally {
    connection.release();
  }
});

// 33. OBTENER INVENTARIO DEL NIÑO (Lo que ya compró)
app.get('/api/inventario/:nino_id', async (req, res) => {
  try {
    // Hacemos JOIN para traer los detalles del item (nombre, imagen)
    const [items] = await db.query(`
      SELECT i.*, t.nombre, t.tipo, t.imagen_url, t.descripcion 
      FROM inventario i
      JOIN items_tienda t ON i.item_id = t.id
      WHERE i.nino_id = ?
    `, [req.params.nino_id]);
    
    res.json({ success: true, inventario: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener inventario' });
  }
});

// 34. EQUIPAR ITEM (Ponerse la gorra/lentes)
app.put('/api/inventario/equipar', async (req, res) => {
  const { nino_id, item_id, tipo } = req.body; // tipo: 'sombrero', 'lentes', etc.

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Desequipar cualquier otro item de ese TIPO (solo 1 sombrero a la vez)
    // Primero buscamos los IDs de items de ese tipo en el inventario del niño
    await connection.query(`
        UPDATE inventario i
        JOIN items_tienda t ON i.item_id = t.id
        SET i.es_equipado = FALSE
        WHERE i.nino_id = ? AND t.tipo = ?
    `, [nino_id, tipo]);

    // 2. Equipar el nuevo item
    if (item_id) { // Si item_id es null, significa "quitar todo"
        await connection.query(
            'UPDATE inventario SET es_equipado = TRUE WHERE nino_id = ? AND item_id = ?',
            [nino_id, item_id]
        );
    }

    await connection.commit();
    res.json({ success: true, message: 'Avatar actualizado' });

  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al equipar' });
  } finally {
    connection.release();
  }
});

// --- MÓDULO BUENOS MOMENTOS (MENSAJERÍA) ---

// 35. ENVIAR MENSAJE (Padre -> Hijo)
app.post('/api/mensajes', async (req, res) => {
  const { padre_id, nino_id, mensaje, monedas_regalo } = req.body;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Guardar el mensaje
    await connection.query(
      'INSERT INTO buenos_momentos (padre_id, nino_id, mensaje, monedas_regalo) VALUES (?, ?, ?, ?)',
      [padre_id, nino_id, mensaje, monedas_regalo || 0]
    );

    // 2. Si hay monedas de regalo, sumarlas al niño inmediatamente
    if (monedas_regalo > 0) {
        await connection.query('UPDATE ninos SET monedas = monedas + ? WHERE id = ?', [monedas_regalo, nino_id]);
    }

    await connection.commit();
    res.json({ success: true, message: 'Mensaje enviado con amor ❤️' });

  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al enviar mensaje' });
  } finally {
    connection.release();
  }
});

// 36. OBTENER MENSAJES (Niño)
app.get('/api/mensajes/:nino_id', async (req, res) => {
  try {
    const [mensajes] = await db.query(
      'SELECT * FROM buenos_momentos WHERE nino_id = ? ORDER BY fecha_envio DESC',
      [req.params.nino_id]
    );
    res.json({ success: true, mensajes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener mensajes' });
  }
});

// 37. MARCAR COMO LEÍDO (Para quitar el puntito de "nuevo")
app.put('/api/mensajes/:id/leido', async (req, res) => {
  try {
    await db.query('UPDATE buenos_momentos SET visto_por_nino = TRUE WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar' });
  }
});
// --- MÓDULO DE JUEGOS Y PROGRESO ---

// 38. OBTENER MAPA DE NIVELES (Con estado de desbloqueo)
app.get('/api/juegos/mapa/:nino_id', async (req, res) => {
  const { nino_id } = req.params;

  try {
    // 1. Obtener todos los valores (que serán nuestros niveles)
    const [valores] = await db.query('SELECT * FROM valores'); // Honestidad, Valentía, etc.

    // 2. Obtener progreso del niño (qué niveles ya pasó)
    const [progreso] = await db.query(
      'SELECT valor_id FROM medallas WHERE nino_id = ?', 
      [nino_id]
    );
    
    // Convertimos el progreso a un array simple de IDs [1, 2]
    const nivelesCompletados = progreso.map(p => p.valor_id);

    // 3. Construir el mapa con lógica de desbloqueo
    // El nivel 1 siempre está abierto. El 2 se abre si pasaste el 1.
    const mapa = valores.map((valor, index) => {
      const completado = nivelesCompletados.includes(valor.id);
      
      // Lógica: Si el ANTERIOR está completado (o es el primero), este está desbloqueado
      const nivelAnterior = valores[index - 1];
      const desbloqueado = index === 0 || nivelesCompletados.includes(nivelAnterior.id);

      return {
        id: valor.id,
        titulo: valor.nombre,
        color: valor.color_hex,
        completado: completado,
        bloqueado: !desbloqueado && !completado
      };
    });

    res.json({ success: true, mapa });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al cargar mapa' });
  }
});

// 39. TERMINAR NIVEL (Ganar Medalla)
app.post('/api/juegos/completar', async (req, res) => {
  const { nino_id, valor_id } = req.body;

  try {
    // Verificar si ya lo completó para no duplicar medallas
    const [existente] = await db.query(
      'SELECT id FROM medallas WHERE nino_id = ? AND valor_id = ?', 
      [nino_id, valor_id]
    );

    let mensaje = '¡Nivel completado!';
    let monedas = 0;

    if (existente.length === 0) {
      // Guardar medalla
      await db.query(
        'INSERT INTO medallas (nino_id, valor_id) VALUES (?, ?)',
        [nino_id, valor_id]
      );
      
      // Dar recompensa grande (50 monedas) por pasar nivel
      monedas = 50;
      await db.query('UPDATE ninos SET monedas = monedas + ? WHERE id = ?', [monedas, nino_id]);
      mensaje = '¡Nivel superado! Ganaste 50 monedas.';
    }

    res.json({ success: true, message: mensaje, monedasGanadas: monedas });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al guardar progreso' });
  }
});

// --- MÓDULO DE LOGROS (TROFEOS) ---

// 40. OBTENER SALA DE TROFEOS
app.get('/api/logros/:nino_id', async (req, res) => {
  const { nino_id } = req.params;

  try {
    // 1. Obtener todos los valores posibles (que son los trofeos)
    const [valores] = await db.query('SELECT * FROM valores');

    // 2. Obtener las medallas que el niño YA tiene
    const [medallas] = await db.query(
      'SELECT valor_id, fecha_ganada FROM medallas WHERE nino_id = ?', 
      [nino_id]
    );

    // 3. Cruzar la información
    const trofeos = valores.map(valor => {
      // Buscamos si existe la medalla para este valor
      const medalla = medallas.find(m => m.valor_id === valor.id);
      
      return {
        id: valor.id,
        titulo: valor.nombre,
        descripcion: valor.descripcion, // "Decir la verdad"
        color: valor.color_hex,
        ganado: !!medalla, // true si existe, false si no
        fecha: medalla ? medalla.fecha_ganada : null
      };
    });

    res.json({ success: true, trofeos });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al cargar logros' });
  }
});

// --- MÓDULO BUENOS MOMENTOS ---

// 35. ENVIAR MENSAJE (Papá envía -> Base de Datos guarda)
app.post('/api/mensajes', async (req, res) => {
  const { padre_id, nino_id, mensaje, monedas_regalo } = req.body;

  // Validación rápida
  if (!padre_id || !nino_id || !mensaje) {
      return res.status(400).json({ success: false, message: 'Faltan datos' });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Guardar el mensaje en la tabla que acabamos de crear
    await connection.query(
      'INSERT INTO buenos_momentos (padre_id, nino_id, mensaje, monedas_regalo) VALUES (?, ?, ?, ?)',
      [padre_id, nino_id, mensaje, monedas_regalo || 0]
    );

    // 2. Si hay regalo, sumar monedas al niño
    if (monedas_regalo > 0) {
        await connection.query('UPDATE ninos SET monedas = monedas + ? WHERE id = ?', [monedas_regalo, nino_id]);
    }

    await connection.commit();
    res.json({ success: true, message: 'Mensaje enviado con éxito 💌' });

  } catch (error) {
    await connection.rollback();
    console.error("Error enviando mensaje:", error);
    res.status(500).json({ success: false, message: 'Error en el servidor al enviar mensaje' });
  } finally {
    connection.release();
  }
});

// 36. LEER MENSAJES (Niño recibe)
app.get('/api/mensajes/:nino_id', async (req, res) => {
  try {
    const [mensajes] = await db.query(
      'SELECT * FROM buenos_momentos WHERE nino_id = ? ORDER BY fecha_envio DESC',
      [req.params.nino_id]
    );
    res.json({ success: true, mensajes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al leer mensajes' });
  }
});

// 37. MARCAR LEÍDO
app.put('/api/mensajes/:id/leido', async (req, res) => {
    try {
        await db.query('UPDATE buenos_momentos SET visto_por_nino = 1 WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Error actualizando' });
    }
});

// --- MÓDULO DE REPORTES Y PROGRESO ---

// 41. OBTENER RESUMEN DE PROGRESO (Para el Padre)
app.get('/api/progreso/:nino_id', async (req, res) => {
  const { nino_id } = req.params;

  try {
    // 1. Datos básicos (Monedas)
    const [nino] = await db.query('SELECT monedas FROM ninos WHERE id = ?', [nino_id]);
    
    // 2. Conteo de Medallas (Logros)
    const [medallas] = await db.query('SELECT COUNT(*) as total FROM medallas WHERE nino_id = ?', [nino_id]);
    
    // 3. Entradas del Diario (Para calcular actividad reciente)
    const [diario] = await db.query('SELECT fecha, emocion as titulo FROM diario WHERE nino_id = ? ORDER BY fecha DESC LIMIT 5', [nino_id]);

    // 4. Medallas recientes (Para mezclar con actividad)
    const [medallasRecientes] = await db.query(`
        SELECT m.fecha_ganada as fecha, v.nombre as titulo 
        FROM medallas m
        JOIN valores v ON m.valor_id = v.id 
        WHERE m.nino_id = ? 
        ORDER BY m.fecha_ganada DESC LIMIT 5
    `, [nino_id]);

    // 5. Cálculo simple de "Racha" (Días distintos con actividad en medallas o diario)
    // Esto es una simplificación. En un sistema real sería más complejo.
    const racha = 3; // Valor simulado por ahora para no complicar la query SQL

    // Mezclar y ordenar actividades recientes
    const actividades = [
        ...diario.map(d => ({ type: 'diario', title: `Diario: Se sintió ${d.titulo}`, date: d.fecha })),
        ...medallasRecientes.map(m => ({ type: 'juego', title: `Ganó medalla: ${m.titulo}`, date: m.fecha }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    res.json({
      success: true,
      stats: {
        monedas: nino[0] ? nino[0].monedas : 0,
        logros: medallas[0].total,
        racha: racha
      },
      recentActivity: actividades
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al obtener progreso' });
  }
});
// --- MÓDULO DE BIENESTAR (PADRES) ---

// 42. OBTENER DATOS DE BIENESTAR (Alertas y Tema del Día)
app.get('/api/bienestar/:nino_id', async (req, res) => {
  const { nino_id } = req.params;

  try {
    // 1. Obtener Historial de Alertas (Diario con alerta_nivel > 0)
    const [alertas] = await db.query(
      'SELECT id, emocion, texto, fecha FROM diario WHERE nino_id = ? AND alerta_nivel > 0 ORDER BY fecha DESC LIMIT 10', 
      [nino_id]
    );

    // 2. Generar "Tema de Conversación" basado en el último logro
    const [ultimaMedalla] = await db.query(`
        SELECT v.nombre, v.descripcion 
        FROM medallas m
        JOIN valores v ON m.valor_id = v.id 
        WHERE m.nino_id = ? 
        ORDER BY m.fecha_ganada DESC LIMIT 1
    `, [nino_id]);

    let tema = null;

    if (ultimaMedalla.length > 0) {
        const valor = ultimaMedalla[0];
        // Generamos una sugerencia dinámica
        tema = {
            titulo: `Hablemos de: ${valor.nombre}`,
            descripcion: `Tu hijo acaba de aprender sobre ${valor.nombre.toLowerCase()}.`,
            pregunta: `Pregúntale: "${valor.descripcion}. ¿Cómo podrías aplicar esto mañana en la escuela?"`,
            icono: 'chatbubbles'
        };
    } else {
        // Tema por defecto si no ha jugado nada
        tema = {
            titulo: "Conociendo a Valo",
            descripcion: "Aún no hay trofeos recientes.",
            pregunta: "Pregúntale qué le gustaría jugar hoy en la app.",
            icono: 'happy'
        };
    }

    res.json({
      success: true,
      historialAlertas: alertas,
      temaDelDia: tema
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al obtener bienestar' });
  }
});
// --- MÓDULO COMUNIDAD ---

// 43. OBTENER POSTS
app.get('/api/comunidad', async (req, res) => {
  try {
    const [posts] = await db.query('SELECT * FROM comunidad ORDER BY created_at DESC');
    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// 44. CREAR POST
app.post('/api/comunidad', async (req, res) => {
  const { padre_id, autor_nombre, titulo, contenido } = req.body;
  try {
    await db.query(
      'INSERT INTO comunidad (padre_id, autor_nombre, titulo, contenido) VALUES (?, ?, ?, ?)',
      [padre_id, autor_nombre, titulo, contenido]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});


// 45. CREAR SUSCRIPCIÓN (Cobro recurrente)
app.post('/api/mp/crear-suscripcion', async (req, res) => {
  const { padre_id, email } = req.body; // Necesitamos el email del pagador

  try {
    const subscription = new PreApproval(client);

    const result = await subscription.create({
      body: {
        reason: "Suscripción Premium Ingenioware", // Nombre en el estado de cuenta
        auto_recurring: {
          frequency: 1,           // Cada 1
          frequency_type: "months", // Mes
          transaction_amount: 299,  // Precio
          currency_id: "MXN"
        },
        back_url: "http://localhost:5173/portal/suscripcion", // A dónde volver al terminar
        payer_email: email || "test_user_123456@testuser.com", // Email del usuario (obligatorio para pruebas)
        status: "pending"
      }
    });

    // Devolvemos la URL de pago (init_point)
    // El usuario será redirigido aquí para aprobar la suscripción
    res.json({ url: result.init_point });

  } catch (error) {
    console.error("Error MP:", error);
    res.status(500).json({ error: 'Error al crear la suscripción' });
  }
});

// 46. (OPCIONAL) WEBHOOK - Para enterarte cuando se cobre el mes
// Mercado Pago llamará a esta ruta automáticamente
app.post('/api/mp/webhook', async (req, res) => {
    const { type, data } = req.body;
    
    if (type === 'subscription_preapproval') {
        // Aquí podrías actualizar la base de datos a "Activo"
        console.log("Suscripción actualizada:", data.id);
    }
    res.sendStatus(200);
});

// Iniciar
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});