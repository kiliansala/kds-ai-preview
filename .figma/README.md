# Extracción de Componentes desde Figma

> Proceso para extraer propiedades de componentes desde Figma vía Claude CLI + MCP

## Proceso de Extracción

**IMPORTANTE**: La extracción se realiza usando **Claude CLI** con **Figma Desktop MCP Server**, NO directamente en Claude Code.

### Paso 1: Preparar Figma Desktop

1. Abrir Figma Desktop con archivo **"Untitled UI v2.0"** (fileKey: `CICp1MWc31lkvjX3jYo1rj`)
2. Navegar a la página de componentes base
3. Activar **Dev Mode** en Figma
4. **Seleccionar el componente** que quieres extraer (debe estar en foreground/seleccionado)

### Paso 2: Extraer en Claude CLI

Con el componente seleccionado, ejecutar en Claude CLI:

```
Extrae el componente seleccionado en Figma usando get_design_context.
Dame el output completo con todas las propiedades del componente:
- NodeId
- Propiedades (size, state, type, etc.)
- Valores posibles para cada propiedad
- Valores por defecto
- Medidas y spacing
- Colores y tokens de diseño
```

### Paso 3: Pasar Output a Claude Code

Copiar el output completo y pegarlo en Claude Code para que genere los archivos de contrato.

---

## NodeIds de Componentes Conocidos

| Componente | NodeId | Status |
|------------|--------|--------|
| Button | `1038:34411` | ✅ Completado |
| Checkbox | `1097:63652` | ✅ Completado |
| Toggle | `1102:4208` | ✅ Extraído |

---

## Ejemplo Completo

```bash
# 1. En Figma Desktop:
#    - Abrir "Untitled UI v2.0"
#    - Activar Dev Mode
#    - Seleccionar componente Toggle

# 2. En Claude CLI:
> "Extrae el componente seleccionado en Figma usando get_design_context.
   Dame el output completo con nodeId, propiedades, valores, medidas y tokens"

# 3. Copiar output y pasarlo a Claude Code
```

---

## Archivos Generados

Después de la extracción, se crean:

### 1. Contrato JSON
**`.figma/{component}.figma-contract.json`**

Schema con todas las propiedades del componente.

**Template**: [button.figma-contract.json](button.figma-contract.json)

### 2. Contrato TypeScript
**`.figma/{component}.figma-contract.ts`**

Tipos TypeScript y constante para validación.

**Template**: [button.figma-contract.ts](button.figma-contract.ts)

---

## Workflow Completo

1. **Extracción Figma** (este proceso) → Obtener propiedades
2. **Crear contratos** (.json + .ts) → Definir schema
3. **Implementación LIT** → Componente web
4. **Validación contrato** → Verificar 100% fidelidad
5. **Validación A11y** → WCAG 2.1 AA compliance
6. **Framework wrappers** → React, Angular, Blazor
7. **Documentación** → index.html interactivo
8. **Testing final** → Validaciones + manual

Ver detalles en [../docs/DEVELOPMENT.md](../docs/DEVELOPMENT.md)

---

## Referencias

- **Workflow completo**: [docs/DEVELOPMENT.md](../docs/DEVELOPMENT.md)
- **Templates**: [button.figma-contract.json](button.figma-contract.json), [button.figma-contract.ts](button.figma-contract.ts)
- **Progreso**: [../ROADMAP.md](../ROADMAP.md)

---

*Última actualización: 2026-02-11*
