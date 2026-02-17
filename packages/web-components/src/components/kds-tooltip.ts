/**
 * @package @kds/web-components
 * @component kds-tooltip
 * @description Tooltip component from Untitled UI design system
 * @author Kilian Sala <kilian@kapsch.net>
 * @source Figma: Untitled UI - FREE Figma UI kit v2.0
 *
 * Extracted from Figma via MCP on 2026-02-17
 * Component nodeIds: 1052:490 - 1052:648
 */

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

export type TooltipTheme = 'light' | 'dark';
export type TooltipArrow =
  | 'none'
  | 'bottom-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'left'
  | 'right';

/**
 * Tooltip component built with LIT
 *
 * @example
 * ```html
 * <!-- Simple tooltip -->
 * <kds-tooltip text="This is a tooltip"></kds-tooltip>
 *
 * <!-- Dark theme with arrow -->
 * <kds-tooltip text="Tooltip" theme="dark" arrow="bottom-center"></kds-tooltip>
 *
 * <!-- With supporting text -->
 * <kds-tooltip
 *   text="This is a tooltip"
 *   supporting-text="Tooltips help the user understand the meaning of an element."
 *   arrow="top-center"
 * ></kds-tooltip>
 *
 * <!-- Using slots -->
 * <kds-tooltip arrow="left">
 *   <span slot="text">Custom title</span>
 *   <span slot="supporting-text">Custom description</span>
 * </kds-tooltip>
 * ```
 *
 * @slot text - Tooltip title text (alternative to text property)
 * @slot supporting-text - Supporting description text (alternative to supporting-text property)
 */
@customElement('kds-tooltip')
export class KdsTooltip extends LitElement {
  static override styles = css`
    :host {
      display: inline-flex;
      font-family: var(--kds-font-family, 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
    }

    /* Tooltip container */
    .tooltip {
      display: inline-flex;
      border-radius: 8px;
      box-shadow:
        0px 4px 6px -2px rgba(10, 13, 18, 0.03),
        0px 12px 16px -4px rgba(10, 13, 18, 0.08);
      position: relative;
    }

    /* Horizontal layout (arrow left or right) */
    .tooltip.arrow-left,
    .tooltip.arrow-right {
      flex-direction: row;
      align-items: center;
    }

    /* Vertical layout (arrow top or bottom, or none) */
    .tooltip.arrow-none,
    .tooltip.arrow-bottom-center,
    .tooltip.arrow-bottom-left,
    .tooltip.arrow-bottom-right,
    .tooltip.arrow-top-center {
      flex-direction: column;
    }

    /* Arrow alignment for bottom positions */
    .tooltip.arrow-bottom-center {
      align-items: center;
    }

    .tooltip.arrow-bottom-left {
      align-items: flex-start;
    }

    .tooltip.arrow-bottom-right {
      align-items: flex-end;
    }

    /* Arrow alignment for top center */
    .tooltip.arrow-top-center {
      align-items: center;
    }

    /* Content box */
    .content {
      border-radius: 8px;
      box-sizing: border-box;
    }

    /* Simple tooltip (no supporting text) */
    .content.simple {
      padding: 8px 12px;
    }

    /* Tooltip with supporting text */
    .content.with-supporting {
      padding: 12px;
      width: 100%;
    }

    /* Width constraint when supporting text is present */
    .tooltip.has-supporting {
      width: var(--kds-tooltip-width, 320px);
    }

    /* Light theme */
    .tooltip.theme-light .content {
      background-color: var(--kds-color-white, #FFFFFF);
    }

    /* Dark theme */
    .tooltip.theme-dark .content {
      background-color: var(--kds-color-gray-900, #181D27);
    }

    /* Text container */
    .text-wrapper {
      display: flex;
      flex-direction: column;
      gap: 4px;
      border-radius: 8px;
      font-size: 12px;
      line-height: 18px;
    }

    /* Title text */
    .title {
      font-weight: 600;
      font-size: 12px;
      line-height: 18px;
    }

    .theme-light .title {
      color: var(--kds-color-gray-700, #414651);
    }

    .theme-dark .title {
      color: var(--kds-color-white, #FFFFFF);
    }

    /* Simple tooltip title is centered */
    .content.simple .title {
      text-align: center;
    }

    /* Supporting text */
    .supporting {
      font-weight: 400;
      font-size: 12px;
      line-height: 18px;
    }

    .theme-light .supporting {
      color: var(--kds-color-gray-600, #535862);
    }

    .theme-dark .supporting {
      color: var(--kds-color-white, #FFFFFF);
    }

    /* Arrow base styles */
    .arrow {
      width: 0;
      height: 0;
      flex-shrink: 0;
    }

    /* Bottom arrows (point down) */
    .tooltip.arrow-bottom-center .arrow,
    .tooltip.arrow-bottom-left .arrow,
    .tooltip.arrow-bottom-right .arrow {
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top-width: 6px;
      border-top-style: solid;
    }

    .tooltip.theme-light.arrow-bottom-center .arrow,
    .tooltip.theme-light.arrow-bottom-left .arrow,
    .tooltip.theme-light.arrow-bottom-right .arrow {
      border-top-color: var(--kds-color-white, #FFFFFF);
    }

    .tooltip.theme-dark.arrow-bottom-center .arrow,
    .tooltip.theme-dark.arrow-bottom-left .arrow,
    .tooltip.theme-dark.arrow-bottom-right .arrow {
      border-top-color: var(--kds-color-gray-900, #181D27);
    }

    /* Side arrow offset (left/right position) */
    .tooltip.arrow-bottom-left .arrow {
      margin-left: 12px;
    }

    .tooltip.arrow-bottom-right .arrow {
      margin-right: 12px;
    }

    /* Top center arrow (point up) */
    .tooltip.arrow-top-center .arrow {
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom-width: 6px;
      border-bottom-style: solid;
    }

    .tooltip.theme-light.arrow-top-center .arrow {
      border-bottom-color: var(--kds-color-white, #FFFFFF);
    }

    .tooltip.theme-dark.arrow-top-center .arrow {
      border-bottom-color: var(--kds-color-gray-900, #181D27);
    }

    /* Left arrow (points left) */
    .tooltip.arrow-left .arrow {
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      border-right-width: 6px;
      border-right-style: solid;
    }

    .tooltip.theme-light.arrow-left .arrow {
      border-right-color: var(--kds-color-white, #FFFFFF);
    }

    .tooltip.theme-dark.arrow-left .arrow {
      border-right-color: var(--kds-color-gray-900, #181D27);
    }

    /* Right arrow (points right) */
    .tooltip.arrow-right .arrow {
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      border-left-width: 6px;
      border-left-style: solid;
    }

    .tooltip.theme-light.arrow-right .arrow {
      border-left-color: var(--kds-color-white, #FFFFFF);
    }

    .tooltip.theme-dark.arrow-right .arrow {
      border-left-color: var(--kds-color-gray-900, #181D27);
    }
  `;

