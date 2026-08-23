#!/bin/bash

# 🚀 Script de Deploy Automático para Vercel
# Samuel Alves Portfolio
# 2026

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     🚀 Deploy Automático para Vercel - Samuel Alves       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Verificar se Node.js está instalado
echo -e "${BLUE}[1/4]${NC} Verificando instalação de Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não está instalado!${NC}"
    echo "Faça download em: https://nodejs.org"
    exit 1
fi
echo -e "${GREEN}✅ Node.js ${NC}$(node -v)"
echo ""

# Instalar Vercel CLI
echo -e "${BLUE}[2/4]${NC} Verificando Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚙️ Instalando Vercel CLI...${NC}"
    npm install -g vercel
fi
echo -e "${GREEN}✅ Vercel CLI pronto${NC}"
echo ""

# Login no Vercel
echo -e "${BLUE}[3/4]${NC} Autenticando com Vercel..."
vercel login
echo ""

# Deploy
echo -e "${BLUE}[4/4]${NC} Iniciando deploy..."
echo -e "${YELLOW}Respostas sugeridas:${NC}"
echo "  • Set up and deploy? → ${GREEN}Y${NC}"
echo "  • Which scope? → ${GREEN}Seu nome${NC}"
echo "  • Link to existing project? → ${GREEN}N${NC}"
echo "  • Project name? → ${GREEN}portfolio${NC}"
echo "  • Directory? → ${GREEN}./{{NC}"
echo "  • Override? → ${GREEN}Y${NC}"
echo ""

vercel

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo -e "${GREEN}║          ✅ Deploy concluído com sucesso!             ║${NC}"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📍 Seu portfólio está online!"
echo "   Próximos passos:"
echo "   1. Copie a URL do Vercel"
echo "   2. Configure domínio personalizado (opcional)"
echo "   3. Compartilhe seu portfólio!"
echo ""
