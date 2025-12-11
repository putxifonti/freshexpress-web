-- =====================================================
-- Script SQL per a FreshExpress - Sistema de Repartidors
-- Executar a la base de dades: freshexpress_operacional
-- =====================================================

USE freshexpress_operacional;

-- =====================================================
-- TAULA: repartidores (informació extra dels repartidors)
-- =====================================================
CREATE TABLE IF NOT EXISTS repartidores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    vehiculo_tipo ENUM('bicicleta', 'moto', 'coche', 'furgoneta', 'a_pie') DEFAULT 'bicicleta',
    matricula VARCHAR(20),
    licencia_conducir VARCHAR(50),
    zona_preferida VARCHAR(100),
    radio_km DECIMAL(5,2) DEFAULT 5.00,
    disponible TINYINT(1) DEFAULT 0,
    en_ruta TINYINT(1) DEFAULT 0,
    valoracion_media DECIMAL(3,2) DEFAULT 5.00,
    entregas_completadas INT DEFAULT 0,
    entregas_canceladas INT DEFAULT 0,
    fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_ubicacion_lat DECIMAL(10,8),
    ultima_ubicacion_lng DECIMAL(11,8),
    ultima_actualizacion TIMESTAMP NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TAULA: pedidos (comandes dels clients)
-- =====================================================
CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_pedido VARCHAR(20) NOT NULL UNIQUE,
    cliente_id INT NOT NULL,
    repartidor_id INT,
    estado ENUM('pendiente', 'confirmado', 'preparando', 'listo', 'en_camino', 'entregado', 'cancelado') DEFAULT 'pendiente',
    direccion_entrega TEXT NOT NULL,
    latitud_entrega DECIMAL(10,8),
    longitud_entrega DECIMAL(11,8),
    notas_cliente TEXT,
    notas_repartidor TEXT,
    subtotal DECIMAL(10,2) NOT NULL,
    coste_envio DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    metodo_pago ENUM('tarjeta', 'efectivo', 'bizum') DEFAULT 'tarjeta',
    pagado TINYINT(1) DEFAULT 0,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_confirmacion TIMESTAMP NULL,
    fecha_preparacion TIMESTAMP NULL,
    fecha_recogida TIMESTAMP NULL,
    fecha_entrega TIMESTAMP NULL,
    tiempo_estimado_min INT DEFAULT 30,
    propina DECIMAL(10,2) DEFAULT 0,
    valoracion_cliente INT,
    comentario_valoracion TEXT,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (repartidor_id) REFERENCES repartidores(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TAULA: pedido_productos (productes de cada comanda)
-- =====================================================
CREATE TABLE IF NOT EXISTS pedido_productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    notas TEXT,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TAULA: horarios_repartidor (disponibilitat setmanal)
-- =====================================================
CREATE TABLE IF NOT EXISTS horarios_repartidor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    repartidor_id INT NOT NULL,
    dia_semana ENUM('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo') NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    activo TINYINT(1) DEFAULT 1,
    FOREIGN KEY (repartidor_id) REFERENCES repartidores(id) ON DELETE CASCADE,
    UNIQUE KEY unique_repartidor_dia (repartidor_id, dia_semana)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TAULA: incidencias (problemes amb entregues)
-- =====================================================
CREATE TABLE IF NOT EXISTS incidencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    repartidor_id INT,
    tipo ENUM('cliente_ausente', 'direccion_incorrecta', 'producto_danado', 'retraso', 'otro') NOT NULL,
    descripcion TEXT NOT NULL,
    estado ENUM('abierta', 'en_proceso', 'resuelta', 'cerrada') DEFAULT 'abierta',
    fecha_incidencia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_resolucion TIMESTAMP NULL,
    resolucion TEXT,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (repartidor_id) REFERENCES repartidores(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TAULA: entregues (entregues individuals assignades)
-- =====================================================
CREATE TABLE IF NOT EXISTS entregues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT,
    repartidor_id INT,
    nombre_cliente VARCHAR(255) NOT NULL,
    telefono_cliente VARCHAR(20),
    direccion_entrega TEXT NOT NULL,
    codigo_postal VARCHAR(10),
    latitud DECIMAL(10,8),
    longitud DECIMAL(11,8),
    notas_entrega TEXT,
    hora_estimada_entrega DATETIME,
    hora_entrega DATETIME,
    estado ENUM('sin_asignar', 'pendiente', 'en_proceso', 'entregado', 'fallido') DEFAULT 'sin_asignar',
    motivo_fallo TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE SET NULL,
    FOREIGN KEY (repartidor_id) REFERENCES repartidores(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TAULA: ruta_actual (ruta activa del repartidor)
-- =====================================================
CREATE TABLE IF NOT EXISTS ruta_actual (
    id INT AUTO_INCREMENT PRIMARY KEY,
    repartidor_id INT NOT NULL,
    entrega_id INT NOT NULL,
    orden INT NOT NULL DEFAULT 1,
    distancia_km DECIMAL(10,2),
    tiempo_estimado_min INT,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (repartidor_id) REFERENCES repartidores(id) ON DELETE CASCADE,
    FOREIGN KEY (entrega_id) REFERENCES entregues(id) ON DELETE CASCADE,
    UNIQUE KEY unique_repartidor_entrega (repartidor_id, entrega_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TAULA: historial_entregues (registre històric)
-- =====================================================
CREATE TABLE IF NOT EXISTS historial_entregues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entrega_id INT NOT NULL,
    repartidor_id INT NOT NULL,
    estado ENUM('entregado', 'fallido') NOT NULL,
    fecha_entrega TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notas TEXT,
    valoracion_cliente INT,
    comentario_cliente TEXT,
    FOREIGN KEY (entrega_id) REFERENCES entregues(id) ON DELETE CASCADE,
    FOREIGN KEY (repartidor_id) REFERENCES repartidores(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- ÍNDEXS PER MILLORAR RENDIMENT
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_repartidor ON pedidos(repartidor_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_fecha ON pedidos(fecha_pedido);
CREATE INDEX IF NOT EXISTS idx_repartidores_disponible ON repartidores(disponible);
CREATE INDEX IF NOT EXISTS idx_repartidores_zona ON repartidores(zona_preferida);
CREATE INDEX IF NOT EXISTS idx_incidencias_estado ON incidencias(estado);
CREATE INDEX IF NOT EXISTS idx_entregues_repartidor ON entregues(repartidor_id);
CREATE INDEX IF NOT EXISTS idx_entregues_estado ON entregues(estado);
CREATE INDEX IF NOT EXISTS idx_ruta_actual_repartidor ON ruta_actual(repartidor_id);
CREATE INDEX IF NOT EXISTS idx_historial_repartidor ON historial_entregues(repartidor_id);
CREATE INDEX IF NOT EXISTS idx_historial_fecha ON historial_entregues(fecha_entrega);

-- =====================================================
-- DADES DE PROVA (opcional)
-- =====================================================
-- Inserir algunes entregues de prova si hi ha repartidors
INSERT INTO entregues (nombre_cliente, telefono_cliente, direccion_entrega, codigo_postal, notas_entrega, hora_estimada_entrega, estado)
SELECT 'Maria Garcia', '666111222', 'Carrer Major 15, 2n 1a', '08001', 'Trucar abans d''arribar', DATE_ADD(NOW(), INTERVAL 30 MINUTE), 'sin_asignar'
WHERE NOT EXISTS (SELECT 1 FROM entregues LIMIT 1);

INSERT INTO entregues (nombre_cliente, telefono_cliente, direccion_entrega, codigo_postal, notas_entrega, hora_estimada_entrega, estado)
SELECT 'Joan Puig', '666333444', 'Avinguda Diagonal 250, 5è', '08037', 'Portar consergeria', DATE_ADD(NOW(), INTERVAL 45 MINUTE), 'sin_asignar'
WHERE NOT EXISTS (SELECT 1 FROM entregues WHERE nombre_cliente = 'Joan Puig');

INSERT INTO entregues (nombre_cliente, telefono_cliente, direccion_entrega, codigo_postal, notas_entrega, hora_estimada_entrega, estado)
SELECT 'Anna López', '666555666', 'Rambla Catalunya 89, àtic', '08008', NULL, DATE_ADD(NOW(), INTERVAL 60 MINUTE), 'sin_asignar'
WHERE NOT EXISTS (SELECT 1 FROM entregues WHERE nombre_cliente = 'Anna López');

INSERT INTO entregues (nombre_cliente, telefono_cliente, direccion_entrega, codigo_postal, notas_entrega, hora_estimada_entrega, estado)
SELECT 'Pere Martí', '666777888', 'Carrer Aragó 320, 3r 2a', '08009', 'Timbre no funciona, trucar', DATE_ADD(NOW(), INTERVAL 90 MINUTE), 'sin_asignar'
WHERE NOT EXISTS (SELECT 1 FROM entregues WHERE nombre_cliente = 'Pere Martí');

-- =====================================================
-- FI DE L'SCRIPT
-- =====================================================
SELECT 'Script de repartidors executat correctament!' AS resultat;
