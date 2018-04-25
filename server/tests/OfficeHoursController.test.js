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

    describe('#saveOfficeHour',() => {

        // Prepare 3 users to deal with them as experts through out this tests group
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

        var expert3 = {
            email: 'expert3@hosting.net',
            password: 'creativePass',
            profile: {
                fullName: 'Expert Three'
            }
        };

        // Prepare 1 more user to use for sending most saveOfficeHour requests
        var normalUser = {
            email: 'shadolio@shadolioware.net',
            password: 'creativePass!!',
            profile: {
                fullName: 'Shadi Barghash'
            }
        };

        before((done) => {

            // Remove all users from the DB
            User.remove({})
            // Register expert1
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
            // Register expert2
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
            // Register expert3
            .then(() => {
                return request(app).post("/register").send({user: expert3}).expect(200);
            })
            // Make him expert
            .then((res) => {
                expert3 = res.body.user;
                return User.findByIdAndUpdate(expert3._id, { $push: { roles: 'expert' } }, { new: true });
            })
            .then((newExpert) => {
                expert3 = newExpert;
            })
            // Register the normal user to submit requests
            .then(() => {
                return request(app).post("/register").send({user: normalUser}).expect(200);
            })
            .then((res) => {
                normalUser = res.body.user;
            })
            // end "before" block
            .then(() => {
                done();
            })
            .catch((reason) => {
                console.log(reason);
                done(err);
            });
            
        });

        beforeEach((done) => {
            // Remove all Office Hours from the DB before each test case
            OfficeHours.remove({}).then(() => {
                done();
            }).catch((reason) => {
                console.log(reason);
                done(reason);
            });
        });

        it('should not allow guests to submit officeHour requests', (done) => {

            var body = {
                title: 'office hour request by an expert',
                description: 'testing that guests (not logged-in users) should not be allowed to make officeHour requests'
            };

            request(app)
            .post("/officeHour")
            .send(body)
            .expect(401, (err, res) => {
                if(err) {
                    console.log(err);
                    done(err);
                }
                else done();
            });
        });

        it('should not allow requests targeting with no experts field', (done) => {
            
            var body = {
                title: 'office hour request by an expert',
                description: 'testing that guests (not logged-in users) should not be allowed to make officeHour requests'
            };

            request(app)
            .post("/officeHour")
            .set({
                'x-auth': normalUser.tokens[0].token
            })
            .send(body)
            .expect(400, (err, res) => {
                if(err) {
                    console.log(err);
                    done(err);
                }
                else done();
            });
        });

        it('should not allow requests targeting 0 experts', (done) => {

            var body = {
                title: 'office hour request by an expert',
                description: 'testing that guests (not logged-in users) should not be allowed to make officeHour requests',
                experts: []
            };

            request(app)
            .post("/officeHour")
            .set({
                'x-auth': normalUser.tokens[0].token
            })
            .send(body)
            .expect(400, (err, res) => {
                if(err) {
                    console.log(err);
                    done(err);
                }
                else done();
            });
        });

        it('should not allow requests targeting any number of experts > 3', (done) => {
            var body = {
                title: 'office hour request by an expert',
                description: 'testing that guests (not logged-in users) should not be allowed to make officeHour requests',
                experts: [ expert1, expert2, expert3, expert1, expert2, expert3 ]
            };

            request(app)
            .post("/officeHour")
            .set({
                'x-auth': normalUser.tokens[0].token
            })
            .send(body)
            .expect(400, (err, res) => {
                if(err) {
                    console.log(err);
                    done(err);
                }
                else done();
            });
        });

        it('should not allow requests with no title', (done) => {
            var body = {
                description: 'testing that guests (not logged-in users) should not be allowed to make officeHour requests',
                experts: [ expert1, expert3 ]
            };

            request(app)
            .post("/officeHour")
            .set({
                'x-auth': normalUser.tokens[0].token
            })
            .send(body)
            .expect(400, (err, res) => {
                if(err) {
                    console.log(err);
                    done(err);
                }
                else done();
            });
        });

        it('should not allow requests with no description', (done) => {
            var body = {
                title: 'office hour request by an expert',
                experts: [ expert1, expert3 ]
            };

            request(app)
            .post("/officeHour")
            .set({
                'x-auth': normalUser.tokens[0].token
            })
            .send(body)
            .expect(400, (err, res) => {
                if(err) {
                    console.log(err);
                    done(err);
                }
                else done();
            });
        });

        it('should not allow requests with no title and no description', (done) => {
            var body = {
                experts: [ expert1, expert3 ]
            };

            request(app)
            .post("/officeHour")
            .set({
                'x-auth': normalUser.tokens[0].token
            })
            .send(body)
            .expect(400, (err, res) => {
                if(err) {
                    console.log(err);
                    done(err);
                }
                else done();
            });
        });

        it('should save in the DB one officeHour request for each targeted expert (3 experts)', (done) => {
            done();
        });

        it('should save in the DB one officeHour request for each targeted expert (2 experts)', (done) => {
            done();
        });

        it('should save the request with status: pending, and correct expert and other fields', (done) => {
            done();
        });

        it('should save only one request for each expert (no duplicates)', (done) => {
            done();
        });

        it('should not allow an expert to submit a request with him/herself',(done)=>{
            done();
        });

        after((done) => {
            // Remove all users and office hours from the DB
            User.remove({}).then(() => {
                OfficeHours.remove({});
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