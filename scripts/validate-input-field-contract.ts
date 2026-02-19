/**
 * Contract Validation for Input Field Component
 *
 * Validates that kds-input-field implements all properties defined in the Figma contract.
 *
 * Usage: tsx scripts/validate-input-field-contract.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  red:     '\x1b[31m',
  green:   '\x1b[32m',
  yellow:  '\x1b[33m',
  magenta: '\x1b[35m',
  cyan:    '\x1b[36m',
  reset:   '\x1b[0m',
};

interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
}

function validateInputFieldContract(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  console.log(`${colors.cyan}Input Field Component - Contract Validation${colors.reset}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // ─── 1. Files ────────────────────────────────────────────────────────────────
  const contractPath = path.join(__dirname, '../.figma/input-field.figma-contract.json');
  if (!fs.existsSync(contractPath)) {
    errors.push('Contract file not found: .figma/input-field.figma-contract.json');
    return { passed: false, errors, warnings };
  }
  const contract = JSON.parse(fs.readFileSync(contractPath, 'utf-8'));
  console.log(`${colors.green}  ✓ Contract file found${colors.reset}`);

  const componentPath = path.join(__dirname, '../packages/web-components/src/components/kds-input-field.ts');
  if (!fs.existsSync(componentPath)) {
    errors.push('Component file not found: packages/web-components/src/components/kds-input-field.ts');
    return { passed: false, errors, warnings };
  }
  const source = fs.readFileSync(componentPath, 'utf-8');
  console.log(`${colors.green}  ✓ Component file found${colors.reset}\n`);

  // ─── 2. Custom element registration ──────────────────────────────────────────
  console.log(`${colors.cyan}Checking LIT registration...${colors.reset}`);

  if (source.includes("@customElement('kds-input-field')")) {
    console.log(`${colors.green}  ✓ Registered as kds-input-field${colors.reset}`);
  } else {
    errors.push('Component not registered as kds-input-field custom element');
  }

  if (source.includes('class KdsInputField extends LitElement')) {
    console.log(`${colors.green}  ✓ KdsInputField extends LitElement${colors.reset}`);
  } else {
    errors.push('Component must extend LitElement');
  }

  // ─── 3. Required props from contract ─────────────────────────────────────────
  console.log(`\n${colors.cyan}Checking required properties...${colors.reset}`);

  const requiredProps: Array<{ prop: string; searchStr: string; label: string }> = [
    { prop: 'type',        searchStr: "type: InputFieldType",         label: 'type (InputFieldType)' },
    { prop: 'label',       searchStr: "label: string",                label: 'label: string' },
    { prop: 'hint',        searchStr: "hint: string",                  label: 'hint: string' },
    { prop: 'placeholder', searchStr: "placeholder: string",          label: 'placeholder: string' },
    { prop: 'value',       searchStr: "value: string",                 label: 'value: string' },
    { prop: 'name',        searchStr: "name: string",                  label: 'name: string' },
    { prop: 'inputType',   searchStr: "inputType: string",             label: 'inputType: string' },
    { prop: 'destructive', searchStr: "destructive: boolean",          label: 'destructive: boolean' },
    { prop: 'disabled',    searchStr: "disabled: boolean",             label: 'disabled: boolean' },
    { prop: 'leadingIcon', searchStr: "leadingIcon: boolean",          label: 'leadingIcon: boolean' },
    { prop: 'helpIcon',    searchStr: "helpIcon: boolean",             label: 'helpIcon: boolean' },
    { prop: 'leadingText', searchStr: "leadingText: string",           label: 'leadingText: string' },
    { prop: 'required',    searchStr: "required: boolean",             label: 'required: boolean' },
  ];

  for (const { searchStr, label } of requiredProps) {
    if (source.includes(searchStr)) {
      console.log(`${colors.green}  ✓ ${label}${colors.reset}`);
    } else {
      errors.push(`Missing property: ${label}`);
    }
  }

  // ─── 4. Type variants ─────────────────────────────────────────────────────────
  console.log(`\n${colors.cyan}Checking type variants...${colors.reset}`);

  const typeVariants = ['default', 'leading-dropdown', 'trailing-dropdown', 'leading-text', 'payment'];
  for (const variant of typeVariants) {
    if (source.includes(`'${variant}'`)) {
      console.log(`${colors.green}  ✓ type="${variant}"${colors.reset}`);
    } else {
      warnings.push(`Type variant "${variant}" not found in source - may not be implemented yet`);
    }
  }

  // ─── 5. Events ────────────────────────────────────────────────────────────────
  console.log(`\n${colors.cyan}Checking custom events...${colors.reset}`);

  const events = [
    { name: 'kds-input',      label: 'kds-input (value change)' },
    { name: 'kds-change',     label: 'kds-change (blur after change)' },
    { name: 'kds-help-click', label: 'kds-help-click (help icon clicked)' },
  ];

  for (const { name, label } of events) {
    if (source.includes(`'${name}'`)) {
      console.log(`${colors.green}  ✓ Event: ${label}${colors.reset}`);
    } else {
      errors.push(`Missing event: ${name}`);
    }
  }

  // ─── 6. Slots ─────────────────────────────────────────────────────────────────
  console.log(`\n${colors.cyan}Checking slots...${colors.reset}`);

  const slots = [
    { name: 'leading-icon',        label: 'slot="leading-icon"' },
    { name: 'leading-dropdown',    label: 'slot="leading-dropdown"' },
    { name: 'trailing-dropdown',   label: 'slot="trailing-dropdown"' },
  ];

  for (const { name, label } of slots) {
    if (source.includes(`name="${name}"`) || source.includes(`slot="${name}"`)) {
      console.log(`${colors.green}  ✓ ${label}${colors.reset}`);
    } else {
      warnings.push(`Slot "${name}" not found in source`);
    }
  }

  // ─── 7. Design tokens ─────────────────────────────────────────────────────────
  console.log(`\n${colors.cyan}Checking design tokens...${colors.reset}`);

  const tokens = contract.designTokens;

  // Borders
  const borderChecks = [
    { token: tokens.borders.default,     label: 'Border default (#D5D7DA)' },
    { token: tokens.borders.focused,     label: 'Border focused (#D6BBFB)' },
    { token: tokens.borders.destructive, label: 'Border destructive (#FDA29B)' },
  ];
  for (const { token, label } of borderChecks) {
    const hex = token.toLowerCase();
    if (source.toLowerCase().includes(hex)) {
      console.log(`${colors.green}  ✓ ${label}${colors.reset}`);
    } else {
      warnings.push(`${label} token not found inline — may use CSS custom property`);
    }
  }

  // Focus ring
  const focusRing = tokens.shadows.focused;
  if (source.includes('#F4EBFF')) {
    console.log(`${colors.green}  ✓ Focus ring Brand/100 (#F4EBFF)${colors.reset}`);
  } else {
    warnings.push('Focus ring Brand/100 (#F4EBFF) not found');
  }

  if (source.includes('#FEF3F2')) {
    console.log(`${colors.green}  ✓ Focus ring Error/100 (#FEF3F2) for destructive${colors.reset}`);
  } else {
    warnings.push('Destructive focus ring Error/100 (#FEF3F2) not found');
  }

  // Text colors
  const textChecks = [
    { token: tokens.text.placeholder, label: 'Placeholder text (#717680)' },
    { token: tokens.text.value,       label: 'Value text (#181D27)' },
    { token: tokens.text.label,       label: 'Label text (#414651)' },
    { token: tokens.text.hint,        label: 'Hint text (#535862)' },
  ];
  for (const { token, label } of textChecks) {
    if (source.toLowerCase().includes(token.toLowerCase())) {
      console.log(`${colors.green}  ✓ ${label}${colors.reset}`);
    } else {
      warnings.push(`${label} token not found inline`);
    }
  }

  // ─── 8. Typography ────────────────────────────────────────────────────────────
  console.log(`\n${colors.cyan}Checking typography...${colors.reset}`);

  if (source.includes('font-size: 16px') && source.includes('line-height: 24px')) {
    console.log(`${colors.green}  ✓ Input typography: 16px/24px (Text md/Regular)${colors.reset}`);
  } else {
    errors.push('Missing input typography: 16px/24px');
  }

  if (source.includes('font-size: 14px') && source.includes('line-height: 20px')) {
    console.log(`${colors.green}  ✓ Label/hint typography: 14px/20px${colors.reset}`);
  } else {
    errors.push('Missing label/hint typography: 14px/20px');
  }

  if (source.includes('font-weight: 500')) {
    console.log(`${colors.green}  ✓ Label font-weight: 500 (Medium)${colors.reset}`);
  } else {
    errors.push('Missing label font-weight: 500');
  }

  // ─── 9. Spacing & geometry ────────────────────────────────────────────────────
  console.log(`\n${colors.cyan}Checking spacing & geometry...${colors.reset}`);

  if (source.includes('border-radius: 8px')) {
    console.log(`${colors.green}  ✓ Border radius: 8px${colors.reset}`);
  } else {
    errors.push('Missing border-radius: 8px');
  }

  if (source.includes('padding: 10px 14px') || (source.includes('14px') && source.includes('10px'))) {
    console.log(`${colors.green}  ✓ Input padding: 10px 14px${colors.reset}`);
  } else {
    warnings.push('Input padding (10px 14px) not explicitly found');
  }

  if (source.includes('gap: 6px')) {
    console.log(`${colors.green}  ✓ Field gap: 6px (between label/input/hint)${colors.reset}`);
  } else {
    warnings.push('Field gap: 6px not found');
  }

  // ─── 10. States ───────────────────────────────────────────────────────────────
  console.log(`\n${colors.cyan}Checking visual states...${colors.reset}`);

  const stateChecks = [
    { pattern: ':focus-within',    label: 'Focused state (:focus-within)' },
    { pattern: 'disabled',         label: 'Disabled state' },
    { pattern: 'destructive',      label: 'Destructive/error state' },
    { pattern: '::placeholder',    label: 'Placeholder pseudo-element styling' },
  ];

  for (const { pattern, label } of stateChecks) {
    if (source.includes(pattern)) {
      console.log(`${colors.green}  ✓ ${label}${colors.reset}`);
    } else {
      errors.push(`Missing state: ${label}`);
    }
  }

  // ─── 11. Native input element ─────────────────────────────────────────────────
  console.log(`\n${colors.cyan}Checking native input...${colors.reset}`);

  if (source.includes('<input') && source.includes('part="input"')) {
    console.log(`${colors.green}  ✓ Native <input> element with part="input"${colors.reset}`);
  } else if (source.includes('<input')) {
    console.log(`${colors.green}  ✓ Native <input> element found${colors.reset}`);
    warnings.push('Native <input> should have part="input" for CSS ::part styling');
  } else {
    errors.push('Missing native <input> element');
  }

  return { passed: errors.length === 0, errors, warnings };
}

function main() {
  const result = validateInputFieldContract();

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
    console.log(`${colors.green}Input Field component matches Figma contract (SSOT)${colors.reset}\n`);
    process.exit(0);
  }
}

main();
