# HTTPS setup on AWS EC2

1. Point `api.example.com` DNS A record to the EC2 public IP.
2. Install Nginx and Certbot on Ubuntu:
   ```bash
   sudo apt update
   sudo apt install -y nginx certbot python3-certbot-nginx
   ```
3. Copy `student-api.conf` to `/etc/nginx/sites-available/student-api` and replace `api.example.com` with your real domain.
4. Enable it:
   ```bash
   sudo ln -s /etc/nginx/sites-available/student-api /etc/nginx/sites-enabled/student-api
   sudo nginx -t
   sudo systemctl reload nginx
   ```
5. Issue and install the TLS certificate:
   ```bash
   sudo certbot --nginx -d api.example.com
   ```
6. Verify renewal:
   ```bash
   sudo certbot renew --dry-run
   ```

Open inbound AWS security-group ports **80 and 443**. Keep port **5000 private**; the production Compose file exposes the API only to the EC2 host network and Nginx reverse-proxies it.
