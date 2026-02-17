/**
 * @package @kds/react
 * @component Tooltip
 * @description React wrapper for kds-tooltip web component
 */

import React, { useEffect, useRef, forwardRef } from 'react';
import type { TooltipTheme, TooltipArrow } from '@kds/web-components';
import '@kds/web-components';

export interface TooltipProps {
  /**
   * Tooltip color theme
   * @default 'light'
   */
  theme?: TooltipTheme;

  /**
   * Arrow position
   * @default 'none'
   */
  arrow?: TooltipArrow;

  /**
   * Tooltip title text
   */
  text?: string;

  /**
   * Supporting/description text
   */
  supportingText?: string;

  /**
   * Tooltip content (alternative to text prop)
   */
  children?: React.ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Additional styles
   */
  style?: React.CSSProperties;
}

/**
 * Tooltip component wrapper for React
 *
 * @example
 * ```tsx
 * import { Tooltip } from '@kds/react';
 * import '@kds/web-components/tokens.css';
 *
 * function App() {
 *   return (
 *     <Tooltip
 *       text="This is a tooltip"
 *       theme="dark"
 *       arrow="bottom-center"
 *     />
 *   );
 * }
 *
 * // With supporting text
 * function WithSupporting() {
 *   return (
 *     <Tooltip
 *       text="This is a tooltip"
 *       supportingText="Tooltips help the user understand the meaning of an element."
 *       arrow="top-center"
 *     />
 *   );
 * }
 * ```
 */
export const Tooltip = forwardRef<HTMLElement, TooltipProps>(
  (
    {
      theme = 'light',
      arrow = 'none',
      text,
      supportingText,
      children,
      className,
      style,
    },
    ref
  ) => {
    const tooltipRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (ref && tooltipRef.current) {
        if (typeof ref === 'function') {
          ref(tooltipRef.current);
        } else {
          (ref as React.MutableRefObject<HTMLElement | null>).current = tooltipRef.current;
        }
      }
    }, [ref]);

    return React.createElement(
      'kds-tooltip',
      {
        ref: tooltipRef,
        theme,
        arrow,
        text,
        'supporting-text': supportingText,
        class: className,
        style,
      },
      children
    );
  }
);

Tooltip.displayName = 'Tooltip';
