-- Script per actualitzar les imatges dels productes amb rutes locals específiques
-- Utilitzant imatges descarregades a public/img/productos/
-- Cada producte té la seva imatge específica

SET SQL_SAFE_UPDATES = 0;

-- FRUITES (IDs 1-10)
UPDATE productos SET imagen = '/img/productos/pomes.jpg' WHERE id = 1;           -- Pomes Golden
UPDATE productos SET imagen = '/img/productos/taronges.jpg' WHERE id = 2;        -- Taronges de Valencia
UPDATE productos SET imagen = '/img/productos/platans.jpg' WHERE id = 3;         -- Platans de Canaries
UPDATE productos SET imagen = '/img/productos/maduixes.jpg' WHERE id = 4;        -- Maduixes
UPDATE productos SET imagen = '/img/productos/kiwis.jpg' WHERE id = 5;           -- Kiwis
UPDATE productos SET imagen = '/img/productos/peres.jpg' WHERE id = 6;           -- Peres Conference
UPDATE productos SET imagen = '/img/productos/raim.jpg' WHERE id = 7;            -- Raim negre
UPDATE productos SET imagen = '/img/productos/melo.jpg' WHERE id = 8;            -- Melo
UPDATE productos SET imagen = '/img/productos/sindria.jpg' WHERE id = 9;         -- Sindria
UPDATE productos SET imagen = '/img/productos/mangos.jpg' WHERE id = 10;         -- Mangos

-- VERDURES (IDs 11-22)
UPDATE productos SET imagen = '/img/productos/tomaquets-penjar.jpg' WHERE id = 11;  -- Tomates de penjar
UPDATE productos SET imagen = '/img/productos/enciams.jpg' WHERE id = 12;        -- Enciams
UPDATE productos SET imagen = '/img/productos/cebes.jpg' WHERE id = 13;          -- Cebes
UPDATE productos SET imagen = '/img/productos/alls.jpg' WHERE id = 14;           -- Alls
UPDATE productos SET imagen = '/img/productos/patates.jpg' WHERE id = 15;        -- Patates
UPDATE productos SET imagen = '/img/productos/pastanagues.jpg' WHERE id = 16;    -- Pastanagues
UPDATE productos SET imagen = '/img/productos/carabasses.jpg' WHERE id = 17;     -- Carabasses
UPDATE productos SET imagen = '/img/productos/alberginies.jpg' WHERE id = 18;    -- Alberginies
UPDATE productos SET imagen = '/img/productos/pebrots.jpg' WHERE id = 19;        -- Pebrots vermells
UPDATE productos SET imagen = '/img/productos/carbassons.jpg' WHERE id = 20;     -- Carbassons
UPDATE productos SET imagen = '/img/productos/espinacs.jpg' WHERE id = 21;       -- Espinacs frescos
UPDATE productos SET imagen = '/img/productos/broquil.jpg' WHERE id = 22;        -- Broquil

-- CARNS (IDs 23-32)
UPDATE productos SET imagen = '/img/productos/vedella.jpg' WHERE id = 23;        -- Filet de vedella
UPDATE productos SET imagen = '/img/productos/costelles-porc.jpg' WHERE id = 24; -- Costelles de porc
UPDATE productos SET imagen = '/img/productos/pit-pollastre.jpg' WHERE id = 25;  -- Pit de pollastre
UPDATE productos SET imagen = '/img/productos/cuixes-pollastre.jpg' WHERE id = 26; -- Cuixes de pollastre
UPDATE productos SET imagen = '/img/productos/hamburgueses.jpg' WHERE id = 27;   -- Hamburgueses cassolanes
UPDATE productos SET imagen = '/img/productos/llom-porc.jpg' WHERE id = 28;      -- Llom de porc
UPDATE productos SET imagen = '/img/productos/botifarra.jpg' WHERE id = 29;      -- Botifarra fresca
UPDATE productos SET imagen = '/img/productos/xorico.jpg' WHERE id = 30;         -- Xorico iberic
UPDATE productos SET imagen = '/img/productos/pernil.jpg' WHERE id = 31;         -- Pernil dolc
UPDATE productos SET imagen = '/img/productos/carn-picada.jpg' WHERE id = 32;    -- Carn picada mixta

-- PEIXOS (IDs 33-42)
UPDATE productos SET imagen = '/img/productos/salmo.jpg' WHERE id = 33;          -- Salmo fresc
UPDATE productos SET imagen = '/img/productos/gambes.jpg' WHERE id = 34;         -- Gambes blanques
UPDATE productos SET imagen = '/img/productos/llobarro.jpg' WHERE id = 35;       -- Llobarro
UPDATE productos SET imagen = '/img/productos/musclos.jpg' WHERE id = 36;        -- Musclos
UPDATE productos SET imagen = '/img/productos/cloisses.jpg' WHERE id = 37;       -- Cloisses
UPDATE productos SET imagen = '/img/productos/tonyina.jpg' WHERE id = 38;        -- Tonyina fresca
UPDATE productos SET imagen = '/img/productos/sardines.jpg' WHERE id = 39;       -- Sardines
UPDATE productos SET imagen = '/img/productos/calamars.jpg' WHERE id = 40;       -- Calamars
UPDATE productos SET imagen = '/img/productos/rap.jpg' WHERE id = 41;            -- Rap
UPDATE productos SET imagen = '/img/productos/bacalla.jpg' WHERE id = 42;        -- Bacalla dessalat

-- LACTIS (IDs 43-50)
UPDATE productos SET imagen = '/img/productos/llet.jpg' WHERE id = 43;           -- Llet fresca
UPDATE productos SET imagen = '/img/productos/iogurt.jpg' WHERE id = 44;         -- Iogurt natural
UPDATE productos SET imagen = '/img/productos/formatge-fresc.jpg' WHERE id = 45; -- Formatge fresc
UPDATE productos SET imagen = '/img/productos/formatge-curat.jpg' WHERE id = 46; -- Formatge curat
UPDATE productos SET imagen = '/img/productos/mantega.jpg' WHERE id = 47;        -- Mantega
UPDATE productos SET imagen = '/img/productos/nata.jpg' WHERE id = 48;           -- Nata per cuinar
UPDATE productos SET imagen = '/img/productos/mato.jpg' WHERE id = 49;           -- Mato
UPDATE productos SET imagen = '/img/productos/ous.jpg' WHERE id = 50;            -- Ous de pages

-- PA I FORN (IDs 51-58)
UPDATE productos SET imagen = '/img/productos/pa-pages.jpg' WHERE id = 51;       -- Pa de pages
UPDATE productos SET imagen = '/img/productos/baguette.jpg' WHERE id = 52;       -- Baguette
UPDATE productos SET imagen = '/img/productos/pa-integral.jpg' WHERE id = 53;    -- Pa integral
UPDATE productos SET imagen = '/img/productos/croissant.jpg' WHERE id = 54;      -- Croissants
UPDATE productos SET imagen = '/img/productos/ensaimades.jpg' WHERE id = 55;     -- Ensaimades
UPDATE productos SET imagen = '/img/productos/coca-vidre.jpg' WHERE id = 56;     -- Coca de vidre
UPDATE productos SET imagen = '/img/productos/pa-motlle.jpg' WHERE id = 57;      -- Pa de motlle
UPDATE productos SET imagen = '/img/productos/magdalenes.jpg' WHERE id = 58;     -- Magdalenes

SET SQL_SAFE_UPDATES = 1;

-- Verificar els canvis
SELECT id, nombre, imagen FROM productos ORDER BY id;
