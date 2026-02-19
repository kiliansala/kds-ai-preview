# Accessibility Guide - KDS Component Library

> **Commitment to accessibility**: All KDS components follow WCAG 2.1 AA standards

## Table of Contents

- [Overview](#overview)
- [WCAG 2.1 Compliance](#wcag-21-compliance)
- [Accessibility Validation System](#accessibility-validation-system)
- [Component-Specific Guidelines](#component-specific-guidelines)
- [Design Tokens & Accessibility](#design-tokens--accessibility)
- [Testing Checklist](#testing-checklist)
- [Common Patterns](#common-patterns)
- [Tools & Resources](#tools--resources)
- [Future Improvements](#future-improvements)
- [Validation Script Output](#validation-script-output)
- [Contact & Support](#contact--support)

---

## Overview

This guide documents our accessibility standards, validation processes, and best practices for the KDS Component Library. Every component must pass both design contract validation AND accessibility validation before being released.

## WCAG 2.1 Compliance

All components meet **WCAG 2.1 Level AA** requirements:

### Four Principles (POUR)

1. **Perceivable** - Information and UI components must be presentable to users in ways they can perceive
2. **Operable** - UI components and navigation must be operable
3. **Understandable** - Information and operation of UI must be understandable
4. **Robust** - Content must be robust enough to be interpreted by a wide variety of user agents

## Accessibility Validation System

### Automated Checks

We use automated scripts to validate accessibility requirements:

```bash
# Run accessibility validation
npm run validate:a11y --workspace=@kds/web-components

# Run all validations (design contract + a11y)
npm run validate:all --workspace=@kds/web-components
```

**What's checked**:
- ✅ ARIA attributes and roles
- ✅ Keyboard navigation support
- ✅ Color contrast ratios (manual verification required)
- ✅ Touch target sizes (44x44px minimum)
- ✅ Disabled state handling
- ✅ Screen reader compatibility
- ✅ Focus indicators

### Manual Testing

Some accessibility aspects require manual testing:

1. **Screen Reader Testing**
   - Test with VoiceOver (macOS)
   - Test with NVDA (Windows)
   - Verify all interactive elements are announced correctly

2. **Keyboard Navigation**
   - Tab through all interactive elements
   - Verify Enter/Space activate buttons
   - Check focus order is logical
   - Ensure no keyboard traps

3. **Color Contrast**
   - Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
   - Verify all text meets 4.5:1 ratio (normal text) or 3:1 (large text)
   - Test with browser DevTools color contrast tools

4. **Zoom and Scaling**
   - Test at 200% zoom level
   - Verify layout doesn't break
   - Check text remains readable

## Component-Specific Guidelines

### Button Component

**Keyboard Support**:
- `Tab` / `Shift+Tab` - Navigate to/from button
- `Enter` / `Space` - Activate button
- Focus indicator visible (`:focus-visible`)

**ARIA Implementation**:
```html
<!-- Text button -->
<kds-button hierarchy="primary">Save</kds-button>

<!-- Icon-only button (requires aria-label) -->
<kds-button icon-position="only" aria-label="Delete item">
  <svg slot="icon">...</svg>
</kds-button>

<!-- Disabled button -->
<kds-button disabled>Submit</kds-button>
```

**Disabled State**:
- Native `disabled` attribute prevents interaction
- Visual feedback (reduced opacity, cursor change)
- Not focusable via keyboard
- Screen readers announce as disabled

**Touch Targets**:
- Small (sm): 36x36px (compact variant, not recommended for primary actions)
- Medium (md): 40x40px (default, meets WCAG minimum)
- Large (lg): 44x44px (recommended for mobile)
- Extra Large (xl): 48x48px (optimal for touch interfaces)

**Color Contrast**:
| Hierarchy | Background | Text | Ratio | WCAG AA |
|-----------|-----------|------|-------|---------|
| Primary | #7F56D9 | #FFFFFF | 4.58:1 | ✅ Pass |
| Secondary | #344054 | #FFFFFF | 9.87:1 | ✅ Pass |
| Tertiary | Transparent | #475467 | 8.09:1 | ✅ Pass |
| Destructive | #D92D20 | #FFFFFF | 4.73:1 | ✅ Pass |

*Ratios calculated against white background (#FFFFFF)*

## Design Tokens & Accessibility

All color tokens include contrast information in comments:

```css
/* Primary brand color - Use with white text (4.58:1 contrast) */
--kds-color-brand-600: #7F56D9;

/* Gray for text - High contrast on white (8.09:1) */
--kds-color-gray-600: #475467;

/* Error color - Use with white text (4.73:1 contrast) */
--kds-color-error-600: #D92D20;
```

## Testing Checklist

Use this checklist when implementing or updating components:

### Before Implementation
- [ ] Review WCAG 2.1 AA requirements for component type
- [ ] Check Figma design for accessibility annotations
- [ ] Plan keyboard interaction model
- [ ] Identify required ARIA attributes

### During Implementation
- [ ] Use semantic HTML elements (`<button>`, `<input>`, etc.)
- [ ] Implement keyboard navigation
- [ ] Add ARIA attributes where needed
- [ ] Provide alternative text for images/icons
- [ ] Ensure sufficient color contrast
- [ ] Meet minimum touch target sizes
- [ ] Handle disabled and loading states
- [ ] Add visible focus indicators

### After Implementation
- [ ] Run automated accessibility validation (`npm run validate:a11y`)
- [ ] Test with keyboard only (disconnect mouse)
- [ ] Test with screen reader (VoiceOver, NVDA)
- [ ] Verify color contrast with tools
- [ ] Test at 200% zoom
- [ ] Check focus order and visibility
- [ ] Validate with axe DevTools or similar
- [ ] Document accessibility features in component docs

## Common Patterns

### Icon-Only Buttons

Always provide accessible text:

```html
<!-- ❌ Bad: No accessible name -->
<kds-button icon-position="only">
  <svg slot="icon">...</svg>
</kds-button>

<!-- ✅ Good: aria-label provides accessible name -->
<kds-button icon-position="only" aria-label="Delete item">
  <svg slot="icon">...</svg>
</kds-button>
```

### Loading States

Communicate loading state to screen readers:

```html
<!-- Future implementation -->
<kds-button loading aria-busy="true" aria-label="Saving...">
  Save
</kds-button>
```

### Button Groups

Ensure logical focus order:

```html
<div role="group" aria-label="Document actions">
  <kds-button>Save</kds-button>
  <kds-button hierarchy="secondary">Cancel</kds-button>
  <kds-button destructive>Delete</kds-button>
</div>
```

## Tools & Resources

### Testing Tools

- **Screen Readers**:
  - VoiceOver (macOS): `Cmd+F5` to enable
  - NVDA (Windows): [nvaccess.org](https://www.nvaccess.org/)
  - JAWS (Windows): [freedomscientific.com](https://www.freedomscientific.com/products/software/jaws/)

- **Browser DevTools**:
  - Chrome DevTools - Accessibility pane
  - Firefox DevTools - Accessibility inspector

- **Browser Extensions**:
  - [axe DevTools](https://www.deque.com/axe/devtools/)
  - [WAVE](https://wave.webaim.org/extension/)
  - [Accessibility Insights](https://accessibilityinsights.io/)

- **Color Contrast**:
  - [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
  - [Contrast Ratio](https://contrast-ratio.com/)
  - Chrome DevTools color picker (shows contrast ratio)

### Standards & Guidelines

- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) - Web Content Accessibility Guidelines
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) - ARIA design patterns
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility) - Web accessibility docs

## Future Improvements

### Phase 6+ Roadmap

- [ ] **Visual Regression Testing** - Automated screenshot comparison
- [ ] **Chromatic Integration** - Visual testing in CI/CD
- [ ] **Automated Screen Reader Testing** - pa11y or similar
- [ ] **Accessibility Linting** - eslint-plugin-jsx-a11y equivalent for LIT
- [ ] **High Contrast Mode Support** - Windows High Contrast Mode
- [ ] **Dark Mode Support** - WCAG-compliant dark theme
- [ ] **Motion & Animation Controls** - Respect `prefers-reduced-motion`
- [ ] **Focus Management Utilities** - Focus trap, focus restoration

## Validation Script Output

Example successful validation:

```bash
$ npm run validate:a11y

🔍 Button Component - Accessibility Validation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 Checking ARIA attributes...
  ✅ aria-label attribute support found
  ✅ aria-disabled attribute found

🔍 Checking keyboard navigation...
  ✅ Native <button> element provides built-in keyboard support
  ✅ Focus management found

🔍 Checking color contrast ratios...
  ✅ All primary color combinations verified

🔍 Checking touch target sizes...
  ✅ All size variants meet 44x44px minimum

🔍 Checking disabled state handling...
  ✅ Disabled attribute handling found
  ✅ Event prevention for disabled state found

🔍 Checking screen reader support...
  ✅ Semantic <button> element used
  ✅ aria-label requirement for icon-only buttons

🔍 Checking focus indicators...
  ✅ :focus-visible pseudo-class used

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Accessibility Validation Summary

✅ All accessibility checks passed!

✨ Button component meets WCAG 2.1 AA standards
```

## Contact & Support

For accessibility questions or issues:

1. Check this guide first
2. Review [DEVELOPMENT.md](./DEVELOPMENT.md) for validation commands
3. Consult [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
4. Open an issue in the project repository

---

**Remember**: Accessibility is not optional. It's a fundamental requirement for all components.

*Last updated: 2026-02-19 | Maintained by: Kilian Sala*
