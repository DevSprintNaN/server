const request = require('supertest');
const {server} = require('../server');

describe('Server Status', () => {
    afterAll(() => {
        server.close();
    });
    test('should return 200 OK when the server is active', async () => {
        const response = await request(server).get('/alive');
        expect(response.status).toBe(200);
    });
});
