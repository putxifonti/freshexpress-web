# 🚀 Deployment Guide - FreshExpress

## Deployment on Oracle Cloud VPS

This guide explains how to deploy FreshExpress on an Oracle Cloud VPS server.

## 📋 Server Requirements

- **OS**: Ubuntu 20.04 LTS or higher
- **RAM**: Minimum 2 GB (4 GB recommended)
- **CPU**: Minimum 2 cores
- **Disk**: 20 GB free
- **Ports**: 80, 443, 3306 (MySQL)

## 🔧 Initial Server Setup

### 1. Update the system

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Verify version
```

### 3. Install MySQL 8.0

```bash
sudo apt install -y mysql-server
sudo mysql_secure_installation
```

### 4. Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 5. Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
pm2 startup
```

## 📦 Application Deployment

### 1. Clone the repository

```bash
cd /var/www
sudo git clone https://github.com/your-username/FreshExpress.git
cd FreshExpress
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
nano .env
```

Edit with production credentials:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=freshexpress_user
DB_PASSWORD=your_secure_password_here
DB_NAME_OPERACIONAL=freshexpress_operacional
DB_NAME_BROKER=freshexpress_databroker

# JWT Authentication
JWT_SECRET=generate_a_secret_with_openssl_rand_base64_32

# Environment
NODE_ENV=production

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_api_key
```

### 4. Configure MySQL

```bash
# Create user and databases
sudo mysql -u root -p
```

Inside MySQL:

```sql
-- Create user
CREATE USER 'freshexpress_user'@'localhost' IDENTIFIED BY 'your_secure_password_here';

-- Create databases
CREATE DATABASE freshexpress_operacional CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE freshexpress_databroker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Grant permissions
GRANT ALL PRIVILEGES ON freshexpress_operacional.* TO 'freshexpress_user'@'localhost';
GRANT ALL PRIVILEGES ON freshexpress_databroker.* TO 'freshexpress_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Import data:

```bash
mysql -u freshexpress_user -p freshexpress_operacional < sql/freshexpress_completa.sql
mysql -u freshexpress_user -p freshexpress_operacional < sql/repartidors.sql
```

### 5. Build the application

```bash
npm run build
```

### 6. Configure PM2

Create file `ecosystem.config.js`:

```bash
nano ecosystem.config.js
```

Content:

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

Start with PM2:

```bash
pm2 start ecosystem.config.js
pm2 save
```

### 7. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/freshexpress
```

Content:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

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

Enable configuration:

```bash
sudo ln -s /etc/nginx/sites-available/freshexpress /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 8. Configure SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 🔄 Updating the Application

Update script `deploy.sh`:

```bash
#!/bin/bash

echo "🚀 Updating FreshExpress..."

# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Build
npm run build

# Restart PM2
pm2 reload ecosystem.config.js

echo "✅ Deployment complete!"
```

Make it executable and run:

```bash
chmod +x deploy.sh
./deploy.sh
```

## 📊 Monitoring

### View logs with PM2

```bash
pm2 logs freshexpress
pm2 monit
```

### Application status

```bash
pm2 status
```

### Restart the application

```bash
pm2 restart freshexpress
```

## 🔒 Security

### Configure firewall

```bash
sudo ufw allow 22      # SSH
sudo ufw allow 80      # HTTP
sudo ufw allow 443     # HTTPS
sudo ufw enable
```

### Automatic MySQL backups

Create script `backup.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/mysql"
mkdir -p $BACKUP_DIR

mysqldump -u freshexpress_user -p'password' freshexpress_operacional > $BACKUP_DIR/operacional_$DATE.sql
mysqldump -u freshexpress_user -p'password' freshexpress_databroker > $BACKUP_DIR/databroker_$DATE.sql

# Keep only the last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete
```

Add to crontab (daily at 2 AM):

```bash
crontab -e
0 2 * * * /var/www/FreshExpress/backup.sh
```

## 🐛 Troubleshooting

### Application won't start

```bash
# Check logs
pm2 logs freshexpress --lines 100

# Verify environment variables
cat .env

# Test manually
npm run preview
```

### MySQL connection error

```bash
# Verify MySQL is running
sudo systemctl status mysql

# Test connection
mysql -u freshexpress_user -p -h localhost
```

### Nginx returns 502

```bash
# Verify the app is running
pm2 status

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

## 📝 Important Notes

1. **Change all secrets** in `.env` for production
2. **Set up automatic backups** of the database
3. **Monitor the application** with PM2 and logs
4. **Regularly update** the system and dependencies
5. **Configure your own domain** before deployment
6. **Do not expose** the `.env` file in the Git repository

## 🔗 Additional Resources

- [Astro Documentation](https://docs.astro.build)
- [PM2 Docs](https://pm2.keymetrics.io/)
- [Nginx Docs](https://nginx.org/en/docs/)
- [Oracle Cloud Docs](https://docs.oracle.com/en-us/iaas/Content/home.htm)

---

✅ FreshExpress is now in production and ready to use!
