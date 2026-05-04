# 💼 FreshExpress - Projecte de Portafoli

## 📖 Sobre aquest projecte

FreshExpress és una aplicació web completa desenvolupada com a projecte de portafoli que simula una plataforma real de lliurament ecològic d'última milla amb vehicles elèctrics.

## 🎯 Objectius del Projecte

Aquest projecte demostra competències en:

### Backend & Base de Dades

- ✅ **Arquitectura de bases de dades** - Disseny de dues BD (operacional + data broker ètic)
- ✅ **MySQL avançat** - Consultes complexes, joins, transaccions
- ✅ **Connection pooling** - Gestió eficient de connexions a BD
- ✅ **APIs RESTful** - Endpoints ben estructurats i documentats
- ✅ **Autenticació JWT** - Sistema segur amb bcrypt i tokens

### Frontend & UX

- ✅ **Astro SSR** - Server-Side Rendering per millor SEO i rendiment
- ✅ **TypeScript** - Codi type-safe i mantenible
- ✅ **Tailwind CSS** - Disseny modern i responsive
- ✅ **Components reutilitzables** - Arquitectura modular
- ✅ **UX multi-rol** - Interfícies diferents per clients, repartidors i admins

### Funcionalitats Avançades

- ✅ **Sistema de tracking en temps real** - Seguiment de comandes
- ✅ **Gestió de rols** - RBAC (Role-Based Access Control)
- ✅ **Cistella de compra** - Amb persistència i gestió d'estat
- ✅ **Sistema de valoracions** - Puntuació de repartidors
- ✅ **Data broker ètic** - Anonimització amb consentiment explícit
- ✅ **Càlcul d'impacte ecològic** - Emissions de CO₂ estalviades

### DevOps & Deployment

- ✅ **Variables d'entorn** - Configuració per entorns
- ✅ **Git workflow** - Control de versions professional
- ✅ **Documentació completa** - README, guies de desplegament
- ✅ **Seguretat** - Bones pràctiques i gestió de secrets
- ✅ **Escalabilitat** - Arquitectura preparada per producció

## 🏗️ Arquitectura Tècnica

### Stack Principal

```
┌─────────────────────────────────────────┐
│         Frontend (Astro + TS)           │
│  ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │ Client   │ │Repartidor│ │  Admin  │ │
│  └────┬─────┘ └────┬─────┘ └────┬────┘ │
└───────┼────────────┼────────────┼───────┘
        │            │            │
        ▼            ▼            ▼
┌─────────────────────────────────────────┐
│           API REST (Astro)              │
│   /api/auth  /api/cart  /api/user       │
│   /api/repartidor  /api/admin           │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│     Connexió MySQL (Pool)               │
└───────┬─────────────────────┬───────────┘
        │                     │
        ▼                     ▼
┌──────────────┐     ┌─────────────────┐
│  BD Operac.  │     │  BD Data Broker │
│  (Principal) │     │  (Anonimitzada) │
└──────────────┘     └─────────────────┘
```

### Flux d'Autenticació

```
1. Login → 2. Verificar credencials → 3. Generar JWT
   ↓              ↓                        ↓
4. Guardar token en cookie → 5. Middleware verifica token
   ↓                              ↓
6. Accés a rutes protegides ← Token vàlid
```

### Sistema de Rols

| Rol          | Accés                               |
| ------------ | ----------------------------------- |
| `cliente`    | Dashboard client, compres, tracking |
| `repartidor` | Panel repartidor, gestió entregues  |
| `admin`      | Tots els panels + gestió d'usuaris  |

## 📊 Funcionalitats Destacades

### 1. Sistema de Tracking en Temps Real

```typescript
// Polling automàtic cada 30 segons
setInterval(async () => {
  const data = await fetch("/api/rastreig?codigo=" + codigo);
  updateMap(data.ubicacion);
}, 30000);
```

### 2. Data Broker Ètic

- **Anonimització**: SHA-256 amb salt
- **Consentiment**: Opt-in explícit
- **Transparència**: Documentació del què es recull
- **Beneficis**: Descomptes per participants

### 3. Càlcul d'Emissions

```typescript
const co2Saved = distanciaKm * 0.12; // kg CO₂ per km
const arbresEquivalents = co2Saved / 21; // 1 arbre = 21kg CO₂/any
```

## 🎨 Disseny UI/UX

### Paleta de Colors

- **Verd Principal**: `#3BB143` (Sostenibilitat)
- **Blau Corporatiu**: `#0047AB` (Confiança)
- **Groc Accent**: `#FFD700` (Valoracions)

### Components Destacats

- **Headers dinàmics** per cada rol
- **Cards de productes** amb hover effects
- **Formularis accessibles** amb validació
- **Mapes interactius** amb Google Maps
- **Loading states** i feedback visual

## 📈 Mètriques del Projecte

- **Línies de codi**: ~5,000+
- **Components**: 15+
- **Pàgines**: 25+
- **Endpoints API**: 20+
- **Taules BD**: 12+
- **Temps desenvolupament**: ~X setmanes

## 🔮 Roadmap Future (Possibles millores)

- [ ] WebSockets per tracking en temps real
- [ ] App mòbil amb React Native
- [ ] Sistema de pagament amb Stripe
- [ ] Xat entre client i repartidor
- [ ] Notificacions push
- [ ] Dashboard d'analytics amb gràfiques
- [ ] Sistema de cupons i promocions
- [ ] API pública per tercers
- [ ] Integració amb altres plataformes

## 🎓 Aprenentatges Clau

Aquest projecte m'ha permès:

1. **Arquitectura de software** - Dissenyar una aplicació escalable des de zero
2. **Gestió de bases de dades** - Disseny relacional i optimització de queries
3. **Seguretat web** - Autenticació, autorització, protecció de dades
4. **UX multi-rol** - Diferents interfícies segons l'usuari
5. **APIs RESTful** - Disseny i documentació d'endpoints
6. **TypeScript avançat** - Types, interfaces, genèrics
7. **DevOps bàsic** - Desplegament, monitorització, backups

## 📞 Contacte Professional

Aquest projecte forma part del meu portafoli professional. Si t'interessa col·laborar o tens preguntes:

- **LinkedIn**: [El teu perfil]
- **GitHub**: [El teu GitHub]
- **Portfolio**: [La teva web]
- **Email**: [El teu email professional]

## 📄 Llicència

Aquest projecte està sota llicència MIT i és lliure per estudiar, modificar i utilitzar amb fins educatius.

---

**Desenvolupat amb** ❤️ **i** ☕ **per demostrar competències en desenvolupament web full-stack**
