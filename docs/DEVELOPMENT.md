# Development Guide

> Development guide and tooling for KDS AI Preview

## Philosophy

This project uses **Figma as Single Source of Truth (SSOT)**. LIT components implement exactly the properties defined in Figma through:

1. **Extraction via Claude CLI** -> See [.figma/README.md](../.figma/README.md)
2. **Design contracts** (JSON + TypeScript)
3. **Automated validation** in the build process

---

## Quick Start

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Dev mode (interactive documentation)
npm run dev --workspace=@kds/web-components
# Opens http://localhost:5173

# Validations
npm run validate:button
npm run validate:checkbox
```

---

## Workflow: New Component

### 1. Extraction from Figma

See full process in [.figma/README.md](../.figma/README.md)

**Summary**:
1. Select component in Figma Desktop (Dev Mode)
2. Run in Claude CLI: `get_design_context`
3. Pass output to Claude Code

### 2. Create Contracts

Create two files:

**`.figma/<component>.figma-contract.json`** - JSON Schema
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

**`.figma/<component>.figma-contract.ts`** - TypeScript Types
```typescript
export type ComponentSize = 'sm' | 'md' | 'lg';

export interface FigmaComponentContract {
  size: ComponentSize;
}

export const FIGMA_COMPONENT_CONTRACT = { ... };
```

**Templates**: `.figma/button.figma-contract.{json,ts}`

### 3. Implement LIT Component

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

### 4. Create Validation Script

```bash
# Copy template
cp scripts/validate-button-contract.ts scripts/validate-component-contract.ts

# Update imports and component-specific logic
```

### 5. Create A11y Validation Script

```bash
# Copy template
cp scripts/validate-button-a11y.ts scripts/validate-component-a11y.ts

# Update component-specific validations
```

### 6. Integrate in Build

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

### 8. Interactive Documentation

Update `packages/web-components/index.html` with:
- Playground with controls
- Component variants
- Usage (tabs: Web Component, React, Angular, Blazor)
- Complete API (Properties, Events, Slots)
- Accessibility (WCAG 2.1 AA)

### 9. Validate Documentation Page

Run the docs page validator to ensure the component's Vite page meets the Button standard.

```bash
# Validate a specific component
npm run validate:docs:input-field --workspace=@kds/web-components

# Or directly
tsx scripts/validate-docs-page.ts input-field
```

**What it checks** (using Button as reference):

| Group | Checks |
|---|---|
| **[1] Structure** | Header with title, description, status badges |
| **[2] Tabs** | All 6 tabs: overview, variants, tokens, usage, api, accessibility |
| **[3] Overview** | Quick Start section, Playground with `id="playground-{name}"`, dynamic `<code id="...">`, controls |
| **[4] Code Blocks** | Every `.docs-code-block` has a `.docs-copy-button` with SVG icon; every `data-copy="X"` has matching `id="X"` |
| **[5] Design Tokens** | `<h3>Colors</h3>` with `.docs-token-swatch` using CSS vars; Typography + Component-Specific sections |
| **[6] Usage** | 4 framework tabs (web-component, react, angular, blazor) each with Installation, Import, Basic Example |
| **[7] API** | Properties (4 columns), Events, Slots, CSS Custom Properties tables |
| **[8] Accessibility** | WCAG badges, Keyboard Navigation, Screen Reader, Color Contrast sections |
| **[9] Playground JS** | `init{Component}Playground()` and `update{Component}PlaygroundCode()` in `app.js` |

**Exit codes**: `0` = all pass, `1` = errors found (warnings are non-blocking).

**Fix all errors before marking the component as complete.**

---

## Available Scripts

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

### Validation

```bash
# Validate contract
npm run validate:button
npm run validate:checkbox

# Validate accessibility
npm run validate:a11y --workspace=@kds/web-components

# Validate all
npm run validate:all --workspace=@kds/web-components
```

### Development

```bash
# Dev mode with live reload
npm run dev --workspace=@kds/web-components

# Clean
npm run clean
```

---

## File Structure

```
/
├── .figma/
│   ├── README.md                          # Figma extraction process
│   ├── {component}.figma-contract.json    # Property schema
│   └── {component}.figma-contract.ts      # TypeScript types
│
├── scripts/
│   ├── validate-{component}-contract.ts   # Figma-to-Code validation
│   └── validate-{component}-a11y.ts       # Accessibility validation
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
    ├── react/                             # React example
    ├── angular/                           # Angular example
    └── blazor/                            # Blazor example
```

---

## Build Process

**Build order** (automatic with npm workspaces):

1. `@kds/tokens` - Design tokens
2. `@kds/web-components` - LIT components (**includes validations**)
3. `@kds/react` - React wrappers
4. `@kds/angular` - Angular wrappers
5. `@kds/blazor` - Blazor wrappers (no build)

**Web-components build runs**:
```bash
npm run validate      # Figma contract
npm run validate:a11y # Accessibility
vite build           # Bundle
tsc --emitDeclarationOnly # Types
```

If any validation fails -> build fails.

---

## Contract Validation

### Purpose

Guarantee 100% fidelity between Figma (SSOT) and code.

### What It Validates

- All Figma properties exist in the code
- Allowed values match exactly
- Default values are identical
- Data types are correct

### Web-Specific Properties

Properties that **don't exist in Figma** but are necessary for web (e.g.: `disabled`, `type`, `ariaLabel`) are **acceptable** and do not cause errors.

Mark them clearly in the code:

```typescript
/**
 * Button type (web-specific, not in Figma)
 */
@property({ type: String })
type: 'button' | 'submit' | 'reset' = 'button';
```

---

## Accessibility Validation

See full guide in [ACCESSIBILITY.md](ACCESSIBILITY.md)

### Automated Checks

- Correct ARIA attributes
- Keyboard support (Enter, Space, Tab)
- Focus indicators (:focus-visible)
- Touch targets (minimum 44x44px)
- Disabled state
- Color contrast (manual verification)

### Required Manual Testing

1. **Screen readers** - VoiceOver (macOS) / NVDA (Windows)
2. **Keyboard-only** - Test without mouse
3. **Zoom** - Verify at 200%
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
# See details
tsx scripts/validate-component-contract.ts
```

**Common fixes**:
- Verify property names match Figma
- Verify default values
- Verify allowed values

### TypeScript Declarations Missing

```bash
cd packages/web-components
npx tsc --emitDeclarationOnly
```

---

## References

- **Templates**: `.figma/button.figma-contract.{json,ts}`, `scripts/validate-button-*.ts`
- **Full examples**: `examples/{react,angular,blazor}/`
- **Figma extraction**: [.figma/README.md](../.figma/README.md)
- **Architecture**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Accessibility**: [ACCESSIBILITY.md](ACCESSIBILITY.md)
- **Progress**: [../ROADMAP.md](../ROADMAP.md)

---

*Last updated: 2026-02-11*
