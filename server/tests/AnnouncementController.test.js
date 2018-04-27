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
        it('should pass', (done) => {
            done();
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
                    return done();
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
                    return done();
                })
        })

        describe('#deleteAnnouncement', () => {
            var admin = {
                email: 'admin@admin.com',
                password: 'something',
                profile: {
                    "fullName": "Admin Admin"
                }
            };

            var user = {
                email: 'user@user.com',
                password: 'something',
                profile: {
                    "fullName": "User User"
                }
            }

            var an = {
                title: 'title',
                description: 'description'
            }
            before((done) => {
                User.remove({}).then(() => {
                    request(app).post('/register').send({ user: admin }).expect(200).end((err, res) => {
                        if (err) {
                            return done(err);
                        }
                        admin = res.body.user;
                        User.findByIdAndUpdate(res.body.user._id, { roles: ['admin'] }, { new: true }).then(() => {
                            Announcement.remove({}).then(() => {
                                an = new Announcement(an);
                                an.save().then(() => {

                                    request(app).post('/register').send({ user: user }).expect(200).end((err, res) => {
                                        if (err) {
                                            return done(err);
                                        }
                                        user = res.body.user;
                                        User.findByIdAndUpdate(res.body.user._id, { roles: ['user'] }, { new: true }).then(() => {
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
                        return done();
                    })
                })
            });

            it('A non-admin cant delete an anouncement', (done) => {
                Announcement.find({}).then((ans) => {
                    request(app).delete('/announcement/' + 'sdklnas7y').set({ 'x-auth': user.tokens[0].token }).expect(403).end((err, res) => {
                        //console.info(res.status+' '+res.res.text);   
                        if (err) {
                            return done(err);
                        }
                        return done();
                    })
                })
            });
        })
    });
})