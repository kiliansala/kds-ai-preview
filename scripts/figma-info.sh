#!/bin/bash

# Script para obtener información detallada de componentes Figma
# Usage: ./scripts/figma-info.sh [component-name]

set -e

if [ ! -f ".figma/.env" ]; then
    echo "❌ No se encontró .figma/.env"
    echo "   Ejecuta primero: cp .figma/.env.example .figma/.env"
    exit 1
fi

source .figma/.env

COMPONENT_NAME=${1:-"Button"}

echo "🎨 Obteniendo información de Figma..."
echo "   File ID: $FIGMA_FILE_ID"
echo "   Buscando: $COMPONENT_NAME"
echo ""

# Crear directorio de cache si no existe
mkdir -p .figma/cache

# Obtener información del archivo
echo "📥 Descargando componentes..."
curl -s -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" \
     "https://api.figma.com/v1/files/$FIGMA_FILE_ID/components" \
     > .figma/cache/components.json

# Verificar si hubo error
if grep -q "error" .figma/cache/components.json; then
    echo "❌ Error al obtener componentes:"
    cat .figma/cache/components.json | jq '.error, .status'
    exit 1
fi

echo "✅ Componentes descargados"
echo ""

# Buscar el componente
echo "🔍 Buscando componente '$COMPONENT_NAME'..."
COMPONENT_DATA=$(cat .figma/cache/components.json | jq ".meta.components[] | select(.name | contains(\"$COMPONENT_NAME\"))")

if [ -z "$COMPONENT_DATA" ]; then
    echo "⚠️  No se encontró componente con nombre '$COMPONENT_NAME'"
    echo ""
    echo "📋 Componentes disponibles:"
    cat .figma/cache/components.json | jq -r '.meta.components[].name' | sort | uniq | head -20
else
    echo "✅ Componente encontrado!"
    echo ""
    echo "$COMPONENT_DATA" | jq '{
        name: .name,
        description: .description,
        key: .key,
        node_id: .node_id
    }'

    # Guardar información del componente
    echo "$COMPONENT_DATA" > ".figma/cache/${COMPONENT_NAME}.json"
    echo ""
    echo "💾 Información guardada en: .figma/cache/${COMPONENT_NAME}.json"
fi

echo ""
echo "✅ Listo!"
