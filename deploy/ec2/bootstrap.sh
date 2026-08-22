#!/usr/bin/env bash
set -euo pipefail

APP_DIR=/opt/student-management-system-api

sudo apt-get update
sudo apt-get install -y ca-certificates curl git nginx certbot python3-certbot-nginx

if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
  sudo systemctl enable --now docker
  sudo usermod -aG docker "$USER" || true
fi

sudo mkdir -p "$APP_DIR"
sudo chown -R "$USER":"$USER" "$APP_DIR"

echo "EC2 bootstrap complete. Clone the repository into $APP_DIR, create $APP_DIR/.env.production from .env.production.example, then run:"
echo "docker compose -f docker-compose.prod.yml up -d --build"
