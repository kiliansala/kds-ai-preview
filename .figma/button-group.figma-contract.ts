/**
 * TypeScript contract for Button Group component
 * Source: .figma/button-group.figma-contract.json
 *
 * Extracted from Figma via MCP on 2026-02-18
 * Frame nodeId: 1046:10170
 *
 * This file defines the interface that all Button Group implementations must satisfy
 * to match the Figma design specification (Single Source of Truth).
 */

/**
 * Button Group item icon variants from Figma
 * Figma property: "Icon" on _Button group base
 *
 * - none: text only
 * - leading: icon left of text
 * - only: icon only, no text
 * - dot: colored dot indicator left of text
 */
export type ButtonGroupItemIcon = 'none' | 'leading' | 'only' | 'dot';

/**
 * Core interface for a Button Group item
 * Matches Figma _Button group base properties
 */
export interface FigmaButtonGroupItemContract {
  /**
   * Whether this item is selected/current
   * @default false
   */
  selected: boolean;

  /**
   * Icon variant
   * @default 'none'
   */
  icon: ButtonGroupItemIcon;

  /**
   * Whether the item is disabled
   * @default false
   */
  disabled: boolean;
}

/**
 * Extended interface including web-specific properties
 */
export interface WebButtonGroupItemContract extends FigmaButtonGroupItemContract {
  /**
   * ARIA label for accessibility (web-specific)
   * Required for icon-only items
   */
  ariaLabel?: string | null;

  /**
   * Value associated with this item (for selection tracking)
   */
  value?: string;

  /**
   * Text label content
   * In Figma: hardcoded "Text"
   * In code: Content via slot or string property
   */
  label?: string;
}

/**
 * Validation helper: Check if a value is a valid ButtonGroupItemIcon
 */
export function isValidButtonGroupItemIcon(value: string): value is ButtonGroupItemIcon {
  return ['none', 'leading', 'only', 'dot'].includes(value);
}

/**
 * Contract metadata
 */
export const FIGMA_BUTTON_GROUP_CONTRACT = {
  componentId: '1046:10170',
  componentName: 'Button group',
  figmaFileId: 'CICp1MWc31lkvjX3jYo1rj',
  extractedAt: '2026-02-18T00:00:00Z',
  version: '1.0.0',

  item: {
    properties: {
      selected: {
        required: false,
        default: false,
      },
      icon: {
        required: false,
        default: 'none' as ButtonGroupItemIcon,
        values: ['none', 'leading', 'only', 'dot'] as const,
      },
      disabled: {
        required: false,
        default: false,
      },
    },
  },

  designTokens: {
    colors: {
      background: '#FFFFFF',
      backgroundSelected: '#F9FAFB',
      border: '#D5D7DA',
      text: '#414651',
      textDisabled: '#717680',
      dotAccent: '#717680',
    },
    typography: {
      fontFamily: 'Inter',
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 600,
    },
    spacing: {
      paddingY: '10px',
      paddingX: '16px',
      paddingXIconOnly: '12px',
      gap: '8px',
      iconSize: '20px',
    },
    borderRadius: '8px',
    shadow: '0px 1px 2px 0px rgba(10, 13, 18, 0.05)',
  },
} as const;

/**
 * Type guard to validate if an object implements FigmaButtonGroupItemContract
 */
export function validateFigmaButtonGroupItemContract(obj: any): obj is FigmaButtonGroupItemContract {
  return (
    obj != null &&
    typeof obj === 'object' &&
    typeof obj.selected === 'boolean' &&
    isValidButtonGroupItemIcon(obj.icon) &&
    typeof obj.disabled === 'boolean'
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

  if (!('selected' in obj)) {
    errors.push('Missing property: selected');
  } else if (typeof obj.selected !== 'boolean') {
    errors.push(`Invalid selected value: "${obj.selected}". Must be boolean`);
  }

  if (!('icon' in obj)) {
    errors.push('Missing property: icon');
  } else if (!isValidButtonGroupItemIcon(obj.icon)) {
    errors.push(`Invalid icon value: "${obj.icon}". Must be one of: ${FIGMA_BUTTON_GROUP_CONTRACT.item.properties.icon.values.join(', ')}`);
  }

  if (!('disabled' in obj)) {
    errors.push('Missing property: disabled');
  } else if (typeof obj.disabled !== 'boolean') {
    errors.push(`Invalid disabled value: "${obj.disabled}". Must be boolean`);
  }

  return errors;
}
