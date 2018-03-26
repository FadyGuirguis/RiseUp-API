const mongoose = require('mongoose');
const Tag = mongoose.model('Tag');

module.exports.addTag = async(req, res) => {
  var tag = new Tag ({
    tag: req.body.tag.tag
  })

  tag.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(500).send(e);
  })
}

module.exports.getAllTags = async(req, res) => {
  Tag.find().then((tags) => {
    res.send({tags});
  }, (e) => {
    res.status(500).send(e);
  })
}

module.exports.removeTag = async(req, res) => {
  Tag.findByIdAndRemove(req.body.tag._id).then((tag) => {
    res.send({tag});
  }, (e) => {
    res.status(500).send(e);
  })
}
