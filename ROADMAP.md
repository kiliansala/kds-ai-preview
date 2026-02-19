# KDS AI Preview - Roadmap

> Detailed progress tracking for the project

## Current Status

**Last updated**: 2026-02-18

**Status**: **PHASE 6 IN PROGRESS** - PoC completed (Phases 1-5). Scaling to more components using repeatable workflow.

**Completed components**:
- **Button** (100%) - Implemented end-to-end with wrappers and full documentation
- **Checkbox** (100%) - Implemented end-to-end with wrappers and full documentation
- **Toggle** (100%) - Implemented end-to-end with wrappers and full documentation
- **Tooltip** (100%) - Implemented end-to-end with wrappers and full documentation
- **Badge** (100%) - Implemented end-to-end with 13 colors, 8 icon variants, wrappers and full documentation
- **Button Group** (100%) - Implemented end-to-end with wrappers and full documentation

**Key achievements**:
- Button, Checkbox, Toggle, Tooltip, Badge, and Button Group from Figma through to wrappers (React, Angular, Blazor)
- Figma-to-Code validation system working (100% fidelity)
- Repeatable workflow validated and completed across 6 components (8/8 tasks)
- 90+ design tokens extracted and implemented (DTCG)
- Complete interactive documentation for Button, Checkbox, Toggle, Tooltip, Badge, and Button Group
- Working examples for 3 frameworks
- Angular wrappers updated to v20/v21
- ~12,000+ lines of AI-generated code
- ~8,500+ lines of documentation
- 64 automated tests for Badge (contract, a11y, component)

**Next step**: Implement Checkbox Groups (reuses Checkbox, ~5-7h).

### Completed

#### Phase 0: Initial Setup
- [x] Project structure with npm workspaces
- [x] Package configuration (tokens, web-components, wrappers)
- [x] TypeScript and Vite setup
- [x] Build tools configuration

