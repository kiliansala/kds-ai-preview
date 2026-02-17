/**
 * TypeScript contract auto-generated from Figma Button component
 * Source: .figma/button.figma-contract.json
 *
 * This file defines the interface that all Button implementations must satisfy
 * to match the Figma design specification (Single Source of Truth).
 */
/**
 * Button size variants from Figma
 * Figma property: "Size"
 */
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
/**
 * Button visual hierarchy/style variants from Figma
 * Figma property: "Hierarchy"
 *
 * Note: Figma uses spaces (e.g., "Secondary color"),
 * code uses kebab-case (e.g., "secondary-color")
 */
export type ButtonHierarchy = 'primary' | 'secondary-color' | 'secondary-gray' | 'tertiary-color' | 'tertiary-gray' | 'link-color' | 'link-gray';
/**
 * Icon position variants from Figma
 * Figma property: "Icon"
 *
 * Note: Figma uses "False" for no icon, code uses "none"
 */
export type IconPosition = 'none' | 'leading' | 'trailing' | 'dot' | 'only';
/**
 * Interactive states from Figma
 * Figma property: "State"
 *
 * Note: In code, states are typically managed via:
 * - Default: no special class/state
 * - Hover: :hover pseudo-class
 * - Focused: :focus-visible pseudo-class
 * - Disabled: disabled attribute
 */
export type ButtonState = 'default' | 'hover' | 'focused' | 'disabled';
/**
 * Core interface that Button component must implement
 * Matches Figma component properties exactly
 */
export interface FigmaButtonContract {
    /**
     * Button size variant
     * @required
     * @default 'md'
     */
    size: ButtonSize;
    /**
     * Visual hierarchy/style of the button
     * @required
     * @default 'primary'
     */
    hierarchy: ButtonHierarchy;
    /**
     * Icon position in the button
     * @required
     * @default 'none'
     */
    iconPosition: IconPosition;
    /**
     * Whether the button represents a destructive action
     * @required
     * @default false
     */
    destructive: boolean;
    /**
     * Whether the button is disabled
     * Note: State is managed via disabled attribute, not as a separate state prop
     * @optional (web-specific)
     * @default false
     */
    disabled?: boolean;
}
/**
 * Extended interface including web-specific properties
 * These properties don't exist in Figma but are necessary for web implementation
 */
export interface WebButtonContract extends FigmaButtonContract {
    /**
     * Button type attribute (web-specific)
     * Not in Figma
     */
    type?: 'button' | 'submit' | 'reset';
    /**
     * ARIA label for accessibility (web-specific)
     * Not in Figma, required for icon-only buttons
     */
    ariaLabel?: string | null;
}
/**
 * Validation helper: Check if a value is a valid ButtonSize
 */
export declare function isValidButtonSize(value: string): value is ButtonSize;
/**
 * Validation helper: Check if a value is a valid ButtonHierarchy
 */
export declare function isValidButtonHierarchy(value: string): value is ButtonHierarchy;
/**
 * Validation helper: Check if a value is a valid IconPosition
 */
export declare function isValidIconPosition(value: string): value is IconPosition;
/**
 * Contract metadata
 */
export declare const FIGMA_BUTTON_CONTRACT: {
    readonly componentId: "1038:34411";
    readonly componentName: "Button";
    readonly figmaFileId: "CICp1MWc31lkvjX3jYo1rj";
    readonly extractedAt: "2026-02-10T00:00:00Z";
    readonly version: "1.0.0";
    readonly properties: {
        readonly size: {
            readonly required: true;
            readonly default: ButtonSize;
            readonly values: readonly ["sm", "md", "lg", "xl"];
        };
        readonly hierarchy: {
            readonly required: true;
            readonly default: ButtonHierarchy;
            readonly values: readonly ["primary", "secondary-color", "secondary-gray", "tertiary-color", "tertiary-gray", "link-color", "link-gray"];
        };
        readonly iconPosition: {
            readonly required: true;
            readonly default: IconPosition;
            readonly values: readonly ["none", "leading", "trailing", "dot", "only"];
        };
        readonly destructive: {
            readonly required: true;
            readonly default: false;
        };
    };
};
/**
 * Type guard to validate if an object implements FigmaButtonContract
 */
export declare function validateFigmaButtonContract(obj: any): obj is FigmaButtonContract;
/**
 * Get validation errors for a component implementation
 */
export declare function getContractValidationErrors(obj: any): string[];
//# sourceMappingURL=button.figma-contract.d.ts.map