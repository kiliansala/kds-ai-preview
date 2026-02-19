/**
 * TypeScript contract for Badge component
 * Source: .figma/badge.figma-contract.json
 *
 * Extracted from Figma via MCP on 2026-02-18
 * Frame nodeId: 1046:3819
 *
 * This file defines the interface that all Badge implementations must satisfy
 * to match the Figma design specification (Single Source of Truth).
 */

/**
 * Badge size variants from Figma
 * Figma property: "Size"
 *
 * - sm: height 22px, font 12px/18px
 * - md: height 24px, font 14px/20px
 * - lg: height 28px, font 14px/20px
 */
export type BadgeSize = 'sm' | 'md' | 'lg';

/**
 * Badge color variants from Figma
 * Figma property: "Color"
 *
 * Each color uses two token levels:
 * - /50 for background
 * - /700 for text
 * - /500 for accent (dot, icon-only border)
 */
export type BadgeColor =
  | 'gray'
  | 'primary'
  | 'error'
  | 'warning'
  | 'success'
  | 'blue-gray'
  | 'blue-light'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink'
  | 'rose'
  | 'orange';

/**
 * Badge icon variants from Figma
 * Figma property: "Icon"
 *
 * - false: text only
 * - dot: colored dot indicator left of text
 * - country: flag icon left of text
 * - avatar: circular avatar left of text
 * - x-close: text + close button right
 * - icon-right: text + icon slot right
 * - icon-left: icon slot left + text
 * - only: icon only, no text
 */
export type BadgeIcon = 'false' | 'dot' | 'country' | 'avatar' | 'x-close' | 'icon-right' | 'icon-left' | 'only';

/**
 * Core interface that Badge component must implement
 * Matches Figma component properties exactly
 */
export interface FigmaBadgeContract {
  /**
   * Badge size variant
   * @required
   * @default 'sm'
   */
  size: BadgeSize;

  /**
   * Badge color variant
   * @required
   * @default 'primary'
   */
  color: BadgeColor;

  /**
   * Badge icon variant
   * @required
   * @default 'false'
   */
  icon: BadgeIcon;
}

/**
 * Extended interface including web-specific properties
 * These properties don't exist in Figma but are necessary for web implementation
 */
export interface WebBadgeContract extends FigmaBadgeContract {
  /**
   * ARIA label for accessibility (web-specific)
   * Not in Figma
   */
  ariaLabel?: string | null;

  /**
   * Text label content
   * In Figma: hardcoded "Label" text
   * In code: Content via slot or string property
   */
  label?: string;
}

/**
 * Validation helper: Check if a value is a valid BadgeSize
 */
export function isValidBadgeSize(value: string): value is BadgeSize {
  return ['sm', 'md', 'lg'].includes(value);
}

/**
 * Validation helper: Check if a value is a valid BadgeColor
 */
export function isValidBadgeColor(value: string): value is BadgeColor {
  return [
    'gray', 'primary', 'error', 'warning', 'success',
    'blue-gray', 'blue-light', 'blue', 'indigo', 'purple',
    'pink', 'rose', 'orange'
  ].includes(value);
}

/**
 * Validation helper: Check if a value is a valid BadgeIcon
 */
export function isValidBadgeIcon(value: string): value is BadgeIcon {
  return ['false', 'dot', 'country', 'avatar', 'x-close', 'icon-right', 'icon-left', 'only'].includes(value);
}

/**
 * Contract metadata
 */
export const FIGMA_BADGE_CONTRACT = {
  componentId: '1046:3819',
  componentName: 'Badge',
  figmaFileId: 'CICp1MWc31lkvjX3jYo1rj',
  extractedAt: '2026-02-18T00:00:00Z',
  version: '1.0.0',

  properties: {
    size: {
      required: true,
      default: 'sm' as BadgeSize,
      values: ['sm', 'md', 'lg'] as const,
      measurements: {
        sm: { height: '22px', font: '12px/18px' },
        md: { height: '24px', font: '14px/20px' },
        lg: { height: '28px', font: '14px/20px' }
      }
    },
    color: {
      required: true,
      default: 'primary' as BadgeColor,
      values: [
        'gray', 'primary', 'error', 'warning', 'success',
        'blue-gray', 'blue-light', 'blue', 'indigo', 'purple',
        'pink', 'rose', 'orange'
      ] as const
    },
    icon: {
      required: true,
      default: 'false' as BadgeIcon,
      values: ['false', 'dot', 'country', 'avatar', 'x-close', 'icon-right', 'icon-left', 'only'] as const
    }
  },

  designTokens: {
    colors: {
      gray: { bg: '#F5F5F5', text: '#414651', accent: '#717680' },
      primary: { bg: '#F9F5FF', text: '#6941C6', accent: '#9E77ED' },
      error: { bg: '#FEF3F2', text: '#B42318', accent: '#F04438' },
      warning: { bg: '#FFFAEB', text: '#B54708', accent: '#F79009' },
      success: { bg: '#ECFDF3', text: '#027A48', accent: '#12B76A' },
      'blue-gray': { bg: '#F8F9FC', text: '#363F72', accent: '#4E5BA6' },
      'blue-light': { bg: '#F0F9FF', text: '#026AA2', accent: '#0BA5EC' },
      blue: { bg: '#EFF8FF', text: '#175CD3', accent: '#2E90FA' },
      indigo: { bg: '#EEF4FF', text: '#3538CD', accent: '#6172F3' },
      purple: { bg: '#F4F3FF', text: '#5925DC', accent: '#7A5AF8' },
      pink: { bg: '#FDF2FA', text: '#C11574', accent: '#EE46BC' },
      rose: { bg: '#FFF1F3', text: '#C01048', accent: '#F63D68' },
      orange: { bg: '#FFF6ED', text: '#C4320A', accent: '#EF6820' }
    },
    spacing: {
      sm: { paddingX: '8px', paddingY: '2px', gap: '4px' },
      md: { paddingX: '10px', paddingY: '2px', gap: '5px' },
      lg: { paddingX: '12px', paddingY: '4px', gap: '6px' }
    },
    borderRadius: '9999px'
  },

  typography: {
    sm: 'Inter Medium, 12px/18px',
    md: 'Inter Medium, 14px/20px',
    lg: 'Inter Medium, 14px/20px'
  }
} as const;

/**
 * Type guard to validate if an object implements FigmaBadgeContract
 */
export function validateFigmaBadgeContract(obj: any): obj is FigmaBadgeContract {
  return (
    obj != null &&
    typeof obj === 'object' &&
    isValidBadgeSize(obj.size) &&
    isValidBadgeColor(obj.color) &&
    isValidBadgeIcon(obj.icon)
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
  } else if (!isValidBadgeSize(obj.size)) {
    errors.push(`Invalid size value: "${obj.size}". Must be one of: ${FIGMA_BADGE_CONTRACT.properties.size.values.join(', ')}`);
  }

  if (!('color' in obj)) {
    errors.push('Missing required property: color');
  } else if (!isValidBadgeColor(obj.color)) {
    errors.push(`Invalid color value: "${obj.color}". Must be one of: ${FIGMA_BADGE_CONTRACT.properties.color.values.join(', ')}`);
  }

  if (!('icon' in obj)) {
    errors.push('Missing required property: icon');
  } else if (!isValidBadgeIcon(obj.icon)) {
    errors.push(`Invalid icon value: "${obj.icon}". Must be one of: ${FIGMA_BADGE_CONTRACT.properties.icon.values.join(', ')}`);
  }

  return errors;
}
