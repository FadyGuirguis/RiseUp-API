const mongoose = require('mongoose');
User = mongoose.model('User');


var authenticate = (req, res, next) => {

    var token = req.header('x-auth');

    User.findByToken(token).then((user)=>{
        
        if(!user)
            return Promise.reject();

        req.user = user;
        req.token = token;

        next();

    }).catch((e)=>{
        res.status(401).send();
    });
}

// Authorize Expert
var authExpert = (req, res, next) => {

    var user = req.user;

    if(!user)
        return Promise.reject();

    if(user.roles.indexOf('expert') == -1)
        res.status(403).send({ msg: 'You are not an Expert user.' });
    else
        next();
}

// Authorize Admin
var authAdmin = (req, res, next) => {

    var user = req.user;

    if(!user)
        return Promise.reject();

    if(user.roles.indexOf('admin') == -1)
        res.status(403).send({ msg: 'You are not an Admin.' });
    else
        next();
}

module.exports = {authenticate, authExpert, authAdmin};