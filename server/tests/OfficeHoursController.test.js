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
                title: 'title',
                description : 'description',
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
                    title:'title',
                    description : 'desc',
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
                    expect(res.headers['x-auth']).toBeUndefined();
                    })
                    .end((err,res)=>{
                        if(err){
                            return done(err);
                        }
                        return done();
                    })
                });                
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

    //Creating all the users needed for the test cases
    var user = {
        email : 'user@something.com',
        password : 'user1234',
        profile : {
            "fullName" : "User Awi"
        }
    };

    var expert = {
        email : 'expert@something.com',
        password : 'expert',
        profile : {
            "fullName" : "Expert Awi"
        }
    };

    var expert2 = {
        email : 'expert2@something.com',
        password : 'expert2',
        profile : {
            "fullName" : "Expert Ghareeb"
        }
    };

    var RUser ={
        email : 'user@something.com',
        password : 'user1234',
        profile : {
            "fullName" : "User Awi"
        }
    };

    var RExpert ={
        email : 'expert@something.com',
        password : 'expert',
        profile : {
            "fullName" : "Expert Awi"
        }
    };

    var RExpert2 ={
        email : 'expert2@something.com',
        password : 'expert2',
        profile : {
            "fullName" : "Expert Ghareeb"
        }
    };

    //Before Block, clearing all users and registering the users and experts created above
    before((done) => {

        User.remove({}).then(() => {
            return request(app).post("/register").send({user: user}).expect(200);
        }).then((res) => {
            RUser = res.body.user;
        }).then(() => {
            return request(app).post("/register").send({user: expert}).expect(200);
        }).then((res) => {
            RExpert = res.body.user;
            return User.findByIdAndUpdate(RExpert._id, { $push: { roles: 'expert' } }, { new: true });
        }).then(() => {
            return request(app).post("/register").send({user: expert2}).expect(200);
        }).then((res) => {
            RExpert2 = res.body.user;
            return User.findByIdAndUpdate(RExpert2._id, { $push: { roles: 'expert' } }, { new: true });
        }).then(() => {
            done();
        })
        .catch((reason) => {
            console.log(reason);
            done(err);
        });
    });

    //Removing all office hours before each test
    beforeEach((done) => {
        OfficeHours.remove({}).then(() => {
            done();
        }).catch((reason) => {
            console.log(reason);
            done(reason);
        });
    });


    /*Testing if an expert can reject an office hours request sent to him*/
    it('should reject Office Hour request',(done)=>{

        var officehour ={
            user: {
                _id:RUser._id,
                name: 'User Awi'
              },
              expert: {
                _id: RExpert._id,
                name: 'Expert Awi'
              },
              isUserReviewed: true,
              isExpertReviewed: true,
              createdOn: new Date("2018-01-01"),
              suggestedSlots: {
                slots: null,
                createdOn: null
              },
              chosenSlot: {
                slot: null,
                createdOn: null
              },
              title: 'Office hours 1',
              description: 'first office hours',
              status: 'pending',
              lastModified: new Date("2018-01-01")
        }

        body={
            user: {
                _id:RUser._id,
                name: 'User Awi'
              },

              expert: {
                _id: RExpert._id,
                name: 'Expert Awi'
              },
              isUserReviewed: true,
              isExpertReviewed: true,
              createdOn: new Date("2018-01-01"),
              suggestedSlots: {
                slots: null,
                createdOn: null
              },
              chosenSlot: {
                slot: null,
                createdOn: null
              },
              title:  'Office hours 1',
              description: 'first office hours',
              status: 'pending',
              lastModified: new Date("2015-03-25")

        } 
        body=new OfficeHours(body);
        officehour = new OfficeHours(officehour);
        officehour.save().then(()=>{body._id=officehour._id;
            request(app).post('/rejectOfficeHour/'+body._id+'')
            .set({'x-auth': RExpert.tokens[0].token}).send({officeHour:body}).expect(200)
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            return done();
        });});

    });


    /*Testing expert should not reject a request that has already been rejected by having an
    expert try to reject a request with status 'rejected'*/
    it('should not reject an already rejected Office Hour request',(done)=>{
        var officehour ={
            user: {
                _id:RUser._id,
                name: 'User Awi'
              },
              expert: {
                _id: RExpert._id,
                name: 'Expert Awi'
              },
              isUserReviewed: true,
              isExpertReviewed: true,
              createdOn: new Date("2018-01-01"),
              suggestedSlots: {
                slots: null,
                createdOn: null
              },
              chosenSlot: {
                slot: null,
                createdOn: null
              },
              title: 'Office hours 1',
              description: 'first office hours',
              status: 'rejected',
              lastModified: new Date("2018-01-01")
        }

        body={
            user: {
                _id:RUser._id,
                name: 'User Awi'
              },

              expert: {
                _id: RExpert._id,
                name: 'Expert Awi'
              },
              isUserReviewed: true,
              isExpertReviewed: true,
              createdOn: new Date("2018-01-01"),
              suggestedSlots: {
                slots: null,
                createdOn: null
              },
              chosenSlot: {
                slot: null,
                createdOn: null
              },
              title:  'Office hours 1',
              description: 'first office hours',
              status: 'rejected',
              lastModified: new Date("2015-03-25")

        } 
        body=new OfficeHours(body);
        officehour = new OfficeHours(officehour);
        officehour.save().then(()=>{body._id=officehour._id;
            request(app).post('/rejectOfficeHour/'+body._id+'')
            .set({'x-auth': RExpert.tokens[0].token}).send({officeHour:body}).expect(400).expect((res)=>{
                expect(res.res.text).toBe("{\"err\":\"This office hour has already been replied to\"}")
            })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            return done();
        });});

    });


    /*Testing expert should not reject a request that has already been rejected by having an
    expert try to reject a request with status 'accepted'*/
    it('should not reject an accepted Office Hour request',(done)=>{
        var officehour ={
            user: {
                _id:RUser._id,
                name: 'User Awi'
              },
              expert: {
                _id: RExpert._id,
                name: 'Expert Awi'
              },
              isUserReviewed: true,
              isExpertReviewed: true,
              createdOn: new Date("2018-01-01"),
              suggestedSlots: {
                slots: null,
                createdOn: null
              },
              chosenSlot: {
                slot: null,
                createdOn: null
              },
              title: 'Office hours 1',
              description: 'first office hours',
              status: 'accepted',
              lastModified: new Date("2018-01-01")
        }

        body={
            user: {
                _id:RUser._id,
                name: 'User Awi'
              },

              expert: {
                _id: RExpert._id,
                name: 'Expert Awi'
              },
              isUserReviewed: true,
              isExpertReviewed: true,
              createdOn: new Date("2018-01-01"),
              suggestedSlots: {
                slots: null,
                createdOn: null
              },
              chosenSlot: {
                slot: null,
                createdOn: null
              },
              title:  'Office hours 1',
              description: 'first office hours',
              status: 'accepted',
              lastModified: new Date("2015-03-25")

        } 
        body=new OfficeHours(body);
        officehour = new OfficeHours(officehour);
        officehour.save().then(()=>{body._id=officehour._id;
            request(app).post('/rejectOfficeHour/'+body._id+'')
            .set({'x-auth': RExpert.tokens[0].token}).send({officeHour:body}).expect(400).expect((res)=>{
                expect(res.res.text).toBe("{\"err\":\"This office hour has already been replied to\"}")
            })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            return done();
        });});

    });


    /*Testing expert should not reject a request sent to another expert by creating an office hour request
    between a user and ann expert and then trying to reject it by a different expert*/
    it('should not reject an Office Hour request sent to another expert',(done)=>{
        var officehour ={
            user: {
                _id:RUser._id,
                name: 'User Awi'
              },
              expert: {
                _id: RExpert._id,
                name: 'Expert Awi'
              },
              /*expert2: {
                //  _id: RExpert2._id,
                //  name: 'Expert Ghareeb'
              },
              */
              isUserReviewed: true,
              isExpertReviewed: true,
              createdOn: new Date("2018-01-01"),
              suggestedSlots: {
                slots: null,
                createdOn: null
              },
              chosenSlot: {
                slot: null,
                createdOn: null
              },
              title: 'Office hours 1',
              description: 'first office hours',
              status: 'pending',
              lastModified: new Date("2018-01-01")
        }

        body={
            user: {
                _id:RUser._id,
                name: 'User Awi'
              },

              expert: {
                _id: RExpert._id,
                name: 'Expert Awi'
              },
              isUserReviewed: true,
              isExpertReviewed: true,
              createdOn: new Date("2018-01-01"),
              suggestedSlots: {
                slots: null,
                createdOn: null
              },
              chosenSlot: {
                slot: null,
                createdOn: null
              },
              title:  'Office hours 1',
              description: 'first office hours',
              status: 'pending',
              lastModified: new Date("2015-03-25")

        } 
        body=new OfficeHours(body);
        officehour = new OfficeHours(officehour);
        officehour.save().then(()=>{body._id=officehour._id;
            request(app).post('/rejectOfficeHour/'+body._id+'')
            .set({'x-auth': RExpert2.tokens[0].token}).send({officeHour:body}).expect(400).expect((res)=>{
                expect(res.res.text).toBe("{\"err\":\"This request has not been sent to you\"}")
            })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            return done();
        });});
    });

    //Removing everything
    after((done)=>{
        User.remove({}).then(()=>{
        OfficeHours.remove({})}).then(()=>{
            done();
        })
    });

    })

    describe('#confirmOfficeHour',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

});