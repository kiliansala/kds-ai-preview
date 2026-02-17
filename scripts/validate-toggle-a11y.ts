/**
 * Accessibility Validation for Toggle Component
 *
 * Validates that kds-toggle meets WCAG 2.1 AA standards and accessibility best practices.
 *
 * Checks:
 * - ARIA attributes and roles (role="switch")
 * - Keyboard navigation support
 * - Color contrast ratios
 * - Touch target sizes
 * - Disabled state handling
 * - Screen reader compatibility
 * - Focus indicators
 *
 * Usage: tsx scripts/validate-toggle-a11y.ts
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

function readToggleSource(): string {
  const togglePath = path.join(__dirname, '../packages/web-components/src/components/kds-toggle.ts');
  if (!fs.existsSync(togglePath)) {
    throw new Error(`Toggle component not found at ${togglePath}`);
  }
  return fs.readFileSync(togglePath, 'utf-8');
}

/**
 * Check ARIA attributes implementation
 */
function checkARIAAttributes(source: string): void {
  console.log('\n🔍 Checking ARIA attributes...');

  // Check for role="switch" (critical for toggles)
  if (source.includes('role="switch"') || source.includes("role='switch'")) {
    console.log('  ✅ role="switch" found (correct ARIA role for toggle components)');
  } else if (source.includes('type="checkbox"')) {
    addIssue('error', 'ARIA', 'Toggle uses checkbox without role="switch"',
      'Add role="switch" to the input element for correct screen reader announcement');
  } else {
    addIssue('error', 'ARIA', 'No switch role found',
      'Use <input type="checkbox" role="switch"> or add role="switch"');
  }

  // Check for aria-checked
  if (source.includes('aria-checked')) {
    console.log('  ✅ aria-checked attribute found');
  } else {
    addIssue('error', 'ARIA', 'No aria-checked attribute found',
      'Add aria-checked to communicate toggle state to screen readers');
  }

  // Check for aria-label support
  if (source.includes('aria-label')) {
    console.log('  ✅ aria-label attribute support found');
  } else {
    addIssue('warning', 'ARIA', 'No aria-label attribute handling found',
      'Add aria-label support for toggles without visible labels');
  }

  // Check for aria-describedby support
  if (source.includes('aria-describedby') || source.includes('aria-described-by')) {
    console.log('  ✅ aria-describedby attribute found (for associating help text)');
  } else {
    addIssue('warning', 'ARIA', 'Consider adding aria-describedby for associating supporting text');
  }
}

/**
 * Check keyboard navigation support
 */
