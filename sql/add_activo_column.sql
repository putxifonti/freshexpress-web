-- =====================================================
-- Script SQL per afegir columna 'activo' a repartidores
-- Executar a la base de dades: freshexpress_operacional
-- =====================================================

USE freshexpress_operacional;

-- Comprovar si la columna ja existeix abans d'afegir-la
SET @col_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'freshexpress_operacional' 
    AND TABLE_NAME = 'repartidores' 
    AND COLUMN_NAME = 'activo'
);

-- Afegir columna activo només si no existeix
SET @sql = IF(@col_exists = 0,
    'ALTER TABLE repartidores ADD COLUMN activo TINYINT(1) DEFAULT 1 COMMENT "Indica si el repartidor està actiu (1) o ha deixat el rol (0)"',
    'SELECT "La columna activo ja existeix" AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Marcar tots els repartidors existents com a actius
UPDATE repartidores SET activo = 1 WHERE activo IS NULL;

-- Crear índex per millorar el rendiment de les consultes
-- Comprovar si l'índex ja existeix
SET @index_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'freshexpress_operacional' 
    AND TABLE_NAME = 'repartidores' 
    AND INDEX_NAME = 'idx_activo'
);

SET @sql_index = IF(@index_exists = 0,
    'CREATE INDEX idx_activo ON repartidores(activo)',
    'SELECT "L\'índex idx_activo ja existeix" AS message'
);

PREPARE stmt_index FROM @sql_index;
EXECUTE stmt_index;
DEALLOCATE PREPARE stmt_index;

-- Verificar l'actualització
SELECT 
    COUNT(*) as total_repartidors,
    SUM(CASE WHEN activo = 1 THEN 1 ELSE 0 END) as actius,
    SUM(CASE WHEN activo = 0 THEN 1 ELSE 0 END) as inactius
FROM repartidores;
