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
        //-------------------------Declarations---------------------------------------
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
            email : ' ',
            password : ' ',
            profile : {
                "fullName" : " "
            }
        };
        var ResAdmin ={
            email : ' ',
            password : ' ',
            profile : {
                "fullName" : " "
            }
        };
        var req = {
            description:"Testing Descp"
        };

        //------------------------------Before------------------------------------
        before((done)=>{
            //---------------Remove All Users------------------------------------
            User.remove({}).then(()=>{
                //---------------Register Admin-----------------
                request(app).post("/register").send({ user: admin }).expect(200).end((err,res)=>{
                    if(err){
                        return done(err);
                    }
                    ResAdmin = res.body.user;
                    //------------------Update Admins Roles--------------------------
                    User.findByIdAndUpdate(ResAdmin._id, { roles: ['admin'] }, { new: true }).then(()=>{
                        //---------------------Register User-----------------------
                        request(app).post("/register").send({ user }).expect(200).end((err,res)=>{
                            if(err){
                                return done(err);
                            }
                            ResUser = res.body.user;
                            return done();
                        })
                        //---------------------------------------------------------
                    })
                    //------------------------------------------------
                })
                //------------------------------------
            }).catch((reason) => {
                console.log(reason);
                done(err);
            });
        });

        //---------------------------Before Each-----------------------------------
        beforeEach((done)=>{
            //--------------------Remove All Requests-------------
            Request.remove({}).then(()=>{
              done();  
            });
            //-----------------------------------------------------
        });
        //--------------------Test Case 1---------------------------------
        it('There is no request available with such id',(done)=>{
            var dummyRequestId = ResUser._id; 
            request(app).post('/rejectRequest/'+dummyRequestId+'').set({'x-auth':ResAdmin.tokens[0].token}).send(req).expect(404).end((err,res)=>{
                if(err){
                    return done(err);
                }
                Request.count({},(err, count) => {
                    expect(count).toBe(0);
                    expect(res.res.text).toBe('There is no request available with such id');
                    return done();
                })
            });
        });
        //--------------------Test Case 2--------------------------------
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
                        Request.find({}).then((Reqs)=>{
                            expect(Reqs.length).toBe(1);
                            expect(Reqs[0].status).toBe('Rejected');
                            return done();
                        })
                    });
                    //------------------------------------------------------------
                    
                });
            });
        });
        //-------------------------Test Case 3-------------------------------
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
                                Request.find({}).then((Reqs) => {
                                    expect(Reqs.length).toBe(1);
                                    expect(res.res.text).toBe('This request is already evaluated');
                                    return done();
                                })
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