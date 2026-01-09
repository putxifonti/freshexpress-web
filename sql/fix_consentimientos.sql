-- Script per assegurar que tots els usuaris tenen un registre de consentiments
-- =====================================================

USE sbid_operacional;

-- Crear consentiments per usuaris que no en tenen
INSERT INTO consentimientos (
    usuario_id, 
    acepta_terminos, 
    acepta_privacidad, 
    acepta_cookies,
    acepta_comunicaciones, 
    compartir_datos, 
    analytics,
    fecha_consentimiento
)
SELECT 
    u.id,
    1, -- acepta_terminos (per defecte sí, ja que estan registrats)
    1, -- acepta_privacidad
    1, -- acepta_cookies
    0, -- acepta_comunicaciones
    0, -- compartir_datos
    1, -- analytics (activat per defecte per tracking)
    u.fecha_registro
FROM usuarios u
WHERE NOT EXISTS (
    SELECT 1 FROM consentimientos c WHERE c.usuario_id = u.id
)
AND u.estado = 'activo';

-- Verificar resultat
SELECT 
    'Total usuaris' as tipus,
    COUNT(*) as total
FROM usuarios
WHERE estado = 'activo'
UNION ALL
SELECT 
    'Usuaris amb consentiments' as tipus,
    COUNT(DISTINCT usuario_id) as total
FROM consentimientos;

-- Mostrar usuaris sense consentiments (hauria de ser 0)
SELECT 
    u.id,
    u.nombre,
    u.email,
    u.rol
FROM usuarios u
LEFT JOIN consentimientos c ON u.id = c.usuario_id
WHERE c.id IS NULL
AND u.estado = 'activo';
