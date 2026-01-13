# Estratègia per Presentar el Data Broker

## Com explicar el canvi d'arquitectura

---

## 🎯 Situació Actual

Hem canviat l'arquitectura del projecte per solucionar el problema de **Mixed Content** a Vercel:

### ABANS (amb REST API)

```
Navegador (HTTPS) → Fetch HTTP → REST API → MySQL
                       ↑
                    BLOQUEJAT!
```

### ARA (SSR directe)

```
Servidor Astro (Vercel) → MySQL directe
         ↓
    HTML amb dades
         ↓
Navegador (HTTPS) ✅
```

---

## 🎤 Com Explicar-ho a la Presentació

### Opció 1: Enfocar-se en l'Arquitectura Final (Recomanat)

> "El projecte utilitza una arquitectura híbrida:
>
> - **Frontend**: Astro amb SSR que consulta directament MySQL
> - **Backend REST API**: Creat inicialment per demostrar separació client-servidor i implementar el Data Broker
> - **En producció**: Per raons de seguretat (HTTPS), hem optat per consultes directes SSR, però la REST API roman funcional per:
>   - Demos en local (localhost)
>   - Futura integració amb app mòbil
>   - Endpoints d'agregació de dades (Data Broker)"

**Avantatges d'aquesta explicació:**

- ✅ Honesta i transparent
- ✅ Demostra coneixement tècnic (Mixed Content)
- ✅ Mostra flexibilitat arquitectònica
- ✅ Manté el concepte de Data Broker vàlid

### Opció 2: Presentar la REST API com a Component Educatiu

> "He creat una REST API separada amb Node.js i Express per:
>
> 1. **Demostrar arquitectura client-servidor real**
> 2. **Implementar el concepte de Data Broker** (registre de peticions)
> 3. **Aprendre tecnologies backend** (Express, MySQL2, CORS)
>
> En producció a Vercel, utilitzo SSR directe per evitar problemes de seguretat HTTPS/HTTP, però l'API és totalment funcional i està desplegada al servidor 143.47.36.36:3000."

**Avantatges:**

- ✅ Centrat en l'aprenentatge
- ✅ Mostra capacitat de resoldre problemes
- ✅ Manté valor educatiu del Data Broker

### Opció 3: Demo Híbrida (La Més Completa)

**Presentar dos escenaris:**

1. **Local Development** (mostrar amb `npm run dev`):

   ```typescript
   // Configuració per entorn
   const API_URL = import.meta.env.DEV ? "http://143.47.36.36:3000" : null; // SSR directe en producció

   if (API_URL) {
     // Usar REST API
     const response = await fetch(`${API_URL}/empresas`);
     empreses = await response.json();
   } else {
     // Consulta directa MySQL
     empreses = await queryOperacional("SELECT * FROM empresas");
   }
   ```

2. **Production** (Vercel):
   - SSR directe per seguretat

**Avantatges:**

- ✅ Mostra coneixement de configuracions d'entorn
- ✅ Millor de tots dos mons
- ✅ Professional i realista

---

## 📊 El Data Broker Encara Funciona?

**SÍ!** Encara que no s'usi directament des de Vercel, el concepte és vàlid:

### 1. L'API REST Està Activa

```bash
# Al servidor
curl http://143.47.36.36:3000/empresas
# Retorna JSON + registra a api_access_log
```

### 2. Pots Demostrar-la en Local

```bash
# A localhost:4321 pots canviar temporalment per usar l'API
# i mostrar com registra les peticions
```

### 3. El Concepte És Extrapolable

> "El Data Broker és un **patró arquitectònic**: qualsevol intermediari que registri peticions pot monetitzar dades. En aquest projecte:
>
> - **Implementació inicial**: REST API que registra peticions
> - **Implementació actual**: Puc afegir el mateix logging a les consultes SSR directes
> - **Resultat**: Mateix objectiu, implementació adaptada al context"

---

## 💡 Millora Per Mantenir el Data Broker

Si vols mantenir el tracking **sense la REST API**, pots afegir-lo directament a les consultes:

```typescript
// src/lib/db.ts
export async function queryOperacionalWithTracking<T>(
  sql: string,
  params?: any[],
  metadata?: { endpoint: string; userId?: number }
): Promise<T> {
  // 1. Executar consulta
  const [rows] = await poolOperacional.execute(sql, params);

  // 2. Registrar tracking (si metadata proporcionat)
  if (metadata) {
    try {
      await poolOperacional.execute(
        "INSERT INTO api_access_log (endpoint, user_id, timestamp) VALUES (?, ?, NOW())",
        [metadata.endpoint, metadata.userId || null]
      );
    } catch (err) {
      console.warn("Error logging tracking:", err);
    }
  }

  return rows as T;
}
```

