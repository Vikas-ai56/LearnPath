/**
 * VARK Learning Style System - Automated Test Script
 * Run with: node server/test_vark_api.js
 */

import http from 'http';

const BASE_URL = 'localhost';
const PORT = 3000;
let authToken = '';

// Helper function for API calls using Node's http module
async function apiCall(endpoint, method = 'GET', body = null, useAuth = false) {
    return new Promise((resolve) => {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (useAuth && authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }
        
        const postData = body ? JSON.stringify(body) : null;
        
        const options = {
            hostname: BASE_URL,
            port: PORT,
            path: endpoint,
            method: method,
            headers: headers
        };
        
        if (postData) {
            options.headers['Content-Length'] = Buffer.byteLength(postData);
        }
        
        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({ status: res.statusCode, data: jsonData });
                } catch (error) {
                    resolve({ status: res.statusCode, data: { raw: data } });
                }
            });
        });
        
        req.on('error', (error) => {
            console.error('❌ Network error:', error.message);
            resolve({ status: 0, error: error.message });
        });
        
        if (postData) {
            req.write(postData);
        }
        
        req.end();
    });
}

// Test Suite
async function runTests() {
    console.log('\n🧪 VARK Learning Style System - API Tests\n');
    console.log('='.repeat(50));
    
    // Test 1: Health Check
    console.log('\n📍 Test 1: Server Health Check');
    const health = await apiCall('/api/health');
    if (health.status === 200) {
        console.log('✅ Server is running');
    } else {
        console.log('❌ Server not responding. Please run: npm run dev:server');
        console.log('   Make sure server is running on http://localhost:3000');
        return;
    }
    
    // Test 2: Create Test User (or Login)
    console.log('\n📍 Test 2: User Authentication');
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'password123';
    
    const signup = await apiCall('/api/auth/signup', 'POST', {
        name: 'Test User',
        email: testEmail,
        password: testPassword
    });
    
    if (signup.status === 201) {
        authToken = signup.data.token;
        console.log('✅ User created successfully');
        console.log(`   Email: ${testEmail}`);
        console.log(`   Default learning_style: ${signup.data.user.learningStyle}`);
    } else {
        console.log('❌ Signup failed:', signup.data.error);
        return;
    }
    
    // Test 3: Get Profile (Should include learning_style)
    console.log('\n📍 Test 3: Get User Profile');
    const profile = await apiCall('/api/user/profile', 'GET', null, true);
    
    if (profile.status === 200) {
        console.log('✅ Profile retrieved successfully');
        console.log(`   Name: ${profile.data.name}`);
        console.log(`   Learning Style: ${profile.data.learningStyle}`);
        console.log(`   XP: ${profile.data.xp}`);
    } else {
        console.log('❌ Profile fetch failed:', profile.data.error);
    }
    
    // Test 4: Update Learning Style to Visual
    console.log('\n📍 Test 4: Update Learning Style to "Visual"');
    const updateVisual = await apiCall('/api/user/vark', 'POST', {
        learning_style: 'Visual'
    }, true);
    
    if (updateVisual.status === 200) {
        console.log('✅ Learning style updated to Visual');
        console.log(`   Response: ${updateVisual.data.message}`);
    } else {
        console.log('❌ Update failed:', updateVisual.data.error);
    }
    
    // Test 5: Verify Update
    console.log('\n📍 Test 5: Verify Learning Style Update');
    const profileCheck = await apiCall('/api/user/profile', 'GET', null, true);
    
    if (profileCheck.status === 200 && profileCheck.data.learningStyle === 'Visual') {
        console.log('✅ Verification successful - Learning style is now "Visual"');
    } else {
        console.log('❌ Verification failed - Style did not update');
    }
    
    // Test 6: Update to Kinesthetic
    console.log('\n📍 Test 6: Update Learning Style to "Kinesthetic"');
    const updateKin = await apiCall('/api/user/vark', 'POST', {
        learning_style: 'Kinesthetic'
    }, true);
    
    if (updateKin.status === 200) {
        console.log('✅ Learning style updated to Kinesthetic');
    } else {
        console.log('❌ Update failed:', updateKin.data.error);
    }
    
    // Test 7: Invalid Learning Style
    console.log('\n📍 Test 7: Invalid Learning Style (Should Fail)');
    const updateInvalid = await apiCall('/api/user/vark', 'POST', {
        learning_style: 'InvalidStyle'
    }, true);
    
    if (updateInvalid.status === 400) {
        console.log('✅ Validation working - Invalid style rejected');
        console.log(`   Error: ${updateInvalid.data.error}`);
    } else {
        console.log('❌ Validation failed - Invalid style was accepted');
    }
    
    // Test 8: No Authentication (Should Fail)
    console.log('\n📍 Test 8: Access Without Token (Should Fail)');
    authToken = ''; // Clear token
    const noAuth = await apiCall('/api/user/vark', 'POST', {
        learning_style: 'Visual'
    }, true);
    
    if (noAuth.status === 401) {
        console.log('✅ Authentication working - Request rejected');
    } else {
        console.log('❌ Security issue - Unauthenticated request succeeded');
    }
    
    // MODULE 2: CONTENT TAGGING TESTS
    console.log('\n' + '='.repeat(50));
    console.log('📦 MODULE 2: Content Tagging Tests');
    console.log('='.repeat(50));
    
    // Test 9: Get All Content
    console.log('\n📍 Test 9: Get All Content');
    const allContent = await apiCall('/api/user/content', 'GET');
    
    if (allContent.status === 200 && allContent.data.content) {
        console.log(`✅ Retrieved ${allContent.data.content.length} content items`);
        const types = [...new Set(allContent.data.content.map(c => c.type))];
        console.log(`   Types found: ${types.join(', ')}`);
    } else {
        console.log('❌ Failed to retrieve content');
    }
    
    // Test 10: Filter by Type (video)
    console.log('\n📍 Test 10: Filter Content by Type (video)');
    const videoContent = await apiCall('/api/user/content?type=video', 'GET');
    
    if (videoContent.status === 200) {
        const videos = videoContent.data.content;
        const allAreVideos = videos.every(c => c.type === 'video');
        if (allAreVideos && videos.length > 0) {
            console.log(`✅ Retrieved ${videos.length} video(s) - All correct type`);
        } else {
            console.log('❌ Type filtering not working correctly');
        }
    } else {
        console.log('❌ Failed to filter by type');
    }
    
    // Test 11: Filter by Learning Style (Visual)
    console.log('\n📍 Test 11: Filter by Learning Style (Visual)');
    const visualContent = await apiCall('/api/user/content?learning_style=Visual', 'GET');
    
    if (visualContent.status === 200) {
        const items = visualContent.data.content;
        const correctTypes = items.every(c => c.type === 'video' || c.type === 'diagram');
        if (correctTypes && items.length > 0) {
            console.log(`✅ Retrieved ${items.length} Visual content (video/diagram)`);
        } else {
            console.log('❌ Learning style mapping not working');
        }
    } else {
        console.log('❌ Failed to filter by learning style');
    }
    
    // Test 12: Filter by Course
    console.log('\n📍 Test 12: Filter by Course Name');
    const courseContent = await apiCall('/api/user/content?course_name=' + encodeURIComponent('Data Structures'), 'GET');
    
    if (courseContent.status === 200) {
        const items = courseContent.data.content;
        const correctCourse = items.every(c => c.course_name === 'Data Structures');
        if (correctCourse && items.length > 0) {
            console.log(`✅ Retrieved ${items.length} items from Data Structures`);
        } else {
            console.log('❌ Course filtering not working');
        }
    } else {
        console.log('❌ Failed to filter by course');
    }
    
    // Test 13: Verify All VARK Types Exist
    console.log('\n📍 Test 13: Verify All VARK Types Present');
    if (allContent.status === 200) {
        const types = allContent.data.content.map(c => c.type);
        const requiredTypes = ['video', 'diagram', 'audio', 'text', 'quiz'];
        const missingTypes = requiredTypes.filter(t => !types.includes(t));
        
        if (missingTypes.length === 0) {
            console.log('✅ All required content types present');
            console.log('   video ✓, diagram ✓, audio ✓, text ✓, quiz ✓');
        } else {
            console.log(`❌ Missing types: ${missingTypes.join(', ')}`);
        }
    }
    
    // Final Summary
    console.log('\n' + '='.repeat(50));
    console.log('🎉 All Tests Complete! (Module 1 + Module 2)');
    console.log('='.repeat(50) + '\n');
}

// Run tests
console.log('⏳ Starting tests... (Make sure server is running on port 3000)\n');
runTests().catch(error => {
    console.error('\n❌ Test suite failed:', error);
});
