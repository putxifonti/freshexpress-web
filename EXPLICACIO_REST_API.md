# Explicació: Per què fem servir la REST API del Servidor Oracle

## Context

Aquest document explica per què la web de FreshExpress utilitza la REST API del servidor Oracle en lloc de fer consultes SQL directes, especialment per al endpoint `/empresas`.

## L'Endpoint REST API

### URL

```
http://143.47.36.36:3000/empresas
```

### Resposta

L'API retorna un JSON amb aquesta estructura:

```json
{
  "success": true,
  "empresas": [
    {
      "id": 1,
      "nombre": "Nom de l'empresa",
      "logoUrl": "url-del-logo.png",
      "descripcion": "Descripció de l'empresa",
      "categoria": "Categoria",
      "activo": 1
    },
    {
      "id": 2,
      "nombre": "Una altra empresa",
      "logoUrl": "altre-logo.png",
      "descripcion": "Altra descripció",
      "categoria": "Altra categoria",
      "activo": 1
    }
  ],
  "total": 2,
  "timestamp": "2026-01-14T10:30:45.123Z"
}
```

## Flux Complet de la Petició

```
1. L'usuari accedeix a https://freshexpress.vercel.app/productes
   ↓
2. Vercel executa el codi SSR (Server-Side Rendering) d'Astro
   ↓
3. El servidor de Vercel fa un fetch a http://143.47.36.36:3000/empresas
   ↓
4. L'API Node.js al servidor Oracle rep la petició
   ↓
5. L'API fa la consulta SQL a la base de dades MySQL:
      SELECT id, nombre, logo as logoUrl, descripcion, categoria, activo
      FROM empresas
      WHERE activo = 1
      ORDER BY nombre ASC
   ↓
6. L'API registra l'accés a la taula api_access_log del Data Broker:
      - endpoint: '/empresas'
      - timestamp: hora actual
      - ip_address: IP de Vercel
      - response_time: temps de resposta
      - status_code: 200
   ↓
7. L'API retorna el JSON amb les dades al servidor de Vercel
   ↓
8. Vercel genera l'HTML amb les empreses i l'envia al navegador de l'usuari
   ↓
9. L'usuari veu la pàgina amb totes les empreses disponibles
```

## Com ho fem servir al codi

### A src/pages/productes.astro (línies 28-49)

```typescript
// Consultem la REST API (en lloc de fer SQL directe)
const response = await fetch("http://143.47.36.36:3000/empresas");
const data = await response.json();

if (data.success && data.empresas) {
  empreses = data.empresas;
} else {
  console.error("Error en obtenir empreses:", data);
  empreses = [];
}
```

### Per què NO fem servir SQL directe

#### ❌ Abans (INCORRECTE):

```typescript
// Això bypassa el Data Broker i no registra accesos!
empreses = await queryOperacional(
  "SELECT id, nombre, logo, descripcion, categoria FROM empresas WHERE activo = 1 ORDER BY nombre ASC"
);
```

#### ✅ Ara (CORRECTE):

```typescript
// Això fa servir la REST API i registra tots els accesos
const response = await fetch("http://143.47.36.36:3000/empresas");
const data = await response.json();
empreses = data.empresas;
```

## Propòsit del Data Broker

El Data Broker registra **TOTES** les peticions a l'API a la taula `api_access_log`:

```sql
CREATE TABLE api_access_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  endpoint VARCHAR(255) NOT NULL,          -- '/empresas', '/productos', etc.
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),                  -- IP del client
  response_time INT,                       -- Temps de resposta en ms
  status_code INT,                         -- 200, 404, 500, etc.
  user_agent TEXT,                         -- Navegador/dispositiu
  referer TEXT,                            -- D'on ve la petició
  session_id VARCHAR(255)                  -- Identificador de sessió
);
```

### Beneficis del registre d'accessos:

1. **Analítica**: Saber quines empreses es consulten més
2. **Rendiment**: Detectar endpoints lents
3. **Seguretat**: Detectar accessos sospitosos o atacs
4. **Monetització**: Dades valuoses per vendre o analitzar
5. **Auditoria**: Traçabilitat completa de totes les consultes

## Comparació: SQL Directe vs REST API

| Aspecte                  | SQL Directe               | REST API                      |
| ------------------------ | ------------------------- | ----------------------------- |
| **Registre Data Broker** | ❌ NO registra            | ✅ SÍ registra                |
| **Seguretat**            | ❌ Exposa credencials SQL | ✅ Capa d'abstracció segura   |
| **Escalabilitat**        | ❌ Difícil de distribuir  | ✅ Fàcil balanceig de càrrega |
| **Cache**                | ❌ No té cache            | ✅ Pot tenir cache Redis      |
| **Rate Limiting**        | ❌ No pot limitar         | ✅ Pot limitar peticions      |
| **Monetització**         | ❌ No té dades d'ús       | ✅ Recull totes les mètriques |
| **Manteniment**          | ❌ Canvis a molts llocs   | ✅ Canvis centralitzats       |

## Per què és crític fer servir la REST API

### Raó 1: Data Broker no funciona sense API

Si fem SQL directe, la taula `api_access_log` està buida. No podem:

- Saber quines empreses són més populars
- Analitzar patrons d'ús
- Monetitzar les dades d'accés
- Facturar per ús de l'API

### Raó 2: Seguretat

Amb SQL directe, les credencials de la base de dades estan al codi de Vercel. Amb l'API:

- Les credencials només són al servidor Oracle
- L'API pot validar tokens i autenticació
- Podem aplicar rate limiting per IP
- Podem bloquejar accessos sospitosos

### Raó 3: Escalabilitat futura

Amb l'API podem:

- Afegir cache Redis per empreses populars
- Distribuir la càrrega entre múltiples servidors
- Afegir CDN per les imatges
- Canviar de base de dades sense tocar el frontend

### Raó 4: Model de negoci

El Data Broker és clau per al model de negoci:

- **Empreses**: Poden pagar per veure qui consulta els seus productes
- **Analítica**: Dades d'ús tenen valor comercial
- **APIs externes**: Podem vendre accés a l'API a tercers
- **Comissions**: Podem cobrar per cada consulta/venda

## Verificació

### Com comprovar que funciona correctament:

1. **Atura el servidor API**:

   ```bash
   # Al servidor Oracle
   sudo systemctl stop freshexpress-api
   ```

2. **Intenta accedir a /productes**:

   - Hauria de donar error (esperadament!)
   - Això confirma que estem consultant l'API

3. **Comprova els logs del Data Broker**:

   ```sql
   SELECT * FROM freshexpress_data_broker.api_access_log
   WHERE endpoint = '/empresas'
   ORDER BY timestamp DESC
   LIMIT 10;
   ```

4. **Torna a engegar l'API**:
   ```bash
   sudo systemctl start freshexpress-api
   ```

## Conclusió

**L'arquitectura correcta és:**

```
Client (navegador)
    ↓ HTTPS
Vercel (SSR)
    ↓ HTTP (fetch)
API Node.js (Oracle)
    ↓ SQL + Logging
MySQL (Operacional + Data Broker)
```

**NO directament:**

```
Vercel (SSR)
    ↓ SQL directe
MySQL (Operacional)
    ❌ NO registra al Data Broker!
```

---

**Data de creació**: 14 de gener de 2026  
**Última actualització**: 14 de gener de 2026  
**Estat**: Implementació CORRECTA restaurada a productes.astro
