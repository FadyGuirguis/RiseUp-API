process.env.NODE_ENV = 'test';
base = process.env.PWD;
const request = require('supertest');
const expect = require('expect');
var app = require("./../server").app;
const mongoose = require('mongoose');
const { User } = require('../models/user');
const { Announcement } = require('../models/Announcement');
describe('Announcement Controller', () => {

    describe('#getAllAnnouncements', () => {
        var ann;
        beforeEach((done) => {
            Announcement.remove().then(() => {
                ann = new Announcement({
                    title: "ask expert ",
                    description: "about nothing"
                });

                ann.save().then((doc) => {
                    ann = doc;
                    done();
                })
                    .catch((err) => {
                        console.log(err);
                    });
            }).catch((err) => {
                done(err);
            })
        });


        it('Anyone can see the announcements (No token needed)', (done) => {
            request(app)
                .get('/announcements')
                .expect(200)
                .end((err, res) => {
                    if (err)
                        done(err);
                    else {
                        expect(res.body.announcements.length).toBe(1);
                        done();
                    }
                });
        });



        after((done) => {
            Announcement.remove({}).then((res) => {
                User.remove({}).then((res) => {
                    done();
                })

            }).catch((err) => {
                console.log(err);
            })
        });


    })

    describe('#postAnnouncement', () => {
        var users = [];
        var testUsers = [
            {
                email: 'test@test.com',
                password: '123456',
                roles: ["user"],
                profile: {
                    interests: ["testing"]
                }
            },
            {
                email: 'tests@test.com',
                password: '123456',
                roles: ["admin"],
                profile: {
                    expertIn: ["testing"]
                }
            }
        ];
        var testTokens = [];


        before((done) => {
            User.remove().then(() => {
                var testUser1 = new User(testUsers[0]);

                testUser1.save().then(() => {

                    testUser1.generateAuthToken().then((Token1) => { //
                        testTokens.push(Token1);
                        var testUser2 = new User(testUsers[1]);

                        testUser2.save().then(() => {

                            testUser2.generateAuthToken().then((Token2) => {
                                testTokens.push(Token2);
                                done();
                            })
                        })
                    })
                })
            })
        })



        it('A non-admin cannot post announcements', (done) => {
            request(app)
                .post(`/announcement`)
                .set('x-auth', testTokens[0])
                .expect(403)
                .expect((res) => {
                    expect(JSON.parse(res.text).msg).toBe('You are not an Admin.')
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    Announcement.find({}).then((announcements) => {
                        expect(announcements.length).toBe(0);
                        return done();
                    })
                })
        })
        it('An admin can post an announcement', (done) => {
            var announcement = {
                title: "ANNOUNCEMENT",
                description: "DESC"
            }
            request(app)
                .post('/announcement')
                .set('x-auth', testTokens[1])
                .expect(200)
                .send({ announcement })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    Announcement.find({}).then((announcements) => {
                        expect(announcements.length).toBe(1);
                        expect(announcements[0].title).toBe("ANNOUNCEMENT");
                        expect(announcements[0].description).toBe("DESC");
                        return done();
                    })
                })
        });
    });

    describe('#deleteAnnouncement', () => {
        var admin = {
            email: 'admin@admin.com',
            password: 'something',
            profile: {
                "fullName": "Admin Admin"
            }
        };
        var user = {
            email : 'user@user.com',
            password : 'useruser',
            profile : {
                "fullName" : "User User"
            },
            role: ['user']
        }
        var an = {
            title: 'title',
            description: 'description'
        }
        var an2 = {
            title : 'title2',
            description : 'description2'
        }
        before((done)=>{
            User.remove({}).then(()=>{
                request(app).post('/register').send({user:admin}).expect(200).end((err,res)=>{
                    if(err){
                        return done(err);
                    }
                    admin = res.body.user;

                    User.findByIdAndUpdate(res.body.user._id,{roles:['admin']},{ new:true }).then(()=>{

                        request(app).post('/register').send({ user: user }).expect(200).end((err, res) => {
                            if (err) {
                                return done(err);
                            }
                            user = res.body.user;
                            Announcement.remove({}).then(() => {
                                an = new Announcement(an);
                                an.save().then(() => {
                                    an2 = new Announcement(an2);
                                    an2.save().then(() => {
                                        return done();
                                    })
                                })


                            })
                        })

                    })
                })
            })
        });

        it('An Admin can delete an announcement', (done) => {
            Announcement.find({}).then((ans) => {
                request(app).delete('/announcement/' + ans[0]._id + '').set({ 'x-auth': admin.tokens[0].token }).expect(200).end((err, res) => {
                    //console.info(res.status+' '+res.res.text);   
                    if (err) {
                        return done(err);
                    }
                    else{
                        Announcement.find({}).then((ans) => {
                            expect(ans.length).toBe(1);
                            return done();
                        })                                             
                    }
                })
            })
        });

        it('A non-admin cant delete an anouncement', (done) => {
            Announcement.find({}).then((ans) => {
                request(app).delete('/announcement/' + ans[0]._id + '').set({ 'x-auth': user.tokens[0].token }).expect(403).end((err, res) => {
                    //console.info(res.status+' '+res.res.text);   
                    if (err) {
                        return done(err);
                    }
                    else{
                        Announcement.find({}).then((oba) => {
                            expect(oba.length).toBe(1);
                            done();
                        })
                    } 
                })
            })
        });
    })
})