**Ús:**

```typescript
// src/pages/productes.astro
empreses = await queryOperacionalWithTracking<any[]>(
  "SELECT * FROM empresas WHERE activo = 1",
  [],
  { endpoint: "/productes", userId: user.id }
);
```

Ara tenim **Data Broker sense REST API**! 🎉

---

## 🎬 Script de Presentació Actualitzat

### Minuts 0-1: Introducció

> "Presento FreshExpress, una plataforma de micro-logística amb arquitectura moderna i un concepte innovador: el **Data Broker**."

### Minuts 1-2: Tecnologies

> "L'aplicació utilitza:
>
> - **Astro** amb SSR per renderitzar al servidor
> - **MySQL** per persistència de dades
> - **TypeScript** per tipat estàtic
> - **Vercel** per hosting amb HTTPS automàtic"

### Minuts 2-4: Data Broker (Punt Fort)

> "He implementat un **Data Broker**: un sistema que registra cada consulta d'empreses o estadístiques a una taula `api_access_log`.
>
> [Mostrar taula SQL amb registres]
>
> Amb aquestes dades genero informes agregats que tenen valor comercial:
>
> - Ranking d'empreses més consultades → €3,500/mes
> - Anàlisi horària de demanda → €2,000/mes
>
> Projecció anual: **€210,000**
>
> És legal perquè els usuaris donen consentiment explícit i les dades són agregades."

### Minuts 4-5: Implementació Tècnica

> "Inicialment vaig crear una REST API separada amb Node.js per implementar el Data Broker:
>
> [Mostrar codi del controlador]
>
> ```javascript
> // Cada petició es registra abans de retornar dades
> await pool.query("INSERT INTO api_access_log (endpoint, ip) VALUES (?, ?)", [
>   "/empresas",
>   req.ip,
> ]);
> ```
>
> En producció a Vercel (HTTPS), he adaptat l'arquitectura per usar SSR directe amb MySQL, mantenint el mateix concepte de tracking."

### Minuts 5-6: Demo

> "Ara us ensenyo la base de dades:
>
> [Obrir MySQL Workbench]
>
> ```sql
> SELECT * FROM api_access_log ORDER BY timestamp DESC LIMIT 10;
> ```
>
> Aquí veiem totes les consultes registrades: endpoint, usuari, timestamp...
>
> [Mostrar consulta d'agregació]
>
> ```sql
> SELECT
>   endpoint,
>   COUNT(*) as total
> FROM api_access_log
> GROUP BY endpoint;
> ```
>
> Aquestes són les dades que es venen als informes."

### Minut 7: Conclusió

> "En resum: aplicació web completa amb SSR, base de dades relacional, i un model de negoci innovador que monetitza dades agregades de forma ètica. Gràcies!"

---

## ❓ Possibles Preguntes

### P: Per què no uses la REST API a Vercel?

> **R:** "Per seguretat. Vercel serveix en HTTPS però la meva API és HTTP. Els navegadors moderns bloquegen peticions HTTP des de pàgines HTTPS (Mixed Content). Per solucionar-ho podria:
>
> 1. Configurar HTTPS a l'API amb Let's Encrypt (millor per producció)
> 2. Usar SSR directe (solució actual, més simple)
>
> He escollit la opció 2 per centrar-me en la lògica de negoci."

### P: Llavors el Data Broker no funciona?

> **R:** "Funciona! L'API està activa al servidor 143.47.36.36:3000 i registra peticions. A més, el concepte de Data Broker és independent de l'arquitectura: puc aplicar el mateix tracking a les consultes SSR directes. El valor està en el model de negoci, no en la tecnologia específica."

### P: Per què no fas l'API HTTPS?

> **R:** "És el següent pas. Configuraria un domini (api.freshexpress.com) i un certificat SSL amb Let's Encrypt. Això permetria usar l'API des de Vercel sense problemes. Per aquest projecte educatiu, he prioritzat la funcionalitat sobre la configuració d'infraestructura."

---

## 🎯 Recomanació Final

**Opció Recomanada: Combinar Opció 1 + Demo de l'API en local**

1. Explica que en producció uses SSR directe (seguretat)
2. Mostra l'API funcionant en local amb `curl` o Postman
3. Mostra la taula `api_access_log` amb registres reals
4. Explica que el Data Broker és un **concepte**, no una implementació única

**Missatge clau:**

> "He après a adaptar l'arquitectura segons les necessitats: REST API per demos i futura escalabilitat, SSR directe per producció segura. El Data Broker funciona en ambdós casos."

Això demostra **maduresa tècnica** i capacitat de resoldre problemes reals. 🚀

---

**Última actualització:** 13 de gener de 2026  
**Autor:** Lucho Portuano
