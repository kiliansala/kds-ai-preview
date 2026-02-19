/**
 * @script validate-docs-page
 * @description Validates that a component's Vite documentation page in index.html
 *              follows the Button standard: all sections, tabs, code blocks with copy
 *              buttons (icon + label), dynamic playground, design token swatches, etc.
 *
 * Usage:
 *   tsx scripts/validate-docs-page.ts <component-name>
 *   tsx scripts/validate-docs-page.ts button
 *   tsx scripts/validate-docs-page.ts input-field
 *
 * Exit codes:
 *   0 - All checks passed (warnings are OK)
 *   1 - One or more errors found
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

// ─── Config ──────────────────────────────────────────────────────────────────

const ROOT = resolve(import.meta.dirname, '..');
const HTML_PATH = resolve(ROOT, 'packages/web-components/index.html');
const JS_PATH = resolve(ROOT, 'packages/web-components/docs/app.js');

const REQUIRED_TABS = ['overview', 'variants', 'tokens', 'usage', 'api', 'accessibility'];
const REQUIRED_FRAMEWORKS = ['web-component', 'react', 'angular', 'blazor'];
const REQUIRED_API_TABLES = ['Properties', 'Events', 'Slots', 'CSS Custom Properties'];

// ─── Utilities ───────────────────────────────────────────────────────────────

type Severity = 'error' | 'warning' | 'pass';

interface Result {
  label: string;
  severity: Severity;
  detail?: string;
}

function toCamelCase(kebab: string): string {
  return kebab
    .split('-')
    .map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join('');
}

function toPascalCase(kebab: string): string {
  return kebab
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}

/** Extract the HTML block for a specific component section from index.html. */
function extractComponentSection(html: string, componentId: string): string | null {
  const startMarker = `id="component-${componentId}"`;
  const startIdx = html.indexOf(startMarker);
  if (startIdx === -1) return null;

  // Find where the next sibling component section starts (or end of file)
  const afterStart = html.indexOf('id="component-', startIdx + startMarker.length);
  return afterStart === -1
    ? html.slice(startIdx)
    : html.slice(startIdx, afterStart);
}

function countMatches(text: string, pattern: RegExp | string): number {
  if (typeof pattern === 'string') {
    let count = 0;
    let pos = 0;
    while ((pos = text.indexOf(pattern, pos)) !== -1) {
      count++;
      pos += pattern.length;
    }
    return count;
  }
  // Always use global flag so match() returns all occurrences, not just the first
  const global = pattern.flags.includes('g')
    ? pattern
    : new RegExp(pattern.source, pattern.flags + 'g');
  return (text.match(global) ?? []).length;
}

function has(text: string, pattern: string | RegExp): boolean {
  if (typeof pattern === 'string') return text.includes(pattern);
  return pattern.test(text);
}

// ─── Checks ──────────────────────────────────────────────────────────────────

function checkStructure(section: string, name: string): Result[] {
  const results: Result[] = [];

  results.push({
    label: 'Component section exists',
    severity: 'pass',
  });

  const hasTitle = has(section, 'docs-component-title');
  results.push({
    label: 'Component header: title (.docs-component-title)',
    severity: hasTitle ? 'pass' : 'error',
    detail: hasTitle ? undefined : 'Missing <h1 class="docs-component-title">',
  });

  const hasDesc = has(section, 'docs-component-description');
  results.push({
    label: 'Component header: description (.docs-component-description)',
    severity: hasDesc ? 'pass' : 'error',
    detail: hasDesc ? undefined : 'Missing <p class="docs-component-description">',
  });

  const hasStatus = has(section, 'docs-component-status');
  results.push({
    label: 'Component header: status badges (.docs-component-status)',
    severity: hasStatus ? 'pass' : 'warning',
    detail: hasStatus ? undefined : 'Missing <div class="docs-component-status"> with version/stable badges',
  });

  return results;
}

function checkTabs(section: string): Result[] {
  return REQUIRED_TABS.map(tab => {
    const present = has(section, `data-tab="${tab}"`);
    return {
      label: `Tab: ${tab}`,
      severity: present ? 'pass' : 'error',
      detail: present ? undefined : `Missing <button class="docs-tab" data-tab="${tab}">`,
    } as Result;
  });
}

