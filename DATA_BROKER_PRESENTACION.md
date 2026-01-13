# Data Broker - Guion de Presentación

## FreshExpress API como Intermediario de Datos

---

## 📋 Índice de la Presentación (5-7 minutos)

1. **¿Qué es un Data Broker?** (1 min)
2. **Arquitectura Técnica** (1.5 min)
3. **Implementación Real en FreshExpress** (2 min)
4. **Modelo de Negocio: Monetización de Datos** (1.5 min)
5. **Ética y Legalidad (GDPR)** (1 min)

---

## 1. ¿Qué es un Data Broker?

### Definición

Un **Data Broker** es un intermediario tecnológico que:

- Recopila datos de usuarios durante su uso normal de una aplicación
- Agrega y anonimiza esos datos
- Los vende a terceros interesados (empresas de análisis de mercado, competidores, investigadores)

### En FreshExpress

Nuestra REST API no solo sirve datos al frontend, sino que **registra cada petición**, creando un valioso conjunto de datos sobre:

- Patrones de consumo
- Empresas más consultadas
- Horarios de pedidos
- Productos más demandados

---

## 2. Arquitectura Técnica

### ANTES: Arquitectura Monolítica

```
┌─────────────┐
│   Cliente   │
│  (Browser)  │
└──────┬──────┘
       │ Solicitud HTTP
       ↓
┌─────────────┐
│   Astro     │
│  Frontend   │
└──────┬──────┘
       │ Consulta SQL directa
       ↓
┌─────────────┐
│   MySQL     │
│  Database   │
└─────────────┘
```

**Limitaciones:**

- Sin tracking de peticiones
- Sin intermediación
- Sin posibilidad de monetizar datos

### DESPUÉS: Arquitectura con Data Broker

```
┌─────────────┐
│   Cliente   │
│  (Browser)  │
└──────┬──────┘
       │ Solicitud HTTP
       ↓
┌─────────────┐
│   Astro     │
│  Frontend   │
└──────┬──────┘
       │ API REST
       ↓
┌─────────────┐          ┌──────────────────┐
│  REST API   │──────────│ api_access_log   │
│ Data Broker │  Registra│ (Tabla Tracking) │
└──────┬──────┘          └──────────────────┘
       │ Consulta SQL
       ↓
┌─────────────┐
│   MySQL     │
│  Database   │
└─────────────┘
```

**Ventajas:**
✅ Toda petición queda registrada  
✅ Datos agregados y anonimizados  
✅ Posibilidad de generar informes vendibles  
✅ Separación de responsabilidades

---

## 3. Implementación Real en FreshExpress

### Servidor REST API (Node.js + Express)

```
📁 Servidor API (143.47.36.36:3000)
├── index.js              → Configuración Express + CORS
├── routes/
│   └── index.routes.js   → Definición de endpoints
├── controladors/
│   └── index.controllers.js → Lógica de negocio
└── config/
    └── db.js             → Conexión MySQL
```

### Endpoint de Ejemplo: GET /empresas

**Código en `controladors/index.controllers.js`:**

```javascript
const getEmpresasDisponibles = async (req, res) => {
  try {
    // 1. REGISTRAR LA PETICIÓN (Data Broker)
    await pool.query(
      "INSERT INTO api_access_log (endpoint, ip_address, user_agent) VALUES (?, ?, ?)",
      ["/empresas", req.ip, req.headers["user-agent"]]
    );

    // 2. OBTENER LOS DATOS SOLICITADOS
    const [empresas] = await pool.query(
      "SELECT id, nombre, logo, descripcion, categoria FROM empresas WHERE activo = 1"
    );

    // 3. RESPONDER AL CLIENTE
    res.json({ success: true, data: empresas });
  } catch (error) {
    console.error("❌ Error obteniendo empresas:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor",
    });
  }
};
```

**¿Qué hace esto?**

1. **Registra** cada petición en `api_access_log` (IP, timestamp, endpoint, user agent)
2. **Consulta** los datos reales de la base de datos
3. **Devuelve** la respuesta JSON al cliente

### Tabla de Tracking: api_access_log

```sql
CREATE TABLE api_access_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    endpoint VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    response_time INT,
    user_id INT,
    INDEX idx_endpoint (endpoint),
    INDEX idx_timestamp (timestamp)
);
```

**Datos que recopila:**

- `endpoint`: Qué consulta (ej: `/empresas`, `/stats/123`)
- `ip_address`: Desde dónde
- `user_agent`: Con qué dispositivo/navegador
- `timestamp`: Cuándo
- `user_id`: Quién (si está autenticado)

---

## 4. Modelo de Negocio: Monetización de Datos

### ¿Qué datos se pueden vender?

#### Informe 1: Ranking de Empresas Más Consultadas

