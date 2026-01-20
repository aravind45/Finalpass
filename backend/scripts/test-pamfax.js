import axios from 'axios';
const USERNAME = "AravindThiyagarajan";
const PASSWORD = "skipgygotaxytion9545";
const BASE_URLS = [
    "https://sandbox-api.pamfax.biz",
    "https://sandbox-api.pamfax.biz/v1",
    "https://api.pamfax.biz",
    "https://api.pamfax.biz/v1"
];
console.log('Testing PamFax Connection...');
async function testPamFax() {
    for (const url of BASE_URLS) {
        console.log(`\nTesting Base URL: ${url}`);
        try {
            // Test 1: User/Login
            console.log(`  Trying POST ${url}/User/Login ...`);
            const loginRes = await axios.post(`${url}/User/Login`, {
                username: USERNAME,
                password: PASSWORD
            }, { timeout: 5000 });
            console.log('✅ SUCCESS!');
            console.log('  Data:', JSON.stringify(loginRes.data, null, 2));
            return; // Exit on success
        }
        catch (e) {
            console.log(`  ❌ Failed: ${e.message}`);
            if (e.response) {
                console.log(`     Status: ${e.response.status}`);
                console.log(`     Data: ${JSON.stringify(e.response.data)}`);
            }
        }
    }
    console.log('\nAll attempts failed.');
}
testPamFax();
//# sourceMappingURL=test-pamfax.js.map