function checkOverviewTab(section: string, componentId: string): Result[] {
  const results: Result[] = [];

  const hasQuickStart = has(section, 'Quick Start');
  results.push({
    label: 'Quick Start section present',
    severity: hasQuickStart ? 'pass' : 'error',
    detail: hasQuickStart ? undefined : 'Missing <h2>Quick Start</h2> in overview tab',
  });

  const hasPlayground = has(section, 'Playground');
  results.push({
    label: 'Playground section present',
    severity: hasPlayground ? 'pass' : 'error',
    detail: hasPlayground ? undefined : 'Missing <h2>Playground</h2> section',
  });

  const playgroundId = `id="playground-${componentId}"`;
  const hasPlaygroundEl = has(section, playgroundId);
  results.push({
    label: `Playground component element (id="playground-${componentId}")`,
    severity: hasPlaygroundEl ? 'pass' : 'error',
    detail: hasPlaygroundEl ? undefined : `Missing component with ${playgroundId}`,
  });

  const hasDynamicCode = has(section, 'docs-playground-controls');
  results.push({
    label: 'Playground controls present (.docs-playground-controls)',
    severity: hasDynamicCode ? 'pass' : 'error',
    detail: hasDynamicCode ? undefined : 'Missing <div class="docs-playground-controls">',
  });

  // Verify playground code block has an id= on its <code> element
  const playgroundCodeMatch = section.match(/<code[^>]+id="[^"]*playground[^"]*"/);
  results.push({
    label: 'Playground code block is dynamic (has id= on <code>)',
    severity: playgroundCodeMatch ? 'pass' : 'error',
    detail: playgroundCodeMatch ? undefined : 'Missing <code id="..."> in playground for dynamic code update',
  });

  return results;
}

function checkCodeBlocks(section: string): Result[] {
  const results: Result[] = [];

  const codeBlockCount = countMatches(section, 'class="docs-code-block"');
  const copyBtnCount = countMatches(section, 'class="docs-copy-button"');

  results.push({
    label: `Code blocks (${codeBlockCount}) match copy buttons (${copyBtnCount})`,
    severity: codeBlockCount === copyBtnCount && codeBlockCount > 0 ? 'pass' : 'error',
    detail:
      codeBlockCount !== copyBtnCount
        ? `Found ${codeBlockCount} .docs-code-block but ${copyBtnCount} .docs-copy-button — every code block must have a copy button`
        : codeBlockCount === 0
        ? 'No code blocks found at all'
        : undefined,
  });

  // All copy buttons must have an SVG icon.
  // We split on the opening <button tag and check if the next closing </button> block contains <svg.
  const copyBtnSvgCount = (() => {
    const parts = section.split('class="docs-copy-button"');
    // parts[0] is before the first button; each subsequent part starts just after the class attr
    let count = 0;
    for (let i = 1; i < parts.length; i++) {
      const closingIdx = parts[i].indexOf('</button>');
      const snippet = closingIdx !== -1 ? parts[i].slice(0, closingIdx) : parts[i].slice(0, 300);
      if (snippet.includes('<svg')) count++;
    }
    return count;
  })();
  results.push({
    label: `Copy buttons have SVG icon (${copyBtnSvgCount}/${copyBtnCount})`,
    severity: copyBtnSvgCount === copyBtnCount && copyBtnCount > 0 ? 'pass' : 'error',
    detail:
      copyBtnSvgCount !== copyBtnCount
        ? `${copyBtnCount - copyBtnSvgCount} copy button(s) are missing an SVG icon — add the copy SVG to every .docs-copy-button`
        : undefined,
  });

  // Every data-copy="X" must have a corresponding id="X" element
  const dataCopyMatches = [...section.matchAll(/data-copy="([^"]+)"/g)];
  const missingIds: string[] = [];
  for (const match of dataCopyMatches) {
    const copyId = match[1];
    if (!has(section, `id="${copyId}"`)) {
      missingIds.push(copyId);
    }
  }
  results.push({
    label: `All data-copy="X" targets have matching id="X" (${dataCopyMatches.length} checked)`,
    severity: missingIds.length === 0 ? 'pass' : 'error',
    detail:
      missingIds.length > 0
        ? `Missing id for: ${missingIds.map(id => `"${id}"`).join(', ')}`
        : undefined,
  });

  return results;
}

