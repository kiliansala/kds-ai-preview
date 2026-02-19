/**
 * Accessibility Validation for Input Field Component
 *
 * Validates that kds-input-field meets WCAG 2.1 AA standards.
 *
 * Checks:
 * - Label association (accessible name)
 * - Native input element usage
 * - aria-invalid for error state
 * - aria-describedby for hint text
 * - Disabled state propagation
 * - Help button accessibility
 * - Alert icon aria-hidden
 * - Keyboard navigation & focus management
 * - Color contrast (manual checklist)
 * - Form participation
 *
 * Usage: tsx scripts/validate-input-field-a11y.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface A11yIssue {
  type: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  wcag?: string;
  recommendation?: string;
}

const issues: A11yIssue[] = [];

function addIssue(
  type: 'error' | 'warning' | 'info',
  category: string,
  message: string,
  opts?: { wcag?: string; recommendation?: string }
) {
  issues.push({ type, category, message, ...opts });
}

function readSource(): string {
  const p = path.join(__dirname, '../packages/web-components/src/components/kds-input-field.ts');
  if (!fs.existsSync(p)) throw new Error(`Component not found at ${p}`);
  return fs.readFileSync(p, 'utf-8');
}

// ─── Checks ──────────────────────────────────────────────────────────────────

function checkNativeInput(source: string): void {
  console.log('\nChecking native <input> element...');

  if (source.includes('<input')) {
    console.log('  OK: Native <input> element found');
    console.log('     → Inherits browser keyboard navigation, autofill, and form submission');
  } else {
    addIssue('error', 'Native Input', 'No native <input> element found — must use <input> for a11y', {
      wcag: 'WCAG 4.1.2 Name, Role, Value',
      recommendation: 'Replace any custom element with a native <input>',
    });
  }
}

function checkLabelAssociation(source: string): void {
  console.log('\nChecking label association...');

  // Should render a <label> element when label prop is set
  if (source.includes('<label') && source.includes('part="label"')) {
    console.log('  OK: <label> element with part="label" found');
  } else if (source.includes('<label')) {
    console.log('  OK: <label> element found');
    addIssue('warning', 'Label', 'label element should have part="label" for external styling', {
      recommendation: 'Add part="label" to the <label> element',
    });
  } else {
    addIssue('error', 'Label', 'No <label> element found', {
      wcag: 'WCAG 1.3.1 Info and Relationships, 4.1.2 Name, Role, Value',
      recommendation: 'Render a <label> element when label prop is set; use aria-label when no label prop',
    });
  }

  // Fallback: aria-label when label prop is empty
  if (source.includes('aria-label') && source.includes('placeholder')) {
    console.log('  OK: aria-label fallback to placeholder when no label');
  } else {
    addIssue('warning', 'Label', 'No aria-label fallback when label prop is empty', {
      wcag: 'WCAG 4.1.2 Name, Role, Value',
      recommendation: 'Set aria-label={placeholder} on <input> when no label is provided',
    });
  }
}

function checkErrorState(source: string): void {
  console.log('\nChecking error/destructive state...');

  // aria-invalid
  if (source.includes('aria-invalid')) {
    console.log('  OK: aria-invalid attribute found');
    if (source.includes("destructive ? 'true'") || source.includes('this.destructive')) {
      console.log('  OK: aria-invalid bound to destructive prop');
    } else {
      addIssue('warning', 'Error State', 'aria-invalid may not be bound to destructive prop correctly');
    }
  } else {
    addIssue('error', 'Error State', 'Missing aria-invalid on <input> for destructive state', {
      wcag: 'WCAG 1.3.1 Info and Relationships',
      recommendation: 'Add aria-invalid="true" when destructive=true',
    });
  }

  // Alert circle icon should be aria-hidden (info conveyed via border color + hint text)
  if (source.includes('alert-icon') && source.includes('aria-hidden="true"')) {
    console.log('  OK: Alert circle icon is aria-hidden="true" (decorative)');
  } else if (source.includes('alert-icon')) {
    addIssue('warning', 'Error State', 'Alert circle icon should be aria-hidden="true"', {
      recommendation: 'Error is conveyed via aria-invalid + hint text; icon is decorative',
    });
  }

  // Hint text as error message
  if (source.includes('aria-describedby') && source.includes('hint')) {
    console.log('  OK: aria-describedby links input to hint text (error message)');
  } else {
    addIssue('error', 'Error State', 'Missing aria-describedby linking input to hint/error text', {
      wcag: 'WCAG 1.3.1 Info and Relationships',
      recommendation: 'Add aria-describedby="hint" on <input>; hint element must have id="hint"',
    });
  }
}

function checkDisabledState(source: string): void {
  console.log('\nChecking disabled state...');

  // Native disabled attribute on <input>
  if (source.includes('?disabled=${this.disabled}') || source.includes('?disabled=')) {
    console.log('  OK: Native disabled attribute bound to <input>');
    console.log('     → Browser handles cursor, pointer-events, and focusability natively');
  } else {
    addIssue('error', 'Disabled', 'Native disabled attribute not propagated to <input>', {
      wcag: 'WCAG 4.1.2 Name, Role, Value',
      recommendation: 'Add ?disabled=${this.disabled} to the native <input> element',
    });
  }

  // Disabled button should also be disabled
  if (source.includes('?disabled=${this.disabled}')) {
    const matches = source.match(/\?disabled=\$\{this\.disabled\}/g);
    if (matches && matches.length >= 2) {
      console.log('  OK: disabled propagated to both <input> and help button');
    } else {
      addIssue('warning', 'Disabled', 'disabled may not propagate to help button', {
        recommendation: 'Add ?disabled=${this.disabled} to the help icon button as well',
      });
    }
  }
}

function checkHelpButton(source: string): void {
  console.log('\nChecking help icon button...');

  if (!source.includes('help-btn')) {
    console.log('  INFO: No help button found (helpIcon=false by default — skip)');
    return;
  }

  // Must be a <button> element
  if (source.includes('<button') && source.includes('help-btn')) {
    console.log('  OK: Help icon uses native <button> element');
  } else {
    addIssue('error', 'Help Button', 'Help icon must use a native <button> element', {
      wcag: 'WCAG 4.1.2 Name, Role, Value',
    });
  }

  // Must have accessible name
  if (source.includes('aria-label="Help"') || source.includes("aria-label='Help'")) {
    console.log('  OK: Help button has aria-label="Help"');
  } else {
    addIssue('error', 'Help Button', 'Help button missing accessible name (aria-label)', {
      wcag: 'WCAG 4.1.2 Name, Role, Value',
      recommendation: 'Add aria-label="Help" to the help button',
    });
  }

  // Must have type="button" to prevent form submission
  if (source.includes('type="button"')) {
    console.log('  OK: type="button" set on help button (prevents form submission)');
  } else {
    addIssue('warning', 'Help Button', 'Help button missing type="button"', {
      recommendation: 'Add type="button" to prevent unintentional form submission',
    });
  }

  // SVG inside button should be aria-hidden
  if (source.includes('aria-hidden="true"')) {
    console.log('  OK: SVG icons have aria-hidden="true"');
  } else {
    addIssue('warning', 'Help Button', 'SVG icons inside buttons should be aria-hidden="true"', {
      recommendation: 'Add aria-hidden="true" to decorative SVG elements',
    });
  }
}

function checkLeadingIcon(source: string): void {
  console.log('\nChecking leading icon...');

  if (!source.includes('leading-icon-slot')) {
    console.log('  INFO: No leading icon slot found');
    return;
  }

  // Leading icon area should be aria-hidden (decorative)
  if (source.includes('leading-icon-slot') && source.includes('aria-hidden="true"')) {
    console.log('  OK: Leading icon container is aria-hidden="true"');
  } else {
    addIssue('warning', 'Leading Icon', 'Leading icon container should be aria-hidden="true"', {
      recommendation: 'Add aria-hidden="true" to the leading icon wrapper — it is decorative',
    });
  }
}

function checkFocusManagement(source: string): void {
  console.log('\nChecking focus management...');

  // Component should expose focus() method
  if (source.includes('override focus(') || source.includes('focus(options')) {
    console.log('  OK: focus() method exposed on host element');
  } else {
    addIssue('warning', 'Focus', 'Component does not expose a public focus() method', {
      recommendation: 'Add focus(options?) method that delegates to the internal <input>',
    });
  }

  // Blur should also be available
  if (source.includes('override blur()') || source.includes('blur()')) {
    console.log('  OK: blur() method exposed on host element');
  }

  // Focus ring via CSS :focus-within
  if (source.includes(':focus-within')) {
    console.log('  OK: :focus-within used for visible focus ring on wrapper');
    console.log('     → Native <input> focus triggers wrapper ring — correct pattern');
  } else {
    addIssue('error', 'Focus', 'No :focus-within focus ring on input wrapper', {
      wcag: 'WCAG 2.4.7 Focus Visible',
      recommendation: 'Add :focus-within rule on .input-wrapper to show focus ring',
    });
  }

  // Ensure outline:none on native input doesn't hide focus (ring is on wrapper)
  if (source.includes('outline: none') && source.includes(':focus-within')) {
    console.log('  OK: outline:none on <input> compensated by :focus-within wrapper ring');
  }
}

function checkKeyboardNavigation(source: string): void {
  console.log('\nChecking keyboard navigation...');

  // Native <input> handles all keyboard navigation inherently
  if (source.includes('<input')) {
    console.log('  OK: Native <input> provides keyboard navigation (Tab, arrow keys, etc.)');
  }

  // Help button should be in tab order (no tabindex=-1)
  if (source.includes('tabindex="-1"') && source.includes('help-btn')) {
    addIssue('error', 'Keyboard', 'Help button must not have tabindex="-1"', {
      wcag: 'WCAG 2.1.1 Keyboard',
    });
  } else {
    console.log('  OK: Help button is in natural tab order');
  }
}

function checkFormParticipation(source: string): void {
  console.log('\nChecking form participation...');

  if (source.includes('?required=${this.required}') || source.includes('?required=')) {
    console.log('  OK: required attribute propagated to native <input>');
  } else {
    addIssue('warning', 'Form', 'required attribute may not propagate to native <input>', {
      recommendation: 'Add ?required=${this.required} to the <input> element',
    });
  }

  if (source.includes('name=${ifDefined') || source.includes("name=")) {
    console.log('  OK: name attribute propagated to native <input>');
  }

  console.log('  INFO: For Shadow DOM form participation, consider ElementInternals (FormAssociated)');
  addIssue('info', 'Form', 'Shadow DOM <input> may not participate in ancestor <form> without ElementInternals', {
    wcag: 'WCAG 4.1.2 Name, Role, Value',
    recommendation: 'For full form support across Shadow DOM boundaries, implement FormAssociated mixin with ElementInternals',
  });
}

function checkColorContrast(): void {
  console.log('\nChecking color contrast (manual checklist)...');

  const checks = [
    { fg: '#181D27', bg: '#FFFFFF', label: 'Input value text on white background' },
    { fg: '#717680', bg: '#FFFFFF', label: 'Placeholder text on white background' },
    { fg: '#414651', bg: '#FFFFFF', label: 'Label text on white background' },
    { fg: '#535862', bg: '#FFFFFF', label: 'Hint text on white background' },
    { fg: '#D92D20', bg: '#FFFFFF', label: 'Error hint text on white background' },
    { fg: '#414651', bg: '#F9FAFB', label: 'Label text on disabled background' },
    { fg: '#717680', bg: '#F9FAFB', label: 'Disabled placeholder on disabled background' },
  ];

  console.log('  INFO: Verify the following contrast ratios meet WCAG 2.1 AA (4.5:1 for normal text):');
  for (const { fg, bg, label } of checks) {
    console.log(`    • ${label}: ${fg} on ${bg}`);
  }

  addIssue('warning', 'Contrast',
    'Color contrast must be verified manually (tool does not compute ratios)',
    {
      wcag: 'WCAG 1.4.3 Contrast (Minimum)',
      recommendation: 'Use WebAIM Contrast Checker (webaim.org/resources/contrastchecker/) to verify all combinations',
    }
  );
}

function checkInputType(source: string): void {
  console.log('\nChecking input type handling...');

  if (source.includes('.type=${this.inputType}') || source.includes('type=${')) {
    console.log('  OK: inputType prop bound to native <input> type attribute');
    console.log('     → Enables proper mobile keyboard (email, tel, number…)');
    console.log('     → Enables browser password managers for type="password"');
  } else {
    addIssue('warning', 'Input Type', 'inputType prop may not be bound to native <input> type', {
      recommendation: 'Add .type=${this.inputType} to the native <input> element',
    });
  }
}

// ─── Runner ──────────────────────────────────────────────────────────────────

function runA11yValidation(): void {
  console.log('Input Field Component - Accessibility Validation (WCAG 2.1 AA)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    const source = readSource();

    checkNativeInput(source);
    checkLabelAssociation(source);
    checkErrorState(source);
    checkDisabledState(source);
    checkHelpButton(source);
    checkLeadingIcon(source);
    checkFocusManagement(source);
    checkKeyboardNavigation(source);
    checkFormParticipation(source);
    checkColorContrast();
    checkInputType(source);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Accessibility Validation Summary\n');

    const errors   = issues.filter(i => i.type === 'error');
    const warnings = issues.filter(i => i.type === 'warning');
    const infos    = issues.filter(i => i.type === 'info');

    if (infos.length > 0) {
      console.log(`INFO (${infos.length}):`);
      infos.forEach((issue, idx) => {
        console.log(`  ${idx + 1}. [${issue.category}] ${issue.message}`);
        if (issue.recommendation) console.log(`     → ${issue.recommendation}`);
      });
      console.log('');
    }

    if (warnings.length > 0) {
      console.log(`WARNINGS (${warnings.length}):`);
      warnings.forEach((issue, idx) => {
        const wcag = issue.wcag ? ` (${issue.wcag})` : '';
        console.log(`  ${idx + 1}. [${issue.category}]${wcag} ${issue.message}`);
        if (issue.recommendation) console.log(`     → ${issue.recommendation}`);
      });
      console.log('');
    }

    if (errors.length > 0) {
      console.log(`CRITICAL ERRORS (${errors.length}):`);
      errors.forEach((issue, idx) => {
        const wcag = issue.wcag ? ` (${issue.wcag})` : '';
        console.log(`  ${idx + 1}. [${issue.category}]${wcag} ${issue.message}`);
        if (issue.recommendation) console.log(`     → ${issue.recommendation}`);
      });
      console.log('\nAccessibility validation FAILED — fix critical issues before proceeding\n');
      process.exit(1);
    }

    if (warnings.length > 0) {
      console.log('Accessibility validation passed with warnings');
      console.log('Consider addressing warnings for optimal accessibility\n');
    } else {
      console.log('All accessibility checks passed!');
      console.log('Input Field component meets WCAG 2.1 AA standards\n');
    }

    process.exit(0);

  } catch (error) {
    console.error('Validation error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

runA11yValidation();
