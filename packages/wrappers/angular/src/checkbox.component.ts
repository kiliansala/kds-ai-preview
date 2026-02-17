/**
 * @package @kds/angular
 * @component KdsCheckboxComponent
 * @description Angular component wrapper for kds-checkbox web component
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
import type { CheckboxSize } from '@kds/web-components';

/**
 * Angular wrapper for the Checkbox web component
 *
 * @example
 * ```typescript
 * import { KdsCheckboxComponent } from '@kds/angular';
 *
 * @Component({
 *   selector: 'app-example',
 *   template: `
 *     <kds-checkbox-wrapper
 *       size="md"
 *       [checked]="isChecked"
 *       (checkboxChange)="handleChange($event)"
 *     >
 *       Remember me
 *     </kds-checkbox-wrapper>
 *   `
 * })
 * export class ExampleComponent {
 *   isChecked = false;
 *
 *   handleChange(event: CustomEvent) {
 *     this.isChecked = event.detail.checked;
 *     console.log('Checkbox changed!', event);
 *   }
 * }
 * ```
 */
@Component({
  selector: 'kds-checkbox-wrapper',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <kds-checkbox
      #checkboxElement
      [attr.size]="size"
      [attr.checked]="checked ? '' : null"
      [attr.indeterminate]="indeterminate ? '' : null"
      [attr.disabled]="disabled ? '' : null"
      [attr.error]="error ? '' : null"
      [attr.name]="name"
      [attr.value]="value"
      [attr.required]="required ? '' : null"
      [attr.aria-label]="ariaLabel"
      [attr.aria-describedby]="ariaDescribedBy"
    >
      <ng-content></ng-content>
    </kds-checkbox>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }
  `]
})
export class KdsCheckboxComponent implements AfterViewInit, OnDestroy {
  @ViewChild('checkboxElement', { static: true }) checkboxElement!: ElementRef<HTMLElement>;

  /**
   * Checkbox size
   * @default 'md'
   */
  @Input() size: CheckboxSize = 'md';

  /**
   * Whether the checkbox is checked
   * @default false
   */
  @Input() checked: boolean = false;

  /**
   * Whether the checkbox is in indeterminate state
   * @default false
   */
  @Input() indeterminate: boolean = false;

  /**
   * Disabled state
   * @default false
   */
  @Input() disabled: boolean = false;

  /**
   * Error/invalid state
   * @default false
   */
  @Input() error: boolean = false;

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
   * Required attribute for form validation
   * @default false
   */
  @Input() required: boolean = false;

  /**
   * ARIA label for accessibility
   */
  @Input() ariaLabel?: string;

  /**
   * ARIA described-by for help text/error messages
   */
  @Input() ariaDescribedBy?: string;

  /**
   * Emits when the checkbox value changes
   */
  @Output() checkboxChange = new EventEmitter<CustomEvent>();

  /**
   * Emits when the checkbox receives focus
   */
  @Output() checkboxFocus = new EventEmitter<CustomEvent>();

  /**
   * Emits when the checkbox loses focus
   */
  @Output() checkboxBlur = new EventEmitter<CustomEvent>();

  private changeListener?: (event: Event) => void;
  private focusListener?: (event: Event) => void;
  private blurListener?: (event: Event) => void;

  ngAfterViewInit(): void {
    // Listen to the custom events from the web component
    this.changeListener = (event: Event) => {
      this.checkboxChange.emit(event as CustomEvent);
    };

    this.focusListener = (event: Event) => {
      this.checkboxFocus.emit(event as CustomEvent);
    };

    this.blurListener = (event: Event) => {
      this.checkboxBlur.emit(event as CustomEvent);
    };

    this.checkboxElement.nativeElement.addEventListener(
      'kds-checkbox-change',
      this.changeListener
    );

    this.checkboxElement.nativeElement.addEventListener(
      'kds-checkbox-focus',
      this.focusListener
    );

    this.checkboxElement.nativeElement.addEventListener(
      'kds-checkbox-blur',
      this.blurListener
    );
  }

  ngOnDestroy(): void {
    if (this.changeListener) {
      this.checkboxElement.nativeElement.removeEventListener(
        'kds-checkbox-change',
        this.changeListener
      );
    }

    if (this.focusListener) {
      this.checkboxElement.nativeElement.removeEventListener(
        'kds-checkbox-focus',
        this.focusListener
      );
    }

    if (this.blurListener) {
      this.checkboxElement.nativeElement.removeEventListener(
        'kds-checkbox-blur',
        this.blurListener
      );
    }
  }
}
