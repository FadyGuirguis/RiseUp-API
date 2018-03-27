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
module.exports.postAnnouncement = async (req, res) => {

    if(!req.body.announcement.title)
        res.status(400).send('Announcement title is required');
    if(!req.body.announcement.description)
        res.status(400).send('Announcement description is required');

    var announcement = new Announcement(_.pick(req.body, ['title', 'description']));

    announcement.save().then(() => {
        res.send({
            announcement
        });
    }).catch((err) => {
        res.status(500).send({ error: err });
    });

};
