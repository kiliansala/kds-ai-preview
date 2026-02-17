/**
 * @package @kds/react
 * @component Checkbox
 * @description React wrapper for kds-checkbox web component
 */

import React, { useEffect, useRef, forwardRef } from 'react';
import type { CheckboxSize } from '@kds/web-components';
import '@kds/web-components';

export interface CheckboxProps {
  /**
   * Checkbox size
   * @default 'md'
   */
  size?: CheckboxSize;

  /**
   * Whether the checkbox is checked
   * @default false
   */
  checked?: boolean;

  /**
   * Whether the checkbox is in indeterminate state
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Error/invalid state
   * @default false
   */
  error?: boolean;

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
   * Required attribute for form validation
   * @default false
   */
  required?: boolean;

  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string;

  /**
   * ARIA described-by for help text/error messages
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
   * Checkbox label (text content)
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
 * Checkbox component wrapper for React
 *
 * @example
 * ```tsx
 * import { Checkbox } from '@kds/react';
 * import '@kds/web-components/tokens.css';
 *
 * function App() {
 *   const [checked, setChecked] = React.useState(false);
 *
 *   return (
 *     <Checkbox
 *       size="md"
 *       checked={checked}
 *       onChange={(e) => setChecked(e.detail.checked)}
 *     >
 *       Remember me
 *     </Checkbox>
 *   );
 * }
 * ```
 */
export const Checkbox = forwardRef<HTMLElement, CheckboxProps>(
  (
    {
      size = 'md',
      checked = false,
      indeterminate = false,
      disabled = false,
      error = false,
      name,
      value = 'on',
      required = false,
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
    const checkboxRef = useRef<HTMLElement>(null);

    // Handle ref forwarding
    useEffect(() => {
      if (ref && checkboxRef.current) {
        if (typeof ref === 'function') {
          ref(checkboxRef.current);
        } else {
          (ref as React.MutableRefObject<HTMLElement | null>).current = checkboxRef.current;
        }
      }
    }, [ref]);

    // Handle change events from web component
    useEffect(() => {
      const checkbox = checkboxRef.current;
      if (!checkbox || !onChange) return;

      const handleChange = (event: Event) => {
        onChange(event as CustomEvent);
      };

      checkbox.addEventListener('kds-checkbox-change', handleChange);

      return () => {
        checkbox.removeEventListener('kds-checkbox-change', handleChange);
      };
    }, [onChange]);

    // Handle focus events from web component
    useEffect(() => {
      const checkbox = checkboxRef.current;
      if (!checkbox || !onFocus) return;

      const handleFocus = (event: Event) => {
        onFocus(event as CustomEvent);
      };

      checkbox.addEventListener('kds-checkbox-focus', handleFocus);

      return () => {
        checkbox.removeEventListener('kds-checkbox-focus', handleFocus);
      };
    }, [onFocus]);

    // Handle blur events from web component
    useEffect(() => {
      const checkbox = checkboxRef.current;
      if (!checkbox || !onBlur) return;

      const handleBlur = (event: Event) => {
        onBlur(event as CustomEvent);
      };

      checkbox.addEventListener('kds-checkbox-blur', handleBlur);

      return () => {
        checkbox.removeEventListener('kds-checkbox-blur', handleBlur);
      };
    }, [onBlur]);

    return React.createElement(
      'kds-checkbox',
      {
        ref: checkboxRef,
        size,
        checked: checked ? '' : undefined,
        indeterminate: indeterminate ? '' : undefined,
        disabled: disabled ? '' : undefined,
        error: error ? '' : undefined,
        name,
        value,
        required: required ? '' : undefined,
        'aria-label': ariaLabel,
        'aria-describedby': ariaDescribedBy,
        class: className,
        style,
      },
      children
    );
  }
);

Checkbox.displayName = 'Checkbox';
