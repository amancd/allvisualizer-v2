# VPS Deployment Guide for AllVisualizer

This guide will help you deploy AllVisualizer on your VPS.

## Prerequisites

- VPS with Ubuntu 20.04+ or similar Linux distribution
- Node.js 18+ installed
- Nginx installed
- Domain name (allvisualizer.com) pointing to your VPS IP
- PM2 for process management (recommended)

## Deployment Steps

### 1. Prepare Your VPS

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (using NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

### 2. Clone and Build Your Project

```bash
# Navigate to your web directory
cd /var/www/

# Clone your repository (or upload files via FTP/SCP)
sudo mkdir allvisualizer
cd allvisualizer

# Upload your project files here
# Then install dependencies
npm install

# Build the production version
npm run build
```

### 3. Configure PM2

Create a PM2 ecosystem file:

```bash
# Create ecosystem.config.js in your project root
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'allvisualizer',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/allvisualizer',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF
```

Start your application with PM2:

```bash
# Start the application
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the instructions provided by the command above
```

### 4. Configure Nginx

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/allvisualizer.com
```

Add this configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name allvisualizer.com www.allvisualizer.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
    gzip_disable "MSIE [1-6]\.";

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Serve static files directly
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /favicon.ico {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /robots.txt {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=86400";
    }

    location /sitemap.xml {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=86400";
    }
}
```

Enable the site:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/allvisualizer.com /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 5. Setup SSL with Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d allvisualizer.com -d www.allvisualizer.com

# Follow the prompts to complete the setup
# Certbot will automatically configure Nginx for HTTPS
```

### 6. Configure Firewall

```bash
# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Allow SSH (if not already allowed)
sudo ufw allow OpenSSH

# Enable firewall
sudo ufw enable
```

## Environment Variables

Before deployment, make sure to update the sitemap URL:

1. Edit `app/sitemap.ts` and change `baseUrl` to your actual domain
2. Update `app/layout.tsx` metadata with your actual domain

## Useful PM2 Commands

```bash
# View logs
pm2 logs allvisualizer

# Monitor application
pm2 monit

# Restart application
pm2 restart allvisualizer

# Stop application
pm2 stop allvisualizer

# Delete from PM2
pm2 delete allvisualizer

# View status
pm2 status
```

## Updating Your Application

```bash
# Navigate to project directory
cd /var/www/allvisualizer

# Pull latest changes (if using Git)
git pull

# Install any new dependencies
npm install

# Rebuild the application
npm run build

# Restart PM2 process
pm2 restart allvisualizer
```

## Monitoring and Maintenance

1. **Check Application Status:**
   ```bash
   pm2 status
   pm2 logs allvisualizer --lines 100
   ```

2. **Monitor Server Resources:**
   ```bash
   htop  # Install with: sudo apt install htop
   ```

3. **Check Nginx Logs:**
   ```bash
   sudo tail -f /var/log/nginx/access.log
   sudo tail -f /var/log/nginx/error.log
   ```

4. **Auto-renew SSL Certificate:**
   Certbot sets up automatic renewal. Test it with:
   ```bash
   sudo certbot renew --dry-run
   ```

## Troubleshooting

### Application won't start
```bash
# Check PM2 logs
pm2 logs allvisualizer

# Check if port 3000 is in use
sudo netstat -tulpn | grep 3000
```

### Nginx errors
```bash
# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Test Nginx configuration
sudo nginx -t
```

### High memory usage
```bash
# Restart PM2 process
pm2 restart allvisualizer

# Check memory usage
free -h
pm2 monit
```

## Performance Optimization

1. **Enable Next.js Image Optimization:**
   Already configured in your Next.js app

2. **Use CDN for Static Assets:**
   Consider using Cloudflare or similar CDN

3. **Database Caching (Future):**
   When you add a database, consider Redis for caching

4. **Monitor Performance:**
   - Use PM2 monitoring: `pm2 monit`
   - Consider tools like New Relic or DataDog

## Security Checklist

- [x] Firewall configured (UFW)
- [x] SSL certificate installed
- [x] Nginx security headers configured
- [ ] Change default SSH port (optional but recommended)
- [ ] Setup fail2ban for intrusion prevention
- [ ] Regular system updates
- [ ] Backup strategy in place

## Backup Strategy

```bash
# Create backup script
cat > /root/backup-allvisualizer.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups"
mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/allvisualizer_$DATE.tar.gz -C /var/www allvisualizer

# Keep only last 7 backups
ls -t $BACKUP_DIR/allvisualizer_*.tar.gz | tail -n +8 | xargs rm -f
EOF

chmod +x /root/backup-allvisualizer.sh

# Add to crontab (daily backup at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /root/backup-allvisualizer.sh") | crontab -
```

## Contact & Support

For issues or questions:
- Email: nkcoderz@gmail.com
- Discord: https://discord.gg/z4TgSrJQ

---

**Note:** Replace `allvisualizer.com` with your actual domain name throughout this guide.
