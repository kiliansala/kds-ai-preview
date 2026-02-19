/**
 * @package @kds/web-components
 * @component kds-badge
 * @description Badge component from Untitled UI design system
 * @author Kilian Sala <kilian@kapsch.net>
 * @source Figma: Untitled UI - FREE Figma UI kit v2.0
 *
 * Extracted from Figma via MCP on 2026-02-18
 * Frame nodeId: 1046:3819
 */

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeColor =
  | 'gray' | 'primary' | 'error' | 'warning' | 'success'
  | 'blue-gray' | 'blue-light' | 'blue' | 'indigo' | 'purple'
  | 'pink' | 'rose' | 'orange';
export type BadgeIcon = 'false' | 'dot' | 'country' | 'avatar' | 'x-close' | 'icon-right' | 'icon-left' | 'only';

/**
 * Badge component built with LIT
 *
 * @example
 * ```html
 * <!-- Basic badge -->
 * <kds-badge>Label</kds-badge>
 *
 * <!-- With dot indicator -->
 * <kds-badge icon="dot">Label</kds-badge>
 *
 * <!-- Dismissible -->
 * <kds-badge icon="x-close">Label</kds-badge>
 *
 * <!-- With icon -->
 * <kds-badge icon="icon-left">
 *   <svg slot="icon" ...></svg>
 *   Label
 * </kds-badge>
 *
 * <!-- Icon only -->
 * <kds-badge icon="only" aria-label="Add item">
 *   <svg slot="icon" ...></svg>
 * </kds-badge>
 *
 * <!-- Different sizes and colors -->
 * <kds-badge size="lg" color="success">Active</kds-badge>
 * <kds-badge size="md" color="error">Failed</kds-badge>
 * ```
 *
 * @fires {CustomEvent} kds-badge-dismiss - Fired when x-close button is clicked
 */
@customElement('kds-badge')
export class KdsBadge extends LitElement {
  static override styles = css`
    :host {
      display: inline-flex;
      font-family: var(--kds-font-family, 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      border-radius: 9999px;
      font-weight: 500;
      white-space: nowrap;
      box-sizing: border-box;
      border: 1px solid transparent;
    }

    /* === SIZES === */
    .badge.size-sm {
      height: 22px;
      padding: 2px 8px;
      gap: 4px;
      font-size: 12px;
      line-height: 18px;
    }

    .badge.size-md {
      height: 24px;
      padding: 2px 10px;
      gap: 5px;
      font-size: 14px;
      line-height: 20px;
    }

    .badge.size-lg {
      height: 28px;
      padding: 4px 12px;
      gap: 6px;
      font-size: 14px;
      line-height: 20px;
    }

    /* Icon-only sizing */
    .badge.icon-only {
      padding: 0;
      justify-content: center;
    }

    .badge.icon-only.size-sm {
      width: 20px;
      height: 20px;
    }

    .badge.icon-only.size-md {
      width: 24px;
      height: 24px;
    }

    .badge.icon-only.size-lg {
      width: 28px;
      height: 28px;
    }

    /* === COLORS === */

    /* Gray */
    .badge.color-gray {
      background-color: var(--kds-badge-gray-bg, #F5F5F5);
      color: var(--kds-badge-gray-text, #414651);
    }

    /* Primary */
    .badge.color-primary {
      background-color: var(--kds-badge-primary-bg, #F9F5FF);
      color: var(--kds-badge-primary-text, #6941C6);
    }

    /* Error */
    .badge.color-error {
      background-color: var(--kds-badge-error-bg, #FEF3F2);
      color: var(--kds-badge-error-text, #B42318);
    }

    /* Warning */
    .badge.color-warning {
      background-color: var(--kds-badge-warning-bg, #FFFAEB);
      color: var(--kds-badge-warning-text, #B54708);
    }

    /* Success */
    .badge.color-success {
      background-color: var(--kds-badge-success-bg, #ECFDF3);
      color: var(--kds-badge-success-text, #027A48);
    }

    /* Blue Gray */
    .badge.color-blue-gray {
      background-color: var(--kds-badge-blue-gray-bg, #F8F9FC);
      color: var(--kds-badge-blue-gray-text, #363F72);
    }

    /* Blue Light */
    .badge.color-blue-light {
      background-color: var(--kds-badge-blue-light-bg, #F0F9FF);
      color: var(--kds-badge-blue-light-text, #026AA2);
    }

    /* Blue */
    .badge.color-blue {
      background-color: var(--kds-badge-blue-bg, #EFF8FF);
      color: var(--kds-badge-blue-text, #175CD3);
    }

    /* Indigo */
    .badge.color-indigo {
      background-color: var(--kds-badge-indigo-bg, #EEF4FF);
      color: var(--kds-badge-indigo-text, #3538CD);
    }

    /* Purple */
    .badge.color-purple {
      background-color: var(--kds-badge-purple-bg, #F4F3FF);
      color: var(--kds-badge-purple-text, #5925DC);
    }

    /* Pink */
    .badge.color-pink {
      background-color: var(--kds-badge-pink-bg, #FDF2FA);
      color: var(--kds-badge-pink-text, #C11574);
    }

    /* Rose */
    .badge.color-rose {
      background-color: var(--kds-badge-rose-bg, #FFF1F3);
      color: var(--kds-badge-rose-text, #C01048);
    }

    /* Orange */
    .badge.color-orange {
      background-color: var(--kds-badge-orange-bg, #FFF6ED);
      color: var(--kds-badge-orange-text, #C4320A);
    }

    /* === DOT INDICATOR === */
    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
      background-color: currentColor;
    }

    .badge.size-md .dot,
    .badge.size-lg .dot {
      width: 8px;
      height: 8px;
    }

    /* === CLOSE BUTTON === */
    .close-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      margin: 0;
      border: none;
      background: none;
      cursor: pointer;
      color: currentColor;
      opacity: 0.7;
      border-radius: 50%;
      flex-shrink: 0;
      transition: opacity 0.15s ease;
    }

    .close-btn:hover {
      opacity: 1;
    }

    .close-btn svg {
      width: 12px;
      height: 12px;
    }

    .badge.size-lg .close-btn svg {
      width: 14px;
      height: 14px;
    }

    /* === ICON SLOTS === */
    ::slotted([slot="icon"]) {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 12px;
      height: 12px;
    }

    .badge.size-lg ::slotted([slot="icon"]) {
      width: 14px;
      height: 14px;
    }

    .badge.icon-only ::slotted([slot="icon"]) {
      width: 12px;
      height: 12px;
    }

    .badge.icon-only.size-lg ::slotted([slot="icon"]) {
      width: 14px;
      height: 14px;
    }

    /* Avatar/Country slots */
    ::slotted([slot="avatar"]),
    ::slotted([slot="country"]) {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      overflow: hidden;
    }

    .badge.size-lg ::slotted([slot="avatar"]),
    .badge.size-lg ::slotted([slot="country"]) {
      width: 18px;
      height: 18px;
    }
  `;