function checkDesignTokensTab(section: string): Result[] {
  const results: Result[] = [];

  // Accept any <h3> heading that contains "Color" (e.g. "Colors", "Track Colors", "Knob Colors")
  const hasColors = has(section, '<h3>Colors</h3>') ||
    countMatches(section, /<h3>[^<]*[Cc]olor[s]?[^<]*<\/h3>/) > 0;
  results.push({
    label: 'Design Tokens: Colors section',
    severity: hasColors ? 'pass' : 'error',
    detail: hasColors ? undefined : 'Missing <h3>Colors</h3> (or equivalent) in tokens tab',
  });

  const swatchCount = countMatches(section, 'docs-token-swatch');
  results.push({
    label: `Design Tokens: color swatches present (${swatchCount} found)`,
    severity: swatchCount > 0 ? 'pass' : 'error',
    detail: swatchCount === 0 ? 'Missing .docs-token-swatch elements in Colors section' : undefined,
  });

  // Swatches must use CSS custom properties, not hardcoded hex
  const swatchMatches = [...section.matchAll(/class="docs-token-swatch"[^>]*style="([^"]*)"/g)];
  const hardcodedSwatches = swatchMatches.filter(
    m => !m[1].includes('var(--') && m[1].includes('background')
  );
  results.push({
    label: 'Design Tokens: swatches use CSS variables (not hardcoded hex)',
    severity: hardcodedSwatches.length === 0 ? 'pass' : 'warning',
    detail:
      hardcodedSwatches.length > 0
        ? `${hardcodedSwatches.length} swatch(es) use hardcoded colors instead of var(--kds-...)`
        : undefined,
  });

  const hasTypo = has(section, '<h3>Typography</h3>');
  results.push({
    label: 'Design Tokens: Typography section',
    severity: hasTypo ? 'pass' : 'warning',
    detail: hasTypo ? undefined : 'Missing <h3>Typography</h3> in tokens tab',
  });

  const hasComponentTokens = has(section, 'Component-Specific Tokens');
  results.push({
    label: 'Design Tokens: Component-Specific Tokens section',
    severity: hasComponentTokens ? 'pass' : 'warning',
    detail: hasComponentTokens ? undefined : 'Missing "Component-Specific Tokens" section in tokens tab',
  });

  const hasCallout = has(section, 'docs-callout');
  results.push({
    label: 'Design Tokens: informational callout (.docs-callout)',
    severity: hasCallout ? 'pass' : 'warning',
    detail: hasCallout ? undefined : 'Missing .docs-callout note about DTCG tokens',
  });

  return results;
}

function checkUsageTab(section: string): Result[] {
  const results: Result[] = [];

  for (const fw of REQUIRED_FRAMEWORKS) {
    const hasFwTab = has(section, `data-framework="${fw}"`);
    results.push({
      label: `Usage: framework tab "${fw}"`,
      severity: hasFwTab ? 'pass' : 'error',
      detail: hasFwTab ? undefined : `Missing <button data-framework="${fw}">`,
    });

    const hasFwContent = has(section, `data-framework-content="${fw}"`);
    results.push({
      label: `Usage: framework content block "${fw}"`,
      severity: hasFwContent ? 'pass' : 'error',
      detail: hasFwContent ? undefined : `Missing <div data-framework-content="${fw}">`,
    });
  }

  // Each framework block should have at least install, import, and basic example.
  // Use loose matching for headings (e.g. "Import (Standalone Component)" counts as "Import").
  const fwSections: Array<{ label: string; pattern: string | RegExp }> = [
    { label: 'Installation', pattern: '>Installation</h3>' },
    { label: 'Import',       pattern: /<h3>[^<]*Import[^<]*<\/h3>/ },
    { label: 'Basic Example', pattern: '>Basic Example</h3>' },
  ];
  for (const s of fwSections) {
    const count = countMatches(section, s.pattern instanceof RegExp
      ? s.pattern
      : s.pattern);
    results.push({
      label: `Usage: "${s.label}" present in framework tabs (${count}/${REQUIRED_FRAMEWORKS.length})`,
      severity: count >= REQUIRED_FRAMEWORKS.length ? 'pass' : 'warning',
      detail:
        count < REQUIRED_FRAMEWORKS.length
          ? `Only ${count} framework blocks have a "${s.label}" heading — expected ${REQUIRED_FRAMEWORKS.length}`
          : undefined,
    });
  }

  return results;
}

