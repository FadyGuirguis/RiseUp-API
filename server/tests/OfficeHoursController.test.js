//import { OfficeHours } from '../models/OfficeHour';
process.env.NODE_ENV = 'test';
base = process.env.PWD;
const request = require('supertest');
const expect = require('expect');
var app = require("./../server").app;
const {OfficeHours} = require('../models/OfficeHour');
const {User} = require('../models/user');

describe('Office Hours Controller',()=>{

    describe('#getOfficeHours',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

    describe('#getOfficeHour',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

    describe('#getExperts',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

    describe('#saveOfficeHour',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

    describe('#acceptOfficeHour', () => {

        // Prepare two expert users and one normal user to be used in this test group
        var expert1 = {
            email: 'expert1@hosting.net',
            password: 'creativePass',
            profile: {
                fullName: 'Expert One'
            }
        };

        var expert2 = {
            email: 'expert2@hosting.net',
            password: 'creativePass',
            profile: {
                fullName: 'Expert Two'
            }
        };

        var normalUser = {
            email: 'shadolio@shadolioware.net',
            password: 'creativePass!!:D',
            profile: {
                fullName: 'Shadi Barghash'
            }
        };

        // Prepare a pending officeHour that the DB will start with to use for tests
        var officeHourWithExp1 = null;

        before((done) => {
            // Remove all users from the DB
            User.remove({})
            // Register expert 1
            .then(() => {
                return request(app).post("/register").send({user: expert1}).expect(200);
            })
            // Make him expert
            .then((res) => {
                expert1 = res.body.user;
                return User.findByIdAndUpdate(expert1._id, { $push: { roles: 'expert' } }, { new: true });
            })
            .then((newExpert) => {
                expert1 = newExpert;
            })
            // Register expert 2
            .then(() => {
                return request(app).post("/register").send({user: expert2}).expect(200);
            })
            // Make him expert
            .then((res) => {
                expert2 = res.body.user;
                return User.findByIdAndUpdate(expert2._id, { $push: { roles: 'expert' } }, { new: true });
            })
            .then((newExpert) => {
                expert2 = newExpert;
            })
            // TODO: Register normalUser
            .then(() => {
                return request(app).post("/register").send({user: normalUser}).expect(200);
            })
            .then((res) => {
                normalUser = res.body.user;
            })
            .then(() => {
                done();
            })
            .catch((reason) => {
                console.log(reason);
                done(reason);
            });
        });

        beforeEach((done) => {
            // Remove any OfficeHours from the DB
            OfficeHours.remove({})
            // Create a new officeHour and save to DB to use for testing
            .then(() => {

                var newOfficeHour = {
                    title: 'Embedded Systems',
                    description: 'I wish to work in IoT and Embedded Systems of cars and other vehicles',
                    status: 'pending',
                    user: {
                        _id: normalUser._id,
                        name: normalUser.profile.fullName
                    },
                    expert: {
                        _id: expert1._id,
                        name: expert1.profile.fullName
                    },
                    createdOn: new Date(),
                    lastModified: new Date()
                };
                
                return new OfficeHours(newOfficeHour).save();
            })
            .then((newOfficeHour) => {
                officeHourWithExp1 = newOfficeHour;
                done();
            })
            .catch((reason) => {
                console.log(reason);
                done(reason);
            });
        });

        it('should not allow a non-logged in user to accept officeHour request', (done) => {

            var body = {
                officeHour: {
                    suggestedSlots: {
                        slots: [ new Date(2018, 4, 28), new Date(2018, 5, 5), new Date(2018, 6, 17) ]
                    }
                }
            };
            
            request(app)
            .post("/acceptOfficeHour/" + officeHourWithExp1._id)
            .send(body)
            .expect(401)
            // Make sure our officeHour doc is still the on in DB with status unchanged
            .then(() => {
                return OfficeHours.find({});
            })
            .then((results) => {
                expect(results).toBeTruthy();
                expect(results.length).toEqual(1);

                var officeHour = results[0];

                expect(officeHour._id).toEqual(officeHourWithExp1._id);
                expect(officeHour.status).toEqual('pending');
            })
            .then(() => {
                done();
            })
            .catch((reason) => {
                console.log(reason);
                done(reason);
            });
        });

        it('should not allow a non-expert user to accept officeHour request', (done) => {
            var body = {
                officeHour: {
                    suggestedSlots: {
                        slots: [ new Date(2018, 4, 28), new Date(2018, 5, 5), new Date(2018, 6, 17) ]
                    }
                }
            };
            
            request(app)
            .post("/acceptOfficeHour/" + officeHourWithExp1._id)
            .set({
                'x-auth': normalUser.tokens[0].token
            })
            .send(body)
            .expect(403)
            // Make sure our officeHour doc is still the on in DB with status unchanged
            .then(() => {
                return OfficeHours.find({});
            })
            .then((results) => {
                expect(results).toBeTruthy();
                expect(results.length).toEqual(1);

                var officeHour = results[0];

                expect(officeHour._id).toEqual(officeHourWithExp1._id);
                expect(officeHour.status).toEqual('pending');
            })
            .then(() => {
                done();
            })
            .catch((reason) => {
                console.log(reason);
                done(reason);
            });
        });

        it('should not allow an expert user to accept officeHours not targeting him/her', (done) => {
            var body = {
                officeHour: {
                    suggestedSlots: {
                        slots: [ new Date(2018, 4, 28), new Date(2018, 5, 5), new Date(2018, 6, 17) ]
                    }
                }
            };
            
            request(app)
            .post("/acceptOfficeHour/" + officeHourWithExp1._id)
            .set({
                'x-auth': expert2.tokens[0].token
            })
            .send(body)
            .expect(400)
            // Make sure our officeHour doc is still the on in DB with status unchanged
            .then(() => {
                return OfficeHours.find({});
            })
            .then((results) => {
                expect(results).toBeTruthy();
                expect(results.length).toEqual(1);

                var officeHour = results[0];

                expect(officeHour._id).toEqual(officeHourWithExp1._id);
                expect(officeHour.status).toEqual('pending');
            })
            .then(() => {
                done();
            })
            .catch((reason) => {
                console.log(reason);
                done(reason);
            });
        });

        it('should not allow accepts with no "officeHours" in the body', (done) => {
            done();
        });

        it('should not allow accepts with no "suggestedSlots.slots" in body.officeHours', (done) => {
            done();
        });

        it('should not allow accepts with empty suggestedSlots.slots', (done) => {
            done();
        });

        it('should not allow accepts with more than 3 suggested slots', (done) => {
            done();
        });

        it('should not allow accepts for an officeHour that is not originally "pending"', (done) => {
            done();
        });

        it('should update the officeHour in the DB correctly if the accept request is OK.', (done) => {
            done();
        });

        after((done) => {
            // At the end of this test group, remove all office hours from the DB..
            OfficeHours.remove({})
            // then remove as well all users we created.
            .then(() => {
                return User.remove({});
            })
            .then(() => {
                done();
            })
            .catch((reason) => {
                console.log(reason);
                done(reason);
            })
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