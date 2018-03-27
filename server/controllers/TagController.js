const mongoose = require('mongoose');
const Tag = mongoose.model('Tag');

module.exports.addTag = async(req, res) => {
  if(!req.body.tag || !req.body.tag.tag)
      res.status(400).send('Announcement title is required');

  var tag = new Tag ({
    tag: req.body.tag.tag
  })

  tag.save().then((tag) => {
    res.send({tag});
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
