-- =====================================================
-- Script SQL per actualitzar imatges de productes i empreses
-- Executar a: freshexpress_operacional
-- =====================================================

USE freshexpress_operacional;

-- =====================================================
-- DESACTIVAR SAFE UPDATE MODE TEMPORALMENT
-- =====================================================
SET SQL_SAFE_UPDATES = 0;

-- =====================================================
-- ACTUALITZAR LOGOS D'EMPRESES (canviar .png a .svg)
-- =====================================================

-- Actualitzar a logos SVG existents (usant id per evitar l'error)
UPDATE empresas SET logo = '/img/empresas/mercadona.svg' WHERE id > 0 AND nombre LIKE '%Mercadona%';
UPDATE empresas SET logo = '/img/empresas/bonpreu.svg' WHERE id > 0 AND nombre LIKE '%Bonpreu%';
UPDATE empresas SET logo = '/img/empresas/veritas.svg' WHERE id > 0 AND nombre LIKE '%Veritas%';

-- Assignar logos genèrics per categoria si no tenen
UPDATE empresas SET logo = '/img/empresas/fruites-can-pep.svg' 
WHERE id > 0 AND (logo IS NULL OR logo = '') AND (categoria LIKE '%fruita%' OR categoria LIKE '%verdura%' OR categoria = 'frutas' OR categoria = 'verduras');

UPDATE empresas SET logo = '/img/empresas/carnisseria-el-bou.svg' 
WHERE id > 0 AND (logo IS NULL OR logo = '') AND (categoria LIKE '%carn%' OR categoria LIKE '%embotit%' OR categoria = 'carnes');

UPDATE empresas SET logo = '/img/empresas/peixateria-mar-blau.svg' 
WHERE id > 0 AND (logo IS NULL OR logo = '') AND (categoria LIKE '%peix%' OR categoria LIKE '%marisc%' OR categoria = 'pescados');

UPDATE empresas SET logo = '/img/empresas/forn-de-pa-el-moli.svg' 
WHERE id > 0 AND (logo IS NULL OR logo = '') AND (categoria LIKE '%forn%' OR categoria LIKE '%pa%' OR categoria LIKE '%pastis%' OR categoria = 'panaderia');

UPDATE empresas SET logo = '/img/empresas/lactis-la-granja.svg' 
WHERE id > 0 AND (logo IS NULL OR logo = '') AND (categoria LIKE '%lacti%' OR categoria LIKE '%granja%' OR categoria = 'lacteos');

UPDATE empresas SET logo = '/img/empresas/verdures-la-masia.svg' 
WHERE id > 0 AND (logo IS NULL OR logo = '') AND categoria LIKE '%verdur%';

-- Placeholder per la resta que encara no tenen logo
UPDATE empresas SET logo = '/img/empresas/mercadona.svg' 
WHERE id > 0 AND (logo IS NULL OR logo = '' OR logo LIKE '%.png');

-- =====================================================
-- ACTUALITZAR IMATGES DE PRODUCTES
-- =====================================================

-- Assignar imatges de placeholder als productes sense imatge
UPDATE productos SET imagen = '/img/productos/placeholder.svg' 
WHERE id > 0 AND (imagen IS NULL OR imagen = '');

-- =====================================================
-- REACTIVAR SAFE UPDATE MODE
-- =====================================================
SET SQL_SAFE_UPDATES = 1;

-- =====================================================
-- VERIFICAR RESULTATS
-- =====================================================
SELECT 'Empreses amb logo' as tipus, COUNT(*) as total FROM empresas WHERE logo IS NOT NULL AND logo != '';
SELECT 'Productes amb imatge' as tipus, COUNT(*) as total FROM productos WHERE imagen IS NOT NULL AND imagen != '';

-- Mostrar empreses i els seus logos
SELECT id, nombre, categoria, logo FROM empresas ORDER BY nombre;

-- Mostrar productes sense imatge
SELECT id, nombre, imagen FROM productos WHERE imagen IS NULL OR imagen = '' LIMIT 20;
