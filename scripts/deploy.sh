#!/bin/bash

# Script de deploy automatizado para VPS
# Este script será executado no servidor via SSH

set -e  # Para se houver erro

PROJECT_DIR="$1"
BACKUP_DIR="$2"

echo "🚀 Iniciando deploy..."

# Verificar se o diretório do projeto existe
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Diretório do projeto não encontrado: $PROJECT_DIR"
    exit 1
fi

cd "$PROJECT_DIR"

echo "📁 Diretório atual: $(pwd)"

# Fazer backup da build atual
if [ -d "dist" ]; then
    BACKUP_NAME="dist_backup_$(date +%Y%m%d_%H%M%S)"
    echo "📦 Fazendo backup: $BACKUP_NAME"
    cp -r dist "$BACKUP_DIR/$BACKUP_NAME" || echo "⚠️  Backup falhou, continuando..."
    
    # Limpar backups antigos (manter apenas os 5 mais recentes)
    cd "$BACKUP_DIR"
    ls -t | grep "dist_backup_" | tail -n +6 | xargs -r rm -rf
    cd "$PROJECT_DIR"
fi

# Verificar se há mudanças locais não commitadas
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Há mudanças locais não commitadas. Fazendo stash..."
    git stash
fi

# Fazer pull das mudanças
echo "📥 Fazendo pull do repositório..."
git fetch origin
git reset --hard origin/main

# Verificar se package.json mudou
if git diff HEAD~1 --name-only | grep -q "package.json\|package-lock.json"; then
    echo "📦 package.json mudou, reinstalando dependências..."
    npm ci
else
    echo "📦 Verificando dependências..."
    npm ci --only=production
fi

# Fazer build do projeto
echo "🔨 Fazendo build do projeto..."
NODE_ENV=production npm run build

# Verificar se o build foi bem-sucedido
if [ ! -d "dist" ] || [ -z "$(ls -A dist)" ]; then
    echo "❌ Build falhou ou diretório dist está vazio!"
    exit 1
fi

echo "✅ Build concluído com sucesso!"

# Copiar arquivos estáticos se necessário (descomente se usar)
# echo "📁 Copiando arquivos estáticos..."
# cp -r public/* dist/ 2>/dev/null || true

# Definir permissões corretas
echo "🔐 Configurando permissões..."
chmod -R 755 dist/
chown -R www-data:www-data dist/ 2>/dev/null || true

# Reiniciar serviços (descomente conforme sua configuração)
echo "🔄 Reiniciando serviços..."

# Para Nginx
# sudo systemctl reload nginx

# Para PM2
# pm2 restart all

# Para Apache
# sudo systemctl reload apache2

# Para Docker (se usando)
# docker-compose restart web

echo "🎉 Deploy concluído com sucesso!"
echo "📊 Estatísticas do build:"
echo "   - Tamanho do dist: $(du -sh dist | cut -f1)"
echo "   - Arquivos: $(find dist -type f | wc -l) arquivos"
echo "   - Data: $(date)"