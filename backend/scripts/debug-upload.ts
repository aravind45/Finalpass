import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

async function run() {
    try {
        console.log('0. Registering new user...');
        const email = `test-${Date.now()}@example.com`;
        await axios.post('http://localhost:3000/api/auth/register', {
            email,
            password: 'password123',
            name: 'Test User',
            role: 'EXECUTOR',
            state: 'CA'
        });

        console.log('1. Logging in...');
        const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
            email,
            password: 'password123'
        });

        const token = loginRes.data.token;
        console.log('   Login successful, token:', token.substring(0, 20) + '...');

        console.log('2. Creating dummy file...');
        const filePath = path.join(process.cwd(), 'test-doc.txt');
        fs.writeFileSync(filePath, 'This is a test document content.');

        console.log('3. Uploading file...');
        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));
        form.append('type', 'TEST_DOC');

        const uploadRes = await axios.post('http://localhost:3000/api/documents/upload', form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('   Upload successful!', uploadRes.data);

        // Cleanup
        fs.unlinkSync(filePath);

    } catch (error: any) {
        console.error('ERROR:');
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        } else {
            console.error('   Message:', error.message);
        }
    }
}

run();
