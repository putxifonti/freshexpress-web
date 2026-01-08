-- =====================================================
-- Script SQL per afegir columna 'activo' a repartidores
-- Executar a la base de dades: freshexpress_operacional
-- =====================================================

USE freshexpress_operacional;

-- Afegir columna activo per mantenir historial de repartidors
-- activo = 1: repartidor actiu
-- activo = 0: repartidor que ha deixat el rol (marcat com a inactiu)
ALTER TABLE repartidores 
ADD COLUMN IF NOT EXISTS activo TINYINT(1) DEFAULT 1 
COMMENT 'Indica si el repartidor està actiu (1) o ha deixat el rol (0)';

-- Marcar tots els repartidors existents com a actius
UPDATE repartidores SET activo = 1 WHERE activo IS NULL;

-- Crear índex per millorar el rendiment de les consultes
CREATE INDEX IF NOT EXISTS idx_activo ON repartidores(activo);

-- Verificar l'actualització
SELECT 
    COUNT(*) as total_repartidors,
    SUM(CASE WHEN activo = 1 THEN 1 ELSE 0 END) as actius,
    SUM(CASE WHEN activo = 0 THEN 1 ELSE 0 END) as inactius
FROM repartidores;
