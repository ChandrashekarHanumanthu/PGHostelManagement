// Test script to verify the tenants filter fix
// This simulates what happens in the TenantsPage component

console.log('Testing tenants filter fix...');

// Test 1: Normal array (should work)
const normalTenants = [
  { id: 1, user: { name: 'John', email: 'john@test.com' }, signupCompleted: true },
  { id: 2, user: { name: 'Jane', email: 'jane@test.com' }, signupCompleted: false }
];

try {
  const filtered = normalTenants.filter(t => t.signupCompleted);
  console.log('✓ Test 1 passed: Normal array filtering works', filtered.length);
} catch (e) {
  console.error('✗ Test 1 failed:', e.message);
}

// Test 2: Error object (what the backend returns on error)
const errorResponse = { error: 'Failed to fetch tenants: Authentication failed' };

try {
  // This would cause the original error
  const filtered = errorResponse.filter(t => t);
  console.log('✗ Test 2 failed: Should have thrown an error');
} catch (e) {
  console.log('✓ Test 2 passed: Error object correctly throws error', e.message);
}

// Test 3: Null/undefined (edge case)
try {
  const filtered = (null || []).filter(t => t);
  console.log('✓ Test 3 passed: Null fallback works');
} catch (e) {
  console.error('✗ Test 3 failed:', e.message);
}

// Test 4: The fix - checking if it's an array first
function safeFilter(tenants, filterFn) {
  if (!Array.isArray(tenants)) {
    console.log('Not an array, returning empty array');
    return [];
  }
  return tenants.filter(filterFn);
}

try {
  const result1 = safeFilter(normalTenants, t => t.signupCompleted);
  console.log('✓ Test 4a passed: Safe filter with array', result1.length);
  
  const result2 = safeFilter(errorResponse, t => t);
  console.log('✓ Test 4b passed: Safe filter with error object', result2.length);
  
  const result3 = safeFilter(null, t => t);
  console.log('✓ Test 4c passed: Safe filter with null', result3.length);
} catch (e) {
  console.error('✗ Test 4 failed:', e.message);
}

console.log('Tests completed!');
