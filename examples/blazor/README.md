# Blazor Example - KDS Button Integration

This example demonstrates how to integrate the **@kds/blazor** package in a Blazor application.

## Setup

### 1. Install Dependencies

```bash
npm install @kds/blazor @kds/web-components
```

### 2. Copy Component Files

Copy the following files to your Blazor project:

```
YourBlazorApp/
├── Components/
│   ├── KdsButton.razor
│   └── _Imports.razor
└── wwwroot/
    └── kds-blazor.js
```

From the `@kds/blazor` package:
- `node_modules/@kds/blazor/Components/*` → `YourProject/Components/`
- `node_modules/@kds/blazor/wwwroot/*` → `YourProject/wwwroot/`

### 3. Import Design Tokens

Add to your `App.razor`, `MainLayout.razor`, or `_Host.cshtml`:

```html
<head>
    <!-- Other head content -->
    <link href="_content/@kds/web-components/tokens.css" rel="stylesheet" />
</head>
```

Or use CDN:

```html
<link href="https://unpkg.com/@kds/web-components/dist/tokens.css" rel="stylesheet" />
```

### 4. Import JavaScript Module

Add to your `App.razor`, `index.html`, or `_Host.cshtml`:

```html
<script type="module" src="./kds-blazor.js"></script>
```

### 5. Enable Component Namespace

In your `_Imports.razor`:

```razor
@using Kds.Blazor.Components
```

## Running This Example

If you have a Blazor project:

1. Copy `App.razor` and `App.razor.css` to your `Pages/` directory
2. Install and copy KDS files as described above
3. Run: `dotnet run`

## Creating a New Project

### Blazor WebAssembly

```bash
dotnet new blazorwasm -o MyKdsApp
cd MyKdsApp
npm install @kds/blazor @kds/web-components
# Then copy component files
```

### Blazor Server

```bash
dotnet new blazorserver -o MyKdsApp
cd MyKdsApp
npm install @kds/blazor @kds/web-components
# Then copy component files
```

## Features Demonstrated

- ✅ All button sizes (sm, md, lg, xl)
- ✅ All hierarchies (primary, secondary, tertiary, link variants)
- ✅ Interactive state management (counter example)
- ✅ Async actions with loading states
- ✅ Destructive actions
- ✅ Disabled states
- ✅ Icon buttons (leading, trailing, only)
- ✅ Form integration with EditForm
- ✅ Event handling with EventCallback
- ✅ Data binding with @bind-Value
- ✅ Design token consumption via CSS
- ✅ JavaScript Interop for web component events

## Component API

### Parameters

```csharp
[Parameter] public string Size { get; set; } = "md";
[Parameter] public string Hierarchy { get; set; } = "primary";
[Parameter] public string IconPosition { get; set; } = "none";
[Parameter] public bool Destructive { get; set; } = false;
[Parameter] public bool Disabled { get; set; } = false;
[Parameter] public string Type { get; set; } = "button";
[Parameter] public string? AriaLabel { get; set; }
[Parameter] public RenderFragment? ChildContent { get; set; }
```

### Events

```csharp
[Parameter] public EventCallback OnClick { get; set; }
```

## Usage Examples

### Basic Button

```razor
<KdsButton Size="md" Hierarchy="primary" OnClick="@HandleClick">
    Click me
</KdsButton>

@code {
    private void HandleClick()
    {
        Console.WriteLine("Button clicked!");
    }
}
```

### Async Action

```razor
<KdsButton
    Hierarchy="secondary-color"
    Disabled="@isLoading"
    OnClick="@HandleAsync">
    @(isLoading ? "Loading..." : "Submit")
</KdsButton>

@code {
    private bool isLoading = false;

    private async Task HandleAsync()
    {
        isLoading = true;
        await Task.Delay(2000);
        isLoading = false;
    }
}
```

### Form Integration

```razor
<EditForm Model="@model" OnValidSubmit="@HandleSubmit">
    <DataAnnotationsValidator />

    <InputText @bind-Value="model.Name" />

    <KdsButton Type="submit" Hierarchy="primary">
        Submit
    </KdsButton>
</EditForm>

@code {
    private MyModel model = new();

    private void HandleSubmit()
    {
        // Handle form submission
    }
}
```

## Styling

The example uses design tokens from `@kds/web-components/tokens.css` for consistent styling:

```css
/* Design tokens are available as CSS custom properties */
color: var(--kds-color-brand-600);
box-shadow: var(--kds-shadow-xs);
```

## JavaScript Interop

The component uses JavaScript Interop to handle custom events from the web component:

```javascript
// kds-blazor.js
window.KdsBlazor = {
  attachButtonListener: function (element, dotNetHelper) {
    const listener = () => {
      dotNetHelper.invokeMethodAsync('HandleButtonClick');
    };
    element.addEventListener('kds-button-click', listener);
  }
};
```

The Razor component implements `IAsyncDisposable` for proper cleanup:

```csharp
public async ValueTask DisposeAsync()
{
    if (objRef != null)
    {
        await JS.InvokeVoidAsync("KdsBlazor.detachButtonListener", buttonElement);
        objRef.Dispose();
    }
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Requires browser support for:
- Web Components (Custom Elements v1)
- Shadow DOM
- ES Modules

## Deployment Considerations

### Blazor WebAssembly

Ensure the web component scripts are included in `wwwroot/`:

```html
<!-- index.html -->
<script type="module" src="./kds-blazor.js"></script>
```

### Blazor Server

Web components work the same in Blazor Server, but ensure SignalR doesn't interfere with event handling. The JavaScript Interop handles this correctly.

## Troubleshooting

### Component not rendering

Make sure you've:
1. Copied all component files to your project
2. Added `@using Kds.Blazor.Components` to `_Imports.razor`
3. Imported the JavaScript module
4. Imported the CSS tokens

### Events not firing

Verify that:
1. `kds-blazor.js` is loaded (check browser console)
2. The JavaScript module is loaded with `type="module"`
3. The component implements event listeners correctly

### Styles not applying

Ensure `tokens.css` is imported before your component CSS:

```html
<link href="_content/@kds/web-components/tokens.css" rel="stylesheet" />
<link href="App.razor.css" rel="stylesheet" />
```

## Next Steps

Explore other KDS components as they become available:
- Input
- Checkbox
- Select
- Modal

## Resources

- [@kds/blazor Documentation](../../packages/wrappers/blazor/README.md)
- [Web Components Documentation](../../packages/web-components/README.md)
- [Design Tokens](../../packages/tokens/README.md)
- [Blazor Documentation](https://learn.microsoft.com/en-us/aspnet/core/blazor/)
