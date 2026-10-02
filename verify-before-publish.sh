#!/bin/bash

# Script de verificació pre-publicació a GitHub
# Aquest script comprova que el projecte està llest per ser publicat

echo "🔍 FreshExpress - Verificació Pre-Publicació a GitHub"
echo "======================================================"
echo ""

# Colors per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0
warnings=0

# Funció per mostrar errors
error() {
    echo -e "${RED}❌ ERROR: $1${NC}"
    ((errors++))
}

# Funció per mostrar warnings
warning() {
    echo -e "${YELLOW}⚠️  WARNING: $1${NC}"
    ((warnings++))
}

# Funció per mostrar èxits
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

echo "1️⃣  Verificant fitxers de configuració..."
echo "----------------------------------------"

# Verificar .env.example existeix
if [ -f ".env.example" ]; then
    success ".env.example existeix"
else
    error ".env.example no trobat"
fi

# Verificar .env NO està al repositori
if git ls-files | grep -Fqx '.env'; then
    error ".env està al repositori! Elimina'l immediatament"
else
    success ".env NO està al repositori"
fi

# Verificar .gitignore existeix
if [ -f ".gitignore" ]; then
    success ".gitignore existeix"
    
    # Verificar que .env està al .gitignore
    if grep -q "^\.env$" .gitignore; then
        success ".env està al .gitignore"
    else
        error ".env no està al .gitignore"
    fi
else
    error ".gitignore no trobat"
fi

echo ""
echo "2️⃣  Buscant secrets hardcoded..."
echo "----------------------------------------"

# Buscar possibles secrets en el codi
secrets_found=0

# Buscar API keys
if git grep -i "api.*key.*=.*['\"][^'\"]*['\"]" -- "*.ts" "*.astro" "*.js" "*.mjs" | grep -v ".example" | grep -v "YOUR_API_KEY" | grep -v "la_teva_api_key" > /dev/null 2>&1; then
    warning "Possibles API keys trobades al codi"
    git grep -i "api.*key.*=.*['\"][^'\"]*['\"]" -- "*.ts" "*.astro" "*.js" "*.mjs" | grep -v ".example" | grep -v "YOUR_API_KEY" | grep -v "la_teva_api_key"
    ((secrets_found++))
fi

# Buscar IPs
# Excloure coordenades SVG i l'exemple documental d'IPv4.
ips=$(git grep -E '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}' -- '*.ts' '*.astro' '*.js' '*.mjs' | grep -v -E 'd="|// IPv4:|0\.0\.0\.0|127\.0\.0\.1|localhost' || true)
if [ -n "$ips" ]; then
    warning "Possibles IPs hardcoded trobades"
    printf '%s\n' "$ips"
    ((secrets_found++))
fi

if [ $secrets_found -eq 0 ]; then
    success "No s'han trobat secrets hardcoded"
fi

echo ""
echo "3️⃣  Verificant dependències..."
echo "----------------------------------------"

if [ -f "package.json" ]; then
    success "package.json existeix"
    
    # Verificar node_modules no està al repositori
    if git ls-files | grep -q '^node_modules/'; then
        error "node_modules està al repositori!"
    else
        success "node_modules NO està al repositori"
    fi
else
    error "package.json no trobat"
fi

echo ""
echo "4️⃣  Verificant documentació..."
echo "----------------------------------------"

docs=("README.md" "LICENSE" "DEPLOYMENT.md" "SECURITY.md")
for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        success "$doc existeix"
    else
        warning "$doc no trobat (recomanat)"
    fi
done

echo ""
echo "5️⃣  Verificant estructura del projecte..."
echo "----------------------------------------"

# Verificar carpetes importants
folders=("src" "public" "sql")
for folder in "${folders[@]}"; do
    if [ -d "$folder" ]; then
        success "Carpeta $folder/ existeix"
    else
        error "Carpeta $folder/ no trobada"
    fi
done

for script in sql/freshexpress_completa.sql sql/02-local-images.sql sql/03-runtime-tables.sql; do
    if [ -f "$script" ]; then
        success "$script existeix"
    else
        error "$script no trobat"
    fi
done

echo ""
echo "6️⃣  Verificant fitxers sensibles exclosos..."
echo "----------------------------------------"

# Verificar que ML/ està exclosa
if git ls-files | grep -q "^ML/"; then
    warning "Carpeta ML/ està al repositori (pot contenir dades sensibles)"
else
    success "Carpeta ML/ NO està al repositori"
fi

# Verificar fitxers .csv
if git ls-files | grep -q "\.csv$"; then
    warning "Fitxers .csv trobats al repositori (poden contenir dades sensibles)"
    git ls-files | grep "\.csv$"
else
    success "No hi ha fitxers .csv al repositori"
fi

echo ""
echo "7️⃣  Verificant build..."
echo "----------------------------------------"

if [ -d "node_modules" ]; then
    echo "Compilant projecte..."
    if npm run build > /dev/null 2>&1; then
        success "Build exitós"
    else
        error "Build ha fallat! Executa 'npm run build' per veure els errors"
    fi
else
    warning "node_modules no trobat. Executa 'npm install' primer"
fi

echo ""
echo "======================================================"
echo "📊 RESUM DE LA VERIFICACIÓ"
echo "======================================================"

if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}🎉 TOT PERFECTE! El projecte està llest per publicar a GitHub${NC}"
    echo ""
    echo "Passos següents:"
    echo "  1. git add ."
    echo "  2. git commit -m 'Initial commit: FreshExpress'"
    echo "  3. git remote add origin <url-del-teu-repo>"
    echo "  4. git push -u origin main"
    exit 0
elif [ $errors -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Hi ha $warnings warnings, però cap error crític${NC}"
    echo ""
    echo "Revisa els warnings abans de publicar (recomanat però no obligatori)"
    exit 0
else
    echo -e "${RED}❌ S'han trobat $errors errors i $warnings warnings${NC}"
    echo ""
    echo "ATENCIÓ: Corregeix els errors abans de publicar!"
    echo "Un repositori amb secrets exposats pot comprometre la seguretat."
    exit 1
fi
