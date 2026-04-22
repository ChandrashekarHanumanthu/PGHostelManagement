// Quick authentication test for the Tenants API
// Run this in the browser console on your application

async function quickAuthTest() {
    console.log('=== Quick Authentication Test ===');
    
    // 1. Check if token exists
    const token = localStorage.getItem('token');
    console.log('1. Token exists:', !!token);
    if (token) {
        console.log('   Token preview:', token.substring(0, 30) + '...');
    }
    
    // 2. Check user role
    const role = localStorage.getItem('role');
    console.log('2. User role:', role);
    
    // 3. Test API call
    if (token) {
        try {
            console.log('3. Testing API call...');
            const response = await fetch('http://localhost:8080/api/admin/tenants', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('   Response status:', response.status);
            console.log('   Response ok:', response.ok);
            
            if (response.ok) {
                const data = await response.json();
                console.log('   ✅ Success! Data type:', typeof data);
                console.log('   Is array:', Array.isArray(data));
                console.log('   Length:', Array.isArray(data) ? data.length : 'N/A');
                console.log('   First item:', Array.isArray(data) && data.length > 0 ? data[0] : 'N/A');
            } else {
                const errorText = await response.text();
                console.log('   ❌ Error response:', errorText);
            }
        } catch (error) {
            console.log('   ❌ Network error:', error.message);
        }
    } else {
        console.log('3. ⚠️  No token - cannot test API');
    }
    
    console.log('=== End Test ===');
}

// Auto-run the test
quickAuthTest();
