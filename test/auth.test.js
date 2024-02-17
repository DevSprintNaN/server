const request = require('supertest');
const { server } = require('../server');
const User = require('../models/User.model');
const assert = require('assert');

describe('User Authentication', function () {

    it('should register a new user', function (done) {
        request(server)
            .post('/auth/register')
            .send({ username:"test",email: "testUser@gmail.com", password: "Testing123@" })
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('should login a new user', function (done) {
        request(server)
            .post('/auth/login')
            .send({ email: "testUser@gmail.com", password: "Testing123@" })
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('should fail to login an invalid user', function (done) {
        request(server)
            .post('/auth/login')
            .send({ email: "testUserNULL@gmail.com", password: "Testing123@NULL" })
            .expect(401)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('should delete all test users from Test database', async function () {

        const emailToDelete = 'testUser@gmail.com'; 

        await User.deleteMany({ email: emailToDelete });

        const count = await User.countDocuments({ email: emailToDelete });
        assert.strictEqual(count, 0);
    });
});
