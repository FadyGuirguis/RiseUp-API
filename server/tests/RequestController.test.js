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

        // User instances to use in test cases.
        var admin_user = {}
        var expert_user = {}
        var normal_user = {}

        beforeEach(async () => {
            await User.remove({})

            let user = {
                email : 'example@example.com',
                password : 'password',
                roles : ['admin'],
                profile : {
                    "fullName" : 'Mo Salah'
                }
            };
            let res = await request(app)
                .post("/register")
                .send({user})
                .expect(200)
            admin_user = res.body.user;

            user = {
                email : 'example2@example.com',
                password : 'password',
                roles : ['expert'],
                profile : {
                    "fullName" : 'Roberto Firminio'
                }
            };
            res = await request(app)
                    .post("/register")
                    .send({user})
                    .expect(200)
                
            expert_user = res.body.user;

            user = {
                email : 'example3@example.com',
                password : 'password',
                profile : {
                    "fullName" : 'Roberto Firminio'
                }
            };
            res = await request(app)
            .post("/register")
            .send({user})
            .expect(200)
            normal_user = res.body.user
        }
    )

        it('should return 401 for a non admin user', async () => {
            let res = request(app)
            .get("/suspendExpert/" + expert_user._id)
            .set({'x-auth' : expert_user.tokens[0].token})
            .expect(401)
        })

        it('should return 200 for a valid request', async () => {
            let res = request(app)
            .get("suspendExpert/" + expert_user._id)
            .set({'x-auth' : admin_user.tokens[0].token})
            .expect(200)
        })

        it('should return 404 for a non exisiting id', async () => {
            let res = request(app)
            .get("suspendExpert/" + "22222222")
            .set({'x-auth' : admin_user.tokens[0].token})
            .expect(404)
        })

        it('should return 400 for a non expert user requested', async () => {
            let res = request(app)
            .get("suspendExpert/" + normal_user._id)
            .set({'x-auth' : admin_user.tokens[0].token})
            .expect(400)
        })


    })

});
