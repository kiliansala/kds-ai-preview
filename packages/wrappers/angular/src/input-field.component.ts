/**
 * @package @kds/angular
 * @component KdsInputFieldComponent
 * @description Angular component wrapper for kds-input-field web component
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import type { InputFieldType } from '@kds/web-components';

/**
 * Angular wrapper for the Input Field web component
 *
 * @example
 * ```typescript
 * import { KdsInputFieldComponent } from '@kds/angular';
 *
 * @Component({
 *   selector: 'app-example',
 *   template: `
 *     <kds-input-field-wrapper
 *       label="Email"
 *       hint="This is a hint text."
 *       placeholder="olivia@untitledui.com"
 *       inputType="email"
 *       [value]="emailValue"
 *       (kdsInput)="onInput($event)"
 *     ></kds-input-field-wrapper>
 *   `
 * })
 * export class AppComponent {
 *   emailValue = '';
 *   onInput(e: CustomEvent<{value:string}>) { this.emailValue = e.detail.value; }
 * }
 * ```
 */
@Component({
  selector: 'kds-input-field-wrapper',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <kds-input-field
      #inputFieldElement
      [attr.type]="type"
      [attr.label]="label || null"
      [attr.hint]="hint || null"
      [attr.placeholder]="placeholder || null"
      [attr.name]="name || null"
      [attr.input-type]="inputType || null"
      [attr.leading-text]="leadingText || null"
      [attr.destructive]="destructive ? '' : null"
      [attr.disabled]="disabled ? '' : null"
      [attr.leading-icon]="leadingIcon ? '' : null"
      [attr.help-icon]="helpIcon ? '' : null"
      [attr.required]="required ? '' : null"
    >
      <ng-content select="[slot=leading-icon]"></ng-content>
      <ng-content select="[slot=leading-dropdown]"></ng-content>
      <ng-content select="[slot=trailing-dropdown]"></ng-content>
    </kds-input-field>
  `,
})
export class KdsInputFieldComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('inputFieldElement') inputFieldElement!: ElementRef<HTMLElement>;

  /** Visual variant. Default: 'default'. */
  @Input() type: InputFieldType = 'default';

  /** Label text above the input. */
  @Input() label: string = '';

  /** Helper/hint text below. In destructive state, styled as error message. */
  @Input() hint: string = '';

  /** Placeholder text for the native input. */
  @Input() placeholder: string = '';

  /** Current input value (for programmatic updates). */
  @Input() value: string = '';

  /** HTML name attribute. */
  @Input() name: string = '';

  /** HTML input type (text, email, password, number…). Default: 'text'. */
  @Input() inputType: string = 'text';

  /** Error/destructive state. */
  @Input() destructive: boolean = false;

  /** Disabled state. */
  @Input() disabled: boolean = false;

  /** Show leading icon slot. */
  @Input() leadingIcon: boolean = false;

  /** Show help icon button. */
  @Input() helpIcon: boolean = false;

  /** Text prefix for type='leading-text'. */
  @Input() leadingText: string = '';

  /** HTML required attribute. */
  @Input() required: boolean = false;

  /** Emitted on every keystroke. */
  @Output() kdsInput = new EventEmitter<CustomEvent<{ value: string }>>();

  /** Emitted on blur after value change. */
  @Output() kdsChange = new EventEmitter<CustomEvent<{ value: string }>>();

  /** Emitted when help icon is clicked. */
  @Output() kdsHelpClick = new EventEmitter<CustomEvent<void>>();

  private _handleInput = (e: Event) =>
    this.kdsInput.emit(e as CustomEvent<{ value: string }>);
  private _handleChange = (e: Event) =>
    this.kdsChange.emit(e as CustomEvent<{ value: string }>);
  private _handleHelpClick = (e: Event) =>
    this.kdsHelpClick.emit(e as CustomEvent<void>);

  ngAfterViewInit(): void {
    const el = this.inputFieldElement.nativeElement;
    el.addEventListener('kds-input', this._handleInput);
    el.addEventListener('kds-change', this._handleChange);
    el.addEventListener('kds-help-click', this._handleHelpClick);
    this._syncValue();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && this.inputFieldElement) {
      this._syncValue();
    }
  }

  ngOnDestroy(): void {
    const el = this.inputFieldElement?.nativeElement;
    if (!el) return;
    el.removeEventListener('kds-input', this._handleInput);
    el.removeEventListener('kds-change', this._handleChange);
    el.removeEventListener('kds-help-click', this._handleHelpClick);
  }

  private _syncValue(): void {
    const el = this.inputFieldElement?.nativeElement as any;
    if (el && this.value !== undefined) {
      el.value = this.value;
    }
  }
}
