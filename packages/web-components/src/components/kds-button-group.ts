/**
 * @package @kds/web-components
 * @component kds-button-group, kds-button-group-item
 * @description Button Group component from Untitled UI design system
 * @author Kilian Sala <kilian@kapsch.net>
 * @source Figma: Untitled UI - FREE Figma UI kit v2.0
 *
 * Extracted from Figma via MCP on 2026-02-18
 * Frame nodeId: 1046:10170
 */

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

export type ButtonGroupItemIcon = 'none' | 'leading' | 'only' | 'dot';

/**
 * Button Group container component
 *
 * Groups multiple `kds-button-group-item` elements horizontally with
 * shared border, rounded corners, and shadow.
 *
 * @example
 * ```html
 * <!-- Text only -->
 * <kds-button-group>
 *   <kds-button-group-item selected>Tab 1</kds-button-group-item>
 *   <kds-button-group-item>Tab 2</kds-button-group-item>
 *   <kds-button-group-item>Tab 3</kds-button-group-item>
 * </kds-button-group>
 *
 * <!-- With leading icons -->
 * <kds-button-group>
 *   <kds-button-group-item icon="leading" selected>
 *     <svg slot="icon" ...></svg>
 *     Tab 1
 *   </kds-button-group-item>
 *   <kds-button-group-item icon="leading">
 *     <svg slot="icon" ...></svg>
 *     Tab 2
 *   </kds-button-group-item>
 * </kds-button-group>
 *
 * <!-- Icon only -->
 * <kds-button-group>
 *   <kds-button-group-item icon="only" aria-label="Previous">
 *     <svg slot="icon" ...></svg>
 *   </kds-button-group-item>
 *   <kds-button-group-item icon="only" aria-label="Add">
 *     <svg slot="icon" ...></svg>
 *   </kds-button-group-item>
 *   <kds-button-group-item icon="only" aria-label="Next">
 *     <svg slot="icon" ...></svg>
 *   </kds-button-group-item>
 * </kds-button-group>
 * ```
 *
 * @fires {CustomEvent} kds-button-group-change - Fired when a different item is selected
 */
@customElement('kds-button-group')
export class KdsButtonGroup extends LitElement {
  static override styles = css`
    :host {
      display: inline-flex;
      font-family: var(--kds-font-family, 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
    }

    .button-group {
      display: inline-flex;
      align-items: stretch;
      border: 1px solid var(--kds-button-group-border, #D5D7DA);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0px 1px 2px 0px rgba(10, 13, 18, 0.05);
    }
  `;

  /**
   * ARIA label for the group
   */
  @property({ type: String, attribute: 'aria-label' })
  override ariaLabel: string | null = null;

  override render() {
    return html`
      <div
        class="button-group"
        role="group"
        aria-label=${this.ariaLabel || nothing}
      >
        <slot></slot>
      </div>
    `;
  }
}

/**
 * Button Group Item component
 *
 * Individual button within a `kds-button-group`.
 *
 * @fires {CustomEvent} kds-button-group-item-click - Fired when the item is clicked
 */
@customElement('kds-button-group-item')
export class KdsButtonGroupItem extends LitElement {
  static override styles = css`
    :host {
      display: inline-flex;
    }

    .item {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 10px 16px;
      background: var(--kds-button-group-bg, #FFFFFF);
      border: none;
      border-right: 1px solid var(--kds-button-group-border, #D5D7DA);
      color: var(--kds-button-group-text, #414651);
      font-family: inherit;
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      cursor: pointer;
      white-space: nowrap;
      box-sizing: border-box;
      transition: background-color 0.15s ease;
    }

    :host(:last-child) .item {
      border-right: none;
    }

    /* Icon variants */
    .item.icon-leading {
      gap: 8px;
    }

    .item.icon-only {
      padding: 10px 12px;
    }

    .item.icon-dot {
      gap: 8px;
    }

    /* States */
    .item.selected {
      background: var(--kds-button-group-bg-selected, #F9FAFB);
    }

    .item:hover:not(.disabled) {
      background: var(--kds-button-group-bg-selected, #F9FAFB);
    }

    .item:focus-visible {
      outline: 2px solid var(--kds-focus-ring, #7F56D9);
      outline-offset: -2px;
      z-index: 1;
    }

    .item.disabled {
      color: var(--kds-button-group-text-disabled, #717680);
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Dot indicator */
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
      background-color: var(--kds-button-group-dot, #717680);
    }

    /* Icon slot */
    ::slotted([slot="icon"]) {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 20px;
      height: 20px;
    }
  `;

  /**
   * Whether this item is selected/current
   * @default false
   */
  @property({ type: Boolean, reflect: true })
  selected = false;

  /**
   * Icon variant
   * @default 'none'
   */
  @property({ type: String, reflect: true })
  icon: ButtonGroupItemIcon = 'none';

  /**
   * Whether the item is disabled
   * @default false
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Value for selection tracking
   */
  @property({ type: String })
  value = '';

  /**
   * ARIA label for accessibility (required for icon-only)
   */
  @property({ type: String, attribute: 'aria-label' })
  override ariaLabel: string | null = null;

  private _handleClick(event: MouseEvent) {
    if (this.disabled) {
      event.preventDefault();
      return;
    }

    this.dispatchEvent(
      new CustomEvent('kds-button-group-item-click', {
        detail: { value: this.value, originalEvent: event },
        bubbles: true,
        composed: true,
      })
    );
  }

  override render() {
    const isIconOnly = this.icon === 'only';

    const classes = {
      item: true,
      selected: this.selected,
      disabled: this.disabled,
      'icon-leading': this.icon === 'leading',
      'icon-only': isIconOnly,
      'icon-dot': this.icon === 'dot',
    };

    return html`
      <button
        class=${classMap(classes)}
        ?disabled=${this.disabled}
        aria-pressed=${this.selected}
        aria-label=${this.ariaLabel || nothing}
        @click=${this._handleClick}
        type="button"
      >
        ${this.icon === 'dot' ? html`<span class="dot"></span>` : nothing}
        ${this.icon === 'leading' ? html`<slot name="icon"></slot>` : nothing}
        ${isIconOnly ? html`<slot name="icon"></slot>` : html`<slot></slot>`}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-button-group': KdsButtonGroup;
    'kds-button-group-item': KdsButtonGroupItem;
  }
}
