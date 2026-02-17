# @kds/react

React wrappers for Kapsch Design System web components.

## Installation

```bash
npm install @kds/react @kds/web-components
```

## Usage

### Import Design Tokens

First, import the design tokens CSS in your app's entry point:

```tsx
// App.tsx or index.tsx
import '@kds/web-components/tokens.css';
```

### Button Component

```tsx
import { Button } from '@kds/react';

function App() {
  return (
    <div>
      {/* Primary button */}
      <Button
        size="md"
        hierarchy="primary"
        onClick={() => console.log('Clicked!')}
      >
        Click me
      </Button>

      {/* Secondary button with icon */}
      <Button
        size="lg"
        hierarchy="secondary-color"
        iconPosition="leading"
      >
        <svg slot="icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
        </svg>
        Add Item
      </Button>

      {/* Destructive button */}
      <Button
        destructive
        hierarchy="primary"
        onClick={() => console.log('Delete!')}
      >
        Delete
      </Button>

      {/* Disabled button */}
      <Button disabled>
        Disabled
      </Button>
    </div>
  );
}
```

## Props

### Button

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Button size |
| `hierarchy` | `'primary' \| 'secondary-color' \| 'secondary-gray' \| 'tertiary-color' \| 'tertiary-gray' \| 'link-color' \| 'link-gray'` | `'primary'` | Visual hierarchy/style variant |
| `iconPosition` | `'none' \| 'leading' \| 'trailing' \| 'dot' \| 'only'` | `'none'` | Icon position relative to text |
| `destructive` | `boolean` | `false` | Destructive/danger variant |
| `disabled` | `boolean` | `false` | Disabled state |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Button type attribute |
| `ariaLabel` | `string` | - | ARIA label for icon-only buttons |
| `onClick` | `(event: CustomEvent) => void` | - | Click event handler |
| `className` | `string` | - | Additional CSS classes |
| `style` | `React.CSSProperties` | - | Additional styles |

## Examples

### Form Submit Button

```tsx
<form onSubmit={handleSubmit}>
  <Button type="submit" size="lg" hierarchy="primary">
    Submit
  </Button>
</form>
```

### Icon-only Button

```tsx
<Button
  size="sm"
  hierarchy="tertiary-gray"
  iconPosition="only"
  ariaLabel="Settings"
>
  <svg slot="icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
  </svg>
</Button>
```

### Link Button

```tsx
<Button hierarchy="link-color" onClick={() => navigate('/help')}>
  Learn more
</Button>
```

## Design System

This package is part of the Kapsch Design System (KDS), built with web components using LIT and wrapped for React compatibility.

**Source**: Untitled UI - FREE Figma UI kit v2.0
**Figma SSOT**: All component properties and tokens are extracted from Figma via MCP
**Validation**: Components are validated against Figma contracts during build

## License

MIT
