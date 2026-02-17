#!/usr/bin/env tsx
/**
 * Validation script for Tooltip component contract
 * Compares kds-tooltip.ts implementation against tooltip.figma-contract.ts
 *
 * @usage: tsx scripts/validate-tooltip-contract.ts
 * @returns: Exit code 0 if valid, 1 if validation fails
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import {
  FIGMA_TOOLTIP_CONTRACT
} from '../.figma/tooltip.figma-contract.js';

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

  // Extract TooltipTheme type definition
  const themeTypeRegex = /export type TooltipTheme = ([^;]+);/;
  const themeMatch = fileContent.match(themeTypeRegex);
  if (themeMatch) {
    properties._tooltipThemeValues = themeMatch[1]
      .split('|')
      .map(v => v.trim().replace(/['"]/g, ''));
  }

  // Extract TooltipArrow type definition
  const arrowTypeRegex = /export type TooltipArrow\s*=\s*([\s\S]*?);/;
  const arrowMatch = fileContent.match(arrowTypeRegex);
  if (arrowMatch) {
    properties._tooltipArrowValues = arrowMatch[1]
      .split('|')
      .map(v => v.trim().replace(/['"]/g, ''))
      .filter(v => v.length > 0);
  }

  // Check for role="tooltip"
  properties._hasRoleTooltip = fileContent.includes('role="tooltip"');

  // Check for CSS token usage
  properties._usesTokens = {
    'white': fileContent.includes('#FFFFFF') || fileContent.includes('color-white'),
    'gray-700': fileContent.includes('#414651') || fileContent.includes('gray-700'),
    'gray-600': fileContent.includes('#535862') || fileContent.includes('gray-600'),
    'gray-900': fileContent.includes('#181D27') || fileContent.includes('gray-900'),
    'shadow-lg': fileContent.includes('rgba(10, 13, 18') || fileContent.includes('shadow'),
  };

  // Check border radius
  properties._hasBorderRadius = fileContent.includes('8px');

  // Check typography
  properties._hasTypography = {
    titleSize: fileContent.includes('12px'),
    titleWeight: fileContent.includes('600'),
    titleLineHeight: fileContent.includes('18px'),
    supportingWeight: fileContent.includes('400'),
  };

  // Check spacing
  properties._hasSpacing = {
    simplePadding: fileContent.includes('8px') && fileContent.includes('12px'),
    supportingPadding: fileContent.includes('12px'),
    textGap: fileContent.includes('4px'),
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

  // Validate properties from contract
  console.log(`${colors.cyan}✅ Checking properties from Figma contract:${colors.reset}\n`);

  // Check: theme property
  if (!componentProps.theme) {
    result.errors.push('Missing property: theme');
    result.valid = false;
  } else {
    console.log(`  ✓ theme: ${componentProps.theme.type} (default: ${componentProps.theme.default})`);

    if (componentProps.theme.default !== FIGMA_TOOLTIP_CONTRACT.properties.theme.default) {
      result.errors.push(
        `theme default value mismatch. Expected: "${FIGMA_TOOLTIP_CONTRACT.properties.theme.default}", Got: "${componentProps.theme.default}"`
      );
      result.valid = false;
    }

    const contractThemes = FIGMA_TOOLTIP_CONTRACT.properties.theme.values as readonly string[];
    const componentThemes = componentProps._tooltipThemeValues || [];

    const missingThemes = contractThemes.filter((s: string) => !componentThemes.includes(s));
    const extraThemes = componentThemes.filter((s: string) => !contractThemes.includes(s));

    if (missingThemes.length > 0) {
      result.errors.push(`theme: missing values from contract: ${missingThemes.join(', ')}`);
      result.valid = false;
    }
    if (extraThemes.length > 0) {
      result.warnings.push(`theme: extra values not in contract: ${extraThemes.join(', ')}`);
    }
  }

  // Check: arrow property
  if (!componentProps.arrow) {
    result.errors.push('Missing property: arrow');
    result.valid = false;
  } else {
    console.log(`  ✓ arrow: ${componentProps.arrow.type} (default: ${componentProps.arrow.default})`);

    if (componentProps.arrow.default !== FIGMA_TOOLTIP_CONTRACT.properties.arrow.default) {
      result.errors.push(
        `arrow default value mismatch. Expected: "${FIGMA_TOOLTIP_CONTRACT.properties.arrow.default}", Got: "${componentProps.arrow.default}"`
      );
      result.valid = false;
    }

    const contractArrows = FIGMA_TOOLTIP_CONTRACT.properties.arrow.values as readonly string[];
    const componentArrows = componentProps._tooltipArrowValues || [];

    const missingArrows = contractArrows.filter((s: string) => !componentArrows.includes(s));
    const extraArrows = componentArrows.filter((s: string) => !contractArrows.includes(s));

    if (missingArrows.length > 0) {
      result.errors.push(`arrow: missing values from contract: ${missingArrows.join(', ')}`);
      result.valid = false;
    }
    if (extraArrows.length > 0) {
      result.warnings.push(`arrow: extra values not in contract: ${extraArrows.join(', ')}`);
    }
  }

  // Check: text property
  if (componentProps.text) {
    console.log(`  ✓ text: ${componentProps.text.type}`);
  } else {
    result.warnings.push('No text property found (may use slot only)');
  }

  // Check: supportingText property
  if (componentProps.supportingText) {
    console.log(`  ✓ supportingText: ${componentProps.supportingText.type}`);
  } else {
    result.warnings.push('No supportingText property found (may use slot only)');
  }

  console.log();

  // Validate ARIA / Accessibility
  console.log(`${colors.cyan}♿ Checking accessibility requirements:${colors.reset}\n`);

  if (componentProps._hasRoleTooltip) {
    console.log(`  ✓ role="tooltip" present`);
  } else {
    result.errors.push('Missing role="tooltip" on tooltip element');
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

  // Validate typography
  console.log(`${colors.cyan}📐 Checking Figma typography:${colors.reset}\n`);

  const typo = componentProps._hasTypography || {};
  if (typo.titleSize) console.log(`  ✓ Title font-size: 12px`);
  else { result.errors.push('Title font-size 12px not found'); result.valid = false; }

  if (typo.titleWeight) console.log(`  ✓ Title font-weight: 600 (SemiBold)`);
  else { result.errors.push('Title font-weight 600 not found'); result.valid = false; }

  if (typo.titleLineHeight) console.log(`  ✓ Title line-height: 18px`);
  else { result.errors.push('Title line-height 18px not found'); result.valid = false; }

  if (typo.supportingWeight) console.log(`  ✓ Supporting font-weight: 400 (Regular)`);
  else { result.errors.push('Supporting font-weight 400 not found'); result.valid = false; }

  console.log();

  // Validate spacing
  console.log(`${colors.cyan}📏 Checking Figma spacing:${colors.reset}\n`);

  const spacing = componentProps._hasSpacing || {};
  if (spacing.simplePadding) console.log(`  ✓ Simple padding: 8px 12px`);
  else { result.errors.push('Simple padding (8px 12px) not found'); result.valid = false; }

  if (spacing.supportingPadding) console.log(`  ✓ Supporting padding: 12px`);
  else { result.errors.push('Supporting padding (12px) not found'); result.valid = false; }

  if (spacing.textGap) console.log(`  ✓ Text gap: 4px`);
  else { result.errors.push('Text gap (4px) not found'); result.valid = false; }

  if (componentProps._hasBorderRadius) console.log(`  ✓ Border radius: 8px`);
  else { result.errors.push('Border radius (8px) not found'); result.valid = false; }

  console.log();

  // Web-specific properties
  console.log(`${colors.cyan}ℹ️  Web-specific properties (optional, not in Figma contract):${colors.reset}\n`);

  if (componentProps.text) {
    console.log(`  • text: ${componentProps.text.type}`);
  }
  if (componentProps.supportingText) {
    console.log(`  • supportingText: ${componentProps.supportingText.type}`);
  }
  console.log();

  return result;
}

/**
 * Main validation function
 */
function main() {
  console.log(`${colors.blue}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║  Tooltip Component Contract Validation                    ║${colors.reset}`);
  console.log(`${colors.blue}║  Figma SSOT → LIT Component Implementation                ║${colors.reset}`);
  console.log(`${colors.blue}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  // Display contract metadata
  console.log(`${colors.cyan}📄 Contract Information:${colors.reset}`);
  console.log(`  Figma Component: ${FIGMA_TOOLTIP_CONTRACT.componentName}`);
  console.log(`  Component ID: ${FIGMA_TOOLTIP_CONTRACT.componentId}`);
  console.log(`  Figma File ID: ${FIGMA_TOOLTIP_CONTRACT.figmaFileId}`);
  console.log(`  Contract Version: ${FIGMA_TOOLTIP_CONTRACT.version}`);
  console.log(`  Extracted At: ${FIGMA_TOOLTIP_CONTRACT.extractedAt}\n`);

  // Validate component
  const componentPath = resolve(__dirname, '../packages/web-components/src/components/kds-tooltip.ts');
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
