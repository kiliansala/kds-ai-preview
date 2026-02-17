# @kds/blazor

Blazor wrappers for Kapsch Design System web components.

## Installation

```bash
npm install @kds/blazor @kds/web-components
```

Or copy the component files directly into your Blazor project:
- `Components/KdsButton.razor`
- `Components/_Imports.razor`
- `wwwroot/kds-blazor.js`

## Setup

### 1. Add Component Files

Copy the files from this package into your Blazor project:

```
YourBlazorApp/
├── Components/
│   ├── KdsButton.razor
│   └── _Imports.razor
└── wwwroot/
    └── kds-blazor.js
```

### 2. Import Design Tokens

Add the tokens CSS to your `App.razor` or `MainLayout.razor`:

```html
<link href="_content/@kds/web-components/tokens.css" rel="stylesheet" />
```

Or add to your `wwwroot/index.html` (Blazor WebAssembly) or `_Host.cshtml` (Blazor Server):

```html
<head>
    <!-- Other head content -->
    <link href="https://unpkg.com/@kds/web-components/dist/tokens.css" rel="stylesheet" />
</head>
```

### 3. Import JavaScript Module

Add the JavaScript module to your `App.razor`, `index.html`, or `_Host.cshtml`:

```html
<script type="module" src="./kds-blazor.js"></script>
```

### 4. Enable Web Components

In your `_Imports.razor`, add:

```razor
@using Kds.Blazor.Components
```

## Usage

### Basic Button

```razor
@page "/example"

<KdsButton Size="md" Hierarchy="primary" OnClick="@HandleClick">
    Primary Button
</KdsButton>

@code {
    private void HandleClick()
    {
        Console.WriteLine("Button clicked!");
    }
}
```

### Button Sizes

```razor
<KdsButton Size="sm">Small</KdsButton>
<KdsButton Size="md">Medium</KdsButton>
<KdsButton Size="lg">Large</KdsButton>
<KdsButton Size="xl">Extra Large</KdsButton>
```

### Button Hierarchies

```razor
<!-- Primary -->
<KdsButton Hierarchy="primary">Primary</KdsButton>

<!-- Secondary Color -->
<KdsButton Hierarchy="secondary-color">Secondary Color</KdsButton>

<!-- Secondary Gray -->
<KdsButton Hierarchy="secondary-gray">Secondary Gray</KdsButton>

<!-- Tertiary Color -->
<KdsButton Hierarchy="tertiary-color">Tertiary Color</KdsButton>

<!-- Tertiary Gray -->
<KdsButton Hierarchy="tertiary-gray">Tertiary Gray</KdsButton>

<!-- Link Color -->
<KdsButton Hierarchy="link-color">Link Color</KdsButton>

<!-- Link Gray -->
<KdsButton Hierarchy="link-gray">Link Gray</KdsButton>
```

### Destructive Button

```razor
<KdsButton Hierarchy="primary" Destructive="true" OnClick="@HandleDelete">
    Delete
</KdsButton>

@code {
    private void HandleDelete()
    {
        // Handle delete action
    }
}
```

### Disabled Button

```razor
<KdsButton Disabled="true">
    Disabled Button
</KdsButton>
```

### Button with Icon

```razor
<KdsButton Size="lg" Hierarchy="secondary-color" IconPosition="leading">
    <svg slot="icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
    </svg>
    Add Item
</KdsButton>
```

### Icon-only Button

```razor
<KdsButton
    Size="sm"
    Hierarchy="tertiary-gray"
    IconPosition="only"
    AriaLabel="Settings">
    <svg slot="icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
    </svg>
</KdsButton>
```

### Form Submit Button

```razor
<EditForm Model="@model" OnValidSubmit="@HandleValidSubmit">
    <DataAnnotationsValidator />

    <InputText @bind-Value="model.Name" />

    <KdsButton Type="submit" Size="lg" Hierarchy="primary">
        Submit
    </KdsButton>
</EditForm>

@code {
    private MyModel model = new();

    private void HandleValidSubmit()
    {
        // Handle form submission
    }
}
```

### Loading State Example

```razor
<KdsButton
    Hierarchy="primary"
    Disabled="@isLoading"
    OnClick="@HandleAsyncAction">
    @if (isLoading)
    {
        <span>Loading...</span>
    }
    else
    {
        <span>Submit</span>
    }
</KdsButton>

@code {
    private bool isLoading = false;

    private async Task HandleAsyncAction()
    {
        isLoading = true;
        await Task.Delay(2000); // Simulate async operation
        isLoading = false;
    }
}
```

### Conditional Rendering

```razor
@if (showButton)
{
    <KdsButton OnClick="@(() => showButton = false)">
        Hide Button
    </KdsButton>
}
else
{
    <KdsButton OnClick="@(() => showButton = true)">
        Show Button
    </KdsButton>
}

@code {
    private bool showButton = true;
}
```

## API

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `Size` | `string` | `"md"` | Button size: `"sm"`, `"md"`, `"lg"`, `"xl"` |
| `Hierarchy` | `string` | `"primary"` | Visual hierarchy: `"primary"`, `"secondary-color"`, `"secondary-gray"`, `"tertiary-color"`, `"tertiary-gray"`, `"link-color"`, `"link-gray"` |
| `IconPosition` | `string` | `"none"` | Icon position: `"none"`, `"leading"`, `"trailing"`, `"dot"`, `"only"` |
| `Destructive` | `bool` | `false` | Destructive/danger variant |
| `Disabled` | `bool` | `false` | Disabled state |
| `Type` | `string` | `"button"` | Button type: `"button"`, `"submit"`, `"reset"` |
| `AriaLabel` | `string?` | `null` | ARIA label for icon-only buttons |
| `ChildContent` | `RenderFragment?` | `null` | Child content (button text and/or icon) |

### Events

| Event | Type | Description |
|-------|------|-------------|
| `OnClick` | `EventCallback` | Fires when the button is clicked |

## JavaScript Interop

The component uses JavaScript interop to handle custom events from the web component. The `kds-blazor.js` file provides the necessary bridge between the web component events and Blazor callbacks.

### Interop Methods

- `KdsBlazor.attachButtonListener(element, dotNetHelper)` - Attaches event listener
- `KdsBlazor.detachButtonListener(element)` - Detaches event listener

## Design System

This package is part of the Kapsch Design System (KDS), built with web components using LIT and wrapped for Blazor compatibility.

**Source**: Untitled UI - FREE Figma UI kit v2.0
**Figma SSOT**: All component properties and tokens are extracted from Figma via MCP
**Validation**: Components are validated against Figma contracts during build

## Requirements

- .NET 6.0+ / .NET 7.0+ / .NET 8.0+
- Blazor WebAssembly or Blazor Server

## Browser Support

Same as Blazor's browser support requirements. The underlying web components use modern JavaScript and are compatible with all evergreen browsers.

## Notes

- The component implements `IAsyncDisposable` for proper cleanup
- JavaScript interop is initialized on first render
- Event listeners are properly cleaned up on component disposal
- The component is designed to work with both Blazor Server and Blazor WebAssembly

## License

MIT
