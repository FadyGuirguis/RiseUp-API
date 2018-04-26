/*H

FILENAME: TagController.js

DESCRIPTION: This is the javascript file for the predefined tag functions.

FUNCTIONS:
           addTag()
           getAllTags()
           removeTag()

AUTHOR: Zeyad Zaky

START DATE: 26 March 2018.

H*/

const mongoose = require('mongoose');
const Tag = mongoose.model('Tag');
const User = mongoose.model('User');

//add a predefined tag by an admin.
module.exports.addTag = async(req, res) => {
    //check if the tag is provided in the request
    if(typeof req.body.tag == 'undefined' || !req.body.tag || !req.body.tag.tag)
      res.status(400).send('Tag is required');

    var tag = new Tag ({
      tag: req.body.tag.tag
    })

    //add the tag to the database
    tag.save().then((tag) => {
      res.status(200).send({tag});
    }, (e) => {
      res.status(500).send(e);
    })
}

//view all the predefined tags.
module.exports.getAllTags = async(req, res) => {
  Tag.find().then((tags) => {
    res.status(200).send({tags});
  }, (e) => {
    res.status(500).send(e);
  })
}

//remove a predefined tag by an admin.
module.exports.removeTag = async(req, res) => {
  var id = req.params.id;

  //check the correctness of the provided tag id
  Tag.find({_id:id}).then((tag) => {
    if(! tag[0]) {
      return res.status(404).send('There is no tag with such id');
    }

    var tag = tag[0].tag;

    //remove the tag from all the users interest and expertIn
    User.find().then((user) => {
      var i;
      for(i = 0; i < user.length; i++) {

        if(user[i].profile.interests.includes(tag)) {
          var interests =
          user[i].profile.interests.filter((interest) => interest != tag);
          user[i].profile.interests = interests;

          User.findByIdAndUpdate(user[i]._id, {$set: user[i]}, {new: true}).
          then(() => {}, (e) => {
            res.status(500).send(e);
          });
        }

        if(user[i].profile.expertIn.includes(tag)) {
          var expertIn =
          user[i].profile.expertIn.filter((interest) => interest != tag);
          user[i].profile.expertIn = expertIn;

          User.findByIdAndUpdate(user[i]._id, {$set: user[i]}, {new: true}).
          then(() => {}, (e) => {
            res.status(500).send(e);
          });
        }
      }
    }, (e) => {
      res.status(500).send(e);
    })

    //remove the tag from the database
    Tag.findByIdAndRemove({_id: id}).then((removedTag) => {
      res.status(200).send({removedTag});
    }, (e) => {
      res.status(500).send(e);
    })
  }, (e) => {
    res.status(500).send(e);
  });
}
