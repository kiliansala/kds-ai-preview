# @kds/tokens

Design tokens extracted from Untitled UI (Figma) for the Kapsch Design System.

## 🎨 What are Design Tokens?

Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes. They provide a single source of truth for design decisions across platforms and frameworks.

## 📦 Tokens Included

### Button Tokens

Extracted from: Untitled UI - FREE Figma UI kit v2.0
Component ID: `1038:34411` (1,056 variantes)

**Variants:**
- **Size**: sm, md, lg, xl
- **Hierarchy**: Primary, Secondary (color/gray), Tertiary (color/gray), Link (color/gray)
- **Icon**: None, Leading, Trailing, Dot, Only
- **Destructive**: false, true
- **State**: Default, Hover, Focused, Disabled

**Properties:**
- Corner radius: 8px
- Typography: Inter, 600 weight, 14-16px
- Padding: Variable by size (8-14px vertical, 12-20px horizontal)
- Height: 36-48px (by size)
- Gap: 8px (between icon and text)

## 🔧 Usage

### Import Tokens (TypeScript/JavaScript)

```typescript
import { button } from '@kds/tokens';

// Access button properties
console.log(button.properties.cornerRadius.$value); // "8px"
console.log(button.properties.typography.fontFamily.$value); // "Inter"
```

### Use as JSON

```javascript
import buttonTokens from '@kds/tokens/src/button-tokens.json';
```

## 📁 Files

```
packages/tokens/
├── src/
│   ├── button-tokens.json    # Button design tokens
│   └── index.ts              # TypeScript exports
├── package.json
└── README.md
```

## 🛠️ Token Structure

Tokens follow the [Design Tokens Community Group](https://tr.designtokens.org/format/) specification:

```json
{
  "$schema": "https://tr.designtokens.org/format/v1/spec",
  "button": {
    "$type": "component",
    "variants": { ... },
    "properties": { ... },
    "metadata": { ... }
  }
}
```

## 🔄 Updating Tokens

To extract updated tokens from Figma:

1. Ensure Figma connection is configured (`.figma/.env`)
2. Run extraction script:
   ```bash
   npm run tokens:extract
   ```

## 📊 Token Details

### Size Variants

| Size | Height | Padding X | Padding Y | Font Size |
|------|--------|-----------|-----------|-----------|
| sm   | 36px   | 12px      | 8px       | 14px      |
| md   | 40px   | 16px      | 10px      | 14px      |
| lg   | 44px   | 18px      | 12px      | 16px      |
| xl   | 48px   | 20px      | 14px      | 16px      |

### Hierarchy Variants

1. **Primary** - Main call-to-action
2. **Secondary color** - Secondary actions with color
3. **Secondary gray** - Secondary actions, neutral
4. **Tertiary color** - Tertiary actions with color
5. **Tertiary gray** - Tertiary actions, neutral
6. **Link color** - Link-style with color
7. **Link gray** - Link-style, neutral

### Icon Configurations

- **None** - No icon
- **Leading** - Icon before text
- **Trailing** - Icon after text
- **Dot** - Dot indicator
- **Only** - Icon only, no text

### States

- **Default** - Normal state
- **Hover** - Mouse hover
- **Focused** - Keyboard focus
- **Disabled** - Inactive state

## 🎯 Next Steps

After tokens are extracted:
1. ✅ Tokens extracted from Figma
2. ⏭️ Generate CSS custom properties
3. ⏭️ Create web component using these tokens
4. ⏭️ Generate framework wrappers

## 📝 Metadata

Each token file includes metadata about its source:

```json
{
  "metadata": {
    "figmaFileId": "CICp1MWc31lkvjX3jYo1rj",
    "figmaNodeId": "1038:34411",
    "extractedAt": "2026-02-10",
    "totalVariants": 1056,
    "source": "Untitled UI - FREE Figma UI kit v2.0"
  }
}
```

---

**Generated with AI** 🤖 using Claude Code
