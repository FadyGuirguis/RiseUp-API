process.env.NODE_ENV = 'test';
base = process.env.PWD;
const request = require('supertest');
const expect = require('expect');
var app = require("./../server").app;

const {OfficeHours} = require('../models/OfficeHour');
User = require('../models/user');
const {ObjectID} = require('mongodb');

var id = "";
var token = "";
var userr = "";
var expertt = "";
var OfficeHourss = "";

describe('Office Hours Controller',()=>{

    describe('#getOfficeHours',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

    describe('#getOfficeHour',()=> {

        beforeEach((done) => {
            User.remove({}).then((err, res) => {
                var user = {
                    email: 'nothing@something.com',
                    password: 'something',
                    profile: {
                        "fullName": "Nothing Something"
                    }
                };

                request(app)
                    .post("/register")
                    .send({user})
                    .expect(200)
                    .then((res)=>{
                        userr = res.body.user;
                        user = {
                            email : 'expert@something.com',
                            password : 'something',
                            profile : {
                                "fullName" : "expert Something"
                            }
                        };

                        request(app)
                            .post("/register")
                            .send({user})
                            .expect(200)
                            .then((res)=>{
                                expertt = res.body.user;
                                OfficeHourss = new OfficeHours({
                                    user : {
                                        _id : userr._id,
                                        name : userr.profile.fullName
                                    } ,
                                    expert : {
                                        _id : expertt._id,
                                        name : expertt.profile.fullName
                                    },

                                    title : "ask expert ",

                                    description : "about nothing",

                                });

                        OfficeHourss.save().then((doc)=>{
                            OfficeHourss = doc ;
                            done();
                        })
                            .catch((err)=>{
                                console.log(err);
                            });
                    });

            });
        });
        });


            it('should officehour be found using user token ', (done) => {
                request(app)
                    .get('/officeHour/'+OfficeHourss._id)
                    .expect(200)
                    .set({
                        'x-auth' : userr.tokens[0].token
                    })
                    .end((err,res)=>{
                        if(err)
                            done(err);
                        else{
                            done();
                        }
                    });
            });
        it('should officehour be found using expert token ', (done) => {
            request(app)
                .get('/officeHour/'+OfficeHourss._id)
                .expect(200)
                .set({
                    'x-auth' : expertt.tokens[0].token
                })
                .end((err,res)=>{
                    if(err)
                        done(err);
                    else{
                        done();
                    }
                });
        });


        it(' Should be not found ', (done) => {
            request(app)
                .get('/officeHour/')
                .expect(404)
                .end((err,res)=>{
                    if(err)
                        done(err);
                    else{
                        done();
                    }
                });
        });
        it(' Should be unauthorized', (done) => {
            request(app)
                .get('/officeHour/'+OfficeHourss._id)
                .expect(401)
                .end((err,res)=>{
                    if(err)
                        done(err);
                    else{
                        done();
                    }
                });
        });
        it(' Should be incorrect as no office hour with that id', (done) => {
            request(app)
                .get('/officeHour/'+35131)
                .set({
                    'x-auth' : userr.tokens[0].token
                })
                .expect(500)
                .end((err,res)=>{
                    if(err)
                        done(err);
                    else{
                        done();
                    }
                });
        });
        it(' should not be able to get the office hours as he/she not a user or an expert', (done) => {
            request(app)
                .get('/officeHour/'+OfficeHourss._id)
                .expect(401)
                .set({
                    'x-auth' : 51351
                })
                .end((err,res)=>{
                    if(err)
                        done(err);
                    else{
                        done();
                    }
                });
        });



        after((done) => {
            OfficeHours.remove({}).then((res)=>{
                User.remove({}).then((res)=>{
                    done();
                })

            }).catch((err)=>{
                console.log(err);
            })
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