  /**
   * Badge size variant
   * @default 'sm'
   */
  @property({ type: String, reflect: true })
  size: BadgeSize = 'sm';

  /**
   * Badge color variant
   * @default 'primary'
   */
  @property({ type: String, reflect: true })
  color: BadgeColor = 'primary';

  /**
   * Badge icon variant
   * @default 'false'
   */
  @property({ type: String, reflect: true })
  icon: BadgeIcon = 'false';

  /**
   * ARIA label for accessibility
   */
  @property({ type: String, attribute: 'aria-label' })
  override ariaLabel: string | null = null;

  private _handleDismiss(event: MouseEvent) {
    event.stopPropagation();
    this.dispatchEvent(
      new CustomEvent('kds-badge-dismiss', {
        detail: { originalEvent: event },
        bubbles: true,
        composed: true,
      })
    );
  }

  override render() {
    const isIconOnly = this.icon === 'only';

    const classes = {
      badge: true,
      [`size-${this.size}`]: true,
      [`color-${this.color}`]: true,
      'icon-only': isIconOnly,
    };

    return html`
      <span
        class=${classMap(classes)}
        role=${this.ariaLabel ? 'status' : nothing}
        aria-label=${this.ariaLabel || nothing}
      >
        ${this._renderLeadingContent()}
        ${!isIconOnly ? html`<slot></slot>` : nothing}
        ${isIconOnly ? html`<slot name="icon"></slot>` : nothing}
        ${this._renderTrailingContent()}
      </span>
    `;
  }

  private _renderLeadingContent() {
    switch (this.icon) {
      case 'dot':
        return html`<span class="dot"></span>`;
      case 'icon-left':
        return html`<slot name="icon"></slot>`;
      case 'country':
        return html`<slot name="country"></slot>`;
      case 'avatar':
        return html`<slot name="avatar"></slot>`;
      default:
        return nothing;
    }
  }

  private _renderTrailingContent() {
    switch (this.icon) {
      case 'x-close':
        return html`
          <button
            class="close-btn"
            @click=${this._handleDismiss}
            aria-label="Dismiss"
            type="button"
          >
            <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        `;
      case 'icon-right':
        return html`<slot name="icon"></slot>`;
      default:
        return nothing;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-badge': KdsBadge;
  }
}
