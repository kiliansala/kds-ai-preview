# React Example - KDS Button Integration

This example demonstrates how to integrate the **@kds/react** package in a React application.

## Setup

### 1. Install Dependencies

```bash
npm install @kds/react @kds/web-components
```

### 2. Import Components

```tsx
import { Button } from '@kds/react';
import '@kds/web-components/tokens.css';
```

### 3. Use the Button

```tsx
function App() {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return (
    <Button
      size="lg"
      hierarchy="primary"
      onClick={handleClick}
    >
      Click me
    </Button>
  );
}
```

## Running This Example

If you have a Vite + React project:

1. Copy `App.tsx` and `App.css` to your `src/` directory
2. Install dependencies: `npm install @kds/react @kds/web-components`
3. Run: `npm run dev`

## Creating a New Project

### Using Vite

```bash
npm create vite@latest my-kds-app -- --template react-ts
cd my-kds-app
npm install
npm install @kds/react @kds/web-components
```

Then replace `src/App.tsx` with the example file.

### Using Create React App

```bash
npx create-react-app my-kds-app --template typescript
cd my-kds-app
npm install @kds/react @kds/web-components
```

Then replace `src/App.tsx` with the example file.

## Features Demonstrated

- ✅ All button sizes (sm, md, lg, xl)
- ✅ All hierarchies (primary, secondary, tertiary, link variants)
- ✅ Interactive state management (counter example)
- ✅ Async actions with loading states
- ✅ Destructive actions
- ✅ Disabled states
- ✅ Icon buttons (leading, trailing, only)
- ✅ Form integration (submit, reset)
- ✅ Event handling with onClick
- ✅ Design token consumption via CSS

## TypeScript Support

The `@kds/react` package includes full TypeScript definitions:

```tsx
import { Button, ButtonProps } from '@kds/react';

const MyButton: React.FC<{ variant: ButtonProps['hierarchy'] }> = ({ variant }) => {
  return <Button hierarchy={variant}>Click me</Button>;
};
```

## Styling

The example uses design tokens from `@kds/web-components/tokens.css` for consistent styling:

```css
/* Design tokens are available as CSS custom properties */
color: var(--kds-color-brand-600);
box-shadow: var(--kds-shadow-xs);
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Requires browser support for:
- Web Components (Custom Elements v1)
- Shadow DOM
- ES Modules

## Next Steps

Explore other KDS components as they become available:
- Input
- Checkbox
- Select
- Modal

## Resources

- [@kds/react Documentation](../../packages/wrappers/react/README.md)
- [Web Components Documentation](../../packages/web-components/README.md)
- [Design Tokens](../../packages/tokens/README.md)