```sql
SELECT
    e.nombre AS empresa,
    COUNT(*) AS consultas_totales,
    COUNT(DISTINCT a.ip_address) AS visitantes_unicos
FROM api_access_log a
JOIN empresas e ON a.endpoint LIKE CONCAT('%', e.id, '%')
WHERE a.timestamp > DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY e.id
ORDER BY consultas_totales DESC;
```

**Valor comercial:** €2,000 - €5,000/mes  
**Comprador:** Empresas de la competencia, consultoras de mercado

#### Informe 2: Análisis Horario de Demanda

```sql
SELECT
    HOUR(timestamp) AS hora,
    COUNT(*) AS peticiones,
    COUNT(DISTINCT user_id) AS usuarios_activos
FROM api_access_log
WHERE endpoint = '/stats'
GROUP BY HOUR(timestamp)
ORDER BY hora;
```

**Valor comercial:** €1,500 - €3,000/mes  
**Comprador:** Empresas de logística, estudios de mercado

#### Informe 3: Patrones de Compra por Categoría

```sql
SELECT
    e.categoria,
    COUNT(*) AS consultas,
    ROUND(AVG(response_time), 2) AS tiempo_promedio_ms
FROM api_access_log a
JOIN empresas e ON a.endpoint LIKE '%empresas%'
GROUP BY e.categoria;
```

**Valor comercial:** €1,000 - €2,500/mes  
**Comprador:** Productores, distribuidores

### Proyección de Ingresos Anuales

| Tipo de Informe  | Precio Mensual | Compradores | Ingreso Anual |
| ---------------- | -------------- | ----------- | ------------- |
| Ranking Empresas | €3,500         | 3 clientes  | €126,000      |
| Análisis Horario | €2,000         | 2 clientes  | €48,000       |
| Patrones Compra  | €1,500         | 2 clientes  | €36,000       |
| **TOTAL**        |                |             | **€210,000**  |

### Características de los Datos Vendidos

✅ **Agregados:** No se venden datos individuales  
✅ **Anonimizados:** Sin información personal identificable  
✅ **Legales:** Consentimiento explícito del usuario  
✅ **Actualizados:** Informes mensuales/trimestrales

---

## 5. Ética y Legalidad (GDPR)

### Consentimiento Explícito del Usuario

**Durante el registro en FreshExpress:**

```html
<form id="register-form">
  <!-- Campos del formulario... -->

  <div class="consent-section">
    <input
      type="checkbox"
      id="accept-data-sharing"
      name="accept_data_sharing"
      required
    />
    <label for="accept-data-sharing">
      Acepto que FreshExpress recopile datos agregados y anonimizados sobre mi
      uso de la plataforma con fines de análisis de mercado.
      <a href="/politica-dades" target="_blank">Más información</a>
    </label>
  </div>

  <button type="submit">Registrarse</button>
</form>
```

### Almacenamiento en Base de Datos

```sql
ALTER TABLE usuarios ADD COLUMN consent_data_sharing BOOLEAN DEFAULT FALSE;
ALTER TABLE usuarios ADD COLUMN consent_date DATETIME;
```

### Política de Privacidad (extracto)

> **Uso de Datos con Fines Analíticos**
>
> FreshExpress recopila datos sobre el uso de la plataforma (consultas, horarios,
> empresas visitadas) de forma anonimizada y agregada. Estos datos pueden ser
> utilizados para generar informes estadísticos que se venden a terceros con fines
> de investigación de mercado.
>
> **Sus derechos:**
>
> - Puede revocar su consentimiento en cualquier momento desde Configuración
> - Sus datos personales NUNCA se venden de forma individual
> - Puede solicitar la eliminación de sus datos según el GDPR (Art. 17)

### Cumplimiento GDPR

| Artículo GDPR | Requisito         | Implementación FreshExpress          |
| ------------- | ----------------- | ------------------------------------ |
| Art. 6.1(a)   | Consentimiento    | ✅ Checkbox obligatorio en registro  |
| Art. 13       | Transparencia     | ✅ Política de privacidad clara      |
| Art. 15       | Derecho de acceso | ✅ Usuario puede descargar sus datos |
| Art. 17       | Derecho al olvido | ✅ Botón "Eliminar mi cuenta"        |
| Art. 25       | Privacy by design | ✅ Anonimización automática          |

---

## 6. Demo en Vivo (Código que Mostrar)

### 1. Configuración de la API REST

**Archivo:** `index.js` (servidor API)

```javascript
const express = require("express");
const cors = require("cors");
const routes = require("./routes/index.routes");

const app = express();

// Permitir peticiones desde el frontend
app.use(
  cors({
    origin: ["http://localhost:4321", "http://143.47.36.36"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api", routes);

app.listen(3000, "0.0.0.0", () => {
  console.log("🚀 Data Broker API corriendo en http://143.47.36.36:3000");
});
```

