/**
 * @package @kds/angular
 * @component KdsButtonComponent
 * @description Angular component wrapper for kds-button web component
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import type { ButtonSize, ButtonHierarchy, IconPosition } from '@kds/web-components';

/**
 * Angular wrapper for the Button web component
 *
 * @example
 * ```typescript
 * import { KdsButtonComponent } from '@kds/angular';
 *
 * @Component({
 *   selector: 'app-example',
 *   template: `
 *     <kds-button-wrapper
 *       size="md"
 *       hierarchy="primary"
 *       (buttonClick)="handleClick($event)"
 *     >
 *       Click me
 *     </kds-button-wrapper>
 *   `
 * })
 * export class ExampleComponent {
 *   handleClick(event: CustomEvent) {
 *     console.log('Button clicked!', event);
 *   }
 * }
 * ```
 */
@Component({
  selector: 'kds-button-wrapper',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <kds-button
      #buttonElement
      [attr.size]="size"
      [attr.hierarchy]="hierarchy"
      [attr.icon-position]="iconPosition"
      [attr.destructive]="destructive ? '' : null"
      [attr.disabled]="disabled ? '' : null"
      [attr.type]="type"
      [attr.aria-label]="ariaLabel"
    >
      <ng-content></ng-content>
    </kds-button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class KdsButtonComponent implements AfterViewInit, OnDestroy {
  @ViewChild('buttonElement', { static: true }) buttonElement!: ElementRef<HTMLElement>;

  /**
   * Button size
   * @default 'md'
   */
  @Input() size: ButtonSize = 'md';

  /**
   * Visual hierarchy/style variant
   * @default 'primary'
   */
  @Input() hierarchy: ButtonHierarchy = 'primary';

  /**
   * Icon position relative to text
   * @default 'none'
   */
  @Input() iconPosition: IconPosition = 'none';

  /**
   * Destructive/danger variant
   * @default false
   */
  @Input() destructive: boolean = false;

  /**
   * Disabled state
   * @default false
   */
  @Input() disabled: boolean = false;

  /**
   * Button type attribute
   * @default 'button'
   */
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  /**
   * ARIA label for icon-only buttons
   */
  @Input() ariaLabel?: string;

  /**
   * Emits when the button is clicked
   */
  @Output() buttonClick = new EventEmitter<CustomEvent>();

  private clickListener?: (event: Event) => void;

  ngAfterViewInit(): void {
    // Listen to the custom event from the web component
    this.clickListener = (event: Event) => {
      this.buttonClick.emit(event as CustomEvent);
    };

    this.buttonElement.nativeElement.addEventListener(
      'kds-button-click',
      this.clickListener
    );
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.buttonElement.nativeElement.removeEventListener(
        'kds-button-click',
        this.clickListener
      );
    }
  }
}
