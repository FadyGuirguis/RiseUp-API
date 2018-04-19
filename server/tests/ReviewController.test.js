process.env.NODE_ENV = 'test';
base = process.env.PWD;
const request = require('supertest');
const expect = require('expect');
var app = require("./../server").app;
const {Review} = require('../models/Review');
const {OfficeHours} = require('../models/OfficeHour');
const {User} = require('../models/user');
const {ObjectID} = require('mongodb');

describe('Review Controller',()=>{

    describe('#getReviewsOnUser',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

    describe('#postReview',()=>{

        var reviewer = {};
        var reviewed = {};
        var testOfficeHours = {};
        var testReview = {};

        beforeEach((done)=>{
            User.remove({}).then((err,res)=>{
                user = {
                    email : 'nothing@something.com',
                    password : 'something',
                    profile : {
                        "fullName" : "Nothing Something"
                    }
                };
                request(app)
                .post("/register")
                .send({user})
                .expect(200)
                .then((res)=>{
                    reviewer = res.body.user;
                    user = {
                        email : 'nothing2@something.com',
                        password : 'something',
                        profile : {
                            "fullName" : "Nothing Something"
                        }
                    };
    
                    request(app)
                    .post("/register")
                    .send({user})
                    .expect(200)
                    .then((res)=>{
                        reviewed = res.body.user;
                        testOfficeHours = new OfficeHours({
                           user : {
                               _id : reviewer._id,
                               name : reviewer.profile.fullName
                           } ,
                           expert : {
                               _id : reviewed._id,
                               name : reviewed.profile.fullName
                           },
                           
                           title : "title bla ",
    
                           description : "bla bla",
                           
                           isUserReviewed : false,
    
                           isExpertReviewed : false
                        });
    
                        // console.log(testOfficeHours);
    
                        testOfficeHours.save().then((doc)=>{
                            testOfficeHours = doc ;
                            testReview = new Review({
                                reviewer : {
                                    _id : reviewer._id,
                                    name : reviewer.name
                                },
                                reviewed : {
                                    _id : reviewed._id,
                                    name : reviewed.name
                                },
                                    
                                officeHours : testOfficeHours._id,
                                description : "bla bla",
                                rating : 1
                            })
                             done();
                        })
                        .catch((err)=>{
                            console.log(err);
                        });
                    });   
                });

            });
                
            
                

        });
        
        
        it('Review should not be posted if it is empty',(done)=>{
            request(app)
            .post("/review/"+testOfficeHours._id)
            .send({})
            .set({
                'x-auth' : reviewer.tokens[0].token
            })
            .expect(400)
            .end((err,res)=>{
                if(err)
                    done(err);
                else{
                    done();
                }
            });
        });

        it('Review Should not be posted if the rating is empty',(done)=>{
            testReview.rating = undefined;
            request(app)
            .post("/review/"+testOfficeHours._id)
            .send({review : testReview})
            .set({
                'x-auth' : reviewer.tokens[0].token
            })
            .expect(400)
            .end((err,res)=>{
                if(err)
                    done(err);
                else{
                    done();
                }
            })
        });

        it('Review Should not be posted if the description is empty',(done)=>{
            testReview.rating = 1;
            testReview.description = undefined;
            request(app)
            .post("/review/"+testOfficeHours._id)
            .send({review : testReview})
            .set({
                'x-auth' : reviewer.tokens[0].token
            })
            .expect(400)
            .end((err,res)=>{
                if(err)
                    done(err);
                else{
                    done();
                }
            })
        });



        it('Review Should not be posted if an invalid OfficeHour ID is used',(done)=>{
            testReview.description = 'blah blah'
            request(app)
            .post("/review/123abc")
            .send({review :testReview})
            .set({
                'x-auth' : reviewer.tokens[0].token
            })
            .expect(400)
            .end((err,res)=>{
                if(err)
                    done(err);
                else{
                    done();
                }
            })
        });

        it('OfficeHour should not be found ',(done)=>{
            var ID = new ObjectID();
            request(app)
            .post("/review/"+ID)
            .send({review :testReview})
            .set({
                'x-auth' : reviewer.tokens[0].token
            })
            .expect(400)
            .end((err,res)=>{
                if(err)
                    done(err);
                else{
                    done();
                }
            })
        });

        it('No Review can be submitted twice ',(done)=>{
            var ID = new ObjectID();
            testOfficeHours.isUserReviewed = true;
            testOfficeHours.save().then((doc)=>{
                request(app)
                .post("/review/"+testOfficeHours._id)
                .send({review :testReview})
                .set({
                    'x-auth' : reviewed.tokens[0].token
                })
                .expect(400)
                .end((err,res)=>{
                    testOfficeHours.isUserReviewed = false;
                    if(err)

                        done(err);
                    else{
                        done();
                    }
                })
            })
                
        });

        it('No Review can be submitted twice Reversed ',(done)=>{
            var ID = new ObjectID();
            testOfficeHours.isExpertReviewed = true;
            testOfficeHours.save().then((doc)=>{
                request(app)
                .post("/review/"+testOfficeHours._id)
                .send({review :testReview})
                .set({
                    'x-auth' : reviewer.tokens[0].token
                })
                .expect(400)
                .end((err,res)=>{
                    testOfficeHours.isExpertReviewed = false;
                    if(err)

                        done(err);
                    else{
                        done();
                    }
                })
            })
                
        });

        it('Review should not be posted if office hours are not related to the user',(done)=>{

            var thirdUser = {
                email : 'nothing3@something.com',
                password : 'something',
                profile : {
                    "fullName" : "Nothing Something"
                }
            };
            request(app)
            .post("/register")
            .send({user : thirdUser})
            .expect(200)
            .then((res)=>{
                thirdUser = res.body.user;
                request(app)
                .post("/review/"+testOfficeHours._id)
                .send({review :testReview})
                .set({
                    'x-auth' : thirdUser.tokens[0].token
                })
                .expect(400)
                .end((err,res)=>{
                    if(err)
                        done(err);
                    else{
                        done();
                    }
                })

            });
        })

        it("Review should be posted",(done)=>{
            request(app)
            .post("/review/"+testOfficeHours._id)
            .send({review :testReview})
            .set({
                'x-auth' : reviewer.tokens[0].token
            })
            .expect(200)
            .end((err,res)=>{
                if(err)
                    done(err);
                else{
                    done();
                }
            });
        });

        afterEach((done)=>{
            OfficeHours.remove({}).then((res)=>{
                User.remove({}).then((res)=>{
                    done();
                })
            
        }).catch((err)=>{
            console.log(err);
            })
        })
    })
})