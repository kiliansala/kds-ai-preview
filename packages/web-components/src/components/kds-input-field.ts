/**
 * @package @kds/web-components
 * @component kds-input-field
 * @description Input field component from Untitled UI design system
 * @author Kilian Sala <kilian@kapsch.net>
 * @source Figma: Untitled UI - FREE Figma UI kit v2.0
 *
 * Extracted from Figma via MCP on 2026-02-18
 * Frame nodeId: 1090:57817
 */

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';

export type InputFieldType =
  | 'default'
  | 'leading-dropdown'
  | 'trailing-dropdown'
  | 'leading-text'
  | 'payment';

/**
 * Input Field component built with LIT
 *
 * @example
 * ```html
 * <!-- Basic input -->
 * <kds-input-field placeholder="olivia@untitledui.com"></kds-input-field>
 *
 * <!-- With label and hint -->
 * <kds-input-field
 *   label="Email"
 *   hint="This is a hint text to help user."
 *   placeholder="olivia@untitledui.com"
 *   input-type="email"
 * ></kds-input-field>
 *
 * <!-- Destructive (error) state -->
 * <kds-input-field
 *   label="Email"
 *   hint="This email is already in use."
 *   destructive
 * ></kds-input-field>
 *
 * <!-- With leading icon -->
 * <kds-input-field label="Email" leading-icon>
 *   <svg slot="leading-icon" ...></svg>
 * </kds-input-field>
 *
 * <!-- Leading text variant -->
 * <kds-input-field
 *   type="leading-text"
 *   leading-text="http://"
 *   label="Website"
 * ></kds-input-field>
 *
 * <!-- Leading dropdown variant (e.g. phone with country code) -->
 * <kds-input-field type="leading-dropdown" label="Phone number" input-type="tel">
 *   <button slot="leading-dropdown">+1 ▾</button>
 * </kds-input-field>
 *
 * <!-- Disabled -->
 * <kds-input-field label="Email" disabled></kds-input-field>
 * ```
 *
 * @fires {CustomEvent<{value:string}>} kds-input  - Fired on every input change
 * @fires {CustomEvent<{value:string}>} kds-change - Fired on blur after value change
 * @fires {CustomEvent<void>}           kds-help-click - Fired when help icon clicked
 *
 * @slot leading-icon     - SVG icon shown on left inside the input (requires leading-icon attr)
 * @slot leading-dropdown - Dropdown trigger for type="leading-dropdown"
 * @slot trailing-dropdown- Dropdown trigger for type="trailing-dropdown"
 */
