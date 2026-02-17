#!/bin/bash

# Script to verify Figma Desktop MCP access from Claude Code
# Author: Kilian Sala <kilian@kapsch.net>
# Date: 2026-02-10

set -e

echo "🔍 Verificando acceso al Figma Desktop MCP..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Figma Desktop MCP server is running
echo "1️⃣ Verificando servidor Figma Desktop MCP (puerto 3845)..."
if curl -s http://127.0.0.1:3845/mcp > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Servidor Figma Desktop MCP está activo${NC}"
else
    echo -e "${RED}❌ Servidor Figma Desktop MCP no responde${NC}"
    echo "   Asegúrate de que Figma Desktop está abierto y el plugin MCP está activo"
    exit 1
fi

echo ""

# Check if ~/.claude/mcp.json exists
echo "2️⃣ Verificando configuración MCP de Claude Code..."
if [ -f "$HOME/.claude/mcp.json" ]; then
    echo -e "${GREEN}✅ Archivo ~/.claude/mcp.json existe${NC}"
    echo ""
    echo "Contenido:"
    cat "$HOME/.claude/mcp.json"
else
    echo -e "${RED}❌ Archivo ~/.claude/mcp.json no existe${NC}"
    echo ""
    echo "Ejecuta el siguiente comando para crearlo:"
    echo ""
    echo "cat > ~/.claude/mcp.json <<'EOF'"
    echo '{'
    echo '  "mcpServers": {'
    echo '    "figma-desktop": {'
    echo '      "type": "http",'
    echo '      "url": "http://127.0.0.1:3845/mcp"'
    echo '    }'
    echo '  }'
    echo '}'
    echo 'EOF'
    exit 1
fi

echo ""

# Check if configuration is correct
echo "3️⃣ Verificando que la configuración es correcta..."
if grep -q "http://127.0.0.1:3845/mcp" "$HOME/.claude/mcp.json"; then
    echo -e "${GREEN}✅ Configuración correcta (apunta al puerto 3845)${NC}"
else
    echo -e "${YELLOW}⚠️  La URL del servidor puede no ser correcta${NC}"
    echo "   Verifica que la URL es: http://127.0.0.1:3845/mcp"
fi

echo ""
echo "========================================="
echo ""
echo -e "${GREEN}✅ Verificación completada${NC}"
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1. Si acabas de crear ~/.claude/mcp.json, REINICIA VSCODE"
echo "   (Cmd+Q y volver a abrir, o Cmd+Shift+P → 'Reload Window')"
echo ""
echo "2. Abre Figma Desktop y selecciona un componente"
echo ""
echo "3. Desde Claude Code, prueba:"
echo '   "Using the Figma MCP, get the design context for my current selection"'
echo ""
echo "4. Si funciona, verás información del componente seleccionado"
echo ""
echo "========================================="
echo ""

# Test MCP server response
echo "🧪 Prueba de respuesta del servidor MCP:"
echo ""
RESPONSE=$(curl -s http://127.0.0.1:3845/mcp)
echo "$RESPONSE" | head -c 200
echo ""
echo ""

if echo "$RESPONSE" | grep -q "jsonrpc"; then
    echo -e "${GREEN}✅ Servidor responde con JSON-RPC (esperado)${NC}"
else
    echo -e "${RED}❌ Respuesta inesperada del servidor${NC}"
fi

echo ""
