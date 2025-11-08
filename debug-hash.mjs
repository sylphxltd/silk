#!/usr/bin/env node

import { murmurHash2, hashPropertyValue } from './packages/babel-plugin-silk/dist/utils/hash.js';

console.log('🔍 Debugging Hash Generation\n');
console.log('=' .repeat(80));

// Test direct murmurHash2
console.log('\n📦 Direct murmurHash2 tests:');
console.log('-'.repeat(80));

const testStrings = [
  'background-color:"red":',
  'padding:"8":',
  'padding:"4":',
  'margin:"2":',
];

for (const str of testStrings) {
  const hash = murmurHash2(str);
  console.log(`murmurHash2("${str}") → ${hash}`);
}

// Test hashPropertyValue
console.log('\n📦 hashPropertyValue tests:');
console.log('-'.repeat(80));

const testCases = [
  { property: 'background-color', value: 'red' },
  { property: 'padding', value: '8' },
  { property: 'padding', value: '4' },
  { property: 'margin', value: '2' },
  { property: 'color', value: 'blue' },
];

for (const { property, value } of testCases) {
  const hash = hashPropertyValue(property, value);
  const content = `${property}:${JSON.stringify(value)}:`;
  console.log(`hashPropertyValue("${property}", "${value}")`);
  console.log(`  Content: "${content}"`);
  console.log(`  Hash: ${hash}\n`);
}

console.log('='.repeat(80));