@customElement('kds-input-field')
export class KdsInputField extends LitElement {
  static override styles = css`
    :host {
      display: block;
      font-family: var(--kds-font-family, 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
      box-sizing: border-box;
    }

    *,
    *::before,
    *::after {
      box-sizing: inherit;
    }

    /* === FIELD WRAPPER === */
    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
    }

    /* === LABEL === */
    .label {
      display: block;
      margin: 0;
      font-size: 14px;
      line-height: 20px;
      font-weight: 500;
      color: var(--kds-input-label-color, #414651);
    }

    .field.destructive .label {
      color: var(--kds-input-label-error-color, #414651);
    }

    .field.disabled .label {
      color: var(--kds-input-disabled-text, #A4ACBA);
    }

    /* === INPUT WRAPPER (the visible "box") === */
    .input-wrapper {
      display: flex;
      align-items: center;
      width: 100%;
      background-color: var(--kds-input-bg, #FFFFFF);
      border: 1px solid var(--kds-input-border, #D5D7DA);
      border-radius: 8px;
      box-shadow: 0px 1px 2px 0px rgba(10, 13, 18, 0.05);
      overflow: hidden;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    /* Focus ring — applied to wrapper when native input is focused */
    .input-wrapper:focus-within {
      border-color: var(--kds-input-border-focused, #D6BBFB);
      box-shadow: 0px 0px 0px 4px #F4EBFF, 0px 1px 2px 0px rgba(10, 13, 18, 0.05);
      outline: none;
    }

    /* Destructive (error) state */
    .field.destructive .input-wrapper {
      border-color: var(--kds-input-border-error, #FDA29B);
    }

    .field.destructive .input-wrapper:focus-within {
      border-color: var(--kds-input-border-error, #FDA29B);
      box-shadow: 0px 0px 0px 4px #FEF3F2, 0px 1px 2px 0px rgba(10, 13, 18, 0.05);
    }

    /* Disabled state */
    .field.disabled .input-wrapper {
      background-color: var(--kds-input-bg-disabled, #F9FAFB);
      border-color: var(--kds-input-border, #D5D7DA);
      box-shadow: none;
      cursor: not-allowed;
    }

    .field.disabled .input-wrapper:focus-within {
      border-color: var(--kds-input-border, #D5D7DA);
      box-shadow: none;
    }

    /* === LEADING AREA (dropdown / text prefix / icon) === */
    .leading-dropdown-slot {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      border-right: 1px solid #D5D7DA;
    }

    .leading-text-prefix {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      padding: 10px 0 10px 14px;
      font-size: 16px;
      line-height: 24px;
      font-weight: 400;
      color: #717680;
      white-space: nowrap;
      user-select: none;
    }

    .field.disabled .leading-text-prefix {
      color: #A4ACBA;
    }

    /* === CONTENT AREA === */
    .content {
      display: flex;
      align-items: center;
      flex: 1 0 0;
      gap: 8px;
      padding: 10px 14px;
      min-width: 0;
    }

    /* When leading text is shown, content has no left padding (text prefix provides it) */
    .has-leading-text .content {
      padding-left: 4px;
    }

    /* When leading dropdown is shown, content has reduced left padding */
    .has-leading-dropdown .content {
      padding-left: 12px;
    }

    /* === LEADING ICON SLOT === */
    .leading-icon-slot {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      color: #717680;
    }

    ::slotted([slot="leading-icon"]) {
      width: 20px;
      height: 20px;
      color: inherit;
      flex-shrink: 0;
    }

    /* === NATIVE INPUT === */
    input {
      flex: 1 0 0;
      min-width: 0;
      border: none;
      outline: none;
      background: transparent;
      font-family: inherit;
      font-size: 16px;
      line-height: 24px;
      font-weight: 400;
      color: #181D27;
      padding: 0;
      margin: 0;
    }

    input::placeholder {
      color: #717680;
    }

    input:disabled {
      color: #A4ACBA;
      cursor: not-allowed;
    }

    input:disabled::placeholder {
      color: #A4ACBA;
    }

    /* === TRAILING ICONS === */
    .trailing-icons {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    .help-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      padding: 0;
      border: none;
      background: none;
      cursor: pointer;
      color: #717680;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .help-btn:hover {
      color: #414651;
    }

    .help-btn:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .help-btn svg,
    .alert-icon svg {
      width: 16px;
      height: 16px;
      display: block;
    }

    .alert-icon {
      display: flex;
      align-items: center;
      color: #F04438;
      flex-shrink: 0;
    }

    /* Trailing dropdown slot */
    .trailing-dropdown-slot {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      border-left: 1px solid #D5D7DA;
    }

    /* === HINT TEXT === */
    .hint {
      margin: 0;
      font-size: 14px;
      line-height: 20px;
      font-weight: 400;
      color: var(--kds-input-hint-color, #535862);
    }

    .field.destructive .hint {
      color: var(--kds-input-error-color, #D92D20);
    }

    .field.disabled .hint {
      color: #A4ACBA;
    }
  `;

  /** Visual variant of the input field. Default: 'default'. */
  @property({ type: String, reflect: true })
  type: InputFieldType = 'default';

  /** Label text shown above the input. Empty = no label. */
  @property({ type: String })
  label: string = '';

  /** Helper/hint text shown below. In destructive state, rendered as error message. */
  @property({ type: String })
  hint: string = '';

  /** Placeholder text for the native input. */
  @property({ type: String })
  placeholder: string = '';

  /** Current value of the input (two-way bindable). */
  @property({ type: String })
  value: string = '';

  /** HTML name attribute for form participation. */
  @property({ type: String })
  name: string = '';

  /** HTML input type (text, email, password, number, tel, url…). Default: 'text'. */
  @property({ type: String, attribute: 'input-type' })
  inputType: string = 'text';

  /** Error/destructive state. Red border + alert icon. */
  @property({ type: Boolean, reflect: true })
  destructive: boolean = false;

  /** Disabled state. Prevents interaction. */
  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  /** Show leading icon slot (left inside input). */
  @property({ type: Boolean, reflect: true, attribute: 'leading-icon' })
  leadingIcon: boolean = false;

  /** Show help/question-mark icon button on the right. */
  @property({ type: Boolean, reflect: true, attribute: 'help-icon' })
  helpIcon: boolean = false;

  /**
   * Text prefix for type='leading-text'.
   * E.g. 'http://', '$', 'USD'.
   */
  @property({ type: String, attribute: 'leading-text' })
  leadingText: string = '';

  /** HTML required attribute for native form validation. */
  @property({ type: Boolean })
  required: boolean = false;

  @query('input')
  private _input!: HTMLInputElement;

  @state()
  private _focused: boolean = false;

