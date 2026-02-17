/**
 * @package @kds/react
 * @component Toggle
 * @description React wrapper for kds-toggle web component
 */

import React, { useEffect, useRef, forwardRef } from 'react';
import type { ToggleSize } from '@kds/web-components';
import '@kds/web-components';

export interface ToggleProps {
  /**
   * Toggle size
   * @default 'sm'
   */
  size?: ToggleSize;

  /**
   * Whether the toggle is pressed (on)
   * @default false
   */
  pressed?: boolean;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Supporting/helper text below the label
   */
  supportingText?: string;

  /**
   * Name attribute for form submission
   */
  name?: string;

  /**
   * Value attribute for form submission
   * @default 'on'
   */
  value?: string;

  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string;

  /**
   * ARIA described-by for help text
   */
  ariaDescribedBy?: string;

  /**
   * Change event handler
   */
  onChange?: (event: CustomEvent) => void;

  /**
   * Focus event handler
   */
  onFocus?: (event: CustomEvent) => void;

  /**
   * Blur event handler
   */
  onBlur?: (event: CustomEvent) => void;

  /**
   * Toggle label (text content)
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
 * Toggle component wrapper for React
 *
 * @example
 * ```tsx
 * import { Toggle } from '@kds/react';
 * import '@kds/web-components/tokens.css';
 *
 * function App() {
 *   const [pressed, setPressed] = React.useState(false);
 *
 *   return (
 *     <Toggle
 *       size="sm"
 *       pressed={pressed}
 *       onChange={(e) => setPressed(e.detail.pressed)}
 *     >
 *       Remember me
 *     </Toggle>
 *   );
 * }
 * ```
 */
export const Toggle = forwardRef<HTMLElement, ToggleProps>(
  (
    {
      size = 'sm',
      pressed = false,
      disabled = false,
      supportingText,
      name,
      value = 'on',
      ariaLabel,
      ariaDescribedBy,
      onChange,
      onFocus,
      onBlur,
      children,
      className,
      style,
    },
    ref
  ) => {
    const toggleRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (ref && toggleRef.current) {
        if (typeof ref === 'function') {
          ref(toggleRef.current);
        } else {
          (ref as React.MutableRefObject<HTMLElement | null>).current = toggleRef.current;
        }
      }
    }, [ref]);

    useEffect(() => {
      const toggle = toggleRef.current;
      if (!toggle || !onChange) return;

      const handleChange = (event: Event) => {
        onChange(event as CustomEvent);
      };

      toggle.addEventListener('kds-toggle-change', handleChange);

      return () => {
        toggle.removeEventListener('kds-toggle-change', handleChange);
      };
    }, [onChange]);

    useEffect(() => {
      const toggle = toggleRef.current;
      if (!toggle || !onFocus) return;

      const handleFocus = (event: Event) => {
        onFocus(event as CustomEvent);
      };

      toggle.addEventListener('kds-toggle-focus', handleFocus);

      return () => {
        toggle.removeEventListener('kds-toggle-focus', handleFocus);
      };
    }, [onFocus]);

    useEffect(() => {
      const toggle = toggleRef.current;
      if (!toggle || !onBlur) return;

      const handleBlur = (event: Event) => {
        onBlur(event as CustomEvent);
      };

      toggle.addEventListener('kds-toggle-blur', handleBlur);

      return () => {
        toggle.removeEventListener('kds-toggle-blur', handleBlur);
      };
    }, [onBlur]);

    return React.createElement(
      'kds-toggle',
      {
        ref: toggleRef,
        size,
        pressed: pressed ? '' : undefined,
        disabled: disabled ? '' : undefined,
        'supporting-text': supportingText,
        name,
        value,
        'aria-label': ariaLabel,
        'aria-describedby': ariaDescribedBy,
        class: className,
        style,
      },
      children
    );
  }
);

Toggle.displayName = 'Toggle';
