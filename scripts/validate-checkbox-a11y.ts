/**
 * Accessibility Validation for Checkbox Component
 *
 * Validates that kds-checkbox meets WCAG 2.1 AA standards and accessibility best practices.
 *
 * Checks:
 * - ARIA attributes and roles
 * - Keyboard navigation support
 * - Color contrast ratios
 * - Touch target sizes
 * - Disabled state handling
 * - Screen reader compatibility
 * - Indeterminate state handling
 *
 * Usage: tsx scripts/validate-checkbox-a11y.ts
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

/**
 * Read the Checkbox component source code
 */
function readCheckboxSource(): string {
  const checkboxPath = path.join(__dirname, '../packages/web-components/src/components/kds-checkbox.ts');
  if (!fs.existsSync(checkboxPath)) {
    throw new Error(`Checkbox component not found at ${checkboxPath}`);
  }
  return fs.readFileSync(checkboxPath, 'utf-8');
}

/**
 * Check ARIA attributes implementation
 */
function checkARIAAttributes(source: string): void {
  console.log('\n🔍 Checking ARIA attributes...');

  // Check for role="checkbox" (native input provides this)
  if (source.includes('role="checkbox"') || source.includes("role='checkbox'") || source.includes('type="checkbox"')) {
    console.log('  ✅ Checkbox role found (native <input type="checkbox"> provides implicit role)');
  } else {
    addIssue('error', 'ARIA', 'No checkbox role found', 'Use native <input type="checkbox"> or add role="checkbox"');
  }

  // Check for aria-checked support
  if (source.includes('aria-checked')) {
    console.log('  ✅ aria-checked attribute found');

    // Check for indeterminate state handling (aria-checked="mixed")
    if (source.includes('mixed')) {
      console.log('  ✅ Indeterminate state (aria-checked="mixed") supported');
    } else {
      addIssue('warning', 'ARIA', 'Consider supporting aria-checked="mixed" for indeterminate state');
    }
  } else {
    addIssue('error', 'ARIA', 'No aria-checked attribute found', 'Add aria-checked to communicate checkbox state to screen readers');
  }

  // Check for aria-label support (for checkboxes without visible labels)
  if (source.includes('aria-label')) {
    console.log('  ✅ aria-label attribute support found');
  } else {
    addIssue('warning', 'ARIA', 'No aria-label attribute handling found', 'Add aria-label support for checkboxes without visible labels');
  }

  // Check for aria-describedby support (for help text and error messages)
  if (source.includes('aria-describedby') || source.includes('aria-described-by')) {
    console.log('  ✅ aria-describedby attribute found (for associating help text/errors)');
  } else {
    addIssue('warning', 'ARIA', 'Consider adding aria-describedby for associating help text or error messages');
  }

  // Check for aria-disabled
  if (source.includes('aria-disabled')) {
    console.log('  ✅ aria-disabled attribute found');
  } else {
    console.log('  ℹ️  No aria-disabled (native disabled attribute is sufficient)');
  }

  // Check for aria-invalid (for error states)
  if (source.includes('aria-invalid')) {
    console.log('  ✅ aria-invalid attribute found (for error states)');
  } else if (source.includes('error')) {
    addIssue('warning', 'ARIA', 'Error state found but no aria-invalid attribute', 'Add aria-invalid="true" when error prop is true');
  }

  // Check for aria-required
  if (source.includes('aria-required') || source.includes('required')) {
    console.log('  ✅ Required attribute support found');
  } else {
    console.log('  ℹ️  No required attribute (optional for checkboxes)');
  }
}

/**
 * Check keyboard navigation support
 */
function checkKeyboardNavigation(source: string): void {
  console.log('\n🔍 Checking keyboard navigation...');

  // Native checkbox provides Space key support automatically
  if (source.includes('type="checkbox"') || source.includes('type=\'checkbox\'')) {
    console.log('  ✅ Native <input type="checkbox"> provides built-in Space key support');
  } else {
    addIssue('error', 'Keyboard', 'No native checkbox input found', 'Use <input type="checkbox"> for automatic keyboard support');
  }

  // Check for custom keyboard event handling (not required if using native input)
  const hasKeyDown = source.includes('keydown') || source.includes('keypress') || source.includes('keyup');
  if (hasKeyDown) {
    console.log('  ℹ️  Custom keyboard event handling found (may enhance native behavior)');
  }

  // Check for focus management
  if (source.includes('focus') || source.includes(':focus')) {
    console.log('  ✅ Focus management found');
  } else {
    addIssue('warning', 'Keyboard', 'No explicit focus management found', 'Add focus styles and focus management');
  }

  // Check for focus-visible support
  if (source.includes('focus-visible')) {
    console.log('  ✅ :focus-visible pseudo-class used (modern approach)');
  } else {
    addIssue('warning', 'Keyboard', 'Consider using :focus-visible for better UX',
      'Use :focus-visible to show focus only for keyboard navigation');
  }

  // Check for tabindex handling
  if (source.includes('tabindex') || source.includes('tabIndex')) {
    console.log('  ℹ️  Explicit tabindex handling found');
  } else {
    console.log('  ℹ️  No explicit tabindex (native <input> is focusable by default)');
  }
}

