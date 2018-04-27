/*

FILENAME: AnnouncementController.js

DESCRIPTION:    This is Controller javascript file for Announcements.
                It contains the logic for retreiving, adding and deleting announcements.
                They are called when a corresponding endpoint receives an HTTP request (GET, POST, DELETE).

FUNCTIONS:
           getAllAnnouncements
           postAnnouncement
           deleteAnnouncement

AUTHOR:     Shadi Barghash
START DATE: 27-March-2018

*/

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

// POST /announcement
module.exports.postAnnouncement = async (req, res) => {   //ADMIN

    try{
      if(!req.body || !req.body.announcement.title || !req.body.announcement )
          res.status(400).send('Announcement title is required');
      if(!req.body.announcement.description)
          res.status(400).send('Announcement description is required');
    }catch(error){
      res.status(400).send("JSON body format is not correct!");
    }

    var announcement = new Announcement(_.pick(req.body.announcement, ['title', 'description']));

    announcement.save().then((announcement) => {
        res.send({
            announcement
        });
    }).catch((err) => {
        res.status(500).send({ error: err });
    });
};

// DELETE /announcement/:id
module.exports.deleteAnnouncement = async (req, res) => {  //ADMIN
  
    Announcement.findByIdAndRemove(req.params.id).then((announcement) => {
        res.send({announcement});
    }).catch((err) => {
        res.status(500).send({ error: err });
    });
};
