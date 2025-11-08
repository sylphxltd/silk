#!/usr/bin/env node

import { murmurHash2, hashPropertyValue } from './packages/babel-plugin-silk/dist/utils/hash.js';

console.log('🔍 Testing actual hash inputs\n');
console.log('=' .repeat(80));

const testCases = [
  { property: 'bg', value: 'red', expected: 'oqmaqr' },
  { property: 'p', value: '8', expected: 'js61pc' },
  { property: 'p', value: '4', expected: 'azg4xx' },
  { property: 'm', value: '2', expected: 'hyolz3s' },
  { property: 'color', value: 'blue', expected: 'h7qhtp' },
];

for (const { property, value, expected } of testCases) {
  const content = `${property}:${JSON.stringify(value)}:`;
  const hash = murmurHash2(content);
  const actualHash = hashPropertyValue(property, value);

  console.log(`Property: "${property}", Value: "${value}"`);
  console.log(`  Content: "${content}"`);
  console.log(`  Hash (murmurHash2): ${hash}`);
  console.log(`  Hash (hashPropertyValue): ${actualHash}`);
  console.log(`  Expected (from generateClassName): ${expected}`);
  console.log(`  Match: ${actualHash === expected ? '✅' : '❌'}\n`);
}

console.log('='.repeat(80));
