process.env.NODE_ENV = 'test';
base = process.env.PWD;
const request = require('supertest');
const expect = require('expect');
var app = require("./../server").app;

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

        before((done) => {
            done();
        });

        beforeEach((done) => {
            done();
        });

        it('should not allow guests to submit officeHour requests', (done) => {
            done();
        });

        it('should not allow requests targeting 0 experts', (done) => {
            done();
        });

        it('should not allow requests targeting any number of experts > 3', (done) => {
            done();
        });

        it('should not allow requests with no title', (done) => {
            done();
        });

        it('should not allow requests with no description', (done) => {
            done();
        });

        it('should not allow requests with no title and no description', (done) => {
            done();
        });

        it('should save in the DB one officeHour request for each targeted expert (3 experts)', (done) => {
            done();
        });

        it('should save in the DB one officeHour request for each targeted expert (2 experts)', (done) => {
            done();
        });

        it('should save the request in the DB with the correct targeted expert and other fields', (done) => {
            done();
        });

        it('should save only one request for each expert (no duplicates)', (done) => {
            done();
        });

        it('should pass',(done)=>{
            done();
        });

        after((done) => {
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