// test.js
const request = require('supertest');
const app = require('./index');

describe('Testing Discord RPC endpoints', () => {
    it('should respond with "Pong!" when hitting /rpc/ping', async () => {
        const res = await request(app).get('/rpc/ping');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('Pong!');
    });

    it('should handle invalid data when hitting /rpc/change', async () => {
        const res = await request(app)
            .post('/rpc/change')
            .send({ invalidKey: 'invalidData' });
        expect(res.statusCode).toEqual(400);
    });
});