/**
 * @package @kds/angular
 * @component KdsToggleComponent
 * @description Angular component wrapper for kds-toggle web component
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
import type { ToggleSize } from '@kds/web-components';

/**
 * Angular wrapper for the Toggle web component
 *
 * @example
 * ```typescript
 * import { KdsToggleComponent } from '@kds/angular';
 *
 * @Component({
 *   selector: 'app-example',
 *   template: `
 *     <kds-toggle-wrapper
 *       size="sm"
 *       [pressed]="isPressed"
 *       (toggleChange)="handleChange($event)"
 *     >
 *       Remember me
 *     </kds-toggle-wrapper>
 *   `
 * })
 * export class ExampleComponent {
 *   isPressed = false;
 *
 *   handleChange(event: CustomEvent) {
 *     this.isPressed = event.detail.pressed;
 *   }
 * }
 * ```
 */
@Component({
  selector: 'kds-toggle-wrapper',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <kds-toggle
      #toggleElement
      [attr.size]="size"
      [attr.pressed]="pressed ? '' : null"
      [attr.disabled]="disabled ? '' : null"
      [attr.supporting-text]="supportingText"
      [attr.name]="name"
      [attr.value]="value"
      [attr.aria-label]="ariaLabel"
      [attr.aria-describedby]="ariaDescribedBy"
    >
      <ng-content></ng-content>
    </kds-toggle>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }
  `]
})
export class KdsToggleComponent implements AfterViewInit, OnDestroy {
  @ViewChild('toggleElement', { static: true }) toggleElement!: ElementRef<HTMLElement>;

  /**
   * Toggle size
   * @default 'sm'
   */
  @Input() size: ToggleSize = 'sm';

  /**
   * Whether the toggle is pressed (on)
   * @default false
   */
  @Input() pressed: boolean = false;

  /**
   * Disabled state
   * @default false
   */
  @Input() disabled: boolean = false;

  /**
   * Supporting/helper text below the label
   */
  @Input() supportingText?: string;

  /**
   * Name attribute for form submission
   */
  @Input() name?: string;

  /**
   * Value attribute for form submission
   * @default 'on'
   */
  @Input() value: string = 'on';

  /**
   * ARIA label for accessibility
   */
  @Input() ariaLabel?: string;

  /**
   * ARIA described-by for help text
   */
  @Input() ariaDescribedBy?: string;

  /**
   * Emits when the toggle value changes
   */
  @Output() toggleChange = new EventEmitter<CustomEvent>();

  /**
   * Emits when the toggle receives focus
   */
  @Output() toggleFocus = new EventEmitter<CustomEvent>();

  /**
   * Emits when the toggle loses focus
   */
  @Output() toggleBlur = new EventEmitter<CustomEvent>();

  private changeListener?: (event: Event) => void;
  private focusListener?: (event: Event) => void;
  private blurListener?: (event: Event) => void;

  ngAfterViewInit(): void {
    this.changeListener = (event: Event) => {
      this.toggleChange.emit(event as CustomEvent);
    };

    this.focusListener = (event: Event) => {
      this.toggleFocus.emit(event as CustomEvent);
    };

    this.blurListener = (event: Event) => {
      this.toggleBlur.emit(event as CustomEvent);
    };

    this.toggleElement.nativeElement.addEventListener(
      'kds-toggle-change',
      this.changeListener
    );

    this.toggleElement.nativeElement.addEventListener(
      'kds-toggle-focus',
      this.focusListener
    );

    this.toggleElement.nativeElement.addEventListener(
      'kds-toggle-blur',
      this.blurListener
    );
  }

  ngOnDestroy(): void {
    if (this.changeListener) {
      this.toggleElement.nativeElement.removeEventListener(
        'kds-toggle-change',
        this.changeListener
      );
    }

    if (this.focusListener) {
      this.toggleElement.nativeElement.removeEventListener(
        'kds-toggle-focus',
        this.focusListener
      );
    }

    if (this.blurListener) {
      this.toggleElement.nativeElement.removeEventListener(
        'kds-toggle-blur',
        this.blurListener
      );
    }
  }
}
