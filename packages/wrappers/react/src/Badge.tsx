/**
 * @package @kds/react
 * @component Badge
 * @description React component wrapper for kds-badge web component
 */

import React, { forwardRef, useRef, useEffect } from 'react';
import type { BadgeSize, BadgeColor, BadgeIcon } from '@kds/web-components';

export interface BadgeProps {
  /**
   * Badge size
   * @default 'sm'
   */
  size?: BadgeSize;

  /**
   * Badge color variant
   * @default 'primary'
   */
  color?: BadgeColor;

  /**
   * Badge icon variant
   * @default 'false'
   */
  icon?: BadgeIcon;

  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string;

  /**
   * Dismiss event handler (for x-close variant)
   */
  onDismiss?: (event: CustomEvent) => void;

  /**
   * Badge content
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
 * Badge component wrapper for React
 *
 * @example
 * ```tsx
 * import { Badge } from '@kds/react';
 *
 * function App() {
 *   return (
 *     <>
 *       <Badge color="success">Active</Badge>
 *       <Badge icon="dot" color="warning">Pending</Badge>
 *       <Badge icon="x-close" onDismiss={() => console.log('dismissed')}>Tag</Badge>
 *     </>
 *   );
 * }
 * ```
 */
export const Badge = forwardRef<HTMLElement, BadgeProps>(
  (
    {
      size = 'sm',
      color = 'primary',
      icon = 'false',
      ariaLabel,
      onDismiss,
      children,
      className,
      style,
    },
    ref
  ) => {
    const badgeRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (ref && badgeRef.current) {
        if (typeof ref === 'function') {
          ref(badgeRef.current);
        } else {
          (ref as React.MutableRefObject<HTMLElement | null>).current = badgeRef.current;
        }
      }
    }, [ref]);

    useEffect(() => {
      const badge = badgeRef.current;
      if (!badge || !onDismiss) return;

      const handleDismiss = (event: Event) => {
        onDismiss(event as CustomEvent);
      };

      badge.addEventListener('kds-badge-dismiss', handleDismiss);

      return () => {
        badge.removeEventListener('kds-badge-dismiss', handleDismiss);
      };
    }, [onDismiss]);

    return React.createElement(
      'kds-badge',
      {
        ref: badgeRef,
        size,
        color,
        icon,
        'aria-label': ariaLabel,
        class: className,
        style,
      },
      children
    );
  }
);

Badge.displayName = 'Badge';
