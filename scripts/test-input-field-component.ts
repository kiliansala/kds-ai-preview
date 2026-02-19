/**
 * @package kds-ai-preview
 * @description Input Field component test suite
 * @author Kilian Sala <kilian@kapsch.net>
 *
 * Validates kds-input-field component structure, exports, and integration.
 * Run: npx tsx scripts/test-input-field-component.ts
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

console.log('\n=== Input Field Component Tests ===\n');

// ─── 1. File Existence ────────────────────────────────────────────────────────
console.log('[Files]');

const requiredFiles = [
  '.figma/input-field.figma-contract.json',
  '.figma/input-field.figma-contract.ts',
  'packages/web-components/src/components/kds-input-field.ts',
  'scripts/validate-input-field-contract.ts',
  'scripts/validate-input-field-a11y.ts',
  'packages/wrappers/react/src/InputField.tsx',
  'packages/wrappers/angular/src/input-field.component.ts',
  'packages/wrappers/blazor/Components/KdsInputField.razor',
];

for (const file of requiredFiles) {
  test(`File exists: ${file}`, () => fileExists(file));
}

// ─── 2. Contract JSON ─────────────────────────────────────────────────────────
console.log('\n[Contract JSON]');

const contractJson = JSON.parse(readFile('.figma/input-field.figma-contract.json'));

test('Contract title includes "Input Field"', () =>
  contractJson.title?.includes('Input Field')
);

test('Contract has source with correct componentId', () =>
  contractJson.source?.componentId === '1090:57817'
);

test('Contract has at least 8 properties', () =>
  Object.keys(contractJson.properties).length >= 8
);

test('Contract has type property with 5 values', () => {
  const vals = contractJson.properties.type?.values;
  return Array.isArray(vals) && vals.length === 5;
});

test('Contract type includes "default"', () =>
  contractJson.properties.type?.values?.includes('default')
);

test('Contract type includes "leading-text"', () =>
  contractJson.properties.type?.values?.includes('leading-text')
);

test('Contract has destructive property', () =>
  contractJson.properties.destructive?.type === 'boolean'
);

test('Contract has designTokens', () =>
  typeof contractJson.designTokens === 'object'
);

test('Contract has border tokens', () => {
  const b = contractJson.designTokens?.borders;
  return b?.default === '#D5D7DA' && b?.focused === '#D6BBFB' && b?.destructive === '#FDA29B';
});

test('Contract has shadow tokens', () =>
  typeof contractJson.designTokens?.shadows?.focused === 'string' &&
  contractJson.designTokens.shadows.focused.includes('#F4EBFF')
);

test('Contract has text color tokens', () => {
  const t = contractJson.designTokens?.text;
  return t?.placeholder === '#717680' && t?.value === '#181D27';
});

test('Contract has events defined', () =>
  typeof contractJson.events === 'object' &&
  'kds-input' in contractJson.events
);

// ─── 3. Contract TypeScript ───────────────────────────────────────────────────
console.log('\n[Contract TypeScript]');

const contractTs = readFile('.figma/input-field.figma-contract.ts');

test('Exports InputFieldType', () =>
  contractTs.includes('export type InputFieldType')
);

test('Exports InputFieldProps interface', () =>
  contractTs.includes('export interface InputFieldProps')
);

test('Exports INPUT_FIELD_DEFAULTS', () =>
  contractTs.includes('export const INPUT_FIELD_DEFAULTS')
);

test('Exports INPUT_FIELD_TOKENS', () =>
  contractTs.includes('export const INPUT_FIELD_TOKENS')
);

test('InputFieldType has all 5 variants', () => {
  const variants = ['default', 'leading-dropdown', 'trailing-dropdown', 'leading-text', 'payment'];
  return variants.every(v => contractTs.includes(`'${v}'`));
});

// ─── 4. LIT Component ─────────────────────────────────────────────────────────
console.log('\n[LIT Component]');

const litSrc = readFile('packages/web-components/src/components/kds-input-field.ts');

test('Registered as kds-input-field custom element', () =>
  litSrc.includes("@customElement('kds-input-field')")
);

test('Exports InputFieldType', () =>
  litSrc.includes('export type InputFieldType')
);

test('Has type property', () =>
  litSrc.includes('type: InputFieldType')
);

test('Has label property', () =>
  litSrc.includes('label: string')
);

test('Has hint property', () =>
  litSrc.includes('hint: string')
);

test('Has placeholder property', () =>
  litSrc.includes('placeholder: string')
);

test('Has value property', () =>
  litSrc.includes('value: string')
);

test('Has name property', () =>
  litSrc.includes('name: string')
);

test('Has inputType property with attribute "input-type"', () =>
  litSrc.includes("attribute: 'input-type'") || litSrc.includes('input-type')
);

test('Has destructive boolean property', () =>
  litSrc.includes('destructive: boolean')
);

test('Has disabled boolean property', () =>
  litSrc.includes('disabled: boolean')
);

test('Has leadingIcon boolean property', () =>
  litSrc.includes('leadingIcon: boolean')
);

test('Has helpIcon boolean property', () =>
  litSrc.includes('helpIcon: boolean')
);

test('Has leadingText property', () =>
  litSrc.includes('leadingText: string')
);

test('Has required property', () =>
  litSrc.includes('required: boolean')
);

test('Dispatches kds-input event', () =>
  litSrc.includes("'kds-input'")
);

test('Dispatches kds-change event', () =>
  litSrc.includes("'kds-change'")
);

test('Dispatches kds-help-click event', () =>
  litSrc.includes("'kds-help-click'")
);

test('Has native <input> element', () =>
  litSrc.includes('<input')
);

test('Has <label> element', () =>
  litSrc.includes('<label')
);

test('Has aria-invalid for destructive state', () =>
  litSrc.includes('aria-invalid')
);

test('Has aria-describedby for hint', () =>
  litSrc.includes('aria-describedby')
);

test('Has :focus-within CSS', () =>
  litSrc.includes(':focus-within')
);

test('Has ::placeholder CSS', () =>
  litSrc.includes('::placeholder')
);

test('Has border-radius: 8px', () =>
  litSrc.includes('border-radius: 8px')
);

test('Has focus ring Brand/100 (#F4EBFF)', () =>
  litSrc.includes('#F4EBFF')
);

test('Has focus ring Error/100 (#FEF3F2) for destructive', () =>
  litSrc.includes('#FEF3F2')
);

test('Has border default (#D5D7DA)', () =>
  litSrc.includes('#D5D7DA')
);

test('Has border focused (#D6BBFB)', () =>
  litSrc.includes('#D6BBFB')
);

test('Has border destructive (#FDA29B)', () =>
  litSrc.includes('#FDA29B')
);

test('Uses classMap', () =>
  litSrc.includes('classMap')
);

test('Uses ifDefined directive', () =>
  litSrc.includes('ifDefined')
);

test('Uses live directive for value binding', () =>
  litSrc.includes('live')
);

test('Help button has aria-label="Help"', () =>
  litSrc.includes('aria-label="Help"')
);

test('Help button has type="button"', () =>
  litSrc.includes('type="button"')
);

test('Alert icon has aria-hidden="true"', () =>
  litSrc.includes('aria-hidden="true"')
);

test('Exposes public focus() method', () =>
  litSrc.includes('focus(')
);

test('Leading icon slot defined', () =>
  litSrc.includes("name=\"leading-icon\"")
);

test('Leading dropdown slot defined', () =>
  litSrc.includes("name=\"leading-dropdown\"")
);

test('Trailing dropdown slot defined', () =>
  litSrc.includes("name=\"trailing-dropdown\"")
);

test('Handles leading-dropdown type variant', () =>
  litSrc.includes("'leading-dropdown'") || litSrc.includes('"leading-dropdown"')
);

test('Handles leading-text type variant', () =>
  litSrc.includes("'leading-text'") || litSrc.includes('"leading-text"')
);

test('Disabled background (#F9FAFB)', () =>
  litSrc.includes('#F9FAFB')
);

// ─── 5. React Wrapper ─────────────────────────────────────────────────────────
console.log('\n[React Wrapper]');

const reactSrc = readFile('packages/wrappers/react/src/InputField.tsx');

test('Exports InputField component', () =>
  reactSrc.includes('export const InputField')
);

test('Exports InputFieldProps type', () =>
  reactSrc.includes('InputFieldProps')
);

test('Uses forwardRef', () =>
  reactSrc.includes('forwardRef')
);

test('Creates kds-input-field element', () =>
  reactSrc.includes("'kds-input-field'")
);

test('Handles onKdsInput event', () =>
  reactSrc.includes('onKdsInput') && reactSrc.includes('kds-input')
);

test('Handles onKdsChange event', () =>
  reactSrc.includes('onKdsChange') && reactSrc.includes('kds-change')
);

test('Handles onKdsHelpClick event', () =>
  reactSrc.includes('onKdsHelpClick') && reactSrc.includes('kds-help-click')
);

test('Has InputField.displayName', () =>
  reactSrc.includes('InputField.displayName')
);

test('Passes leading-icon slot content', () =>
  reactSrc.includes("slot: 'leading-icon'") || reactSrc.includes('slot="leading-icon"')
);

// ─── 6. Angular Wrapper ───────────────────────────────────────────────────────
console.log('\n[Angular Wrapper]');

const angularSrc = readFile('packages/wrappers/angular/src/input-field.component.ts');

test('Has KdsInputFieldComponent class', () =>
  angularSrc.includes('KdsInputFieldComponent')
);

test('Uses CUSTOM_ELEMENTS_SCHEMA', () =>
  angularSrc.includes('CUSTOM_ELEMENTS_SCHEMA')
);

test('Has kdsInput Output', () =>
  angularSrc.includes('kdsInput')
);

test('Has kdsChange Output', () =>
  angularSrc.includes('kdsChange')
);

test('Has kdsHelpClick Output', () =>
  angularSrc.includes('kdsHelpClick')
);

test('Has ngOnChanges for value sync', () =>
  angularSrc.includes('ngOnChanges')
);

test('Has ngOnDestroy for cleanup', () =>
  angularSrc.includes('ngOnDestroy')
);

test('Renders kds-input-field element', () =>
  angularSrc.includes('<kds-input-field')
);

// ─── 7. Blazor Wrapper ────────────────────────────────────────────────────────
console.log('\n[Blazor Wrapper]');

const blazorSrc = readFile('packages/wrappers/blazor/Components/KdsInputField.razor');

test('Renders kds-input-field element', () =>
  blazorSrc.includes('<kds-input-field')
);

test('Has Label parameter', () =>
  blazorSrc.includes('public string Label')
);

test('Has Hint parameter', () =>
  blazorSrc.includes('public string Hint')
);

test('Has Type parameter', () =>
  blazorSrc.includes('public string Type')
);

test('Has Destructive parameter', () =>
  blazorSrc.includes('public bool Destructive')
);

test('Has Disabled parameter', () =>
  blazorSrc.includes('public bool Disabled')
);

test('Has OnInput EventCallback', () =>
  blazorSrc.includes('EventCallback') && blazorSrc.includes('OnInput')
);

test('Has OnHelpClick EventCallback', () =>
  blazorSrc.includes('OnHelpClick')
);

test('Uses IAsyncDisposable', () =>
  blazorSrc.includes('IAsyncDisposable')
);

test('Uses JS interop for listeners', () =>
  blazorSrc.includes('attachInputFieldListeners')
);

// ─── 8. Index Exports ─────────────────────────────────────────────────────────
console.log('\n[Index Exports]');

const wcIndex      = readFile('packages/web-components/src/index.ts');
const reactIndex   = readFile('packages/wrappers/react/src/index.ts');
const angularIndex = readFile('packages/wrappers/angular/src/index.ts');

test('Web components index exports KdsInputField', () =>
  wcIndex.includes('KdsInputField')
);

test('Web components index exports InputFieldType', () =>
  wcIndex.includes('InputFieldType')
);

test('React index exports InputField', () =>
  reactIndex.includes("from './InputField.js'")
);

test('React index re-exports InputFieldType', () =>
  reactIndex.includes('InputFieldType')
);

test('Angular index exports KdsInputFieldComponent', () =>
  angularIndex.includes('KdsInputFieldComponent')
);

// ─── 9. Blazor JS Interop ─────────────────────────────────────────────────────
console.log('\n[Blazor JS Interop]');

const blazorJs = readFile('packages/wrappers/blazor/wwwroot/kds-blazor.js');

test('Has inputFieldListeners Map', () =>
  blazorJs.includes('inputFieldListeners')
);

test('Has attachInputFieldListeners function', () =>
  blazorJs.includes('attachInputFieldListeners')
);

test('Has detachInputFieldListeners function', () =>
  blazorJs.includes('detachInputFieldListeners')
);

test('Has setInputFieldValue function', () =>
  blazorJs.includes('setInputFieldValue')
);

test('Listens for kds-input event', () =>
  blazorJs.includes('kds-input')
);

test('Listens for kds-change event', () =>
  blazorJs.includes('kds-change')
);

test('Listens for kds-help-click event', () =>
  blazorJs.includes('kds-help-click')
);

// ─── 10. Documentation ────────────────────────────────────────────────────────
console.log('\n[Documentation]');

const indexHtml = readFile('packages/web-components/index.html');

test('Input Field script imported', () =>
  indexHtml.includes('kds-input-field.ts"></script>')
);

test('Input Field nav link active (not disabled)', () =>
  indexHtml.includes('data-component="input-field"')
);

test('Input Field component section exists', () =>
  indexHtml.includes('id="component-input-field"')
);

test('Input Field card in showcase grid', () =>
  indexHtml.includes('>Input Field</h3>')
);

test('Playground element present', () =>
  indexHtml.includes('id="playground-input-field"')
);

test('App.js registers initInputFieldPlayground', () => {
  const appJs = readFile('packages/web-components/docs/app.js');
  return appJs.includes('initInputFieldPlayground()');
});

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n${'='.repeat(40)}`);
console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
console.log(`${'='.repeat(40)}\n`);

process.exit(failed > 0 ? 1 : 0);
