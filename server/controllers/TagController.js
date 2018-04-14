const mongoose = require('mongoose');
const Tag = mongoose.model('Tag');
const User = mongoose.model('User');

module.exports.addTag = async(req, res) => {   //ADMIN - STATUS CODES
  if(req.user.roles.includes('admin')) {
    try{
      if(typeof req.body.tag == 'undefined' || !req.body.tag || !req.body.tag.tag)
          res.status(400).send('Tag is required');
    }catch(error){
      res.status(400).send('Tag is required')
    }


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
// module.exports.removeTag = async(req, res) => {   //ADMIN  ... zbt el scenario
//   if(req.user.roles.includes('admin')) {
//     var user = new User();
//
//     //remove programming with the tag itself
//     mongoose.model('User').update({}, {$pull: {"profile.interests" : {$in: ["programming"]}}}, {multi:true}, function(error, result){
//       if(error){
//         res.status(500).send(error);
//       }else{
//           mongoose.model('User').update({}, {$pull: {"profile.expertIn" : {$in: ["programming"]}}}, {multi:true}, function(e, r){
//             if(error){
//               res.status(500).send(error);
//             }else{
//                 res.status(200).send(result);
//             }
//           });
//
//       }
//     });
//   }else{
//     res.status(401).send('You are not an admin');
//   }
//}
module.exports.removeTag = async(req, res) => {
  var id = req.params.id;

  Tag.find({_id:id}).then((tag) => {
    if(! tag[0]) {
      return res.status(404).send('There is no tag with such id');
    }

    var tag = tag[0].tag;

    User.find().then((user) => {
      var i;
      for(i = 0; i < user.length; i++) {

        if(user[i].profile.interests.includes(tag)) {
          var interests = user[i].profile.interests.filter((interest) => interest != tag);
          user[i].profile.interests = interests;

          User.findByIdAndUpdate(user[i]._id, {$set: user[i]}, {new: true}).then(() => {}, (e) => {
            res.status(500).send(e);
          });
        }

        if(user[i].profile.expertIn.includes(tag)) {
          var expertIn = user[i].profile.expertIn.filter((interest) => interest != tag);
          user[i].profile.expertIn = expertIn;

          User.findByIdAndUpdate(user[i]._id, {$set: user[i]}, {new: true}).then(() => {}, (e) => {
            res.status(500).send(e);
          });
        }
      }
    }, (e) => {
      res.status(500).send(e);
    })

    Tag.findByIdAndRemove({_id: id}).then((removedTag) => {
      res.status(200).send({removedTag});
    }, (e) => {
      res.status(500).send(e);
    })
  }, (e) => {
    res.status(500).send(e);
  });
}
