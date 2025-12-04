# 🥬 FreshExpress

Plataforma d'entrega ràpida de productes frescos i ecològics amb un sistema de Data Broker ètic.

## 🌟 Característiques

- **Entrega en 30 minuts** - Xarxa de microcentres logístics
- **Productes ECO** - Focus en sostenibilitat i km0
- **Data Broker Ètic** - Model transparent de monetització de dades amb consentiment explícit
- **Sistema de Tracking** - Recollida de dades anònimes per investigació sobre sostenibilitat
- **Autenticació segura** - JWT amb bcrypt per a contrasenyes

## 🛠️ Stack Tecnològic

- **Frontend**: Astro 5.x, React 19, Tailwind CSS
- **Backend**: Node.js amb Astro SSR
- **Base de dades**: MySQL (2 bases de dades separades)
- **Autenticació**: bcrypt, JWT

## 📁 Estructura del Projecte

```
/
├── public/
│   └── js/
│       └── tracking.js         # Script de tracking frontend
├── src/
│   ├── components/             # Components Astro/React
│   ├── layouts/                # Layouts de pàgina
│   ├── lib/
│   │   ├── auth.ts            # Utilitats d'autenticació
│   │   ├── db.ts              # Connexió MySQL
│   │   └── tracking.ts        # Sistema de tracking backend
│   ├── pages/
│   │   ├── api/
│   │   │   ├── auth/          # Endpoints d'autenticació
│   │   │   └── track.ts       # Endpoint de tracking
│   │   ├── dashboard.astro    # Dashboard d'usuari
│   │   ├── politica-dades.astro
│   │   └── ...
│   └── styles/
└── package.json
```

## 🚀 Instal·lació

### 1. Clonar i instal·lar dependències

```bash
git clone <repo>
cd FreshExpress
npm install
```

### 2. Configurar variables d'entorn

Copia `.env.example` a `.env` i configura:

```bash
cp .env.example .env
```

Edita `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=la_teva_contrasenya
DB_NAME_OPERACIONAL=freshexpress_operacional
DB_NAME_BROKER=freshexpress_databroker
JWT_SECRET=un_secret_molt_llarg_i_segur
```

### 3. Crear les bases de dades MySQL

Executa els scripts SQL proporcionats per crear les dues bases de dades:
- `freshexpress_operacional` - Dades operacionals (usuaris, comandes, productes)
- `freshexpress_databroker` - Dades anonimitzades per al data broker

### 4. Executar en mode desenvolupament

```bash
npm run dev
```

Obre [http://localhost:4321](http://localhost:4321)

### 5. Compilar per producció

```bash
npm run build
npm run preview
```

## 📊 Sistema de Data Broker

FreshExpress implementa un model de Data Broker ètic:

1. **Consentiment Explícit** - Els usuaris trien participar voluntàriament
2. **Anonimització** - Totes les dades es converteixen en hash SHA-256 irreversibles
3. **Beneficis Compartits** - Descomptes per als participants i donacions a causes ecològiques
4. **Transparència** - Pàgina dedicada explicant exactament què es recull i qui hi accedeix

### Dades recollides (amb consentiment):
- Patrons de compra anonimitzats
- Comportament de navegació
- Preferències ecològiques
- Informació demogràfica general

### Dades MAI recollides:
- Noms reals
- Adreces exactes
- Dades financeres
- Informació de salut

## 🧞 Comandes

| Comanda               | Acció                                   |
| :-------------------- | :-------------------------------------- |
| `npm install`         | Instal·la dependències                  |
| `npm run dev`         | Servidor de desenvolupament             |
| `npm run build`       | Compila per producció                   |
| `npm run preview`     | Preview del build                       |

## 📄 Llicència

© 2025 FreshExpress. Tots els drets reservats.
