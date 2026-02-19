/**
 * @figmaContract input-field
 * @source Figma: Untitled UI - FREE Figma UI kit v2.0
 * @frameId 1090:57817
 * @extractedAt 2026-02-18
 *
 * TypeScript type definitions derived from the Figma contract.
 * These types are the source of truth for the LIT component API.
 */

/** Visual variant of the input field */
export type InputFieldType =
  | 'default'
  | 'leading-dropdown'
  | 'trailing-dropdown'
  | 'leading-text'
  | 'payment';

/**
 * Figma visual states (derived in code, not a direct prop):
 * - placeholder → value is empty
 * - filled      → value is non-empty
 * - focused     → :focus-within CSS pseudo-class
 * - disabled    → disabled attribute
 */
export type InputFieldState = 'placeholder' | 'filled' | 'focused' | 'disabled';

/** Props for the kds-input-field LIT component */
export interface InputFieldProps {
  /** Visual variant. Default: 'default' */
  type: InputFieldType;

  /** Label text above the input. Empty string = no label. */
  label: string;

  /** Hint / helper text below the input. When destructive=true, styled as error message. */
  hint: string;

  /** Placeholder text for the native input. */
  placeholder: string;

  /** Current value of the input. */
  value: string;

  /** HTML name attribute for form participation. */
  name: string;

  /** HTML input type attribute (text, email, password, number, tel, url…). Default: 'text' */
  inputType: string;

  /**
   * Error / destructive state.
   * - Border changes to Error/300 (#FDA29B)
   * - Alert circle icon appears on the right
   * - Focus ring uses Error/100 (#FEF3F2)
   * - Hint text, if present, is styled as error message
   */
  destructive: boolean;

  /** Disabled state. Prevents interaction, lightens colors. */
  disabled: boolean;

  /**
   * Show the leading icon slot (left side inside the input).
   * Consumer provides the icon via <slot name="leading-icon">.
   */
  leadingIcon: boolean;

  /**
   * Show a help/question-mark icon button on the right.
   * Fires kds-help-click event when clicked.
   */
  helpIcon: boolean;

  /**
   * Text prefix shown inside the input on the left.
   * Used with type='leading-text'. E.g. 'http://', '$', '+1'.
   */
  leadingText: string;

  /** HTML required attribute for native form validation. */
  required: boolean;
}

/** Default prop values */
export const INPUT_FIELD_DEFAULTS: InputFieldProps = {
  type: 'default',
  label: '',
  hint: '',
  placeholder: '',
  value: '',
  name: '',
  inputType: 'text',
  destructive: false,
  disabled: false,
  leadingIcon: false,
  helpIcon: false,
  leadingText: '',
  required: false,
};

/** Design tokens — extracted from Figma variables */
export const INPUT_FIELD_TOKENS = {
  input: {
    background: '#FFFFFF',
    borderRadius: '8px',
    paddingX: '14px',
    paddingY: '10px',
    gap: '8px',
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: '400',
  },
  label: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: '500',
    color: '#414651',    // Gray/700
    gap: '6px',
  },
  hint: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: '400',
    color: '#535862',    // Gray/600
    gap: '6px',
  },
  borders: {
    default:     '#D5D7DA',  // Gray/300
    focused:     '#D6BBFB',  // Brand/300
    destructive: '#FDA29B',  // Error/300
    disabled:    '#D5D7DA',  // Gray/300
  },
  shadows: {
    default:           '0px 1px 2px 0px rgba(10, 13, 18, 0.05)',
    focused:           '0px 0px 0px 4px #F4EBFF, 0px 1px 2px 0px rgba(10, 13, 18, 0.05)',
    focusedDestructive:'0px 0px 0px 4px #FEF3F2, 0px 1px 2px 0px rgba(10, 13, 18, 0.05)',
  },
  text: {
    placeholder: '#717680',  // Gray/500
    value:       '#181D27',  // Gray/900
    label:       '#414651',  // Gray/700
    hint:        '#535862',  // Gray/600
    error:       '#D92D20',  // Error/600
    disabled:    '#A4ACBA',
  },
  backgrounds: {
    default:  '#FFFFFF',
    disabled: '#F9FAFB',  // Gray/50
  },
  icons: {
    size:        '20px',  // leading icon
    alertSize:   '16px',  // alert-circle (destructive)
    helpSize:    '16px',  // help-circle
    color:       '#717680',  // Gray/500 (resting)
    colorFilled: '#181D27',  // Gray/900 (filled)
    errorColor:  '#F04438',  // Error/500
  },
} as const;

/** Events emitted by kds-input-field */
export interface InputFieldEvents {
  /** Fired on every keystroke / value change */
  'kds-input': CustomEvent<{ value: string }>;
  /** Fired on blur when value has changed */
  'kds-change': CustomEvent<{ value: string }>;
  /** Fired when the help icon is clicked */
  'kds-help-click': CustomEvent<void>;
}
