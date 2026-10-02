-- =====================================================
-- FreshExpress - Script SQL Complet v2
-- Executar amb: mysql -u root -p < freshexpress_completa.sql
-- =====================================================

-- Inicialització exclusiva per a una instància MySQL nova (sense esborrar dades).

-- =====================================================
-- BASE DE DADES OPERACIONAL
-- =====================================================
CREATE DATABASE IF NOT EXISTS freshexpress_operacional CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE freshexpress_operacional;

-- =====================================================
-- TAULA: usuarios
-- =====================================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    session_version INT NOT NULL DEFAULT 0,
    telefono VARCHAR(20),
    direccion TEXT,
    codigo_postal VARCHAR(10),
    ciudad VARCHAR(100),
    rol ENUM('cliente', 'repartidor', 'admin') DEFAULT 'cliente',
    avatar VARCHAR(255),
    activo TINYINT(1) DEFAULT 1,
    email_verificado TINYINT(1) DEFAULT 0,
    estado ENUM('activo', 'inactivo', 'eliminado') DEFAULT 'activo',
    hash_anonimizacion VARCHAR(64),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_rol (rol),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: consentimientos (per auth.ts)
-- =====================================================
CREATE TABLE consentimientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    acepta_terminos TINYINT(1) DEFAULT 0,
    acepta_privacidad TINYINT(1) DEFAULT 0,
    acepta_cookies TINYINT(1) DEFAULT 0,
    acepta_comunicaciones TINYINT(1) DEFAULT 0,
    compartir_datos TINYINT(1) DEFAULT 0,
    analytics TINYINT(1) DEFAULT 0,
    fecha_consentimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_consentimiento VARCHAR(45),
    user_agent TEXT,
    version_terminos VARCHAR(20),
    version_privacidad VARCHAR(20),
    fecha_actualizacion TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: consentimientos_auditoria
-- =====================================================
CREATE TABLE consentimientos_auditoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo_cambio VARCHAR(50) NOT NULL,
    valor_anterior JSON,
    valor_nuevo JSON,
    ip VARCHAR(45),
    user_agent TEXT,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: empresas
-- =====================================================
CREATE TABLE empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    logo VARCHAR(255),
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(255),
    categoria ENUM('frutas', 'verduras', 'carnes', 'pescados', 'lacteos', 'panaderia', 'otros') DEFAULT 'otros',
    valoracion_media DECIMAL(3,2) DEFAULT 5.00,
    activo TINYINT(1) DEFAULT 1,
    fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_categoria (categoria),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: categorias
