# 🚀 Guia de Desplegament - FreshExpress

## Desplegament en VPS Oracle Cloud

Aquesta guia explica com desplegar FreshExpress en un servidor Oracle Cloud VPS.

## 📋 Requisits del Servidor

- **OS**: Ubuntu 20.04 LTS o superior
- **RAM**: Mínim 2GB (recomanat 4GB)
- **CPU**: Mínim 2 cores
- **Disc**: 20GB lliures
- **Ports**: 80, 443, 3306 (MySQL)

## 🔧 Configuració Inicial del Servidor

### 1. Actualitzar el sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Instal·lar Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Verificar versió
```

### 3. Instal·lar MySQL 8.0

```bash
sudo apt install -y mysql-server
sudo mysql_secure_installation
```

### 4. Instal·lar Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 5. Instal·lar PM2 (Process Manager)

```bash
sudo npm install -g pm2
pm2 startup
```

## 📦 Desplegament de l'Aplicació

### 1. Clonar el repositori

```bash
cd /var/www
sudo git clone https://github.com/el-teu-usuari/FreshExpress.git
cd FreshExpress
```

### 2. Instal·lar dependències

```bash
npm install
```

### 3. Configurar variables d'entorn

```bash
cp .env.example .env
nano .env
```

Edita amb les credencials de producció:

```env
# Base de dades
DB_HOST=localhost
DB_PORT=3306
DB_USER=freshexpress_user
DB_PASSWORD=contrasenya_segura_aqui
DB_NAME_OPERACIONAL=freshexpress_operacional
DB_NAME_BROKER=freshexpress_databroker

# Autenticació JWT
JWT_SECRET=genera_un_secret_amb_openssl_rand_base64_32

# Entorn
NODE_ENV=production

# Google Maps
GOOGLE_MAPS_API_KEY=la_teva_api_key_de_google
```

### 4. Configurar MySQL

```bash
# Crear usuari i bases de dades
sudo mysql -u root -p
```

Dins de MySQL:

```sql
-- Crear usuari
CREATE USER 'freshexpress_user'@'localhost' IDENTIFIED BY 'contrasenya_segura_aqui';

-- Crear bases de dades
CREATE DATABASE freshexpress_operacional CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE freshexpress_databroker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Donar permisos
GRANT ALL PRIVILEGES ON freshexpress_operacional.* TO 'freshexpress_user'@'localhost';
GRANT ALL PRIVILEGES ON freshexpress_databroker.* TO 'freshexpress_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Importar dades:

```bash
mysql -u freshexpress_user -p freshexpress_operacional < sql/freshexpress_completa.sql
mysql -u freshexpress_user -p freshexpress_operacional < sql/repartidors.sql
```

### 5. Compilar l'aplicació

```bash
npm run build
```

### 6. Configurar PM2

Crear fitxer `ecosystem.config.js`:

```bash
nano ecosystem.config.js
```

Contingut:

```javascript
module.exports = {
  apps: [
    {
      name: "freshexpress",
      script: "./dist/server/entry.mjs",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        HOST: "0.0.0.0",
        PORT: 4321,
      },
    },
  ],
};
```

Iniciar amb PM2:

```bash
pm2 start ecosystem.config.js
pm2 save
```

### 7. Configurar Nginx

```bash
sudo nano /etc/nginx/sites-available/freshexpress
```

Contingut:

```nginx
server {
    listen 80;
    server_name el-teu-domini.com www.el-teu-domini.com;

    location / {
        proxy_pass http://localhost:4321;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activar configuració:

```bash
sudo ln -s /etc/nginx/sites-available/freshexpress /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 8. Configurar SSL amb Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d el-teu-domini.com -d www.el-teu-domini.com
```

## 🔄 Actualitzar l'Aplicació

Script d'actualització `deploy.sh`:

```bash
#!/bin/bash

echo "🚀 Actualitzant FreshExpress..."

# Pull últims canvis
git pull origin main

# Instal·lar noves dependències
npm install

# Compilar
npm run build

# Reiniciar PM2
pm2 reload ecosystem.config.js

echo "✅ Desplegament completat!"
```

Fer-lo executable i executar:

```bash
chmod +x deploy.sh
./deploy.sh
```

## 📊 Monitorització

### Veure logs amb PM2

```bash
pm2 logs freshexpress
pm2 monit
```

### Status de l'aplicació

```bash
pm2 status
```

### Reiniciar l'aplicació

```bash
pm2 restart freshexpress
```

## 🔒 Seguretat

### Configurar firewall

```bash
sudo ufw allow 22      # SSH
sudo ufw allow 80      # HTTP
sudo ufw allow 443     # HTTPS
sudo ufw enable
```

### Backups automàtics de MySQL

Crear script `backup.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/mysql"
mkdir -p $BACKUP_DIR

mysqldump -u freshexpress_user -p'contrasenya' freshexpress_operacional > $BACKUP_DIR/operacional_$DATE.sql
mysqldump -u freshexpress_user -p'contrasenya' freshexpress_databroker > $BACKUP_DIR/databroker_$DATE.sql

# Mantenir només els últims 7 dies
find $BACKUP_DIR -type f -mtime +7 -delete
```

Afegir a crontab (diari a les 2 AM):

```bash
crontab -e
0 2 * * * /var/www/FreshExpress/backup.sh
```

## 🐛 Troubleshooting

### L'aplicació no arrenca

```bash
# Comprovar logs
pm2 logs freshexpress --lines 100

# Verificar variables d'entorn
cat .env

# Provar manualment
npm run preview
```

### Error de connexió a MySQL

```bash
# Verificar que MySQL està actiu
sudo systemctl status mysql

# Provar connexió
mysql -u freshexpress_user -p -h localhost
```

### Nginx retorna 502

```bash
# Verificar que l'app està executant-se
pm2 status

# Comprovar logs de Nginx
sudo tail -f /var/log/nginx/error.log
```

## 📝 Notes Importants

1. **Canvia tots els secrets** en `.env` per producció
2. **Configura backups automàtics** de la base de dades
3. **Monitoritza l'aplicació** amb PM2 i logs
4. **Actualitza regularment** el sistema i dependències
5. **Configura un domini propi** abans del desplegament
6. **No exposar** el fitxer `.env` al repositori Git

## 🔗 Recursos Addicionals

- [Documentació d'Astro](https://docs.astro.build)
- [PM2 Docs](https://pm2.keymetrics.io/)
- [Nginx Docs](https://nginx.org/en/docs/)
- [Oracle Cloud Docs](https://docs.oracle.com/en-us/iaas/Content/home.htm)

---

✅ Ara FreshExpress està en producció i llest per utilitzar!
