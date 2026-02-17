# Development Guide

> Guía de desarrollo y tooling para KDS AI Preview

## Filosofía

Este proyecto usa **Figma como Single Source of Truth (SSOT)**. Los componentes LIT implementan exactamente las propiedades definidas en Figma mediante:

1. **Extracción vía Claude CLI** → Ver [.figma/README.md](../.figma/README.md)
2. **Contratos de diseño** (JSON + TypeScript)
3. **Validación automática** en build process

---

## Quick Start

```bash
# Instalar dependencias
npm install

# Build all packages
npm run build

# Dev mode (documentación interactiva)
npm run dev --workspace=@kds/web-components
# Abre http://localhost:5173

# Validaciones
npm run validate:button
npm run validate:checkbox
```

---

## Workflow: Nuevo Componente

### 1. Extracción desde Figma

Ver proceso completo en [.figma/README.md](../.figma/README.md)

**Resumen**:
1. Seleccionar componente en Figma Desktop (Dev Mode)
2. Ejecutar en Claude CLI: `get_design_context`
3. Pasar output a Claude Code

### 2. Crear Contratos

Crear dos archivos:

**`.figma/<component>.figma-contract.json`** - Schema JSON
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Component Name Contract",
  "source": {
    "figmaFileId": "CICp1MWc31lkvjX3jYo1rj",
    "componentId": "...",
    "componentName": "ComponentName"
  },
  "properties": { ... }
}
```

**`.figma/<component>.figma-contract.ts`** - Tipos TypeScript
```typescript
export type ComponentSize = 'sm' | 'md' | 'lg';

export interface FigmaComponentContract {
  size: ComponentSize;
}

export const FIGMA_COMPONENT_CONTRACT = { ... };
```

**Templates**: `.figma/button.figma-contract.{json,ts}`

### 3. Implementar LIT Component

```typescript
// packages/web-components/src/components/kds-component.ts
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('kds-component')
export class KdsComponent extends LitElement {
  @property({ type: String }) size: 'sm' | 'md' | 'lg' = 'md';

  render() {
    return html`<div class="component">...</div>`;
  }
}
```

### 4. Crear Script de Validación

```bash
# Copiar template
cp scripts/validate-button-contract.ts scripts/validate-component-contract.ts

# Actualizar imports y lógica específica
```

### 5. Crear Script de Validación A11y

```bash
# Copiar template
cp scripts/validate-button-a11y.ts scripts/validate-component-a11y.ts

# Actualizar validaciones específicas
```

### 6. Integrar en Build

```json
// packages/web-components/package.json
{
  "scripts": {
    "validate:component": "tsx ../../scripts/validate-component-contract.ts",
    "validate:component:a11y": "tsx ../../scripts/validate-component-a11y.ts",
    "build": "npm run validate:component && npm run validate:component:a11y && vite build && tsc"
  }
}
```

### 7. Framework Wrappers

**React** (`packages/wrappers/react/src/Component.tsx`):
```typescript
import { createComponent } from '@lit/react';
import { KdsComponent } from '@kds/web-components';

export const Component = createComponent({
  tagName: 'kds-component',
  elementClass: KdsComponent,
  react: React
});
```

**Angular** (`packages/wrappers/angular/src/component.component.ts`):
```typescript
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'kds-component-wrapper',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: '<kds-component [size]="size"></kds-component>'
})
export class KdsComponentComponent { }
```

**Blazor** (`packages/wrappers/blazor/Components/KdsComponent.razor`):
```razor
<kds-component size="@Size">@ChildContent</kds-component>

@code {
    [Parameter] public string Size { get; set; } = "md";
    [Parameter] public RenderFragment? ChildContent { get; set; }
}
```

### 8. Documentación Interactiva

Actualizar `packages/web-components/index.html` con:
- Playground con controles
- Variants del componente
- Usage (tabs: Web Component, React, Angular, Blazor)
- API completa (Properties, Events, Slots)
- Accesibilidad (WCAG 2.1 AA)

---

## Scripts Disponibles

### Build

```bash
# Build all packages
npm run build

# Build specific package
npm run build --workspace=@kds/tokens
npm run build --workspace=@kds/web-components
npm run build --workspace=@kds/react
npm run build --workspace=@kds/angular
```

### Validación

```bash
# Validar contrato
npm run validate:button
npm run validate:checkbox

