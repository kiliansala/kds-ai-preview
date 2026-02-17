/**
 * @package @kds/react
 * @description React wrappers for Kapsch Design System web components
 * @author Kilian Sala <kilian@kapsch.net>
 *
 * @remarks
 * Don't forget to import the design tokens CSS:
 * ```tsx
 * import '@kds/web-components/tokens.css';
 * ```
 */

export { Button } from './Button.js';
export type { ButtonProps } from './Button.js';

export { Checkbox } from './Checkbox.js';
export type { CheckboxProps } from './Checkbox.js';

export { Toggle } from './Toggle.js';
export type { ToggleProps } from './Toggle.js';

export { Tooltip } from './Tooltip.js';
export type { TooltipProps } from './Tooltip.js';

// Re-export types from web-components
export type { ButtonSize, ButtonHierarchy, IconPosition, CheckboxSize, ToggleSize, TooltipTheme, TooltipArrow } from '@kds/web-components';

export const version = '0.1.0';
