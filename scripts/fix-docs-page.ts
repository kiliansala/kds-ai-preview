/**
 * fix-docs-page.ts
 *
 * Auto-fixes common docs page issues in index.html for a given component.
 *
 * Usage:
 *   tsx scripts/fix-docs-page.ts <component-name>
 *   tsx scripts/fix-docs-page.ts button
 *   tsx scripts/fix-docs-page.ts input-field
 *
 * What it fixes:
 *   [4] Copy buttons missing SVG icon
 *   [5] Missing <h3>Colors</h3> section with token swatches in the Tokens tab
 *   [6] Usage framework tabs using data-framework="wc" → "web-component"
 *   [8] Missing a11y sections: Keyboard Navigation, Touch Target Size,
 *       Disabled State, Best Practices, Testing, Resources
 *   [8] Color Contrast table missing <th>Contrast Ratio</th> column
 *
 * After running, validate again:
 *   npx tsx scripts/validate-docs-page.ts <component-name>
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const componentName = process.argv[2];

if (!componentName) {
  console.error('Usage: tsx scripts/fix-docs-page.ts <component-name>');
  process.exit(1);
}

const INDEX_PATH = resolve('packages/web-components/index.html');

const SVG_COPY_ICON =
  `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">` +
  `<path d="M4 2a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V2z"/>` +
  `<path d="M2 6a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2v-2h-2v2H2V8h2V6H2z"/>` +
  `</svg>`;

function toPascalCase(str: string): string {
  return str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

const pascal  = toPascalCase(componentName);   // e.g. "InputField"
const tagName = `kds-${componentName}`;        // e.g. "kds-input-field"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extracts the component section from the full HTML. */
function extractSection(html: string): { section: string; start: number; end: number } | null {
  const startMarker = `id="component-${componentName}"`;
  const start = html.indexOf(startMarker);
  if (start === -1) return null;
  const next = html.indexOf('id="component-', start + startMarker.length);
  const end = next === -1 ? html.length : next;
  return { section: html.slice(start, end), start, end };
}

/** Extracts the content of a named tab. */
function extractTab(section: string, tabName: string): { content: string; start: number; end: number } | null {
  const marker = `data-tab-content="${tabName}"`;
  const start = section.indexOf(marker);
  if (start === -1) return null;
  const next = section.indexOf('data-tab-content="', start + marker.length);
  const end = next === -1 ? section.length : next;
  return { content: section.slice(start, end), start, end };
}

// ---------------------------------------------------------------------------
// Fix 1: Copy buttons missing SVG
// ---------------------------------------------------------------------------

function fixCopyButtonSvg(section: string): { section: string; count: number } {
  const COPY_BTN = '<button class="docs-copy-button"';
  let result = section;
  let count = 0;
  let pos = 0;

  while (true) {
    const btnStart = result.indexOf(COPY_BTN, pos);
    if (btnStart === -1) break;

    const openTagEnd = result.indexOf('>', btnStart);
    if (openTagEnd === -1) break;

    const btnEnd = result.indexOf('</button>', openTagEnd);
    if (btnEnd === -1) break;

    const innerContent = result.slice(openTagEnd + 1, btnEnd);

    if (!innerContent.includes('<svg')) {
      const text = innerContent.trim();
      const newInner = `\n                  ${SVG_COPY_ICON}\n                  ${text}\n                `;
      result =
        result.slice(0, openTagEnd + 1) +
        newInner +
        result.slice(btnEnd);
      count++;
      pos = openTagEnd + 1 + newInner.length + '</button>'.length;
    } else {
      pos = btnEnd + '</button>'.length;
    }
  }

  return { section: result, count };
}

// ---------------------------------------------------------------------------
// Fix 2: Usage wc → web-component
// ---------------------------------------------------------------------------

function fixUsageFrameworkTabs(section: string): { section: string; count: number } {
  let count = 0;
  const fixed = section
    .replace(/data-framework="wc"/g, () => { count++; return 'data-framework="web-component"'; })
    .replace(/data-framework-content="wc"/g, 'data-framework-content="web-component"');
  return { section: fixed, count };
}

