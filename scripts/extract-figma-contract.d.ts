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
export {};
//# sourceMappingURL=extract-figma-contract.d.ts.map