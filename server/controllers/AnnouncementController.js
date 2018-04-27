const _ = require('lodash');
const mongoose = require('mongoose');
Announcement = mongoose.model('Announcement');

// GET /announcements
module.exports.getAllAnnouncements = async (req, res) => {

    Announcement.find().then((anns) => {
        res.send({
            announcements: anns
        });
    }).catch((err) => {
        res.status(500).send({ error: err });
    });

};

// POST /announcements
module.exports.postAnnouncement = async (req, res) => {   //ADMIN
  if(req.user.roles.includes('admin')) {
    try{
      if(typeof req.body.announcement.title == 'undefined' || typeof req.body.announcement == 'undefined' || typeof req.body == 'undefined' )
          return res.status(400).send('Announcement title is required');
      if(typeof req.body.announcement.description == 'undefined' || !req.body.announcement.description)
          return res.status(400).send('Announcement description is required');
    }catch(error){
      return res.status(400).send("JSON body format is not correct!");
    }


    var announcement = new Announcement(_.pick(req.body.announcement, ['title', 'description']));

    announcement.save().then((announcement) => {
        return res.send({
            announcement
        });
    }).catch((err) => {
        return res.status(500).send({ error: err });
    });
  }else{
    return res.status(401).send('You are not an admin');
  }
};

// DELETE /announcements/:id
module.exports.deleteAnnouncement = async (req, res) => {  //ADMIN
  if(req.user.roles.includes('admin')) {
    Announcement.findByIdAndRemove(req.params.id).then((announcement) => {
        res.send({announcement});
    }).catch((err) => {
        res.status(500).send({ error: err });
    });
  }else{
    res.status(401).send('You are not an admin');
  }
};
