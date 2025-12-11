-- =====================================================
-- Script de verificació i reparació de consentiments
-- Executar a: freshexpress_operacional
-- =====================================================

USE freshexpress_operacional;

-- Verificar estructura de la taula consentimientos
DESCRIBE consentimientos;

-- Veure tots els consentiments
SELECT * FROM consentimientos;

-- Veure usuaris amb els seus consentiments
SELECT 
    u.id,
    u.email,
    u.nombre,
    c.consentimiento_data_broker,
    c.consentimiento_marketing,
    c.consentimiento_newsletter
FROM usuarios u
LEFT JOIN consentimientos c ON u.id = c.usuario_id;

-- Comptar usuaris amb data broker actiu
SELECT 
    COUNT(*) as total_data_broker 
FROM consentimientos 
WHERE consentimiento_data_broker = 1;

-- Si hi ha usuaris sense consentiments, els podem crear
-- (només si la taula està buida per als usuaris existents)
INSERT IGNORE INTO consentimientos (usuario_id, consentimiento_data_broker, consentimiento_newsletter, consentimiento_marketing, consentimiento_analitica)
SELECT id, 0, 0, 0, 1 FROM usuarios WHERE id NOT IN (SELECT usuario_id FROM consentimientos);
