# 🚀 PLA D'IMPLEMENTACIÓ - DATABROKER COMPLET

## 📋 TAULES I CAMPS NO UTILITZATS - PLA D'ACCIÓ

---

## 1️⃣ **TAULA: `datos_anonimos`** ❌ BUIDA

### **Propòsit**
Emmagatzemar perfils anònims d'usuaris amb hash SHA-256 per complir amb GDPR.

### **Camps Clau**
```sql
- hash_usuario VARCHAR(64)          -- Hash SHA-256 de user_id
- rango_edad VARCHAR(20)            -- "18-25", "26-35", etc.
- genero ENUM                       -- masculino/femenino/otro
- codigo_postal_prefijo VARCHAR(5)  -- Primeres 2 xifres CP
- segmento_comportamiento           -- VIP/Frequent/Regular/Nou
- frecuencia_compra ENUM            -- muy_alta/alta/media/baja
- ticket_medio_rango                -- "<20€", "20-50€", ">50€"
- categorias_preferidas JSON        -- ["frutas", "verduras"]
- nivel_compromiso_eco ENUM         -- bajo/medio/alto
- total_pedidos INT
- fecha_primera_compra, fecha_ultima_compra
```

### **Com Implementar-ho**

#### **Pas 1: Crear funció de hash**
```typescript
// src/lib/databroker.ts
import crypto from 'crypto';

export function generateUserHash(userId: number): string {
  const secret = process.env.DATABROKER_SECRET || 'freshexpress-secret-2026';
  return crypto
    .createHash('sha256')
    .update(`${userId}-${secret}`)
    .digest('hex');
}
```

#### **Pas 2: Trigger automàtic al registrar usuari**
```typescript
// src/lib/auth.ts - després de crear usuari
const userHash = generateUserHash(newUser.id);
await queryBroker(`
  INSERT INTO datos_anonimos (
    hash_usuario, rango_edad, codigo_postal_prefijo,
    segmento_comportamiento, fecha_creacion
  ) VALUES (?, ?, ?, 'nuevo', NOW())
`, [userHash, calcularRangoEdad(edad), cp.substring(0, 2)]);
```

#### **Pas 3: Actualitzar amb cada compra**
```typescript
// src/pages/api/checkout/finalitzar.ts
const userHash = generateUserHash(userId);
await queryBroker(`
  UPDATE datos_anonimos SET
    total_pedidos = total_pedidos + 1,
    fecha_ultima_compra = CURDATE(),
    ticket_medio_rango = ?,
    frecuencia_compra = CASE
      WHEN total_pedidos >= 20 THEN 'muy_alta'
      WHEN total_pedidos >= 10 THEN 'alta'
      WHEN total_pedidos >= 5 THEN 'media'
      ELSE 'baja'
    END,
    segmento_comportamiento = CASE
      WHEN total_pedidos >= 10 THEN 'VIP'
      WHEN total_pedidos >= 5 THEN 'Frequent'
      WHEN total_pedidos >= 2 THEN 'Regular'
      ELSE 'Nou'
    END
  WHERE hash_usuario = ?
`, [calcularRangoTicket(total), userHash]);
```

#### **Pas 4: Cron job per actualitzar categories preferides**
```typescript
// scripts/update-user-profiles.ts
// Executar diàriament a les 2am
async function updateUserProfiles() {
  const users = await queryOperacional(`
    SELECT u.id, GROUP_CONCAT(DISTINCT pr.categoria) as categorias
    FROM usuarios u
    JOIN pedidos p ON u.id = p.cliente_id
    JOIN detalle_pedido dp ON p.id = dp.pedido_id
    JOIN productos pr ON dp.producto_id = pr.id
    GROUP BY u.id
  `);
  
  for (const user of users) {
    const hash = generateUserHash(user.id);
    await queryBroker(`
      UPDATE datos_anonimos 
      SET categorias_preferidas = ?
      WHERE hash_usuario = ?
    `, [JSON.stringify(user.categorias.split(',')), hash]);
  }
}
```

