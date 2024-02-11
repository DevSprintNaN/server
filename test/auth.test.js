const request = require('supertest');
const { server } = require('../server');
const User = require('../models/User.model');
const assert = require('assert');

describe('User Authentication', function () {

    it('should register a new user', function (done) {
        request(server)
            .post('/auth/register')
            .send({ email: "testUser", password: "Testing123@" })
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('should login a new user', function (done) {
        request(server)
            .post('/auth/login')
            .send({ email: "testUser", password: "Testing123@" })
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('should fail to login an invalid user', function (done) {
        request(server)
            .post('/auth/login')
            .send({ email: "testUserNULL", password: "Testing123@NULL" })
            .expect(401)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('should delete all users from Test database', async function () {

        await User.deleteMany();
        const count = await User.countDocuments();
        assert.strictEqual(count, 0);
    });
});