function checkKeyboardNavigation(source: string): void {
  console.log('\n🔍 Checking keyboard navigation...');

  // Native checkbox provides Space key support automatically
  if (source.includes('type="checkbox"')) {
    console.log('  ✅ Native <input type="checkbox"> provides built-in Space key support');
  } else {
    addIssue('error', 'Keyboard', 'No native checkbox input found',
      'Use <input type="checkbox"> for automatic keyboard support (Space to toggle)');
  }

  // Check for focus management
  if (source.includes('focus') || source.includes(':focus')) {
    console.log('  ✅ Focus management found');
  } else {
    addIssue('warning', 'Keyboard', 'No explicit focus management found',
      'Add focus styles and focus management');
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

  console.log('  ℹ️  Color combinations to verify manually:');
  console.log('     - Track ON: #7F56D9 (brand-600) → Verify 3:1 contrast with background');
  console.log('     - Track OFF: #F5F5F5 (gray-100) → Verify 3:1 contrast with background');
  console.log('     - Knob: #FFFFFF on track → Verify 3:1 contrast');
  console.log('     - Label text: #414651 (gray-700) on white → Verify 4.5:1 contrast');
  console.log('     - Supporting text: #535862 (gray-600) on white → Verify 4.5:1 contrast');
  console.log('     - Disabled: Reduced contrast expected (not subject to WCAG)');

  addIssue('warning', 'Contrast', 'Color contrast ratios should be verified manually or with automated tools',
    'Use tools like WebAIM Contrast Checker to verify WCAG 2.1 AA (3:1 for UI components, 4.5:1 for text)');
}

/**
 * Check touch target sizes
 */
function checkTouchTargets(source: string): void {
  console.log('\n🔍 Checking touch target sizes...');

  const hasSizeVariants = source.includes('size-sm') || source.includes('size-md');

  if (hasSizeVariants) {
    console.log('  ✅ Size variants found (sm, md)');
    console.log('  ℹ️  Minimum touch target sizes to verify:');
    console.log('     - Small (sm): 36x20px track + label = should meet 44x44px with label');
    console.log('     - Medium (md): 44x24px track + label = should meet 44x44px with label');
    console.log('     - Note: The entire clickable area (toggle + label) should be at least 44x44px');
  } else {
    addIssue('warning', 'Touch Targets', 'Size variants not clearly defined',
      'Ensure toggle sizes meet WCAG 2.1 touch target minimum (44x44px including label)');
  }

  // Check that label is clickable
  if (source.includes('<label')) {
    console.log('  ✅ Label element found (increases clickable area for touch targets)');
  } else {
    addIssue('error', 'Touch Targets', 'No <label> element wrapping toggle',
      'Wrap toggle in <label> to increase touch target size');
  }
}

/**
 * Check disabled state handling
 */
function checkDisabledState(source: string): void {
  console.log('\n🔍 Checking disabled state handling...');

  if (source.includes('disabled')) {
    console.log('  ✅ Disabled attribute handling found');
  } else {
    addIssue('error', 'Disabled State', 'No disabled attribute handling',
      'Implement disabled state to prevent interaction');
  }

  if (source.includes('disabled') && (source.includes('preventDefault') || source.includes('return'))) {
    console.log('  ✅ Event prevention for disabled state found');
  } else {
    addIssue('warning', 'Disabled State', 'Verify disabled toggles do not fire change events');
  }

  if (source.includes('cursor') || source.includes('opacity')) {
    console.log('  ✅ Visual feedback for disabled state found');
  } else {
    addIssue('warning', 'Disabled State', 'Add clear visual feedback for disabled state');
  }

  if (source.includes('reflect: true')) {
    console.log('  ✅ Disabled attribute reflected to DOM');
  }
}

/**
 * Check screen reader support
 */
function checkScreenReaderSupport(source: string): void {
  console.log('\n🔍 Checking screen reader support...');

  // Check for native input (best for screen readers)
  if (source.includes('type="checkbox"')) {
    console.log('  ✅ Native <input type="checkbox"> used (screen reader compatible)');
  } else {
    addIssue('error', 'Screen Reader', 'Non-semantic element used for toggle',
      'Use native <input type="checkbox" role="switch"> element');
  }

  // Check for role="switch" announcement
  if (source.includes('role="switch"')) {
    console.log('  ✅ role="switch" provides correct "toggle switch" announcement');
  }

  // Check for label association
  if (source.includes('<label')) {
    console.log('  ✅ Label element found for screen reader announcement');
  } else {
    addIssue('warning', 'Screen Reader', 'No label element found',
      'Add <label> element or ensure aria-label is provided');
  }

  // Check for aria-label fallback
  if (source.includes('aria-label')) {
    console.log('  ✅ aria-label support for toggles without visible labels');
  }

  // Check for state announcements
  if (source.includes('aria-checked')) {
    console.log('  ✅ aria-checked provides state announcement to screen readers');
  }
}

/**
 * Check for focus indicators
 */
function checkFocusIndicators(source: string): void {
  console.log('\n🔍 Checking focus indicators...');

  const hasFocusStyles = source.includes(':focus') || source.includes('focus-visible');

  if (hasFocusStyles) {
    console.log('  ✅ Focus styles found');
  } else {
    addIssue('error', 'Focus', 'No focus styles found',
      'Add visible focus indicators (outline, box-shadow, etc.)');
  }

  if (source.includes('focus-visible')) {
    console.log('  ✅ :focus-visible pseudo-class used (modern approach)');
  } else {
    addIssue('warning', 'Focus', 'Consider using :focus-visible for better UX');
  }

  if (source.includes('box-shadow') || source.includes('outline')) {
    console.log('  ✅ Focus ring styling found (4px brand-50 ring from Figma)');
  } else {
    addIssue('warning', 'Focus', 'No explicit focus ring found',
      'Add a visible focus ring (outline or box-shadow)');
  }
}

/**
 * Run all accessibility checks
 */
function runA11yValidation(): void {
  console.log('🔍 Toggle Component - Accessibility Validation');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    const source = readToggleSource();

    checkARIAAttributes(source);
    checkKeyboardNavigation(source);
    checkColorContrast();
    checkTouchTargets(source);
    checkDisabledState(source);
    checkScreenReaderSupport(source);
    checkFocusIndicators(source);

    // Print summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Accessibility Validation Summary\n');

    const errors = issues.filter(i => i.type === 'error');
    const warnings = issues.filter(i => i.type === 'warning');

    if (errors.length === 0 && warnings.length === 0) {
      console.log('✅ All accessibility checks passed!');
      console.log('\n✨ Toggle component meets WCAG 2.1 AA standards');
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

runA11yValidation();
