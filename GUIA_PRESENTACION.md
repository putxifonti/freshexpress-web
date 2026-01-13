# FreshExpress - Explicació General per Presentació

## Tot el que necessites saber per defensar el projecte

---

## 📌 Què és FreshExpress?

FreshExpress és una **plataforma web de micro-logística ultra-ràpida** per comprar productes frescos de Catalunya. Els usuaris poden:

- 🛒 Comprar productes de botigues locals
- 📍 Rastrejar les seves comandes en temps real
- ⭐ Acumular punts per descomptes
- 🚚 Rebre els productes en menys de 30 minuts

---

## 🎯 Objectiu del Projecte

**Demostrar una arquitectura client-servidor real amb Data Broker**, on:

1. **Frontend (Astro)**: Mostra la informació als usuaris
2. **Backend (REST API)**: Serveix dades i **registra cada petició** per vendre informació agregada
3. **Base de Dades (MySQL)**: Emmagatzema totes les dades

**L'element clau:** La REST API actua com a **Data Broker** → cada cop que algú consulta empreses o estadístiques, ho registrem per generar informes que es poden vendre a tercers.

---

## 🏗️ Arquitectura: Com Funciona Tot Plegat

### Diagrama Simplificat

```
┌─────────────┐
│  NAVEGADOR  │  ← Usuari visita freshexpress.vercel.app
└──────┬──────┘
       │
       │ HTTPS
       ↓
┌─────────────────────────────────┐
│    FRONTEND (Astro + Vercel)    │
│  - Genera HTML al servidor      │
│  - Gestiona sessions (JWT)      │
│  - Consulta la REST API         │
└──────┬──────────────────────────┘
       │
       │ HTTP fetch()
       ↓
┌─────────────────────────────────┐
│ REST API (Node.js + Express)    │
│  143.47.36.36:3000               │
│  - Consulta MySQL                │
│  - Registra cada petició         │ ← Data Broker
│  - Retorna JSON                  │
└──────┬──────────────────────────┘
       │
       │ SQL queries
       ↓
┌─────────────────────────────────┐
│      MySQL Database             │
│  freshexpress_operacional       │
│  - Usuaris, empreses, productes │
│  - Comandes, cistella           │
│  - api_access_log (tracking)    │ ← Logs del Data Broker
└─────────────────────────────────┘
```

---

## 💡 Per què aquesta Arquitectura?

### Arquitectura Tradicional (Monolítica)

```
Navegador → Astro → MySQL
```

**Problemes:**

- ❌ No sabem què consulten els usuaris
- ❌ No podem vendre dades a tercers
- ❌ Tota la lògica en un sol lloc

### Arquitectura Actual (Client-Servidor amb Data Broker)

```
Navegador → Astro → REST API → MySQL
                       ↓
               api_access_log (tracking)
```

**Avantatges:**

- ✅ Cada petició queda registrada
- ✅ Podem generar informes de dades agregades
- ✅ Separació de responsabilitats
- ✅ L'API pot servir altres clients (app mòbil, etc.)

---

## 🛠️ Tecnologies Utilitzades

### Frontend