**TEMPS ESTIMAT: 2-3 dies**

---

## 2️⃣ **TAULA: `productos_anonimos`** ❌ BUIDA

### **Propòsit**
Estadístiques anònimes de cada producte per anàlisi de tendències.

### **Camps Clau**
```sql
- hash_producto VARCHAR(64)     -- Hash de product_id
- veces_visto INT
- veces_carrito INT
- veces_comprado INT
- valoracion_media DECIMAL
- eco_score INT
```

### **Com Implementar-ho**

#### **Actualitzar en tracking events**
```typescript
// src/lib/tracking.ts - dins processTrackingEvent
if (event.tipo_evento === 'product_impression') {
  const productHash = generateProductHash(event.datos_evento.productId);
  await queryBroker(`
    INSERT INTO productos_anonimos (hash_producto, veces_visto, categoria)
    VALUES (?, 1, ?)
    ON DUPLICATE KEY UPDATE veces_visto = veces_visto + 1
  `, [productHash, event.datos_evento.productCategory]);
}

if (event.tipo_evento === 'add_to_cart') {
  await queryBroker(`
    UPDATE productos_anonimos 
    SET veces_carrito = veces_carrito + 1
    WHERE hash_producto = ?
  `, [generateProductHash(event.datos_evento.productId)]);
}
```

#### **Actualitzar en compra**
```typescript
// src/pages/api/checkout/finalitzar.ts
for (const item of cartItems) {
  const productHash = generateProductHash(item.producto_id);
  await queryBroker(`
    UPDATE productos_anonimos 
    SET veces_comprado = veces_comprado + 1,
        fecha_actualizacion = NOW()
    WHERE hash_producto = ?
  `, [productHash]);
}
```

**TEMPS ESTIMAT: 1-2 dies**

---

## 3️⃣ **TAULA: `metricas_diarias`** ❌ BUIDA

### **Propòsit**
Agregació diària de totes les mètriques per anàlisi històrica.

### **Com Implementar-ho**

