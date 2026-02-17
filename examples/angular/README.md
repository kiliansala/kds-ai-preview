# Angular Example - KDS Button Integration

This example demonstrates how to integrate the **@kds/angular** package in an Angular application.

## Setup

### 1. Install Dependencies

```bash
npm install @kds/angular @kds/web-components
```

### 2. Import Module or Standalone Component

#### Option A: Standalone Component (Angular 14+)

```typescript
import { Component } from '@angular/core';
import { KdsButtonComponent } from '@kds/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [KdsButtonComponent],
  template: `
    <kds-button-wrapper
      size="lg"
      hierarchy="primary"
      (buttonClick)="handleClick()">
      Click me
    </kds-button-wrapper>
  `
})
export class AppComponent {
  handleClick(): void {
    console.log('Button clicked!');
  }
}
```

#### Option B: NgModule (Angular 12+)

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { KdsButtonModule } from '@kds/angular';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    KdsButtonModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### 3. Import Design Tokens

Add to your `angular.json` or `styles.css`:

```json
{
  "styles": [
    "node_modules/@kds/web-components/dist/tokens.css",
    "src/styles.css"
  ]
}
```

Or in your global `styles.css`:

```css
@import '@kds/web-components/tokens.css';
```

## Running This Example

If you have an Angular project:

1. Copy `app.component.ts`, `app.component.html`, and `app.component.css` to your `src/app/` directory
2. Install dependencies: `npm install @kds/angular @kds/web-components`
3. Import tokens in `angular.json` or `styles.css`
4. Run: `ng serve`

## Creating a New Project

```bash
# Create new Angular project
ng new my-kds-app
cd my-kds-app

# Install KDS packages
npm install @kds/angular @kds/web-components

# Add tokens to angular.json styles array
# Then copy the example files
```

## Features Demonstrated

- ✅ All button sizes (sm, md, lg, xl)
- ✅ All hierarchies (primary, secondary, tertiary, link variants)
- ✅ Interactive state management (counter example)
- ✅ Async actions with loading states
- ✅ Destructive actions
- ✅ Disabled states
- ✅ Icon buttons (leading, trailing, only)
- ✅ Form integration with ngSubmit
- ✅ Event handling with (buttonClick)
- ✅ Property binding with [disabled], [destructive]
- ✅ Two-way data binding with ngModel
- ✅ Design token consumption via CSS

## Component API

### Inputs

```typescript
@Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
@Input() hierarchy: 'primary' | 'secondary-color' | 'secondary-gray' |
                   'tertiary-color' | 'tertiary-gray' | 'link-color' |
                   'link-gray' = 'primary';
@Input() iconPosition: 'none' | 'leading' | 'trailing' | 'dot' | 'only' = 'none';
@Input() destructive: boolean = false;
@Input() disabled: boolean = false;
@Input() type: 'button' | 'submit' | 'reset' = 'button';
@Input() ariaLabel?: string;
```

### Outputs

```typescript
@Output() buttonClick = new EventEmitter<CustomEvent>();
```

## TypeScript Support

The `@kds/angular` package includes full TypeScript definitions:

```typescript
import { KdsButtonComponent, ButtonSize, ButtonHierarchy } from '@kds/angular';

export class MyComponent {
  buttonSize: ButtonSize = 'lg';
  buttonHierarchy: ButtonHierarchy = 'primary';
}
```

## Styling

The example uses design tokens from `@kds/web-components/tokens.css` for consistent styling:

```css
/* Design tokens are available as CSS custom properties */
color: var(--kds-color-brand-600);
box-shadow: var(--kds-shadow-xs);
```

## Module vs Standalone

### When to use Standalone Components (Recommended)
- New Angular projects (v14+)
- Modern Angular best practices
- Simpler imports and less boilerplate

### When to use NgModule
- Existing projects using NgModule
- Angular versions < 14
- Projects not yet migrated to standalone

Both approaches are fully supported!

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Requires browser support for:
- Web Components (Custom Elements v1)
- Shadow DOM
- ES Modules

## Troubleshooting

### "Custom element not recognized" error

Make sure you've imported `CUSTOM_ELEMENTS_SCHEMA`:

```typescript
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
```

This is already included in `KdsButtonComponent` and `KdsButtonModule`.

### Design tokens not working

Ensure `tokens.css` is imported in your `angular.json`:

```json
"styles": [
  "node_modules/@kds/web-components/dist/tokens.css"
]
```

## Next Steps

Explore other KDS components as they become available:
- Input
- Checkbox
- Select
- Modal

## Resources

- [@kds/angular Documentation](../../packages/wrappers/angular/README.md)
- [Web Components Documentation](../../packages/web-components/README.md)
- [Design Tokens](../../packages/tokens/README.md)
- [Angular Custom Elements Guide](https://angular.io/guide/elements)
