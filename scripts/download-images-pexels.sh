#!/bin/bash

# Script per descarregar imatges de productes des de Pexels
# Pexels té una API gratuïta amb bones imatges

OUTPUT_DIR="../public/img/productos"
mkdir -p "$OUTPUT_DIR"

# API Key de Pexels (gratuïta - registra't a https://www.pexels.com/api/)
# API Key de Pexels - Utilitza variable d'entorn
# Obté la teva API key gratuïta a: https://www.pexels.com/api/
PEXELS_API_KEY="${PEXELS_API_KEY:-YOUR_API_KEY_HERE}"

if [ "$PEXELS_API_KEY" = "YOUR_API_KEY_HERE" ]; then
    echo "⚠️  ERROR: Configura la variable d'entorn PEXELS_API_KEY"
    echo "Obté una API key gratuïta a: https://www.pexels.com/api/"
    exit 1
fi

echo "======================================"
echo "  Descarregant imatges de productes"
echo "======================================"
echo ""
echo "NOTA: Aquest script utilitza URLs alternatives gratuïtes"
echo "Si vols millorar les imatges, registra't a Pexels.com/api"
echo ""

# Funció per descarregar amb curl amb seguiment de redirects
download_direct() {
    local url="$1"
    local filename="$2"
    echo "📥 $filename"
    curl -L -o "$OUTPUT_DIR/$filename" "$url" 2>/dev/null
}

# FRUITES - URLs directes d'imatges CC0
download_direct "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?w=400&h=300" "pomes.jpg"
download_direct "https://images.pexels.com/photos/1414110/pexels-photo-1414110.jpeg?w=400&h=300" "taronges.jpg"
download_direct "https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?w=400&h=300" "platans.jpg"
download_direct "https://images.pexels.com/photos/46174/strawberries-berries-fruit-freshness-46174.jpeg?w=400&h=300" "maduixes.jpg"
download_direct "https://images.pexels.com/photos/1037310/pexels-photo-1037310.jpeg?w=400&h=300" "kiwis.jpg"
download_direct "https://images.pexels.com/photos/568471/pexels-photo-568471.jpeg?w=400&h=300" "peres.jpg"
download_direct "https://images.pexels.com/photos/23042/pexels-photo.jpg?w=400&h=300" "raim.jpg"
download_direct "https://images.pexels.com/photos/1132053/pexels-photo-1132053.jpeg?w=400&h=300" "melo.jpg"
download_direct "https://images.pexels.com/photos/1313267/pexels-photo-1313267.jpeg?w=400&h=300" "sindria.jpg"
download_direct "https://images.pexels.com/photos/2294471/pexels-photo-2294471.jpeg?w=400&h=300" "mangos.jpg"

# VERDURES
download_direct "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?w=400&h=300" "tomaquets-penjar.jpg"
download_direct "https://images.pexels.com/photos/1352199/pexels-photo-1352199.jpeg?w=400&h=300" "enciams.jpg"
download_direct "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?w=400&h=300" "cebes.jpg"
download_direct "https://images.pexels.com/photos/1435903/pexels-photo-1435903.jpeg?w=400&h=300" "alls.jpg"
download_direct "https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?w=400&h=300" "patates.jpg"
download_direct "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?w=400&h=300" "pastanagues.jpg"
download_direct "https://images.pexels.com/photos/1327346/pexels-photo-1327346.jpeg?w=400&h=300" "carabasses.jpg"
download_direct "https://images.pexels.com/photos/321551/pexels-photo-321551.jpeg?w=400&h=300" "alberginies.jpg"
download_direct "https://images.pexels.com/photos/37641/bell-peppers-capsicum-vegetables-nachtschattengewaechs.jpg?w=400&h=300" "pebrots.jpg"
download_direct "https://images.pexels.com/photos/128420/pexels-photo-128420.jpeg?w=400&h=300" "carbassons.jpg"
download_direct "https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?w=400&h=300" "espinacs.jpg"
download_direct "https://images.pexels.com/photos/47347/broccoli-vegetable-food-healthy-47347.jpeg?w=400&h=300" "broquil.jpg"

