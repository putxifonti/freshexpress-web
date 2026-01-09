-- Script per eliminar completament "Rebre Ofertes" del sistema
-- =====================================================

USE sbid_operacional;

-- 1. Eliminar columna de la taula consentimientos
ALTER TABLE consentimientos 
DROP COLUMN IF EXISTS recibir_ofertas;

-- 2. Verificar que s'ha eliminat
SHOW COLUMNS FROM consentimientos;

-- 3. Mostrar consentiments restants
SELECT 
    'Estructura final de consentimientos' as info;
    
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    COLUMN_DEFAULT,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'sbid_operacional' 
  AND TABLE_NAME = 'consentimientos'
ORDER BY ORDINAL_POSITION;
