/**
 * Contract Validation for Badge Component
 *
 * Validates that kds-badge implements all properties defined in the Figma contract.
 *
 * Usage: tsx scripts/validate-badge-contract.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
};

interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
}

function validateBadgeContract(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  console.log(`${colors.cyan}Badge Component - Contract Validation${colors.reset}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // 1. Read contract
  const contractPath = path.join(__dirname, '../.figma/badge.figma-contract.json');
  if (!fs.existsSync(contractPath)) {
    errors.push('Contract file not found: .figma/badge.figma-contract.json');
    return { passed: false, errors, warnings };
  }

  const contract = JSON.parse(fs.readFileSync(contractPath, 'utf-8'));
  console.log(`${colors.green}  ✓ Contract file found${colors.reset}`);

  // 2. Read component source
  const componentPath = path.join(__dirname, '../packages/web-components/src/components/kds-badge.ts');
  if (!fs.existsSync(componentPath)) {
    errors.push('Component file not found: packages/web-components/src/components/kds-badge.ts');
    return { passed: false, errors, warnings };
  }

  const source = fs.readFileSync(componentPath, 'utf-8');
  console.log(`${colors.green}  ✓ Component file found${colors.reset}\n`);

  // 3. Validate required properties exist
  console.log(`${colors.cyan}Checking required properties...${colors.reset}`);

  // Check size property
  if (source.includes("size: BadgeSize = 'sm'") || source.includes('size: BadgeSize')) {
    console.log(`${colors.green}  ✓ size property found${colors.reset}`);

    // Check size values
    const sizeValues = contract.properties.size.values;
    for (const val of sizeValues) {
      if (source.includes(`size-${val}`) || source.includes(`'${val}'`)) {
        console.log(`${colors.green}    ✓ size="${val}" supported${colors.reset}`);
      } else {
        errors.push(`Missing size variant: "${val}"`);
      }
    }
  } else {
    errors.push('Missing required property: size');
  }

  // Check color property
  if (source.includes("color: BadgeColor = 'primary'") || source.includes('color: BadgeColor')) {
    console.log(`${colors.green}  ✓ color property found${colors.reset}`);

    // Check color values
    const colorValues = contract.properties.color.values;
    for (const val of colorValues) {
      if (source.includes(`color-${val}`)) {
        console.log(`${colors.green}    ✓ color="${val}" supported${colors.reset}`);
      } else {
        errors.push(`Missing color variant: "${val}"`);
      }
    }
  } else {
    errors.push('Missing required property: color');
  }

  // Check icon property
  if (source.includes("icon: BadgeIcon = 'false'") || source.includes('icon: BadgeIcon')) {
    console.log(`${colors.green}  ✓ icon property found${colors.reset}`);

    // Check icon values
    const iconValues = contract.properties.icon.values;
    for (const val of iconValues) {
      if (source.includes(`'${val}'`)) {
        console.log(`${colors.green}    ✓ icon="${val}" supported${colors.reset}`);
      } else {
        errors.push(`Missing icon variant: "${val}"`);
      }
    }
  } else {
    errors.push('Missing required property: icon');
  }

  // 4. Validate design tokens
  console.log(`\n${colors.cyan}Checking design tokens...${colors.reset}`);

  const tokenColors = contract.designTokens.colors;
  for (const [colorName, tokens] of Object.entries(tokenColors) as [string, any][]) {
    const bg = tokens.bg;
    const text = tokens.text;

    if (source.includes(bg)) {
      console.log(`${colors.green}  ✓ ${colorName} background token (${bg})${colors.reset}`);
    } else {
      warnings.push(`${colorName} background token (${bg}) not found inline - may use CSS custom property`);
    }

    if (source.includes(text)) {
      console.log(`${colors.green}  ✓ ${colorName} text token (${text})${colors.reset}`);
    } else {
      warnings.push(`${colorName} text token (${text}) not found inline - may use CSS custom property`);
    }
  }

  // 5. Validate typography
  console.log(`\n${colors.cyan}Checking typography...${colors.reset}`);

  if (source.includes('font-size: 12px') && source.includes('line-height: 18px')) {
    console.log(`${colors.green}  ✓ sm typography: 12px/18px${colors.reset}`);
  } else {
    errors.push('Missing sm typography: 12px/18px');
  }

  if (source.includes('font-size: 14px') && source.includes('line-height: 20px')) {
    console.log(`${colors.green}  ✓ md/lg typography: 14px/20px${colors.reset}`);
  } else {
    errors.push('Missing md/lg typography: 14px/20px');
  }

  if (source.includes('font-weight: 500')) {
    console.log(`${colors.green}  ✓ font-weight: 500 (Medium)${colors.reset}`);
  } else {
    errors.push('Missing font-weight: 500');
  }

  // 6. Validate border-radius
  console.log(`\n${colors.cyan}Checking border-radius...${colors.reset}`);
  if (source.includes('9999px')) {
    console.log(`${colors.green}  ✓ Pill shape border-radius: 9999px${colors.reset}`);
  } else {
    errors.push('Missing pill shape border-radius (9999px)');
  }

  // 7. Validate LIT decorators
  console.log(`\n${colors.cyan}Checking LIT decorators...${colors.reset}`);

  if (source.includes("@customElement('kds-badge')")) {
    console.log(`${colors.green}  ✓ Custom element registered as kds-badge${colors.reset}`);
  } else {
    errors.push('Component not registered as kds-badge custom element');
  }

  if (source.includes('@property') && source.includes('reflect: true')) {
    console.log(`${colors.green}  ✓ Properties use @property with reflect${colors.reset}`);
  } else {
    warnings.push('Not all properties reflect to DOM attributes');
  }

  // 8. Check component class
  if (source.includes('class KdsBadge extends LitElement')) {
    console.log(`${colors.green}  ✓ KdsBadge extends LitElement${colors.reset}`);
  } else {
    errors.push('Component must extend LitElement');
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
  };
}

function main() {
  const result = validateBadgeContract();

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Summary\n');

  if (result.warnings.length > 0) {
    console.log(`${colors.yellow}Warnings (${result.warnings.length}):${colors.reset}`);
    result.warnings.forEach((w, i) => {
      console.log(`${colors.yellow}  ${i + 1}. ${w}${colors.reset}`);
    });
    console.log('');
  }

  if (!result.passed) {
    console.log(`${colors.red}ERRORS (${result.errors.length}):${colors.reset}`);
    result.errors.forEach((e, i) => {
      console.log(`${colors.red}  ${i + 1}. ${e}${colors.reset}`);
    });
    console.log(`\n${colors.red}VALIDATION FAILED${colors.reset}\n`);
    process.exit(1);
  } else {
    console.log(`${colors.green}VALIDATION PASSED${colors.reset}\n`);
    console.log(`${colors.green}Badge component matches Figma contract (SSOT)${colors.reset}\n`);
    process.exit(0);
  }
}

main();
