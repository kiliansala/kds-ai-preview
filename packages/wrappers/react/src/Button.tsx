/**
 * @package @kds/react
 * @component Button
 * @description React wrapper for kds-button web component
 */

import React, { useEffect, useRef, forwardRef } from 'react';
import type { ButtonSize, ButtonHierarchy, IconPosition } from '@kds/web-components';
import '@kds/web-components';

export interface ButtonProps {
  /**
   * Button size
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Visual hierarchy/style variant
   * @default 'primary'
   */
  hierarchy?: ButtonHierarchy;

  /**
   * Icon position relative to text
   * @default 'none'
   */
  iconPosition?: IconPosition;

  /**
   * Destructive/danger variant
   * @default false
   */
  destructive?: boolean;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Button type attribute
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * ARIA label for icon-only buttons
   */
  ariaLabel?: string;

  /**
   * Click event handler
   */
  onClick?: (event: CustomEvent) => void;

  /**
   * Button content (text and/or icon)
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
 * Button component wrapper for React
 *
 * @example
 * ```tsx
 * import { Button } from '@kds/react';
 * import '@kds/web-components/tokens.css';
 *
 * function App() {
 *   return (
 *     <Button size="md" hierarchy="primary" onClick={() => console.log('clicked')}>
 *       Click me
 *     </Button>
 *   );
 * }
 * ```
 */
export const Button = forwardRef<HTMLElement, ButtonProps>(
  (
    {
      size = 'md',
      hierarchy = 'primary',
      iconPosition = 'none',
      destructive = false,
      disabled = false,
      type = 'button',
      ariaLabel,
      onClick,
      children,
      className,
      style,
    },
    ref
  ) => {
    const buttonRef = useRef<HTMLElement>(null);

    // Handle ref forwarding
    useEffect(() => {
      if (ref && buttonRef.current) {
        if (typeof ref === 'function') {
          ref(buttonRef.current);
        } else {
          (ref as React.MutableRefObject<HTMLElement | null>).current = buttonRef.current;
        }
      }
    }, [ref]);

    // Handle click events from web component
    useEffect(() => {
      const button = buttonRef.current;
      if (!button || !onClick) return;

      const handleClick = (event: Event) => {
        onClick(event as CustomEvent);
      };

      button.addEventListener('kds-button-click', handleClick);

      return () => {
        button.removeEventListener('kds-button-click', handleClick);
      };
    }, [onClick]);

    return React.createElement(
      'kds-button',
      {
        ref: buttonRef,
        size,
        hierarchy,
        'icon-position': iconPosition,
        destructive: destructive ? '' : undefined,
        disabled: disabled ? '' : undefined,
        type,
        'aria-label': ariaLabel,
        class: className,
        style,
      },
      children
    );
  }
);

Button.displayName = 'Button';
