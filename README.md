# 🥬 FreshExpress

[![Astro](https://img.shields.io/badge/Astro-5.16-BC52EE?logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Plataforma de lliurament ecològic d'última milla amb vehicles elèctrics**

FreshExpress és una aplicació web completa per a la gestió de lliuraments sostenibles, amb sistemes per a clients, repartidors i administradors.

## 🌟 Característiques Principals

### Per a Clients

- 🛒 **Compra online** - Catàleg de productes frescos i ecològics
- 📍 **Rastreig en temps real** - Seguiment de comandes amb actualitzacions en viu
- ⭐ **Sistema de valoracions** - Valora els repartidors després de cada entrega
- 📜 **Historial complet** - Consulta i repeteix comandes anteriors
- 🏠 **Múltiples adreces** - Gestiona diverses adreces de lliurament

### Per a Repartidors

- 📋 **Panell de control** - Vista de comandes disponibles i assignades
- 🗺️ **Optimització de rutes** - Rutes intel·ligents amb Google Maps
- 📊 **Estadístiques** - Guanys, valoracions i rendiment
- 🔄 **Actualitzacions en temps real** - Polling automàtic per noves comandes
- ⚠️ **Gestió d'incidències** - Reportar problemes durant les entregues

### Per a Administradors

- 👥 **Gestió d'usuaris** - Control complet sobre clients i repartidors
- 📈 **Dashboard analític** - Estadístiques i mètriques en temps real
- ✅ **Aprovació de repartidors** - Gestió de sol·licituds
- 📦 **Gestió de comandes** - Supervisió de totes les entregues

### Sostenibilitat

- 🚲 **Flota 100% elèctrica** - Bicicletes, patinets i furgonetes elèctriques
- 🌍 **Càlcul de CO₂** - Mostra l'impacte ecològic de cada comanda
- ♻️ **Embalatges ecològics** - Materials reciclats i biodegradables

## 🛠️ Stack Tecnològic

| Categoria         | Tecnologia                                |
| ----------------- | ----------------------------------------- |
| **Framework**     | [Astro 5.16](https://astro.build) amb SSR |
| **Llenguatge**    | TypeScript 5.x                            |
| **Estils**        | Tailwind CSS 3.x                          |
| **Base de dades** | MySQL 8.0                                 |
| **Autenticació**  | JWT + bcrypt                              |
| **Mapes**         | Google Maps API                           |
| **Runtime**       | Node.js 20+                               |

## 📁 Estructura del Projecte

```
FreshExpress/
├── public/
│   ├── logotip-cut.png
│   └── ...
├── src/
│   ├── components/
│   │   ├── headers/           # Headers per rol (Client, Repartidor, Admin)
│   │   ├── Footer.astro
│   │   ├── HeroSection.astro
│   │   └── ...
│   ├── layouts/
│   │   ├── Layout.astro       # Layout principal
│   │   └── LayoutSessio.astro # Layout per auth
│   ├── lib/
│   │   ├── auth.ts            # Autenticació JWT
│   │   ├── db.ts              # Connexió MySQL
│   │   └── tracking.ts        # Sistema de tracking
│   ├── pages/
│   │   ├── api/               # Endpoints API REST
│   │   │   ├── auth/          # Login, registre, logout
│   │   │   ├── cart/          # Cistella de compra
│   │   │   ├── repartidor/    # APIs de repartidor
│   │   │   ├── user/          # APIs d'usuari
│   │   │   └── admin/         # APIs d'administrador
│   │   ├── admin/             # Pàgines d'administrador
│   │   ├── repartidor/        # Pàgines de repartidor
│   │   ├── dashboard.astro    # Dashboard client
│   │   ├── productes.astro    # Catàleg de productes
│   │   ├── cistella.astro     # Cistella de compra
│   │   ├── checkout.astro     # Procés de compra
│   │   └── ...
│   └── styles/
│       └── global.css
├── sql/
│   ├── freshexpress_completa.sql
│   └── repartidors.sql
├── .env.example
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

## 🚀 Instal·lació

### Requisits previs

- Node.js 20 o superior
- MySQL 8.0 o superior
- npm o pnpm

### 1. Clonar el repositori

```bash
git clone https://github.com/el-teu-usuari/FreshExpress.git
cd FreshExpress
```

### 2. Instal·lar dependències

```bash
npm install
```

### 3. Configurar variables d'entorn

Copia el fitxer d'exemple i configura les variables:

```bash
cp .env.example .env
```

Edita `.env` amb les teves credencials:

```env
# Base de dades
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=la_teva_contrasenya
DB_NAME_OPERACIONAL=freshexpress_operacional
DB_NAME_BROKER=freshexpress_databroker

# Autenticació
JWT_SECRET=un_secret_molt_llarg_i_segur_minim_32_caracters

# Google Maps (opcional)
GOOGLE_MAPS_API_KEY=la_teva_api_key
```

### 4. Crear la base de dades

Executa els scripts SQL per crear l'estructura:

```bash
mysql -u root -p < sql/freshexpress_completa.sql
mysql -u root -p < sql/repartidors.sql
```

### 5. Executar en mode desenvolupament

```bash
npm run dev
```

Obre [http://localhost:4321](http://localhost:4321) al navegador.

### 6. Compilar per producció

```bash
npm run build
npm run preview
```

## 👥 Rols d'Usuari

### Client (`cliente`)

- Navegar i comprar productes
- Gestionar cistella i fer comandes
- Rastrejar entregues en temps real
- Valorar repartidors
- Gestionar perfil i adreces

### Repartidor (`repartidor`)

- Veure comandes disponibles
- Acceptar i gestionar entregues
- Marcar comandes com a entregades
- Reportar incidències
- Veure estadístiques i guanys

### Administrador (`admin`)

- Gestió completa d'usuaris
- Aprovar sol·licituds de repartidor
- Veure estadístiques globals
- Suspendre/activar usuaris
- Accés a totes les funcionalitats

## 🔌 API Endpoints

### Autenticació

| Mètode | Endpoint             | Descripció       |
| ------ | -------------------- | ---------------- |
| POST   | `/api/auth/login`    | Iniciar sessió   |
| POST   | `/api/auth/register` | Registrar usuari |
| POST   | `/api/auth/logout`   | Tancar sessió    |

### Cistella

| Mètode | Endpoint            | Descripció            |
| ------ | ------------------- | --------------------- |
| GET    | `/api/cart`         | Obtenir cistella      |
| POST   | `/api/cart/add`     | Afegir producte       |
| PUT    | `/api/cart/update`  | Actualitzar quantitat |
| DELETE | `/api/cart/remove`  | Eliminar producte     |
| POST   | `/api/cart/repetir` | Repetir comanda       |

### Repartidor

| Mètode | Endpoint                               | Descripció           |
| ------ | -------------------------------------- | -------------------- |
| GET    | `/api/repartidor/pedidos-disponibles`  | Comandes disponibles |
| POST   | `/api/repartidor/pedido/[id]/acceptar` | Acceptar comanda     |
| POST   | `/api/repartidor/pedido/[id]/entregar` | Marcar com entregada |
| POST   | `/api/repartidor/pedido/[id]/problema` | Reportar problema    |
| GET    | `/api/repartidor/estadistiques`        | Estadístiques        |

### Usuari

| Mètode | Endpoint                       | Descripció         |
| ------ | ------------------------------ | ------------------ |
| GET    | `/api/user/profile`            | Obtenir perfil     |
| PUT    | `/api/user/update-profile`     | Actualitzar perfil |
| POST   | `/api/user/valorar-repartidor` | Valorar repartidor |
| GET    | `/api/user/adreces`            | Llistar adreces    |

## 🧪 Testing

```bash
# Executar tests
npm run test

# Tests amb coverage
npm run test:coverage
```

## 📊 Sistema de Data Broker Ètic

FreshExpress implementa un model de Data Broker transparent i ètic:

### Principis

1. **Consentiment Explícit** - Els usuaris trien participar voluntàriament
2. **Anonimització** - Dades convertides en hash SHA-256 irreversibles
3. **Beneficis Compartits** - Descomptes per participants
4. **Transparència Total** - Documentació clara del que es recull

### Dades recollides (amb consentiment)

- ✅ Patrons de compra anonimitzats
- ✅ Comportament de navegació
- ✅ Preferències ecològiques
- ✅ Informació demogràfica general

### Dades MAI recollides

- ❌ Noms reals
- ❌ Adreces exactes
- ❌ Dades financeres
- ❌ Informació de salut

## 🧞 Comandes Disponibles

| Comanda           | Descripció                                   |
| ----------------- | -------------------------------------------- |
| `npm install`     | Instal·la dependències                       |
| `npm run dev`     | Servidor de desenvolupament (localhost:4321) |
| `npm run build`   | Compila per producció                        |
| `npm run preview` | Preview del build de producció               |
| `npm run astro`   | Executa comandes CLI d'Astro                 |

## 🤝 Contribuir

Les contribucions són benvingudes! Si vols contribuir:

1. Fes un fork del repositori
2. Crea una branca per la teva feature (`git checkout -b feature/nova-funcionalitat`)
3. Commit els canvis (`git commit -m 'Afegeix nova funcionalitat'`)
4. Push a la branca (`git push origin feature/nova-funcionalitat`)
5. Obre una Pull Request

## 📝 Llicència

Aquest projecte està sota la llicència MIT. Consulta el fitxer [LICENSE](LICENSE) per més detalls.

## 📧 Contacte

- **Email**: info@freshexpress.cat
- **Web**: [freshexpress.cat](https://freshexpress.cat)
- **Suport**: [/suport](https://freshexpress.cat/suport)

---

Fet amb 💚 a Catalunya per l'equip de FreshExpress
