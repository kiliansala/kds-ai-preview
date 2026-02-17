/**
 * @package @kds/web-components
 * @description Web Components built with LIT for Kapsch Design System
 * @author Kilian Sala <kilian@kapsch.net>
 *
 * @remarks
 * To use design tokens, import the CSS in your application:
 * ```ts
 * import '@kds/web-components/tokens.css';
 * ```
 */

export { KdsButton } from './components/kds-button.js';
export type { ButtonSize, ButtonHierarchy, IconPosition } from './components/kds-button.js';

export { KdsCheckbox } from './components/kds-checkbox.js';
export type { CheckboxSize } from './components/kds-checkbox.js';

export { KdsToggle } from './components/kds-toggle.js';
export type { ToggleSize } from './components/kds-toggle.js';

export { KdsTooltip } from './components/kds-tooltip.js';
export type { TooltipTheme, TooltipArrow } from './components/kds-tooltip.js';

export const version = '0.1.0';
