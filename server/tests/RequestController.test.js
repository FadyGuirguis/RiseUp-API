process.env.NODE_ENV = 'test';
base = process.env.PWD;
const request = require('supertest');
const expect = require('expect');
var app = require("./../server").app;

const {User} = require("../models/user");
const {Request} = require("../models/request");
const {ObjectId} = require('mongodb');

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
        var admin = {
            email : 'admin@admin.com',
            password : 'something',
            profile : {
                "fullName" : "Admin Admin"
            }
        };
        var user = {
            email : 'Mohamed@admin.com',
            password : 'something',
            profile : {
                "fullName" : "Mohamed Hesham"
            }
        };

        var ResUser ={
            email : 'mostafa@something.com',
            password : 'something',
            profile : {
                "fullName" : "Mostafa Amer"
            }
        };
        var ResAdmin ={
            email : 'Joe@something.com',
            password : 'something',
            profile : {
                "fullName" : "Joe salah"
            }
        };
        var req = {
            description:"Testing Descp"
        };

        before((done)=>{
            User.remove({})

            .then(()=>{
                return request(app).post("/register").send({user:admin}).expect(200);
            })

            .then((res)=>{
                ResAdmin = res.body.user;
                return User.findByIdAndUpdate(ResAdmin._id,{roles:['admin']},{ new:true });
            })
            .then(()=>{
                return request(app).post("/register").send({user}).expect(200);
            })

            .then((res)=>{
                ResUser = res.body.user;
            })
            .then(() => {
                done();
            })
            .catch((reason) => {
                console.log(reason);
                done(err);
            });
        });
        beforeEach((done)=>{
            Request.remove({}).then(()=>{
              done();  
            });
        });
        it('Remove Request without User',(done)=>{
            var dummyRequestId = ResUser._id; 
            request(app).post('/rejectRequest/'+dummyRequestId+'').set({'x-auth':ResAdmin.tokens[0].token}).send(req).expect(404).end((err,res)=>{
                if(err){
                    return done(err);
                }
                expect(res.res.text).toBe('There is no request available with such id');
                return done();
            });
        });
        it('Suceed',(done)=>{
            request(app).post('/request').set({'x-auth':ResUser.tokens[0].token}).send({request:req}).expect(200).end((err,res)=>{
                if(err){
                    return done(err);
                }
                Request.find({}).then((res)=>{
                    //------------------------------------------------------------
                    request(app).post('/rejectRequest/'+res[0]._id+'').set({'x-auth':ResAdmin.tokens[0].token}).send(res[0]).expect(200).end((err,res)=>{
                        if(err){
                            return done(err);
                        }
                        return done();
                    });
                    //------------------------------------------------------------
                    
                });
            });
        });
        it('shouldnot be able to reject a not pending Request ',(done)=>{
            request(app).post('/request').set({'x-auth':ResUser.tokens[0].token}).send({request:req}).expect(200).end((err,res)=>{
                if(err){
                    return done(err);
                }
                Request.find({}).then((res)=>{
                    //------------------------------------------------------------
                    var Resreq = res[0];
                    Resreq.status = 'accepted';
                    Resreq.save().then(()=>{
                        Request.find({}).then((res)=>{
                            //----------------------------------------------------
                            request(app).post('/rejectRequest/'+res[0]._id+'').set({'x-auth':ResAdmin.tokens[0].token}).send(res[0]).expect(400).end((err,res)=>{
                                if(err){
                                    return done(err);
                                }
                                expect(res.res.text).toBe('This request is already evaluated');
                                return done();
                            });
            
                            //----------------------------------------------------
                        });
                    })
                    //------------------------------------------------------------
                    
                });
            });
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