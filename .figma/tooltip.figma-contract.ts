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
export type TooltipArrow =
  | 'none'
  | 'bottom-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'left'
  | 'right';

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
export function isValidTooltipTheme(value: string): value is TooltipTheme {
  return ['light', 'dark'].includes(value);
}

/**
 * Validation helper: Check if a value is a valid TooltipArrow
 */
export function isValidTooltipArrow(value: string): value is TooltipArrow {
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
      default: 'light' as TooltipTheme,
      values: ['light', 'dark'] as const
    },
    arrow: {
      required: false,
      default: 'none' as TooltipArrow,
      values: ['none', 'bottom-center', 'bottom-left', 'bottom-right', 'top-center', 'left', 'right'] as const
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
} as const;

/**
 * Type guard to validate if an object implements FigmaTooltipContract
 */
export function validateFigmaTooltipContract(obj: any): obj is FigmaTooltipContract {
  return (
    obj != null &&
    typeof obj === 'object' &&
    (obj.theme === undefined || isValidTooltipTheme(obj.theme)) &&
    (obj.arrow === undefined || isValidTooltipArrow(obj.arrow))
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

  if ('theme' in obj && !isValidTooltipTheme(obj.theme)) {
    errors.push(`Invalid theme value: "${obj.theme}". Must be one of: ${FIGMA_TOOLTIP_CONTRACT.properties.theme.values.join(', ')}`);
  }

  if ('arrow' in obj && !isValidTooltipArrow(obj.arrow)) {
    errors.push(`Invalid arrow value: "${obj.arrow}". Must be one of: ${FIGMA_TOOLTIP_CONTRACT.properties.arrow.values.join(', ')}`);
  }

  return errors;
}
