# Documentació Tècnica - FreshExpress

## Guia Completa d'Arquitectura, Carpetes i Funcionament

---

## 📋 Taula de Continguts

1. [Visió General del Projecte](#1-visió-general-del-projecte)
2. [Estructura de Carpetes](#2-estructura-de-carpetes)
3. [Arquitectura del Sistema](#3-arquitectura-del-sistema)
4. [Frontend: Astro](#4-frontend-astro)
5. [Backend: REST API](#5-backend-rest-api)
6. [Base de Dades: MySQL](#6-base-de-dades-mysql)
7. [Flux de Dades](#7-flux-de-dades)
8. [Metodologia de Treball](#8-metodologia-de-treball)
9. [Deployment i Producció](#9-deployment-i-producció)

---

## 1. Visió General del Projecte

### Què és FreshExpress?

FreshExpress és una **plataforma de micro-logística ultra-ràpida** per a la comanda de productes frescos de Catalunya. El projecte està dividit en dues parts:

1. **Frontend (Astro)**: Aplicació web publicada a Vercel
2. **Backend (Node.js REST API)**: Servidor d'API al núvol Oracle Linux

### Tecnologies Principals

```
Frontend:
├── Astro 4.x          → Framework full-stack amb SSR
├── TypeScript         → Tipat estàtic
├── Tailwind CSS       → Estils utility-first
└── JavaScript Vanilla → Interactivitat client-side

Backend:
├── Node.js 20.x       → Runtime JavaScript
├── Express 4.x        → Framework web minimalista
├── mysql2             → Driver MySQL amb promises
└── CORS               → Permisos cross-origin

Base de Dades:
└── MySQL 8.x          → Base de dades relacional

Deployment:
├── Vercel             → Hosting del frontend
└── Oracle Linux       → Servidor VPS per l'API
```

---

## 2. Estructura de Carpetes

### 📁 Arrel del Projecte Frontend (c:\dev\FreshExpress)

```
c:\dev\FreshExpress/
│
├── src/                          ← Codi font principal
│   ├── components/               ← Components reutilitzables d'Astro
│   │   ├── Avantatges.astro
│   │   ├── ComFunciona.astro
│   │   ├── Contacte.astro
│   │   ├── CrearCompte.astro
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── HeroSection.astro
│   │   ├── IniciSessio.astro
│   │   ├── Restreo.astro
│   │   └── headers/              ← Headers específics per rol
│   │       ├── HeaderAdmin.astro
│   │       ├── HeaderClient.astro
│   │       ├── HeaderClientMode.astro
│   │       ├── HeaderPublic.astro
│   │       └── HeaderRepartidor.astro
│   │
│   ├── layouts/                  ← Plantilles de pàgina
│   │   ├── Layout.astro          ← Layout principal amb <head>, <body>
│   │   └── LayoutSessio.astro    ← Layout per login/registre
│   │
│   ├── lib/                      ← Llibreries i utilitats
│   │   ├── auth.ts               ← Autenticació JWT
│   │   ├── db.ts                 ← Connexió a MySQL
│   │   └── tracking.ts           ← Sistema de rastreig de comandes
│   │
│   ├── pages/                    ← Pàgines (rutes automàtiques)
│   │   ├── index.astro           ← Pàgina d'inici (/)
│   │   ├── login.astro           ← Login (/login)
│   │   ├── registre.astro        ← Registre (/registre)
│   │   ├── productes.astro       ← ⭐ Catàleg d'empreses i productes
│   │   ├── cistella.astro        ← Cistella de la compra
│   │   ├── checkout.astro        ← Pagament i finalització
│   │   ├── dashboard.astro       ← ⭐ Panel de control d'usuari
│   │   ├── historial.astro       ← Historial de comandes
│   │   ├── configuracio.astro    ← Configuració de compte
│   │   ├── rastreig.astro        ← Rastreig de comandes
│   │   ├── seguiment.astro       ← Seguiment en temps real
│   │   ├── admin.astro           ← Panel admin (legacy)
│   │   ├── avis-legal.astro
│   │   ├── com-funciona.astro
│   │   ├── cobertura.astro
│   │   ├── contacte.astro
│   │   ├── faq.astro
│   │   ├── politica-cookies.astro
│   │   ├── politica-dades.astro
│   │   ├── politica-privacitat.astro
│   │   ├── recuperar-contrasenya.astro
│   │   ├── sobre-nosaltres.astro
│   │   ├── suport.astro
│   │   ├── termes-condicions.astro
│   │   ├── termes-repartidor.astro
│   │   │
│   │   ├── admin/                ← Pàgines d'administració (/admin/*)
│   │   │   ├── dashboard.astro
│   │   │   ├── configuracio.astro
│   │   │   ├── databroker.astro
│   │   │   ├── historial.astro
│   │   │   └── solicituds.astro
│   │   │
│   │   ├── api/                  ← ⚠️ API Routes d'Astro (INTERNES, no REST)
│   │   │   ├── rastreig.ts
│   │   │   ├── track.ts
│   │   │   ├── auth/
│   │   │   │   ├── login.ts      ← POST /api/auth/login
│   │   │   │   ├── logout.ts     ← POST /api/auth/logout
│   │   │   │   ├── me.ts         ← GET /api/auth/me
│   │   │   │   └── register.ts   ← POST /api/auth/register
│   │   │   ├── cart/
│   │   │   │   ├── add.ts        ← POST /api/cart/add
│   │   │   │   ├── count.ts      ← GET /api/cart/count
│   │   │   │   └── [id].ts       ← DELETE /api/cart/:id
│   │   │   ├── checkout/
│   │   │   │   └── ...
│   │   │   ├── repartidor/
│   │   │   ├── seguiment/
│   │   │   ├── setup/
│   │   │   ├── user/
│   │   │   └── admin/
│   │   │       ├── solicituds-repartidor.ts
│   │   │       ├── update-images.ts
│   │   │       └── databroker/
│   │   │           └── users/
│   │   │
│   │   └── repartidor/           ← Pàgines per repartidors (/repartidor/*)
│   │       ├── index.astro
│   │       ├── compte.astro
│   │       ├── configuracio.astro
│   │       ├── guanys.astro
│   │       ├── historial.astro
│   │       └── ruta.astro
│   │
│   └── styles/
│       └── global.css            ← Estils globals + Tailwind
│
├── public/                       ← Fitxers estàtics (servits directament)
│   ├── img/
│   │   ├── empresas/             ← Logos d'empreses
│   │   └── productos/            ← Imatges de productes
│   └── js/
│       └── tracking.js           ← Script de rastreig client
│
├── scripts/                      ← Scripts d'utilitats
│   ├── download-all-product-images.sh
│   ├── download-images-pexels.sh
│   ├── download-images.sh
│   └── update-images.ts
│
├── sql/                          ← Scripts SQL
│   ├── freshexpress_completa.sql ← Base de dades completa
│   ├── empreses_productes.sql
│   ├── add_activo_column.sql
│   ├── add_patinet_vehiculo.sql
│   ├── fix_consentimientos.sql
│   ├── remove_recibir_ofertas.sql
│   ├── repartidors.sql
│   ├── update_images.sql
│   ├── update_logos.sql
│   ├── update_product_images.sql
│   └── verificar_consentiments.sql
│
├── astro.config.mjs              ← Configuració d'Astro
├── tailwind.config.mjs           ← Configuració de Tailwind CSS
├── tsconfig.json                 ← Configuració de TypeScript
├── package.json                  ← Dependències npm
├── README.md                     ← Documentació del projecte
├── CONTRIBUTING.md               ← Guia de contribució
├── LICENSE                       ← Llicència MIT
├── DATA_BROKER_PRESENTACION.md   ← Presentació Data Broker
└── DOCUMENTACIO_TECNICA.md       ← Aquest document
```

### 📁 Projecte Backend - REST API (Servidor Oracle Linux)

```
~/api-freshexpress/               ← Al servidor 143.47.36.36
│
├── index.js                      ← Servidor Express principal
├── routes/
│   └── index.routes.js           ← Definició de totes les rutes
├── controladors/
│   └── index.controllers.js      ← Lògica de negoci dels endpoints
├── config/
│   └── db.js                     ← Connexió pool MySQL
├── package.json                  ← Dependències (express, mysql2, cors)
├── package-lock.json
└── node_modules/
```

---

## 3. Arquitectura del Sistema

### 🏗️ Diagrama d'Arquitectura Completa

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CAPA DE CLIENT                                │
│                      (Navegador d'Usuari)                            │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         │ HTTPS (Vercel CDN)
                         ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    FRONTEND - ASTRO (SSR)                            │
│                     Hostat a Vercel                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Server-Side Rendering (Node.js)                             │   │
│  │  - Genera HTML dinàmic amb dades de l'API                    │   │
│  │  - Autentica usuaris amb JWT                                 │   │
│  │  - Gestiona cookies de sessió                                │   │
│  └─────────────────┬───────────────────────────────────────────┘   │
│                    │                                                 │
│  ┌─────────────────▼───────────────────────────────────────────┐   │
│  │  API Routes Internes d'Astro (/api/*)                        │   │
│  │  - /api/auth/login       → Autenticació                      │   │
│  │  - /api/cart/add         → Afegir producte                   │   │
│  │  - /api/checkout/create  → Crear comanda                     │   │
│  │  (Consulten DIRECTAMENT la base de dades MySQL)              │   │
│  └───────────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         │ HTTP (dins Vercel)
                         │ Consultes SQL directes a MySQL
                         ↓
                         │
                         │ ⚠️ PROBLEMA: Vercel (HTTPS) → API (HTTP)
                         │    Mixed Content bloqueig pels navegadors
                         │
                         │ ✅ SOLUCIÓ: Peticions des del SERVIDOR
                         │    El servidor Astro pot fer HTTP sense problema
                         ↓
┌─────────────────────────────────────────────────────────────────────┐
│              BACKEND - REST API (DATA BROKER)                        │
│                 Servidor Oracle Linux VPS                            │
│                   IP: 143.47.36.36:3000                              │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Express.js Server (Node.js 20.x)                             │  │
│  │                                                                │  │
│  │  CORS habilitado:                                              │  │
│  │  - localhost:4321 (desenvolupament)                            │  │
│  │  - Vercel domains (producció)                                 │  │
│  └────────────┬───────────────────────────────────────────────────┘│
│               │                                                      │
│  ┌────────────▼─────────────────────────────────────────────────┐  │
│  │  Routes (routes/index.routes.js)                              │  │
│  │  - GET  /health          → Health check                       │  │
│  │  - GET  /empresas        → Llistat d'empreses                 │  │
│  │  - GET  /stats/:userId   → Estadístiques d'usuari             │  │
│  │  - GET  /stats/global    → Estadístiques globals              │  │
│  └────────────┬─────────────────────────────────────────────────┘  │
│               │                                                      │
│  ┌────────────▼─────────────────────────────────────────────────┐  │
│  │  Controllers (controladors/index.controllers.js)              │  │
│  │                                                                │  │
│  │  DOBLE FUNCIÓ (Data Broker):                                  │  │
│  │  1. Consultar MySQL i retornar dades                          │  │
│  │  2. Registrar cada petició a api_access_log                   │  │
│  │                                                                │  │
│  │  Exemples:                                                     │  │
│  │  - getEmpresasDisponibles()                                    │  │
│  │  - getUserStats()                                              │  │
│  │  - getGlobalStats()                                            │  │
│  └────────────┬─────────────────────────────────────────────────┘  │
└───────────────┼──────────────────────────────────────────────────────┘
                │
                │ mysql2 Connection Pool
                │
                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                     BASE DE DADES MYSQL                              │
│                  freshexpress_operacional                            │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Taules Principals:                                           │  │
│  │  - usuarios             → Usuaris registrats                  │  │
│  │  - empresas             → Empreses proveïdores                │  │
│  │  - productos            → Catàleg de productes                │  │
│  │  - pedidos              → Comandes realitzades                │  │
│  │  - detalle_pedido       → Línia de comanda                    │  │
│  │  - carrito              → Cistella temporal                   │  │
│  │  - repartidores         → Repartidors actius                  │  │
│  │  - direcciones          → Adreces d'enviament                 │  │
│  │  - seguimiento_pedido   → Tracking en temps real              │  │
│  │  - api_access_log       → 🔥 LOG del Data Broker             │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 🔄 Separació de Responsabilitats

| Component               | Responsabilitat                                | Tecnologia                    |
| ----------------------- | ---------------------------------------------- | ----------------------------- |
| **Frontend (Astro)**    | Renderitzar UI, gestionar sessions, routing    | Astro + TypeScript + Tailwind |
| **API Routes Internes** | Lògica de negoci (login, cistella, checkout)   | Astro API Routes + MySQL      |
| **REST API Externa**    | Data Broker, estadístiques, agregació de dades | Node.js + Express + MySQL     |
| **Base de Dades**       | Persistència de dades                          | MySQL 8.x                     |

---

## 4. Frontend: Astro

### 4.1. Què és Astro?

**Astro** és un framework web modern que permet:

- **Server-Side Rendering (SSR)**: Genera HTML al servidor abans d'enviar-lo al client
- **Islands Architecture**: JavaScript només on cal (components interactius aïllats)
- **File-based Routing**: Cada fitxer a `src/pages/` és una ruta automàtica
- **Zero JS by default**: Envia menys JavaScript al client (més ràpid)

### 4.2. Estructura d'un Fitxer .astro

```astro
---
// ⬆️ FRONTMATTER: Codi que s'executa al SERVIDOR
import Layout from '../layouts/Layout.astro';
import { verifyToken } from '../lib/auth';

const token = Astro.cookies.get('auth_token')?.value;
const user = token ? verifyToken(token) : null;

if (!user) {
  return Astro.redirect('/login');
}

// Consulta a la base de dades (només servidor)
const data = await fetch('http://143.47.36.36:3000/empresas');
const empresas = await data.json();
---

<!-- ⬇️ TEMPLATE: HTML + components d'Astro -->
<Layout title="Productes - FreshExpress">
  <div class="container">
    <h1>Benvingut, {user.nombre}!</h1>

    {empresas.map(emp => (
      <div class="empresa-card">
        <h2>{emp.nombre}</h2>
        <p>{emp.descripcion}</p>
      </div>
    ))}
  </div>
</Layout>

<script>
  // ⬇️ JAVASCRIPT CLIENT-SIDE: S'executa al navegador
  document.querySelector('.btn').addEventListener('click', () => {
    alert('Botó premut!');
  });
</script>

<style>
  /* ⬇️ CSS: Estils del component */
  .empresa-card {
    border: 1px solid #ccc;
    padding: 1rem;
  }
</style>
```

### 4.3. Routing d'Astro (File-based)

El sistema de rutes és automàtic segons l'estructura de fitxers:

```
src/pages/index.astro                → https://freshexpress.vercel.app/
src/pages/productes.astro            → /productes
src/pages/login.astro                → /login
src/pages/admin/dashboard.astro      → /admin/dashboard
src/pages/api/auth/login.ts          → /api/auth/login (endpoint)
src/pages/repartidor/index.astro     → /repartidor
src/pages/repartidor/ruta.astro      → /repartidor/ruta
```

**Rutes Dinàmiques:**

```
src/pages/api/cart/[id].ts           → /api/cart/123
                                        (Astro.params.id === "123")
```

### 4.4. Components vs Pages

| **Components** (`src/components/`)      | **Pages** (`src/pages/`)              |
| --------------------------------------- | ------------------------------------- |
| Reutilitzables                          | Rutes de l'aplicació                  |
| No tenen ruta pròpia                    | Tenen URL pròpia                      |
| S'importen a altres fitxers             | Són el punt d'entrada                 |
| Exemple: `Header.astro`, `Footer.astro` | Exemple: `index.astro`, `login.astro` |

### 4.5. Layouts

Els **layouts** són plantilles que encapsulen codi comú (HTML `<head>`, `<header>`, `<footer>`):

**`src/layouts/Layout.astro`:**

```astro
---
interface Props {
  title: string;
}
const { title } = Astro.props;
---

<!DOCTYPE html>
<html lang="ca">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <link rel="stylesheet" href="/styles/global.css">
</head>
<body>
  <header>
    <nav><!-- Navigation --></nav>
  </header>

  <main>
    <slot /> <!-- ⭐ Aquí s'insereix el contingut de la pàgina filla -->
  </main>

  <footer>
    <p>&copy; 2026 FreshExpress</p>
  </footer>
</body>
</html>
```

**Ús del layout a una pàgina:**

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="Inici - FreshExpress">
  <h1>Benvingut a FreshExpress</h1>
  <p>Contingut de la pàgina...</p>
</Layout>
```

### 4.6. API Routes Internes d'Astro

Astro permet crear **endpoints API** directament dins del projecte:

**`src/pages/api/auth/login.ts`:**

```typescript
import type { APIRoute } from "astro";
import { query } from "../../../lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { email, password } = await request.json();

    // Buscar usuari a la base de dades
    const [user] = await query("SELECT * FROM usuarios WHERE correo = ?", [
      email,
    ]);

    if (!user || !(await bcrypt.compare(password, user.contrasenya_hash))) {
      return new Response(JSON.stringify({ error: "Credencials invàlids" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generar JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    // Guardar token en cookie
    cookies.set("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 dies
    });

    return new Response(JSON.stringify({ success: true, user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error del servidor" }), {
      status: 500,
    });
  }
};
```

**Diferència entre API Routes Internes i REST API Externa:**

| API Routes Internes (Astro)            | REST API Externa (Node.js)          |
| -------------------------------------- | ----------------------------------- |
| Dins del projecte Astro                | Servidor independent                |
| Mateix domini (Vercel)                 | Domini diferent (143.47.36.36:3000) |
| Per lògica de negoci (login, cistella) | Per agregació i Data Broker         |
| Consulta directa MySQL                 | Consulta + tracking                 |

### 4.7. Llibreries Internes (`src/lib/`)

#### `src/lib/db.ts` - Connexió MySQL

```typescript
import mysql from "mysql2/promise";

// Pool de connexions per Astro (consultes directes)
const poolOperacional = mysql.createPool({
  host: process.env.DB_HOST_OPERACIONAL || "localhost",
  user: process.env.DB_USER_OPERACIONAL || "root",
  password: process.env.DB_PASSWORD_OPERACIONAL || "",
  database: process.env.DB_NAME_OPERACIONAL || "freshexpress_operacional",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function queryOperacional<T>(
  sql: string,
  params?: any[]
): Promise<T> {
  const [rows] = await poolOperacional.execute(sql, params);
  return rows as T;
}
```

#### `src/lib/auth.ts` - Autenticació JWT

```typescript
import jwt from "jsonwebtoken";
import { queryOperacional } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

export interface JWTPayload {
  userId: number;
  iat: number;
  exp: number;
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export async function getUserById(userId: number) {
  const [user] = await queryOperacional<any[]>(
    "SELECT id, nombre, correo, telefono, rol FROM usuarios WHERE id = ?",
    [userId]
  );
  return user || null;
}
```

---

## 5. Backend: REST API

### 5.1. Per què una REST API Separada?

**Motivacions:**

1. **Data Broker**: Registrar totes les peticions per vendre dades agregades
2. **Separació de responsabilitats**: Lògica de negoci vs. agregació de dades
3. **Escalabilitat**: Pot servir múltiples frontends (web, app mòbil, etc.)
4. **Demostració educativa**: Mostrar arquitectura client-servidor real

### 5.2. Servidor Express (`index.js`)

```javascript
const express = require("express");
const cors = require("cors");
const routes = require("./routes/index.routes");

const app = express();
const PORT = 3000;

// ⭐ CORS: Permetre peticions des del frontend
app.use(
  cors({
    origin: [
      "http://localhost:4321", // Desenvolupament local
      "https://freshexpress.vercel.app", // Producció Vercel
      "http://143.47.36.36", // Servidor directe
    ],
    credentials: true, // Permetre cookies
  })
);

// Middleware per parsear JSON
app.use(express.json());

// Logging de peticions
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rutas de l'API
app.use("/", routes);

// Iniciar servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API Data Broker escuchando en http://143.47.36.36:${PORT}`);
});
```

### 5.3. Routes (`routes/index.routes.js`)

```javascript
const express = require("express");
const router = express.Router();
const {
  healthCheck,
  getEmpresasDisponibles,
  getUserStats,
  getGlobalStats,
} = require("../controladors/index.controllers");

// Health check
router.get("/health", healthCheck);

// Endpoints del Data Broker
router.get("/empresas", getEmpresasDisponibles);
router.get("/stats/global", getGlobalStats); // ⚠️ Abans de /:userId
router.get("/stats/:userId", getUserStats);

module.exports = router;
```

**⚠️ Ordre de les rutes importa!**

- `/stats/global` ha d'anar **abans** de `/stats/:userId`
- Si no, Express interpreta "global" com a valor de `:userId`

### 5.4. Controllers (`controladors/index.controllers.js`)

#### Exemple: `getEmpresasDisponibles()`

```javascript
const pool = require("../config/db");

/**
 * GET /empresas
 * Retorna totes les empreses actives
 *
 * ⭐ DATA BROKER: Registra cada petició a api_access_log
 */
const getEmpresasDisponibles = async (req, res) => {
  try {
    console.log("📋 Sol·licitud d'empreses rebuda");

    // 1️⃣ REGISTRAR PETICIÓ (Data Broker)
    try {
      await pool.query(
        "INSERT INTO api_access_log (endpoint, ip_address, user_agent, timestamp) VALUES (?, ?, ?, NOW())",
        [
          "/empresas",
          req.ip || req.connection.remoteAddress,
          req.headers["user-agent"],
        ]
      );
    } catch (logError) {
      console.warn(
        "⚠️ No s'ha pogut registrar a api_access_log:",
        logError.message
      );
    }

    // 2️⃣ CONSULTAR DADES
    const [empresas] = await pool.query(`
      SELECT 
        id, 
        nombre, 
        logoUrl, 
        descripcion, 
        categoria, 
        valoracion_media
      FROM empresas 
      WHERE activo = 1
      ORDER BY nombre ASC
    `);

    console.log(`✅ ${empresas.length} empreses retornades`);

    // 3️⃣ RESPOSTA JSON
    res.json({
      success: true,
      total: empresas.length,
      empresas,
    });
  } catch (error) {
    console.error("❌ Error obteniendo empresas:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor",
    });
  }
};

module.exports = {
  healthCheck,
  getEmpresasDisponibles,
  getUserStats,
  getGlobalStats,
};
```

#### Exemple: `getUserStats()`

```javascript
const getUserStats = async (req, res) => {
  const { userId } = req.params;

  // Validar userId
  if (!userId || isNaN(userId)) {
    return res.status(400).json({
      success: false,
      message: "ID d'usuari invàlid",
    });
  }

  try {
    // Registrar petició (Data Broker)
    await pool.query(
      "INSERT INTO api_access_log (endpoint, user_id, ip_address) VALUES (?, ?, ?)",
      [`/stats/${userId}`, parseInt(userId), req.ip]
    );

    // Consultar estadístiques
    const [stats] = await pool.query(
      `
      SELECT 
        COUNT(*) AS total_comandes,
        COALESCE(SUM(total), 0) AS total_gastat,
        COALESCE(SUM(puntos_ganados), 0) AS punts_acumulats
      FROM pedidos
      WHERE usuario_id = ? AND estado != 'cancelado'
    `,
      [userId]
    );

    res.json({
      success: true,
      userId: parseInt(userId),
      stats: stats[0],
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
};
```

### 5.5. Connexió MySQL (`config/db.js`)

```javascript
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "api2",
  password: "la_teva_contrasenya",
  database: "freshexpress_operacional",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test de connexió inicial
pool
  .getConnection()
  .then((connection) => {
    console.log("✅ MySQL conectado correctamente");
    connection.release();
  })
  .catch((err) => {
    console.error("❌ Error conectando a MySQL:", err);
  });

module.exports = pool;
```

---

## 6. Base de Dades: MySQL

### 6.1. Taules Principals

#### `usuarios`

```sql
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(150) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  contrasenya_hash VARCHAR(255) NOT NULL,
  rol ENUM('cliente', 'admin', 'repartidor') DEFAULT 'cliente',
  puntos INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `empresas`

```sql
CREATE TABLE empresas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  logoUrl VARCHAR(255),
  descripcion TEXT,
  categoria VARCHAR(50),
  direccion VARCHAR(255),
  telefono VARCHAR(20),
  email VARCHAR(150),
  valoracion_media DECIMAL(3,2) DEFAULT 5.00,
  activo BOOLEAN DEFAULT TRUE
);
```

#### `productos`

```sql
CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  categoria VARCHAR(50),
  precio DECIMAL(10,2) NOT NULL,
  precio_oferta DECIMAL(10,2),
  unidad VARCHAR(20) DEFAULT 'kg',
  imagen VARCHAR(255),
  destacado BOOLEAN DEFAULT FALSE,
  activo BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id)
);
```

#### `pedidos`

```sql
CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  direccion_id INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  estado ENUM('pendiente', 'preparando', 'en_camino', 'entregado', 'cancelado') DEFAULT 'pendiente',
  puntos_ganados INT DEFAULT 0,
  tracking_code VARCHAR(50) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (direccion_id) REFERENCES direcciones(id)
);
```

#### `api_access_log` ⭐ (Data Broker)

```sql
CREATE TABLE api_access_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  endpoint VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  user_id INT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  response_time INT,
  INDEX idx_endpoint (endpoint),
  INDEX idx_timestamp (timestamp),
  INDEX idx_user_id (user_id)
);
```

---

## 7. Flux de Dades

### 7.1. Flux de Càrrega de Productes (SSR)

```
1. Usuari visita https://freshexpress.vercel.app/productes
   │
   ↓
2. Servidor d'Astro (Vercel) executa productes.astro
   │
   ├─→ Comprova JWT (cookie auth_token)
   │   └─→ Si invàlid: redirect a /login
   │
   ├─→ Fa fetch() a http://143.47.36.36:3000/empresas (SERVER-SIDE)
   │   │
   │   ├─→ REST API rep petició
   │   ├─→ Registra a api_access_log
   │   ├─→ Consulta MySQL: SELECT * FROM empresas WHERE activo = 1
   │   └─→ Retorna JSON: { success: true, empresas: [...] }
   │
   ├─→ Astro rep les empreses i les agrupa per categoria
   │
   └─→ Genera HTML amb les empreses renderitzades
   │
   ↓
3. Servidor envia HTML complet al navegador
   │
   ↓
4. Navegador mostra la pàgina (amb dades ja carregades)
```

**⭐ Avantatge de SSR:**

- L'usuari veu contingut immediatament (no veu "Carregant...")
- SEO friendly (Google veu el contingut)
- No hi ha problema de Mixed Content (HTTPS → HTTP) perquè la petició es fa des del servidor

### 7.2. Flux d'Afegir Producte a la Cistella (Client-Side)

```
1. Usuari clica "Afegir a cistella" (botó amb JavaScript)
   │
   ↓
2. Event listener captura el clic
   │
   ├─→ Obté productId, quantity del DOM
   │
   └─→ Fa fetch() a /api/cart/add (API Route Interna)
       │
       ├─→ POST { productId: 123, quantity: 2 }
       │
       ↓
3. Servidor Astro (/api/cart/add.ts) rep la petició
   │
   ├─→ Verifica JWT (cookie auth_token)
   │   └─→ Si invàlid: retorna 401 Unauthorized
   │
   ├─→ Consulta MySQL:
   │   INSERT INTO carrito (usuario_id, producto_id, cantidad)
   │   VALUES (userId, productId, quantity)
   │   ON DUPLICATE KEY UPDATE cantidad = cantidad + quantity
   │
   └─→ Retorna JSON: { success: true }
   │
   ↓
4. JavaScript client rep resposta
   │
   ├─→ Actualitza comptador de cistella (#cart-count)
   │
   └─→ Mostra feedback visual ("✓ Afegit!")
```

### 7.3. Flux de Dashboard amb Estadístiques (Híbrid)

```
1. Usuari visita /dashboard
   │
   ↓
2. Astro SSR genera pàgina base
   │
   ├─→ Comprova autenticació (JWT)
   │
   ├─→ Renderitza HTML amb divs buits:
   │   <div id="stat-total-comandes">Carregant...</div>
   │
   └─→ Afegeix <script> que fa fetch() al client
   │
   ↓
3. HTML arriba al navegador i s'executa el <script>
   │
   ├─→ Obté userId del DOM (data-user-id)
   │
   ├─→ Fa fetch() a http://143.47.36.36:3000/stats/{userId}
   │   │
   │   ├─→ REST API consulta MySQL
   │   ├─→ Registra petició a api_access_log
   │   └─→ Retorna stats: { total_comandes: 5, punts: 150 }
   │
   └─→ JavaScript actualitza els divs amb les dades reals
       document.getElementById('stat-total-comandes').textContent = data.total_comandes;
```

**⚠️ Nota sobre Mixed Content:**

- ✅ Funciona perquè el fetch() es fa des del **client** (navegador)
- ❌ Si la web és HTTPS i l'API HTTP, els navegadors moderns ho bloquegen
- ✅ Solució: Fer peticions des del **servidor** (SSR) com a `productes.astro`

---

## 8. Metodologia de Treball

### 8.1. Enfocament Incremental

El projecte s'ha desenvolupat de forma **incremental**:

1. **Fase 1**: Aplicació monolítica (tot a Astro, consultes SQL directes)
2. **Fase 2**: Separar lògica d'autenticació (API Routes internes)
3. **Fase 3**: Crear REST API externa per estadístiques (Data Broker)
4. **Fase 4**: Migrar consultes SSR a REST API per evitar Mixed Content

### 8.2. Patró de Desenvolupament

```
1. Identificar necessitat
   ↓
2. Decidir on implementar-la:
   - Frontend SSR (Astro) → Renderitzar UI
   - API Route interna → Lògica de negoci
   - REST API externa → Agregació/Data Broker
   ↓
3. Implementar + testejar localment
   ↓
4. Comprovar errors (TypeScript, ESLint)
   ↓
5. Deploy:
   - Frontend → git push + Vercel auto-deploy
   - API → scp + restart nodemon
   ↓
6. Verificar en producció
```

### 8.3. Gestió d'Errors

**Frontend (Astro):**

```typescript
try {
  const response = await fetch("http://143.47.36.36:3000/empresas");
  if (!response.ok) throw new Error("API error");
  const data = await response.json();
  empreses = data.empresas;
} catch (error) {
  console.error("Error carregant empreses:", error);
  empreses = []; // Fallback a array buit
}
```

**Backend (Express):**

```javascript
app.use((err, req, res, next) => {
  console.error("❌ Error no capturat:", err);
  res.status(500).json({
    success: false,
    message: "Error intern del servidor",
  });
});
```

### 8.4. Git Workflow

```bash
# Desenvolupament local
git pull origin main
# ... fer canvis ...
git add .
git commit -m "feat: afegir endpoint /empresas"
git push origin main

# Al servidor (REST API)
cd ~/api-freshexpress
git pull origin main
npm install  # si hi ha noves dependències
pkill -f nodemon  # reiniciar servidor
nodemon index.js &
```

---

## 9. Deployment i Producció

### 9.1. Frontend (Vercel)

**Configuració automàtica:**

- Vercel detecta `astro.config.mjs` i configura el build automàticament
- Cada push a `main` desencadena un deploy automàtic
- Variables d'entorn configurades a Vercel Dashboard

**Variables d'entorn (Vercel):**

```
DB_HOST_OPERACIONAL=mysql-host.com
DB_USER_OPERACIONAL=root
DB_PASSWORD_OPERACIONAL=********
DB_NAME_OPERACIONAL=freshexpress_operacional
JWT_SECRET=super_secret_key_production
```

**Build command:**

```bash
npm run build
```

**Output directory:**

```
dist/
```

### 9.2. Backend (Oracle Linux VPS)

**Ubicació:**

```
IP: 143.47.36.36
Path: ~/api-freshexpress/
```

**Iniciar servidor:**

```bash
cd ~/api-freshexpress
nodemon index.js &
```

**Per producció (PM2 recomanat):**

```bash
npm install -g pm2
pm2 start index.js --name "api-freshexpress"
pm2 save
pm2 startup  # Auto-start al reiniciar
```

**Firewall (obrir port 3000):**

```bash
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

### 9.3. Base de Dades (MySQL)

**Crear usuari per l'API:**

```sql
CREATE USER 'api2'@'%' IDENTIFIED BY 'la_teva_contrasenya';
GRANT SELECT, INSERT ON freshexpress_operacional.* TO 'api2'@'%';
FLUSH PRIVILEGES;
```

**Backup periòdic:**

```bash
mysqldump -u root -p freshexpress_operacional > backup_$(date +%Y%m%d).sql
```

---

## 10. Resum Tècnic per Presentació

### Punts Clau a Explicar:

1. **Arquitectura híbrida**: Frontend (Astro SSR) + REST API (Node.js) + MySQL
2. **Astro**: SSR per performance, Islands per interactivitat selectiva
3. **Data Broker**: L'API no només serveix dades, també les registra per monetitzar-les
4. **Separació de responsabilitats**: API Routes internes vs. REST API externa
5. **SSR vs. Client-Side**: Peticions des del servidor eviten problemes de Mixed Content
6. **TypeScript**: Tipat estàtic per menys errors en producció
7. **Deployment**: Vercel (frontend) + VPS (backend) per demostrar infraestructura real

---

**Última actualització:** 13 de gener de 2026  
**Autor:** Lucho Portuano  
**Versió:** 1.0
