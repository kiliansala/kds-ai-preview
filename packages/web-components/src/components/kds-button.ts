/**
 * @package @kds/web-components
 * @component kds-button
 * @description Button component from Untitled UI design system
 * @author Kilian Sala <kilian@kapsch.net>
 * @source Figma: Untitled UI - FREE Figma UI kit v2.0
 */

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
export type ButtonHierarchy = 
  | 'primary' 
  | 'secondary-color' 
  | 'secondary-gray' 
  | 'tertiary-color' 
  | 'tertiary-gray' 
  | 'link-color' 
  | 'link-gray';
export type IconPosition = 'none' | 'leading' | 'trailing' | 'dot' | 'only';

/**
 * Button component built with LIT
 * 
 * @example
 * ```html
 * <kds-button size="md" hierarchy="primary">Click me</kds-button>
 * <kds-button size="lg" hierarchy="secondary-color" icon-position="leading">
 *   <svg slot="icon">...</svg>
 *   Button Text
 * </kds-button>
 * ```
 */
@customElement('kds-button')
export class KdsButton extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
      font-family: var(--kds-font-family, 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--kds-button-gap, 8px);
      border: none;
      border-radius: var(--kds-button-border-radius, 8px);
      font-weight: var(--kds-text-sm-font-weight, 600);
      line-height: 1.5;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
      white-space: nowrap;
      user-select: none;
      position: relative;
      box-sizing: border-box;
    }

    button:focus-visible {
      outline: none;
      box-shadow: var(--kds-shadow-xs-focused-primary, 0 0 0 4px #F4EBFF, 0 1px 2px 0 rgba(10, 13, 18, 0.05));
    }

    /* Size: Small */
    button.size-sm {
      height: var(--kds-button-height-sm, 36px);
      padding: var(--kds-button-padding-y-sm, 8px) var(--kds-button-padding-x-sm, 12px);
      font-size: var(--kds-text-sm-font-size, 14px);
      line-height: var(--kds-text-sm-line-height, 20px);
    }

    /* Size: Medium */
    button.size-md {
      height: var(--kds-button-height-md, 40px);
      padding: var(--kds-button-padding-y-md, 10px) var(--kds-button-padding-x-md, 16px);
      font-size: var(--kds-text-sm-font-size, 14px);
      line-height: var(--kds-text-sm-line-height, 20px);
    }

    /* Size: Large */
    button.size-lg {
      height: var(--kds-button-height-lg, 44px);
      padding: var(--kds-button-padding-y-lg, 12px) var(--kds-button-padding-x-lg, 18px);
      font-size: var(--kds-text-md-font-size, 16px);
      line-height: var(--kds-text-md-line-height, 24px);
    }

    /* Size: Extra Large */
    button.size-xl {
      height: var(--kds-button-height-xl, 48px);
      padding: var(--kds-button-padding-y-xl, 14px) var(--kds-button-padding-x-xl, 20px);
      font-size: var(--kds-text-md-font-size, 16px);
      line-height: var(--kds-text-md-line-height, 24px);
    }

    /* Icon-only buttons */
    button.icon-only.size-sm {
      width: 36px;
      padding: 8px;
    }

    button.icon-only.size-md {
      width: 40px;
      padding: 10px;
    }

    button.icon-only.size-lg {
      width: 44px;
      padding: 12px;
    }

    button.icon-only.size-xl {
      width: 48px;
      padding: 14px;
    }

    /* Primary Hierarchy */
    button.hierarchy-primary {
      background-color: var(--kds-button-primary-bg, var(--kds-color-brand-600, #7F56D9));
      color: var(--kds-button-primary-text, var(--kds-color-white, #ffffff));
      box-shadow: var(--kds-shadow-xs, 0 1px 2px 0 rgba(10, 13, 18, 0.05));
    }

    button.hierarchy-primary:hover:not(:disabled) {
      background-color: var(--kds-button-primary-hover-bg, var(--kds-color-brand-700, #6941C6));
    }

    button.hierarchy-primary:active:not(:disabled) {
      background-color: var(--kds-button-primary-active-bg, var(--kds-color-brand-800, #53389E));
    }

    /* Secondary Color Hierarchy */
    button.hierarchy-secondary-color {
      background-color: var(--kds-button-secondary-color-bg, var(--kds-color-brand-100, #F4EBFF));
      color: var(--kds-button-secondary-color-text, var(--kds-color-brand-700, #6941C6));
      box-shadow: var(--kds-shadow-xs, 0 1px 2px 0 rgba(10, 13, 18, 0.05));
    }

    button.hierarchy-secondary-color:hover:not(:disabled) {
      background-color: var(--kds-button-secondary-color-hover-bg, var(--kds-color-brand-200, #E9D7FE));
    }

    button.hierarchy-secondary-color:active:not(:disabled) {
      background-color: var(--kds-button-secondary-color-active-bg, var(--kds-color-brand-300, #D6BBFB));
    }

    /* Secondary Gray Hierarchy */
    button.hierarchy-secondary-gray {
      background-color: var(--kds-button-secondary-gray-bg, var(--kds-color-gray-50, #FAFAFA));
      color: var(--kds-button-secondary-gray-text, var(--kds-color-gray-700, #414651));
      box-shadow: var(--kds-shadow-xs, 0 1px 2px 0 rgba(10, 13, 18, 0.05));
    }

    button.hierarchy-secondary-gray:hover:not(:disabled) {
      background-color: var(--kds-button-secondary-gray-hover-bg, var(--kds-color-gray-200, #E9EAEB));
    }

    button.hierarchy-secondary-gray:active:not(:disabled) {
      background-color: var(--kds-button-secondary-gray-active-bg, var(--kds-color-gray-300, #D5D7DA));
    }

    /* Tertiary Color Hierarchy */
    button.hierarchy-tertiary-color {
      background-color: transparent;
      border: 1px solid var(--kds-button-tertiary-color-border, var(--kds-color-brand-600, #7F56D9));
      color: var(--kds-button-tertiary-color-text, var(--kds-color-brand-600, #7F56D9));
    }

    button.hierarchy-tertiary-color:hover:not(:disabled) {
      background-color: var(--kds-button-tertiary-color-hover-bg, var(--kds-color-brand-50, #F9F5FF));
    }

    button.hierarchy-tertiary-color:active:not(:disabled) {
      background-color: var(--kds-button-tertiary-color-active-bg, var(--kds-color-brand-100, #F4EBFF));
    }

    /* Tertiary Gray Hierarchy */
    button.hierarchy-tertiary-gray {
      background-color: transparent;
      border: 1px solid var(--kds-button-tertiary-gray-border, var(--kds-color-gray-300, #D5D7DA));
      color: var(--kds-button-tertiary-gray-text, var(--kds-color-gray-700, #414651));
    }

    button.hierarchy-tertiary-gray:hover:not(:disabled) {
      background-color: var(--kds-button-tertiary-gray-hover-bg, var(--kds-color-gray-50, #FAFAFA));
    }

    button.hierarchy-tertiary-gray:active:not(:disabled) {
      background-color: var(--kds-button-tertiary-gray-active-bg, var(--kds-color-gray-200, #E9EAEB));
    }

    /* Link Color Hierarchy */
    button.hierarchy-link-color {
      background-color: transparent;
      border: none;
      color: var(--kds-button-link-color-text, var(--kds-color-brand-600, #7F56D9));
      padding-left: 0;
      padding-right: 0;
    }

    button.hierarchy-link-color:hover:not(:disabled) {
      color: var(--kds-button-link-color-hover-text, var(--kds-color-brand-700, #6941C6));
      text-decoration: underline;
    }

    button.hierarchy-link-color:active:not(:disabled) {
      color: var(--kds-button-link-color-active-text, var(--kds-color-brand-800, #53389E));
    }

    /* Link Gray Hierarchy */
    button.hierarchy-link-gray {
      background-color: transparent;
      border: none;
      color: var(--kds-button-link-gray-text, var(--kds-color-gray-600, #535862));
      padding-left: 0;
      padding-right: 0;
    }

    button.hierarchy-link-gray:hover:not(:disabled) {
      color: var(--kds-button-link-gray-hover-text, var(--kds-color-gray-700, #414651));
      text-decoration: underline;
    }

    button.hierarchy-link-gray:active:not(:disabled) {
      color: var(--kds-button-link-gray-active-text, var(--kds-color-gray-800, #252B37));
    }

    /* Destructive Variant */
    button.destructive {
      background-color: var(--kds-button-destructive-bg, var(--kds-color-error-600, #D92D20));
      color: var(--kds-button-destructive-text, var(--kds-color-white, #ffffff));
    }

    button.destructive:hover:not(:disabled) {
      background-color: var(--kds-button-destructive-hover-bg, var(--kds-color-error-700, #B42318));
    }

    button.destructive:active:not(:disabled) {
      background-color: var(--kds-button-destructive-active-bg, var(--kds-color-error-800, #912018));
    }

    button.destructive:focus-visible {
      box-shadow: var(--kds-shadow-xs-focused-error, 0 0 0 4px #FEE4E2, 0 1px 2px 0 rgba(10, 13, 18, 0.05));
    }

    button.destructive.hierarchy-secondary-color {
      background-color: var(--kds-button-destructive-secondary-bg, var(--kds-color-error-100, #FEE4E2));
      color: var(--kds-button-destructive-secondary-text, var(--kds-color-error-700, #B42318));
    }

    button.destructive.hierarchy-tertiary-color {
      background-color: transparent;
      border-color: var(--kds-button-destructive-tertiary-border, var(--kds-color-error-600, #D92D20));
      color: var(--kds-button-destructive-tertiary-text, var(--kds-color-error-600, #D92D20));
    }

    button.destructive.hierarchy-link-color {
      color: var(--kds-button-destructive-link-text, var(--kds-color-error-600, #D92D20));
    }

    /* Disabled State */
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    /* Icon Styles */
    ::slotted([slot="icon"]) {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    button.icon-only ::slotted([slot="icon"]) {
      width: 100%;
      height: 100%;
    }

    /* Dot indicator */
    .dot-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: currentColor;
      flex-shrink: 0;
    }
  `;

  /**
   * Button size
   * @default 'md'
   */
  @property({ type: String, reflect: true })
  size: ButtonSize = 'md';

  /**
   * Visual hierarchy/style variant
   * @default 'primary'
   */
  @property({ type: String, reflect: true })
  hierarchy: ButtonHierarchy = 'primary';

  /**
   * Icon position relative to text
   * @default 'none'
   */
  @property({ type: String, attribute: 'icon-position', reflect: true })
  iconPosition: IconPosition = 'none';

  /**
   * Destructive/danger variant
   * @default false
   */
  @property({ type: Boolean, reflect: true })
  destructive = false;

  /**
   * Disabled state
   * @default false
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Button type attribute
   * @default 'button'
   */
  @property({ type: String })
  type: 'button' | 'submit' | 'reset' = 'button';

  /**
   * ARIA label for icon-only buttons
   */
  @property({ type: String, attribute: 'aria-label' })
  ariaLabel: string | null = null;

  private handleClick(event: MouseEvent) {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // Dispatch custom event
    this.dispatchEvent(
      new CustomEvent('kds-button-click', {
        detail: { originalEvent: event },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (this.disabled) {
      return;
    }

    // Handle Enter and Space for accessibility
    if (event.key === 'Enter' || event.key === ' ') {
      if (event.key === ' ') {
        event.preventDefault(); // Prevent page scroll
      }
      this.handleClick(event as unknown as MouseEvent);
    }
  }

  override render() {
    const classes = {
      [`size-${this.size}`]: true,
      [`hierarchy-${this.hierarchy}`]: true,
      'icon-only': this.iconPosition === 'only',
      destructive: this.destructive,
    };

    const hasIcon = this.iconPosition !== 'none' && this.iconPosition !== 'dot';
    const showDot = this.iconPosition === 'dot';
    const isIconOnly = this.iconPosition === 'only';

    return html`
      <button
        type=${this.type}
        class=${classMap(classes)}
        ?disabled=${this.disabled}
        aria-label=${this.ariaLabel || nothing}
        aria-disabled=${this.disabled ? 'true' : nothing}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
      >
        ${hasIcon && this.iconPosition === 'leading'
          ? html`<slot name="icon"></slot>`
          : nothing}
        ${showDot ? html`<span class="dot-indicator"></span>` : nothing}
        ${!isIconOnly ? html`<slot></slot>` : nothing}
        ${hasIcon && this.iconPosition === 'trailing'
          ? html`<slot name="icon"></slot>`
          : nothing}
        ${isIconOnly ? html`<slot name="icon"></slot>` : nothing}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-button': KdsButton;
  }
}
