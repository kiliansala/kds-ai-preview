#!/usr/bin/env tsx
/**
 * Validation script for Checkbox component contract
 * Compares kds-checkbox.ts implementation against checkbox.figma-contract.ts
 *
 * ⚠️ STATUS: PENDING COMPLETE FIGMA DATA
 * This script validates against the contract structure, but contract values
 * marked as TODO_EXTRACT_FROM_FIGMA must be replaced with actual Figma data first.
 *
 * @usage: tsx scripts/validate-checkbox-contract.ts
 * @returns: Exit code 0 if valid, 1 if validation fails
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import {
  FIGMA_CHECKBOX_CONTRACT
} from '../.figma/checkbox.figma-contract.js';

// Terminal colors for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  pendingFigmaData: boolean;
}

/**
 * Extract component properties by parsing the TypeScript file
 * This is a simple regex-based extraction for the PoC
 */
function extractComponentProperties(filePath: string): Record<string, any> {
  const fileContent = readFileSync(filePath, 'utf-8');

  const properties: Record<string, any> = {};

  // Extract @property decorated properties (handles both with and without type annotation)
  const propertyRegex = /@property\([^)]*\)\s+(\w+)(?::\s*([^=;]+?))?(?:\s*=\s*([^;]+))?;/g;
  let match;

  while ((match = propertyRegex.exec(fileContent)) !== null) {
    const [, propertyName, type, defaultValue] = match;
    properties[propertyName] = {
      type: type?.trim() || 'inferred',
      default: defaultValue?.trim().replace(/['"]/g, '')
    };
  }

  // Extract type definitions
  const sizeTypeRegex = /export type CheckboxSize = ([^;]+);/;
  const sizeMatch = fileContent.match(sizeTypeRegex);
  if (sizeMatch) {
    properties._checkboxSizeValues = sizeMatch[1]
      .split('|')
      .map(v => v.trim().replace(/['"]/g, ''));
  }

  return properties;
}

/**
 * Check if contract has pending Figma data (TODO markers)
 */
function checkPendingFigmaData(): boolean {
  const contractJsonPath = resolve(__dirname, '../.figma/checkbox.figma-contract.json');
  const contractContent = readFileSync(contractJsonPath, 'utf-8');

  return contractContent.includes('TODO_EXTRACT_FROM_FIGMA') ||
         contractContent.includes('PENDING_FIGMA_DATA');
}

/**
 * Validate that component properties match the Figma contract
 */
function validateComponent(componentPath: string): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    pendingFigmaData: checkPendingFigmaData()
  };

  console.log(`${colors.blue}📋 Validating component:${colors.reset} ${componentPath}\n`);

  // Check if Figma data is complete
  if (result.pendingFigmaData) {
    console.log(`${colors.magenta}⚠️  WARNING: Contract contains TODO_EXTRACT_FROM_FIGMA markers${colors.reset}`);
    console.log(`${colors.magenta}   This validation is PRELIMINARY until Figma data is extracted.${colors.reset}\n`);
  }

  // Extract properties from component file
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

    // Validate default value (if not pending Figma data)
    if (!result.pendingFigmaData) {
      if (componentProps.size.default !== FIGMA_CHECKBOX_CONTRACT.properties.size.default) {
        result.errors.push(
          `size default value mismatch. Expected: "${FIGMA_CHECKBOX_CONTRACT.properties.size.default}", Got: "${componentProps.size.default}"`
        );
        result.valid = false;
      }

      // Validate allowed values
      const contractSizes = FIGMA_CHECKBOX_CONTRACT.properties.size.values as readonly string[];
      const componentSizes = componentProps._checkboxSizeValues || [];

      const missingSizes = contractSizes.filter((s: string) => !componentSizes.includes(s));
      const extraSizes = componentSizes.filter((s: string) => !contractSizes.includes(s));

      if (missingSizes.length > 0) {
        result.errors.push(`size: missing values from contract: ${missingSizes.join(', ')}`);
        result.valid = false;
      }
      if (extraSizes.length > 0) {
        result.warnings.push(`size: extra values not in contract: ${extraSizes.join(', ')}`);
      }
    } else {
      console.log(`    ${colors.yellow}⏸️  Validation skipped: awaiting Figma data${colors.reset}`);
    }
  }

  // Check: checked property
  if (!componentProps.checked) {
    result.errors.push('Missing required property: checked');
    result.valid = false;
  } else {
    console.log(`  ✓ checked: ${componentProps.checked.type} (default: ${componentProps.checked.default})`);

    // Validate type
    const isBoolean = componentProps.checked.type.includes('Boolean') ||
                      componentProps.checked.type.includes('boolean') ||
                      (componentProps.checked.type === 'inferred' &&
                       (componentProps.checked.default === 'false' || componentProps.checked.default === 'true'));

    if (!isBoolean) {
      result.errors.push(`checked: Expected boolean type, got ${componentProps.checked.type}`);
      result.valid = false;
    }

    // Validate default value
    const expectedDefault = String(FIGMA_CHECKBOX_CONTRACT.properties.checked.default);
    if (componentProps.checked.default !== expectedDefault) {
      result.errors.push(
        `checked default value mismatch. Expected: ${expectedDefault}, Got: ${componentProps.checked.default}`
      );
      result.valid = false;
    }
  }

  // Check: indeterminate property (optional)
  if (componentProps.indeterminate) {
    console.log(`  ✓ indeterminate: ${componentProps.indeterminate.type} (default: ${componentProps.indeterminate.default})`);

    // Validate type
    const isBoolean = componentProps.indeterminate.type.includes('Boolean') ||
                      componentProps.indeterminate.type.includes('boolean') ||
                      (componentProps.indeterminate.type === 'inferred' &&
                       (componentProps.indeterminate.default === 'false' || componentProps.indeterminate.default === 'true'));

    if (!isBoolean) {
      result.warnings.push(`indeterminate: Expected boolean type, got ${componentProps.indeterminate.type}`);
    }
  } else {
    result.warnings.push('Optional property "indeterminate" not found (may be intentional)');
  }

  // Check: disabled property (web-specific, but common)
  if (componentProps.disabled) {
    console.log(`  ✓ disabled: ${componentProps.disabled.type} (default: ${componentProps.disabled.default})`);
  }

  console.log();

  // Optional properties (web-specific, not in Figma)
  console.log(`${colors.cyan}ℹ️  Web-specific properties (optional, not in Figma contract):${colors.reset}\n`);

  if (componentProps.error) {
    console.log(`  • error: ${componentProps.error.type} (default: ${componentProps.error.default})`);
  }
  if (componentProps.name) {
    console.log(`  • name: ${componentProps.name.type}`);
  }
  if (componentProps.value) {
    console.log(`  • value: ${componentProps.value.type} (default: ${componentProps.value.default})`);
  }
  if (componentProps.required) {
    console.log(`  • required: ${componentProps.required.type} (default: ${componentProps.required.default})`);
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
  console.log(`${colors.blue}║  Checkbox Component Contract Validation                   ║${colors.reset}`);
  console.log(`${colors.blue}║  Figma SSOT → LIT Component Implementation                ║${colors.reset}`);
  console.log(`${colors.blue}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  // Display contract metadata
  console.log(`${colors.cyan}📄 Contract Information:${colors.reset}`);
  console.log(`  Figma Component: ${FIGMA_CHECKBOX_CONTRACT.componentName}`);
  console.log(`  Component ID: ${FIGMA_CHECKBOX_CONTRACT.componentId}`);
  console.log(`  Figma File ID: ${FIGMA_CHECKBOX_CONTRACT.figmaFileId}`);
  console.log(`  Contract Version: ${FIGMA_CHECKBOX_CONTRACT.version}`);
  console.log(`  Extracted At: ${FIGMA_CHECKBOX_CONTRACT.extractedAt}\n`);

  // Check extraction status
  if ('_extractionStatus' in FIGMA_CHECKBOX_CONTRACT) {
    const status = (FIGMA_CHECKBOX_CONTRACT as any)._extractionStatus;
    if (status?.status === 'PENDING_FIGMA_DATA') {
      console.log(`${colors.magenta}⚠️  Extraction Status: ${status.status}${colors.reset}`);
      if (status.notes) {
        console.log(`${colors.magenta}   ${status.notes}${colors.reset}\n`);
      }
    }
  }

  // Validate component
  const componentPath = resolve(__dirname, '../packages/web-components/src/components/kds-checkbox.ts');
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

    if (result.pendingFigmaData) {
      console.log(`${colors.magenta}📋 Next Steps:${colors.reset}`);
      console.log(`${colors.magenta}   1. Extract Figma design data using MCP (nodeId: ${FIGMA_CHECKBOX_CONTRACT.componentId})${colors.reset}`);
      console.log(`${colors.magenta}   2. Update .figma/checkbox.figma-contract.json with actual values${colors.reset}`);
      console.log(`${colors.magenta}   3. Update .figma/checkbox.figma-contract.ts with actual types${colors.reset}`);
      console.log(`${colors.magenta}   4. Re-run this validation script${colors.reset}\n`);
    }

    process.exit(1);
  } else {
    if (result.pendingFigmaData) {
      console.log(`${colors.yellow}⚠️  PRELIMINARY VALIDATION PASSED${colors.reset}\n`);
      console.log(`${colors.yellow}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
      console.log(`${colors.yellow}║  PENDING: Component structure valid, awaiting Figma data  ║${colors.reset}`);
      console.log(`${colors.yellow}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);

      console.log(`${colors.magenta}📋 Complete these steps for full validation:${colors.reset}`);
      console.log(`${colors.magenta}   1. Run Figma MCP command to extract design (nodeId: ${FIGMA_CHECKBOX_CONTRACT.componentId})${colors.reset}`);
      console.log(`${colors.magenta}   2. Update contract files with actual Figma values${colors.reset}`);
      console.log(`${colors.magenta}   3. Update kds-checkbox.ts implementation to match${colors.reset}`);
      console.log(`${colors.magenta}   4. Re-run: tsx scripts/validate-checkbox-contract.ts${colors.reset}\n`);

      // Exit with warning code (but not failure)
      if (result.warnings.length > 0) {
        console.log(`${colors.yellow}Note: ${result.warnings.length} warning(s) found. Review recommended.${colors.reset}\n`);
      }

      process.exit(0);
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
}

// Run validation
main();
