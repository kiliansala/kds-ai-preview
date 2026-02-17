/**
 * @package @kds/angular
 * @description Angular wrappers for Kapsch Design System web components
 * @author Kilian Sala <kilian@kapsch.net>
 *
 * @remarks
 * Don't forget to import the design tokens CSS in your styles:
 * ```scss
 * @import '@kds/web-components/tokens.css';
 * ```
 *
 * Or in angular.json:
 * ```json
 * "styles": [
 *   "node_modules/@kds/web-components/dist/tokens.css"
 * ]
 * ```
 */

// Export standalone components
export { KdsButtonComponent } from './button.component';
export { KdsCheckboxComponent } from './checkbox.component';
export { KdsToggleComponent } from './toggle.component';
export { KdsTooltipComponent } from './tooltip.component';

// Export module (for non-standalone apps)
export { KdsButtonModule } from './button.module';

// Re-export types from web-components
export type { ButtonSize, ButtonHierarchy, IconPosition, CheckboxSize, ToggleSize, TooltipTheme, TooltipArrow } from '@kds/web-components';

export const version = '0.1.0';
