# ⚠️ Informació Sensible - NO PUJAR A GITHUB

Aquest fitxer conté notes sobre dades sensibles que **MAI** s'han de pujar al repositori públic.

## 🚫 Què NO Pujar Mai

### 1. Fitxers de configuració amb secrets

- ❌ `.env` (fitxer real amb credencials)
- ❌ `ecosystem.config.js` amb secrets
- ❌ Fitxers de backup de MySQL (`.sql` amb dades reals)
- ❌ Claus SSH o certificats SSL

### 2. Dades de producció

- ❌ Bases de dades amb informació real d'usuaris
- ❌ Imatges o fitxers pujats per usuaris
- ❌ Logs amb informació personal
- ❌ Sessions o tokens actius

### 3. API Keys i secrets

- ❌ Google Maps API Key
- ❌ JWT_SECRET
- ❌ Credencials de bases de dades
- ❌ Credencials SMTP
- ❌ Tokens de serveis externs

## ✅ Què SÍ Pujar

- ✅ `.env.example` (plantilla sense valors reals)
- ✅ Codi font
- ✅ Scripts de configuració (sense secrets)
- ✅ Documentació
- ✅ Fitxers SQL d'estructura (sense dades sensibles)

## 🔍 Abans de fer commit

Revisa sempre que:

1. El fitxer `.gitignore` està actualitzat
2. No hi ha secrets en el codi
3. Les variables sensibles usen `process.env` o `import.meta.env`
4. No hi ha IP addresses o URLs de producció hardcoded
5. Les contrasenyes de test són genèriques

## 🛡️ Millors Pràctiques

### Variables d'entorn

```typescript
// ✅ CORRECTE - Usa variables d'entorn
const dbHost = import.meta.env.DB_HOST;
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

// ❌ INCORRECTE - Hardcoded
const dbHost = "143.47.36.36";
const apiKey = "YOUR_API_KEY_HERE";
```

### Configuració de serveis

```typescript
// ✅ CORRECTE
const config = {
  host: import.meta.env.DB_HOST || "localhost",
  user: import.meta.env.DB_USER || "root",
  password: import.meta.env.DB_PASSWORD || "",
};

// ❌ INCORRECTE
const config = {
  host: "143.47.36.36",
  user: "api",
  password: "api123",
};
```

## 🔐 Generar secrets segurs

### JWT Secret

```bash
# Opció 1: OpenSSL
openssl rand -base64 32

# Opció 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Salt per anonimització

```bash
openssl rand -hex 16
```

## 📝 Checklist abans de publicar

- [ ] Revisar tot el codi per secrets hardcoded
- [ ] Verificar que `.env` està al `.gitignore`
- [ ] Comprovar que només `.env.example` té valors genèrics
- [ ] Eliminar comentaris amb informació sensible
- [ ] Revisar l'històric de Git per si s'ha pujat alguna cosa sensible
- [ ] Verificar que les IPs i URLs són variables d'entorn
- [ ] Comprovar que no hi ha credencials en scripts

## 🚨 Si has pujat secrets per error

1. **NO eliminar només el commit** - l'històric de Git mantindrà els secrets
2. **Regenerar TOTS els secrets exposats** (API keys, contrasenyes, etc.)
3. **Neteja l'històric de Git** amb eines com:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch path/to/file" \
     --prune-empty --tag-name-filter cat -- --all
   ```
4. **Força push** després de netejar (només si és el teu repositori)
5. **Informa el servei** si has exposat API keys (Google, etc.)

## 📧 Contacte Segur

Per compartir secrets amb l'equip, utilitza:

- **1Password** / **Bitwarden** (gestors de contrasenyes)
- **Canals xifrats** (Signal, Wire)
- **MAI per email o Slack sense xifratge**

---

**Recorda**: Un secret exposat és un secret compromès. Quan tinguis dubtes, regenera-ho.