  /**
   * Tooltip color theme
   * @default 'light'
   */
  @property({ type: String, reflect: true })
  theme: TooltipTheme = 'light';

  /**
   * Arrow position
   * @default 'none'
   */
  @property({ type: String, reflect: true })
  arrow: TooltipArrow = 'none';

  /**
   * Tooltip title text
   */
  @property({ type: String })
  text?: string;

  /**
   * Supporting/description text
   */
  @property({ type: String, attribute: 'supporting-text' })
  supportingText?: string;

  override render() {
    const hasSupportingText = !!this.supportingText;

    const tooltipClasses = {
      tooltip: true,
      [`theme-${this.theme}`]: true,
      [`arrow-${this.arrow}`]: true,
      'has-supporting': hasSupportingText,
    };

    const contentClasses = {
      content: true,
      simple: !hasSupportingText,
      'with-supporting': hasSupportingText,
    };

    const arrowEl = this.arrow !== 'none'
      ? html`<span class="arrow" role="presentation"></span>`
      : nothing;

    // Top arrow comes before content
    const topArrow = this.arrow === 'top-center' ? arrowEl : nothing;
    // Left arrow comes before content
    const leftArrow = this.arrow === 'left' ? arrowEl : nothing;
    // Bottom/right arrows come after content
    const bottomOrRightArrow =
      this.arrow !== 'none' && this.arrow !== 'top-center' && this.arrow !== 'left'
        ? arrowEl
        : nothing;

    return html`
      <div class=${classMap(tooltipClasses)} role="tooltip">
        ${topArrow}
        ${leftArrow}
        <div class=${classMap(contentClasses)}>
          ${hasSupportingText
            ? html`
                <div class="text-wrapper">
                  <span class="title">
                    <slot name="text">${this.text}</slot>
                  </span>
                  <span class="supporting">
                    <slot name="supporting-text">${this.supportingText}</slot>
                  </span>
                </div>
              `
            : html`
                <span class="title">
                  <slot name="text">${this.text}</slot>
                </span>
              `}
        </div>
        ${bottomOrRightArrow}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-tooltip': KdsTooltip;
  }
}
