USE freshexpress_operacional;
CREATE TABLE IF NOT EXISTS solicitudes_repartidor (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  vehiculo_tipo VARCHAR(50) NOT NULL,
  zona_preferida VARCHAR(100) NOT NULL,
  dni VARCHAR(20) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  disponibilitat VARCHAR(200),
  motivacio TEXT,
  estat ENUM('pendent', 'aprovada', 'rebutjada') DEFAULT 'pendent',
  motiu_rebuig TEXT,
  fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_resposta TIMESTAMP NULL,
  admin_id INT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS incidencias_entrega (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  repartidor_id INT NOT NULL,
  motiu VARCHAR(100) NOT NULL,
  notes TEXT,
  fecha_incidencia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS auth_rate_limits (
  rate_key CHAR(64) PRIMARY KEY,
  attempts INT NOT NULL,
  expires_at DATETIME NOT NULL,
  INDEX idx_expires_at (expires_at)
);
REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'freshexpress'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON freshexpress_operacional.* TO 'freshexpress'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON freshexpress_databroker.* TO 'freshexpress'@'%';
ALTER USER 'freshexpress'@'%' REQUIRE SSL;
