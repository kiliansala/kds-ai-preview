/**
 * TypeScript contract for Tooltip component
 * Source: .figma/tooltip.figma-contract.json
 *
 * Extracted from Figma via MCP on 2026-02-17
 * Component nodeIds: 1052:490 - 1052:648
 *
 * This file defines the interface that all Tooltip implementations must satisfy
 * to match the Figma design specification (Single Source of Truth).
 */
/**
 * Tooltip theme variants from Figma
 * Figma property: "Theme"
 *
 * - light: white background, dark text
 * - dark: Gray/900 (#181D27) background, white text
 */
export type TooltipTheme = 'light' | 'dark';
/**
 * Arrow position variants from Figma
 * Figma property: "Arrow"
 *
 * Describes where the arrow appears relative to the tooltip body.
 * The arrow points toward the trigger element.
 */
export type TooltipArrow = 'none' | 'bottom-center' | 'bottom-left' | 'bottom-right' | 'top-center' | 'left' | 'right';
/**
 * Core interface that Tooltip component must implement
 * Matches Figma component properties exactly
 */
export interface FigmaTooltipContract {
    /**
     * Tooltip color theme
     * @optional
     * @default 'light'
     *
     * Visual:
     * - light: bg white, title #414651, supporting #535862
     * - dark: bg #181D27, title+supporting white
     */
    theme?: TooltipTheme;
    /**
     * Arrow position relative to tooltip body
     * @optional
     * @default 'none'
     *
     * Arrow is a CSS triangle pointing toward the trigger element.
     * Size: 16x6px (center/top) or 28x6px (left/right side arrows)
     */
    arrow?: TooltipArrow;
    /**
     * Whether supporting text is shown (Figma boolean)
     * In code, presence of supportingText string controls visibility
     * @optional
     * @default false
     */
    supportingText?: boolean;
}
/**
 * Extended interface including web-specific properties
 * These properties don't exist in Figma but are necessary for web implementation
 */
export interface WebTooltipContract extends Omit<FigmaTooltipContract, 'supportingText'> {
    /**
     * Tooltip title text content
     * Not in Figma as a property (it's content)
     */
    text?: string;
    /**
     * Supporting/description text below the title
     * In Figma: boolean property "Supporting text"
     * In code: string content via property or slot
     */
    supportingText?: string | boolean;
    /**
     * ARIA label for the tooltip (web-specific)
     * Not in Figma
     */
    ariaLabel?: string | null;
}
/**
 * Validation helper: Check if a value is a valid TooltipTheme
 */
export declare function isValidTooltipTheme(value: string): value is TooltipTheme;
/**
 * Validation helper: Check if a value is a valid TooltipArrow
 */
export declare function isValidTooltipArrow(value: string): value is TooltipArrow;
/**
 * Contract metadata
 */
export declare const FIGMA_TOOLTIP_CONTRACT: {
    readonly componentId: "1052:490";
    readonly componentName: "Tooltip";
    readonly figmaFileId: "CICp1MWc31lkvjX3jYo1rj";
    readonly extractedAt: "2026-02-17T00:00:00Z";
    readonly version: "1.0.0";
    readonly properties: {
        readonly theme: {
            readonly required: false;
            readonly default: TooltipTheme;
            readonly values: readonly ["light", "dark"];
        };
        readonly arrow: {
            readonly required: false;
            readonly default: TooltipArrow;
            readonly values: readonly ["none", "bottom-center", "bottom-left", "bottom-right", "top-center", "left", "right"];
        };
        readonly supportingText: {
            readonly required: false;
            readonly default: false;
        };
    };
    readonly designTokens: {
        readonly colors: {
            readonly white: "#FFFFFF";
            readonly 'gray-700': "#414651";
            readonly 'gray-600': "#535862";
            readonly 'gray-900': "#181D27";
        };
        readonly effects: {
            readonly 'shadow-lg': "0px 4px 6px -2px rgba(10, 13, 18, 0.03), 0px 12px 16px -4px rgba(10, 13, 18, 0.08)";
        };
        readonly spacing: {
            readonly paddingSimple: "8px 12px";
            readonly paddingSupporting: "12px";
            readonly textGap: "4px";
        };
        readonly borderRadius: "8px";
        readonly arrowSize: {
            readonly width: "16px";
            readonly height: "6px";
        };
        readonly backgrounds: {
            readonly light: "#FFFFFF";
            readonly dark: "#181D27";
        };
        readonly textColors: {
            readonly titleLight: "#414651";
            readonly titleDark: "#FFFFFF";
            readonly supportingLight: "#535862";
            readonly supportingDark: "#FFFFFF";
        };
    };
    readonly typography: {
        readonly title: "Inter SemiBold, 12px/18px";
        readonly supporting: "Inter Regular, 12px/18px";
    };
};
/**
 * Type guard to validate if an object implements FigmaTooltipContract
 */
export declare function validateFigmaTooltipContract(obj: any): obj is FigmaTooltipContract;
/**
 * Get validation errors for a component implementation
 */
export declare function getContractValidationErrors(obj: any): string[];
