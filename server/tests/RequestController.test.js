process.env.NODE_ENV = 'test';
base = process.env.PWD;
const request = require('supertest');
const expect = require('expect');
var app = require("./../server").app;

const mongoose = require('mongoose');
User = mongoose.model('User');
Request = mongoose.model('Request');

describe('Request Controller',()=>{

    describe('#getAllRequests',()=>{
        var token = "";
        var user = {
            email: 'test1@rise.com',
            password: 'ab1234',
            roles: ["user"]
        };
        var requests = {
            description: 'unique'
        }
        before((done) => {
            Request.remove().then(() => {
                requests = new Request(requests);
                requests.save().then(() => {
                    User.remove().then(() => {
                        user = new User(user);
                        user.save().then(() => {
                            var email = 'test1@rise.com';
                            var password = 'ab1234';
                            request(app)
                                .post('/login')
                                .send({email, password})
                                .end((err, res) => {
                                    token = res.headers['x-auth']
                                    return done();
                                })
                        })
                    })
                })
            })
        })

        it('should not get requests',(done)=>{
            request(app)
                .get('/requests')
                .set('x-auth', token + 'a')
                .expect(403)
            done();
        });

        it('should get requests',(done) => {
            request(app)
                .get('/requests')
                .set('x-auth', token)
                .expect(200)
                .expect((res) => {
                    expect(res.length).toBe(1);
                })
            done();
        })
    })

    describe('#addRequest',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

    describe('#rejectRequest',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

    describe('#acceptRequest',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

    describe('#suspendExpert',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

});
