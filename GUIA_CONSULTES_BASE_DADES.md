# 📚 Guia per Novatos: Com fer Consultes a la Base de Dades

## 🎯 Introducció

En aquest projecte **FreshExpress**, hi ha **3 formes diferents** de fer consultes a la base de dades MySQL. Aquesta guia t'explicarà cada una de forma senzilla amb exemples reals del projecte.

---

## 🔍 Les 3 Formes de Fer Consultes

### 📋 Resum Ràpid

1. **Consultes Directes** → Des del codi de la pàgina (`.astro`)
2. **Funcions Helper** → Usant funcions preparades (`lib/db.ts`)
3. **API REST Externa** → Cridant a un servidor extern (Oracle)

---

## 1️⃣ FORMA 1: Consultes Directes (Més Bàsica)

### 📖 Què és?

És quan importes el "pool" (grup de connexions) de la base de dades i fas la consulta SQL directament dins del codi de la pàgina.

### 🗂️ On es fa servir?

Actualment **NO es fa servir** en aquest projecte perquè s'utilitzen les funcions helper (Forma 2). Però és important entendre-ho perquè és la base.

### 💡 Com funciona?

```typescript
// Imports necessaris
import { getOperacionalPool } from "../lib/db";

// Obtenir el pool de connexions
const pool = getOperacionalPool();

// Fer la consulta SQL directament
const [rows] = await pool.execute(
  "SELECT * FROM productos WHERE empresa_id = ?",
  [empresaId]
);

// Usar els resultats
const productes = rows;
```

### ⚙️ Avantatges i Desavantatges

✅ **Avantatges:**

- Tens control total de la consulta
- Pots veure exactament què està passant

❌ **Desavantatges:**

- Codi més llarg i repetitiu
- Més fàcil cometre errors
- Menys net i organitzat

---

## 2️⃣ FORMA 2: Funcions Helper (RECOMANADA) ⭐

### 📖 Què és?

Són funcions preparades a `src/lib/db.ts` que simplifiquen fer consultes. En comptes de repetir codi, cridem una funció que ja té tot preparat.

### 🗂️ On es fa servir?

S'utilitza a **gairebé totes les pàgines** del projecte:

- [src/pages/dashboard.astro](src/pages/dashboard.astro) - Dashboard de l'usuari
- [src/pages/productes.astro](src/pages/productes.astro) - Llistat de productes
- [src/pages/cistella.astro](src/pages/cistella.astro) - Cistella de la compra
- [src/pages/historial.astro](src/pages/historial.astro) - Historial de comandes
- [src/pages/admin/dashboard.astro](src/pages/admin/dashboard.astro) - Panel d'administració
- I moltes més...

### 💡 Com funciona?

#### Pas 1: Importar la funció

```typescript
import { queryOperacional } from "../lib/db";
```

#### Pas 2: Cridar la funció amb la consulta SQL

```typescript
// Exemple real de dashboard.astro (línia 45-58)
const comandes = await queryOperacional<any[]>(
  `
  SELECT 
    p.id,
    p.numero_pedido,
    p.fecha_pedido,
    p.estado,
    p.total
  FROM pedidos p
  WHERE p.cliente_id = ?
  ORDER BY p.fecha_pedido DESC
  LIMIT 5
  `,
  [user.id] // ← Els paràmetres que substitueixen els "?"
);
```

#### Pas 3: Usar els resultats

```typescript
// Ara "comandes" és un array amb els resultats
ultimesComandes = comandes;

// Pots fer un bucle per mostrar-los
{
  comandes.map((comanda) => (
    <div>
      <p>Número: {comanda.numero_pedido}</p>
      <p>Total: {comanda.total}€</p>
    </div>
  ));
}
```

### 📋 Exemple Complet Real (productes.astro)

```typescript
// 1. Import (línia 4)
import { queryOperacional } from "../lib/db";

// 2. Obtenir empresa
const empresaData = await queryOperacional<any[]>(
  "SELECT id, nombre, descripcion, categoria, logo, direccion, telefono, email FROM empresas WHERE id = ? AND activo = 1",
  [empresaId]
);
empresaActual = empresaData[0] || null;

// 3. Obtenir productes d'aquesta empresa
if (empresaActual) {
  productes = await queryOperacional<any[]>(
    `
    SELECT id, nombre, descripcion, categoria, precio, precio_oferta, unidad, imagen, destacado
    FROM productos 
    WHERE empresa_id = ? AND activo = 1 
    ORDER BY categoria, nombre
  `,
    [empresaId]
  );
}
```