#### Phase 1: Foundation & MCP Integration
- [x] **Figma MCP Server configured** (SSE transport in `~/.claude.json`)
- [x] **Connection verified** with Figma Desktop MCP (port 3845)
- [x] **MCP tools available**: `get_design_context`, `get_variable_defs`, `get_screenshot`, `get_code_connect_map`
- [x] **Button component extracted** from Untitled UI via MCP
- [x] **Button component in LIT** created (`packages/web-components/src/components/kds-button.ts`)
- [x] **Colors updated** from Figma SSOT (Brand/600: #7F56D9, Error/600: #D92D20, etc.)
- [x] **Build working** with no TypeScript errors
- [x] **Figma variables documented** (MCP extraction completed)

#### Phase 1.5: Figma-to-Code Validation System - COMPLETED
- [x] **Step 1**: Extract Button properties from Figma via `get_design_context` -> `.figma/button.figma-contract.json`
- [x] **Step 2**: Generate TypeScript Interface from Figma properties -> `.figma/button.figma-contract.ts`
- [x] **Step 3**: Create validation script comparing Figma vs code -> `scripts/validate-button-contract.ts`
- [x] **Step 4**: Implement validation in build process -> Integrated in `packages/web-components/package.json`
- [x] **Step 5**: Create reusable tooling -> `scripts/extract-figma-contract.ts`, `scripts/validate-component-contract.ts`, `.figma/TOOLING-GUIDE.md`
- [x] **Current Button validation** against Figma contract -> PASSED

**Result**: Validation system working. Button implements 100% of the design properties from Figma (SSOT).

#### Phase 2: Design Tokens System (Button) - COMPLETED
- [x] **Extract Figma variables** via `get_variable_defs` -> Colors, Typography, Shadows extracted
- [x] **Generate tokens.json** in DTCG format -> `packages/tokens/src/tokens.json` (6KB, 90+ tokens)
- [x] **Generate tokens.css** with CSS custom properties -> `packages/tokens/src/tokens.css` (3KB)
- [x] **Create index.ts** for token exports -> `packages/tokens/src/index.ts` with exports by category
- [x] **Build tokens package** -> local tsconfig.json, dist/ with JS/TS/CSS
- [x] **Refactor Button** to consume tokens -> CSS custom properties using `var(--kds-*)`
- [x] **Validation integrated** -> Build + validation passing

**Result**: Complete token system. Button consumes tokens from Figma (colors, typography, spacing, shadows). DTCG-compliant.

#### Phase 3: Framework Wrappers (Button) - COMPLETED
- [x] **React wrapper** -> Button.tsx with forwardRef, event handling, complete types
- [x] **Angular wrapper** -> Standalone component + Module, CUSTOM_ELEMENTS_SCHEMA, ViewChild (updated to Angular 20/21)
- [x] **Blazor wrapper** -> KdsButton.razor with JS interop, EventCallback, IAsyncDisposable
- [x] **Documentation** -> Complete README for each framework with examples
- [x] **Build verification** -> All wrappers working

**Result**: Button accessible in React, Angular, and Blazor with idiomatic APIs per framework.

#### Phase 4: Documentation & Tooling (Button) - COMPLETED
- [x] **ARCHITECTURE.md** -> Complete Figma-to-Code flow documentation (500+ lines)
- [x] **README.md** -> Updated project overview with current status
- [x] **TOOLING-GUIDE.md** -> Complete guide for scripts, tooling, and workflows
- [x] **METRICS.md** -> Metrics summary, achievements, and comparisons
- [x] **React examples** -> Complete App.tsx with all Button variants
- [x] **Angular examples** -> Standalone component with template and styles
- [x] **Blazor examples** -> App.razor with C# code-behind
- [x] **Example documentation** -> README per framework with full setup

**Result**: Complete end-to-end documentation. Working examples for all 3 frameworks. Metrics and achievements documented.

#### Phase 5: Presentation & Demo - COMPLETED
- [x] Working end-to-end demo with Button -> Examples in `examples/{react,angular,blazor}/`
- [x] Comparison metrics (manual vs AI-generated) -> METRICS.md completed
- [x] Process documentation for stakeholders -> ARCHITECTURE.md completed
- [x] Next steps proposal for scaling -> Documented in METRICS.md and ROADMAP.md
- [x] **Interactive live documentation** -> `packages/web-components/index.html` with full playground

**Result**: Complete interactive documentation accessible via `npm run dev --workspace=@kds/web-components`. Includes:
- Overview with Quick Start and interactive Playground
- Variants (Sizes, Hierarchies, States, Icons) with live examples
- Documented Design Tokens with swatches and values
- Usage with tabs for Web Component, React, Angular, Blazor (copyable code)
- Complete API (Properties, Events, Slots, CSS Custom Properties)

**Post-PoC improvements completed**:
- [x] **A11y validation system** -> `scripts/validate-button-a11y.ts` working
- [x] **ACCESSIBILITY.md** -> Complete accessibility guide (WCAG 2.1 AA)
- [x] **Validation integrated** -> `npm run validate:all` runs contract + a11y
- [x] **A11y documentation** -> Checklist, tools, and best practices

**Optional tasks** (not critical for PoC):
- [ ] Storybook setup (deferred for now, interactive docs cover needs)
- [ ] Unit tests for `kds-button`
- [ ] Integration tests for wrappers
- [ ] Basic CI/CD
- [ ] Executive presentation of the PoC (PowerPoint/Slides)

### In Progress

#### Phase 6: Scaling to More Components (Post-PoC)
**Status**: In progress - Button, Checkbox, Toggle, and Tooltip completed

**Repeatable Workflow** (validated with Button, Checkbox, Toggle, and Tooltip):

Each component follows this 8-step process:

1. **Figma Extraction** (via MCP)
   - Run `get_design_context` to get properties
   - Capture design tokens (colors, typography, spacing)
   - Document nodeId and metadata
   - **Time**: ~5 minutes

2. **Design Contracts**
   - Create `.figma/{component}.figma-contract.json` with schema
   - Create `.figma/{component}.figma-contract.ts` with TypeScript types
   - Document required properties, optional ones, defaults
   - **Time**: ~20 minutes

3. **LIT Implementation**
   - Create `packages/web-components/src/components/kds-{component}.ts`
   - Implement properties, states, events
   - Apply styles with CSS tokens
   - Shadow DOM + full ARIA support
   - **Time**: ~1-2 hours

4. **Contract Validation**
   - Create `scripts/validate-{component}-contract.ts`
   - Run validation: component vs Figma contract
   - Verify 100% fidelity
   - **Time**: ~30 minutes

5. **A11y Validation**
   - Create `scripts/validate-{component}-a11y.ts`
   - Verify WCAG 2.1 AA compliance
   - Validate ARIA, keyboard, contrast, touch targets
   - **Time**: ~30 minutes

6. **Framework Wrappers**
   - React: `src/react/{Component}.tsx` with `@lit/react`
   - Angular: `src/angular/{component}.component.ts` standalone
   - Blazor: `src/blazor/Kds{Component}.razor` with JS interop
   - **Time**: ~30-45 minutes

7. **Interactive Documentation**
   - Update `packages/web-components/index.html`
   - Playground with controls for all properties
   - Tabs: Variants, Usage, API, Accessibility
   - **Time**: ~1-2 hours

8. **Testing and Final Validation**
   - Run validations (contract + a11y)
   - Manual browser testing
   - Screen reader verification
   - **Time**: ~30-45 minutes

**Total per component**: ~5-7 hours

---

### Pending Components

#### Checkbox (100% - COMPLETED)
**Status**: Complete end-to-end implementation

- [x] Figma extraction (nodeId: 1097:63652)
- [x] Contracts created and updated with real data
- [x] LIT implementation (`kds-checkbox.ts`) - 414 lines
- [x] Contract validation PASSED
- [x] A11y validation PASSED (1 warning: manual contrast check)
- [x] Validation execution
- [x] **Wrappers** (React, Angular, Blazor) COMPLETED
- [x] **Interactive documentation** in index.html COMPLETED

**Files created**: 11 files, ~2,200+ lines of code

---

#### BASE COMPONENTS (Untitled UI v2.0)

##### Buttons
**Status**: Completed 100%
- [x] Button component end-to-end
- [x] Wrappers for 3 frameworks
- [x] Complete interactive documentation

##### Checkboxes (100%)
**Status**: Completed
- [x] Checkbox component implemented
- [x] Validations passed
- [x] Wrappers completed
- [x] Complete interactive documentation

##### Checkbox groups
**Dependencies**: Requires completed Checkbox
**Estimate**: 5-7 hours
- [ ] Figma extraction
- [ ] Contracts
- [ ] LIT implementation
- [ ] Validations
- [ ] Wrappers
- [ ] Documentation

##### Button groups (100% - COMPLETED)
**Status**: Complete end-to-end implementation
**Dependencies**: Uses existing Button
- [x] Figma extraction (nodeId: 1046:10170)
- [x] Contracts created (container + item, 4 icon variants)
- [x] LIT implementation (`kds-button-group.ts`, `kds-button-group-item`)
- [x] Contract validation PASSED
- [x] A11y validation PASSED (1 warning: disabled opacity contrast)
- [x] Wrappers (React, Angular, Blazor)
- [x] Complete interactive documentation in index.html

##### Badges (100%)
**Status**: Completed
- [x] Figma extraction (nodeId: 1046:3819)
- [x] Contracts created (13 colors, 8 icon variants)
- [x] LIT implementation (`kds-badge.ts`)
- [x] Validations (contract + a11y) PASSED
- [x] Wrappers (React, Angular, Blazor)
- [x] Complete interactive documentation

##### Inputs
**Estimate**: 6-8 hours (most complex component)
**Notes**: Includes states, validation, placeholders, types
- [ ] Figma extraction
- [ ] Contracts
- [ ] LIT implementation
- [ ] Validations
- [ ] Wrappers
- [ ] Documentation

##### Dropdowns
**Estimate**: 7-9 hours (complex component)
**Notes**: Includes positioning, keyboard navigation, search
- [ ] Figma extraction
- [ ] Contracts
- [ ] LIT implementation
- [ ] Validations
- [ ] Wrappers
- [ ] Documentation

##### Toggles (100%)
**Status**: Completed
- [x] Figma extraction (nodeId: 1102:4208)
- [x] Contracts created
- [x] LIT implementation (`kds-toggle.ts`)
- [x] Validations (contract + a11y) PASSED
- [x] Wrappers (React, Angular, Blazor)
- [x] Complete interactive documentation

##### Avatars
**Estimate**: 4-5 hours
**Notes**: Includes image, initials, states (online/offline)
- [ ] Figma extraction
- [ ] Contracts
- [ ] LIT implementation
- [ ] Validations
- [ ] Wrappers
- [ ] Documentation

##### Tooltips (100%)
**Status**: Completed
- [x] Figma extraction (nodeId: 1052:490)
- [x] Contracts created
- [x] LIT implementation (`kds-tooltip.ts`)
- [x] Validations (contract + a11y)
- [x] Wrappers (React, Angular, Blazor)
- [x] Complete interactive documentation

##### Progress indicators
**Estimate**: 5-6 hours
**Notes**: Linear, circular, determinate/indeterminate
- [ ] Figma extraction
- [ ] Contracts
- [ ] LIT implementation
- [ ] Validations
- [ ] Wrappers
- [ ] Documentation

##### Tags (Locked in Figma)
**Status**: Pending unlock in Figma
- [ ] Request component access

##### Text editors (Locked in Figma)
**Status**: Pending unlock in Figma
- [ ] Request component access

---

**Total Base Components**: 13 components
- Completed: 6 (Button, Checkbox, Toggle, Tooltip, Badge, Button Group)
- In progress: 0
- Pending: 5 components
- Blocked: 2 components (locked in Figma)

**Total estimate**: ~38-57 hours to complete the 6 remaining available components

---

### Phase 6 Priorities

**Short term** (1-2 weeks):
1. Checkbox completed
2. Toggle completed
3. Badge completed
4. Button Groups completed

**Medium term** (2-4 weeks):
5. Implement Checkbox groups (reuses Checkbox) <- **NEXT**
6. Implement Avatars (~4-5 hours)
7. Implement Progress indicators (~5-6 hours)
8. Implement Dropdowns (complex, ~7-9 hours)

**Long term** (1-2 months):
9. Implement **Input** (large/complex component, ~6-8 hours) - **Saved for last**
10. Request unlock for Tags and Text editors

## Important Technical Decisions

### Adopted

1. **MCP Only**: No Figma REST API, MCP servers only
2. **Figma SSOT**: Figma is the single source of truth for design values
3. **SSE Transport**: Figma Desktop MCP uses `type: "sse"` in configuration
4. **LIT 3.x**: Framework for web components
5. **TypeScript Strict**: Full type safety
6. **DTCG Format**: Design Tokens Community Group spec for tokens

### Pending

1. Framework wrapper approach (HOC vs directives vs components)
2. Testing strategy (unit vs integration vs visual regression)
3. Storybook vs custom documentation site
4. Versioning strategy for packages

## Progress Metrics

**Phase 6 - Component Scaling**:
- **Components completed**: 6/13 (Button, Checkbox, Toggle, Tooltip, Badge, Button Group)
- **Components in progress**: 0/13
- **Components pending**: 5/13
- **Components blocked**: 2/13 (locked in Figma)
- **Total Phase 6 progress**: ~46% (6/13 components)

**General**:
- **Frameworks with wrappers**: 3/3 (React, Angular, Blazor)
- **Tokens formalized**: 100% (90+ tokens in DTCG format)
- **Static documentation**: 100% (ARCHITECTURE, METRICS, examples)
- **Live documentation**: 6/13 components (Button, Checkbox, Toggle, Tooltip, Badge, Button Group in index.html)
- **Phases 1-5**: COMPLETED
- **Repeatable workflow**: VALIDATED (Button + Checkbox + Toggle + Tooltip + Badge)
- **Tests**: Badge 64/64 PASSED

**Generated code**:
- **Total lines of code**: ~12,000+ lines
- **Total lines of documentation**: ~8,500+ lines
- **Files created**: 80+ files

## Implementation Strategy

### Phases 1-5 (PoC): Complete Button End-to-End

**Philosophy**: Complete the ENTIRE flow with one component before scaling.

Button served as the **model/template** to establish the workflow.

### Phase 6 (Scaling): Repeatable Workflow

**Philosophy**: Replicate validated 8-step process for each component.

**Priority order**:
1. **Simple components first** (Checkbox, Toggle, Badge) - validate workflow
2. **Form components** (Input, Dropdown) - critical functionality
3. **Grouping components** (Button groups, Checkbox groups) - reuse base components
4. **Visual components** (Avatar, Progress) - improve UX
5. **Complex components** (Tooltip, Text editor) - require more time

**Quality philosophy**:
- 100% Figma fidelity (contract validation)
- WCAG 2.1 AA compliance (a11y validation)
- Idiomatic wrappers per framework
- Complete interactive documentation

## Next Steps

### Immediate (This Week)

1. ~~Implement Toggle Component~~ - COMPLETED
2. ~~Implement Badge~~ - COMPLETED (64 tests, 13 colors, 8 icon variants)
3. ~~Implement Button Groups~~ - COMPLETED

4. **Implement Checkbox Groups** <- **NEXT**
   - Reuses existing Checkbox
   - **Estimate**: ~5-7 hours

### Medium Term (1 Month)

4. **Checkbox Groups**
   - Reuses existing Checkbox
   - **Estimate**: ~5-7 hours

5. **Avatars**
   - Visual component with image/initials
   - **Estimate**: ~4-5 hours

6. **Progress Indicators**
   - Linear and circular, determinate/indeterminate
   - **Estimate**: ~5-6 hours

7. **Dropdowns**
   - Complex component with positioning, keyboard navigation
   - **Estimate**: ~7-9 hours

### Long Term (2-3 Months)

8. **Input Component** - **SAVED FOR LAST**
   - Large and complex component (multiple types, validation, states)
   - **Estimate**: ~6-8 hours
   - **Reason**: High complexity, better to implement simpler components first

9. **Blocked components**
   - Request unlock for Tags
   - Request unlock for Text editors

### Optional Infrastructure

- [ ] Storybook for additional documentation
- [ ] Automated tests (unit + integration)
- [ ] CI/CD for automated builds and validations
- [ ] Visual regression testing

## Mitigated Risks

- ~~**No centralized tokens**~~: Resolved - Complete DTCG token system with CSS custom properties
- ~~**Framework wrappers not validated**~~: Resolved - 3 wrappers working (React, Angular, Blazor)
- ~~**No design-code validation**~~: Resolved - Contract system validating 100% fidelity

## Remaining Risks

- **No automated tests**: Risk of regressions when scaling (mitigation: contract validation in build)

## References

- **Documentation**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md), [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md)
- **Figma Extraction**: [.figma/README.md](.figma/README.md)
- **Figma Source**: Untitled UI v2.0 (FREE)
- **Design Tokens Spec**: https://design-tokens.github.io/community-group/format/
- **LIT Documentation**: https://lit.dev/

---

*Last revision: 2026-02-18 | Maintained by: Kilian Sala*
