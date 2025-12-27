-- Script per actualitzar les imatges dels productes
-- Utilitzant imatges d'Unsplash (gratuïtes)

SET SQL_SAFE_UPDATES = 0;

-- FRUITES (empresa_id = 1)
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&h=300&fit=crop' WHERE id = 1; -- Pomes Golden
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop' WHERE id = 2; -- Taronges de Valencia
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop' WHERE id = 3; -- Platans de Canaries
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop' WHERE id = 4; -- Maduixes
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=400&h=300&fit=crop' WHERE id = 5; -- Kiwis
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?w=400&h=300&fit=crop' WHERE id = 6; -- Peres Conference
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&h=300&fit=crop' WHERE id = 7; -- Raïm negre
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1571575173700-afb9492e6a50?w=400&h=300&fit=crop' WHERE id = 8; -- Meló
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1589984662646-e7b2e4f1f8e4?w=400&h=300&fit=crop' WHERE id = 9; -- Síndria
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop' WHERE id = 10; -- Mangos

-- VERDURES (empresa_id = 2)
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400&h=300&fit=crop' WHERE id = 11; -- Tomates de penjar
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&h=300&fit=crop' WHERE id = 12; -- Enciams
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=300&fit=crop' WHERE id = 13; -- Cebes
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2f85?w=400&h=300&fit=crop' WHERE id = 14; -- Alls
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1518977676601-b53f82ber7c8e?w=400&h=300&fit=crop' WHERE id = 15; -- Patates
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop' WHERE id = 16; -- Pastanagues
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=400&h=300&fit=crop' WHERE id = 17; -- Carabasses
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400&h=300&fit=crop' WHERE id = 18; -- Albergínies
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=300&fit=crop' WHERE id = 19; -- Pebrots vermells
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1596309418073-6f14c0cc7bfb?w=400&h=300&fit=crop' WHERE id = 20; -- Carbassons
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop' WHERE id = 21; -- Espinacs frescos
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=300&fit=crop' WHERE id = 22; -- Bròquil

-- CARNS (empresa_id = 3)
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&h=300&fit=crop' WHERE id = 23; -- Filet de vedella
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&h=300&fit=crop' WHERE id = 24; -- Costelles de porc
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop' WHERE id = 25; -- Pit de pollastre
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&h=300&fit=crop' WHERE id = 26; -- Cuixes de pollastre
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop' WHERE id = 27; -- Hamburgueses casolanes
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop' WHERE id = 28; -- Llom de porc
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop' WHERE id = 29; -- Botifarra fresca
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=400&h=300&fit=crop' WHERE id = 30; -- Xoriço ibèric
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1524438418049-ab2acb7aa48f?w=400&h=300&fit=crop' WHERE id = 31; -- Pernil dolç
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400&h=300&fit=crop' WHERE id = 32; -- Carn picada mixta

-- PEIXOS (empresa_id = 4)
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=400&h=300&fit=crop' WHERE id = 33; -- Salmó fresc
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=300&fit=crop' WHERE id = 34; -- Gambes blanques
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&h=300&fit=crop' WHERE id = 35; -- Llobarro
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&h=300&fit=crop' WHERE id = 36; -- Musclos
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1590759668628-05b0fc34bb70?w=400&h=300&fit=crop' WHERE id = 37; -- Cloïsses
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop' WHERE id = 38; -- Tonyina fresca
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop' WHERE id = 39; -- Sardines
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop' WHERE id = 40; -- Calamars
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=400&h=300&fit=crop' WHERE id = 41; -- Rap
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400&h=300&fit=crop' WHERE id = 42; -- Bacallà dessalat

-- LACTIS (empresa_id = 5)
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop' WHERE id = 43; -- Llet fresca
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop' WHERE id = 44; -- Iogurt natural
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop' WHERE id = 45; -- Formatge fresc
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&h=300&fit=crop' WHERE id = 46; -- Formatge curat
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=300&fit=crop' WHERE id = 47; -- Mantega
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1634141510639-d691d86f47be?w=400&h=300&fit=crop' WHERE id = 48; -- Nata per cuinar
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=400&h=300&fit=crop' WHERE id = 49; -- Mató
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop' WHERE id = 50; -- Ous de pagès

-- PA I FORN (empresa_id = 6)
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=300&fit=crop' WHERE id = 51; -- Pa de pagès
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1568471173242-461f0a730452?w=400&h=300&fit=crop' WHERE id = 52; -- Baguette
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop' WHERE id = 53; -- Pa integral
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop' WHERE id = 54; -- Croissants
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=400&h=300&fit=crop' WHERE id = 55; -- Ensaïmades
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop' WHERE id = 56; -- Coca de vidre
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=400&h=300&fit=crop' WHERE id = 57; -- Pa de motlle
UPDATE productos SET imagen = 'https://images.unsplash.com/photo-1558303289-68f854f77cec?w=400&h=300&fit=crop' WHERE id = 58; -- Magdalenes

SET SQL_SAFE_UPDATES = 1;

-- Verificar els canvis
SELECT id, nombre, imagen FROM productos ORDER BY id;
