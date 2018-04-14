const request = require('supertest');
const expect = require('expect');
var app = require("./../server").app;

const mongoose = require('mongoose');
User = mongoose.model('User');

process.env.NODE_ENV = 'test';
base = process.env.PWD;

describe('User Controller',()=>{

    describe('#createUser',()=>{

        beforeEach((done)=>{
            User.remove({}).then(()=>{
                done();
            })
        });

        it('should create user',(done)=>{
            var user = {
                email : 'something@something.com',
                password : 'something',
                profile : {
                    "fullName" : "Something Something"
                }
            }
        });
    })

    describe('#loginUser',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

    describe('#logout',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

    describe('#changePassword',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

    describe('#editProfile',()=>{
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