#!/usr/bin/env tsx
/**
 * Generic component contract validation script
 *
 * Usage:
 *   tsx scripts/validate-component-contract.ts <component-name>
 *
 * Example:
 *   tsx scripts/validate-component-contract.ts button
 *   tsx scripts/validate-component-contract.ts input
 *
 * This script validates that a LIT component implementation matches its Figma contract.
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Terminal colors
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

interface PropertyDefinition {
  type: string;
  default?: string | number | boolean;
}

interface ContractProperty {
  required: boolean;
  default: any;
  values?: readonly any[];
}

interface Contract {
  componentId: string;
  componentName: string;
  figmaFileId: string;
  version: string;
  extractedAt: string;
  properties: Record<string, ContractProperty>;
}

/**
 * Extract component properties by parsing the TypeScript file
 */
function extractComponentProperties(filePath: string): Record<string, PropertyDefinition> {
  const fileContent = readFileSync(filePath, 'utf-8');
  const properties: Record<string, PropertyDefinition> = {};

  // Extract @property decorated properties
  const propertyRegex = /@property\([^)]*\)\s+(\w+)(?::\s*([^=;]+?))?(?:\s*=\s*([^;]+))?;/g;
  let match;

  while ((match = propertyRegex.exec(fileContent)) !== null) {
    const [, propertyName, type, defaultValue] = match;
    properties[propertyName] = {
      type: type?.trim() || 'inferred',
      default: defaultValue?.trim().replace(/['"]/g, '')
    };
  }

  return properties;
}

/**
 * Extract type union values from TypeScript file
 */
function extractTypeValues(fileContent: string, typeName: string): string[] {
  const typeRegex = new RegExp(`export type ${typeName}\\s*=\\s*([^;]+);`, 's');
  const match = fileContent.match(typeRegex);

  if (!match) {
    return [];
  }

  return match[1]
    .split('|')
    .map(v => v.trim().replace(/['"]/g, ''))
    .filter(v => v);
}

/**
 * Validate component against contract
 */
function validateComponent(
  componentPath: string,
  contract: Contract
): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: []
  };

  console.log(`${colors.blue}📋 Validating component:${colors.reset} ${componentPath}\n`);

  // Extract component properties
  const componentProps = extractComponentProperties(componentPath);
  const componentContent = readFileSync(componentPath, 'utf-8');

  console.log(`${colors.cyan}📦 Extracted properties:${colors.reset}`);
  Object.keys(componentProps).forEach(key => {
    console.log(`  - ${key}: ${componentProps[key].type} (default: ${componentProps[key].default || 'undefined'})`);
  });
  console.log();

  console.log(`${colors.cyan}✅ Checking required properties from Figma contract:${colors.reset}\n`);

  // Validate each property in the contract
  for (const [propName, propSpec] of Object.entries(contract.properties)) {
    if (!propSpec.required) {
      continue;
    }

    // Check if property exists
    if (!componentProps[propName]) {
      result.errors.push(`Missing required property: ${propName}`);
      result.valid = false;
      continue;
    }

    const componentProp = componentProps[propName];
    console.log(`  ✓ ${propName}: ${componentProp.type} (default: ${componentProp.default})`);

    // Validate default value
    const expectedDefault = String(propSpec.default);
    if (componentProp.default !== expectedDefault) {
      result.errors.push(
        `${propName} default value mismatch. Expected: "${expectedDefault}", Got: "${componentProp.default}"`
      );
      result.valid = false;
    }

    // Validate allowed values if specified
    if (propSpec.values && propSpec.values.length > 0) {
      const contractValues = propSpec.values as readonly string[];

      // Try to extract type values from component file
      const typeName = componentProp.type.includes('|') ? '' : componentProp.type;
      let componentValues: string[] = [];

      if (typeName) {
        componentValues = extractTypeValues(componentContent, typeName);
      }

      if (componentValues.length > 0) {
        const missingValues = contractValues.filter((v: string) => !componentValues.includes(v));
        const extraValues = componentValues.filter((v: string) => !contractValues.includes(v));

        if (missingValues.length > 0) {
          result.errors.push(`${propName}: missing values from contract: ${missingValues.join(', ')}`);
          result.valid = false;
        }
        if (extraValues.length > 0) {
          result.warnings.push(`${propName}: extra values not in contract: ${extraValues.join(', ')}`);
        }
      }
    }
  }

  console.log();

  return result;
}

/**
 * Load contract from file
 */
function loadContract(componentName: string): Contract | null {
  const contractPath = resolve(__dirname, `../.figma/${componentName}.figma-contract.ts`);

  if (!existsSync(contractPath)) {
    console.error(`${colors.red}❌ Contract file not found:${colors.reset} ${contractPath}\n`);
    console.log(`Run: tsx scripts/extract-figma-contract.ts ${componentName} <node-id>\n`);
    return null;
  }

  try {
    // Import the contract dynamically
    // Note: This is a simplified version. In practice, you'd need to properly import the module
    console.log(`${colors.cyan}📄 Loading contract:${colors.reset} ${contractPath}\n`);

    // For now, we expect the contract to export a constant with a specific name
    // This would be better with dynamic import() but that requires async context
    const contractContent = readFileSync(contractPath, 'utf-8');

    // Extract contract constant (simplified parsing)
    const contractVarName = `FIGMA_${componentName.toUpperCase()}_CONTRACT`;
    const contractRegex = new RegExp(`export const ${contractVarName}\\s*=\\s*({[\\s\\S]*?})\\s*as const;`);
    const match = contractContent.match(contractRegex);

    if (!match) {
      console.error(`${colors.red}❌ Could not parse contract from file${colors.reset}\n`);
      console.log(`Expected to find: export const ${contractVarName} = { ... } as const;\n`);
      return null;
    }

    // Parse the contract object (using eval for simplicity in this PoC)
    // In production, use a proper parser or require the module
    const contractObj = eval(`(${match[1]})`);

    return contractObj as Contract;
  } catch (error) {
    console.error(`${colors.red}❌ Error loading contract:${colors.reset}`, error);
    return null;
  }
}

/**
 * Parse command line arguments
 */
function parseArgs(): string | null {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error(`${colors.red}❌ Error: Missing component name${colors.reset}\n`);
    console.log(`Usage: tsx scripts/validate-component-contract.ts <component-name>\n`);
    console.log(`Examples:`);
    console.log(`  tsx scripts/validate-component-contract.ts button`);
    console.log(`  tsx scripts/validate-component-contract.ts input\n`);
    return null;
  }

  return args[0].toLowerCase();
}

/**
 * Main entry point
 */
function main() {
  const componentName = parseArgs();

  if (!componentName) {
    process.exit(1);
  }

  console.log(`${colors.blue}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║  Component Contract Validation (Generic)                  ║${colors.reset}`);
  console.log(`${colors.blue}║  Figma SSOT → LIT Component Implementation                ║${colors.reset}`);
  console.log(`${colors.blue}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  // Load contract
  const contract = loadContract(componentName);
  if (!contract) {
    process.exit(1);
  }

  // Display contract metadata
  console.log(`${colors.cyan}📄 Contract Information:${colors.reset}`);
  console.log(`  Component: ${contract.componentName}`);
  console.log(`  Component ID: ${contract.componentId}`);
  console.log(`  Figma File ID: ${contract.figmaFileId}`);
  console.log(`  Version: ${contract.version}`);
  console.log(`  Extracted At: ${contract.extractedAt}\n`);

  // Validate component
  const componentPath = resolve(__dirname, `../packages/web-components/src/components/kds-${componentName}.ts`);

  if (!existsSync(componentPath)) {
    console.error(`${colors.red}❌ Component file not found:${colors.reset} ${componentPath}\n`);
    process.exit(1);
  }

  const result = validateComponent(componentPath, contract);

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

// Run
main();
