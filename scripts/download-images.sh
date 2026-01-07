#!/bin/bash

# Script per descarregar imatges de productes des d'Unsplash

echo "Descarregant imatges de productes..."

# Crear directori si no existeix
mkdir -p public/img/productos

# Descarregar imatges de verdures
curl -L -o "public/img/productos/alberginies.jpg" "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400&h=300&fit=crop&crop=center"
curl -L -o "public/img/productos/alls.jpg" "https://images.unsplash.com/photo-1540148426945-6cf22a6b2f85?w=400&h=300&fit=crop&crop=center"
curl -L -o "public/img/productos/broquil.jpg" "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=300&fit=crop&crop=center"
curl -L -o "public/img/productos/carabasses.jpg" "https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=400&h=300&fit=crop&crop=center"
curl -L -o "public/img/productos/carbassons.jpg" "https://images.unsplash.com/photo-1633701614061-8c0b7a6c5e1a?w=400&h=300&fit=crop&crop=center"
curl -L -o "public/img/productos/cebes.jpg" "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=300&fit=crop&crop=center"
curl -L -o "public/img/productos/enciams.jpg" "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&h=300&fit=crop&crop=center"
curl -L -o "public/img/productos/espinacs.jpg" "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop&crop=center"
curl -L -o "public/img/productos/pastanagues.jpg" "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop&crop=center"
curl -L -o "public/img/productos/patates.jpg" "https://images.unsplash.com/photo-1518977676601-b53f82aba7ef?w=400&h=300&fit=crop&crop=center"
curl -L -o "public/img/productos/pebrots.jpg" "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=300&fit=crop&crop=center"
curl -L -o "public/img/productos/tomaquets.jpg" "https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400&h=300&fit=crop&crop=center"

# Descarregar imatges de fruites
curl -L -o "public/img/productos/pomes.jpg" "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&h=300&fit=crop&crop=center"
curl -L -o "public/img/productos/taronges.jpg" "https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop&crop=center"
curl -L -o "public/img/productos/platans.jpg" "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop&crop=center"
curl -L -o "public/img/productos/maduixes.jpg" "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop&crop=center"
curl -L -o "public/img/productos/kiwis.jpg" "https://images.unsplash.com/photo-1585059895524-72359e06133a?w=400&h=300&fit=crop&crop=center"
curl -L -o "public/img/productos/peres.jpg" "https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?w=400&h=300&fit=crop&crop=center"

# Descarregar imatges de carns
curl -L -o "public/img/productos/vedella.jpg" "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&h=300&fit=crop&crop=center"
curl -L -o "public/img/productos/porc.jpg" "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&h=300&fit=crop&crop=center"
curl -L -o "public/img/productos/pollastre.jpg" "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop&crop=center"

# Descarregar imatges de peix
curl -L -o "public/img/productos/salmo.jpg" "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=400&h=300&fit=crop&crop=center"
curl -L -o "public/img/productos/gambes.jpg" "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=300&fit=crop&crop=center"

# Descarregar imatges de làctics
curl -L -o "public/img/productos/llet.jpg" "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop&crop=center"
curl -L -o "public/img/productos/formatge.jpg" "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&h=300&fit=crop&crop=center"
curl -L -o "public/img/productos/ous.jpg" "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop&crop=center"

# Descarregar imatges de pa
curl -L -o "public/img/productos/pa.jpg" "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=300&fit=crop&crop=center"
curl -L -o "public/img/productos/croissant.jpg" "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop&crop=center"

echo "Totes les imatges descarregades!"