# Documentació Completa: Sistema Data Broker - FreshExpress

## Índex

1. [Introducció](#introducció)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Taules de Base de Dades](#taules-de-base-de-dades)
4. [Sistema de Recollida de Logs](#sistema-de-recollida-de-logs)
5. [Pantalla de Visualització](#pantalla-de-visualització)
6. [API i Endpoints](#api-i-endpoints)
7. [Resum del Funcionament](#resum-del-funcionament)

---

## Introducció

El **Data Broker de FreshExpress** és un sistema integral d'analítica web que recopila, emmagatzema i analitza el comportament dels usuaris a la plataforma. El sistema funciona amb dues bases de dades separades:

- **freshexpress_operacional**: Base de dades principal amb usuaris, productes, comandes, etc.
- **freshexpress_databroker**: Base de dades específica per tracking i analítica

Aquest disseny separat permet gestionar grans volums de dades analítiques sense impactar el rendiment de les operacions principals del negoci.

---

## Arquitectura del Sistema

### Components Principals

```
┌─────────────────┐
│   Frontend      │  → tracking.js
│   (Navegador)   │
└────────┬────────┘
         │ Events HTTP POST
         ↓
┌─────────────────┐
│  /api/track     │  → Endpoint receptor
└────────┬────────┘
         │ Processa events
         ↓
┌─────────────────┐
│  tracking.ts    │  → Lògica de tracking
└────────┬────────┘
         │ INSERT queries
         ↓
┌─────────────────┐
│  DB DataBroker  │  → events_web, sesiones_web
└─────────────────┘
         ↓
┌─────────────────┐
│ /admin/         │  → Visualització
│  databroker     │
└─────────────────┘
```

### Flux de Dades

1. **Captura**: Script JavaScript (`tracking.js`) captura events en el navegador
2. **Enviament**: Events s'envien per lots a `/api/track`
3. **Processament**: Servidor valida i enriqueix les dades
4. **Emmagatzematge**: S'insereixen a `eventos_web` i `sesiones_web`
5. **Consulta**: APIs específiques consulten les dades
6. **Visualització**: Dashboard mostra estadístiques i gràfics

---

## Taules de Base de Dades

El sistema Data Broker utilitza **3 taules principals** a la base de dades `freshexpress_databroker`:

### 1. `eventos_web`

Emmagatzema cada event individual capturat dels usuaris.

**Estructura:**

```sql
CREATE TABLE eventos_web (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sesion_id VARCHAR(100) NOT NULL,           -- ID de sessió única
    usuario_id INT,                            -- ID d'usuari autenticat (nullable)
    tipo_evento VARCHAR(50) NOT NULL,          -- Tipus: click, pageview, scroll, etc.
    elemento VARCHAR(255),                     -- Element HTML clicat
    categoria_evento VARCHAR(50),              -- Categoria: navigation, product, cart...
    datos_evento JSON,                         -- Dades addicionals en JSON
    url_actual VARCHAR(500),                   -- URL de la pàgina actual
    url_referrer VARCHAR(500),                 -- URL d'origen
    utm_source VARCHAR(100),                   -- Font de tràfic
    utm_medium VARCHAR(100),                   -- Mitjà de tràfic
    dispositivo VARCHAR(20),                   -- mobile, tablet, desktop
    navegador VARCHAR(50),                     -- Chrome, Firefox, Safari...
    sistema_operativo VARCHAR(50),             -- Windows, macOS, Linux...
    resolucion_pantalla VARCHAR(20),           -- 1920x1080
    pais VARCHAR(5),                           -- ES
    region VARCHAR(100),                       -- Catalunya
    ciudad VARCHAR(100),                       -- Barcelona
    fecha_evento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tiempo_en_pagina INT,                      -- Temps en segons
    INDEX idx_sesion (sesion_id),
    INDEX idx_tipo (tipo_evento),
    INDEX idx_fecha_evento (fecha_evento)
);
```

**Tipus d'events capturats:**

- `pageview` - Vista de pàgina
- `click` - Click genèric
- `button_click` - Click en botons específics
- `scroll` - Scroll de pàgina
- `product_click` - Click en producte
- `product_impression` - Visualització de producte
- `add_to_cart` - Afegir al carret
- `form_submit` - Enviament de formulari
- `purchase` - Compra completada

**Exemples de `datos_evento` (JSON):**

```json
{
  "productId": 123,
  "productName": "Tomàquets ecològics",
  "category": "Verdures",
  "price": 2.5,
  "quantity": 2
}
```

### 2. `sesiones_web`

Agrupa els events per sessió d'usuari amb mètriques resum.

**Estructura:**

```sql
CREATE TABLE sesiones_web (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sesion_id VARCHAR(100) NOT NULL UNIQUE,    -- ID únic de sessió
    usuario_id INT,                            -- ID d'usuari autenticat
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP NULL,                  -- Última activitat
    duracion_segundos INT DEFAULT 0,           -- Duració total
    paginas_vistas INT DEFAULT 0,              -- Nombre de pageviews
    eventos_totales INT DEFAULT 0,             -- Total d'events
    clics_totales INT DEFAULT 0,               -- Total de clicks
    scrolls_totales INT DEFAULT 0,             -- Total de scrolls
    formularios_enviados INT DEFAULT 0,        -- Formularis enviats
    errores_javascript INT DEFAULT 0,          -- Errors JS
    productos_vistos INT DEFAULT 0,            -- Productes visualitzats
    productos_carrito INT DEFAULT 0,           -- Productes al carret
    dispositivo VARCHAR(20),                   -- Dispositiu
    pais VARCHAR(5),                           -- País
    ciudad VARCHAR(100),                       -- Ciutat
    fuente_trafico VARCHAR(50),                -- Font de tràfic
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    es_nueva_sesion TINYINT(1) DEFAULT 1,      -- És nova sessió?
    es_rebote TINYINT(1) DEFAULT 0,            -- Rebot (una sola pàgina)?
    conversion TINYINT(1) DEFAULT 0,           -- Va comprar?
    landing_page VARCHAR(500),                 -- Pàgina d'entrada
    exit_page VARCHAR(500),                    -- Pàgina de sortida
    valor_conversion DECIMAL(10,2) DEFAULT 0,  -- Import de compra
    es_usuario_registrado TINYINT(1) DEFAULT 0,
    INDEX idx_sesion (sesion_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_fecha_inicio (fecha_inicio)
);
```

**Gestió de Sessions:**

- Es crea automàticament amb el primer event
- S'actualitza amb cada nou event (`ON DUPLICATE KEY UPDATE`)
- La duració es calcula amb `TIMESTAMPDIFF`
- El timeout és de 30 minuts d'inactivitat

### 3. `datos_anonimos`

Emmagatzema dades agregades i anonimitzades d'usuaris per complir GDPR.

**Estructura:**

```sql
CREATE TABLE datos_anonimos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hash_usuario VARCHAR(64) NOT NULL,         -- Hash SHA-256 de l'usuari
    rango_edad VARCHAR(20),                    -- 25-34, 35-44...
    genero ENUM('masculino', 'femenino', 'otro', 'no_especificado'),
    codigo_postal_prefijo VARCHAR(5),          -- Només els 2 primers dígits
    segmento_comportamiento VARCHAR(50),       -- VIP, Frequent, Regular...
    frecuencia_compra ENUM('muy_baja', 'baja', 'media', 'alta', 'muy_alta'),
    ticket_medio_rango VARCHAR(30),            -- 0-25€, 25-50€...
    categorias_preferidas JSON,                -- ["Verdures", "Fruites"]
    horarios_compra JSON,                      -- {"morning": 20, "afternoon": 60}
    nivel_compromiso_eco ENUM('bajo', 'medio', 'alto'),
    preferencias_pago JSON,                    -- ["tarjeta", "paypal"]
    fecha_primera_compra DATE,
    fecha_ultima_compra DATE,
    total_pedidos INT DEFAULT 0,
    total_gastado_rango VARCHAR(30),           -- 0-100€, 100-500€...
    productos_favoritos JSON,                  -- [{"id": 123, "veces": 5}]
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_hash (hash_usuario),
    INDEX idx_segmento (segmento_comportamiento),
    INDEX idx_nivel_eco (nivel_compromiso_eco)
);
```

**Propòsit:**

- Analítica agregada sense dades personals identificables
- Compliment amb GDPR i privacitat
- Permet vendre insights sense exposar usuaris individuals
- Es crea quan l'usuari dóna consentiment "Data for Good"

---

## Sistema de Recollida de Logs

### 1. Script de Tracking Frontend (`/public/js/tracking.js`)

Aquest script JavaScript s'executa al navegador de l'usuari i captura automàticament els events.

**Configuració:**

```javascript
const CONFIG = {
  endpoint: "/api/track", // Endpoint destí
  batchSize: 10, // Events per lot
  batchInterval: 5000, // 5 segons entre enviaments
  sessionTimeout: 30 * 60 * 1000, // 30 minuts
  enableClickTracking: true,
  enableScrollTracking: true,
  enableTimeTracking: true,
  enableFormTracking: true,
};
```

**Events capturats automàticament:**

1. **Pageview** - Quan es carrega una pàgina

```javascript
trackEvent("pageview", null, {
  title: document.title,
  path: window.location.pathname,
});
```

2. **Clicks** - En qualsevol element clickable

```javascript
document.addEventListener("click", function (e) {
  const target = e.target.closest("a, button, [data-tracking-id]");
  trackEvent("click", target, {
    x: (e.clientX / window.innerWidth) * 100,
    y: (e.clientY / window.innerHeight) * 100,
  });
});
```

3. **Scroll** - Profunditat de scroll

```javascript
window.addEventListener(
  "scroll",
  debounce(() => {
    const depth = getScrollDepth();
    trackEvent("scroll", null, { depth });
  }, 1000)
);
```

4. **Events personalitzats** - Amb atributs data-\*

```html
<button data-tracking-id="btn-comprar" data-tracking-category="cart">
  Comprar
</button>
```

**Enviament per lots:**

- Els events es guarden en una cua (`eventQueue`)
- S'envien cada 5 segons o quan arriba a 10 events
- Sistema de retry en cas d'error de xarxa
- Mantenen l'ordre cronològic

**Exemples d'events generats:**

```javascript
{
  type: 'product_click',
  element: 'button.add-to-cart',
  category: 'product',
  url: 'https://freshexpress.com/productes',
  timestamp: 1673456789000,
  resolution: '1920x1080',
  timeOnPage: 45000,
  data: {
    productId: 123,
    productName: 'Tomàquets ecològics',
    price: 2.50
  }
}
```

### 2. Endpoint de Recepció (`/src/pages/api/track.ts`)

Aquest endpoint rep els events del frontend i els processa.

**Flux de processament:**

```typescript
POST /api/track
  ↓
1. Validar request JSON
  ↓
2. Obtenir informació del navegador (User-Agent)
  ↓
3. Gestionar Session ID (cookie tracking_session)
   - Si no existeix → generar nou
   - Si existeix → reutilitzar
  ↓
4. Enriquir dades:
   - Dispositiu: getDeviceType(userAgent)
   - Navegador: getBrowserFamily(userAgent)
   - Sistema operatiu: getOS(userAgent)
   - Geolocalització: IP → País/Regió
  ↓
5. Processar events:
   - Si és array → processTrackingBatch()
   - Si és individual → processTrackingEvent()
  ↓
6. Retornar resposta amb sessionId
```

**Gestió de Sessions:**

```typescript
let sessionId = cookies.get("tracking_session")?.value;
if (!sessionId) {
  sessionId = generateSessionId(); // sess_abc123_1673456789
  cookies.set("tracking_session", sessionId, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 30, // 30 minuts
  });
}
```

**Detecció de Dispositiu/Navegador:**

```typescript
// User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0
export function getDeviceType(
  userAgent: string
): "mobile" | "tablet" | "desktop" {
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod/.test(ua) && !/tablet|ipad/.test(ua)) {
    return "mobile";
  }
  if (/tablet|ipad/.test(ua)) {
    return "tablet";
  }
  return "desktop";
}

export function getBrowserFamily(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes("firefox")) return "Firefox";
  if (ua.includes("edg")) return "Edge";
  if (ua.includes("chrome")) return "Chrome";
  if (ua.includes("safari")) return "Safari";
  return "Other";
}
```

### 3. Lògica de Tracking (`/src/lib/tracking.ts`)

Conté les funcions per processar i inserir events a la base de dades.

**Funció principal: `processTrackingEvent()`**

```typescript
export async function processTrackingEvent(
  event: TrackingEvent
): Promise<boolean> {
  try {
    // 1. INSERT a eventos_web
    await queryBroker(
      `INSERT INTO eventos_web (
        sesion_id, usuario_id, tipo_evento, elemento, categoria_evento,
        datos_evento, url_actual, url_referrer, 
        dispositivo, navegador, sistema_operativo, resolucion_pantalla,
        pais, region, ciudad, fecha_evento, tiempo_en_pagina
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [
        event.session_id,
        null, // usuario_id
        event.tipo_evento,
        event.elemento || null,
        event.categoria_elemento || null,
        event.datos_evento ? JSON.stringify(event.datos_evento) : null,
        event.url || null,
        event.url_anterior || null,
        event.dispositivo || "desktop",
        event.navegador_familia || null,
        event.sistema_operativo || null,
        event.resolucion_pantalla || null,
        event.pais || "ES",
        event.region || null,
        event.ciudad || null,
        event.tiempo_en_pagina_ms
          ? Math.floor(event.tiempo_en_pagina_ms / 1000)
          : null,
      ]
    );

    // 2. Actualitzar o crear sessió amb ON DUPLICATE KEY UPDATE
    await queryBroker(
      `INSERT INTO sesiones_web (
        sesion_id, usuario_id, fecha_inicio, fecha_fin, 
        paginas_vistas, eventos_totales, clics_totales, scrolls_totales,
        productos_vistos, productos_carrito, dispositivo, pais, ciudad
      ) VALUES (?, ?, NOW(), NOW(), ?, 1, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        fecha_fin = NOW(),
        duracion_segundos = TIMESTAMPDIFF(SECOND, fecha_inicio, NOW()),
        eventos_totales = eventos_totales + 1,
        paginas_vistas = paginas_vistas + ?,
        clics_totales = clics_totales + ?,
        scrolls_totales = scrolls_totales + ?,
        productos_vistos = productos_vistos + ?,
        productos_carrito = productos_carrito + ?,
        conversion = conversion OR ?`,
      [
        event.session_id,
        null,
        event.tipo_evento === "pageview" ? 1 : 0,
        isClickEvent ? 1 : 0,
        isScrollEvent ? 1 : 0,
        isProductEvent ? 1 : 0,
        isCartEvent ? 1 : 0,
        event.dispositivo || "desktop",
        event.pais || "ES",
        event.ciudad || null,
        // Per ON DUPLICATE KEY UPDATE
        event.tipo_evento === "pageview" ? 1 : 0,
        isClickEvent ? 1 : 0,
        isScrollEvent ? 1 : 0,
        isProductEvent ? 1 : 0,
        isCartEvent ? 1 : 0,
        event.tipo_evento === "purchase",
      ]
    );

    return true;
  } catch (error) {
    console.error("Error processant event:", error);
    return false;
  }
}
```

**Característiques clau:**

- **Transaccional**: Cada event s'insereix individualment
- **Upsert de sessió**: `ON DUPLICATE KEY UPDATE` actualitza comptadors
- **Càlcul automàtic**: Duració amb `TIMESTAMPDIFF`
- **Gestió d'errors**: Retorna boolean de èxit/fracàs

### 4. Creació de Dades Anònimes

Quan un usuari es registra amb consentiment "Data for Good", es crea el seu perfil anònim.

**Localització:** `/src/lib/auth.ts` (funció de registre)

```typescript
// Generar hash anonimizat
const hashAnonimizacion = createHash("sha256")
  .update(`${email}:${Date.now()}:${randomBytes(16).toString("hex")}`)
  .digest("hex");

// Si l'usuari accepta compartir dades
if (compartir_datos) {
  await queryBroker(
    `INSERT INTO datos_anonimos (
      hash_usuario,
      rango_edad,
      codigo_postal_prefijo,
      nivel_compromiso_eco,
      frecuencia_compra,
      fecha_creacion
    ) VALUES (?, ?, ?, ?, ?, NOW())`,
    [
      hashAnonimizacion,
      calcularRangoEdad(edad),
      codigoPostal.substring(0, 2), // Només 2 primers dígits
      "medio",
      "media",
    ]
  );
}
```

**Anonimització:**

- Hash SHA-256 irreversible
- No es guarda email/nom/DNI
- Només rangs d'edat (25-34, 35-44...)
- Prefix de CP (08xxx → 08)
- Agregació per segments

---

## Pantalla de Visualització

La pantalla de visualització es troba a `localhost:4321/admin/databroker` i està accessible només per administradors.

### Estructura de la Pantalla

**Ubicació:** `/src/pages/admin/databroker.astro`

**4 Tabs principals:**

1. **General** - Estadístiques globals i tracking
2. **Productes** - Analítiques de productes
3. **Usuaris** - Comportament i segments d'usuaris
4. **Tracking** - Events i interaccions detallades

### Control de Períodes

Selector de període temporal que filtra totes les dades:

```html
<select id="periodo-selector">
  <option value="7d">Últims 7 dies</option>
  <option value="30d" selected>Últims 30 dies</option>
  <option value="90d">Últims 90 dies</option>
  <option value="all">Tot el temps</option>
</select>
```

Aquest període s'envia com a query parameter a tots els endpoints de l'API.

---

### Tab 1: General

**Mètriques principals (4 cards):**

1. **Total Sessions**

   - Consulta: `SELECT COUNT(*) FROM sesiones_web`
   - Font de dades: Taula `sesiones_web`
   - Filtre: `fecha_inicio >= DATE_SUB(NOW(), INTERVAL X DAY)`

2. **Total Events**

   - Consulta: `SELECT COUNT(*) FROM eventos_web`
   - Font de dades: Taula `eventos_web`
   - Mostra tots els events capturats

3. **Total Clicks**

   - Consulta: `SELECT COUNT(*) FROM eventos_web WHERE tipo_evento IN ('click', 'button_click')`
   - Filtra només events de tipus click

4. **Pàgines Vistes**
   - Consulta: `SELECT COUNT(*) FROM eventos_web WHERE tipo_evento = 'pageview'`
   - Comptador de pageviews

**Gràfic: Events per Dia**

```sql
SELECT
  DATE(fecha_evento) as dia,
  COUNT(*) as total,
  COUNT(DISTINCT sesion_id) as sessions
FROM eventos_web
WHERE fecha_evento >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(fecha_evento)
ORDER BY dia
```

- **Tipus:** Gràfic de línia (Chart.js)
- **Eix X:** Dies
- **Eix Y:** Nombre d'events
- **Propòsit:** Visualitzar tendències temporals

**Gràfic: Distribució per Dispositiu**

```sql
SELECT
  dispositivo as dispositiu,
  COUNT(*) as total
FROM eventos_web
WHERE dispositivo IS NOT NULL
GROUP BY dispositivo
ORDER BY total DESC
```

- **Tipus:** Doughnut chart
- **Valors:** Desktop, Mobile, Tablet
- **Colors:** Verd (#3BB143), Blau, Taronja

**Taula: Pàgines més Visitades**

```sql
SELECT
  url_actual as pagina,
  COUNT(*) as visites,
  COUNT(DISTINCT sesion_id) as sessions_uniques
FROM eventos_web
WHERE tipo_evento = 'pageview'
GROUP BY url_actual
ORDER BY visites DESC
LIMIT 10
```

| Pàgina     | Visites | Sessions |
| ---------- | ------- | -------- |
| /productes | 1,245   | 834      |
| /          | 987     | 765      |
| /checkout  | 543     | 456      |

**Propòsit del tab:**

- Vista general del tràfic
- Identificar pàgines populars
- Entendre comportament de navegació

---

### Tab 2: Productes

**Mètriques principals:**

1. **Total Productes**

   - Font: Base de dades operacional
   - Consulta: `SELECT COUNT(*) FROM productos WHERE activo = 1`

2. **Productes Venuts**

   - Consulta: `SELECT COUNT(DISTINCT producto_id) FROM detalle_pedido`
   - Productes amb almenys 1 venda

3. **Ingressos Totals**
   - Consulta: `SELECT SUM(subtotal) FROM detalle_pedido JOIN pedidos`
   - Amb filtre de període

**Taula: Productes MÉS Demanats**

```sql
SELECT
  pr.id,
  pr.nombre,
  pr.categoria,
  pr.precio,
  e.nombre as empresa,
  COUNT(dp.id) as vegades_demanat,
  SUM(dp.cantidad) as unitats_venudes,
  SUM(dp.subtotal) as ingressos
FROM productos pr
LEFT JOIN detalle_pedido dp ON pr.id = dp.producto_id
LEFT JOIN pedidos p ON dp.pedido_id = p.id
LEFT JOIN empresas e ON pr.empresa_id = e.id
WHERE p.fecha_pedido >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY pr.id
HAVING unitats_venudes > 0
ORDER BY unitats_venudes DESC
LIMIT 20
```

**Font de dades:** Base de dades operacional (`freshexpress_operacional`)

- Relaciona `productos`, `detalle_pedido`, `pedidos`, `empresas`
- Mostra els 20 productes més venuts
- Top 3 destacats amb fons verd

**Taula: Productes MENYS Demanats**

- Mateixa query però `ORDER BY unitats_venudes ASC LIMIT 10`
- Productes amb baixes vendes (però > 0)
- Útil per identificar productes a promoure o descatalogar

**Taula: Productes Mai Venuts**

```sql
SELECT
  pr.id,
  pr.nombre,
  pr.categoria,
  pr.precio,
  e.nombre as empresa,
  pr.fecha_creacion
FROM productos pr
LEFT JOIN detalle_pedido dp ON pr.id = dp.producto_id
LEFT JOIN empresas e ON pr.empresa_id = e.id
WHERE dp.id IS NULL AND pr.activo = 1
ORDER BY pr.fecha_creacion DESC
LIMIT 10
```

- Productes sense cap venda
- Candidats a revisió de preu, descripció o imatges

**Gràfic: Vendes per Categoria**

```sql
SELECT
  pr.categoria,
  SUM(dp.subtotal) as ingressos
FROM productos pr
JOIN detalle_pedido dp ON pr.id = dp.producto_id
JOIN pedidos p ON dp.pedido_id = p.id
GROUP BY pr.categoria
ORDER BY ingressos DESC
```

- **Tipus:** Bar chart horitzontal
- **Eix Y:** Categories (Verdures, Fruites, Làctics...)
- **Eix X:** Ingressos en €

**Taula: Clicks en Productes** (Data Broker)

```sql
SELECT
  JSON_UNQUOTE(JSON_EXTRACT(ew.datos_evento, '$.productId')) as product_id,
  COALESCE(p.nombre, 'Producte #' + product_id) as product_name,
  COUNT(*) as clics
FROM eventos_web ew
LEFT JOIN freshexpress_operacional.productos p
  ON p.id = JSON_EXTRACT(ew.datos_evento, '$.productId')
WHERE ew.tipo_evento = 'product_click'
GROUP BY product_id
ORDER BY clics DESC
LIMIT 15
```

**Font:** Base de dades Data Broker (`freshexpress_databroker`)

- Extreu `productId` del JSON `datos_evento`
- Fa un JOIN cross-database amb la taula `productos`
- Mostra els productes més clicats (interès)

**Taula: Afegits al Carret** (Data Broker)

```sql
SELECT
  JSON_UNQUOTE(JSON_EXTRACT(ew.datos_evento, '$.productId')) as product_id,
  COUNT(*) as vegades_afegit
FROM eventos_web ew
WHERE ew.tipo_evento = 'add_to_cart'
GROUP BY product_id
ORDER BY vegades_afegit DESC
LIMIT 15
```

- Events de tipus `add_to_cart`
- Mesura la intenció de compra
- Comparar amb vendes reals per veure conversió

---

### Tab 3: Usuaris

**Mètriques principals:**

1. **Total Usuaris**

   - Font: BD Operacional
   - Consulta: `SELECT COUNT(*) FROM usuarios WHERE estado = 'activo'`

2. **Usuaris amb Compres**

   - Usuaris que han fet almenys 1 comanda
   - Consulta: `SELECT COUNT(DISTINCT cliente_id) FROM pedidos`

3. **Data for Good**
   - Usuaris amb consentiment de compartir dades
   - Consulta: `SELECT COUNT(*) FROM consentimientos WHERE compartir_datos = 1`

**Gràfic: Nous Usuaris per Dia**

```sql
SELECT
  DATE(fecha_registro) as dia,
  COUNT(*) as nous_usuaris
FROM usuarios
WHERE fecha_registro >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(fecha_registro)
ORDER BY dia
```

- **Tipus:** Line chart
- **Propòsit:** Veure creixement de la base d'usuaris

**Gràfic: Distribució per Rol**

```sql
SELECT
  rol,
  COUNT(*) as total
FROM usuarios
WHERE estado = 'activo'
GROUP BY rol
```

- **Tipus:** Doughnut chart
- **Valors:** Client, Empresa, Repartidor, Admin

**Taula: Segments de Clients**

```sql
SELECT
  CASE
    WHEN total_pedidos >= 10 THEN 'VIP (10+ pedidos)'
    WHEN total_pedidos >= 5 THEN 'Frequent (5-9 pedidos)'
    WHEN total_pedidos >= 2 THEN 'Regular (2-4 pedidos)'
    ELSE 'Nou (1 pedido)'
  END as segment,
  COUNT(*) as usuaris,
  AVG(total_gastado) as gasto_medio
FROM (
  SELECT
    u.id,
    COUNT(p.id) as total_pedidos,
    SUM(p.total) as total_gastado
  FROM usuarios u
  LEFT JOIN pedidos p ON u.id = p.cliente_id
  WHERE u.rol = 'cliente'
  GROUP BY u.id
) subquery
GROUP BY segment
ORDER BY gasto_medio DESC
```

**Segmentació:**

- **VIP**: 10+ comandes → Clients fidels
- **Frequent**: 5-9 comandes → Compradors habituals
- **Regular**: 2-4 comandes → Han repetit
- **Nou**: 1 comanda → Provar fidelització

| Segment  | Usuaris | Gasto Mitjà |
| -------- | ------- | ----------- |
| VIP      | 23      | 487,50 €    |
| Frequent | 67      | 215,30 €    |
| Regular  | 145     | 98,45 €     |
| Nou      | 298     | 42,10 €     |

**Quadre: Consentiments**

```sql
SELECT
  SUM(CASE WHEN compartir_datos = 1 THEN 1 ELSE 0 END) as compartir_datos,
  SUM(CASE WHEN acepta_comunicaciones = 1 THEN 1 ELSE 0 END) as acepta_comunicaciones,
  SUM(CASE WHEN analytics = 1 THEN 1 ELSE 0 END) as analytics,
  COUNT(*) as total
FROM consentimientos
```

- Visualitza quants usuaris han acceptat cada tipus de consentiment
- Important per GDPR i privacitat
- Mostra la penetració de "Data for Good"

---

### Tab 4: Tracking

**Gràfic: Events per Hora del Dia**

```sql
SELECT
  HOUR(fecha_evento) as hora,
  COUNT(*) as total
FROM eventos_web
WHERE fecha_evento >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY HOUR(fecha_evento)
ORDER BY hora
```

- **Tipus:** Bar chart
- **Eix X:** 0:00 - 23:00
- **Propòsit:** Identificar hores punta d'activitat

**Gràfic: Distribució per Navegador**

```sql
SELECT
  navegador,
  COUNT(*) as total
FROM eventos_web
WHERE navegador IS NOT NULL
GROUP BY navegador
ORDER BY total DESC
```

- **Tipus:** Pie chart
- **Valors:** Chrome, Firefox, Safari, Edge, Other
- **Propòsit:** Compatibilitat i optimització

**Taules duplicades del Tab 2:**

- Clicks en Productes
- Afegits al Carret

(Ja explicades anteriorment)

---

## API i Endpoints

El sistema Data Broker exposa 3 endpoints principals per obtenir dades:

### 1. `/api/admin/databroker/stats`

**Propòsit:** Estadístiques generals de tracking i navegació

**Mètode:** GET

**Paràmetres:**

- `periodo`: `7d` | `30d` | `90d` | `all` (opcional, defecte: `7d`)

**Resposta:**

```json
{
  "success": true,
  "stats": {
    "totalSessions": 1245,
    "totalEvents": 8934,
    "totalClicks": 2341,
    "totalPageviews": 3456
  },
  "paginasVisitades": [
    {
      "pagina": "/productes",
      "visites": 1245,
      "sessions_uniques": 834
    }
  ],
  "elementsClicats": [
    {
      "elemento": "button.add-to-cart",
      "categoria": "product",
      "clics": 456
    }
  ],
  "dispositius": [
    { "dispositiu": "desktop", "total": 789 },
    { "dispositiu": "mobile", "total": 456 }
  ],
  "navegadors": [
    { "navegador": "Chrome", "total": 890 },
    { "navegador": "Firefox", "total": 234 }
  ],
  "eventsPerHora": [
    { "hora": 0, "total": 45 },
    { "hora": 1, "total": 23 }
  ],
  "eventsPerDia": [
    {
      "dia": "2026-01-01",
      "total": 456,
      "sessions": 123
    }
  ]
}
```

**Consultes executades:**

1. Total sessions:

```sql
SELECT COUNT(*) as count
FROM sesiones_web
WHERE fecha_inicio >= DATE_SUB(NOW(), INTERVAL 7 DAY)
```

2. Total events:

```sql
SELECT COUNT(*) as count
FROM eventos_web
WHERE fecha_evento >= DATE_SUB(NOW(), INTERVAL 7 DAY)
```

3. Pàgines visitades:

```sql
SELECT
  url_actual as pagina,
  COUNT(*) as visites,
  COUNT(DISTINCT sesion_id) as sessions_uniques
FROM eventos_web
WHERE tipo_evento = 'pageview'
  AND fecha_evento >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY url_actual
ORDER BY visites DESC
LIMIT 10
```

4. Elements clicats:

```sql
SELECT
  elemento,
  categoria_evento as categoria,
  COUNT(*) as clics
FROM eventos_web
WHERE tipo_evento IN ('click', 'button_click')
  AND elemento IS NOT NULL
  AND fecha_evento >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY elemento, categoria_evento
ORDER BY clics DESC
LIMIT 15
```

**Font de dades:** `freshexpress_databroker` (taules `eventos_web`, `sesiones_web`)

---

### 2. `/api/admin/databroker/productes`

**Propòsit:** Analítiques de productes (vendes reals + tracking)

**Mètode:** GET

**Paràmetres:**

- `periodo`: `7d` | `30d` | `90d` | `all`

**Resposta:**

```json
{
  "success": true,
  "resum": {
    "totalProductes": 234,
    "productesVenuts": 189,
    "ingressosTotals": 45678.90
  },
  "productesMesDemands": [
    {
      "id": 123,
      "nombre": "Tomàquets ecològics",
      "categoria": "Verdures",
      "precio": 2.50,
      "empresa": "EcoFarm",
      "vegades_demanat": 145,
      "unitats_venudes": 456,
      "ingressos": 1140.00
    }
  ],
  "productesMenysDemands": [...],
  "productesNoVenuts": [...],
  "vendesPerCategoria": [
    {
      "categoria": "Verdures",
      "pedidos": 234,
      "unitats": 1234,
      "ingressos": 5678.90
    }
  ],
  "productesCarret": [
    {
      "product_id": "123",
      "product_name": "Tomàquets ecològics",
      "vegades_afegit": 89
    }
  ],
  "clicksProductes": [
    {
      "product_id": "123",
      "product_name": "Tomàquets ecològics",
      "clics": 234
    }
  ]
}
```

**Consultes principals:**

1. **Productes més demanats** (BD Operacional):

```sql
SELECT
  pr.id,
  pr.nombre,
  pr.categoria,
  pr.precio,
  e.nombre as empresa,
  COUNT(dp.id) as vegades_demanat,
  SUM(dp.cantidad) as unitats_venudes,
  SUM(dp.subtotal) as ingressos
FROM productos pr
LEFT JOIN detalle_pedido dp ON pr.id = dp.producto_id
LEFT JOIN pedidos p ON dp.pedido_id = p.id
LEFT JOIN empresas e ON pr.empresa_id = e.id
WHERE p.fecha_pedido >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY pr.id
HAVING unitats_venudes > 0
ORDER BY unitats_venudes DESC
LIMIT 20
```

2. **Clicks en productes** (BD Data Broker):

```sql
SELECT
  JSON_UNQUOTE(JSON_EXTRACT(ew.datos_evento, '$.productId')) as product_id,
  COALESCE(
    p.nombre,
    JSON_UNQUOTE(JSON_EXTRACT(ew.datos_evento, '$.productName')),
    CONCAT('Producte #', product_id)
  ) as product_name,
  COUNT(*) as clics
FROM eventos_web ew
LEFT JOIN freshexpress_operacional.productos p
  ON p.id = JSON_UNQUOTE(JSON_EXTRACT(ew.datos_evento, '$.productId'))
WHERE ew.tipo_evento = 'product_click'
  AND ew.datos_evento IS NOT NULL
  AND ew.fecha_evento >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY product_id, product_name
HAVING product_id IS NOT NULL
ORDER BY clics DESC
LIMIT 15
```

**Nota important:** Aquest endpoint fa consultes a DUES bases de dades:

- `freshexpress_operacional` → Vendes reals
- `freshexpress_databroker` → Events de tracking

Això permet combinar dades transaccionals amb comportamentals.

---

### 3. `/api/admin/databroker/usuaris`

**Propòsit:** Estadístiques d'usuaris i comportament de compra

**Mètode:** GET

**Paràmetres:**

- `periodo`: `7d` | `30d` | `90d` | `all`

**Resposta:**

```json
{
  "success": true,
  "resum": {
    "totalUsuaris": 533,
    "usuarisAmbCompres": 298,
    "consentimentsDataBroker": 145
  },
  "usuarisPerDia": [
    {
      "dia": "2026-01-01",
      "nous_usuaris": 12
    }
  ],
  "usuarisPerRol": [
    { "rol": "cliente", "total": 489 },
    { "rol": "empresa", "total": 34 },
    { "rol": "repartidor", "total": 8 },
    { "rol": "admin", "total": 2 }
  ],
  "consentiments": {
    "compartir_datos": 145,
    "acepta_comunicaciones": 289,
    "analytics": 412,
    "total": 533
  },
  "segments": [
    {
      "segment": "VIP (10+ pedidos)",
      "usuaris": 23,
      "gasto_medio": 487.5
    }
  ],
  "comportamentCompra": [
    {
      "id": 45,
      "total_pedidos": 15,
      "total_gastado": 678.9,
      "ticket_medio": 45.26,
      "ultima_compra": "2026-01-10"
    }
  ]
}
```

**Consultes principals:**

1. **Nous usuaris per dia**:

```sql
SELECT
  DATE(fecha_registro) as dia,
  COUNT(*) as nous_usuaris
FROM usuarios
WHERE fecha_registro >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(fecha_registro)
ORDER BY dia
```

2. **Segments de clients**:

```sql
SELECT
  CASE
    WHEN total_pedidos >= 10 THEN 'VIP (10+ pedidos)'
    WHEN total_pedidos >= 5 THEN 'Frequent (5-9 pedidos)'
    WHEN total_pedidos >= 2 THEN 'Regular (2-4 pedidos)'
    ELSE 'Nou (1 pedido)'
  END as segment,
  COUNT(*) as usuaris,
  AVG(total_gastado) as gasto_medio
FROM (
  SELECT
    u.id,
    COUNT(p.id) as total_pedidos,
    COALESCE(SUM(p.total), 0) as total_gastado
  FROM usuarios u
  LEFT JOIN pedidos p ON u.id = p.cliente_id
  WHERE u.estado = 'activo' AND u.rol = 'cliente'
  GROUP BY u.id
  HAVING total_pedidos > 0
) subquery
GROUP BY segment
ORDER BY gasto_medio DESC
```

3. **Consentiments**:

```sql
SELECT
  SUM(CASE WHEN compartir_datos = 1 THEN 1 ELSE 0 END) as compartir_datos,
  SUM(CASE WHEN acepta_comunicaciones = 1 THEN 1 ELSE 0 END) as acepta_comunicaciones,
  SUM(CASE WHEN analytics = 1 THEN 1 ELSE 0 END) as analytics,
  COUNT(*) as total
FROM consentimientos
```

**Font de dades:** Principalment `freshexpress_operacional` (usuaris, comandes)

---

### Seguretat dels Endpoints

Tots els endpoints de Data Broker estan protegits:

```typescript
// Verificar autenticació
const token = cookies.get("auth_token")?.value;
if (!token) {
  return new Response(JSON.stringify({ error: "No autenticat" }), {
    status: 401,
  });
}

// Verificar token vàlid
const payload = verifyToken(token);
if (!payload) {
  return new Response(JSON.stringify({ error: "Token invàlid" }), {
    status: 401,
  });
}

// Verificar rol admin
const user = await getUserById(payload.userId);
if (!user || user.rol !== "admin") {
  return new Response(JSON.stringify({ error: "No autoritzat" }), {
    status: 403,
  });
}
```

**Flux de seguretat:**

1. Validar existència de cookie `auth_token`
2. Verificar signatura JWT del token
3. Obtenir usuari de la base de dades
4. Comprovar que `rol === 'admin'`
5. Si tot OK → executar consultes
6. Si error → retornar 401 (no autenticat) o 403 (no autoritzat)

---

## Resum del Funcionament

### Flux Complet End-to-End

```
1. CAPTURA (Frontend)
   ┌────────────────────────────────────────────┐
   │  Usuari navega per la web                  │
   │  - Clica un producte                       │
   │  - Fa scroll                               │
   │  - Afegeix al carret                       │
   └────────────────────┬───────────────────────┘
                        ↓
   ┌────────────────────────────────────────────┐
   │  tracking.js captura l'event               │
   │  - Tipus: product_click                    │
   │  - Element: button#product-123             │
   │  - Dades: {productId: 123, price: 2.50}    │
   │  - Timestamp, URL, resolució...            │
   └────────────────────┬───────────────────────┘
                        ↓
   ┌────────────────────────────────────────────┐
   │  Event afegit a la cua (eventQueue)        │
   │  Espera fins tenir 10 events o 5 segons    │
   └────────────────────┬───────────────────────┘
                        ↓
2. ENVIAMENT
   ┌────────────────────────────────────────────┐
   │  POST /api/track                           │
   │  Body: {events: [...]}                     │
   │  Cookie: tracking_session                  │
   └────────────────────┬───────────────────────┘
                        ↓
3. PROCESSAMENT (Backend)
   ┌────────────────────────────────────────────┐
   │  track.ts rep la petició                   │
   │  - Valida JSON                             │
   │  - Obté Session ID (o crea nou)            │
   │  - Extreu User-Agent                       │
   └────────────────────┬───────────────────────┘
                        ↓
   ┌────────────────────────────────────────────┐
   │  Enriqueix dades                           │
   │  - Dispositiu: mobile/tablet/desktop       │
   │  - Navegador: Chrome/Firefox...            │
   │  - Sistema operatiu: Windows/macOS...      │
   │  - Geolocalització: ES (país)              │
   └────────────────────┬───────────────────────┘
                        ↓
   ┌────────────────────────────────────────────┐
   │  tracking.ts processa cada event           │
   │  - processTrackingEvent()                  │
   └────────────────────┬───────────────────────┘
                        ↓
4. EMMAGATZEMATGE
   ┌────────────────────────────────────────────┐
   │  INSERT INTO eventos_web                   │
   │  - sesion_id: sess_abc123_1673456789       │
   │  - tipo_evento: product_click              │
   │  - datos_evento: {"productId": 123}        │
   │  - dispositivo: desktop                    │
   │  - fecha_evento: 2026-01-14 15:30:45       │
   └────────────────────┬───────────────────────┘
                        ↓
   ┌────────────────────────────────────────────┐
   │  INSERT/UPDATE sesiones_web                │
   │  - Si sessió nova: INSERT                  │
   │  - Si sessió existent: UPDATE              │
   │    * eventos_totales += 1                  │
   │    * clics_totales += 1 (si és click)      │
   │    * productos_vistos += 1 (si és product) │
   │    * duracion_segundos recalculat          │
   └────────────────────┬───────────────────────┘
                        ↓
5. CONSULTA (Admin)
   ┌────────────────────────────────────────────┐
   │  Admin accedeix a /admin/databroker        │
   │  - Autentica amb JWT                       │
   │  - Verifica rol = admin                    │
   └────────────────────┬───────────────────────┘
                        ↓
   ┌────────────────────────────────────────────┐
   │  JavaScript fa fetch als endpoints         │
   │  - GET /api/admin/databroker/stats         │
   │  - GET /api/admin/databroker/productes     │
   │  - GET /api/admin/databroker/usuaris       │
   └────────────────────┬───────────────────────┘
                        ↓
   ┌────────────────────────────────────────────┐
   │  Endpoints consulten BD                    │
   │  - queryBroker() → databroker DB           │
   │  - queryOperacional() → operacional DB     │
   └────────────────────┬───────────────────────┘
                        ↓
   ┌────────────────────────────────────────────┐
   │  Retorna dades JSON                        │
   │  - Stats generals                          │
   │  - Productes més venuts                    │
   │  - Segments d'usuaris                      │
   └────────────────────┬───────────────────────┘
                        ↓
6. VISUALITZACIÓ
   ┌────────────────────────────────────────────┐
   │  JavaScript renderitza dades               │
   │  - Actualitza stats cards                  │
   │  - Omple taules                            │
   │  - Genera gràfics amb Chart.js             │
   └────────────────────────────────────────────┘
```

### Components Clau

| Component            | Ubicació                                       | Propòsit                    |
| -------------------- | ---------------------------------------------- | --------------------------- |
| **tracking.js**      | `/public/js/tracking.js`                       | Captura events al navegador |
| **track.ts**         | `/src/pages/api/track.ts`                      | Endpoint receptor d'events  |
| **tracking.ts**      | `/src/lib/tracking.ts`                         | Lògica de processament      |
| **db.ts**            | `/src/lib/db.ts`                               | Connexions a BD (dual pool) |
| **stats.ts**         | `/src/pages/api/admin/databroker/stats.ts`     | API estadístiques generals  |
| **productes.ts**     | `/src/pages/api/admin/databroker/productes.ts` | API analítiques productes   |
| **usuaris.ts**       | `/src/pages/api/admin/databroker/usuaris.ts`   | API comportament usuaris    |
| **databroker.astro** | `/src/pages/admin/databroker.astro`            | Interfície visual           |

### Bases de Dades

| Base de Dades                | Taules Principals                         | Propòsit                        |
| ---------------------------- | ----------------------------------------- | ------------------------------- |
| **freshexpress_operacional** | usuarios, productos, pedidos, empresas    | Dades transaccionals del negoci |
| **freshexpress_databroker**  | eventos_web, sesiones_web, datos_anonimos | Analítica i tracking            |

### Separació de Concerns

**Per què 2 bases de dades?**

1. **Rendiment**: Les consultes analítiques no afecten operacions crítiques
2. **Escalabilitat**: Data Broker pot créixer independentment
3. **Seguretat**: Aïllament de dades sensibles
4. **Manteniment**: Backups i manteniment separats
5. **Privacitat**: Facilita anonimització i compliment GDPR

### Característiques Destacades

**1. Tracking Automàtic**

- No requereix configuració manual
- Captura events sense intervenir el codi
- Sistema de retry automàtic
- Batch processing per eficiència

**2. Enriquiment de Dades**

- Detecció automàtica de dispositiu
- Identificació de navegador i SO
- Assignació de sessió persistent
- Metadades contextuals

**3. Privacitat i GDPR**

- Sistema de consentiments
- Anonimització amb hash SHA-256
- Dades agregades per segments
- Control de retenció de dades

**4. Anàlisi Avançada**

- Cross-database queries (operacional + broker)
- Segmentació dinàmica d'usuaris
- Funnel analysis (clicks → cart → compra)
- Time-series analytics

**5. Visualització**

- Dashboard interactiu
- Filtres temporals
- Gràfics responsives (Chart.js)
- Actualització en temps real

### Mètriques Clau

**Engagement:**

- Sessions totals
- Duració mitjana de sessió
- Pàgines per sessió
- Taxa de rebot

**Productes:**

- CTR (Click-Through Rate)
- Conversió carret → compra
- Productes més vistos vs venuts
- Ingressos per categoria

**Usuaris:**

- Creixement de registres
- Segments de comportament
- Taxa de retenció
- Lifetime Value (LTV)

**Tracking:**

- Events per hora
- Distribució de dispositius
- Distribució de navegadors
- Pàgines d'entrada/sortida

---

## Casos d'Ús

### 1. Optimització de Productes

**Problema:** Productes amb molts clicks però poques vendes

**Solució amb Data Broker:**

```
1. Consultar Tab Productes
2. Comparar clicksProductes vs productesVenuts
3. Identificar productes amb alta CTR però baixa conversió
4. Analitzar possibles causes:
   - Preu massa alt
   - Descripció poc clara
   - Imatges de baixa qualitat
   - Problema amb stock
```

### 2. Segmentació de Clients

**Problema:** Personalitzar campanyes de màrqueting

**Solució amb Data Broker:**

```
1. Consultar Tab Usuaris → Segments
2. Identificar usuaris VIP (10+ comandes)
3. Oferir descomptes exclusius o programa de fidelització
4. Recobrar clients inactius (última compra > 90 dies)
```

### 3. Anàlisi de Tendències

**Problema:** Entendre patrons de comportament

**Solució amb Data Broker:**

```
1. Consultar Tab General → Events per Dia
2. Identificar pics d'activitat
3. Correlacionar amb campanyes o esdeveniments
4. Ajustar inventari i recursos
```

### 4. Millora de la UX

**Problema:** Usuaris abandonen el carret

**Solució amb Data Broker:**

```
1. Comparar Tab Productes: Afegits al Carret vs Vendes
2. Calcular taxa d'abandonament
3. Implementar emails de recordatori
4. Simplificar procés de checkout
```

---

## Conclusió

El **Data Broker de FreshExpress** és un sistema complet d'analítica web que:

✅ **Captura** automàticament el comportament dels usuaris  
✅ **Processa** i enriqueix les dades amb metadades contextuals  
✅ **Emmagatzema** de forma estructurada en una BD dedicada  
✅ **Analitza** amb queries SQL avançades (inclòs cross-database)  
✅ **Visualitza** amb un dashboard interactiu i gràfics  
✅ **Respecta** la privacitat amb anonimització i consentiments

**Punts forts:**

- Arquitectura escalable amb separació de BD
- Sistema de tracking no invasiu
- Anàlisi creuada de dades operacionals i comportamentals
- Compliment GDPR amb dades anònimes
- Dashboard intuïtiu amb mètriques accionables

**Tecnologies utilitzades:**

- **Frontend**: JavaScript (tracking.js), Astro, Chart.js
- **Backend**: TypeScript, Astro API Routes
- **Base de dades**: MySQL (2 instàncies)
- **Autenticació**: JWT tokens
- **Visualització**: Chart.js, TailwindCSS

Aquest sistema permet a FreshExpress prendre decisions basades en dades reals, optimitzar l'experiència d'usuari i identificar oportunitats de negoci.

---

**Document generat:** 14 de gener de 2026  
**Versió:** 1.0  
**Autoria:** Sistema FreshExpress - Data Broker Team
