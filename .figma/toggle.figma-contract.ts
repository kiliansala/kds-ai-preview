/**
 * TypeScript contract for Toggle component
 * Source: .figma/toggle.figma-contract.json
 *
 * Extracted from Figma via MCP on 2026-02-11
 * Frame nodeId: 1102:4208
 *
 * This file defines the interface that all Toggle implementations must satisfy
 * to match the Figma design specification (Single Source of Truth).
 */

/**
 * Toggle size variants from Figma
 * Figma property: "Size"
 *
 * - sm: track 36×20px, knob 16×16px
 * - md: track 44×24px, knob 20×20px (default)
 */
export type ToggleSize = 'sm' | 'md';

/**
 * Interactive states from Figma
 * Figma property: "State"
 *
 * In code, states are managed via:
 * - Default: no special class/state
 * - Hover: :hover pseudo-class
 * - Focus: :focus-visible pseudo-class
 * - Disabled: disabled attribute
 */
export type ToggleInteractiveState = 'default' | 'hover' | 'focus' | 'disabled';

/**
 * Core interface that Toggle component must implement
 * Matches Figma component properties exactly
 */
export interface FigmaToggleContract {
  /**
   * Toggle size variant
   * @required
   * @default 'sm'
   *
   * Measurements:
   * - sm: track 36×20px, knob 16×16px
   * - md: track 44×24px, knob 20×20px
   */
  size: ToggleSize;

  /**
   * Whether the toggle is pressed (on)
   * @required
   * @default false
   *
   * Visual:
   * - false: knob left, track Gray/100
   * - true: knob right, track Brand/600
   */
  pressed: boolean;

  /**
   * Interactive state (typically managed via CSS, not as prop)
   * @optional
   * @default 'default'
   *
   * Figma has: Default, Hover, Focus, Disabled
   * In code: CSS pseudo-classes and disabled attribute
   */
  state?: ToggleInteractiveState;

  /**
   * Whether the toggle is disabled
   * Note: Managed via disabled attribute
   * @optional
   * @default false
   */
  disabled?: boolean;
}

/**
 * Extended interface including web-specific properties
 * These properties don't exist in Figma but are necessary for web implementation
 */
export interface WebToggleContract extends FigmaToggleContract {
  /**
   * Toggle name attribute (web-specific, for forms)
   * Not in Figma
   */
  name?: string;

  /**
   * Toggle value attribute (web-specific, for forms)
   * Not in Figma
   * @default 'on'
   */
  value?: string;

  /**
   * ARIA label for accessibility (web-specific)
   * Not in Figma
   * Required when no visible label is provided
   */
  ariaLabel?: string | null;

  /**
   * ARIA described-by for associating with help text
   * Not in Figma
   */
  ariaDescribedBy?: string | null;

  /**
   * Text label for the toggle
   * In Figma: boolean property "Text" shows/hides label
   * In code: Content via slot or string property
   */
  label?: string;

  /**
   * Supporting/helper text
   * In Figma: boolean property "Supporting text" shows/hides helper text
   * In code: Content via slot or string property
   */
  supportingText?: string;
}

/**
 * Validation helper: Check if a value is a valid ToggleSize
 */
export function isValidToggleSize(value: string): value is ToggleSize {
  return ['sm', 'md'].includes(value);
}

/**
 * Contract metadata
 */
export const FIGMA_TOGGLE_CONTRACT = {
  componentId: '1102:4208',
  componentName: 'Toggle',
  figmaFileId: 'CICp1MWc31lkvjX3jYo1rj',
  extractedAt: '2026-02-11T00:00:00Z',
  version: '1.0.0',

  properties: {
    size: {
      required: true,
      default: 'sm' as ToggleSize,
      values: ['sm', 'md'] as const,
      measurements: {
        sm: { track: '36px × 20px', knob: '16px' },
        md: { track: '44px × 24px', knob: '20px' }
      }
    },
    pressed: {
      required: true,
      default: false
    },
    disabled: {
      required: false,
      default: false
    }
  },

  designTokens: {
    colors: {
      'brand-600': '#7F56D9',
      'gray-700': '#414651',
      'gray-600': '#535862',
      'gray-200': '#E9EAEB',
      'gray-100': '#F5F5F5',
      'gray-50': '#FAFAFA',
      'white': '#FFFFFF'
    },
    effects: {
      'shadow-sm': '0 1px 2px rgba(10, 13, 18, 0.06), 0 1px 3px rgba(10, 13, 18, 0.10)',
      'focus-ring': '0 0 0 4px #F4EBFF'
    },
    spacing: {
      trackPadding: '2px',
      gap: '12px',
      textGap: '2px'
    },
    trackColors: {
      offDefault: '#F5F5F5',
      offHover: '#E9EAEB',
      offFocus: '#FAFAFA',
      offDisabled: '#F5F5F5',
      onDefault: '#7F56D9',
      onHover: '#7F56D9',
      onFocus: '#7F56D9',
      onDisabled: '#F5F5F5'
    }
  },

  typography: {
    label: {
      sm: 'Inter Medium, 14px/20px',
      md: 'Inter Medium, 16px/24px'
    },
    supporting: {
      sm: 'Inter Regular, 14px/20px',
      md: 'Inter Regular, 16px/24px'
    }
  }
} as const;

/**
 * Type guard to validate if an object implements FigmaToggleContract
 */
export function validateFigmaToggleContract(obj: any): obj is FigmaToggleContract {
  return (
    obj != null &&
    typeof obj === 'object' &&
    isValidToggleSize(obj.size) &&
    typeof obj.pressed === 'boolean' &&
    (obj.disabled === undefined || typeof obj.disabled === 'boolean')
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
  } else if (!isValidToggleSize(obj.size)) {
    errors.push(`Invalid size value: "${obj.size}". Must be one of: ${FIGMA_TOGGLE_CONTRACT.properties.size.values.join(', ')}`);
  }

  if (!('pressed' in obj)) {
    errors.push('Missing required property: pressed');
  } else if (typeof obj.pressed !== 'boolean') {
    errors.push(`Invalid pressed value: "${obj.pressed}". Must be a boolean`);
  }

  if ('disabled' in obj && typeof obj.disabled !== 'boolean') {
    errors.push(`Invalid disabled value: "${obj.disabled}". Must be a boolean`);
  }

  return errors;
}
