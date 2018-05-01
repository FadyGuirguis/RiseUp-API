process.env.NODE_ENV = 'test';
base = process.env.PWD;
const request = require('supertest');
const expect = require('expect');
var app = require("./../server").app;
const mongoose = require('mongoose');
const {User} = require('../models/user');
const {Announcement} = require('../models/Announcement');
describe('Announcement Controller',()=>{

    describe('#getAllAnnouncements',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

    describe('#postAnnouncement',()=>{
        it('should pass',(done)=>{
            done();
        });
    })

    describe('#deleteAnnouncement',()=>{
        var admin = {
            email : 'admin@admin.com',
            password : 'something',
            profile : {
                "fullName" : "Admin Admin"
            }
        };
        var user = {
            email : 'user@user.com',
            password : 'useruser',
            profile : {
                "fullName" : "User User"
            },
            role: ['user']
        }
        var an = {
            title : 'title',
            description : 'description'
        }
        var an2 = {
            title : 'title2',
            description : 'description2'
        }
        before((done)=>{
            User.remove({}).then(()=>{
                request(app).post('/register').send({user:admin}).expect(200).end((err,res)=>{
                    if(err){
                        return done(err);
                    }
                    admin = res.body.user;

                    User.findByIdAndUpdate(res.body.user._id,{roles:['admin']},{ new:true }).then(()=>{

                        request(app).post('/register').send({ user: user }).expect(200).end((err, res) => {
                            if (err) {
                                return done(err);
                            }
                            user = res.body.user;
                            Announcement.remove({}).then(() => {
                                an = new Announcement(an);
                                an.save().then(() => {
                                    an2 = new Announcement(an2);
                                    an2.save().then(() => {
                                        return done();
                                    })
                                })


                            })
                        })

                    })
                })
            })
        });

        it('An Admin can delete an announcement', (done) => {
            Announcement.find({}).then((ans) => {
                request(app).delete('/announcement/' + ans[0]._id + '').set({ 'x-auth': admin.tokens[0].token }).expect(200).end((err, res) => {
                    //console.info(res.status+' '+res.res.text);   
                    if (err) {
                        return done(err);
                    }
                    else{
                        Announcement.find({}).then((ans) => {
                            expect(ans.length).toBe(1);
                            return done();
                        })                                             
                    }
                })
            })
        });

        it('A non-admin cant delete an anouncement', (done) => {
            Announcement.find({}).then((ans) => {
                request(app).delete('/announcement/' + ans[0]._id + '').set({ 'x-auth': user.tokens[0].token }).expect(403).end((err, res) => {
                    //console.info(res.status+' '+res.res.text);   
                    if (err) {
                        return done(err);
                    }
                    else{
                        Announcement.find({}).then((oba) => {
                            expect(oba.length).toBe(1);
                            done();
                        })
                    } 
                })
            })
        });
    })
});