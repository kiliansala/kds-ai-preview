/**
 * @package @kds/tokens
 * @description Design tokens extracted from Untitled UI (Figma) via MCP
 * @version 1.0.0
 * @extracted 2026-02-10
 */
import allTokens from './tokens.json';
import buttonTokens from './button-tokens.json';
// Export complete token structure
export const tokens = allTokens;
// Export by category for convenience
export const colors = allTokens.color;
export const typography = allTokens.typography;
export const shadows = allTokens.shadow;
export const components = allTokens.component;
// Export button-specific tokens
export const button = {
    ...allTokens.component.button,
    variants: buttonTokens.button.variants,
    metadata: buttonTokens.button.metadata
};
// Re-export metadata
export const metadata = allTokens.metadata;
// Default export
export default tokens;
//# sourceMappingURL=index.js.map