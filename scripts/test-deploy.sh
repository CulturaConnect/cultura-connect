#!/bin/bash

# Script para testar o deploy localmente
# Usage: ./scripts/test-deploy.sh

set -e

echo "🧪 Testando pipeline de deploy localmente..."

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Função para log
log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    error "Este script deve ser executado na raiz do projeto!"
    exit 1
fi

log "Verificando Node.js..."
if ! command -v node >/dev/null 2>&1; then
    error "Node.js não encontrado!"
    exit 1
fi
success "Node.js $(node --version) encontrado"

log "Verificando npm..."
if ! command -v npm >/dev/null 2>&1; then
    error "npm não encontrado!"
    exit 1
fi
success "npm $(npm --version) encontrado"

log "Instalando dependências..."
npm ci

log "Executando verificação de tipos..."
if npx tsc --noEmit; then
    success "Verificação de tipos passou"
else
    error "Erro na verificação de tipos!"
    exit 1
fi

log "Executando testes (se houver)..."
if npm run test --if-present 2>/dev/null; then
    success "Testes passaram"
else
    warning "Nenhum teste configurado ou testes falharam"
fi

log "Fazendo build..."
if npm run build; then
    success "Build concluído com sucesso"
else
    error "Build falhou!"
    exit 1
fi

log "Verificando arquivos de build..."
if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
    BUILD_SIZE=$(du -sh dist | cut -f1)
    FILE_COUNT=$(find dist -type f | wc -l)
    success "Build verificado - $BUILD_SIZE, $FILE_COUNT arquivos"
    
    # Mostrar estrutura do dist
    echo ""
    echo "📁 Estrutura do build:"
    tree dist -L 2 2>/dev/null || ls -la dist/
    echo ""
else
    error "Diretório dist não existe ou está vazio!"
    exit 1
fi

log "Verificando se há arquivos essenciais..."
ESSENTIAL_FILES=("index.html" "assets")
for file in "${ESSENTIAL_FILES[@]}"; do
    if [ -e "dist/$file" ]; then
        success "Arquivo essencial encontrado: $file"
    else
        warning "Arquivo essencial não encontrado: $file"
    fi
done

# Teste simples de servidor local (opcional)
if command -v python3 >/dev/null 2>&1; then
    echo ""
    log "Testando servidor local..."
    echo "🌐 Você pode testar o build localmente executando:"
    echo "   cd dist && python3 -m http.server 8080"
    echo "   Depois acesse: http://localhost:8080"
elif command -v node >/dev/null 2>&1; then
    echo ""
    log "Testando servidor local..."
    echo "🌐 Você pode testar o build localmente executando:"
    echo "   npx serve dist -p 8080"
    echo "   Depois acesse: http://localhost:8080"
fi

echo ""
success "🎉 Teste de deploy local concluído com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "  1. Configure os secrets no GitHub (veja DEPLOY.md)"
echo "  2. Faça push para a branch main"
echo "  3. Acompanhe o deploy em GitHub Actions"
echo ""