### 🔧 Les dues funcions disponibles

```typescript
// Per la base de dades OPERACIONAL (principal)
queryOperacional<T>(sql, params);

// Per la base de dades DATA BROKER (analítica)
queryBroker<T>(sql, params);
```

### ⚙️ Avantatges i Desavantatges

✅ **Avantatges:**

- Codi més net i curt
- Menys errors
- Fàcil de llegir i mantenir
- És el mètode **RECOMANAT** per aquest projecte

❌ **Desavantatges:**

- Cal conèixer les funcions disponibles
- Una mica menys flexible (però ho compensa amb simplicitat)

---

## 3️⃣ FORMA 3: API REST Externa

### 📖 Què és?

En comptes de connectar directament a la nostra base de dades MySQL, fem una crida HTTP a un servidor extern que ens retorna les dades en format JSON.

### 🗂️ On es fa servir?

- [src/pages/productes.astro](src/pages/productes.astro) (línia 31-42) - Per carregar la llista d'empreses
- [src/pages/cistella.astro](src/pages/cistella.astro) - Per validar empreses

### 💡 Com funciona?

```typescript
// Exemple real de productes.astro (línia 31-42)

// 1. Fer la crida HTTP a l'API externa
const response = await fetch("http://143.47.36.36:3000/empresas");

// 2. Comprovar que la resposta és correcta
if (!response.ok) {
  throw new Error(`Error carregant empreses: ${response.status}`);
}

// 3. Convertir la resposta a JSON
const data = await response.json();

// 4. Extreure les dades
if (data.success && data.empresas) {
  empreses = data.empresas;
  console.log(`✅ ${empreses.length} empreses carregades des de l'API REST`);
}
```

### 🌐 Per què fem servir una API externa?

En aquest cas, la llista d'empreses està en un **servidor Oracle diferent** (143.47.36.36:3000). Aquest servidor té una base de dades pròpia amb informació que no tenim a MySQL local.

### 📋 Format de la resposta

```json
{
  "success": true,
  "empresas": [
    {
      "id": 1,
      "nombre": "Fruites del Camp",
      "categoria": "Fruites i Verdures",
      "logo": "https://..."
    },
    {
      "id": 2,
      "nombre": "Lactis Premium",
      "categoria": "Lactis i Ous",
      "logo": "https://..."
    }
  ]
}
```

### ⚙️ Avantatges i Desavantatges

✅ **Avantatges:**

- Pots accedir a dades d'altres servidors
- Separa responsabilitats (microserveis)
- L'API pot estar feta en qualsevol llenguatge

❌ **Desavantatges:**

- Més lent que consultes directes
- Depèn que l'API externa funcioni
- Cal gestionar errors de xarxa

---

## 📊 Comparativa de les 3 Formes

| Característica           | Consultes Directes | Funcions Helper ⭐       | API REST Externa |
| ------------------------ | ------------------ | ------------------------ | ---------------- |
| **Dificultat**           | Mitjana            | Fàcil                    | Fàcil            |
| **Velocitat**            | Ràpida             | Ràpida                   | Més lenta        |
| **Codi net**             | No                 | ✅ Sí                    | ✅ Sí            |
| **Fiabilitat**           | Alta               | Alta                     | Depèn de xarxa   |
| **Quan usar-la**         | Mai (obsoleta)     | **SEMPRE (per defecte)** | Dades externes   |
| **Exemples al projecte** | Cap                | Majoria pàgines          | productes.astro  |

---

## 🎓 Quin mètode hauria d'usar?

### ✅ USA FUNCIONS HELPER (Forma 2) quan:

- Necessitis dades de la **base de dades MySQL local**
- Sigui dades d'usuaris, productes, comandes, etc.
- **És el mètode per defecte del projecte**

### ✅ USA API REST (Forma 3) quan:

- Les dades estiguin en **un altre servidor**
- Necessitis comunicar-te amb altres sistemes
- Estiguis integrant serveis externs

### ❌ NO USIS Consultes Directes (Forma 1):

- Ja no es fan servir en aquest projecte
- Millor usar sempre les funcions helper

---

## 🔧 Fitxers Importants

### `src/lib/db.ts`

Conté les funcions helper i la configuració de connexió:

- `queryOperacional<T>(sql, params)` - Per consultes operacionals
- `queryBroker<T>(sql, params)` - Per consultes analítiques
- `getOperacionalPool()` - Obtenir pool de connexions operacional
- `getBrokerPool()` - Obtenir pool de connexions broker

### `.env`

Configuració de connexió a les bases de dades:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contrasenya
DB_NAME_OPERACIONAL=freshexpress_operacional
DB_NAME_BROKER=freshexpress_databroker
```

