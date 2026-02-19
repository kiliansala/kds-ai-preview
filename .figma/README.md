# Component Extraction from Figma

> Process for extracting component properties from Figma via Claude CLI + MCP

## Extraction Process

**IMPORTANT**: Extraction is performed using **Claude CLI** with **Figma Desktop MCP Server**, NOT directly in Claude Code.

### Step 1: Prepare Figma Desktop

1. Open Figma Desktop with the **"Untitled UI v2.0"** file (fileKey: `CICp1MWc31lkvjX3jYo1rj`)
2. Navigate to the base components page
3. Enable **Dev Mode** in Figma
4. **Select the component** you want to extract (must be in the foreground/selected)

### Step 2: Extract in Claude CLI

With the component selected, run in Claude CLI:

```
Extract the selected Figma component using get_design_context.
Give me the complete output with all component properties:
- NodeId
- Properties (size, state, type, etc.)
- Possible values for each property
- Default values
- Measurements and spacing
- Colors and design tokens
```

### Step 3: Pass Output to Claude Code

Copy the complete output and paste it into Claude Code to generate the contract files.

---

## Known Component NodeIds

| Component | NodeId | Status |
|-----------|--------|--------|
| Button | `1038:34411` | Completed |
| Checkbox | `1097:63652` | Completed |
| Toggle | `1102:4208` | Extracted |

---

## Full Example

```bash
# 1. In Figma Desktop:
#    - Open "Untitled UI v2.0"
#    - Enable Dev Mode
#    - Select the Toggle component

# 2. In Claude CLI:
> "Extract the selected Figma component using get_design_context.
   Give me the complete output with nodeId, properties, values, measurements and tokens"

# 3. Copy output and pass it to Claude Code
```

---

## Generated Files

After extraction, the following files are created:

### 1. JSON Contract
**`.figma/{component}.figma-contract.json`**

Schema with all component properties.

**Template**: [button.figma-contract.json](button.figma-contract.json)

### 2. TypeScript Contract
**`.figma/{component}.figma-contract.ts`**

TypeScript types and constant for validation.

**Template**: [button.figma-contract.ts](button.figma-contract.ts)

---

## Full Workflow

1. **Figma Extraction** (this process) -> Get properties
2. **Create contracts** (.json + .ts) -> Define schema
3. **LIT Implementation** -> Web component
4. **Contract validation** -> Verify 100% fidelity
5. **A11y validation** -> WCAG 2.1 AA compliance
6. **Framework wrappers** -> React, Angular, Blazor
7. **Documentation** -> Interactive index.html
8. **Final testing** -> Validations + manual

See details in [../docs/DEVELOPMENT.md](../docs/DEVELOPMENT.md)

---

## References

- **Full workflow**: [docs/DEVELOPMENT.md](../docs/DEVELOPMENT.md)
- **Templates**: [button.figma-contract.json](button.figma-contract.json), [button.figma-contract.ts](button.figma-contract.ts)
- **Progress**: [../ROADMAP.md](../ROADMAP.md)

---

*Last updated: 2026-02-11*
