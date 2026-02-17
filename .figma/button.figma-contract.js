/**
 * TypeScript contract auto-generated from Figma Button component
 * Source: .figma/button.figma-contract.json
 *
 * This file defines the interface that all Button implementations must satisfy
 * to match the Figma design specification (Single Source of Truth).
 */
/**
 * Validation helper: Check if a value is a valid ButtonSize
 */
export function isValidButtonSize(value) {
    return ['sm', 'md', 'lg', 'xl'].includes(value);
}
/**
 * Validation helper: Check if a value is a valid ButtonHierarchy
 */
export function isValidButtonHierarchy(value) {
    return [
        'primary',
        'secondary-color',
        'secondary-gray',
        'tertiary-color',
        'tertiary-gray',
        'link-color',
        'link-gray'
    ].includes(value);
}
/**
 * Validation helper: Check if a value is a valid IconPosition
 */
export function isValidIconPosition(value) {
    return ['none', 'leading', 'trailing', 'dot', 'only'].includes(value);
}
/**
 * Contract metadata
 */
export const FIGMA_BUTTON_CONTRACT = {
    componentId: '1038:34411',
    componentName: 'Button',
    figmaFileId: 'CICp1MWc31lkvjX3jYo1rj',
    extractedAt: '2026-02-10T00:00:00Z',
    version: '1.0.0',
    properties: {
        size: {
            required: true,
            default: 'md',
            values: ['sm', 'md', 'lg', 'xl']
        },
        hierarchy: {
            required: true,
            default: 'primary',
            values: [
                'primary',
                'secondary-color',
                'secondary-gray',
                'tertiary-color',
                'tertiary-gray',
                'link-color',
                'link-gray'
            ]
        },
        iconPosition: {
            required: true,
            default: 'none',
            values: ['none', 'leading', 'trailing', 'dot', 'only']
        },
        destructive: {
            required: true,
            default: false
        }
    }
};
/**
 * Type guard to validate if an object implements FigmaButtonContract
 */
export function validateFigmaButtonContract(obj) {
    return (obj != null &&
        typeof obj === 'object' &&
        isValidButtonSize(obj.size) &&
        isValidButtonHierarchy(obj.hierarchy) &&
        isValidIconPosition(obj.iconPosition) &&
        typeof obj.destructive === 'boolean');
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
    if (!('size' in obj)) {
        errors.push('Missing required property: size');
    }
    else if (!isValidButtonSize(obj.size)) {
        errors.push(`Invalid size value: "${obj.size}". Must be one of: sm, md, lg, xl`);
    }
    if (!('hierarchy' in obj)) {
        errors.push('Missing required property: hierarchy');
    }
    else if (!isValidButtonHierarchy(obj.hierarchy)) {
        errors.push(`Invalid hierarchy value: "${obj.hierarchy}". Must be one of: ${FIGMA_BUTTON_CONTRACT.properties.hierarchy.values.join(', ')}`);
    }
    if (!('iconPosition' in obj)) {
        errors.push('Missing required property: iconPosition');
    }
    else if (!isValidIconPosition(obj.iconPosition)) {
        errors.push(`Invalid iconPosition value: "${obj.iconPosition}". Must be one of: none, leading, trailing, dot, only`);
    }
    if (!('destructive' in obj)) {
        errors.push('Missing required property: destructive');
    }
    else if (typeof obj.destructive !== 'boolean') {
        errors.push(`Invalid destructive value: "${obj.destructive}". Must be a boolean`);
    }
    return errors;
}
//# sourceMappingURL=button.figma-contract.js.map