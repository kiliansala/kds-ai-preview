#!/usr/bin/env python3
"""
Script para extraer design tokens del componente Button desde Figma
"""

import json
import sys
from pathlib import Path

def find_components(node, path="", components=None):
    """Recursively find all COMPONENT nodes with Button in the name"""
    if components is None:
        components = []

    if isinstance(node, dict):
        # Check if this is a component
        if node.get('type') == 'COMPONENT' and 'Button' in node.get('name', ''):
            component_info = {
                'name': node.get('name'),
                'id': node.get('id'),
                'path': path,
                'properties': {}
            }

            # Extract style properties
            if 'fills' in node:
                component_info['properties']['fills'] = node['fills']
            if 'strokes' in node:
                component_info['properties']['strokes'] = node['strokes']
            if 'effects' in node:
                component_info['properties']['effects'] = node['effects']
            if 'cornerRadius' in node:
                component_info['properties']['cornerRadius'] = node['cornerRadius']
            if 'paddingLeft' in node:
                component_info['properties']['padding'] = {
                    'left': node.get('paddingLeft'),
                    'right': node.get('paddingRight'),
                    'top': node.get('paddingTop'),
                    'bottom': node.get('paddingBottom'),
                }
            if 'itemSpacing' in node:
                component_info['properties']['itemSpacing'] = node['itemSpacing']
            if 'layoutMode' in node:
                component_info['properties']['layoutMode'] = node['layoutMode']
            if 'characters' in node:
                component_info['properties']['text'] = node['characters']
            if 'style' in node:
                component_info['properties']['textStyle'] = node['style']

            components.append(component_info)

        # Recurse into children
        if 'children' in node:
            new_path = f"{path}/{node.get('name', 'unnamed')}"
            for child in node['children']:
                find_components(child, new_path, components)

    return components

def extract_button_tokens(file_path):
    """Extract Button component tokens from Figma file"""
    print("🔍 Analizando archivo de Figma...")

    with open(file_path, 'r') as f:
        data = json.load(f)

    print("✅ Archivo cargado")
    print("🔎 Buscando componentes Button...")

    # Find all Button components
    components = find_components(data.get('document', {}))

    print(f"✅ Encontrados {len(components)} componentes Button")

    # Show unique component names
    unique_names = set(c['name'] for c in components)
    print(f"\n📋 Variantes encontradas ({len(unique_names)}):")
    for name in sorted(unique_names):
        count = sum(1 for c in components if c['name'] == name)
        print(f"   - {name} ({count} instancias)")

    # Save the first few components for analysis
    output_file = Path('.figma/cache/button-components.json')
    with open(output_file, 'w') as f:
        json.dump(components[:10], f, indent=2)

    print(f"\n💾 Primeros componentes guardados en: {output_file}")

    return components

if __name__ == '__main__':
    file_path = Path('.figma/cache/file-full.json')

    if not file_path.exists():
        print("❌ No se encontró el archivo file-full.json")
        print("   Ejecuta primero el comando para descargar el archivo")
        sys.exit(1)

    try:
        components = extract_button_tokens(file_path)
        print("\n✅ Extracción completada!")
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
