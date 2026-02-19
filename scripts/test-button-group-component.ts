/**
 * @package kds-ai-preview
 * @description Button Group component test suite
 * @author Kilian Sala <kilian@kapsch.net>
 *
 * Validates kds-button-group component structure, exports, and integration.
 * Run: npx tsx scripts/test-button-group-component.ts
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

console.log('\n=== Button Group Component Tests ===\n');

// --- 1. File Existence ---
console.log('[Files]');

const requiredFiles = [
  '.figma/button-group.figma-contract.json',
  '.figma/button-group.figma-contract.ts',
  'packages/web-components/src/components/kds-button-group.ts',
  'scripts/validate-button-group-contract.ts',
  'scripts/validate-button-group-a11y.ts',
  'packages/wrappers/react/src/ButtonGroup.tsx',
  'packages/wrappers/angular/src/button-group.component.ts',
  'packages/wrappers/blazor/Components/KdsButtonGroup.razor',
  'packages/wrappers/blazor/Components/KdsButtonGroupItem.razor',
];

for (const file of requiredFiles) {
  test(`File exists: ${file}`, () => fileExists(file));
}

// --- 2. Contract JSON ---
console.log('\n[Contract JSON]');

const contractJson = JSON.parse(readFile('.figma/button-group.figma-contract.json'));

test('Contract has component name "Button group"', () =>
  contractJson.source?.componentName === 'Button group'
);

test('Contract has two sub-components', () =>
  'buttonGroup' in contractJson.components && 'buttonGroupItem' in contractJson.components
);

test('Contract item has icon property with 4 values', () => {
  const vals = contractJson.components.buttonGroupItem.properties.icon.values;
  return vals.length === 4 && vals.includes('none') && vals.includes('leading') && vals.includes('only') && vals.includes('dot');
});

test('Contract item has selected property', () =>
  'selected' in contractJson.components.buttonGroupItem.properties
);

test('Contract item has disabled property', () =>
  'disabled' in contractJson.components.buttonGroupItem.properties
);

test('Contract has designTokens', () =>
  typeof contractJson.designTokens === 'object' && contractJson.designTokens.colors != null
);

test('Contract has border-radius 8px', () =>
  contractJson.designTokens.borderRadius === '8px'
);

// --- 3. LIT Component ---
console.log('\n[LIT Component]');

const litSrc = readFile('packages/web-components/src/components/kds-button-group.ts');

test('Registered as kds-button-group custom element', () =>
  litSrc.includes("@customElement('kds-button-group')")
);

test('Registered as kds-button-group-item custom element', () =>
  litSrc.includes("@customElement('kds-button-group-item')")
);

test('Exports ButtonGroupItemIcon type', () =>
  litSrc.includes('export type ButtonGroupItemIcon')
);

test('KdsButtonGroup extends LitElement', () =>
  litSrc.includes('class KdsButtonGroup extends LitElement')
);

test('KdsButtonGroupItem extends LitElement', () =>
  litSrc.includes('class KdsButtonGroupItem extends LitElement')
);

test('Has selected property with reflect', () =>
  litSrc.includes('reflect: true') && litSrc.includes('selected')
);

test('Has icon property', () =>
  litSrc.includes('icon: ButtonGroupItemIcon')
);

test('Has disabled property', () =>
  litSrc.includes('disabled') && litSrc.includes('Boolean')
);

test('Has value property', () =>
  litSrc.includes("value = ''") || litSrc.includes('value:')
);

test('Dispatches kds-button-group-item-click event', () =>
  litSrc.includes("'kds-button-group-item-click'")
);

test('Uses classMap for dynamic classes', () =>
  litSrc.includes('classMap')
);

test('Has border-radius: 8px', () =>
  litSrc.includes('border-radius: 8px')
);

test('Has role="group" on container', () =>
  litSrc.includes('role="group"')
);

test('Has overflow: hidden', () =>
  litSrc.includes('overflow: hidden')
);

test('Has box-shadow', () =>
  litSrc.includes('box-shadow')
);

test('Uses native button element', () =>
  litSrc.includes('<button') && litSrc.includes('type="button"')
);

test('Has aria-pressed for selected state', () =>
  litSrc.includes('aria-pressed')
);

test('Has focus-visible styles', () =>
  litSrc.includes(':focus-visible')
);

test('Has disabled cursor: not-allowed', () =>
  litSrc.includes('cursor: not-allowed')
);

test('Has hover state', () =>
  litSrc.includes(':hover')
);

test('Default padding 10px 16px', () =>
  litSrc.includes('padding: 10px 16px')
);

test('Icon-only padding 10px 12px', () =>
  litSrc.includes('padding: 10px 12px')
);

test('Gap 8px for icon+text', () =>
  litSrc.includes('gap: 8px')
);

test('Font size 14px', () =>
  litSrc.includes('font-size: 14px')
);

test('Font weight 600', () =>
  litSrc.includes('font-weight: 600')
);

test('Dot indicator element', () =>
  litSrc.includes('class="dot"') || litSrc.includes("'dot'")
);

test('Icon slot for leading/only', () =>
  litSrc.includes('slot="icon"') || litSrc.includes('slot name="icon"')
);

// --- 4. React Wrapper ---
console.log('\n[React Wrapper]');

const reactSrc = readFile('packages/wrappers/react/src/ButtonGroup.tsx');

test('Exports ButtonGroup component', () =>
  reactSrc.includes('export const ButtonGroup')
);

test('Exports ButtonGroupItem component', () =>
  reactSrc.includes('export const ButtonGroupItem')
);

test('Exports ButtonGroupProps type', () =>
  reactSrc.includes('ButtonGroupProps')
);

test('Exports ButtonGroupItemProps type', () =>
  reactSrc.includes('ButtonGroupItemProps')
);

test('Uses forwardRef for both components', () => {
  const count = (reactSrc.match(/forwardRef/g) || []).length;
  return count >= 2;
});

test('Creates kds-button-group element', () =>
  reactSrc.includes("'kds-button-group'")
);

test('Creates kds-button-group-item element', () =>
  reactSrc.includes("'kds-button-group-item'")
);

test('Handles onClick event', () =>
  reactSrc.includes('onClick') && reactSrc.includes('kds-button-group-item-click')
);

// --- 5. Angular Wrapper ---
console.log('\n[Angular Wrapper]');

const angularSrc = readFile('packages/wrappers/angular/src/button-group.component.ts');

test('Has KdsButtonGroupComponent class', () =>
  angularSrc.includes('KdsButtonGroupComponent')
);

test('Has KdsButtonGroupItemComponent class', () =>
  angularSrc.includes('KdsButtonGroupItemComponent')
);

test('Uses standalone: true', () =>
  angularSrc.includes('standalone: true')
);

test('Uses CUSTOM_ELEMENTS_SCHEMA', () =>
  angularSrc.includes('CUSTOM_ELEMENTS_SCHEMA')
);

test('Has itemClick output', () =>
  angularSrc.includes('itemClick')
);

// --- 6. Blazor Wrapper ---
console.log('\n[Blazor Wrapper]');

const blazorGroupSrc = readFile('packages/wrappers/blazor/Components/KdsButtonGroup.razor');
const blazorItemSrc = readFile('packages/wrappers/blazor/Components/KdsButtonGroupItem.razor');

test('Group renders kds-button-group element', () =>
  blazorGroupSrc.includes('<kds-button-group')
);

test('Group has AriaLabel parameter', () =>
  blazorGroupSrc.includes('public string? AriaLabel')
);

test('Item renders kds-button-group-item element', () =>
  blazorItemSrc.includes('<kds-button-group-item')
);

test('Item has Selected parameter', () =>
  blazorItemSrc.includes('public bool Selected')
);

test('Item has Icon parameter', () =>
  blazorItemSrc.includes('public string Icon')
);

test('Item has Disabled parameter', () =>
  blazorItemSrc.includes('public bool Disabled')
);

test('Item has OnClick EventCallback', () =>
  blazorItemSrc.includes('EventCallback OnClick')
);

test('Item uses JS interop for listener', () =>
  blazorItemSrc.includes('attachButtonGroupItemListener')
);

// --- 7. Index Exports ---
console.log('\n[Index Exports]');

const wcIndex = readFile('packages/web-components/src/index.ts');
const reactIndex = readFile('packages/wrappers/react/src/index.ts');
const angularIndex = readFile('packages/wrappers/angular/src/index.ts');

test('Web components index exports KdsButtonGroup', () =>
  wcIndex.includes('KdsButtonGroup')
);

test('Web components index exports KdsButtonGroupItem', () =>
  wcIndex.includes('KdsButtonGroupItem')
);

test('Web components index exports ButtonGroupItemIcon type', () =>
  wcIndex.includes('ButtonGroupItemIcon')
);

test('React index exports ButtonGroup', () =>
  reactIndex.includes("from './ButtonGroup.js'")
);

test('Angular index exports KdsButtonGroupComponent', () =>
  angularIndex.includes('KdsButtonGroupComponent')
);

test('Angular index exports KdsButtonGroupItemComponent', () =>
  angularIndex.includes('KdsButtonGroupItemComponent')
);

// --- 8. Blazor JS Interop ---
console.log('\n[Blazor JS Interop]');

const blazorJs = readFile('packages/wrappers/blazor/wwwroot/kds-blazor.js');

test('Has attachButtonGroupItemListener function', () =>
  blazorJs.includes('attachButtonGroupItemListener')
);

test('Has detachButtonGroupItemListener function', () =>
  blazorJs.includes('detachButtonGroupItemListener')
);

test('Listens for kds-button-group-item-click event', () =>
  blazorJs.includes('kds-button-group-item-click')
);

// --- 9. Documentation ---
console.log('\n[Documentation]');

const indexHtml = readFile('packages/web-components/index.html');

test('Button Group script imported in index.html', () =>
  indexHtml.includes('kds-button-group.ts"></script>')
);

test('Button Group nav link active (not disabled)', () =>
  indexHtml.includes('data-component="button-group"')
);

test('Button Group documentation section exists', () =>
  indexHtml.includes('id="component-button-group"')
);

test('Button Group card in showcase grid', () =>
  indexHtml.includes('>Button Group</h3>')
);

test('Button Group playground exists', () =>
  indexHtml.includes('playground-button-group')
);

// --- 10. App.js Playground ---
console.log('\n[App.js Playground]');

const appJs = readFile('packages/web-components/docs/app.js');

test('initButtonGroupPlayground function exists', () =>
  appJs.includes('initButtonGroupPlayground')
);

test('updateButtonGroupPlaygroundCode function exists', () =>
  appJs.includes('updateButtonGroupPlaygroundCode')
);

test('initButtonGroupPlayground called on DOMContentLoaded', () =>
  appJs.includes('initButtonGroupPlayground()')
);

// --- Summary ---
console.log(`\n${'='.repeat(40)}`);
console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
console.log(`${'='.repeat(40)}\n`);

process.exit(failed > 0 ? 1 : 0);
