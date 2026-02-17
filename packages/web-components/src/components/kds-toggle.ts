/**
 * @package @kds/web-components
 * @component kds-toggle
 * @description Toggle/Switch component from Untitled UI design system
 * @author Kilian Sala <kilian@kapsch.net>
 * @source Figma: Untitled UI - FREE Figma UI kit v2.0
 *
 * Extracted from Figma via MCP on 2026-02-11
 * Frame nodeId: 1102:4208
 */

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

export type ToggleSize = 'sm' | 'md';

/**
 * Toggle/Switch component built with LIT
 *
 * @example
 * ```html
 * <!-- Basic toggle -->
 * <kds-toggle aria-label="Enable notifications"></kds-toggle>
 *
 * <!-- Pressed (on) -->
 * <kds-toggle pressed>Remember me</kds-toggle>
 *
 * <!-- With supporting text -->
 * <kds-toggle supporting-text="Save my login details for next time.">
 *   Remember me
 * </kds-toggle>
 *
 * <!-- Disabled -->
 * <kds-toggle disabled>Cannot change</kds-toggle>
 *
 * <!-- Small size -->
 * <kds-toggle size="sm" aria-label="Dark mode"></kds-toggle>
 * ```
 *
 * @fires {CustomEvent} kds-toggle-change - Fired when toggle value changes
 * @fires {CustomEvent} kds-toggle-focus - Fired when toggle receives focus
 * @fires {CustomEvent} kds-toggle-blur - Fired when toggle loses focus
 */
@customElement('kds-toggle')
export class KdsToggle extends LitElement {
  static override styles = css`
    :host {
      display: inline-flex;
      align-items: flex-start;
      gap: var(--kds-toggle-gap, 12px);
      font-family: var(--kds-font-family, 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
      cursor: pointer;
      user-select: none;
    }

    :host([disabled]) {
      cursor: not-allowed;
    }

    .toggle-wrapper {
      display: inline-flex;
      align-items: flex-start;
      gap: var(--kds-toggle-gap, 12px);
    }

    /* Hidden native checkbox for accessibility */
    input[type="checkbox"] {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
      pointer-events: none;
    }

    /* Track - the pill-shaped container */
    .track {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      border-radius: 12px;
      padding: 2px;
      overflow: hidden;
      transition: background-color 0.2s ease;
      box-sizing: border-box;
      position: relative;
    }

    /* Track sizes from Figma */
    .track.size-sm {
      width: 36px;
      height: 20px;
    }

    .track.size-md {
      width: 44px;
      height: 24px;
    }

    /* Track colors: OFF states */
    .track {
      background-color: var(--kds-color-gray-100, #F5F5F5);
    }

    :host(:not([disabled])) .track:hover {
      background-color: var(--kds-color-gray-200, #E9EAEB);
    }

    /* Track colors: ON states */
    .track.pressed {
      background-color: var(--kds-color-brand-600, #7F56D9);
      justify-content: flex-end;
    }

    :host(:not([disabled])) .track.pressed:hover {
      background-color: var(--kds-color-brand-600, #7F56D9);
    }

    /* Focus state - OFF */
    input[type="checkbox"]:focus-visible + .track {
      background-color: var(--kds-color-gray-50, #FAFAFA);
      box-shadow: 0 0 0 4px var(--kds-color-brand-50, #F4EBFF);
    }

    /* Focus state - ON */
    input[type="checkbox"]:focus-visible + .track.pressed {
      background-color: var(--kds-color-brand-600, #7F56D9);
      box-shadow: 0 0 0 4px var(--kds-color-brand-50, #F4EBFF);
    }

    /* Disabled state */
    :host([disabled]) .track {
      background-color: var(--kds-color-gray-100, #F5F5F5);
    }

    :host([disabled]) .track.pressed {
      background-color: var(--kds-color-gray-100, #F5F5F5);
    }

    /* Knob - the circular handle */
    .knob {
      border-radius: 50%;
      background-color: var(--kds-color-white, #FFFFFF);
      box-shadow: 0 1px 2px rgba(10, 13, 18, 0.06), 0 1px 3px rgba(10, 13, 18, 0.10);
      flex-shrink: 0;
      transition: transform 0.2s ease;
    }

    .knob.size-sm {
      width: 16px;
      height: 16px;
    }

    .knob.size-md {
      width: 20px;
      height: 20px;
    }

    /* Disabled knob - dimmed */
    :host([disabled]) .knob {
      background-color: var(--kds-color-gray-50, #FAFAFA);
    }

    /* Text container */
    .text-container {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
      flex: 1;
    }

    /* Label text - from Figma typography */
    .label {
      font-weight: 500; /* Medium */
      color: var(--kds-color-gray-700, #414651);
    }

    .label.size-sm {
      font-size: 14px;
      line-height: 20px;
    }

    .label.size-md {
      font-size: 16px;
      line-height: 24px;
    }

    :host([disabled]) .label {
      color: var(--kds-color-gray-600, #535862);
    }

    /* Supporting text - from Figma typography */
    .supporting-text {
      font-weight: 400; /* Regular */
      color: var(--kds-color-gray-600, #535862);
    }

    .supporting-text.size-sm {
      font-size: 14px;
      line-height: 20px;
    }

    .supporting-text.size-md {
      font-size: 16px;
      line-height: 24px;
    }
  `;

