process.env.NODE_ENV = 'test';
base = process.env.PWD;
const request = require('supertest');
const expect = require('expect');
var app = require("./../server").app;

describe('Announcement Controller',()=>{

    describe('#getAllAnnouncements',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

    describe('#postAnnouncement',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

    describe('#deleteAnnouncement',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

});