# Validar accesibilidad
npm run validate:a11y --workspace=@kds/web-components

# Validar todo
npm run validate:all --workspace=@kds/web-components
```

### Development

```bash
# Dev mode con live reload
npm run dev --workspace=@kds/web-components

# Clean
npm run clean
```

---

## Estructura de Archivos

```
/
├── .figma/
│   ├── README.md                          # Proceso extracción Figma
│   ├── {component}.figma-contract.json    # Schema de propiedades
│   └── {component}.figma-contract.ts      # Tipos TypeScript
│
├── scripts/
│   ├── validate-{component}-contract.ts   # Validación Figma ↔ Código
│   └── validate-{component}-a11y.ts       # Validación accesibilidad
│
├── packages/
│   ├── tokens/                            # Design tokens (DTCG)
│   ├── web-components/                    # LIT components
│   └── wrappers/
│       ├── react/                         # React wrappers
│       ├── angular/                       # Angular wrappers
│       └── blazor/                        # Blazor wrappers
│
└── examples/
    ├── react/                             # Ejemplo React
    ├── angular/                           # Ejemplo Angular
    └── blazor/                            # Ejemplo Blazor
```

---

## Build Process

**Orden de build** (automático con npm workspaces):

1. `@kds/tokens` - Design tokens
2. `@kds/web-components` - LIT components (**incluye validaciones**)
3. `@kds/react` - React wrappers
4. `@kds/angular` - Angular wrappers
5. `@kds/blazor` - Blazor wrappers (sin build)

**Build de web-components ejecuta**:
```bash
npm run validate      # Contrato Figma
npm run validate:a11y # Accesibilidad
vite build           # Bundle
tsc --emitDeclarationOnly # Types
```

Si cualquier validación falla → build falla.

---

## Validación de Contratos

### Propósito

Garantizar 100% fidelidad entre Figma (SSOT) y código.

### Qué valida

- ✅ Todas las propiedades de Figma existen en el código
- ✅ Valores permitidos coinciden exactamente
- ✅ Valores por defecto son idénticos
- ✅ Tipos de datos correctos

### Propiedades Web-Specific

Propiedades que **no existen en Figma** pero son necesarias para web (ej: `disabled`, `type`, `ariaLabel`) son **aceptables** y no causan errores.

Marcarlas claramente en el código:

```typescript
/**
 * Button type (web-specific, not in Figma)
 */
@property({ type: String })
type: 'button' | 'submit' | 'reset' = 'button';
```

---

## Validación de Accesibilidad

Ver guía completa en [ACCESSIBILITY.md](ACCESSIBILITY.md)

### Checks Automáticos

- ✅ Atributos ARIA correctos
- ✅ Soporte de teclado (Enter, Space, Tab)
- ✅ Indicadores de foco (:focus-visible)
- ✅ Touch targets (mínimo 44x44px)
- ✅ Estado disabled
- ⚠️ Contraste de color (verificación manual)

### Testing Manual Requerido

1. **Screen readers** - VoiceOver (macOS) / NVDA (Windows)
2. **Keyboard-only** - Probar sin mouse
3. **Zoom** - Verificar a 200%
4. **Contrast** - WebAIM Contrast Checker

---

## Troubleshooting

### Build Failures

```bash
npm run clean
npm install
npm run build
```

### Validation Failures

```bash
# Ver detalles
tsx scripts/validate-component-contract.ts
```

**Fixes comunes**:
- Verificar nombres de propiedades coinciden con Figma
- Verificar valores por defecto
- Verificar valores permitidos

### TypeScript Declarations Missing

```bash
cd packages/web-components
npx tsc --emitDeclarationOnly
```

---

## Referencias

- **Templates**: `.figma/button.figma-contract.{json,ts}`, `scripts/validate-button-*.ts`
- **Ejemplos completos**: `examples/{react,angular,blazor}/`
- **Extracción Figma**: [.figma/README.md](../.figma/README.md)
- **Arquitectura**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Accesibilidad**: [ACCESSIBILITY.md](ACCESSIBILITY.md)
- **Progreso**: [../ROADMAP.md](../ROADMAP.md)

---

*Última actualización: 2026-02-11*
