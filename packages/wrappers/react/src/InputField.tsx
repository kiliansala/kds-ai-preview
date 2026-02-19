/**
 * @package @kds/react
 * @component InputField
 * @description React component wrapper for kds-input-field web component
 */

import React, { forwardRef, useRef, useEffect, useImperativeHandle } from 'react';
import type { InputFieldType } from '@kds/web-components';

export interface InputFieldProps {
  /** Visual variant. Default: 'default'. */
  type?: InputFieldType;

  /** Label text above the input. Empty = no label. */
  label?: string;

  /** Helper/hint text below. In destructive state, styled as error message. */
  hint?: string;

  /** Placeholder text for the native input. */
  placeholder?: string;

  /** Current input value (controlled). */
  value?: string;

  /** Default value (uncontrolled). */
  defaultValue?: string;

  /** HTML name attribute for form participation. */
  name?: string;

  /** HTML input type (text, email, password, number, tel, url…). Default: 'text'. */
  inputType?: string;

  /** Error/destructive state. Red border + alert icon. */
  destructive?: boolean;

  /** Disabled state. */
  disabled?: boolean;

  /** Show leading icon slot. */
  leadingIcon?: boolean;

  /** Show help icon button on the right. */
  helpIcon?: boolean;

  /** Text prefix for type='leading-text'. E.g. 'http://', '$'. */
  leadingText?: string;

  /** HTML required attribute. */
  required?: boolean;

  /** ARIA label (used when label prop is not set). */
  'aria-label'?: string;

  /** Fired on every keystroke. */
  onKdsInput?: (e: CustomEvent<{ value: string }>) => void;

  /** Fired on blur after value change. */
  onKdsChange?: (e: CustomEvent<{ value: string }>) => void;

  /** Fired when help icon is clicked. */
  onKdsHelpClick?: (e: CustomEvent<void>) => void;

  /** Leading icon element (rendered into leading-icon slot). */
  leadingIconContent?: React.ReactNode;

  /** Leading dropdown element (for type='leading-dropdown'). */
  leadingDropdownContent?: React.ReactNode;

  /** Trailing dropdown element (for type='trailing-dropdown'). */
  trailingDropdownContent?: React.ReactNode;

  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

export const InputField = forwardRef<HTMLElement, InputFieldProps>(
  (
    {
      type = 'default',
      label,
      hint,
      placeholder,
      value,
      defaultValue,
      name,
      inputType,
      destructive,
      disabled,
      leadingIcon,
      helpIcon,
      leadingText,
      required,
      'aria-label': ariaLabel,
      onKdsInput,
      onKdsChange,
      onKdsHelpClick,
      leadingIconContent,
      leadingDropdownContent,
      trailingDropdownContent,
      className,
      style,
      id,
    },
    ref
  ) => {
    const elementRef = useRef<HTMLElement>(null);

    useImperativeHandle(ref, () => elementRef.current!);

    useEffect(() => {
      const el = elementRef.current;
      if (!el) return;

      const handleInput = (e: Event) => onKdsInput?.(e as CustomEvent<{ value: string }>);
      const handleChange = (e: Event) => onKdsChange?.(e as CustomEvent<{ value: string }>);
      const handleHelpClick = (e: Event) => onKdsHelpClick?.(e as CustomEvent<void>);

      el.addEventListener('kds-input', handleInput);
      el.addEventListener('kds-change', handleChange);
      el.addEventListener('kds-help-click', handleHelpClick);

      return () => {
        el.removeEventListener('kds-input', handleInput);
        el.removeEventListener('kds-change', handleChange);
        el.removeEventListener('kds-help-click', handleHelpClick);
      };
    }, [onKdsInput, onKdsChange, onKdsHelpClick]);

    // Sync value prop to web component imperatively (controlled mode)
    useEffect(() => {
      const el = elementRef.current as any;
      if (el && value !== undefined) {
        el.value = value;
      }
    }, [value]);

    return React.createElement(
      'kds-input-field' as any,
      {
        ref: elementRef,
        id,
        class: className,
        style,
        type,
        label: label ?? undefined,
        hint: hint ?? undefined,
        placeholder: placeholder ?? undefined,
        value: value ?? defaultValue ?? undefined,
        name: name ?? undefined,
        'input-type': inputType ?? undefined,
        destructive: destructive || undefined,
        disabled: disabled || undefined,
        'leading-icon': leadingIcon || undefined,
        'help-icon': helpIcon || undefined,
        'leading-text': leadingText ?? undefined,
        required: required || undefined,
        'aria-label': ariaLabel ?? undefined,
      },
      leadingIconContent
        ? React.createElement('span', { slot: 'leading-icon', key: 'leading-icon' }, leadingIconContent)
        : null,
      leadingDropdownContent
        ? React.createElement('div', { slot: 'leading-dropdown', key: 'leading-dropdown' }, leadingDropdownContent)
        : null,
      trailingDropdownContent
        ? React.createElement('div', { slot: 'trailing-dropdown', key: 'trailing-dropdown' }, trailingDropdownContent)
        : null
    );
  }
);

InputField.displayName = 'InputField';