---

## 💡 Consells per Novatos

### 1. Comença simple

Usa sempre les funcions helper (`queryOperacional`). És el més fàcil.

### 2. Seguretat amb paràmetres

**MAI** facis això:

```typescript
// ❌ PERILLÓS - Injecció SQL
const sql = `SELECT * FROM productos WHERE id = ${id}`;
```

**SEMPRE** fes això:

```typescript
// ✅ SEGUR - Paràmetres protegits
const sql = "SELECT * FROM productos WHERE id = ?";
const params = [id];
await queryOperacional(sql, params);
```

### 3. Gestiona errors

```typescript
try {
  const productes = await queryOperacional<any[]>(
    "SELECT * FROM productos",
    []
  );
} catch (error) {
  console.error("Error carregant productes:", error);
  // Mostrar missatge a l'usuari
}
```

### 4. Tipus TypeScript

Afegeix el tipus per autocompletat:

```typescript
interface Producte {
  id: number;
  nombre: string;
  precio: number;
}

const productes = await queryOperacional<Producte[]>(
  "SELECT id, nombre, precio FROM productos",
  []
);

// Ara TypeScript sap que productes[0].nombre és un string
```

---

## 📚 Exemples Pràctics per Copiar

### Exemple 1: Obtenir un usuari per ID

```typescript
import { queryOperacional } from "../lib/db";

const usuarios = await queryOperacional<any[]>(
  "SELECT * FROM usuarios WHERE id = ?",
  [userId]
);
const usuario = usuarios[0];
```

### Exemple 2: Obtenir múltiples productes

```typescript
import { queryOperacional } from "../lib/db";

const productos = await queryOperacional<any[]>(
  "SELECT * FROM productos WHERE activo = 1 ORDER BY nombre",
  []
);
```

### Exemple 3: Insertar una nova comanda

```typescript
import { queryOperacional } from "../lib/db";

await queryOperacional(
  "INSERT INTO pedidos (cliente_id, total, estado) VALUES (?, ?, ?)",
  [clienteId, total, "pendent"]
);
```

### Exemple 4: Actualitzar estat d'una comanda

```typescript
import { queryOperacional } from "../lib/db";

await queryOperacional("UPDATE pedidos SET estado = ? WHERE id = ?", [
  "entregat",
  pedidoId,
]);
```

### Exemple 5: Cridar API externa

```typescript
const response = await fetch("http://143.47.36.36:3000/empresas");
const data = await response.json();

if (data.success) {
  const empresas = data.empresas;
  // Usar les empreses...
}
```

---

## ❓ Preguntes Freqüents

### ❓ Puc barrejar les 3 formes?

Sí! De fet, a `productes.astro` es fa servir API REST per empreses i funcions helper per productes.

### ❓ Com sé quina base de dades usar?

- **freshexpress_operacional** → Dades del dia a dia (usuaris, comandes, productes)
- **freshexpress_databroker** → Dades analítiques (tracking, estadístiques)

### ❓ I si vull fer un JOIN complex?

Usa la mateixa funció helper amb SQL més avançat:

```typescript
const resultats = await queryOperacional<any[]>(
  `
  SELECT p.*, e.nombre as empresa_nombre
  FROM productos p
  INNER JOIN empresas e ON p.empresa_id = e.id
  WHERE p.activo = 1
`,
  []
);
```

### ❓ Com debugejo consultes?

Afegeix console.log abans de fer la consulta:

```typescript
const sql = "SELECT * FROM productos WHERE id = ?";
const params = [productoId];
console.log("SQL:", sql, "Params:", params);

const resultado = await queryOperacional(sql, params);
console.log("Resultado:", resultado);
```

---

## 🎯 Resum Final

1. **USA SEMPRE funcions helper (`queryOperacional`)** per consultes normals
2. **USA API REST** només quan les dades estiguin en un altre servidor
3. **NO USIS consultes directes** (està obsolet)
4. Sempre protegeix contra injecció SQL usant paràmetres
5. Gestiona errors amb try/catch

---

## 📝 Notes Addicionals

Aquest document és una guia viva. Si tens dubtes o vols afegir més exemples, pots editar aquest fitxer directament.

**Data de creació:** 14 de gener de 2026  
**Versió:** 1.0  
**Autor:** Documentació del projecte FreshExpress
