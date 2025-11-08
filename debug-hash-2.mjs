#!/usr/bin/env node

import { hashPropertyValue } from './packages/babel-plugin-silk/dist/utils/hash.js';
import { generateClassName } from './packages/babel-plugin-silk/dist/generators/class-name.js';

console.log('🔍 Debugging generateClassName\n');
console.log('=' .repeat(80));

const config = { production: true, classPrefix: '' };

const testCases = [
  { property: 'bg', value: 'red' },
  { property: 'p', value: '8' },
  { property: 'p', value: '4' },
  { property: 'm', value: '2' },
  { property: 'color', value: 'blue' },
];

console.log('\n📦 generateClassName tests:');
console.log('-'.repeat(80));

for (const { property, value } of testCases) {
  const className = generateClassName(property, value, config);
  console.log(`generateClassName("${property}", "${value}") → ${className}`);
}

console.log('\n' + '='.repeat(80));
