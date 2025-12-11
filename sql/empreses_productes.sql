-- =====================================================
-- Script SQL per a FreshExpress - Empreses i Productes
-- Executar a la base de dades: freshexpress_operacional
-- =====================================================

USE freshexpress_operacional;

-- =====================================================
-- DESACTIVAR COMPROVACIÓ DE CLAUS FORANES
-- =====================================================
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- ESBORRAR TAULES SI EXISTEIXEN (per evitar conflictes)
-- =====================================================
DROP TABLE IF EXISTS carrito;
DROP TABLE IF EXISTS historico_productos;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS empresas;

-- =====================================================
-- REACTIVAR COMPROVACIÓ DE CLAUS FORANES
-- =====================================================
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- TAULA: empresas (proveïdors/botigues)
-- =====================================================
CREATE TABLE empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(50),
    logo_url VARCHAR(255),
    direccion VARCHAR(255),
    ciudad VARCHAR(100) DEFAULT 'Barcelona',
    codigo_postal VARCHAR(10),
    telefono VARCHAR(20),
    email VARCHAR(100),
    horario VARCHAR(100),
    activo TINYINT(1) DEFAULT 1,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TAULA: productos
-- =====================================================
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(50),
    precio DECIMAL(10,2) NOT NULL,
    precio_oferta DECIMAL(10,2),
    unidad VARCHAR(20) DEFAULT 'unitat',
    stock INT DEFAULT 100,
    imagen_url VARCHAR(255),
    eco TINYINT(1) DEFAULT 0,
    activo TINYINT(1) DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TAULA: carrito (cistella de la compra)
