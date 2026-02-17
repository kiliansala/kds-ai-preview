#!/usr/bin/env tsx
/**
 * Validation script for Button component contract
 * Compares kds-button.ts implementation against button.figma-contract.ts
 *
 * @usage: tsx scripts/validate-button-contract.ts
 * @returns: Exit code 0 if valid, 1 if validation fails
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { FIGMA_BUTTON_CONTRACT } from '../.figma/button.figma-contract.js';
// Terminal colors for output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};
/**
 * Extract component properties by parsing the TypeScript file
 * This is a simple regex-based extraction for the PoC
 */
function extractComponentProperties(filePath) {
    const fileContent = readFileSync(filePath, 'utf-8');
    const properties = {};
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
    const sizeTypeRegex = /export type ButtonSize = ([^;]+);/;
    const sizeMatch = fileContent.match(sizeTypeRegex);
    if (sizeMatch) {
        properties._buttonSizeValues = sizeMatch[1]
            .split('|')
            .map(v => v.trim().replace(/['"]/g, ''));
    }
    const hierarchyTypeRegex = /export type ButtonHierarchy =\s*\n?\s*\|?\s*([^;]+);/s;
    const hierarchyMatch = fileContent.match(hierarchyTypeRegex);
    if (hierarchyMatch) {
        properties._buttonHierarchyValues = hierarchyMatch[1]
            .split('|')
            .map(v => v.trim().replace(/['"]/g, ''))
            .filter(v => v);
    }
    const iconTypeRegex = /export type IconPosition = ([^;]+);/;
    const iconMatch = fileContent.match(iconTypeRegex);
    if (iconMatch) {
        properties._iconPositionValues = iconMatch[1]
            .split('|')
            .map(v => v.trim().replace(/['"]/g, ''));
    }
    return properties;
}
/**
 * Validate that component properties match the Figma contract
 */
function validateComponent(componentPath) {
    const result = {
        valid: true,
        errors: [],
        warnings: []
    };
    console.log(`${colors.blue}📋 Validating component:${colors.reset} ${componentPath}\n`);
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
    }
    else {
        console.log(`  ✓ size: ${componentProps.size.type} (default: ${componentProps.size.default})`);
        // Validate default value
        if (componentProps.size.default !== FIGMA_BUTTON_CONTRACT.properties.size.default) {
            result.errors.push(`size default value mismatch. Expected: "${FIGMA_BUTTON_CONTRACT.properties.size.default}", Got: "${componentProps.size.default}"`);
            result.valid = false;
        }
        // Validate allowed values
        const contractSizes = FIGMA_BUTTON_CONTRACT.properties.size.values;
        const componentSizes = componentProps._buttonSizeValues || [];
        const missingSizes = contractSizes.filter((s) => !componentSizes.includes(s));
        const extraSizes = componentSizes.filter((s) => !contractSizes.includes(s));
        if (missingSizes.length > 0) {
            result.errors.push(`size: missing values from contract: ${missingSizes.join(', ')}`);
            result.valid = false;
        }
        if (extraSizes.length > 0) {
            result.warnings.push(`size: extra values not in contract: ${extraSizes.join(', ')}`);
        }
    }
    // Check: hierarchy property
    if (!componentProps.hierarchy) {
        result.errors.push('Missing required property: hierarchy');
        result.valid = false;
    }
    else {
        console.log(`  ✓ hierarchy: ${componentProps.hierarchy.type} (default: ${componentProps.hierarchy.default})`);
        // Validate default value
        if (componentProps.hierarchy.default !== FIGMA_BUTTON_CONTRACT.properties.hierarchy.default) {
            result.errors.push(`hierarchy default value mismatch. Expected: "${FIGMA_BUTTON_CONTRACT.properties.hierarchy.default}", Got: "${componentProps.hierarchy.default}"`);
            result.valid = false;
        }
        // Validate allowed values
        const contractHierarchies = FIGMA_BUTTON_CONTRACT.properties.hierarchy.values;
        const componentHierarchies = componentProps._buttonHierarchyValues || [];
        const missingHierarchies = contractHierarchies.filter((h) => !componentHierarchies.includes(h));
        const extraHierarchies = componentHierarchies.filter((h) => !contractHierarchies.includes(h));
        if (missingHierarchies.length > 0) {
            result.errors.push(`hierarchy: missing values from contract: ${missingHierarchies.join(', ')}`);
            result.valid = false;
        }
        if (extraHierarchies.length > 0) {
            result.warnings.push(`hierarchy: extra values not in contract: ${extraHierarchies.join(', ')}`);
        }
    }
    // Check: iconPosition property
    if (!componentProps.iconPosition) {
        result.errors.push('Missing required property: iconPosition');
        result.valid = false;
    }
    else {
        console.log(`  ✓ iconPosition: ${componentProps.iconPosition.type} (default: ${componentProps.iconPosition.default})`);
        // Validate default value
        if (componentProps.iconPosition.default !== FIGMA_BUTTON_CONTRACT.properties.iconPosition.default) {
            result.errors.push(`iconPosition default value mismatch. Expected: "${FIGMA_BUTTON_CONTRACT.properties.iconPosition.default}", Got: "${componentProps.iconPosition.default}"`);
            result.valid = false;
        }
        // Validate allowed values
        const contractPositions = FIGMA_BUTTON_CONTRACT.properties.iconPosition.values;
        const componentPositions = componentProps._iconPositionValues || [];
        const missingPositions = contractPositions.filter((p) => !componentPositions.includes(p));
        const extraPositions = componentPositions.filter((p) => !contractPositions.includes(p));
        if (missingPositions.length > 0) {
            result.errors.push(`iconPosition: missing values from contract: ${missingPositions.join(', ')}`);
            result.valid = false;
        }
        if (extraPositions.length > 0) {
            result.warnings.push(`iconPosition: extra values not in contract: ${extraPositions.join(', ')}`);
        }
    }
    // Check: destructive property
    if (!componentProps.destructive) {
        result.errors.push('Missing required property: destructive');
        result.valid = false;
    }
    else {
        console.log(`  ✓ destructive: ${componentProps.destructive.type} (default: ${componentProps.destructive.default})`);
        // Validate type (allow "inferred" if default is boolean)
        const isBoolean = componentProps.destructive.type.includes('Boolean') ||
            componentProps.destructive.type.includes('boolean') ||
            (componentProps.destructive.type === 'inferred' &&
                (componentProps.destructive.default === 'false' || componentProps.destructive.default === 'true'));
        if (!isBoolean) {
            result.errors.push(`destructive: Expected boolean type, got ${componentProps.destructive.type}`);
            result.valid = false;
        }
        // Validate default value
        const expectedDefault = String(FIGMA_BUTTON_CONTRACT.properties.destructive.default);
        if (componentProps.destructive.default !== expectedDefault) {
            result.errors.push(`destructive default value mismatch. Expected: ${expectedDefault}, Got: ${componentProps.destructive.default}`);
            result.valid = false;
        }
    }
    console.log();
    // Optional properties (web-specific, not in Figma)
    console.log(`${colors.cyan}ℹ️  Web-specific properties (optional, not in Figma contract):${colors.reset}\n`);
    if (componentProps.disabled) {
        console.log(`  • disabled: ${componentProps.disabled.type} (default: ${componentProps.disabled.default})`);
    }
    if (componentProps.type) {
        console.log(`  • type: ${componentProps.type.type} (default: ${componentProps.type.default})`);
    }
    if (componentProps.ariaLabel) {
        console.log(`  • ariaLabel: ${componentProps.ariaLabel.type} (default: ${componentProps.ariaLabel.default})`);
    }
    console.log();
    return result;
}
/**
 * Main validation function
 */
function main() {
    console.log(`${colors.blue}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.blue}║  Button Component Contract Validation                     ║${colors.reset}`);
    console.log(`${colors.blue}║  Figma SSOT → LIT Component Implementation                ║${colors.reset}`);
    console.log(`${colors.blue}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);
    // Display contract metadata
    console.log(`${colors.cyan}📄 Contract Information:${colors.reset}`);
    console.log(`  Figma Component: ${FIGMA_BUTTON_CONTRACT.componentName}`);
    console.log(`  Component ID: ${FIGMA_BUTTON_CONTRACT.componentId}`);
    console.log(`  Figma File ID: ${FIGMA_BUTTON_CONTRACT.figmaFileId}`);
    console.log(`  Contract Version: ${FIGMA_BUTTON_CONTRACT.version}`);
    console.log(`  Extracted At: ${FIGMA_BUTTON_CONTRACT.extractedAt}\n`);
    // Validate component
    const componentPath = resolve(__dirname, '../packages/web-components/src/components/kds-button.ts');
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
    }
    else {
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
// Run validation
main();
//# sourceMappingURL=validate-button-contract.js.map