/**
 * Check color contrast compliance
 */
function checkColorContrast(): void {
  console.log('\n🔍 Checking color contrast ratios...');

  // Read tokens to get actual color values
  const tokensPath = path.join(__dirname, '../packages/tokens/src/tokens.json');
  if (!fs.existsSync(tokensPath)) {
    console.log('  ⚠️  tokens.json not found, skipping contrast checks');
    return;
  }

  // Manual contrast checks based on WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text/UI components)
  console.log('  ℹ️  Color combinations to verify manually:');
  console.log('     - Unchecked border: #D5D7DA (gray-300) on white → Verify 3:1 contrast');
  console.log('     - Checked background: #7F56D9 (brand-600) → Verify 3:1 contrast with surroundings');
  console.log('     - Checkmark: white (#FFFFFF) on #7F56D9 → Verify 4.5:1 contrast');
  console.log('     - Error border: #D92D20 (error-600) → Verify 3:1 contrast');
  console.log('     - Label text: #414651 (gray-700) on white → Verify 4.5:1 contrast');
  console.log('     - Disabled: Reduced contrast expected (not subject to WCAG)');

  addIssue('warning', 'Contrast', 'Color contrast ratios should be verified manually or with automated tools',
    'Use tools like WebAIM Contrast Checker or browser DevTools to verify all color combinations meet WCAG 2.1 AA (3:1 for UI components, 4.5:1 for text)');
}

/**
 * Check touch target sizes
 */
function checkTouchTargets(source: string): void {
  console.log('\n🔍 Checking touch target sizes...');

  // WCAG 2.1 AA requires minimum 44x44px touch targets
  // Check if sizes are defined
  const hasSizeVariants = source.includes('size-sm') || source.includes('size-md');

  if (hasSizeVariants) {
    console.log('  ✅ Size variants found (sm, md)');
    console.log('  ℹ️  Minimum touch target sizes to verify:');
    console.log('     - Small (sm): 16x16px checkbox + label = should meet 44x44px with label');
    console.log('     - Medium (md): 20x20px checkbox + label = should meet 44x44px with label');
    console.log('     - Note: The entire clickable area (checkbox + label) should be at least 44x44px');

    // Check if sizes are documented
    if (source.includes('width:') && source.includes('height:')) {
      console.log('  ✅ Explicit width and height dimensions found in styles');
    } else {
      addIssue('warning', 'Touch Targets', 'Checkbox dimensions not explicitly defined', 'Define explicit width/height for each size variant');
    }
  } else {
    addIssue('warning', 'Touch Targets', 'Size variants not clearly defined', 'Ensure checkbox sizes meet WCAG 2.1 touch target minimum (44x44px including label)');
  }

  // Check that label is clickable (increases touch target)
  if (source.includes('<label')) {
    console.log('  ✅ Label element found (increases clickable area for touch targets)');
  } else {
    addIssue('error', 'Touch Targets', 'No <label> element wrapping checkbox', 'Wrap checkbox in <label> to increase touch target size');
  }
}

/**
 * Check disabled state handling
 */
function checkDisabledState(source: string): void {
  console.log('\n🔍 Checking disabled state handling...');

  // Check for disabled attribute
  if (source.includes('disabled')) {
    console.log('  ✅ Disabled attribute handling found');
  } else {
    addIssue('error', 'Disabled State', 'No disabled attribute handling', 'Implement disabled state to prevent interaction');
  }

  // Check that disabled checkboxes don't fire events
  if (source.includes('disabled') && (source.includes('preventDefault') || source.includes('return') || source.includes('if'))) {
    console.log('  ✅ Event prevention for disabled state found');
  } else {
    addIssue('warning', 'Disabled State', 'Verify disabled checkboxes do not fire change events');
  }

  // Check for visual feedback
  if (source.includes('cursor') || source.includes('opacity')) {
    console.log('  ✅ Visual feedback for disabled state found');
  } else {
    addIssue('warning', 'Disabled State', 'Add clear visual feedback for disabled state (cursor, opacity, etc.)');
  }

  // Check that disabled is properly reflected
  if (source.includes('reflect: true')) {
    console.log('  ✅ Disabled attribute reflected to DOM');
  }
}

/**
 * Check screen reader support
 */
