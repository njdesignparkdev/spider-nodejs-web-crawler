#!/usr/bin/env node

/**
 * Test script for API Key Authentication
 * 
 * This script tests the /scrap endpoint with various authentication scenarios:
 * 1. Valid API key - should succeed
 * 2. Invalid API key - should return 401
 * 3. Missing API key - should return 401
 * 4. Health endpoint - should work without API key
 */

const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
const VALID_API_KEY = process.env.API_KEY || 'test-api-key-123';
const TEST_URL = 'https://example.com';

// Color codes for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testValidApiKey() {
    log('\n📝 Test 1: Valid API Key', 'cyan');
    try {
        const response = await axios.post(`${API_BASE_URL}/scrap`, {
            url: TEST_URL,
            mode: 'single'
        }, {
            headers: {
                'X-API-Key': VALID_API_KEY
            }
        });

        if (response.status === 200) {
            log('✅ PASS: Request with valid API key succeeded', 'green');
            log(`   Response: ${response.data.summary.totalPages} page(s) scraped`, 'green');
            return true;
        } else {
            log(`❌ FAIL: Unexpected status code ${response.status}`, 'red');
            return false;
        }
    } catch (error) {
        log(`❌ FAIL: ${error.message}`, 'red');
        if (error.response) {
            log(`   Error: ${error.response.data.message}`, 'red');
        }
        return false;
    }
}

async function testInvalidApiKey() {
    log('\n📝 Test 2: Invalid API Key', 'cyan');
    try {
        const response = await axios.post(`${API_BASE_URL}/scrap`, {
            url: TEST_URL,
            mode: 'single'
        }, {
            headers: {
                'X-API-Key': 'invalid-key-12345'
            },
            validateStatus: () => true // Don't throw on non-2xx status
        });

        if (response.status === 401 && response.data.code === 'INVALID_API_KEY') {
            log('✅ PASS: Invalid API key correctly rejected', 'green');
            log(`   Error code: ${response.data.code}`, 'green');
            return true;
        } else {
            log(`❌ FAIL: Expected 401 with INVALID_API_KEY, got ${response.status}`, 'red');
            return false;
        }
    } catch (error) {
        log(`❌ FAIL: ${error.message}`, 'red');
        return false;
    }
}

async function testMissingApiKey() {
    log('\n📝 Test 3: Missing API Key', 'cyan');
    try {
        const response = await axios.post(`${API_BASE_URL}/scrap`, {
            url: TEST_URL,
            mode: 'single'
        }, {
            validateStatus: () => true // Don't throw on non-2xx status
        });

        if (response.status === 401 && response.data.code === 'MISSING_API_KEY') {
            log('✅ PASS: Missing API key correctly rejected', 'green');
            log(`   Error code: ${response.data.code}`, 'green');
            return true;
        } else {
            log(`❌ FAIL: Expected 401 with MISSING_API_KEY, got ${response.status}`, 'red');
            return false;
        }
    } catch (error) {
        log(`❌ FAIL: ${error.message}`, 'red');
        return false;
    }
}

async function testHealthEndpoint() {
    log('\n📝 Test 4: Health Endpoint (No Auth Required)', 'cyan');
    try {
        const response = await axios.get(`${API_BASE_URL}/health`);

        if (response.status === 200 && response.data.status === 'OK') {
            log('✅ PASS: Health endpoint accessible without API key', 'green');
            log(`   Status: ${response.data.status}`, 'green');
            return true;
        } else {
            log(`❌ FAIL: Unexpected response from health endpoint`, 'red');
            return false;
        }
    } catch (error) {
        log(`❌ FAIL: ${error.message}`, 'red');
        return false;
    }
}

async function testStatusEndpoint() {
    log('\n📝 Test 5: Status Endpoint (No Auth Required)', 'cyan');
    try {
        const response = await axios.get(`${API_BASE_URL}/status`);

        if (response.status === 200 && response.data.status === 'OK') {
            log('✅ PASS: Status endpoint accessible without API key', 'green');
            log(`   Active requests: ${response.data.activeRequests}`, 'green');
            return true;
        } else {
            log(`❌ FAIL: Unexpected response from status endpoint`, 'red');
            return false;
        }
    } catch (error) {
        log(`❌ FAIL: ${error.message}`, 'red');
        return false;
    }
}

async function runAllTests() {
    log('═══════════════════════════════════════════════', 'blue');
    log('🧪 API Key Authentication Test Suite', 'blue');
    log('═══════════════════════════════════════════════', 'blue');
    log(`API Base URL: ${API_BASE_URL}`, 'yellow');
    log(`API Key: ${VALID_API_KEY.substring(0, 10)}...`, 'yellow');

    const results = [];

    // Run tests
    results.push(await testValidApiKey());
    results.push(await testInvalidApiKey());
    results.push(await testMissingApiKey());
    results.push(await testHealthEndpoint());
    results.push(await testStatusEndpoint());

    // Summary
    const passed = results.filter(r => r === true).length;
    const failed = results.filter(r => r === false).length;

    log('\n═══════════════════════════════════════════════', 'blue');
    log('📊 Test Summary', 'blue');
    log('═══════════════════════════════════════════════', 'blue');
    log(`Total Tests: ${results.length}`, 'yellow');
    log(`Passed: ${passed}`, passed === results.length ? 'green' : 'yellow');
    log(`Failed: ${failed}`, failed > 0 ? 'red' : 'green');

    if (passed === results.length) {
        log('\n🎉 All tests passed!', 'green');
        process.exit(0);
    } else {
        log('\n⚠️  Some tests failed', 'red');
        process.exit(1);
    }
}

// Check if server is running
async function checkServer() {
    try {
        await axios.get(`${API_BASE_URL}/health`, { timeout: 2000 });
        return true;
    } catch (error) {
        log(`\n❌ Server is not running at ${API_BASE_URL}`, 'red');
        log('Please start the server first with: node simple-api.js', 'yellow');
        log('Make sure to set API_KEY environment variable', 'yellow');
        return false;
    }
}

// Main execution
(async () => {
    const serverRunning = await checkServer();
    if (serverRunning) {
        await runAllTests();
    } else {
        process.exit(1);
    }
})();
