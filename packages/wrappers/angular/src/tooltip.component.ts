/**
 * @package @kds/angular
 * @component KdsTooltipComponent
 * @description Angular component wrapper for kds-tooltip web component
 */

import {
  Component,
  Input,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import type { TooltipTheme, TooltipArrow } from '@kds/web-components';

/**
 * Angular wrapper for the Tooltip web component
 *
 * @example
 * ```typescript
 * import { KdsTooltipComponent } from '@kds/angular';
 *
 * @Component({
 *   selector: 'app-example',
 *   template: `
 *     <kds-tooltip-wrapper
 *       text="This is a tooltip"
 *       theme="dark"
 *       arrow="bottom-center"
 *     ></kds-tooltip-wrapper>
 *   `
 * })
 * export class ExampleComponent {}
 * ```
 */
@Component({
  selector: 'kds-tooltip-wrapper',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <kds-tooltip
      [attr.theme]="theme"
      [attr.arrow]="arrow"
      [attr.text]="text"
      [attr.supporting-text]="supportingText"
    >
      <ng-content></ng-content>
    </kds-tooltip>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }
  `]
})
export class KdsTooltipComponent {
  /**
   * Tooltip color theme
   * @default 'light'
   */
  @Input() theme: TooltipTheme = 'light';

  /**
   * Arrow position
   * @default 'none'
   */
  @Input() arrow: TooltipArrow = 'none';

  /**
   * Tooltip title text
   */
  @Input() text?: string;

  /**
   * Supporting/description text
   */
  @Input() supportingText?: string;
}
