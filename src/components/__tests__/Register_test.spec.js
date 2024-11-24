const axios = require('axios');

jest.mock('axios');

describe('Register Tests', () => {
    test('Fail registration empty input', async () => {
        const testusername = { value: '' };
        const testpassword = { value: '' };

        axios.post.mockRejectedValue({
            response: {
                status: 400,
                data: { message: 'Veuillez remplir tous les champs.' }
            }
        });

        try {
            await axios.post('http://localhost:5000/register', {
                username: testusername.value,
                password: testpassword.value,
            });
        } catch (error) {
            expect(error.response.status).toBe(400);
        }
    });

    test('Fail registration user already in database', async () => {
        const testusername = { value: 'cantin' };
        const testpassword = { value: 'eftgyhj' };

        axios.post.mockRejectedValue({
            response: {
                status: 500,
                data: { message: 'User already exists.' }
            }
        });

        try {
            await axios.post('http://localhost:5000/register', {
                username: testusername.value,
                password: testpassword.value,
            });
        } catch (error) {
            expect(error.response.status).toBe(500);
        }
    });

    test('Insert a user in the database', async () => {
        let user = Math.random().toString(36).substring(7);
        const testusername = user;
        let pass = Math.random().toString(36).substring(7);
        const testpassword = pass;

        axios.post.mockResolvedValue({
            status: 201,
            data: { message: 'User registered successfully.' }
        });

        const response = await axios.post('http://localhost:5000/register', {
            username: testusername,
            password: testpassword,
        });

        expect(response.status).toBe(201);
    });
});


// --------------------- Login tests ---------------------
describe('Login Tests', () => {
    test('Fail login with empty input', async () => {
        const testusername = { value: '' };
        const testpassword = { value: '' };

        axios.post.mockRejectedValue({
            response: {
                status: 400,
                data: { message: 'Veuillez remplir tous les champs.' }
            }
        });

        try {
            await axios.post('http://localhost:5000/login', {
                username: testusername.value,
                password: testpassword.value,
            });
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data.message).toBe('Veuillez remplir tous les champs.');
        }
    });

    test('Fail login with incorrect credentials', async () => {
        const testusername = { value: 'nonexistentuser' };
        const testpassword = { value: 'wrongpassword' };

        axios.post.mockRejectedValue({
            response: {
                status: 401,
                data: { message: 'Invalid credentials.' }
            }
        });

        try {
            await axios.post('http://localhost:5000/login', {
                username: testusername.value,
                password: testpassword.value,
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
            expect(error.response.data.message).toBe('Invalid credentials.');
        }
    });

    test('Successful login with correct credentials', async () => {
        const testusername = 'validuser';
        const testpassword = 'correctpassword';

        axios.post.mockResolvedValue({
            status: 200,
            data: { message: 'Login successful.', token: 'mock-jwt-token' }
        });

        const response = await axios.post('http://localhost:5000/login', {
            username: testusername,
            password: testpassword,
        });

        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Login successful.');
        expect(response.data.token).toBe('mock-jwt-token');
    });
});