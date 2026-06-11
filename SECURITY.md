# ⚠️ Sensitive Information - DO NOT PUSH TO GITHUB

This file contains notes about sensitive data that should **NEVER** be pushed to the public repository.

## 🚫 What to NEVER Push

### 1. Configuration files with secrets

- ❌ `.env` (real file with credentials)
- ❌ `ecosystem.config.js` with secrets
- ❌ MySQL backup files (`.sql` with real data)
- ❌ SSH keys or SSL certificates

### 2. Production data

- ❌ Databases with real user information
- ❌ Images or files uploaded by users
- ❌ Logs with personal information
- ❌ Active sessions or tokens

### 3. API keys and secrets

- ❌ Google Maps API Key
- ❌ JWT_SECRET
- ❌ Database credentials
- ❌ SMTP credentials
- ❌ Tokens from external services

## ✅ What CAN be pushed

- ✅ `.env.example` (template without real values)
- ✅ Source code
- ✅ Configuration scripts (without secrets)
- ✅ Documentation
- ✅ SQL structure files (without sensitive data)

## 🔍 Before committing

Always check that:

1. The `.gitignore` file is up to date
2. There are no secrets in the code
3. Sensitive variables use `process.env` or `import.meta.env`
4. There are no hardcoded IP addresses or production URLs
5. Test passwords are generic

## 🛡️ Best Practices

### Environment variables

```typescript
// ✅ CORRECT - Use environment variables
const dbHost = import.meta.env.DB_HOST;
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

// ❌ INCORRECT - Hardcoded
const dbHost = "143.47.36.36";
const apiKey = "YOUR_API_KEY_HERE";
```

### Service configuration

```typescript
// ✅ CORRECT
const config = {
  host: import.meta.env.DB_HOST || "localhost",
  user: import.meta.env.DB_USER || "root",
  password: import.meta.env.DB_PASSWORD || "",
};

// ❌ INCORRECT
const config = {
  host: "143.47.36.36",
  user: "api",
  password: "api123",
};
```

## 🔐 Generating secure secrets

### JWT Secret

```bash
# Option 1: OpenSSL
openssl rand -base64 32

# Option 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Salt for anonymisation

```bash
openssl rand -hex 16
```

## 📝 Checklist before publishing

- [ ] Review all code for hardcoded secrets
- [ ] Verify that `.env` is in `.gitignore`
- [ ] Check that only `.env.example` has generic values
- [ ] Remove comments with sensitive information
- [ ] Review Git history in case something sensitive was pushed
- [ ] Verify that IPs and URLs are environment variables
- [ ] Check that there are no credentials in scripts

## 🚨 If you accidentally pushed secrets

1. **DO NOT just delete the commit** - Git history will retain the secrets
2. **Regenerate ALL exposed secrets** (API keys, passwords, etc.)
3. **Clean the Git history** with tools like:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch path/to/file" \
     --prune-empty --tag-name-filter cat -- --all
   ```
4. **Force push** after cleaning (only if it's your repository)
5. **Notify the service** if you have exposed API keys (Google, etc.)

## 📧 Secure Contact

To share secrets with the team, use:

- **1Password** / **Bitwarden** (password managers)
- **Encrypted channels** (Signal, Wire)
- **NEVER by email or Slack without encryption**

---

**Remember**: An exposed secret is a compromised secret. When in doubt, regenerate it.
