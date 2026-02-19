# KDS AI Preview

> **Kapsch Design System** - AI-Generated Design System Proof of Concept

[![Built with LIT](https://img.shields.io/badge/Built%20with-LIT-blue)](https://lit.dev/)
[![Figma SSOT](https://img.shields.io/badge/Figma-SSOT-green)](https://www.figma.com/)
[![MCP Integration](https://img.shields.io/badge/MCP-Integrated-purple)](https://modelcontextprotocol.io)

A Proof of Concept demonstrating how to build a fully automated Design System using **Figma as Single Source of Truth**, **Model Context Protocol (MCP)** for extraction, **LIT** for web components, and **wrappers** for React, Angular, and Blazor.

## Vision

Build a Design System where:
- **Figma** is the single source of truth (SSOT)
- **Extraction** is automated via MCP
- **Validation** guarantees 100% design-to-code fidelity
- **Tokens** follow the DTCG standard
- **Components** are framework-agnostic (LIT)
- **Wrappers** provide idiomatic APIs per framework

## Current Status

### PoC Completed + Phase 6 In Progress

| Phase | Description | Status |
|-------|-------------|--------|
| **Phase 1** | Foundation & MCP Integration | Completed |
| **Phase 1.5** | Figma-to-Code Validation System | Completed |
| **Phase 2** | Design Tokens System (DTCG) | Completed |
| **Phase 3** | Framework Wrappers (React + Angular + Blazor) | Completed |
| **Phase 4** | Documentation & Tooling | Completed |
| **Phase 5** | Presentation & Demo | Completed |
| **Phase 6** | Scaling to More Components | In progress (38%) |

**Components:**
- **Button** (100%) - Completed end-to-end with interactive documentation
- **Checkbox** (100%) - Completed end-to-end with interactive documentation
- **Toggle** (100%) - Completed end-to-end with interactive documentation
- **Tooltip** (100%) - Completed end-to-end with interactive documentation
- **Badge** (100%) - Completed end-to-end with 13 colors, 8 icon variants
- **6 base components** pending (Input, Avatar, Dropdowns, etc.)

**Repeatable workflow** completed across 5 components.

### Interactive Documentation

```bash
npm run dev --workspace=@kds/web-components
# Opens http://localhost:5173
```

The interactive documentation includes:
- Playground with live controls for Button, Checkbox, Toggle, Tooltip, and Badge
- All variants for each component
- Documented design tokens
- Copyable code for Web Component, React, Angular, Blazor
- Complete API with properties, events, and accessibility
- WCAG 2.1 AA compliance documentation

### Next Steps

**Immediate**:
- Implement **Button groups** (reuses existing Button, ~3-4 hours)
- Implement Checkbox groups (reuses existing Checkbox)
- Implement Avatars (~4-5 hours)

**Phase 6 - Scaling** (in progress):
- 13 base components from Untitled UI (5 completed, 6 pending)
- Repeatable 8-step workflow (~5-7 hours per component)
- Priority: Button groups, Checkbox groups, Avatars, Progress, Input (last)

See [ROADMAP.md](ROADMAP.md) for detailed tracking and full list.

## Architecture

```
Figma (Untitled UI v2.0)
    | MCP (get_design_context, get_variable_defs)
Design Contracts (.figma/*.json, *.ts)
    | Contract Validation (scripts/)
Design Tokens (@kds/tokens)
    | DTCG format (tokens.json, tokens.css)
Web Components (@kds/web-components)
    | LIT 3.x (kds-button.ts)
Framework Wrappers
    |-- React (@kds/react)
    |-- Angular (@kds/angular)
    +-- Blazor (@kds/blazor)
```

**See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for complete flow documentation.**

## Packages

### 1. [@kds/tokens](packages/tokens/)
Design tokens extracted from Figma in DTCG format.

```bash
npm install @kds/tokens
```

```typescript
import { colors, typography, shadows } from '@kds/tokens';
import '@kds/tokens/css';
```

**Output:** `tokens.json` (6KB), `tokens.css` (3KB), TypeScript exports

### 2. [@kds/web-components](packages/web-components/)
Web components built with LIT, validated against Figma contracts.

```bash
npm install @kds/web-components
```

```typescript
import { KdsButton } from '@kds/web-components';
import '@kds/web-components/tokens.css';
```

**Available components:** `<kds-button>`, `<kds-checkbox>`, `<kds-toggle>`, `<kds-tooltip>`, `<kds-badge>`

### 3. [@kds/react](packages/wrappers/react/)
React wrappers for web components.

```bash
npm install @kds/react
```

```tsx
import { Button } from '@kds/react';

<Button size="lg" hierarchy="primary" onClick={handleClick}>
  Click me
</Button>
```

### 4. [@kds/angular](packages/wrappers/angular/)
Angular wrappers (Standalone Components). Compatible with Angular 20/21.

```bash
npm install @kds/angular
```

```typescript
import { KdsButtonComponent } from '@kds/angular';

<kds-button-wrapper size="lg" hierarchy="primary" (buttonClick)="onClick()">
  Click me
</kds-button-wrapper>
```

### 5. [@kds/blazor](packages/wrappers/blazor/)
Blazor wrappers with JavaScript Interop.

```razor
<KdsButton Size="lg" Hierarchy="primary" OnClick="@HandleClick">
    Click me
</KdsButton>
```

## Quick Start

### Installation

```bash
# Clone repo
git clone <repo-url>
cd kds-ai-preview

# Install dependencies
npm install

# Build all packages
npm run build --workspaces
```

### Usage in a Project

#### React

```bash
npm install @kds/react @kds/web-components
```

```tsx
import { Button } from '@kds/react';
import '@kds/web-components/tokens.css';

function App() {
  return (
    <Button size="md" hierarchy="primary">
      My Button
    </Button>
  );
}
```

#### Angular

```bash
npm install @kds/angular @kds/web-components
```

```typescript
import { KdsButtonModule } from '@kds/angular';

@NgModule({
  imports: [KdsButtonModule]
})
```

#### Blazor

```razor
@* Copy files from @kds/blazor to your project *@
<KdsButton Size="md" Hierarchy="primary">
    My Button
</KdsButton>
```

## Development

### Available Scripts

```bash
# Build all packages
npm run build --workspaces

# Build specific package
npm run build --workspace=@kds/tokens
npm run build --workspace=@kds/web-components
npm run build --workspace=@kds/react
npm run build --workspace=@kds/angular

# Validate Button contract
npm run validate:button

# Dev mode (web-components)
npm run dev --workspace=@kds/web-components
```

### Contract Validation

The system automatically validates that components implement 100% of the Figma properties:

```bash
tsx scripts/validate-button-contract.ts

# Output:
# VALIDATION PASSED
# SUCCESS: Component matches Figma contract (SSOT)
```

Integrated in the build process:
```json
"build": "npm run validate && vite build && tsc"
```

## Documentation

- **[ROADMAP.md](ROADMAP.md)** - Progress tracking and priorities
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Complete technical architecture
- **[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)** - Development guide and tooling
- **[docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md)** - Accessibility guide
- **[.figma/README.md](.figma/README.md)** - Figma extraction process
- **[packages/*/README.md](packages/)** - Per-package documentation

## Design System

### Philosophy: Button-First

Complete the **entire** flow with one component (Button) before scaling:
1. Extraction from Figma (MCP)
2. Contract validation
3. Design tokens (DTCG)
4. Web component (LIT)
5. Framework wrappers (React, Angular, Blazor)
6. Documentation

Button serves as the **template** to replicate with Input, Checkbox, etc.

### Components

| Component | Status | Figma | LIT | React | Angular | Blazor |
|-----------|--------|-------|-----|-------|---------|--------|
| Button | Done | Done | Done | Done | Done | Done |
| Checkbox | Done | Done | Done | Done | Done | Done |
| Toggle | Done | Done | Done | Done | Done | Done |
| Tooltip | Done | Done | Done | Done | Done | Done |
| Badge | Done | Done | Done | Done | Done | Done |
| Input | Planned | - | - | - | - | - |

### Design Tokens

**90+ tokens** extracted from Figma:
- **Colors:** Brand, Error, Gray, Success (35 values)
- **Typography:** Font family, sizes, weights, line-heights
- **Shadows:** Base shadows + focus rings
- **Component tokens:** Button-specific (heights, padding, border-radius)

Format: **DTCG** (Design Tokens Community Group)

## AI-First Approach

This project demonstrates:

- **100% AI-Generated:** All components generated by Claude Code
- **MCP Integration:** Model Context Protocol to connect with Figma Desktop
- **Contract Validation:** Automated design-to-code validation
- **Iterative Refinement:** Continuous feedback loop
- **Documentation as Code:** Automatically generated documentation

## Tech Stack

- **Web Components:** LIT 3.x
- **Build Tool:** Vite
- **Language:** TypeScript 5.x
- **Package Manager:** npm workspaces
- **Design Source:** Figma (Untitled UI v2.0 - FREE)
- **MCP:** Figma Desktop MCP Server (SSE transport)
- **Validation:** Custom contract validation scripts
- **Tokens:** DTCG format

## Metrics

- **Packages:** 5 (@kds/tokens, web-components, react, angular, blazor)
- **Components:** 5 (Button, Checkbox, Toggle, Tooltip, Badge) - 100% end-to-end complete
- **Tokens:** 90+ (colors, typography, shadows, component-specific)
- **Lines of code:** ~12,000+ (AI-generated)
- **Documentation:** ~8,500+ lines (ARCHITECTURE, METRICS, examples, interactive docs)
- **Supported frameworks:** 3 (React, Angular 20/21, Blazor)
- **Working examples:** 3 (one per framework)

See [METRICS.md](METRICS.md) for full analysis.

## Next Steps

### PoC Completed

**All technical phases finished:**
- ARCHITECTURE.md - Complete technical flow
- METRICS.md - Metrics and comparisons
- TOOLING-GUIDE.md - Complete tooling guide
- Working examples for 3 frameworks
- Button component end-to-end validated

### Post-PoC (Phase 6: Scaling)

1. **Button/Checkbox groups** - Grouping components (next)
2. **Avatars, Progress** - Visual components
3. **Dropdowns** - Complex component with positioning
4. **Input** - Complex form component (last)
5. **Visual Regression Testing** - Figma captures vs rendered
6. **CI/CD** - Full automation

See [ROADMAP.md](ROADMAP.md) for details.

## Author

**Kilian Sala**
Head of UX Design @ Kapsch
[kilian.sala@kapsch.net](mailto:kilian.sala@kapsch.net)

## License

UNLICENSED - Internal PoC for Kapsch

---

## Links

- [Figma Source: Untitled UI v2.0](https://www.figma.com/community/file/1020079203222518115/untitled-ui-free-figma-ui-kit-and-design-system)
- [LIT Documentation](https://lit.dev/)
- [DTCG Specification](https://tr.designtokens.org/format/)
- [Model Context Protocol](https://modelcontextprotocol.io)

---

*This project is a PoC/Preview. It demonstrates viability and workflow, not intended for direct production use.*
