/**
 * @package @kds/web-components
 * @component kds-button
 * @description Button component from Untitled UI design system
 * @author Kilian Sala <kilian@kapsch.net>
 * @source Figma: Untitled UI - FREE Figma UI kit v2.0
 */
import { LitElement } from 'lit';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
export type ButtonHierarchy = 'primary' | 'secondary-color' | 'secondary-gray' | 'tertiary-color' | 'tertiary-gray' | 'link-color' | 'link-gray';
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
export declare class KdsButton extends LitElement {
    static styles: import("lit").CSSResult;
    /**
     * Button size
     * @default 'md'
     */
    size: ButtonSize;
    /**
     * Visual hierarchy/style variant
     * @default 'primary'
     */
    hierarchy: ButtonHierarchy;
    /**
     * Icon position relative to text
     * @default 'none'
     */
    iconPosition: IconPosition;
    /**
     * Destructive/danger variant
     * @default false
     */
    destructive: boolean;
    /**
     * Disabled state
     * @default false
     */
    disabled: boolean;
    /**
     * Button type attribute
     * @default 'button'
     */
    type: 'button' | 'submit' | 'reset';
    /**
     * ARIA label for icon-only buttons
     */
    ariaLabel: string | null;
    private handleClick;
    private handleKeyDown;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'kds-button': KdsButton;
    }
}
//# sourceMappingURL=kds-button.d.ts.map