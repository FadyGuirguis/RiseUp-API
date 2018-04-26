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

        // Prepare as well an officeHour that will be used in each test as already existing in the DB
        var officeHourWithExp1 = {
            title: 'Embedded Systems',
            description: 'I wish to work in IoT and Embedded Systems of cars and other vehicles',
            status: 'pending',
            createdOn: new Date(),
            lastModified: new Date()
        };

        before((done) => {
            // Remove all users from the DB
            User.remove({})
            // TODO: Register expert 1
            // TODO: Make him expert
            // TODO: Register expert 2
            // TODO: Make him expert
            // TODO: Register normalUser
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
            // TODO: Add the ones used for testing (after assigning to them the expert and normalUser)
            .then(() => {
                done();
            })
            .catch((reason) => {
                console.log(reason);
                done(reason);
            });
        });

        it('should not allow a non-logged in user to accept officeHour request', (done) => {
            done();
        });

        it('should not allow a non-expert user to accept officeHour request', (done) => {
            done();
        });

        it('should not allow an expert user to accept officeHours not targeting him/her', (done) => {
            done();
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