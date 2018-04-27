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
        var users = [];
       var testUsers = [
         {
           email: 'test@test.com',
           password: '123456',
           roles: ["user"],
           profile: {
             interests: ["testing"]
           }
         },
         {
           email: 'tests@test.com',
           password: '123456',
           roles: [ "admin"],
           profile: {
             expertIn: ["testing"]
           }
         }
       ];
       var testTokens = [];
 
 
       beforeEach((done) => {
          User.remove().then(() => {
                     var testUser1 = new User(testUsers[0]);
 
                     testUser1.save().then(() => {
 
                       testUser1.generateAuthToken().then((Token1) => { //
                         testTokens.push(Token1);
                         var testUser2 = new User(testUsers[1]);
 
                         testUser2.save().then(() => {
 
                           testUser2.generateAuthToken().then((Token2) => {
                             testTokens.push(Token2);
                             done();
                           })
                         })
                       })
                     })
                   })
                 })
 
 
 
   it('must not be an admin', (done) => {
         request(app)
         .post(`/announcement`)
         .set('x-auth', testTokens[0])
         .expect(403)
         .expect((res) => {
           expect(JSON.parse(res.text).msg).toBe('You are not an Admin.')
         })
         .end((err, res) => {
           if(err) {
             return done(err);
           }
           return done();
         })
       })
       it('must be an admin', (done) => {
        request(app)
        .post(`/announcement`)
        .set('x-auth', testTokens[1])
        .expect(200)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          return done();
        })
      })
 
 
 
 
        afterEach((done) => {
         User.remove().then(() => {
             Announcement.remove().then(()=>{
                 done();
             });
         });
 
})
    })
    describe('#deleteAnnouncement',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

});