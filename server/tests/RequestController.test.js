process.env.NODE_ENV = 'test';
base = process.env.PWD;
const request = require('supertest');
const expect = require('expect');
var app = require("./../server").app;

describe('Request Controller',()=>{

    describe('#getAllRequests',()=>{
        it('should pass',(done)=>{
            done();
        });
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