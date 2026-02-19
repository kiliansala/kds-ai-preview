/**
 * @package kds-ai-preview
 * @description Badge component test suite
 * @author Kilian Sala <kilian@kapsch.net>
 *
 * Validates kds-badge component structure, exports, and integration.
 * Run: npx tsx scripts/test-badge-component.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');
let passed = 0;
let failed = 0;

function test(name: string, fn: () => boolean) {
  try {
    if (fn()) {
      console.log(`  PASS  ${name}`);
      passed++;
    } else {
      console.error(`  FAIL  ${name}`);
      failed++;
    }
  } catch (e: any) {
    console.error(`  FAIL  ${name} — ${e.message}`);
    failed++;
  }
}

function readFile(relPath: string): string {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf-8');
}

function fileExists(relPath: string): boolean {
  return fs.existsSync(path.join(ROOT, relPath));
}

console.log('\n=== Badge Component Tests ===\n');

// --- 1. File Existence ---
console.log('[Files]');

const requiredFiles = [
  '.figma/badge.figma-contract.json',
  '.figma/badge.figma-contract.ts',
  'packages/web-components/src/components/kds-badge.ts',
  'scripts/validate-badge-contract.ts',
  'scripts/validate-badge-a11y.ts',
  'packages/wrappers/react/src/Badge.tsx',
  'packages/wrappers/angular/src/badge.component.ts',
  'packages/wrappers/blazor/Components/KdsBadge.razor',
];

for (const file of requiredFiles) {
  test(`File exists: ${file}`, () => fileExists(file));
}

// --- 2. Contract JSON ---
console.log('\n[Contract JSON]');

const contractJson = JSON.parse(readFile('.figma/badge.figma-contract.json'));

test('Contract has component name "Badge"', () =>
  contractJson.source?.componentName === 'Badge' || contractJson.title?.includes('Badge')
);

test('Contract has 3 properties', () =>
  Object.keys(contractJson.properties).length === 3
);

test('Contract has size property with sm/md/lg', () => {
  const vals = contractJson.properties.size.values;
  return vals.includes('sm') && vals.includes('md') && vals.includes('lg');
});

test('Contract has 13 color values', () =>
  contractJson.properties.color.values.length === 13
);

test('Contract has 8 icon values', () =>
  contractJson.properties.icon.values.length === 8
);

test('Contract has designTokens with 13 colors', () => {
  const colors = contractJson.designTokens?.colors;
  return typeof colors === 'object' && Object.keys(colors).length === 13;
});

// --- 3. LIT Component ---
console.log('\n[LIT Component]');

const litSrc = readFile('packages/web-components/src/components/kds-badge.ts');

test('Registered as kds-badge custom element', () =>
  litSrc.includes("@customElement('kds-badge')")
);

test('Exports BadgeSize type', () =>
  litSrc.includes('export type BadgeSize')
);

test('Exports BadgeColor type', () =>
  litSrc.includes('export type BadgeColor')
);

test('Exports BadgeIcon type', () =>
  litSrc.includes('export type BadgeIcon')
);

test('Has size property with reflect', () =>
  litSrc.includes('reflect: true') && litSrc.includes('size: BadgeSize')
);

test('Has color property', () =>
  litSrc.includes('color: BadgeColor')
);

test('Has icon property', () =>
  litSrc.includes('icon: BadgeIcon')
);

test('Dispatches kds-badge-dismiss event', () =>
  litSrc.includes("'kds-badge-dismiss'")
);

test('Uses classMap for dynamic classes', () =>
  litSrc.includes('classMap')
);

test('Has border-radius: 9999px (pill shape)', () =>
  litSrc.includes('border-radius: 9999px')
);

test('Close button has aria-label="Dismiss"', () =>
  litSrc.includes('aria-label="Dismiss"')
);

test('Close button uses native button element', () =>
  litSrc.includes('<button') && litSrc.includes('type="button"')
);

const allColors = ['gray', 'primary', 'error', 'warning', 'success', 'blue-gray', 'blue-light', 'blue', 'indigo', 'purple', 'pink', 'rose', 'orange'];
for (const color of allColors) {
  test(`CSS includes color-${color} class`, () =>
    litSrc.includes(`.color-${color}`)
  );
}

// --- 4. React Wrapper ---
console.log('\n[React Wrapper]');

const reactSrc = readFile('packages/wrappers/react/src/Badge.tsx');

test('Exports Badge component', () =>
  reactSrc.includes('export const Badge') || reactSrc.includes('export { Badge')
);

test('Exports BadgeProps type', () =>
  reactSrc.includes('BadgeProps')
);

test('Uses forwardRef', () =>
  reactSrc.includes('forwardRef')
);

test('Creates kds-badge element', () =>
  reactSrc.includes("'kds-badge'")
);

test('Handles onDismiss event', () =>
  reactSrc.includes('onDismiss') && reactSrc.includes('kds-badge-dismiss')
);

// --- 5. Angular Wrapper ---
console.log('\n[Angular Wrapper]');

const angularSrc = readFile('packages/wrappers/angular/src/badge.component.ts');

test('Has KdsBadgeComponent class', () =>
  angularSrc.includes('KdsBadgeComponent')
);

test('Uses standalone: true', () =>
  angularSrc.includes('standalone: true')
);

test('Uses CUSTOM_ELEMENTS_SCHEMA', () =>
  angularSrc.includes('CUSTOM_ELEMENTS_SCHEMA')
);

test('Has badgeDismiss output', () =>
  angularSrc.includes('badgeDismiss')
);

// --- 6. Blazor Wrapper ---
console.log('\n[Blazor Wrapper]');

const blazorSrc = readFile('packages/wrappers/blazor/Components/KdsBadge.razor');

test('Renders kds-badge element', () =>
  blazorSrc.includes('<kds-badge')
);

test('Has Size parameter', () =>
  blazorSrc.includes('public string Size')
);

test('Has Color parameter', () =>
  blazorSrc.includes('public string Color')
);

test('Has Icon parameter', () =>
  blazorSrc.includes('public string Icon')
);

test('Has OnDismiss EventCallback', () =>
  blazorSrc.includes('EventCallback OnDismiss')
);

test('Uses JS interop for badge listener', () =>
  blazorSrc.includes('attachBadgeListener')
);

// --- 7. Index Exports ---
console.log('\n[Index Exports]');

const wcIndex = readFile('packages/web-components/src/index.ts');
const reactIndex = readFile('packages/wrappers/react/src/index.ts');
const angularIndex = readFile('packages/wrappers/angular/src/index.ts');

test('Web components index exports KdsBadge', () =>
  wcIndex.includes('KdsBadge')
);

test('React index exports Badge', () =>
  reactIndex.includes("from './Badge.js'")
);

test('Angular index exports KdsBadgeComponent', () =>
  angularIndex.includes('KdsBadgeComponent')
);

// --- 8. Blazor JS Interop ---
console.log('\n[Blazor JS Interop]');

const blazorJs = readFile('packages/wrappers/blazor/wwwroot/kds-blazor.js');

test('Has attachBadgeListener function', () =>
  blazorJs.includes('attachBadgeListener')
);

test('Has detachBadgeListener function', () =>
  blazorJs.includes('detachBadgeListener')
);

test('Listens for kds-badge-dismiss event', () =>
  blazorJs.includes('kds-badge-dismiss')
);

// --- 9. Documentation ---
console.log('\n[Documentation]');

const indexHtml = readFile('packages/web-components/index.html');

test('Badge script imported in index.html', () =>
  indexHtml.includes('kds-badge.ts"></script>')
);

test('Badge nav link active (not disabled)', () =>
  indexHtml.includes('data-component="badge"')
);

test('Badge documentation section exists', () =>
  indexHtml.includes('id="component-badge"')
);

test('Badge card in showcase grid', () =>
  indexHtml.includes('<h3') && indexHtml.includes('>Badge</h3>')
);

// --- Summary ---
console.log(`\n${'='.repeat(40)}`);
console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
console.log(`${'='.repeat(40)}\n`);

process.exit(failed > 0 ? 1 : 0);