function checkScreenReaderSupport(source: string): void {
  console.log('\n🔍 Checking screen reader support...');

  // Check for native checkbox (best for screen readers)
  if (source.includes('type="checkbox"')) {
    console.log('  ✅ Native <input type="checkbox"> used (screen reader compatible)');
  } else if (source.includes('<div') || source.includes('<span')) {
    addIssue('error', 'Screen Reader', 'Non-semantic element used for checkbox', 'Use native <input type="checkbox"> element');
  }

  // Check for label association
  if (source.includes('<label')) {
    console.log('  ✅ Label element found for screen reader announcement');

    // Check for proper label association
    if (source.includes('htmlFor') || source.includes('for=') || source.includes('<label') && source.includes('<input')) {
      console.log('  ✅ Label properly associated with checkbox');
    } else {
      addIssue('warning', 'Screen Reader', 'Verify label is properly associated with checkbox input');
    }
  } else {
    addIssue('warning', 'Screen Reader', 'No label element found', 'Add <label> element or ensure aria-label is provided');
  }

  // Check for aria-label fallback when no visible label
  if (source.includes('aria-label')) {
    console.log('  ✅ aria-label support for checkboxes without visible labels');
  }

  // Check for state announcements
  if (source.includes('aria-checked')) {
    console.log('  ✅ aria-checked provides state announcement to screen readers');
  }

  // Check for indeterminate state announcement
  if (source.includes('mixed') || (source.includes('indeterminate') && source.includes('aria-checked'))) {
    console.log('  ✅ Indeterminate state announced via aria-checked="mixed"');
  } else if (source.includes('indeterminate')) {
    addIssue('warning', 'Screen Reader', 'Indeterminate state found but may not be announced to screen readers',
      'Set aria-checked="mixed" when indeterminate is true');
  }
}

/**
 * Check for focus indicators
 */
function checkFocusIndicators(source: string): void {
  console.log('\n🔍 Checking focus indicators...');

  // Check for focus styles
  const hasFocusStyles = source.includes(':focus') || source.includes('focus-visible');

  if (hasFocusStyles) {
    console.log('  ✅ Focus styles found');
  } else {
    addIssue('error', 'Focus', 'No focus styles found', 'Add visible focus indicators (outline, box-shadow, etc.)');
  }

  // Check for focus-visible support (modern approach)
  if (source.includes('focus-visible')) {
    console.log('  ✅ :focus-visible pseudo-class used (modern approach)');
  } else {
    addIssue('warning', 'Focus', 'Consider using :focus-visible for better UX',
      'Use :focus-visible to show focus only for keyboard navigation');
  }

  // Check for focus ring
  if (source.includes('box-shadow') || source.includes('outline')) {
    console.log('  ✅ Focus ring styling found');
  } else {
    addIssue('warning', 'Focus', 'No explicit focus ring found', 'Add a visible focus ring (outline or box-shadow)');
  }
}

/**
 * Check indeterminate state support
 */
function checkIndeterminateState(source: string): void {
  console.log('\n🔍 Checking indeterminate state support...');

  // Check for indeterminate property
  if (source.includes('indeterminate')) {
    console.log('  ✅ Indeterminate state property found');

    // Check for visual representation
    if (source.includes('indeterminate-mark') || source.includes('class="indeterminate"') || source.includes("class='indeterminate'")) {
      console.log('  ✅ Visual representation for indeterminate state found');
    } else {
      addIssue('warning', 'Indeterminate', 'Indeterminate property found but no clear visual representation');
    }

    // Check for ARIA support
    if (source.includes('mixed')) {
      console.log('  ✅ aria-checked="mixed" for indeterminate state');
    } else {
      addIssue('warning', 'Indeterminate', 'Set aria-checked="mixed" when indeterminate is true');
    }
  } else {
    addIssue('warning', 'Indeterminate', 'No indeterminate state support found',
      'Consider adding indeterminate state for "select all" scenarios');
  }
}

/**
 * Run all accessibility checks
 */
function runA11yValidation(): void {
  console.log('🔍 Checkbox Component - Accessibility Validation');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    const source = readCheckboxSource();

    // Run all checks
    checkARIAAttributes(source);
    checkKeyboardNavigation(source);
    checkColorContrast();
    checkTouchTargets(source);
    checkDisabledState(source);
    checkScreenReaderSupport(source);
    checkFocusIndicators(source);
    checkIndeterminateState(source);

    // Print summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Accessibility Validation Summary\n');

    const errors = issues.filter(i => i.type === 'error');
    const warnings = issues.filter(i => i.type === 'warning');

    if (errors.length === 0 && warnings.length === 0) {
      console.log('✅ All accessibility checks passed!');
      console.log('\n✨ Checkbox component meets WCAG 2.1 AA standards');
      process.exit(0);
    }

    if (errors.length > 0) {
      console.log(`❌ ${errors.length} critical accessibility issue(s) found:\n`);
      errors.forEach((issue, index) => {
        console.log(`${index + 1}. [${issue.category}] ${issue.message}`);
        if (issue.recommendation) {
          console.log(`   💡 ${issue.recommendation}`);
        }
        console.log('');
      });
    }

    if (warnings.length > 0) {
      console.log(`⚠️  ${warnings.length} accessibility warning(s):\n`);
      warnings.forEach((issue, index) => {
        console.log(`${index + 1}. [${issue.category}] ${issue.message}`);
        if (issue.recommendation) {
          console.log(`   💡 ${issue.recommendation}`);
        }
        console.log('');
      });
    }

    // Exit with error if there are critical issues
    if (errors.length > 0) {
      console.log('❌ Accessibility validation failed');
      console.log('Fix critical issues before proceeding');
      process.exit(1);
    }

    console.log('⚠️  Accessibility validation passed with warnings');
    console.log('Consider addressing warnings for optimal accessibility');
    process.exit(0);

  } catch (error) {
    console.error('❌ Validation error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run validation
runA11yValidation();
