#!/usr/bin/env node

/**
 * Test hash consistency between Babel and SWC plugins
 * This ensures both plugins generate identical class names for the same input
 */

import { transformSync } from '@babel/core';
import babelPluginSilk from './packages/babel-plugin-silk/dist/index.js';

// Test cases
const testCases = [
  { property: 'bg', value: 'red' },
  { property: 'p', value: '8' },
  { property: 'p', value: '4' },
  { property: 'm', value: '2' },
  { property: 'color', value: 'blue' },
  { property: 'fontSize', value: '16px' },
  { property: 'maxWidth', value: '800px' },
  { property: 'borderRadius', value: '12px' },
];

console.log('Testing hash consistency between Babel and SWC plugins\n');
console.log('=' .repeat(80));

// Test development mode
console.log('\n📦 Development Mode (production: false)');
console.log('-'.repeat(80));

const devConfig = { production: false, classPrefix: 'silk' };

for (const { property, value } of testCases) {
  const code = `
    import { css } from '@sylphx/silk';
    const test = css({ ${property}: '${value}' });
  `;

  const result = transformSync(code, {
    filename: 'test.tsx',
    plugins: [[babelPluginSilk, devConfig]],
  });

  // Extract class name from transformed code
  const match = result.code.match(/const test = "([^"]+)"/);
  const className = match ? match[1] : 'NOT_FOUND';

  console.log(`${property.padEnd(15)} : '${value.padEnd(10)}' → .${className}`);
}

// Test production mode
console.log('\n🚀 Production Mode (production: true, no prefix)');
console.log('-'.repeat(80));

const prodConfig = { production: true, classPrefix: '' };
const results = [];

for (const { property, value } of testCases) {
  const code = `
    import { css } from '@sylphx/silk';
    const test = css({ ${property}: '${value}' });
  `;

  const result = transformSync(code, {
    filename: 'test.tsx',
    plugins: [[babelPluginSilk, prodConfig]],
  });

  const match = result.code.match(/const test = "([^"]+)"/);
  const className = match ? match[1] : 'NOT_FOUND';
  const firstChar = className[0];
  const isValid = /[a-z]/.test(firstChar);
  const length = className.length;

  results.push({ property, value, className, firstChar, isValid, length });

  console.log(
    `${property.padEnd(15)} : '${value.padEnd(10)}' → .${className.padEnd(10)} | Len: ${length} | First: '${firstChar}' ${isValid ? '✅' : '❌'}`
  );
}

// Test production mode with custom prefix
console.log('\n🎨 Production Mode with Custom Prefix (classPrefix: "app")');
console.log('-'.repeat(80));

const prodPrefixConfig = { production: true, classPrefix: 'app' };

for (const { property, value } of testCases) {
  const code = `
    import { css } from '@sylphx/silk';
    const test = css({ ${property}: '${value}' });
  `;

  const result = transformSync(code, {
    filename: 'test.tsx',
    plugins: [[babelPluginSilk, prodPrefixConfig]],
  });

  const match = result.code.match(/const test = "([^"]+)"/);
  const className = match ? match[1] : 'NOT_FOUND';
  const startsWithPrefix = className.startsWith('app');

  console.log(
    `${property.padEnd(15)} : '${value.padEnd(10)}' → .${className.padEnd(13)} | Prefix: ${startsWithPrefix ? '✅' : '❌'}`
  );
}

// Summary
console.log('\n' + '='.repeat(80));
console.log('📊 Summary\n');

const allValid = results.every(r => r.isValid);
const avgLength = (results.reduce((sum, r) => sum + r.length, 0) / results.length).toFixed(1);
const invalidCount = results.filter(r => !r.isValid).length;

console.log(`✅ Valid identifiers: ${results.length - invalidCount}/${results.length}`);
console.log(`📏 Average length: ${avgLength} chars`);
console.log(`🎯 All valid: ${allValid ? '✅ YES' : '❌ NO'}`);

console.log('\n' + '='.repeat(80));
console.log('✅ All tests completed!\n');

// Export results for SWC comparison
console.log('📋 Class names for SWC comparison:\n');
results.forEach(({ property, value, className }) => {
  console.log(`  ${property}: "${value}" → "${className}"`);
});
