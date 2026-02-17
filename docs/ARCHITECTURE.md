# KDS AI Preview - Architecture & Flow

> Documentación completa del flujo end-to-end: Figma → Design System → Framework Wrappers

**Última actualización**: 2026-02-10

## 📋 Índice

- [Overview](#overview)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Flujo de Trabajo](#flujo-de-trabajo)
- [Componentes del Sistema](#componentes-del-sistema)
- [Validación y Calidad](#validación-y-calidad)
- [Framework Wrappers](#framework-wrappers)
- [Decisiones Técnicas](#decisiones-técnicas)

---

## Overview

Este proyecto es un **Proof of Concept (PoC)** que demuestra cómo construir un Design System automatizado usando:

- **Figma como Single Source of Truth (SSOT)**
- **Model Context Protocol (MCP)** para extracción automática
- **LIT 3.x** para web components
- **DTCG** (Design Tokens Community Group) para tokens
- **Framework wrappers** para React, Angular y Blazor

### Filosofía: Button-First

Completar **TODO** el flujo con el componente Button antes de escalar a otros componentes. El Button sirve como **template reutilizable** para Input, Checkbox, Radio, etc.

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                         FIGMA (SSOT)                            │
│                    Untitled UI v2.0 (FREE)                      │
│                                                                 │
│  • Component Properties (size, hierarchy, iconPosition)        │
│  • Design Variables (colors, typography, shadows)              │
│  • Visual Design (spacing, border-radius)                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ MCP (Model Context Protocol)
                         │ • get_design_context
                         │ • get_variable_defs
                         │ • SSE Transport
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTRACTION & CONTRACTS                       │
│                                                                 │
│  .figma/button.figma-contract.json                            │
│  .figma/button.figma-contract.ts                              │
│  scripts/validate-button-contract.ts                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ TypeScript Interfaces
                         │ Contract Validation
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DESIGN TOKENS                              │
│                   packages/tokens/                              │
│                                                                 │
│  • tokens.json (DTCG format, 90+ tokens)                      │
│  • tokens.css (CSS custom properties)                          │
│  • index.ts (TypeScript exports)                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ CSS Variables
                         │ Token Consumption
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    WEB COMPONENTS (LIT)                         │
│                packages/web-components/                         │
│                                                                 │
│  kds-button.ts                                                 │
│  • @customElement('kds-button')                                │
│  • @property decorators                                        │
│  • CSS with var(--kds-*)                                       │
│  • Validated against Figma contract                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
           ┌─────────────┼─────────────┐
           │             │             │
           ▼             ▼             ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   REACT      │ │   ANGULAR    │ │   BLAZOR     │
│   WRAPPER    │ │   WRAPPER    │ │   WRAPPER    │
│              │ │              │ │              │
│ Button.tsx   │ │ button.comp. │ │ KdsButton.   │
│              │ │              │ │ razor        │
│ forwardRef   │ │ Standalone   │ │ JSInterop    │
│ Events       │ │ Module       │ │ EventCallback│
└──────────────┘ └──────────────┘ └──────────────┘
```

---

## Flujo de Trabajo

### 1. Extracción desde Figma (MCP)

**Herramientas MCP disponibles:**
- `get_design_context` → Propiedades del componente
- `get_variable_defs` → Variables de diseño (colors, typography, shadows)
- `get_screenshot` → Capturas visuales
- `get_code_connect_map` → Mapeo componente ↔ código

**Ejemplo de extracción:**
```bash
# MCP tool call
mcp__figma-desktop__get_design_context({ nodeId: "1038:34411" })
# Output: Component properties, variants, structure

mcp__figma-desktop__get_variable_defs({ nodeId: "1038:34411" })
# Output: Colors, typography, shadows
```

**Resultado:**
- `.figma/button.figma-contract.json` (90 líneas, JSON schema)
- `.figma/button.figma-contract.ts` (150 líneas, TypeScript interfaces)

### 2. Validación de Contrato

**Script:** `scripts/validate-button-contract.ts`

Valida que el componente LIT implementa **100%** las propiedades del contrato Figma:

```typescript
// Extrae propiedades del componente LIT via regex
const componentProperties = extractComponentProperties('kds-button.ts');

// Compara contra contrato Figma
const errors = validateProperties(componentProperties, FIGMA_CONTRACT);

// ✅ PASSED: Component matches Figma contract (SSOT)
```

**Integrado en build:**
```json
"scripts": {
  "build": "npm run validate && vite build && tsc --emitDeclarationOnly"
}
```

### 3. Design Tokens (DTCG)

**Extracción:** Variables de Figma → `tokens.json`

**Organización por categorías:**
- `color`: Brand, Error, Gray, Success (90+ valores)
- `typography`: Font family, size, weight, line-height
- `shadow`: Base shadows + focus rings
- `component.button`: Spacing, border-radius, heights

**Generación de CSS:**
```css
:root {
  --kds-color-brand-600: #7F56D9;
  --kds-button-height-md: 40px;
  --kds-shadow-xs: 0 1px 2px 0 rgba(10, 13, 18, 0.05);
}
```

**Consumo en LIT:**
```css
button {
  background-color: var(--kds-color-brand-600, #7F56D9);
  height: var(--kds-button-height-md, 40px);
}
```

### 4. Web Component (LIT)

**Archivo:** `packages/web-components/src/components/kds-button.ts`

**Características:**
- Custom element: `<kds-button>`
- Propiedades reactivas con `@property`
- Tipos TypeScript: `ButtonSize`, `ButtonHierarchy`, `IconPosition`
- Eventos custom: `kds-button-click`
- Slots para contenido: `<slot>`, `<slot name="icon">`

**Ejemplo:**
```html
<kds-button
  size="lg"
  hierarchy="primary"
  icon-position="leading"
  destructive
>
  <svg slot="icon">...</svg>
  Delete
</kds-button>
```

### 5. Framework Wrappers

#### React Wrapper
**Archivo:** `packages/wrappers/react/src/Button.tsx`

- `forwardRef` para refs
- `useEffect` para event listeners
- Props idiomáticas React
- TypeScript completo

```tsx
<Button
  size="lg"
  hierarchy="primary"
  onClick={(e) => console.log('clicked')}
>
  Click me
</Button>
```

#### Angular Wrapper
**Archivos:**
- `packages/wrappers/angular/src/button.component.ts` (Standalone)
- `packages/wrappers/angular/src/button.module.ts` (Module)

- `CUSTOM_ELEMENTS_SCHEMA`
- `@ViewChild` para elemento nativo
- `@Input`/`@Output` decorators
- Lifecycle hooks

```html
<kds-button-wrapper
  size="lg"
  hierarchy="primary"
  (buttonClick)="onClick()">
  Click me
</kds-button-wrapper>
```

#### Blazor Wrapper
**Archivos:**
- `packages/wrappers/blazor/Components/KdsButton.razor`
- `packages/wrappers/blazor/wwwroot/kds-blazor.js`

- JavaScript Interop (`IJSRuntime`)
- `DotNetObjectReference` para callbacks
- `IAsyncDisposable` para cleanup
- `[Parameter]` y `EventCallback`

```razor
<KdsButton
  Size="lg"
  Hierarchy="primary"
  OnClick="@HandleClick">
  Click me
</KdsButton>
```

---

## Componentes del Sistema

### Packages

#### 1. `@kds/tokens`
**Propósito:** Design tokens en formato DTCG

**Output:**
- `dist/tokens.json` (6KB)
- `dist/tokens.css` (3KB)
- `dist/index.js` + `.d.ts` (TypeScript exports)

**Exports:**
```typescript
import { colors, typography, shadows, button } from '@kds/tokens';
import '@kds/tokens/css'; // CSS import
```

#### 2. `@kds/web-components`
**Propósito:** Web components con LIT

**Output:**
- `dist/index.js` (31KB)
- `dist/index.d.ts` (TypeScript declarations)
- Exports: `KdsButton`, tipos

**Consumo:**
```typescript
import { KdsButton } from '@kds/web-components';
import '@kds/web-components/tokens.css';
```

#### 3. `@kds/react`
**Propósito:** React wrappers

**Output:**
- `dist/Button.js` + `.d.ts`
- `dist/index.js` + `.d.ts`

**Dependencies:**
- `@kds/web-components`
- Peer: `react@^18`, `react-dom@^18`

#### 4. `@kds/angular`
**Propósito:** Angular wrappers

**Output:**
- `dist/button.component.js` + `.d.ts`
- `dist/button.module.js` + `.d.ts`
- `dist/index.js` + `.d.ts`

**Dependencies:**
- `@kds/web-components`
- Peer: `@angular/core@^17`, `@angular/common@^17`

#### 5. `@kds/blazor`
**Propósito:** Blazor wrappers

**Contenido:**
- `Components/KdsButton.razor`
- `wwwroot/kds-blazor.js`
- `README.md`

---

## Validación y Calidad

### Contract Validation System

**Objetivo:** Garantizar que el código implementa 100% el diseño de Figma.

**Flujo:**
1. Extracción de propiedades desde Figma → Contract (JSON + TS)
2. Parsing del componente LIT → Propiedades implementadas
3. Comparación: Contract vs Implementation
4. Build fails si hay discrepancias ❌

**Validaciones:**
- ✅ Todas las propiedades requeridas presentes
- ✅ Valores por defecto coinciden
- ✅ Tipos correctos (ButtonSize, ButtonHierarchy, etc.)
- ✅ Valores permitidos (enums) respetados

**Output del build:**
```bash
╔════════════════════════════════════════════════╗
║  Button Component Contract Validation         ║
╚════════════════════════════════════════════════╝

✅ Checking required properties from Figma contract:
  ✓ size: ButtonSize (default: md)
  ✓ hierarchy: ButtonHierarchy (default: primary)
  ✓ iconPosition: IconPosition (default: none)
  ✓ destructive: inferred (default: false)

✅ VALIDATION PASSED
╔════════════════════════════════════════════════╗
║  SUCCESS: Component matches Figma contract ✓  ║
╚════════════════════════════════════════════════╝
```

### Tooling Reutilizable

**Scripts disponibles:**

#### `extract-figma-contract.ts`
Template para extraer contratos de nuevos componentes.

```bash
tsx scripts/extract-figma-contract.ts <component-name> <node-id>
# Provides step-by-step guide for MCP extraction
```

#### `validate-button-contract.ts`
Validación específica para Button (production-ready).

```bash
tsx scripts/validate-button-contract.ts
# Validates Button against Figma contract
```

#### `validate-component-contract.ts`
Template genérico para validación (reference).

**Documentación:** `.figma/TOOLING-GUIDE.md` (500+ líneas)

---

## Framework Wrappers

### React

**Approach:** HOC with `forwardRef`

**Características:**
- Refs forwarding
- Event handling via `addEventListener`
- Props mapping 1:1
- TypeScript types re-exported

**Trade-offs:**
- ✅ Idiomático para React
- ✅ TypeScript completo
- ⚠️ Necesita ref forwarding manual

### Angular

**Approach:** Standalone Component + NgModule

**Características:**
- `CUSTOM_ELEMENTS_SCHEMA` para web components
- `@ViewChild` para acceso al elemento
- Property binding via `[attr.*]`
- Event binding via `@Output`

**Trade-offs:**
- ✅ Soporta apps standalone y module-based
- ✅ Lifecycle hooks para cleanup
- ⚠️ Atributos string-based (no type-safety nativo)

### Blazor

**Approach:** Razor Component + JS Interop

**Características:**
- JavaScript Interop para eventos
- `DotNetObjectReference` para callbacks
- `IAsyncDisposable` para cleanup
- `[Parameter]` para props

**Trade-offs:**
- ✅ API C# idiomática
- ✅ EventCallback async
- ⚠️ Requiere setup de JS module

---

## Decisiones Técnicas

### 1. Figma como SSOT ✅
**Razón:** Single source of truth garantiza consistencia diseño ↔ código.

**Alternativas consideradas:**
- ❌ REST API: Rechazado (user requirement: "solo MCP")
- ❌ Manual extraction: No escalable

### 2. MCP para Extracción ✅
**Razón:** Protocol estándar, soporte oficial Figma Desktop.

**Ventajas:**
- Server-Sent Events (SSE) transport
- Tools tipados (TypeScript)
- Integrado en Claude Code

### 3. LIT para Web Components ✅
**Razón:** Liviano, estándar, framework-agnostic.

**Alternativas consideradas:**
- ❌ Stencil: Más pesado, build complejo
- ❌ Native Custom Elements: Sin reactivity

### 4. DTCG para Tokens ✅
**Razón:** Especificación estándar, JSON + CSS generation.

**Ventajas:**
- Format community-driven
- Tooling ecosystem
- JSON Schema validation (opcional)

### 5. Button-First Strategy ✅
**Razón:** Template completo antes de escalar.

**Ventajas:**
- Todas las decisiones técnicas tomadas
- Tooling probado y documentado
- Copy-paste approach para nuevos componentes

---

## Métricas del Proyecto

### Líneas de Código

| Package | Archivos | LOC (aprox) |
|---------|----------|-------------|
| tokens | 4 | 250 |
| web-components | 3 | 450 |
| react wrapper | 3 | 200 |
| angular wrapper | 4 | 250 |
| blazor wrapper | 4 | 180 |
| scripts | 3 | 700 |
| **Total** | **21** | **~2000** |

### Tokens Extraídos

- Colors: 35 valores (Brand, Error, Gray, Success)
- Typography: 2 text styles (sm, md)
- Shadows: 4 definiciones
- Component tokens: 15 valores (Button-specific)

**Total: 90+ tokens**

### Build Output

- `@kds/tokens/dist`: 9KB (JSON + CSS + JS + declarations)
- `@kds/web-components/dist`: 88KB (JS + maps + declarations)
- `@kds/react/dist`: 10KB (JS + declarations)
- `@kds/angular/dist`: 13KB (JS + declarations)

**Total: ~120KB** (sin comprimir, con source maps)

---

## Próximos Pasos (Post-PoC)

### Escalado a Más Componentes

1. **Input component**
   - Copiar tooling de Button
   - Extraer contract via MCP
   - Implementar en LIT
   - Crear wrappers

2. **Checkbox, Radio**
   - Mismo flujo
   - Reutilizar validation scripts

3. **Select, Modal, etc.**
   - Componentes más complejos
   - Ajustar tooling según necesidad

### Mejoras al Sistema

- **Automatización completa:** Script que ejecute todo el flujo
- **Visual regression testing:** Comparar capturas Figma vs rendered
- **Storybook:** Documentación interactiva
- **CI/CD:** Validación automática en PRs

---

## Referencias

- **Figma Source:** Untitled UI v2.0 (FREE)
- **MCP Server:** Figma Desktop (http://127.0.0.1:3845/mcp)
- **Design Tokens Spec:** https://tr.designtokens.org/format/
- **LIT Documentation:** https://lit.dev/
- **DTCG Format:** https://design-tokens.github.io/community-group/format/

---

*Última revisión: 2026-02-10 | Mantenido por: Kilian Sala*