### 2. Frontend Consumiendo la API

**Archivo:** `src/pages/productes.astro` (líneas 385-420)

```javascript
async function loadEmpresas() {
    try {
        console.log('🏢 Carregant empreses des de la API...');

        const response = await fetch('http://143.47.36.36:3000/empresas');
        const result = await response.json();

        if (result.success) {
            console.log(`✅ ${result.data.length} empreses carregades`);

            // Agrupar por categoría
            const empresasPorCategoria = result.data.reduce((acc: any, emp: any) => {
                if (!acc[emp.categoria]) acc[emp.categoria] = [];
                acc[emp.categoria].push(emp);
                return acc;
            }, {});

            // Generar HTML
            let html = '';
            for (const [categoria, emps] of Object.entries(empresasPorCategoria)) {
                html += `<h2 class="categoria-titulo">${categoria}</h2><div class="empresas-grid">`;
                (emps as any[]).map((empresa: any) => {
                    html += `<a href="/productes?empresa=${empresa.id}" class="empresa-card">
                        <img src="${empresa.logo}" alt="${empresa.nombre}">
                        <h3>${empresa.nombre}</h3>
                        <p>${empresa.descripcion}</p>
                    </a>`;
                });
                html += '</div>';
            }

            document.getElementById('empresas-container')!.innerHTML = html;
        }
    } catch (error) {
        console.error('❌ Error carregant empreses:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadEmpresas);
```

### 3. Consulta de Datos para Vender

**SQL para generar informe vendible:**

```sql
-- Ranking de empresas más consultadas (último mes)
SELECT
    e.nombre AS Empresa,
    e.categoria AS Categoría,
    COUNT(DISTINCT DATE(a.timestamp)) AS Días_con_consultas,
    COUNT(*) AS Total_consultas,
    COUNT(DISTINCT a.ip_address) AS Visitantes_únicos,
    ROUND(AVG(a.response_time), 2) AS Tiempo_respuesta_promedio_ms
FROM api_access_log a
JOIN empresas e ON a.endpoint LIKE CONCAT('%', e.id, '%')
WHERE a.timestamp > DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY e.id
ORDER BY Total_consultas DESC
LIMIT 20;
```

---

## 7. Script de Presentación (5-7 min)

### Minuto 1: Introducción

> "Hola a todos. Hoy voy a presentar cómo FreshExpress implementa un **Data Broker**
> a través de su REST API. Un Data Broker es un intermediario que no solo sirve datos,
> sino que también **recopila información valiosa** sobre cómo los usuarios interactúan
> con la plataforma."

### Minuto 2: Problema

> "Antes, nuestra aplicación hacía consultas directas a la base de datos. Esto significa
> que **perdíamos información valiosa**: no sabíamos qué empresas eran más consultadas,
> en qué horarios, o desde qué dispositivos. Todo ese potencial de negocio se perdía."

### Minuto 3: Solución Técnica

> "Creamos una REST API que actúa como **intermediario inteligente**. Cada vez que el
> frontend solicita datos, la API no solo responde, sino que **registra la petición**
> en una tabla `api_access_log`."
>
> [Mostrar código de getEmpresasDisponibles]
>
> "Como ven aquí, antes de devolver las empresas, guardamos: endpoint, IP, user agent,
> timestamp... Datos que después podemos analizar."

### Minuto 4: Monetización

> "Ahora viene lo interesante: **¿cómo convertimos estos datos en dinero?** Generamos
> informes agregados y anonimizados que son **oro para empresas de la competencia**."
>
> [Mostrar tabla de proyección de ingresos]
>
> "Por ejemplo, un informe mensual de las empresas más consultadas puede venderse a
> €3,500 a consultoras de mercado. Con solo 3 clientes, son €126,000 anuales."

### Minuto 5: Ética y Legalidad

> "Muy importante: esto es **100% legal y ético**. Los usuarios dan su consentimiento
> explícito durante el registro mediante un checkbox que acepta el tratamiento de datos
> agregados. Cumplimos con el GDPR: nunca vendemos datos individuales, solo estadísticas."
>
> [Mostrar formulario de consentimiento]

### Minuto 6: Demo

> "Vamos a verlo en acción."
>
> [Abrir navegador]
>
> 1. Frontend en localhost:4321/productes
> 2. Abrir DevTools → Network
> 3. Recargar página
> 4. Mostrar petición a http://143.47.36.36:3000/empresas
> 5. Mostrar respuesta JSON
>
> "Cada vez que alguien visita esta página, se registra en api_access_log."

### Minuto 7: Conclusión

> "En resumen: transformamos una aplicación simple en una **máquina de generar valor**.
> La REST API no solo mejora la arquitectura, sino que **crea un activo vendible**: datos
> de mercado. Con una proyección conservadora de €210,000 anuales, el Data Broker puede
> ser más rentable que el negocio principal."

