#!/usr/bin/env tsx
/**
 * Validation script for Toggle component contract
 * Compares kds-toggle.ts implementation against toggle.figma-contract.ts
 *
 * @usage: tsx scripts/validate-toggle-contract.ts
 * @returns: Exit code 0 if valid, 1 if validation fails
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import {
  FIGMA_TOGGLE_CONTRACT
} from '../.figma/toggle.figma-contract.js';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Extract component properties by parsing the TypeScript file
 */
function extractComponentProperties(filePath: string): Record<string, any> {
  const fileContent = readFileSync(filePath, 'utf-8');

  const properties: Record<string, any> = {};

  // Extract @property decorated properties
  const propertyRegex = /@property\([^)]*\)\s+(?:override\s+)?(\w+)(?::\s*([^=;]+?))?(?:\s*=\s*([^;]+))?;/g;
  let match;

  while ((match = propertyRegex.exec(fileContent)) !== null) {
    const [, propertyName, type, defaultValue] = match;
    properties[propertyName] = {
      type: type?.trim() || 'inferred',
      default: defaultValue?.trim().replace(/['"]/g, '')
    };
  }

  // Extract ToggleSize type definition
  const sizeTypeRegex = /export type ToggleSize = ([^;]+);/;
  const sizeMatch = fileContent.match(sizeTypeRegex);
  if (sizeMatch) {
    properties._toggleSizeValues = sizeMatch[1]
      .split('|')
      .map(v => v.trim().replace(/['"]/g, ''));
  }

  // Check for role="switch"
  properties._hasRoleSwitch = fileContent.includes('role="switch"');

  // Check for aria-checked
  properties._hasAriaChecked = fileContent.includes('aria-checked');

  // Check for CSS token usage
  properties._usesTokens = {
    'brand-600': fileContent.includes('#7F56D9') || fileContent.includes('brand-600'),
    'gray-100': fileContent.includes('#F5F5F5') || fileContent.includes('gray-100'),
    'gray-200': fileContent.includes('#E9EAEB') || fileContent.includes('gray-200'),
    'gray-50': fileContent.includes('#FAFAFA') || fileContent.includes('gray-50'),
    'focus-ring': fileContent.includes('#F4EBFF') || fileContent.includes('focus'),
  };

  // Check track dimensions
  properties._trackDimensions = {
    sm: fileContent.includes('36px') && fileContent.includes('20px'),
    md: fileContent.includes('44px') && fileContent.includes('24px'),
  };

  // Check knob dimensions
  properties._knobDimensions = {
    sm: fileContent.includes('16px'),
    md: fileContent.includes('20px'),
  };

  return properties;
}

/**
 * Validate that component properties match the Figma contract
 */
function validateComponent(componentPath: string): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: []
  };

  console.log(`${colors.blue}📋 Validating component:${colors.reset} ${componentPath}\n`);

  const componentProps = extractComponentProperties(componentPath);

  console.log(`${colors.cyan}📦 Extracted properties:${colors.reset}`);
  Object.keys(componentProps).forEach(key => {
    if (!key.startsWith('_')) {
      console.log(`  - ${key}: ${componentProps[key].type} (default: ${componentProps[key].default || 'undefined'})`);
    }
  });
  console.log();

  // Validate required properties from contract
  console.log(`${colors.cyan}✅ Checking required properties from Figma contract:${colors.reset}\n`);

  // Check: size property
  if (!componentProps.size) {
    result.errors.push('Missing required property: size');
    result.valid = false;
  } else {
    console.log(`  ✓ size: ${componentProps.size.type} (default: ${componentProps.size.default})`);

    if (componentProps.size.default !== FIGMA_TOGGLE_CONTRACT.properties.size.default) {
      result.errors.push(
        `size default value mismatch. Expected: "${FIGMA_TOGGLE_CONTRACT.properties.size.default}", Got: "${componentProps.size.default}"`
      );
      result.valid = false;
    }

    const contractSizes = FIGMA_TOGGLE_CONTRACT.properties.size.values as readonly string[];
    const componentSizes = componentProps._toggleSizeValues || [];

    const missingSizes = contractSizes.filter((s: string) => !componentSizes.includes(s));
    const extraSizes = componentSizes.filter((s: string) => !contractSizes.includes(s));

    if (missingSizes.length > 0) {
      result.errors.push(`size: missing values from contract: ${missingSizes.join(', ')}`);
      result.valid = false;
    }
    if (extraSizes.length > 0) {
      result.warnings.push(`size: extra values not in contract: ${extraSizes.join(', ')}`);
    }
  }

  // Check: pressed property
  if (!componentProps.pressed) {
    result.errors.push('Missing required property: pressed');
    result.valid = false;
  } else {
    console.log(`  ✓ pressed: ${componentProps.pressed.type} (default: ${componentProps.pressed.default})`);

    const isBoolean = componentProps.pressed.type.includes('Boolean') ||
                      componentProps.pressed.type.includes('boolean') ||
                      (componentProps.pressed.type === 'inferred' &&
                       (componentProps.pressed.default === 'false' || componentProps.pressed.default === 'true'));

    if (!isBoolean) {
      result.errors.push(`pressed: Expected boolean type, got ${componentProps.pressed.type}`);
      result.valid = false;
    }

    const expectedDefault = String(FIGMA_TOGGLE_CONTRACT.properties.pressed.default);
    if (componentProps.pressed.default !== expectedDefault) {
      result.errors.push(
        `pressed default value mismatch. Expected: ${expectedDefault}, Got: ${componentProps.pressed.default}`
      );
      result.valid = false;
    }
  }

  // Check: disabled property
  if (componentProps.disabled) {
    console.log(`  ✓ disabled: ${componentProps.disabled.type} (default: ${componentProps.disabled.default})`);
  }

  console.log();

  // Validate ARIA / Accessibility
  console.log(`${colors.cyan}♿ Checking accessibility requirements:${colors.reset}\n`);

  if (componentProps._hasRoleSwitch) {
    console.log(`  ✓ role="switch" present`);
  } else {
    result.errors.push('Missing role="switch" on toggle input');
    result.valid = false;
  }

  if (componentProps._hasAriaChecked) {
    console.log(`  ✓ aria-checked present`);
  } else {
    result.errors.push('Missing aria-checked attribute');
    result.valid = false;
  }

  console.log();

  // Validate design tokens usage
  console.log(`${colors.cyan}🎨 Checking design token usage:${colors.reset}\n`);

  const tokenChecks = componentProps._usesTokens || {};
  for (const [token, used] of Object.entries(tokenChecks)) {
    if (used) {
      console.log(`  ✓ ${token} token used`);
    } else {
      result.warnings.push(`Design token "${token}" not found in component`);
    }
  }

  console.log();

  // Validate dimensions
  console.log(`${colors.cyan}📐 Checking Figma dimensions:${colors.reset}\n`);

  const trackDims = componentProps._trackDimensions || {};
  if (trackDims.sm) {
    console.log(`  ✓ Track sm: 36×20px`);
  } else {
    result.errors.push('Track sm dimensions (36×20px) not found');
    result.valid = false;
  }

  if (trackDims.md) {
    console.log(`  ✓ Track md: 44×24px`);
  } else {
    result.errors.push('Track md dimensions (44×24px) not found');
    result.valid = false;
  }

  const knobDims = componentProps._knobDimensions || {};
  if (knobDims.sm) {
    console.log(`  ✓ Knob sm: 16px`);
  } else {
    result.errors.push('Knob sm dimension (16px) not found');
    result.valid = false;
  }

  if (knobDims.md) {
    console.log(`  ✓ Knob md: 20px`);
  } else {
    result.errors.push('Knob md dimension (20px) not found');
    result.valid = false;
  }

  console.log();

  // Web-specific properties
  console.log(`${colors.cyan}ℹ️  Web-specific properties (optional, not in Figma contract):${colors.reset}\n`);

  if (componentProps.name) {
    console.log(`  • name: ${componentProps.name.type}`);
  }
  if (componentProps.value) {
    console.log(`  • value: ${componentProps.value.type} (default: ${componentProps.value.default})`);
  }
  if (componentProps.supportingText) {
    console.log(`  • supportingText: ${componentProps.supportingText.type}`);
  }
  if (componentProps.ariaLabel) {
    console.log(`  • ariaLabel: ${componentProps.ariaLabel.type}`);
  }
  if (componentProps.ariaDescribedBy) {
    console.log(`  • ariaDescribedBy: ${componentProps.ariaDescribedBy.type}`);
  }
  console.log();

  return result;
}

/**
 * Main validation function
 */
function main() {
  console.log(`${colors.blue}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║  Toggle Component Contract Validation                     ║${colors.reset}`);
  console.log(`${colors.blue}║  Figma SSOT → LIT Component Implementation                ║${colors.reset}`);
  console.log(`${colors.blue}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  // Display contract metadata
  console.log(`${colors.cyan}📄 Contract Information:${colors.reset}`);
  console.log(`  Figma Component: ${FIGMA_TOGGLE_CONTRACT.componentName}`);
  console.log(`  Component ID: ${FIGMA_TOGGLE_CONTRACT.componentId}`);
  console.log(`  Figma File ID: ${FIGMA_TOGGLE_CONTRACT.figmaFileId}`);
  console.log(`  Contract Version: ${FIGMA_TOGGLE_CONTRACT.version}`);
  console.log(`  Extracted At: ${FIGMA_TOGGLE_CONTRACT.extractedAt}\n`);

  // Validate component
  const componentPath = resolve(__dirname, '../packages/web-components/src/components/kds-toggle.ts');
  const result = validateComponent(componentPath);

  // Display results
  console.log(`${colors.blue}═══════════════════════════════════════════════════════════${colors.reset}\n`);

  if (result.warnings.length > 0) {
    console.log(`${colors.yellow}⚠️  WARNINGS (${result.warnings.length}):${colors.reset}\n`);
    result.warnings.forEach(warning => {
      console.log(`  ${colors.yellow}⚠${colors.reset}  ${warning}`);
    });
    console.log();
  }

  if (result.errors.length > 0) {
    console.log(`${colors.red}❌ VALIDATION FAILED (${result.errors.length} errors):${colors.reset}\n`);
    result.errors.forEach(error => {
      console.log(`  ${colors.red}✗${colors.reset}  ${error}`);
    });
    console.log();
    console.log(`${colors.red}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.red}║  FAILED: Component does NOT match Figma contract          ║${colors.reset}`);
    console.log(`${colors.red}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);
    process.exit(1);
  } else {
    console.log(`${colors.green}✅ VALIDATION PASSED${colors.reset}\n`);
    console.log(`${colors.green}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.green}║  SUCCESS: Component matches Figma contract (SSOT) ✓       ║${colors.reset}`);
    console.log(`${colors.green}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);

    if (result.warnings.length > 0) {
      console.log(`${colors.yellow}Note: ${result.warnings.length} warning(s) found. Review recommended.${colors.reset}\n`);
    }

    process.exit(0);
  }
}

main();
