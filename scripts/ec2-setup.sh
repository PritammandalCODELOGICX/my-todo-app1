#!/bin/bash
# Run this ONCE on a fresh EC2 Ubuntu 22.04 instance.
# From your local machine:
#   ssh -i your-key.pem ubuntu@EC2_IP "bash -s" < scripts/ec2-setup.sh

set -e

echo "==> [1/3] Installing Docker..."
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu

echo "==> [2/3] Creating /app directory..."
sudo mkdir -p /app/nginx
sudo chown -R ubuntu:ubuntu /app

echo "==> [3/3] Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw --force enable

echo ""
echo "EC2 is ready!"
echo "Docker version: $(docker --version)"
echo "Log out and back in for docker group permissions to apply."
