process.env.NODE_ENV = 'test';
base = process.env.PWD;
const request = require('supertest');
const expect = require('expect');
var app = require("./../server").app;

describe('Review Controller',()=>{

    describe('#getReviewsOnUser',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

    describe('#postReview',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

});