# @kds/angular

Angular wrappers for Kapsch Design System web components.

## Installation

```bash
npm install @kds/angular @kds/web-components
```

## Setup

### 1. Import Design Tokens

Add the tokens CSS to your `angular.json`:

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "src/styles.scss",
              "node_modules/@kds/web-components/dist/tokens.css"
            ]
          }
        }
      }
    }
  }
}
```

Or import in your global `styles.scss`:

```scss
@import '@kds/web-components/tokens.css';
```

### 2. Import the Module

#### For Module-based Apps:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { KdsButtonModule } from '@kds/angular';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    KdsButtonModule  // Import KDS Button module
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

#### For Standalone Components:

```typescript
import { Component } from '@angular/core';
import { KdsButtonComponent } from '@kds/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [KdsButtonComponent],  // Import standalone component
  template: `
    <kds-button-wrapper
      size="md"
      hierarchy="primary"
      (buttonClick)="handleClick($event)"
    >
      Click me
    </kds-button-wrapper>
  `
})
export class AppComponent {
  handleClick(event: CustomEvent) {
    console.log('Button clicked!', event);
  }
}
```

## Usage

### Basic Button

```typescript
@Component({
  selector: 'app-example',
  template: `
    <kds-button-wrapper
      size="md"
      hierarchy="primary"
      (buttonClick)="onButtonClick()"
    >
      Primary Button
    </kds-button-wrapper>
  `
})
export class ExampleComponent {
  onButtonClick() {
    console.log('Button clicked!');
  }
}
```

### Button Sizes

```html
<kds-button-wrapper size="sm">Small</kds-button-wrapper>
<kds-button-wrapper size="md">Medium</kds-button-wrapper>
<kds-button-wrapper size="lg">Large</kds-button-wrapper>
<kds-button-wrapper size="xl">Extra Large</kds-button-wrapper>
```

### Button Hierarchies

```html
<!-- Primary -->
<kds-button-wrapper hierarchy="primary">Primary</kds-button-wrapper>

<!-- Secondary Color -->
<kds-button-wrapper hierarchy="secondary-color">Secondary Color</kds-button-wrapper>

<!-- Secondary Gray -->
<kds-button-wrapper hierarchy="secondary-gray">Secondary Gray</kds-button-wrapper>

<!-- Tertiary Color -->
<kds-button-wrapper hierarchy="tertiary-color">Tertiary Color</kds-button-wrapper>

<!-- Tertiary Gray -->
<kds-button-wrapper hierarchy="tertiary-gray">Tertiary Gray</kds-button-wrapper>

<!-- Link Color -->
<kds-button-wrapper hierarchy="link-color">Link Color</kds-button-wrapper>

<!-- Link Gray -->
<kds-button-wrapper hierarchy="link-gray">Link Gray</kds-button-wrapper>
```

### Destructive Button

```html
<kds-button-wrapper
  hierarchy="primary"
  [destructive]="true"
  (buttonClick)="onDelete()"
>
  Delete
</kds-button-wrapper>
```

### Disabled Button

```html
<kds-button-wrapper [disabled]="true">
  Disabled Button
</kds-button-wrapper>
```

### Button with Icon

```html
<kds-button-wrapper
  size="lg"
  hierarchy="secondary-color"
  iconPosition="leading"
>
  <svg slot="icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
  </svg>
  Add Item
</kds-button-wrapper>
```

### Icon-only Button

```html
<kds-button-wrapper
  size="sm"
  hierarchy="tertiary-gray"
  iconPosition="only"
  ariaLabel="Settings"
>
  <svg slot="icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
  </svg>
</kds-button-wrapper>
```

### Form Submit Button

```html
<form (ngSubmit)="onSubmit()">
  <input type="text" [(ngModel)]="name" />

  <kds-button-wrapper
    type="submit"
    size="lg"
    hierarchy="primary"
  >
    Submit
  </kds-button-wrapper>
</form>
```

## API

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Button size |
| `hierarchy` | `'primary' \| 'secondary-color' \| 'secondary-gray' \| 'tertiary-color' \| 'tertiary-gray' \| 'link-color' \| 'link-gray'` | `'primary'` | Visual hierarchy/style variant |
| `iconPosition` | `'none' \| 'leading' \| 'trailing' \| 'dot' \| 'only'` | `'none'` | Icon position relative to text |
| `destructive` | `boolean` | `false` | Destructive/danger variant |
| `disabled` | `boolean` | `false` | Disabled state |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Button type attribute |
| `ariaLabel` | `string` | - | ARIA label for icon-only buttons |

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `buttonClick` | `EventEmitter<CustomEvent>` | Emits when the button is clicked |

## TypeScript Types

```typescript
import type { ButtonSize, ButtonHierarchy, IconPosition } from '@kds/angular';

// Use in your components
size: ButtonSize = 'md';
hierarchy: ButtonHierarchy = 'primary';
iconPosition: IconPosition = 'leading';
```

## Design System

This package is part of the Kapsch Design System (KDS), built with web components using LIT and wrapped for Angular compatibility.

**Source**: Untitled UI - FREE Figma UI kit v2.0
**Figma SSOT**: All component properties and tokens are extracted from Figma via MCP
**Validation**: Components are validated against Figma contracts during build

## Requirements

- Angular 17.0+
- TypeScript 5.0+

## License

MIT
