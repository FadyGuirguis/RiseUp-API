process.env.NODE_ENV = 'test';
base = process.env.PWD;
const request = require('supertest');
const expect = require('expect');
var app = require("./../server").app;

describe('Tag Controller',()=>{

    describe('#addTag',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

    describe('#getAllTags',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

});