//import { OfficeHours } from '../models/OfficeHour';
//import { User } from '../models/user'

process.env.NODE_ENV = 'test';
base = process.env.PWD;
const request = require('supertest');
const expect = require('expect');
var app = require("./../server").app;

//const mongoose = require('mongoose');

const {OfficeHours} = require('../models/OfficeHour');
const {User} = require('../models/user');




describe('Office Hours Controller',()=>{

    describe('#getOfficeHours',()=>{
        
        var user1 = {
            email : 'omarelmoghazy@someCompany.com',
            password : 'omarelmoghazy',
            profile : {
                fullName : "Omar Elmoghazy"
            }
        };

        var exp1 = {
            email : 'mostafaamer@someCompany.com',
            password : 'mostafaamer',
            profile : {
                fullName : "Mostafa Amer"
            }
        };

        /*var exp2 = {
            email : 'youssefsalah@someCompany.com',
            password : 'youssefsalah',
            profile : {
                fullName : "Youssef Salah"
            },
            roles: ['user'/*,'expert'*///]
        //};

        /*var exp3 = {
            email : 'mohamedhussein@someCompany.com',
            password : 'mohamedhussein',
            profile : {
                fullName : "Mohamed Hussein"
            },
            roles: ['user'/*,'expert'*///]
        //};


        before((done) => {

            // Remove all users from the DB
            User.remove({})
            // Register expert1
            .then(() => {
                return request(app).post("/register").send({user: exp1}).expect(200);
            })
            // Make him expert
            .then((res) => {
                exp1 = res.body.user;
                return User.findByIdAndUpdate(exp1._id, { $push: { roles: 'expert' } }, { new: true });
            })
            .then((newExpert) => {
                exp1 = newExpert;
            })
            // Register expert2
            /*.then(() => {
                return request(app).post("/register").send({user: exp2}).expect(200);
            })
            // Make him expert
            .then((res) => {
                exp2 = res.body.user;
                return User.findByIdAndUpdate(exp2._id, { $push: { roles: 'expert' } }, { new: true });
            })
            .then((newExpert) => {
                exp2 = newExpert;
            })
            // Register expert3
            .then(() => {
                return request(app).post("/register").send({user: exp3}).expect(200);
            })
            // Make him expert
            .then((res) => {
                exp3 = res.body.user;
                return User.findByIdAndUpdate(exp3._id, { $push: { roles: 'expert' } }, { new: true });
            })
            /*.then((newExpert) => {
                exp3 = newExpert;
            })*/
            // Register the normal user to submit requests
            .then(() => {
                return request(app).post("/register").send({user: user1}).expect(200);
            })
            .then((res) => {
                user1 = res.body.user;
            })
            // end "before" block
            .then(() => {
                done();
            })
            .catch((reason) => {
                console.log(reason);
                done(err);
            });
            
        });


        beforeEach((done) => {
            // Remove all Office Hours from the DB before each test case
            OfficeHours.remove({}).then(() => {
                done();
            }).catch((reason) => {
                console.log(reason);
                done(reason);
            });
        });
        
        it('should get office hours of the calling user if he is really a user',(done)=>{

            var off1 = {
                user : {
                    "_id" : user1._id,
                    "name" : "Omar Elmoghazy"
                },
                expert : {
                    "_id" : exp1._id,
                    "name" : "Mostafa Amer"
                }
            };

            
            off1 = new OfficeHours(off1);
            off1.save().then(()=>{
                request(app)
            .get('/officeHours')
            .set({'x-auth':user1.tokens[0].token})
            .send({user1})
            .expect(200)
            .expect((res)=>{
                OfficeHours.count({}, function( err, count){
                    console.log( "Number of users:", count );
                    expect(count).toBe(1);
                })
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                return done();
            })

            });
            done();
            })

            it('should not get any office hours if he is a guest, not a user',(done)=>{
                
                var user2 = {
                    email : 'ahmedelmoghazy@someCompany.com',
                    password : 'ahmedelmoghazy',
                    profile : {
                        fullName : "Ahmed Elmoghazy"
                    },
                    roles : []
                };
                user2 = new User(user2);

                var off1 = {
                    user : {
                        "_id" : user2._id,
                        "name" : "Ahmed Elmoghazy"
                    },
                    expert : {
                        "_id" : exp1._id,
                        "name" : "Mostafa Amer"
                    }
                };
    
                
                off1 = new OfficeHours(off1);
                off1.save().then(()=>{
                    request(app)
                .get('/officeHours')
                .send({user1})
                .expect(401)
                .expect((res)=>{
                    expect(res.body.msg).toBe('You are not a user or an expert');
                    expect(res.headers['x-auth']).toBeUndefined();
                    })
                    .end((err,res)=>{
                        if(err){
                            return done(err);
                        }
                        return done();
                    })
                });
                
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