  private _handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = target.value;
    this.dispatchEvent(
      new CustomEvent('kds-input', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = target.value;
    this.dispatchEvent(
      new CustomEvent('kds-change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleFocus() {
    this._focused = true;
  }

  private _handleBlur() {
    this._focused = false;
  }

  private _handleHelpClick(e: MouseEvent) {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent('kds-help-click', {
        bubbles: true,
        composed: true,
      })
    );
  }

  /** Programmatically focus the native input. */
  override focus(options?: FocusOptions) {
    this._input?.focus(options);
  }

  /** Programmatically blur the native input. */
  override blur() {
    this._input?.blur();
  }

  override render() {
    const hasLeadingDropdown = this.type === 'leading-dropdown';
    const hasTrailingDropdown = this.type === 'trailing-dropdown';
    const hasLeadingText = this.type === 'leading-text' && !!this.leadingText;

    const fieldClasses = {
      field: true,
      destructive: this.destructive,
      disabled: this.disabled,
      focused: this._focused,
    };

    const wrapperClasses = {
      'input-wrapper': true,
      'has-leading-dropdown': hasLeadingDropdown,
      'has-leading-text': hasLeadingText,
    };

    return html`
      <div class=${classMap(fieldClasses)} part="field">

        ${this.label
          ? html`<label class="label" part="label">${this.label}</label>`
          : nothing}

        <div class=${classMap(wrapperClasses)} part="input-wrapper">

          ${hasLeadingDropdown
            ? html`<div class="leading-dropdown-slot" part="leading-dropdown">
                <slot name="leading-dropdown"></slot>
              </div>`
            : nothing}

          ${hasLeadingText
            ? html`<span class="leading-text-prefix" part="leading-text" aria-hidden="true">
                ${this.leadingText}
              </span>`
            : nothing}

          <div class="content" part="content">

            ${this.leadingIcon
              ? html`<div class="leading-icon-slot" part="leading-icon" aria-hidden="true">
                  <slot name="leading-icon">
                    <!-- Default email icon; consumer should override via slot -->
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M1.667 5.833A2.5 2.5 0 0 1 4.167 3.333h11.666a2.5 2.5 0 0 1 2.5 2.5v8.334a2.5 2.5 0 0 1-2.5 2.5H4.167a2.5 2.5 0 0 1-2.5-2.5V5.833Z" stroke="currentColor" stroke-width="1.667" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M1.667 5.833 10 10.833l8.333-5" stroke="currentColor" stroke-width="1.667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </slot>
                </div>`
              : nothing}

            <input
              part="input"
              .type=${this.inputType}
              .value=${live(this.value)}
              name=${ifDefined(this.name || undefined)}
              placeholder=${ifDefined(this.placeholder || undefined)}
              ?disabled=${this.disabled}
              ?required=${this.required}
              aria-label=${ifDefined(!this.label ? (this.placeholder || undefined) : undefined)}
              aria-invalid=${this.destructive ? 'true' : nothing}
              aria-describedby=${ifDefined(this.hint ? 'hint' : undefined)}
              @input=${this._handleInput}
              @change=${this._handleChange}
              @focus=${this._handleFocus}
              @blur=${this._handleBlur}
            />

            ${this._renderTrailingIcons()}
          </div>

          ${hasTrailingDropdown
            ? html`<div class="trailing-dropdown-slot" part="trailing-dropdown">
                <slot name="trailing-dropdown"></slot>
              </div>`
            : nothing}

        </div>

        ${this.hint
          ? html`<p class="hint" part="hint" id="hint">${this.hint}</p>`
          : nothing}

      </div>
    `;
  }

  private _renderTrailingIcons() {
    const hasHelp = this.helpIcon;
    const hasAlert = this.destructive;

    if (!hasHelp && !hasAlert) return nothing;

    return html`
      <div class="trailing-icons" part="trailing-icons">
        ${hasHelp
          ? html`<button
              class="help-btn"
              part="help-btn"
              type="button"
              aria-label="Help"
              ?disabled=${this.disabled}
              @click=${this._handleHelpClick}
            >
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M8 14.667A6.667 6.667 0 1 0 8 1.333a6.667 6.667 0 0 0 0 13.334Z" stroke="currentColor" stroke-width="1.333" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.06 6a2 2 0 0 1 3.887.667c0 1.333-2 2-2 2M8 10.667h.007" stroke="currentColor" stroke-width="1.333" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>`
          : nothing}
        ${hasAlert
          ? html`<span class="alert-icon" part="alert-icon" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5.333v2.334M8 10h.007M8 14.667A6.667 6.667 0 1 0 8 1.333a6.667 6.667 0 0 0 0 13.334Z" stroke="currentColor" stroke-width="1.333" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>`
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-input-field': KdsInputField;
  }
}