# CARNS
download_direct "https://images.pexels.com/photos/65175/pexels-photo-65175.jpeg?w=400&h=300" "vedella.jpg"
download_direct "https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?w=400&h=300" "costelles-porc.jpg"
download_direct "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?w=400&h=300" "llom-porc.jpg"
download_direct "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?w=400&h=300" "pit-pollastre.jpg"
download_direct "https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg?w=400&h=300" "cuixes-pollastre.jpg"
download_direct "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?w=400&h=300" "hamburgueses.jpg"
download_direct "https://images.pexels.com/photos/3688/food-dinner-lunch-breakfast.jpg?w=400&h=300" "botifarra.jpg"
download_direct "https://images.pexels.com/photos/4199024/pexels-photo-4199024.jpeg?w=400&h=300" "xorico.jpg"
download_direct "https://images.pexels.com/photos/3688/food-dinner-lunch-breakfast.jpg?w=400&h=300" "pernil.jpg"
download_direct "https://images.pexels.com/photos/2233729/pexels-photo-2233729.jpeg?w=400&h=300" "carn-picada.jpg"

# PEIXOS
download_direct "https://images.pexels.com/photos/13858225/pexels-photo-13858225.jpeg?w=400&h=300" "salmo.jpg"
download_direct "https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?w=400&h=300" "gambes.jpg"
download_direct "https://images.pexels.com/photos/1303630/pexels-photo-1303630.jpeg?w=400&h=300" "llobarro.jpg"
download_direct "https://images.pexels.com/photos/566345/pexels-photo-566345.jpeg?w=400&h=300" "musclos.jpg"
download_direct "https://images.pexels.com/photos/1683545/pexels-photo-1683545.jpeg?w=400&h=300" "cloisses.jpg"
download_direct "https://images.pexels.com/photos/10827648/pexels-photo-10827648.jpeg?w=400&h=300" "tonyina.jpg"
download_direct "https://images.pexels.com/photos/6529890/pexels-photo-6529890.jpeg?w=400&h=300" "sardines.jpg"
download_direct "https://images.pexels.com/photos/8478151/pexels-photo-8478151.jpeg?w=400&h=300" "calamars.jpg"
download_direct "https://images.pexels.com/photos/1303630/pexels-photo-1303630.jpeg?w=400&h=300" "rap.jpg"
download_direct "https://images.pexels.com/photos/6419718/pexels-photo-6419718.jpeg?w=400&h=300" "bacalla.jpg"

# LACTIS
download_direct "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?w=400&h=300" "llet.jpg"
download_direct "https://images.pexels.com/photos/1435702/pexels-photo-1435702.jpeg?w=400&h=300" "iogurt.jpg"
download_direct "https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?w=400&h=300" "formatge-fresc.jpg"
download_direct "https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?w=400&h=300" "formatge-curat.jpg"
download_direct "https://images.pexels.com/photos/3622479/pexels-photo-3622479.jpeg?w=400&h=300" "mantega.jpg"
download_direct "https://images.pexels.com/photos/3622479/pexels-photo-3622479.jpeg?w=400&h=300" "nata.jpg"
download_direct "https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?w=400&h=300" "mato.jpg"
download_direct "https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?w=400&h=300" "ous.jpg"

# PA I FORN
download_direct "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?w=400&h=300" "pa-pages.jpg"
download_direct "https://images.pexels.com/photos/209403/pexels-photo-209403.jpeg?w=400&h=300" "baguette.jpg"
download_direct "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?w=400&h=300" "pa-integral.jpg"
download_direct "https://images.pexels.com/photos/2135677/pexels-photo-2135677.jpeg?w=400&h=300" "croissant.jpg"
download_direct "https://images.pexels.com/photos/2135677/pexels-photo-2135677.jpeg?w=400&h=300" "ensaimades.jpg"
download_direct "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?w=400&h=300" "coca-vidre.jpg"
download_direct "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?w=400&h=300" "pa-motlle.jpg"
download_direct "https://images.pexels.com/photos/2135677/pexels-photo-2135677.jpeg?w=400&h=300" "magdalenes.jpg"

echo ""
echo "✅ Descàrrega completada!"
echo "📁 Imatges guardades a: $OUTPUT_DIR"
echo ""
