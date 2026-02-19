/**
 * Accessibility Validation for Button Component
 *
 * Validates that kds-button meets WCAG 2.1 AA standards and accessibility best practices.
 *
 * Checks:
 * - ARIA attributes and roles
 * - Keyboard navigation support
 * - Color contrast ratios
 * - Touch target sizes
 * - Disabled state handling
 * - Screen reader compatibility
 *
 * Usage: tsx scripts/validate-button-a11y.ts
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
 * Read the Button component source code
 */
function readButtonSource(): string {
  const buttonPath = path.join(__dirname, '../packages/web-components/src/components/kds-button.ts');
  if (!fs.existsSync(buttonPath)) {
    throw new Error(`Button component not found at ${buttonPath}`);
  }
  return fs.readFileSync(buttonPath, 'utf-8');
}

/**
 * Check ARIA attributes implementation
 */
function checkARIAAttributes(source: string): void {
  console.log('\n🔍 Checking ARIA attributes...');

  // Check for role="button"
  if (source.includes('role="button"') || source.includes("role='button'")) {
    console.log('  ✅ Explicit role="button" found');
  } else {
    console.log('  ℹ️  No explicit role="button" (native <button> element provides implicit role)');
  }

  // Check for aria-label support
  if (source.includes('aria-label')) {
    console.log('  ✅ aria-label attribute support found');
  } else {
    addIssue('warning', 'ARIA', 'No aria-label attribute handling found', 'Add aria-label support for icon-only buttons');
  }

  // Check for aria-disabled
  if (source.includes('aria-disabled')) {
    console.log('  ✅ aria-disabled attribute found');
  } else {
    addIssue('warning', 'ARIA', 'Consider adding aria-disabled alongside disabled attribute');
  }

  // Check for aria-busy (for loading states)
  if (source.includes('aria-busy')) {
    console.log('  ✅ aria-busy support found (for loading states)');
  } else {
    console.log('  ℹ️  No aria-busy attribute (loading state not implemented yet)');
  }
}

/**
 * Check keyboard navigation support
 */
function checkKeyboardNavigation(source: string): void {
  console.log('\n🔍 Checking keyboard navigation...');

  // Check for keyboard event handlers
  const hasKeyDown = source.includes('keydown') || source.includes('keypress');
  const hasEnterSpace = source.includes('Enter') && source.includes('Space');

  if (hasKeyDown && hasEnterSpace) {
    console.log('  ✅ Keyboard event handling (Enter/Space) found');
  } else if (source.includes('<button')) {
    console.log('  ✅ Native <button> element provides built-in keyboard support');
  } else {
    addIssue('error', 'Keyboard', 'No keyboard event handling found', 'Ensure Enter and Space keys trigger button action');
  }

  // Check for focus management
  if (source.includes('focus') || source.includes(':focus')) {
    console.log('  ✅ Focus management found');
  } else {
    addIssue('warning', 'Keyboard', 'No explicit focus management found', 'Add focus styles and focus management');
  }

  // Check for tabindex handling
  if (source.includes('tabindex') || source.includes('tabIndex')) {
    console.log('  ✅ tabindex handling found');
  } else {
    console.log('  ℹ️  No explicit tabindex (native <button> is focusable by default)');
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

  // Verify tokens file is parseable
  JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));

  // Manual contrast checks based on WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text)
  console.log('  ℹ️  Color combinations to verify manually:');
  console.log('     - Primary: #7F56D9 (brand-600) on white → Verify 4.5:1 contrast');
  console.log('     - Secondary: #344054 (gray-700) on white → Verify 4.5:1 contrast');
  console.log('     - Tertiary: #475467 (gray-600) on white → Verify 4.5:1 contrast');
  console.log('     - Error/Destructive: #D92D20 (error-600) on white → Verify 4.5:1 contrast');
  console.log('     - Disabled: Reduced contrast expected (not subject to WCAG)');

  addIssue('warning', 'Contrast', 'Color contrast ratios should be verified manually or with automated tools',
    'Use tools like WebAIM Contrast Checker or browser DevTools to verify all color combinations meet WCAG 2.1 AA (4.5:1 ratio)');
}

/**
 * Check touch target sizes
 */
function checkTouchTargets(source: string): void {
  console.log('\n🔍 Checking touch target sizes...');

  // WCAG 2.1 AA requires minimum 44x44px touch targets
  // Check if sizes are defined
  const hasSizeVariants = source.includes('size === "sm"') || source.includes('size === "md"');

  if (hasSizeVariants) {
    console.log('  ✅ Size variants found (sm, md, lg, xl)');
    console.log('  ℹ️  Minimum touch target sizes to verify:');
    console.log('     - Small (sm): Should be at least 44x44px or documented as compact variant');
    console.log('     - Medium (md): Should meet 44x44px minimum');
    console.log('     - Large (lg): Should exceed 44x44px');
    console.log('     - Extra Large (xl): Should exceed 44x44px');

    // Check tokens for actual sizes
    const tokensPath = path.join(__dirname, '../packages/tokens/src/tokens.json');
    if (fs.existsSync(tokensPath)) {
      const tokensContent = fs.readFileSync(tokensPath, 'utf-8');
      if (tokensContent.includes('button') && tokensContent.includes('height')) {
        console.log('  ✅ Button height tokens defined in tokens.json');
      }
    }
  } else {
    addIssue('warning', 'Touch Targets', 'Size variants not clearly defined', 'Ensure all button sizes meet WCAG 2.1 touch target minimum (44x44px)');
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

  // Check that disabled buttons don't fire events
  if (source.includes('disabled') && (source.includes('preventDefault') || source.includes('return'))) {
    console.log('  ✅ Event prevention for disabled state found');
  } else {
    addIssue('warning', 'Disabled State', 'Verify disabled buttons do not fire click events');
  }

  // Check for visual feedback
  if (source.includes('cursor') || source.includes('opacity')) {
    console.log('  ✅ Visual feedback for disabled state found');
  } else {
    addIssue('warning', 'Disabled State', 'Add clear visual feedback for disabled state (cursor, opacity, etc.)');
  }
}

/**
 * Check screen reader support
 */
function checkScreenReaderSupport(source: string): void {
  console.log('\n🔍 Checking screen reader support...');

  // Check for text content or aria-label
  if (source.includes('slot') && source.includes('textContent')) {
    console.log('  ✅ Text content via slots found');
  } else {
    addIssue('warning', 'Screen Reader', 'Verify text content is exposed to screen readers');
  }

  // Check for icon-only button handling
  if (source.includes('icon-position') && source.includes('only')) {
    console.log('  ✅ Icon-only button variant found');
    if (source.includes('aria-label')) {
      console.log('  ✅ aria-label requirement for icon-only buttons');
    } else {
      addIssue('error', 'Screen Reader', 'Icon-only buttons must have aria-label',
        'Require aria-label attribute when icon-position="only"');
    }
  }

  // Check for semantic HTML
  if (source.includes('<button')) {
    console.log('  ✅ Semantic <button> element used (screen reader compatible)');
  } else if (source.includes('<div') || source.includes('<span')) {
    addIssue('error', 'Screen Reader', 'Non-semantic element used for button', 'Use semantic <button> element');
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
}

/**
 * Run all accessibility checks
 */
function runA11yValidation(): void {
  console.log('🔍 Button Component - Accessibility Validation');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    const source = readButtonSource();

    // Run all checks
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
      console.log('\n✨ Button component meets WCAG 2.1 AA standards');
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
