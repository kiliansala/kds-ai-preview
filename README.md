# KDS AI Preview

> **Kapsch Design System** - AI-Generated Design System Proof of Concept

[![Built with LIT](https://img.shields.io/badge/Built%20with-LIT-blue)](https://lit.dev/)
[![Figma SSOT](https://img.shields.io/badge/Figma-SSOT-green)](https://www.figma.com/)
[![MCP Integration](https://img.shields.io/badge/MCP-Integrated-purple)](https://modelcontextprotocol.io)

Un Proof of Concept que demuestra cómo construir un Design System completamente automatizado usando **Figma como Single Source of Truth**, **Model Context Protocol (MCP)** para extracción, **LIT** para web components, y **wrappers** para React, Angular y Blazor.

## 🎯 Visión

Crear un Design System donde:
- **Figma** es la única fuente de verdad (SSOT)
- La **extracción** es automática via MCP
- La **validación** garantiza 100% fidelidad diseño ↔ código
- Los **tokens** siguen el estándar DTCG
- Los **componentes** son framework-agnostic (LIT)
- Los **wrappers** ofrecen APIs idiomáticas por framework

## ✨ Estado Actual

### ✅ PoC Completado + 🔄 Fase 6 en Progreso

| Fase | Descripción | Estado |
|------|-------------|--------|
| **Fase 1** | Foundation & MCP Integration | ✅ Completo |
| **Fase 1.5** | Sistema de Validación Figma ↔ Código | ✅ Completo |
| **Fase 2** | Design Tokens System (DTCG) | ✅ Completo |
| **Fase 3** | Framework Wrappers (React + Angular + Blazor) | ✅ Completo |
| **Fase 4** | Documentation & Tooling | ✅ Completo |
| **Fase 5** | Presentation & Demo | ✅ Completo |
| **Fase 6** | Escalado a Más Componentes | 🔄 En progreso (31%) |

**Componentes:**
- ✅ **Button** (100%) - Completado end-to-end con documentación interactiva
- ✅ **Checkbox** (100%) - Completado end-to-end con documentación interactiva
- ✅ **Toggle** (100%) - Completado end-to-end con documentación interactiva
- ✅ **Tooltip** (100%) - Completado end-to-end con documentación interactiva
- ⏳ **7 componentes base** pendientes (Input, Badge, Avatar, etc.)

**🎉 PoC finalizado** - Sistema validado y documentado. **Workflow repetible** completado en 4 componentes.

### 🚀 Ver Documentación Interactiva

```bash
npm run dev --workspace=@kds/web-components
# Abre http://localhost:5173
```

La documentación interactiva incluye:
- 🎮 Playground con controles en vivo para Button, Checkbox, Toggle y Tooltip
- 📦 Todos los variants de cada componente
- 🎨 Design tokens documentados
- 💻 Código copiable para Web Component, React, Angular, Blazor
- 📚 API completa con propiedades, eventos y accesibilidad
- ♿ Documentación WCAG 2.1 AA compliance

### 📋 Próximos Pasos

**Inmediato**:
- 🎯 Implementar **Badge** (componente simple, visual, ~4-5 horas)
- Implementar Button groups (reutiliza Button existente)
- Implementar Checkbox groups (reutiliza Checkbox existente)

**Fase 6 - Escalado** (en progreso):
- 13 componentes base de Untitled UI (4 completados, 7 pendientes)
- Workflow repetible de 8 pasos (~5-7 horas por componente)
- Prioridad: Badge, Button groups, Checkbox groups, Avatars, Progress, Input (final)

Ver [ROADMAP.md](ROADMAP.md) para tracking detallado y lista completa.

## 🏗️ Arquitectura

```
Figma (Untitled UI v2.0)
    ↓ MCP (get_design_context, get_variable_defs)
Design Contracts (.figma/*.json, *.ts)
    ↓ Contract Validation (scripts/)
Design Tokens (@kds/tokens)
    ↓ DTCG format (tokens.json, tokens.css)
Web Components (@kds/web-components)
    ↓ LIT 3.x (kds-button.ts)
Framework Wrappers
    ├─→ React (@kds/react)
    ├─→ Angular (@kds/angular)
    └─→ Blazor (@kds/blazor)
```

**Ver [ARCHITECTURE.md](ARCHITECTURE.md) para documentación completa del flujo.**

## 📦 Packages

### 1. [@kds/tokens](packages/tokens/)
Design tokens extraídos de Figma en formato DTCG.

```bash
npm install @kds/tokens
```

```typescript
import { colors, typography, shadows } from '@kds/tokens';
import '@kds/tokens/css';
```

**Output:** `tokens.json` (6KB), `tokens.css` (3KB), TypeScript exports

### 2. [@kds/web-components](packages/web-components/)
Web components construidos con LIT, validados contra contratos Figma.

```bash
npm install @kds/web-components
```

```typescript
import { KdsButton } from '@kds/web-components';
import '@kds/web-components/tokens.css';
```

**Componentes disponibles:** `<kds-button>`, `<kds-checkbox>`, `<kds-toggle>`, `<kds-tooltip>`

### 3. [@kds/react](packages/wrappers/react/)
React wrappers para web components.

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
Angular wrappers (Standalone Components). Compatible con Angular 20/21.

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
Blazor wrappers con JavaScript Interop.

```razor
<KdsButton Size="lg" Hierarchy="primary" OnClick="@HandleClick">
    Click me
</KdsButton>
```

## 🚀 Quick Start

### Instalación

```bash
# Clonar repo
git clone <repo-url>
cd kds-ai-preview

# Instalar dependencias
npm install

# Build todos los packages
npm run build --workspaces
```

### Uso en un Proyecto

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

## 🔧 Development

### Scripts Disponibles

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

### Validación de Contratos

El sistema valida automáticamente que los componentes implementan 100% las propiedades de Figma:

```bash
tsx scripts/validate-button-contract.ts

# Output:
# ✅ VALIDATION PASSED
# SUCCESS: Component matches Figma contract (SSOT) ✓
```

Integrado en build process:
```json
"build": "npm run validate && vite build && tsc"
```

## 📚 Documentación

- **[ROADMAP.md](ROADMAP.md)** - Tracking de progreso y prioridades
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Arquitectura técnica completa
- **[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)** - Guía de desarrollo y tooling
- **[docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md)** - Guía de accesibilidad
- **[.figma/README.md](.figma/README.md)** - Proceso de extracción desde Figma
- **[packages/*/README.md](packages/)** - Documentación por package

## 🎨 Design System

### Filosofía: Button-First

Completar **TODO** el flujo con un componente (Button) antes de escalar:
1. ✅ Extracción desde Figma (MCP)
2. ✅ Contract validation
3. ✅ Design tokens (DTCG)
4. ✅ Web component (LIT)
5. ✅ Framework wrappers (React, Angular, Blazor)
6. 🚧 Documentation

Button sirve como **template** para replicar con Input, Checkbox, etc.

### Componentes

| Component | Status | Figma | LIT | React | Angular | Blazor |
|-----------|--------|-------|-----|-------|---------|--------|
| Button | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Checkbox | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Toggle | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tooltip | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Badge | 🎯 | - | - | - | - | - |
| Input | 📋 | - | - | - | - | - |

### Design Tokens

**90+ tokens** extraídos de Figma:
- **Colors:** Brand, Error, Gray, Success (35 valores)
- **Typography:** Font family, sizes, weights, line-heights
- **Shadows:** Base shadows + focus rings
- **Component tokens:** Button-specific (heights, padding, border-radius)

Formato: **DTCG** (Design Tokens Community Group)

## 🤖 AI-First Approach

Este proyecto demuestra:

- **100% AI-Generated:** Todos los componentes generados por Claude Code
- **MCP Integration:** Model Context Protocol para conectar con Figma Desktop
- **Contract Validation:** Validación automática diseño ↔ código
- **Iterative Refinement:** Ciclo de feedback continuo
- **Documentation as Code:** Documentación generada automáticamente

## 🛠️ Tech Stack

- **Web Components:** LIT 3.x
- **Build Tool:** Vite
- **Language:** TypeScript 5.x
- **Package Manager:** npm workspaces
- **Design Source:** Figma (Untitled UI v2.0 - FREE)
- **MCP:** Figma Desktop MCP Server (SSE transport)
- **Validation:** Custom contract validation scripts
- **Tokens:** DTCG format

## 📊 Métricas

- **Packages:** 5 (@kds/tokens, web-components, react, angular, blazor)
- **Componentes:** 4 (Button, Checkbox, Toggle, Tooltip) - ✅ 100% end-to-end completos
- **Tokens:** 90+ (colors, typography, shadows, component-specific)
- **Líneas de código:** ~10,500+ (generado por AI)
- **Documentación:** ~7,500+ líneas (ARCHITECTURE, METRICS, ejemplos, docs interactivas)
- **Frameworks soportados:** 3 ✅ (React, Angular 20/21, Blazor)
- **Ejemplos funcionales:** 3 ✅ (uno por framework)

Ver [METRICS.md](METRICS.md) para análisis completo.

## 🎯 Próximos Pasos

### ✅ PoC Completado

**Todas las fases técnicas finalizadas:**
- ✅ ARCHITECTURE.md - Flujo técnico completo
- ✅ METRICS.md - Métricas y comparativas
- ✅ TOOLING-GUIDE.md - Guía completa de herramientas
- ✅ Ejemplos funcionales para 3 frameworks
- ✅ Button component end-to-end validado

### Post-PoC (Fase 6: Escalado)

1. **Badge** - Componente visual simple (proximo)
2. **Button/Checkbox groups** - Componentes de agrupacion
3. **Avatars, Progress** - Componentes visuales
4. **Input** - Componente complejo de formulario (final)
5. **Visual Regression Testing** - Capturas Figma vs rendered
6. **CI/CD** - Automatización completa

Ver [ROADMAP.md](ROADMAP.md) para detalles.

## 👥 Autor

**Kilian Sala**
Head of UX Design @ Kapsch
[kilian.sala@kapsch.net](mailto:kilian.sala@kapsch.net)

## 📄 License

UNLICENSED - Internal PoC for Kapsch

---

## 🔗 Links

- [Figma Source: Untitled UI v2.0](https://www.figma.com/community/file/1020079203222518115/untitled-ui-free-figma-ui-kit-and-design-system)
- [LIT Documentation](https://lit.dev/)
- [DTCG Specification](https://tr.designtokens.org/format/)
- [Model Context Protocol](https://modelcontextprotocol.io)

---

*Este proyecto es un PoC/Preview. Demuestra viabilidad y flujo de trabajo, no está destinado para producción directa.*
