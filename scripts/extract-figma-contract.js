#!/usr/bin/env tsx
/**
 * Generic script to extract Figma component contracts via MCP
 *
 * Usage:
 *   tsx scripts/extract-figma-contract.ts <component-name> <node-id>
 *
 * Example:
 *   tsx scripts/extract-figma-contract.ts button 1038:34411
 *   tsx scripts/extract-figma-contract.ts input 1234:56789
 *
 * This script:
 * 1. Connects to Figma MCP server
 * 2. Extracts component design context using get_design_context
 * 3. Generates JSON contract file (.figma/<component>.figma-contract.json)
 * 4. Generates TypeScript interface (.figma/<component>.figma-contract.ts)
 */
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
/**
 * Main extraction function
 * Note: This is a template/placeholder. In a real implementation, this would:
 * 1. Use MCP client to call get_design_context
 * 2. Parse the response
 * 3. Generate contract files
 *
 * For now, this serves as documentation of the intended workflow.
 */
async function extractContract(options) {
    const { componentName, nodeId, figmaFileId } = options;
    console.log(`${colors.blue}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.blue}║  Figma Contract Extraction Tool                           ║${colors.reset}`);
    console.log(`${colors.blue}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);
    console.log(`${colors.cyan}Component:${colors.reset} ${componentName}`);
    console.log(`${colors.cyan}Node ID:${colors.reset} ${nodeId}`);
    if (figmaFileId) {
        console.log(`${colors.cyan}Figma File:${colors.reset} ${figmaFileId}`);
    }
    console.log();
    console.log(`${colors.yellow}⚠️  MANUAL STEP REQUIRED:${colors.reset}\n`);
    console.log(`This script is a template for the extraction workflow.`);
    console.log(`To extract the contract for ${componentName}:\n`);
    console.log(`1. Open Figma Desktop and select the ${componentName} component (node ${nodeId})`);
    console.log(`2. In Claude Code, use the Figma MCP tool:`);
    console.log(`   ${colors.cyan}mcp__figma-desktop__get_design_context({ nodeId: "${nodeId}" })${colors.reset}`);
    console.log(`3. Analyze the response and create:`);
    console.log(`   - ${colors.cyan}.figma/${componentName}.figma-contract.json${colors.reset} (JSON schema)`);
    console.log(`   - ${colors.cyan}.figma/${componentName}.figma-contract.ts${colors.reset} (TypeScript interfaces)`);
    console.log(`4. Create validation script:`);
    console.log(`   - ${colors.cyan}scripts/validate-${componentName}-contract.ts${colors.reset}`);
    console.log(`5. Update package.json with validation script\n`);
    console.log(`${colors.blue}📝 Contract files location:${colors.reset}`);
    console.log(`   JSON: ${resolve(__dirname, `../.figma/${componentName}.figma-contract.json`)}`);
    console.log(`   TS:   ${resolve(__dirname, `../.figma/${componentName}.figma-contract.ts`)}\n`);
    console.log(`${colors.green}💡 Tip:${colors.reset} Use the Button component files as a template:\n`);
    console.log(`   - .figma/button.figma-contract.json`);
    console.log(`   - .figma/button.figma-contract.ts`);
    console.log(`   - scripts/validate-button-contract.ts\n`);
}
/**
 * Parse command line arguments
 */
function parseArgs() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.error(`${colors.red}❌ Error: Missing required arguments${colors.reset}\n`);
        console.log(`Usage: tsx scripts/extract-figma-contract.ts <component-name> <node-id> [figma-file-id]\n`);
        console.log(`Examples:`);
        console.log(`  tsx scripts/extract-figma-contract.ts button 1038:34411`);
        console.log(`  tsx scripts/extract-figma-contract.ts input 1234:56789 CICp1MWc31lkvjX3jYo1rj\n`);
        return null;
    }
    return {
        componentName: args[0].toLowerCase(),
        nodeId: args[1],
        figmaFileId: args[2]
    };
}
/**
 * Main entry point
 */
async function main() {
    const options = parseArgs();
    if (!options) {
        process.exit(1);
    }
    await extractContract(options);
    console.log(`${colors.green}✅ Instructions displayed. Follow the steps above to complete the extraction.${colors.reset}\n`);
}
// Run
main().catch(error => {
    console.error(`${colors.red}❌ Error:${colors.reset}`, error);
    process.exit(1);
});
//# sourceMappingURL=extract-figma-contract.js.map