  /**
   * Toggle size variant
   * @default 'sm'
   */
  @property({ type: String, reflect: true })
  size: ToggleSize = 'sm';

  /**
   * Whether the toggle is pressed (on)
   * @default false
   */
  @property({ type: Boolean, reflect: true })
  pressed = false;

  /**
   * Whether the toggle is disabled
   * @default false
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Supporting/helper text displayed below the label
   */
  @property({ type: String, attribute: 'supporting-text' })
  supportingText?: string;

  /**
   * Name attribute for form submission
   */
  @property({ type: String })
  name?: string;

  /**
   * Value attribute for form submission
   * @default 'on'
   */
  @property({ type: String })
  value = 'on';

  /**
   * ARIA label for accessibility (required if no label text)
   */
  @property({ type: String, attribute: 'aria-label' })
  override ariaLabel: string | null = null;

  /**
   * ARIA described-by for associating with help text
   */
  @property({ type: String, attribute: 'aria-describedby' })
  ariaDescribedBy?: string;

  private _handleChange(event: Event) {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    const target = event.target as HTMLInputElement;
    this.pressed = target.checked;

    this.dispatchEvent(
      new CustomEvent('kds-toggle-change', {
        detail: {
          pressed: this.pressed,
          value: this.value,
          originalEvent: event,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleFocus(event: FocusEvent) {
    if (this.disabled) return;

    this.dispatchEvent(
      new CustomEvent('kds-toggle-focus', {
        detail: { originalEvent: event },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleBlur(event: FocusEvent) {
    if (this.disabled) return;

    this.dispatchEvent(
      new CustomEvent('kds-toggle-blur', {
        detail: { originalEvent: event },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleClick(event: MouseEvent) {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  override render() {
    const trackClasses = {
      track: true,
      [`size-${this.size}`]: true,
      pressed: this.pressed,
    };

    const knobClasses = {
      knob: true,
      [`size-${this.size}`]: true,
    };

    const labelClasses = {
      label: true,
      [`size-${this.size}`]: true,
    };

    const supportingClasses = {
      'supporting-text': true,
      [`size-${this.size}`]: true,
    };

    const hasLabel = this._hasLabelSlot();
    const hasSupportingText = !!this.supportingText;

    return html`
      <label class="toggle-wrapper" @click=${this._handleClick}>
        <input
          type="checkbox"
          role="switch"
          .checked=${this.pressed}
          ?disabled=${this.disabled}
          name=${this.name || nothing}
          value=${this.value}
          aria-label=${this.ariaLabel || nothing}
          aria-describedby=${this.ariaDescribedBy || nothing}
          aria-checked=${this.pressed ? 'true' : 'false'}
          @change=${this._handleChange}
          @focus=${this._handleFocus}
          @blur=${this._handleBlur}
        />

        <span class=${classMap(trackClasses)} role="presentation">
          <span class=${classMap(knobClasses)}></span>
        </span>

        ${hasLabel || hasSupportingText
          ? html`
              <span class="text-container">
                ${hasLabel
                  ? html`<span class=${classMap(labelClasses)}><slot></slot></span>`
                  : nothing}
                ${hasSupportingText
                  ? html`<span class=${classMap(supportingClasses)}>${this.supportingText}</span>`
                  : nothing}
              </span>
            `
          : nothing}
      </label>
    `;
  }

  private _hasLabelSlot(): boolean {
    return this.textContent?.trim() !== '';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-toggle': KdsToggle;
  }
}
