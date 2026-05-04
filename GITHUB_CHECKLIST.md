# ✅ Checklist: Preparar per publicar a GitHub

Abans de fer el primer `git push` al repositori públic, assegura't de completar tots aquests passos:

## 🔒 1. Seguretat i Secrets

- [x] ✅ Eliminar API REST externa (http://143.47.36.36:3000)
- [x] ✅ Substituir per consultes directes a la base de dades
- [x] ✅ Convertir secrets hardcoded a variables d'entorn
- [x] ✅ Actualitzar `.gitignore` per excloure fitxers sensibles
- [x] ✅ Verificar que `.env` està al `.gitignore`
- [x] ✅ Crear `.env.example` amb valors genèrics
- [ ] 🔄 Revisar tot el codi per secrets restants

## 📝 2. Documentació

- [x] ✅ README.md actualitzat amb informació del projecte
- [x] ✅ DEPLOYMENT.md amb instruccions de desplegament
- [x] ✅ SECURITY.md amb bones pràctiques de seguretat
- [x] ✅ PORTFOLIO.md amb informació del portafoli
- [x] ✅ CONTRIBUTING.md (si existeix)
- [x] ✅ LICENSE amb llicència MIT
- [ ] 🔄 Actualitzar informació de contacte al README

## 🗑️ 3. Neteja de Fitxers

- [x] ✅ Carpeta ML/ exclosa del repositori (.gitignore)
- [x] ✅ Fitxers .csv amb dades sensibles exclosos
- [ ] 🔄 Eliminar fitxers de backup (.sql, .zip, etc.)
- [ ] 🔄 Eliminar logs amb informació personal
- [ ] 🔄 Eliminar node_modules (ja al .gitignore)
- [ ] 🔄 Eliminar carpeta dist/ (ja al .gitignore)

## 🔍 4. Revisió de Codi

- [x] ✅ No hi ha IPs hardcoded
- [x] ✅ No hi ha contrasenyes en el codi
- [x] ✅ No hi ha API keys en el codi
- [x] ✅ Totes les URLs són variables d'entorn
- [ ] 🔄 Eliminar console.log() innecessaris
- [ ] 🔄 Comentaris en català/anglès consistents
- [ ] 🔄 Format del codi consistent

## 📦 5. Configuració del Repositori

```bash
# Inicialitzar Git (si no està fet)
git init

# Afegir .gitignore
git add .gitignore

# Afegir fitxers
git add .

# Primer commit
git commit -m "Initial commit: FreshExpress - Plataforma de lliurament ecològic"

# Connectar amb GitHub
git remote add origin https://github.com/EL-TEU-USUARI/FreshExpress.git

# Pujar al repositori
git branch -M main
git push -u origin main
```

## 🎨 6. GitHub Repository Settings

Després de pujar el repositori a GitHub:

- [ ] Afegir descripció al repositori
- [ ] Afegir topics/tags: `astro`, `typescript`, `mysql`, `tailwindcss`, `ecommerce`, `sustainability`
- [ ] Configurar GitHub Pages (si aplica)
- [ ] Afegir imatge de previsualització (screenshot)
- [ ] Configurar protecció de la branca `main`
- [ ] Habilitar Issues i Discussions
- [ ] Crear README badges (build status, license, etc.)

## 📸 7. Screenshots i Demo

- [ ] Capturar screenshots de:
  - [ ] Pàgina principal
  - [ ] Dashboard client
  - [ ] Panel repartidor
  - [ ] Admin panel
  - [ ] Tracking en temps real
  - [ ] Cistella i checkout
- [ ] Crear carpeta `/docs/screenshots/`
- [ ] Afegir screenshots al README
- [ ] (Opcional) Crear GIF animat de la demo
- [ ] (Opcional) Desplegar a producció per demo en viu

## 🌐 8. Dades de Demo

- [ ] Crear base de dades de demo amb dades fictícies
- [ ] Script SQL amb usuaris de prova:

  ```sql
  -- Client de prova
  usuario: demo@freshexpress.cat
  password: demo123

  -- Repartidor de prova
  usuario: repartidor@freshexpress.cat
  password: demo123

  -- Admin de prova
  usuario: admin@freshexpress.cat
  password: admin123
  ```

- [ ] Documenta les credencials de demo al README

## 📄 9. Llicència

- [x] ✅ Afegir fitxer LICENSE (MIT)
- [ ] 🔄 Verificar que el teu nom/any és correcte
- [ ] 🔄 Afegir badge de llicència al README

## 🔗 10. Links i Informació de Contacte

Actualitzar als fitxers README i PORTFOLIO:

- [ ] El teu LinkedIn
- [ ] El teu GitHub profile
- [ ] La teva web/portfolio
- [ ] El teu email professional
- [ ] (Opcional) Link a demo en viu

## ✨ 11. Tocs Finals

- [ ] Revisar ortografia i gramàtica
- [ ] Verificar que tots els links funcionen
- [ ] Provar les instruccions d'instal·lació
- [ ] Executar `npm install` en un directori net
- [ ] Verificar que `npm run dev` funciona
- [ ] Verificar que `npm run build` funciona

## 🚀 12. Publicació

```bash
# Últimes comprovacions
git status
git log --oneline

# Si tot està bé, fer push
git push origin main

# Crear release (opcional)
git tag -a v1.0.0 -m "Primera versió pública"
git push origin v1.0.0
```

## 📢 13. Promoció

- [ ] Compartir a LinkedIn
- [ ] Afegir al CV i portfolio
- [ ] (Opcional) Escriure article explicant el projecte
- [ ] (Opcional) Crear vídeo demo
- [ ] (Opcional) Participar en ShowHN / ProductHunt

## 🔄 Comandes Finals de Verificació

```bash
# Verificar que .env no està al repositori
git ls-files | grep .env
# (només hauria de mostrar .env.example)

# Buscar secrets potencials
git grep -i "password.*=" -- "*.ts" "*.astro" "*.js"
git grep -i "api.*key.*=" -- "*.ts" "*.astro" "*.js"

# Verificar mida del repositori
du -sh .git/

# Verificar què es pujarà
git ls-files
```

---

## ✅ Quan completis tot això

El teu projecte estarà llest per:

- ✨ Publicar a GitHub
- 💼 Afegir al teu portafoli
- 🎯 Utilitzar en sol·licituds de feina
- 🌟 Rebre contribucions de la comunitat
- 🚀 Desplegar a producció

**Bones pràctiques recordatori:**

> Un repositori públic és la teva carta de presentació professional.
> Assegura't que està net, ben documentat i sense secrets.

---

📅 **Data de preparació**: ${new Date().toLocaleDateString('ca-ES')}
✍️ **Revisat per**: [El teu nom]