#### **Cron Job Diari**
```typescript
// scripts/calculate-daily-metrics.ts
// Executar cada dia a les 00:05

async function calculateDailyMetrics() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const fecha = yesterday.toISOString().split('T')[0];

  // Visites totals
  const [visitas] = await queryBroker(`
    SELECT COUNT(*) as total FROM eventos_web 
    WHERE DATE(fecha_evento) = ?
  `, [fecha]);

  // Visitants únics
  const [visitantes] = await queryBroker(`
    SELECT COUNT(DISTINCT sesion_id) as total FROM sesiones_web
    WHERE DATE(fecha_inicio) = ?
  `, [fecha]);

  // Sessions
  const [sessions] = await queryBroker(`
    SELECT 
      COUNT(*) as total,
      AVG(duracion_segundos) as tiempo_medio,
      AVG(paginas_vistas) as paginas_por_sesion,
      SUM(CASE WHEN es_rebote = 1 THEN 1 ELSE 0 END) / COUNT(*) * 100 as tasa_rebote
    FROM sesiones_web
    WHERE DATE(fecha_inicio) = ?
  `, [fecha]);

  // Pedidos i ingressos
  const [pedidos] = await queryOperacional(`
    SELECT 
      COUNT(*) as total,
      SUM(total) as ingresos,
      AVG(total) as ticket_medio
    FROM pedidos
    WHERE DATE(fecha_pedido) = ?
  `, [fecha]);

  // Insertar mètriques
  await queryBroker(`
    INSERT INTO metricas_diarias (
      fecha, visitas_totales, visitantes_unicos, sesiones_totales,
      pedidos_totales, ingresos_totales, ticket_medio,
      tasa_rebote, tiempo_medio_sesion, paginas_por_sesion
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    fecha, visitas.total, visitantes.total, sessions.total,
    pedidos.total, pedidos.ingresos, pedidos.ticket_medio,
    sessions.tasa_rebote, sessions.tiempo_medio, sessions.paginas_por_sesion
  ]);
}
```

**TEMPS ESTIMAT: 2 dies**

---

## 4️⃣ **TAULA: `funnels_marketing`** ❌ BUIDA

### **Propòsit**
Analitzar conversió en cada pas del funnel.

### **Passos del Funnel**
1. **Paso 1**: Visita a la pàgina d'inici / productes
2. **Paso 2**: Visualització de producte
3. **Paso 3**: Afegir al carret
4. **Paso 4**: Iniciar checkout
5. **Paso 5**: Compra completada

### **Com Implementar-ho**

```typescript
// scripts/calculate-funnels.ts - Diari
async function calculateFunnels() {
  const yesterday = getYesterday();
  
  // Comptar events de cada pas
  const paso1 = await queryBroker(`
    SELECT COUNT(DISTINCT sesion_id) FROM eventos_web
    WHERE DATE(fecha_evento) = ? AND tipo_evento = 'pageview'
  `, [yesterday]);
  
  const paso2 = await queryBroker(`
    SELECT COUNT(DISTINCT sesion_id) FROM eventos_web
    WHERE DATE(fecha_evento) = ? AND tipo_evento = 'product_click'
  `, [yesterday]);
  
  // ... resto de pasos
  
  await queryBroker(`
    INSERT INTO funnels_marketing (
      nombre_funnel, fecha,
      paso_1_visitas, paso_2_producto, paso_3_carrito, 
      paso_4_checkout, paso_5_compra,
      tasa_1_2, tasa_2_3, tasa_3_4, tasa_4_5, tasa_global
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [/* calcular tases */]);
}
```

**TEMPS ESTIMAT: 2 dies**

---

## 5️⃣ **SISTEMA API EXTERNA** ❌ NO IMPLEMENTAT

### **Taules Implicades**
- `clientes_data_broker`
- `ventas_datos`
- `auditoria_acceso_datos`
- `api_rate_limits`
- `informes_generados`

### **Arquitectura Proposada**

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Client    │─────>│  API Gateway │─────>│  DataBroker │
│  Extern     │ API  │  + Auth      │ SQL  │  Database   │
│ (Empresa X) │ Key  │  + Limits    │      │             │
└─────────────┘      └──────────────┘      └─────────────┘
                             │
                             ├─> Auditoria
                             ├─> Rate Limiting  
                             └─> Billing
```

### **Endpoints a Crear**

#### **1. Gestió de Clients**
```
POST   /api/databroker/clients/register
GET    /api/databroker/clients/me
PUT    /api/databroker/clients/me
POST   /api/databroker/clients/generate-keys
```

#### **2. Consulta de Dades**
```
GET    /api/databroker/data/users?filters={}
GET    /api/databroker/data/products?category=X
GET    /api/databroker/data/trends?period=2024-01
GET    /api/databroker/data/funnels?date=2024-01-01
```

#### **3. Vendes de Datasets**
```
POST   /api/databroker/sales/request
GET    /api/databroker/sales/:id/status
GET    /api/databroker/sales/:id/download
```

### **Autenticació**

```typescript
// src/middleware/databroker-auth.ts
export async function authenticateDataBrokerClient(apiKey: string) {
  const [client] = await queryBroker(`
    SELECT * FROM clientes_data_broker 
    WHERE api_key = ? AND activo = 1
  `, [apiKey]);
  
  if (!client) {
    throw new Error('Invalid API key');
  }
  
  // Check rate limits
  const [usage] = await queryBroker(`
    SELECT peticiones_realizadas FROM api_rate_limits
    WHERE cliente_id = ? AND fecha = CURDATE()
  `, [client.id]);
  
  if (usage.peticiones_realizadas >= client.limite_peticiones_dia) {
    throw new Error('Rate limit exceeded');
  }
  
  // Incrementar contador
  await queryBroker(`
    INSERT INTO api_rate_limits (cliente_id, fecha, peticiones_realizadas)
    VALUES (?, CURDATE(), 1)
    ON DUPLICATE KEY UPDATE 
      peticiones_realizadas = peticiones_realizadas + 1,
      ultima_peticion = NOW()
  `, [client.id]);
  
  // Auditar accés
  await queryBroker(`
    INSERT INTO auditoria_acceso_datos (
      cliente_id, endpoint, metodo, fecha_acceso
    ) VALUES (?, ?, ?, NOW())
  `, [client.id, endpoint, method]);
  
  return client;
}
```

**TEMPS ESTIMAT: 1-2 setmanes**

---

## 6️⃣ **HEATMAPS** ❌ NO IMPLEMENTAT

### **Com Implementar-ho**

```typescript
// scripts/generate-heatmaps.ts - Cada hora
async function generateHeatmaps() {
  const pages = ['/productes', '/cistella', '/checkout'];
  
  for (const page of pages) {
    const clicks = await queryBroker(`
      SELECT 
        JSON_EXTRACT(datos_evento, '$.x') as x,
        JSON_EXTRACT(datos_evento, '$.y') as y,
        COUNT(*) as density
      FROM eventos_web
      WHERE tipo_evento = 'click' 
        AND url_actual LIKE ?
        AND fecha_evento >= NOW() - INTERVAL 1 HOUR
      GROUP BY x, y
    `, [`%${page}%`]);
    
    await queryBroker(`
      INSERT INTO heatmaps_data (pagina, fecha, tipo, datos_agregados, total_interacciones)
      VALUES (?, CURDATE(), 'click', ?, ?)
      ON DUPLICATE KEY UPDATE
        datos_agregados = VALUES(datos_agregados),
        total_interacciones = VALUES(total_interacciones)
    `, [page, JSON.stringify(clicks), clicks.length]);
  }
}
```

**TEMPS ESTIMAT: 3-4 dies**

---

## 📊 RESUM D'ESFORÇ

| Tasca | Temps Estimat | Prioritat | Benefici |
|-------|--------------|-----------|----------|
| `datos_anonimos` | 2-3 dies | 🔴 Alta | Compliment GDPR |
| `productos_anonimos` | 1-2 dies | 🔴 Alta | Anàlisi tendències |
| `metricas_diarias` | 2 dies | 🟡 Mitja | KPIs històrics |
| `funnels_marketing` | 2 dies | 🟡 Mitja | Optimització conversió |
| API Externa + Auth | 1-2 setmanes | 🔴 Alta | **Ingressos** |
| `heatmaps_data` | 3-4 dies | 🟢 Baixa | UX insights |
| `tendencias_mercado` | 2-3 dies | 🟡 Mitja | Business intelligence |
| Fixar sessions (duració, rebots) | 1 dia | 🔴 Alta | Mètriques correctes |

**TEMPS TOTAL ESTIMAT: 4-6 setmanes** (1 desenvolupador full-time)

---

## 💡 RECOMANACIONS FINALS

### **Fer PRIMER** (Setmana 1-2)
1. ✅ Implementar hash d'usuaris i `datos_anonimos`
2. ✅ Fixar càlcul de duració de sessions
3. ✅ Actualitzar `productos_anonimos` automàticament
4. ✅ Crear cron job per `metricas_diarias`

### **Fer SEGON** (Setmana 3-4)
5. ✅ Implementar funnels de conversió
6. ✅ Començar API externa (estructura bàsica)
7. ✅ Sistema d'autenticació API keys
8. ✅ Rate limiting i auditoria

### **Fer TERCER** (Setmana 5-6)
9. ✅ Completar endpoints API
10. ✅ Sistema de vendes de dades
11. ✅ Dashboard per clients data broker
12. ✅ Heatmaps i tendències

---

**Important**: No implementar res sense el teu consentiment! Aquest és només el pla detallat.
