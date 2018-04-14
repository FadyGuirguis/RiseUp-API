const mongoose = require('mongoose');
const Tag = mongoose.model('Tag');
const User = mongoose.model('User');

module.exports.addTag = async(req, res) => {   //ADMIN - STATUS CODES
  if(req.user.roles.includes('admin')) {
    if(!req.body.tag || !req.body.tag.tag)
        res.status(400).send('Tag is required');

    var tag = new Tag ({
      tag: req.body.tag.tag
    })

    tag.save().then((tag) => {
      res.status(200).send({tag});
    }, (e) => {
      res.status(500).send(e);
    })
  }else{
    res.status(401).send('You are not an admin');
  }
}

module.exports.getAllTags = async(req, res) => {  //ALL
  Tag.find().then((tags) => {
    res.status(200).send({tags});
  }, (e) => {
    res.status(500).send(e);
  })
}


//replace programming with the tag itself
//remove from tags collection 3shan ana msh fahem ezay shaghala!
module.exports.removeTag = async(req, res) => {   //ADMIN  ... zbt el scenario
  if(req.user.roles.includes('admin')) {
    var user = new User();

    //remove programming with the tag itself
    mongoose.model('User').update({}, {$pull: {"profile.interests" : {$in: ["programming"]}}}, {multi:true}, function(error, result){
      if(error){
        res.status(500).send(error);
      }else{
          mongoose.model('User').update({}, {$pull: {"profile.expertIn" : {$in: ["programming"]}}}, {multi:true}, function(e, r){
            if(error){
              res.status(500).send(error);
            }else{
                res.status(200).send(result);
            }
          });

      }
    });
  }else{
    res.status(401).send('You are not an admin');
  }



}
