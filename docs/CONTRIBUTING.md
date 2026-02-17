# Contributing to KDS AI Preview

Este proyecto es un PoC interno de Kapsch. Este documento describe cómo colaborar en el desarrollo.

## AI-First Development

Este proyecto sigue un enfoque **AI-First**, donde la mayoría del código es generado por Claude AI.

### Workflow de Desarrollo

1. **Definir Requerimientos**
   - Describir el componente o feature necesario
   - Proporcionar referencias de diseño (Figma)
   - Especificar comportamientos esperados

2. **Generación con AI**
   - Usar Claude Code para generar el código
   - Iterar con prompts para refinar
   - Validar output contra especificaciones

3. **Revisión Humana**
   - Verificar calidad del código generado
   - Probar funcionamiento
   - Asegurar accesibilidad
   - Validar performance

4. **Documentación**
   - La documentación se genera automáticamente
   - Añadir contexto adicional si es necesario
   - Actualizar ejemplos

## Estructura de Commits

Seguimos Conventional Commits:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**:
- `feat`: Nueva funcionalidad
- `fix`: Bug fix
- `docs`: Solo documentación
- `style`: Cambios de formato (no afectan código)
- `refactor`: Refactoring (ni feat ni fix)
- `perf`: Mejoras de performance
- `test`: Añadir o modificar tests
- `chore`: Tareas de mantenimiento
- `ai`: Generación/regeneración via AI

**Scopes**:
- `tokens`: Design tokens
- `components`: Web components
- `react`: React wrapper
- `angular`: Angular wrapper
- `blazor`: Blazor wrapper
- `docs`: Documentación
- `build`: Build system

**Ejemplos**:
```
ai(components): generate Button component via Claude
feat(tokens): add color tokens from Figma
docs(readme): update setup instructions
```

## Generar un Nuevo Componente

### Paso 1: Extraer de Figma
```bash
# Usar el MCP server para extraer el componente
# Claude AI analizará el diseño y generará tokens
```

### Paso 2: Generar Web Component
```bash
# Usar Claude Code con el prompt:
# "Generate a LIT web component for [ComponentName] using these tokens..."
```

### Paso 3: Generar Wrappers
```bash
# Usar Claude Code para generar wrappers:
# "Create React/Angular/Blazor wrappers for kds-[component-name]"
```

### Paso 4: Documentación y Tests
```bash
# Claude genera automáticamente:
# - JSDoc comments
# - Storybook stories
# - Unit tests
# - Usage examples
```

## Estándares de Código

### Web Components (LIT)
- Usar TypeScript strict mode
- Decoradores para propiedades reactivas
- Shadow DOM siempre
- CSS-in-JS con `css` tagged template
- Accesibilidad WCAG 2.1 AA mínimo

### Naming Conventions
- Components: `kds-component-name`
- Props: camelCase
- Events: kebab-case (ejemplo: `value-changed`)
- CSS custom properties: `--kds-component-property`

### Tokens
```css
/* Estructura de tokens */
--kds-color-primary-500
--kds-spacing-md
--kds-font-size-body
--kds-border-radius-lg
```

## Testing

Cada componente debe incluir:

1. **Unit Tests**
   - Props rendering
   - Events dispatching
   - Slot content
   - Attribute changes

2. **Accessibility Tests**
   - ARIA attributes
   - Keyboard navigation
   - Screen reader support
   - Color contrast

3. **Visual Tests** (futuro)
   - Screenshots comparison
   - Responsive behavior

## Checklist de PR

Antes de crear un PR, verificar:

- [ ] Código generado por AI revisado
- [ ] TypeScript sin errores
- [ ] Tests passing
- [ ] Accesibilidad validada
- [ ] Documentación actualizada
- [ ] Ejemplos de uso incluidos
- [ ] Compatible con los 3 frameworks
- [ ] Build exitoso sin warnings

## Herramientas

- **Claude Code**: Generación de código
- **Figma MCP**: Extracción de diseño
- **Vite**: Build tool
- **TypeScript**: Type safety
- **Lit**: Web components
- **Workspaces**: Monorepo management

## Soporte

Para preguntas o issues:
- **Technical Lead**: Kilian Sala (kilian@kapsch.net)
- **Documentation**: Consultar [docs/](../docs/)
- **AI Prompts**: Consultar [docs/AI-WORKFLOW.md](./AI-WORKFLOW.md)

---

**Remember**: Este es un PoC para explorar AI-driven development.
Experimentar, iterar y documentar learnings es parte del proceso.
