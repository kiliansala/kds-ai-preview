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
export type ButtonHierarchy =
  | 'primary'
  | 'secondary-color'
  | 'secondary-gray'
  | 'tertiary-color'
  | 'tertiary-gray'
  | 'link-color'
  | 'link-gray';

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
export function isValidButtonSize(value: string): value is ButtonSize {
  return ['sm', 'md', 'lg', 'xl'].includes(value);
}

/**
 * Validation helper: Check if a value is a valid ButtonHierarchy
 */
export function isValidButtonHierarchy(value: string): value is ButtonHierarchy {
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
export function isValidIconPosition(value: string): value is IconPosition {
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
      default: 'md' as ButtonSize,
      values: ['sm', 'md', 'lg', 'xl'] as const
    },
    hierarchy: {
      required: true,
      default: 'primary' as ButtonHierarchy,
      values: [
        'primary',
        'secondary-color',
        'secondary-gray',
        'tertiary-color',
        'tertiary-gray',
        'link-color',
        'link-gray'
      ] as const
    },
    iconPosition: {
      required: true,
      default: 'none' as IconPosition,
      values: ['none', 'leading', 'trailing', 'dot', 'only'] as const
    },
    destructive: {
      required: true,
      default: false
    }
  }
} as const;

/**
 * Type guard to validate if an object implements FigmaButtonContract
 */
export function validateFigmaButtonContract(obj: any): obj is FigmaButtonContract {
  return (
    obj != null &&
    typeof obj === 'object' &&
    isValidButtonSize(obj.size) &&
    isValidButtonHierarchy(obj.hierarchy) &&
    isValidIconPosition(obj.iconPosition) &&
    typeof obj.destructive === 'boolean'
  );
}

/**
 * Get validation errors for a component implementation
 */
export function getContractValidationErrors(obj: any): string[] {
  const errors: string[] = [];

  if (obj == null || typeof obj !== 'object') {
    errors.push('Object is null or not an object');
    return errors;
  }

  if (!('size' in obj)) {
    errors.push('Missing required property: size');
  } else if (!isValidButtonSize(obj.size)) {
    errors.push(`Invalid size value: "${obj.size}". Must be one of: sm, md, lg, xl`);
  }

  if (!('hierarchy' in obj)) {
    errors.push('Missing required property: hierarchy');
  } else if (!isValidButtonHierarchy(obj.hierarchy)) {
    errors.push(`Invalid hierarchy value: "${obj.hierarchy}". Must be one of: ${FIGMA_BUTTON_CONTRACT.properties.hierarchy.values.join(', ')}`);
  }

  if (!('iconPosition' in obj)) {
    errors.push('Missing required property: iconPosition');
  } else if (!isValidIconPosition(obj.iconPosition)) {
    errors.push(`Invalid iconPosition value: "${obj.iconPosition}". Must be one of: none, leading, trailing, dot, only`);
  }

  if (!('destructive' in obj)) {
    errors.push('Missing required property: destructive');
  } else if (typeof obj.destructive !== 'boolean') {
    errors.push(`Invalid destructive value: "${obj.destructive}". Must be a boolean`);
  }

  return errors;
}
