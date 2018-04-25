process.env.NODE_ENV = 'test';
base = process.env.PWD;
const request = require('supertest');
const expect = require('expect');
var app = require("./../server").app;

const mongoose = require('mongoose');
User = mongoose.model('User');


var id = "";
var token = "";

describe('User Controller',()=>{

    describe('#createUser',()=>{

        beforeEach((done)=>{
            User.remove({}).then(()=>{
                var user = {
                    email : 'nothing@something.com',
                    password : 'something',
                    profile : {
                        "fullName" : "Nothing Something"
                    }
                }
    
                user = new User(user);
                user.save().then(()=>{
                    done();
                })
            })
        });

        it('should create user with valid data and login automatically',(done)=>{
            var user = {
                email : 'something@something.com',
                password : 'something',
                profile : {
                    "fullName" : "Something Something"
                }
            }

            request(app)
            .post("/register")
            .send({user})
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }

                User.find().then((users)=>{
                    expect(users.length).toBe(2);
                    expect(users[1].tokens).toHaveLength(1);
                    return done();
                }).catch((err)=>{
                    return done(err);
                });
            })
        });

        it('should not create user with used email',(done)=>{
            var user = {
                email : 'nothing@something.com',
                password : 'something',
                profile : {
                    "fullName" : "Something Something"
                }
            }

            request(app)
            .post("/register")
            .send({user})
            .expect(400)
            .expect((res)=>{
                expect(res.res.text).toBe("Email is already taken")
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }

                User.find().then((users)=>{
                    expect(users.length).toBe(1);
                    return done();
                }).catch((err)=>{
                    return done(err);
                });
            })
        });

        it('should not create a user with an invalid email format',(done)=>{
            var user = {
                email : 'something.com',
                password : 'something',
                profile : {
                    "fullName" : "Something Something"
                }
            }

            request(app)
            .post("/register")
            .send({user})
            .expect(400)
            .end((err,res)=>{
                if(err){
                    return done(err);
                }

                User.find().then((users)=>{
                    expect(users.length).toBe(1);
                    return done();
                }).catch((err)=>{
                    return done(err);
                });
            })
        })

        it('should not create a user with a password shorter than 6 characters',(done)=>{
            var user = {
                email : 'something@something.com',
                password : 'some',
                profile : {
                    "fullName" : "Something Something"
                }
            }

            request(app)
            .post("/register")
            .send({user})
            .expect(400)
            .end((err,res)=>{
                if(err){
                    return done(err);
                }

                User.find().then((users)=>{
                    expect(users.length).toBe(1);
                    return done();
                }).catch((err)=>{
                    return done(err);
                });
            })
        })        

        it('should not create a user with a full name of 1 Character',(done)=>{
            var user = {
                email : 'something@something.com',
                password : 'some',
                profile : {
                    "fullName" : "S"
                }
            }

            request(app)
            .post("/register")
            .send({user})
            .expect(400)
            .end((err,res)=>{
                if(err){
                    return done(err);
                }

                User.find().then((users)=>{
                    expect(users.length).toBe(1);
                    return done();
                }).catch((err)=>{
                    return done(err);
                });
            })
        });


        after((done)=>{
            User.remove({}).then(()=>{
                done()
            })
        });



    })

    describe('#loginUser',()=>{

        beforeEach((done)=>{
            User.remove({}).then(()=>{
                var user = {
                    email : 'nothing@something.com',
                    password : 'something',
                    profile : {
                        "fullName" : "Nothing Something"
                    }
                }
                // POST /register will make the user start with 1 token already because 
                // he is already automatically logged in 
                request(app)
                .post("/register")
                .send({user})
                .expect(200)
                .end((err,res)=>{
                    id = res.body.user._id;
                    return done();
                })
                
            })
        });

        it('should login user with correct email and password and return token in header',(done)=>{
            var email = "nothing@something.com";
            var password = "something";
            request(app)
            .post("/login")
            .send({email,password})
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                User.findOne({_id : res.body.user._id}).then((user)=>{
                    expect(user.tokens).toHaveLength(2);
                    return done();
                })

            })
        });

        it('should not login user with a wrong email',(done)=>{
            var email = "nothing@nothing.com";
            var password = "something";
            request(app)
            .post("/login")
            .send({email,password})
            .expect(404)
            .expect((res)=>{
                expect(res.body.msg).toBe('email not found');
                expect(res.headers['x-auth']).toBeUndefined();
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                User.findOne({_id : id}).then((user)=>{
                    expect(user.tokens).toHaveLength(1);
                    return done();
                })
            })
        });

        it('should not login user with a wrong password',(done)=>{
            var email = "nothing@something.com";
            var password = "wrong password";
            request(app)
            .post("/login")
            .send({email,password})
            .expect(404)
            .expect((res)=>{
                expect(res.body.msg).toBe('password not correct');
                expect(res.headers['x-auth']).toBeUndefined();
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                User.findOne({_id : id}).then((user)=>{
                    expect(user.tokens).toHaveLength(1);
                    return done();
                })
            })
        });

        it('should not login user with missing email or password',(done)=>{
            var email = "nothing@something.com";
            request(app)
            .post("/login")
            .send({email})
            .expect(400)
            .expect((res)=>{
                expect(res.headers['x-auth']).toBeUndefined();
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                User.findOne({_id : id}).then((user)=>{
                    expect(user.tokens).toHaveLength(1);
                    return done();
                })
            })
        });

        after((done)=>{
            User.remove({}).then(()=>{
                done()
            })
        });

    })

    describe('#logout',()=>{

        beforeEach((done)=>{
            User.remove({}).then(()=>{
                var user = {
                    email : 'nothing@something.com',
                    password : 'something',
                    profile : {
                        "fullName" : "Nothing Something"
                    }
                }
    
                request(app)
                .post("/register")
                .send({user})
                .expect(200)
                .end((err,res)=>{
                    id = res.body.user._id;
                    token = res.headers['x-auth'];
                    return done();
                })  
            })
        });

        it('user should logout with correct token',(done)=>{
            
            request(app)
            .post("/logout")
            .set('x-auth',token)
            .expect(200)
            .end((err,res)=>{
                if(err){
                    return done();
                }
                User.findOne({_id: id}).then((user)=>{
                    expect(user.tokens).toHaveLength(0);
                    return done();
                })
            })  
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

    describe('#getUserByToken',()=>{
        var tempUser ;
        beforeEach((done)=>{
            User.remove({}).then(()=>{
                var user = {
                    email : 'nothing@something.com',
                    password : 'something',
                    profile : {
                        "fullName" : "Nothing Something"
                    }
                }
                
                user = new User(user);
                request(app)
                .post("/register")
                .send({user})
                .expect(200)
                .end((err,res)=>{
                    tempUser = res.body.user; 
                    //console.log(tempUser);
                    return done();
                })  
            })
        });
        it('should pass if token exists',(done)=>{
            request(app)
            .get('/users/getByToken')
            .set({
                'x-auth':tempUser.tokens[0].token
            })
            .expect(200)
            .end((err,res)=>{
                if(err){
                    done(err);
                }
                else{
                    done();
                }
            })
        });
        after((done)=>{
            User.remove({}).then(()=>{
                done()
            })
        });
    });

});