| Tecnologia       | Per què?                                                                 |
| ---------------- | ------------------------------------------------------------------------ |
| **Astro**        | Framework modern amb SSR (renderitza HTML al servidor abans d'enviar-lo) |
| **TypeScript**   | Evita errors amb tipat estàtic                                           |
| **Tailwind CSS** | Estils ràpids amb classes predefinides                                   |

**Exemple de codi Astro:**

```astro
---
// Codi que s'executa al SERVIDOR
const empreses = await fetch('http://143.47.36.36:3000/empresas');
const data = await empreses.json();
---

<!-- HTML que es genera al servidor -->
<h1>Empreses disponibles</h1>
{data.empresas.map(emp => (
  <div class="empresa-card">
    <h2>{emp.nombre}</h2>
  </div>
))}
```

### Backend

| Tecnologia  | Per què?                                                |
| ----------- | ------------------------------------------------------- |
| **Node.js** | JavaScript al servidor (mateix llenguatge que frontend) |
| **Express** | Framework minimalista per crear APIs                    |
| **mysql2**  | Driver per connectar amb MySQL                          |
| **CORS**    | Permetre peticions des de diferents dominis             |

**Exemple de codi Express:**

```javascript
// GET /empresas
router.get("/empresas", async (req, res) => {
  // 1. Registrar la petició (Data Broker)
  await pool.query(
    "INSERT INTO api_access_log (endpoint, ip_address) VALUES (?, ?)",
    ["/empresas", req.ip]
  );

  // 2. Obtenir dades
  const [empresas] = await pool.query(
    "SELECT * FROM empresas WHERE activo = 1"
  );

  // 3. Retornar JSON
  res.json({ success: true, empresas });
});
```

### Base de Dades

| Tecnologia | Per què?                                        |
| ---------- | ----------------------------------------------- |
| **MySQL**  | Base de dades relacional (taules amb relacions) |

---

## 📂 Estructura del Projecte

### Frontend (Astro)

```
src/
├── pages/                ← Cada fitxer = 1 pàgina web
│   ├── index.astro       → /  (pàgina d'inici)
│   ├── login.astro       → /login
│   ├── productes.astro   → /productes ⭐
│   ├── dashboard.astro   → /dashboard ⭐
│   └── api/              ← Endpoints interns (login, cistella, etc.)
│       └── auth/login.ts
│
├── components/           ← Components reutilitzables (Header, Footer...)
├── layouts/              ← Plantilles HTML comunes
└── lib/                  ← Llibreries (connexió MySQL, autenticació...)
```

### Backend (REST API)

```
~/api-freshexpress/
├── index.js                      ← Servidor Express principal
├── routes/index.routes.js        ← Definició de rutes (/empresas, /stats...)
├── controladors/index.controllers.js ← Lògica de negoci
└── config/db.js                  ← Connexió MySQL
```

---

## 🔄 Com Funciona una Petició (Exemple: Veure Productes)

### Pas a Pas

**1. Usuari visita `/productes`**

```
https://freshexpress.vercel.app/productes
```

**2. Astro (al servidor de Vercel) executa `productes.astro`**

```astro
---
// Codi al SERVIDOR
const token = Astro.cookies.get('auth_token');
if (!token) return Astro.redirect('/login'); // Si no està loguejat, redirigeix

// Consultar REST API per obtenir empreses
const response = await fetch('http://143.47.36.36:3000/empresas');
const data = await response.json();
const empreses = data.empresas;
---

<Layout>
  <h1>Empreses disponibles</h1>
  {empreses.map(emp => <EmpresaCard empresa={emp} />)}
</Layout>
```

**3. La petició arriba a la REST API**

```
GET http://143.47.36.36:3000/empresas
```

**4. El servidor Express executa el controlador:**

```javascript
// controladors/index.controllers.js
const getEmpresasDisponibles = async (req, res) => {
  // A) Registrar petició (Data Broker)
  await pool.query(
    "INSERT INTO api_access_log (endpoint, ip_address, timestamp) VALUES (?, ?, NOW())",
    ["/empresas", req.ip]
  );

  // B) Consultar MySQL
  const [empresas] = await pool.query(
    "SELECT * FROM empresas WHERE activo = 1"
  );

  // C) Retornar JSON
  res.json({ success: true, empresas });
};
```

**5. Astro rep el JSON i genera HTML**

```html
<h1>Empreses disponibles</h1>
<div class="empresa-card">
  <h2>Can Batlló</h2>
  <p>Productes ecològics de proximitat</p>
</div>
<div class="empresa-card">
  <h2>Mercat de la Llibertat</h2>
  <p>Fruita i verdura fresca</p>
</div>
```

**6. L'HTML es envia al navegador de l'usuari**

**7. L'usuari veu la pàgina renderitzada** ✅

---

## 🔐 Autenticació: Com Funciona el Login

### Flux de Login

**1. Usuari envia email + password**

```
POST /api/auth/login
{
  "email": "lucho@freshexpress.com",
  "password": "contrasenya123"
}
```

**2. Astro API Route (`src/pages/api/auth/login.ts`) valida:**

```typescript
// A) Buscar usuari a la base de dades
const [user] = await query('SELECT * FROM usuarios WHERE correo = ?', [email]);

// B) Comprovar contrasenya (hash bcrypt)
const valid = await bcrypt.compare(password, user.contrasenya_hash);
if (!valid) return error 401;

// C) Generar JWT (token)
const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '7d' });

// D) Guardar token en cookie
cookies.set('auth_token', token, { httpOnly: true, secure: true });

// E) Retornar èxit
return { success: true, user };
```

**3. El navegador guarda la cookie automàticament**

**4. En futures peticions, Astro comprova la cookie:**

```typescript
const token = Astro.cookies.get("auth_token");
const payload = jwt.verify(token, SECRET); // { userId: 5 }
const user = await getUserById(payload.userId);
```

---

## 📊 Data Broker: El Tret Diferencial

### Què és un Data Broker?

Un **intermediari de dades** que:

1. Recopila informació sobre com els usuaris usen l'aplicació
2. Agrega i anonimitza les dades
3. Les ven a tercers (empreses de mercat, competidors, inversors)

### Com ho Implementem?

#### Taula `api_access_log`

Cada cop que algú fa una petició a l'API, ho registrem:

```sql
CREATE TABLE api_access_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  endpoint VARCHAR(255),        -- Ex: /empresas
  ip_address VARCHAR(45),       -- Ex: 192.168.1.100
  user_agent TEXT,              -- Ex: Mozilla/5.0...
  user_id INT,                  -- Si està loguejat
  timestamp DATETIME,           -- Quan va fer la petició
  response_time INT             -- Quant va trigar
);
```

#### Exemple de Dades Registrades

| id  | endpoint  | ip_address   | timestamp           | user_id |
| --- | --------- | ------------ | ------------------- | ------- |
| 1   | /empresas | 192.168.1.5  | 2026-01-13 10:30:00 | 12      |
| 2   | /stats/12 | 192.168.1.5  | 2026-01-13 10:30:15 | 12      |
| 3   | /empresas | 192.168.1.8  | 2026-01-13 10:31:00 | 25      |
| 4   | /empresas | 192.168.1.12 | 2026-01-13 10:32:00 | NULL    |

### Què Podem Vendre?

#### 1. Informe: Empreses Més Consultades

```sql
SELECT
  e.nombre AS Empresa,
  COUNT(*) AS Total_consultes,
  COUNT(DISTINCT a.ip_address) AS Visitants_únics
FROM api_access_log a
JOIN empresas e ON a.endpoint LIKE CONCAT('%', e.id, '%')
WHERE a.timestamp > DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY e.id
ORDER BY Total_consultes DESC;
```

**Resultat:**
| Empresa | Total*consultes | Visitants*únics |
|---------|----------------|----------------|
| Can Batlló | 1,250 | 420 |
| Mercat Llibertat | 980 | 315 |
| Fruites Martí | 650 | 210 |

**Valor comercial:** €3,500/mes (empreses competidores paguen per saber qui és popular)

#### 2. Informe: Horaris de Màxima Demanda

```sql
SELECT
  HOUR(timestamp) AS Hora,
  COUNT(*) AS Peticions
FROM api_access_log
WHERE endpoint = '/empresas'
GROUP BY HOUR(timestamp);
```

**Resultat:**
| Hora | Peticions |
|------|-----------|
| 08:00 | 45 |
| 09:00 | 120 |
| 12:00 | 280 |
| 19:00 | 350 |
| 21:00 | 180 |

**Valor comercial:** €2,000/mes (empreses de logística per optimitzar rutes)

#### 3. Projecció Anual de Ingressos

| Informe           | Preu/mes | Clients | Ingrés Anual |
| ----------------- | -------- | ------- | ------------ |
| Ranking empreses  | €3,500   | 3       | €126,000     |
| Anàlisi horari    | €2,000   | 2       | €48,000      |
| Patrons de compra | €1,500   | 2       | €36,000      |
| **TOTAL**         |          |         | **€210,000** |

### És Legal?

**SÍ**, sempre que:

1. ✅ L'usuari doni **consentiment explícit** al registrar-se
2. ✅ Les dades siguin **agregades i anonimitzades** (no es ven informació individual)
3. ✅ Es compleixi el **GDPR** (dret a l'oblit, transparència, etc.)

**Formulari de registre amb consentiment:**

```html
<input type="checkbox" id="consent-data" required />
<label for="consent-data">
  Accepto que FreshExpress recopili dades agregades i anonimitzades sobre el meu
  ús de la plataforma amb fins d'anàlisi de mercat.
</label>
```

---

## 🚀 Deployment: On Està Allotjat Tot?

### Frontend (Astro)

- **Plataforma:** Vercel
- **URL:** https://freshexpress.vercel.app
- **Com funciona:**
  - Cada cop que fas `git push` a GitHub, Vercel detecta els canvis
  - Executa `npm run build` automàticament
  - Publica la nova versió en segons

### Backend (REST API)

- **Servidor:** Oracle Linux VPS
- **IP:** 143.47.36.36
- **Port:** 3000
- **URL completa:** http://143.47.36.36:3000
- **Com funciona:**
  - Servidor Linux amb Node.js instal·lat
  - Executes `nodemon index.js` per iniciar l'API
  - Resta actiu escoltant peticions

### Base de Dades (MySQL)

- **Ubicació:** Mateix servidor (Oracle Linux)
- **Nom:** freshexpress_operacional
- **Port:** 3306 (per defecte)
- **Accés:**
  - Usuari API: `api2` (només SELECT i INSERT)
  - Usuari Admin: `root` (tots els permisos)

---

## 🐛 Problema Comú: Mixed Content

### Què és?

Quan una pàgina **HTTPS** intenta fer peticions a una API **HTTP**, els navegadors moderns ho bloquegen per seguretat.

```
❌ https://freshexpress.vercel.app (HTTPS)
      ↓ fetch()
   http://143.47.36.36:3000 (HTTP)

   BLOQUEJAT PEL NAVEGADOR!
```

### Solució 1: Peticions des del Servidor (SSR)

En lloc de fer `fetch()` des del navegador (client), ho fem des d'Astro (servidor):

```astro
---
// Això s'executa AL SERVIDOR (Vercel), no al navegador
// El servidor pot fer HTTP sense problemes
const response = await fetch('http://143.47.36.36:3000/empresas');
const data = await response.json();
---

<Layout>
  {data.empresas.map(emp => <Card empresa={emp} />)}
</Layout>
```

### Solució 2: Fer l'API HTTPS (Millor per Producció)

```bash
# Al servidor, configura certificat SSL amb Let's Encrypt
sudo certbot --nginx -d api.freshexpress.com
```

Llavors la URL seria: `https://api.freshexpress.com/empresas`

---

## 📝 Punts Clau per la Presentació

### 1. Arquitectura (2 min)

> "FreshExpress utilitza una arquitectura client-servidor on el frontend està fet amb Astro (framework modern amb SSR) i està allotjat a Vercel. El backend és una REST API feta amb Node.js i Express que corre en un servidor Oracle Linux. Les dues parts es comuniquen mitjançant peticions HTTP, i totes les dades es guarden a MySQL."

### 2. Astro i SSR (1 min)

> "He escollit Astro perquè fa Server-Side Rendering: genera l'HTML al servidor abans d'enviar-lo al navegador. Això té dos avantatges: l'usuari veu contingut immediatament (no veu 'Carregant...') i Google pot indexar la pàgina per SEO."

### 3. Data Broker (2-3 min)

> "La part més interessant és que l'API no només serveix dades, sinó que **actua com a Data Broker**. Cada cop que algú consulta empreses o estadístiques, ho registrem a una taula `api_access_log`. Amb aquestes dades podem generar informes agregats i anonimitzats que es poden vendre a tercers."
>
> [Mostrar taula de projecció d'ingressos: €210k/any]
>
> "És totalment legal perquè els usuaris donen consentiment explícit al registrar-se, i les dades són agregades (no venem informació individual)."

### 4. Demo en Viu (2 min)

> "Ara us ho ensenyaré funcionant:"
>
> 1. Obrir https://freshexpress.vercel.app/productes
> 2. Obrir DevTools → Network
> 3. Recarregar pàgina
> 4. Mostrar petició a `http://143.47.36.36:3000/empresas`
> 5. Mostrar resposta JSON
>
> "Cada cop que carreguem aquesta pàgina, l'API registra la petició. Si obríssim MySQL ara, veuríem una nova fila a `api_access_log`."

### 5. Tecnologies (1 min)

> "Tecnologies utilitzades: Astro amb TypeScript per al frontend, Node.js amb Express per l'API, MySQL per la base de dades, Vercel per hosting del frontend, i un VPS Oracle Linux per l'API. Tot el projecte està a GitHub."

---

## 🎤 Script Complet de Presentació (5-7 min)

### Minuts 0-1: Introducció

> "Hola, sóc [nom] i avui presentaré FreshExpress, una plataforma web de micro-logística per comprar productes frescos amb entrega ultra-ràpida. El projecte demostra una arquitectura client-servidor real amb un concepte interessant: el **Data Broker**."

### Minuts 1-3: Arquitectura i Tecnologies

> "L'aplicació té tres capes. Primer, el **frontend** fet amb Astro, un framework modern que fa Server-Side Rendering. Això vol dir que genera l'HTML al servidor abans d'enviar-lo al navegador. Està allotjat a Vercel."
>
> "Segon, la **REST API** feta amb Node.js i Express, que corre en un servidor Oracle Linux. L'API consulta la base de dades i retorna JSON."
>
> "Tercer, **MySQL** per guardar usuaris, empreses, productes, comandes, i el més important: els logs del Data Broker."
>
> [Mostrar diagrama d'arquitectura]

### Minuts 3-5: Data Broker (Punt Fort)

> "La part més innovadora és que l'API no només serveix dades, sinó que **registra cada petició**. Cada cop que algú consulta empreses, ho guardem a una taula `api_access_log` amb: quin endpoint, quina IP, quin usuari, i quan."
>
> "Amb aquestes dades podem generar **informes agregats i anonimitzats** que tenen valor comercial:"
>
> [Mostrar taula de projecció d'ingressos]
>
> - "Ranking d'empreses més consultades → €3,500/mes"
> - "Anàlisi d'horaris de demanda → €2,000/mes"
> - "Patrons de compra per categoria → €1,500/mes"
>
> "Amb només 7 clients, la projecció anual és de **€210,000**. Més del que generaria el negoci principal."
>
> "I és totalment legal: els usuaris donen **consentiment explícit** al registrar-se, les dades són **agregades** (no venem informació individual), i complim el **GDPR**."

### Minuts 5-6: Demo en Viu

> "Ara us ho ensenyo funcionant."
>
> [Obrir navegador]
>
> 1. "Aquesta és la pàgina de productes. Obro DevTools."
> 2. "Recarrego la pàgina i veieu aquesta petició a l'API."
> 3. "Aquí està la resposta JSON amb totes les empreses."
> 4. "Si obríssim MySQL ara, veuríem una nova fila registrada a `api_access_log`."

### Minuts 6-7: Conclusió

> "En resum: hem creat una aplicació web completa amb arquitectura client-servidor real, utilitzant tecnologies modernes (Astro, Node.js, MySQL), i amb un model de negoci innovador: el **Data Broker** que monetitza les dades agregades de forma ètica i legal."
>
> "Gràcies. Tinc temps per preguntes?"

---

## ❓ Possibles Preguntes i Respostes

### P: Per què Astro i no React o Vue?

> **R:** "Astro és més modern i està optimitzat per SSR. A més, no obliga a usar JavaScript al client excepte on és necessari. Això fa que la web sigui més ràpida. React i Vue envien molt més JavaScript al navegador."

### P: L'API no hauria de ser HTTPS?

> **R:** "Sí, en producció hauria de ser HTTPS. De moment és HTTP perquè és un projecte educatiu i no gestiona dades sensibles. Per fer-ho HTTPS usaria Let's Encrypt amb un certificat SSL gratuït."

### P: Com eviteu que robin les dades de l'API?

> **R:** "Actualment l'API té CORS configurat per només acceptar peticions des de Vercel i localhost. En producció real afegiria autenticació amb API Keys: cada petició hauria d'incloure un token secret a les capçaleres."

### P: Quantes empreses poden realment pagar per aquests informes?

> **R:** "He investigat el mercat de data brokers reals com Acxiom i Experian. Empreses de consultoria de mercat, grans superfícies, i competidors paguen entre €1,000-€5,000/mes per informes sectorials. La projecció de €210k/any és conservadora."

### P: I si un usuari no vol que vengui les seves dades?

> **R:** "Pot revocar el consentiment en qualsevol moment des de Configuració. Les seves dades es marquen com a `consent_data_sharing = FALSE` i l'API deixa de registrar les seves peticions. També pot demanar l'eliminació total (dret al oblit del GDPR)."

---

## 📚 Recursos Addicionals

### Documentació del Projecte

- [README.md](README.md) - Visió general
- [DOCUMENTACIO_TECNICA.md](DOCUMENTACIO_TECNICA.md) - Detalls tècnics complets
- [DATA_BROKER_PRESENTACION.md](DATA_BROKER_PRESENTACION.md) - Guió Data Broker

### Codi Clau a Revisar

- [src/pages/productes.astro](src/pages/productes.astro) - Exemple SSR amb REST API
- [src/pages/dashboard.astro](src/pages/dashboard.astro) - Estadístiques d'usuari
- API Backend: `~/api-freshexpress/controladors/index.controllers.js`

### Tecnologies

- [Astro Documentation](https://docs.astro.build)
- [Express.js Guide](https://expressjs.com)
- [MySQL Reference](https://dev.mysql.com/doc/)

---

**Última actualització:** 13 de gener de 2026  
**Preparat per:** Lucho Portuano  
**Versió:** 1.0

**Èxits amb la presentació! 🚀**
