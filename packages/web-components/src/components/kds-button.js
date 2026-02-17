/**
 * @package @kds/web-components
 * @component kds-button
 * @description Button component from Untitled UI design system
 * @author Kilian Sala <kilian@kapsch.net>
 * @source Figma: Untitled UI - FREE Figma UI kit v2.0
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
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
let KdsButton = class KdsButton extends LitElement {
    constructor() {
        super(...arguments);
        /**
         * Button size
         * @default 'md'
         */
        this.size = 'md';
        /**
         * Visual hierarchy/style variant
         * @default 'primary'
         */
        this.hierarchy = 'primary';
        /**
         * Icon position relative to text
         * @default 'none'
         */
        this.iconPosition = 'none';
        /**
         * Destructive/danger variant
         * @default false
         */
        this.destructive = false;
        /**
         * Disabled state
         * @default false
         */
        this.disabled = false;
        /**
         * Button type attribute
         * @default 'button'
         */
        this.type = 'button';
        /**
         * ARIA label for icon-only buttons
         */
        this.ariaLabel = null;
    }
    static { this.styles = css `
    :host {
      display: inline-block;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
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
      box-shadow:
        0 0 0 4px var(--kds-color-brand-100, #F4EBFF),
        0 1px 2px 0 rgba(10, 13, 18, 0.05);
    }

    /* Size: Small */
    button.size-sm {
      height: 36px;
      padding: 8px 12px;
      font-size: 14px;
    }

    /* Size: Medium */
    button.size-md {
      height: 40px;
      padding: 10px 16px;
      font-size: 14px;
    }

    /* Size: Large */
    button.size-lg {
      height: 44px;
      padding: 12px 18px;
      font-size: 16px;
    }

    /* Size: Extra Large */
    button.size-xl {
      height: 48px;
      padding: 14px 20px;
      font-size: 16px;
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
      background-color: var(--kds-button-primary-bg, #7F56D9);
      color: var(--kds-button-primary-text, #ffffff);
    }

    button.hierarchy-primary:hover:not(:disabled) {
      background-color: var(--kds-button-primary-hover-bg, #6941C6);
    }

    button.hierarchy-primary:active:not(:disabled) {
      background-color: var(--kds-button-primary-active-bg, #53389E);
    }

    /* Secondary Color Hierarchy */
    button.hierarchy-secondary-color {
      background-color: var(--kds-button-secondary-color-bg, #F4EBFF);
      color: var(--kds-button-secondary-color-text, #6941C6);
    }

    button.hierarchy-secondary-color:hover:not(:disabled) {
      background-color: var(--kds-button-secondary-color-hover-bg, #E9D7FE);
    }

    button.hierarchy-secondary-color:active:not(:disabled) {
      background-color: var(--kds-button-secondary-color-active-bg, #D6BBFB);
    }

    /* Secondary Gray Hierarchy */
    button.hierarchy-secondary-gray {
      background-color: var(--kds-button-secondary-gray-bg, #FAFAFA);
      color: var(--kds-button-secondary-gray-text, #414651);
    }

    button.hierarchy-secondary-gray:hover:not(:disabled) {
      background-color: var(--kds-button-secondary-gray-hover-bg, #E9EAEB);
    }

    button.hierarchy-secondary-gray:active:not(:disabled) {
      background-color: var(--kds-button-secondary-gray-active-bg, #D5D7DA);
    }

    /* Tertiary Color Hierarchy */
    button.hierarchy-tertiary-color {
      background-color: transparent;
      border: 1px solid var(--kds-button-tertiary-color-border, #7F56D9);
      color: var(--kds-button-tertiary-color-text, #7F56D9);
    }

    button.hierarchy-tertiary-color:hover:not(:disabled) {
      background-color: var(--kds-button-tertiary-color-hover-bg, #F9F5FF);
    }

    button.hierarchy-tertiary-color:active:not(:disabled) {
      background-color: var(--kds-button-tertiary-color-active-bg, #F4EBFF);
    }

    /* Tertiary Gray Hierarchy */
    button.hierarchy-tertiary-gray {
      background-color: transparent;
      border: 1px solid var(--kds-button-tertiary-gray-border, #D5D7DA);
      color: var(--kds-button-tertiary-gray-text, #414651);
    }

    button.hierarchy-tertiary-gray:hover:not(:disabled) {
      background-color: var(--kds-button-tertiary-gray-hover-bg, #FAFAFA);
    }

    button.hierarchy-tertiary-gray:active:not(:disabled) {
      background-color: var(--kds-button-tertiary-gray-active-bg, #E9EAEB);
    }

    /* Link Color Hierarchy */
    button.hierarchy-link-color {
      background-color: transparent;
      border: none;
      color: var(--kds-button-link-color-text, #7F56D9);
      padding-left: 0;
      padding-right: 0;
    }

    button.hierarchy-link-color:hover:not(:disabled) {
      color: var(--kds-button-link-color-hover-text, #6941C6);
      text-decoration: underline;
    }

    button.hierarchy-link-color:active:not(:disabled) {
      color: var(--kds-button-link-color-active-text, #53389E);
    }

    /* Link Gray Hierarchy */
    button.hierarchy-link-gray {
      background-color: transparent;
      border: none;
      color: var(--kds-button-link-gray-text, #535862);
      padding-left: 0;
      padding-right: 0;
    }

    button.hierarchy-link-gray:hover:not(:disabled) {
      color: var(--kds-button-link-gray-hover-text, #414651);
      text-decoration: underline;
    }

    button.hierarchy-link-gray:active:not(:disabled) {
      color: var(--kds-button-link-gray-active-text, #252B37);
    }

    /* Destructive Variant */
    button.destructive {
      background-color: var(--kds-button-destructive-bg, #D92D20);
      color: var(--kds-button-destructive-text, #ffffff);
    }

    button.destructive:hover:not(:disabled) {
      background-color: var(--kds-button-destructive-hover-bg, #B42318);
    }

    button.destructive:active:not(:disabled) {
      background-color: var(--kds-button-destructive-active-bg, #912018);
    }

    button.destructive.hierarchy-secondary-color {
      background-color: var(--kds-button-destructive-secondary-bg, #FEE4E2);
      color: var(--kds-button-destructive-secondary-text, #B42318);
    }

    button.destructive.hierarchy-tertiary-color {
      background-color: transparent;
      border-color: var(--kds-button-destructive-tertiary-border, #D92D20);
      color: var(--kds-button-destructive-tertiary-text, #D92D20);
    }

    button.destructive.hierarchy-link-color {
      color: var(--kds-button-destructive-link-text, #D92D20);
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
  `; }
    handleClick(event) {
        if (this.disabled) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        // Dispatch custom event
        this.dispatchEvent(new CustomEvent('kds-button-click', {
            detail: { originalEvent: event },
            bubbles: true,
            composed: true,
        }));
    }
    handleKeyDown(event) {
        if (this.disabled) {
            return;
        }
        // Handle Enter and Space for accessibility
        if (event.key === 'Enter' || event.key === ' ') {
            if (event.key === ' ') {
                event.preventDefault(); // Prevent page scroll
            }
            this.handleClick(event);
        }
    }
    render() {
        const classes = {
            [`size-${this.size}`]: true,
            [`hierarchy-${this.hierarchy}`]: true,
            'icon-only': this.iconPosition === 'only',
            destructive: this.destructive,
        };
        const hasIcon = this.iconPosition !== 'none' && this.iconPosition !== 'dot';
        const showDot = this.iconPosition === 'dot';
        const isIconOnly = this.iconPosition === 'only';
        return html `
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
            ? html `<slot name="icon"></slot>`
            : nothing}
        ${showDot ? html `<span class="dot-indicator"></span>` : nothing}
        ${!isIconOnly ? html `<slot></slot>` : nothing}
        ${hasIcon && this.iconPosition === 'trailing'
            ? html `<slot name="icon"></slot>`
            : nothing}
        ${isIconOnly ? html `<slot name="icon"></slot>` : nothing}
      </button>
    `;
    }
};
__decorate([
    property({ type: String, reflect: true })
], KdsButton.prototype, "size", void 0);
__decorate([
    property({ type: String, reflect: true })
], KdsButton.prototype, "hierarchy", void 0);
__decorate([
    property({ type: String, attribute: 'icon-position', reflect: true })
], KdsButton.prototype, "iconPosition", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], KdsButton.prototype, "destructive", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], KdsButton.prototype, "disabled", void 0);
__decorate([
    property({ type: String })
], KdsButton.prototype, "type", void 0);
__decorate([
    property({ type: String, attribute: 'aria-label' })
], KdsButton.prototype, "ariaLabel", void 0);
KdsButton = __decorate([
    customElement('kds-button')
], KdsButton);
export { KdsButton };
//# sourceMappingURL=kds-button.js.map