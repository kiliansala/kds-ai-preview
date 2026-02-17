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
 * Validation helper: Check if a value is a valid TooltipTheme
 */
export function isValidTooltipTheme(value) {
    return ['light', 'dark'].includes(value);
}
/**
 * Validation helper: Check if a value is a valid TooltipArrow
 */
export function isValidTooltipArrow(value) {
    return ['none', 'bottom-center', 'bottom-left', 'bottom-right', 'top-center', 'left', 'right'].includes(value);
}
/**
 * Contract metadata
 */
export const FIGMA_TOOLTIP_CONTRACT = {
    componentId: '1052:490',
    componentName: 'Tooltip',
    figmaFileId: 'CICp1MWc31lkvjX3jYo1rj',
    extractedAt: '2026-02-17T00:00:00Z',
    version: '1.0.0',
    properties: {
        theme: {
            required: false,
            default: 'light',
            values: ['light', 'dark']
        },
        arrow: {
            required: false,
            default: 'none',
            values: ['none', 'bottom-center', 'bottom-left', 'bottom-right', 'top-center', 'left', 'right']
        },
        supportingText: {
            required: false,
            default: false
        }
    },
    designTokens: {
        colors: {
            'white': '#FFFFFF',
            'gray-700': '#414651',
            'gray-600': '#535862',
            'gray-900': '#181D27'
        },
        effects: {
            'shadow-lg': '0px 4px 6px -2px rgba(10, 13, 18, 0.03), 0px 12px 16px -4px rgba(10, 13, 18, 0.08)'
        },
        spacing: {
            paddingSimple: '8px 12px',
            paddingSupporting: '12px',
            textGap: '4px'
        },
        borderRadius: '8px',
        arrowSize: {
            width: '16px',
            height: '6px'
        },
        backgrounds: {
            light: '#FFFFFF',
            dark: '#181D27'
        },
        textColors: {
            titleLight: '#414651',
            titleDark: '#FFFFFF',
            supportingLight: '#535862',
            supportingDark: '#FFFFFF'
        }
    },
    typography: {
        title: 'Inter SemiBold, 12px/18px',
        supporting: 'Inter Regular, 12px/18px'
    }
};
/**
 * Type guard to validate if an object implements FigmaTooltipContract
 */
export function validateFigmaTooltipContract(obj) {
    return (obj != null &&
        typeof obj === 'object' &&
        (obj.theme === undefined || isValidTooltipTheme(obj.theme)) &&
        (obj.arrow === undefined || isValidTooltipArrow(obj.arrow)));
}
/**
 * Get validation errors for a component implementation
 */
export function getContractValidationErrors(obj) {
    const errors = [];
    if (obj == null || typeof obj !== 'object') {
        errors.push('Object is null or not an object');
        return errors;
    }
    if ('theme' in obj && !isValidTooltipTheme(obj.theme)) {
        errors.push(`Invalid theme value: "${obj.theme}". Must be one of: ${FIGMA_TOOLTIP_CONTRACT.properties.theme.values.join(', ')}`);
    }
    if ('arrow' in obj && !isValidTooltipArrow(obj.arrow)) {
        errors.push(`Invalid arrow value: "${obj.arrow}". Must be one of: ${FIGMA_TOOLTIP_CONTRACT.properties.arrow.values.join(', ')}`);
    }
    return errors;
}
