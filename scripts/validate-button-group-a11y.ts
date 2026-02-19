/**
 * Accessibility Validation for Button Group Component
 *
 * Validates that kds-button-group meets WCAG 2.1 AA standards.
 *
 * Checks:
 * - ARIA attributes and roles
 * - Keyboard navigation support
 * - Disabled state handling
 * - Icon-only accessibility
 *
 * Usage: tsx scripts/validate-button-group-a11y.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface A11yIssue {
  type: 'error' | 'warning';
  category: string;
  message: string;
  recommendation?: string;
}

const issues: A11yIssue[] = [];

function addIssue(type: 'error' | 'warning', category: string, message: string, recommendation?: string) {
  issues.push({ type, category, message, recommendation });
}

function readSource(): string {
  const filePath = path.join(__dirname, '../packages/web-components/src/components/kds-button-group.ts');
  if (!fs.existsSync(filePath)) {
    throw new Error(`Button Group component not found at ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf-8');
}

function checkGroupRole(source: string): void {
  console.log('\nChecking group role...');

  if (source.includes('role="group"')) {
    console.log('  OK: Container has role="group"');
  } else {
    addIssue('error', 'ARIA Role', 'Container missing role="group"',
      'Add role="group" to the container element');
  }

  if (source.includes('aria-label')) {
    console.log('  OK: aria-label attribute support found on container');
  } else {
    addIssue('warning', 'ARIA', 'No aria-label support on container',
      'Add aria-label support to describe the group purpose');
  }
}

function checkItemSemantics(source: string): void {
  console.log('\nChecking item semantics...');

  if (source.includes('<button')) {
    console.log('  OK: Items use native <button> element');
  } else {
    addIssue('error', 'Semantics', 'Items should use native <button> element',
      'Replace div/span with <button> for proper keyboard and screen reader support');
  }

  if (source.includes('type="button"')) {
    console.log('  OK: type="button" set (prevents form submission)');
  } else {
    addIssue('warning', 'Semantics', 'Set type="button" on item buttons',
      'Prevent accidental form submission');
  }

  if (source.includes('aria-pressed')) {
    console.log('  OK: aria-pressed used for selected state');
  } else {
    addIssue('error', 'ARIA State', 'Missing aria-pressed for selected state',
      'Add aria-pressed attribute to communicate selected state to screen readers');
  }
}

function checkKeyboardNavigation(source: string): void {
  console.log('\nChecking keyboard navigation...');

  if (source.includes('<button')) {
    console.log('  OK: Native buttons are keyboard-focusable by default');
  } else {
    addIssue('error', 'Keyboard', 'Items not keyboard focusable');
  }

  if (source.includes(':focus-visible') || source.includes(':focus')) {
    console.log('  OK: Focus styles defined');
  } else {
    addIssue('error', 'Keyboard', 'No focus styles defined',
      'Add :focus-visible styles for keyboard users');
  }

  if (source.includes('?disabled')) {
    console.log('  OK: Disabled items use native disabled attribute');
  } else {
    addIssue('warning', 'Keyboard', 'Disabled state should use native disabled attribute');
  }
}

function checkDisabledState(source: string): void {
  console.log('\nChecking disabled state...');

  if (source.includes('disabled') && source.includes('cursor: not-allowed')) {
    console.log('  OK: Disabled state has visual indicator (cursor)');
  } else {
    addIssue('warning', 'Disabled', 'Add cursor: not-allowed for disabled items');
  }

  if (source.includes('opacity') && source.includes('disabled')) {
    console.log('  OK: Disabled state has reduced opacity');
  } else {
    addIssue('warning', 'Disabled', 'Consider reduced opacity for disabled items');
  }

  if (source.includes('event.preventDefault') || source.includes('if (this.disabled)')) {
    console.log('  OK: Click events prevented when disabled');
  } else {
    addIssue('error', 'Disabled', 'Click events not prevented when disabled');
  }
}

function checkIconOnlyAccessibility(source: string): void {
  console.log('\nChecking icon-only accessibility...');

  if (source.includes("icon === 'only'") || source.includes('icon-only')) {
    console.log('  OK: Icon-only variant exists');

    if (source.includes('aria-label')) {
      console.log('  OK: aria-label support for icon-only items');
      console.log('  INFO: Icon-only items MUST have aria-label for screen reader access');
    } else {
      addIssue('error', 'Icon-Only', 'Icon-only items need aria-label',
        'Add aria-label attribute support for icon-only items');
    }
  }
}

function checkColorContrast(): void {
  console.log('\nChecking color contrast...');

  console.log('  INFO: Color combinations to verify:');
  console.log('    - Text #414651 on white #FFFFFF - 9.7:1 (AA pass)');
  console.log('    - Text #414651 on selected #F9FAFB - 9.3:1 (AA pass)');
  console.log('    - Disabled #717680 on white #FFFFFF - 4.6:1 (AA pass at 14px bold)');

  addIssue('warning', 'Contrast', 'Verify disabled text contrast at reduced opacity',
    'Ensure disabled items at 0.5 opacity still meet 3:1 minimum contrast');
}

function runA11yValidation(): void {
  console.log('Button Group Component - Accessibility Validation');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    const source = readSource();

    checkGroupRole(source);
    checkItemSemantics(source);
    checkKeyboardNavigation(source);
    checkDisabledState(source);
    checkIconOnlyAccessibility(source);
    checkColorContrast();

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Accessibility Validation Summary\n');

    const errorsList = issues.filter(i => i.type === 'error');
    const warningsList = issues.filter(i => i.type === 'warning');

    if (errorsList.length === 0 && warningsList.length === 0) {
      console.log('All accessibility checks passed!');
      console.log('\nButton Group component meets WCAG 2.1 AA standards');
      process.exit(0);
    }

    if (errorsList.length > 0) {
      console.log(`${errorsList.length} critical accessibility issue(s) found:\n`);
      errorsList.forEach((issue, index) => {
        console.log(`${index + 1}. [${issue.category}] ${issue.message}`);
        if (issue.recommendation) {
          console.log(`   Recommendation: ${issue.recommendation}`);
        }
        console.log('');
      });
    }

    if (warningsList.length > 0) {
      console.log(`${warningsList.length} accessibility warning(s):\n`);
      warningsList.forEach((issue, index) => {
        console.log(`${index + 1}. [${issue.category}] ${issue.message}`);
        if (issue.recommendation) {
          console.log(`   Recommendation: ${issue.recommendation}`);
        }
        console.log('');
      });
    }

    if (errorsList.length > 0) {
      console.log('Accessibility validation failed');
      console.log('Fix critical issues before proceeding');
      process.exit(1);
    }

    console.log('Accessibility validation passed with warnings');
    console.log('Consider addressing warnings for optimal accessibility');
    process.exit(0);

  } catch (error) {
    console.error('Validation error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

runA11yValidation();
