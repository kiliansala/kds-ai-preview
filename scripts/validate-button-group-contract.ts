/**
 * Contract Validation for Button Group Component
 *
 * Validates that kds-button-group and kds-button-group-item implement
 * all properties defined in the Figma contract.
 *
 * Usage: tsx scripts/validate-button-group-contract.ts
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

function validateButtonGroupContract(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  console.log(`${colors.cyan}Button Group Component - Contract Validation${colors.reset}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // 1. Read contract
  const contractPath = path.join(__dirname, '../.figma/button-group.figma-contract.json');
  if (!fs.existsSync(contractPath)) {
    errors.push('Contract file not found: .figma/button-group.figma-contract.json');
    return { passed: false, errors, warnings };
  }

  const contract = JSON.parse(fs.readFileSync(contractPath, 'utf-8'));
  console.log(`${colors.green}  ✓ Contract file found${colors.reset}`);

  // 2. Read component source
  const componentPath = path.join(__dirname, '../packages/web-components/src/components/kds-button-group.ts');
  if (!fs.existsSync(componentPath)) {
    errors.push('Component file not found: packages/web-components/src/components/kds-button-group.ts');
    return { passed: false, errors, warnings };
  }

  const source = fs.readFileSync(componentPath, 'utf-8');
  console.log(`${colors.green}  ✓ Component file found${colors.reset}\n`);

  // 3. Validate container component
  console.log(`${colors.cyan}Checking container component (kds-button-group)...${colors.reset}`);

  if (source.includes("@customElement('kds-button-group')")) {
    console.log(`${colors.green}  ✓ Custom element registered as kds-button-group${colors.reset}`);
  } else {
    errors.push('Container not registered as kds-button-group custom element');
  }

  if (source.includes('class KdsButtonGroup extends LitElement')) {
    console.log(`${colors.green}  ✓ KdsButtonGroup extends LitElement${colors.reset}`);
  } else {
    errors.push('Container must extend LitElement');
  }

  if (source.includes('role="group"')) {
    console.log(`${colors.green}  ✓ Container has role="group"${colors.reset}`);
  } else {
    errors.push('Container missing role="group"');
  }

  if (source.includes('border-radius: 8px')) {
    console.log(`${colors.green}  ✓ Border radius: 8px${colors.reset}`);
  } else {
    errors.push('Missing border-radius: 8px');
  }

  if (source.includes('overflow: hidden')) {
    console.log(`${colors.green}  ✓ Overflow hidden (clip corners)${colors.reset}`);
  } else {
    errors.push('Missing overflow: hidden');
  }

  if (source.includes('box-shadow')) {
    console.log(`${colors.green}  ✓ Box shadow applied${colors.reset}`);
  } else {
    errors.push('Missing box-shadow');
  }

  // 4. Validate item component
  console.log(`\n${colors.cyan}Checking item component (kds-button-group-item)...${colors.reset}`);

  if (source.includes("@customElement('kds-button-group-item')")) {
    console.log(`${colors.green}  ✓ Custom element registered as kds-button-group-item${colors.reset}`);
  } else {
    errors.push('Item not registered as kds-button-group-item custom element');
  }

  if (source.includes('class KdsButtonGroupItem extends LitElement')) {
    console.log(`${colors.green}  ✓ KdsButtonGroupItem extends LitElement${colors.reset}`);
  } else {
    errors.push('Item must extend LitElement');
  }

  // 5. Validate item properties
  console.log(`\n${colors.cyan}Checking item properties...${colors.reset}`);

  // selected
  if (source.includes('selected') && source.includes('@property')) {
    console.log(`${colors.green}  ✓ selected property found${colors.reset}`);
  } else {
    errors.push('Missing property: selected');
  }

  // icon
  if (source.includes("icon: ButtonGroupItemIcon = 'none'") || source.includes('icon: ButtonGroupItemIcon')) {
    console.log(`${colors.green}  ✓ icon property found${colors.reset}`);

    const iconValues = contract.components.buttonGroupItem.properties.icon.values;
    for (const val of iconValues) {
      if (source.includes(`'${val}'`)) {
        console.log(`${colors.green}    ✓ icon="${val}" supported${colors.reset}`);
      } else {
        errors.push(`Missing icon variant: "${val}"`);
      }
    }
  } else {
    errors.push('Missing property: icon');
  }

  // disabled
  if (source.includes('disabled') && source.includes('Boolean')) {
    console.log(`${colors.green}  ✓ disabled property found${colors.reset}`);
  } else {
    errors.push('Missing property: disabled');
  }

  // 6. Validate design tokens
  console.log(`\n${colors.cyan}Checking design tokens...${colors.reset}`);

  const tokens = contract.designTokens;

  if (source.includes(tokens.colors.background) || source.includes('#FFFFFF')) {
    console.log(`${colors.green}  ✓ Background color: ${tokens.colors.background}${colors.reset}`);
  } else {
    warnings.push(`Background color ${tokens.colors.background} not found inline`);
  }

  if (source.includes(tokens.colors.border) || source.includes('#D5D7DA')) {
    console.log(`${colors.green}  ✓ Border color: ${tokens.colors.border}${colors.reset}`);
  } else {
    errors.push(`Missing border color: ${tokens.colors.border}`);
  }

  if (source.includes(tokens.colors.text) || source.includes('#414651')) {
    console.log(`${colors.green}  ✓ Text color: ${tokens.colors.text}${colors.reset}`);
  } else {
    errors.push(`Missing text color: ${tokens.colors.text}`);
  }

  // 7. Validate typography
  console.log(`\n${colors.cyan}Checking typography...${colors.reset}`);

  if (source.includes('font-size: 14px')) {
    console.log(`${colors.green}  ✓ Font size: 14px${colors.reset}`);
  } else {
    errors.push('Missing font-size: 14px');
  }

  if (source.includes('line-height: 20px')) {
    console.log(`${colors.green}  ✓ Line height: 20px${colors.reset}`);
  } else {
    errors.push('Missing line-height: 20px');
  }

  if (source.includes('font-weight: 600')) {
    console.log(`${colors.green}  ✓ Font weight: 600 (Semi Bold)${colors.reset}`);
  } else {
    errors.push('Missing font-weight: 600');
  }

  // 8. Validate spacing
  console.log(`\n${colors.cyan}Checking spacing...${colors.reset}`);

  if (source.includes('padding: 10px 16px')) {
    console.log(`${colors.green}  ✓ Default padding: 10px 16px${colors.reset}`);
  } else {
    errors.push('Missing default padding: 10px 16px');
  }

  if (source.includes('padding: 10px 12px')) {
    console.log(`${colors.green}  ✓ Icon-only padding: 10px 12px${colors.reset}`);
  } else {
    errors.push('Missing icon-only padding: 10px 12px');
  }

  if (source.includes('gap: 8px')) {
    console.log(`${colors.green}  ✓ Icon gap: 8px${colors.reset}`);
  } else {
    errors.push('Missing gap: 8px');
  }

  // 9. Validate states
  console.log(`\n${colors.cyan}Checking states...${colors.reset}`);

  if (source.includes('.selected')) {
    console.log(`${colors.green}  ✓ Selected state CSS class${colors.reset}`);
  } else {
    errors.push('Missing selected state');
  }

  if (source.includes(':hover')) {
    console.log(`${colors.green}  ✓ Hover state${colors.reset}`);
  } else {
    errors.push('Missing hover state');
  }

  if (source.includes(':focus-visible')) {
    console.log(`${colors.green}  ✓ Focus-visible state${colors.reset}`);
  } else {
    errors.push('Missing focus-visible state');
  }

  if (source.includes('.disabled')) {
    console.log(`${colors.green}  ✓ Disabled state CSS class${colors.reset}`);
  } else {
    errors.push('Missing disabled state');
  }

  // 10. Check native button element
  console.log(`\n${colors.cyan}Checking semantic HTML...${colors.reset}`);

  if (source.includes('<button')) {
    console.log(`${colors.green}  ✓ Uses native <button> element for items${colors.reset}`);
  } else {
    errors.push('Items should use native <button> element');
  }

  if (source.includes('type="button"')) {
    console.log(`${colors.green}  ✓ type="button" set${colors.reset}`);
  } else {
    warnings.push('Set type="button" on item buttons');
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
  };
}

function main() {
  const result = validateButtonGroupContract();

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
    console.log(`${colors.green}Button Group component matches Figma contract (SSOT)${colors.reset}\n`);
    process.exit(0);
  }
}

main();