-- =====================================================
CREATE TABLE carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT DEFAULT 1,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (usuario_id, producto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- INSERIR EMPRESES DE CATALUNYA
-- =====================================================
INSERT INTO empresas (nombre, descripcion, categoria, logo_url, direccion, ciudad, codigo_postal, telefono, email, horario) VALUES

-- Supermercats i Alimentació
('Mercadona', 'Supermercat amb productes frescos i de qualitat al millor preu', 'Supermercat', '/img/empresas/mercadona.png', 'Av. Diagonal, 545', 'Barcelona', '08029', '900 500 103', 'clientes@mercadona.com', 'Dill-Diss 9:00-21:30'),

('Bonpreu', 'Supermercat català amb productes locals i de proximitat', 'Supermercat', '/img/empresas/bonpreu.png', 'C/ Gran Via, 123', 'Barcelona', '08015', '93 123 45 67', 'info@bonpreu.cat', 'Dill-Diss 9:00-21:00'),

('Veritas', 'Supermercat ecològic amb productes orgànics certificats', 'Supermercat Eco', '/img/empresas/veritas.png', 'C/ Balmes, 89', 'Barcelona', '08008', '93 456 78 90', 'hola@veritas.es', 'Dill-Diss 9:00-21:00'),

('Caprabo', 'Supermercat amb àmplia selecció de productes frescos', 'Supermercat', '/img/empresas/caprabo.png', 'C/ Aragó, 250', 'Barcelona', '08007', '93 234 56 78', 'atencion@caprabo.com', 'Dill-Diss 8:30-21:30'),

('Condis', 'Supermercat de barri amb productes de qualitat', 'Supermercat', '/img/empresas/condis.png', 'C/ Sants, 180', 'Barcelona', '08028', '93 345 67 89', 'info@condis.es', 'Dill-Diss 9:00-21:00'),

-- Fruites i Verdures
('Fruites Seco', 'Majorista de fruites i verdures fresques de temporada', 'Fruita i Verdura', '/img/empresas/fruites-seco.png', 'Mercabarna, Nau A-12', 'Barcelona', '08040', '93 567 89 01', 'info@fruitesseco.cat', 'Dill-Div 5:00-14:00'),

('La Boqueria', 'Mercat tradicional amb productes frescos de màxima qualitat', 'Mercat', '/img/empresas/boqueria.png', 'La Rambla, 91', 'Barcelona', '08001', '93 318 25 84', 'info@boqueria.info', 'Dill-Diss 8:00-20:30'),

-- Carns i Embotits
('Casa Riera Ordeix', 'Embotits artesans catalans des de 1852', 'Carns i Embotits', '/img/empresas/riera-ordeix.png', 'C/ Vic, 45', 'Vic', '08500', '93 886 12 34', 'info@rieraordeix.com', 'Dill-Div 9:00-14:00, 17:00-20:00'),

('Frigorifics Costa Brava', 'Distribuïdor de carns selectes i de qualitat', 'Carns i Embotits', '/img/empresas/costa-brava.png', 'Pol. Ind. Celrà, 23', 'Girona', '17460', '972 49 21 00', 'info@frigorifico.com', 'Dill-Div 7:00-17:00'),

-- Pa i Pastisseria
('Turris', 'Pa artesà i pastisseria de qualitat superior', 'Fleca', '/img/empresas/turris.png', 'C/ Santaló, 45', 'Barcelona', '08021', '93 200 18 90', 'info@turris.com', 'Dill-Diss 7:30-21:00'),

('Baluard', 'Forn de pa artesà amb productes tradicionals', 'Fleca', '/img/empresas/baluard.png', 'C/ Baluard, 38', 'Barcelona', '08003', '93 221 12 08', 'info@baluard.net', 'Dill-Dium 8:00-20:00'),

-- Làctics i Formatges
('Formatge Artesà Catalunya', 'Formatges artesans de les millors formatgeries catalanes', 'Làctics', '/img/empresas/formatges-cat.png', 'C/ Consell de Cent, 234', 'Barcelona', '08011', '93 451 23 45', 'info@formatgescat.com', 'Dill-Diss 10:00-20:00'),

('Làctia', 'Productes làctics frescos de granges catalanes', 'Làctics', '/img/empresas/lactia.png', 'Pol. Ind. El Pla, 8', 'Vic', '08500', '93 889 12 34', 'info@lactia.cat', 'Dill-Div 6:00-18:00'),

-- Peix i Marisc
('Peix de Barcelona', 'Peix fresc del dia directe de la llotja', 'Peix i Marisc', '/img/empresas/peix-bcn.png', 'Moll dels Pescadors, 1', 'Barcelona', '08039', '93 221 54 32', 'info@peixbcn.com', 'Dill-Diss 6:00-14:00'),

-- Begudes
('Moritz', 'Cervesa artesana barcelonina des de 1856', 'Begudes', '/img/empresas/moritz.png', 'Ronda Sant Antoni, 41', 'Barcelona', '08011', '93 426 00 50', 'info@moritz.com', 'Dill-Dium 10:00-24:00'),

('Viladrau', 'Aigua mineral natural dels Pirineus', 'Begudes', '/img/empresas/viladrau.png', 'C/ Aigua, 1', 'Viladrau', '17406', '972 88 01 00', 'info@viladrau.com', 'Dill-Div 8:00-17:00');

-- =====================================================
-- INSERIR PRODUCTES
-- =====================================================

-- Productes Mercadona (id=1)
INSERT INTO productos (empresa_id, nombre, descripcion, categoria, precio, unidad, eco, imagen_url) VALUES
(1, 'Llet Sencera Hacendado', 'Llet sencera UHT 1L', 'Làctics', 0.89, 'litre', 0, '/img/productos/llet-hacendado.png'),
(1, 'Pa de motlle Hacendado', 'Pa de motlle integral 500g', 'Pa', 1.25, 'unitat', 0, '/img/productos/pa-motlle.png'),
(1, 'Oli d\'oliva verge extra', 'Oli d\'oliva verge extra 1L', 'Oli', 6.50, 'litre', 0, '/img/productos/oli-oliva.png'),
(1, 'Ous frescos L', 'Ous frescos de gallines criades a terra, 12 unitats', 'Ous', 2.45, 'dotzena', 0, '/img/productos/ous.png'),
(1, 'Tomàquets de penjar', 'Tomàquets de ramallet 500g', 'Verdura', 2.99, 'mig kg', 0, '/img/productos/tomaquet.png'),
(1, 'Iogurt natural Hacendado', 'Pack 8 iogurts naturals', 'Làctics', 1.60, 'pack', 0, '/img/productos/iogurt.png');

-- Productes Bonpreu (id=2)
INSERT INTO productos (empresa_id, nombre, descripcion, categoria, precio, unidad, eco, imagen_url) VALUES
(2, 'Cistella de fruita de temporada', 'Selecció de fruites de proximitat 3kg', 'Fruita', 12.90, 'cistella', 0, '/img/productos/cistella-fruita.png'),
(2, 'Formatge de cabra català', 'Formatge de cabra semicurat 300g', 'Làctics', 5.75, 'peça', 0, '/img/productos/formatge-cabra.png'),
(2, 'Pollastre de corral', 'Pollastre sencer de corral català', 'Carn', 9.95, 'kg', 0, '/img/productos/pollastre.png'),
(2, 'Patates del Bufet', 'Patates vermelles del Bufet 2kg', 'Verdura', 3.50, 'bossa', 0, '/img/productos/patates.png'),
(2, 'Mel de romaní', 'Mel artesanal de romaní 500g', 'Mel i Melmelades', 7.25, 'pot', 0, '/img/productos/mel.png');

-- Productes Veritas (id=3)
INSERT INTO productos (empresa_id, nombre, descripcion, categoria, precio, unidad, eco, imagen_url) VALUES
(3, 'Cistella verdures ECO', 'Verdures ecològiques variades 4kg', 'Verdura', 18.90, 'cistella', 1, '/img/productos/verdures-eco.png'),
(3, 'Llet d\'avena BIO', 'Beguda d\'avena ecològica 1L', 'Làctics', 2.75, 'litre', 1, '/img/productos/llet-avena.png'),
(3, 'Quinoa BIO', 'Quinoa ecològica 500g', 'Cereals', 4.50, 'paquet', 1, '/img/productos/quinoa.png'),
(3, 'Ametlles ECO', 'Ametlles ecològiques torrades 250g', 'Fruits secs', 5.90, 'bossa', 1, '/img/productos/ametlles.png'),
(3, 'Hummus ECO', 'Hummus ecològic artesà 200g', 'Preparats', 3.25, 'pot', 1, '/img/productos/hummus.png'),
(3, 'Taronja ECO', 'Taronges ecològiques de València 2kg', 'Fruita', 4.80, 'malla', 1, '/img/productos/taronges-eco.png');

-- Productes Caprabo (id=4)
INSERT INTO productos (empresa_id, nombre, descripcion, categoria, precio, unidad, eco, imagen_url) VALUES
(4, 'Pernil ibèric', 'Pernil ibèric de gla tallat 100g', 'Embotits', 8.90, '100g', 0, '/img/productos/pernil.png'),
(4, 'Salmó fumat', 'Salmó fumat noruec 150g', 'Peix', 6.25, 'paquet', 0, '/img/productos/salmo.png'),
(4, 'Fruites del bosc', 'Barreja de fruites del bosc congelades 300g', 'Congelats', 3.45, 'bossa', 0, '/img/productos/fruites-bosc.png'),
(4, 'Pizza fresca', 'Pizza fresca de pernil i formatge', 'Preparats', 4.50, 'unitat', 0, '/img/productos/pizza.png');

-- Productes Condis (id=5)
INSERT INTO productos (empresa_id, nombre, descripcion, categoria, precio, unidad, eco, imagen_url) VALUES
(5, 'Arròs bomba Delta', 'Arròs bomba D.O. Delta de l\'Ebre 1kg', 'Cereals', 4.25, 'kg', 0, '/img/productos/arros-bomba.png'),
(5, 'Mongetes del ganxet', 'Mongetes seques del ganxet 500g', 'Llegums', 8.50, 'paquet', 0, '/img/productos/mongetes.png'),
(5, 'Vi negre Penedès', 'Vi negre D.O. Penedès 75cl', 'Begudes', 5.90, 'ampolla', 0, '/img/productos/vi-negre.png'),
(5, 'Cava Brut Nature', 'Cava brut nature reserva 75cl', 'Begudes', 7.80, 'ampolla', 0, '/img/productos/cava.png');

-- Productes Fruites Seco (id=6)
INSERT INTO productos (empresa_id, nombre, descripcion, categoria, precio, unidad, eco, imagen_url) VALUES
(6, 'Pomes Golden', 'Pomes Golden del Segrià 1kg', 'Fruita', 2.50, 'kg', 0, '/img/productos/pomes.png'),
(6, 'Peres Conference', 'Peres Conference de Lleida 1kg', 'Fruita', 2.75, 'kg', 0, '/img/productos/peres.png'),
(6, 'Plàtans de Canàries', 'Plàtans de Canàries 1kg', 'Fruita', 1.99, 'kg', 0, '/img/productos/platans.png'),
(6, 'Maduixes del Maresme', 'Maduixes fresques del Maresme 500g', 'Fruita', 4.50, 'safata', 0, '/img/productos/maduixes.png'),
(6, 'Enciam Iceberg', 'Enciam Iceberg fresc', 'Verdura', 0.99, 'unitat', 0, '/img/productos/enciam.png'),
(6, 'Pastanagues', 'Pastanagues fresques 1kg', 'Verdura', 1.50, 'kg', 0, '/img/productos/pastanagues.png');

-- Productes La Boqueria (id=7)
INSERT INTO productos (empresa_id, nombre, descripcion, categoria, precio, unidad, eco, imagen_url) VALUES
(7, 'Peix del dia (varietat)', 'Peix fresc del dia segons disponibilitat', 'Peix', 15.00, 'kg', 0, '/img/productos/peix-dia.png'),
(7, 'Gambes de Palamós', 'Gambes fresques de Palamós 500g', 'Marisc', 45.00, 'mig kg', 0, '/img/productos/gambes.png'),
(7, 'Fruita exòtica selecta', 'Selecció de fruita tropical premium', 'Fruita', 12.50, 'safata', 0, '/img/productos/fruita-exotica.png');

-- Productes Casa Riera Ordeix (id=8)
INSERT INTO productos (empresa_id, nombre, descripcion, categoria, precio, unidad, eco, imagen_url) VALUES
(8, 'Fuet Extra', 'Fuet tradicional extra 200g', 'Embotits', 5.90, 'peça', 0, '/img/productos/fuet.png'),
(8, 'Llonganissa de Vic', 'Llonganissa curada de Vic 300g', 'Embotits', 8.50, 'peça', 0, '/img/productos/llonganissa.png'),
(8, 'Botifarra catalana', 'Botifarra fresca artesana 400g', 'Embotits', 6.25, 'paquet', 0, '/img/productos/botifarra.png'),
(8, 'Bull negre', 'Bull negre artesà 350g', 'Embotits', 7.80, 'peça', 0, '/img/productos/bull.png');

-- Productes Frigorifics Costa Brava (id=9)
INSERT INTO productos (empresa_id, nombre, descripcion, categoria, precio, unidad, eco, imagen_url) VALUES
(9, 'Vedella de Girona', 'Entrecot de vedella de Girona 500g', 'Carn', 14.90, 'mig kg', 0, '/img/productos/vedella.png'),
(9, 'Costella de porc ibèric', 'Costella de porc ibèric 600g', 'Carn', 9.50, 'safata', 0, '/img/productos/costella.png'),
(9, 'Hamburgueses gourmet', 'Pack 4 hamburgueses de vedella premium', 'Carn', 7.25, 'pack', 0, '/img/productos/hamburgueses.png');

-- Productes Turris (id=10)
INSERT INTO productos (empresa_id, nombre, descripcion, categoria, precio, unidad, eco, imagen_url) VALUES
(10, 'Pa de pagès', 'Pa de pagès tradicional 500g', 'Pa', 3.20, 'peça', 0, '/img/productos/pa-pages.png'),
(10, 'Croissant de mantega', 'Croissant artesà de mantega', 'Brioixeria', 2.10, 'unitat', 0, '/img/productos/croissant.png'),
(10, 'Coca de vidre', 'Coca tradicional catalana amb pinyons', 'Brioixeria', 4.50, 'peça', 0, '/img/productos/coca-vidre.png'),
(10, 'Ensaïmada', 'Ensaïmada artesana', 'Brioixeria', 3.80, 'unitat', 0, '/img/productos/ensaimada.png');

-- Productes Baluard (id=11)
INSERT INTO productos (empresa_id, nombre, descripcion, categoria, precio, unidad, eco, imagen_url) VALUES
(11, 'Pa de massa mare', 'Pa de massa mare natural 400g', 'Pa', 4.50, 'peça', 0, '/img/productos/pa-massa-mare.png'),
(11, 'Baguette artesana', 'Baguette cruixent artesana', 'Pa', 1.80, 'unitat', 0, '/img/productos/baguette.png'),
(11, 'Pa integral amb llavors', 'Pa integral amb llavors variades 450g', 'Pa', 3.90, 'peça', 0, '/img/productos/pa-integral.png');

-- Productes Formatge Artesà Catalunya (id=12)
INSERT INTO productos (empresa_id, nombre, descripcion, categoria, precio, unidad, eco, imagen_url) VALUES
(12, 'Garrotxa', 'Formatge de cabra Garrotxa 300g', 'Làctics', 9.50, 'peça', 0, '/img/productos/garrotxa.png'),
(12, 'Tupí', 'Formatge Tupí de l\'Alt Urgell 200g', 'Làctics', 8.90, 'pot', 0, '/img/productos/tupi.png'),
(12, 'Mató', 'Mató fresc artesà 250g', 'Làctics', 4.25, 'terrina', 0, '/img/productos/mato.png'),
(12, 'Formatge d\'ovella curat', 'Formatge d\'ovella curat del Pallars 400g', 'Làctics', 14.50, 'peça', 0, '/img/productos/formatge-ovella.png');

-- Productes Làctia (id=13)
INSERT INTO productos (empresa_id, nombre, descripcion, categoria, precio, unidad, eco, imagen_url) VALUES
(13, 'Llet fresca de granja', 'Llet fresca del dia 1L', 'Làctics', 1.45, 'litre', 0, '/img/productos/llet-fresca.png'),
(13, 'Iogurt artesà natural', 'Iogurt natural de granja 4 x 125g', 'Làctics', 2.80, 'pack', 0, '/img/productos/iogurt-artesa.png'),
(13, 'Mantega de pastura', 'Mantega artesana de pastura 250g', 'Làctics', 4.90, 'paquet', 0, '/img/productos/mantega.png');

-- Productes Peix de Barcelona (id=14)
INSERT INTO productos (empresa_id, nombre, descripcion, categoria, precio, unidad, eco, imagen_url) VALUES
(14, 'Lluç de palangre', 'Lluç fresc de palangre 1kg', 'Peix', 18.90, 'kg', 0, '/img/productos/lluc.png'),
(14, 'Sípia fresca', 'Sípia fresca de la costa 500g', 'Peix', 12.50, 'mig kg', 0, '/img/productos/sipia.png'),
(14, 'Sardines fresques', 'Sardines fresques del Mediterrani 1kg', 'Peix', 7.80, 'kg', 0, '/img/productos/sardines.png'),
(14, 'Musclos del Delta', 'Musclos frescos del Delta de l\'Ebre 1kg', 'Marisc', 4.50, 'kg', 0, '/img/productos/musclos.png');

-- Productes Moritz (id=15)
INSERT INTO productos (empresa_id, nombre, descripcion, categoria, precio, unidad, eco, imagen_url) VALUES
(15, 'Moritz Original', 'Cervesa Moritz Original 33cl x 6', 'Begudes', 5.90, 'pack', 0, '/img/productos/moritz.png'),
(15, 'Moritz Epidor', 'Cervesa Moritz Epidor premium 33cl x 6', 'Begudes', 7.50, 'pack', 0, '/img/productos/moritz-epidor.png'),
(15, 'Moritz 0,0', 'Cervesa Moritz sense alcohol 33cl x 6', 'Begudes', 5.50, 'pack', 0, '/img/productos/moritz-00.png');

-- Productes Viladrau (id=16)
INSERT INTO productos (empresa_id, nombre, descripcion, categoria, precio, unidad, eco, imagen_url) VALUES
(16, 'Aigua mineral 1.5L', 'Aigua mineral natural Viladrau 1.5L x 6', 'Begudes', 3.60, 'pack', 0, '/img/productos/viladrau-15.png'),
(16, 'Aigua mineral 5L', 'Garrafa d\'aigua Viladrau 5L', 'Begudes', 1.50, 'garrafa', 0, '/img/productos/viladrau-5.png'),
(16, 'Aigua amb gas', 'Aigua amb gas Viladrau 1L x 6', 'Begudes', 4.80, 'pack', 0, '/img/productos/viladrau-gas.png');

-- =====================================================
-- ÍNDEXS PER MILLORAR RENDIMENT
-- =====================================================
CREATE INDEX idx_productos_empresa ON productos(empresa_id);
CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_productos_activo ON productos(activo);
CREATE INDEX idx_carrito_usuario ON carrito(usuario_id);
CREATE INDEX idx_empresas_categoria ON empresas(categoria);
CREATE INDEX idx_empresas_activo ON empresas(activo);

-- =====================================================
-- FI DE L'SCRIPT
-- =====================================================
SELECT 'Script executat correctament!' AS resultat;
SELECT CONCAT('Empreses creades: ', COUNT(*)) AS info FROM empresas;
SELECT CONCAT('Productes creats: ', COUNT(*)) AS info FROM productos;
