import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const secret = process.env._SECRET;
const expectedSecret = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30";

console.log('--- JWT CONFIG VERIFICATION ---');

if (secret === expectedSecret) {
    console.log('SUCCESS: JWT_SECRET in .env matches the provided token.');
} else {
    console.log('FAILURE: JWT_SECRET in .env does NOT match.');
    console.log('Current:', secret);
    console.log('Expected:', expectedSecret);
}

// Test Sign and Verify
try {
    const token = jwt.sign({ id: 123, role: 'test' }, secret, { expiresIn: '1h' });
    const decoded = jwt.verify(token, secret);
    console.log('SUCCESS: Token generation and verification with new secret works.');
} catch (e) {
    console.error('FAILURE: Token test failed:', e.message);
}