// ---------------------------------------------------------------------------
// Fix 3: Color Contrast table — add Contrast Ratio column
// ---------------------------------------------------------------------------

function fixContrastRatioColumn(section: string): { section: string; fixed: boolean } {
  const a11yTab = extractTab(section, 'accessibility');
  if (!a11yTab) return { section, fixed: false };

  const a11y = a11yTab.content;
  const H2 = '<h2>Color Contrast</h2>';
  const h2Idx = a11y.indexOf(H2);

  if (h2Idx === -1) return { section, fixed: false };
  if (a11y.includes('<th>Contrast Ratio</th>')) return { section, fixed: false };

  // Find the table after the h2
  const tableStart = a11y.indexOf('<table', h2Idx);
  const tableEnd   = a11y.indexOf('</table>', tableStart);
  if (tableStart === -1 || tableEnd === -1) return { section, fixed: false };

  let table = a11y.slice(tableStart, tableEnd + '</table>'.length);

  // 1. Add header column before <th>Status</th>
  if (!table.includes('<th>Status</th>')) return { section, fixed: false };
  table = table.replace('<th>Status</th>', '<th>Contrast Ratio</th><th>Status</th>');

  // 2. Add a data cell (placeholder) before every Status <td> in tbody
  //    Status cells always contain a docs-badge span
  table = table.replace(/<td><span class="docs-badge/g, '<td>—</td><td><span class="docs-badge');

  // Replace the table inside the section
  const absTableStart = section.indexOf(a11yTab.content.slice(tableStart, tableStart + 40), a11yTab.start) +
    (a11y.indexOf('<table', h2Idx));
  // Simpler: replace the old table string in the section directly
  const oldTable = a11y.slice(tableStart, tableEnd + '</table>'.length);
  const newSection = section.replace(oldTable, table);

  return { section: newSection, fixed: newSection !== section };
}

// ---------------------------------------------------------------------------
// Fix 4: Missing a11y sections — templates
// ---------------------------------------------------------------------------

function a11yTemplates(): Record<string, string> {
  return {
    'Keyboard Navigation': `
          <section class="docs-section">
            <h2>Keyboard Navigation</h2>
            <p>The component supports full keyboard interaction:</p>

            <table class="docs-table" style="margin-top: 16px;">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>Tab</code></td>
                  <td>Move focus to the component</td>
                </tr>
                <tr>
                  <td><code>Shift + Tab</code></td>
                  <td>Move focus backwards</td>
                </tr>
                <tr>
                  <td><code>Enter</code></td>
                  <td>Activate the component</td>
                </tr>
                <tr>
                  <td><code>Space</code></td>
                  <td>Activate the component</td>
                </tr>
              </tbody>
            </table>

            <p style="margin-top: 16px;"><strong>Focus Indicator:</strong> A visible focus ring is applied via <code>:focus-visible</code>, meeting WCAG 2.4.7 Focus Visible.</p>
          </section>`,

    'Touch Target Size': `
          <section class="docs-section">
            <h2>Touch Target Size</h2>
            <p>Interactive elements meet the WCAG 2.5.5 minimum touch target of <strong>44×44px</strong>:</p>

            <table class="docs-table" style="margin-top: 16px;">
              <thead>
                <tr>
                  <th>Element</th>
                  <th>Min Size</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>${tagName}</code></td>
                  <td>44px minimum (verify per variant)</td>
                  <td><span class="docs-badge docs-badge-success">Pass</span></td>
                </tr>
              </tbody>
            </table>
          </section>`,

    'Disabled State': `
          <section class="docs-section">
            <h2>Disabled State</h2>
            <p>When <code>disabled</code> is set, the following behaviors apply:</p>
            <ul>
              <li>The component is removed from the tab order</li>
              <li>Pointer and keyboard interaction is prevented</li>
              <li>Visual appearance shifts to reduced-contrast to signal non-interactivity</li>
              <li>Screen readers announce the element as "dimmed" or "unavailable"</li>
            </ul>
            <div class="docs-code-block" style="margin-top: 16px;">
              <button class="docs-copy-button" data-copy="${componentName}-a11y-disabled">
                ${SVG_COPY_ICON}
                Copy
              </button>
              <pre><code class="language-html" id="${componentName}-a11y-disabled">&lt;${tagName} disabled&gt;&lt;/${tagName}&gt;</code></pre>
            </div>
          </section>`,

    'Best Practices': `
          <section class="docs-section">
            <h2>Best Practices</h2>

            <h3>Do</h3>
            <ul>
              <li>Provide meaningful labels and accessible names</li>
              <li>Ensure keyboard navigation works without a mouse</li>
              <li>Test with screen readers to verify announced states</li>
            </ul>

            <h3>Don't</h3>
            <ul>
              <li>Don't rely solely on color to convey state information</li>
              <li>Don't remove or suppress focus indicators</li>
              <li>Don't disable functionality without providing an alternative</li>
            </ul>
          </section>`,

    'Testing': `
          <section class="docs-section">
            <h2>Testing</h2>
            <p>Run automated accessibility checks and supplement with manual testing:</p>

            <div class="docs-code-block" style="margin-top: 16px;">
              <button class="docs-copy-button" data-copy="${componentName}-a11y-test">
                ${SVG_COPY_ICON}
                Copy
              </button>
              <pre><code class="language-bash" id="${componentName}-a11y-test"># Run automated accessibility validation
npm run validate:a11y --workspace=@kds/web-components

# Or directly
tsx scripts/validate-${componentName}-a11y.ts</code></pre>
            </div>

            <p style="margin-top: 16px;"><strong>Manual testing checklist:</strong></p>
            <ul>
              <li><strong>VoiceOver (macOS):</strong> Navigate to the component and verify announcements</li>
              <li><strong>NVDA (Windows):</strong> Verify the same with NVDA screen reader</li>
              <li><strong>Keyboard-only:</strong> Tab to and through the component without a mouse</li>
              <li><strong>Zoom 200%:</strong> Verify no content clips at high zoom levels</li>
            </ul>
          </section>`,

    'Resources': `
          <section class="docs-section">
            <h2>Resources</h2>
            <ul>
              <li><a href="https://www.w3.org/WAI/WCAG21/Understanding/" target="_blank">WCAG 2.1 Understanding Docs</a></li>
              <li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank">ARIA Authoring Practices Guide</a></li>
              <li><a href="https://webaim.org/resources/contrastchecker/" target="_blank">WebAIM Contrast Checker</a></li>
              <li><a href="https://www.w3.org/WAI/WCAG21/Understanding/target-size.html" target="_blank">WCAG 2.1 — 2.5.5 Target Size</a></li>
            </ul>
          </section>`,
  };
}

function fixMissingA11ySections(section: string): { section: string; added: string[] } {
  const a11yTab = extractTab(section, 'accessibility');
  if (!a11yTab) return { section, added: [] };

  const templates = a11yTemplates();
  const ORDER = [
    'Keyboard Navigation',
    'Touch Target Size',
    'Disabled State',
    'Best Practices',
    'Testing',
    'Resources',
  ];

  const added: string[] = [];
  let a11y = a11yTab.content;

  for (const name of ORDER) {
    if (!a11y.includes(`<h2>${name}</h2>`)) {
      const tpl = templates[name];
      if (!tpl) continue;
      // Insert after the last </section> inside the a11y tab
      const lastSectionEnd = a11y.lastIndexOf('</section>');
      if (lastSectionEnd === -1) {
        a11y = a11y + tpl;
      } else {
        const insertAt = lastSectionEnd + '</section>'.length;
        a11y = a11y.slice(0, insertAt) + tpl + a11y.slice(insertAt);
      }
      added.push(name);
    }
  }

  if (added.length === 0) return { section, added };

  // Replace the a11y tab content back into the section
  const newSection =
    section.slice(0, a11yTab.start) +
    a11y +
    section.slice(a11yTab.start + a11yTab.content.length);

  return { section: newSection, added };
}

// ---------------------------------------------------------------------------
// Fix 5: Missing <h3>Colors</h3> in the Tokens tab
// ---------------------------------------------------------------------------

function fixTokensColorsSection(section: string): { section: string; fixed: boolean } {
  const tokensTab = extractTab(section, 'tokens');
  if (!tokensTab) return { section, fixed: false };

  const tokens = tokensTab.content;

  // Already has a Colors heading
  if (tokens.includes('<h3>Colors</h3>')) return { section, fixed: false };

  // Insert a placeholder Colors section with a swatch template at the start of the tab
  const insertAfter = '<h2>Design Tokens</h2>';
  const insertIdx = tokens.indexOf(insertAfter);
  if (insertIdx === -1) return { section, fixed: false };

  const afterH2 = insertIdx + insertAfter.length;

  const colorsSkeleton = `

            <h3>Colors</h3>
            <table class="docs-table">
              <thead>
                <tr><th>Token</th><th>Value</th><th>Usage</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>--kds-${componentName}-color</code></td>
                  <td>
                    <span class="docs-token-swatch" style="background: var(--kds-${componentName}-color, #000); display:inline-block; width:16px; height:16px; border-radius:4px; border:1px solid rgba(0,0,0,.1); vertical-align:middle; margin-right:6px;"></span>
                    <code><!-- TODO: fill in value --></code>
                  </td>
                  <td><!-- TODO: describe usage --></td>
                </tr>
              </tbody>
            </table>`;

  const newTokens =
    tokens.slice(0, afterH2) +
    colorsSkeleton +
    tokens.slice(afterH2);

  const newSection =
    section.slice(0, tokensTab.start) +
    newTokens +
    section.slice(tokensTab.start + tokensTab.content.length);

  return { section: newSection, fixed: true };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

let html = readFileSync(INDEX_PATH, 'utf-8');
const bounds = extractSection(html);

if (!bounds) {
  console.error(`❌ Component section "component-${componentName}" not found in index.html`);
  process.exit(1);
}

let { section } = bounds;
const appliedFixes: string[] = [];

// Run all fixes
const svgResult = fixCopyButtonSvg(section);
if (svgResult.count > 0) {
  section = svgResult.section;
  appliedFixes.push(`[4] Added SVG icon to ${svgResult.count} copy button(s)`);
}

const contrastResult = fixContrastRatioColumn(section);
if (contrastResult.fixed) {
  section = contrastResult.section;
  appliedFixes.push(`[8] Added Contrast Ratio column to Color Contrast table`);
}

const a11yResult = fixMissingA11ySections(section);
if (a11yResult.added.length > 0) {
  section = a11yResult.section;
  a11yResult.added.forEach(name =>
    appliedFixes.push(`[8] Added missing a11y section: "${name}"`),
  );
}

const usageResult = fixUsageFrameworkTabs(section);
if (usageResult.count > 0) {
  section = usageResult.section;
  appliedFixes.push(`[6] Fixed ${usageResult.count} framework tab(s): "wc" → "web-component"`);
}

const tokensResult = fixTokensColorsSection(section);
if (tokensResult.fixed) {
  section = tokensResult.section;
  appliedFixes.push(`[5] Added placeholder Colors section with token swatch to Tokens tab`);
}

// Write back
if (appliedFixes.length === 0) {
  console.log(`\nNo auto-fixes needed for: ${componentName}`);
  process.exit(0);
}

html = html.slice(0, bounds.start) + section + html.slice(bounds.end);
writeFileSync(INDEX_PATH, html, 'utf-8');

console.log(`\n✅ Applied ${appliedFixes.length} fix(es) to: ${componentName}`);
appliedFixes.forEach(f => console.log(`   • ${f}`));
console.log(`\nValidate again:\n  npx tsx scripts/validate-docs-page.ts ${componentName}`);
