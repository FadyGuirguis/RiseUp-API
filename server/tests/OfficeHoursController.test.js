//import { OfficeHours } from '../models/OfficeHour';
process.env.NODE_ENV = 'test';
base = process.env.PWD;
const request = require('supertest');
const expect = require('expect');
var app = require("./../server").app;
const {OfficeHours} = require('../models/user');
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