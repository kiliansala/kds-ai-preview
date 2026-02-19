# KDS AI Preview - Architecture & Flow

> Complete end-to-end flow documentation: Figma -> Design System -> Framework Wrappers

**Last updated**: 2026-02-19

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Workflow](#workflow)
- [System Components](#system-components)
- [Validation and Quality](#validation-and-quality)
- [Framework Wrappers](#framework-wrappers)
- [Technical Decisions](#technical-decisions)

---

## Overview

This project is a **Proof of Concept (PoC)** demonstrating how to build an automated Design System using:

- **Figma as Single Source of Truth (SSOT)**
- **Model Context Protocol (MCP)** for automated extraction
- **LIT 3.x** for web components
- **DTCG** (Design Tokens Community Group) for tokens
- **Framework wrappers** for React, Angular, and Blazor

### Philosophy: Button-First, Then Scale

Complete the **entire** flow with the Button component first, then replicate the validated workflow. 7 components completed to date: Button, Checkbox, Toggle, Tooltip, Badge, Button Group, Input Field.

---

## System Architecture

```
+---------------------------------------------------------------+
|                         FIGMA (SSOT)                           |
|                    Untitled UI v2.0 (FREE)                     |
|                                                                |
|  - Component Properties (size, hierarchy, iconPosition)        |
|  - Design Variables (colors, typography, shadows)              |
|  - Visual Design (spacing, border-radius)                      |
+----------------------------+----------------------------------+
                             |
                             | MCP (Model Context Protocol)
                             | - get_design_context
                             | - get_variable_defs
                             | - SSE Transport
                             v
+---------------------------------------------------------------+
|                    EXTRACTION & CONTRACTS                       |
|                                                                |
|  .figma/button.figma-contract.json                            |
|  .figma/button.figma-contract.ts                              |
|  scripts/validate-button-contract.ts                          |
+----------------------------+----------------------------------+
                             |
                             | TypeScript Interfaces
                             | Contract Validation
                             v
+---------------------------------------------------------------+
|                      DESIGN TOKENS                             |
|                   packages/tokens/                             |
|                                                                |
|  - tokens.json (DTCG format, 90+ tokens)                     |
|  - tokens.css (CSS custom properties)                         |
|  - index.ts (TypeScript exports)                              |
+----------------------------+----------------------------------+
                             |
                             | CSS Variables
                             | Token Consumption
                             v
+---------------------------------------------------------------+
|                    WEB COMPONENTS (LIT)                        |
|                packages/web-components/                        |
|                                                                |
|  kds-button.ts, kds-checkbox.ts, kds-toggle.ts               |
|  kds-tooltip.ts, kds-badge.ts, kds-button-group.ts           |
|  kds-input-field.ts                                           |
|  - @customElement('kds-*')                                    |
|  - @property decorators, CSS with var(--kds-*)                |
|  - Validated against Figma contract (7 components)            |
+----------------------------+----------------------------------+
                             |
           +-----------------+-----------------+
           |                 |                 |
           v                 v                 v
+----------------+ +----------------+ +----------------+
|   REACT        | |   ANGULAR      | |   BLAZOR       |
|   WRAPPER      | |   WRAPPER      | |   WRAPPER      |
|                | |                | |                |
| Button.tsx     | | button.comp.   | | KdsButton.     |
|                | |                | | razor          |
| forwardRef     | | Standalone     | | JSInterop      |
| Events         | | Module         | | EventCallback  |
+----------------+ +----------------+ +----------------+
```

---

## Workflow

### 1. Extraction from Figma (MCP)

**Available MCP tools:**
- `get_design_context` -> Component properties
- `get_variable_defs` -> Design variables (colors, typography, shadows)
- `get_screenshot` -> Visual captures
- `get_code_connect_map` -> Component-to-code mapping

**Extraction example:**
```bash
# MCP tool call
mcp__figma-desktop__get_design_context({ nodeId: "1038:34411" })
# Output: Component properties, variants, structure

mcp__figma-desktop__get_variable_defs({ nodeId: "1038:34411" })
# Output: Colors, typography, shadows
```

**Result:**
- `.figma/button.figma-contract.json` (90 lines, JSON schema)
- `.figma/button.figma-contract.ts` (150 lines, TypeScript interfaces)

### 2. Contract Validation

**Script:** `scripts/validate-button-contract.ts`

Validates that the LIT component implements **100%** of the Figma contract properties:

```typescript
// Extract LIT component properties via regex
const componentProperties = extractComponentProperties('kds-button.ts');

// Compare against Figma contract
const errors = validateProperties(componentProperties, FIGMA_CONTRACT);

// PASSED: Component matches Figma contract (SSOT)
```

**Integrated in build:**
```json
"scripts": {
  "build": "npm run validate && vite build && tsc --emitDeclarationOnly"
}
```

### 3. Design Tokens (DTCG)

**Extraction:** Figma variables -> `tokens.json`

**Organization by category:**
- `color`: Brand, Error, Gray, Success (90+ values)
- `typography`: Font family, size, weight, line-height
- `shadow`: Base shadows + focus rings
- `component.button`: Spacing, border-radius, heights

**CSS generation:**
```css
:root {
  --kds-color-brand-600: #7F56D9;
  --kds-button-height-md: 40px;
  --kds-shadow-xs: 0 1px 2px 0 rgba(10, 13, 18, 0.05);
}
```

**Consumption in LIT:**
```css
button {
  background-color: var(--kds-color-brand-600, #7F56D9);
  height: var(--kds-button-height-md, 40px);
}
```

### 4. Web Component (LIT)

**File:** `packages/web-components/src/components/kds-button.ts`

**Features:**
- Custom element: `<kds-button>`
- Reactive properties with `@property`
- TypeScript types: `ButtonSize`, `ButtonHierarchy`, `IconPosition`
- Custom events: `kds-button-click`
- Slots for content: `<slot>`, `<slot name="icon">`

**Example:**
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
**File:** `packages/wrappers/react/src/Button.tsx`

- `forwardRef` for refs
- `useEffect` for event listeners
- Idiomatic React props
- Full TypeScript support

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
**Files:**
- `packages/wrappers/angular/src/button.component.ts` (Standalone)
- `packages/wrappers/angular/src/button.module.ts` (Module)

- `CUSTOM_ELEMENTS_SCHEMA`
- `@ViewChild` for native element
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
**Files:**
- `packages/wrappers/blazor/Components/KdsButton.razor`
- `packages/wrappers/blazor/wwwroot/kds-blazor.js`

- JavaScript Interop (`IJSRuntime`)
- `DotNetObjectReference` for callbacks
- `IAsyncDisposable` for cleanup
- `[Parameter]` and `EventCallback`

```razor
<KdsButton
  Size="lg"
  Hierarchy="primary"
  OnClick="@HandleClick">
  Click me
</KdsButton>
```

---

## System Components

### Packages

#### 1. `@kds/tokens`
**Purpose:** Design tokens in DTCG format

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
**Purpose:** Web components with LIT

**Output:**
- `dist/index.js` (bundled)
- `dist/index.d.ts` (TypeScript declarations)
- Exports: `KdsButton`, `KdsCheckbox`, `KdsToggle`, `KdsTooltip`, `KdsBadge`, `KdsButtonGroup`, `KdsInputField`, types

**Usage:**
```typescript
import { KdsButton } from '@kds/web-components';
import '@kds/web-components/tokens.css';
```

#### 3. `@kds/react`
**Purpose:** React wrappers

**Output:**
- `dist/Button.js` + `.d.ts`
- `dist/index.js` + `.d.ts`

**Dependencies:**
- `@kds/web-components`
- Peer: `react@^18`, `react-dom@^18`

#### 4. `@kds/angular`
**Purpose:** Angular wrappers

**Output:**
- `dist/button.component.js` + `.d.ts`
- `dist/button.module.js` + `.d.ts`
- `dist/index.js` + `.d.ts`

**Dependencies:**
- `@kds/web-components`
- Peer: `@angular/core@^17`, `@angular/common@^17`

#### 5. `@kds/blazor`
**Purpose:** Blazor wrappers

**Contents:**
- `Components/KdsButton.razor`
- `wwwroot/kds-blazor.js`
- `README.md`

---

## Validation and Quality

### Contract Validation System

**Objective:** Guarantee that code implements 100% of the Figma design.

**Flow:**
1. Extract properties from Figma -> Contract (JSON + TS)
2. Parse LIT component -> Implemented properties
3. Comparison: Contract vs Implementation
4. Build fails if there are discrepancies

**Validations:**
- All required properties present
- Default values match
- Correct types (ButtonSize, ButtonHierarchy, etc.)
- Allowed values (enums) respected

**Build output:**
```bash
+================================================+
|  Button Component Contract Validation          |
+================================================+

Checking required properties from Figma contract:
  - size: ButtonSize (default: md)
  - hierarchy: ButtonHierarchy (default: primary)
  - iconPosition: IconPosition (default: none)
  - destructive: inferred (default: false)

VALIDATION PASSED
+================================================+
|  SUCCESS: Component matches Figma contract     |
+================================================+
```

### Reusable Tooling

**Available scripts:**

#### `extract-figma-contract.ts`
Template for extracting contracts from new components.

```bash
tsx scripts/extract-figma-contract.ts <component-name> <node-id>
# Provides step-by-step guide for MCP extraction
```

#### `validate-button-contract.ts`
Button-specific validation (production-ready).

```bash
tsx scripts/validate-button-contract.ts
# Validates Button against Figma contract
```

#### `validate-component-contract.ts`
Generic validation template (reference).

**Documentation:** `docs/DEVELOPMENT.md`

---

## Framework Wrappers

### React

**Approach:** HOC with `forwardRef`

**Features:**
- Refs forwarding
- Event handling via `addEventListener`
- 1:1 props mapping
- TypeScript types re-exported

**Trade-offs:**
- Idiomatic for React
- Full TypeScript support
- Requires manual ref forwarding

### Angular

**Approach:** Standalone Component + NgModule

**Features:**
- `CUSTOM_ELEMENTS_SCHEMA` for web components
- `@ViewChild` for element access
- Property binding via `[attr.*]`
- Event binding via `@Output`

**Trade-offs:**
- Supports both standalone and module-based apps
- Lifecycle hooks for cleanup
- String-based attributes (no native type-safety)

### Blazor

**Approach:** Razor Component + JS Interop

**Features:**
- JavaScript Interop for events
- `DotNetObjectReference` for callbacks
- `IAsyncDisposable` for cleanup
- `[Parameter]` for props

**Trade-offs:**
- Idiomatic C# API
- Async EventCallback
- Requires JS module setup

---

## Technical Decisions

### 1. Figma as SSOT
**Reason:** Single source of truth guarantees design-to-code consistency.

**Alternatives considered:**
- REST API: Rejected (user requirement: "MCP only")
- Manual extraction: Not scalable

### 2. MCP for Extraction
**Reason:** Standard protocol, official Figma Desktop support.

**Advantages:**
- Server-Sent Events (SSE) transport
- Typed tools (TypeScript)
- Integrated in Claude Code

### 3. LIT for Web Components
**Reason:** Lightweight, standards-based, framework-agnostic.

**Alternatives considered:**
- Stencil: Heavier, complex build
- Native Custom Elements: No reactivity

### 4. DTCG for Tokens
**Reason:** Standard specification, JSON + CSS generation.

**Advantages:**
- Community-driven format
- Tooling ecosystem
- JSON Schema validation (optional)

### 5. Button-First Strategy
**Reason:** Complete template before scaling.

**Advantages:**
- All technical decisions made
- Tooling tested and documented
- Copy-paste approach for new components

---

## Project Metrics

### Lines of Code

| Package | Files | LOC (approx) |
|---------|-------|---------------|
| tokens | 4 | 250 |
| web-components | 9+ | 3,500+ |
| react wrapper | 9+ | 700+ |
| angular wrapper | 9+ | 800+ |
| blazor wrapper | 9+ | 600+ |
| scripts | 15+ | 3,500+ |
| **Total** | **80+** | **~12,000+** |

### Extracted Tokens

- Colors: 35 values (Brand, Error, Gray, Success)
- Typography: 2 text styles (sm, md)
- Shadows: 4 definitions
- Component tokens: 15 values (Button-specific)

**Total: 90+ tokens**

### Build Output

- `@kds/tokens/dist`: 9KB (JSON + CSS + JS + declarations)
- `@kds/web-components/dist`: 88KB (JS + maps + declarations)
- `@kds/react/dist`: 10KB (JS + declarations)
- `@kds/angular/dist`: 13KB (JS + declarations)

**Total: ~120KB** (uncompressed, with source maps)

---

## Next Steps

### Remaining Components (Phase 6)

**Completed (7/13)**: Button, Checkbox, Toggle, Tooltip, Badge, Button Group, Input Field

**Next**:
1. **Checkbox Groups** - Reuses existing Checkbox (~5-7h)
2. **Avatars** - Image/initials component (~4-5h)
3. **Progress Indicators** - Linear/circular (~5-6h)
4. **Dropdowns** - Complex with keyboard nav (~7-9h)

**Blocked**: Tags, Text editors (locked in Figma)

### System Improvements

- **Visual regression testing:** Compare Figma captures vs rendered
- **Automated tests:** Unit + integration tests
- **CI/CD:** Automated validation in PRs

---

## References

- **Figma Source:** Untitled UI v2.0 (FREE)
- **MCP Server:** Figma Desktop (http://127.0.0.1:3845/mcp)
- **Design Tokens Spec:** https://tr.designtokens.org/format/
- **LIT Documentation:** https://lit.dev/
- **DTCG Format:** https://design-tokens.github.io/community-group/format/

---

*Last revision: 2026-02-19 | Maintained by: Kilian Sala*
