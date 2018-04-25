process.env.NODE_ENV = 'test';
base = process.env.PWD;
const request = require('supertest');
const expect = require('expect');
var app = require("./../server").app;

const mongoose = require('mongoose');
User = mongoose.model('User');

describe('Office Hours Controller', () => {

    describe('#getOfficeHours', () => {
        it('should pass', (done) => {
            done();
        });
    })

    describe('#getOfficeHour', () => {
        it('should pass', (done) => {
            done();
        });
    })

    describe('#getExperts', () => {

        var id;
        var token;

        beforeEach((done) => {
            User.remove({}).then(() => {
                var user = {
                    email: 'nothing@something.com',
                    password: 'something',
                    profile: {
                        "fullName": "Nothing Something"
                    }
                }

                var expert1 = {
                    email: 'daniel@gmail.com',
                    password: 'danielo',
                    profile: {
                        "fullName": "Daniel Achraf",
                        "expertIn": ["web"],
                    },
                    "roles" : ["user","expert"]
                }

                var expert2 = {
                    email: 'rony@gmail.com',
                    password: 'danielo',
                    profile: {
                        "fullName": "Rony Labib",
                        "expertIn": ["technology"]
                    },
                    "roles" : ["user","expert"]
                }

                var expert3 = {
                    email: 'fady@gmail.com',
                    password: 'danielo',
                    profile: {
                        "fullName": "Fady Sameh",
                        "expertIn": ["web", "technology"]
                    },
                    "roles" : ["user","expert"]
                }

                expert1 = new User(expert1);
                expert2 = new User(expert2);
                expert3 = new User(expert3);

                expert1.save().then(() => {
                    expert2.save().then(() => {
                        expert3.save().then(() => {
                            request(app)
                                .post("/register")
                                .send({ user })
                                .expect(200)
                                .end((err, res) => {
                                    id = res.body.user._id;
                                    token = res.headers['x-auth'];
                                    var user = {
                                        "profile": {
                                            "interests": ["web", "technology"]
                                        }
                                    };

                                    request(app)
                                        .post("/editProfile")
                                        .set('x-auth', token)
                                        .send({ user })
                                        .expect(200)
                                        .end((err, res) => {
                                            if (err) {
                                                return done(err);
                                            }
                                            expect(res.body.updatedUser.profile.interests[0]).toBe("web");
                                            expect(res.body.updatedUser.profile.interests[1]).toBe("technology");
                                            return done();
                                        })
                                })
                        })
                    })
                })

            })
        });

        it('should return bad request if no tags were passed',(done)=>{
            request(app)
            .post("/searchExperts")
            .set('x-auth',token)
            .expect(400)
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                expect(res.body.err).toBe("tags not recieved");
                return done();
            })
        });

        it('should return experts based on ANY of my interests if empty tags were passed',(done)=>{
        
            var tags = [];
            request(app)
            .post("/searchExperts")
            .send({tags})
            .set('x-auth',token)
            .expect(200)
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                expect(res.body.experts).toHaveLength(3);
                return done();
            })
        });

        it('should return experts that HAS tags based on ALL tags passed if not empty tags were passed',(done)=>{
        
            var tags = ["web","technology"];
            request(app)
            .post("/searchExperts")
            .send({tags})
            .set('x-auth',token)
            .expect(200)
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                expect(res.body.experts).toHaveLength(1);
                var names = []
                var i =0;
                for(let expert of res.body.experts){
                    names[i] = expert.profile.fullName;
                    i++
                }
                expect(names).toContain("Fady Sameh");
                return done();
            })
        });

        it('should return experts that HAS tags based on ALL tags passed if not empty tags were passed',(done)=>{
        
            var tags = ["web"];
            request(app)
            .post("/searchExperts")
            .send({tags})
            .set('x-auth',token)
            .expect(200)
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                expect(res.body.experts).toHaveLength(2);
                var names = []
                var i =0;
                for(let expert of res.body.experts){
                    names[i] = expert.profile.fullName;
                    i++
                }
                expect(names).toContain("Fady Sameh");
                expect(names).toContain("Daniel Achraf");
                return done();
            })
        });

        after((done)=>{
            User.remove({}).then(()=>{
                done()
            })
        });
    })

    describe('#saveOfficeHour',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

    describe('#acceptOfficeHour',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

    describe('#rejectOfficeHour',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

    describe('#confirmOfficeHour',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

});