function checkApiTab(section: string): Result[] {
  const results: Result[] = [];

  for (const table of REQUIRED_API_TABLES) {
    // "Properties" is special: accept any <h2> heading that precedes a table with <th>Property</th>
    // (component-specific headings like "<h2>kds-button-group (Container)</h2>" are valid)
    const hasTable = table === 'Properties'
      ? (has(section, `<h2>${table}</h2>`) || has(section, '<th>Property</th>'))
      : has(section, `<h2>${table}</h2>`);
    results.push({
      label: `API: "${table}" heading + table`,
      severity: hasTable ? 'pass' : 'error',
      detail: hasTable ? undefined : `Missing <h2>${table}</h2> in API tab`,
    });
  }

  // Properties table must have 4 columns: Property, Type, Default, Description
  const propCols = ['Property', 'Type', 'Default', 'Description'];
  for (const col of propCols) {
    const hasCol = has(section, `<th>${col}</th>`);
    results.push({
      label: `API Properties table column: "${col}"`,
      severity: hasCol ? 'pass' : 'error',
      detail: hasCol ? undefined : `Missing <th>${col}</th> in Properties table`,
    });
  }

  return results;
}

/** Extract the accessibility tab block from the component section. */
function extractA11yTab(section: string): string {
  const marker = 'data-tab-content="accessibility"';
  const start = section.indexOf(marker);
  if (start === -1) return '';
  // Find the end: next docs-tab-content or end of section
  const afterStart = section.indexOf('data-tab-content="', start + marker.length);
  return afterStart === -1 ? section.slice(start) : section.slice(start, afterStart);
}

