-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 21-01-2026 a las 21:32:16
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ingenioware_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `admins`
--

INSERT INTO `admins` (`id`, `email`, `password`, `nombre`, `created_at`) VALUES
(1, 'admin@ingenioware.com', 'admin123', 'Super Admin', '2025-12-01 14:42:03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `buenos_momentos`
--

CREATE TABLE `buenos_momentos` (
  `id` int(11) NOT NULL,
  `padre_id` int(11) NOT NULL,
  `nino_id` int(11) NOT NULL,
  `mensaje` text NOT NULL,
  `monedas_regalo` int(11) DEFAULT 0,
  `visto_por_nino` tinyint(1) DEFAULT 0,
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `buenos_momentos`
--

INSERT INTO `buenos_momentos` (`id`, `padre_id`, `nino_id`, `mensaje`, `monedas_regalo`, `visto_por_nino`, `fecha_envio`) VALUES
(1, 1, 1, 'Felicidades por guardar tus juguetes ', 10, 1, '2025-12-17 19:21:31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `canciones`
--

CREATE TABLE `canciones` (
  `id` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `artista` varchar(100) DEFAULT 'Ingenioware',
  `portada_url` text DEFAULT NULL,
  `archivo_url` text NOT NULL,
  `duracion` varchar(10) DEFAULT '3:00',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `canciones`
--

INSERT INTO `canciones` (`id`, `titulo`, `artista`, `portada_url`, `archivo_url`, `duracion`, `created_at`) VALUES
(1, 'Adios y Volvere', 'Ingenioware', 'https://cdn-icons-png.flaticon.com/512/616/616408.png', 'uploads/1765463215535-AdiÃ³s y volverÃ©.mp3', '3:00', '2025-12-11 14:26:55'),
(2, 'Prueba', 'Ingenioware', 'https://cdn-icons-png.flaticon.com/512/616/616408.png', 'uploads/1765466934002-AdiÃ³s y volverÃ©.mp3', '3:00', '2025-12-11 15:28:54');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comunidad`
--

CREATE TABLE `comunidad` (
  `id` int(11) NOT NULL,
  `padre_id` int(11) NOT NULL,
  `autor_nombre` varchar(100) DEFAULT NULL,
  `titulo` varchar(100) DEFAULT NULL,
  `contenido` text DEFAULT NULL,
  `likes` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comunidad`
--

INSERT INTO `comunidad` (`id`, `padre_id`, `autor_nombre`, `titulo`, `contenido`, `likes`, `created_at`) VALUES
(1, 1, 'Equipo Ingenioware', '¡Bienvenidos!', 'Este es un espacio para compartir experiencias de crianza.', 0, '2025-12-16 14:30:19');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuentos`
--

CREATE TABLE `cuentos` (
  `id` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `sinopsis` text DEFAULT NULL,
  `valor_id` int(11) DEFAULT NULL,
  `portada_url` text DEFAULT NULL,
  `contenido_url` text DEFAULT NULL,
  `edad_minima` int(11) DEFAULT 4
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cuentos`
--

INSERT INTO `cuentos` (`id`, `titulo`, `sinopsis`, `valor_id`, `portada_url`, `contenido_url`, `edad_minima`) VALUES
(3, 'El Zorro y la moneda brillante', 'Había una vez un pequeño zorro llamado Zasi que vivía en un bosque lleno de árboles altos y flores de colores. A Zasi le encantaba coleccionar piedras brillantes y hojas secas de formas raras. Un día, mientras caminaba cerca del río saltando entre las rocas, vio algo que brillaba mucho más que cualquier piedra. Se acercó corriendo y descubrió que era una enorme moneda de oro. Zasi la tomó entre sus patas y sus ojos se iluminaron de emoción.\n\nPensó en todas las cosas deliciosas que podría comprar en la tienda del bosque, como pasteles de miel y jugosos arándanos. De repente, escuchó un llanto suave detrás de un arbusto cercano. Se asomó con cuidado y vio a la Señora Osa, que buscaba desesperadamente en el suelo moviendo las hojas. \"He perdido mi moneda de la suerte\", decía la Osa muy triste. \"Sin ella, no podré comprar la medicina para mi osito que está enfermo en cama\".\n\nZasi sintió un nudo en la panza y apretó la moneda en su bolsillo. Podía irse corriendo en silencio y nadie lo sabría jamás. Podría comer pasteles toda la tarde. Pero luego miró a la Señora Osa secándose las lágrimas y pensó en el pequeño osito enfermo. Zasi sabía qué era lo correcto, aunque fuera difícil.\n\nZasi respiró hondo, se acercó a ella y sacó la moneda brillante. \"Señora Osa, no llore más\", dijo con voz firme. \"Yo encontré su moneda junto al río\". La Señora Osa dio un salto de alegría, tomó la moneda y abrazó a Zasi con un abrazo de oso gigante. \"Gracias, pequeño zorro. Tu honestidad vale más que todo el oro del mundo\", le dijo con una gran sonrisa. Esa noche, Zasi cenó su sopa habitual, pero se sintió más feliz que si hubiera comido mil pasteles, porque sabía que había dicho la verdad.', 1, 'https://cdn-icons-png.flaticon.com/512/616/616408.png', '', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `diario`
--

CREATE TABLE `diario` (
  `id` int(11) NOT NULL,
  `nino_id` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `emocion` varchar(20) DEFAULT NULL,
  `texto` text DEFAULT NULL,
  `alerta_nivel` int(11) DEFAULT 0,
  `visto_por_padre` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `diario`
--

INSERT INTO `diario` (`id`, `nino_id`, `fecha`, `emocion`, `texto`, `alerta_nivel`, `visto_por_padre`) VALUES
(1, 1, '2025-12-16 14:27:43', 'feliz', 'ikdjdkdkd', 0, 0),
(2, 1, '2025-12-17 19:23:14', 'feliz', '', 0, 0),
(3, 1, '2026-01-16 16:52:22', 'feliz', 'jajajaja ', 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos_calendario`
--

CREATE TABLE `eventos_calendario` (
  `id` int(11) NOT NULL,
  `padre_id` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime DEFAULT NULL,
  `es_hito_app` tinyint(1) DEFAULT 0,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `eventos_calendario`
--

INSERT INTO `eventos_calendario` (`id`, `padre_id`, `titulo`, `fecha_inicio`, `fecha_fin`, `es_hito_app`, `descripcion`) VALUES
(2, 1, 'Clases de natancion', '2025-12-10 00:00:00', '2025-12-11 00:00:00', 0, 'Creado desde el portal web');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario`
--

CREATE TABLE `inventario` (
  `id` int(11) NOT NULL,
  `nino_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `fecha_compra` timestamp NOT NULL DEFAULT current_timestamp(),
  `es_equipado` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inventario`
--

INSERT INTO `inventario` (`id`, `nino_id`, `item_id`, `fecha_compra`, `es_equipado`) VALUES
(1, 1, 4, '2025-12-17 19:22:40', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `items_tienda`
--

CREATE TABLE `items_tienda` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `tipo` enum('sombrero','lentes','ropa','fondo') NOT NULL,
  `precio` int(11) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen_url` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `items_tienda`
--

INSERT INTO `items_tienda` (`id`, `nombre`, `tipo`, `precio`, `descripcion`, `imagen_url`, `created_at`) VALUES
(1, 'Sombrero de Copa', 'sombrero', 5, '¡Muy elegante!', 'sombrero.png', '2025-12-01 14:42:04'),
(2, 'Gorra', 'sombrero', 3, 'Estilo casual', 'gorra.png', '2025-12-01 14:42:04'),
(3, 'Lentes de Sol', 'lentes', 4, '¡Qué cool!', 'lentesSol.png', '2025-12-01 14:42:04'),
(4, 'Corbata', 'ropa', 5, 'Muy formal', 'corbata.png', '2025-12-01 14:42:04'),
(5, 'Parque', 'fondo', 10, 'Un día soleado', 'fondoNaturaleza.png', '2025-12-01 14:42:04'),
(6, 'Fondo 12', 'fondo', 12, 'sdf', 'sd', '2025-12-06 22:45:42');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `juegos`
--

CREATE TABLE `juegos` (
  `id` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `valor_id` int(11) DEFAULT NULL,
  `portada_url` text DEFAULT NULL,
  `configuracion_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`configuracion_json`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medallas`
--

CREATE TABLE `medallas` (
  `id` int(11) NOT NULL,
  `nino_id` int(11) NOT NULL,
  `valor_id` int(11) NOT NULL,
  `fecha_ganada` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medallas`
--

INSERT INTO `medallas` (`id`, `nino_id`, `valor_id`, `fecha_ganada`) VALUES
(1, 1, 1, '2025-12-17 17:59:42'),
(2, 1, 2, '2025-12-17 17:59:47'),
(3, 1, 3, '2025-12-17 17:59:49'),
(4, 1, 4, '2025-12-17 17:59:54'),
(5, 1, 5, '2025-12-17 18:00:00'),
(6, 1, 6, '2025-12-17 18:00:03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ninos`
--

CREATE TABLE `ninos` (
  `id` int(11) NOT NULL,
  `padre_id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apodo` varchar(50) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `avatar_emoji` varchar(50) DEFAULT '??',
  `monedas` int(11) DEFAULT 0,
  `pin` varchar(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ninos`
--

INSERT INTO `ninos` (`id`, `padre_id`, `nombre`, `apodo`, `fecha_nacimiento`, `avatar_emoji`, `monedas`, `pin`) VALUES
(1, 1, 'Santiago', 'Santi', '2019-04-07', '🦖', 350, '1234');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `padres`
--

CREATE TABLE `padres` (
  `id` int(11) NOT NULL,
  `primer_nombre` varchar(50) NOT NULL,
  `segundo_nombre` varchar(50) DEFAULT NULL,
  `ap_padre` varchar(70) DEFAULT NULL,
  `am_padre` varchar(70) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `pin_seguridad` varchar(4) DEFAULT NULL,
  `suscripcion_tipo` enum('free','premium','familiar') DEFAULT 'free',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` enum('activo','bloqueado') DEFAULT 'activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `padres`
--

INSERT INTO `padres` (`id`, `primer_nombre`, `segundo_nombre`, `ap_padre`, `am_padre`, `email`, `password`, `pin_seguridad`, `suscripcion_tipo`, `created_at`, `estado`) VALUES
(1, 'Adriana', 'Lorena', 'Noyola', 'Mendoza', 'adri@gmail.com', '12345678', '1234', 'free', '2025-12-06 22:07:51', 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `progreso_nino`
--

CREATE TABLE `progreso_nino` (
  `id` int(11) NOT NULL,
  `nino_id` int(11) NOT NULL,
  `tipo_contenido` enum('cuento','juego','cancion') NOT NULL,
  `contenido_id` int(11) NOT NULL,
  `fecha_completado` timestamp NOT NULL DEFAULT current_timestamp(),
  `puntuacion` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recursos_padres`
--

CREATE TABLE `recursos_padres` (
  `id` int(11) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `contenido` text NOT NULL,
  `categoria` enum('crianza','valores','app') NOT NULL,
  `imagen_url` text DEFAULT NULL,
  `tiempo_lectura_min` int(11) DEFAULT NULL,
  `creado_por_admin_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `recursos_padres`
--

INSERT INTO `recursos_padres` (`id`, `titulo`, `contenido`, `categoria`, `imagen_url`, `tiempo_lectura_min`, `creado_por_admin_id`, `created_at`) VALUES
(1, 'Cómo hablar de emociones', 'Hablar de emociones con los niños es fundamental para su desarrollo...', 'crianza', 'https://images.pexels.com/photos/3931568/pexels-photo-3931568.jpeg', 5, NULL, '2025-12-11 00:28:22');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `suscripciones`
--

CREATE TABLE `suscripciones` (
  `id` int(11) NOT NULL,
  `padre_id` int(11) NOT NULL,
  `plan` varchar(20) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `fecha_inicio` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_fin` timestamp NULL DEFAULT NULL,
  `metodo_pago` varchar(50) DEFAULT 'tarjeta_simulada',
  `estado` enum('activa','vencida','cancelada') DEFAULT 'activa'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `suscripciones`
--

INSERT INTO `suscripciones` (`id`, `padre_id`, `plan`, `precio`, `fecha_inicio`, `fecha_fin`, `metodo_pago`, `estado`) VALUES
(1, 1, 'premium', 199.00, '2025-12-11 00:18:25', '2026-01-10 00:18:25', 'tarjeta_simulada', 'activa'),
(2, 1, 'free', 0.00, '2025-12-11 00:18:40', '2026-01-10 00:18:40', 'tarjeta_simulada', 'activa');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `valores`
--

CREATE TABLE `valores` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `color_hex` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `valores`
--

INSERT INTO `valores` (`id`, `nombre`, `descripcion`, `color_hex`) VALUES
(1, 'Valentía', 'Enfrentar el miedo', '#FFD700'),
(2, 'Honestidad', 'Decir la verdad', '#4ECDC4'),
(3, 'Empatía', 'Entender a los demás', '#FF6B6B'),
(4, 'Responsabilidad', 'Cumplir deberes', '#A06CD5'),
(5, 'Generosidad', 'Compartir con otros', '#FF8FAB'),
(6, 'Paciencia', 'Saber esperar', '#95E1D3');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `buenos_momentos`
--
ALTER TABLE `buenos_momentos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `padre_id` (`padre_id`),
  ADD KEY `nino_id` (`nino_id`);

--
-- Indices de la tabla `canciones`
--
ALTER TABLE `canciones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `comunidad`
--
ALTER TABLE `comunidad`
  ADD PRIMARY KEY (`id`),
  ADD KEY `padre_id` (`padre_id`);

--
-- Indices de la tabla `cuentos`
--
ALTER TABLE `cuentos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `valor_id` (`valor_id`);

--
-- Indices de la tabla `diario`
--
ALTER TABLE `diario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nino_id` (`nino_id`);

--
-- Indices de la tabla `eventos_calendario`
--
ALTER TABLE `eventos_calendario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `padre_id` (`padre_id`);

--
-- Indices de la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nino_id` (`nino_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indices de la tabla `items_tienda`
--
ALTER TABLE `items_tienda`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `juegos`
--
ALTER TABLE `juegos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `valor_id` (`valor_id`);

--
-- Indices de la tabla `medallas`
--
ALTER TABLE `medallas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nino_id` (`nino_id`),
  ADD KEY `valor_id` (`valor_id`);

--
-- Indices de la tabla `ninos`
--
ALTER TABLE `ninos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `padre_id` (`padre_id`);

--
-- Indices de la tabla `padres`
--
ALTER TABLE `padres`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `progreso_nino`
--
ALTER TABLE `progreso_nino`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nino_id` (`nino_id`);

--
-- Indices de la tabla `recursos_padres`
--
ALTER TABLE `recursos_padres`
  ADD PRIMARY KEY (`id`),
  ADD KEY `creado_por_admin_id` (`creado_por_admin_id`);

--
-- Indices de la tabla `suscripciones`
--
ALTER TABLE `suscripciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `padre_id` (`padre_id`);

--
-- Indices de la tabla `valores`
--
ALTER TABLE `valores`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `buenos_momentos`
--
ALTER TABLE `buenos_momentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `canciones`
--
ALTER TABLE `canciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `comunidad`
--
ALTER TABLE `comunidad`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `cuentos`
--
ALTER TABLE `cuentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `diario`
--
ALTER TABLE `diario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `eventos_calendario`
--
ALTER TABLE `eventos_calendario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `inventario`
--
ALTER TABLE `inventario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `items_tienda`
--
ALTER TABLE `items_tienda`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `juegos`
--
ALTER TABLE `juegos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `medallas`
--
ALTER TABLE `medallas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `ninos`
--
ALTER TABLE `ninos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `padres`
--
ALTER TABLE `padres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `progreso_nino`
--
ALTER TABLE `progreso_nino`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `recursos_padres`
--
ALTER TABLE `recursos_padres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `suscripciones`
--
ALTER TABLE `suscripciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `valores`
--
ALTER TABLE `valores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `buenos_momentos`
--
ALTER TABLE `buenos_momentos`
  ADD CONSTRAINT `buenos_momentos_ibfk_1` FOREIGN KEY (`padre_id`) REFERENCES `padres` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `buenos_momentos_ibfk_2` FOREIGN KEY (`nino_id`) REFERENCES `ninos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `comunidad`
--
ALTER TABLE `comunidad`
  ADD CONSTRAINT `comunidad_ibfk_1` FOREIGN KEY (`padre_id`) REFERENCES `padres` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `cuentos`
--
ALTER TABLE `cuentos`
  ADD CONSTRAINT `cuentos_ibfk_1` FOREIGN KEY (`valor_id`) REFERENCES `valores` (`id`);

--
-- Filtros para la tabla `diario`
--
ALTER TABLE `diario`
  ADD CONSTRAINT `diario_ibfk_1` FOREIGN KEY (`nino_id`) REFERENCES `ninos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `eventos_calendario`
--
ALTER TABLE `eventos_calendario`
  ADD CONSTRAINT `eventos_calendario_ibfk_1` FOREIGN KEY (`padre_id`) REFERENCES `padres` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`nino_id`) REFERENCES `ninos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inventario_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items_tienda` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `juegos`
--
ALTER TABLE `juegos`
  ADD CONSTRAINT `juegos_ibfk_1` FOREIGN KEY (`valor_id`) REFERENCES `valores` (`id`);

--
-- Filtros para la tabla `medallas`
--
ALTER TABLE `medallas`
  ADD CONSTRAINT `medallas_ibfk_1` FOREIGN KEY (`nino_id`) REFERENCES `ninos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `medallas_ibfk_2` FOREIGN KEY (`valor_id`) REFERENCES `valores` (`id`);

--
-- Filtros para la tabla `ninos`
--
ALTER TABLE `ninos`
  ADD CONSTRAINT `ninos_ibfk_1` FOREIGN KEY (`padre_id`) REFERENCES `padres` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `progreso_nino`
--
ALTER TABLE `progreso_nino`
  ADD CONSTRAINT `progreso_nino_ibfk_1` FOREIGN KEY (`nino_id`) REFERENCES `ninos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `recursos_padres`
--
ALTER TABLE `recursos_padres`
  ADD CONSTRAINT `recursos_padres_ibfk_1` FOREIGN KEY (`creado_por_admin_id`) REFERENCES `admins` (`id`);

--
-- Filtros para la tabla `suscripciones`
--
ALTER TABLE `suscripciones`
  ADD CONSTRAINT `suscripciones_ibfk_1` FOREIGN KEY (`padre_id`) REFERENCES `padres` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
