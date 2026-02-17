/**
 * TypeScript contract for Checkbox component
 * Source: .figma/checkbox.figma-contract.json
 *
 * ⚠️ STATUS: PENDING FIGMA DATA EXTRACTION
 * This file defines the interface structure based on Button patterns.
 * TODO values must be replaced with actual Figma component properties.
 *
 * This file defines the interface that all Checkbox implementations must satisfy
 * to match the Figma design specification (Single Source of Truth).
 */

/**
 * Checkbox size variants from Figma
 * Figma property: "size"
 *
 * - sm: 16px × 16px checkbox
 * - md: 20px × 20px checkbox (default)
 */
export type CheckboxSize = 'sm' | 'md';

/**
 * Checkbox check states
 *
 * Figma represents these via boolean properties:
 * - checked: true/false (shows checkmark when true)
 * - indeterminate: true/false (shows horizontal line when true, Checkbox only)
 *
 * Visual states:
 * - unchecked: checked=false, indeterminate=false
 * - checked: checked=true, indeterminate=false
 * - indeterminate: indeterminate=true (takes precedence over checked)
 */
export type CheckboxState = 'checked' | 'unchecked' | 'indeterminate';

/**
 * Interactive states from Figma
 * Figma property: "state"
 *
 * In code, states are managed via:
 * - Default: no special class/state
 * - Hover: :hover pseudo-class
 * - Focused: :focus-visible pseudo-class
 * - Disabled: disabled attribute
 */
export type CheckboxInteractiveState = 'default' | 'hover' | 'focused' | 'disabled';

/**
 * Core interface that Checkbox component must implement
 * Matches Figma component properties exactly
 */
export interface FigmaCheckboxContract {
  /**
   * Checkbox size variant
   * @required
   * @default 'md'
   *
   * Measurements:
   * - sm: 16px × 16px
   * - md: 20px × 20px
   */
  size: CheckboxSize;

  /**
   * Whether the checkbox is checked
   * @required
   * @default false
   *
   * Visual: Shows checkmark icon when true
   */
  checked: boolean;

  /**
   * Whether the checkbox is in indeterminate state
   * @optional
   * @default false
   *
   * Visual: Shows horizontal line instead of checkmark
   * Note: Checkbox only (not for Radio). Indeterminate takes precedence over checked for display
   */
  indeterminate?: boolean;

  /**
   * Interactive state (typically managed via CSS, not as prop)
   * @optional
   * @default 'default'
   *
   * Figma has: Default, Hover, Focused, Disabled
   * In code: CSS pseudo-classes and disabled attribute
   */
  state?: CheckboxInteractiveState;

  /**
   * Whether the checkbox is disabled
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
export interface WebCheckboxContract extends FigmaCheckboxContract {
  /**
   * Checkbox name attribute (web-specific, for forms)
   * Not in Figma
   */
  name?: string;

  /**
   * Checkbox value attribute (web-specific, for forms)
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
   * ARIA described-by for associating with help text or error messages
   * Not in Figma
   */
  ariaDescribedBy?: string | null;

  /**
   * Text label for the checkbox
   * In Figma: boolean property "text" shows/hides "Remember me"
   * In code: Content via slot or string property
   */
  label?: string;

  /**
   * Supporting/helper text
   * In Figma: boolean property "supportingText" shows/hides helper text
   * In code: Content via slot or string property
   */
  supportingText?: string;

  /**
   * Required attribute for form validation (web-specific)
   * Not in Figma
   */
  required?: boolean;

  /**
   * Error/invalid state (web-specific)
   * Note: Not found in Figma design, but useful for form validation
   */
  error?: boolean;
}

/**
 * Validation helper: Check if a value is a valid CheckboxSize
 */
export function isValidCheckboxSize(value: string): value is CheckboxSize {
  return ['sm', 'md'].includes(value);
}

/**
 * Validation helper: Check if a value is a valid CheckboxState
 */
export function isValidCheckboxState(value: string): value is CheckboxState {
  return ['checked', 'unchecked', 'indeterminate'].includes(value);
}

/**
 * Contract metadata
 */
export const FIGMA_CHECKBOX_CONTRACT = {
  componentId: '1097:63652',
  componentName: 'Checkbox',
  figmaFileId: 'CICp1MWc31lkvjX3jYo1rj',
  extractedAt: '2026-02-10T19:50:00Z',
  version: '1.0.0',

  properties: {
    size: {
      required: true,
      default: 'md' as CheckboxSize,
      values: ['sm', 'md'] as const,
      measurements: {
        sm: '16px',
        md: '20px'
      }
    },
    checked: {
      required: true,
      default: false
    },
    indeterminate: {
      required: false,
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
      'brand-50': '#F9F5FF',
      'brand-300': '#D6BBFB',
      'gray-700': '#414651',
      'gray-600': '#535862',
      'gray-300': '#D5D7DA',
      'gray-200': '#E9EAEB',
      'gray-100': '#F5F5F5',
      'white': '#FFFFFF'
    },
    effects: {
      'focus-ring': '0 0 0 4px #F4EBFF'
    },
    spacing: {
      gap: '12px'
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
 * Type guard to validate if an object implements FigmaCheckboxContract
 */
export function validateFigmaCheckboxContract(obj: any): obj is FigmaCheckboxContract {
  return (
    obj != null &&
    typeof obj === 'object' &&
    isValidCheckboxSize(obj.size) &&
    typeof obj.checked === 'boolean' &&
    (obj.indeterminate === undefined || typeof obj.indeterminate === 'boolean') &&
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
  } else if (!isValidCheckboxSize(obj.size)) {
    errors.push(`Invalid size value: "${obj.size}". Must be one of: ${FIGMA_CHECKBOX_CONTRACT.properties.size.values.join(', ')}`);
  }

  if (!('checked' in obj)) {
    errors.push('Missing required property: checked');
  } else if (typeof obj.checked !== 'boolean') {
    errors.push(`Invalid checked value: "${obj.checked}". Must be a boolean`);
  }

  if ('indeterminate' in obj && typeof obj.indeterminate !== 'boolean') {
    errors.push(`Invalid indeterminate value: "${obj.indeterminate}". Must be a boolean`);
  }

  if ('disabled' in obj && typeof obj.disabled !== 'boolean') {
    errors.push(`Invalid disabled value: "${obj.disabled}". Must be a boolean`);
  }

  return errors;
}

/**
 * ✅ EXTRACTION COMPLETE
 *
 * All data extracted from Figma via MCP on 2026-02-10T19:50:00Z
 *
 * Verified:
 * ✅ Component node ID (1097:63652)
 * ✅ Size property values (sm: 16px, md: 20px) and default (md)
 * ✅ Checked property (boolean)
 * ✅ Indeterminate state exists (Checkbox only)
 * ✅ Disabled state handling (via state property: Default/Hover/Focused/Disabled)
 * ✅ Label relationship (text: boolean in Figma, slot/string in code)
 * ✅ Supporting text (supportingText: boolean in Figma)
 * ✅ All Figma property names confirmed
 * ✅ Default values for all properties
 * ✅ Design tokens documented
 * ✅ Typography specifications
 * ✅ Spacing (12px gap between checkbox and label)
 *
 * Note: Error state not found in Figma design, but implemented as web-specific property
 */
