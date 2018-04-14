process.env.NODE_ENV = 'test';
base = process.env.PWD;
const request = require('supertest');
const expect = require('expect');
var app = require("./../server").app;

describe('User Controller',()=>{

    describe('#editProfile',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

    describe('#createUser',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

    describe('#loginUser',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

    describe('#searchByName',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

    describe('#getUserByID',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

});