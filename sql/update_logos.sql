-- =====================================================
-- FreshExpress - Script per actualitzar logos d'empreses
-- Executar amb: mysql -u root -p < update_logos.sql
-- =====================================================

USE freshexpress_operacional;

-- Actualitzar logos per les empreses existents
-- Format: /img/empresas/nom-empresa.png o .svg

-- Opció 1: Si tens imatges específiques per cada empresa
UPDATE empresas SET logo = '/img/empresas/fruites-can-pep.svg' WHERE id = 1;
UPDATE empresas SET logo = '/img/empresas/verdures-la-masia.svg' WHERE id = 2;
UPDATE empresas SET logo = '/img/empresas/carnisseria-el-bou.svg' WHERE id = 3;
UPDATE empresas SET logo = '/img/empresas/peixateria-mar-blau.svg' WHERE id = 4;
UPDATE empresas SET logo = '/img/empresas/lactis-la-granja.svg' WHERE id = 5;
UPDATE empresas SET logo = '/img/empresas/forn-de-pa-el-moli.svg' WHERE id = 6;

-- Verificar
SELECT id, nombre, logo FROM empresas;
