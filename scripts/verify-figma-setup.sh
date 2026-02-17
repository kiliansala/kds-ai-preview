#!/bin/bash

# Script para verificar la configuración de Figma
# Usage: ./scripts/verify-figma-setup.sh

set -e

echo "🔍 Verificando configuración de Figma..."
echo ""

# Verificar que existe el archivo .env
if [ -f ".figma/.env" ]; then
    echo "✅ Archivo .figma/.env encontrado"
    source .figma/.env
else
    echo "❌ No se encontró .figma/.env"
    echo "   Crea el archivo con:"
    echo "   echo 'FIGMA_ACCESS_TOKEN=tu_token' > .figma/.env"
    echo "   echo 'FIGMA_FILE_ID=tu_file_id' >> .figma/.env"
    exit 1
fi

# Verificar que las variables están definidas
if [ -z "$FIGMA_ACCESS_TOKEN" ]; then
    echo "❌ FIGMA_ACCESS_TOKEN no está definido en .figma/.env"
    exit 1
else
    echo "✅ FIGMA_ACCESS_TOKEN está configurado"
fi

if [ -z "$FIGMA_FILE_ID" ]; then
    echo "❌ FIGMA_FILE_ID no está definido en .figma/.env"
    exit 1
else
    echo "✅ FIGMA_FILE_ID está configurado ($FIGMA_FILE_ID)"
fi

echo ""
echo "🌐 Probando conexión con Figma API..."

# Probar la API de Figma
RESPONSE=$(curl -s -w "\n%{http_code}" \
    -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" \
    "https://api.figma.com/v1/files/$FIGMA_FILE_ID")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Conexión exitosa con Figma API"
    echo ""
    echo "📄 Información del archivo:"
    echo "$BODY" | grep -o '"name":"[^"]*"' | head -1 | sed 's/"name":"\(.*\)"/   Nombre: \1/'
    echo ""
    echo "🎨 Componentes detectados:"
    # Extraer nombres de componentes (simplificado)
    COMPONENTS=$(echo "$BODY" | grep -o '"name":"Button[^"]*"' | head -5)
    if [ -z "$COMPONENTS" ]; then
        echo "   ⚠️  No se encontraron componentes 'Button'"
        echo "   Verifica que el archivo tenga componentes publicados"
    else
        echo "$COMPONENTS" | sed 's/"name":"\(.*\)"/   - \1/'
    fi
    echo ""
    echo "✅ Configuración completa! Ya puedes extraer tokens."
elif [ "$HTTP_CODE" = "403" ]; then
    echo "❌ Error 403: Access token inválido o sin permisos"
    echo "   Verifica que el token tenga permisos de lectura"
elif [ "$HTTP_CODE" = "404" ]; then
    echo "❌ Error 404: File ID no encontrado"
    echo "   Verifica que el File ID sea correcto: $FIGMA_FILE_ID"
else
    echo "❌ Error $HTTP_CODE al conectar con Figma"
    echo "   Response: $BODY"
fi

exit 0