-- =====================================================
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    imagen VARCHAR(255),
    icono VARCHAR(50),
    orden INT DEFAULT 0,
    activa TINYINT(1) DEFAULT 1,
    categoria_padre_id INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_padre_id) REFERENCES categorias(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_orden (orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: productos
-- =====================================================
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    precio_oferta DECIMAL(10,2),
    unidad VARCHAR(50) DEFAULT 'unitat',
    stock INT DEFAULT 100,
    imagen VARCHAR(255),
    categoria VARCHAR(100),
    destacado TINYINT(1) DEFAULT 0,
    activo TINYINT(1) DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    INDEX idx_empresa (empresa_id),
    INDEX idx_categoria (categoria),
    INDEX idx_activo (activo),
    INDEX idx_destacado (destacado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: carrito
-- =====================================================
CREATE TABLE carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_producto (usuario_id, producto_id),
    INDEX idx_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: repartidores
-- =====================================================
CREATE TABLE repartidores (
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
    fecha_actualizacion TIMESTAMP NULL,
    ultima_ubicacion_lat DECIMAL(10,8),
    ultima_ubicacion_lng DECIMAL(11,8),
    ultima_actualizacion TIMESTAMP NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_disponible (disponible),
    INDEX idx_zona (zona_preferida)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: pedidos
-- =====================================================
CREATE TABLE pedidos (
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
    FOREIGN KEY (repartidor_id) REFERENCES repartidores(id) ON DELETE SET NULL,
    INDEX idx_cliente (cliente_id),
    INDEX idx_repartidor (repartidor_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha (fecha_pedido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: detalle_pedido
-- =====================================================
CREATE TABLE detalle_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    notas TEXT,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    CONSTRAINT detalle_pedido_chk_1 CHECK (cantidad > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: entregues
-- =====================================================
CREATE TABLE entregues (
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
    FOREIGN KEY (repartidor_id) REFERENCES repartidores(id) ON DELETE SET NULL,
    INDEX idx_repartidor (repartidor_id),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: ruta_actual
-- =====================================================
CREATE TABLE ruta_actual (
    id INT AUTO_INCREMENT PRIMARY KEY,
    repartidor_id INT NOT NULL,
    entrega_id INT NOT NULL,
    orden INT NOT NULL DEFAULT 1,
    distancia_km DECIMAL(10,2),
    tiempo_estimado_min INT,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (repartidor_id) REFERENCES repartidores(id) ON DELETE CASCADE,
    FOREIGN KEY (entrega_id) REFERENCES entregues(id) ON DELETE CASCADE,
    UNIQUE KEY unique_repartidor_entrega (repartidor_id, entrega_id),
    INDEX idx_repartidor (repartidor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: historial_entregues
-- =====================================================
CREATE TABLE historial_entregues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entrega_id INT NOT NULL,
    repartidor_id INT NOT NULL,
    estado ENUM('entregado', 'fallido') NOT NULL,
    fecha_entrega TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notas TEXT,
    valoracion_cliente INT,
    comentario_cliente TEXT,
    FOREIGN KEY (entrega_id) REFERENCES entregues(id) ON DELETE CASCADE,
    FOREIGN KEY (repartidor_id) REFERENCES repartidores(id) ON DELETE CASCADE,
    INDEX idx_repartidor (repartidor_id),
    INDEX idx_fecha (fecha_entrega)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: horarios_repartidor
-- =====================================================
CREATE TABLE horarios_repartidor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    repartidor_id INT NOT NULL,
    dia_semana ENUM('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo') NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    activo TINYINT(1) DEFAULT 1,
    FOREIGN KEY (repartidor_id) REFERENCES repartidores(id) ON DELETE CASCADE,
    UNIQUE KEY unique_repartidor_dia (repartidor_id, dia_semana)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: incidencias
-- =====================================================
CREATE TABLE incidencias (
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
    FOREIGN KEY (repartidor_id) REFERENCES repartidores(id) ON DELETE SET NULL,
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- BASE DE DADES DATA BROKER
-- =====================================================
CREATE DATABASE IF NOT EXISTS freshexpress_databroker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON freshexpress_databroker.* TO 'freshexpress'@'%';
ALTER USER 'freshexpress'@'%' REQUIRE SSL;
USE freshexpress_databroker;

-- =====================================================
-- TAULA: clientes_data_broker
-- =====================================================
CREATE TABLE clientes_data_broker (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_empresa VARCHAR(255) NOT NULL,
    cif VARCHAR(20),
    email_contacto VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    tipo ENUM('anunciante', 'analista', 'investigador', 'otro') DEFAULT 'otro',
    api_key VARCHAR(64) UNIQUE,
    api_secret VARCHAR(255),
    activo TINYINT(1) DEFAULT 1,
    credito_disponible DECIMAL(10,2) DEFAULT 0,
    limite_peticiones_dia INT DEFAULT 1000,
    limite_peticiones_mes INT DEFAULT 30000,
    datos_permitidos JSON,
    fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_ultimo_acceso TIMESTAMP NULL,
    INDEX idx_api_key (api_key),
    INDEX idx_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: datos_anonimos
-- =====================================================
CREATE TABLE datos_anonimos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hash_usuario VARCHAR(64) NOT NULL,
    rango_edad VARCHAR(20),
    genero ENUM('masculino', 'femenino', 'otro', 'no_especificado') DEFAULT 'no_especificado',
    codigo_postal_prefijo VARCHAR(5),
    segmento_comportamiento VARCHAR(50),
    frecuencia_compra ENUM('muy_baja', 'baja', 'media', 'alta', 'muy_alta') DEFAULT 'media',
    ticket_medio_rango VARCHAR(30),
    categorias_preferidas JSON,
    horarios_compra JSON,
    nivel_compromiso_eco ENUM('bajo', 'medio', 'alto') DEFAULT 'medio',
    preferencias_pago JSON,
    fecha_primera_compra DATE,
    fecha_ultima_compra DATE,
    total_pedidos INT DEFAULT 0,
    total_gastado_rango VARCHAR(30),
    productos_favoritos JSON,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_hash (hash_usuario),
    INDEX idx_segmento (segmento_comportamiento),
    INDEX idx_nivel_eco (nivel_compromiso_eco)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: eventos_web
-- =====================================================
CREATE TABLE eventos_web (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sesion_id VARCHAR(100) NOT NULL,
    usuario_id INT,
    tipo_evento VARCHAR(50) NOT NULL,
    elemento VARCHAR(255),
    categoria_evento VARCHAR(50),
    datos_evento JSON,
    url_actual VARCHAR(500),
    url_referrer VARCHAR(500),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    dispositivo VARCHAR(20),
    navegador VARCHAR(50),
    sistema_operativo VARCHAR(50),
    resolucion_pantalla VARCHAR(20),
    pais VARCHAR(5),
    region VARCHAR(100),
    ciudad VARCHAR(100),
    fecha_evento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tiempo_en_pagina INT,
    INDEX idx_sesion (sesion_id),
    INDEX idx_tipo (tipo_evento),
    INDEX idx_fecha_evento (fecha_evento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: sesiones_web
-- =====================================================
CREATE TABLE sesiones_web (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sesion_id VARCHAR(100) NOT NULL UNIQUE,
    usuario_id INT,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP NULL,
    duracion_segundos INT DEFAULT 0,
    paginas_vistas INT DEFAULT 0,
    eventos_totales INT DEFAULT 0,
    clics_totales INT DEFAULT 0,
    scrolls_totales INT DEFAULT 0,
    formularios_enviados INT DEFAULT 0,
    errores_javascript INT DEFAULT 0,
    productos_vistos INT DEFAULT 0,
    productos_carrito INT DEFAULT 0,
    dispositivo VARCHAR(20),
    pais VARCHAR(5),
    ciudad VARCHAR(100),
    fuente_trafico VARCHAR(50),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    es_nueva_sesion TINYINT(1) DEFAULT 1,
    es_rebote TINYINT(1) DEFAULT 0,
    conversion TINYINT(1) DEFAULT 0,
    landing_page VARCHAR(500),
    exit_page VARCHAR(500),
    valor_conversion DECIMAL(10,2) DEFAULT 0,
    es_usuario_registrado TINYINT(1) DEFAULT 0,
    INDEX idx_sesion (sesion_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_fecha_inicio (fecha_inicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: metricas_diarias
-- =====================================================
CREATE TABLE metricas_diarias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL UNIQUE,
    visitas_totales INT DEFAULT 0,
    visitantes_unicos INT DEFAULT 0,
    sesiones_totales INT DEFAULT 0,
    usuarios_registrados INT DEFAULT 0,
    usuarios_nuevos INT DEFAULT 0,
    pedidos_totales INT DEFAULT 0,
    ingresos_totales DECIMAL(12,2) DEFAULT 0,
    ticket_medio DECIMAL(10,2) DEFAULT 0,
    tasa_conversion DECIMAL(5,2) DEFAULT 0,
    tasa_rebote DECIMAL(5,2) DEFAULT 0,
    tiempo_medio_sesion INT DEFAULT 0,
    paginas_por_sesion DECIMAL(5,2) DEFAULT 0,
    productos_mas_vistos JSON,
    categorias_mas_populares JSON,
    horas_pico JSON,
    INDEX idx_fecha (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: productos_anonimos
-- =====================================================
CREATE TABLE productos_anonimos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hash_producto VARCHAR(64) NOT NULL,
    categoria VARCHAR(100),
    subcategoria VARCHAR(100),
    rango_precio VARCHAR(30),
    es_ecologico TINYINT(1) DEFAULT 0,
    es_local TINYINT(1) DEFAULT 0,
    veces_visto INT DEFAULT 0,
    veces_carrito INT DEFAULT 0,
    veces_comprado INT DEFAULT 0,
    valoracion_media DECIMAL(3,2),
    eco_score INT,
    temporada VARCHAR(20),
    fecha_primera_venta DATE,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_hash (hash_producto),
    INDEX idx_categoria (categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: comportamiento_compras_anonimo
-- =====================================================
CREATE TABLE comportamiento_compras_anonimo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hash_usuario VARCHAR(64) NOT NULL,
    hash_producto VARCHAR(64) NOT NULL,
    periodo CHAR(7) NOT NULL,
    veces_visto INT DEFAULT 0,
    veces_carrito INT DEFAULT 0,
    veces_comprado INT DEFAULT 0,
    ultima_interaccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_hash_usuario (hash_usuario),
    INDEX idx_hash_producto (hash_producto),
    INDEX idx_periodo (periodo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: tendencias_mercado
-- =====================================================
CREATE TABLE tendencias_mercado (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria VARCHAR(100) NOT NULL,
    periodo CHAR(7) NOT NULL,
    volumen_ventas INT DEFAULT 0,
    ingresos_totales DECIMAL(12,2) DEFAULT 0,
    productos_unicos INT DEFAULT 0,
    compradores_unicos INT DEFAULT 0,
    ticket_medio DECIMAL(10,2) DEFAULT 0,
    crecimiento_vs_anterior DECIMAL(5,2),
    productos_tendencia JSON,
    fecha_calculo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_categoria (categoria),
    INDEX idx_periodo (periodo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: heatmaps_data
-- =====================================================
CREATE TABLE heatmaps_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pagina VARCHAR(255) NOT NULL,
    fecha DATE NOT NULL,
    tipo ENUM('click', 'scroll', 'move') DEFAULT 'click',
    datos_agregados JSON,
    total_interacciones INT DEFAULT 0,
    INDEX idx_pagina (pagina),
    INDEX idx_fecha (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: funnels_marketing
-- =====================================================
CREATE TABLE funnels_marketing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_funnel VARCHAR(100) NOT NULL,
    fecha DATE NOT NULL,
    paso_1_visitas INT DEFAULT 0,
    paso_2_producto INT DEFAULT 0,
    paso_3_carrito INT DEFAULT 0,
    paso_4_checkout INT DEFAULT 0,
    paso_5_compra INT DEFAULT 0,
    tasa_1_2 DECIMAL(5,2),
    tasa_2_3 DECIMAL(5,2),
    tasa_3_4 DECIMAL(5,2),
    tasa_4_5 DECIMAL(5,2),
    tasa_global DECIMAL(5,2),
    INDEX idx_funnel (nombre_funnel),
    INDEX idx_fecha (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: ventas_datos
-- =====================================================
CREATE TABLE ventas_datos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    tipo_datos ENUM('demograficos', 'comportamiento', 'tendencias', 'completo') NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    filtros_aplicados JSON,
    registros_incluidos INT DEFAULT 0,
    precio_unitario DECIMAL(10,4) DEFAULT 0,
    precio_total DECIMAL(10,2) DEFAULT 0,
    formato_entrega ENUM('json', 'csv', 'api') DEFAULT 'json',
    estado ENUM('pendiente', 'procesando', 'completado', 'fallido') DEFAULT 'pendiente',
    hash_datos VARCHAR(64),
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega TIMESTAMP NULL,
    url_descarga VARCHAR(500),
    FOREIGN KEY (cliente_id) REFERENCES clientes_data_broker(id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: auditoria_acceso_datos
-- =====================================================
CREATE TABLE auditoria_acceso_datos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    metodo VARCHAR(10) NOT NULL,
    parametros JSON,
    registros_accedidos INT DEFAULT 0,
    coste DECIMAL(10,4) DEFAULT 0,
    ip_origen VARCHAR(45),
    user_agent TEXT,
    respuesta_codigo INT,
    tiempo_respuesta_ms INT,
    fecha_acceso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes_data_broker(id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_fecha (fecha_acceso)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: api_rate_limits
-- =====================================================
CREATE TABLE api_rate_limits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    fecha DATE NOT NULL,
    peticiones_realizadas INT DEFAULT 0,
    peticiones_limite INT DEFAULT 1000,
    ultima_peticion TIMESTAMP NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes_data_broker(id),
    UNIQUE KEY unique_cliente_fecha (cliente_id, fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: informes_generados
-- =====================================================
CREATE TABLE informes_generados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    cliente_id INT NOT NULL,
    tipo_informe VARCHAR(50) NOT NULL,
    hash_archivo VARCHAR(64),
    tamano_bytes BIGINT,
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP NULL,
    descargado TINYINT(1) DEFAULT 0,
    FOREIGN KEY (venta_id) REFERENCES ventas_datos(id),
    FOREIGN KEY (cliente_id) REFERENCES clientes_data_broker(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: alertas_uso_datos
-- =====================================================
CREATE TABLE alertas_uso_datos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    tipo_alerta ENUM('limite_peticiones', 'uso_anomalo', 'credito_bajo', 'expiracion_datos') NOT NULL,
    mensaje TEXT NOT NULL,
    severidad ENUM('info', 'warning', 'critical') DEFAULT 'info',
    leida TINYINT(1) DEFAULT 0,
    fecha_alerta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes_data_broker(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: webhooks_configurados
-- =====================================================
CREATE TABLE webhooks_configurados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    url_webhook VARCHAR(500) NOT NULL,
    eventos JSON,
    activo TINYINT(1) DEFAULT 1,
    secret_key VARCHAR(64),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes_data_broker(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: cache_consultas
-- =====================================================
CREATE TABLE cache_consultas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hash_consulta VARCHAR(64) NOT NULL UNIQUE,
    resultado JSON,
    registros INT DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP NOT NULL,
    accesos INT DEFAULT 0,
    INDEX idx_hash (hash_consulta),
    INDEX idx_expiracion (fecha_expiracion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TAULA: logs_sincronizacion
-- =====================================================
CREATE TABLE logs_sincronizacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    origen VARCHAR(50) NOT NULL,
    tipo_dato VARCHAR(50) NOT NULL,
    registros_procesados INT DEFAULT 0,
    registros_nuevos INT DEFAULT 0,
    registros_actualizados INT DEFAULT 0,
    estado ENUM('iniciado', 'completado', 'fallido') DEFAULT 'iniciado',
    mensaje_error TEXT,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP NULL,
    INDEX idx_origen (origen),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- STORED PROCEDURES
-- =====================================================

DELIMITER ;;

CREATE PROCEDURE sp_actualizar_heatmaps()
BEGIN
    DECLARE v_fecha_ayer DATE;
    SET v_fecha_ayer = DATE_SUB(CURDATE(), INTERVAL 1 DAY);
END ;;

CREATE PROCEDURE sp_generar_tendencias_diarias()
BEGIN
    DECLARE v_fecha_ayer DATE;
    SET v_fecha_ayer = DATE_SUB(CURDATE(), INTERVAL 1 DAY);
END ;;

CREATE PROCEDURE sp_limpiar_datos_antiguos()
BEGIN
    DELETE FROM eventos_web WHERE fecha_evento < DATE_SUB(NOW(), INTERVAL 2 YEAR);
    DELETE FROM sesiones_web WHERE fecha_inicio < DATE_SUB(NOW(), INTERVAL 2 YEAR);
    DELETE FROM cache_consultas WHERE fecha_expiracion < NOW();
END ;;

CREATE PROCEDURE sp_detectar_uso_anomalo()
BEGIN
    SELECT 1;
END ;;

CREATE PROCEDURE sp_calcular_comportamiento_compra(
    IN p_hash_usuario VARCHAR(64),
    IN p_hash_producto VARCHAR(64),
    IN p_tipo_interaccion VARCHAR(20),
    IN p_es_eco BOOLEAN
)
BEGIN
    DECLARE v_periodo CHAR(7);
    SET v_periodo = DATE_FORMAT(NOW(), '%Y-%m');
    
    INSERT INTO comportamiento_compras_anonimo 
        (hash_usuario, hash_producto, periodo, veces_visto, veces_carrito, veces_comprado)
    VALUES 
        (p_hash_usuario, p_hash_producto, v_periodo,
         IF(p_tipo_interaccion = 'vista', 1, 0),
         IF(p_tipo_interaccion = 'carrito', 1, 0),
         IF(p_tipo_interaccion = 'compra', 1, 0))
    ON DUPLICATE KEY UPDATE
        veces_visto = veces_visto + IF(p_tipo_interaccion = 'vista', 1, 0),
        veces_carrito = veces_carrito + IF(p_tipo_interaccion = 'carrito', 1, 0),
        veces_comprado = veces_comprado + IF(p_tipo_interaccion = 'compra', 1, 0),
        ultima_interaccion = NOW();
END ;;

CREATE PROCEDURE sp_sincronizar_datos_anonimos()
BEGIN
    SELECT 1;
END ;;

CREATE PROCEDURE sp_generar_informe(
    IN p_venta_id INT,
    IN p_tipo VARCHAR(50),
    IN p_filtros JSON
)
BEGIN
    DECLARE v_cliente_id INT;
    DECLARE v_hash_archivo VARCHAR(64);
    
    SELECT cliente_id INTO v_cliente_id FROM ventas_datos WHERE id = p_venta_id;
    SET v_hash_archivo = SHA2(CONCAT(p_venta_id, NOW(), RAND()), 256);
    
    INSERT INTO informes_generados (venta_id, cliente_id, tipo_informe, hash_archivo)
    VALUES (p_venta_id, v_cliente_id, p_tipo, v_hash_archivo);
    
    SELECT LAST_INSERT_ID() as informe_id, v_hash_archivo as hash;
END ;;

DELIMITER ;


-- =====================================================
-- TORNAR A freshexpress_operacional PER INSERIR DADES
-- =====================================================
USE freshexpress_operacional;

-- =====================================================
-- DADES DE PROVA: Empreses
-- =====================================================
INSERT INTO empresas (nombre, descripcion, categoria) VALUES 
('Fruites Can Pep', 'Les millors fruites fresques de la comarca', 'frutas'),
('Verdures La Masia', 'Verdures ecològiques i de proximitat', 'verduras'),
('Carnisseria El Bou', 'Carns de primera qualitat', 'carnes'),
('Peixateria Mar Blau', 'Peix fresc del dia', 'pescados'),
('Lactis La Granja', 'Productes lactis artesanals', 'lacteos'),
('Forn de Pa El Molí', 'Pa artesà i pastisseria tradicional', 'panaderia');

-- =====================================================
-- DADES DE PROVA: Productes (58 productes)
-- =====================================================
INSERT INTO productos (empresa_id, nombre, descripcion, precio, unidad, categoria, destacado) VALUES 
-- Fruites Can Pep (empresa_id = 1)
(1, 'Pomes Golden', 'Pomes dolces i cruixents', 2.50, 'kg', 'fruites', 1),
(1, 'Taronges de València', 'Taronges fresques i sucoses', 1.80, 'kg', 'fruites', 1),
(1, 'Plàtans de Canàries', 'Plàtans madurs i dolços', 2.20, 'kg', 'fruites', 0),
(1, 'Maduixes', 'Maduixes fresques de temporada', 4.50, 'safata', 'fruites', 1),
(1, 'Kiwis', 'Kiwis verds i madurs', 3.80, 'kg', 'fruites', 0),
(1, 'Peres Conference', 'Peres dolces i aromàtiques', 2.90, 'kg', 'fruites', 0),
(1, 'Raïm negre', 'Raïm negre sense llavors', 3.50, 'kg', 'fruites', 0),
(1, 'Meló', 'Meló dolç de temporada', 1.90, 'unitat', 'fruites', 1),
(1, 'Síndria', 'Síndria fresca i dolça', 0.90, 'kg', 'fruites', 1),
(1, 'Mangos', 'Mangos madurs importats', 3.20, 'unitat', 'fruites', 0),

-- Verdures La Masia (empresa_id = 2)
(2, 'Tomàquets de penjar', 'Tomàquets ecològics de proximitat', 3.20, 'kg', 'verdures', 1),
(2, 'Enciams', 'Enciams frescos i cruixents', 1.20, 'unitat', 'verdures', 0),
(2, 'Cebes', 'Cebes dolces de Figueres', 1.50, 'kg', 'verdures', 0),
(2, 'Alls', 'Alls de la terra', 0.80, 'cabeça', 'verdures', 0),
(2, 'Patates', 'Patates per fregir o bullir', 1.30, 'kg', 'verdures', 1),
(2, 'Pastanagues', 'Pastanagues ecològiques', 1.80, 'kg', 'verdures', 0),
(2, 'Carabasses', 'Carabasses fresques', 1.60, 'kg', 'verdures', 0),
(2, 'Albergínies', 'Albergínies fresques', 2.40, 'kg', 'verdures', 0),
(2, 'Pebrots vermells', 'Pebrots vermells carnosos', 3.50, 'kg', 'verdures', 1),
(2, 'Carbassons', 'Carbassons tendres', 2.10, 'kg', 'verdures', 0),
(2, 'Espinacs frescos', 'Espinacs de fulla gran', 2.80, 'manat', 'verdures', 0),
(2, 'Bròquil', 'Bròquil fresc i verd', 2.20, 'unitat', 'verdures', 1),

-- Carnisseria El Bou (empresa_id = 3)
(3, 'Filet de vedella', 'Filet de vedella tendre', 24.90, 'kg', 'carns', 1),
(3, 'Costelles de porc', 'Costelles de porc ibèric', 8.90, 'kg', 'carns', 0),
(3, 'Pit de pollastre', 'Pit de pollastre de pagès', 7.50, 'kg', 'carns', 1),
(3, 'Cuixes de pollastre', 'Cuixes de pollastre fresques', 5.90, 'kg', 'carns', 0),
(3, 'Hamburgueses casolanes', 'Hamburgueses fetes a mà', 9.90, 'safata', 'carns', 1),
(3, 'Llom de porc', 'Llom de porc per fer a filets', 10.50, 'kg', 'carns', 0),
(3, 'Botifarra fresca', 'Botifarra tradicional catalana', 8.20, 'kg', 'carns', 1),
(3, 'Xoriço ibèric', 'Xoriço ibèric curat', 18.90, 'kg', 'carns', 0),
(3, 'Pernil dolç', 'Pernil dolç en llesques', 15.90, 'kg', 'carns', 0),
(3, 'Carn picada mixta', 'Barreja vedella i porc', 9.50, 'kg', 'carns', 1),

-- Peixateria Mar Blau (empresa_id = 4)
(4, 'Salmó fresc', 'Filets de salmó noruec', 18.90, 'kg', 'peixos', 1),
(4, 'Gambes blanques', 'Gambes blanques de Huelva', 22.50, 'kg', 'peixos', 1),
(4, 'Llobarro', 'Llobarro salvatge', 16.90, 'kg', 'peixos', 0),
(4, 'Musclos', 'Musclos del Delta', 4.50, 'kg', 'peixos', 0),
(4, 'Cloïsses', 'Cloïsses fresques', 12.90, 'kg', 'peixos', 0),
(4, 'Tonyina fresca', 'Tonyina d’aleta groga', 24.90, 'kg', 'peixos', 1),
(4, 'Sardines', 'Sardines del Mediterrani', 6.90, 'kg', 'peixos', 0),
(4, 'Calamars', 'Calamars petits i tendres', 14.50, 'kg', 'peixos', 1),
(4, 'Rap', 'Cua de rap', 19.90, 'kg', 'peixos', 0),
(4, 'Bacallà dessalat', 'Bacallà dessalat en lloms', 16.50, 'kg', 'peixos', 0),

-- Lactis La Granja (empresa_id = 5)
(5, 'Llet fresca', 'Llet fresca sencera', 1.40, 'litre', 'lactis', 1),
(5, 'Iogurt natural', 'Iogurt natural artesà', 0.80, 'unitat', 'lactis', 0),
(5, 'Formatge fresc', 'Formatge fresc de cabra', 6.90, 'unitat', 'lactis', 1),
(5, 'Formatge curat', 'Formatge curat d’ovella', 14.90, 'kg', 'lactis', 1),
(5, 'Mantega', 'Mantega de vaca', 3.50, 'unitat', 'lactis', 0),
(5, 'Nata per cuinar', 'Nata fresca 35% MG', 2.20, 'brick', 'lactis', 0),
(5, 'Mató', 'Mató tradicional català', 4.50, 'unitat', 'lactis', 1),
(5, 'Ous de pagès', 'Ous de gallines criades en llibertat', 3.20, 'dotzena', 'lactis', 1),

-- Forn de Pa El Moli (empresa_id = 6)
(6, 'Pa de pagès', 'Pa artesà de massa mare', 2.80, 'unitat', 'pa', 1),
(6, 'Baguette', 'Baguette cruixent', 1.20, 'unitat', 'pa', 0),
(6, 'Pa integral', 'Pa integral amb llavors', 3.20, 'unitat', 'pa', 1),
(6, 'Croissants', 'Croissants de mantega', 1.50, 'unitat', 'pa', 1),
(6, 'Ensaimades', 'Ensaimades mallorquines', 2.50, 'unitat', 'pa', 0),
(6, 'Coca de vidre', 'Coca tradicional amb sucre', 3.80, 'unitat', 'pa', 1),
(6, 'Pa de motlle', 'Pa de motlle sense crosta', 2.40, 'unitat', 'pa', 0),
(6, 'Magdalenes', 'Magdalenes casolanes', 0.60, 'unitat', 'pa', 0);

-- =====================================================
-- FI DE L'SCRIPT
-- =====================================================
SELECT '========================================' AS '';
SELECT 'Base de dades FreshExpress creada!' AS resultat;
SELECT '========================================' AS '';
SELECT CONCAT('Usuaris: ', COUNT(*)) AS resum FROM usuarios;
SELECT CONCAT('Empreses: ', COUNT(*)) AS resum FROM empresas;
SELECT CONCAT('Productes: ', COUNT(*)) AS resum FROM productos;
SELECT CONCAT('Entregues: ', COUNT(*)) AS resum FROM entregues;
