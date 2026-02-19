/**
 * Accessibility Validation for Badge Component
 *
 * Validates that kds-badge meets WCAG 2.1 AA standards and accessibility best practices.
 *
 * Checks:
 * - ARIA attributes and roles
 * - Color contrast ratios
 * - Dismiss button accessibility
 * - Screen reader compatibility
 *
 * Usage: tsx scripts/validate-badge-a11y.ts
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

function readBadgeSource(): string {
  const badgePath = path.join(__dirname, '../packages/web-components/src/components/kds-badge.ts');
  if (!fs.existsSync(badgePath)) {
    throw new Error(`Badge component not found at ${badgePath}`);
  }
  return fs.readFileSync(badgePath, 'utf-8');
}

function checkARIAAttributes(source: string): void {
  console.log('\nChecking ARIA attributes...');

  // Badge is primarily a display component - check for appropriate role
  if (source.includes('role=') || source.includes("role='status'") || source.includes('role="status"')) {
    console.log('  OK: role attribute support found');
  } else {
    console.log('  INFO: No explicit role (inline text is appropriate for badges)');
  }

  // Check for aria-label support
  if (source.includes('aria-label')) {
    console.log('  OK: aria-label attribute support found');
  } else {
    addIssue('warning', 'ARIA', 'No aria-label support', 'Add aria-label support for badges used as status indicators');
  }
}

function checkDismissButton(source: string): void {
  console.log('\nChecking dismiss button accessibility...');

  if (source.includes('x-close')) {
    console.log('  OK: Dismiss (x-close) variant found');

    // Check for button element
    if (source.includes('<button') && source.includes('close-btn')) {
      console.log('  OK: Native <button> element used for dismiss');
    } else {
      addIssue('error', 'Dismiss Button', 'Dismiss action should use a native <button> element');
    }

    // Check for aria-label on close button
    if (source.includes('aria-label="Dismiss"') || source.includes("aria-label='Dismiss'")) {
      console.log('  OK: Dismiss button has aria-label');
    } else {
      addIssue('error', 'Dismiss Button', 'Dismiss button missing aria-label', 'Add aria-label="Dismiss" to the close button');
    }

    // Check for click handler
    if (source.includes('click') && source.includes('dismiss')) {
      console.log('  OK: Dismiss event handler found');
    } else {
      addIssue('warning', 'Dismiss Button', 'No dismiss event handler found');
    }

    // Check that type="button" is set
    if (source.includes('type="button"')) {
      console.log('  OK: type="button" set on dismiss button');
    } else {
      addIssue('warning', 'Dismiss Button', 'Set type="button" on dismiss button to prevent form submission');
    }
  } else {
    console.log('  INFO: No dismiss variant (x-close) found - skip');
  }
}

function checkColorContrast(): void {
  console.log('\nChecking color contrast ratios...');

  console.log('  INFO: Color combinations to verify manually:');
  console.log('    - Gray: #414651 on #F5F5F5 - Verify 4.5:1');
  console.log('    - Primary: #6941C6 on #F9F5FF - Verify 4.5:1');
  console.log('    - Error: #B42318 on #FEF3F2 - Verify 4.5:1');
  console.log('    - Warning: #B54708 on #FFFAEB - Verify 4.5:1');
  console.log('    - Success: #027A48 on #ECFDF3 - Verify 4.5:1');
  console.log('    - Blue: #175CD3 on #EFF8FF - Verify 4.5:1');

  addIssue('warning', 'Contrast', 'Color contrast ratios should be verified manually',
    'Use WebAIM Contrast Checker to verify all 13 color combinations meet WCAG 2.1 AA (4.5:1 for text)');
}

function checkScreenReaderSupport(source: string): void {
  console.log('\nChecking screen reader support...');

  // Badge should use semantic HTML
  if (source.includes('<span') || source.includes('<div')) {
    console.log('  OK: Badge uses inline element (appropriate for status text)');
  }

  // Check for slot content
  if (source.includes('<slot')) {
    console.log('  OK: Slot found for label content (screen readers can read it)');
  } else {
    addIssue('warning', 'Screen Reader', 'No slot found for text content');
  }

  // Icon-only should have aria-label
  if (source.includes('icon-only') || source.includes("icon === 'only'")) {
    console.log('  OK: Icon-only variant exists');
    console.log('  INFO: Icon-only badges MUST have aria-label for screen reader access');
  }
}

function checkIconAccessibility(source: string): void {
  console.log('\nChecking icon accessibility...');

  // Dot indicator should be decorative
  if (source.includes('dot')) {
    console.log('  OK: Dot indicator found');
    console.log('  INFO: Dot is decorative - ensure it does not convey information that text does not');
  }

  // Slotted icons
  if (source.includes('slot="icon"')) {
    console.log('  OK: Icon slot found');
    console.log('  INFO: Slotted icons should have aria-hidden="true" if decorative');
  }
}

function runA11yValidation(): void {
  console.log('Badge Component - Accessibility Validation');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    const source = readBadgeSource();

    checkARIAAttributes(source);
    checkDismissButton(source);
    checkColorContrast();
    checkScreenReaderSupport(source);
    checkIconAccessibility(source);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Accessibility Validation Summary\n');

    const errors = issues.filter(i => i.type === 'error');
    const warnings = issues.filter(i => i.type === 'warning');

    if (errors.length === 0 && warnings.length === 0) {
      console.log('All accessibility checks passed!');
      console.log('\nBadge component meets WCAG 2.1 AA standards');
      process.exit(0);
    }

    if (errors.length > 0) {
      console.log(`${errors.length} critical accessibility issue(s) found:\n`);
      errors.forEach((issue, index) => {
        console.log(`${index + 1}. [${issue.category}] ${issue.message}`);
        if (issue.recommendation) {
          console.log(`   Recommendation: ${issue.recommendation}`);
        }
        console.log('');
      });
    }

    if (warnings.length > 0) {
      console.log(`${warnings.length} accessibility warning(s):\n`);
      warnings.forEach((issue, index) => {
        console.log(`${index + 1}. [${issue.category}] ${issue.message}`);
        if (issue.recommendation) {
          console.log(`   Recommendation: ${issue.recommendation}`);
        }
        console.log('');
      });
    }

    if (errors.length > 0) {
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
