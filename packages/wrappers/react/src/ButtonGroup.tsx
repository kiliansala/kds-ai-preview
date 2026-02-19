/**
 * @package @kds/react
 * @component ButtonGroup, ButtonGroupItem
 * @description React component wrappers for kds-button-group web components
 */

import React, { forwardRef, useRef, useEffect } from 'react';
import type { ButtonGroupItemIcon } from '@kds/web-components';

export interface ButtonGroupProps {
  /**
   * ARIA label for the group
   */
  ariaLabel?: string;

  /**
   * Group content (ButtonGroupItem children)
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

export const ButtonGroup = forwardRef<HTMLElement, ButtonGroupProps>(
  ({ ariaLabel, children, className, style }, ref) => {
    const groupRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (ref && groupRef.current) {
        if (typeof ref === 'function') {
          ref(groupRef.current);
        } else {
          (ref as React.MutableRefObject<HTMLElement | null>).current = groupRef.current;
        }
      }
    }, [ref]);

    return React.createElement(
      'kds-button-group',
      {
        ref: groupRef,
        'aria-label': ariaLabel,
        class: className,
        style,
      },
      children
    );
  }
);

ButtonGroup.displayName = 'ButtonGroup';

export interface ButtonGroupItemProps {
  /**
   * Whether this item is selected
   * @default false
   */
  selected?: boolean;

  /**
   * Icon variant
   * @default 'none'
   */
  icon?: ButtonGroupItemIcon;

  /**
   * Whether the item is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Value for selection tracking
   */
  value?: string;

  /**
   * ARIA label (required for icon-only)
   */
  ariaLabel?: string;

  /**
   * Click event handler
   */
  onClick?: (event: CustomEvent) => void;

  /**
   * Item content
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

export const ButtonGroupItem = forwardRef<HTMLElement, ButtonGroupItemProps>(
  (
    {
      selected = false,
      icon = 'none',
      disabled = false,
      value,
      ariaLabel,
      onClick,
      children,
      className,
      style,
    },
    ref
  ) => {
    const itemRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (ref && itemRef.current) {
        if (typeof ref === 'function') {
          ref(itemRef.current);
        } else {
          (ref as React.MutableRefObject<HTMLElement | null>).current = itemRef.current;
        }
      }
    }, [ref]);

    useEffect(() => {
      const item = itemRef.current;
      if (!item || !onClick) return;

      const handleClick = (event: Event) => {
        onClick(event as CustomEvent);
      };

      item.addEventListener('kds-button-group-item-click', handleClick);

      return () => {
        item.removeEventListener('kds-button-group-item-click', handleClick);
      };
    }, [onClick]);

    return React.createElement(
      'kds-button-group-item',
      {
        ref: itemRef,
        selected: selected || undefined,
        icon,
        disabled: disabled || undefined,
        value,
        'aria-label': ariaLabel,
        class: className,
        style,
      },
      children
    );
  }
);

ButtonGroupItem.displayName = 'ButtonGroupItem';