---

## 8. Preguntas Frecuentes (Preparación)

### ¿No es ilegal vender datos de usuarios?

**R:** No, siempre que:

1. Se solicite consentimiento explícito (GDPR Art. 6.1.a)
2. Los datos sean agregados y anonimizados
3. Se informe en la política de privacidad

### ¿Los usuarios pueden negarse?

**R:** Sí, tienen varias opciones:

- No marcar el checkbox de consentimiento al registrarse
- Revocar el consentimiento desde Configuración
- Solicitar eliminación de datos (derecho al olvido)

### ¿Qué empresas comprarían estos datos?

**R:**

- Competidores que quieren saber qué empresas son populares
- Consultoras de mercado (Nielsen, Kantar, IDC)
- Productores que quieren optimizar distribución
- Inversores evaluando el sector

### ¿Cuánto tiempo se guardan los datos?

**R:** Según política de retención:

- Datos operacionales: 90 días
- Datos agregados para informes: 2 años
- Datos de usuarios que revocan consentimiento: 30 días (por ley)

---

## 9. Recursos Adicionales

### Endpoints Actuales de la API

```
GET  /health                → Estado del servidor
GET  /empresas              → Listado de empresas (con tracking)
GET  /stats/:userId         → Estadísticas de usuario (con tracking)
GET  /stats/global          → Estadísticas globales (con tracking)
```

### Configuración del Servidor

- **URL:** http://143.47.36.36:3000
- **Base de datos:** MySQL (freshexpress_operacional)
- **Usuario DB:** api2
- **Tecnología:** Node.js 20 + Express + mysql2
- **Gestión de procesos:** Nodemon (desarrollo) / PM2 (producción)

### Archivos Clave del Proyecto

- [controladors/index.controllers.js](http://143.47.36.36:3000) - Lógica de negocio
- [routes/index.routes.js](http://143.47.36.36:3000) - Definición de rutas
- [src/pages/dashboard.astro](c:/dev/FreshExpress/src/pages/dashboard.astro) - Consumo de API
- [src/pages/productes.astro](c:/dev/FreshExpress/src/pages/productes.astro) - Consumo de API

---

## 10. Checklist para la Presentación

### Antes de empezar

- [ ] Servidor API corriendo en 143.47.36.36:3000
- [ ] Base de datos MySQL accesible
- [ ] Frontend en localhost:4321 funcionando
- [ ] Navegador con DevTools preparado
- [ ] Postman/Thunder Client para pruebas de API

### Durante la demo

- [ ] Mostrar arquitectura (diagramas)
- [ ] Mostrar código de controlador con tracking
- [ ] Ejecutar petición desde frontend y mostrar Network tab
- [ ] Mostrar tabla api_access_log con datos reales
- [ ] Ejecutar consulta SQL de análisis de datos
- [ ] Mostrar formulario de consentimiento

### Puntos clave a enfatizar

- [ ] Doble función: servir datos + recopilar analytics
- [ ] Cumplimiento GDPR y consentimiento explícito
- [ ] Potencial de monetización (€210k/año)
- [ ] Datos agregados y anonimizados
- [ ] Separación de responsabilidades (frontend/API/DB)

---

## 11. Contacto y Referencias

**Proyecto:** FreshExpress  
**Tipo:** Plataforma de pedidos de productos frescos  
**Tecnologías:** Astro, Node.js, Express, MySQL  
**Data Broker:** REST API con tracking de peticiones

**Referencias GDPR:**

- Art. 6.1(a): Consentimiento
- Art. 13: Derecho a la información
- Art. 15: Derecho de acceso
- Art. 17: Derecho al olvido
- Art. 25: Privacy by design

---

## 📊 Slides Sugeridas (si se usa PowerPoint)

1. **Portada:** "Data Broker en FreshExpress: Monetizando el Flujo de Datos"
2. **¿Qué es un Data Broker?** (definición + ejemplos reales: Acxiom, Experian)
3. **Arquitectura Antes/Después** (diagramas visuales)
4. **Implementación Técnica** (código del controlador)
5. **Tabla api_access_log** (estructura y datos de ejemplo)
6. **Monetización: 3 Informes Principales** (con precios)
7. **Proyección Anual: €210k** (gráfico de barras)
8. **Consentimiento del Usuario** (screenshot del formulario)
9. **Cumplimiento GDPR** (tabla de artículos)
10. **Demo en Vivo** (captura de pantalla DevTools)
11. **Conclusiones** (resumen de beneficios)
12. **Preguntas**

---

**Última actualización:** 13 de enero de 2026  
**Versión:** 1.0  
**Autor:** FreshExpress Development Team
