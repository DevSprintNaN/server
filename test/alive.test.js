const request = require('supertest');
const {server} = require('../server');

describe('Server Status', () => {
    
    it('should return 200 OK when the server is active', (done) => {
        request(server)
        .get('/alive')
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            done();
          });
    });
});
