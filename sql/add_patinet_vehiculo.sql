-- =====================================================
-- Script SQL per afegir 'patinet' com a tipus de vehicle
-- Executar a la base de dades: freshexpress_operacional
-- =====================================================

USE freshexpress_operacional;

-- Modificar l'ENUM per afegir 'patinet' com a opció
ALTER TABLE repartidores 
MODIFY COLUMN vehiculo_tipo ENUM('bicicleta', 'patinet', 'moto', 'coche', 'furgoneta', 'a_pie') DEFAULT 'bicicleta';

-- Verificar el canvi
DESCRIBE repartidores;

-- Mostrar els tipus de vehicle actuals
SELECT vehiculo_tipo, COUNT(*) as total 
FROM repartidores 
GROUP BY vehiculo_tipo;
