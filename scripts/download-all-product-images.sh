#!/bin/bash

# Script per descarregar imatges específiques per cada producte
# Utilitza Pixabay API (gratuïta i sense limits)

OUTPUT_DIR="../public/img/productos"
mkdir -p "$OUTPUT_DIR"

# API Key de Pixabay - Utilitza variable d'entorn
# Obté la teva API key gratuïta a: https://pixabay.com/api/docs/
API_KEY="${PIXABAY_API_KEY:-YOUR_API_KEY_HERE}"

if [ "$API_KEY" = "YOUR_API_KEY_HERE" ]; then
    echo "⚠️  ERROR: Configura la variable d'entorn PIXABAY_API_KEY"
    echo "Obté una API key gratuïta a: https://pixabay.com/api/docs/"
    exit 1
fi

# Funció per descarregar imatge amb cerca específica
download_image() {
    local query="$1"
    local filename="$2"
    
    echo "Descarregant: $filename (cerca: $query)"
    
    # Buscar imatge a Pixabay
    local search_url="https://pixabay.com/api/?key=${API_KEY}&q=${query// /+}&image_type=photo&per_page=3&min_width=400&min_height=300"
    local image_url=$(curl -s "$search_url" | grep -o '"webformatURL":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    if [ -n "$image_url" ]; then
        curl -L "$image_url" -o "$OUTPUT_DIR/$filename" 2>/dev/null
        sleep 0.5
    else
        echo "  ⚠️  No s'ha trobat imatge per: $query"
    fi
}

# FRUITES
download_image "red apple fruit" "pomes.jpg"
download_image "orange valencia fruit" "taronges.jpg"
download_image "banana yellow fruit" "platans.jpg"
download_image "strawberry red fruit" "maduixes.jpg"
download_image "kiwi green fruit" "kiwis.jpg"
download_image "pear fruit green" "peres.jpg"
download_image "black grapes fruit" "raim.jpg"
download_image "melon yellow fruit" "melo.jpg"
download_image "watermelon red fruit" "sindria.jpg"
download_image "mango tropical fruit" "mangos.jpg"

# VERDURES
download_image "hanging tomatoes red" "tomaquets-penjar.jpg"
download_image "lettuce salad green" "enciams.jpg"
download_image "onion vegetable" "cebes.jpg"
download_image "garlic bulb white" "alls.jpg"
download_image "potato vegetable" "patates.jpg"
download_image "carrot orange vegetable" "pastanagues.jpg"
download_image "pumpkin orange vegetable" "carabasses.jpg"
download_image "eggplant purple vegetable" "alberginies.jpg"
download_image "red bell pepper" "pebrots.jpg"
download_image "zucchini green vegetable" "carbassons.jpg"
download_image "fresh spinach leaves" "espinacs.jpg"
download_image "broccoli green vegetable" "broquil.jpg"

# CARNS
download_image "beef steak raw meat" "vedella.jpg"
download_image "pork ribs raw meat" "costelles-porc.jpg"
download_image "pork loin raw meat" "llom-porc.jpg"
download_image "chicken breast raw" "pit-pollastre.jpg"
download_image "chicken thighs raw" "cuixes-pollastre.jpg"
download_image "beef burger patties" "hamburgueses.jpg"
download_image "fresh sausage meat" "botifarra.jpg"
download_image "chorizo sausage spanish" "xorico.jpg"
download_image "ham sliced pink" "pernil.jpg"
download_image "ground beef minced meat" "carn-picada.jpg"

# PEIXOS
download_image "fresh salmon fish" "salmo.jpg"
download_image "white prawns shrimp" "gambes.jpg"
download_image "sea bass fish" "llobarro.jpg"
download_image "mussels shellfish" "musclos.jpg"
download_image "clams shellfish" "cloisses.jpg"
download_image "fresh tuna fish" "tonyina.jpg"
download_image "sardines fish" "sardines.jpg"
download_image "squid calamari" "calamars.jpg"
download_image "monkfish anglerfish" "rap.jpg"
download_image "cod fish salted" "bacalla.jpg"

# LACTIS
download_image "fresh milk bottle" "llet.jpg"
download_image "yogurt natural white" "iogurt.jpg"
download_image "fresh cheese white" "formatge-fresc.jpg"
download_image "aged cheese wheel" "formatge-curat.jpg"
download_image "butter dairy yellow" "mantega.jpg"
download_image "cream cooking dairy" "nata.jpg"
download_image "cottage cheese fresh" "mato.jpg"
download_image "brown eggs chicken" "ous.jpg"

# PA I FORN
download_image "rustic bread loaf" "pa-pages.jpg"
download_image "french baguette bread" "baguette.jpg"
download_image "whole wheat bread" "pa-integral.jpg"
download_image "croissant pastry french" "croissant.jpg"
download_image "ensaimada pastry spanish" "ensaimades.jpg"
download_image "flatbread traditional" "coca-vidre.jpg"
download_image "sliced bread loaf" "pa-motlle.jpg"
download_image "muffins cupcakes" "magdalenes.jpg"

echo ""
echo "Descàrrega completada!"
echo "Imatges guardades a: $OUTPUT_DIR"
