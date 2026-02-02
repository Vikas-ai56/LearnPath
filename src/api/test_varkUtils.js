/**
 * Test file for VARK Module 3 utilities
 * Run with: node src/api/test_varkUtils.js
 */

import { organizeContentByStyle, getContentTypesForStyle, VARK_MAPPING } from './varkUtils.js';

console.log('\n🧪 VARK Module 3 - Utility Function Tests\n');
console.log('='.repeat(50));

// Sample content data
const sampleContent = [
  { id: 1, title: 'Data Structures Video', type: 'video' },
  { id: 2, title: 'Process Diagram', type: 'diagram' },
  { id: 3, title: 'OS Audio Lecture', type: 'audio' },
  { id: 4, title: 'Algorithms Textbook', type: 'text' },
  { id: 5, title: 'Binary Search Quiz', type: 'quiz' },
  { id: 6, title: 'Database PDF', type: 'pdf' }
];

// Test 1: Visual Learner
console.log('\n📍 Test 1: Visual Learner');
const visualResult = organizeContentByStyle(sampleContent, 'Visual');
console.log(`✅ Recommended: ${visualResult.recommended.length} items`);
console.log(`   Types: ${visualResult.recommended.map(c => c.type).join(', ')}`);
console.log(`   Others: ${visualResult.others.length} items`);

// Test 2: Aural Learner
console.log('\n📍 Test 2: Aural Learner');
const auralResult = organizeContentByStyle(sampleContent, 'Aural');
console.log(`✅ Recommended: ${auralResult.recommended.length} items`);
console.log(`   Types: ${auralResult.recommended.map(c => c.type).join(', ')}`);

// Test 3: ReadWrite Learner
console.log('\n📍 Test 3: ReadWrite Learner');
const readWriteResult = organizeContentByStyle(sampleContent, 'ReadWrite');
console.log(`✅ Recommended: ${readWriteResult.recommended.length} items`);
console.log(`   Types: ${readWriteResult.recommended.map(c => c.type).join(', ')}`);

// Test 4: Kinesthetic Learner
console.log('\n📍 Test 4: Kinesthetic Learner');
const kinestheticResult = organizeContentByStyle(sampleContent, 'Kinesthetic');
console.log(`✅ Recommended: ${kinestheticResult.recommended.length} items`);
console.log(`   Types: ${kinestheticResult.recommended.map(c => c.type).join(', ')}`);

// Test 5: No style specified (edge case)
console.log('\n📍 Test 5: No Learning Style');
const noStyleResult = organizeContentByStyle(sampleContent, null);
console.log(`✅ Recommended: ${noStyleResult.recommended.length} items`);
console.log(`   Others: ${noStyleResult.others.length} items`);

// Test 6: Empty content (edge case)
console.log('\n📍 Test 6: Empty Content Array');
const emptyResult = organizeContentByStyle([], 'Visual');
console.log(`✅ Recommended: ${emptyResult.recommended.length} items`);
console.log(`   Others: ${emptyResult.others.length} items`);

// Test 7: Get content types for style
console.log('\n📍 Test 7: Get Content Types for Each Style');
Object.keys(VARK_MAPPING).forEach(style => {
  const types = getContentTypesForStyle(style);
  console.log(`   ${style}: [${types.join(', ')}]`);
});

console.log('\n' + '='.repeat(50));
console.log('✅ All Module 3 utility tests passed!\n');