function checkAccessibilityTab(section: string): Result[] {
  const results: Result[] = [];
  const a11y = extractA11yTab(section);

  if (!a11y) {
    results.push({
      label: 'Accessibility tab content block found',
      severity: 'error',
      detail: 'Missing <div data-tab-content="accessibility"> block',
    });
    return results;
  }

  // ── 1. WCAG 2.1 AA Compliance ─────────────────────────────────────────────
  const hasWcagH2 = has(a11y, '<h2>WCAG 2.1 AA Compliance</h2>');
  results.push({
    label: 'A11y [1] WCAG 2.1 AA Compliance: <h2> heading',
    severity: hasWcagH2 ? 'pass' : 'error',
    detail: hasWcagH2 ? undefined : 'Missing <h2>WCAG 2.1 AA Compliance</h2>',
  });

  const wcagText = has(a11y, 'WCAG 2.1 Level AA');
  results.push({
    label: 'A11y [1] WCAG 2.1 AA Compliance: "WCAG 2.1 Level AA" text',
    severity: wcagText ? 'pass' : 'error',
    detail: wcagText ? undefined : 'Missing "WCAG 2.1 Level AA" descriptive text',
  });

  const wcagBadgeCount = countMatches(a11y, 'docs-badge-success');
  results.push({
    label: `A11y [1] WCAG 2.1 AA Compliance: status badges (${wcagBadgeCount} found, need ≥3)`,
    severity: wcagBadgeCount >= 3 ? 'pass' : 'error',
    detail: wcagBadgeCount < 3
      ? `Expected ≥3 .docs-badge-success (Keyboard Accessible, Screen Reader Compatible, WCAG 2.1 AA)`
      : undefined,
  });

  // ── 2. Keyboard Navigation ────────────────────────────────────────────────
  const hasKbH2 = has(a11y, '<h2>Keyboard Navigation</h2>');
  results.push({
    label: 'A11y [2] Keyboard Navigation: <h2> heading',
    severity: hasKbH2 ? 'pass' : 'error',
    detail: hasKbH2 ? undefined : 'Missing <h2>Keyboard Navigation</h2>',
  });

  const hasKbTable = has(a11y, '<th>Key</th>') && has(a11y, '<th>Action</th>');
  results.push({
    label: 'A11y [2] Keyboard Navigation: Key/Action table',
    severity: hasKbTable ? 'pass' : 'error',
    detail: hasKbTable ? undefined : 'Missing keyboard table with <th>Key</th> and <th>Action</th>',
  });

  const hasFocusVisible = has(a11y, ':focus-visible');
  results.push({
    label: 'A11y [2] Keyboard Navigation: :focus-visible mention',
    severity: hasFocusVisible ? 'pass' : 'error',
    detail: hasFocusVisible ? undefined : 'Missing :focus-visible reference — focus indicator is required',
  });

  // ── 3. Screen Reader Support ──────────────────────────────────────────────
  const hasSrH2 = has(a11y, '<h2>Screen Reader Support</h2>');
  results.push({
    label: 'A11y [3] Screen Reader Support: <h2> heading',
    severity: hasSrH2 ? 'pass' : 'error',
    detail: hasSrH2 ? undefined : 'Missing <h2>Screen Reader Support</h2>',
  });

  const hasSrList = has(a11y, 'Screen Reader Support</h2>') &&
    (() => {
      const idx = a11y.indexOf('Screen Reader Support</h2>');
      const slice = a11y.slice(idx, idx + 2000);
      return slice.includes('<ul>') && slice.includes('<li>');
    })();
  results.push({
    label: 'A11y [3] Screen Reader Support: list of SR behaviors',
    severity: hasSrList ? 'pass' : 'error',
    detail: hasSrList ? undefined : 'Missing <ul><li> list of screen reader behaviors after heading',
  });

  const hasAriaRef = has(a11y, 'aria-') || has(a11y, 'role=');
  results.push({
    label: 'A11y [3] Screen Reader Support: ARIA/role references',
    severity: hasAriaRef ? 'pass' : 'warning',
    detail: hasAriaRef ? undefined : 'Missing ARIA attribute or role references in Screen Reader section',
  });

  // ── 4. Color Contrast ─────────────────────────────────────────────────────
  const hasCcH2 = has(a11y, '<h2>Color Contrast</h2>');
  results.push({
    label: 'A11y [4] Color Contrast: <h2> heading',
    severity: hasCcH2 ? 'pass' : 'error',
    detail: hasCcH2 ? undefined : 'Missing <h2>Color Contrast</h2>',
  });

  const hasCcTable = has(a11y, '<th>Contrast Ratio</th>') && has(a11y, '<th>Status</th>');
  results.push({
    label: 'A11y [4] Color Contrast: table with Contrast Ratio + Status columns',
    severity: hasCcTable ? 'pass' : 'error',
    detail: hasCcTable ? undefined : 'Missing contrast table — need <th>Contrast Ratio</th> and <th>Status</th>',
  });

  const hasContrastRatio = has(a11y, '4.5:1') || has(a11y, '4.5');
  results.push({
    label: 'A11y [4] Color Contrast: 4.5:1 WCAG AA minimum ratio mentioned',
    severity: hasContrastRatio ? 'pass' : 'warning',
    detail: hasContrastRatio ? undefined : 'Missing reference to 4.5:1 minimum contrast ratio (WCAG 1.4.3)',
  });

  // ── 5. Touch Target Size ──────────────────────────────────────────────────
  const hasTtH2 = has(a11y, '<h2>Touch Target Size</h2>');
  results.push({
    label: 'A11y [5] Touch Target Size: <h2> heading',
    severity: hasTtH2 ? 'pass' : 'error',
    detail: hasTtH2 ? undefined : 'Missing <h2>Touch Target Size</h2>',
  });

  const hasTtTable = has(a11y, 'Touch Target Size</h2>') &&
    (() => {
      const idx = a11y.indexOf('Touch Target Size</h2>');
      const slice = a11y.slice(idx, idx + 2000);
      return slice.includes('<th>') && slice.includes('<td>');
    })();
  results.push({
    label: 'A11y [5] Touch Target Size: size table',
    severity: hasTtTable ? 'pass' : 'error',
    detail: hasTtTable ? undefined : 'Missing size table with pixel measurements after <h2>Touch Target Size</h2>',
  });

  const has44px = has(a11y, '44x44') || has(a11y, '44px') || has(a11y, 'WCAG 2.5.5') || has(a11y, '44 x 44');
  results.push({
    label: 'A11y [5] Touch Target Size: 44px WCAG minimum target mentioned',
    severity: has44px ? 'pass' : 'warning',
    detail: has44px ? undefined : 'Missing 44×44px WCAG 2.5.5 touch target reference',
  });

  // ── 6. Disabled State ─────────────────────────────────────────────────────
  const hasDsH2 = has(a11y, '<h2>Disabled State</h2>');
  results.push({
    label: 'A11y [6] Disabled State: <h2> heading',
    severity: hasDsH2 ? 'pass' : 'error',
    detail: hasDsH2 ? undefined : 'Missing <h2>Disabled State</h2>',
  });

  const hasDsList = has(a11y, 'Disabled State</h2>') &&
    (() => {
      const idx = a11y.indexOf('Disabled State</h2>');
      const slice = a11y.slice(idx, idx + 2000);
      return slice.includes('<ul>') && slice.includes('<li>');
    })();
  results.push({
    label: 'A11y [6] Disabled State: behavioral list',
    severity: hasDsList ? 'pass' : 'error',
    detail: hasDsList ? undefined : 'Missing <ul><li> list describing disabled state behavior',
  });

  const hasDsCodeBlock = has(a11y, 'Disabled State</h2>') &&
    (() => {
      const idx = a11y.indexOf('Disabled State</h2>');
      const slice = a11y.slice(idx, idx + 2000);
      return slice.includes('docs-code-block') && slice.includes('disabled');
    })();
  results.push({
    label: 'A11y [6] Disabled State: code example with disabled attribute',
    severity: hasDsCodeBlock ? 'pass' : 'error',
    detail: hasDsCodeBlock ? undefined : 'Missing code block showing disabled usage in Disabled State section',
  });

  // ── 7. Best Practices ─────────────────────────────────────────────────────
  const hasBpH2 = has(a11y, '<h2>Best Practices</h2>');
  results.push({
    label: 'A11y [7] Best Practices: <h2> heading',
    severity: hasBpH2 ? 'pass' : 'error',
    detail: hasBpH2 ? undefined : 'Missing <h2>Best Practices</h2>',
  });

  // Both Do and Don't subsections must exist inside Best Practices
  const bpBlock = (() => {
    const idx = a11y.indexOf('<h2>Best Practices</h2>');
    if (idx === -1) return '';
    const nextH2 = a11y.indexOf('<h2>', idx + 20);
    return nextH2 === -1 ? a11y.slice(idx) : a11y.slice(idx, nextH2);
  })();

  const hasDo = has(bpBlock, 'Do') && (has(bpBlock, '<h3>') || has(bpBlock, '<h4>'));
  results.push({
    label: 'A11y [7] Best Practices: "Do" subsection',
    severity: hasDo ? 'pass' : 'error',
    detail: hasDo ? undefined : 'Missing "Do" subsection (h3/h4) inside Best Practices',
  });

  const hasDont = has(bpBlock, "Don't") || has(bpBlock, 'Dont') || has(bpBlock, "Don\u2019t");
  results.push({
    label: 'A11y [7] Best Practices: "Don\'t" subsection',
    severity: hasDont ? 'pass' : 'error',
    detail: hasDont ? undefined : "Missing \"Don't\" subsection inside Best Practices",
  });

  const doListCount = countMatches(bpBlock, '<ul>');
  results.push({
    label: `A11y [7] Best Practices: both Do/Don't have lists (${doListCount} <ul> found, need ≥2)`,
    severity: doListCount >= 2 ? 'pass' : 'error',
    detail: doListCount < 2 ? 'Each Do and Don\'t subsection must have its own <ul> list' : undefined,
  });

  // ── 8. Testing ────────────────────────────────────────────────────────────
  const hasTstH2 = has(a11y, '<h2>Testing</h2>');
  results.push({
    label: 'A11y [8] Testing: <h2> heading',
    severity: hasTstH2 ? 'pass' : 'error',
    detail: hasTstH2 ? undefined : 'Missing <h2>Testing</h2>',
  });

  const hasTstCodeBlock = has(a11y, 'Testing</h2>') &&
    (() => {
      const idx = a11y.indexOf('Testing</h2>');
      const slice = a11y.slice(idx, idx + 2000);
      return slice.includes('docs-code-block');
    })();
  results.push({
    label: 'A11y [8] Testing: code block with test commands',
    severity: hasTstCodeBlock ? 'pass' : 'error',
    detail: hasTstCodeBlock ? undefined : 'Missing code block with test commands in Testing section',
  });

  const hasValidateA11y = has(a11y, 'validate:a11y');
  results.push({
    label: 'A11y [8] Testing: npm run validate:a11y command present',
    severity: hasValidateA11y ? 'pass' : 'error',
    detail: hasValidateA11y ? undefined : 'Missing "npm run validate:a11y" command in Testing section',
  });

  const hasManualChecklist = has(a11y, 'VoiceOver') || has(a11y, 'NVDA') || has(a11y, 'screen reader');
  results.push({
    label: 'A11y [8] Testing: manual testing tools mentioned (VoiceOver/NVDA)',
    severity: hasManualChecklist ? 'pass' : 'warning',
    detail: hasManualChecklist ? undefined : 'Missing manual testing tool references (VoiceOver, NVDA) in Testing',
  });

  // ── 9. Resources ──────────────────────────────────────────────────────────
  const hasResH2 = has(a11y, '<h2>Resources</h2>');
  results.push({
    label: 'A11y [9] Resources: <h2> heading',
    severity: hasResH2 ? 'pass' : 'error',
    detail: hasResH2 ? undefined : 'Missing <h2>Resources</h2>',
  });

  const externalLinkCount = countMatches(a11y, /href="https?:\/\//);
  results.push({
    label: `A11y [9] Resources: external links present (${externalLinkCount} found, need ≥2)`,
    severity: externalLinkCount >= 2 ? 'pass' : 'error',
    detail: externalLinkCount < 2
      ? 'Expected ≥2 external links (ARIA spec, WebAIM, etc.) in Resources section'
      : undefined,
  });

  const hasW3c = has(a11y, 'w3.org') || has(a11y, 'w3c.org') || has(a11y, 'ARIA');
  results.push({
    label: 'A11y [9] Resources: W3C/ARIA spec link',
    severity: hasW3c ? 'pass' : 'warning',
    detail: hasW3c ? undefined : 'Missing W3C ARIA specification link in Resources',
  });

  const hasContrastTool = has(a11y, 'webaim') || has(a11y, 'WebAIM') || has(a11y, 'contrast') && has(a11y, 'href');
  results.push({
    label: 'A11y [9] Resources: contrast checker tool link',
    severity: hasContrastTool ? 'pass' : 'warning',
    detail: hasContrastTool ? undefined : 'Missing contrast checker tool link (WebAIM) in Resources',
  });

  return results;
}

function checkPlaygroundJs(js: string, componentId: string): Result[] {
  const results: Result[] = [];
  const pascal = toPascalCase(componentId);

  // Accept both component-specific naming (initInputFieldPlayground) and the generic
  // pattern used by the Button component (initPlayground).
  const initFnSpecific = `init${pascal}Playground`;
  const hasInitFn = has(js, initFnSpecific) || has(js, 'function initPlayground(');
  const initFnLabel = has(js, initFnSpecific) ? initFnSpecific : 'initPlayground (generic)';
  results.push({
    label: `Playground JS: init function exists (${initFnLabel})`,
    severity: hasInitFn ? 'pass' : 'error',
    detail: hasInitFn
      ? undefined
      : `Missing function init${pascal}Playground() in app.js`,
  });

  const updateFnSpecific = `update${pascal}PlaygroundCode`;
  const hasUpdateFn = has(js, updateFnSpecific) || has(js, 'function updatePlaygroundCode(');
  const updateFnLabel = has(js, updateFnSpecific) ? updateFnSpecific : 'updatePlaygroundCode (generic)';
  results.push({
    label: `Playground JS: update function exists (${updateFnLabel})`,
    severity: hasUpdateFn ? 'pass' : 'error',
    detail: hasUpdateFn
      ? undefined
      : `Missing function update${pascal}PlaygroundCode() in app.js — required for dynamic code block`,
  });

  const playgroundRef = `getElementById('playground-${componentId}')`;
  const hasRef = has(js, playgroundRef);
  results.push({
    label: `Playground JS: references #playground-${componentId}`,
    severity: hasRef ? 'pass' : 'error',
    detail: hasRef ? undefined : `Missing getElementById('playground-${componentId}') in app.js`,
  });

  return results;
}

// ─── Reporter ─────────────────────────────────────────────────────────────────

function printResults(group: string, results: Result[]): number {
  console.log(`\n  ${group}`);
  let errors = 0;
  for (const r of results) {
    const icon = r.severity === 'pass' ? '✅' : r.severity === 'warning' ? '⚠️ ' : '❌';
    console.log(`    ${icon} ${r.label}`);
    if (r.detail) {
      console.log(`         → ${r.detail}`);
    }
    if (r.severity === 'error') errors++;
  }
  return errors;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const componentId = process.argv[2];
if (!componentId) {
  console.error('Usage: tsx scripts/validate-docs-page.ts <component-name>');
  console.error('Example: tsx scripts/validate-docs-page.ts button');
  process.exit(1);
}

console.log(`\n${'─'.repeat(60)}`);
console.log(`  Docs Page Validation: ${componentId}`);
console.log(`${'─'.repeat(60)}`);

let html: string;
let js: string;

try {
  html = readFileSync(HTML_PATH, 'utf-8');
} catch {
  console.error(`  ❌ Could not read ${HTML_PATH}`);
  process.exit(1);
}

try {
  js = readFileSync(JS_PATH, 'utf-8');
} catch {
  console.error(`  ❌ Could not read ${JS_PATH}`);
  process.exit(1);
}

const section = extractComponentSection(html, componentId);
if (!section) {
  console.error(`\n  ❌ Component section not found: id="component-${componentId}" in index.html`);
  console.error(`     Make sure the component has a docs section in packages/web-components/index.html`);
  process.exit(1);
}

let totalErrors = 0;

totalErrors += printResults('[1] Structure & Header', checkStructure(section, componentId));
totalErrors += printResults('[2] Tabs', checkTabs(section));
totalErrors += printResults('[3] Overview: Quick Start & Playground', checkOverviewTab(section, componentId));
totalErrors += printResults('[4] Code Blocks (copy buttons + SVG + data-copy targets)', checkCodeBlocks(section));
totalErrors += printResults('[5] Design Tokens Tab', checkDesignTokensTab(section));
totalErrors += printResults('[6] Usage Tab (4 frameworks)', checkUsageTab(section));
totalErrors += printResults('[7] API Tab (tables)', checkApiTab(section));
totalErrors += printResults('[8] Accessibility Tab', checkAccessibilityTab(section));
totalErrors += printResults('[9] Playground JavaScript (app.js)', checkPlaygroundJs(js, componentId));

console.log(`\n${'─'.repeat(60)}`);
if (totalErrors === 0) {
  console.log(`  ✅ All checks passed for: ${componentId}`);
} else {
  console.log(`  ❌ ${totalErrors} error(s) found for: ${componentId}`);
  console.log(`     Fix the errors above before marking the component docs as complete.`);
}
console.log(`${'─'.repeat(60)}\n`);

process.exit(totalErrors > 0 ? 1 : 0);
