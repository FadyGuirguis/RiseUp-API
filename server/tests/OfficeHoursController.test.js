process.env.NODE_ENV = 'test';
base = process.env.PWD;
const request = require('supertest');
const expect = require('expect');
var app = require("./../server").app;
const {User} = require("../models/user");
const {OfficeHours} = require("../models/OfficeHour");

describe('Office Hours Controller',()=>{

    describe('#getOfficeHours',()=>{
        it('should pass',(done)=>{
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
    //-----------Declarations--------------
    var user = {
        email : 'mostafa@something.com',
        password : 'something',
        profile : {
            "fullName" : "Mostafa Amer"
        }
    };
    var expert = {
        email : 'Joe@something.com',
        password : 'something',
        profile : {
            "fullName" : "Joe salah"
        }
    }
    var Resuser ={
        email : 'mostafa@something.com',
        password : 'something',
        profile : {
            "fullName" : "Mostafa Amer"
        }
    };
    var ResExpert ={
        email : 'Joe@something.com',
        password : 'something',
        profile : {
            "fullName" : "Joe salah"
        }
    };

    

    //----------------Before Each Execution-------------------
    before((done) => {

        // Remove all users from the DB
        User.remove({})
        // Register the normal user to submit requests
        .then(() => {
            return request(app).post("/register").send({user: user}).expect(200);
        })
        .then((res) => {
            Resuser = res.body.user;
            
        })
        // Register expert
        .then(() => {
            return request(app).post("/register").send({user: expert}).expect(200);
        })
        // Make him expert
        .then((res) => {
            ResExpert = res.body.user;
            return User.findByIdAndUpdate(ResExpert._id, { $push: { roles: 'expert' } }, { new: true });
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
    //begore each section
     beforeEach((done) => {
        // Remove all Office Hours from the DB before each test case
        OfficeHours.remove({}).then(() => {
            done();
        }).catch((reason) => {
            console.log(reason);
            done(reason);
        });
    });
    
    // user should be able to confirm an officehour with a chosen time slot from the suggested by the expert

    it('should confirm officehour',(done)=>{
        var officehour ={
            user: {
                _id:Resuser._id,
                name: 'Nothing Something'
              },
              expert: {
                _id: ResExpert._id,
                name: 'expert Something'
              },
              isUserReviewed: true,
              isExpertReviewed: true,
              createdOn: new Date("2015-03-25"),
              suggestedSlots: {
                slots: [new Date("2015-03-25"),new Date("2015-03-27"),new Date("2015-03-26")],
                createdOn: new Date("2015-03-25")
              },
              chosenSlot: {
                slot: null,
                createdOn: null
              },
              title: 'hi hi ihihihi',
              description: 'hihihihi hih hi hi hihi hihi',
              status: 'accepted'
              ,
              lastModified: new Date("2015-03-25")
        }
        body={
            user: {
                _id:Resuser._id,
                name: 'Nothing Something'
              },
              expert: {
                _id: ResExpert._id,
                name: 'expert Something'
              },
              isUserReviewed: true,
              isExpertReviewed: true,
              createdOn: new Date("2015-03-25"),
              suggestedSlots: {
                slots: [new Date("2015-03-25"),new Date("2015-03-27"),new Date("2015-03-26")],
                createdOn: new Date("2015-03-25")
              },
              chosenSlot: {
                slot: new Date("2015-03-25"),
                createdOn: new Date("2015-03-25")
              },
              title: 'hi hi ihihihi',
              description: 'hihihihi hih hi hi hihi hihi',
              status: ''
              ,
              lastModified: new Date("2015-03-25")
        } 
        body=new OfficeHours(body);
        officehour = new OfficeHours(officehour);
        officehour.save()
        .then(()=>{body._id=officehour._id;
            request(app).post('/confirmOfficeHour/'+body._id+'')
            .set({'x-auth': Resuser.tokens[0].token}).send({officeHour:body}).expect(200)
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            console.info(res.status+" "+res.res.text);
            return done();
        });});

    });

    //user should not confirm an officehour with a chosen time slot that was not suggested by the expert

    it('should not confirm officehour which has a chosen slot that was not suggested by the expert',(done)=>{
        var officehour ={
            user: {
                _id:Resuser._id,
                name: 'Nothing Something'
              },
              expert: {
                _id: ResExpert._id,
                name: 'expert Something'
              },
              isUserReviewed: true,
              isExpertReviewed: true,
              createdOn: new Date("2015-03-25"),
              suggestedSlots: {
                slots: [new Date("2015-03-25"),new Date("2015-03-27"),new Date("2015-03-26")],
                createdOn: new Date("2015-03-25")
              },
              chosenSlot: {
                slot: null,
                createdOn: null
              },
              title: 'hi hi ihihihi',
              description: 'hihihihi hih hi hi hihi hihi',
              status: 'accepted'
              ,
              lastModified: new Date("2015-03-25")
        }
        body={
            user: {
                _id:Resuser._id,
                name: 'Nothing Something'
              },
              expert: {
                _id: ResExpert._id,
                name: 'expert Something'
              },
              isUserReviewed: true,
              isExpertReviewed: true,
              createdOn: new Date("2015-03-25"),
              suggestedSlots: {
                slots: [new Date("2015-03-25"),new Date("2015-03-27"),new Date("2015-03-26")],
                createdOn: new Date("2015-03-25")
              },
              chosenSlot: {
                slot: new Date("2015-04-29"),
                createdOn: new Date("2015-03-25")
              },
              title: 'hi hi ihihihi',
              description: 'hihihihi hih hi hi hihi hihi',
              status: ''
              ,
              lastModified: new Date("2015-03-25")
        } 
        body=new OfficeHours(body);
        officehour = new OfficeHours(officehour);
        officehour.save()
        .then(()=>{body._id=officehour._id;
            request(app).post('/confirmOfficeHour/'+body._id+'')
            .set({'x-auth': Resuser.tokens[0].token}).send({officeHour:body}).expect(400).expect((res)=>{
            expect(res.res.text).toBe("{\"err\":\"This slot was not suggested by the expert\"}")
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            console.info(res.status+" "+res.res.text);
            return done();
        });});

    });

    //user should not confirm an office hour which has a status already confirmed

    it('shouldnot confirm an already confirmed officehour',(done)=>{
        var officehour ={
            user: {
                _id:Resuser._id,
                name: 'Nothing Something'
              },
              expert: {
                _id: ResExpert._id,
                name: 'expert Something'
              },
              isUserReviewed: true,
              isExpertReviewed: true,
              createdOn: new Date("2015-03-25"),
              suggestedSlots: {
                slots: [new Date("2015-03-25"),new Date("2015-03-27"),new Date("2015-03-26")],
                createdOn: new Date("2015-03-25")
              },
              chosenSlot: {
                slot: null,
                createdOn: null
              },
              title: 'hi hi ihihihi',
              description: 'hihihihi hih hi hi hihi hihi',
              status: 'confirmed'
              ,
              lastModified: new Date("2015-03-25")
        }
        body={
            user: {
                _id:Resuser._id,
                name: 'Nothing Something'
              },
              expert: {
                _id: ResExpert._id,
                name: 'expert Something'
              },
              isUserReviewed: true,
              isExpertReviewed: true,
              createdOn: new Date("2015-03-25"),
              suggestedSlots: {
                slots: [new Date("2015-03-25"),new Date("2015-03-27"),new Date("2015-03-26")],
                createdOn: new Date("2015-03-25")
              },
              chosenSlot: {
                slot: new Date("2015-03-25"),
                createdOn: new Date("2015-03-25")
              },
              title: 'hi hi ihihihi',
              description: 'hihihihi hih hi hi hihi hihi',
              status: ''
              ,
              lastModified: new Date("2015-03-25")
        } 
        body=new OfficeHours(body);
        officehour = new OfficeHours(officehour);
        console.info('SS');
        console.info(officehour._id);
        officehour.save()
        .then(()=>{body._id=officehour._id;
            request(app).post('/confirmOfficeHour/'+body._id+'')
            .set({'x-auth': Resuser.tokens[0].token}).send({officeHour:body}).expect(400).expect((res)=>{
            expect(res.res.text).toBe("{\"err\":\"You have already confirmed this office hour\"}")
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            console.info(res.status+" "+res.res.text);
            return done();
        });});

    });

    //user should not confirm an office hour which has a status not accepted

    it('shouldnot confirm an officehour that is not accepted',(done)=>{
        var officehour ={
            user: {
                _id:Resuser._id,
                name: 'Nothing Something'
              },
              expert: {
                _id: ResExpert._id,
                name: 'expert Something'
              },
              isUserReviewed: true,
              isExpertReviewed: true,
              createdOn: new Date("2015-03-25"),
              suggestedSlots: {
                slots: [new Date("2015-03-25"),new Date("2015-03-27"),new Date("2015-03-26")],
                createdOn: new Date("2015-03-25")
              },
              chosenSlot: {
                slot: null,
                createdOn: null
              },
              title: 'hi hi ihihihi',
              description: 'hihihihi hih hi hi hihi hihi',
              status: 'rejected'
              ,
              lastModified: new Date("2015-03-25")
        }
        body={
            user: {
                _id:Resuser._id,
                name: 'Nothing Something'
              },
              expert: {
                _id: ResExpert._id,
                name: 'expert Something'
              },
              isUserReviewed: true,
              isExpertReviewed: true,
              createdOn: new Date("2015-03-25"),
              suggestedSlots: {
                slots: [new Date("2015-03-25"),new Date("2015-03-27"),new Date("2015-03-26")],
                createdOn: new Date("2015-03-25")
              },
              chosenSlot: {
                slot: new Date("2015-03-25"),
                createdOn: new Date("2015-03-25")
              },
              title: 'hi hi ihihihi',
              description: 'hihihihi hih hi hi hihi hihi',
              status: ''
              ,
              lastModified: new Date("2015-03-25")
        } 
        body=new OfficeHours(body);
        officehour = new OfficeHours(officehour);
        console.info('SS');
        console.info(officehour._id);
        officehour.save()
        .then(()=>{body._id=officehour._id;
            request(app).post('/confirmOfficeHour/'+body._id+'')
            .set({'x-auth': Resuser.tokens[0].token}).send({officeHour:body}).expect(400).expect((res)=>{
            expect(res.res.text).toBe("{\"err\":\"This office has not been accepted\"}")
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            console.info(res.status+" "+res.res.text);
            return done();
        });});

    });

    //user should not confirm an office hour with out chosing the time slot

    it('shouldnot confirm officehour with no chosen slots',(done)=>{
        var officehour ={
            user: {
                _id:Resuser._id,
                name: 'Nothing Something'
              },
              expert: {
                _id: ResExpert._id,
                name: 'expert Something'
              },
              isUserReviewed: true,
              isExpertReviewed: true,
              createdOn: new Date("2015-03-25"),
              suggestedSlots: {
                slots: [new Date("2015-03-25"),new Date("2015-03-27"),new Date("2015-03-26")],
                createdOn: new Date("2015-03-25")
              },
              chosenSlot: {
                slot: null,
                createdOn: null
              },
              title: 'hi hi ihihihi',
              description: 'hihihihi hih hi hi hihi hihi',
              status: 'accepted'
              ,
              lastModified: new Date("2015-03-25")
        }
        body={
            user: {
                _id:Resuser._id,
                name: 'Nothing Something'
              },
              expert: {
                _id: ResExpert._id,
                name: 'expert Something'
              },
              isUserReviewed: true,
              isExpertReviewed: true,
              createdOn: new Date("2015-03-25"),
              suggestedSlots: {
                slots: [new Date("2015-03-25"),new Date("2015-03-27"),new Date("2015-03-26")],
                createdOn: new Date("2015-03-25")
              },
              chosenSlot: {
                slot: null,
                createdOn: null
              },
              title: 'hi hi ihihihi',
              description: 'hihihihi hih hi hi hihi hihi',
              status: ''
              ,
              lastModified: new Date("2015-03-25")
        } 
        body=new OfficeHours(body);
        officehour = new OfficeHours(officehour);
        console.info('SS');
        console.info(officehour._id);
        officehour.save()
        .then(()=>{body._id=officehour._id;
            request(app).post('/confirmOfficeHour/'+body._id+'')
            .set({'x-auth': Resuser.tokens[0].token}).send({officeHour:body}).expect(400).expect((res)=>{
            expect(res.res.text).toBe("{\"err\":\"Chosen slot was not recieved\"}")
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            console.info(res.status+" "+res.res.text);
            
            return done();
        });});

    });

    //user should not confirm an office hour with a body that is not of type office hour

 it('should not confirm officehour with body not officehour',(done)=>{
        var officehour ={
            user: {
                _id:Resuser._id,
                name: 'Nothing Something'
              },
              expert: {
                _id: ResExpert._id,
                name: 'expert Something'
              },
              isUserReviewed: true,
              isExpertReviewed: true,
              createdOn: new Date("2015-03-25"),
              suggestedSlots: {
                slots: [new Date("2015-03-25"),new Date("2015-03-27"),new Date("2015-03-26")],
                createdOn: new Date("2015-03-25")
              },
              chosenSlot: {
                slot: null,
                createdOn: null
              },
              title: 'hi hi ihihihi',
              description: 'hihihihi hih hi hi hihi hihi',
              status: 'accepted'
              ,
              lastModified: new Date("2015-03-25")
        }
        body={
            
        }
        officehour = new OfficeHours(officehour);
        var officehourId = officehour.save()
        .then(request(app).post('/confirmOfficeHour/'+body._id+'')
        .set({'x-auth': ResExpert.tokens[0].token}).send({body}).expect(400).expect((res)=>{
            expect(res.res.text).toBe("{\"err\":\"Office Hour wasn't recieved\"}")
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            console.info(res.status+" "+res.res.text);
            return done();
        }));

    });
    //user should not confirm an office hour that doesnot belong to him
    it('should not confirm an office hour that does not belog to this user ',(done)=>{
        var officehour ={
            user: {
                _id:Resuser._id,
                name: 'Nothing Something'
              },
              expert: {
                _id: ResExpert._id,
                name: 'expert Something'
              },
              isUserReviewed: true,
              isExpertReviewed: true,
              createdOn: new Date("2015-03-25"),
              suggestedSlots: {
                slots: [new Date("2015-03-25"),new Date("2015-03-27"),new Date("2015-03-26")],
                createdOn: new Date("2015-03-25")
              },
              chosenSlot: {
                slot: null,
                createdOn: null
              },
              title: 'hi hi ihihihi',
              description: 'hihihihi hih hi hi hihi hihi',
              status: 'accepted'
              ,
              lastModified: new Date("2015-03-25")
        }
        body={
            user: {
                _id:null,
                name: 'Nothing Something'
              },
              expert: {
                _id: ResExpert._id,
                name: 'expert Something'
              },
              isUserReviewed: true,
              isExpertReviewed: true,
              createdOn: new Date("2015-03-25"),
              suggestedSlots: {
                slots: [new Date("2015-03-25"),new Date("2015-03-27"),new Date("2015-03-26")],
                createdOn: new Date("2015-03-25")
              },
              chosenSlot: {
                slot: new Date("2015-03-25"),
                createdOn: new Date("2015-03-25")
              },
              title: 'hi hi ihihihi',
              description: 'hihihihi hih hi hi hihi hihi',
              status: ''
              ,
              lastModified: new Date("2015-03-25")
        } 
        body=new OfficeHours(body);
        officehour = new OfficeHours(officehour);
        officehour.save()
        .then(()=>{request(app).post('/confirmOfficeHour/'+body._id+'')
        .set({'x-auth': Resuser.tokens[0].token}).send({officeHour:body}).expect(400).expect((res)=>{
            expect(res.res.text).toBe("{\"err\":\"This request is not yours\"}")
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            console.info(res.status+" "+res.res.text);
            
            return done();
        });});

    });
})
    
});